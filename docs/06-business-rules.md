# Monetra — Business Rules

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento define as regras de negócio do Monetra de forma formal e rastreável.

Cada regra possui um identificador único (`RN-<DOMÍNIO>-<NNN>`), descrição, condições, exceções e rastreabilidade com requisitos funcionais e user stories.

Este documento é a fonte de verdade para validações no domínio e critérios de aceitação de testes.

---

# Convenções

## Formato de identificação

```text
RN-IDENTITY-001
RN-ORG-003
RN-FIN-010
```

## Severidade

| Nível       | Descrição                                    |
| ----------- | -------------------------------------------- |
| **Crítica** | Violação compromete integridade ou segurança |
| **Alta**    | Violação gera inconsistência de dados        |
| **Média**   | Violação afeta experiência ou relatórios     |
| **Baixa**   | Violação afeta preferências ou conveniência  |

## Status de implementação

| Status        | Significado                 |
| ------------- | --------------------------- |
| `Defined`     | Regra documentada           |
| `Implemented` | Regra codificada no domínio |
| `Tested`      | Regra coberta por testes    |

---

# Regras Globais

## RN-GLOBAL-001 — Isolamento multi-tenant

| Campo      | Valor   |
| ---------- | ------- |
| Severidade | Crítica |
| RF         | RF003   |
| Status     | Defined |

**Descrição:** Cada empresa possui isolamento completo dos dados. Nenhum usuário pode acessar dados de outra empresa sem membership válido.

**Condições:**

- Toda consulta de dados de negócio deve filtrar por `organizationId`.
- O `organizationId` ativo é definido na sessão do usuário.
- Tentativas de acesso cross-tenant devem retornar erro 403.

---

## RN-GLOBAL-002 — RBAC obrigatório

| Campo      | Valor   |
| ---------- | ------- |
| Severidade | Crítica |
| RF         | RF010   |
| Status     | Defined |

**Descrição:** Todas as operações do sistema devem respeitar permissões RBAC.

**Condições:**

- Autorização verificada na camada `application/` (casos de uso).
- UI oculta ações não permitidas, mas backend sempre valida.
- Papéis: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`.

---

## RN-GLOBAL-003 — Confirmação de exclusões críticas

| Campo      | Valor   |
| ---------- | ------- |
| Severidade | Alta    |
| RF         | —       |
| Status     | Defined |

**Descrição:** Exclusões de lançamentos financeiros, membros e categorias em uso exigem confirmação explícita.

**Condições:**

- Modal de confirmação com descrição do impacto.
- Apenas papéis autorizados podem executar (ver ADR-006).

---

## RN-GLOBAL-004 — Auditoria de operações críticas

| Campo      | Valor   |
| ---------- | ------- |
| Severidade | Alta    |
| RF         | RF009   |
| Status     | Defined |

**Descrição:** Operações críticas devem ser registradas em log de auditoria.

**Operações auditadas:**

- Login / logout
- Criação, edição e exclusão de lançamentos financeiros
- Alteração de papéis
- Convite e remoção de membros
- Exportação de dados

**Dados registrados:** usuário, ação, entidade, timestamp, IP.

---

# Identity & Access

## RN-IDENTITY-001 — E-mail único

| Campo      | Valor           |
| ---------- | --------------- |
| Severidade | Crítica         |
| RF         | RF001           |
| User Story | US-IDENTITY-001 |
| Status     | Defined         |

**Descrição:** Cada usuário deve possuir um e-mail único no sistema.

**Condições:**

- Validação no cadastro e na edição de perfil.
- E-mail normalizado (lowercase, trim).
- Mensagem de erro clara em caso de duplicidade.

---

## RN-IDENTITY-002 — Política de senha

| Campo      | Valor           |
| ---------- | --------------- |
| Severidade | Alta            |
| RF         | RF001           |
| User Story | US-IDENTITY-001 |
| Status     | Defined         |

**Descrição:** Senhas devem atender critérios mínimos de segurança.

**Condições:**

- Mínimo 8 caracteres.
- Pelo menos 1 letra maiúscula.
- Pelo menos 1 número.
- Armazenamento com hash seguro (bcrypt ou argon2).
- Senha nunca armazenada em texto plano.

---

## RN-IDENTITY-003 — Sessão autenticada

| Campo      | Valor           |
| ---------- | --------------- |
| Severidade | Crítica         |
| RF         | RF001           |
| User Story | US-IDENTITY-002 |
| Status     | Defined         |

**Descrição:** Após login válido, o usuário deve possuir sessão autenticada e persistente.

**Condições:**

- Cookie de sessão com flags `HttpOnly`, `Secure` (produção), `SameSite=Lax`.
- Rotas protegidas redirecionam para `/login` se não autenticado.
- Logout invalida a sessão no servidor.

---

## RN-IDENTITY-004 — Recuperação de senha

| Campo      | Valor           |
| ---------- | --------------- |
| Severidade | Alta            |
| RF         | RF001           |
| User Story | US-IDENTITY-003 |
| Status     | Defined         |

**Descrição:** Recuperação de senha via token temporário enviado por e-mail.

**Condições:**

- Token com expiração de 24 horas.
- Token de uso único.
- Sessões anteriores invalidadas após alteração de senha.
- Não revelar se o e-mail existe (resposta genérica).

---

## RN-IDENTITY-005 — Convite com papel

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Alta       |
| RF         | RF004      |
| User Story | US-ORG-002 |
| Status     | Defined    |

**Descrição:** Convites devem definir o papel do membro convidado.

**Condições:**

- Papel válido: `ADMIN`, `MEMBER` ou `VIEWER` (não `OWNER` via convite).
- Convite expira em 7 dias.
- Apenas `OWNER` e `ADMIN` podem convidar.

---

# Organization

## RN-ORG-001 — Criação de empresa

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Alta       |
| RF         | RF002      |
| User Story | US-ORG-001 |
| Status     | Defined    |

**Descrição:** Ao criar uma empresa, o criador recebe automaticamente o papel `OWNER`.

**Condições:**

- Nome obrigatório (mín. 2 caracteres).
- Moeda obrigatória (padrão: BRL).
- Timezone obrigatória (padrão: America/Sao_Paulo).

---

## RN-ORG-002 — Multiempresa por usuário

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Alta       |
| RF         | RF002      |
| User Story | US-ORG-003 |
| Status     | Defined    |

**Descrição:** Um usuário pode pertencer a múltiplas empresas com papéis distintos em cada uma.

**Condições:**

- Membership único por par (userId, organizationId).
- Troca de empresa ativa atualiza contexto da sessão.
- Dados exibidos sempre da empresa ativa.

---

## RN-ORG-003 — Proteção do Owner

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Crítica    |
| RF         | RF004      |
| User Story | US-ORG-004 |
| Status     | Defined    |

**Descrição:** O papel `OWNER` não pode ser removido ou rebaixado por outro membro.

**Condições:**

- Apenas o próprio Owner pode transferir ownership (futuro V2).
- Empresa deve ter pelo menos 1 Owner ativo.

---

## RN-ORG-004 — Remoção de membro

| Campo      | Valor   |
| ---------- | ------- |
| Severidade | Alta    |
| RF         | RF004   |
| Status     | Defined |

**Descrição:** Membros podem ser removidos apenas por Owner ou Admin.

**Condições:**

- Owner não pode ser removido.
- Membro removido perde acesso imediato.
- Sessões ativas do membro removido são invalidadas.

---

# Financial

## RN-FIN-001 — Status de receita

| Campo      | Valor                  |
| ---------- | ---------------------- |
| Severidade | Alta                   |
| RF         | RF005                  |
| User Story | US-FIN-001, US-FIN-002 |
| Status     | Defined                |

**Descrição:** Receitas possuem status que controlam impacto no saldo.

**Estados:**

- `PENDING` — cadastrada, não impacta saldo.
- `RECEIVED` — recebida, impacta saldo positivamente.
- `CANCELLED` — cancelada, não impacta saldo.

**Transições permitidas:**

- `PENDING` → `RECEIVED`
- `PENDING` → `CANCELLED`
- `RECEIVED` → `CANCELLED` (requer confirmação e auditoria)

---

## RN-FIN-002 — Status de despesa

| Campo      | Valor                  |
| ---------- | ---------------------- |
| Severidade | Alta                   |
| RF         | RF006                  |
| User Story | US-FIN-003, US-FIN-004 |
| Status     | Defined                |

**Descrição:** Despesas possuem status que controlam impacto no saldo.

**Estados:**

- `PENDING` — cadastrada, não impacta saldo.
- `PAID` — paga, impacta saldo negativamente.
- `CANCELLED` — cancelada, não impacta saldo.
- `OVERDUE` — vencida (derivado: `PENDING` + data < hoje).

**Transições permitidas:**

- `PENDING` → `PAID`
- `PENDING` → `CANCELLED`
- `PAID` → `CANCELLED` (requer confirmação e auditoria)

---

## RN-FIN-003 — Cálculo de saldo

| Campo      | Valor        |
| ---------- | ------------ |
| Severidade | Crítica      |
| RF         | RF005, RF006 |
| User Story | US-FIN-010   |
| Status     | Defined      |

**Descrição:** O saldo é sempre calculado a partir de movimentações confirmadas.

**Fórmula:**

```text
Saldo = Σ receitas RECEIVED − Σ despesas PAID
```

**Condições:**

- Lançamentos `PENDING` não entram no cálculo.
- Lançamentos `CANCELLED` não entram no cálculo.
- Saldo nunca é armazenado como valor fixo; sempre derivado.

---

## RN-FIN-004 — Campos obrigatórios de lançamento

| Campo      | Valor                  |
| ---------- | ---------------------- |
| Severidade | Alta                   |
| RF         | —                      |
| User Story | US-FIN-001, US-FIN-003 |
| Status     | Defined                |

**Descrição:** Lançamentos financeiros exigem campos mínimos.

**Receita:** valor (> 0), categoria (tipo receita), data.
**Despesa:** valor (> 0), categoria (tipo despesa), data de vencimento.
**Opcionais:** descrição, cliente/fornecedor, anexo (V1).

---

## RN-FIN-005 — Categoria por tipo

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Alta       |
| RF         | —          |
| User Story | US-FIN-008 |
| Status     | Defined    |

**Descrição:** Categorias são exclusivas por tipo (receita ou despesa).

**Condições:**

- Receita só aceita categoria do tipo `REVENUE`.
- Despesa só aceita categoria do tipo `EXPENSE`.
- Categorias padrão criadas automaticamente no onboarding da empresa.
- Categoria em uso não pode ser excluída (apenas arquivada).

---

## RN-FIN-006 — Edição de lançamento confirmado

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Média      |
| RF         | —          |
| User Story | US-FIN-005 |
| Status     | Defined    |

**Descrição:** Lançamentos confirmados (recebidos/pagos) exigem confirmação para edição.

**Condições:**

- Alteração de valor em lançamento confirmado recalcula saldo.
- Registro de auditoria obrigatório.
- Apenas `OWNER`, `ADMIN` e `MEMBER` podem editar.

---

## RN-FIN-007 — Exclusão de lançamento

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Alta       |
| RF         | —          |
| User Story | US-FIN-006 |
| Status     | Defined    |

**Descrição:** Exclusão de lançamentos é restrita e auditada.

**Condições:**

- Apenas `OWNER` e `ADMIN` podem excluir.
- `MEMBER` e `VIEWER` não podem excluir.
- Confirmação obrigatória.
- Soft delete preferencial (campo `deletedAt`).

---

## RN-FIN-008 — Arquivamento

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Baixa      |
| RF         | —          |
| User Story | US-FIN-007 |
| Status     | Defined    |

**Descrição:** Lançamentos arquivados não aparecem na listagem padrão mas permanecem nos cálculos históricos.

**Condições:**

- Arquivamento não altera status financeiro.
- Possibilidade de restaurar.

---

## RN-FIN-009 — Contas recorrentes (V1)

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Média      |
| RF         | —          |
| User Story | US-FIN-009 |
| Status     | Defined    |

**Descrição:** Recorrências geram lançamentos automaticamente.

**Condições:**

- Frequências: semanal, mensal, anual.
- Lançamento gerado com status `PENDING`.
- Recorrência pode ser pausada ou cancelada.
- Processamento via background job.

---

# CRM

## RN-CRM-001 — Vínculo com lançamentos

| Campo      | Valor                  |
| ---------- | ---------------------- |
| Severidade | Média                  |
| RF         | —                      |
| User Story | US-CRM-001, US-CRM-004 |
| Status     | Defined                |

**Descrição:** Clientes vinculam-se a receitas; fornecedores vinculam-se a despesas.

**Condições:**

- Vínculo opcional no lançamento.
- Cliente/fornecedor arquivado não pode ser vinculado a novos lançamentos.
- Histórico financeiro calculado a partir dos lançamentos vinculados.

---

## RN-CRM-002 — Arquivamento de contato

| Campo      | Valor                  |
| ---------- | ---------------------- |
| Severidade | Média                  |
| RF         | —                      |
| User Story | US-CRM-003, US-CRM-006 |
| Status     | Defined                |

**Descrição:** Clientes e fornecedores arquivados não aparecem em seleções mas mantêm histórico.

**Condições:**

- Soft delete (campo `archivedAt`).
- Restauração permitida.
- Lançamentos existentes mantêm referência.

---

## RN-CRM-003 — Unicidade por organização

| Campo      | Valor   |
| ---------- | ------- |
| Severidade | Média   |
| RF         | RF003   |
| Status     | Defined |

**Descrição:** Nome de cliente/fornecedor deve ser único por organização (case-insensitive).

**Exceção:** Contatos arquivados não bloqueiam reutilização do nome.

---

# Analytics

## RN-AN-001 — Somente leitura

| Campo      | Valor     |
| ---------- | --------- |
| Severidade | Alta      |
| RF         | RF007     |
| User Story | US-AN-001 |
| Status     | Defined   |

**Descrição:** O domínio Analytics não altera dados; apenas consulta e consolida.

**Condições:**

- Nenhuma operação de escrita no domínio Analytics.
- Dados derivados de Financial e CRM.
- Dashboard atualizado após mutações financeiras (RF007).

---

## RN-AN-002 — KPIs do dashboard

| Campo      | Valor     |
| ---------- | --------- |
| Severidade | Média     |
| RF         | RF007     |
| User Story | US-AN-001 |
| Status     | Defined   |

**Descrição:** Dashboard exibe KPIs calculados em tempo real.

**KPIs MVP:**

- Saldo em caixa (receitas recebidas − despesas pagas)
- Receita do período
- Despesa do período
- Lucro (receita − despesa)
- Contas vencidas (despesas `OVERDUE`)

---

## RN-AN-003 — Exportação (V1)

| Campo      | Valor                           |
| ---------- | ------------------------------- |
| Severidade | Média                           |
| RF         | RF008                           |
| User Story | US-AN-003, US-AN-004, US-AN-005 |
| Status     | Defined                         |

**Descrição:** Relatórios exportáveis em PDF, Excel e CSV.

**Condições:**

- Apenas `OWNER` e `ADMIN` podem exportar.
- Exportação registrada em auditoria.
- Dados filtrados pela organização ativa.

---

# Settings

## RN-SET-001 — Preferências por escopo

| Campo      | Valor                  |
| ---------- | ---------------------- |
| Severidade | Baixa                  |
| RF         | —                      |
| User Story | US-SET-001, US-SET-002 |
| Status     | Defined                |

**Descrição:** Preferências existem em dois escopos: usuário e empresa.

**Usuário:** tema, idioma, notificações pessoais.
**Empresa:** moeda, timezone, logo, dados cadastrais.

---

## RN-SET-002 — Tema

| Campo      | Valor      |
| ---------- | ---------- |
| Severidade | Baixa      |
| RF         | —          |
| User Story | US-SET-002 |
| Status     | Defined    |

**Descrição:** Usuário pode alternar entre tema claro e escuro.

**Condições:**

- Preferência persistida no perfil.
- Respeita `prefers-color-scheme` como padrão.

---

# Platform

## RN-PLAT-001 — Registro de auditoria

| Campo      | Valor       |
| ---------- | ----------- |
| Severidade | Alta        |
| RF         | RF009       |
| User Story | US-PLAT-001 |
| Status     | Defined     |

**Descrição:** Toda ação crítica gera registro imutável em `audit_logs`.

**Campos:** `id`, `organizationId`, `userId`, `action`, `entity`, `entityId`, `metadata`, `ip`, `createdAt`.

---

## RN-PLAT-002 — Notificações (V1)

| Campo      | Valor       |
| ---------- | ----------- |
| Severidade | Baixa       |
| RF         | —           |
| User Story | US-PLAT-003 |
| Status     | Defined     |

**Descrição:** Alertas automáticos para contas vencendo e vencidas.

**Condições:**

- Notificação in-app e por e-mail (configurável).
- Processamento diário via background job.

---

# Matriz de Rastreabilidade

| Regra           | RF           | User Story             | Domínio      |
| --------------- | ------------ | ---------------------- | ------------ |
| RN-GLOBAL-001   | RF003        | US-ORG-003             | Global       |
| RN-GLOBAL-002   | RF010        | US-IDENTITY-006        | Global       |
| RN-GLOBAL-004   | RF009        | US-PLAT-001            | Platform     |
| RN-IDENTITY-001 | RF001        | US-IDENTITY-001        | Identity     |
| RN-IDENTITY-002 | RF001        | US-IDENTITY-001        | Identity     |
| RN-IDENTITY-003 | RF001        | US-IDENTITY-002        | Identity     |
| RN-IDENTITY-004 | RF001        | US-IDENTITY-003        | Identity     |
| RN-ORG-001      | RF002        | US-ORG-001             | Organization |
| RN-ORG-002      | RF002        | US-ORG-003             | Organization |
| RN-ORG-003      | RF004        | US-ORG-004             | Organization |
| RN-FIN-001      | RF005        | US-FIN-001, US-FIN-002 | Financial    |
| RN-FIN-002      | RF006        | US-FIN-003, US-FIN-004 | Financial    |
| RN-FIN-003      | RF005, RF006 | US-FIN-010             | Financial    |
| RN-FIN-005      | —            | US-FIN-008             | Financial    |
| RN-AN-001       | RF007        | US-AN-001              | Analytics    |
| RN-AN-002       | RF007        | US-AN-001              | Analytics    |
| RN-AN-003       | RF008        | US-AN-003–005          | Analytics    |

---

# Referências

- [02-product-requirements.md](02-product-requirements.md)
- [03-domain-model.md](03-domain-model.md)
- [05-user-stories.md](05-user-stories.md)
- [adr/ADR-006-rbac.md](adr/ADR-006-rbac.md)
- [12-security.md](12-security.md)
