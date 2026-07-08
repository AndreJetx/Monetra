# Monetra — Personas

> **Versão:** 1.0.0
> **Status:** Draft
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento descreve os principais perfis de usuários do Monetra.

Cada persona representa um grupo de usuários com objetivos, necessidades, comportamentos e permissões diferentes dentro da plataforma.

As personas servirão como base para:

- Experiência do usuário (UX)
- Priorização de funcionalidades
- Definição de permissões
- Histórias de usuário
- Roadmap do produto

---

# Visão Geral

O Monetra possui quatro personas principais.

| Persona           | Papel                       |
| ----------------- | --------------------------- |
| Owner             | Proprietário da empresa     |
| Financial Manager | Responsável pelo financeiro |
| Employee          | Funcionário                 |
| Accountant        | Contador                    |

---

# Persona 01 — Owner

## Descrição

É o proprietário da empresa.

Possui acesso administrativo e é responsável pelas decisões estratégicas.

Normalmente utiliza o sistema diariamente para acompanhar indicadores financeiros.

---

## Perfil

| Campo                   | Valor      |
| ----------------------- | ---------- |
| Idade                   | 28–60 anos |
| Conhecimento Técnico    | Baixo      |
| Conhecimento Financeiro | Médio      |
| Frequência de Uso       | Diária     |

---

## Objetivos

- Saber quanto a empresa possui em caixa.
- Controlar receitas e despesas.
- Identificar desperdícios.
- Tomar decisões baseadas em indicadores.
- Acompanhar crescimento da empresa.

---

## Dores

- Utiliza planilhas.
- Não sabe exatamente quanto lucra.
- Esquece contas importantes.
- Possui pouco tempo para gestão financeira.

---

## Funcionalidades mais utilizadas

### Identity

- Login

### Organization

- Empresa
- Usuários
- Convites

### Financial

- Receitas
- Despesas
- Fluxo de Caixa

### Analytics

- Dashboard
- Relatórios

### Settings

- Configurações

---

## Permissões

Acesso total.

---

# Persona 02 — Financial Manager

## Descrição

Responsável pelas operações financeiras da empresa.

Realiza lançamentos diariamente.

---

## Perfil

| Campo                   | Valor      |
| ----------------------- | ---------- |
| Idade                   | 22–55 anos |
| Conhecimento Técnico    | Médio      |
| Conhecimento Financeiro | Alto       |
| Frequência de Uso       | Muito Alta |

---

## Objetivos

- Registrar movimentações.
- Manter dados organizados.
- Evitar atrasos.
- Emitir relatórios.

---

## Dores

- Grande volume de lançamentos.
- Retrabalho.
- Falta de padronização.

---

## Funcionalidades mais utilizadas

### Financial

- Receitas
- Despesas
- Categorias
- Fluxo de Caixa

### CRM

- Clientes
- Fornecedores

### Analytics

- Relatórios

---

## Permissões

Não administra usuários.

Não altera configurações críticas.

---

# Persona 03 — Employee

## Descrição

Funcionário da empresa.

Possui acesso limitado.

Utiliza apenas funcionalidades necessárias para sua função.

---

## Perfil

| Campo                   | Valor    |
| ----------------------- | -------- |
| Conhecimento Financeiro | Básico   |
| Frequência de Uso       | Eventual |

---

## Objetivos

- Registrar movimentações autorizadas.
- Consultar informações permitidas.

---

## Dores

- Interfaces complexas.
- Excesso de informações.

---

## Funcionalidades

Dependerão da função atribuída.

Exemplos:

- Registrar despesas.
- Consultar clientes.
- Consultar fornecedores.

---

## Permissões

Limitadas por RBAC.

---

# Persona 04 — Accountant

## Descrição

Profissional responsável por acompanhar informações financeiras da empresa.

Normalmente possui acesso apenas para consulta.

---

## Perfil

| Campo                   | Valor      |
| ----------------------- | ---------- |
| Conhecimento Financeiro | Muito Alto |
| Frequência de Uso       | Semanal    |

---

## Objetivos

- Consultar movimentações.
- Emitir relatórios.
- Conferir lançamentos.

---

## Dores

- Dados inconsistentes.
- Falta de organização.

---

## Funcionalidades mais utilizadas

### Analytics

- Relatórios

### Financial

- Consulta de receitas

- Consulta de despesas

---

## Permissões

Somente leitura.

---

# Matriz de Permissões

| Módulo       | Owner | Financial  | Employee | Accountant |
| ------------ | :---: | :--------: | :------: | :--------: |
| Identity     |   ✔   |   Perfil   |  Perfil  |   Perfil   |
| Organization |   ✔   | Visualizar |    ❌    |     ❌     |
| Financial    |   ✔   |     ✔      | Parcial  |  Consulta  |
| CRM          |   ✔   |     ✔      | Parcial  |  Consulta  |
| Analytics    |   ✔   |     ✔      | Parcial  |     ✔      |
| Settings     |   ✔   |  Parcial   |    ❌    |     ❌     |
| Platform     |   ✔   |     ❌     |    ❌    |     ❌     |

---

# Jornada Resumida

## Owner

Entrar

↓

Consultar Dashboard

↓

Analisar Indicadores

↓

Tomar Decisões

---

## Financial Manager

Entrar

↓

Registrar Movimentações

↓

Conferir Fluxo de Caixa

↓

Emitir Relatórios

---

## Employee

Entrar

↓

Executar Tarefa

↓

Sair

---

## Accountant

Entrar

↓

Consultar Dados

↓

Exportar Relatórios

↓

Sair

---

# Necessidades por Domínio

| Domínio      | Necessidade Principal    |
| ------------ | ------------------------ |
| Identity     | Acesso seguro            |
| Organization | Estrutura da empresa     |
| Financial    | Controle financeiro      |
| CRM          | Gestão de relacionamento |
| Analytics    | Indicadores              |
| Settings     | Personalização           |
| Platform     | Confiabilidade           |

---

# Critérios de Design

O produto deve ser desenvolvido considerando que a maioria dos usuários:

- Não possui conhecimento técnico.
- Não é especialista em contabilidade.
- Utiliza notebook ou desktop durante o trabalho.
- Precisa registrar informações rapidamente.
- Espera respostas imediatas do sistema.

---

# Decisões de Produto

Com base nas personas, o Monetra adotará as seguintes diretrizes:

- Interfaces simples e objetivas.
- Poucos cliques para registrar movimentações.
- Dashboard como página inicial após o login.
- Navegação organizada por módulos de negócio.
- Controle de acesso baseado em papéis (RBAC).
- Prioridade para velocidade e clareza em vez de excesso de funcionalidades.
