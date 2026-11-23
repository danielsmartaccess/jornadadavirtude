# Comparação das políticas de seleção do Conselho (A/B)

> Gerado por `tests/unit/support/comparacao-politicas.ts` (teste `relatorios-curadoria.test.ts`). Não editar à mão: rode `RELATORIOS=1 npx vitest run tests/unit/relatorios-curadoria.test.ts`.

| Campo | Valor |
|---|---|
| Decisão | DEC-CUR-05, DEC-CUR-02 e DEC-CUR-07 (ver ADR-CUR-02 e ADR-CUR-03) |
| Política A | `council-selection-v1-doc04` (histórica/legada) |
| Política B | `council-selection-v2-doc13` (operacional) |
| Entradas | 79 (as mesmas do snapshot de referência: 48 virtudes, 8 famílias, 6 casos pela situação, 6 casos pelos identificadores, 7 dimensões, entrada vazia, limites 2, 3 e 4) |

## Pesos

| Critério (Documento 13, seção 7.1) | Como é calculado (0 a 1) | v1 (Doc. 04) | v2 (Doc. 13) |
|---|---|---:|---:|
| Pertinência à questão central | integra o caso de referência mais aderente (1) ou outro caso reconhecido (0,6) | 30% | 30% |
| Relação fundamentada com virtudes | força das relações com as virtudes pedidas, com teto 1 (não soma relações cadastradas fora da pergunta) | 35% | 25% |
| Disponibilidade e qualidade das fontes | v1: obra no catálogo (1/0). v2: obra no catálogo ou referência-base conferida (1), referência-base a conferir (0,5), nada (0) | 10% | 15% |
| Complementaridade das perspectivas | tradição ainda não representada entre os já escolhidos (1/0) | 10% | 15% |
| Diversidade intelectual/cultural pertinente | universo principal ainda não representado (1/0); só entre candidatos já pertinentes | 0% | 10% |
| Adequação ao contexto | fração das dimensões da situação cobertas pelas virtudes do pensador | 15% | 5% |
| **Total** | | 100% | 100% |

Regras além dos pesos na v2:

- corpus/tradição não ocupa vaga de voz individual (DEC-CUR-02);
- exige fonte recuperável (Documento 13, seção 7.2);
- limite por universo principal: com 5 vozes, no máximo 2 do mesmo universo; com 2 a 4 vozes, ao menos 2 universos, quando houver alternativa elegível (DEC-CUR-07). Sem alternativa, a exceção é registrada;
- desempate: pertinência, qualidade da fonte, complementaridade e `thinker_id` (Documento 13, seção 7.3). Na v1, o desempate era pelo nome.

## Resultado agregado

| Indicador | v1 | v2 |
|---|---:|---:|
| Entradas com Conselho reunido | 71 | 71 |
| Média de vozes por Conselho | 3,85 | 3,69 |
| Vozes sem nenhuma fonte recuperável | 0 | 0 |
| Corpus convocado como voz | 19 | 0 |
| Dalai Lama e Tradições budistas como duas vozes | 3 | 0 |
| Média de universos por Conselho | 1,66 | 1,63 |
| Maior número de vozes do mesmo universo | 5 | 5 |
| Conselhos acima do limite por universo | 47 | 47 |
| Conselhos com exceção de diversidade registrada | — | 47 |
| Média da relação com as virtudes pedidas (vozes escolhidas) | 0,518 | 0,494 |
| Média da pertinência ao caso (vozes escolhidas) | 0,238 | 0,248 |
| Entradas com seleção diferente (vozes ou ordem) | — | 46 de 79 |
| Entradas com conjunto de vozes diferente | — | 27 de 79 |

## Concentração: aparições por voz nas 79 entradas

| Voz | v1 | v2 | Diferença |
|---|---:|---:|---:|
| Aristóteles | 45 | 44 | -1 |
| Confúcio | 34 | 32 | -2 |
| Marco Aurélio | 22 | 22 | 0 |
| Tradições budistas | 19 | 0 | -19 |
| Sócrates | 16 | 13 | -3 |
| Platão | 15 | 12 | -3 |
| Tomás de Aquino | 13 | 13 | 0 |
| Immanuel Kant | 12 | 11 | -1 |
| Simone Weil | 10 | 11 | +1 |
| Epicteto | 10 | 8 | -2 |
| Miyamoto Musashi | 9 | 10 | +1 |
| Daniel Kahneman | 7 | 11 | +4 |
| Sêneca | 6 | 8 | +2 |
| Viktor Frankl | 6 | 8 | +2 |
| Benjamin Franklin | 6 | 6 | 0 |
| John Stuart Mill | 6 | 6 | 0 |
| Erich Fromm | 5 | 8 | +3 |
| Nassim Taleb | 4 | 5 | +1 |
| Richard Feynman | 4 | 4 | 0 |
| Dalai Lama (Tenzin Gyatso) | 3 | 7 | +4 |
| Karl Popper | 3 | 4 | +1 |
| Lao-Tsé | 3 | 4 | +1 |
| Peter Drucker | 3 | 4 | +1 |
| Donella Meadows | 3 | 3 | 0 |
| Edith Stein | 3 | 3 | 0 |
| John Locke | 3 | 3 | 0 |
| John Rawls | 3 | 2 | -1 |

## Os seis casos de referência

#### CASE01 Dificuldade em controlar a raiva (pela situação descrita)

- v1: Marco Aurélio, Aristóteles, Epicteto, Confúcio, Platão
- v2: Marco Aurélio, Aristóteles, Daniel Kahneman, Epicteto, Confúcio
- Saiu Platão: pontuação menor que a das vozes escolhidas com os pesos do Documento 13 (por exemplo, quem integra o caso de referência passa a pesar mais que a relação com virtudes).
- Entrou Daniel Kahneman (Psicologia e ciências humanas): relação com as virtudes 0,00, pertinência ao caso 1,00, fontes 1,00.
- Exceção registrada: Vaga 4: sem alternativa pertinente de outro universo; Epicteto entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Confúcio entra acima do limite de 2 por universo (filosofia-etica).

#### CASE02 Dificuldade em admitir erros (pela situação descrita)

- v1: Aristóteles, Confúcio, Immanuel Kant, Sócrates, Daniel Kahneman
- v2: Aristóteles, Confúcio, Daniel Kahneman, Immanuel Kant, Sócrates
- Mesmas vozes, ordem diferente.
- Exceção registrada: Vaga 4: sem alternativa pertinente de outro universo; Immanuel Kant entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Sócrates entra acima do limite de 2 por universo (filosofia-etica).

#### CASE03 Dificuldade em manter compromissos (pela situação descrita)

- v1: Aristóteles, Confúcio, Miyamoto Musashi, Viktor Frankl, Benjamin Franklin
- v2: Aristóteles, Miyamoto Musashi, Viktor Frankl, Confúcio, Benjamin Franklin
- Mesmas vozes, ordem diferente.
- Exceção registrada: Vaga 4: sem alternativa pertinente de outro universo; Confúcio entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Benjamin Franklin entra acima do limite de 2 por universo (filosofia-etica).

#### CASE04 Dificuldade em perdoar (pela situação descrita)

- v1: Tradições budistas, Marco Aurélio, Simone Weil, Erich Fromm, Confúcio
- v2: Marco Aurélio, Erich Fromm, Simone Weil, Dalai Lama (Tenzin Gyatso), Sêneca
- Saiu Tradições budistas: corpus de apoio, não ocupa vaga como voz (DEC-CUR-02).
- Saiu Confúcio: pontuação menor que a das vozes escolhidas com os pesos do Documento 13 (por exemplo, quem integra o caso de referência passa a pesar mais que a relação com virtudes).
- Entrou Dalai Lama (Tenzin Gyatso) (Tradições espirituais e contemplativas): relação com as virtudes 0,97, pertinência ao caso 0,00, fontes 1,00.
- Entrou Sêneca (Filosofia e ética): relação com as virtudes 0,28, pertinência ao caso 1,00, fontes 1,00.
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Sêneca entra acima do limite de 2 por universo (filosofia-etica).

#### CASE05 Dificuldade em tomar decisões (pela situação descrita)

- v1: Aristóteles, Daniel Kahneman, Epicteto, Nassim Taleb, Sócrates
- v2: Aristóteles, Daniel Kahneman, Nassim Taleb, Epicteto, Sócrates
- Mesmas vozes, ordem diferente.
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Sócrates entra acima do limite de 2 por universo (filosofia-etica).

#### CASE06 Dificuldade em ouvir outras pessoas (pela situação descrita)

- v1: Confúcio, Simone Weil, Sócrates, Edith Stein, John Stuart Mill
- v2: Confúcio, Simone Weil, Edith Stein, Sócrates, John Stuart Mill
- Mesmas vozes, ordem diferente.
- Exceção registrada: Vaga 3: sem alternativa pertinente de outro universo; Edith Stein entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 4: sem alternativa pertinente de outro universo; Sócrates entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; John Stuart Mill entra acima do limite de 2 por universo (filosofia-etica).

#### CASE01 Dificuldade em controlar a raiva (pelos identificadores do caso)

- v1: Marco Aurélio, Aristóteles, Epicteto, Confúcio, Platão
- v2: Marco Aurélio, Aristóteles, Daniel Kahneman, Epicteto, Confúcio
- Saiu Platão: pontuação menor que a das vozes escolhidas com os pesos do Documento 13 (por exemplo, quem integra o caso de referência passa a pesar mais que a relação com virtudes).
- Entrou Daniel Kahneman (Psicologia e ciências humanas): relação com as virtudes 0,00, pertinência ao caso 1,00, fontes 1,00.
- Exceção registrada: Vaga 4: sem alternativa pertinente de outro universo; Epicteto entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Confúcio entra acima do limite de 2 por universo (filosofia-etica).

#### CASE02 Dificuldade em admitir erros (pelos identificadores do caso)

- v1: Aristóteles, Confúcio, Immanuel Kant, Sócrates, Daniel Kahneman
- v2: Aristóteles, Confúcio, Daniel Kahneman, Immanuel Kant, Sócrates
- Mesmas vozes, ordem diferente.
- Exceção registrada: Vaga 4: sem alternativa pertinente de outro universo; Immanuel Kant entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Sócrates entra acima do limite de 2 por universo (filosofia-etica).

#### CASE03 Dificuldade em manter compromissos (pelos identificadores do caso)

- v1: Aristóteles, Confúcio, Miyamoto Musashi, Viktor Frankl, Benjamin Franklin
- v2: Aristóteles, Miyamoto Musashi, Viktor Frankl, Confúcio, Benjamin Franklin
- Mesmas vozes, ordem diferente.
- Exceção registrada: Vaga 4: sem alternativa pertinente de outro universo; Confúcio entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Benjamin Franklin entra acima do limite de 2 por universo (filosofia-etica).

#### CASE04 Dificuldade em perdoar (pelos identificadores do caso)

- v1: Tradições budistas, Marco Aurélio, Simone Weil, Erich Fromm, Confúcio
- v2: Marco Aurélio, Erich Fromm, Simone Weil, Dalai Lama (Tenzin Gyatso), Sêneca
- Saiu Tradições budistas: corpus de apoio, não ocupa vaga como voz (DEC-CUR-02).
- Saiu Confúcio: pontuação menor que a das vozes escolhidas com os pesos do Documento 13 (por exemplo, quem integra o caso de referência passa a pesar mais que a relação com virtudes).
- Entrou Dalai Lama (Tenzin Gyatso) (Tradições espirituais e contemplativas): relação com as virtudes 0,97, pertinência ao caso 0,00, fontes 1,00.
- Entrou Sêneca (Filosofia e ética): relação com as virtudes 0,28, pertinência ao caso 1,00, fontes 1,00.
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Sêneca entra acima do limite de 2 por universo (filosofia-etica).

#### CASE05 Dificuldade em tomar decisões (pelos identificadores do caso)

- v1: Aristóteles, Daniel Kahneman, Epicteto, Nassim Taleb, Sócrates
- v2: Aristóteles, Daniel Kahneman, Nassim Taleb, Epicteto, Miyamoto Musashi
- Saiu Sócrates: pontuação menor que a das vozes escolhidas com os pesos do Documento 13 (por exemplo, quem integra o caso de referência passa a pesar mais que a relação com virtudes).
- Entrou Miyamoto Musashi (Filosofia e ética): relação com as virtudes 0,78, pertinência ao caso 0,00, fontes 1,00.
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; Miyamoto Musashi entra acima do limite de 2 por universo (filosofia-etica).

#### CASE06 Dificuldade em ouvir outras pessoas (pelos identificadores do caso)

- v1: Confúcio, Simone Weil, Sócrates, Edith Stein, John Stuart Mill
- v2: Confúcio, Simone Weil, Edith Stein, Sócrates, John Stuart Mill
- Mesmas vozes, ordem diferente.
- Exceção registrada: Vaga 3: sem alternativa pertinente de outro universo; Edith Stein entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 4: sem alternativa pertinente de outro universo; Sócrates entra acima do limite de 2 por universo (filosofia-etica).
- Exceção registrada: Vaga 5: sem alternativa pertinente de outro universo; John Stuart Mill entra acima do limite de 2 por universo (filosofia-etica).

## Determinismo

Cada entrada foi executada duas vezes por política; os resultados foram idênticos (verificado pelo teste que gera este relatório).
