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
