# ADR-004: Auth.js

**Status:** Aceito  
**Data:** 07/07/2026  
**Autores:** Monetra Team

---

## Contexto

O domínio **Identity & Access** exige autenticação segura para um SaaS multiempresa, incluindo:

- Cadastro e login de usuários;
- Gerenciamento de sessões;
- Recuperação e alteração de senha;
- Convites de membros para organizações;
- Integração nativa com Next.js App Router;
- Proteção CSRF e hash seguro de senhas.

A solução precisa integrar-se ao modelo de autorização RBAC sem acoplar regras de negócio ao provedor de autenticação.

---

## Decisão

Adotar **Auth.js** (anteriormente NextAuth.js) como biblioteca de autenticação do Monetra.

Configuração prevista:

- Provider de credenciais (email/senha) para MVP;
- Adapter Prisma para persistência de usuários e sessões;
- Middleware Next.js para proteção de rotas;
- Callbacks para injetar contexto de organização e papéis na sessão;
- Validação de entrada com Zod antes de qualquer operação de auth.

A lógica de autorização (RBAC) permanece no domínio — Auth.js cuida apenas de **autenticação** e gestão de sessão.

---

## Consequências

### Positivas

- Integração oficial e madura com Next.js App Router.
- Suporte a múltiplos providers (OAuth futuro: Google, GitHub).
- Adapter Prisma alinha com a stack já definida.
- Proteção CSRF embutida.
- Comunidade ativa e documentação extensa.

### Negativas

- Curva de aprendizado para callbacks e configuração de sessão customizada.
- Versão v5 (Auth.js) tem breaking changes em relação ao NextAuth v4.
- Papéis RBAC exigem extensão manual da sessão via callbacks.

---

## Alternativas Consideradas

| Alternativa   | Motivo da rejeição                                           |
| ------------- | ------------------------------------------------------------ |
| Clerk         | Serviço terceirizado; menos controle e custo em produção     |
| Supabase Auth | Acopla a Supabase; projeto usa VPS + PostgreSQL próprio      |
| Lucia Auth    | Menor ecossistema; mais configuração manual                  |
| JWT manual    | Reinventa solução madura; maior risco de falhas de segurança |

---

## Referências

- `docs/12-security.md`
- `docs/02-product-requirements.md` — módulo Identity & Access
- `docs/04-personas.md`
