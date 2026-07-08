# Monetra — Architecture Guide

> Technical Architecture Documentation  
> Version: 1.0.0

---

# Objetivo

Este documento apresenta a arquitetura técnica do Monetra.

Seu objetivo é permitir que qualquer desenvolvedor compreenda rapidamente:

- Estrutura do projeto
- Organização dos módulos
- Fluxo da aplicação
- Camadas da arquitetura
- Comunicação entre módulos
- Padrões utilizados
- Boas práticas obrigatórias

Este documento complementa a documentação localizada em `/docs`.

---

# Visão Geral

Monetra é um SaaS de gestão financeira para micro e pequenas empresas.

O projeto utiliza uma arquitetura modular inspirada em Domain-Driven Design (DDD), organizada por domínios de negócio.

Princípios adotados:

- Modularidade
- Alta coesão
- Baixo acoplamento
- Separação de responsabilidades
- Escalabilidade
- Testabilidade

---

# Stack Tecnológica

## Front-end

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Back-end

- Next.js Route Handlers
- Server Actions (quando apropriado)
- Prisma ORM
- PostgreSQL

## Infraestrutura

- Docker
- Docker Compose
- GitHub Actions
- VPS Linux
- Nginx ou Caddy

## Testes

- Vitest
- Playwright

---

# Organização da Documentação

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

# Arquitetura Geral

```text
                   Browser

                      │

                      ▼

          Next.js App Router

                      │

          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
     Server Actions          Route Handlers

          │                       │
          └───────────┬───────────┘
                      ▼

              Application Layer

                      ▼

                Domain Layer

                      ▼

           Repository Interfaces

                      ▼

          Infrastructure Layer

                      ▼

                 PostgreSQL
```

---

# Organização do Código

```text
src/

app/
features/
shared/
middleware.ts
```

---

# Estrutura dos Módulos

Cada domínio possui sua própria estrutura.

Exemplo:

```text
financial/

application/
domain/
infrastructure/
presentation/
shared/
tests/
```

Todos os módulos seguem exatamente esse padrão.

---

# Responsabilidade das Camadas

## Presentation

Responsável por:

- Pages
- Layouts
- Componentes React
- Formulários
- Hooks de interface
- Estados locais

Nunca contém regras de negócio.

---

## Application

Coordena os casos de uso.

Exemplos:

- Criar Receita
- Efetuar Login
- Convidar Usuário

Responsável por orquestrar o fluxo entre domínio e infraestrutura.

---

## Domain

É o núcleo do sistema.

Contém:

- Entidades
- Value Objects
- Eventos
- Interfaces de Repositórios
- Regras de negócio

Não depende de frameworks.

---

## Infrastructure

Responsável por:

- Prisma
- PostgreSQL
- APIs externas
- Implementações dos repositórios
- Serviços de terceiros

---

## Shared

Contém apenas recursos compartilhados dentro do módulo.

Exemplos:

- Schemas
- Types
- Constantes
- Helpers

---

## Tests

Todos os testes relacionados ao domínio.

---

# Domínios

O sistema possui sete domínios.

```text
Identity
Organization
Financial
CRM
Analytics
Settings
Platform
```

Cada domínio é independente.

---

# Comunicação entre Domínios

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

Regras:

- Nunca acessar diretamente outro domínio.
- Comunicação por contratos e interfaces.
- Eventos de domínio quando apropriado.

---

# Fluxo de uma Requisição

Exemplo: criar uma receita.

```text
Usuário

↓

Formulário React

↓

Server Action

↓

CreateRevenueUseCase

↓

RevenueRepository

↓

Prisma

↓

PostgreSQL
```

O caminho inverso é seguido para retornar a resposta.

---

# Fluxo de Desenvolvimento

Toda funcionalidade segue esta ordem:

```text
Epic

↓

Feature

↓

User Story

↓

Caso de Uso

↓

Implementação

↓

Testes

↓

Documentação
```

Nenhuma implementação deve iniciar sem User Story.

---

# Estrutura do Backlog

```text
Epic

↓

Feature

↓

User Story

↓

Task
```

Essa estrutura permite rastrear toda a evolução do produto.

---

# Convenções

## Componentes

PascalCase

```text
RevenueForm.tsx
```

## Hooks

```text
useRevenue.ts
```

## Casos de Uso

```text
CreateRevenueUseCase.ts
```

## Repositórios

```text
RevenueRepository.ts
```

## DTO

```text
CreateRevenueDTO.ts
```

## Schemas

```text
CreateRevenueSchema.ts
```

---

# Banco de Dados

Regras obrigatórias:

- Prisma apenas na infraestrutura.
- Nunca acessar Prisma diretamente em componentes.
- Nunca acessar Prisma diretamente em Use Cases.
- Sempre utilizar Repositórios.

---

# APIs

As rotas devem conter apenas:

- autenticação;
- validação de entrada;
- chamada do caso de uso;
- formatação da resposta.

Regras de negócio pertencem exclusivamente ao domínio.

---

# Testes

Estratégia:

```text
Unitários

↓

Integração

↓

End-to-End
```

Todo caso de uso deve possuir testes unitários.

Fluxos críticos devem possuir testes E2E.

---

# Segurança

- Validação com Zod.
- Hash seguro para senhas.
- RBAC.
- Proteção CSRF.
- Proteção XSS.
- Proteção contra SQL Injection.
- Auditoria de ações críticas.

---

# Deploy

Ambientes:

```text
Local

↓

Development

↓

Staging

↓

Production
```

Deploy automatizado utilizando GitHub Actions.

---

# Qualidade

Ferramentas recomendadas:

- ESLint
- Prettier
- Husky
- lint-staged

---

# Objetivos Arquiteturais

O projeto deve priorizar:

- Simplicidade
- Escalabilidade
- Clareza
- Modularidade
- Reutilização
- Testabilidade

---

# O que evitar

Nunca:

- Criar componentes gigantes.
- Misturar regras de negócio com UI.
- Duplicar lógica.
- Criar dependências circulares.
- Acessar outro domínio diretamente.
- Ignorar testes.
- Ignorar documentação.

---

# Evolução da Arquitetura

A arquitetura foi projetada para suportar futuras funcionalidades, como:

- Aplicativo mobile
- API pública
- Open Finance
- Integrações externas
- Webhooks
- Filas de processamento
- Multi-tenant
- Escalabilidade horizontal

Sem necessidade de reestruturação significativa do código.

---

# Filosofia

O Monetra não é um projeto de CRUD.

Ele deve ser desenvolvido como um produto SaaS real.

Toda decisão técnica deve responder à seguinte pergunta:

> Esta solução continuaria adequada se o sistema tivesse milhares de usuários, múltiplas empresas e uma equipe de desenvolvimento mantendo o código por vários anos?

Se a resposta for **não**, a implementação deve ser reavaliada.
