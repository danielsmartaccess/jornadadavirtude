# Histórico de decisões

| Campo | Valor |
|---|---|
| Versão | 0.11 |
| Data | 2026-11-25 |
| Status | REGISTRO DE DECISÕES PARA VALIDAÇÃO |
| Finalidade | Registrar as decisões que têm evidência, os conflitos entre documentos e as decisões pendentes. Nenhuma decisão pendente foi resolvida aqui. |

## Histórico de revisão

| Versão | Data | Descrição |
|---|---|---|
| 0.1 | 2026-11-23 | Primeira versão: 14 decisões registradas, 11 conflitos, 25 decisões pendentes. |
| 0.2 | 2026-11-23 | Reclassificação documental: REGISTRO DE DECISÕES PARA VALIDAÇÃO. Decisões, conflitos e pendências preservados sem alteração. |
| 0.3 | 2026-11-23 | D-GOV-01 aprovada na revisão do produto. Totais: 24 decisões pendentes, 1 aprovada, 11 conflitos preservados. |
| 0.4 | 2026-11-23 | DEC-15 criada na seção 1, conforme a regra da seção 4, formalizando a D-GOV-01 (referência cruzada nos dois registros). Totais sem dupla contagem: 25 registros D-xx, 24 pendentes, 1 aprovada, 11 conflitos. |
| 0.5 | 2026-11-23 | Fase 2 de curadoria: DEC-CUR-02 a DEC-CUR-09 registradas na seção 1 (aprovação do responsável pelo produto; ADR-CUR-02 a ADR-CUR-05). C-02 e D-08-04 resolvidos pela DEC-CUR-05. Notas em C-01, C-10 e D-04-02, que continuam pendentes. Totais: 25 registros D-xx, 23 pendentes, 2 aprovadas, 11 conflitos (1 resolvido). |
| 0.6 | 2026-11-23 | Revisão humana da Fase 2: DEC-CUR-10 registrada (política v2.1; pertinência temática e contextual; fonte separada de completude bibliográfica; vínculos do Dalai Lama com fontes primária e acadêmica). Totais de D-xx inalterados. |
| 0.7 | 2026-11-23 | Revisão final: por decisão humana, VIN-DAL-03 (filiação à ordem monástica Gelug) volta a "a confirmar"; VIN-DAL-06 permanece sustentado. Nota acrescentada à DEC-CUR-10. Totais inalterados. |
| 0.8 | 2026-11-25 | Fase 3B: DEC-CUR-11 registrada (notas de transmissão para Sócrates, Confúcio, Lao-Tsé e Epicteto; DH-T-01 da auditoria da Fase 3A, alternativa A). Mêncio e Hillel seguem pendentes da DH-L-11. Totais de D-xx inalterados. |
| 0.9 | 2026-11-25 | Fase 3B: DEC-CUR-12 registrada (DH-T-02 da auditoria da Fase 3A: clareza no catálogo de tradições). Numeração: DEC-CUR-11 e a versão 0.8 são da DH-T-01, já publicada (PR #6). Totais de D-xx inalterados. |
| 0.11 | 2026-11-25 | Fase 3B: DEC-CUR-14 registrada (DH-T-04 da auditoria da Fase 3A: identidade bibliográfica de W08). Numeração: DEC-CUR-13 e a versão 0.10 pertencem à DH-T-03 (commit local `e04b85c`, ainda sem publicação), por isso esta etapa usa DEC-CUR-14 e 0.11. Totais de D-xx inalterados. |

## Regras deste registro

- Só entra como **decisão registrada** o que tem evidência: documento, comentário de código, commit ou README.
- Quando dois documentos divergem, **os dois são apresentados** e a questão fica pendente.
- Decisões tomadas em conversas e não documentadas **não** são presumidas.
- Identificadores: `DEC-xx` (registradas), `C-xx` (conflitos), `D-xx` (pendentes).

## 1. Decisões registradas (com evidência)

| Id | Decisão | Evidência | Observação |
|---|---|---|---|
| DEC-01 | Stack React, Vite, TypeScript e Tailwind CSS | Doc. 08 §1.3 ("Aprovada"); `package.json` | Implementada |
| DEC-02 | Arquivamento é atributo (`archived_at`), não estado concorrente | Doc. 07 RN-011; Doc. 08 §8.2; `types.ts` | Implementada e testada |
| DEC-03 | O MVP usa `localStorage`; IndexedDB fica para quando houver anexos, volume ou consultas | Comentário "Decisão registrada" em `src/infrastructure/localRepository.ts` | Diverge do Doc. 08 (ver C-04) |
| DEC-04 | Conta opcional; o app é local-first | `README.md` (seção "Conta opcional e sincronização"); comentário em `src/infrastructure/sync.ts` | Implementada |
| DEC-05 | O Conselho funciona sem IA | `README.md`; comentários em `council.ts` e `CouncilPages.tsx`; Doc. 13 v2 §17 (IA só na Fase 5) | Implementada |
| DEC-06 | O motor do Conselho usa os pesos iniciais do Doc. 04 §11 | Comentário em `src/domain/council.ts` (`WEIGHTS`) | Diverge do Doc. 13 v2 (ver C-02). **Substituída por DEC-CUR-05** como política operacional; os pesos do Doc. 04 ficam como política v1 histórica (`POLITICA_V1`). |
| DEC-07 | Política de conteúdo (CSP) ativada em duas fases: primeiro em modo de relatório, depois ativa | Commits `774d48f` e `0c4ae82`; Relatório final de UX (EV-13) | Implementada |
| DEC-08 | Patches de `@supabase/supabase-js`, `react-router-dom` e `vitest` não aplicados enquanto não houver ganho | Relatório final de UX, adendo 4 (EV-13) | Vigente |
| DEC-09 | Documentos oficiais numerados passam a ficar no repositório público | Commit `d00d3f2` | Relatórios de UX, prompts, HTMLs da Gita e emblemas continuam fora |
| DEC-10 | Gate de segurança: sinal de risco na situação ou na dúvida impede a sessão comum do Conselho | Commit `5368603` | Implementada; validada em produção (EV-43) |
| DEC-11 | O aviso de armazenamento não aparece quando há sinal de risco | Commit `b23ddac` | Implementada |
| DEC-12 | O conteúdo da Gita fica no Supabase (leitura pública), e não no build | Commits `7fbfdee` a `9bdaf35`, `ad34847`; `README.md` | Implementada (ver D-08-08) |
| DEC-13 | O Documento 13 v2 substitui a v1 como referência do Conselho | Cabeçalho da v2 ("Compatibilizada com o Catálogo de 34 Pensadores"); só a v2 está no repositório (commit `d00d3f2`) | A v1 continua disponível localmente (EV-10) |
| DEC-14 | O Documento 07 V2.0 substitui o V1.0 | Doc. 07 §18.1 | O V1.0 não foi localizado |
| DEC-15 | Metodologia documental: preservar os Documentos 04, 07 e 08 existentes e utilizar complementos de conformidade; reconstruir os Documentos 05 e 09, não localizados | Aprovação na revisão do produto em 23/11/2026; resolve D-GOV-01 (seção 3) | Aplicada em `docs/governanca/documentos/` (complementos 04, 07 e 08; reconstruções 05 e 09) |
| DEC-CUR-02 | Tradições são corpora de apoio, não pessoas convocáveis. "Tradições budistas" mantém `council: true` legado, mas não ocupa vaga entre as 2 a 5 vozes; pode dar contexto a uma perspectiva individual | Aprovação do responsável pelo produto em 23/11/2026 (Fase 2); ADR-CUR-02 | Implementada e testada. Resolve parcialmente D-04-02 (destino de Tradições budistas) |
| DEC-CUR-03 | Dalai Lama: recorte no budismo tibetano, sustentado pela biografia oficial; vínculo com a escola Gelug **a confirmar** (sem fonte específica para o 14º Dalai Lama); não representa todos os budismos | Aprovação de 23/11/2026; ADR-CUR-02; fontes listadas no ADR | Implementada e testada; vínculo Gelug pendente de fonte |
| DEC-CUR-04 | Referências-base dos nove habilitados sem obra, com metadados só quando conferidos; Sócrates por testemunhos (`source_witness_for`) | Aprovação de 23/11/2026; ADR-CUR-04 | Implementada; Franklin e *The Character of Physical Law* a confirmar. Resolve C-CUR-2 sem exclusões |
| DEC-CUR-05 | Pesos do Doc. 13 v2 (30/25/15/15/10/5) operacionais, como política versionada `council-selection-v2-doc13`; Doc. 04 fica como matriz e P1–P4, e seus pesos como política v1 histórica | Aprovação de 23/11/2026; ADR-CUR-03; comparação A/B em `docs/governanca/curadoria/` | Implementada e testada. **Resolve C-02 e D-08-04** |
| DEC-CUR-06 | Universos e tipos como taxonomia de navegação v1, não ontologia; universo principal + qualificadores; notas para casos híbridos | Aprovação de 23/11/2026; ADR-CUR-03 | Implementada; classificação item a item continua "proposta" |
| DEC-CUR-07 | Limites de concentração: com 5 vozes, no máximo 2 por universo; com 2 a 4, ao menos 2 universos; só com alternativa pertinente; exceção registrada | Aprovação de 23/11/2026; ADR-CUR-03 | Implementada e testada; relaxada em 47 de 71 Conselhos por falta de vozes pertinentes fora de "Filosofia e ética" |
| DEC-CUR-08 | Revisão das 189 relações sem validação em lote; inventário com prioridade de revisão (não é P1–P4 nem F1–F4) | Aprovação de 23/11/2026; ADR-CUR-04; `inventario-relacoes-v1.md` | Inventário criado; nenhuma relação revisada individualmente |
| DEC-CUR-09 | Bundle acima de 500 kB: medir antes de otimizar; sem code splitting nesta fase | Aprovação de 23/11/2026; ADR-CUR-05 | Medido: o arquivo principal é o framework; sem ganho mensurável |
| DEC-CUR-10 | Revisão da Fase 2: política `council-selection-v2.1-doc13-relevance-source` (diversidade só entre alternativas com pertinência temática e contextual; exceção registrada com motivo); fonte identificada separada de completude bibliográfica e de confiabilidade (fim do 0,5); Dalai Lama: prática Gelug inicial (declaração oficial de 2017), filiação monástica (Hogendoorn 2014; *revertida para "a confirmar" por decisão humana na revisão final, ver ADR-CUR-02*), chefia formal Gelug = Ganden Tripa, não afirmada | Revisão do responsável pelo produto em 23/11/2026; ADR-CUR-02, 03 e 04 (seções "Revisão humana"); `comparacao-politicas-selecao-v2.1.md` | Implementada e testada. Revisa DEC-CUR-03, 04, 05 e 07 sem apagá-las; v1 e v2 preservadas |
| DEC-CUR-11 | Notas curatoriais de transmissão (DH-T-01 da auditoria da Fase 3A, alternativa A): Sócrates, Confúcio, Lao-Tsé e Epicteto, que não têm corpus autoral próprio identificável (definição de `pensador-individual` no Doc. 14 §5), mantêm o tipo e ganham `classificacao.nota` específica sobre a forma de transmissão do pensamento. Mêncio e Hillel (candidatos) ficam pendentes da DH-L-11; Tiruvalluvar (DH-T-20) e Davi Kopenawa (DH-T-14) ficam fora | Aprovação do responsável pelo produto em 25/11/2026; auditoria da Fase 3A (relatórios fora do repositório); ADR-CUR-03 (seção "Revisão DH-T-01") | Implementada e testada. Nenhum tipo, universo, relação, regra de seleção ou schema muda; a nota é informativa |
| DEC-CUR-12 | Clareza no catálogo de tradições (DH-T-02 da auditoria da Fase 3A). (1) Os quatro pares de registros semelhantes (estoicismo ↔ tradicao-estoicismo, bhagavad-gita ↔ corpus-bhagavad-gita, tradicoes-budistas ↔ tradicao-budismos, tradicoes-cristas ↔ tradicao-cristianismos) ficam separados, sem fusão, renomeação nem transferência de relações; as duas páginas passam a dizer a função de cada registro. (2) Os agregados temáticos tradicoes-humanistas, tradicoes-religiosas e tradicoes-contemplativas são preservados e ganham `classificacao.nota` ("agregado temático legado"). (3) tradicao-filosofias-africanas e tradicao-pensamentos-indigenas: só auditoria, sem fusão nem reclassificação. (4) O `conflito` de tradicao-budismos passa a refletir a DEC-CUR-02. (5) `registrosNoCatalogo` e a dependência funcional dos três estoicos são preservados | Aprovação do responsável pelo produto em 25/11/2026; auditoria da Fase 3A (relatórios fora do repositório); ADR-CUR-02 (seção "Revisão DH-T-02") | Implementada e testada. Nenhum ID, relação, flag `council`, regra de seleção ou schema muda; a seleção é idêntica (snapshots v1, v2 e v2.1 inalterados) |
| DEC-CUR-14 | Identidade bibliográfica de W08 ("Tratado das Virtudes", DH-T-04 da auditoria da Fase 3A). (1) W08 é identificada como o título editorial *Treatise on the Virtues*, correspondente à seção da *Suma Teológica*, I-II, questões 49–67, e não como obra autônoma de Tomás de Aquino. Essa é a identidade bibliográfica mais provável, sustentada pela correspondência entre o título e a faixa de questões; **não é confirmação documental da intenção de quem redigiu o Documento 03**, e essa distinção permanece pendente. (2) Registro duplo: o título de W08 passa a ser "Tratado das Virtudes (Suma Teológica, I-II, qq. 49–67)" em `works.json`, e a `classificacao.nota` de `tomas-de-aquino` registra a identificação e o seu limite. (3) W08 não é removida, e as dez relações que citam W07 e W08 não mudam. A duplicidade W07/W08 é decisão própria da revisão geral das relações. (4) O campo `source` de W08, que só consta do Documento 03, é pendência separada | Aprovação do responsável pelo produto em 25/11/2026 (opção (i), registro (a) + (b)); auditoria da Fase 3A (relatórios fora do repositório); fontes reabertas em 25/11/2026 (Project MUSE, CiNii, Cambridge, SEP); ADR-CUR-04 (seção "Revisão DH-T-04") | Implementada e testada. Muda só o título de W08 e a nota de Tomás; a impressão de `works.json` passa de `659be0a8` para `78192ed3`. Nenhuma relação, flag `council`, peso, critério, política, schema ou snapshot muda; a seleção é idêntica |

## 2. Conflitos entre fontes (pendentes)

| Id | Tema | Posição A | Posição B | Código atual | Pendência |
|---|---|---|---|---|---|
| C-01 | Quantos e quais integrantes no Conselho | Doc. 04 §6: 26 pensadores. Docs de UX e prompts (EV-13, EV-14): "27 integrantes" | Doc. 12 e Doc. 13 (v1 e v2): 34 integrantes, incluindo Hillel e mais 7 | 27 habilitados: os 26 mais "Tradições budistas". Fase 2: 26 vozes convocáveis + 1 corpus de apoio (DEC-CUR-02) | D-04-02 |
| C-02 | Pesos da seleção | Doc. 04 §11: 35/30/15/10/10 (5 critérios) | Doc. 13 v1 §8.5 e v2 §7.1: 30/25/15/15/10/5 (6 critérios) | Doc. 13 v2 (política v2); Doc. 04 como v1 histórica | **Resolvido pela DEC-CUR-05** (23/11/2026) |
| C-03 | Quando entra a IA no Conselho | Doc. 13 v1 §17: Fase 1, com Edge Functions | Doc. 13 v2 §17: só na Fase 5, com ADR antes | Sem IA | Resolvido pela DEC-13, se confirmada |
| C-04 | Persistência local | Doc. 08 ADR-009 e §20: IndexedDB; Doc. 13 v2 §16: "IndexedDB para dados estruturados" | Comentário no código (DEC-03): localStorage | localStorage | D-08-01 |
| C-05 | Backend e conta | Doc. 07 §12.4: sincronização e autenticação em P3; Doc. 08: Supabase "Futuro"; Doc. 13 v2 §16: exige ADR | README e código: conta opcional, RLS e sync em produção | Implementado | D-08-02 |
| C-06 | Dimensões de cada virtude | Doc. 03 (fonte declarada nos dados) | Doc. 04 §5: diverge em 22 virtudes | Segue o Doc. 03 | D-04-01 |
| C-07 | Etapas da jornada | Doc. 01 §4: 4 etapas (Reconhecer, Investigar, Praticar, Revisar) | Doc. 06 §8.2: 7 etapas (Despertar … Revisar) | 7 etapas; "Reconhecer" virou "Identificar" | D-05-02 |
| C-08 | Durações das etapas | Protótipo anterior (EV-11, RN-01): duração fixa de 8 semanas | Doc. 01 §4 e apresentação (EV-12): "parâmetros iniciais, não prazos universais" | Só referência exibida | D-05-01 |
| C-09 | Quantidade de pensadores por sessão | Doc. 13 v1 §8.3: por complexidade (2, 3 ou 4–5) | Doc. 13 v2 §7.2 e Doc. 04 §8: 2 a 5 | 2 a 5 | Resolvido pela DEC-13, se confirmada |
| C-10 | Versionamento de sessões | Doc. 13 v2 §20: cada sessão registra a versão do catálogo e do algoritmo, sem reescrita silenciosa | — | Síntese recalculada a cada abertura. Fase 2: a versão dos critérios passa a constar no texto da justificativa de cada perspectiva gravada; campo próprio depende de D-08-03 | D-08-05 |
| C-11 | Identificadores de pensadores | Doc. 12: `PENS-001`…`PENS-034` | Dados: slugs (`socrates`), usados nas sessões gravadas | Slugs | D-04-02 |

## 3. Decisões pendentes (consolidadas)

| Totais | Quantidade |
|---|---:|
| Registros de decisão D-xx (total, considerando o histórico) | 25 |
| Decisões pendentes | 23 |
| Decisões aprovadas | 2 (D-GOV-01, formalizada em DEC-15; D-08-04, formalizada em DEC-CUR-05; ambas em 23/11/2026) |
| Conflitos preservados (seção 2) | 11 (C-02 resolvido pela DEC-CUR-05; linha mantida) |

DEC-15 é a formalização da D-GOV-01, e não uma segunda decisão: ela entra uma vez só nos totais acima, como "aprovada". As decisões registradas da seção 1 (DEC-01 a DEC-15 e DEC-CUR-02 a DEC-CUR-09) são um conjunto à parte; só a DEC-15 (D-GOV-01) e a DEC-CUR-05 (D-08-04) correspondem a registros D-xx. As demais DEC-CUR são decisões novas da Fase 2, não registros D-xx.

| Id | Pergunta | Documento de origem | Bloqueia |
|---|---|---|---|
| D-GOV-01 | **Status: APROVADA em 23/11/2026, na revisão do produto.** Decisão: preservar os Documentos 04, 07 e 08 existentes e utilizar complementos de conformidade. Os Documentos 05 e 09 foram reconstruídos por não terem sido localizados. Resolução formalizada em DEC-15 (seção 1). (Pergunta original: aceitar complementos de conformidade para os Docs. 04, 07 e 08, em vez de reconstruí-los, já que os originais existem e são recuperáveis?) | README de governança | — (não bloqueia mais) |
| D-GOV-02 | Quem valida cada documento? | README de governança | Mudança de status de qualquer documento |
| D-GOV-03 | Localizar a "Auditoria Consolidada — 23/11/2026", a "Revisão de Compatibilidade Documental" e as listas E01–E16, CS-00–CS-16 e ADR-CS-01–08, e reconciliar com o Doc. 09 reconstruído | Doc. 09 | Fidelidade do backlog |
| D-GOV-04 | Os Documentos 10 e 11 existem? Quais são os títulos? | Inventário | Índice documental |
| D-GOV-05 | Procurar os textos originais dos Docs. 05 e 09 e confrontá-los com as reconstruções | Docs. 05 e 09 | Aprovação dos Docs. 05 e 09 |
| D-04-01 | Referência das dimensões por virtude: Doc. 03 ou Doc. 04 §5? "Principal" equivale a D1? | Complemento do Doc. 04 | Correção de dados |
| D-04-02 | Composição do Conselho habilitado (27 ou 34), destino de "Tradições budistas" e identificadores. *Fase 2: o destino de "Tradições budistas" foi decidido pela DEC-CUR-02 (corpus de apoio); composição 27/34 e identificadores continuam pendentes.* | Complemento do Doc. 04 | Fase 1 do Conselho |
| D-04-03 | Equivalência entre os termos de virtude do Doc. 12 e as 48 virtudes | Complemento do Doc. 04 | Fase 1 do Conselho |
| D-05-01 | Durações: referência exibida, remover ou voltar a ser regra? | Doc. 05 | — |
| D-05-02 | Nome da etapa: "Reconhecer" ou "Identificar"? | Doc. 05 | — |
| D-05-03 | A Gita faz parte da metodologia ou é um recurso independente? | Doc. 05 | — |
| D-05-04 | "Quero me conhecer" precisa de fluxo próprio? | Doc. 05 | — |
| D-05-05 | Procurar e confrontar o Doc. 05 original | Doc. 05 | Aprovação do Doc. 05 |
| D-07-01 | Incluir a Gita no Doc. 07 como módulo oficial? | Complemento do Doc. 07 | — |
| D-07-02 | Aceitar os identificadores SEG-001 a SEG-013? Onde mantê-los? | Complemento do Doc. 07 | — |
| D-07-03 | Navegadores-alvo | Complemento do Doc. 07 | TS-07 |
| D-07-04 | Política de retenção e avaliação de LGPD | Complemento do Doc. 07 | — |
| D-08-01 | Formalizar localStorage ou planejar IndexedDB | Complemento do Doc. 08 | — |
| D-08-02 | ADR retroativo da adoção do Supabase | Complemento do Doc. 08 | — |
| D-08-03 | Estratégia de evolução do schema (4 → 5) sem perda no saneamento | Complemento do Doc. 08 | Novos campos do Conselho |
| D-08-04 | **Status: APROVADA em 23/11/2026** (Fase 2 de curadoria). Decisão: pesos do Doc. 13 v2 operacionais, versionados como `council-selection-v2-doc13`; resolução formalizada em DEC-CUR-05 (seção 1). (Pergunta original: pesos do motor, C-02.) | Complemento do Doc. 08 | — (não bloqueia mais) |
| D-08-05 | Gravar a síntese com versão ou continuar recalculando | Complemento do Doc. 08 | — |
| D-08-06 | Publicação condicionada ao CI verde | Complemento do Doc. 08 | — |
| D-08-07 | Dois projetos Vercel: intencional? Qual é o domínio oficial? | Complemento do Doc. 08 | — |
| D-08-08 | Gita disponível sem rede? | Complemento do Doc. 08 | — |

## 4. Como registrar uma nova decisão

1. Acrescente uma linha na seção 1, com a evidência: documento, commit, comentário de código ou ata.
2. Se a decisão resolve um conflito ou uma pendência, mova a linha de `C-xx` ou `D-xx` para a seção 1 e cite o id resolvido.
3. Atualize o documento afetado e o seu histórico de revisão.
4. Nunca apague uma linha; marque-a como "substituída por DEC-xx".
