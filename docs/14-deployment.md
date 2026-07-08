# Monetra — Deployment

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento define a estratégia de deploy do Monetra: ambientes, infraestrutura, pipeline CI/CD, configuração e procedimentos operacionais.

---

# Ambientes

```text
Local → Development → Staging → Production
```

| Ambiente        | Propósito                  | URL                   | Banco               |
| --------------- | -------------------------- | --------------------- | ------------------- |
| **Local**       | Desenvolvimento individual | `localhost:3000`      | Docker PostgreSQL   |
| **Development** | Integração contínua        | `dev.monetra.app`     | PostgreSQL dedicado |
| **Staging**     | Homologação / QA           | `staging.monetra.app` | PostgreSQL dedicado |
| **Production**  | Usuários finais            | `app.monetra.app`     | PostgreSQL dedicado |

## Regras por ambiente

| Regra         | Local | Dev | Staging | Production |
| ------------- | :---: | :-: | :-----: | :--------: |
| Dados reais   |  ❌   | ❌  |   ❌    |     ✅     |
| HTTPS         |  ❌   | ✅  |   ✅    |     ✅     |
| Seed de teste |  ✅   | ✅  |   ✅    |     ❌     |
| Debug logs    |  ✅   | ✅  |   ❌    |     ❌     |
| Rate limiting |  ❌   | ❌  |   ✅    |     ✅     |

---

# Infraestrutura

## Stack de produção

| Componente      | Tecnologia                           |
| --------------- | ------------------------------------ |
| Servidor        | VPS Linux (Ubuntu 24.04)             |
| Runtime         | Node.js 20 LTS                       |
| App             | Next.js (standalone output)          |
| Banco           | PostgreSQL 16                        |
| Proxy reverso   | Nginx ou Caddy                       |
| SSL             | Let's Encrypt (Certbot / Caddy auto) |
| CI/CD           | GitHub Actions                       |
| Containerização | Docker (banco) + PM2 ou Docker (app) |

## Arquitetura de deploy

```text
Internet
    │
    ▼
[Nginx/Caddy] ── SSL termination
    │
    ▼
[Next.js App] ── port 3000
    │
    ▼
[PostgreSQL] ── port 5432 (rede interna)
```

---

# Desenvolvimento Local

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- npm 10+

## Setup

```bash
# Clonar e instalar
git clone <repo-url> monetra
cd monetra
npm install

# Subir banco de dados
docker compose up -d

# Configurar variáveis
cp apps/web/.env.example apps/web/.env

# Rodar migrations
npx prisma migrate dev

# Seed (opcional)
npx prisma db seed

# Iniciar app
npm run dev
```

## Docker Compose (desenvolvimento)

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: monetra
      POSTGRES_PASSWORD: monetra
      POSTGRES_DB: monetra
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

# Variáveis de Ambiente

## `.env.example`

```bash
# Database
DATABASE_URL="postgresql://monetra:monetra@localhost:5432/monetra"

# Auth.js
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
```

## Produção

| Variável       | Descrição                 |
| -------------- | ------------------------- |
| `DATABASE_URL` | Connection string com SSL |
| `AUTH_SECRET`  | Secret forte (32+ chars)  |
| `AUTH_URL`     | `https://app.monetra.app` |
| `NODE_ENV`     | `production`              |

**Regras:**

- Secrets gerenciados via GitHub Secrets (CI) ou `.env` no servidor.
- Nunca commitar `.env`.
- Valores diferentes por ambiente.

---

# Build

## Monorepo

```bash
# Build da aplicação web
npm run build

# Output: apps/web/.next/
```

## Next.js Standalone (produção)

```typescript
// apps/web/next.config.ts
const nextConfig = {
  output: "standalone",
  // ...
};
```

Gera pacote mínimo em `.next/standalone/` para deploy sem `node_modules` completo.

---

# Pipeline CI/CD (GitHub Actions)

## Workflow: CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: monetra_test
          POSTGRES_USER: monetra
          POSTGRES_PASSWORD: monetra
        ports:
          - 5432:5432
    env:
      DATABASE_URL: postgresql://monetra:monetra@localhost:5432/monetra_test
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm run test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

## Workflow: Deploy

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - name: Deploy to staging
        run: |
          # SSH + rsync ou Docker deploy
          echo "Deploy to staging"

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          echo "Deploy to production"
```

## Fluxo

```text
Push → Lint → Test → Build → Deploy Staging → Deploy Production
```

---

# Deploy em VPS

## Opção A — PM2

```bash
# No servidor
git pull origin main
npm ci
npm run build
npx prisma migrate deploy
pm2 restart monetra
```

## Opção B — Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

## Nginx (proxy reverso)

```nginx
server {
    listen 443 ssl http2;
    server_name app.monetra.app;

    ssl_certificate /etc/letsencrypt/live/app.monetra.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.monetra.app/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

# Migrations em Produção

```bash
# Sempre antes de restart da app
npx prisma migrate deploy
```

**Regras:**

- Migrations testadas em staging antes de production.
- Migrations são forward-only (sem rollback de schema).
- Backup do banco antes de migrations destrutivas.

---

# Health Checks

## Endpoint

```
GET /api/v1/health
```

**Resposta:**

```json
{
  "status": "ok",
  "timestamp": "2026-07-07T14:00:00Z",
  "services": {
    "database": "ok",
    "app": "ok"
  }
}
```

## Monitoramento

- Uptime check a cada 60s (UptimeRobot, Better Stack).
- Alerta se health check falhar 3 vezes consecutivas.
- Logs de erro enviados para serviço de monitoramento (V2).

---

# Backup

| Item                 | Frequência | Retenção |
| -------------------- | ---------- | -------- |
| PostgreSQL (pg_dump) | Diário     | 30 dias  |
| Uploads/anexos (V1)  | Diário     | 30 dias  |

```bash
# Backup manual
pg_dump -U monetra -d monetra > backup_$(date +%Y%m%d).sql
```

---

# Rollback

## Aplicação

1. Reverter para commit anterior: `git checkout <tag>`.
2. Rebuild e restart: `npm run build && pm2 restart monetra`.
3. Se migration foi aplicada, avaliar migration reversa manual.

## Banco

- Restaurar backup: `psql -U monetra -d monetra < backup.sql`.
- Migrations não possuem rollback automático.

---

# Checklist de Deploy MVP

- [ ] Variáveis de ambiente configuradas
- [ ] PostgreSQL rodando com SSL
- [ ] Migrations aplicadas (`prisma migrate deploy`)
- [ ] Build sem erros (`npm run build`)
- [ ] Health check respondendo 200
- [ ] HTTPS configurado
- [ ] Headers de segurança ativos
- [ ] Backup automático configurado
- [ ] Monitoramento de uptime ativo
- [ ] Testes E2E passando em staging

---

# Referências

- [08-software-architecture.md](08-software-architecture.md)
- [12-security.md](12-security.md)
- [13-testing.md](13-testing.md)
- [16-development-guide.md](16-development-guide.md)
- [docker-compose.yml](../docker-compose.yml)
