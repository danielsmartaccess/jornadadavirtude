# Jornada da Virtude — MVP v2.0

Plataforma de desenvolvimento humano e formação filosófica: conhecer as virtudes, investigar a própria relação com elas, praticar, registrar e revisar. Fundamentada nos Documentos Oficiais 01 a 08 do projeto (filosofia prática, sete dimensões, taxonomia de 48 virtudes, Conselho de Sabedoria).

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS 4 · React Router · Supabase (conta opcional) · Vitest · Playwright.

## Como rodar

Requisitos: Node 20 ou superior.

```bash
npm install
npm run dev          # http://localhost:5173
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Typecheck + build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm test` | Testes unitários (Vitest) |
| `npm run test:e2e` | Testes ponta a ponta (Playwright; usa o Chrome instalado) |
| `npm run typecheck` | Verificação de tipos |

## O que o MVP faz

- **Seis áreas** (Doc. 06): Início, Minha Jornada, Virtudes, Conselho, Diário e Histórico, mais Configurações.
- **Jornada** com ciclo de vida DRAFT → ACTIVE ⇄ PAUSED → COMPLETED e arquivamento como atributo próprio (Doc. 07, seção 9); sete etapas revisitáveis; investigação em quatro blocos; exercícios recomendados por virtude, repetíveis; revisões periódicas e revisão final com síntese pessoal.
- **Catálogo:** 48 virtudes em 8 famílias, 7 dimensões, relações virtude × dimensão (D1/D2), 56 exercícios, distinções entre virtudes próximas, 26 pensadores e 6 tradições.
- **Conselho de Sabedoria** sem inteligência artificial: reconhece a situação, sugere virtudes e dimensões como hipóteses, seleciona 2 a 5 perspectivas só quando há relação registrada na base, mostra fontes, limites, convergências e divergências, e nunca atribui falas a pensadores.
- **Preservação dos dados da versão anterior:** a chave `jornada-virtude-v2` do `localStorage` e os arquivos `.json` exportados pela v1/v3 são convertidos automaticamente.
- **Privacidade:** tudo fica no navegador. Conta opcional (Supabase) sincroniza com Row Level Security; exportar, importar e apagar dados em Configurações.
- **Sem notas morais:** os indicadores são contagens de atividades registradas e dizem isso na tela.

## Arquitetura (Doc. 08)

```
src/
  domain/          regras e tipos puros (sem React, navegador ou banco)
  application/     casos de uso (funções puras), store e contratos de persistência
  infrastructure/  localStorage, saneamento/migração, Supabase, exportação
  features/        telas por módulo (home, journey, virtues, council, diary, history, settings)
  components/      componentes reutilizáveis (ui.tsx)
  app/             layout, rotas, hooks de ligação
  data/            base de conhecimento em JSON (catálogo separado dos dados pessoais, ADR-015)
  shared/          utilidades
tests/unit         regras de negócio, catálogo, Conselho, migração
tests/e2e          fluxo completo do MVP
supabase/migrations  esquema com RLS para a conta opcional
```

Decisões registradas: persistência local em `localStorage` (volume de kilobytes, gravação atômica; a troca por IndexedDB é feita só em `infrastructure/localRepository.ts`, atrás do contrato `UserDataRepository`); identificadores UUID; dados com `schemaVersion` e envelope de exportação.

## Conta opcional e sincronização (Supabase)

1. No SQL Editor do projeto Supabase, execute `supabase/migrations/20261113180000_user_data.sql` (tabelas, RLS e as funções `jv_push_state`, `jv_pull_state` e `jv_delete_my_data`).
2. Em *Authentication → URL Configuration*, inclua a URL do site (a do Vercel e `http://localhost:5173`).
3. O projeto e a chave **publishable** estão em `src/config.ts`. A chave é pública por definição; o acesso aos dados é protegido por RLS. Nunca coloque a chave `secret`/`service_role` no front-end. Para outro projeto, copie `.env.example` para `.env`.

Sem esses passos o aplicativo funciona normalmente, só sem sincronização.

## Publicação (Vercel)

`vercel.json` já configura o framework Vite e o fallback de rotas. No Vercel: *Add New → Project*, importe este repositório e publique (build `npm run build`, saída `dist`).

## Conteúdo em validação

Todo o conteúdo conceitual está com o estado **proposta**: associações iniciais extraídas dos documentos, ainda sem curadoria. Os tipos de relação pensador–virtude (P1 a P4) só aparecem onde o Documento 04 os declara; as perguntas características dos pensadores são formulações pedagógicas da plataforma e são identificadas como tal. A plataforma não substitui assistência médica, psicológica, jurídica ou profissional.
