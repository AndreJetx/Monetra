# Monetra — Product Backlog

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento consolida todas as User Stories do Monetra — MVP e futuras.

Formato adotado:

> Como **[persona]**, quero **[objetivo]** para **[benefício]**.

---

# Legenda

| Campo      | Descrição                                    |
| ---------- | -------------------------------------------- |
| **P0**     | Essencial para o MVP                         |
| **P1**     | Alta prioridade (V1)                         |
| **P2**     | Média prioridade (V1–V2)                     |
| **P3**     | Baixa prioridade (V2–V3)                     |
| **Status** | `Backlog` · `Ready` · `In Progress` · `Done` |

---

# Resumo

| Domínio      |  MVP   |   V1   |   V2   |  V3   | Total  |
| ------------ | :----: | :----: | :----: | :---: | :----: |
| Identity     |   4    |   2    |   0    |   0   |   6    |
| Organization |   2    |   2    |   1    |   0   |   5    |
| Financial    |   8    |   4    |   3    |   0   |   15   |
| CRM          |   2    |   4    |   0    |   0   |   6    |
| Analytics    |   2    |   3    |   2    |   0   |   7    |
| Settings     |   0    |   3    |   1    |   0   |   4    |
| Platform     |   0    |   3    |   4    |   2   |   9    |
| **Total**    | **18** | **21** | **11** | **2** | **52** |

---

# Identity & Access

## US-IDENTITY-001 — Cadastro de usuário

| Campo      | Valor           |
| ---------- | --------------- |
| Feature    | FT-IDENTITY-001 |
| Persona    | Owner           |
| Prioridade | P0              |
| Release    | MVP             |
| Status     | Backlog         |

**História:** Como proprietário da empresa, quero criar uma conta para começar a utilizar o Monetra.

**Critérios de aceitação:**

- Cadastro com nome, e-mail e senha.
- E-mail único no sistema.
- Senha com regras de segurança (mín. 8 caracteres, maiúscula, número).
- Usuário autenticado após cadastro.

---

## US-IDENTITY-002 — Login

| Campo      | Valor           |
| ---------- | --------------- |
| Feature    | FT-IDENTITY-002 |
| Persona    | Owner           |
| Prioridade | P0              |
| Release    | MVP             |
| Status     | Backlog         |

**História:** Como usuário, quero entrar no sistema para acessar minha empresa.

**Critérios de aceitação:**

- Login com e-mail e senha.
- Credenciais inválidas exibem mensagem de erro.
- Sessão persistida com cookie seguro.
- Redirecionamento para dashboard após login.

---

## US-IDENTITY-003 — Recuperar senha

| Campo      | Valor           |
| ---------- | --------------- |
| Feature    | FT-IDENTITY-003 |
| Persona    | Owner           |
| Prioridade | P0              |
| Release    | MVP             |
| Status     | Done            |

**História:** Como usuário, quero recuperar minha senha para voltar a acessar o sistema.

**Critérios de aceitação:**

- Envio de e-mail com link de recuperação.
- Token temporário com expiração (24h).
- Alteração segura de senha.
- Invalidação de sessões anteriores.

---

## US-IDENTITY-004 — Editar perfil

| Campo      | Valor           |
| ---------- | --------------- |
| Feature    | FT-IDENTITY-004 |
| Persona    | Owner           |
| Prioridade | P1              |
| Release    | V1              |
| Status     | Backlog         |

**História:** Como usuário, quero editar meu perfil para manter meus dados atualizados.

**Critérios de aceitação:**

- Alterar nome e foto.
- Alterar senha (requer senha atual).
- Validação de campos obrigatórios.

---

## US-IDENTITY-005 — Logout

| Campo      | Valor           |
| ---------- | --------------- |
| Feature    | FT-IDENTITY-002 |
| Persona    | Owner           |
| Prioridade | P0              |
| Release    | MVP             |
| Status     | Backlog         |

**História:** Como usuário, quero sair do sistema para encerrar minha sessão com segurança.

**Critérios de aceitação:**

- Botão de logout acessível em qualquer tela autenticada.
- Sessão invalidada no servidor.
- Redirecionamento para página de login.

---

## US-IDENTITY-006 — Gerenciar papéis (RBAC)

| Campo      | Valor           |
| ---------- | --------------- |
| Feature    | FT-IDENTITY-005 |
| Persona    | Owner           |
| Prioridade | P0              |
| Release    | MVP             |
| Status     | Done            |

**História:** Como proprietário, quero definir papéis para controlar o que cada membro pode fazer.

**Critérios de aceitação:**

- Papéis: Owner, Admin, Member, Viewer.
- Permissões verificadas em cada operação.
- Matriz de permissões conforme ADR-006.

---

# Organization

## US-ORG-001 — Criar empresa

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-ORG-001 |
| Persona    | Owner      |
| Prioridade | P0         |
| Release    | MVP        |
| Status     | Backlog    |

**História:** Como proprietário, quero cadastrar minha empresa para organizar minhas informações financeiras.

**Critérios de aceitação:**

- Nome obrigatório.
- Moeda obrigatória (BRL padrão).
- Timezone obrigatório.
- Criador recebe papel Owner automaticamente.

---

## US-ORG-002 — Convidar membro

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-ORG-003 |
| Persona    | Owner      |
| Prioridade | P1         |
| Release    | V1         |
| Status     | Backlog    |

**História:** Como proprietário, quero convidar membros para colaborar na gestão financeira.

**Critérios de aceitação:**

- Convite por e-mail.
- Definição de papel no convite.
- Convite com expiração (7 dias).
- Aceite via link único.

---

## US-ORG-003 — Trocar empresa ativa

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-ORG-004 |
| Persona    | Owner      |
| Prioridade | P0         |
| Release    | MVP        |
| Status     | Backlog    |

**História:** Como usuário com múltiplas empresas, quero alternar entre elas para gerenciar cada negócio separadamente.

**Critérios de aceitação:**

- Lista de empresas disponíveis no menu.
- Troca sem necessidade de novo login.
- Dados isolados por empresa ativa.

---

## US-ORG-004 — Gerenciar papéis de membros

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-ORG-005 |
| Persona    | Owner      |
| Prioridade | P1         |
| Release    | V1         |
| Status     | Backlog    |

**História:** Como proprietário, quero alterar o papel de um membro para ajustar suas permissões.

**Critérios de aceitação:**

- Apenas Owner pode alterar papéis.
- Owner não pode ser rebaixado.
- Alteração registrada em auditoria.

---

## US-ORG-005 — Filiais

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-ORG-002 |
| Persona    | Owner      |
| Prioridade | P2         |
| Release    | V2         |
| Status     | Backlog    |

**História:** Como proprietário, quero cadastrar filiais para organizar operações por unidade.

**Critérios de aceitação:**

- Cadastro de filial vinculada à empresa.
- Lançamentos financeiros associáveis à filial.
- Relatórios consolidados e por filial.

---

# Financial

## US-FIN-001 — Cadastrar receita

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-FIN-001        |
| Persona    | Financial Manager |
| Prioridade | P0                |
| Release    | MVP               |
| Status     | Done              |

**História:** Como responsável financeiro, quero registrar uma receita para acompanhar entradas de dinheiro.

**Critérios de aceitação:**

- Valor, categoria e data obrigatórios.
- Cliente opcional.
- Status inicial: pendente.
- Descrição opcional.

---

## US-FIN-002 — Confirmar recebimento

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-FIN-001        |
| Persona    | Financial Manager |
| Prioridade | P0                |
| Release    | MVP               |
| Status     | Done              |

**História:** Como responsável financeiro, quero confirmar o recebimento para atualizar o fluxo de caixa.

**Critérios de aceitação:**

- Alterar status para recebido.
- Registrar data de recebimento.
- Atualizar saldo e indicadores.
- Registrar auditoria.

---

## US-FIN-003 — Cadastrar despesa

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-FIN-002        |
| Persona    | Financial Manager |
| Prioridade | P0                |
| Release    | MVP               |
| Status     | Done              |

**Critérios de aceitação:**

- Valor, categoria e data de vencimento obrigatórios.
- Fornecedor opcional.
- Status inicial: pendente.

---

## US-FIN-004 — Confirmar pagamento

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-FIN-002        |
| Persona    | Financial Manager |
| Prioridade | P0                |
| Release    | MVP               |
| Status     | Done              |

**História:** Como responsável financeiro, quero confirmar o pagamento para atualizar o fluxo de caixa.

**Critérios de aceitação:**

- Alterar status para pago.
- Registrar data de pagamento.
- Atualizar saldo e indicadores.

---

## US-FIN-005 — Editar lançamento

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-FIN-005        |
| Persona    | Financial Manager |
| Prioridade | P1                |
| Release    | MVP               |
| Status     | Backlog           |

**História:** Como responsável financeiro, quero editar um lançamento para corrigir informações.

**Critérios de aceitação:**

- Edição de todos os campos exceto ID.
- Lançamentos confirmados exigem confirmação para edição.
- Auditoria da alteração.

---

## US-FIN-006 — Excluir lançamento

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-FIN-005 |
| Persona    | Admin      |
| Prioridade | P1         |
| Release    | MVP        |
| Status     | Backlog    |

**História:** Como administrador, quero excluir um lançamento incorreto.

**Critérios de aceitação:**

- Confirmação obrigatória.
- Apenas Admin e Owner podem excluir.
- Auditoria da exclusão.

---

## US-FIN-007 — Arquivar lançamento

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-FIN-005        |
| Persona    | Financial Manager |
| Prioridade | P2                |
| Release    | V1                |
| Status     | Backlog           |

**História:** Como responsável financeiro, quero arquivar lançamentos antigos para manter a lista organizada.

**Critérios de aceitação:**

- Lançamento arquivado não aparece na listagem padrão.
- Possibilidade de restaurar.
- Não afeta cálculos de saldo.

---

## US-FIN-008 — Gerenciar categorias

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-FIN-004 |
| Persona    | Admin      |
| Prioridade | P1         |
| Release    | MVP        |
| Status     | Done       |

**História:** Como administrador, quero gerenciar categorias para organizar receitas e despesas.

**Critérios de aceitação:**

- CRUD de categorias de receita e despesa.
- Categorias padrão criadas automaticamente.
- Não permitir exclusão de categoria em uso.

---

## US-FIN-009 — Criar recorrência

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-FIN-006        |
| Persona    | Financial Manager |
| Prioridade | P2                |
| Release    | V1                |
| Status     | Backlog           |

**História:** Como responsável financeiro, quero criar lançamentos recorrentes para automatizar contas fixas.

**Critérios de aceitação:**

- Frequência: semanal, mensal, anual.
- Geração automática via background job.
- Possibilidade de pausar ou cancelar.

---

## US-FIN-010 — Consultar fluxo de caixa

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-FIN-003 |
| Persona    | Owner      |
| Prioridade | P0         |
| Release    | MVP        |
| Status     | Done       |

**História:** Como proprietário, quero visualizar o fluxo de caixa para entender entradas e saídas.

**Critérios de aceitação:**

- Visão diária, semanal, mensal e anual.
- Saldo calculado a partir de movimentações confirmadas.
- Filtro por período e categoria.

---

## US-FIN-011 — Anexar comprovante

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-FIN-007        |
| Persona    | Financial Manager |
| Prioridade | P2                |
| Release    | V1                |
| Status     | Backlog           |

**História:** Como responsável financeiro, quero anexar comprovantes aos lançamentos para manter documentação.

**Critérios de aceitação:**

- Upload de PDF, JPG e PNG.
- Limite de 5MB por arquivo.
- Visualização e download do anexo.

---

## US-FIN-012 — Contas bancárias

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-FIN-008 |
| Persona    | Admin      |
| Prioridade | P2         |
| Release    | V1         |
| Status     | Backlog    |

**História:** Como administrador, quero cadastrar contas bancárias para segmentar movimentações.

**Critérios de aceitação:**

- CRUD de contas bancárias.
- Saldo calculado por conta.
- Associar lançamentos a uma conta.

---

## US-FIN-013 — Centro de custos

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-FIN-009 |
| Persona    | Admin      |
| Prioridade | P3         |
| Release    | V2         |
| Status     | Backlog    |

**História:** Como administrador, quero segmentar despesas por centro de custos para análise detalhada.

---

## US-FIN-014 — Importar planilha

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-FIN-010 |
| Persona    | Owner      |
| Prioridade | P3         |
| Release    | V2         |
| Status     | Backlog    |

**História:** Como proprietário, quero importar dados de planilha para migrar do Excel.

---

## US-FIN-015 — Etiquetas em lançamentos

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-FIN-005        |
| Persona    | Financial Manager |
| Prioridade | P2                |
| Release    | V2                |
| Status     | Backlog           |

**História:** Como responsável financeiro, quero etiquetar lançamentos para facilitar buscas e filtros.

---

# CRM

## US-CRM-001 — Cadastrar cliente

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-CRM-001        |
| Persona    | Financial Manager |
| Prioridade | P0                |
| Release    | MVP               |
| Status     | Backlog           |

**História:** Como responsável financeiro, quero cadastrar clientes para vincular às receitas.

**Critérios de aceitação:**

- Nome obrigatório.
- E-mail, telefone e documento opcionais.
- Vinculação a receitas.

---

## US-CRM-002 — Editar cliente

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-CRM-001        |
| Persona    | Financial Manager |
| Prioridade | P1                |
| Release    | V1                |
| Status     | Backlog           |

---

## US-CRM-003 — Arquivar cliente

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-CRM-001 |
| Persona    | Admin      |
| Prioridade | P1         |
| Release    | V1         |
| Status     | Backlog    |

---

## US-CRM-004 — Cadastrar fornecedor

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-CRM-002        |
| Persona    | Financial Manager |
| Prioridade | P0                |
| Release    | MVP               |
| Status     | Backlog           |

**História:** Como responsável financeiro, quero cadastrar fornecedores para vincular às despesas.

---

## US-CRM-005 — Editar fornecedor

| Campo      | Valor             |
| ---------- | ----------------- |
| Feature    | FT-CRM-002        |
| Persona    | Financial Manager |
| Prioridade | P1                |
| Release    | V1                |
| Status     | Backlog           |

---

## US-CRM-006 — Arquivar fornecedor

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-CRM-002 |
| Persona    | Admin      |
| Prioridade | P1         |
| Release    | V1         |
| Status     | Backlog    |

---

# Analytics

## US-AN-001 — Visualizar dashboard

| Campo      | Valor     |
| ---------- | --------- |
| Feature    | FT-AN-001 |
| Persona    | Owner     |
| Prioridade | P0        |
| Release    | MVP       |
| Status     | Backlog   |

**História:** Como proprietário, quero visualizar um dashboard para acompanhar a saúde financeira.

**Critérios de aceitação:**

- KPIs: receita, despesa, lucro, saldo em caixa.
- Gráficos de evolução mensal.
- Tempo de carregamento inferior a 2 segundos.

---

## US-AN-002 — Gerar relatório financeiro

| Campo      | Valor     |
| ---------- | --------- |
| Feature    | FT-AN-002 |
| Persona    | Owner     |
| Prioridade | P1        |
| Release    | MVP       |
| Status     | Backlog   |

**História:** Como proprietário, quero gerar relatórios por período para análise detalhada.

---

## US-AN-003 — Exportar PDF

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-AN-004  |
| Persona    | Accountant |
| Prioridade | P1         |
| Release    | V1         |
| Status     | Backlog    |

---

## US-AN-004 — Exportar Excel

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-AN-004  |
| Persona    | Accountant |
| Prioridade | P2         |
| Release    | V1         |
| Status     | Backlog    |

---

## US-AN-005 — Exportar CSV

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-AN-004  |
| Persona    | Accountant |
| Prioridade | P2         |
| Release    | V1         |
| Status     | Backlog    |

---

## US-AN-006 — Indicadores personalizados

| Campo      | Valor     |
| ---------- | --------- |
| Feature    | FT-AN-003 |
| Persona    | Owner     |
| Prioridade | P2        |
| Release    | V2        |
| Status     | Backlog   |

**História:** Como proprietário, quero configurar indicadores personalizados para acompanhar métricas específicas.

---

## US-AN-007 — Dashboard em tempo real

| Campo      | Valor     |
| ---------- | --------- |
| Feature    | FT-AN-001 |
| Persona    | Owner     |
| Prioridade | P2        |
| Release    | V2        |
| Status     | Backlog   |

**História:** Como proprietário, quero que o dashboard atualize em tempo real quando houver novos lançamentos.

---

# Settings

## US-SET-001 — Alterar perfil

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-SET-001 |
| Persona    | Owner      |
| Prioridade | P1         |
| Release    | V1         |
| Status     | Backlog    |

---

## US-SET-002 — Alterar tema

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-SET-003 |
| Persona    | Employee   |
| Prioridade | P2         |
| Release    | V1         |
| Status     | Backlog    |

**História:** Como usuário, quero alternar entre tema claro e escuro para conforto visual.

---

## US-SET-003 — Atualizar dados da empresa

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-SET-002 |
| Persona    | Admin      |
| Prioridade | P1         |
| Release    | V1         |
| Status     | Backlog    |

---

## US-SET-004 — Configurações regionais

| Campo      | Valor      |
| ---------- | ---------- |
| Feature    | FT-SET-004 |
| Persona    | Admin      |
| Prioridade | P3         |
| Release    | V2         |
| Status     | Backlog    |

**História:** Como administrador, quero configurar idioma e formato de data da empresa.

---

# Platform

## US-PLAT-001 — Registrar auditoria

| Campo      | Valor       |
| ---------- | ----------- |
| Feature    | FT-PLAT-001 |
| Persona    | Admin       |
| Prioridade | P1          |
| Release    | V1          |
| Status     | Backlog     |

**História:** Como administrador, quero que ações críticas sejam registradas para rastreabilidade.

---

## US-PLAT-002 — Consultar logs

| Campo      | Valor       |
| ---------- | ----------- |
| Feature    | FT-PLAT-002 |
| Persona    | Admin       |
| Prioridade | P2          |
| Release    | V1          |
| Status     | Backlog     |

---

## US-PLAT-003 — Receber notificações

| Campo      | Valor       |
| ---------- | ----------- |
| Feature    | FT-PLAT-003 |
| Persona    | Owner       |
| Prioridade | P2          |
| Release    | V1          |
| Status     | Backlog     |

**História:** Como proprietário, quero receber alertas de contas vencidas e vencendo.

---

## US-PLAT-004 — Webhooks

| Campo      | Valor       |
| ---------- | ----------- |
| Feature    | FT-PLAT-004 |
| Persona    | Admin       |
| Prioridade | P2          |
| Release    | V2          |
| Status     | Backlog     |

---

## US-PLAT-005 — API pública

| Campo      | Valor       |
| ---------- | ----------- |
| Feature    | FT-PLAT-005 |
| Persona    | Admin       |
| Prioridade | P2          |
| Release    | V2          |
| Status     | Backlog     |

---

## US-PLAT-006 — Background jobs

| Campo      | Valor       |
| ---------- | ----------- |
| Feature    | FT-PLAT-006 |
| Persona    | —           |
| Prioridade | P2          |
| Release    | V2          |
| Status     | Backlog     |

**História:** Como sistema, preciso processar tarefas assíncronas (recorrências, exports, notificações).

---

## US-PLAT-007 — Health checks

| Campo      | Valor       |
| ---------- | ----------- |
| Feature    | FT-PLAT-006 |
| Persona    | —           |
| Prioridade | P2          |
| Release    | V2          |
| Status     | Backlog     |

---

## US-PLAT-008 — Open Finance

| Campo      | Valor       |
| ---------- | ----------- |
| Feature    | FT-PLAT-007 |
| Persona    | Owner       |
| Prioridade | P3          |
| Release    | V3          |
| Status     | Backlog     |

**História:** Como proprietário, quero conectar minha conta bancária para importar transações automaticamente.

---

## US-PLAT-009 — App mobile

| Campo      | Valor   |
| ---------- | ------- |
| Feature    | —       |
| Persona    | Owner   |
| Prioridade | P3      |
| Release    | V3      |
| Status     | Backlog |

**História:** Como proprietário, quero acessar o Monetra pelo celular para consultar indicadores em qualquer lugar.

---

# Definition of Done

Uma User Story será considerada concluída quando:

- Todos os critérios de aceitação forem atendidos.
- Código revisado.
- Testes automatizados aprovados.
- Documentação atualizada.
- Sem erros críticos.
- Deploy homologado.
