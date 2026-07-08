# Monetra — User Stories

> **Versão:** 1.0.0
> **Status:** Draft
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento descreve as histórias de usuário do Monetra.

Cada história representa uma necessidade do usuário e servirá como unidade de planejamento, desenvolvimento e testes.

Formato adotado:

> Como **[persona]**, quero **[objetivo]** para **[benefício]**.

Cada User Story possui:

- Identificador único
- Domínio
- Persona
- Prioridade
- Critérios de aceitação
- Dependências

---

# Legenda

## Prioridade

| Código | Significado          |
| ------ | -------------------- |
| P0     | Essencial para o MVP |
| P1     | Alta                 |
| P2     | Média                |
| P3     | Baixa                |

---

# Identity & Access

---

## US-IDENTITY-001

**Título**

Cadastro de usuário

**Persona**

Owner

**Prioridade**

P0

**História**

Como proprietário da empresa,

quero criar uma conta,

para começar a utilizar o Monetra.

### Critérios de aceitação

- Cadastro utilizando nome, e-mail e senha.
- E-mail deve ser único.
- Senha deve obedecer às regras de segurança.
- Usuário autenticado após cadastro.

---

## US-IDENTITY-002

Login

Persona

Owner

Prioridade

P0

História

Como usuário,

quero entrar no sistema,

para acessar minha empresa.

### Critérios

- Login com e-mail e senha.
- Credenciais inválidas exibem erro.
- Sessão persistida.
- Logout disponível.

---

## US-IDENTITY-003

Recuperar senha

Prioridade

P0

Critérios

- Envio de e-mail.
- Token temporário.
- Alteração segura.

---

## US-IDENTITY-004

Editar perfil

Prioridade

P1

Critérios

- Alterar nome.
- Alterar foto.
- Alterar senha.

---

# Organization

---

## US-ORG-001

Criar empresa

Persona

Owner

Prioridade

P0

História

Como proprietário,

quero cadastrar minha empresa,

para organizar minhas informações financeiras.

### Critérios

- Nome obrigatório.
- Moeda obrigatória.
- Timezone obrigatório.

---

## US-ORG-002

Convidar membro

Prioridade

P1

Critérios

- Convite por e-mail.
- Definir papel.
- Expiração do convite.

---

## US-ORG-003

Trocar empresa ativa

Prioridade

P1

Critérios

- Empresas disponíveis.
- Persistir empresa ativa.

---

# Financial

---

## US-FIN-001

Cadastrar receita

Persona

Financial Manager

Prioridade

P0

História

Como responsável financeiro,

quero registrar uma receita,

para acompanhar entradas de dinheiro.

### Critérios

- Valor obrigatório.
- Categoria obrigatória.
- Data obrigatória.
- Status inicial pendente.

---

## US-FIN-002

Confirmar recebimento

Prioridade

P0

Critérios

- Alterar status.
- Atualizar saldo.
- Registrar auditoria.

---

## US-FIN-003

Cadastrar despesa

Prioridade

P0

Critérios

- Valor obrigatório.
- Categoria obrigatória.
- Fornecedor opcional.
- Data de vencimento.

---

## US-FIN-004

Confirmar pagamento

Prioridade

P0

Critérios

- Atualizar fluxo de caixa.
- Registrar data.
- Atualizar indicadores.

---

## US-FIN-005

Editar lançamento

Prioridade

P1

---

## US-FIN-006

Excluir lançamento

Prioridade

P1

---

## US-FIN-007

Arquivar lançamento

Prioridade

P2

---

## US-FIN-008

Gerenciar categorias

Prioridade

P1

---

## US-FIN-009

Criar recorrência

Prioridade

P2

---

## US-FIN-010

Consultar fluxo de caixa

Prioridade

P0

---

# CRM

---

## US-CRM-001

Cadastrar cliente

Prioridade

P0

---

## US-CRM-002

Editar cliente

Prioridade

P1

---

## US-CRM-003

Arquivar cliente

Prioridade

P1

---

## US-CRM-004

Cadastrar fornecedor

Prioridade

P0

---

## US-CRM-005

Editar fornecedor

Prioridade

P1

---

## US-CRM-006

Arquivar fornecedor

Prioridade

P1

---

# Analytics

---

## US-AN-001

Visualizar dashboard

Prioridade

P0

Critérios

- KPIs atualizados.
- Gráficos carregados.
- Tempo inferior a 2 segundos.

---

## US-AN-002

Gerar relatório financeiro

Prioridade

P1

---

## US-AN-003

Exportar PDF

Prioridade

P1

---

## US-AN-004

Exportar Excel

Prioridade

P2

---

## US-AN-005

Exportar CSV

Prioridade

P2

---

# Settings

---

## US-SET-001

Alterar perfil

Prioridade

P1

---

## US-SET-002

Alterar tema

Prioridade

P2

---

## US-SET-003

Atualizar dados da empresa

Prioridade

P1

---

# Platform

---

## US-PLAT-001

Registrar auditoria

Prioridade

P1

---

## US-PLAT-002

Consultar logs

Prioridade

P2

---

## US-PLAT-003

Receber notificações

Prioridade

P2

---

# Resumo

| Domínio      | Quantidade |
| ------------ | ---------: |
| Identity     |          4 |
| Organization |          3 |
| Financial    |         10 |
| CRM          |          6 |
| Analytics    |          5 |
| Settings     |          3 |
| Platform     |          3 |

**Total:** 34 User Stories

---

# Definição de Pronto (Definition of Done)

Uma User Story será considerada concluída quando:

- Todos os critérios de aceitação forem atendidos.
- Código revisado.
- Testes automatizados aprovados.
- Documentação atualizada.
- Sem erros críticos.
- Deploy homologado.
