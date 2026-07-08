# Monetra — Product Requirements Document (PRD)

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Índice

1. Objetivo
2. Escopo
3. Stakeholders
4. Módulos do Produto
5. Requisitos Funcionais
6. Requisitos Não Funcionais
7. Regras Gerais
8. Dependências
9. Restrições
10. Roadmap

---

# 1. Objetivo

O Monetra é uma plataforma SaaS de gestão financeira desenvolvida para micro e pequenas empresas.

Seu objetivo é centralizar todas as operações financeiras em um único sistema, permitindo controle completo do fluxo de caixa, organização financeira e geração de indicadores para tomada de decisão.

---

# 2. Escopo

## Incluído no MVP

- Autenticação
- Empresas
- Usuários
- Receitas
- Despesas
- Categorias
- Clientes
- Fornecedores
- Dashboard
- Fluxo de Caixa
- Relatórios

---

## Fora do Escopo

- Nota Fiscal
- Estoque
- Open Finance
- PIX automático
- Aplicativo Mobile
- IA
- Controle Fiscal

---

# 3. Stakeholders

| Papel         | Responsabilidade       |
| ------------- | ---------------------- |
| Product Owner | Define requisitos      |
| Desenvolvedor | Implementação          |
| Usuário Final | Utilização do sistema  |
| Contador      | Consultoria financeira |

---

# 4. Módulos do Produto

O Monetra é dividido em sete domínios de negócio independentes.

---

# 4.1 Identity & Access

Responsável por autenticação, autorização e gerenciamento de usuários.

## Funcionalidades

- Cadastro de usuários
- Login
- Logout
- Recuperação de senha
- Alteração de senha
- Sessões
- Convites
- Controle de acesso (RBAC)

## Objetivos

Garantir autenticação segura e gerenciamento de permissões.

---

# 4.2 Organization

Responsável pela estrutura organizacional.

## Funcionalidades

- Cadastro de empresas
- Configurações da empresa
- Convite de membros
- Gestão de equipes
- Papéis
- Multiempresa

## Objetivos

Permitir que um mesmo usuário participe de várias empresas mantendo isolamento completo dos dados.

---

# 4.3 Financial

Principal módulo do sistema.

## Funcionalidades

### Receitas

- Cadastro
- Edição
- Exclusão
- Recebimento
- Categorias
- Cliente

### Despesas

- Cadastro
- Pagamento
- Fornecedor
- Categorias

### Categorias

- Receita
- Despesa

### Fluxo de Caixa

- Diário
- Semanal
- Mensal
- Anual

### Contas Recorrentes

- Mensal
- Semanal
- Anual

### Anexos

- Comprovantes
- Notas

## Objetivos

Controlar toda movimentação financeira da empresa.

---

# 4.4 CRM

Relacionamento com clientes e fornecedores.

## Clientes

- Cadastro
- Histórico financeiro
- Contatos

## Fornecedores

- Cadastro
- Histórico
- Contatos

---

# 4.5 Analytics

Responsável pelos indicadores.

## Dashboard

- Saldo Atual
- Receitas
- Despesas
- Lucro
- Contas vencidas

## Gráficos

- Receita x Despesa
- Fluxo de Caixa
- Categorias
- Evolução Mensal

## Relatórios

- Financeiro
- Fluxo de Caixa
- Clientes
- Fornecedores

Exportação

- PDF
- CSV
- XLSX

---

# 4.6 Settings

Configurações do sistema.

## Perfil

- Nome
- Foto
- Senha

## Preferências

- Tema
- Idioma
- Formato Monetário

## Empresa

- Dados cadastrais
- Logo
- Configurações

---

# 4.7 Platform

Recursos internos.

## Auditoria

Registrar:

- Quem criou
- Quem editou
- Quem excluiu
- Data
- IP

## Logs

- Erros
- Eventos

## Health Check

- Banco
- API
- Sistema

---

# 5. Requisitos Funcionais

## RF001

O sistema deverá permitir autenticação utilizando e-mail e senha.

---

## RF002

O sistema deverá permitir múltiplas empresas por usuário.

---

## RF003

Cada empresa deverá possuir isolamento completo dos dados.

---

## RF004

Usuários deverão possuir papéis distintos.

---

## RF005

Receitas deverão impactar o saldo somente quando recebidas.

---

## RF006

Despesas deverão impactar o saldo somente quando pagas.

---

## RF007

O Dashboard deverá ser atualizado automaticamente após alterações financeiras.

---

## RF008

O sistema deverá permitir exportação de relatórios.

---

## RF009

O sistema deverá registrar auditoria das operações críticas.

---

## RF010

Todas as funcionalidades deverão respeitar permissões RBAC.

---

# 6. Requisitos Não Funcionais

## Performance

- Resposta inferior a 500 ms em consultas comuns.

---

## Segurança

- Hash de senhas.
- Sessões seguras.
- Proteção CSRF.
- Proteção XSS.
- Proteção contra SQL Injection.

---

## Escalabilidade

Arquitetura modular baseada em Features.

---

## Compatibilidade

- Chrome
- Firefox
- Edge
- Safari

---

## Responsividade

Desktop

Tablet

Mobile

---

## Infraestrutura

- Docker
- PostgreSQL
- Prisma
- GitHub Actions

---

# 7. Regras Gerais

- Cada empresa possui seus próprios dados.
- Nenhum usuário pode acessar dados de outra empresa.
- Exclusões críticas deverão ser confirmadas.
- Operações financeiras deverão ser auditadas.
- O saldo sempre será calculado a partir das movimentações confirmadas.

---

# 8. Dependências

- Next.js
- PostgreSQL
- Prisma
- Auth.js
- Tailwind CSS
- shadcn/ui
- Docker

---

# 9. Restrições

- Plataforma exclusivamente Web.
- Banco PostgreSQL.
- Código 100% TypeScript.
- Interface responsiva.
- Arquitetura Feature-Based.

---

# 10. Roadmap

## MVP

- Identity
- Organization
- Financial
- CRM
- Analytics

---

## V1

- Auditoria
- Notificações
- Contas recorrentes
- Upload de anexos

---

## V2

- API Pública
- Webhooks
- Dashboard em tempo real

---

## V3

- Integração Bancária
- Open Finance
- Aplicativo Mobile
- Inteligência Artificial
