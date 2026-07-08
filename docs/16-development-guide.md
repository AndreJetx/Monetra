# Monetra — Development Guide

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento é o guia prático para desenvolvedores que trabalham no Monetra: setup do ambiente, estrutura do projeto, fluxo de desenvolvimento, convenções e comandos.

---

# Pré-requisitos

| Ferramenta     | Versão mínima                  |
| -------------- | ------------------------------ |
| Node.js        | 20 LTS                         |
| npm            | 10+                            |
| Docker         | 24+                            |
| Docker Compose | 2+                             |
| Git            | 2.40+                          |
| Editor         | VS Code / Cursor (recomendado) |

### Extensões recomendadas (VS Code)

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- GitLens

---

# Setup do Ambiente

## 1. Clonar o repositório

```bash
git clone <repo-url> monetra
cd monetra
```

## 2. Instalar dependências

```bash
npm install
```

O projeto é um **app Next.js único na raiz**. Dependências são instaladas com `npm install` no diretório do repositório.

## 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Editar `.env`:

```bash
DATABASE_URL="postgresql://monetra:monetra@localhost:5432/monetra"
AUTH_SECRET="sua-chave-secreta-aqui"
AUTH_URL="http://localhost:3000"
```

Gerar secret:

```bash
openssl rand -base64 32
```

## 4. Subir banco de dados

```bash
docker compose -f docker/compose.yml up -d
```

Verificar:

```bash
docker compose -f docker/compose.yml ps
```

## 5. Rodar migrations

```bash
npx prisma migrate dev
```

## 6. Seed (opcional)

```bash
npx prisma db seed
```

## 7. Iniciar aplicação

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

# Estrutura do Projeto

```text
monetra/
├── .github/workflows/          # CI (lint, test, build)
├── docker/
│   └── compose.yml             # PostgreSQL
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── scripts/                    # db-reset, setup-check
├── src/
│   ├── app/                    # Rotas (App Router)
│   ├── features/               # Módulos de negócio (DDD)
│   └── shared/                 # Auth, DB, UI, utils
├── tests/
│   ├── e2e/                    # Playwright
│   └── setup/                  # Vitest setup
├── public/
├── docs/                       # Documentação
├── .env.example
└── package.json
```

---

# Estrutura de um Módulo (Feature)

Ao implementar um domínio, criar em `src/features/<domain>/`:

```text
features/financial/
├── application/
│   ├── use-cases/                # Casos de uso
│   └── dto/                      # Data Transfer Objects
├── domain/
│   ├── entities/                 # Entidades de negócio
│   ├── value-objects/            # Value Objects
│   ├── events/                   # Eventos de domínio
│   ├── repositories/             # Interfaces
│   └── errors/                   # Erros de domínio
├── infrastructure/
│   ├── repositories/             # Implementações Prisma
│   └── mappers/                  # Prisma ↔ Domain
├── presentation/
│   ├── components/               # React components
│   ├── hooks/                    # Custom hooks
│   └── actions/                  # Server Actions
├── shared/
│   ├── schemas/                  # Zod schemas
│   └── constants/                # Constantes do módulo
└── tests/
    ├── *.test.ts                 # Unitários
    └── *.integration.test.ts     # Integração
```

---

# Fluxo de Desenvolvimento

Toda funcionalidade segue esta ordem:

```text
Epic → Feature → User Story → Use Case → Implementação → Testes → Documentação
```

## Passo a passo

### 1. Selecionar User Story

Consultar [backlog/03-product-backlog.md](backlog/03-product-backlog.md) e selecionar a próxima story por prioridade (RICE).

### 2. Criar branch

```bash
git checkout -b feature/US-FIN-001-cadastrar-receita
```

**Convenção:** `feature/<story-id>-<descricao-curta>`

### 3. Implementar domínio

Começar pelo **domínio** (entidades e regras):

```typescript
// features/financial/domain/entities/Revenue.ts
export class Revenue {
  private constructor(private props: RevenueProps) {}

  static create(props: CreateRevenueProps): Revenue {
    // validações de negócio (RN-FIN-*)
    return new Revenue({ ...props, status: "PENDING" });
  }

  confirmReceipt(date: Date): void {
    if (this.props.status !== "PENDING") {
      throw new InvalidRevenueStatusError();
    }
    this.props.status = "RECEIVED";
    this.props.receivedAt = date;
  }
}
```

### 4. Implementar use case

```typescript
// features/financial/application/use-cases/CreateRevenueUseCase.ts
export class CreateRevenueUseCase {
  constructor(private revenueRepo: RevenueRepository) {}

  async execute(dto: CreateRevenueDTO, ctx: AuthContext) {
    authorizeOrThrow(ctx.role, "revenue:create");
    const revenue = Revenue.create({ ...dto, organizationId: ctx.organizationId });
    return this.revenueRepo.save(revenue);
  }
}
```

### 5. Implementar infraestrutura

```typescript
// features/financial/infrastructure/repositories/PrismaRevenueRepository.ts
export class PrismaRevenueRepository implements RevenueRepository {
  async save(revenue: Revenue): Promise<Revenue> {
    const data = RevenueMapper.toPrisma(revenue);
    const created = await prisma.revenue.create({ data });
    return RevenueMapper.toDomain(created);
  }
}
```

### 6. Implementar presentation

```typescript
// features/financial/presentation/actions/revenue.actions.ts
"use server";

export async function createRevenueAction(input: unknown) {
  const session = await auth();
  if (!session) return { success: false, error: "Não autenticado" };

  const parsed = CreateRevenueSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Dados inválidos", fieldErrors: ... };

  const useCase = new CreateRevenueUseCase(new PrismaRevenueRepository());
  const revenue = await useCase.execute(parsed.data, session);
  return { success: true, data: revenue };
}
```

### 7. Escrever testes

```bash
npm run test -- features/financial/tests/
```

### 8. Atualizar documentação

Se a story altera regras, API ou schema, atualizar o doc correspondente.

### 9. Pull Request

```bash
git add .
git commit -m "feat(financial): implement US-FIN-001 create revenue"
git push -u origin feature/US-FIN-001-cadastrar-receita
```

---

# Comandos Úteis

## Desenvolvimento

| Comando                | Descrição                |
| ---------------------- | ------------------------ |
| `npm run dev`          | Inicia app (Turbopack)   |
| `npm run build`        | Build de produção        |
| `npm run start`        | Inicia build de produção |
| `npm run lint`         | ESLint em `src/`         |
| `npm run format`       | Prettier (write)         |
| `npm run format:check` | Prettier (check)         |
| `npm run setup:check`  | Valida ambiente local    |

## Banco de dados

| Comando               | Descrição                       |
| --------------------- | ------------------------------- |
| `npm run db:migrate`  | Cria e aplica migration (dev)   |
| `npm run db:seed`     | Popula banco com dados de teste |
| `npm run db:studio`   | Interface visual do banco       |
| `npm run db:generate` | Regenera Prisma Client          |
| `npm run db:reset`    | Reset do banco (dev only)       |

## Testes

| Comando              | Descrição                 |
| -------------------- | ------------------------- |
| `npm run test`       | Testes unitários (Vitest) |
| `npm run test:watch` | Vitest em modo watch      |
| `npm run test:e2e`   | Testes E2E (Playwright)   |

## Docker

| Comando                                        | Descrição       |
| ---------------------------------------------- | --------------- |
| `docker compose -f docker/compose.yml up -d`   | Sobe PostgreSQL |
| `docker compose -f docker/compose.yml down`    | Para containers |
| `docker compose -f docker/compose.yml logs -f` | Logs do banco   |

---

# Convenções de Código

## TypeScript

- `strict: true` — sem exceções.
- Proibido `any` — usar `unknown` + type guards.
- Preferir `interface` para contratos, `type` para unions.
- Export nomeado (evitar default exports, exceto pages).

## Nomenclatura

| Tipo          | Padrão               | Exemplo                   |
| ------------- | -------------------- | ------------------------- |
| Componente    | PascalCase           | `RevenueForm.tsx`         |
| Hook          | camelCase + use      | `useRevenues.ts`          |
| Use Case      | PascalCase + UseCase | `CreateRevenueUseCase.ts` |
| Server Action | camelCase + Action   | `createRevenueAction`     |
| Schema Zod    | PascalCase + Schema  | `CreateRevenueSchema.ts`  |
| Teste         | `*.test.ts`          | `Revenue.test.ts`         |

## Imports

```typescript
// Ordem: externos → shared → features → relativos
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { authorize } from "@/features/identity/application/authorize";
import { RevenueMapper } from "../mappers/RevenueMapper";
```

## Commits (Conventional Commits)

```text
feat(financial): add create revenue use case
fix(auth): handle expired session redirect
docs: update API specification
test(financial): add revenue status transition tests
refactor(crm): extract customer validation to domain
chore: update dependencies
```

---

# Regras Obrigatórias

1. **Nunca** acessar Prisma fora de `infrastructure/`.
2. **Nunca** colocar regra de negócio em componentes ou Server Actions.
3. **Sempre** validar entrada com Zod.
4. **Sempre** verificar RBAC no use case.
5. **Sempre** filtrar por `organizationId`.
6. **Sempre** escrever testes para use cases e entidades.
7. **Nunca** implementar sem User Story no backlog.

---

# ADRs (Decisões Arquiteturais)

Antes de tomar decisões técnicas, consultar:

| ADR                                                  | Decisão                    |
| ---------------------------------------------------- | -------------------------- |
| [ADR-001](adr/ADR-001-feature-based-architecture.md) | Feature-Based Architecture |
| [ADR-002](adr/ADR-002-postgresql.md)                 | PostgreSQL 16              |
| [ADR-003](adr/ADR-003-prisma.md)                     | Prisma na infraestrutura   |
| [ADR-004](adr/ADR-004-authjs.md)                     | Auth.js                    |
| [ADR-005](adr/ADR-005-server-actions.md)             | Server Actions             |
| [ADR-006](adr/ADR-006-rbac.md)                       | RBAC                       |

Nova decisão arquitetural → criar ADR em `docs/adr/`.

---

# Documentação de Referência

| Documento                                                  | Quando consultar                 |
| ---------------------------------------------------------- | -------------------------------- |
| [03-domain-model.md](03-domain-model.md)                   | Modelar entidades e casos de uso |
| [06-business-rules.md](06-business-rules.md)               | Implementar validações           |
| [08-software-architecture.md](08-software-architecture.md) | Estrutura de código              |
| [09-database-design.md](09-database-design.md)             | Schema e migrations              |
| [10-api-specification.md](10-api-specification.md)         | Endpoints e actions              |
| [11-design-system.md](11-design-system.md)                 | Componentes e UI                 |
| [12-security.md](12-security.md)                           | Auth e permissões                |
| [13-testing.md](13-testing.md)                             | Estratégia de testes             |
| [14-deployment.md](14-deployment.md)                       | Deploy e CI/CD                   |
| [15-roadmap.md](15-roadmap.md)                             | Priorização de trabalho          |

---

# Troubleshooting

## Erro de conexão com PostgreSQL

```bash
docker compose -f docker/compose.yml ps
docker compose -f docker/compose.yml up -d
docker compose -f docker/compose.yml logs postgres
```

## Prisma Client desatualizado

```bash
npx prisma generate
```

## Porta 3000 em uso

```bash
npx kill-port 3000
# ou
npm run dev -- --port 3001
```

## Migrations conflitantes

```bash
npx prisma migrate reset   # CUIDADO: apaga dados locais
npx prisma migrate dev
```

---

# Referências

- [00-project-context.md](00-project-context.md)
- [08-software-architecture.md](08-software-architecture.md)
- [README.md](../README.md)
- [README-ARCHITECTURE.md](../README-ARCHITECTURE.md)
