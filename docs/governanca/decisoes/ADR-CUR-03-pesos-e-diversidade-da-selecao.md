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
