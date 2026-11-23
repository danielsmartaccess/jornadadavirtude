# Documento 07 — Especificação Funcional: complemento de conformidade

| Campo | Valor |
|---|---|
| Número e título | Documento 07 — Especificação Funcional e Requisitos (complemento de conformidade) |
| Versão | 0.2 |
| Data de reconstrução | 2026-11-23 |
| Status | COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO |
| Relação com o original | **Não substitui** o Documento 07 V2.0 (`docs/DOCUMENTO-07-especificacao-funcional.txt`). Mantém os identificadores originais e acrescenta o status de implementação e a evidência de cada um. Os identificadores `SEG-xxx` são **novos**, propostos aqui. |
| Fontes utilizadas | EV-05, EV-06, EV-09, EV-20 a EV-37, EV-40 a EV-43 |
| Limitações conhecidas | O status foi atribuído por leitura do código e dos testes no commit `b23ddac`. Não houve teste com usuários. "IMPLEMENTADO" sem teste indicado significa evidência só no código. O Documento 07 V1.0 não foi localizado. |

## Histórico de revisão

| Versão | Data | Descrição |
|---|---|---|
| 0.1 | 2026-11-23 | Primeira versão: status de RF-001 a RF-135, RNF-001 a RNF-053, RN-001 a RN-024, CT-001 a CT-015, US-001 a US-010, e proposta de SEG-001 a SEG-013. |
| 0.2 | 2026-11-23 | Reclassificação documental: COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO. Separação entre status de implementação e status de evidência (nova coluna nas tabelas de RF, RN, SEG, RNF e CT). Requisitos, textos e evidências registradas não alterados. |

---

## 1. Visão geral

A Jornada da Virtude é uma aplicação web de página única (React, Vite, TypeScript, Tailwind). Funciona sem conta e sem rede, com dados no navegador. A conta e a sincronização com o Supabase são opcionais. O Conselho de Sabedoria funciona sem IA, por regras e por uma base de conhecimento curada.

## 2. Objetivos do produto

Os Documentos 01 e 07 §2 e §3 continuam valendo: desenvolver virtudes pela reflexão e pela prática, preservando a autonomia, sem nota moral, com pluralidade e transparência. Este complemento não altera objetivos.

## 3. Perfis de usuário

| Perfil (Doc. 07 §4) | Situação no sistema |
|---|---|
| Usuário | Existe. Sem conta, usa o aparelho; com conta opcional, sincroniza com a nuvem. |
| Sistema | Existe. |
| Conselho de Sabedoria | Existe, sem IA. |
| Provedor de IA | **Não existe.** Nenhum código chama provedor de IA. |
| Administrador de conteúdo | **Não existe como perfil.** O conteúdo é mantido em arquivos JSON versionados e em seeds SQL, por meio de commits. |

## 4. Jornada principal

O fluxo de conclusão do MVP (Doc. 07 §14.1) tem os 12 passos: criar, intenção, virtude, investigar, dimensões, exercícios, registrar, revisar, pausar e retomar, concluir, histórico, exportar. Ele está **implementado e testado de ponta a ponta** em `tests/e2e/mvp.spec.ts`, no teste "fluxo completo".

## 5. Módulos funcionais

| Código | Módulo | Tela(s) e arquivos | Situação |
|---|---|---|---|
| MOD-01 | Início | `/`, `src/features/home/HomePage.tsx` | Implementado |
| MOD-02 | Jornada | `/jornada`, `/jornada/nova`, `src/features/journey/*` | Implementado |
| MOD-03 | Virtudes | `/virtudes`, `/virtudes/:id`, `src/features/virtues/VirtuePages.tsx` | Implementado |
| MOD-04 | Investigação | Etapa Investigar, `src/features/journey/StagePanels.tsx` | Implementado |
| MOD-05 | Dimensões | `/dimensoes`, `/dimensoes/:id` | Implementado |
| MOD-06 | Exercícios | Etapa Praticar, `src/data/exercises.json` | Implementado |
| MOD-07 | Diário | `/diario`, `src/features/diary/DiaryPage.tsx` | Implementado |
| MOD-08 | Revisões | Etapa Revisar | Implementado |
| MOD-09 | Conselho | `/conselho`, `/conselho/sessoes/:id`, `/conselho/pensadores`, `src/features/council/CouncilPages.tsx` | Parcialmente implementado (seção 6.9) |
| MOD-10 | Histórico | `/historico`, `/historico/:id` | Implementado |
| MOD-11 | Relatórios | Exportações em `HistoryPages.tsx`, `DiaryPage.tsx`, `src/domain/report.ts` | Implementado |
| MOD-12 | Configurações | `/configuracoes`, `src/features/settings/SettingsPages.tsx`; tema em `src/app/Layout.tsx` | Implementado |
| — (não previsto no Doc. 07) | Leitura da Bhagavad Gita | `/gita`, `/gita/:numero`, `/gita/ensinamentos`, `src/features/gita/*`, tabelas no Supabase | Implementado fora da especificação (ver D-07-01) |

## 6. Requisitos funcionais

Cada requisito tem dois status independentes:

- **Status de implementação:** IMPLEMENTADO, PARCIALMENTE IMPLEMENTADO, NÃO IMPLEMENTADO, PROPOSTO ou A VALIDAR.
- **Status de evidência:** o tipo de verificação que sustenta o status de implementação. Pode ser TESTE UNITÁRIO, TESTE DE INTEGRAÇÃO, TESTE E2E, INSPEÇÃO ESTÁTICA, VALIDAÇÃO MANUAL EM PRODUÇÃO ou SEM EVIDÊNCIA IDENTIFICADA; um mesmo requisito pode ter mais de um tipo, unidos por "+".

Regras usadas:
- INSPEÇÃO ESTÁTICA: só leitura do código, sem teste. Num item NÃO IMPLEMENTADO, é a inspeção que confirma a ausência.
- SEM EVIDÊNCIA IDENTIFICADA: itens PROPOSTOS ou A VALIDAR.
- TESTE DE INTEGRAÇÃO: não há nenhum no repositório (complemento do Doc. 08, seção 10).
- A coluna "Teste" continua indicando o arquivo; "SEM TESTE IDENTIFICADO" significa que não há teste automatizado.

### 6.1. MOD-01 — Início

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-001 | Página inicial com acesso às funcionalidades | P0 | IMPLEMENTADO | `HomePage.tsx`, `Layout.tsx` | `e2e/mvp.spec.ts` (fluxo completo); `e2e/acessibilidade.spec.ts` (todas as rotas) | TESTE E2E |
| RF-002 | Mostrar jornada ativa | P0 | IMPLEMENTADO | Seção "Sua jornada" | `e2e/incremento-ux.spec.ts` ("virtude em foco") | TESTE E2E |
| RF-003 | Informar situação atual da jornada | P0 | IMPLEMENTADO | Estado e próxima ação (`nextAction`) | `e2e/incremento-ux.spec.ts` | TESTE E2E |
| RF-004 | Atalhos para diário, exercícios e revisões | P1 | IMPLEMENTADO | Links para `/diario`, `/jornada?etapa=praticar`, `/jornada?etapa=revisar` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-005 | Resumo de atividades recentes | P1 | PARCIALMENTE IMPLEMENTADO | "Último registro" e "Atividades registradas" (contagem); sem lista de atividades | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-006 | Iniciar nova jornada | P0 | IMPLEMENTADO | Link "Iniciar minha jornada" | `e2e/mvp.spec.ts` | TESTE E2E |

### 6.2. MOD-02 — Jornada

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-007 | Criar jornada | P0 | IMPLEMENTADO | `createJourney` | `unit/domain.test.ts` (CT-001); `e2e/mvp.spec.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-008 | Título da jornada | P0 | IMPLEMENTADO | Campo título em `StartJourneyPage.tsx`; `defaultTitle` | `e2e/mvp.spec.ts` (título padrão "Jornada: Paciência") | TESTE E2E |
| RF-009 | Registrar intenção | P0 | IMPLEMENTADO | `intention` (motivação, situação, expectativa) | `e2e/mvp.spec.ts`; `unit/domain.test.ts` (RN-002) | TESTE UNITÁRIO + TESTE E2E |
| RF-010 | Selecionar virtude principal | P0 | IMPLEMENTADO | `selectPrimaryVirtue` | `unit/domain.test.ts` (CT-002, RN-003); `e2e/mvp.spec.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-011 | Virtudes relacionadas | P1 | IMPLEMENTADO | `addRelatedVirtue`, `removeRelatedVirtue` | `unit/domain.test.ts` (RN-004) | TESTE UNITÁRIO |
| RF-012 | Consultar configuração da jornada | P0 | IMPLEMENTADO | Cabeçalho e etapa Despertar em `JourneyPage.tsx` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-013 | Jornada em rascunho | P0 | IMPLEMENTADO | Opção "Jornada salva como rascunho"; `discardDraft` | `unit/domain.test.ts` (CT-001, RN-006) | TESTE UNITÁRIO |
| RF-014 | Pausar | P0 | IMPLEMENTADO | `pauseJourney` | `unit/domain.test.ts` (CT-004); `e2e/mvp.spec.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-015 | Retomar | P0 | IMPLEMENTADO | `resumeJourney` | `unit/domain.test.ts` (CT-005); `e2e/mvp.spec.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-016 | Concluir | P0 | IMPLEMENTADO | `completeJourney` (exige síntese) | `unit/domain.test.ts` (CT-006); `e2e/mvp.spec.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-017 | Datas de início e conclusão | P1 | IMPLEMENTADO | `startedOn`, `completedOn`, exibidos no histórico | SEM TESTE IDENTIFICADO (datas não verificadas) | INSPEÇÃO ESTÁTICA |
| RF-018 | Histórico de alterações relevantes | P2 | IMPLEMENTADO | `JourneyEvent` em `history`; "Marcos da jornada" | `e2e/incremento-ux.spec.ts` ("marcos da jornada") | TESTE E2E |
| RF-019 | Arquivar sem eliminar registros | P1 | IMPLEMENTADO | `archiveJourney` (`archivedAt`) | `unit/domain.test.ts` (CT-007, RN-011); `e2e/mvp.spec.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-020 | Consultar arquivadas | P1 | IMPLEMENTADO | "Mostrar jornadas arquivadas" em `HistoryPages.tsx` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-021 | Preservar registros de jornada concluída | P0 | IMPLEMENTADO | RN-010 | `e2e/mvp.spec.ts`; `unit/domain.test.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-022 | Observações gerais | P1 | IMPLEMENTADO | `notes`, campo "Observações gerais sobre a jornada" | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |

### 6.3. MOD-03 — Virtudes

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-023 | Catálogo de virtudes | P0 | IMPLEMENTADO | 48 virtudes em `virtues.json` | `e2e/mvp.spec.ts` ("catálogo: 48 virtudes"); `unit/catalog.test.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-024 | Organização por famílias | P0 | IMPLEMENTADO | 8 famílias | `e2e/incremento-ux.spec.ts` (atalhos de família) | TESTE E2E |
| RF-025 | Descrição da virtude | P0 | IMPLEMENTADO | `VirtuePage` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-026 | Características e conceitos | P1 | IMPLEMENTADO | Comportamentos, deficiência e excesso, "não confundir com" | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-027 | Pesquisar por nome | P1 | IMPLEMENTADO | Campo de busca em `VirtuePages.tsx` | `e2e/mvp.spec.ts` ("filtros") | TESTE E2E |
| RF-028 | Filtrar por família | P1 | IMPLEMENTADO | Lista suspensa e atalhos | `e2e/incremento-ux.spec.ts` | TESTE E2E |
| RF-029 | Virtudes relacionadas | P1 | IMPLEMENTADO | "Virtudes próximas" | `e2e/incremento-ux.spec.ts` | TESTE E2E |
| RF-030 | Selecionar virtude para iniciar jornada | P0 | IMPLEMENTADO | Link `/jornada/nova?virtude=` | SEM TESTE IDENTIFICADO (esta entrada) | INSPEÇÃO ESTÁTICA |
| RF-031 | Conteúdos conceituais | P1 | IMPLEMENTADO | Página da virtude | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-032 | Distinguir conceitos próximos | P1 | IMPLEMENTADO | 18 distinções em `virtue-distinctions.json`, exibidas em `VirtuePages.tsx` | `unit/catalog.test.ts` (dados); exibição SEM TESTE IDENTIFICADO | TESTE UNITÁRIO |

### 6.4. MOD-04 — Investigação

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-033 | Iniciar investigação | P0 | IMPLEMENTADO | Etapa Investigar | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-034 | Perguntas orientadoras | P0 | IMPLEMENTADO | `INVESTIGATION_BLOCKS` (4 blocos, 12 perguntas) | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-035 | Entendimento pessoal | P0 | IMPLEMENTADO | `inv-entendimento` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-036 | Características admiradas | P0 | IMPLEMENTADO | `inv-admira` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-037 | Situações de prática | P0 | IMPLEMENTADO | Bloco "Reconhecer" | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-038 | Situações de dificuldade | P0 | IMPLEMENTADO | Bloco "Reconhecer" | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-039 | Percepções de pessoas próximas | P2 | IMPLEMENTADO | Pergunta opcional no bloco "Investigar" | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-040 | Revisar e atualizar respostas | P1 | IMPLEMENTADO | Campos com salvamento automático | `e2e/mvp.spec.ts` ("Resposta salva.") | TESTE E2E |
| RF-041 | Preservar respostas anteriores | P2 | NÃO IMPLEMENTADO | `investigation` é um mapa pergunta → texto; atualizar sobrescreve | — | INSPEÇÃO ESTÁTICA |

### 6.5. MOD-05 — Dimensões

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-042 | Sete dimensões | P0 | IMPLEMENTADO | `dimensions.json` | `unit/catalog.test.ts`; `e2e/acessibilidade.spec.ts` (rotas) | TESTE UNITÁRIO + TESTE E2E |
| RF-043 | Descrição de cada dimensão | P0 | IMPLEMENTADO | `/dimensoes/:id` | `e2e/acessibilidade.spec.ts` | TESTE E2E |
| RF-044 | Relacionar virtudes às dimensões conforme o Doc. 04 | P1 | PARCIALMENTE IMPLEMENTADO | 176 relações, mas seguem o Doc. 03; 22 virtudes divergem do Doc. 04 §5 (ver complemento do Doc. 04, seção 4.2) | `unit/catalog.test.ts` | TESTE UNITÁRIO |
| RF-045 | Primária, secundária, contextual | P1 | PARCIALMENTE IMPLEMENTADO | D1 e D2 com dados; D3 sem nenhum registro | `unit/identidade.test.ts` | TESTE UNITÁRIO |
| RF-046 | Dimensões da virtude selecionada | P1 | IMPLEMENTADO | Etapa Identificar; página da virtude | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-047 | Relação como referência, não classificação da pessoa | P0 | IMPLEMENTADO | Textos de aviso nas telas | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |

### 6.6. MOD-06 — Exercícios

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-048 | Exercícios associados às virtudes | P0 | IMPLEMENTADO | 56 exercícios | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-049 | Descrição do exercício | P0 | IMPLEMENTADO | `description` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-050 | Objetivo do exercício | P0 | PARCIALMENTE IMPLEMENTADO | Não há campo "objetivo" no modelo `Exercise`; a descrição faz esse papel | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-051 | Orientações para a prática | P0 | IMPLEMENTADO | `steps` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-052 | Associar exercícios à jornada | P0 | IMPLEMENTADO | `startExercise` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-053 | Registrar realização | P0 | IMPLEMENTADO | Registro no diário com `exerciseId` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-054 | Data da realização | P0 | IMPLEMENTADO | Data do registro do diário | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-055 | Observações sobre a experiência | P1 | IMPLEMENTADO | Campos do diário | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-056 | Consultar exercícios realizados | P1 | IMPLEMENTADO | Estados experimentado e repetido | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-057 | Repetir exercício | P1 | IMPLEMENTADO | `times` | `unit/domain.test.ts` (RN-016) | TESTE UNITÁRIO |
| RF-058 | Recomendar por virtude e contexto | P2 | PARCIALMENTE IMPLEMENTADO | `exerciseOptions` usa a virtude principal, as relacionadas e as dimensões D1; não usa o contexto informado pela pessoa | `e2e/mvp.spec.ts` ("Recomendado"); `unit/domain.test.ts` ("recomenda exercícios da virtude") | TESTE UNITÁRIO + TESTE E2E |

### 6.7. MOD-07 — Diário

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-059 | Criar registros | P0 | IMPLEMENTADO | `saveEntry` | `e2e/mvp.spec.ts`; `unit/domain.test.ts` (CT-008) | TESTE UNITÁRIO + TESTE E2E |
| RF-060 | Data e horário | P0 | PARCIALMENTE IMPLEMENTADO | Data informada pela pessoa; horário só no carimbo interno `createdAt`, não exibido | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-061 | Associar à jornada | P0 | IMPLEMENTADO | `journeyId` | `unit/domain.test.ts` (CT-008) | TESTE UNITÁRIO |
| RF-062 | Classificar o registro | P0 | IMPLEMENTADO | 4 tipos (inclui "Descoberta", além dos 3 do requisito) | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-063 | Descrever a situação | P0 | IMPLEMENTADO | Área de texto obrigatória | `e2e/incremento-ux.spec.ts`; `e2e/mvp.spec.ts` | TESTE E2E |
| RF-064 | Sentimentos e percepções | P1 | IMPLEMENTADO | `feelings` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-065 | Ações realizadas | P0 | IMPLEMENTADO | `actions` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-066 | Aprendizados e observações | P1 | IMPLEMENTADO | `learning`, `note` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-067 | Editar registros | P0 | IMPLEMENTADO | Edição em `DiaryPage.tsx` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-068 | Excluir com confirmação | P1 | IMPLEMENTADO | `ConfirmButton`, `deleteEntry` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-069 | Histórico de registros | P0 | IMPLEMENTADO | Lista do diário | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-070 | Filtrar por período | P1 | IMPLEMENTADO | Filtros "de" e "até" | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-071 | Filtrar por tipo | P1 | IMPLEMENTADO | Filtro de tipo | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-072 | Registros de uma virtude | P1 | IMPLEMENTADO | Filtro de virtude | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-073 | Registros de jornadas anteriores | P1 | IMPLEMENTADO | Detalhe da jornada no histórico | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-074 | Sem mínimo de registros | P0 | IMPLEMENTADO | RN-020 | `unit/domain.test.ts` (CT-010) | TESTE UNITÁRIO |

### 6.8. MOD-08 — Revisões

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-075 | Revisões periódicas | P0 | IMPLEMENTADO | `saveReview` (`periodica`) | `e2e/mvp.spec.ts`; `unit/domain.test.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-076 | Perguntas orientadoras | P0 | IMPLEMENTADO | `REVIEW_QUESTIONS` (5) | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-077 | Situações de prática | P0 | IMPLEMENTADO | `rev-praticas` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-078 | Situações de dificuldade | P0 | IMPLEMENTADO | `rev-dificuldades` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-079 | Padrões percebidos | P1 | IMPLEMENTADO | `rev-padroes` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-080 | Aprendizados do período | P0 | IMPLEMENTADO | `rev-aprendizados` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-081 | Atenção futura | P1 | IMPLEMENTADO | `rev-atencao` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-082 | Revisões anteriores | P1 | IMPLEMENTADO | Lista de revisões na jornada e no histórico | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-083 | Revisão final | P0 | IMPLEMENTADO | `final`, exigida para concluir | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-084 | Síntese de registros e revisões | P1 | IMPLEMENTADO | `journeyStats`; síntese no histórico | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-085 | Ausência de registros não é ausência de prática | P0 | IMPLEMENTADO | RN-015 e RN-020 | `unit/domain.test.ts` (CT-010) | TESTE UNITÁRIO |
| RF-086 | Sem notas morais | P0 | IMPLEMENTADO | Nenhum cálculo de nota; leitura neutra das revisões legadas | `unit/domain.test.ts` ("tom neutro") | TESTE UNITÁRIO |

### 6.9. MOD-09 — Conselho de Sabedoria

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-087 | Acesso ao Conselho | P2 | IMPLEMENTADO | `/conselho` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-088 | Apresentar situação | P2 | IMPLEMENTADO | Campo "Qual situação…" | `e2e/mvp.spec.ts`; `e2e/conselho-seguranca.spec.ts` | TESTE E2E |
| RF-089 | Contextualizar | P2 | IMPLEMENTADO | Dúvida, virtude, dimensão e vínculo com jornada | `e2e/conselho-seguranca.spec.ts` (regressão) | TESTE E2E |
| RF-090 | Virtudes relacionadas à situação | P2 | IMPLEMENTADO | `suggest` (por regras, sem IA) | `unit/council-legacy.test.ts` | TESTE UNITÁRIO |
| RF-091 | Dimensões relacionadas | P2 | IMPLEMENTADO | `suggest` | `unit/council-legacy.test.ts` | TESTE UNITÁRIO |
| RF-092 | Selecionar perspectivas | P2 | IMPLEMENTADO | `selectThinkers`, determinístico | `unit/council-legacy.test.ts`; `unit/conselho-seguranca.test.ts` (repetibilidade) | TESTE UNITÁRIO |
| RF-093 | Contribuições fundamentadas em obras | P2 | PARCIALMENTE IMPLEMENTADO | 9 dos 27 habilitados sem obra; perspectiva específica só nos 6 casos de referência; fora deles, o campo de contribuição do pensador | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-094 | Perspectivas complementares ou divergentes | P2 | PARCIALMENTE IMPLEMENTADO | `synthesize`: convergências e divergências por regras (mesma virtude, tradições distintas, limites), sem confronto de conteúdo | `e2e/incremento-ux.spec.ts` (leitura de conjunto) | TESTE E2E |
| RF-095 | Perguntas para reflexão | P2 | IMPLEMENTADO | Pergunta de cada pensador e pergunta central do caso | `unit/council-legacy.test.ts` | TESTE UNITÁRIO |
| RF-096 | Síntese das perspectivas | P2 | PARCIALMENTE IMPLEMENTADO | Texto de síntese só para os 6 casos de referência | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-097 | Reflexão pessoal após a consulta | P2 | IMPLEMENTADO | "Minha reflexão", com salvamento automático | `e2e/mvp.spec.ts`; `e2e/conselho-seguranca.spec.ts` | TESTE E2E |
| RF-098 | Distinguir interpretação contemporânea de conteúdo histórico | P2 | PARCIALMENTE IMPLEMENTADO | Aviso de transparência e origem da pergunta (documento ou aplicação); sem distinção por afirmação | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-099 | Sem falas fictícias | P0 | IMPLEMENTADO | Contribuições curadas; aviso "Não são falas literais" | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-100 | Referências das fontes | P2 | PARCIALMENTE IMPLEMENTADO | Só o título da obra, sem metadados; 9 integrantes sem obra | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-101 | Informar falta de fundamentação | P2 | IMPLEMENTADO | Aviso de limitação com menos de 2 pensadores; "Sem obra de referência registrada" | SEM TESTE IDENTIFICADO (CT-014) | INSPEÇÃO ESTÁTICA |
| RF-102 | Conselho não decide pelo usuário | P0 | IMPLEMENTADO | Texto de transparência; nenhuma ação automática | `e2e/mvp.spec.ts` | TESTE E2E |

### 6.10. MOD-10 — Histórico

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-103 | Jornadas anteriores | P1 | IMPLEMENTADO | `/historico` | `e2e/mvp.spec.ts`; `e2e/incremento-ux.spec.ts` | TESTE E2E |
| RF-104 | Concluídas | P1 | IMPLEMENTADO | idem | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-105 | Pausadas | P1 | IMPLEMENTADO | O histórico lista todas as jornadas não arquivadas, inclusive pausadas | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-106 | Arquivadas | P1 | IMPLEMENTADO | idem RF-020 | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-107 | Registros de cada jornada | P1 | IMPLEMENTADO | `/historico/:id` | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-108 | Virtudes trabalhadas | P1 | IMPLEMENTADO | `virtueTrail`; percurso por dimensão | `e2e/incremento-ux.spec.ts`; `unit/historico.test.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-109 | Não misturar registros de jornadas | P0 | IMPLEMENTADO | `entriesOf` por `journeyId` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |

### 6.11. MOD-11 — Relatórios

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-110 | Síntese da jornada | P1 | IMPLEMENTADO | Detalhe no histórico; `buildJourneyReport` | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-111 | Exercícios realizados | P1 | IMPLEMENTADO | idem | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-112 | Revisões registradas | P1 | IMPLEMENTADO | idem | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-113 | Aprendizados | P1 | IMPLEMENTADO | idem | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-114 | Evolução cronológica | P1 | IMPLEMENTADO | Linha do tempo | `e2e/incremento-ux.spec.ts` | TESTE E2E |
| RF-115 | Exportar dados da jornada | P1 | IMPLEMENTADO | JSON por jornada | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-116 | Exportar diário | P1 | IMPLEMENTADO | Markdown | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-117 | Síntese em formato legível | P2 | IMPLEMENTADO | Markdown (`report.ts`) | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-118 | Sem indicador de valor moral | P0 | IMPLEMENTADO | Só contagens de atividade | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |

### 6.12. MOD-12 — Configurações e dados

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-119 | Preferências | P1 | IMPLEMENTADO | Tema no cabeçalho; menu de capítulos da Gita lembrado | `e2e/acessibilidade.spec.ts`; `e2e/gita.spec.ts` | TESTE E2E |
| RF-120 | Preferências visuais | P1 | IMPLEMENTADO | Temas sistema, claro, escuro, roxo e dourado | `e2e/acessibilidade.spec.ts` | TESTE E2E |
| RF-121 | Tema claro e escuro | P1 | IMPLEMENTADO | idem | `e2e/acessibilidade.spec.ts` | TESTE E2E |
| RF-122 | Exportar dados pessoais | P1 | IMPLEMENTADO | `buildExport`; inclui reflexões da Gita com conta | `e2e/exportacao.spec.ts`; `unit/exportacao.test.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-123 | Importar dados | P2 | IMPLEMENTADO | `parseImport` (formato atual e da versão anterior) | `e2e/exportacao.spec.ts`; `unit/council-legacy.test.ts` | TESTE UNITÁRIO + TESTE E2E |
| RF-124 | Exclusão de dados pessoais | P1 | IMPLEMENTADO | Apagar do aparelho; apagar da nuvem (`jv_delete_my_data` e reflexões) | `e2e/gita.spec.ts` (exclusão na nuvem) | TESTE E2E |
| RF-125 | Informar onde ficam os dados | P0 | IMPLEMENTADO | Textos em Configurações e no Conselho | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RF-126 | Integridade em importação e exportação | P1 | IMPLEMENTADO | Saneamento campo a campo; ida e volta | `unit/council-legacy.test.ts`; `e2e/exportacao.spec.ts` | TESTE UNITÁRIO + TESTE E2E |

### 6.13. Transversais

| ID | Requisito (resumo) | P | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| RF-127 | Navegar sem perder o que foi salvo | P0 | IMPLEMENTADO | Persistência a cada alteração; salvamento automático | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-128 | Informar falha de gravação | P0 | IMPLEMENTADO | `useRun` (mensagem de erro) | `unit/council-legacy.test.ts` (CT-013) | TESTE UNITÁRIO |
| RF-129 | Informar sucesso | P0 | IMPLEMENTADO | Mensagens de retorno | `e2e/mvp.spec.ts` | TESTE E2E |
| RF-130 | Validar campos obrigatórios | P0 | IMPLEMENTADO | `DomainError` nos casos de uso | `unit/domain.test.ts` (RF-130) | TESTE UNITÁRIO |
| RF-131 | Mensagens de validação compreensíveis | P0 | IMPLEMENTADO | idem | `unit/domain.test.ts` (RF-131) | TESTE UNITÁRIO |
| RF-132 | Consistência entre jornadas e registros | P0 | IMPLEMENTADO | Saneamento de referências; chaves estrangeiras na nuvem | `unit/domain.test.ts` (saneamento) | TESTE UNITÁRIO |
| RF-133 | Celular e computador | P0 | PARCIALMENTE IMPLEMENTADO | Layout responsivo; áreas de toque de 44 px | `e2e/desempenho.spec.ts`; `e2e/gita.spec.ts` (celular). Validação em produção só em desktop (EV-43) | TESTE E2E |
| RF-134 | Navegação por teclado | P1 | A VALIDAR | Elementos nativos; nenhum teste de teclado nem auditoria com leitor de tela | SEM TESTE IDENTIFICADO | SEM EVIDÊNCIA IDENTIFICADA |
| RF-135 | Evolução modular | P1 | IMPLEMENTADO | Camadas e rotas carregadas sob demanda | Inspeção do código | INSPEÇÃO ESTÁTICA |

## 7. Requisitos não funcionais

| ID | Resumo | Status de implementação | Status de evidência | Evidência ou observação |
|---|---|---|---|---|
| RNF-001 a RNF-008 | Usabilidade: organização, navegação, feedback, rótulos, consistência, estado da jornada | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E | Sem medição com usuários. Sistema visual com tokens (`unit/design-system.test.ts`); mensagens de retorno; percurso das etapas (`e2e/incremento-ux.spec.ts`) |
| RNF-009, RNF-010 | Funcionar em vários dispositivos e resoluções | PARCIALMENTE IMPLEMENTADO | TESTE E2E | E2E com viewport de celular (412 × 823 em `e2e/desempenho.spec.ts`; tela de celular em `e2e/gita.spec.ts`); tablet sem verificação específica; validação em produção só em desktop |
| RNF-011, RNF-012 | Identificação visual e rótulos acessíveis | IMPLEMENTADO | TESTE E2E | `getByLabel` usado nos E2E; auditoria axe local (EV-13), não versionada |
| RNF-013 | Navegação por teclado | A VALIDAR | SEM EVIDÊNCIA IDENTIFICADA | Igual a RF-134 |
| RNF-014 | Contraste | IMPLEMENTADO | TESTE E2E | `e2e/acessibilidade.spec.ts` (contraste de 4,5:1 nos temas) |
| RNF-015 | Estrutura semântica | IMPLEMENTADO | TESTE E2E | `e2e/acessibilidade.spec.ts` (hierarquia de títulos) |
| RNF-016 | Mensagens de erro perceptíveis | IMPLEMENTADO | TESTE E2E | Mensagens de erro com `role="alert"`; alerta de bloqueio do Conselho |
| RNF-017 a RNF-021 | Desempenho e respostas assíncronas | IMPLEMENTADO | TESTE E2E | Rotas sob demanda; `e2e/desempenho.spec.ts` (CLS, fontes); falhas de rede tratadas na Gita (`e2e/gita.spec.ts`) |
| RNF-022, RNF-023 | Dados privados, sem exposição indevida | IMPLEMENTADO | INSPEÇÃO ESTÁTICA | Dados no aparelho; RLS por dono na nuvem (migração `20261113180000`) |
| RNF-024 | Sem segredos no frontend | IMPLEMENTADO | INSPEÇÃO ESTÁTICA | Só a chave *publishable* em `src/config.ts` |
| RNF-025 | Autenticação e autorização nas integrações | IMPLEMENTADO | INSPEÇÃO ESTÁTICA | Supabase Auth; RLS; privilégios mínimos (`20261118235900`) |
| RNF-026 | Validar dados externos | IMPLEMENTADO | TESTE UNITÁRIO | `sanitize.ts`; parsers da Gita (`unit/gita.test.ts`) |
| RNF-027 | Confirmação em operações destrutivas | IMPLEMENTADO | INSPEÇÃO ESTÁTICA | `ConfirmButton` em exclusões |
| RNF-028 | Exportação | IMPLEMENTADO | TESTE UNITÁRIO + TESTE E2E | RF-122 |
| RNF-029 | Exclusão conforme política de retenção | PARCIALMENTE IMPLEMENTADO | TESTE E2E | Exclusão existe; **política de retenção não documentada** |
| RNF-030 | Legislação de proteção de dados | A VALIDAR | SEM EVIDÊNCIA IDENTIFICADA | Requer avaliação jurídica (LGPD); não há documento de privacidade no repositório |
| RNF-031 a RNF-036 | Confiabilidade e integridade | IMPLEMENTADO | TESTE UNITÁRIO | Gravação atômica do retrato; controle de revisão no sync; CT-013 |
| RNF-037 a RNF-042 | Manutenibilidade | IMPLEMENTADO | INSPEÇÃO ESTÁTICA | Camadas `domain`, `application`, `infrastructure`; contrato `UserDataRepository` |
| RNF-043 | Testes de regras críticas | IMPLEMENTADO | TESTE UNITÁRIO | 231 unitários |
| RNF-044 | Documentação técnica atualizada | PARCIALMENTE IMPLEMENTADO | INSPEÇÃO ESTÁTICA | README atualizado; Doc. 08 descreve arquitetura planejada que diverge do código (ver complemento do Doc. 08) |
| RNF-045 | Navegadores-alvo definidos | A VALIDAR | SEM EVIDÊNCIA IDENTIFICADA | **Navegadores-alvo não definidos**; testes só em Chromium |
| RNF-046 | Evolução para backend | IMPLEMENTADO | INSPEÇÃO ESTÁTICA | Supabase opcional já integrado |
| RNF-047 | Dados independentes da interface | IMPLEMENTADO | INSPEÇÃO ESTÁTICA | Tipos de domínio e JSON versionado |
| RNF-048 | Adaptação para PWA | NÃO IMPLEMENTADO | INSPEÇÃO ESTÁTICA | P2, condicionada à adoção |
| RNF-049 | Testes unitários de regras críticas | IMPLEMENTADO | TESTE UNITÁRIO | RNF-043 |
| RNF-050 | Testes de integração dos fluxos principais | PARCIALMENTE IMPLEMENTADO | TESTE E2E | Não há camada separada de integração; os fluxos são cobertos por E2E |
| RNF-051 | E2E dos fluxos críticos | IMPLEMENTADO | TESTE E2E | 80 testes E2E |
| RNF-052 | Sem regressões | IMPLEMENTADO | INSPEÇÃO ESTÁTICA | Configuração do CI. CI em todo push |
| RNF-053 | Verificação automatizada antes da publicação | PARCIALMENTE IMPLEMENTADO | INSPEÇÃO ESTÁTICA | `.github/workflows/ci.yml` roda em todo push; não há evidência no repositório de que a publicação na Vercel espere o CI (ver D-08-06) |

## 8. Regras de negócio

| ID | Regra (resumo) | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|
| RN-001 | Identificador único | IMPLEMENTADO | `newId` (UUID) | `unit/domain.test.ts` | TESTE UNITÁRIO |
| RN-002 | Intenção registrada | IMPLEMENTADO | `createJourney` | `unit/domain.test.ts` (RN-002) | TESTE UNITÁRIO |
| RN-003 | Virtude principal | IMPLEMENTADO | | `unit/domain.test.ts` (RN-003) | TESTE UNITÁRIO |
| RN-004 | Relacionadas sem substituir a principal | IMPLEMENTADO | | `unit/domain.test.ts` (RN-004) | TESTE UNITÁRIO |
| RN-005 | Começa em rascunho | IMPLEMENTADO | `createJourney` cria em DRAFT; a interface pode iniciar em seguida | `unit/domain.test.ts` (CT-001) | TESTE UNITÁRIO |
| RN-006 | Rascunho: iniciar, editar, descartar | IMPLEMENTADO | `discardDraft` | `unit/domain.test.ts` (RN-006) | TESTE UNITÁRIO |
| RN-007 | Ativa: pausar ou concluir | IMPLEMENTADO | | `unit/domain.test.ts` | TESTE UNITÁRIO |
| RN-008 | Pausada: retomar ou concluir | IMPLEMENTADO | | `unit/domain.test.ts` (RN-008) | TESTE UNITÁRIO |
| RN-009 | Concluída não volta a ativa | IMPLEMENTADO | | `unit/domain.test.ts` (RN-009) | TESTE UNITÁRIO |
| RN-010 | Concluída preserva registros | IMPLEMENTADO | | `unit/domain.test.ts` (RN-010) | TESTE UNITÁRIO |
| RN-011 | Arquivamento por atributo próprio | IMPLEMENTADO | `archivedAt` | `unit/domain.test.ts` (RN-011) | TESTE UNITÁRIO |
| RN-012 | Arquivar não exclui registros | IMPLEMENTADO | | `e2e/mvp.spec.ts` | TESTE E2E |
| RN-013 | Investigação ligada à virtude principal | IMPLEMENTADO | Perguntas sobre a virtude da jornada | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RN-014 | Situações positivas e dificuldades | IMPLEMENTADO | Tipos do diário; bloco "Reconhecer" | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RN-015 | Não presumir falta de prática | IMPLEMENTADO | | `unit/domain.test.ts` (CT-010) | TESTE UNITÁRIO |
| RN-016 | Exercícios repetíveis | IMPLEMENTADO | | `unit/domain.test.ts` (RN-016) | TESTE UNITÁRIO |
| RN-017 | Exercício é experiência, não prova de domínio | IMPLEMENTADO | | `unit/domain.test.ts` (RN-017) | TESTE UNITÁRIO |
| RN-018 | Registrar sem exercício recomendado | IMPLEMENTADO | | `unit/domain.test.ts` (CT-009) | TESTE UNITÁRIO |
| RN-019 | Diário voluntário | IMPLEMENTADO | | `unit/domain.test.ts` (RN-019) | TESTE UNITÁRIO |
| RN-020 | Sem registros não impede continuar | IMPLEMENTADO | | `unit/domain.test.ts` (CT-010) | TESTE UNITÁRIO |
| RN-021 | Revisões consideram registros e percepções | PARCIALMENTE IMPLEMENTADO | A revisão mostra estatísticas e perguntas; não traz os registros do período para a tela | SEM TESTE IDENTIFICADO | INSPEÇÃO ESTÁTICA |
| RN-022 | Revisões sem nota moral | IMPLEMENTADO | | `unit/domain.test.ts` ("tom neutro") | TESTE UNITÁRIO |
| RN-023 | Conselho com perspectivas fundamentadas e fontes | PARCIALMENTE IMPLEMENTADO | Igual a RF-093, RF-098 e RF-100 | `e2e/mvp.spec.ts` | TESTE E2E |
| RN-024 | Conselho apoia sem substituir a decisão | IMPLEMENTADO | | `e2e/mvp.spec.ts` | TESTE E2E |

## 9. Regras de segurança (novas, propostas por esta reconstrução)

Os identificadores abaixo **não existem no Documento 07 V2.0**. Foram criados para rastrear o que está implementado e o que falta na segurança do Conselho e dos dados. Os identificadores e o texto precisam ser validados.

| ID | Regra | Origem | Status de implementação | Implementação (arquivo e símbolo) | Teste | Status de evidência |
|---|---|---|---|---|---|---|
| SEG-001 | Com sinal de risco na situação ou na dúvida, o Conselho não cria sessão comum, não seleciona pensadores, não grava nem navega; mostra orientação de segurança | Doc. 13 v2 §13; Doc. 04 Regra 8 | IMPLEMENTADO | `crisis.ts`, `convene()`; commit `5368603` | `unit/conselho-seguranca.test.ts`; `e2e/conselho-seguranca.spec.ts`; produção em Chrome desktop (EV-43) | TESTE UNITÁRIO + TESTE E2E + VALIDAÇÃO MANUAL EM PRODUÇÃO |
| SEG-002 | A proteção vale também fora da interface: o caso de uso recusa criar sessão sinalizada | idem | IMPLEMENTADO | `saveSession` | `unit/conselho-seguranca.test.ts` | TESTE UNITÁRIO |
| SEG-003 | Com sinal de risco, a interface não afirma que o texto será guardado | Validação em produção, 2026-11-23 | IMPLEMENTADO | Commit `b23ddac` | `e2e/conselho-seguranca.spec.ts` | TESTE E2E |
| SEG-004 | Contatos de ajuda (CVV 188, SAMU 192, Polícia 190, Central da Mulher 180) sempre visíveis no bloqueio | Doc. 04 Regra 8 | IMPLEMENTADO | `CrisisNotice` | `e2e/conselho-seguranca.spec.ts` | TESTE E2E |
| SEG-005 | A detecção por termos não é apresentada como avaliação clínica | Doc. 13 v2 §13 | IMPLEMENTADO | Texto do alerta; comentário em `crisis.ts` | Inspeção | INSPEÇÃO ESTÁTICA |
| SEG-006 | Reflexão ou ação com sinal de risco em sessão já existente recebe tratamento de segurança | Revisão 01.1 | NÃO IMPLEMENTADO | Hoje é salva automaticamente, sem aviso | — | INSPEÇÃO ESTÁTICA |
| SEG-007 | Sessão antiga com sinal de risco não exibe a deliberação comum, sem apagar dados | Revisão 01.2 | NÃO IMPLEMENTADO | A tela de sessão mostra o aviso e a deliberação inteira | — | INSPEÇÃO ESTÁTICA |
| SEG-008 | A lista de termos de risco é revisada por especialista, com casos de falso positivo e negativo | Relatório do Prompt 01 | PROPOSTO | Lista atual com 18 termos | — | SEM EVIDÊNCIA IDENTIFICADA |
| SEG-009 | Dados do usuário acessíveis só pelo dono na nuvem | Doc. 08 §15.2 | IMPLEMENTADO | RLS e privilégios mínimos (migrações) | SEM TESTE AUTOMATIZADO NO REPOSITÓRIO | INSPEÇÃO ESTÁTICA |
| SEG-010 | Nenhum segredo de serviço no frontend | RNF-024 | IMPLEMENTADO | `src/config.ts` | Inspeção | INSPEÇÃO ESTÁTICA |
| SEG-011 | Política de conteúdo restritiva e cabeçalhos de segurança | Relatório de UX (EV-13) | IMPLEMENTADO | `vercel.json` | `e2e/seguranca.spec.ts` | TESTE E2E |
| SEG-012 | Nenhum dado é enviado a provedor de IA | Doc. 08 §15.3 | IMPLEMENTADO | Não há código de IA; nenhuma requisição externa na validação em produção | EV-43 (rede observada) | VALIDAÇÃO MANUAL EM PRODUÇÃO |
| SEG-013 | Dados importados são validados e saneados | RNF-026 | IMPLEMENTADO | `sanitize.ts`, `parseImport` | `unit/council-legacy.test.ts`; `unit/domain.test.ts` | TESTE UNITÁRIO |

## 10. Estados e fluxos

- **Jornada:** DRAFT → ACTIVE → PAUSED ⇄ ACTIVE → COMPLETED, com `archivedAt` à parte. Igual ao Doc. 07 §9 e testado (CT-001 a CT-007).
- **Etapas:** cinco estados (Doc. 06 §8.3), em qualquer ordem.
- **Sessão do Conselho:** criação (protegida pelo gate de segurança, SEG-001), atualização (reflexão, ação, hipóteses), exclusão.
- **Sincronização:** local, sincronizando, sincronizado, pendente, conflito ou erro (`SyncStatus`). Em conflito, a pessoa escolhe qual lado vale.

## 11. Critérios de aceitação

- Os critérios gerais do Doc. 07 §14 continuam valendo.
- O critério de conclusão do MVP (§14.1) está atendido e verificado por `e2e/mvp.spec.ts`.
- Situação dos casos de teste CT:

| CT | Status de implementação | Status de evidência | Teste |
|---|---|---|---|
| CT-001 a CT-010 | IMPLEMENTADO | TESTE UNITÁRIO | `tests/unit/domain.test.ts` |
| CT-011 | IMPLEMENTADO | TESTE E2E | `tests/e2e/mvp.spec.ts` |
| CT-012 | IMPLEMENTADO | TESTE E2E | `tests/e2e/mvp.spec.ts`; `tests/e2e/exportacao.spec.ts` |
| CT-013 | IMPLEMENTADO | TESTE UNITÁRIO | `tests/unit/council-legacy.test.ts` |
| CT-014 | IMPLEMENTADO | INSPEÇÃO ESTÁTICA | Comportamento existe (RF-101), sem teste automatizado |
| CT-015 | IMPLEMENTADO | TESTE E2E | `tests/e2e/mvp.spec.ts` |

| História | Situação |
|---|---|
| US-001 a US-005, US-007 a US-010 | Atendidas pelo fluxo do MVP (ver `e2e/mvp.spec.ts`) |
| US-006 (Conselho) | Atendida sem IA, com as limitações de RF-093 a RF-100 |

## 12. Restrições

- Sem IA no produto atual (Doc. 13 v2 adia para a Fase 5).
- Persistência local em `localStorage`, com conta opcional (ver complemento do Doc. 08).
- Conteúdo do catálogo inteiro em status `proposta`.

## 13. Funcionalidades futuras (não implementadas)

| Item | Fonte | Status |
|---|---|---|
| Conselho com 34 integrantes e metodologia de nove etapas | Doc. 12, Doc. 13 v2 | PROPOSTO |
| IA no Conselho (recuperação semântica, perspectivas geradas) | Doc. 13 v2, Fase 5 | PROPOSTO |
| PWA | RNF-048 | PROPOSTO |
| Recomendação de exercícios pelo contexto | RF-058 | PROPOSTO |
| Histórico de versões das respostas da investigação | RF-041 | PROPOSTO |
| Perfil de administração de conteúdo | Doc. 07 §4 | PROPOSTO |

## 14. Pendências de decisão

| Id | Pergunta |
|---|---|
| D-07-01 | O módulo da Gita, implementado e em produção, deve entrar no Documento 07 como módulo oficial (por exemplo, MOD-13)? |
| D-07-02 | Os identificadores SEG-001 a SEG-013 são aceitos? Entram no Documento 07 ou em documento próprio de segurança? |
| D-07-03 | Quais são os navegadores-alvo (RNF-045)? |
| D-07-04 | Qual é a política de retenção (RNF-029)? Quem faz a avaliação de LGPD (RNF-030)? |
