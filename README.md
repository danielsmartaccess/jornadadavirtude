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
- **Identidade visual própria:** uma cor, um símbolo e um motivo geométrico por família de virtudes; sete anéis para as dimensões; um emblema linear para cada uma das 48 virtudes; emblemas por tradição no Conselho (sem rostos). A assinatura de cada virtude e de cada pensador mostra, pela espessura dos anéis, o tipo de relação com as dimensões, sempre a partir de dados que já existem na base. Temas claro, escuro e "roxo e dourado".
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

A migração `20261118235900_restringir_privilegios_tabelas_de_usuario.sql` retira de `authenticated` os privilégios que o Supabase concede por padrão e que a primeira migração não revogou (`TRUNCATE`, `REFERENCES` e `TRIGGER`), deixando só `select`, `insert`, `update` e `delete` nas seis tabelas de dados do usuário. Em tabelas novas de `public`, sempre faça `revoke all ... from anon, authenticated` antes do `grant` mínimo.

## Módulo de leitura da Bhagavad Gita

Uma jornada de leitura em 18 capítulos, cada um com seis etapas de estudo. Rotas: `/gita` e `/gita/:numero`, com menu lateral dos capítulos e as seis etapas na área principal. O texto das etapas é carregado capítulo a capítulo; os ainda sem texto mostram "Conteúdo em preparação." (os capítulos com texto são os que têm seed em `supabase/seeds/` aplicado no banco). O acesso é pelo atalho "Leitura da Bhagavad Gita" no Catálogo de virtudes, ao lado de "As sete dimensões" e "Pensadores e referências"; o menu principal segue as seis áreas do Doc. 06. Já aplicado em produção (migração, ajuste de privilégios de `registros` e seed).

Banco (`supabase/migrations/20261118120000_leitura_bhagavad_gita.sql`, independente da migração de dados do usuário):

- `capitulos` e `etapas`: conteúdo fixo. Leitura pública (RLS ligada só com política `select using (true)`); escrita só pelo dono do banco, com `insert/update/delete` revogados de `anon` e `authenticated`.
- `registros`: anotações da pessoa por etapa, com RLS e quatro políticas (select, insert, update, delete) que exigem `user_id = auth.uid()`.
- `supabase/seed.sql` carrega os 18 capítulos e as 108 etapas; pode ser rodado de novo sem duplicar. Os títulos e nomes devem ficar iguais a `src/data/gita-capitulos.json` e `src/domain/gita.ts` (`tests/unit/gita.test.ts` confere).

Aplique no SQL Editor do Supabase, nesta ordem: a migração e depois o `seed.sql`.

**Conteúdo por capítulo.** A migração `20261118180000_gita_conteudo_e_quiz.sql` acrescenta `etapas.conteudo_md` (texto da etapa em Markdown GFM, sem HTML) e as tabelas `perguntas`, `opcoes` e `leituras` (quiz da etapa de reflexão como dados, leitura pública). Cada capítulo tem um seed próprio em `supabase/seeds/capitulo-NN.sql`, com upsert por capítulo, etapa, pergunta, opção e leitura: rodar de novo não duplica. A pasta `supabase/seeds/` pode ficar fora do Git (o texto do estudo é conteúdo, não código); `tests/unit/gita.test.ts` valida os seeds que existirem nela. A migração `20261118230000_perguntas_conta_no_resultado.sql` acrescenta `perguntas.conta_no_resultado` (padrão `true`): quando `false`, a pergunta fica na tela como reflexão (com aviso) e a escolha não entra no cálculo nem é obrigatória; hoje só a pergunta 5 do capítulo 16, cujas alternativas são os três portões e não a escala A/B/C. Convenções do Markdown dos seeds: cartões viram listas com título em negrito (`- **Título:** texto`) e esquemas visuais viram bloco de código `text` (a árvore do capítulo 15). A migração `20261119000100_quiz_por_faixas.sql` acrescenta um segundo modo de quiz: `etapas.quiz_modo` (`mais_escolhida`, o padrão, ou `faixas`), `etapas.quiz_chave_alvo` e `leituras.minimo` (com `leituras.chave` opcional). No modo `faixas` (capítulos 8 a 13), a alternativa C é a alinhada ao ensinamento e a leitura depende de quantas vezes ela foi escolhida (`resultadoPorFaixas`: 4 ou mais, 2 ou 3, menos de 2); não há regra de empate. A migração `20261119010000_quiz_por_acertos.sql` acrescenta o terceiro modo, `acertos` (capítulos 1 a 7): quiz de compreensão em que cada pergunta tem uma alternativa correta (`perguntas.chave_correta`) e a leitura depende de quantas foram acertadas (`resultadoPorAcertos`: 5; 3 ou 4; menos de 3, reaproveitando `leituras.minimo`). Ao publicar, aplique a migração **antes** do código, que passa a pedir as colunas novas. O resultado do quiz no modo padrão é calculado no app por `resultadoDoQuiz` (`src/domain/gita.ts`): a opção mais escolhida define a leitura e, em empate, mostram-se as opções empatadas. As seis etapas de cada capítulo são: Contexto histórico e filosófico, Conceitos fundamentais, Interpretação filosófica, Aplicação prática contemporânea, Reflexão pessoal interativa e Síntese e versos para revisitar.

**Tela de leitura.** `/gita/:numero` lê o capítulo da API do Supabase com a chave publishable (leitura pública, uma requisição com etapas, perguntas, opções e leituras aninhadas; `src/infrastructure/gitaContent.ts`) e mostra as seis etapas. O Markdown é renderizado com `react-markdown` e `remark-gfm` (tabelas), carregados sob demanda e sem interpretar HTML. O quiz fica entre a introdução e a reflexão aberta da etapa 5 e não guarda nada. Sem conexão, a tela avisa, mantém as seis etapas e oferece "Tentar de novo". Etapas sem texto no banco mostram "Conteúdo em preparação.". **Reflexão aberta.** Com conta, a pessoa escreve na etapa de reflexão e o texto é guardado em `registros` (`src/infrastructure/registrosGita.ts`), com RLS: só o dono lê, edita e apaga. Pode haver várias reflexões por etapa, cada uma com exclusão confirmada; o limite é de 10.000 caracteres por reflexão. Sem conta, a tela explica como guardar e o restante da leitura funciona normalmente. "Apagar meus dados da nuvem" (Configurações) remove também as reflexões, antes do restante, porque `jv_delete_my_data` (migração 1) não as conhece. As reflexões ficam só na nuvem: ainda não entram na exportação de dados do aparelho.

## Ensinamentos de Krishna (parte final da leitura)

Rota `/gita/ensinamentos`: os sete ensinamentos transcritos de um quadro de estudo, com os três gunas (Rajas, Satwa, Tamas) e o esquema redesenhado. O conteúdo fica no Supabase, nas tabelas `ensinamentos` (um registro por ponto, com as linhas de texto) e `ensinamentos_gunas`, no mesmo regime do conteúdo dos capítulos: leitura pública, RLS ligada, só `select` concedido a `anon` e `authenticated`. A migração é `supabase/migrations/20261120120000_ensinamentos_de_krishna.sql` e o seed idempotente é `supabase/seeds/ensinamentos-de-krishna.sql`. Aplique a migração **antes** de publicar o código que lê as tabelas. O título da parte e a nota de origem são do app (`src/domain/gita.ts`). O menu lateral mostra a parte final num segundo menu, fora da lista dos 18 capítulos.

## Sistema visual

Tudo que define a aparência vem de tokens em `src/styles/globals.css` (Tailwind 4, `@theme`). Nada de valor solto nas telas: `tests/unit/design-system.test.ts` varre o código e falha se aparecer um tamanho de texto, uma largura, um espaçamento entre letras ou uma cor fora dos tokens.

| Camada | Tokens |
|---|---|
| Cor | `--bg`, `--fg`, `--muted`, `--accent`, `--panel` e `--fam-1` a `--fam-8` (uma cor por família de virtudes), redefinidos nos temas escuro e "roxo e dourado" (`data-theme="roxo"`) |
| Tipografia | Gloock (títulos), Crimson Pro (texto), Geist Mono (rótulos). Escala `--text-minimo` a `--text-destaque`, usada como `text-nota`, `text-rotulo` etc. |
| Larguras | `--container-pagina`, `--container-pagina-larga`, `--container-leitura`, `--container-leitura-larga`, `--container-legenda` |
| Movimento | `--duration-quick`, `--duration-base`, `--ease-standard`. Escalonamento limitado a 7 passos; `prefers-reduced-motion` desliga tudo |
| Toque | Em telas de toque (`pointer: coarse`) botões e opções têm ao menos 44 px de altura |

Símbolos e emblemas (todos decorativos, `aria-hidden`, pois o nome já vem como texto): `src/components/simbolos.tsx`, com as regras de associação em `src/domain/identidade.ts`. Os 48 emblemas das virtudes são dados estruturados em `src/data/virtue-emblems.json` (caminhos e círculos SVG), validados por `elementoDeEmblemaValido`, que só aceita geometria segura. São emblemas lineares, não ilustrações pictóricas: para trocar um por uma obra de ilustrador, substitua o elemento daquela virtude no arquivo. Os motivos geométricos das famílias e os emblemas das tradições são provisórios, aguardando validação artística e cultural.

## Acessibilidade e desempenho

- **Auditoria externa** (fora do repositório, sem dependência no projeto): axe-core nas 23 rotas, em tema claro e escuro, e Lighthouse em perfil de celular. Resultado atual: zero violações no axe; Lighthouse com desempenho de 98 a 100, acessibilidade 100, boas práticas 100, SEO 100 e CLS entre 0 e 0,002. Rode o axe só depois de as animações terminarem, para não medir cores no meio da transição.
- **Guardas permanentes nos testes:** um único `h1` e nenhum salto de nível de título em todas as telas; nome único para cada tabela da Gita; contraste de 4,5:1 de texto, acento e cores de família nos três temas, lido do CSS real; sem salto de layout (CLS) nas rotas por demanda e no carregamento dos ensinamentos, no viewport de celular do Lighthouse (412 x 823); fontes do primeiro desenho precarregadas, cada uma baixada uma só vez; áreas de toque de 44 px; `prefers-reduced-motion`.
- **Carregamento:** as telas, exceto o Início, são carregadas por rota. O aviso de carregamento do `Suspense` em `src/app/Layout.tsx` ocupa uma altura de tela de propósito: um aviso curto faz o rodapé pular quando a tela chega. Listas que vêm de API reservam altura enquanto carregam. As quatro fontes do primeiro desenho são precarregadas por um plugin em `vite.config.ts`.

### Regras para escrever testes ponta a ponta

1. Todo teste que abre uma rota da Gita ou dos Ensinamentos simula a API do Supabase com `page.route`: nunca depende da rede nem do banco reais.
2. Sem `waitForTimeout` e sem leitura imediata (`count()`, `evaluate` dentro de `expect(await ...)`): use `toBeVisible`, `toHaveCSS` e `expect.poll`, que tentam de novo. O tempo de espera das asserções é de 10 s (15 s no CI) porque as telas carregam por rota.
3. Teste de CLS ou de qualquer regressão visual deve provar que falha sem a correção (reverta a correção, reconstrua e confirme) e usar o viewport de celular, onde o rodapé fica na tela.
4. Antes de publicar, estresse a suíte: `npx playwright test --repeat-each=3 --workers=4`.

## Publicação (Vercel)

`vercel.json` já configura o framework Vite e o fallback de rotas. No Vercel: *Add New → Project*, importe este repositório e publique (build `npm run build`, saída `dist`).

## Conteúdo em validação

Todo o conteúdo conceitual está com o estado **proposta**: associações iniciais extraídas dos documentos, ainda sem curadoria. Os tipos de relação pensador–virtude (P1 a P4) só aparecem onde o Documento 04 os declara; as perguntas características dos pensadores são formulações pedagógicas da plataforma e são identificadas como tal. A plataforma não substitui assistência médica, psicológica, jurídica ou profissional.
