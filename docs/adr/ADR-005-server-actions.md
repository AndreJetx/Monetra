# ADR-005: Server Actions

**Status:** Aceito  
**Data:** 07/07/2026  
**Autores:** Monetra Team

---

## Contexto

O Monetra utiliza Next.js App Router e precisa definir como o front-end comunica mutações e operações de leitura com o back-end.

Opções disponíveis no ecossistema Next.js:

- **Server Actions** — funções assíncronas executadas no servidor, invocadas diretamente de componentes React;
- **Route Handlers** — endpoints HTTP REST em `app/api/`;
- **tRPC** — RPC type-safe com camada adicional.

O projeto prioriza simplicidade, type-safety e alinhamento com o fluxo React → Use Case → Repository.

---

## Decisão

Adotar **Server Actions** como mecanismo principal para mutações e operações iniciadas pela interface (formulários, ações de usuário).

**Route Handlers** serão utilizados quando necessário para:

- Integrações externas (webhooks);
- Endpoints consumidos por clientes não-React;
- APIs públicas documentadas em `docs/10-api-specification.md`.

Fluxo padrão para mutações:

```text
Formulário React
      ↓
Server Action (validação Zod + auth)
      ↓
Use Case (application/)
      ↓
Repository (infrastructure/)
      ↓
PostgreSQL
```

Regras:

- Server Actions contêm apenas validação, autenticação e delegação ao caso de uso.
- Nenhuma regra de negócio na Server Action.
- Retorno tipado com padrão `ActionResult<T>` (sucesso/erro).

---

## Consequências

### Positivas

- Menos boilerplate que REST para operações internas da UI.
- Type-safety entre cliente e servidor sem API layer extra.
- Progressive Enhancement — formulários funcionam sem JavaScript.
- Alinhado com as convenções do Next.js App Router.

### Negativas

- Server Actions não substituem API REST para integrações externas.
- Debugging pode ser menos transparente que endpoints HTTP explícitos.
- Acoplamento entre UI e servidor — mudanças exigem coordenação.

---

## Alternativas Consideradas

| Alternativa                     | Motivo da rejeição                                 |
| ------------------------------- | -------------------------------------------------- |
| Route Handlers para tudo        | Mais verboso para operações internas de formulário |
| tRPC                            | Camada adicional desnecessária para o escopo atual |
| GraphQL                         | Complexidade desproporcional para MVP              |
| Client-side fetch para API REST | Perde type-safety e progressive enhancement        |

---

## Referências

- `README-ARCHITECTURE.md` — Fluxo de uma Requisição
- `docs/10-api-specification.md`
- `docs/08-Software Architecture.md`
