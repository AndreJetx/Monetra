# Monetra — Prioritization

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento define a priorização do backlog do Monetra utilizando duas metodologias complementares:

- **MoSCoW** — classificação qualitativa por necessidade.
- **RICE** — pontuação quantitativa para ordenação dentro de cada release.

---

# MoSCoW — Must / Should / Could / Won't

## Legenda

| Classificação | Significado                                    | Release alvo |
| ------------- | ---------------------------------------------- | ------------ |
| **Must**      | Indispensável; sem isso o produto não funciona | MVP          |
| **Should**    | Importante; agrega valor significativo         | V1           |
| **Could**     | Desejável; melhora a experiência               | V2           |
| **Won't**     | Fora do escopo atual                           | V3+          |

---

## Must Have (MVP)

Funcionalidades sem as quais o Monetra não entrega valor ao usuário.

| ID              | Item                       | Domínio      | Justificativa               |
| --------------- | -------------------------- | ------------ | --------------------------- |
| US-IDENTITY-001 | Cadastro de usuário        | Identity     | Porta de entrada do sistema |
| US-IDENTITY-002 | Login                      | Identity     | Acesso autenticado          |
| US-IDENTITY-003 | Recuperar senha            | Identity     | Recuperação de acesso       |
| US-IDENTITY-005 | Logout                     | Identity     | Segurança de sessão         |
| US-IDENTITY-006 | RBAC                       | Identity     | Controle de permissões      |
| US-ORG-001      | Criar empresa              | Organization | Contexto multi-tenant       |
| US-ORG-003      | Trocar empresa ativa       | Organization | Multiempresa                |
| US-FIN-001      | Cadastrar receita          | Financial    | Núcleo do produto           |
| US-FIN-002      | Confirmar recebimento      | Financial    | Fluxo de caixa real         |
| US-FIN-003      | Cadastrar despesa          | Financial    | Núcleo do produto           |
| US-FIN-004      | Confirmar pagamento        | Financial    | Fluxo de caixa real         |
| US-FIN-008      | Gerenciar categorias       | Financial    | Organização financeira      |
| US-FIN-010      | Consultar fluxo de caixa   | Financial    | Pergunta-chave do produto   |
| US-CRM-001      | Cadastrar cliente          | CRM          | Vínculo com receitas        |
| US-CRM-004      | Cadastrar fornecedor       | CRM          | Vínculo com despesas        |
| US-AN-001       | Visualizar dashboard       | Analytics    | Visão executiva             |
| US-AN-002       | Gerar relatório financeiro | Analytics    | Tomada de decisão           |

**Total Must:** 18 itens

---

## Should Have (V1)

Funcionalidades importantes que completam a experiência do produto.

| ID              | Item                       | Domínio      | Justificativa             |
| --------------- | -------------------------- | ------------ | ------------------------- |
| US-IDENTITY-004 | Editar perfil              | Identity     | Gestão de conta           |
| US-ORG-002      | Convidar membro            | Organization | Colaboração em equipe     |
| US-ORG-004      | Gerenciar papéis           | Organization | Administração de acesso   |
| US-FIN-005      | Editar lançamento          | Financial    | Correção de dados         |
| US-FIN-006      | Excluir lançamento         | Financial    | Gestão de erros           |
| US-FIN-007      | Arquivar lançamento        | Financial    | Organização               |
| US-FIN-009      | Criar recorrência          | Financial    | Automação de contas fixas |
| US-FIN-011      | Anexar comprovante         | Financial    | Documentação              |
| US-FIN-012      | Contas bancárias           | Financial    | Segmentação               |
| US-CRM-002      | Editar cliente             | CRM          | Manutenção de cadastro    |
| US-CRM-003      | Arquivar cliente           | CRM          | Gestão de inativos        |
| US-CRM-005      | Editar fornecedor          | CRM          | Manutenção de cadastro    |
| US-CRM-006      | Arquivar fornecedor        | CRM          | Gestão de inativos        |
| US-AN-003       | Exportar PDF               | Analytics    | Compartilhamento          |
| US-AN-004       | Exportar Excel             | Analytics    | Análise externa           |
| US-AN-005       | Exportar CSV               | Analytics    | Integração com planilhas  |
| US-SET-001      | Alterar perfil             | Settings     | Personalização            |
| US-SET-002      | Alterar tema               | Settings     | Conforto visual           |
| US-SET-003      | Atualizar dados da empresa | Settings     | Manutenção organizacional |
| US-PLAT-001     | Registrar auditoria        | Platform     | Rastreabilidade           |
| US-PLAT-002     | Consultar logs             | Platform     | Diagnóstico               |
| US-PLAT-003     | Receber notificações       | Platform     | Proatividade              |

**Total Should:** 22 itens

---

## Could Have (V2)

Funcionalidades desejáveis que expandem capacidades.

| ID          | Item                       | Domínio      | Justificativa                   |
| ----------- | -------------------------- | ------------ | ------------------------------- |
| US-ORG-005  | Filiais                    | Organization | Empresas com múltiplas unidades |
| US-FIN-013  | Centro de custos           | Financial    | Análise avançada                |
| US-FIN-014  | Importar planilha          | Financial    | Migração de planilhas           |
| US-FIN-015  | Etiquetas em lançamentos   | Financial    | Organização flexível            |
| US-AN-006   | Indicadores personalizados | Analytics    | Métricas customizadas           |
| US-AN-007   | Dashboard em tempo real    | Analytics    | Experiência moderna             |
| US-SET-004  | Configurações regionais    | Settings     | Internacionalização             |
| US-PLAT-004 | Webhooks                   | Platform     | Integrações                     |
| US-PLAT-005 | API pública                | Platform     | Ecossistema                     |
| US-PLAT-006 | Background jobs            | Platform     | Automação                       |
| US-PLAT-007 | Health checks              | Platform     | Observabilidade                 |

**Total Could:** 11 itens

---

## Won't Have (V3+)

Funcionalidades fora do escopo das próximas releases.

| ID          | Item                    | Domínio  | Motivo                      |
| ----------- | ----------------------- | -------- | --------------------------- |
| US-PLAT-008 | Open Finance            | Platform | Complexidade regulatória    |
| US-PLAT-009 | App mobile              | Platform | Foco web primeiro           |
| —           | Nota Fiscal             | —        | Fora do domínio             |
| —           | Estoque                 | —        | Fora do domínio             |
| —           | Inteligência Artificial | —        | Requer base de dados madura |
| —           | PIX automático          | —        | Integração bancária V3      |

**Total Won't:** 6 itens

---

# RICE — Reach · Impact · Confidence · Effort

## Fórmula

```text
RICE Score = (Reach × Impact × Confidence) / Effort
```

## Escala

| Métrica        | Escala | Descrição                                                        |
| -------------- | ------ | ---------------------------------------------------------------- |
| **Reach**      | 1–10   | Quantos usuários serão impactados por release                    |
| **Impact**     | 0.25–3 | 0.25 (mínimo) · 0.5 (baixo) · 1 (médio) · 2 (alto) · 3 (massivo) |
| **Confidence** | 0.5–1  | 0.5 (baixa) · 0.8 (média) · 1 (alta)                             |
| **Effort**     | 1–10   | Person-weeks estimadas                                           |

---

## RICE — MVP (Top 18)

| ID              | Item                  | Reach | Impact | Confidence | Effort |  Score   |
| --------------- | --------------------- | :---: | :----: | :--------: | :----: | :------: |
| US-IDENTITY-001 | Cadastro              |  10   |   3    |     1      |   2    | **15.0** |
| US-IDENTITY-002 | Login                 |  10   |   3    |     1      |   2    | **15.0** |
| US-ORG-001      | Criar empresa         |  10   |   3    |     1      |   2    | **15.0** |
| US-FIN-001      | Cadastrar receita     |  10   |   3    |     1      |   3    | **10.0** |
| US-FIN-003      | Cadastrar despesa     |  10   |   3    |     1      |   3    | **10.0** |
| US-FIN-010      | Fluxo de caixa        |  10   |   3    |    0.8     |   3    | **8.0**  |
| US-AN-001       | Dashboard             |  10   |   3    |    0.8     |   4    | **6.0**  |
| US-IDENTITY-006 | RBAC                  |   8   |   2    |    0.8     |   3    | **4.3**  |
| US-FIN-002      | Confirmar recebimento |   8   |   2    |     1      |   2    | **8.0**  |
| US-FIN-004      | Confirmar pagamento   |   8   |   2    |     1      |   2    | **8.0**  |
| US-IDENTITY-003 | Recuperar senha       |   7   |   2    |    0.8     |   3    | **3.7**  |
| US-IDENTITY-005 | Logout                |  10   |   1    |     1      |   1    | **10.0** |
| US-ORG-003      | Trocar empresa        |   6   |   2    |    0.8     |   2    | **4.8**  |
| US-FIN-008      | Categorias            |   8   |   2    |     1      |   2    | **8.0**  |
| US-CRM-001      | Cadastrar cliente     |   7   |   2    |     1      |   2    | **7.0**  |
| US-CRM-004      | Cadastrar fornecedor  |   7   |   2    |     1      |   2    | **7.0**  |
| US-AN-002       | Relatório financeiro  |   7   |   2    |    0.8     |   3    | **3.7**  |
| US-FIN-005      | Editar lançamento     |   6   |   1    |     1      |   2    | **3.0**  |

### Ordem de implementação MVP (por RICE)

```text
1. US-IDENTITY-001  Cadastro          (15.0)
2. US-IDENTITY-002  Login             (15.0)
3. US-ORG-001       Criar empresa     (15.0)
4. US-IDENTITY-005  Logout            (10.0)
5. US-FIN-001       Cadastrar receita (10.0)
6. US-FIN-003       Cadastrar despesa (10.0)
7. US-FIN-002       Confirmar receb.  (8.0)
8. US-FIN-004       Confirmar pagam.  (8.0)
9. US-FIN-008       Categorias        (8.0)
10. US-FIN-010      Fluxo de caixa    (8.0)
11. US-CRM-001      Cliente           (7.0)
12. US-CRM-004      Fornecedor        (7.0)
13. US-AN-001       Dashboard         (6.0)
14. US-ORG-003      Trocar empresa    (4.8)
15. US-IDENTITY-006 RBAC              (4.3)
16. US-IDENTITY-003 Recuperar senha   (3.7)
17. US-AN-002       Relatório         (3.7)
18. US-FIN-005      Editar lançamento (3.0)
```

---

## RICE — V1 (Top 10)

| ID          | Item             | Reach | Impact | Confidence | Effort |  Score  |
| ----------- | ---------------- | :---: | :----: | :--------: | :----: | :-----: |
| US-ORG-002  | Convidar membro  |   7   |   2    |    0.8     |   3    | **3.7** |
| US-FIN-009  | Recorrência      |   8   |   2    |    0.8     |   4    | **3.2** |
| US-AN-003   | Exportar PDF     |   6   |   2    |    0.8     |   3    | **3.2** |
| US-PLAT-001 | Auditoria        |   5   |   2    |     1      |   3    | **3.3** |
| US-PLAT-003 | Notificações     |   7   |   2    |    0.8     |   3    | **3.7** |
| US-FIN-011  | Anexos           |   6   |   1    |    0.8     |   3    | **1.6** |
| US-SET-002  | Tema             |   8   |   1    |     1      |   1    | **8.0** |
| US-ORG-004  | Papéis membros   |   5   |   2    |    0.8     |   2    | **4.0** |
| US-FIN-012  | Contas bancárias |   5   |   2    |    0.8     |   3    | **2.7** |
| US-AN-004   | Exportar Excel   |   4   |   2    |    0.8     |   2    | **3.2** |

---

## RICE — V2+ (Selecionados)

| ID          | Item                | Reach | Impact | Confidence | Effort |  Score   |
| ----------- | ------------------- | :---: | :----: | :--------: | :----: | :------: |
| US-PLAT-005 | API pública         |   3   |   3    |    0.5     |   6    | **0.75** |
| US-FIN-014  | Importar planilha   |   6   |   2    |    0.8     |   4    | **2.4**  |
| US-AN-007   | Dashboard real-time |   5   |   2    |    0.5     |   5    | **1.0**  |
| US-PLAT-008 | Open Finance        |   4   |   3    |    0.5     |   8    | **0.75** |
| US-PLAT-009 | App mobile          |   5   |   3    |    0.5     |   10   | **0.75** |

---

# Matriz de Decisão Consolidada

| Prioridade | MoSCoW | RICE médio | Release | Qtd |
| ---------- | ------ | :--------: | ------- | :-: |
| P0         | Must   |   ≥ 3.0    | MVP     | 18  |
| P1         | Should | 1.5 – 3.0  | V1      | 22  |
| P2         | Could  | 0.75 – 1.5 | V2      | 11  |
| P3         | Won't  |   < 0.75   | V3+     |  6  |

---

# Regras de Priorização

1. **Must Have sempre primeiro** — nenhum item Should/Could entra antes de todos os Must estarem Done.
2. **Dependências respeitadas** — Identity antes de Organization; Organization antes de Financial.
3. **RICE desempata** — dentro do mesmo nível MoSCoW, maior RICE score implementa primeiro.
4. **Revisão a cada release** — scores RICE são reavaliados ao final de cada release.
5. **Personas guiam Impact** — features do Owner e Financial Manager recebem Impact maior.

---

# Referências

- `01-epics.md` — Épicos e dependências
- `02-features.md` — Catálogo de features
- `03-product-backlog.md` — User stories completas
- `04-release-plan.md` — Plano de releases
- `docs/04-personas.md` — Personas e necessidades
