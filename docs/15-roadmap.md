# Monetra — Roadmap

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento apresenta a visão executiva do roadmap do Monetra: releases planejadas, marcos, timeline e critérios de sucesso.

Para detalhamento de épicos, features e user stories, consulte [backlog/04-release-plan.md](backlog/04-release-plan.md).

---

# Visão do Produto

O Monetra evolui em quatro releases principais, cada uma entregando valor incremental ao empresário:

```text
MVP ──────► V1 ──────► V2 ──────► V3
Básico      Completo   Integrado   Ecossistema
```

| Release | Pergunta que responde                             | Status  |
| ------- | ------------------------------------------------- | ------- |
| **MVP** | "Quanto tenho em caixa e quanto lucrei?"          | Planned |
| **V1**  | "Posso colaborar com minha equipe e automatizar?" | Planned |
| **V2**  | "Posso integrar com outros sistemas?"             | Planned |
| **V3**  | "Posso conectar meu banco e usar no celular?"     | Planned |

---

# Timeline Consolidada

```text
2026 Q3          2026 Q4          2027 Q1          2027 Q2+
│ MVP (8-10 sem) │ V1 (9-10 sem)  │ V2 (7 sem)     │ V3 (13-18 sem)
│                │                │                │
Identity         Convites         API Pública      Open Finance
Organization     Recorrências     Webhooks         App Mobile
Financial        Anexos           Importação       IA
CRM              Exportação       Real-time
Analytics        Auditoria
                 Settings
```

---

# MVP — Minimum Viable Product

## Objetivo

Substituir planilhas por controle financeiro centralizado na web.

## Escopo

| Módulo       | Entregas                                       |
| ------------ | ---------------------------------------------- |
| Identity     | Cadastro, login, logout, recuperar senha, RBAC |
| Organization | Criar empresa, multiempresa                    |
| Financial    | Receitas, despesas, categorias, fluxo de caixa |
| CRM          | Clientes, fornecedores                         |
| Analytics    | Dashboard, relatórios básicos                  |

## Marcos

| Marco | Entrega                        | Semana |
| ----- | ------------------------------ | ------ |
| M1    | Auth + Organization funcionais | 2–3    |
| M2    | CRUD financeiro completo       | 5–6    |
| M3    | CRM + Dashboard                | 7–8    |
| M4    | Testes E2E + Deploy staging    | 9–10   |

## Critérios de sucesso

- [ ] 18 user stories P0 concluídas
- [ ] Fluxos E2E críticos passando
- [ ] Multi-tenancy validado
- [ ] Deploy em staging funcional
- [ ] Documentação técnica completa

## Estimativa: 8–10 semanas

---

# V1 — Produto Completo

## Objetivo

Experiência completa com colaboração, automação e personalização.

## Escopo adicional

| Módulo       | Entregas                                 |
| ------------ | ---------------------------------------- |
| Organization | Convites, gestão de membros, papéis      |
| Financial    | Recorrências, anexos, contas bancárias   |
| Analytics    | Exportação PDF/Excel/CSV, KPIs avançados |
| Settings     | Perfil, tema, configurações da empresa   |
| Platform     | Auditoria, notificações, logs            |

## Marcos

| Marco | Entrega                     | Semana |
| ----- | --------------------------- | ------ |
| M5    | Convites e gestão de equipe | 2      |
| M6    | Recorrências e anexos       | 4–5    |
| M7    | Exportação e auditoria      | 7–8    |
| M8    | Settings + polish           | 9–10   |

## Critérios de sucesso

- [ ] 21 user stories V1 concluídas
- [ ] Convite de membros funcional
- [ ] Contas recorrentes gerando lançamentos
- [ ] Exportação PDF operacional
- [ ] Auditoria de ações críticas

## Estimativa: 9–10 semanas

---

# V2 — Integrações e Automação

## Objetivo

Expandir com API pública, webhooks e funcionalidades avançadas.

## Escopo adicional

| Módulo       | Entregas                                        |
| ------------ | ----------------------------------------------- |
| Platform     | API REST pública, webhooks, background jobs     |
| Financial    | Importação CSV/Excel, centro de custos          |
| Organization | Filiais                                         |
| Analytics    | Dashboard real-time, indicadores personalizados |
| Settings     | Configurações regionais                         |

## Marcos

| Marco | Entrega                           | Semana |
| ----- | --------------------------------- | ------ |
| M9    | API pública documentada (OpenAPI) | 3      |
| M10   | Webhooks + importação             | 5      |
| M11   | Dashboard real-time + jobs        | 7      |

## Critérios de sucesso

- [ ] API REST documentada e funcional
- [ ] Importação de planilhas operacional
- [ ] Webhooks disparando eventos

## Estimativa: 7 semanas

---

# V3 — Ecossistema

## Objetivo

Plataforma completa com integração bancária, mobile e inteligência.

## Escopo

| Entrega      | Descrição                          |
| ------------ | ---------------------------------- |
| Open Finance | Conexão bancária automatizada      |
| App Mobile   | React Native ou PWA avançado       |
| IA           | Insights financeiros automatizados |

## Fora de escopo (mesmo em V3)

- Nota Fiscal
- Estoque
- Controle Fiscal

## Estimativa: 13–18 semanas

---

# Métricas de Progresso

| Métrica      |  MVP  |  V1   |  V2   |  V3   |
| ------------ | :---: | :---: | :---: | :---: |
| Épicos       |  5/7  |  7/7  |  7/7  |  7/7  |
| Features     | 17/40 | 34/40 | 39/40 | 40/40 |
| User Stories | 18/52 | 39/52 | 50/52 | 52/52 |

---

# Riscos e Mitigações

| Risco                        | Impacto | Prob. | Mitigação                       |
| ---------------------------- | ------- | ----- | ------------------------------- |
| Escopo creep no MVP          | Alto    | Média | Manter foco nas 18 stories P0   |
| Complexidade de recorrências | Médio   | Alta  | Background jobs desde infra MVP |
| API mal documentada          | Médio   | Média | OpenAPI spec desde V2 início    |
| Open Finance regulatório     | Alto    | Alta  | Avaliar viabilidade antes de V3 |
| Projeto solo (1 dev)         | Alto    | Alta  | Priorização rigorosa (MoSCoW)   |

---

# Priorização

A priorização detalhada está em [backlog/05-prioritization.md](backlog/05-prioritization.md).

**Regras:**

1. Must Have (MVP) sempre primeiro.
2. Dependências respeitadas (Identity → Organization → Financial).
3. RICE score desempata dentro do mesmo nível MoSCoW.

---

# Documentação Relacionada

| Documento                                                      | Conteúdo                    |
| -------------------------------------------------------------- | --------------------------- |
| [backlog/01-epics.md](backlog/01-epics.md)                     | Épicos e dependências       |
| [backlog/02-features.md](backlog/02-features.md)               | Catálogo de features        |
| [backlog/03-product-backlog.md](backlog/03-product-backlog.md) | User stories completas      |
| [backlog/04-release-plan.md](backlog/04-release-plan.md)       | Plano de releases detalhado |
| [backlog/05-prioritization.md](backlog/05-prioritization.md)   | Matriz MoSCoW + RICE        |
| [02-product-requirements.md](02-product-requirements.md)       | Requisitos funcionais       |

---

# Referências

- [01-product-vision.md](01-product-vision.md)
- [02-product-requirements.md](02-product-requirements.md)
- [05-user-stories.md](05-user-stories.md)
- [16-development-guide.md](16-development-guide.md)
