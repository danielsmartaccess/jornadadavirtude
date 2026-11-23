# Documento 05 — Metodologia da Jornada

| Campo | Valor |
|---|---|
| Número e título | Documento 05 — Metodologia da Jornada e Desenvolvimento das Virtudes (título como citado no Doc. 07 §19) |
| Versão | 0.1 |
| Data de reconstrução | 2026-11-23 |
| Status | RECONSTRUÍDO PARA VALIDAÇÃO |
| Motivo da reconstrução | O Documento 05 é citado pelos Documentos 06, 07 e 08, mas não foi localizado nas fontes examinadas (ver `../rastreabilidade/inventario-evidencias.md`, seção 5). Esta versão **não é o texto original**: reúne o que os outros documentos e o código permitem afirmar. |
| Fontes utilizadas | EV-01, EV-05, EV-06, EV-07, EV-11, EV-12, EV-20, EV-21, EV-22, EV-33, EV-34, EV-40, EV-41 |
| Limitações conhecidas | O conteúdo original do Documento 05 é desconhecido. Nenhuma decisão de produto foi presumida: o que não está em documento ou código aparece como pendente. A eficácia pedagógica do método não foi avaliada com usuários. |

## Histórico de revisão

| Versão | Data | Descrição |
|---|---|---|
| 0.1 | 2026-11-23 | Reconstrução a partir dos Documentos 01, 06, 07 e 08, do protótipo anterior e do código em `b23ddac`. |

---

## 1. Objetivo

Descrever a metodologia pedagógica e funcional da Jornada da Virtude, separando três camadas:

- **A. Metodologia histórica encontrada:** o que os documentos e o protótipo anterior registram.
- **B. Metodologia efetivamente implementada:** o que o código atual faz, com evidência.
- **C. Metodologia proposta para evolução:** o que os documentos propõem e ainda não foi implementado nem decidido.

## 2. Princípios que atravessam as três camadas

Os princípios abaixo aparecem nos Documentos 01, 06 e 07 e são aplicados no código.

| Princípio | Fonte | Como aparece no código |
|---|---|---|
| Não há nota moral, ranking de virtudes nem classificação de caráter | Doc. 01 §1 e §6; Doc. 07 §16.1, RF-086, RF-118 | Indicadores só contam atividades (`journeyStats` em `src/domain/journey.ts`); revisões legadas lidas em tom neutro (`compareLegacyReview`, testada em `tests/unit/domain.test.ts`) |
| A ausência de registros não significa ausência de prática | Doc. 07 RN-015, RN-020, §16.5 | Revisão aceita sem registros no diário (CT-010 em `tests/unit/domain.test.ts`) |
| O usuário conduz a própria jornada; o método orienta, não impõe | Doc. 01 §6; Doc. 07 §16.2 | Etapas podem ser abertas em qualquer ordem; durações são só referência (seção B.3) |
| Concluir não significa dominar a virtude | Doc. 06 §8.3; Doc. 07 §16.4 | Texto da interface; estados das etapas indicam participação, não qualidade (comentário de `StageState` em `src/domain/types.ts`) |
| As dimensões são representação filosófica, não científica | Doc. 02 §1.2 e §9 | Avisos nas telas de dimensões |

---

## A. Metodologia histórica encontrada

### A.1. Ciclo de quatro etapas (protótipo e Documento 01)

| Etapa | Objetivo | Duração registrada |
|---|---|---|
| Reconhecer | Observar comportamentos sem julgamento | 1 semana |
| Investigar | Compreender a virtude e suas dificuldades | 2 semanas |
| Praticar | Exercitar comportamentos intencionais | 4 semanas |
| Revisar | Refletir sobre experiências e mudanças | 1 semana |

As fontes não tratam as durações da mesma forma:

| Fonte | Como trata as durações |
|---|---|
| Protótipo anterior, analisado na Engenharia Reversa (EV-11), regra RN-01 | "A jornada tem **4 etapas de duração fixa** [...] Total: 8 semanas / 56 dias." Era regra do protótipo, que tinha painel por semana. |
| Documento 01 §4 (EV-01) | "O MVP já apresenta quatro etapas que devem ser preservadas como ponto de partida." As durações são "**parâmetros iniciais do MVP, não prazos universais**" e a metodologia "poderá evoluir para ciclos repetidos de aprendizagem e prática". |
| Apresentação em PDF, p. 6 (EV-12) | Repete o ciclo e a mesma ressalva sobre as durações. |

**Conclusão documental:** a duração fixa de 8 semanas era regra do protótipo. O Documento 01 a rebaixou a referência inicial. Nenhuma fonte examinada a restabelece como regra vigente.

### A.2. Pontos de partida (Documento 01 §3.4)

1. "Quero me conhecer": explorar dimensões, potencialidades, dificuldades e hábitos.
2. "Quero desenvolver uma virtude": escolher, compreender, planejar, praticar, registrar, revisar.
3. "Estou enfrentando uma situação": descrever o acontecimento, identificar emoções, consultar o Conselho, escolher uma atitude.

### A.3. Acompanhamento (Documento 01 §3.5)

Diário de experiências, registro de práticas e dificuldades, exercícios, desafios cotidianos, revisões periódicas, histórico e relatórios de evolução. Nas palavras do documento, "sem transformar a pessoa em uma nota".

### A.4. Sete etapas de navegação (Documento 06 §8.2)

O Documento 06 organiza a tela "Minha Jornada" em sete etapas: Despertar, Identificar, Investigar, Refletir, Praticar, Registrar, Revisar. Também define cinco estados por etapa (§8.3) e diz que o fluxo "seguirá a metodologia do Documento Oficial 05" (linha 1309). O Documento 05 original não foi localizado.

---

## B. Metodologia efetivamente implementada

Evidências: `src/domain/journey.ts`, `src/domain/types.ts`, `src/application/useCases.ts`, `src/features/journey/*`, `src/features/home/HomePage.tsx`, `src/features/diary/DiaryPage.tsx`, `src/features/history/HistoryPages.tsx`, no commit `b23ddac`.

### B.1. Pontos de partida

A tela Início (seção "Três maneiras de começar") oferece:

| Opção na tela | Destino | Correspondência com o Documento 01 §3.4 |
|---|---|---|
| A. "Já sei qual virtude quero desenvolver" | `/virtudes` (catálogo, depois `/jornada/nova?virtude=…`) | "Quero desenvolver uma virtude" |
| B. "Quero compreender uma situação que estou vivendo" | `/jornada/nova?caminho=situacao` | "Estou enfrentando uma situação" |
| C. "Quero conhecer melhor as virtudes" | `/dimensoes` | Próxima de "Quero me conhecer", mas o foco é explorar dimensões e virtudes, não autoconhecimento guiado |

A jornada registra a origem (`JourneyOrigin`): `virtude`, `situacao`, `exploracao` ou `legado`. A tela de criação só produz `virtude` e `situacao`. `exploracao` existe no tipo, mas não é usada pela interface, e `legado` marca jornadas migradas do protótipo.

### B.2. Ciclo de vida da jornada

- Estados: `DRAFT`, `ACTIVE`, `PAUSED` e `COMPLETED`. O arquivamento é um atributo à parte (`archivedAt`), conforme o Doc. 07 RN-011.
- A jornada pode ser salva como rascunho ou criada e iniciada direto ("Jornada salva como rascunho." / "Jornada criada e iniciada.").
- Só uma jornada fica ativa por vez. Iniciar uma nova pausa a ativa, sem apagar nada (`startJourney` com `pauseActive`). Na nuvem, o índice único `journeys_one_active_per_user` reforça a regra.
- Concluir exige a revisão final com uma síntese pessoal (verificado em `tests/e2e/mvp.spec.ts`).
- Uma jornada concluída não volta a ficar ativa (RN-009, testado em `tests/unit/domain.test.ts`).

### B.3. As sete etapas implementadas

| Etapa (código) | O que a pessoa faz | Referência de duração exibida |
|---|---|---|
| Despertar (`despertar`) | Registra motivação, situação e expectativa (intenção da jornada) | — |
| Identificar (`identificar`) | Conhece a virtude principal e suas dimensões; observa sem julgamento onde ela aparece | 1 semana |
| Investigar (`investigar`) | Responde a 4 blocos de perguntas: Compreender, Reconhecer, Investigar, Motivações (12 perguntas) | 2 semanas |
| Refletir (`refletir`) | Pode convocar o Conselho de Sabedoria (opcional) | — |
| Praticar (`praticar`) | Escolhe exercícios e um compromisso concreto de prática | 4 semanas |
| Registrar (`registrar`) | Escreve no diário, a qualquer momento da jornada | — |
| Revisar (`revisar`) | Faz revisões periódicas (5 perguntas) e a revisão final | 1 semana |

Correspondência entre o ciclo histórico e o atual:

| Histórico (A.1) | Implementado (B.3) | Observação |
|---|---|---|
| Reconhecer | Identificar | Mesmo objetivo ("observar sem julgamento") e mesma referência de 1 semana; nome diferente |
| Investigar | Investigar | Igual |
| Praticar | Praticar | Igual |
| Revisar | Revisar | Igual |
| — | Despertar, Refletir, Registrar | Vêm do Documento 06 §8.2 |

**Regras observadas no código:**
- As durações aparecem só como texto: "Referência inicial do método: … O ritmo é seu." (`src/features/journey/JourneyPage.tsx`). Nenhuma regra do domínio depende de tempo decorrido.
- As etapas podem ser abertas em qualquer ordem. Cada uma tem um de cinco estados: não iniciada, em andamento, concluída, retomada, não aplicável (`STAGE_STATES`).
- A interface sugere uma próxima ação (`nextAction`), mas não bloqueia as outras.

### B.4. Exercícios

- O catálogo tem 56 exercícios (`src/data/exercises.json`), todos em status `proposta`.
- Ordem de recomendação (`exerciseOptions`): primeiro os da virtude principal, depois os das virtudes relacionadas, por fim os das dimensões com relação D1 com a virtude principal. Cada recomendação vem com o motivo.
- Estados de um exercício na jornada: em andamento, experimentado, repetido, arquivado. "Disponível" e "Recomendado" são derivados. Exercícios podem ser repetidos (RN-016, testado).
- Registrar a experiência de um exercício cria um registro no diário ligado a ele (fluxo testado em `tests/e2e/mvp.spec.ts`).

### B.5. Diário

- Tipos: Prática, Dificuldade, Reflexão, Descoberta.
- Campos: situação (único obrigatório), contexto, pensamentos, sentimentos e ações (opções de toque ou texto livre), consequências, aprendizado e observação.
- O registro pode existir sem jornada (RN05 do Doc. 06) e sem exercício (CT-009).
- Filtros: texto, tipo, virtude, dimensão e período. Exportação em Markdown.

### B.6. Revisões

- **Periódica:** 5 perguntas (práticas, dificuldades, padrões percebidos, aprendizados, pontos de atenção); exige ao menos uma resposta.
- **Final:** aprendizados e percepção atual da virtude; necessária para concluir.
- **Legada:** revisões migradas do protótipo, lidas em tom neutro.

### B.7. Acompanhamento

- Contagens descritivas (`journeyStats`): registros, dias com registro, exercícios experimentados, revisões.
- Histórico com linha do tempo das jornadas e marcos (`JourneyEvent`).
- "Dimensões trabalhadas": contagem dos registros por dimensão da virtude, sem nota.
- Síntese da jornada exportável em Markdown (`src/domain/report.ts`) e dados em JSON.

### B.8. Relação entre dimensões e virtudes na metodologia

- Na etapa Identificar, a virtude principal é apresentada com suas dimensões (relações D1 e D2 do catálogo).
- Na etapa Praticar, os exercícios das dimensões D1 da virtude entram na recomendação.
- No diário, o filtro por dimensão usa as relações D1 e D2 da virtude do registro.
- No histórico, os registros são contados por dimensão.

Em todos esses usos, a relação é apresentada como referência, não como classificação da pessoa (Doc. 07 RF-047).

### B.9. Módulo complementar: leitura da Bhagavad Gita

Existe um módulo de leitura (`/gita`) com 18 capítulos em seis etapas cada, quiz e reflexão aberta, além da parte final "Ensinamentos de Krishna". Ele não está ligado ao ciclo da jornada (não altera etapas nem estados) e não é citado nos Documentos 01 a 08. **Pendência D-05-03:** incluí-lo na metodologia ou mantê-lo como recurso independente?

---

## C. Metodologia proposta para evolução (não implementada, não decidida)

| Proposta | Fonte | Situação |
|---|---|---|
| Ciclos repetidos de aprendizagem e prática | Doc. 01 §4 | PROPOSTO |
| Diagnóstico reflexivo inicial (perguntas por dimensão, sem rótulos) | Doc. 02 §6.2 | PROPOSTO; não há tela própria |
| Desafios cotidianos | Doc. 01 §3.5 | PROPOSTO; não implementado |
| Relatórios individuais de evolução e sínteses periódicas | Doc. 01 §3.5 e §7 | PARCIAL: há síntese por jornada; não há síntese periódica entre jornadas |
| Integração do Conselho com a jornada: convocar a partir de uma reflexão, vincular dimensões e virtudes, registrar exercícios e compromissos, retomar sessões | Doc. 13 v2, Fase 4 | PARCIAL: convocação a partir da jornada, do diário e da virtude, e vínculo sessão–jornada, já existem; o resto é proposta |
| Uso de IA para perguntas, sínteses e padrões nos registros do usuário | Doc. 01 §7; Doc. 13 v2, Fase 5 | PROPOSTO; o app atual não usa IA |
| Avaliação da eficácia pedagógica | Doc. 01 §8, Etapa 4 | PROPOSTO; nenhuma pesquisa com usuários registrada |

## 3. Pendências de decisão

| Id | Pergunta |
|---|---|
| D-05-01 | As durações (1, 2, 4 e 1 semana) continuam como referência exibida, deixam de aparecer ou voltam a ser regra? O código hoje as trata como referência. |
| D-05-02 | O nome oficial da primeira etapa de observação é "Reconhecer" (Doc. 01) ou "Identificar" (Doc. 06 e código)? |
| D-05-03 | O módulo da Gita faz parte da metodologia da jornada ou é um recurso complementar? |
| D-05-04 | O ponto de partida "Quero me conhecer" do Documento 01 está coberto pela opção C do Início, ou exige um fluxo próprio, como o diagnóstico reflexivo do Doc. 02 §6.2? |
| D-05-05 | O texto original do Documento 05 deve ser procurado e confrontado com esta reconstrução antes de qualquer aprovação. |
