# Monetra — Product Vision

**Versão:** 1.0.0  
**Status:** Draft  
**Última atualização:** 07/07/2026

---

# 1. Visão Geral

## 1.1 Resumo

O **Monetra** é uma plataforma SaaS de gestão financeira desenvolvida para micro e pequenas empresas que desejam controlar receitas, despesas, fluxo de caixa e indicadores financeiros de forma simples, segura e intuitiva.

O sistema substitui planilhas e controles manuais por uma solução moderna baseada na web, permitindo que empresários acompanhem a saúde financeira do negócio em tempo real.

O foco principal é oferecer uma experiência intuitiva para usuários sem conhecimento contábil, priorizando rapidez no lançamento de movimentações e clareza na visualização dos resultados.

---

# 2. Problema

## 2.1 Contexto

Grande parte das pequenas empresas realiza seu controle financeiro utilizando:

- Planilhas Excel
- Google Sheets
- Cadernos
- Aplicativos genéricos
- Controle totalmente manual

Esse cenário dificulta a gestão financeira e aumenta significativamente o risco de erros.

---

## 2.2 Principais Problemas

- Falta de controle do fluxo de caixa.
- Esquecimento de contas a pagar.
- Esquecimento de contas a receber.
- Mistura das finanças pessoais com as empresariais.
- Ausência de indicadores financeiros.
- Baixa organização das movimentações.
- Dependência do contador para consultas simples.

---

## 2.3 Perguntas que o sistema deve responder

O Monetra deve permitir que o usuário responda rapidamente perguntas como:

- Quanto minha empresa faturou este mês?
- Quanto foi o lucro líquido?
- Qual categoria gera mais despesas?
- Quanto tenho em caixa hoje?
- Existem contas vencidas?
- Quanto tenho para receber?
- Qual cliente mais compra?
- Qual fornecedor gera maior custo?

---

# 3. Oportunidade

Existe uma grande quantidade de pequenos negócios que ainda não possuem uma ferramenta de gestão financeira adequada.

O Monetra busca atender esse público oferecendo uma solução que seja:

- Fácil de utilizar
- Rápida
- Responsiva
- Segura
- Escalável
- Baseada em indicadores

---

# 4. Missão

Permitir que pequenos empresários tenham controle completo sobre suas finanças sem depender de conhecimentos técnicos em contabilidade.

---

# 5. Visão

Ser uma plataforma de referência em gestão financeira para pequenas empresas, oferecendo simplicidade, confiabilidade e escalabilidade.

---

# 6. Valores

- Simplicidade
- Transparência
- Segurança
- Organização
- Performance
- Evolução contínua

---

# 7. Público-Alvo

## Persona Primária

Micro e pequenos empresários.

Exemplos:

- Restaurantes
- Salões de beleza
- Oficinas
- Academias
- Clínicas
- Lojas
- Prestadores de serviço
- E-commerces

---

## Persona Secundária

Usuários responsáveis pela administração financeira.

Exemplos:

- Assistente Financeiro
- Secretária
- Administrador
- Contador

---

# 8. Proposta de Valor

O Monetra oferece uma forma simples e organizada de controlar toda a movimentação financeira da empresa em um único lugar.

O sistema fornece:

- Controle financeiro
- Fluxo de caixa
- Indicadores
- Relatórios
- Dashboard
- Gestão de clientes
- Gestão de fornecedores
- Contas recorrentes

---

# 9. Objetivos do Produto

## Objetivos de Negócio

- Centralizar todas as movimentações financeiras.
- Reduzir erros de controle.
- Melhorar a tomada de decisão.
- Facilitar o acompanhamento da saúde financeira.

---

## Objetivos do Usuário

O usuário deverá conseguir:

- Registrar receitas.
- Registrar despesas.
- Controlar pagamentos.
- Controlar recebimentos.
- Consultar indicadores.
- Emitir relatórios.
- Acompanhar fluxo de caixa.

---

# 10. Escopo do MVP

## Autenticação

- Cadastro
- Login
- Recuperação de senha
- Logout

---

## Dashboard

- Saldo Atual
- Receitas do mês
- Despesas do mês
- Lucro
- Últimas movimentações
- Contas vencidas
- Contas a vencer
- Gráficos

---

## Receitas

- CRUD completo
- Categorias
- Clientes
- Status

---

## Despesas

- CRUD completo
- Categorias
- Fornecedores
- Status

---

## Categorias

CRUD completo.

---

## Clientes

CRUD completo.

---

## Fornecedores

CRUD completo.

---

## Fluxo de Caixa

- Diário
- Semanal
- Mensal

---

## Relatórios

- Receitas
- Despesas
- Fluxo de Caixa
- PDF
- Excel
- CSV

---

# 11. Fora do Escopo

Não fazem parte do MVP:

- Nota Fiscal
- Controle de Estoque
- Controle Fiscal
- Integração Bancária
- PIX Automático
- Emissão de Boletos
- Aplicativo Mobile
- Inteligência Artificial
- Integração com ERP

---

# 12. Diferenciais

O projeto será desenvolvido com foco em boas práticas modernas.

- Arquitetura escalável
- Componentização
- Clean Code
- Responsividade
- Dark Mode
- Multiempresa
- Multiusuário
- Dashboard em tempo real
- Docker
- API documentada
- Testes automatizados

---

# 13. Indicadores de Sucesso (KPIs)

| Indicador                | Meta          |
| ------------------------ | ------------- |
| Cadastro de movimentação | < 30 segundos |
| Tempo de carregamento    | < 2 segundos  |
| Disponibilidade          | > 99,5%       |
| Cobertura de testes      | > 80%         |
| Lighthouse Performance   | > 90          |
| Lighthouse Accessibility | > 90          |

---

# 14. Restrições

- Plataforma Web
- PostgreSQL
- TypeScript
- Docker
- Next.js App Router
- Prisma ORM

---

# 15. Stack Tecnológica

## Front-end

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod

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

# 16. Roadmap de Alto Nível

## MVP

- Controle Financeiro
- Dashboard
- Fluxo de Caixa
- Relatórios

---

## V1

- Contas Recorrentes
- Metas Financeiras
- Auditoria
- Notificações

---

## V2

- Importação CSV
- Dashboard em Tempo Real
- API Pública
- Webhooks

---

## V3

- Integração Bancária
- Aplicativo Mobile
- Inteligência Artificial
- Previsão de Fluxo de Caixa

---

# 17. Próximos Documentos

- 02-prd.md
- 03-personas.md
- 04-user-stories.md
- 05-business-rules.md
- 06-user-flow.md
- 07-wireframes.md
- 08-design-system.md
- 09-database.md
- 10-prisma-schema.md
- 11-api.md
- 12-backend-architecture.md
- 13-frontend-architecture.md
- 14-authentication.md
- 15-testing.md
- 16-deployment.md
