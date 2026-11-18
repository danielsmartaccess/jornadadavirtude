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
  features/        telas por módulo (home, journey, virtues, council, diary, history, settings, gita)
  components/      componentes reutilizáveis (ui.tsx)
  app/             layout, rotas, hooks de ligação
  data/            base de conhecimento em JSON (catálogo separado dos dados pessoais, ADR-015)
  shared/          utilidades
tests/unit         regras de negócio, catálogo, Conselho, migração
tests/e2e          fluxo completo do MVP
supabase/migrations  esquema com RLS para a conta opcional
supabase/seed.sql    conteúdo fixo da leitura da Gita (18 capítulos x 6 etapas), idempotente
```

Decisões registradas: persistência local em `localStorage` (volume de kilobytes, gravação atômica; a troca por IndexedDB é feita só em `infrastructure/localRepository.ts`, atrás do contrato `UserDataRepository`); identificadores UUID; dados com `schemaVersion` e envelope de exportação.

## Conta opcional e sincronização (Supabase)

1. No SQL Editor do projeto Supabase, execute `supabase/migrations/20261113180000_user_data.sql` (tabelas, RLS e as funções `jv_push_state`, `jv_pull_state` e `jv_delete_my_data`).
2. Em *Authentication → URL Configuration*, inclua a URL do site (a do Vercel e `http://localhost:5173`).
3. O projeto e a chave **publishable** estão em `src/config.ts`. A chave é pública por definição; o acesso aos dados é protegido por RLS. Nunca coloque a chave `secret`/`service_role` no front-end. Para outro projeto, copie `.env.example` para `.env`.

Sem esses passos o aplicativo funciona normalmente, só sem sincronização.

## Módulo de leitura da Bhagavad Gita

Uma jornada de leitura em 18 capítulos, cada um com seis etapas de estudo. Rotas: `/gita` e `/gita/:numero`, com menu lateral dos capítulos e as seis etapas na área principal. O texto das etapas é carregado capítulo a capítulo; os ainda sem texto mostram "Conteúdo em preparação." (hoje só o capítulo 14 tem conteúdo). O acesso é pelo atalho "Leitura da Bhagavad Gita" no Catálogo de virtudes, ao lado de "As sete dimensões" e "Pensadores e referências"; o menu principal segue as seis áreas do Doc. 06. Já aplicado em produção (migração, ajuste de privilégios de `registros` e seed).

Banco (`supabase/migrations/20261118120000_leitura_bhagavad_gita.sql`, independente da migração de dados do usuário):

- `capitulos` e `etapas`: conteúdo fixo. Leitura pública (RLS ligada só com política `select using (true)`); escrita só pelo dono do banco, com `insert/update/delete` revogados de `anon` e `authenticated`.
- `registros`: anotações da pessoa por etapa, com RLS e quatro políticas (select, insert, update, delete) que exigem `user_id = auth.uid()`.
- `supabase/seed.sql` carrega os 18 capítulos e as 108 etapas; pode ser rodado de novo sem duplicar. Os títulos e nomes devem ficar iguais a `src/data/gita-capitulos.json` e `src/domain/gita.ts` (`tests/unit/gita.test.ts` confere).

Aplique no SQL Editor do Supabase, nesta ordem: a migração e depois o `seed.sql`.

**Conteúdo por capítulo.** A migração `20261118180000_gita_conteudo_e_quiz.sql` acrescenta `etapas.conteudo_md` (texto da etapa em Markdown GFM, sem HTML) e as tabelas `perguntas`, `opcoes` e `leituras` (quiz da etapa de reflexão como dados, leitura pública). Cada capítulo tem um seed próprio em `supabase/seeds/capitulo-NN.sql`, com upsert por capítulo, etapa, pergunta, opção e leitura: rodar de novo não duplica. A pasta `supabase/seeds/` pode ficar fora do Git (o texto do estudo é conteúdo, não código); `tests/unit/gita.test.ts` valida os seeds que existirem nela. O resultado do quiz é calculado no app por `resultadoDoQuiz` (`src/domain/gita.ts`): a opção mais escolhida define a leitura e, em empate, mostram-se as opções empatadas. As seis etapas de cada capítulo são: Contexto histórico e filosófico, Conceitos fundamentais, Interpretação filosófica, Aplicação prática contemporânea, Reflexão pessoal interativa e Síntese e versos para revisitar.

**Tela de leitura.** `/gita/:numero` lê o capítulo da API do Supabase com a chave publishable (leitura pública, uma requisição com etapas, perguntas, opções e leituras aninhadas; `src/infrastructure/gitaContent.ts`) e mostra as seis etapas. O Markdown é renderizado com `react-markdown` e `remark-gfm` (tabelas), carregados sob demanda e sem interpretar HTML. O quiz fica entre a introdução e a reflexão aberta da etapa 5 e não guarda nada. Sem conexão, a tela avisa, mantém as seis etapas e oferece "Tentar de novo". Etapas sem texto no banco mostram "Conteúdo em preparação.". A resposta à reflexão aberta ainda não é gravada (virá em `registros`).

## Publicação (Vercel)

`vercel.json` já configura o framework Vite e o fallback de rotas. No Vercel: *Add New → Project*, importe este repositório e publique (build `npm run build`, saída `dist`).

## Conteúdo em validação

Todo o conteúdo conceitual está com o estado **proposta**: associações iniciais extraídas dos documentos, ainda sem curadoria. Os tipos de relação pensador–virtude (P1 a P4) só aparecem onde o Documento 04 os declara; as perguntas características dos pensadores são formulações pedagógicas da plataforma e são identificadas como tal. A plataforma não substitui assistência médica, psicológica, jurídica ou profissional.
