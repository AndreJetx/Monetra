# Monetra — Software Architecture

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento define a arquitetura de software do Monetra: camadas, organização de código, fluxos de requisição, comunicação entre domínios, convenções e anti-padrões.

Complementa o [README-ARCHITECTURE.md](../README-ARCHITECTURE.md) como documento oficial em `/docs`.

---

# Visão Geral

Monetra é um SaaS de gestão financeira para micro e pequenas empresas, construído com arquitetura modular inspirada em Domain-Driven Design (DDD), organizada por domínios de negócio (Feature-Based Architecture).

## Princípios

- Modularidade
- Alta coesão, baixo acoplamento
- Separação de responsabilidades
- Domínio independente de frameworks
- Escalabilidade e testabilidade

## Stack

| Camada    | Tecnologia                                                     |
| --------- | -------------------------------------------------------------- |
| Front-end | Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui |
| Back-end  | Server Actions, Route Handlers, Prisma ORM                     |
| Banco     | PostgreSQL 16                                                  |
| Auth      | Auth.js                                                        |
| Testes    | Vitest, Playwright                                             |
| Infra     | Docker, GitHub Actions, VPS                                    |

---

# Arquitetura em Camadas

```text
                   Browser
                      │
                      ▼
          Next.js App Router
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
     Server Actions          Route Handlers
          │                       │
          └───────────┬───────────┘
                      ▼
              Application Layer    ← Casos de uso
                      ▼
                Domain Layer       ← Regras de negócio
                      ▼
           Repository Interfaces
                      ▼
          Infrastructure Layer     ← Prisma, APIs externas
                      ▼
                 PostgreSQL
```

## Presentation

Responsável por interface com o usuário.

**Contém:** pages, layouts, componentes React, formulários, hooks de UI, estados locais.

**Não contém:** regras de negócio, acesso a banco, lógica de autorização complexa.

## Application

Coordena casos de uso e orquestra fluxos.

**Contém:** use cases (`CreateRevenueUseCase`), DTOs de entrada/saída, serviços de aplicação.

**Responsabilidades:**

- Validar permissões (RBAC)
- Invocar entidades de domínio
- Chamar repositórios via interfaces
- Disparar eventos de domínio

## Domain

Núcleo do sistema — independente de frameworks.

**Contém:** entidades, value objects, eventos, interfaces de repositórios, regras de negócio.

**Exemplo:** `Revenue.confirmReceipt()` valida transição de status conforme RN-FIN-001.

## Infrastructure

Implementações concretas de persistência e integrações.

**Contém:** repositórios Prisma, adapters Auth.js, serviços de e-mail, file storage.

**Regra:** Prisma **somente** nesta camada (ADR-003).

## Shared (por módulo)

Recursos compartilhados **dentro** de um domínio.

**Contém:** schemas Zod, types, constantes, helpers do módulo.

---

# Organização do Monorepo

```text
monetra/
├── apps/
│   └── web/                    # Aplicação Next.js
│       ├── src/
│       │   ├── app/            # Rotas (App Router)
│       │   ├── features/       # Módulos de negócio
│       │   └── shared/         # Utilitários globais
│       ├── public/
│       └── package.json
├── packages/
│   ├── ui/                     # Componentes compartilhados
│   ├── shared/                 # Types e utils globais
│   ├── eslint-config/
│   └── typescript-config/
├── prisma/
│   └── schema.prisma
├── docs/
└── docker-compose.yml
```

---

# Estrutura de um Módulo (Feature)

Cada domínio em `apps/web/src/features/<domain>/`:

```text
features/financial/
├── application/
│   ├── use-cases/
│   │   ├── CreateRevenueUseCase.ts
│   │   ├── ConfirmRevenueReceiptUseCase.ts
│   │   └── ListRevenuesUseCase.ts
│   └── dto/
│       ├── CreateRevenueDTO.ts
│       └── RevenueResponseDTO.ts
├── domain/
│   ├── entities/
│   │   └── Revenue.ts
│   ├── value-objects/
│   │   └── Money.ts
│   ├── events/
│   │   └── RevenueReceivedEvent.ts
│   ├── repositories/
│   │   └── RevenueRepository.ts      # Interface
│   └── errors/
│       └── InvalidRevenueStatusError.ts
├── infrastructure/
│   ├── repositories/
│   │   └── PrismaRevenueRepository.ts
│   └── mappers/
│       └── RevenueMapper.ts
├── presentation/
│   ├── components/
│   │   ├── RevenueForm.tsx
│   │   └── RevenueList.tsx
│   ├── hooks/
│   │   └── useRevenues.ts
│   └── actions/
│       └── revenue.actions.ts          # Server Actions
├── shared/
│   ├── schemas/
│   │   └── CreateRevenueSchema.ts
│   └── constants/
│       └── revenue-status.ts
└── tests/
    ├── CreateRevenueUseCase.test.ts
    └── Revenue.test.ts
```

---

# Domínios do Sistema

```text
Identity ──► Organization ──┬──► Financial ──┬──► Analytics
                            └──► CRM ─────────┘
Settings (transversal)
Platform (transversal)
```

| Domínio      | Responsabilidade                   | Dependências           |
| ------------ | ---------------------------------- | ---------------------- |
| Identity     | Auth, sessões, RBAC                | —                      |
| Organization | Empresas, membros, multi-tenant    | Identity               |
| Financial    | Receitas, despesas, fluxo de caixa | Organization           |
| CRM          | Clientes, fornecedores             | Organization           |
| Analytics    | Dashboard, relatórios (read-only)  | Financial, CRM         |
| Settings     | Preferências usuário/empresa       | Identity, Organization |
| Platform     | Auditoria, notificações, jobs      | Todos                  |

## Regras de comunicação

- **Nunca** importar diretamente de outro domínio.
- Comunicação via **contratos** (interfaces em `packages/shared` ou eventos).
- Analytics **somente lê** dados; nunca muta.
- Platform **observa** eventos dos demais domínios.

---

# Fluxo de Requisição

## Server Action (mutação interna)

Exemplo: criar receita.

```text
RevenueForm (presentation)
      │
      ▼
createRevenueAction (presentation/actions)
      │  validação Zod
      │  verificação de sessão
      ▼
CreateRevenueUseCase (application)
      │  authorize(user, org, 'revenue:create')
      │  Revenue.create(dto)
      ▼
RevenueRepository.save (infrastructure)
      │
      ▼
Prisma → PostgreSQL
```

## Route Handler (API REST)

Exemplo: `GET /api/v1/revenues`

```text
Route Handler (app/api/v1/revenues/route.ts)
      │  autenticação
      │  validação query params
      ▼
ListRevenuesUseCase (application)
      ▼
RevenueRepository.findAll (infrastructure)
      ▼
JSON Response
```

---

# Padrão ActionResult

Server Actions retornam tipo padronizado:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

---

# Convenções de Nomenclatura

| Tipo                    | Padrão                  | Exemplo                        |
| ----------------------- | ----------------------- | ------------------------------ |
| Componente              | PascalCase              | `RevenueForm.tsx`              |
| Hook                    | camelCase com `use`     | `useRevenues.ts`               |
| Use Case                | PascalCase + UseCase    | `CreateRevenueUseCase.ts`      |
| Repositório (interface) | PascalCase + Repository | `RevenueRepository.ts`         |
| Repositório (impl)      | Prisma + Repository     | `PrismaRevenueRepository.ts`   |
| DTO                     | PascalCase + DTO        | `CreateRevenueDTO.ts`          |
| Schema Zod              | PascalCase + Schema     | `CreateRevenueSchema.ts`       |
| Server Action           | camelCase + Action      | `createRevenueAction`          |
| Entidade                | PascalCase              | `Revenue.ts`                   |
| Value Object            | PascalCase              | `Money.ts`                     |
| Evento                  | PascalCase + Event      | `RevenueReceivedEvent.ts`      |
| Erro de domínio         | PascalCase + Error      | `InvalidRevenueStatusError.ts` |

---

# Middleware

`apps/web/src/middleware.ts`:

- Verifica autenticação em rotas `(app)`.
- Redireciona não autenticados para `/login`.
- Injeta headers de contexto (opcional).
- **Não** faz autorização RBAC (responsabilidade dos use cases).

---

# Multi-tenancy

- `organizationId` presente na sessão após seleção de empresa.
- Todos os use cases recebem `organizationId` como parâmetro.
- Repositórios filtram por `organizationId` em **toda** query.
- Nunca confiar em `organizationId` vindo do client sem validar membership.

---

# Eventos de Domínio (futuro)

```typescript
// Exemplo de contrato
interface DomainEvent {
  type: string;
  payload: unknown;
  occurredAt: Date;
  organizationId: string;
}

// Consumidores
// Analytics → atualiza cache de KPIs
// Platform → registra auditoria
```

Implementação inicial: chamadas diretas nos use cases. Event bus em V2.

---

# Anti-padrões (proibidos)

| Anti-padrão                       | Motivo                         | Alternativa               |
| --------------------------------- | ------------------------------ | ------------------------- |
| Prisma em componentes             | Acoplamento, sem testabilidade | Use case + repository     |
| Prisma em use cases               | Viola camadas                  | Interface de repositório  |
| Regra de negócio em Server Action | Duplicação, sem teste unitário | Entidade de domínio       |
| Import cross-domain direto        | Acoplamento                    | Contrato ou evento        |
| Componente > 300 linhas           | Difícil manutenção             | Dividir em subcomponentes |
| `any` no TypeScript               | Perde type-safety              | Tipos explícitos          |
| Saldo armazenado como campo       | Inconsistência                 | Calcular de movimentações |
| RBAC apenas na UI                 | Bypass via API                 | Validar no use case       |

---

# Decisões Arquiteturais (ADRs)

| ADR                                                  | Decisão                          |
| ---------------------------------------------------- | -------------------------------- |
| [ADR-001](adr/ADR-001-feature-based-architecture.md) | Feature-Based Architecture       |
| [ADR-002](adr/ADR-002-postgresql.md)                 | PostgreSQL 16                    |
| [ADR-003](adr/ADR-003-prisma.md)                     | Prisma restrito à infraestrutura |
| [ADR-004](adr/ADR-004-authjs.md)                     | Auth.js para autenticação        |
| [ADR-005](adr/ADR-005-server-actions.md)             | Server Actions para mutações     |
| [ADR-006](adr/ADR-006-rbac.md)                       | RBAC com 4 papéis                |

---

# Evolução da Arquitetura

A arquitetura suporta futuras expansões sem reestruturação significativa:

- API pública (Route Handlers em `/api/v1/`)
- Webhooks e background jobs (Platform)
- Open Finance (integração em Infrastructure)
- App mobile (consome mesma API)
- Event bus para desacoplamento
- Cache layer (Redis) para Analytics

---

# Filosofia

> Esta solução continuaria adequada se o sistema tivesse milhares de usuários, múltiplas empresas e uma equipe mantendo o código por vários anos?

Se a resposta for **não**, a implementação deve ser reavaliada.

---

# Referências

- [README-ARCHITECTURE.md](../README-ARCHITECTURE.md)
- [00-project-context.md](00-project-context.md)
- [03-domain-model.md](03-domain-model.md)
- [06-business-rules.md](06-business-rules.md)
- [09-database-design.md](09-database-design.md)
- [10-api-specification.md](10-api-specification.md)
- [16-development-guide.md](16-development-guide.md)
