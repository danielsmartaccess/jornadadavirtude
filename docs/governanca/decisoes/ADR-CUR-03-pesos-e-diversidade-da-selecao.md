# ADR-CUR-03 — Pesos, taxonomia e diversidade da seleção

| Campo | Valor |
|---|---|
| Decisões | DEC-CUR-05 (pesos do Documento 13 v2), DEC-CUR-06 (taxonomia de navegação v1) e DEC-CUR-07 (limites de concentração e diversidade) |
| Status | Decisões de produto APROVADAS pelo responsável pelo produto em 2026-11-23 (Fase 2). A operacionalização de cada critério, descrita abaixo, é técnica e fica sujeita à revisão do revisor técnico. |
| Data | 2026-11-23 |
| Base | Documento 04 §11; Documento 13 v2.0 §7.1 a §7.3 e §20; Documento 14 §4 e §5; conflito C-02 / D-08-04 |
| Política operacional | `council-selection-v2-doc13` (`POLITICA_V2` em `src/domain/council.ts`) |
| Política histórica | `council-selection-v1-doc04` (`POLITICA_V1`), mantida para comparação e auditoria |
| Revisão futura | Revisor técnico (critérios e piso de pertinência); responsável pelo produto (efeito da diversidade com o catálogo atual) |

## Papéis dos documentos

- **Documento 04:** matriz conceitual. Define o `relationType` P1–P4 e as listas de prioridade por virtude. Não foi alterado.
- **Documento 13 v2:** pesos e regras de seleção do Conselho.
- **Documento 14:** camada curatorial e escala de evidência F1–F4.
- **Independência das escalas:** P1–P4 e F1–F4 são dimensões independentes. A prioridade de revisão do inventário (alta, média, baixa) não é nenhuma das duas.

## DEC-CUR-05 — Pesos do Documento 13 v2 operacionais

| Critério | Como é calculado (0 a 1) | v1 | v2 |
|---|---|---:|---:|
| Pertinência à questão central | 1 se integra o caso de referência mais aderente; 0,6 se integra outro caso reconhecido | 30% | 30% |
| Relação fundamentada com virtudes | Força das relações com as virtudes **pedidas** (prioridade 1º = 1; 2º = 0,85; 3º = 0,7; referência = 0,55), somada e dividida por 2, com teto 1 | 35% | 25% |
| Disponibilidade e qualidade das fontes | v1: obra no catálogo (1/0). v2: obra no catálogo ou referência-base com metadados conferidos (1); referência-base a conferir (0,5); nada (0) | 10% | 15% |
| Complementaridade | Tradição ainda não representada entre os escolhidos (1/0), recalculada a cada vaga | 10% | 15% |
| Diversidade intelectual/cultural pertinente | Universo principal ainda não representado (1/0), **só para candidatos pertinentes** (ver DEC-CUR-07) | — | 10% |
| Adequação ao contexto | Fração das dimensões da situação cobertas pelas virtudes do pensador | 15% | 5% |
| **Total** | Soma ponderada; cada critério entre 0 e 1, total entre 0 e 1 | 100% | 100% |

**Outras regras da v2:**
- exige fonte recuperável (Documento 13 §7.2): sem nenhuma fonte, o integrante é excluído com o motivo `sem-fonte`;
- corpus de apoio não ocupa vaga (DEC-CUR-02);
- desempate (Documento 13 §7.3): maior pertinência, maior qualidade de fonte, maior complementaridade e, por fim, `thinker_id` em ordem estável. Na v1, o desempate era pelo nome.

**Dados ausentes:**
- sem caso reconhecido, a pertinência é 0;
- sem dimensões na situação, a adequação ao contexto é 0;
- sem universo classificado, a diversidade é 0 e o limite por universo não se aplica.

**Versão registrada.** Cada perspectiva gravada passa a terminar com "Critérios de seleção: versão 2 (Documento 13)." Assim a sessão registra a versão do algoritmo (Documento 13 §20) **sem mudar o schema 4**. Um campo próprio de versão depende da D-08-03 (evolução de schema).

**Validação antes da adoção** (`docs/governanca/curadoria/comparacao-politicas-selecao.md`):
- **Reconstrução da v1.** O snapshot gravado em `931cd9c`, antes da Fase 1, passa sem regravação com `POLITICA_V1`.
- **A/B nas mesmas 79 entradas.** Nenhuma regressão grave:
  - zero vozes sem fonte nas duas políticas;
  - pertinência ao caso de 0,238 para 0,248;
  - relação com as virtudes pedidas de 0,518 para 0,494 (−4,6%), queda explicada pela saída do corpus budista, que tinha relações fortes;
  - nos seis casos de referência, o conjunto de vozes muda em três; nos demais, só a ordem:
    - **CASE01 (raiva):** sai Platão e entra Daniel Kahneman, que integra o caso de referência;
    - **CASE04 (perdão):** saem o corpus budista e Confúcio; entram Dalai Lama e Sêneca, que integra o caso;
    - **CASE05 (decisões), pelos identificadores:** sai Sócrates e entra Miyamoto Musashi. A fonte de Sócrates vale 0,5 porque as edições dos testemunhos ainda estão a confirmar; a de Musashi vale 1 (tradução com metadados conferidos);
  - a média de universos por Conselho foi de 1,66 para 1,63: a saída do corpus budista tirou da maioria dos Conselhos o único representante de "Tradições espirituais" que a v1 convocava.
- **Determinismo.** Provado por teste (cada entrada executada duas vezes por política).

**Primeira tentativa (registrada).** Sem piso de pertinência, a diversidade trazia vozes cuja única ligação era uma relação de "referência" (força 0,28, sem caso). Elas deslocavam integrantes do próprio caso de referência; a pertinência média caiu cerca de 10%. Isso contraria a própria DEC-CUR-07, e por isso a regra foi ajustada como descrito abaixo, sem inventar pesos.

## DEC-CUR-06 — Taxonomia de navegação v1

- **Escopo.** Cinco universos e cinco tipos de participação (Documento 14 §4 e §5), na versão 1.0 (`classificacao.json`, campo `taxonomia`).
- **Natureza.** Metadado editorial, não ontologia definitiva nem hierarquia de valor.
- **Universo principal.** O primeiro universo da lista é o principal. Os demais são qualificadores.
- **Casos híbridos.** Têm `nota` própria: Musashi, Simone Weil, Feynman, Popper, Franklin, Drucker, Dalai Lama e o corpus budista.
- **Notas de transmissão (DEC-CUR-11).** Sócrates, Confúcio, Lao-Tsé e Epicteto também têm `nota`, sobre a forma de transmissão do pensamento e não sobre hibridismo. Ver a seção "Revisão DH-T-01".
- **Limite de efeito.** A classificação não convoca ninguém sozinha. Sem relação com virtude pedida nem caso, ninguém entra (teste). O universo só atua na diversidade entre candidatos já pertinentes.
- **Aviso visível.** A interface mostra "Classificação curatorial v1 — sujeita a revisão especializada". A classificação item a item continua com status `proposta`.

## DEC-CUR-07 — Limites de concentração e diversidade (v1)

- **Limite por universo principal.** Com 5 vozes, no máximo 2 do mesmo universo. Com 2 a 4 vozes, ao menos 2 universos; na prática, o limite é `máximo − 1`.
- **Ordem de aplicação.** Filtros de elegibilidade (relação ou caso; não ser corpus; ter fonte); depois pontuação; depois restrição de universo a cada vaga; depois desempate.
- **Alternativa pertinente.** Uma voz acima do limite só é trocada por uma alternativa de outro universo que seja **pertinente**: integra um caso reconhecido ou tem relação **prioritária** (1º a 3º no Documento 04) com uma virtude pedida.
  - Uma relação só de "referência do catálogo" não basta, porque diversidade não compensa baixa pertinência.
  - Esse piso usa uma distinção que já existe nos dados (prioritário × referência); não é um parâmetro novo.
- **Exceção controlada.** Sem alternativa pertinente, a voz entra acima do limite. A exceção é registrada em `ResultadoSelecao.diversityConstraintRelaxed` e em `relaxamentos`, com a explicação.
- **Sem dupla contagem.** Corpus e pessoa contextualizada não contam como duas vozes; pares tradição × autor nomeado continuam excluídos.
- **Sem cota.** Não há cota geográfica ou religiosa.
- **Número de relações.** O número de relações cadastradas não é fator de pontuação (teste com 40 relações a mais).

**Efeito com o catálogo atual.** 18 das 26 vozes convocáveis têm "Filosofia e ética" como universo principal. "Literatura e artes" não tem nenhuma, e "Tradições espirituais" tem só o Dalai Lama. Por isso a restrição é relaxada, com registro, em 47 das 71 entradas que reúnem o Conselho. É uma limitação do acervo habilitado, não do motor; ela só diminui com novas vozes validadas (pendências do Documento 14 §16).

## Consequências

- Mudança intencional da seleção em 46 das 79 entradas de referência (vozes ou ordem); em 27 o conjunto de vozes muda. Explicação caso a caso no relatório A/B.
- Novo snapshot da v2 (`tests/unit/__snapshots__/conselho-selecao-v2.test.ts.snap`): qualquer mudança futura aparece na revisão.
- Sessões antigas não são reescritas.

## Alternativas rejeitadas

- **Manter os pesos do Documento 04 como operacionais.** Contraria a DEC-CUR-05.
- **Aplicar a diversidade sem piso de pertinência.** Derrubava a pertinência (ver "Primeira tentativa").
- **Criar um parâmetro numérico de "pertinência mínima"** (ex.: 50% da melhor pontuação). Seria um peso inventado.
- **Gravar a versão num campo novo da sessão.** Exige mudança de schema (D-08-03).

## Pendências

- Revisar a operacionalização dos critérios (revisor técnico).
- Campo próprio de versão na sessão (D-08-03, D-08-05).
- Rever o limite por universo quando houver novas vozes habilitadas fora de "Filosofia e ética".

## Revisão humana (2026-11-23) — DEC-CUR-10: pertinência antes da diversidade (política v2.1)

O texto acima descreve a política v2 como foi implementada e continua válido como registro. A revisão humana apontou que o piso de pertinência da v2 era insuficiente.

### Problema encontrado

- **A regra da v2.** "Alternativa pertinente" era quem integrava o caso ou tinha relação prioritária no Documento 04.
- **Por que falha.** Integrar o caso não prova relação com a virtude pedida, e uma relação prioritária não prova contribuição para a situação concreta.
- **Medição nas 79 entradas.** Das **11** substituições por diversidade da v2, só **2** trouxeram uma alternativa com as duas pertinências; as outras 9 eram falsos positivos.
  - **Exemplo:** no CASE01, Daniel Kahneman substituía uma voz de filosofia por integrar o caso, sem nenhuma relação com as virtudes do caso.

### Definições (v2.1)

| Conceito | Definição | Origem dos dados |
|---|---|---|
| Elegibilidade | Integrante habilitado; não é corpus de apoio; relação utilizável (não suspensa, rejeitada nem F4) ou integra caso; tem fonte identificada | Catálogo, camada curatorial, evidências |
| `case_member` | Integra um caso de referência reconhecido para a entrada. **Indício** contextual, nunca aprovação | `council-cases.json` |
| `thematic_relevance` | `demonstrada`: prioritário no Documento 04 (1º a 3º) ou com `relationType` P1–P4 numa virtude pedida; `fraca`: só relação de "referência"; `ausente`: nenhuma relação utilizável com as virtudes pedidas | `thinker-virtues.json` (P1–P4 é evidência, não F1–F4) |
| `contextual_relevance` | `documentada`: integra o caso **e** o caso registra para a pessoa uma perspectiva própria, distinta do campo geral dela (o aspecto da situação que ela ilumina); `insufficient_data`: não há caso reconhecido, a pessoa não integra o caso ou a perspectiva é só o campo geral | Perspectivas registradas em `council-cases.json` |
| `diversity_eligible` | Elegível + temática `demonstrada` + contextual `documentada`. Não é sinônimo de "traz diversidade" | Resultado das duas avaliações |

### Regra de substituição

Uma voz só é trocada por razão de diversidade quando a voz mais pontuada excede o limite do universo **e** existe alternativa de outro universo com `diversity_eligible`. O critério de diversidade (10%) também só vale para alternativas qualificadas: não é peso oculto nem atalho que contorne fonte ou pertinência. Sem alternativa qualificada, a composição pela pontuação é mantida e a exceção é registrada com motivo específico:

- `sem-alternativa-qualificada`: há caso, mas nenhuma alternativa de outro universo tem as duas pertinências;
- `contexto-nao-avaliavel`: não há caso de referência; a pertinência contextual de qualquer alternativa é falta de dado, não aprovação.

Cada substituição grava, em `ResultadoSelecao.substituicoes`: vaga, voz preterida e incluída, elegibilidade de ambas, avaliação temática e contextual de ambas com as relações e o caso que as sustentam, universos antes da vaga, limite aplicado e versão da política.

### Exemplos

- **Bloqueado:** Kahneman no CASE01 (integra o caso, temática ausente). Ele continua no Conselho pela pontuação, na 5ª vaga, mas não por substituição.
- **Bloqueado:** voz só com relação prioritária e sem caso (entrada por virtude): `contexto-nao-avaliavel`.
- **Permitido:** Viktor Frankl no CASE03 (relação prioritária com a virtude do caso; perspectiva do caso "Responsabilidade e sentido") substitui Confúcio na 3ª vaga.
- **Bloqueado:** caso em que a perspectiva registrada é igual ao campo geral do autor: `insufficient_data` (teste com dados de teste).

### Resultado comparativo (79 entradas)

Os números estão em `docs/governanca/curadoria/comparacao-politicas-selecao-v2.1.md`. Em síntese, de v2 para v2.1:
- substituições de 11 para 2, todas qualificadas;
- média de "integra o caso" de 0,2481 para 0,2557 (+3,08%);
- relação com as virtudes pedidas de 0,4943 para 0,4970 (+0,56%);
- média de universos de 1,634 para 1,549;
- conselhos com exceção de 47 para 48 de 71;
- seleção diferente em 29 de 79 entradas (conjunto diferente em 6).

Sem teste estatístico; são as mesmas 79 entradas.

**Leitura.** A v2.1 reduz a diversidade média porque deixa de aceitar alternativas sem pertinência. Com o catálogo atual, isso é o esperado:
- 18 das 26 vozes têm "Filosofia e ética" como universo principal;
- só 6 casos registram perspectivas contextuais;
- entradas sem caso não têm como documentar pertinência contextual.

É lacuna de curadoria, não falha a esconder no algoritmo.

### Versões

- `council-selection-v1-doc04` e `council-selection-v2-doc13` permanecem como estavam, com snapshots inalterados.
- A operacional passa a ser `council-selection-v2.1-doc13-relevance-source` (rótulo gravado nas sessões: "versão 2.1 (Documento 13)").

### Limitações

- **Dados de pertinência contextual.** Os únicos com recorte contextual são as perspectivas dos 6 casos de referência; entradas por virtude ou dimensão nunca têm pertinência contextual documentada.
- **Pertinência temática.** Usa a prioridade e o P1–P4 do Documento 04 como evidência; não substitui revisão individual das relações (DEC-CUR-08).

## Revisão DH-T-01 (2026-11-25) — DEC-CUR-11: notas de transmissão para pensadores sem corpus autoral próprio

### Decisão aprovada

A auditoria da Fase 3A (DH-T-01) apontou que o Documento 14 §5 define "pensador individual" como "pessoa com corpus autoral identificável", e que quatro habilitados não cumprem essa definição ao pé da letra: o pensamento deles chegou por testemunhos, compilações de discípulos ou registro de terceiros.

O responsável pelo produto aprovou a **alternativa A**: manter os tipos atuais e acrescentar `classificacao.nota` específica sobre a forma de transmissão. Não há subtipo, categoria nova nem mudança de schema, e o texto do Documento 14 §5 não foi alterado.

### Pensadores abrangidos e redação final

| Pensador | Situação documentada | Nota (`classificacao.nota`) |
|---|---|---|
| Sócrates | Não deixou escritos próprios conhecidos; conhecido por testemunhos de terceiros | Pensador individual sem corpus autoral próprio conhecido. Seu pensamento é reconstruído principalmente a partir de testemunhos e representações produzidos por terceiros, com propósitos e perspectivas distintos. |
| Confúcio | Os Analectos (Lunyu) foram compilados por discípulos de primeira e segunda geração | Pensador individual cuja tradição textual foi transmitida por discípulos: os Analectos (Lunyu) resultam de compilação por discípulos de primeira e segunda geração e de transmissão posterior ao mestre. |
| Lao-Tsé | Texto de natureza compósita; a historicidade da figura é objeto de controvérsia acadêmica | Figura tradicionalmente associada ao Tao Te Ching (Dao De Jing), texto de formação compósita. A historicidade de Lao-Tsé e a atribuição do corpus são objeto de debate acadêmico. |
| Epicteto | Discursos e Encheirídion registrados por Arriano, seu discípulo; há divergência sobre a extensão da mediação | Pensador individual cujos ensinamentos foram registrados por seu discípulo Arriano, nos Discursos e no Encheirídion (Manual). A transmissão textual deve ser distinguida de autoria direta; há divergência acadêmica sobre a extensão da mediação. |

### Justificativa da redação

- Cada nota descreve a situação específica da pessoa. Nenhuma frase se repete entre elas, e as quatro situações (testemunhos de terceiros, compilação por discípulos, texto compósito com historicidade debatida, registro por discípulo) não são tratadas como uma categoria homogênea.
- Usam só os fatos da tabela de referência da auditoria e as fontes já registradas no projeto: as referências-base de Sócrates (Platão, Xenofonte e Aristófanes) e as obras W04, W09 e W10.
- Não afirmam inexistência, obra apócrifa nem consenso onde a auditoria registra controvérsia (historicidade e atribuição, no caso de Lao-Tsé; extensão da mediação, no de Epicteto).
- A convenção anterior das notas ("Caso híbrido: …") continua só para os casos híbridos. As de transmissão não usam esse rótulo.

### Efeito

- A nota é informativa. Aparece na página do pensador, no parágrafo do cabeçalho, junto do aviso "Classificação curatorial v1 — sujeita a revisão especializada". O motor de seleção não a lê: só usa o primeiro universo da classificação.
- Inalterados: tipos e universos dos quatro, elegibilidade, flags `council`, as 189 relações (todas `proposta`), pesos, diversidade e os snapshots v1, v2 e v2.1.
- Custo medido: o chunk `council` passou de 63,45 para 64,34 kB (+0,89 kB, o texto das notas), carregado só nas rotas do Conselho. O arquivo principal (`index`) não mudou.

### Fora do escopo (pendências)

- **Mêncio e Hillel (candidatos).** Dependem da DH-L-11 (criação de um campo de nota em `candidatos.json`). Nenhum campo foi criado e nem o tipo nem a classificação mudaram. Os dois seguem pendentes.
- **Tiruvalluvar.** Mantém o tipo `voz-literaria-artistica`. A definição de voz literária fica para a DH-T-20.
- **Davi Kopenawa.** Classificação preservada. A coautoria com Bruce Albert fica para a DH-T-14.

### Arquivos e testes

- Alterados: `src/data/curadoria/classificacao.json` (quatro campos `nota`), `tests/unit/conselho-notas-transmissao.test.ts` (novo, 11 testes), `tests/e2e/conselho-biblioteca.spec.ts` (um teste novo), `historico-decisoes.md` e este ADR.
- Testes: 328 unitários (23 arquivos), 93 E2E em três execuções completas (10, 10 e 3 workers), `tsc --noEmit`, build e `npm audit --omit=dev --audit-level=high` sem falhas.
