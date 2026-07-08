# Monetra — API Specification

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento especifica as interfaces de comunicação do Monetra: Server Actions (mutações internas da UI) e Route Handlers REST (API pública e integrações).

Define padrões de autenticação, validação, respostas, erros e endpoints do MVP.

---

# Superfícies de API

| Superfície         | Uso                                      | Tecnologia               |
| ------------------ | ---------------------------------------- | ------------------------ |
| **Server Actions** | Mutações iniciadas pela UI (formulários) | `"use server"` functions |
| **Route Handlers** | API REST, webhooks, integrações          | `app/api/v1/**/route.ts` |

## Quando usar cada uma

| Cenário                             | Superfície                  |
| ----------------------------------- | --------------------------- |
| Criar/editar receita via formulário | Server Action               |
| Listar receitas na UI               | Server Component + Use Case |
| Integração externa (V2)             | Route Handler               |
| Webhook de pagamento (V2)           | Route Handler               |
| Exportação de relatório (V1)        | Route Handler               |

---

# Autenticação

Todas as requisições autenticadas utilizam sessão Auth.js.

## Server Actions

```typescript
"use server";

import { auth } from "@/shared/auth";

export async function createRevenueAction(data: CreateRevenueInput) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }
  // ...
}
```

## Route Handlers

```typescript
import { auth } from "@/shared/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ...
}
```

## Contexto organizacional

Toda operação de negócio requer `organizationId` da sessão:

```typescript
const organizationId = session.user.activeOrganizationId;
if (!organizationId) {
  return { success: false, error: "Nenhuma empresa selecionada" };
}
```

---

# Padrão de Resposta

## Server Actions — ActionResult

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };
```

**Exemplo sucesso:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 1500.0,
    "status": "PENDING"
  }
}
```

**Exemplo erro de validação:**

```json
{
  "success": false,
  "error": "Dados inválidos",
  "fieldErrors": {
    "amount": ["Valor deve ser maior que zero"],
    "categoryId": ["Categoria é obrigatória"]
  }
}
```

## Route Handlers — REST

**Sucesso (200/201):**

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150
  }
}
```

**Erro:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [{ "field": "amount", "message": "Valor deve ser maior que zero" }]
  }
}
```

---

# Códigos HTTP

| Código | Uso                             |
| ------ | ------------------------------- |
| 200    | Sucesso (GET, PATCH)            |
| 201    | Criado (POST)                   |
| 204    | Sem conteúdo (DELETE)           |
| 400    | Validação falhou                |
| 401    | Não autenticado                 |
| 403    | Sem permissão (RBAC)            |
| 404    | Recurso não encontrado          |
| 409    | Conflito (ex: e-mail duplicado) |
| 422    | Regra de negócio violada        |
| 500    | Erro interno                    |

---

# Validação

Toda entrada validada com **Zod** antes de chegar ao use case.

```typescript
// features/financial/shared/schemas/CreateRevenueSchema.ts
import { z } from "zod";

export const CreateRevenueSchema = z.object({
  amount: z.number().positive("Valor deve ser maior que zero"),
  categoryId: z.string().uuid("Categoria inválida"),
  dueDate: z.coerce.date(),
  customerId: z.string().uuid().optional(),
  description: z.string().max(500).optional(),
});
```

---

# Server Actions — MVP

## Identity

| Action                 | Input                 | Output  | Permissão   |
| ---------------------- | --------------------- | ------- | ----------- |
| `registerAction`       | name, email, password | User    | Público     |
| `loginAction`          | email, password       | Session | Público     |
| `logoutAction`         | —                     | void    | Autenticado |
| `forgotPasswordAction` | email                 | void    | Público     |
| `resetPasswordAction`  | token, password       | void    | Público     |

## Organization

| Action                     | Input                    | Output       | Permissão   |
| -------------------------- | ------------------------ | ------------ | ----------- |
| `createOrganizationAction` | name, currency, timezone | Organization | Autenticado |
| `switchOrganizationAction` | organizationId           | void         | MEMBER+     |
| `inviteMemberAction`       | email, role              | Invitation   | ADMIN+ (V1) |

## Financial

| Action                        | Input                | Output   | Permissão |
| ----------------------------- | -------------------- | -------- | --------- |
| `createRevenueAction`         | CreateRevenueDTO     | Revenue  | MEMBER+   |
| `updateRevenueAction`         | id, UpdateRevenueDTO | Revenue  | MEMBER+   |
| `confirmRevenueReceiptAction` | id, receivedAt       | Revenue  | MEMBER+   |
| `deleteRevenueAction`         | id                   | void     | ADMIN+    |
| `createExpenseAction`         | CreateExpenseDTO     | Expense  | MEMBER+   |
| `updateExpenseAction`         | id, UpdateExpenseDTO | Expense  | MEMBER+   |
| `confirmExpensePaymentAction` | id, paidAt           | Expense  | MEMBER+   |
| `deleteExpenseAction`         | id                   | void     | ADMIN+    |
| `createCategoryAction`        | name, type           | Category | ADMIN+    |
| `updateCategoryAction`        | id, name             | Category | ADMIN+    |
| `archiveCategoryAction`       | id                   | void     | ADMIN+    |

## CRM

| Action                  | Input                 | Output   | Permissão |
| ----------------------- | --------------------- | -------- | --------- |
| `createCustomerAction`  | CreateCustomerDTO     | Customer | MEMBER+   |
| `updateCustomerAction`  | id, UpdateCustomerDTO | Customer | MEMBER+   |
| `archiveCustomerAction` | id                    | void     | ADMIN+    |
| `createSupplierAction`  | CreateSupplierDTO     | Supplier | MEMBER+   |
| `updateSupplierAction`  | id, UpdateSupplierDTO | Supplier | MEMBER+   |
| `archiveSupplierAction` | id                    | void     | ADMIN+    |

---

# Route Handlers — MVP

Base URL: `/api/v1`

## Identity

| Método | Endpoint     | Descrição               | Auth |
| ------ | ------------ | ----------------------- | ---- |
| GET    | `/api/v1/me` | Dados do usuário logado | Sim  |

## Financial

| Método | Endpoint                       | Descrição             | Auth | Permissão |
| ------ | ------------------------------ | --------------------- | ---- | --------- |
| GET    | `/api/v1/revenues`             | Listar receitas       | Sim  | VIEWER+   |
| GET    | `/api/v1/revenues/:id`         | Detalhe receita       | Sim  | VIEWER+   |
| POST   | `/api/v1/revenues`             | Criar receita         | Sim  | MEMBER+   |
| PATCH  | `/api/v1/revenues/:id`         | Atualizar receita     | Sim  | MEMBER+   |
| DELETE | `/api/v1/revenues/:id`         | Excluir receita       | Sim  | ADMIN+    |
| POST   | `/api/v1/revenues/:id/confirm` | Confirmar recebimento | Sim  | MEMBER+   |
| GET    | `/api/v1/expenses`             | Listar despesas       | Sim  | VIEWER+   |
| GET    | `/api/v1/expenses/:id`         | Detalhe despesa       | Sim  | VIEWER+   |
| POST   | `/api/v1/expenses`             | Criar despesa         | Sim  | MEMBER+   |
| PATCH  | `/api/v1/expenses/:id`         | Atualizar despesa     | Sim  | MEMBER+   |
| DELETE | `/api/v1/expenses/:id`         | Excluir despesa       | Sim  | ADMIN+    |
| POST   | `/api/v1/expenses/:id/confirm` | Confirmar pagamento   | Sim  | MEMBER+   |
| GET    | `/api/v1/categories`           | Listar categorias     | Sim  | VIEWER+   |

## CRM

| Método | Endpoint            | Descrição           | Auth | Permissão |
| ------ | ------------------- | ------------------- | ---- | --------- |
| GET    | `/api/v1/customers` | Listar clientes     | Sim  | VIEWER+   |
| POST   | `/api/v1/customers` | Criar cliente       | Sim  | MEMBER+   |
| GET    | `/api/v1/suppliers` | Listar fornecedores | Sim  | VIEWER+   |
| POST   | `/api/v1/suppliers` | Criar fornecedor    | Sim  | MEMBER+   |

## Analytics

| Método | Endpoint                    | Descrição            | Auth | Permissão |
| ------ | --------------------------- | -------------------- | ---- | --------- |
| GET    | `/api/v1/dashboard`         | KPIs do dashboard    | Sim  | VIEWER+   |
| GET    | `/api/v1/reports/financial` | Relatório financeiro | Sim  | VIEWER+   |
| GET    | `/api/v1/cash-flow`         | Fluxo de caixa       | Sim  | VIEWER+   |

## Organization

| Método | Endpoint                            | Descrição           | Auth | Permissão   |
| ------ | ----------------------------------- | ------------------- | ---- | ----------- |
| GET    | `/api/v1/organizations`             | Empresas do usuário | Sim  | Autenticado |
| POST   | `/api/v1/organizations`             | Criar empresa       | Sim  | Autenticado |
| GET    | `/api/v1/organizations/:id/members` | Membros             | Sim  | ADMIN+      |

## Platform

| Método | Endpoint         | Descrição    | Auth |
| ------ | ---------------- | ------------ | ---- |
| GET    | `/api/v1/health` | Health check | Não  |

---

# Query Parameters (Listagens)

| Parâmetro    | Tipo            | Descrição                                |
| ------------ | --------------- | ---------------------------------------- |
| `page`       | number          | Página (default: 1)                      |
| `perPage`    | number          | Itens por página (default: 20, max: 100) |
| `sort`       | string          | Campo de ordenação                       |
| `order`      | `asc` \| `desc` | Direção                                  |
| `search`     | string          | Busca textual                            |
| `status`     | string          | Filtro por status                        |
| `from`       | date            | Data início                              |
| `to`         | date            | Data fim                                 |
| `categoryId` | uuid            | Filtro por categoria                     |

**Exemplo:**

```
GET /api/v1/revenues?page=1&perPage=20&status=PENDING&from=2026-07-01&to=2026-07-31
```

---

# Mapeamento Endpoint → Use Case

| Endpoint / Action          | Use Case                     |
| -------------------------- | ---------------------------- |
| POST /revenues             | CreateRevenueUseCase         |
| POST /revenues/:id/confirm | ConfirmRevenueReceiptUseCase |
| GET /dashboard             | GenerateDashboardUseCase     |
| GET /cash-flow             | CalculateCashFlowUseCase     |
| POST /organizations        | CreateOrganizationUseCase    |
| registerAction             | RegisterUserUseCase          |
| loginAction                | AuthenticateUserUseCase      |

---

# Fluxo de uma Requisição REST

```text
Client
  │
  ▼
Route Handler
  ├── auth() → 401 se falhar
  ├── validate(query/body) → 400 se falhar
  ├── authorize(user, org, permission) → 403 se falhar
  ▼
Use Case
  ├── Regra de negócio (domínio)
  ├── Repository
  ▼
Response JSON
```

---

# Versionamento

- Versão atual: `v1`
- Prefixo: `/api/v1/`
- Breaking changes geram nova versão (`v2`).
- Versão anterior mantida por período de deprecação.

---

# Rate Limiting (V2)

| Plano        | Limite                  |
| ------------ | ----------------------- |
| Interno (UI) | Sem limite              |
| API pública  | 100 req/min por API key |

---

# Referências

- [08-software-architecture.md](08-software-architecture.md)
- [09-database-design.md](09-database-design.md)
- [06-business-rules.md](06-business-rules.md)
- [adr/ADR-004-authjs.md](adr/ADR-004-authjs.md)
- [adr/ADR-005-server-actions.md](adr/ADR-005-server-actions.md)
- [adr/ADR-006-rbac.md](adr/ADR-006-rbac.md)
