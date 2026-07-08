# Monetra — Testing Strategy

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento define a estratégia de testes do Monetra: pirâmide de testes, ferramentas, convenções, cobertura mínima e fluxos críticos a serem automatizados.

---

# Pirâmide de Testes

```text
         ╱╲
        ╱  ╲        E2E (Playwright)
       ╱    ╲       Poucos, fluxos críticos
      ╱──────╲
     ╱        ╲     Integração
    ╱          ╲    Repositórios + DB
   ╱────────────╲
  ╱              ╲  Unitários (Vitest)
 ╱                ╲ Domínio + Use Cases
╱──────────────────╲
```

| Camada     | Ferramenta       | Foco                      | Quantidade |
| ---------- | ---------------- | ------------------------- | ---------- |
| Unitários  | Vitest           | Domínio, use cases, utils | Muitos     |
| Integração | Vitest + Test DB | Repositórios, queries     | Moderado   |
| E2E        | Playwright       | Fluxos de usuário         | Poucos     |

---

# Ferramentas

| Ferramenta                 | Uso                              |
| -------------------------- | -------------------------------- |
| **Vitest**                 | Testes unitários e de integração |
| **Playwright**             | Testes end-to-end                |
| **@testing-library/react** | Testes de componentes            |
| **MSW**                    | Mock de APIs (quando necessário) |
| **Prisma**                 | Seed de banco de teste           |

---

# O Que Testar em Cada Camada

## Domain (Unitários)

**Prioridade: máxima.** Regras de negócio são o coração do sistema.

| O que testar      | Exemplo                                |
| ----------------- | -------------------------------------- |
| Entidades         | `Revenue.confirmReceipt()` muda status |
| Value Objects     | `Money` rejeita valor negativo         |
| Regras de negócio | RN-FIN-001 transições de status        |
| Erros de domínio  | `InvalidRevenueStatusError`            |

```typescript
// features/financial/tests/Revenue.test.ts
describe("Revenue", () => {
  it("should confirm receipt and update status", () => {
    const revenue = Revenue.create({ amount: 1000, status: "PENDING", ... });
    revenue.confirmReceipt(new Date("2026-07-07"));
    expect(revenue.status).toBe("RECEIVED");
    expect(revenue.receivedAt).toEqual(new Date("2026-07-07"));
  });

  it("should not confirm already cancelled revenue", () => {
    const revenue = Revenue.create({ status: "CANCELLED", ... });
    expect(() => revenue.confirmReceipt(new Date())).toThrow(InvalidRevenueStatusError);
  });
});
```

## Application (Unitários)

| O que testar | Exemplo                                 |
| ------------ | --------------------------------------- |
| Use cases    | `CreateRevenueUseCase` com mock de repo |
| Autorização  | Use case rejeita VIEWER                 |
| Orquestração | Use case chama repo e auditoria         |

```typescript
describe("CreateRevenueUseCase", () => {
  it("should create revenue when user has permission", async () => {
    const repo = createMockRevenueRepository();
    const useCase = new CreateRevenueUseCase(repo);
    const result = await useCase.execute(dto, { role: "MEMBER", organizationId });
    expect(result.status).toBe("PENDING");
    expect(repo.save).toHaveBeenCalledOnce();
  });

  it("should reject when user is VIEWER", async () => {
    const useCase = new CreateRevenueUseCase(mockRepo);
    await expect(useCase.execute(dto, { role: "VIEWER", organizationId })).rejects.toThrow(
      ForbiddenError,
    );
  });
});
```

## Infrastructure (Integração)

| O que testar        | Exemplo                              |
| ------------------- | ------------------------------------ |
| Repositórios Prisma | CRUD com banco real de teste         |
| Filtro multi-tenant | Query não retorna dados de outra org |
| Mappers             | Prisma model → Domain entity         |

```typescript
describe("PrismaRevenueRepository", () => {
  beforeEach(async () => {
    await seedTestDatabase();
  });

  it("should only return revenues from the given organization", async () => {
    const repo = new PrismaRevenueRepository(prisma);
    const revenues = await repo.findAll({ organizationId: orgA.id });
    expect(revenues.every((r) => r.organizationId === orgA.id)).toBe(true);
  });
});
```

## Presentation (Componentes)

| O que testar | Exemplo                          |
| ------------ | -------------------------------- |
| Renderização | Formulário exibe campos corretos |
| Interação    | Submit chama action              |
| Estados      | Loading, erro, sucesso           |
| RBAC na UI   | Botão excluir oculto para VIEWER |

## E2E (Playwright)

Fluxos críticos do MVP:

| ID      | Fluxo                                  | Prioridade |
| ------- | -------------------------------------- | ---------- |
| E2E-001 | Cadastro + criar empresa + dashboard   | P0         |
| E2E-002 | Login + logout                         | P0         |
| E2E-003 | Criar receita + confirmar recebimento  | P0         |
| E2E-004 | Criar despesa + confirmar pagamento    | P0         |
| E2E-005 | Dashboard exibe KPIs corretos          | P0         |
| E2E-006 | Trocar empresa ativa                   | P1         |
| E2E-007 | Cadastrar cliente e vincular a receita | P1         |
| E2E-008 | VIEWER não vê botão de criar           | P1         |

```typescript
// e2e/revenue.spec.ts
test("should create and confirm a revenue", async ({ page }) => {
  await loginAs(page, "owner@test.com");
  await page.goto("/financial/revenues/new");
  await page.fill('[name="amount"]', "1500");
  await page.selectOption('[name="categoryId"]', categoryId);
  await page.fill('[name="dueDate"]', "2026-07-15");
  await page.click('button[type="submit"]');
  await expect(page.locator("text=Receita criada")).toBeVisible();
});
```

---

# Convenções

## Nomenclatura de arquivos

| Tipo       | Padrão                  | Localização                |
| ---------- | ----------------------- | -------------------------- |
| Unitário   | `*.test.ts`             | `features/<domain>/tests/` |
| Integração | `*.integration.test.ts` | `features/<domain>/tests/` |
| Componente | `*.test.tsx`            | Junto ao componente        |
| E2E        | `*.spec.ts`             | `apps/web/e2e/`            |

## Estrutura de teste

```typescript
describe("EntityName / UseCaseName", () => {
  // Arrange - Act - Assert

  it("should [expected behavior] when [condition]", () => {
    // ...
  });
});
```

## Fixtures e Factories

```typescript
// tests/factories/revenue.factory.ts
export function createRevenueFactory(overrides?: Partial<RevenueProps>): Revenue {
  return Revenue.create({
    amount: 1000,
    status: "PENDING",
    dueDate: new Date(),
    categoryId: "default-category-id",
    organizationId: "default-org-id",
    ...overrides,
  });
}
```

---

# Cobertura Mínima

| Camada                     | Meta        | Obrigatório |
| -------------------------- | ----------- | ----------- |
| Domain (entidades, VOs)    | 90%         | Sim         |
| Application (use cases)    | 80%         | Sim         |
| Infrastructure (repos)     | 70%         | Sim         |
| Presentation (componentes) | 60%         | Recomendado |
| E2E (fluxos críticos)      | 100% dos P0 | Sim         |

---

# Banco de Teste

- PostgreSQL separado: `monetra_test`.
- Reset antes de cada suite de integração.
- Seed com dados mínimos (user, org, categories).
- Docker Compose profile `test` (opcional).

```bash
DATABASE_URL=postgresql://monetra:monetra@localhost:5432/monetra_test npx vitest
```

---

# Mocks

## Repositórios (unitários)

```typescript
function createMockRevenueRepository(): RevenueRepository {
  return {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    delete: vi.fn(),
  };
}
```

## Auth (use cases)

```typescript
const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: "MEMBER" as Role,
};
```

## Princípio

- Unitários: mock de dependências externas.
- Integração: banco real, sem mocks de Prisma.
- E2E: aplicação real, banco de teste.

---

# CI/CD (GitHub Actions)

```yaml
# .github/workflows/test.yml
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:unit

  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: monetra_test
          POSTGRES_USER: monetra
          POSTGRES_PASSWORD: monetra
    steps:
      - run: npm run test:integration

  e2e:
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Scripts package.json

```json
{
  "test": "vitest",
  "test:unit": "vitest --project unit",
  "test:integration": "vitest --project integration",
  "test:e2e": "playwright test",
  "test:coverage": "vitest --coverage"
}
```

---

# Definition of Done (Testes)

Uma User Story só é concluída quando:

- [ ] Use cases possuem testes unitários.
- [ ] Regras de negócio (RN-*) possuem testes no domínio.
- [ ] Repositórios possuem testes de integração (se novos).
- [ ] Fluxos P0 possuem teste E2E (se aplicável).
- [ ] CI passa sem erros.
- [ ] Cobertura não regrediu.

---

# Referências

- [05-user-stories.md](05-user-stories.md)
- [06-business-rules.md](06-business-rules.md)
- [08-software-architecture.md](08-software-architecture.md)
- [12-security.md](12-security.md)
- [14-deployment.md](14-deployment.md)
- [16-development-guide.md](16-development-guide.md)
