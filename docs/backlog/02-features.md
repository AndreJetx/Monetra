# Monetra — Feature Catalog

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento cataloga todas as Features do Monetra.

Uma Feature é um conjunto coeso de funcionalidades dentro de um Épico, implementada por uma ou mais User Stories.

---

# Legenda

| Campo          | Descrição                              |
| -------------- | -------------------------------------- |
| **ID**         | Identificador único da feature         |
| **Epic**       | Épico pai                              |
| **Prioridade** | P0 (MVP) · P1 (V1) · P2 (V2) · P3 (V3) |
| **Release**    | Versão alvo de entrega                 |
| **Status**     | `Planned` · `In Progress` · `Done`     |

---

# Resumo

| Domínio      | Features |  MVP   |   V1   |  V2   |  V3   |
| ------------ | :------: | :----: | :----: | :---: | :---: |
| Identity     |    6     |   4    |   2    |   0   |   0   |
| Organization |    5     |   3    |   2    |   0   |   0   |
| Financial    |    10    |   6    |   3    |   1   |   0   |
| CRM          |    4     |   2    |   2    |   0   |   0   |
| Analytics    |    4     |   2    |   2    |   0   |   0   |
| Settings     |    4     |   0    |   3    |   1   |   0   |
| Platform     |    7     |   0    |   3    |   3   |   1   |
| **Total**    |  **40**  | **17** | **17** | **5** | **1** |

---

# EP-001 — Identity & Access

| ID              | Feature              | Descrição                                          | Prioridade | Release | Status  |
| --------------- | -------------------- | -------------------------------------------------- | ---------- | ------- | ------- |
| FT-IDENTITY-001 | Cadastro de Usuário  | Registro com nome, e-mail e senha                  | P0         | MVP     | Planned |
| FT-IDENTITY-002 | Autenticação         | Login, logout e gestão de sessão                   | P0         | MVP     | Planned |
| FT-IDENTITY-003 | Recuperação de Senha | Fluxo de reset via e-mail com token                | P0         | MVP     | Planned |
| FT-IDENTITY-004 | Perfil do Usuário    | Edição de nome, foto e senha                       | P1         | V1      | Planned |
| FT-IDENTITY-005 | RBAC                 | Papéis (Owner, Admin, Member, Viewer) e permissões | P0         | MVP     | Planned |
| FT-IDENTITY-006 | Auditoria de Auth    | Registro de login, logout e tentativas falhas      | P1         | V1      | Planned |

---

# EP-002 — Organization

| ID         | Feature               | Descrição                                | Prioridade | Release | Status  |
| ---------- | --------------------- | ---------------------------------------- | ---------- | ------- | ------- |
| FT-ORG-001 | Cadastro de Empresa   | Criação com nome, moeda e timezone       | P0         | MVP     | Planned |
| FT-ORG-002 | Gestão de Membros     | Listar, editar e remover membros         | P1         | V1      | Planned |
| FT-ORG-003 | Convites              | Convite por e-mail com papel e expiração | P1         | V1      | Planned |
| FT-ORG-004 | Multiempresa          | Trocar empresa ativa na sessão           | P0         | MVP     | Planned |
| FT-ORG-005 | Papéis na Organização | Atribuir e alterar papéis de membros     | P0         | MVP     | Planned |

---

# EP-003 — Financial Management

| ID         | Feature             | Descrição                                   | Prioridade | Release | Status  |
| ---------- | ------------------- | ------------------------------------------- | ---------- | ------- | ------- |
| FT-FIN-001 | Receitas            | CRUD, confirmação de recebimento e status   | P0         | MVP     | Planned |
| FT-FIN-002 | Despesas            | CRUD, confirmação de pagamento e vencimento | P0         | MVP     | Planned |
| FT-FIN-003 | Fluxo de Caixa      | Visão diária, semanal, mensal e anual       | P0         | MVP     | Planned |
| FT-FIN-004 | Categorias          | Categorias de receita e despesa             | P0         | MVP     | Planned |
| FT-FIN-005 | Edição e Exclusão   | Editar, excluir e arquivar lançamentos      | P1         | MVP     | Planned |
| FT-FIN-006 | Contas Recorrentes  | Lançamentos automáticos periódicos          | P2         | V1      | Planned |
| FT-FIN-007 | Anexos              | Upload de comprovantes e notas              | P2         | V1      | Planned |
| FT-FIN-008 | Contas Bancárias    | Cadastro e saldo por conta                  | P2         | V1      | Planned |
| FT-FIN-009 | Centro de Custos    | Segmentação de despesas por centro          | P3         | V2      | Planned |
| FT-FIN-010 | Importação de Dados | Importar planilhas CSV/Excel                | P3         | V2      | Planned |

---

# EP-004 — CRM

| ID         | Feature                | Descrição                                 | Prioridade | Release | Status  |
| ---------- | ---------------------- | ----------------------------------------- | ---------- | ------- | ------- |
| FT-CRM-001 | Clientes               | CRUD, arquivamento e histórico financeiro | P0         | MVP     | Planned |
| FT-CRM-002 | Fornecedores           | CRUD, arquivamento e histórico financeiro | P0         | MVP     | Planned |
| FT-CRM-003 | Contatos e Observações | Notas e informações adicionais            | P1         | V1      | Planned |
| FT-CRM-004 | Etiquetas              | Tags para segmentação de contatos         | P2         | V1      | Planned |

---

# EP-005 — Analytics & Reporting

| ID        | Feature                | Descrição                                   | Prioridade | Release | Status  |
| --------- | ---------------------- | ------------------------------------------- | ---------- | ------- | ------- |
| FT-AN-001 | Dashboard              | KPIs, gráficos e visão geral financeira     | P0         | MVP     | Planned |
| FT-AN-002 | Relatórios Financeiros | Relatórios por período, categoria e cliente | P1         | MVP     | Planned |
| FT-AN-003 | Indicadores (KPIs)     | Lucro, margem, ticket médio e inadimplência | P1         | V1      | Planned |
| FT-AN-004 | Exportação de Dados    | PDF, Excel e CSV                            | P2         | V1      | Planned |

---

# EP-006 — Settings & Preferences

| ID         | Feature                  | Descrição                                       | Prioridade | Release | Status  |
| ---------- | ------------------------ | ----------------------------------------------- | ---------- | ------- | ------- |
| FT-SET-001 | Perfil do Usuário        | Preferências pessoais e notificações            | P1         | V1      | Planned |
| FT-SET-002 | Configurações da Empresa | Dados cadastrais e preferências organizacionais | P1         | V1      | Planned |
| FT-SET-003 | Tema e Aparência         | Modo claro/escuro e personalização visual       | P2         | V1      | Planned |
| FT-SET-004 | Configurações Regionais  | Idioma, moeda padrão e formato de data          | P3         | V2      | Planned |

---

# EP-007 — Platform Services

| ID          | Feature         | Descrição                                        | Prioridade | Release | Status  |
| ----------- | --------------- | ------------------------------------------------ | ---------- | ------- | ------- |
| FT-PLAT-001 | Auditoria       | Registro de ações críticas do sistema            | P1         | V1      | Planned |
| FT-PLAT-002 | Logs            | Consulta e filtro de logs da aplicação           | P2         | V1      | Planned |
| FT-PLAT-003 | Notificações    | Alertas in-app e por e-mail                      | P2         | V1      | Planned |
| FT-PLAT-004 | Webhooks        | Eventos para integrações externas                | P2         | V2      | Planned |
| FT-PLAT-005 | API Pública     | Endpoints REST documentados                      | P2         | V2      | Planned |
| FT-PLAT-006 | Background Jobs | Processamento assíncrono (recorrências, exports) | P2         | V2      | Planned |
| FT-PLAT-007 | Open Finance    | Integração bancária automatizada                 | P3         | V3      | Planned |

---

# Mapeamento Feature → User Stories

| Feature         | User Stories                       |
| --------------- | ---------------------------------- |
| FT-IDENTITY-001 | US-IDENTITY-001                    |
| FT-IDENTITY-002 | US-IDENTITY-002, US-IDENTITY-005   |
| FT-IDENTITY-003 | US-IDENTITY-003                    |
| FT-IDENTITY-004 | US-IDENTITY-004, US-SET-001        |
| FT-IDENTITY-005 | US-IDENTITY-006, US-ORG-004        |
| FT-ORG-001      | US-ORG-001                         |
| FT-ORG-003      | US-ORG-002                         |
| FT-ORG-004      | US-ORG-003                         |
| FT-FIN-001      | US-FIN-001, US-FIN-002             |
| FT-FIN-002      | US-FIN-003, US-FIN-004             |
| FT-FIN-003      | US-FIN-010                         |
| FT-FIN-004      | US-FIN-008                         |
| FT-FIN-005      | US-FIN-005, US-FIN-006, US-FIN-007 |
| FT-FIN-006      | US-FIN-009                         |
| FT-CRM-001      | US-CRM-001, US-CRM-002, US-CRM-003 |
| FT-CRM-002      | US-CRM-004, US-CRM-005, US-CRM-006 |
| FT-AN-001       | US-AN-001                          |
| FT-AN-002       | US-AN-002                          |
| FT-AN-004       | US-AN-003, US-AN-004, US-AN-005    |
| FT-SET-002      | US-SET-003                         |
| FT-SET-003      | US-SET-002                         |
| FT-PLAT-001     | US-PLAT-001                        |
| FT-PLAT-002     | US-PLAT-002                        |
| FT-PLAT-003     | US-PLAT-003                        |
