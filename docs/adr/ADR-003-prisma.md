# ADR-003: Prisma ORM

**Status:** Aceito  
**Data:** 07/07/2026  
**Autores:** Monetra Team

---

## Contexto

Com PostgreSQL definido como banco de dados, o projeto precisa de uma camada de acesso a dados que:

- Gere types TypeScript a partir do schema;
- Gerencie migrations de forma versionada;
- Permita implementação do padrão Repository na camada de infraestrutura;
- Não vaze dependências de ORM para o domínio ou casos de uso;
- Ofereça boa Developer Experience em projeto Next.js + TypeScript.

---

## Decisão

Adotar **Prisma ORM** como camada de acesso a dados, restrita exclusivamente à camada `infrastructure/` de cada módulo.

Regras obrigatórias:

- Prisma **nunca** é acessado diretamente em componentes React, Server Actions ou casos de uso.
- Toda persistência passa por interfaces de repositório definidas no `domain/`.
- Implementações concretas ficam em `infrastructure/repositories/`.
- O schema Prisma centralizado em `prisma/schema.prisma` reflete o modelo de domínio.

Fluxo de dados:

```text
Use Case → Repository Interface → Prisma Repository → PostgreSQL
```

---

## Consequências

### Positivas

- Type-safety end-to-end com geração automática de tipos.
- Migrations versionadas e reproduzíveis.
- Prisma Studio facilita inspeção de dados em desenvolvimento.
- Abstração via repositórios mantém domínio desacoplado do ORM.

### Negativas

- Camada extra de abstração (interfaces + implementações).
- Prisma Client aumenta bundle se importado incorretamente fora da infraestrutura.
- Queries muito complexas podem exigir SQL raw.

---

## Alternativas Consideradas

| Alternativa             | Motivo da rejeição                                               |
| ----------------------- | ---------------------------------------------------------------- |
| Drizzle ORM             | Prisma tem ecossistema mais maduro e melhor DX para o escopo     |
| TypeORM                 | Menor integração com Next.js App Router e types menos confiáveis |
| Knex.js (query builder) | Sem geração automática de types; mais boilerplate                |
| SQL raw                 | Perde type-safety e aumenta risco de erros                       |

---

## Referências

- `docs/09-Database Design.md`
- `docs/03-domain-model.md`
- `README-ARCHITECTURE.md` — seção Banco de Dados
