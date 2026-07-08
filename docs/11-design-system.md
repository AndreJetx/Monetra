# Monetra — Design System

> **Versão:** 1.0.0  
> **Status:** Draft  
> **Última atualização:** 07/07/2026

---

# Objetivo

Este documento define o design system do Monetra: princípios visuais, tokens de design, componentes, padrões de layout e diretrizes de interface.

Baseado na identidade de marca e nas necessidades das personas definidas em [04-personas.md](04-personas.md).

---

# Princípios de Design

| Princípio          | Descrição                                     |
| ------------------ | --------------------------------------------- |
| **Simplicidade**   | Interface limpa, sem elementos desnecessários |
| **Clareza**        | Informação financeira legível e inequívoca    |
| **Velocidade**     | Poucos cliques para ações frequentes          |
| **Confiança**      | Visual profissional que transmite segurança   |
| **Acessibilidade** | Contraste adequado, navegação por teclado     |

> "Controle inteligente para o seu negócio." — Monetra

---

# Stack de UI

| Tecnologia      | Uso                               |
| --------------- | --------------------------------- |
| Tailwind CSS v4 | Utility-first styling             |
| shadcn/ui       | Componentes acessíveis (Radix UI) |
| Geist Sans      | Tipografia principal              |
| Geist Mono      | Valores numéricos e código        |
| Lucide React    | Ícones                            |

---

# Tokens de Cor

## Tema Claro (padrão)

| Token                  | Valor     | Uso                        |
| ---------------------- | --------- | -------------------------- |
| `--background`         | `#ffffff` | Fundo principal            |
| `--foreground`         | `#171717` | Texto principal            |
| `--primary`            | `#0f766e` | Ações primárias (teal-700) |
| `--primary-foreground` | `#ffffff` | Texto em botão primário    |
| `--secondary`          | `#f4f4f5` | Fundos secundários         |
| `--muted`              | `#f4f4f5` | Texto secundário           |
| `--muted-foreground`   | `#71717a` | Labels, hints              |
| `--destructive`        | `#dc2626` | Ações destrutivas          |
| `--border`             | `#e4e4e7` | Bordas                     |
| `--ring`               | `#0f766e` | Focus ring                 |

## Tema Escuro

| Token          | Valor     | Uso                        |
| -------------- | --------- | -------------------------- |
| `--background` | `#0a0a0a` | Fundo principal            |
| `--foreground` | `#ededed` | Texto principal            |
| `--primary`    | `#14b8a6` | Ações primárias (teal-500) |
| `--secondary`  | `#27272a` | Fundos secundários         |
| `--border`     | `#27272a` | Bordas                     |

## Cores Semânticas (Financeiro)

| Token       | Cor                    | Uso                               |
| ----------- | ---------------------- | --------------------------------- |
| `--success` | `#16a34a` (green-600)  | Receitas, saldo positivo          |
| `--warning` | `#ca8a04` (yellow-600) | Pendente, vencendo                |
| `--danger`  | `#dc2626` (red-600)    | Despesas, vencido, saldo negativo |
| `--info`    | `#2563eb` (blue-600)   | Informações neutras               |

---

# Tipografia

## Famílias

```css
--font-sans: "Geist", system-ui, sans-serif;
--font-mono: "Geist Mono", monospace;
```

## Escala

| Nome      | Tamanho         | Peso | Uso                  |
| --------- | --------------- | ---- | -------------------- |
| `display` | 36px / 2.25rem  | 700  | Títulos de dashboard |
| `h1`      | 30px / 1.875rem | 600  | Título de página     |
| `h2`      | 24px / 1.5rem   | 600  | Seções               |
| `h3`      | 20px / 1.25rem  | 600  | Subseções            |
| `body`    | 16px / 1rem     | 400  | Texto padrão         |
| `small`   | 14px / 0.875rem | 400  | Labels, metadados    |
| `xs`      | 12px / 0.75rem  | 400  | Badges, hints        |

## Valores monetários

- Sempre usar `font-mono` para valores financeiros.
- Formato: `R$ 1.234,56` (pt-BR).
- Valores positivos: cor `--success`.
- Valores negativos: cor `--danger`.

---

# Espaçamento

Base: **4px** (0.25rem).

| Token      | Valor | Uso                      |
| ---------- | ----- | ------------------------ |
| `space-1`  | 4px   | Gaps mínimos             |
| `space-2`  | 8px   | Entre ícone e texto      |
| `space-3`  | 12px  | Padding interno compacto |
| `space-4`  | 16px  | Padding padrão           |
| `space-6`  | 24px  | Entre seções             |
| `space-8`  | 32px  | Entre blocos             |
| `space-12` | 48px  | Margens de página        |

---

# Border Radius

| Token          | Valor  | Uso             |
| -------------- | ------ | --------------- |
| `rounded-sm`   | 4px    | Badges, tags    |
| `rounded-md`   | 6px    | Inputs, botões  |
| `rounded-lg`   | 8px    | Cards           |
| `rounded-xl`   | 12px   | Modais, dialogs |
| `rounded-full` | 9999px | Avatares, pills |

---

# Componentes Base (shadcn/ui)

## Button

| Variante      | Uso                           |
| ------------- | ----------------------------- |
| `default`     | Ação primária (Salvar, Criar) |
| `secondary`   | Ação secundária (Cancelar)    |
| `destructive` | Excluir, ações irreversíveis  |
| `outline`     | Ações terciárias              |
| `ghost`       | Ações em tabelas e menus      |
| `link`        | Links inline                  |

**Tamanhos:** `sm`, `default`, `lg`, `icon`.

## Input / Select / Textarea

- Label acima do campo.
- Mensagem de erro abaixo em `--destructive`.
- Placeholder em `--muted-foreground`.
- Focus ring em `--ring`.

## Card

```text
┌─────────────────────────────┐
│ CardHeader: título + ação   │
├─────────────────────────────┤
│ CardContent: conteúdo        │
├─────────────────────────────┤
│ CardFooter: ações (opcional) │
└─────────────────────────────┘
```

Usado em: KPIs do dashboard, formulários, detalhes.

## Table

- Header com fundo `--secondary`.
- Rows com hover sutil.
- Ações na última coluna (ícones ghost).
- Paginação abaixo da tabela.
- Responsivo: cards em mobile.

## Dialog / AlertDialog

- Dialog: formulários e detalhes.
- AlertDialog: confirmações destrutivas (excluir lançamento).

## Badge

| Variante  | Uso                |
| --------- | ------------------ |
| `default` | Status neutro      |
| `success` | Recebido, Pago     |
| `warning` | Pendente           |
| `danger`  | Vencido, Cancelado |
| `outline` | Categorias, tags   |

## Toast (Sonner)

- Sucesso: operação concluída.
- Erro: falha com mensagem clara.
- Posição: canto inferior direito.

---

# Padrões de Layout

## App Shell

```text
┌──────────┬────────────────────────────────┐
│          │ Header (64px)                  │
│ Sidebar  ├────────────────────────────────┤
│ (240px)  │                                │
│          │ Main Content                   │
│          │ (max-width: 1280px, centered)  │
│          │                                │
└──────────┴────────────────────────────────┘
```

## Page Container

```tsx
<div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
  <PageHeader title="Receitas" action={<Button>+ Nova</Button>} />
  <PageContent>...</PageContent>
</div>
```

## Dashboard Grid

```text
┌──────────┬──────────┬──────────┬──────────┐
│  Saldo   │ Receita  │ Despesa  │  Lucro   │  ← KPI Cards (4 col)
├──────────┴──────────┴──────────┴──────────┤
│  Gráfico Receita x Despesa (2/3)  │ KPIs │  ← Charts
├───────────────────────────────────┴──────┤
│  Últimas Movimentações                    │  ← Table
└──────────────────────────────────────────┘
```

---

# Padrões Financeiros

## Status Badge

| Status    | Label     | Variante |
| --------- | --------- | -------- |
| PENDING   | Pendente  | warning  |
| RECEIVED  | Recebido  | success  |
| PAID      | Pago      | success  |
| CANCELLED | Cancelado | outline  |
| OVERDUE   | Vencido   | danger   |

## Formatação de Valores

```typescript
const formatCurrency = (value: number, currency = "BRL") =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
```

## Formatação de Datas

```typescript
const formatDate = (date: Date) => new Intl.DateTimeFormat("pt-BR").format(date);
```

---

# Empty States

Componente padrão quando não há dados:

- Ilustração ou ícone centralizado.
- Título descritivo.
- Texto de orientação.
- CTA primário (ex: "+ Nova Receita").

---

# Formulários

## Regras

- Campos obrigatórios marcados com asterisco (*).
- Validação inline após blur.
- Erros de servidor exibidos via toast.
- Botão submit desabilitado durante loading.
- Spinner no botão durante submissão.

## Layout de formulário financeiro

```text
Valor *          [R$ 0,00        ]
Categoria *      [Selecionar  ▼  ]
Data *           [07/07/2026     ]
Cliente          [Selecionar  ▼  ]  (opcional)
Descrição        [               ]  (opcional)
                 [Cancelar] [Salvar]
```

---

# Ícones (Lucide)

| Contexto       | Ícone             |
| -------------- | ----------------- |
| Dashboard      | `LayoutDashboard` |
| Receitas       | `TrendingUp`      |
| Despesas       | `TrendingDown`    |
| Fluxo de Caixa | `ArrowLeftRight`  |
| Clientes       | `Users`           |
| Fornecedores   | `Truck`           |
| Relatórios     | `BarChart3`       |
| Configurações  | `Settings`        |
| Nova           | `Plus`            |
| Editar         | `Pencil`          |
| Excluir        | `Trash2`          |
| Exportar       | `Download`        |

---

# Acessibilidade

- Contraste mínimo WCAG AA (4.5:1 para texto).
- Focus visible em todos os elementos interativos.
- Labels associados a inputs (`htmlFor`).
- `aria-label` em botões de ícone.
- Navegação completa por teclado.
- Mensagens de erro associadas via `aria-describedby`.

---

# Responsividade

| Breakpoint   | Comportamento                           |
| ------------ | --------------------------------------- |
| `< 768px`    | Sidebar drawer, cards em vez de tabelas |
| `768–1023px` | Sidebar colapsada (ícones)              |
| `≥ 1024px`   | Layout completo com sidebar fixa        |

Desktop-first, mas funcional em mobile.

---

# Referências

- [Marca.md](Marca.md)
- [04-personas.md](04-personas.md)
- [07-information-architecture.md](07-information-architecture.md)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com)
