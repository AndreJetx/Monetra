# Monetra — Domain Model

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento define o modelo de domínio do Monetra.

Seu objetivo é identificar os principais domínios de negócio, suas responsabilidades, entidades, casos de uso e relacionamentos.

Este documento é independente da tecnologia utilizada na implementação.

---

# Conceitos

## Domínio

Um domínio representa uma área específica de responsabilidade dentro do produto.

Cada domínio possui suas próprias regras de negócio, entidades e casos de uso.

---

## Entidade

Uma entidade representa um objeto do negócio que possui identidade própria durante todo seu ciclo de vida.

Exemplos:

- Usuário
- Empresa
- Receita
- Cliente

---

## Evento de Domínio

Representa algo importante que aconteceu dentro do sistema.

Exemplos:

- Receita Recebida
- Empresa Criada
- Usuário Registrado

---

# Visão Geral dos Domínios

O Monetra é dividido em sete domínios principais.

```text
Monetra

├── Identity & Access
├── Organization
├── Financial
├── CRM
├── Analytics
├── Settings
└── Platform
```

Cada domínio possui responsabilidades bem definidas.

---

# Domínio: Identity & Access

## Responsabilidade

Gerenciar identidade dos usuários e autenticação.

---

## Entidades

- User
- Session
- Role
- Permission
- Invitation

---

## Casos de Uso

- Registrar usuário
- Autenticar usuário
- Encerrar sessão
- Recuperar senha
- Alterar senha
- Atualizar perfil
- Aceitar convite

---

## Eventos

- UserRegistered
- UserLoggedIn
- PasswordChanged
- InvitationAccepted

---

## Limites

Este domínio é responsável apenas pela identidade dos usuários.

Ele não conhece:

- Empresas
- Receitas
- Despesas
- Clientes
- Relatórios

---

# Domínio: Organization

## Responsabilidade

Gerenciar organizações e seus membros.

---

## Entidades

- Company
- Membership
- Team
- Branch

---

## Casos de Uso

- Criar empresa
- Atualizar empresa
- Convidar membro
- Remover membro
- Alterar permissões
- Trocar empresa ativa

---

## Eventos

- CompanyCreated
- MemberInvited
- MemberRemoved

---

## Dependências

Este domínio depende da existência de usuários cadastrados.

---

# Domínio: Financial

## Responsabilidade

Gerenciar toda movimentação financeira.

É o núcleo do produto.

---

## Entidades

- Revenue
- Expense
- Category
- Transaction
- Account
- Attachment
- RecurringTransaction

---

## Casos de Uso

### Receitas

- Criar receita
- Editar receita
- Cancelar receita
- Confirmar recebimento

---

### Despesas

- Criar despesa
- Editar despesa
- Cancelar despesa
- Confirmar pagamento

---

### Categorias

- Criar categoria
- Editar categoria
- Arquivar categoria

---

### Fluxo de Caixa

- Calcular saldo
- Consolidar movimentações

---

### Contas Recorrentes

- Criar recorrência
- Gerar novos lançamentos

---

## Eventos

- RevenueCreated
- RevenueReceived
- ExpenseCreated
- ExpensePaid
- CashFlowUpdated

---

## Dependências

O domínio Financial depende da existência de uma empresa.

Pode utilizar clientes e fornecedores cadastrados.

---

# Domínio: CRM

## Responsabilidade

Gerenciar o relacionamento com clientes e fornecedores.

---

## Entidades

- Customer
- Supplier
- Contact
- Note

---

## Casos de Uso

### Clientes

- Criar cliente
- Editar cliente
- Arquivar cliente

### Fornecedores

- Criar fornecedor
- Editar fornecedor
- Arquivar fornecedor

---

## Eventos

- CustomerCreated
- SupplierCreated

---

## Dependências

Organization

---

# Domínio: Analytics

## Responsabilidade

Transformar dados em indicadores.

Este domínio não altera dados.

Sua função é apenas consultar e consolidar informações.

---

## Entidades

- Dashboard
- KPI
- Report
- SavedFilter

---

## Casos de Uso

- Gerar dashboard
- Gerar indicadores
- Gerar relatório
- Exportar PDF
- Exportar Excel
- Exportar CSV

---

## Eventos Consumidos

- RevenueReceived
- ExpensePaid
- CompanyCreated

---

# Domínio: Settings

## Responsabilidade

Gerenciar preferências do usuário e da empresa.

---

## Entidades

- UserPreference
- CompanyPreference
- Theme
- Locale

---

## Casos de Uso

- Alterar tema
- Alterar idioma
- Atualizar preferências
- Atualizar logotipo
- Atualizar configurações

---

# Domínio: Platform

## Responsabilidade

Fornecer serviços internos da plataforma.

---

## Entidades

- AuditLog
- Notification
- Webhook
- BackgroundJob

---

## Casos de Uso

- Registrar auditoria
- Enviar notificações
- Processar tarefas em segundo plano
- Monitorar saúde da aplicação

---

# Relacionamento entre Domínios

```text
Identity
      │
      ▼
Organization
      │
      ├──────────────┐
      ▼              ▼
Financial          CRM
      │              │
      └──────┬───────┘
             ▼
        Analytics

Settings

Platform
```

## Descrição

- Identity fornece autenticação para os demais domínios.
- Organization define o contexto da empresa.
- Financial utiliza empresas, clientes e fornecedores.
- CRM fornece dados para o módulo financeiro.
- Analytics consome informações do domínio financeiro.
- Settings mantém preferências dos usuários.
- Platform oferece serviços compartilhados.

---

# Eventos de Domínio

| Evento          | Origem       | Consumido por        |
| --------------- | ------------ | -------------------- |
| UserRegistered  | Identity     | Organization         |
| CompanyCreated  | Organization | Financial, Analytics |
| RevenueReceived | Financial    | Analytics            |
| ExpensePaid     | Financial    | Analytics            |
| CustomerCreated | CRM          | Analytics            |

---

# Princípios do Modelo de Domínio

O Monetra adota os seguintes princípios:

- Separação clara de responsabilidades.
- Baixo acoplamento entre domínios.
- Alta coesão dentro de cada domínio.
- Comunicação entre domínios por contratos bem definidos.
- Regras de negócio concentradas no domínio responsável.
- Evolução independente dos módulos sempre que possível.

---

# Glossário

| Termo       | Definição                                     |
| ----------- | --------------------------------------------- |
| Company     | Empresa que utiliza o Monetra.                |
| Member      | Usuário vinculado a uma empresa.              |
| Revenue     | Receita registrada pela empresa.              |
| Expense     | Despesa registrada pela empresa.              |
| Transaction | Movimentação financeira consolidada.          |
| Category    | Classificação de receitas ou despesas.        |
| Dashboard   | Painel com indicadores financeiros.           |
| KPI         | Indicador de desempenho do negócio.           |
| Audit Log   | Registro das operações realizadas no sistema. |
