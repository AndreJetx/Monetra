# Monetra

> **Gestão financeira inteligente para pequenos negócios.**

Plataforma SaaS de gestão financeira para micro e pequenas empresas.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Prisma + PostgreSQL
- Auth.js v5
- Vitest + Playwright

## Estrutura

```text
monetra/
├── .github/workflows/   # CI
├── docker/              # PostgreSQL (compose)
├── docs/                # Documentação do produto (00–16)
├── prisma/              # Schema, migrations, seed
├── scripts/             # Utilitários (db-reset, setup-check)
├── src/
│   ├── app/             # App Router
│   ├── features/        # Módulos por domínio (DDD)
│   └── shared/          # Auth, DB, UI, utils
├── tests/               # Vitest + Playwright
└── public/
```

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Subir banco de dados
docker compose -f docker/compose.yml up -d

# Migrations e seed
npm run db:migrate
npm run db:seed

# Iniciar aplicação
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Scripts úteis

| Comando               | Descrição             |
| --------------------- | --------------------- |
| `npm run lint`        | ESLint                |
| `npm run format`      | Prettier              |
| `npm run test`        | Vitest                |
| `npm run test:e2e`    | Playwright            |
| `npm run build`       | Build de produção     |
| `npm run setup:check` | Valida ambiente local |
| `npm run db:reset`    | Reset do banco (dev)  |

## Documentação

Consulte a pasta `docs/` para a documentação completa do produto (00–16).

Para começar a desenvolver, veja [docs/16-development-guide.md](docs/16-development-guide.md).
