# Monetra — Release Plan

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento define o plano de releases do Monetra, organizando Épicos, Features e User Stories por versão.

---

# Visão Geral

| Release | Objetivo                                        | Épicos | User Stories | Status  |
| ------- | ----------------------------------------------- | ------ | :----------: | ------- |
| **MVP** | Produto funcional para gestão financeira básica | 5      |      18      | Planned |
| **V1**  | Experiência completa e serviços transversais    | 7      |      21      | Planned |
| **V2**  | Integrações, automação e escalabilidade         | 7      |      11      | Planned |
| **V3**  | Ecossistema expandido e inteligência            | 7      |      2       | Planned |

---

# MVP — Minimum Viable Product

## Objetivo

Entregar um SaaS funcional que permita ao empresário substituir planilhas por controle financeiro centralizado.

## Escopo

O MVP deve responder às perguntas essenciais:

- Quanto minha empresa faturou este mês?
- Quanto foi o lucro?
- Quanto tenho em caixa hoje?
- Existem contas vencidas?
- Qual categoria gera mais despesas?

## Épicos incluídos

| Épico                        | Features | User Stories |
| ---------------------------- | -------- | :----------: |
| EP-001 Identity & Access     | 4        |      5       |
| EP-002 Organization          | 2        |      2       |
| EP-003 Financial Management  | 6        |      8       |
| EP-004 CRM                   | 2        |      2       |
| EP-005 Analytics & Reporting | 2        |      2       |

## Features do MVP

### Identity (P0)

- FT-IDENTITY-001 Cadastro de Usuário
- FT-IDENTITY-002 Autenticação (login/logout)
- FT-IDENTITY-003 Recuperação de Senha
- FT-IDENTITY-005 RBAC

### Organization (P0)

- FT-ORG-001 Cadastro de Empresa
- FT-ORG-004 Multiempresa

### Financial (P0)

- FT-FIN-001 Receitas
- FT-FIN-002 Despesas
- FT-FIN-003 Fluxo de Caixa
- FT-FIN-004 Categorias
- FT-FIN-005 Edição e Exclusão

### CRM (P0)

- FT-CRM-001 Clientes
- FT-CRM-002 Fornecedores

### Analytics (P0)

- FT-AN-001 Dashboard
- FT-AN-002 Relatórios Financeiros

## Critérios de saída do MVP

- [ ] Usuário consegue se cadastrar, fazer login e criar uma empresa.
- [ ] Usuário consegue registrar receitas e despesas com categorias.
- [ ] Usuário consegue cadastrar clientes e fornecedores.
- [ ] Dashboard exibe KPIs e fluxo de caixa.
- [ ] Dados isolados por organização (multi-tenancy).
- [ ] RBAC funcional com 4 papéis.
- [ ] Testes E2E dos fluxos críticos aprovados.
- [ ] Deploy em ambiente de staging funcional.

## Estimativa

| Fase                    | Duração estimada |
| ----------------------- | ---------------- |
| Identity + Organization | 2–3 semanas      |
| Financial + CRM         | 3–4 semanas      |
| Analytics + Polish      | 2 semanas        |
| Testes + Deploy         | 1 semana         |
| **Total MVP**           | **8–10 semanas** |

---

# V1 — Produto Completo

## Objetivo

Completar a experiência do usuário com funcionalidades de colaboração, personalização e serviços transversais.

## Escopo adicional

- Convites e gestão de equipe.
- Contas recorrentes e anexos.
- Exportação de relatórios (PDF, Excel, CSV).
- Auditoria e notificações.
- Personalização (tema, perfil, configurações).

## Épicos adicionais

| Épico                         | Features novas | User Stories |
| ----------------------------- | -------------- | :----------: |
| EP-006 Settings & Preferences | 3              |      3       |
| EP-007 Platform Services      | 3              |      3       |

## Features do V1

### Identity (P1)

- FT-IDENTITY-004 Perfil do Usuário
- FT-IDENTITY-006 Auditoria de Auth

### Organization (P1)

- FT-ORG-002 Gestão de Membros
- FT-ORG-003 Convites
- FT-ORG-005 Papéis na Organização

### Financial (P1–P2)

- FT-FIN-006 Contas Recorrentes
- FT-FIN-007 Anexos
- FT-FIN-008 Contas Bancárias

### CRM (P1)

- FT-CRM-003 Contatos e Observações
- FT-CRM-004 Etiquetas

### Analytics (P1–P2)

- FT-AN-003 Indicadores (KPIs)
- FT-AN-004 Exportação de Dados

### Settings (P1–P2)

- FT-SET-001 Perfil do Usuário
- FT-SET-002 Configurações da Empresa
- FT-SET-003 Tema e Aparência

### Platform (P1–P2)

- FT-PLAT-001 Auditoria
- FT-PLAT-002 Logs
- FT-PLAT-003 Notificações

## Critérios de saída do V1

- [ ] Convite e gestão de membros funcional.
- [ ] Contas recorrentes gerando lançamentos automaticamente.
- [ ] Exportação PDF e Excel de relatórios.
- [ ] Auditoria de ações críticas.
- [ ] Notificações de contas vencendo.
- [ ] Tema claro/escuro.

## Estimativa

| Fase                                     | Duração estimada |
| ---------------------------------------- | ---------------- |
| Colaboração (convites, membros)          | 2 semanas        |
| Financial avançado (recorrência, anexos) | 2–3 semanas      |
| Analytics + Exportação                   | 2 semanas        |
| Platform (auditoria, notificações)       | 2 semanas        |
| Settings + Polish                        | 1 semana         |
| **Total V1**                             | **9–10 semanas** |

---

# V2 — Integrações e Automação

## Objetivo

Expandir o Monetra com integrações externas, automação e funcionalidades avançadas de gestão.

## Escopo adicional

- API pública documentada.
- Webhooks para integrações.
- Dashboard em tempo real.
- Importação de planilhas.
- Centro de custos e filiais.
- Background jobs.

## Features do V2

### Financial (P2–P3)

- FT-FIN-009 Centro de Custos
- FT-FIN-010 Importação de Dados

### Organization (P2)

- FT-ORG-002 Filiais (US-ORG-005)

### Analytics (P2)

- FT-AN-001 Dashboard em tempo real
- FT-AN-003 Indicadores personalizados

### Settings (P3)

- FT-SET-004 Configurações Regionais

### Platform (P2)

- FT-PLAT-004 Webhooks
- FT-PLAT-005 API Pública
- FT-PLAT-006 Background Jobs

## Critérios de saída do V2

- [ ] API REST documentada e funcional.
- [ ] Webhooks disparando eventos de lançamentos.
- [ ] Importação CSV/Excel de lançamentos.
- [ ] Dashboard com atualização em tempo real.

## Estimativa

| Fase                          | Duração estimada |
| ----------------------------- | ---------------- |
| API Pública + Webhooks        | 3 semanas        |
| Importação + Centro de Custos | 2 semanas        |
| Dashboard real-time + Jobs    | 2 semanas        |
| **Total V2**                  | **7 semanas**    |

---

# V3 — Ecossistema

## Objetivo

Transformar o Monetra em plataforma completa com integração bancária, mobile e inteligência artificial.

## Escopo adicional

- Open Finance (integração bancária).
- Aplicativo mobile.
- Inteligência artificial para insights financeiros.

## Features do V3

### Platform (P3)

- FT-PLAT-007 Open Finance
- US-PLAT-009 App Mobile
- IA para insights (a definir)

## Fora de escopo até V3

| Item            | Motivo                     |
| --------------- | -------------------------- |
| Nota Fiscal     | Complexidade regulatória   |
| Estoque         | Fora do domínio financeiro |
| Controle Fiscal | Requer expertise contábil  |

## Estimativa

| Fase          | Duração estimada  |
| ------------- | ----------------- |
| Open Finance  | 4–6 semanas       |
| App Mobile    | 6–8 semanas       |
| IA / Insights | 3–4 semanas       |
| **Total V3**  | **13–18 semanas** |

---

# Timeline Consolidada

```text
MVP ──────────► V1 ──────────► V2 ──────────► V3
│ 8-10 sem     │ 9-10 sem     │ 7 sem        │ 13-18 sem
│              │              │              │
Identity       Convites       API Pública    Open Finance
Organization   Recorrências   Webhooks       Mobile
Financial      Anexos         Importação     IA
CRM            Exportação     Real-time
Analytics      Auditoria      Centro Custos
               Notificações
               Settings
```

---

# Riscos por Release

| Release | Risco                        | Mitigação                            |
| ------- | ---------------------------- | ------------------------------------ |
| MVP     | Escopo creep                 | Manter foco nos 18 user stories P0   |
| V1      | Complexidade de recorrências | Background jobs desde o MVP (infra)  |
| V2      | API mal documentada          | OpenAPI spec desde o início          |
| V3      | Open Finance regulatório     | Avaliar viabilidade antes de iniciar |
