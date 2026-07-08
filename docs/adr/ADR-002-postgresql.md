# ADR-002: PostgreSQL

**Status:** Aceito  
**Data:** 07/07/2026  
**Autores:** Monetra Team

---

## Contexto

O Monetra precisa de um banco de dados relacional para armazenar dados financeiros multiempresa com:

- Integridade referencial entre entidades (empresas, usuários, transações, categorias);
- Suporte a transações ACID para operações financeiras;
- Consultas complexas para relatórios e dashboards;
- Isolamento de dados por organização (multi-tenancy);
- Compatibilidade com deploy em VPS via Docker.

---

## Decisão

Adotar **PostgreSQL 16** como banco de dados principal do sistema.

O ambiente de desenvolvimento utilizará Docker Compose (`docker-compose.yml`) com:

- Imagem: `postgres:16-alpine`
- Porta: `5432`
- Volume persistente para dados locais

---

## Consequências

### Positivas

- Confiabilidade e maturidade para dados financeiros críticos.
- Suporte robusto a constraints, índices, views e funções.
- Excelente integração com Prisma ORM.
- Amplamente suportado em ambientes de produção (VPS, cloud).
- JSONB disponível para campos flexíveis quando necessário.

### Negativas

- Requer gerenciamento de migrations e backups.
- Consumo de recursos superior a SQLite para desenvolvimento local.
- Configuração de multi-tenancy (por `organization_id`) deve ser rigorosa.

---

## Alternativas Consideradas

| Alternativa        | Motivo da rejeição                                                   |
| ------------------ | -------------------------------------------------------------------- |
| MySQL/MariaDB      | PostgreSQL oferece melhor suporte a tipos avançados e consistência   |
| SQLite             | Inadequado para SaaS multiempresa em produção                        |
| MongoDB            | Modelo relacional é mais natural para dados financeiros estruturados |
| Supabase (managed) | Projeto prioriza controle total via VPS e Docker                     |

---

## Referências

- `docker-compose.yml`
- `docs/09-Database Design.md`
- `docs/03-domain-model.md`
