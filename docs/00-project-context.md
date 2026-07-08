# Monetra — Contexto Geral do Projeto

> **Versão:** 1.0.0  
> **Última atualização:** 07/07/2026

---

# Objetivo do Projeto

O Monetra é um projeto de portfólio desenvolvido com o objetivo de simular um produto SaaS real de gestão financeira para micro e pequenas empresas.

O foco do projeto não é apenas entregar funcionalidades, mas demonstrar conhecimento em:

- Arquitetura de Software
- Engenharia de Software
- Desenvolvimento Full Stack
- Modelagem de Domínio
- Documentação Técnica
- Escalabilidade
- Boas práticas
- Testes
- DevOps

O projeto deve aparentar ser um produto desenvolvido por uma equipe profissional.

---

# Filosofia do Projeto

O Monetra **não será desenvolvido como um CRUD tradicional**.

Toda a arquitetura será orientada ao domínio do negócio.

A prioridade será:

1. Organização
2. Escalabilidade
3. Legibilidade
4. Baixo acoplamento
5. Alta coesão
6. Facilidade para manutenção
7. Experiência do desenvolvedor (Developer Experience)

---

# Objetivos do Portfólio

O projeto deverá demonstrar domínio em:

- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma ORM
- Docker
- CI/CD
- Testes Automatizados
- Arquitetura Modular
- APIs REST
- Design System
- Segurança
- Deploy em Produção

---

# Arquitetura

Foi decidido utilizar uma arquitetura inspirada em Domain-Driven Design (DDD), mantendo a simplicidade necessária para um projeto individual.

A organização do código será baseada em módulos de negócio (Feature-Based Architecture) com separação interna por responsabilidades.

Cada módulo possuirá camadas próprias para domínio, aplicação, infraestrutura e apresentação.

---

# Domínios do Sistema

O sistema será dividido em sete domínios principais.

## Identity & Access

Responsável por:

- Cadastro
- Login
- Sessões
- Recuperação de senha
- Convites
- Papéis
- Permissões

---

## Organization

Responsável por:

- Empresas
- Equipes
- Membros
- Filiais
- Multiempresa

---

## Financial

Núcleo do sistema.

Responsável por:

- Receitas
- Despesas
- Fluxo de Caixa
- Categorias
- Contas Bancárias
- Recorrências
- Centro de Custos
- Etiquetas
- Anexos

---

## CRM

Responsável por:

- Clientes
- Fornecedores
- Contatos
- Histórico
- Observações

---

## Analytics

Responsável por:

- Dashboard
- KPIs
- Gráficos
- Relatórios
- Exportações

---

## Settings

Responsável por:

- Perfil
- Preferências
- Idioma
- Tema
- Configurações da empresa

---

## Platform

Responsável por:

- Auditoria
- Logs
- Jobs
- Notificações
- Webhooks
- API Pública
- Monitoramento

---

# Estrutura Geral da Documentação

```text
docs/

00-project-context.md
01-product-vision.md
02-product-requirements.md
03-domain-model.md
04-personas.md
05-user-stories.md
06-business-rules.md
07-information-architecture.md
08-software-architecture.md
09-database-design.md
10-api-specification.md
11-design-system.md
12-security.md
13-testing.md
14-deployment.md
15-roadmap.md
16-development-guide.md

backlog/

01-epics.md
02-features.md
03-product-backlog.md
04-release-plan.md
05-prioritization.md
```

---

# Estrutura Esperada do Código

```text
src/

app/

features/

shared/

middleware.ts
```

Cada módulo seguirá a estrutura:

```text
feature/

application/
domain/
infrastructure/
presentation/
shared/
tests/
```

---

# Organização dos Módulos

Cada domínio deverá ser totalmente independente.

A comunicação entre módulos deverá ocorrer por contratos bem definidos.

Nenhum domínio deverá acessar diretamente detalhes internos de outro domínio.

O baixo acoplamento é um dos principais objetivos arquiteturais.

---

# Estratégia de Desenvolvimento

O desenvolvimento seguirá a seguinte ordem:

1. Identity
2. Organization
3. Financial
4. CRM
5. Analytics
6. Settings
7. Platform

Cada módulo deverá estar funcional antes do início do próximo.

---

# Estratégia de Documentação

Antes da implementação de qualquer funcionalidade deverão existir documentos suficientes para descrevê-la.

A documentação será tratada como parte do produto.

---

# Estratégia de Backlog

Foi decidido utilizar uma organização semelhante à adotada por empresas de produto.

Hierarquia:

```text
Product

↓

Epic

↓

Feature

↓

User Story

↓

Task

↓

Código
```

Essa estrutura será utilizada para rastrear toda a evolução do projeto.

---

# User Stories

As User Stories utilizarão identificadores únicos.

Exemplos:

US-IDENTITY-001

US-FIN-023

US-CRM-008

US-AN-011

Cada história possuirá:

- Prioridade
- Critérios de aceitação
- Persona
- Domínio
- Dependências

---

# Backlog

Além dos documentos principais haverá uma pasta específica para gerenciamento do produto.

```text
docs/backlog/

01-epics.md
02-features.md
03-product-backlog.md
04-release-plan.md
05-prioritization.md
```

O objetivo é simular a gestão de produto de uma empresa real.

---

# Decisões Arquiteturais

Durante o planejamento foram tomadas as seguintes decisões:

- Arquitetura orientada ao domínio.
- Organização por módulos de negócio.
- Estrutura Feature-Based.
- Separação por camadas dentro de cada módulo.
- Comunicação entre domínios por contratos.
- Banco de dados modelado a partir do domínio.
- API modelada a partir do domínio.
- Desenvolvimento guiado por documentação.

---

# Tecnologias

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend

- Next.js Route Handlers
- Prisma ORM
- PostgreSQL

Infraestrutura

- Docker
- Docker Compose
- GitHub Actions
- VPS Linux
- Nginx ou Caddy

Testes

- Vitest
- Playwright

---

# Objetivo Final

Ao final do projeto o Monetra deverá parecer um SaaS em produção.

O repositório deverá demonstrar:

- Arquitetura profissional.
- Organização empresarial.
- Código limpo.
- Documentação completa.
- Testes automatizados.
- Deploy funcional.
- Escalabilidade.
- Facilidade de manutenção.

O projeto deverá servir como principal item do portfólio Full Stack.
