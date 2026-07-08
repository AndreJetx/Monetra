# ADR-006: RBAC

**Status:** Aceito  
**Data:** 07/07/2026  
**Autores:** Monetra Team

---

## Contexto

O Monetra é um SaaS multiempresa onde:

- Um usuário pode pertencer a múltiplas organizações;
- Cada organização possui membros com papéis diferentes;
- Operações financeiras e de gestão exigem níveis distintos de permissão;
- Dados devem ser isolados por organização (tenant isolation).

Personas do sistema (Owner, Admin, Member, Viewer) possuem necessidades de acesso distintas, conforme `docs/04-personas.md`.

---

## Decisão

Adotar **Role-Based Access Control (RBAC)** como modelo de autorização do Monetra.

### Papéis padrão

| Papel    | Descrição                                           |
| -------- | --------------------------------------------------- |
| `OWNER`  | Proprietário da organização; acesso total           |
| `ADMIN`  | Administrador; gerencia membros e configurações     |
| `MEMBER` | Operacional; cria e edita movimentações financeiras |
| `VIEWER` | Somente leitura; consulta relatórios e dashboards   |

### Implementação

- Papéis armazenados na relação `OrganizationMember` (user + organization + role).
- Permissões verificadas na camada `application/` dos casos de uso, não apenas na UI.
- Middleware Next.js valida autenticação; autorização ocorre no domínio.
- Helper `authorize(user, organization, permission)` centralizado no módulo Identity.
- Todas as queries filtram por `organizationId` para garantir isolamento de dados.

### Matriz de permissões (MVP)

| Recurso                   | OWNER | ADMIN | MEMBER | VIEWER |
| ------------------------- | ----- | ----- | ------ | ------ |
| Gerenciar organização     | ✅    | ✅    | ❌     | ❌     |
| Convidar membros          | ✅    | ✅    | ❌     | ❌     |
| Alterar papéis            | ✅    | ❌    | ❌     | ❌     |
| Criar receitas/despesas   | ✅    | ✅    | ✅     | ❌     |
| Editar receitas/despesas  | ✅    | ✅    | ✅     | ❌     |
| Excluir receitas/despesas | ✅    | ✅    | ❌     | ❌     |
| Visualizar relatórios     | ✅    | ✅    | ✅     | ✅     |
| Exportar dados            | ✅    | ✅    | ❌     | ❌     |

---

## Consequências

### Positivas

- Modelo simples e compreensível para usuários finais.
- Fácil de auditar e documentar.
- Escalável com novos papéis ou permissões granulares no futuro.
- Alinhado com requisitos do PRD e personas.

### Negativas

- RBAC simples pode ser insuficiente para permissões muito granulares (ex.: por categoria financeira).
- Verificação em múltiplas camadas (middleware + use case) exige disciplina.
- Migração para ABAC (Attribute-Based) no futuro exigiria refatoração.

---

## Alternativas Consideradas

| Alternativa                       | Motivo da rejeição                                   |
| --------------------------------- | ---------------------------------------------------- |
| ABAC (Attribute-Based)            | Complexidade excessiva para MVP e personas definidas |
| Permissões por recurso individual | Difícil de gerenciar em SaaS multiempresa            |
| Controle apenas na UI             | Inseguro; bypass via API direta                      |
| ACL por usuário                   | Não escala com múltiplos membros por organização     |

---

## Referências

- `docs/04-personas.md`
- `docs/02-product-requirements.md` — Identity & Access, Organization
- `docs/06-business-rules.md`
- `docs/12-security.md`
