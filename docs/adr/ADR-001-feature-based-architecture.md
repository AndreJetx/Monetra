# ADR-001: Feature-Based Architecture

**Status:** Aceito  
**Data:** 07/07/2026  
**Autores:** Monetra Team

---

## Contexto

O Monetra é um SaaS multiempresa com sete domínios de negócio (Identity, Organization, Financial, CRM, Analytics, Settings e Platform). O projeto precisa de uma arquitetura que:

- Facilite a manutenção por um desenvolvedor solo ou equipe pequena;
- Permita evolução incremental por domínio;
- Mantenha alta coesão e baixo acoplamento;
- Suporte separação clara entre regras de negócio e infraestrutura;
- Seja compreensível para fins de portfólio profissional.

Alternativas consideradas incluíam arquitetura em camadas tradicional (controllers/services/repositories globais) e microserviços.

---

## Decisão

Adotar **Feature-Based Architecture** inspirada em Domain-Driven Design (DDD), organizando o código em módulos de negócio dentro de `src/features/`.

Cada módulo seguirá a estrutura interna:

```text
features/<domain>/
├── application/      # Casos de uso
├── domain/           # Entidades, value objects, interfaces
├── infrastructure/   # Prisma, repositórios, integrações
├── presentation/     # Componentes, hooks, formulários
├── shared/           # Types, schemas, constantes do módulo
└── tests/
```

A camada `app/` do Next.js ficará responsável apenas por roteamento, layouts e composição de páginas.

---

## Consequências

### Positivas

- Código organizado por contexto de negócio, facilitando localização de funcionalidades.
- Domínios independentes reduzem impacto de mudanças.
- Camadas internas permitem testar regras de negócio sem dependência de frameworks.
- Escala bem conforme novos domínios são adicionados.

### Negativas

- Maior verbosidade inicial (pastas e arquivos por módulo).
- Risco de duplicação se `shared/` dos módulos não for bem governado.
- Curva de aprendizado para quem está acostumado a CRUD monolítico.

---

## Alternativas Consideradas

| Alternativa             | Motivo da rejeição                                                  |
| ----------------------- | ------------------------------------------------------------------- |
| Camadas globais (MVC)   | Dificulta isolamento por domínio; arquivos crescem desordenadamente |
| Microserviços           | Complexidade desproporcional para MVP e projeto solo                |
| Clean Architecture pura | Excesso de abstração para o escopo atual                            |

---

## Referências

- `docs/00-project-context.md`
- `docs/08-Software Architecture.md`
- `README-ARCHITECTURE.md`
