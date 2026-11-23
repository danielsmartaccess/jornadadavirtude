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
