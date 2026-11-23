# Matriz de rastreabilidade

| Campo | Valor |
|---|---|
| Versão | 0.2 |
| Data | 2026-11-23 |
| Status | ARTEFATO DE GOVERNANÇA PARA VALIDAÇÃO |
| Base | Código e testes no commit `b23ddac`; requisitos do Documento 07 V2.0; regras SEG propostas no complemento do Documento 07 |
| Como foi gerada | As linhas foram extraídas das tabelas de `../documentos/Documento-07-Especificacao-Funcional-Conformidade.md`, para que as duas fontes não divirjam. Se uma mudar, regenere a outra. |

## Histórico de revisão

| Versão | Data | Descrição |
|---|---|---|
| 0.1 | 2026-11-23 | Primeira versão, com um único status combinado |
| 0.2 | 2026-11-23 | Separação entre status de implementação e status de evidência; totais sem dupla contagem; reclassificação como artefato de governança. Requisitos e evidências não alterados. |

## Como ler

Cada linha segue a cadeia **Documento → Requisito → Funcionalidade → Componente/arquivo → Teste → Status de implementação → Status de evidência**.

**Status de implementação** (um por item):

| Status | Significado |
|---|---|
| IMPLEMENTADO | O comportamento existe no código |
| PARCIALMENTE IMPLEMENTADO | Existe em parte |
| NÃO IMPLEMENTADO | Não existe (ausência confirmada por inspeção) |
| PROPOSTO | Ainda não há implementação esperada |
| A VALIDAR | Depende de verificação ou de decisão |

**Status de evidência** (um ou mais tipos por item, unidos por "+"):

| Tipo | Significado |
|---|---|
| TESTE UNITÁRIO | Teste em `tests/unit/` que verifica o comportamento |
| TESTE DE INTEGRAÇÃO | Teste de integração. **Não há nenhum no repositório** |
| TESTE E2E | Teste em `tests/e2e/` |
| INSPEÇÃO ESTÁTICA | Só leitura do código, sem teste |
| VALIDAÇÃO MANUAL EM PRODUÇÃO | Verificação registrada em EV-43 |
| SEM EVIDÊNCIA IDENTIFICADA | Nenhuma verificação disponível (itens PROPOSTOS ou A VALIDAR) |

Caminhos de teste abreviados: `unit/…` significa `tests/unit/…`, e `e2e/…` significa `tests/e2e/…`.

## Totais (135 RF + 24 RN + 13 SEG = 172 itens)

### Por status de implementação (cada item conta uma vez)

| Status de implementação | Itens |
|---|---:|
| IMPLEMENTADO | 153 |
| PARCIALMENTE IMPLEMENTADO | 14 |
| NÃO IMPLEMENTADO | 3 |
| PROPOSTO | 1 |
| A VALIDAR | 1 |
| **Total** | **172** |

### Por combinação de evidências (cada item conta uma vez)

| Status de evidência | Itens |
|---|---:|
| TESTE E2E | 62 |
| INSPEÇÃO ESTÁTICA | 51 |
| TESTE UNITÁRIO | 38 |
| TESTE UNITÁRIO + TESTE E2E | 17 |
| SEM EVIDÊNCIA IDENTIFICADA | 2 |
| TESTE UNITÁRIO + TESTE E2E + VALIDAÇÃO MANUAL EM PRODUÇÃO | 1 |
| VALIDAÇÃO MANUAL EM PRODUÇÃO | 1 |
| **Total** | **172** |

### Cruzamento: implementação × evidência (cada item conta uma vez)

"Com teste automatizado" inclui qualquer combinação com teste unitário ou E2E.

| Status de implementação | Com teste automatizado | Só validação manual em produção | Só inspeção estática | Sem evidência identificada | Total |
|---|---:|---:|---:|---:|---:|
| IMPLEMENTADO | 109 | 1 | 43 | 0 | 153 |
| PARCIALMENTE IMPLEMENTADO | 9 | 0 | 5 | 0 | 14 |
| NÃO IMPLEMENTADO | 0 | 0 | 3 | 0 | 3 |
| PROPOSTO | 0 | 0 | 0 | 1 | 1 |
| A VALIDAR | 0 | 0 | 0 | 1 | 1 |
| **Total** | **118** | **1** | **51** | **2** | **172** |

### Por tipo de evidência (informativo: **não somar**)

Um item pode ter mais de um tipo, então esta tabela não fecha em 172. Itens com pelo menos um teste automatizado: **118**.

| Tipo de evidência | Itens em que aparece |
|---|---:|
| TESTE UNITÁRIO | 56 |
| TESTE DE INTEGRAÇÃO | 0 |
| TESTE E2E | 80 |
| INSPEÇÃO ESTÁTICA | 51 |
| VALIDAÇÃO MANUAL EM PRODUÇÃO | 2 |
| SEM EVIDÊNCIA IDENTIFICADA | 2 |

## Matriz

| Documento | Requisito | Funcionalidade | Componente/arquivo — evidência | Teste | Status de implementação | Status de evidência |
|---|---|---|---|---|---|---|
| Doc. 07 V2.0 | RF-001 | MOD-01 Início: Página inicial com acesso às funcionalidades | src/features/home/HomePage.tsx — `HomePage.tsx`, `Layout.tsx` | `e2e/mvp.spec.ts` (fluxo completo); `e2e/acessibilidade.spec.ts` (todas as rotas) | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-002 | MOD-01 Início: Mostrar jornada ativa | src/features/home/HomePage.tsx — Seção "Sua jornada" | `e2e/incremento-ux.spec.ts` ("virtude em foco") | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-003 | MOD-01 Início: Informar situação atual da jornada | src/features/home/HomePage.tsx — Estado e próxima ação (`nextAction`) | `e2e/incremento-ux.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-004 | MOD-01 Início: Atalhos para diário, exercícios e revisões | src/features/home/HomePage.tsx — Links para `/diario`, `/jornada?etapa=praticar`, `/jornada?etapa=revisar` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-005 | MOD-01 Início: Resumo de atividades recentes | src/features/home/HomePage.tsx — "Último registro" e "Atividades registradas" (contagem); sem lista de atividades | SEM TESTE IDENTIFICADO | PARCIALMENTE IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-006 | MOD-01 Início: Iniciar nova jornada | src/features/home/HomePage.tsx — Link "Iniciar minha jornada" | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-007 | MOD-02 Jornada: Criar jornada | src/features/journey/*; src/application/useCases.ts — `createJourney` | `unit/domain.test.ts` (CT-001); `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-008 | MOD-02 Jornada: Título da jornada | src/features/journey/*; src/application/useCases.ts — Campo título em `StartJourneyPage.tsx`; `defaultTitle` | `e2e/mvp.spec.ts` (título padrão "Jornada: Paciência") | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-009 | MOD-02 Jornada: Registrar intenção | src/features/journey/*; src/application/useCases.ts — `intention` (motivação, situação, expectativa) | `e2e/mvp.spec.ts`; `unit/domain.test.ts` (RN-002) | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-010 | MOD-02 Jornada: Selecionar virtude principal | src/features/journey/*; src/application/useCases.ts — `selectPrimaryVirtue` | `unit/domain.test.ts` (CT-002, RN-003); `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-011 | MOD-02 Jornada: Virtudes relacionadas | src/features/journey/*; src/application/useCases.ts — `addRelatedVirtue`, `removeRelatedVirtue` | `unit/domain.test.ts` (RN-004) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-012 | MOD-02 Jornada: Consultar configuração da jornada | src/features/journey/*; src/application/useCases.ts — Cabeçalho e etapa Despertar em `JourneyPage.tsx` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-013 | MOD-02 Jornada: Jornada em rascunho | src/features/journey/*; src/application/useCases.ts — Opção "Jornada salva como rascunho"; `discardDraft` | `unit/domain.test.ts` (CT-001, RN-006) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-014 | MOD-02 Jornada: Pausar | src/features/journey/*; src/application/useCases.ts — `pauseJourney` | `unit/domain.test.ts` (CT-004); `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-015 | MOD-02 Jornada: Retomar | src/features/journey/*; src/application/useCases.ts — `resumeJourney` | `unit/domain.test.ts` (CT-005); `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-016 | MOD-02 Jornada: Concluir | src/features/journey/*; src/application/useCases.ts — `completeJourney` (exige síntese) | `unit/domain.test.ts` (CT-006); `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-017 | MOD-02 Jornada: Datas de início e conclusão | src/features/journey/*; src/application/useCases.ts — `startedOn`, `completedOn`, exibidos no histórico | SEM TESTE IDENTIFICADO (datas não verificadas) | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-018 | MOD-02 Jornada: Histórico de alterações relevantes | src/features/journey/*; src/application/useCases.ts — `JourneyEvent` em `history`; "Marcos da jornada" | `e2e/incremento-ux.spec.ts` ("marcos da jornada") | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-019 | MOD-02 Jornada: Arquivar sem eliminar registros | src/features/journey/*; src/application/useCases.ts — `archiveJourney` (`archivedAt`) | `unit/domain.test.ts` (CT-007, RN-011); `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-020 | MOD-02 Jornada: Consultar arquivadas | src/features/journey/*; src/application/useCases.ts — "Mostrar jornadas arquivadas" em `HistoryPages.tsx` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-021 | MOD-02 Jornada: Preservar registros de jornada concluída | src/features/journey/*; src/application/useCases.ts — RN-010 | `e2e/mvp.spec.ts`; `unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-022 | MOD-02 Jornada: Observações gerais | src/features/journey/*; src/application/useCases.ts — `notes`, campo "Observações gerais sobre a jornada" | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-023 | MOD-03 Virtudes: Catálogo de virtudes | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — 48 virtudes em `virtues.json` | `e2e/mvp.spec.ts` ("catálogo: 48 virtudes"); `unit/catalog.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-024 | MOD-03 Virtudes: Organização por famílias | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — 8 famílias | `e2e/incremento-ux.spec.ts` (atalhos de família) | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-025 | MOD-03 Virtudes: Descrição da virtude | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — `VirtuePage` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-026 | MOD-03 Virtudes: Características e conceitos | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — Comportamentos, deficiência e excesso, "não confundir com" | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-027 | MOD-03 Virtudes: Pesquisar por nome | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — Campo de busca em `VirtuePages.tsx` | `e2e/mvp.spec.ts` ("filtros") | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-028 | MOD-03 Virtudes: Filtrar por família | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — Lista suspensa e atalhos | `e2e/incremento-ux.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-029 | MOD-03 Virtudes: Virtudes relacionadas | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — "Virtudes próximas" | `e2e/incremento-ux.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-030 | MOD-03 Virtudes: Selecionar virtude para iniciar jornada | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — Link `/jornada/nova?virtude=` | SEM TESTE IDENTIFICADO (esta entrada) | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-031 | MOD-03 Virtudes: Conteúdos conceituais | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — Página da virtude | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-032 | MOD-03 Virtudes: Distinguir conceitos próximos | src/features/virtues/VirtuePages.tsx; src/data/virtues.json — 18 distinções em `virtue-distinctions.json`, exibidas em `VirtuePages.tsx` | `unit/catalog.test.ts` (dados); exibição SEM TESTE IDENTIFICADO | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-033 | MOD-04 Investigação: Iniciar investigação | src/features/journey/StagePanels.tsx; src/domain/journey.ts — Etapa Investigar | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-034 | MOD-04 Investigação: Perguntas orientadoras | src/features/journey/StagePanels.tsx; src/domain/journey.ts — `INVESTIGATION_BLOCKS` (4 blocos, 12 perguntas) | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-035 | MOD-04 Investigação: Entendimento pessoal | src/features/journey/StagePanels.tsx; src/domain/journey.ts — `inv-entendimento` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-036 | MOD-04 Investigação: Características admiradas | src/features/journey/StagePanels.tsx; src/domain/journey.ts — `inv-admira` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-037 | MOD-04 Investigação: Situações de prática | src/features/journey/StagePanels.tsx; src/domain/journey.ts — Bloco "Reconhecer" | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-038 | MOD-04 Investigação: Situações de dificuldade | src/features/journey/StagePanels.tsx; src/domain/journey.ts — Bloco "Reconhecer" | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-039 | MOD-04 Investigação: Percepções de pessoas próximas | src/features/journey/StagePanels.tsx; src/domain/journey.ts — Pergunta opcional no bloco "Investigar" | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-040 | MOD-04 Investigação: Revisar e atualizar respostas | src/features/journey/StagePanels.tsx; src/domain/journey.ts — Campos com salvamento automático | `e2e/mvp.spec.ts` ("Resposta salva.") | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-041 | MOD-04 Investigação: Preservar respostas anteriores | src/features/journey/StagePanels.tsx; src/domain/journey.ts — `investigation` é um mapa pergunta → texto; atualizar sobrescreve | — | NÃO IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-042 | MOD-05 Dimensões: Sete dimensões | src/features/virtues/VirtuePages.tsx; src/data/dimensions.json; src/data/virtue-dimensions.json — `dimensions.json` | `unit/catalog.test.ts`; `e2e/acessibilidade.spec.ts` (rotas) | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-043 | MOD-05 Dimensões: Descrição de cada dimensão | src/features/virtues/VirtuePages.tsx; src/data/dimensions.json; src/data/virtue-dimensions.json — `/dimensoes/:id` | `e2e/acessibilidade.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-044 | MOD-05 Dimensões: Relacionar virtudes às dimensões conforme o Doc. 04 | src/features/virtues/VirtuePages.tsx; src/data/dimensions.json; src/data/virtue-dimensions.json — 176 relações, mas seguem o Doc. 03; 22 virtudes divergem do Doc. 04 §5 (ver complemento do Doc. 04, seção 4.2) | `unit/catalog.test.ts` | PARCIALMENTE IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-045 | MOD-05 Dimensões: Primária, secundária, contextual | src/features/virtues/VirtuePages.tsx; src/data/dimensions.json; src/data/virtue-dimensions.json — D1 e D2 com dados; D3 sem nenhum registro | `unit/identidade.test.ts` | PARCIALMENTE IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-046 | MOD-05 Dimensões: Dimensões da virtude selecionada | src/features/virtues/VirtuePages.tsx; src/data/dimensions.json; src/data/virtue-dimensions.json — Etapa Identificar; página da virtude | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-047 | MOD-05 Dimensões: Relação como referência, não classificação da pessoa | src/features/virtues/VirtuePages.tsx; src/data/dimensions.json; src/data/virtue-dimensions.json — Textos de aviso nas telas | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-048 | MOD-06 Exercícios: Exercícios associados às virtudes | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — 56 exercícios | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-049 | MOD-06 Exercícios: Descrição do exercício | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — `description` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-050 | MOD-06 Exercícios: Objetivo do exercício | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — Não há campo "objetivo" no modelo `Exercise`; a descrição faz esse papel | SEM TESTE IDENTIFICADO | PARCIALMENTE IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-051 | MOD-06 Exercícios: Orientações para a prática | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — `steps` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-052 | MOD-06 Exercícios: Associar exercícios à jornada | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — `startExercise` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-053 | MOD-06 Exercícios: Registrar realização | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — Registro no diário com `exerciseId` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-054 | MOD-06 Exercícios: Data da realização | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — Data do registro do diário | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-055 | MOD-06 Exercícios: Observações sobre a experiência | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — Campos do diário | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-056 | MOD-06 Exercícios: Consultar exercícios realizados | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — Estados experimentado e repetido | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-057 | MOD-06 Exercícios: Repetir exercício | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — `times` | `unit/domain.test.ts` (RN-016) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-058 | MOD-06 Exercícios: Recomendar por virtude e contexto | src/features/journey/StagePanels.tsx; src/domain/journey.ts; src/data/exercises.json — `exerciseOptions` usa a virtude principal, as relacionadas e as dimensões D1; não usa o contexto informado pela pessoa | `e2e/mvp.spec.ts` ("Recomendado"); `unit/domain.test.ts` ("recomenda exercícios da virtude") | PARCIALMENTE IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-059 | MOD-07 Diário: Criar registros | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — `saveEntry` | `e2e/mvp.spec.ts`; `unit/domain.test.ts` (CT-008) | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-060 | MOD-07 Diário: Data e horário | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — Data informada pela pessoa; horário só no carimbo interno `createdAt`, não exibido | SEM TESTE IDENTIFICADO | PARCIALMENTE IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-061 | MOD-07 Diário: Associar à jornada | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — `journeyId` | `unit/domain.test.ts` (CT-008) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-062 | MOD-07 Diário: Classificar o registro | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — 4 tipos (inclui "Descoberta", além dos 3 do requisito) | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-063 | MOD-07 Diário: Descrever a situação | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — Área de texto obrigatória | `e2e/incremento-ux.spec.ts`; `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-064 | MOD-07 Diário: Sentimentos e percepções | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — `feelings` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-065 | MOD-07 Diário: Ações realizadas | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — `actions` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-066 | MOD-07 Diário: Aprendizados e observações | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — `learning`, `note` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-067 | MOD-07 Diário: Editar registros | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — Edição em `DiaryPage.tsx` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-068 | MOD-07 Diário: Excluir com confirmação | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — `ConfirmButton`, `deleteEntry` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-069 | MOD-07 Diário: Histórico de registros | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — Lista do diário | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-070 | MOD-07 Diário: Filtrar por período | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — Filtros "de" e "até" | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-071 | MOD-07 Diário: Filtrar por tipo | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — Filtro de tipo | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-072 | MOD-07 Diário: Registros de uma virtude | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — Filtro de virtude | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-073 | MOD-07 Diário: Registros de jornadas anteriores | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — Detalhe da jornada no histórico | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-074 | MOD-07 Diário: Sem mínimo de registros | src/features/diary/DiaryPage.tsx; src/application/useCases.ts — RN-020 | `unit/domain.test.ts` (CT-010) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-075 | MOD-08 Revisões: Revisões periódicas | src/features/journey/StagePanels.tsx; src/application/useCases.ts — `saveReview` (`periodica`) | `e2e/mvp.spec.ts`; `unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-076 | MOD-08 Revisões: Perguntas orientadoras | src/features/journey/StagePanels.tsx; src/application/useCases.ts — `REVIEW_QUESTIONS` (5) | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-077 | MOD-08 Revisões: Situações de prática | src/features/journey/StagePanels.tsx; src/application/useCases.ts — `rev-praticas` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-078 | MOD-08 Revisões: Situações de dificuldade | src/features/journey/StagePanels.tsx; src/application/useCases.ts — `rev-dificuldades` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-079 | MOD-08 Revisões: Padrões percebidos | src/features/journey/StagePanels.tsx; src/application/useCases.ts — `rev-padroes` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-080 | MOD-08 Revisões: Aprendizados do período | src/features/journey/StagePanels.tsx; src/application/useCases.ts — `rev-aprendizados` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-081 | MOD-08 Revisões: Atenção futura | src/features/journey/StagePanels.tsx; src/application/useCases.ts — `rev-atencao` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-082 | MOD-08 Revisões: Revisões anteriores | src/features/journey/StagePanels.tsx; src/application/useCases.ts — Lista de revisões na jornada e no histórico | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-083 | MOD-08 Revisões: Revisão final | src/features/journey/StagePanels.tsx; src/application/useCases.ts — `final`, exigida para concluir | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-084 | MOD-08 Revisões: Síntese de registros e revisões | src/features/journey/StagePanels.tsx; src/application/useCases.ts — `journeyStats`; síntese no histórico | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-085 | MOD-08 Revisões: Ausência de registros não é ausência de prática | src/features/journey/StagePanels.tsx; src/application/useCases.ts — RN-015 e RN-020 | `unit/domain.test.ts` (CT-010) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-086 | MOD-08 Revisões: Sem notas morais | src/features/journey/StagePanels.tsx; src/application/useCases.ts — Nenhum cálculo de nota; leitura neutra das revisões legadas | `unit/domain.test.ts` ("tom neutro") | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-087 | MOD-09 Conselho: Acesso ao Conselho | src/features/council/CouncilPages.tsx; src/domain/council.ts — `/conselho` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-088 | MOD-09 Conselho: Apresentar situação | src/features/council/CouncilPages.tsx; src/domain/council.ts — Campo "Qual situação…" | `e2e/mvp.spec.ts`; `e2e/conselho-seguranca.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-089 | MOD-09 Conselho: Contextualizar | src/features/council/CouncilPages.tsx; src/domain/council.ts — Dúvida, virtude, dimensão e vínculo com jornada | `e2e/conselho-seguranca.spec.ts` (regressão) | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-090 | MOD-09 Conselho: Virtudes relacionadas à situação | src/features/council/CouncilPages.tsx; src/domain/council.ts — `suggest` (por regras, sem IA) | `unit/council-legacy.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-091 | MOD-09 Conselho: Dimensões relacionadas | src/features/council/CouncilPages.tsx; src/domain/council.ts — `suggest` | `unit/council-legacy.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-092 | MOD-09 Conselho: Selecionar perspectivas | src/features/council/CouncilPages.tsx; src/domain/council.ts — `selectThinkers`, determinístico | `unit/council-legacy.test.ts`; `unit/conselho-seguranca.test.ts` (repetibilidade) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-093 | MOD-09 Conselho: Contribuições fundamentadas em obras | src/features/council/CouncilPages.tsx; src/domain/council.ts — 9 dos 27 habilitados sem obra; perspectiva específica só nos 6 casos de referência; fora deles, o campo de contribuição do pensador | `e2e/mvp.spec.ts` | PARCIALMENTE IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-094 | MOD-09 Conselho: Perspectivas complementares ou divergentes | src/features/council/CouncilPages.tsx; src/domain/council.ts — `synthesize`: convergências e divergências por regras (mesma virtude, tradições distintas, limites), sem confronto de conteúdo | `e2e/incremento-ux.spec.ts` (leitura de conjunto) | PARCIALMENTE IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-095 | MOD-09 Conselho: Perguntas para reflexão | src/features/council/CouncilPages.tsx; src/domain/council.ts — Pergunta de cada pensador e pergunta central do caso | `unit/council-legacy.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-096 | MOD-09 Conselho: Síntese das perspectivas | src/features/council/CouncilPages.tsx; src/domain/council.ts — Texto de síntese só para os 6 casos de referência | SEM TESTE IDENTIFICADO | PARCIALMENTE IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-097 | MOD-09 Conselho: Reflexão pessoal após a consulta | src/features/council/CouncilPages.tsx; src/domain/council.ts — "Minha reflexão", com salvamento automático | `e2e/mvp.spec.ts`; `e2e/conselho-seguranca.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-098 | MOD-09 Conselho: Distinguir interpretação contemporânea de conteúdo histórico | src/features/council/CouncilPages.tsx; src/domain/council.ts — Aviso de transparência e origem da pergunta (documento ou aplicação); sem distinção por afirmação | `e2e/mvp.spec.ts` | PARCIALMENTE IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-099 | MOD-09 Conselho: Sem falas fictícias | src/features/council/CouncilPages.tsx; src/domain/council.ts — Contribuições curadas; aviso "Não são falas literais" | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-100 | MOD-09 Conselho: Referências das fontes | src/features/council/CouncilPages.tsx; src/domain/council.ts — Só o título da obra, sem metadados; 9 integrantes sem obra | `e2e/mvp.spec.ts` | PARCIALMENTE IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-101 | MOD-09 Conselho: Informar falta de fundamentação | src/features/council/CouncilPages.tsx; src/domain/council.ts — Aviso de limitação com menos de 2 pensadores; "Sem obra de referência registrada" | SEM TESTE IDENTIFICADO (CT-014) | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-102 | MOD-09 Conselho: Conselho não decide pelo usuário | src/features/council/CouncilPages.tsx; src/domain/council.ts — Texto de transparência; nenhuma ação automática | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-103 | MOD-10 Histórico: Jornadas anteriores | src/features/history/HistoryPages.tsx — `/historico` | `e2e/mvp.spec.ts`; `e2e/incremento-ux.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-104 | MOD-10 Histórico: Concluídas | src/features/history/HistoryPages.tsx — idem | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-105 | MOD-10 Histórico: Pausadas | src/features/history/HistoryPages.tsx — O histórico lista todas as jornadas não arquivadas, inclusive pausadas | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-106 | MOD-10 Histórico: Arquivadas | src/features/history/HistoryPages.tsx — idem RF-020 | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-107 | MOD-10 Histórico: Registros de cada jornada | src/features/history/HistoryPages.tsx — `/historico/:id` | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-108 | MOD-10 Histórico: Virtudes trabalhadas | src/features/history/HistoryPages.tsx — `virtueTrail`; percurso por dimensão | `e2e/incremento-ux.spec.ts`; `unit/historico.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-109 | MOD-10 Histórico: Não misturar registros de jornadas | src/features/history/HistoryPages.tsx — `entriesOf` por `journeyId` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-110 | MOD-11 Relatórios: Síntese da jornada | src/features/history/HistoryPages.tsx; src/domain/report.ts; src/features/diary/DiaryPage.tsx — Detalhe no histórico; `buildJourneyReport` | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-111 | MOD-11 Relatórios: Exercícios realizados | src/features/history/HistoryPages.tsx; src/domain/report.ts; src/features/diary/DiaryPage.tsx — idem | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-112 | MOD-11 Relatórios: Revisões registradas | src/features/history/HistoryPages.tsx; src/domain/report.ts; src/features/diary/DiaryPage.tsx — idem | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-113 | MOD-11 Relatórios: Aprendizados | src/features/history/HistoryPages.tsx; src/domain/report.ts; src/features/diary/DiaryPage.tsx — idem | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-114 | MOD-11 Relatórios: Evolução cronológica | src/features/history/HistoryPages.tsx; src/domain/report.ts; src/features/diary/DiaryPage.tsx — Linha do tempo | `e2e/incremento-ux.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-115 | MOD-11 Relatórios: Exportar dados da jornada | src/features/history/HistoryPages.tsx; src/domain/report.ts; src/features/diary/DiaryPage.tsx — JSON por jornada | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-116 | MOD-11 Relatórios: Exportar diário | src/features/history/HistoryPages.tsx; src/domain/report.ts; src/features/diary/DiaryPage.tsx — Markdown | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-117 | MOD-11 Relatórios: Síntese em formato legível | src/features/history/HistoryPages.tsx; src/domain/report.ts; src/features/diary/DiaryPage.tsx — Markdown (`report.ts`) | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-118 | MOD-11 Relatórios: Sem indicador de valor moral | src/features/history/HistoryPages.tsx; src/domain/report.ts; src/features/diary/DiaryPage.tsx — Só contagens de atividade | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-119 | MOD-12 Configurações: Preferências | src/features/settings/SettingsPages.tsx; src/app/Layout.tsx; src/infrastructure/legacy.ts; src/infrastructure/sync.ts — Tema no cabeçalho; menu de capítulos da Gita lembrado | `e2e/acessibilidade.spec.ts`; `e2e/gita.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-120 | MOD-12 Configurações: Preferências visuais | src/features/settings/SettingsPages.tsx; src/app/Layout.tsx; src/infrastructure/legacy.ts; src/infrastructure/sync.ts — Temas sistema, claro, escuro, roxo e dourado | `e2e/acessibilidade.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-121 | MOD-12 Configurações: Tema claro e escuro | src/features/settings/SettingsPages.tsx; src/app/Layout.tsx; src/infrastructure/legacy.ts; src/infrastructure/sync.ts — idem | `e2e/acessibilidade.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-122 | MOD-12 Configurações: Exportar dados pessoais | src/features/settings/SettingsPages.tsx; src/app/Layout.tsx; src/infrastructure/legacy.ts; src/infrastructure/sync.ts — `buildExport`; inclui reflexões da Gita com conta | `e2e/exportacao.spec.ts`; `unit/exportacao.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-123 | MOD-12 Configurações: Importar dados | src/features/settings/SettingsPages.tsx; src/app/Layout.tsx; src/infrastructure/legacy.ts; src/infrastructure/sync.ts — `parseImport` (formato atual e da versão anterior) | `e2e/exportacao.spec.ts`; `unit/council-legacy.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-124 | MOD-12 Configurações: Exclusão de dados pessoais | src/features/settings/SettingsPages.tsx; src/app/Layout.tsx; src/infrastructure/legacy.ts; src/infrastructure/sync.ts — Apagar do aparelho; apagar da nuvem (`jv_delete_my_data` e reflexões) | `e2e/gita.spec.ts` (exclusão na nuvem) | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-125 | MOD-12 Configurações: Informar onde ficam os dados | src/features/settings/SettingsPages.tsx; src/app/Layout.tsx; src/infrastructure/legacy.ts; src/infrastructure/sync.ts — Textos em Configurações e no Conselho | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RF-126 | MOD-12 Configurações: Integridade em importação e exportação | src/features/settings/SettingsPages.tsx; src/app/Layout.tsx; src/infrastructure/legacy.ts; src/infrastructure/sync.ts — Saneamento campo a campo; ida e volta | `unit/council-legacy.test.ts`; `e2e/exportacao.spec.ts` | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E |
| Doc. 07 V2.0 | RF-127 | Transversal: Navegar sem perder o que foi salvo | src/app/hooks.tsx; src/application/useCases.ts; src/infrastructure/sanitize.ts — Persistência a cada alteração; salvamento automático | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-128 | Transversal: Informar falha de gravação | src/app/hooks.tsx; src/application/useCases.ts; src/infrastructure/sanitize.ts — `useRun` (mensagem de erro) | `unit/council-legacy.test.ts` (CT-013) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-129 | Transversal: Informar sucesso | src/app/hooks.tsx; src/application/useCases.ts; src/infrastructure/sanitize.ts — Mensagens de retorno | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-130 | Transversal: Validar campos obrigatórios | src/app/hooks.tsx; src/application/useCases.ts; src/infrastructure/sanitize.ts — `DomainError` nos casos de uso | `unit/domain.test.ts` (RF-130) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-131 | Transversal: Mensagens de validação compreensíveis | src/app/hooks.tsx; src/application/useCases.ts; src/infrastructure/sanitize.ts — idem | `unit/domain.test.ts` (RF-131) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-132 | Transversal: Consistência entre jornadas e registros | src/app/hooks.tsx; src/application/useCases.ts; src/infrastructure/sanitize.ts — Saneamento de referências; chaves estrangeiras na nuvem | `unit/domain.test.ts` (saneamento) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RF-133 | Transversal: Celular e computador | src/app/hooks.tsx; src/application/useCases.ts; src/infrastructure/sanitize.ts — Layout responsivo; áreas de toque de 44 px | `e2e/desempenho.spec.ts`; `e2e/gita.spec.ts` (celular). Validação em produção só em desktop (EV-43) | PARCIALMENTE IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RF-134 | Transversal: Navegação por teclado | src/app/hooks.tsx; src/application/useCases.ts; src/infrastructure/sanitize.ts — Elementos nativos; nenhum teste de teclado nem auditoria com leitor de tela | SEM TESTE IDENTIFICADO | A VALIDAR | SEM EVIDÊNCIA IDENTIFICADA |
| Doc. 07 V2.0 | RF-135 | Transversal: Evolução modular | src/app/hooks.tsx; src/application/useCases.ts; src/infrastructure/sanitize.ts — Camadas e rotas carregadas sob demanda | Inspeção do código | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RN-001 | Regras de negócio: Identificador único | src/application/useCases.ts; src/domain/journey.ts — `newId` (UUID) | `unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-002 | Regras de negócio: Intenção registrada | src/application/useCases.ts; src/domain/journey.ts — `createJourney` | `unit/domain.test.ts` (RN-002) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-003 | Regras de negócio: Virtude principal | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (RN-003) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-004 | Regras de negócio: Relacionadas sem substituir a principal | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (RN-004) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-005 | Regras de negócio: Começa em rascunho | src/application/useCases.ts; src/domain/journey.ts — `createJourney` cria em DRAFT; a interface pode iniciar em seguida | `unit/domain.test.ts` (CT-001) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-006 | Regras de negócio: Rascunho: iniciar, editar, descartar | src/application/useCases.ts; src/domain/journey.ts — `discardDraft` | `unit/domain.test.ts` (RN-006) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-007 | Regras de negócio: Ativa: pausar ou concluir | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-008 | Regras de negócio: Pausada: retomar ou concluir | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (RN-008) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-009 | Regras de negócio: Concluída não volta a ativa | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (RN-009) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-010 | Regras de negócio: Concluída preserva registros | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (RN-010) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-011 | Regras de negócio: Arquivamento por atributo próprio | src/application/useCases.ts; src/domain/journey.ts — `archivedAt` | `unit/domain.test.ts` (RN-011) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-012 | Regras de negócio: Arquivar não exclui registros | src/application/useCases.ts; src/domain/journey.ts | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RN-013 | Regras de negócio: Investigação ligada à virtude principal | src/application/useCases.ts; src/domain/journey.ts — Perguntas sobre a virtude da jornada | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RN-014 | Regras de negócio: Situações positivas e dificuldades | src/application/useCases.ts; src/domain/journey.ts — Tipos do diário; bloco "Reconhecer" | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RN-015 | Regras de negócio: Não presumir falta de prática | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (CT-010) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-016 | Regras de negócio: Exercícios repetíveis | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (RN-016) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-017 | Regras de negócio: Exercício é experiência, não prova de domínio | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (RN-017) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-018 | Regras de negócio: Registrar sem exercício recomendado | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (CT-009) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-019 | Regras de negócio: Diário voluntário | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (RN-019) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-020 | Regras de negócio: Sem registros não impede continuar | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` (CT-010) | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-021 | Regras de negócio: Revisões consideram registros e percepções | src/application/useCases.ts; src/domain/journey.ts — A revisão mostra estatísticas e perguntas; não traz os registros do período para a tela | SEM TESTE IDENTIFICADO | PARCIALMENTE IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 V2.0 | RN-022 | Regras de negócio: Revisões sem nota moral | src/application/useCases.ts; src/domain/journey.ts | `unit/domain.test.ts` ("tom neutro") | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 V2.0 | RN-023 | Regras de negócio: Conselho com perspectivas fundamentadas e fontes | src/application/useCases.ts; src/domain/journey.ts — Igual a RF-093, RF-098 e RF-100 | `e2e/mvp.spec.ts` | PARCIALMENTE IMPLEMENTADO | TESTE E2E |
| Doc. 07 V2.0 | RN-024 | Regras de negócio: Conselho apoia sem substituir a decisão | src/application/useCases.ts; src/domain/journey.ts | `e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 (complemento, proposta) | SEG-001 | Segurança (proposta): Com sinal de risco na situação ou na dúvida, o Conselho não cria sessão comum, não seleciona pensadores, não grava nem navega; mostra orientação de segurança | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — `crisis.ts`, `convene()`; commit `5368603` | `unit/conselho-seguranca.test.ts`; `e2e/conselho-seguranca.spec.ts`; produção em Chrome desktop (EV-43) | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E + VALIDAÇÃO MANUAL EM PRODUÇÃO |
| Doc. 07 (complemento, proposta) | SEG-002 | Segurança (proposta): A proteção vale também fora da interface: o caso de uso recusa criar sessão sinalizada | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — `saveSession` | `unit/conselho-seguranca.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| Doc. 07 (complemento, proposta) | SEG-003 | Segurança (proposta): Com sinal de risco, a interface não afirma que o texto será guardado | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — Commit `b23ddac` | `e2e/conselho-seguranca.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 (complemento, proposta) | SEG-004 | Segurança (proposta): Contatos de ajuda (CVV 188, SAMU 192, Polícia 190, Central da Mulher 180) sempre visíveis no bloqueio | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — `CrisisNotice` | `e2e/conselho-seguranca.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 (complemento, proposta) | SEG-005 | Segurança (proposta): A detecção por termos não é apresentada como avaliação clínica | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — Texto do alerta; comentário em `crisis.ts` | Inspeção | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 (complemento, proposta) | SEG-006 | Segurança (proposta): Reflexão ou ação com sinal de risco em sessão já existente recebe tratamento de segurança | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — Hoje é salva automaticamente, sem aviso | — | NÃO IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 (complemento, proposta) | SEG-007 | Segurança (proposta): Sessão antiga com sinal de risco não exibe a deliberação comum, sem apagar dados | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — A tela de sessão mostra o aviso e a deliberação inteira | — | NÃO IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 (complemento, proposta) | SEG-008 | Segurança (proposta): A lista de termos de risco é revisada por especialista, com casos de falso positivo e negativo | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — Lista atual com 18 termos | — | PROPOSTO | SEM EVIDÊNCIA IDENTIFICADA |
| Doc. 07 (complemento, proposta) | SEG-009 | Segurança (proposta): Dados do usuário acessíveis só pelo dono na nuvem | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — RLS e privilégios mínimos (migrações) | SEM TESTE AUTOMATIZADO NO REPOSITÓRIO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 (complemento, proposta) | SEG-010 | Segurança (proposta): Nenhum segredo de serviço no frontend | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — `src/config.ts` | Inspeção | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| Doc. 07 (complemento, proposta) | SEG-011 | Segurança (proposta): Política de conteúdo restritiva e cabeçalhos de segurança | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — `vercel.json` | `e2e/seguranca.spec.ts` | IMPLEMENTADO | TESTE E2E |
| Doc. 07 (complemento, proposta) | SEG-012 | Segurança (proposta): Nenhum dado é enviado a provedor de IA | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — Não há código de IA; nenhuma requisição externa na validação em produção | EV-43 (rede observada) | IMPLEMENTADO | VALIDAÇÃO MANUAL EM PRODUÇÃO |
| Doc. 07 (complemento, proposta) | SEG-013 | Segurança (proposta): Dados importados são validados e saneados | src/domain/crisis.ts; src/features/council/CouncilPages.tsx; src/application/useCases.ts; supabase/migrations; vercel.json — `sanitize.ts`, `parseImport` | `unit/council-legacy.test.ts`; `unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |

## Casos de teste do Documento 07 (CT)

| CT | Cenário | Teste | Status de implementação | Status de evidência |
|---|---|---|---|---|
| CT-001 | Criar jornada válida em DRAFT | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-002 | Criar sem virtude principal | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-003 | Iniciar | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-004 | Pausar | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-005 | Retomar | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-006 | Concluir | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-007 | Arquivar concluída | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-008 | Registrar experiência | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-009 | Registrar sem exercício | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-010 | Revisão sem registros | `tests/unit/domain.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-011 | Consultar jornada anterior | `tests/e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |
| CT-012 | Exportar dados | `tests/e2e/mvp.spec.ts`; `tests/e2e/exportacao.spec.ts` | IMPLEMENTADO | TESTE E2E |
| CT-013 | Falha de persistência | `tests/unit/council-legacy.test.ts` | IMPLEMENTADO | TESTE UNITÁRIO |
| CT-014 | Conselho sem fonte suficiente | SEM TESTE IDENTIFICADO | IMPLEMENTADO | INSPEÇÃO ESTÁTICA |
| CT-015 | Histórico após conclusão | `tests/e2e/mvp.spec.ts` | IMPLEMENTADO | TESTE E2E |

## Requisitos não funcionais

O status dos RNF-001 a RNF-053, por grupo, está na seção 7 de `../documentos/Documento-07-Especificacao-Funcional-Conformidade.md`. Os pontos sem evidência suficiente (status de implementação; status de evidência) são:
- RNF-013 (teclado) e RNF-045 (navegadores-alvo): A VALIDAR; SEM EVIDÊNCIA IDENTIFICADA;
- RNF-029 (retenção): PARCIALMENTE IMPLEMENTADO; TESTE E2E da exclusão, sem política. RNF-030 (LGPD): A VALIDAR; SEM EVIDÊNCIA IDENTIFICADA;
- RNF-048 (PWA): NÃO IMPLEMENTADO; INSPEÇÃO ESTÁTICA;
- RNF-050 (integração): PARCIALMENTE IMPLEMENTADO; TESTE E2E. RNF-053 (publicação condicionada ao CI): PARCIALMENTE IMPLEMENTADO; INSPEÇÃO ESTÁTICA.

## Rastreabilidade entre documentos

| Tema | Documento de referência | Situação do documento | Complemento ou reconstrução |
|---|---|---|---|
| Propósito | Doc. 01 | No repositório | — |
| Sete dimensões | Doc. 02 | No repositório | — |
| Virtudes | Doc. 03 | No repositório | — |
| Matriz dimensões × virtudes × pensadores | Doc. 04 | No repositório | `Documento-04-Matriz-Integracao-Conformidade.md` |
| Metodologia da jornada | Doc. 05 | **Não localizado** | `Documento-05-Metodologia-Jornada.md` (reconstruído) |
| Telas e navegação | Doc. 06 | No repositório | — |
| Requisitos | Doc. 07 | No repositório | `Documento-07-Especificacao-Funcional-Conformidade.md` |
| Arquitetura | Doc. 08 | No repositório | `Documento-08-Arquitetura-Tecnica-Conformidade.md` |
| Implementação e testes | Doc. 09 | **Não localizado** | `Documento-09-Backlog-Testes.md` (reconstruído) |
| — | Docs. 10 e 11 | **Não localizados**, título desconhecido | Nenhum (não criados) |
| Catálogo de pensadores | Doc. 12 | No repositório | Confronto no complemento do Doc. 04 |
| Metodologia do Conselho | Doc. 13 (v2 no repositório; v1 local) | No repositório | Confronto nos complementos dos Docs. 07, 08 e 09 |
