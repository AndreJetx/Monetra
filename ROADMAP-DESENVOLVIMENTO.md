# Monetra — Roadmap de Desenvolvimento

> Guia passo a passo para implementar o produto completo seguindo a documentação em `docs/`.
>
> **Última atualização:** 08/07/2026

---

## Objetivo deste documento

Este arquivo consolida **o que implementar, em qual ordem e como**, alinhado a:

- [docs/backlog/](docs/backlog/) — épicos, features, user stories e priorização
- [docs/06-business-rules.md](docs/06-business-rules.md) — regras de negócio (RN-*)
- [docs/08-software-architecture.md](docs/08-software-architecture.md) — arquitetura DDD
- [docs/09-database-design.md](docs/09-database-design.md) — schema e migrations
- [docs/10-api-specification.md](docs/10-api-specification.md) — Server Actions e rotas
- [docs/12-security.md](docs/12-security.md) — auth, RBAC e multi-tenancy
- [docs/13-testing.md](docs/13-testing.md) — estratégia de testes
- [docs/16-development-guide.md](docs/16-development-guide.md) — setup e convenções

Use este roadmap como **checklist de execução**. Para detalhes de cada story, consulte [docs/backlog/03-product-backlog.md](docs/backlog/03-product-backlog.md).

---

## Hierarquia de trabalho

```text
Product Backlog
└── Epic (EP-00X)
      └── Feature (FT-XXX-00X)
            └── User Story (US-XXX-00X)
                  └── Use Case
                        └── Implementação (domain → application → infrastructure → presentation)
                              └── Testes + Documentação
```

**Regra:** nenhuma implementação começa sem User Story definida no backlog.

---

## Estado atual do projeto

### Fase 0 — Base técnica (concluída)

- [x] App Next.js único na raiz (`src/`, `prisma/`, `docker/`, `tests/`)
- [x] Prisma + PostgreSQL + Auth.js v5
- [x] shadcn/ui, Vitest, Playwright, Husky, CI
- [x] Rotas skeleton: `/login`, `/register`, `/dashboard`
- [x] Health check: `/api/v1/health`

### Fase 1 — Identity & Organization (parcial)

| Story                           | Status    | Observação                                                                  |
| ------------------------------- | --------- | --------------------------------------------------------------------------- |
| US-IDENTITY-001 Cadastro        | Concluída | DDD com `RegisterUserUseCase`                                               |
| US-IDENTITY-002 Login           | Concluída | Auth.js + `AuthenticateUserUseCase`                                         |
| US-IDENTITY-005 Logout          | Concluída | `logoutAction`                                                              |
| US-ORG-001 Criar empresa        | Concluída | Provisionamento no cadastro (OWNER)                                         |
| US-ORG-003 Trocar empresa ativa | Concluída | `switchOrganizationAction` + switcher                                       |
| US-IDENTITY-003 Recuperar senha | Concluída | Token 24h uso único, páginas `/forgot-password` e `/reset-password/[token]` |
| US-IDENTITY-006 RBAC            | Concluída | Matriz de permissões, `role` na sessão e UI adaptativa                      |
| US-FIN-008 Gerenciar categorias | Concluída | Schema Prisma, categorias padrão e página `/categories` com RBAC            |

---

## Setup inicial (uma vez)

```bash
# 1. Dependências
npm install

# 2. Ambiente
cp .env.example .env
# Preencher AUTH_SECRET (openssl rand -base64 32)

# 3. Banco
docker compose -f docker/compose.yml up -d
npm run db:migrate
npm run db:seed

# 4. Validar ambiente
npm run setup:check

# 5. Desenvolvimento
npm run dev
```

Credenciais de seed: `owner@monetra.dev` / `Monetra@123`

---

## Fluxo padrão por User Story

Repita este ciclo para **cada** story:

### 1. Selecionar story

1. Consultar ordem RICE em [docs/backlog/05-prioritization.md](docs/backlog/05-prioritization.md)
2. Verificar dependências entre épicos (Identity → Organization → Financial → CRM → Analytics)
3. Ler critérios de aceitação em [docs/backlog/03-product-backlog.md](docs/backlog/03-product-backlog.md)
4. Ler regras de negócio em [docs/06-business-rules.md](docs/06-business-rules.md)

### 2. Criar branch

```bash
git checkout -b feature/US-FIN-001-cadastrar-receita
```

### 3. Modelar domínio (`domain/`)

- Entidades e Value Objects
- Interfaces de repositório (`I*Repository.ts`)
- Erros de domínio
- Regras RN-* encapsuladas (sem Prisma, sem React)

### 4. Implementar caso de uso (`application/`)

- `*UseCase.ts` com orquestração
- DTOs de entrada/saída
- `authorizeOrThrow()` quando aplicável (RBAC)
- Sempre filtrar por `organizationId` da sessão

### 5. Implementar infraestrutura (`infrastructure/`)

- Repositórios Prisma
- Mappers Prisma ↔ domínio
- Gateways externos (e-mail, storage, etc.)
- `factories.ts` como composition root

### 6. Implementar apresentação (`presentation/`)

- Server Actions (padrão ADR-005)
- Componentes React / formulários
- Schemas Zod em `shared/schemas/`

### 7. Banco de dados (quando necessário)

1. Atualizar `prisma/schema.prisma` conforme [docs/09-database-design.md](docs/09-database-design.md)
2. `npm run db:migrate`
3. Atualizar seed se necessário

### 8. Testes

| Tipo                              | Onde                           | Comando            |
| --------------------------------- | ------------------------------ | ------------------ |
| Unitário (use case, entidade, VO) | `src/features/<domain>/tests/` | `npm run test`     |
| E2E (fluxo crítico)               | `tests/e2e/`                   | `npm run test:e2e` |

### 9. Validação antes de PR

```bash
npm run lint
npm run format:check
npm run test
npm run build
```

### 10. Documentação

Atualizar o doc correspondente quando a story alterar:

- Regras → `docs/06-business-rules.md`
- API/Actions → `docs/10-api-specification.md`
- Schema → `docs/09-database-design.md`

### 11. Commit e PR

```bash
git commit -m "feat(financial): implement US-FIN-001 create revenue"
```

Formato: [Conventional Commits](https://www.conventionalcommits.org/) — `feat(domain): descrição`.

---

## Arquitetura obrigatória

```text
src/features/<domain>/
├── application/     # Use cases, DTOs, ports
├── domain/          # Entidades, VOs, regras, interfaces
├── infrastructure/  # Prisma, mappers, adapters
├── presentation/    # Actions, components, hooks
├── shared/          # Schemas Zod, constantes
└── tests/           # Testes do domínio
```

### Regras inegociáveis

1. **Prisma somente em `infrastructure/`** (ADR-003)
2. **Regra de negócio somente em `domain/` e `application/`**
3. **Server Actions não contêm lógica de negócio** — delegam ao use case
4. **Toda entrada validada com Zod**
5. **RBAC verificado no use case** (ADR-006)
6. **Multi-tenancy:** `organizationId` vem da sessão, nunca do client (RN-GLOBAL-001)
7. **Nunca importar diretamente de outro domínio** — usar contratos/ports

### ADRs de referência

| ADR                                                       | Decisão                    |
| --------------------------------------------------------- | -------------------------- |
| [ADR-001](docs/adr/ADR-001-feature-based-architecture.md) | Feature-Based Architecture |
| [ADR-002](docs/adr/ADR-002-postgresql.md)                 | PostgreSQL 16              |
| [ADR-003](docs/adr/ADR-003-prisma.md)                     | Prisma na infraestrutura   |
| [ADR-004](docs/adr/ADR-004-authjs.md)                     | Auth.js                    |
| [ADR-005](docs/adr/ADR-005-server-actions.md)             | Server Actions             |
| [ADR-006](docs/adr/ADR-006-rbac.md)                       | RBAC                       |

---

## MVP — Ordem de implementação (18 stories P0)

Estimativa total: **8–10 semanas** ([docs/backlog/04-release-plan.md](docs/backlog/04-release-plan.md))

### Marco M1 — Auth + Organization (semanas 1–3)

#### Passo 1 — US-IDENTITY-006 RBAC (concluído)

**Por que agora:** Financial, CRM e Analytics dependem de permissões por papel.

**Entregáveis:**

- [x] `src/features/identity/application/authorize.ts`
- [x] Matriz de permissões conforme [docs/12-security.md](docs/12-security.md)
- [x] `authorizeOrThrow(role, permission)` disponível para os use cases
- [x] Testes unitários da matriz RBAC
- [x] UI oculta ações não permitidas (UX; backend sempre valida)

**Docs:** RN-GLOBAL-002, ADR-006

---

#### Passo 2 — US-IDENTITY-003 Recuperar senha (concluído)

**Entregáveis:**

- [x] Tabela/fluxo `VerificationToken` (já no schema Auth.js)
- [x] `ForgotPasswordUseCase` + `ResetPasswordUseCase`
- [x] Páginas `/forgot-password` e `/reset-password/[token]`
- [x] Envio de e-mail (`ConsolePasswordResetMailer` em dev; SMTP real em V1)
- [x] Token 24h, uso único, resposta genérica (RN-IDENTITY-004)

**Docs:** RN-IDENTITY-004, `docs/10-api-specification.md` (forgotPasswordAction, resetPasswordAction)

---

### Marco M2 — Financial core (semanas 3–6)

Antes de receitas/despesas, implementar **categorias** (dependência de US-FIN-008).

#### Passo 3 — US-FIN-008 Gerenciar categorias (concluído)

**Schema Prisma:** `Category` (tipo REVENUE | EXPENSE, organizationId)

**Entregáveis:**

- [x] Domínio `Category` + `CreateCategoryUseCase`, `ListCategoriesUseCase`
- [x] Seed de categorias padrão por organização
- [x] CRUD em `/categories`
- [x] Regra: não excluir categoria em uso

**Docs:** RN-FIN-*, `docs/09-database-design.md`

---

#### Passo 4 — US-FIN-001 Cadastrar receita (concluído)

**Schema Prisma:** `Revenue` (amount, categoryId, dueDate, status PENDING, customerId?, organizationId)

**Entregáveis:**

- [x] Entidade `Revenue` com status inicial `PENDING` (RN-FIN-001)
- [x] `CreateRevenueUseCase` + `ListRevenuesUseCase` + `createRevenueAction`
- [x] Formulário e listagem em `/revenues`
- [x] RBAC: `revenue:create` (MEMBER+)

---

#### Passo 5 — US-FIN-002 Confirmar recebimento (concluído)

**Entregáveis:**

- [x] `ConfirmRevenueReceiptUseCase`
- [x] `confirmRevenueReceiptAction`
- [x] Atualização de status PENDING → RECEIVED
- [x] Ação de confirmação na listagem de `/revenues`

---

#### Passo 6 — US-FIN-003 Cadastrar despesa (concluído)

**Schema Prisma:** `Expense` (espelha Revenue com dueDate/vencimento)

**Entregáveis:**

- [x] Domínio `Expense` com status inicial `PENDING` (RN-FIN-002)
- [x] `CreateExpenseUseCase` + `ListExpensesUseCase` + `createExpenseAction`
- [x] Formulário e listagem em `/expenses`
- [x] RBAC: `expense:create` (MEMBER+)

---

#### Passo 7 — US-FIN-004 Confirmar pagamento

**Entregáveis:**

- `ConfirmExpensePaymentUseCase`
- Status PENDING → PAID

---

#### Passo 8 — US-FIN-010 Consultar fluxo de caixa

**Entregáveis:**

- `GetCashFlowUseCase` (read-only)
- Página `/cash-flow` com visões diária/semanal/mensal/anual
- Saldo a partir de movimentações confirmadas

---

### Marco M3 — CRM + Analytics (semanas 6–8)

#### Passo 9 — US-CRM-001 Cadastrar cliente

**Schema Prisma:** `Customer`

**Entregáveis:**

- CRUD cliente vinculável a receitas
- `/customers`

---

#### Passo 10 — US-CRM-004 Cadastrar fornecedor

**Schema Prisma:** `Supplier`

**Entregáveis:**

- CRUD fornecedor vinculável a despesas
- `/suppliers`

---

#### Passo 11 — US-AN-001 Visualizar dashboard

**Entregáveis:**

- `GetDashboardKPIsUseCase` (receita, despesa, lucro, saldo)
- Substituir placeholders em `/dashboard`
- Gráfico de evolução mensal
- Meta: carregamento < 2s

---

#### Passo 12 — US-AN-002 Gerar relatório financeiro

**Entregáveis:**

- `GenerateFinancialReportUseCase`
- Filtro por período e categoria
- Página `/reports`

---

### Marco M4 — Polish + Deploy (semanas 9–10)

#### Passo 13 — US-FIN-005 Editar lançamento (MVP polish)

**Entregáveis:**

- `UpdateRevenueUseCase`, `UpdateExpenseUseCase`
- Confirmação para edição de lançamentos confirmados

---

#### Passo 14 — Testes E2E dos fluxos críticos

Cobrir em `tests/e2e/`:

- [ ] Cadastro → login → dashboard
- [ ] Criar receita → confirmar recebimento
- [ ] Criar despesa → confirmar pagamento
- [ ] Trocar organização ativa
- [ ] Dashboard exibe KPIs corretos
- [ ] Usuário VIEWER não consegue criar lançamento

---

#### Passo 15 — Deploy staging

Seguir [docs/14-deployment.md](docs/14-deployment.md):

- [ ] Build de produção
- [ ] Migrations em staging
- [ ] Variáveis de ambiente
- [ ] CI verde

### Critérios de saída do MVP

- [ ] 18 user stories P0 concluídas
- [ ] Multi-tenancy validado (RN-GLOBAL-001)
- [ ] RBAC com 4 papéis funcional
- [ ] Testes E2E críticos passando
- [ ] Deploy em staging funcional

---

## V1 — Produto completo (9–10 semanas)

Após MVP. Prioridade Should Have ([docs/backlog/05-prioritization.md](docs/backlog/05-prioritization.md)).

### Identity & Organization

| Ordem | Story           | Feature                     |
| ----- | --------------- | --------------------------- |
| 1     | US-IDENTITY-004 | Editar perfil               |
| 2     | US-ORG-002      | Convidar membro             |
| 3     | US-ORG-004      | Gerenciar papéis de membros |

### Financial

| Ordem | Story      | Feature             |
| ----- | ---------- | ------------------- |
| 4     | US-FIN-007 | Arquivar lançamento |
| 5     | US-FIN-009 | Contas recorrentes  |
| 6     | US-FIN-011 | Anexos/comprovantes |
| 7     | US-FIN-012 | Contas bancárias    |

### CRM

| Ordem | Story      | Feature             |
| ----- | ---------- | ------------------- |
| 8     | US-CRM-002 | Editar cliente      |
| 9     | US-CRM-003 | Arquivar cliente    |
| 10    | US-CRM-005 | Editar fornecedor   |
| 11    | US-CRM-006 | Arquivar fornecedor |

### Analytics

| Ordem | Story     | Feature        |
| ----- | --------- | -------------- |
| 12    | US-AN-003 | Exportar PDF   |
| 13    | US-AN-004 | Exportar Excel |
| 14    | US-AN-005 | Exportar CSV   |

### Settings & Platform

| Ordem | Story       | Feature           |
| ----- | ----------- | ----------------- |
| 15    | US-SET-001  | Alterar perfil    |
| 16    | US-SET-002  | Tema claro/escuro |
| 17    | US-SET-003  | Dados da empresa  |
| 18    | US-PLAT-001 | Auditoria         |
| 19    | US-PLAT-002 | Logs              |
| 20    | US-PLAT-003 | Notificações      |

---

## V2 — Integrações e automação (7 semanas)

| Área         | Stories principais                                                         |
| ------------ | -------------------------------------------------------------------------- |
| Platform     | US-PLAT-004 Webhooks, US-PLAT-005 API pública, US-PLAT-006 Background jobs |
| Financial    | US-FIN-013 Centro de custos, US-FIN-014 Importar planilha                  |
| Organization | US-ORG-005 Filiais                                                         |
| Analytics    | US-AN-006 Indicadores personalizados, US-AN-007 Dashboard real-time        |
| Settings     | US-SET-004 Configurações regionais                                         |

---

## V3 — Ecossistema (13–18 semanas)

| Story       | Entrega                      |
| ----------- | ---------------------------- |
| US-PLAT-008 | Open Finance                 |
| US-PLAT-009 | App mobile                   |
| —           | IA para insights (a definir) |

**Fora de escopo:** Nota Fiscal, Estoque, Controle Fiscal.

---

## Mapa de documentação por atividade

| Atividade              | Documento                                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Entender o produto     | [docs/01-product-vision.md](docs/01-product-vision.md), [docs/02-product-requirements.md](docs/02-product-requirements.md) |
| Modelar entidades      | [docs/03-domain-model.md](docs/03-domain-model.md)                                                                         |
| Implementar validações | [docs/06-business-rules.md](docs/06-business-rules.md)                                                                     |
| Estruturar código      | [docs/08-software-architecture.md](docs/08-software-architecture.md), [AGENTS.md](AGENTS.md)                               |
| Schema/migrations      | [docs/09-database-design.md](docs/09-database-design.md)                                                                   |
| Server Actions         | [docs/10-api-specification.md](docs/10-api-specification.md)                                                               |
| UI/componentes         | [docs/11-design-system.md](docs/11-design-system.md)                                                                       |
| Segurança/RBAC         | [docs/12-security.md](docs/12-security.md)                                                                                 |
| Testes                 | [docs/13-testing.md](docs/13-testing.md)                                                                                   |
| Deploy                 | [docs/14-deployment.md](docs/14-deployment.md)                                                                             |
| Priorização            | [docs/backlog/05-prioritization.md](docs/backlog/05-prioritization.md)                                                     |
| Setup diário           | [docs/16-development-guide.md](docs/16-development-guide.md)                                                               |

---

## Checklist rápida por story

Copie e use em cada PR:

```markdown
## US-XXX-XXX — Título

- [ ] Critérios de aceitação atendidos (docs/backlog/03-product-backlog.md)
- [ ] Regras RN-* implementadas no domínio (docs/06-business-rules.md)
- [ ] Use case com testes unitários
- [ ] RBAC verificado no use case (se aplicável)
- [ ] organizationId da sessão (multi-tenancy)
- [ ] Schema/migration atualizados (se aplicável)
- [ ] Server Action + UI
- [ ] npm run lint && npm run test && npm run build
- [ ] Docs atualizados (se necessário)
```

---

## Comandos de referência

```bash
# Desenvolvimento
npm run dev
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run build

# Banco
docker compose -f docker/compose.yml up -d
npm run db:migrate
npm run db:seed
npm run db:studio
npm run db:reset          # dev only

# Ambiente
npm run setup:check
```

---

## Próximo passo imediato

**US-FIN-004 — Confirmar pagamento** (Marco M2)

1. Implementar `ConfirmExpensePaymentUseCase` com regras de transição de status
2. Criar `confirmExpensePaymentAction` para atualizar `paidAt`
3. Exibir ação de confirmação na listagem de despesas
4. Cobrir com testes unitários e atualizar roadmap

Depois: **US-FIN-010** (fluxo de caixa).

---

## Referências

- [README.md](README.md) — visão geral e setup
- [docs/15-roadmap.md](docs/15-roadmap.md) — timeline executiva
- [docs/backlog/04-release-plan.md](docs/backlog/04-release-plan.md) — plano de releases
- [docs/backlog/03-product-backlog.md](docs/backlog/03-product-backlog.md) — todas as user stories
