# Documento 04 — Matriz de Integração: complemento de conformidade

## Sete Dimensões × Virtudes × Pensadores — situação operacional

| Campo | Valor |
|---|---|
| Número e título | Documento 04 — Matriz de Integração (complemento de conformidade) |
| Versão | 0.2 |
| Data de reconstrução | 2026-11-23 |
| Status | COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO |
| Relação com o original | **Não substitui** o Documento 04 v1.0 (`docs/DOCUMENTO-04-matriz-de-integracao.txt`), que existe e é recuperável. Este complemento confronta o original com o catálogo operacional e com o Documento 12. |
| Fontes utilizadas | EV-02, EV-03, EV-04, EV-08, EV-09, EV-10, EV-14, EV-29, EV-31 (ver `../rastreabilidade/inventario-evidencias.md`) |
| Limitações conhecidas | Nenhuma relação foi validada por curadoria (todas em `proposta`). Não examinei obras primárias: as associações vêm dos documentos do projeto. A comparação entre os termos de virtude do Documento 12 e as 48 virtudes do catálogo é aproximada. |

### Histórico de revisão

| Versão | Data | Descrição |
|---|---|---|
| 0.1 | 2026-11-23 | Primeira versão do complemento, a partir do código em `b23ddac`. |
| 0.2 | 2026-11-23 | Reclassificação documental: COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO. Conteúdo e proveniência preservados. |

---

## 1. Objetivo e escopo

Documentar como as sete dimensões, as 48 virtudes e os pensadores e tradições estão **efetivamente relacionados nos dados da aplicação**, e onde isso diverge dos documentos de referência.

Este complemento não altera dados, não valida associações e não decide divergências. As decisões ficam registradas em `../decisoes/historico-decisoes.md`.

## 2. As sete dimensões

Fonte conceitual: Documento 02 (EV-02). Códigos: Documento 04 §4 (EV-04). Registro operacional: `src/data/dimensions.json` (EV-31).

| Código | Dimensão (nome curto no app) | Grupo | Nome tradicional associado (Doc. 02) | Status operacional |
|---|---|---|---|---|
| DIM01 | Etéreo-físico (Físico) | Personalidade | Sthula Sharira | proposta |
| DIM02 | Vital ou energético (Vital) | Personalidade | Prana Sharira | proposta |
| DIM03 | Emocional ou psicológico (Emocional) | Personalidade | Linga Sharira | proposta |
| DIM04 | Mental concreto | Personalidade | Kama-Manas | proposta |
| DIM05 | Mente pura | Individualidade superior | Manas | proposta |
| DIM06 | Intuição | Individualidade superior | Buddhi | proposta |
| DIM07 | Vontade | Individualidade superior | Atma | proposta |

O Documento 02 §1.2 e §9 classifica as dimensões como **representação filosófica e espiritual, não científica**. Isso continua valendo e deve acompanhar qualquer uso da matriz.

## 3. Taxonomia das virtudes

Fonte: Documento 03 (EV-03); registro operacional `src/data/virtue-families.json` e `virtues.json` (EV-31).

| Família | Nome | Virtudes no catálogo |
|---|---|---:|
| F01 | Sabedoria e discernimento | 5 |
| F02 | Autodomínio e equilíbrio | 6 |
| F03 | Coragem e fortaleza | 6 |
| F04 | Justiça e integridade | 6 |
| F05 | Relações humanas e fraternidade | 9 |
| F06 | Conhecimento e verdade | 5 |
| F07 | Propósito e realização | 6 |
| F08 | Consciência superior e sentido | 5 |
| **Total** | | **48** |

## 4. Relações entre virtudes e dimensões

### 4.1. Situação operacional

| Indicador | Valor | Evidência |
|---|---:|---|
| Relações registradas | 176 | `src/data/virtue-dimensions.json` |
| D1 (primária) | 120 | idem |
| D2 (secundária) | 56 | idem |
| D3 (contextual) | **0** | idem; o tipo existe em `src/domain/types.ts`, mas não há dado |
| Com justificativa preenchida | **0** | campo `justification` nulo em todas |
| Fonte declarada | `DOC03-6.1` em todas | as relações seguem as listas de dimensões do Documento 03 |
| Status | `proposta` em todas | nenhuma validada nem suspensa |
| Virtudes sem relação D1 | nenhuma | |

### 4.2. Divergência entre o Documento 04 e os dados

O Documento 04 §5 lista as "dimensões principais" de cada uma das 48 virtudes. Comparei essa lista, virtude por virtude, com as relações D1 do catálogo:

- **26 virtudes:** as dimensões principais do Documento 04 coincidem com as D1 do catálogo.
- **22 virtudes:** o Documento 04 cita uma dimensão principal que o catálogo registra como D2. Em todas as 22, a dimensão existe no catálogo, só com classificação diferente.
- **2 dessas 22** têm, além disso, uma D1 que o Documento 04 não cita: Responsabilidade (DIM01) e Respeito (DIM07).

| Virtude | Doc. 04 §5 (principais) | D1 no catálogo | D2 no catálogo |
|---|---|---|---|
| V01 Prudência | DIM04, DIM05, DIM07 | DIM04, DIM05 | DIM03, DIM06, DIM07 |
| V02 Sabedoria | DIM04, DIM05, DIM06 | DIM05, DIM06 | DIM04, DIM07 |
| V03 Discernimento | DIM04, DIM05, DIM06 | DIM04, DIM05 | DIM03, DIM06 |
| V04 Atenção | DIM03, DIM04 | DIM04 | DIM02, DIM03, DIM05 |
| V07 Paciência | DIM02, DIM03, DIM07 | DIM03, DIM07 | DIM02, DIM04 |
| V08 Serenidade | DIM02, DIM03, DIM04 | DIM03 | DIM02, DIM04, DIM06 |
| V11 Equanimidade | DIM03, DIM05, DIM06 | DIM03, DIM06 | DIM04, DIM05 |
| V14 Perseverança | DIM02, DIM04, DIM07 | DIM02, DIM07 | DIM03, DIM04 |
| V17 Constância | DIM02, DIM04, DIM07 | DIM02, DIM07 | DIM04 |
| V20 Integridade | DIM04, DIM05, DIM07 | DIM05, DIM07 | DIM04 |
| V21 Responsabilidade | DIM04, DIM05, DIM07 | DIM01, DIM04, DIM07 | DIM05 |
| V22 Equidade | DIM04, DIM05, DIM06 | DIM04, DIM05 | DIM03, DIM06 |
| V23 Fidelidade | DIM03, DIM05, DIM07 | DIM03, DIM07 | DIM05 |
| V25 Empatia | DIM03, DIM04, DIM06 | DIM03, DIM06 | DIM04 |
| V28 Gratidão | DIM03, DIM05, DIM06 | DIM03, DIM05 | DIM06 |
| V30 Tolerância | DIM03, DIM04, DIM05 | DIM03, DIM04 | DIM05 |
| V32 Respeito | DIM03, DIM04, DIM05 | DIM03, DIM05, DIM07 | DIM04 |
| V35 Sinceridade | DIM03, DIM04, DIM07 | DIM03, DIM04 | DIM07 |
| V36 Amor à verdade | DIM04, DIM05, DIM06 | DIM04, DIM05 | DIM06, DIM07 |
| V40 Compromisso | DIM04, DIM05, DIM07 | DIM04, DIM07 | DIM05 |
| V43 Serviço | DIM03, DIM05, DIM06, DIM07 | DIM03, DIM05, DIM07 | DIM06 |
| V44 Humildade | DIM03, DIM04, DIM05 | DIM03, DIM05 | DIM04, DIM06 |

**Pendência D-04-01:** qual documento é a referência das dimensões por virtude, o Documento 03 (seguido pelos dados) ou o Documento 04 §5? E "dimensão principal" do Documento 04 equivale a D1, ou a D1 mais D2?

## 5. Pensadores e tradições: três conjuntos diferentes

### 5.1. Os conjuntos

| Conjunto | Fonte | Quantidade | Composição |
|---|---|---:|---|
| Relação nominal do Documento 04 | EV-04 §6 | 26 | Sócrates, Platão, Aristóteles, Confúcio, Lao-Tsé, Epicteto, Sêneca, Marco Aurélio, Tomás de Aquino, Kant, Musashi, Simone Weil, Viktor Frankl, Daniel Kahneman, Richard Feynman, Karl Popper, John Stuart Mill, John Locke, John Rawls, Edith Stein, Erich Fromm, Nassim Taleb, Donella Meadows, Benjamin Franklin, Peter Drucker, Dalai Lama |
| **Habilitados no Conselho (operacional)** | EV-31, `thinkers.json` com `council: true`; percorridos por `selectThinkers` (EV-29) | **27** | Os 26 do Documento 04 **mais "Tradições budistas"** (registro do tipo `tradicao`) |
| Catálogo operacional completo | EV-31 | 42 | Os 27 habilitados, mais 9 pensadores e 6 tradições citados como referência de virtudes e não habilitados: William James, Bertrand Russell, Leonardo da Vinci, Francis Bacon, Voltaire, Cícero, Adam Smith, Søren Kierkegaard, Ernst Bloch; Estoicismo, Tradições cristãs, Tradições humanistas, Tradições religiosas, Tradições contemplativas, Bhagavad Gita |
| Catálogo curatorial do Documento 12 | EV-08 | 34 | Os 26 do Documento 04, Hillel (de "relação curatorial anterior", segundo a nota do próprio Documento 12) e 7 acrescentados na reconstrução: Maimônides, Martin Buber, Mêncio, Nāgārjuna, Al-Ghazali, Hannah Arendt, Paulo Freire |

### 5.2. Diferenças entre os conjuntos

| Diferença | Detalhe | Consequência |
|---|---|---|
| Os 8 nomes novos do Documento 12 não estão no sistema | Hillel, Maimônides, Buber, Mêncio, Nāgārjuna, Al-Ghazali, Arendt e Freire não constam de `thinkers.json` | **Não estão habilitados no Conselho.** O Documento 12 é catálogo curatorial, não operacional. |
| "Tradições budistas" está habilitada, mas não existe no Documento 12 | Registro `tradicoes-budistas`, com 11 relações com virtudes e presença no caso de referência CASE04 | Retirá-la afetaria o CASE04 e sessões já gravadas. |
| O "27º integrante" tem duas identidades | O Documento 12 chama de "preservação de 27" a inclusão de Hillel; no sistema e nos documentos locais de UX (EV-13, EV-14), o 27º é "Tradições budistas" | As duas contagens de "27" se referem a conjuntos diferentes. |
| Identificadores diferentes | Documento 12: `PENS-001` a `PENS-034`; sistema: slugs (`socrates`); sessões gravadas usam os slugs | Trocar o identificador quebraria o histórico das sessões. |
| Nome com grafia diferente | "Nassim Nicholas Taleb" (Doc. 12) e "Nassim Taleb" (sistema); "Kant" (Doc. 04) e "Immanuel Kant" (sistema) | Sem efeito funcional, mas exige mapeamento. |

**Pendência D-04-02:** o Conselho habilitado deve passar a ser o do Documento 12 (34)? E qual o destino de "Tradições budistas"?

### 5.3. Fundamentação dos 27 habilitados

| Indicador | Valor | Evidência |
|---|---:|---|
| Integrantes habilitados | 27 (26 pensadores, 1 tradição) | `thinkers.json` |
| Sem nenhuma obra registrada | **9**: Sócrates, Musashi, Simone Weil, Feynman, Popper, Edith Stein, Franklin, Drucker, Dalai Lama | `thinkers.json` (`workIds` vazio) |
| Obras no catálogo | 21, todas com fonte "Referências dos Documentos 03 e 04" | `works.json` |
| Pergunta característica com origem documental | 5 (`questionSource = documento`); as outras 22 são formulação pedagógica da plataforma | `thinkers.json` |
| Status de validação | `proposta` em todos | `thinkers.json` |

O Documento 12 lista obras de entrada para os 34. Para Sócrates, por exemplo, cita obras de Platão e Xenofonte. O modelo atual liga cada obra a **um único** pensador (`works.json`, campo `thinkerId`). Não há como registrar "Sócrates, conhecido por obras de outro autor" sem mudar o modelo.

## 6. Relações entre pensadores e virtudes

### 6.1. Situação operacional

| Indicador | Valor |
|---|---:|
| Relações registradas | 189 |
| De integrantes habilitados | 166 |
| De referências não habilitadas | 23 |
| Com posição de prioridade (1º, 2º ou 3º do Doc. 04 §5) | 144 (48 de cada) |
| Sem prioridade (citados como referência no Doc. 03 ou no Doc. 04 §6) | 45 |
| Com tipo P1–P4 (Doc. 04 §3.2) | **5**: Aristóteles → Temperança, Coragem e Justiça (P1); Kahneman → Prudência e Discernimento (P3) |
| Sem tipo P1–P4 (classificação pendente) | 184 |
| Com obra associada | 132 |
| Fontes das relações | DOC03-4 (157), DOC04-5 (144), DOC04-6 (77); uma relação pode ter mais de uma |
| Status | `proposta` em todas |

### 6.2. Termos de virtude do Documento 12

As fichas do Documento 12 citam virtudes por nome, e não pelo código. Comparei os nomes com as 48 virtudes do catálogo:

- 143 menções no total;
- cerca de 105 coincidem com uma das 48;
- cerca de 38 não coincidem. Alguns são sinônimos prováveis (autocontrole e autodomínio, lealdade e fidelidade); outros não existem no catálogo (foco, presença, diálogo, solidariedade, frugalidade, visão sistêmica, entre outros).

A contagem é aproximada e precisa de revisão humana. O Documento 13 v2 §6 exige mapear pela taxonomia oficial.

**Pendência D-04-03:** criar uma tabela de equivalência entre os termos do Documento 12 e as 48 virtudes, decidida pela curadoria.

## 7. Critérios de associação

### 7.1. Critérios dos documentos de referência

- **Virtude–dimensão** (Doc. 04 §3.1): D1 primária, D2 secundária, D3 contextual. "A classificação não representa importância, superioridade ou hierarquia entre dimensões."
- **Pensador–virtude** (Doc. 04 §3.2): P1 fundamentação direta, P2 contribuição relevante, P3 perspectiva complementar, P4 interpretação contemporânea.
- **Evidência** (Doc. 04 §3.3): cada associação deveria indicar obra, conceito, justificativa, tipo e limites.
- **Governança** (Doc. 04 §14): estados proposta, validada e suspensa. A IA pode sugerir relações, mas não publicá-las como validadas.
- **Ficha** (Doc. 12 §1 e §7): distinguir dado histórico, conceito autoral, aplicação contemporânea e limite interpretativo. Uma ficha só está pronta para uso automatizado quando cada conceito tem fonte.

### 7.2. Classificação de proveniência usada neste complemento

| Classe | Significado | Situação atual |
|---|---|---|
| Associação histórica documentada | Relação sustentada por obra primária, com localização | **Nenhuma registrada como tal**; nenhuma relação tem localização de trecho |
| Interpretação filosófica | Relação sustentada por literatura secundária reconhecida | Não registrada separadamente no modelo |
| Hipótese curatorial | Relação proposta nos documentos do projeto, ainda não validada | **As 189 relações pensador–virtude e as 176 virtude–dimensão estão nesta classe** |

## 8. Matriz de integração (situação operacional)

Gerada diretamente de `src/data/*.json` no commit `b23ddac`. Todas as linhas estão em status `proposta`.

Legendas:
- "Prioritários" são o 1º, 2º e 3º do Doc. 04 §5.
- "(fora do Conselho)" ou `*` indica referência que existe no catálogo, mas não está habilitada no Conselho.
- "Tipo P" só aparece onde a classificação foi feita.

| Id | Virtude | Família | D1 | D2 | Prioritários (Doc. 04 §5) | Outras referências | Tipo P |
|---|---|---|---|---|---|---|---|
| V01 | Prudência | F01 | DIM04, DIM05 | DIM03, DIM06, DIM07 | Aristóteles; Tomás de Aquino; Platão | Daniel Kahneman; Nassim Taleb | Daniel Kahneman=P3 |
| V02 | Sabedoria | F01 | DIM05, DIM06 | DIM04, DIM07 | Sócrates; Platão; Aristóteles | Marco Aurélio | — |
| V03 | Discernimento | F01 | DIM04, DIM05 | DIM03, DIM06 | Aristóteles; Sócrates; Epicteto | Daniel Kahneman; Donella Meadows; Tomás de Aquino | Daniel Kahneman=P3 |
| V04 | Atenção | F01 | DIM04 | DIM02, DIM03, DIM05 | Simone Weil; Tradições budistas; William James (fora do Conselho) | Miyamoto Musashi | — |
| V05 | Abertura intelectual | F01 | DIM04, DIM05 | DIM06 | Sócrates; John Stuart Mill; Karl Popper | — | — |
| V06 | Temperança | F02 | DIM01, DIM02, DIM03, DIM07 | DIM04 | Platão; Aristóteles; Tomás de Aquino | Marco Aurélio | Aristóteles=P1 |
| V07 | Paciência | F02 | DIM03, DIM07 | DIM02, DIM04 | Sêneca; Marco Aurélio; Tradições budistas | Aristóteles | — |
| V08 | Serenidade | F02 | DIM03 | DIM02, DIM04, DIM06 | Epicteto; Sêneca; Marco Aurélio | Lao-Tsé; Tradições budistas; Estoicismo* | — |
| V09 | Moderação | F02 | DIM01, DIM02, DIM03 | DIM04, DIM07 | Aristóteles; Platão; Confúcio | Lao-Tsé | — |
| V10 | Autodomínio | F02 | DIM03, DIM04, DIM07 | — | Platão; Epicteto; Marco Aurélio | Aristóteles | — |
| V11 | Equanimidade | F02 | DIM03, DIM06 | DIM04, DIM05 | Tradições budistas; Bhagavad Gita (fora do Conselho); Estoicismo (fora do Conselho) | Dalai Lama (Tenzin Gyatso) | — |
| V12 | Coragem | F03 | DIM03, DIM05, DIM07 | DIM04 | Aristóteles; Platão; Marco Aurélio | Miyamoto Musashi | Aristóteles=P1 |
| V13 | Fortaleza | F03 | DIM01, DIM03, DIM07 | DIM02 | Tomás de Aquino; Aristóteles; Sêneca | Marco Aurélio; Estoicismo* | — |
| V14 | Perseverança | F03 | DIM02, DIM07 | DIM03, DIM04 | Aristóteles; Sêneca; Miyamoto Musashi | Tradições budistas | — |
| V15 | Determinação | F03 | DIM04, DIM07 | DIM05 | Miyamoto Musashi; Aristóteles; Marco Aurélio | — | — |
| V16 | Resiliência | F03 | DIM02, DIM03, DIM07 | DIM01, DIM04 | Viktor Frankl; Estoicismo (fora do Conselho); Nassim Taleb | Donella Meadows | — |
| V17 | Constância | F03 | DIM02, DIM07 | DIM04 | Confúcio; Aristóteles; Miyamoto Musashi | Tradições budistas | — |
| V18 | Justiça | F04 | DIM04, DIM05, DIM07 | DIM03, DIM06 | Platão; Aristóteles; Tomás de Aquino | Confúcio; Marco Aurélio; John Rawls | Aristóteles=P1 |
| V19 | Honestidade | F04 | DIM04, DIM05, DIM07 | — | Sócrates; Aristóteles; Immanuel Kant | Confúcio | — |
| V20 | Integridade | F04 | DIM05, DIM07 | DIM04 | Aristóteles; Immanuel Kant; Confúcio | Sócrates | — |
| V21 | Responsabilidade | F04 | DIM01, DIM04, DIM07 | DIM05 | Immanuel Kant; Aristóteles; Viktor Frankl | Erich Fromm; Donella Meadows | — |
| V22 | Equidade | F04 | DIM04, DIM05 | DIM03, DIM06 | Aristóteles; John Rawls; Tomás de Aquino | — | — |
| V23 | Fidelidade | F04 | DIM03, DIM07 | DIM05 | Confúcio; Aristóteles; Cícero (fora do Conselho) | — | — |
| V24 | Generosidade | F05 | DIM03, DIM05, DIM07 | DIM06 | Aristóteles; Confúcio; Tradições budistas | — | — |
| V25 | Empatia | F05 | DIM03, DIM06 | DIM04 | Edith Stein; Confúcio; Adam Smith (fora do Conselho) | — | — |
| V26 | Compaixão | F05 | DIM03, DIM05, DIM06 | DIM07 | Tradições budistas; Dalai Lama (Tenzin Gyatso); Simone Weil | Confúcio | — |
| V27 | Benevolência | F05 | DIM03, DIM05 | DIM07 | Confúcio; Aristóteles; Tradições budistas | Dalai Lama (Tenzin Gyatso) | — |
| V28 | Gratidão | F05 | DIM03, DIM05 | DIM06 | Sêneca; Cícero (fora do Conselho); Tradições budistas | — | — |
| V29 | Perdão | F05 | DIM03, DIM05, DIM07 | DIM04, DIM06 | Marco Aurélio; Tradições cristãs (fora do Conselho); Tradições budistas | Sêneca | — |
| V30 | Tolerância | F05 | DIM03, DIM04 | DIM05 | John Locke; Voltaire (fora do Conselho); John Stuart Mill | — | — |
| V31 | Fraternidade | F05 | DIM03, DIM05, DIM07 | DIM06 | Confúcio; Marco Aurélio; Tradições humanistas (fora do Conselho) | — | — |
| V32 | Respeito | F05 | DIM03, DIM05, DIM07 | DIM04 | Confúcio; Immanuel Kant; Cícero (fora do Conselho) | John Locke | — |
| V33 | Humildade intelectual | F06 | DIM04, DIM05 | DIM06 | Sócrates; Confúcio; Bertrand Russell (fora do Conselho) | Richard Feynman | — |
| V34 | Curiosidade | F06 | DIM04, DIM05 | DIM06 | Sócrates; Aristóteles; Leonardo da Vinci (fora do Conselho) | Richard Feynman | — |
| V35 | Sinceridade | F06 | DIM03, DIM04 | DIM07 | Confúcio; Aristóteles; Immanuel Kant | — | — |
| V36 | Amor à verdade | F06 | DIM04, DIM05 | DIM06, DIM07 | Sócrates; Platão; Karl Popper | Aristóteles; Richard Feynman | — |
| V37 | Objetividade | F06 | DIM04, DIM05 | — | Francis Bacon (fora do Conselho); Karl Popper; Daniel Kahneman | — | — |
| V38 | Disciplina | F07 | DIM01, DIM02, DIM04, DIM07 | — | Aristóteles; Miyamoto Musashi; Confúcio | Benjamin Franklin | — |
| V39 | Diligência | F07 | DIM01, DIM02, DIM04, DIM07 | — | Aristóteles; Tomás de Aquino; Benjamin Franklin | Peter Drucker | — |
| V40 | Compromisso | F07 | DIM04, DIM07 | DIM05 | Confúcio; Immanuel Kant; Aristóteles | Peter Drucker | — |
| V41 | Iniciativa | F07 | DIM04, DIM07 | DIM05 | Aristóteles; Benjamin Franklin; Peter Drucker | — | — |
| V42 | Autonomia | F07 | DIM04, DIM05, DIM07 | — | Immanuel Kant; Epicteto; Aristóteles | John Stuart Mill | — |
| V43 | Serviço | F07 | DIM03, DIM05, DIM07 | DIM06 | Confúcio; Simone Weil; Tradições humanistas (fora do Conselho) | — | — |
| V44 | Humildade | F08 | DIM03, DIM05 | DIM04, DIM06 | Sócrates; Confúcio; Marco Aurélio | Lao-Tsé; Tomás de Aquino | — |
| V45 | Esperança | F08 | DIM03, DIM05, DIM07 | — | Viktor Frankl; Tradições cristãs (fora do Conselho); Ernst Bloch (fora do Conselho) | Tomás de Aquino | — |
| V46 | Fé | F08 | DIM05, DIM06, DIM07 | — | Tomás de Aquino; Søren Kierkegaard (fora do Conselho); Tradições religiosas (fora do Conselho) | — | — |
| V47 | Amor | F08 | DIM03, DIM05, DIM06, DIM07 | — | Platão; Aristóteles; Erich Fromm | Tradições cristãs* | — |
| V48 | Contemplação | F08 | DIM04, DIM05, DIM06 | — | Platão; Aristóteles; Simone Weil | Tradições contemplativas* | — |

## 9. Limitações e pontos que exigem validação

1. **Nenhuma associação está validada.** O catálogo inteiro está em `proposta`, e o Documento 12 se declara "para validação editorial e filosófica".
2. **Relações sem justificativa.** As 176 relações virtude–dimensão têm justificativa vazia, e 184 das 189 relações pensador–virtude não têm tipo P1–P4, ao contrário do que pede o Documento 04 §3.3.
3. **Nenhuma relação D3.** O tipo contextual existe no modelo, mas nunca foi usado.
4. **Fontes sem metadados.** As obras não têm edição, tradutor nem localização de trecho, e 9 dos 27 habilitados não têm obra nenhuma.
5. **O Documento 12 não está no sistema.** Os 34 integrantes são catálogo curatorial; o sistema habilita 27, com composição diferente (seção 5).
6. **Pesos do motor.** O código aplica os pesos do Documento 04 §11 (35/30/15/10/10); o Documento 13 v2 propõe 30/25/15/15/10/5. Ver D-08-04 no histórico de decisões.
7. **Fora deste trabalho.** Não verifiquei, em obras primárias, nenhuma associação filosófica.
