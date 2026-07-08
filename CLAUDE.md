# Monetra — AI Development Guide

> Este documento define as regras obrigatórias para qualquer IA ou desenvolvedor que contribua com o projeto Monetra.

---

# Objetivo

O Monetra é um projeto de portfólio desenvolvido com qualidade de produção.

Toda decisão técnica deve priorizar:

- Escalabilidade
- Organização
- Legibilidade
- Segurança
- Testabilidade
- Manutenibilidade

Não desenvolver funcionalidades apenas para "funcionar".

Sempre priorizar arquitetura.

---

# Stack Oficial

## Front-end

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## Back-end

- Next.js Route Handlers
- Prisma ORM
- PostgreSQL

---

## Infraestrutura

- Docker
- Docker Compose
- GitHub Actions
- VPS Linux
- Nginx ou Caddy

---

## Testes

- Vitest
- Playwright

---

# Arquitetura

O projeto utiliza uma arquitetura modular inspirada em Domain-Driven Design (DDD).

Cada módulo representa um domínio de negócio independente.

Nunca organizar código por tipo global (components, services, hooks).

Sempre organizar por domínio.

---

# Domínios Oficiais

- Identity & Access
- Organization
- Financial
- CRM
- Analytics
- Settings
- Platform

Nenhum novo domínio deve ser criado sem justificativa arquitetural.

---

# Estrutura do Projeto

```text
src/

app/

features/

shared/

middleware.ts
```

Cada domínio deverá seguir a estrutura abaixo:

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

# Responsabilidade das Camadas

## application

Casos de uso.

Coordena regras de negócio.

Não contém código de interface.

---

## domain

Entidades.

Value Objects.

Eventos.

Interfaces de Repositórios.

Regras de negócio.

Não depende de frameworks.

---

## infrastructure

Prisma.

Banco.

Integrações.

Implementações dos repositórios.

Serviços externos.

---

## presentation

Componentes React.

Formulários.

Páginas.

Hooks de UI.

Estados locais.

---

## shared

Schemas.

Constantes.

Tipos.

Utilitários.

Helpers exclusivos do módulo.

---

## tests

Testes do módulo.

---

# Organização

Nunca criar pastas globais como:

❌ services

❌ repositories

❌ hooks

❌ utils

Esses itens pertencem ao domínio correspondente.

A pasta `src/shared` deve conter apenas recursos realmente compartilhados entre múltiplos domínios.

---

# Fluxo de Desenvolvimento

Toda funcionalidade deve seguir a sequência:

Product Backlog

↓

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

Nenhuma implementação deve começar sem User Story definida.

---

# Regras de Código

- Utilizar TypeScript estrito.
- Evitar `any`.
- Preferir composição à herança.
- Utilizar funções pequenas e coesas.
- Evitar duplicação de código.
- Manter responsabilidade única por arquivo.

---

# Convenções de Nome

## Componentes

PascalCase

Exemplo:

```text
RevenueForm.tsx
```

---

## Hooks

camelCase iniciado por "use"

```text
useRevenue.ts
```

---

## Casos de Uso

Verbo + Entidade

```text
CreateRevenueUseCase.ts
```

---

## Repositórios

```text
RevenueRepository.ts
```

---

## Interfaces

Prefixo "I"

```text
IRevenueRepository.ts
```

---

## DTOs

Sufixo DTO

```text
CreateRevenueDTO.ts
```

---

## Schemas

Sufixo Schema

```text
CreateRevenueSchema.ts
```

---

# Banco de Dados

Nunca acessar Prisma diretamente fora da camada de infraestrutura.

Toda operação deve passar por um repositório.

---

# APIs

Toda rota deve delegar a lógica para um Caso de Uso.

Nunca implementar regras de negócio diretamente nas rotas.

---

# Componentes

Priorizar componentes pequenos.

Máximo recomendado:

- 200 linhas por componente
- 100 linhas por hook
- 300 linhas por página

Componentes grandes devem ser divididos.

---

# Testes

Cada Caso de Uso deve possuir testes unitários.

Fluxos críticos devem possuir testes de integração.

Principais jornadas do usuário devem possuir testes E2E.

---

# Segurança

Nunca confiar em dados vindos do cliente.

Sempre validar utilizando Zod.

Nunca retornar informações sensíveis.

Senhas devem ser armazenadas utilizando hash seguro.

---

# Commits

Seguir Conventional Commits.

Exemplos:

```text
feat(financial): add revenue creation

fix(identity): correct login validation

refactor(crm): simplify customer repository

docs(api): update endpoints

test(financial): add revenue tests
```

---

# Pull Requests

Todo PR deve:

- Compilar sem erros.
- Passar nos testes.
- Atualizar documentação quando necessário.
- Não introduzir código morto.

---

# Documentação

A documentação é parte do produto.

Sempre manter sincronizados:

- Product Requirements
- User Stories
- API
- Banco de Dados
- Arquitetura

---

# Princípios Arquiteturais

- Alta coesão.
- Baixo acoplamento.
- Feature-Based Architecture.
- Modularidade.
- Separação de responsabilidades.
- Clean Code.
- SOLID quando aplicável.
- Código orientado ao domínio.

---

# Filosofia do Projeto

O Monetra deve parecer um produto SaaS em produção.

Toda decisão deve responder à pergunta:

> "Essa solução continuaria adequada se o projeto tivesse 100 mil usuários e uma equipe de desenvolvimento trabalhando nele?"

Se a resposta for "não", reavalie a implementação antes de prosseguir.
