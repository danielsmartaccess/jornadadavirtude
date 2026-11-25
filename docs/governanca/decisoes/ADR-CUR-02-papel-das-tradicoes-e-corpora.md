# ADR-CUR-02 — Papel das tradições e corpora; recorte do Dalai Lama

| Campo | Valor |
|---|---|
| Decisões | DEC-CUR-02 (tradições são corpora de apoio) e DEC-CUR-03 (Dalai Lama e recorte budista específico) |
| Status | Decisões de produto APROVADAS pelo responsável pelo produto em 2026-11-23 (Fase 2). Afirmações históricas e filosóficas continuam dependentes de evidência e revisão especializada. |
| Data | 2026-11-23 |
| Base | Documento 14 §8 e §10; ADR-CUR-01 (conflitos C-CUR-1 e C-CUR-5); código em `main` no merge commit `5d81ecc` |
| Revisão futura | Revisor filosófico/curatorial: vínculo do Dalai Lama com a escola Gelug; recorte de cada tradição |

## Contexto

- **Tradições budistas como voz.** "Tradições budistas" está no catálogo com `council: true` e, até a Fase 1, disputava vaga como se fosse uma voz individual. No snapshot da política v1, ela aparece em 19 das 79 entradas de referência (conflito C-CUR-1).
- **Dalai Lama e corpus juntos.** O Dalai Lama e o corpus budista podiam ser convocados juntos, como duas vozes (C-CUR-5).
- **Dalai Lama e Gelug.** Não havia registro do recorte do Dalai Lama nem do tipo de vínculo com o budismo.

## Decisão

### DEC-CUR-02 — Tradição é corpus de apoio, não pessoa convocável

1. **Papel na seleção.** É derivado do tipo de participação (`src/domain/curadoria.ts`, `papelDoTipo`):
   - tradição/corpus e escola/corrente → `contextual_corpus`;
   - voz literária → `literary_voice`;
   - demais → `individual_voice`.
2. **"Tradições budistas" mantém `council: true` no catálogo original.** A contagem histórica dos 27 habilitados não muda. A regra operacional vem da camada curatorial: um `contextual_corpus` nunca ocupa vaga entre as 2 a 5 vozes (`POLITICA_V2.corpusOcupaVaga = false`).
3. **Exclusão registrada.** O corpus excluído aparece em `ResultadoSelecao.excluidos` com o motivo `corpus-de-apoio`.
4. **Apoio contextual.** Um corpus pode apoiar uma perspectiva individual (`src/data/curadoria/vinculos.json`, `apoios`). Hoje há um apoio registrado: Tradições budistas → Dalai Lama, recorte "budismo tibetano". Quando a pessoa é convocada, a justificativa da perspectiva diz: "Contexto de apoio: Tradições budistas, recorte budismo tibetano (corpus de apoio, não convocado como pessoa)."
5. **Interface.** A biblioteca e a página do registro dizem "Corpus de apoio — não convocado como pessoa".
6. **Sem pessoa nem primeira pessoa.** O corpus não ganha biografia nem fala em primeira pessoa. As relações do corpus com virtudes não são transferidas para a pessoa apoiada.

### DEC-CUR-03 — Dalai Lama: recorte tibetano, Gelug a confirmar

**Tipos de vínculo.** Os vínculos ficam em `vinculos.json` e distinguem quatro tipos:
- `pertence_a`;
- `formado_em`;
- `representa_institucionalmente`;
- `lider_de_toda_tradicao`.

**Situação de cada vínculo.** Cada um tem uma de três situações:
- `sustentado_por_fonte`;
- `a_confirmar`;
- `nao_afirmar`.

| Vínculo | Situação | Fonte |
|---|---|---|
| Formado no budismo tibetano | Sustentado por fonte | Biografia oficial: educação monástica desde os seis anos; grau Geshe Lharampa |
| Pertence ao budismo tibetano | Sustentado por fonte | Site oficial, Perguntas e respostas: "a simple Buddhist monk"; formação monástica no Tibete |
| Pertence à escola Gelug | **A confirmar** | Nenhuma fonte lida afirma a filiação do 14º Dalai Lama. A Administração Central Tibetana liga o **primeiro** Dalai Lama a Tsongkhapa, "the founder of the Gelugpa School": contexto histórico da linhagem, não prova de filiação do 14º. |
| Representa institucionalmente o Tibete | Sustentado por fonte | Biografia oficial: "He is the spiritual leader of Tibet." |
| Líder de todos os budismos (Theravāda, Zen, todos os Mahāyāna) | **Não afirmar** | Nenhuma fonte o afirma; o escopo declarado é o Tibete |

**Convocação.** O Dalai Lama pode ser convocado como pessoa. O corpus budista não aparece como segunda voz: está excluído pela DEC-CUR-02, e os testes conferem as 79 entradas de referência.

## Fontes consultadas em 2026-11-23

- https://www.dalailama.com/the-dalai-lama/biography-and-daily-life/brief-biography (oficial; não menciona Gelug, Gelugpa nem "Yellow Hat"; "Ganden Phodrang" é o escritório e a casa dos Dalai Lamas, não o nome de uma escola).
- https://www.dalailama.com/the-dalai-lama/biography-and-daily-life/questions-answers (oficial).
- https://www.dalailama.com/the-dalai-lama/biography-and-daily-life/birth-to-exile (oficial; não menciona Gelug).
- https://tibet.net/about-tibet/his-holiness/ (Administração Central Tibetana, reproduzindo texto do Escritório do Dalai Lama).
- https://plato.stanford.edu/entries/tsongkhapa/ (SEP; trata da origem da escola Gelug e não menciona o Dalai Lama).
- Não lidas: Britannica (HTTP 403) e https://www.dalailama.com/the-dalai-lama/biography-and-daily-life/the-dalai-lamas (HTTP 404).

## Consequências

- **Positivas:**
  - a interface passa a mostrar a semântica real: 26 vozes convocáveis e 1 corpus de apoio;
  - acabam os Conselhos com Dalai Lama e corpus budista como duas vozes (eram 3 na v1, agora 0);
  - o recorte tibetano fica explícito, sem generalização.
- **Mudança intencional de seleção.** Ver `docs/governanca/curadoria/comparacao-politicas-selecao.md`: o corpus deixa de ser convocado nas 19 entradas em que aparecia.
- **Sessões antigas.** Sessões já gravadas que tenham Tradições budistas como perspectiva **não são reescritas** (Documento 13, seção 20): elas guardam as contribuições da época.

## Alternativas rejeitadas

- **Trocar `council: true` para `false` no catálogo.** Mudaria silenciosamente a contagem histórica dos 27 e o fingerprint do catálogo original.
- **Converter a tradição em pessoa ou criar uma "voz" da tradição.** Contraria o Documento 14 §8.
- **Registrar o Dalai Lama como representante do budismo em geral ou afirmar Gelug sem fonte específica.** Rejeitado.
- **Criar uma 15ª entrada em `tradicoes.json` para o budismo tibetano.** Alteraria o total de tradições sem necessidade; o recorte fica no vínculo.

## Pendências

- **Gelug:** fonte institucional ou acadêmica específica que sustente, ou não, a filiação do 14º Dalai Lama à escola Gelug (revisor filosófico/curatorial).
- **Recorte do corpus:** recorte de "Tradições budistas" (D-04-02 continua pendente quanto à composição 27/34 e aos identificadores).

## Revisão humana (2026-11-23) — DEC-CUR-10: Dalai Lama e escola Gelug

A revisão pediu fontes primárias e acadêmicas para o vínculo com a escola Gelug, distinguindo formação/prática, filiação, representação e chefia. O texto acima foi preservado como registro da primeira conferência, quando o vínculo ficou "a confirmar".

### Fontes abertas e lidas

| Fonte | Natureza | Localização | O que sustenta | O que não sustenta |
|---|---|---|---|---|
| Office of His Holiness the Dalai Lama, "Dzogchen Teaching and Public Dialogue", 25/09/2017 (Riga, Letônia), https://www.dalailama.com/news/2017/dzogchen-teaching-and-public-dialogue | Primária oficial: notícia com fala em primeira pessoa; não é transcrição integral | Parágrafo após o que começa com "His Holiness observed that Je Tsongkhapa had a special connection to the Nyingma tradition" | "In the early part of my life, I followed only the Gelug tradition." Depois: "Eventually I received Guhyagarbha and Rongzom’s commentary to it from Dilgo Khyentse Rinpoche, as well as teachings from Trulshik Rinpoche"; também ensinamentos do abade Sakya Sangye Tenzin | Chefia da escola; prática exclusiva posterior; até quando durou o "início da vida". A parte final da página não foi lida verbatim. |
| Rob Hogendoorn, "Caveat Emptor: The Dalai Lama's Proviso and the Burden of (Scientific) Proof", *Religions* 5(3): 522–559, 2014, DOI 10.3390/rel5030522 | Artigo em periódico revisado por pares (metadados conferidos no Crossref; texto lido no PDF do editor) | p. 526; p. 527; p. 542 | p. 526: "his own Gelug monastic order". p. 527: "Contrary to what is often assumed, the Dalai Lama is not its formal head. That position is held by the Ganden Tripa". p. 542: juventude e anos formativos "steeped in a highly demanding curriculum derived from that of the Gelug order" | Exclusividade de prática; quem ocupa o cargo hoje |
| William Kent Dewey, "A Union of Religion and Politics: Ngawang Tsültrim as Tibetan Regent and Imperial Preceptor", tese de doutorado (Religious Studies), University of California, Santa Barbara, março de 2017, https://escholarship.org/uc/item/2dj3k52s | Tese de doutorado | p. 104 (seção "Ganden Tripa"); p. 105 | Ganden Tripa "is often described as the spiritual leader of the Geluk sect"; citando Kapstein, o Dalai Lama tinha "ecclesiastical offices as the preeminent hierarch of the Gelukpa order", mas o Ganden Tripa é "titular head of the order"; e adverte que isso não diminui "the great spiritual importance and influence of the Dalai Lama". p. 105: entre o fim do século XV e o XVII, o Ganden Tripa não chefiava toda a escola | O estudo trata do século XVIII; serve para a distinção institucional geral, não para a situação atual |
| Tibetan Buddhist Centre (Singapura), "Lineage", https://www.tibetanbc.org/lineage | Institucional, não acadêmica, sem fontes citadas | Seção sobre os discípulos de Tsongkhapa | "the Ganden Tripa is the actual, official head of the Gelug school, not the Dalai Lama" | Usada só como orientação; não sustenta nenhum vínculo do catálogo |
| Administração Central Tibetana, "His Holiness the Dalai Lama", https://tibet.net/about-tibet/his-holiness/ | Institucional (texto do Escritório do Dalai Lama) | Trecho sobre o primeiro Dalai Lama | O primeiro Dalai Lama foi discípulo de Tsongkhapa, "the founder of the Gelugpa School" | Nada sobre o 14º e a escola |

### Estado final dos vínculos (`vinculos.json`)

| Id | Vínculo | Situação | Base |
|---|---|---|---|
| VIN-DAL-01 | Formado no budismo tibetano | Sustentado por fonte | Biografia oficial |
| VIN-DAL-02 | Pertence ao budismo tibetano | Sustentado por fonte | Site oficial |
| VIN-DAL-03 | Pertence à escola Gelug (ordem monástica) | ~~Sustentado por fonte~~ → **a confirmar** pela decisão humana da revisão final (ver seção seguinte) | Hogendoorn 2014, p. 526 e 542. Escopo: filiação monástica e formação; não exclusividade, não representação exclusiva, não chefia |
| VIN-DAL-04 | Representa institucionalmente o Tibete | Sustentado por fonte | Biografia oficial ("spiritual leader of Tibet") |
| VIN-DAL-05 | Líder de todos os budismos | Não afirmar | Nenhuma fonte |
| VIN-DAL-06 | Formado na tradição Gelug, prática no início da vida | Sustentado por fonte (novo) | Declaração em primeira pessoa, 2017 |
| VIN-DAL-07 | Ensinamentos de outras tradições tibetanas, fase posterior | Sustentado por fonte (novo) | Mesma declaração, 2017 |
| VIN-DAL-08 | Chefia formal da escola Gelug (Ganden Tripa) | Não afirmar (novo) | Hogendoorn 2014, p. 527; Dewey 2017, p. 104 |

### Afirmações expressamente não sustentadas

- Que o Dalai Lama seja chefe formal ou titular da escola Gelug, ou ocupe o cargo de Ganden Tripa.
- Que represente exclusivamente a escola Gelug, ou que toda a sua obra expresse só essa escola.
- Que represente Theravāda, Zen, todos os Mahāyāna ou todos os budismos.
- Quem ocupa hoje o cargo de Ganden Tripa (não verificado; não necessário para a distinção).

### Ponto para decisão humana

O pedido de revisão listava como defensáveis a formação e a prática inicial na tradição Gelug. O VIN-DAL-03 vai além: registra **filiação à ordem monástica Gelug**, sustentada por uma expressão incidental de um artigo revisado por pares ("his own Gelug monastic order"). Se o responsável pelo produto preferir manter só o que a declaração em primeira pessoa sustenta, basta voltar o VIN-DAL-03 a "a confirmar"; nenhum outro registro depende dele.

### Interface

A seção "Recorte desta perspectiva" mostra, para cada vínculo: tipo, situação, escopo, trecho, natureza e localização da fonte, data e fontes complementares. Nenhum vínculo sustentado usa o tipo "líder de toda a tradição" (teste).

## Revisão final (2026-11-23) — decisão humana sobre o VIN-DAL-03

**Decisão.** O VIN-DAL-03 (filiação à ordem monástica Gelug) volta a **a confirmar**. O registro, o identificador, a fonte (Hogendoorn 2014, p. 526 e 542) e a localização continuam no cadastro, agora como referência em revisão e não como confirmação. A versão de 63da8ba está, literal, em `versaoAnterior`, e a sequência de situações em `historicoDeSituacao` (a confirmar → sustentado por fonte em 9a5582e → a confirmar).

**Motivo.** A passagem acadêmica é incidental ("his own Gelug monastic order", num parágrafo sobre dissidência). Confirmar a filiação à ordem monástica excede o escopo documental adotado para esta versão da curadoria.

**O que continua igual:**

- VIN-DAL-06 permanece **sustentado por fonte**: prática da tradição Gelug no início da vida, pela declaração do próprio 14º Dalai Lama publicada pelo seu escritório em 2017 ("In the early part of my life, I followed only the Gelug tradition."). O escopo é só a fase inicial da vida.
- VIN-DAL-07 permanece sustentado (ensinamentos de outras tradições tibetanas depois).
- VIN-DAL-08 permanece "não afirmar": a chefia formal da escola é do cargo de Ganden Tripa, não do Dalai Lama.
- VIN-DAL-05 permanece "não afirmar": nenhuma representação de todos os budismos.

**O que a decisão não diz.** Ela não nega a trajetória Gelug do Dalai Lama; apenas delimita o que o cadastro afirma como confirmado.

**Efeito no app.**

- Seleção: nenhum. O motor de seleção não lê vínculos; os snapshots v1, v2 e v2.1 e as comparações não mudaram.
- Página do Dalai Lama: o vínculo aparece com a etiqueta "A confirmar" e o aviso "Fonte registrada em revisão: não conta como confirmação deste vínculo"; o link passa a se chamar "Fonte em revisão".

## Revisão DH-T-02 (2026-11-25) — DEC-CUR-12: clareza no catálogo de tradições

### Problema identificado

A auditoria da Fase 3A apontou ambiguidades no catálogo de tradições, que mistura tradição, corpus, recorte curatorial e agregado temático:

- **Pares de registros semelhantes.** Quatro entidades existem em dois lugares: um registro do catálogo original (`thinkers.json`) e um recorte curatorial (`tradicoes.json`).
- **Agregados temáticos genéricos.** "Humanismo" e "Diversas" não delimitam uma tradição.
- **Agregados culturais amplos.** "Filosofias africanas" e "Pensamentos indígenas" reúnem tradições distintas.
- **Texto desatualizado.** O campo `conflito` de `tradicao-budismos` ainda dizia que "tradicoes-budistas" "participa da seleção como os indivíduos", o que a DEC-CUR-02 já havia corrigido no comportamento, mas não no texto. Esse texto aparece na tela, na seção "Ponto em aberto na curadoria".

### Decisão humana (aprovada em 25/11/2026)

1. **Pares.** Manter os registros separados. Não excluir, fundir, renomear IDs nem transferir relações. Reforçar as remissões quando melhorar a compreensão.
2. **Agregados temáticos.** Preservar `tradicoes-humanistas`, `tradicoes-religiosas` e `tradicoes-contemplativas` e acrescentar `classificacao.nota` dizendo que são agregados temáticos legados, não tradições específicas.
3. **Agregados culturais.** Não fundir, excluir nem renomear. Só auditar e registrar problemas de escopo.
4. **Registro budista.** Corrigir o `conflito` para refletir a DEC-CUR-02.
5. **Estoicos.** Preservar `registrosNoCatalogo` e a dependência funcional dos três estoicos.

### Diagnóstico dos quatro pares

Em todos, o recorte curatorial tem **0 relações com virtudes**; as relações ficam no registro do catálogo. Os tipos coincidem nos dois lados, nenhum ID se repete entre os dois arquivos e `registrosNoCatalogo` aponta corretamente em cada par.

| Registro do catálogo (`thinkers.json`) | Recorte curatorial (`tradicoes.json`) | Relações no catálogo | Referência compartilhada |
|---|---|---:|---|
| `estoicismo` | `tradicao-estoicismo` | 4 | nenhuma. Único par com autores relacionados (Epicteto, Sêneca, Marco Aurélio): é o que alimenta `paresNaoIndependentes` |
| `bhagavad-gita` | `corpus-bhagavad-gita` | 1 | W11, ligada nos dois lados; o recorte é `parteDe` Hinduísmo |
| `tradicoes-budistas` | `tradicao-budismos` | 11 | nenhuma. Registro do catálogo com `council: true` legado (DEC-CUR-02) |
| `tradicoes-cristas` | `tradicao-cristianismos` | 3 | nenhuma |

Dois pares têm o mesmo nome visível (Estoicismo; Bhagavad Gita) e dois têm nomes diferentes (Tradições budistas × Budismos; Tradições cristãs × Cristianismos).

### Diagnóstico dos agregados

- **Temáticos legados.** Existem em `thinkers.json` e `classificacao.json`, **não** em `tradicoes.json`. Não habilitados, sem campo, conceitos, pergunta nem limites, com 2, 1 e 1 relações. Os tipos eram `escola-corrente` (humanistas) e `tradicao-corpus` (religiosas e contemplativas).
- **Culturais amplos** (só auditoria, sem alteração):
  - Os dois têm tipo `tradicao-corpus` e universo só "Filosofia e ética", embora reúnam debates, autores e povos, e não um corpus.
  - Nenhum tem autores relacionados nem registro no catálogo; os candidatos da área (por exemplo, Gyekye, Wiredu e Krenak) não estão ligados a eles.
  - O campo `cuidado`, transcrito do Documento 14, já alerta contra a homogeneização. Qualquer reclassificação cultural exige decisão humana específica.
  - `tradicao-filosofias-latino-americanas` é um caso parecido, mas não foi listado nesta decisão.

### O que foi alterado

| Onde | Mudança |
|---|---|
| `classificacao.json` | `nota` em `tradicoes-humanistas`, `tradicoes-religiosas` e `tradicoes-contemplativas`: "Agregado temático legado, sem escopo conceitual suficientemente delimitado para ser tratado como uma tradição específica. Registro legado preservado nesta etapa, incluindo suas relações, sem que isso represente validação de seu escopo como tradição específica." |
| `tradicoes.json` | `conflito` de `tradicao-budismos`: o registro continua habilitado (`council: true`, contagem histórica dos 27), mas, pela DEC-CUR-02, tradições e corpora são fontes de apoio e contextualização, não pessoas convocáveis nem participantes individuais da seleção, e não ocupam vaga entre as vozes do Conselho. Preservados o Documento 14 (seção 8) e o que segue em aberto (composição 27/34 e identificadores, D-04-02) |
| `CouncilPages.tsx` | Duas frases, só quando o par existe. Na página do catálogo, após "Recorte curatorial": o recorte descreve escopo e cuidados de leitura e as relações com virtudes ficam no registro do catálogo. Na página do recorte, em "Registros correspondentes no catálogo": esta página é o recorte curatorial, sem relações com virtudes, e as relações e o papel no Conselho ficam no registro do catálogo |

A premissa do pedido de que os três agregados estariam em `tradicoes.json` não se confirmou; a nota foi aplicada onde eles existem.

### O que foi preservado

- Todos os IDs, os dois arquivos de tradições e o campo `registrosNoCatalogo` de cada recorte.
- A dependência funcional dos estoicos: o mecanismo `paresNaoIndependentes` segue com Estoicismo × Epicteto, Sêneca e Marco Aurélio, nos dois sentidos, e mais nenhum par.
- As 189 relações (todas `proposta`), os flags `council` (27), pesos, política de diversidade, o gate de crise, o schema e os snapshots v1, v2 e v2.1.
- A distinção entre pessoas, tradições e corpora: nenhum registro mudou de tipo.

### Fora do escopo e limitações

- **Culturais amplos.** Sem fusão, exclusão, renomeação nem reclassificação, e sem novas classificações culturais. Ficam para decisão humana específica.
- **Agregado "Humanismo".** Pode se sobrepor ao recorte `tradicao-psicologia-humanista`. A nota não decide isso.
- **Cartões da biblioteca.** Os dois cartões de cada par se distinguem pelo conteúdo (o recorte mostra escopo e "Cuidado de leitura"; o registro do catálogo mostra o campo de tradição e "Não habilitado"), mas nenhum diz "recorte" ou "registro do catálogo". Isso só é dito nas páginas de detalhe.
- **Unificação ou fusão de pares.** Segue pendente de decisão arquitetural.
- **Campo `tradition`.** Continua texto livre ("Humanismo", "Diversas", "Tradição da Índia").
- **Efeito.** Nenhum na seleção. Sobre a `main` com a DH-T-01 já publicada, o chunk do Conselho passa de 64,34 para 65,49 kB (+1,15 kB, o texto novo dos dados) e o `CouncilPages`, de 34,08 para 34,46 kB (+0,38 kB); o arquivo principal não muda.

### Arquivos e testes

- Alterados: `classificacao.json`, `tradicoes.json`, `CouncilPages.tsx`, `tests/unit/conselho-tradicoes-dht02.test.ts` (novo, 17 testes), `tests/e2e/conselho-biblioteca.spec.ts` (dois testes novos), `historico-decisoes.md` e este ADR.
- Testes, com a DH-T-01 já integrada: 345 unitários (24 arquivos), 95 E2E em três execuções completas (10, 10 e 3 workers), `tsc --noEmit`, build e `npm audit --omit=dev --audit-level=high` sem falhas. O teste da DH-T-01 que fixa o conjunto de registros com `nota` passou de 12 para 15 registros, com os três agregados desta decisão.

## Revisão DH-T-03 (2026-11-25) — DEC-CUR-13: referências bibliográficas e classificação budista

### Problema identificado

A auditoria da Fase 3A apontou três fragilidades nas referências do catálogo:

- **W11 (Bhagavad Gita).** A obra está ligada ao registro `bhagavad-gita` e ao recorte `corpus-bhagavad-gita`, mas nada no repositório diz que o texto integra o Mahābhārata. Já o `escopo` do recorte, transcrito do Documento 14, o chama de "obra/corpus independente".
- **W12 ("Textos budistas sobre as Paramitas").** O título parece o de uma obra, mas é uma rubrica bibliográfica dos Documentos 03 e 04. Sustenta as 11 relações de `tradicoes-budistas`.
- **`field` de `tradicoes-budistas`.** Junta, numa só lista, qualidades que pertencem a listas distintas. O `limits` já avisa que "não formam uma doutrina única", mas nada explica de onde vem a composição.

### Decisão humana (aprovada em 25/11/2026)

1. **W11.** Preservar a obra e o ID. Não inventar autor individual. Registrar que o texto integra o Mahābhārata (livro 6), mantendo edição e tradução "a confirmar". Campo escolhido: `conflito` do recorte (seção "Ponto em aberto na curadoria"), para não alterar `escopo` e `cuidado`, que são transcrições do Documento 14, nem pôr "independente" e "integra o Mahābhārata" lado a lado.
2. **W12.** Identificar como rubrica bibliográfica dos Documentos 03 e 04, não como obra identificada. Não substituir por uma obra única e não desvincular das 11 relações automaticamente. Campo escolhido: `classificacao.nota` de `tradicoes-budistas`.
3. **Revisão futura.** Revisar as referências das 11 relações. Isso afetará relações e snapshots e exige decisão própria.
4. **`field`.** Preservar `field` e `limits`. Explicar a composição da lista na mesma `classificacao.nota`. Alterar o `field` exigiria regravar o snapshot de referência.

### Fontes reabertas antes da redação (25/11/2026)

| Fonte | O que confirma | O que não confirma |
|---|---|---|
| Internet Encyclopedia of Philosophy, "The Bhagavad Gita" (iep.utm.edu/bhagavad-gita) | O Gita "ocorre no início do sexto livro do Mahābhārata" | Nome do parva ("Bhīṣma Parva"), autoria (nem Vyāsa, nem coletiva) e datação do texto |
| Stanford Encyclopedia of Philosophy, "Śāntideva" (plato.stanford.edu/entries/shantideva) | As seis perfeições Mahāyāna estruturam o Bodhicaryāvatāra: generosidade, disciplina moral, paciência, perseverança, estabilidade meditativa e sabedoria | Mapeamento capítulo a capítulo das seis; classificação de benevolência e equanimidade |
| Bhikkhu Bodhi, "A Treatise on the Paramis" (Access to Insight, wheel409) | Dez pāramī, na seção (iii): doação, virtude, renúncia, sabedoria, energia, paciência, veracidade, determinação, benevolência e equanimidade. A lista de dez vem do Buddhavaṃsa; o tratado de Dhammapāla está no comentário ao Cariyāpiṭaka. A lista pāli "difere um pouco" da sânscrita, com um núcleo comum | Ordem e nomes em pāli de cada item (não lidos); seção (xii) sobre a síntese das listas (não lida) |
| Nyanaponika, "The Four Sublime States" (Access to Insight, wheel006) | Os quatro brahmavihāras: mettā, karuṇā, muditā e upekkhā | Qualquer relação entre os brahmavihāras e as pāramī |

Consequências para a redação:

- **Autoria do Gita.** A decisão aprovada falava em autoria "tradicional/coletiva". A fonte consultada não estabelece isso. O texto implementado diz apenas que esta curadoria não atribui autor individual. Autoria tradicional ou coletiva só entra com fonte própria.
- **Origem da lista Theravāda.** A proposta original citava o Cariyāpiṭaka como fonte da lista. A leitura de Bodhi mostra que a lista de dez vem do **Buddhavaṃsa**; o tratado de Dhammapāla está no **comentário ao Cariyāpiṭaka**. A correção vale para o plano da revisão futura, que não cita essas obras na nota.
- **Benevolência e equanimidade.** A nota diz que constam entre as dez pāramī Theravāda (Bodhi) e entre os quatro brahmavihāras (Nyanaponika). Não afirma que o SEP as classifique, porque não classifica.

### O que foi alterado

| Onde | Mudança |
|---|---|
| `tradicoes.json` | `conflito` novo em `corpus-bhagavad-gita`: o texto ocorre no início do sexto livro do Mahābhārata (IEP); o recorte o descreve como obra/corpus independente (Documento 14), mas ele integra o épico, e esta curadoria não atribui a ele um autor individual; W11 e o registro `bhagavad-gita` ficam preservados; edição e tradução seguem "a confirmar" |
| `classificacao.json` | `nota` de `tradicoes-budistas`: mantém a frase da DEC-CUR-02 e acrescenta que a lista do campo corresponde às seis perfeições (pāramitās) Mahāyāna, acrescidas de benevolência e equanimidade, que também constam entre as dez pāramī Theravāda e os quatro brahmavihāras, e que W12 é uma rubrica bibliográfica dos Documentos 03 e 04, não uma obra identificada, com as referências específicas para a revisão das relações |

### O que foi preservado

- `works.json` inteiro: W11 e W12 com ID, título e fonte iguais. Não há campo de nota em obra, e qualquer mudança alteraria a impressão digital do arquivo.
- `thinkers.json`: o `field`, o `limits` e a pergunta de `tradicoes-budistas` (pinados pelo snapshot de referência).
- As 189 relações (todas `proposta`), em especial as 11 de `tradicoes-budistas`, todas apontando para W12.
- Flags `council` (27), pesos, política de diversidade, gate de crise, schema e os snapshots v1, v2 e v2.1.
- `escopo`, `cuidado`, `edicaoTraducao`, `obras` e `parteDe` de `corpus-bhagavad-gita`, e as demais 13 tradições.

### Fora do escopo e limitações

- **Substituição de W12 e revisão das 11 relações.** Não feitas. O plano é citar referências explícitas por tradição: o Bodhicaryāvatāra, de Śāntideva, para as seis perfeições Mahāyāna; o Buddhavaṃsa e o tratado de Dhammapāla, traduzido por Bodhi, para as dez Theravāda. Cada relação precisa de revisão individual, porque cada uma pode apoiar-se em uma lista diferente.
- **Autoria e edição da Gita.** Autoria tradicional ou coletiva, parva e edição/tradução do módulo de leitura seguem sem fonte no repositório.
- **Alcance da leitura das fontes.** Das páginas de Bodhi (cerca de 166 mil caracteres) e do SEP (cerca de 75 mil), a leitura literal alcançou a parte inicial (por volta de 40 mil caracteres de cada); o restante veio resumido por modelo e não foi usado como base. O IEP teve o mesmo limite. As afirmações da nota e do `conflito` usam só o que apareceu no texto literal.
- **Novo tipo de registro bibliográfico, mudança de IDs, pesos, critérios ou política.** Fora desta etapa.
- **Efeito.** Nenhum na seleção. O chunk do Conselho vai de 65,49 para 66,44 kB (+0,95 kB, o texto novo dos dados); o `CouncilPages` (34,46 kB) e o arquivo principal não mudam.

### Arquivos e testes

- Alterados: `classificacao.json`, `tradicoes.json`, `tests/unit/conselho-referencias-dht03.test.ts` (novo, 14 testes), `tests/unit/conselho-tradicoes-dht02.test.ts` (a asserção "só Budismos tem conflito" passa a incluir o corpus da Gita), `tests/e2e/conselho-biblioteca.spec.ts` (um teste novo), `historico-decisoes.md` (v0.10) e este ADR.
- Estabilidade: impressões digitais medidas na `main` antes da alteração provam que os outros 13 recortes, os outros campos do corpus da Gita, as outras 41 classificações e os outros campos de `tradicoes-budistas` são idênticos; as impressões de `thinkers`, `thinkerVirtues`, `works` e `councilCases` e os três snapshots seguem inalterados.
- Prova de que os testes pegam mudanças: 9 mutações aplicadas (autor inventado, "sexto livro" removido, `escopo` do corpus alterado, outro recorte alterado, W12 removida da nota, frase da DEC-CUR-02 removida, obra substituta citada, `field` alterado, título de W12 alterado), todas reprovadas; mais uma mutação da nota reprovada pelo E2E. Uma décima mutação planejada (nota de outra entrada) não se aplicou e não foi contada.
- Resultados: 359 testes unitários (25 arquivos), `tsc --noEmit` e build sem falhas.
