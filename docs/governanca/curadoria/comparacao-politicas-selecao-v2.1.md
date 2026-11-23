# Comparação das políticas de seleção: v1, v2 e v2.1

> Gerado por `tests/unit/support/comparacao-tres-politicas.ts` (teste `relatorios-curadoria.test.ts`). Não editar à mão. Regenerar: `RELATORIOS=1 npx vitest run tests/unit/relatorios-curadoria.test.ts`.

| Campo | Valor |
|---|---|
| Decisão | DEC-CUR-10 (revisão humana da Fase 2), sobre DEC-CUR-05 e DEC-CUR-07; ver ADR-CUR-03 e ADR-CUR-04 |
| Data da execução | 2026-11-23 |
| Commit-base | `0b2c40d` (branch `curadoria/fase-2-decisoes` antes da revisão), sobre `5d81ecc` |
| Políticas | `council-selection-v1-doc04` (histórica), `council-selection-v2-doc13` (baseline da branch), `council-selection-v2.1-doc13-relevance-source` (operacional) |
| Entradas | 79, as mesmas dos snapshots: 48 virtudes, 8 famílias, 6 casos pela situação, 6 casos pelos identificadores, 7 dimensões, entrada vazia, limites 2, 3 e 4 |
| Ambiente | Vitest (Node), dados do catálogo da branch; sem rede, sem dados de usuários |
| Comparação anterior | `comparacao-politicas-selecao.md` (v1 × v2), preservada e ainda reproduzida pelo mesmo teste |

## O que muda da v2 para a v2.1

Pesos iguais (30/25/15/15/10/5). Duas regras mudam:

1. **Alternativa qualificada para a diversidade.** Na v2, bastava integrar o caso ou ter relação prioritária no Documento 04. Na v2.1, é preciso pertinência temática demonstrada (relação prioritária ou `relationType` com uma virtude pedida) **e** pertinência contextual documentada (o caso de referência registra uma perspectiva própria para a pessoa, distinta do campo geral dela). Só quem é qualificado recebe o critério de diversidade ou pode substituir uma voz acima do limite por universo. Sem caso de referência, a pertinência contextual é `insufficient_data` e não há substituição.
2. **Fonte.** Na v2, uma referência-base com metadados editoriais a conferir valia 0,5. Na v2.1, o critério mede só se há fonte identificada (obra do catálogo ou referência-base que identifica a obra ou o testemunho): 1 ou 0. Completude bibliográfica e confiabilidade são registradas à parte e não pontuam.

## Definições das métricas

- **Média de "integra o caso"**: média, entre as vozes escolhidas, do critério de pertinência do Documento 13 como calculado pelo motor (1 se integra o caso mais aderente, 0,6 se integra outro caso, 0 se não integra). Mede pertença ao caso, não pertinência contextual comprovada.
- **Média da relação com as virtudes pedidas**: média do critério de relação (força das relações com as virtudes pedidas, com teto 1).
- **Vozes com pertinência temática demonstrada / contextual documentada / qualificadas**: contagem de vozes escolhidas, somadas em todas as entradas, segundo a avaliação da v2.1 (calculada para as três políticas, para comparação).
- **Substituições**: vagas em que a voz mais pontuada excedia o limite do universo e foi trocada por uma alternativa de outro universo. **Qualificadas**: a alternativa tinha as duas pertinências.
- **Fonte com metadados pendentes**: vozes escolhidas cuja única fonte são referências-base sem editora, ano e ISBN/DOI completos.
- Não há teste estatístico: as diferenças descrevem estas 79 entradas, não uma população.

## Resultado agregado

| Indicador | v1 | v2 | v2.1 |
|---|---:|---:|---:|
| Entradas com Conselho reunido | 71 | 71 | 71 |
| Total de vozes escolhidas | 273 | 262 | 262 |
| Média de vozes por Conselho | 3,845 | 3,690 | 3,690 |
| Corpus convocado como voz | 19 | 0 | 0 |
| Dalai Lama e Tradições budistas como duas vozes | 3 | 0 | 0 |
| Média de "integra o caso" | 0,2381 | 0,2481 | 0,2557 |
| Média da relação com as virtudes pedidas | 0,5178 | 0,4943 | 0,4970 |
| Vozes com pertinência temática demonstrada | 219 de 273 | 205 de 262 | 205 de 262 |
| Vozes com pertinência contextual documentada | 65 de 273 | 65 de 262 | 67 de 262 |
| Vozes qualificadas (temática e contextual) | 52 de 273 | 46 de 262 | 48 de 262 |
| Média de universos por Conselho | 1,662 | 1,634 | 1,549 |
| Maior número de vozes do mesmo universo | 5 | 5 | 5 |
| Conselhos acima do limite por universo | 47 | 47 | 48 |
| Vagas com substituição por diversidade | 0 | 11 | 2 |
| Vagas com substituição por alternativa qualificada | 0 | 2 | 2 |
| Conselhos com ao menos uma exceção de diversidade | 0 | 47 | 48 |
| Vagas em exceção: sem alternativa pertinente (regra da v2) | 0 | 79 | 0 |
| Vagas em exceção: sem alternativa qualificada | 0 | 0 | 23 |
| Vagas em exceção: sem caso, contexto não avaliável | 0 | 0 | 61 |
| Vozes com fonte de metadados pendentes | 42 | 42 | 45 |

**Variação relativa** (mesma base de 79 entradas, sem inferência estatística):

- "Integra o caso": v1 → v2 +4,20%; v2 → v2.1 +3,08%; v1 → v2.1 +7,40%.
- Relação com as virtudes pedidas: v1 → v2 -4,54%; v2 → v2.1 +0,56%; v1 → v2.1 -4,00%.

## Mudanças de seleção

| Comparação | Vozes ou ordem diferentes | Conjunto de vozes diferente |
|---|---:|---:|
| v1 → v2 | 46 de 79 | 27 de 79 |
| v2 → v2.1 | 29 de 79 | 6 de 79 |
| v1 → v2.1 | 40 de 79 | 25 de 79 |

## Os seis casos de referência

#### CASE01 Dificuldade em controlar a raiva (pela situação descrita)

- v1: Marco Aurélio, Aristóteles, Epicteto, Confúcio, Platão
- v2: Marco Aurélio, Aristóteles, Daniel Kahneman, Epicteto, Confúcio
- v2.1: Marco Aurélio, Aristóteles, Epicteto, Confúcio, Daniel Kahneman
- De v2 para v2.1: mesmas vozes, ordem diferente.
- Exceção na v2.1 (vaga 3): Epicteto, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 4): Confúcio, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE02 Dificuldade em admitir erros (pela situação descrita)

- v1: Aristóteles, Confúcio, Immanuel Kant, Sócrates, Daniel Kahneman
- v2: Aristóteles, Confúcio, Daniel Kahneman, Immanuel Kant, Sócrates
- v2.1: Aristóteles, Confúcio, Immanuel Kant, Sócrates, Daniel Kahneman
- De v2 para v2.1: mesmas vozes, ordem diferente.
- Exceção na v2.1 (vaga 3): Immanuel Kant, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 4): Sócrates, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE03 Dificuldade em manter compromissos (pela situação descrita)

- v1: Aristóteles, Confúcio, Miyamoto Musashi, Viktor Frankl, Benjamin Franklin
- v2: Aristóteles, Miyamoto Musashi, Viktor Frankl, Confúcio, Benjamin Franklin
- v2.1: Aristóteles, Miyamoto Musashi, Viktor Frankl, Confúcio, Benjamin Franklin
- De v2 para v2.1: mesmas vozes, mesma ordem.
- Substituição na v2.1 (vaga 3): Viktor Frankl no lugar de Confúcio — temática demonstrada (TV-V21-viktor-frankl), contextual documentada (CASE03: "Responsabilidade e sentido"); universos antes: Filosofia e ética.
- Exceção na v2.1 (vaga 4): Confúcio, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 5): Benjamin Franklin, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE04 Dificuldade em perdoar (pela situação descrita)

- v1: Tradições budistas, Marco Aurélio, Simone Weil, Erich Fromm, Confúcio
- v2: Marco Aurélio, Erich Fromm, Simone Weil, Dalai Lama (Tenzin Gyatso), Sêneca
- v2.1: Marco Aurélio, Simone Weil, Erich Fromm, Dalai Lama (Tenzin Gyatso), Sêneca
- De v2 para v2.1: mesmas vozes, ordem diferente.
- Exceção na v2.1 (vaga 5): Sêneca, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE05 Dificuldade em tomar decisões (pela situação descrita)

- v1: Aristóteles, Daniel Kahneman, Epicteto, Nassim Taleb, Sócrates
- v2: Aristóteles, Daniel Kahneman, Nassim Taleb, Epicteto, Sócrates
- v2.1: Aristóteles, Daniel Kahneman, Epicteto, Nassim Taleb, Sócrates
- De v2 para v2.1: mesmas vozes, ordem diferente.
- Exceção na v2.1 (vaga 5): Sócrates, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE06 Dificuldade em ouvir outras pessoas (pela situação descrita)

- v1: Confúcio, Simone Weil, Sócrates, Edith Stein, John Stuart Mill
- v2: Confúcio, Simone Weil, Edith Stein, Sócrates, John Stuart Mill
- v2.1: Confúcio, Simone Weil, Sócrates, Edith Stein, John Stuart Mill
- De v2 para v2.1: mesmas vozes, ordem diferente.
- Exceção na v2.1 (vaga 3): Sócrates, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 4): Edith Stein, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 5): John Stuart Mill, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE01 Dificuldade em controlar a raiva (pelos identificadores do caso)

- v1: Marco Aurélio, Aristóteles, Epicteto, Confúcio, Platão
- v2: Marco Aurélio, Aristóteles, Daniel Kahneman, Epicteto, Confúcio
- v2.1: Marco Aurélio, Aristóteles, Epicteto, Confúcio, Daniel Kahneman
- De v2 para v2.1: mesmas vozes, ordem diferente.
- Exceção na v2.1 (vaga 3): Epicteto, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 4): Confúcio, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE02 Dificuldade em admitir erros (pelos identificadores do caso)

- v1: Aristóteles, Confúcio, Immanuel Kant, Sócrates, Daniel Kahneman
- v2: Aristóteles, Confúcio, Daniel Kahneman, Immanuel Kant, Sócrates
- v2.1: Aristóteles, Confúcio, Immanuel Kant, Sócrates, Daniel Kahneman
- De v2 para v2.1: mesmas vozes, ordem diferente.
- Exceção na v2.1 (vaga 3): Immanuel Kant, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 4): Sócrates, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE03 Dificuldade em manter compromissos (pelos identificadores do caso)

- v1: Aristóteles, Confúcio, Miyamoto Musashi, Viktor Frankl, Benjamin Franklin
- v2: Aristóteles, Miyamoto Musashi, Viktor Frankl, Confúcio, Benjamin Franklin
- v2.1: Aristóteles, Miyamoto Musashi, Viktor Frankl, Confúcio, Benjamin Franklin
- De v2 para v2.1: mesmas vozes, mesma ordem.
- Substituição na v2.1 (vaga 3): Viktor Frankl no lugar de Confúcio — temática demonstrada (TV-V21-viktor-frankl), contextual documentada (CASE03: "Responsabilidade e sentido"); universos antes: Filosofia e ética.
- Exceção na v2.1 (vaga 4): Confúcio, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 5): Benjamin Franklin, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE04 Dificuldade em perdoar (pelos identificadores do caso)

- v1: Tradições budistas, Marco Aurélio, Simone Weil, Erich Fromm, Confúcio
- v2: Marco Aurélio, Erich Fromm, Simone Weil, Dalai Lama (Tenzin Gyatso), Sêneca
- v2.1: Marco Aurélio, Simone Weil, Erich Fromm, Dalai Lama (Tenzin Gyatso), Sêneca
- De v2 para v2.1: mesmas vozes, ordem diferente.
- Exceção na v2.1 (vaga 5): Sêneca, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE05 Dificuldade em tomar decisões (pelos identificadores do caso)

- v1: Aristóteles, Daniel Kahneman, Epicteto, Nassim Taleb, Sócrates
- v2: Aristóteles, Daniel Kahneman, Nassim Taleb, Epicteto, Miyamoto Musashi
- v2.1: Aristóteles, Daniel Kahneman, Epicteto, Nassim Taleb, Sócrates
- Saiu Miyamoto Musashi (Filosofia e ética): pontuação menor que a das vozes escolhidas na v2.1.
- Entrou Sócrates (Filosofia e ética): relação com as virtudes 0,425, integra o caso 1,000, fonte 1,000; pertinência temática demonstrada, contextual documentada; critério de fonte 0,500 na v2 → 1,000 na v2.1.
- Exceção na v2.1 (vaga 5): Sócrates, Filosofia e ética, motivo `sem-alternativa-qualificada`.

#### CASE06 Dificuldade em ouvir outras pessoas (pelos identificadores do caso)

- v1: Confúcio, Simone Weil, Sócrates, Edith Stein, John Stuart Mill
- v2: Confúcio, Simone Weil, Edith Stein, Sócrates, John Stuart Mill
- v2.1: Confúcio, Simone Weil, Sócrates, Edith Stein, John Stuart Mill
- De v2 para v2.1: mesmas vozes, ordem diferente.
- Exceção na v2.1 (vaga 3): Sócrates, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 4): Edith Stein, Filosofia e ética, motivo `sem-alternativa-qualificada`.
- Exceção na v2.1 (vaga 5): John Stuart Mill, Filosofia e ética, motivo `sem-alternativa-qualificada`.

## CASE05 (decisões) pelos identificadores: reavaliação

Ordem completa de escolha, sem corte de vagas (pontuação total da vaga entre parênteses), para mostrar onde cada voz ficaria:

- v2: Aristóteles (1,0000); Daniel Kahneman (0,8708); Nassim Taleb (0,8187); Epicteto (0,7375); Miyamoto Musashi (0,5438); Sócrates (0,5313); Tomás de Aquino (0,5250); Donella Meadows (0,4187); Platão (0,3937); Marco Aurélio (0,3750)
- v2.1: Aristóteles (1,0000); Daniel Kahneman (0,8708); Epicteto (0,7375); Nassim Taleb (0,7188); Sócrates (0,6062); Miyamoto Musashi (0,5438); Tomás de Aquino (0,5250); Donella Meadows (0,4187); Platão (0,3937); Marco Aurélio (0,3750)

- Sócrates: v2 → fonte 0,500, relação 0,425, integra o caso 1,000; v2.1 → fonte 1,000, relação 0,425, integra o caso 1,000. Avaliação na v2.1: {"caseMember":true,"thematicRelevance":"demonstrada","contextualRelevance":"documentada","diversityEligible":true,"evidencia":{"relacoes":["TV-V03-socrates"],"caso":"CASE05","perspectiva":"Investigação dos pressupostos"}}.
- Miyamoto Musashi: v2 → fonte 1,000, relação 0,775, integra o caso 0,000; v2.1 → fonte 1,000, relação 0,775, integra o caso 0,000. Avaliação na v2.1: "não escolhido entre as 5".

## Determinismo

Cada entrada foi executada duas vezes por política; os resultados foram idênticos (verificado pelo teste que gera este relatório e por `conselho-fase2-revisao.test.ts`).

Rótulos: v1 = `council-selection-v1-doc04`; v2 = `council-selection-v2-doc13`; v2.1 = `council-selection-v2.1-doc13-relevance-source`.
