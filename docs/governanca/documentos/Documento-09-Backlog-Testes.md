# Documento 09 — Backlog Técnico e Estratégia de Testes

| Campo | Valor |
|---|---|
| Número e título | Documento 09 — Plano de Implementação, Estratégia de Testes e Gestão da Evolução (título como anunciado no Doc. 08 §22). Nesta reconstrução: Backlog Técnico e Estratégia de Testes. |
| Versão | 0.1 |
| Data de reconstrução | 2026-11-23 |
| Status | RECONSTRUÍDO PARA VALIDAÇÃO |
| Motivo da reconstrução | O Documento 09 é anunciado pelos Documentos 07 e 08, mas não foi localizado nas fontes examinadas. Esta versão **não é o texto original**. |
| Fontes utilizadas | EV-01, EV-04, EV-06, EV-07, EV-09, EV-13, EV-20 a EV-43, EV-50 |
| Limitações conhecidas | Os identificadores **E01–E10, E11–E16, CS-00–CS-16 e ADR-CS-01–ADR-CS-08**, citados no pedido desta etapa como vindos de uma "auditoria anterior", **não foram localizados nas fontes examinadas** e não são usados aqui. Se a auditoria for localizada, o backlog deve ser reconciliado com ela. As prioridades da seção 8 são sugestões para validação, não decisões. |

## Histórico de revisão

| Versão | Data | Descrição |
|---|---|---|
| 0.1 | 2026-11-23 | Reconstrução: backlog original preservado com sua proveniência, situação de cada item e estratégia de testes. |

---

## 1. Fontes do backlog e regra de proveniência

| Origem | Identificadores usados | Natureza |
|---|---|---|
| Documento 07 V2.0 §12 e §13 | P0–P3; Fases 1–4 do produto | **Backlog original** do produto |
| Documento 08 v2.0 §18 | Etapas técnicas 1–5 | **Backlog original** técnico |
| Documento 13 v2 §17 e §18 | Fases 1–5 do Conselho; testes mínimos 1–12 | **Backlog original** do Conselho, posterior ao MVP |
| Documento 07 V2.0 §15 | CT-001 a CT-015 | Casos de teste originais |
| Relatório final de UX §10 (EV-13, local) | Recomendações 1–6 | **Proposta de evolução** (não é backlog original) |
| Relatórios das Execuções 01, 01.1 e 01.2 (gate de segurança) | SEG-006 a SEG-008 (complemento do Doc. 07) | **Proposta de evolução** |
| Esta reconstrução | D-xx (decisões), R-xx (riscos), DT-xx (dívida), TS-xx (lacunas de teste) | Identificadores novos, **a validar** |

As propostas de evolução **não** são tratadas como backlog original.

## 2. Backlog original e situação

### 2.1. Fases do produto (Documento 07 §13)

| Fase | Entregas previstas | Situação | Evidência |
|---|---|---|---|
| 1 — Estrutura e núcleo | Estrutura, navegação, catálogos de virtudes e dimensões, criação e estados da jornada, persistência inicial, testes das regras | Implementado e validado | `e2e/mvp.spec.ts`; `unit/domain.test.ts`; `unit/catalog.test.ts` |
| 2 — Experiência de desenvolvimento | Investigação, exercícios, diário, revisões, histórico, sínteses, exportação | Implementado e validado | `e2e/mvp.spec.ts`; `e2e/exportacao.spec.ts` |
| 3 — Conselho de Sabedoria | Catálogo de pensadores e obras, recuperação de fontes, orquestração, perspectivas complementares, registro das sessões, referências, proteção de credenciais | **Parcial**: tudo existe sem IA; fontes incompletas e perspectivas por regras | Complemento do Doc. 07, seção 6.9 |
| 4 — Expansão e integração | Autenticação, backend, sincronização, persistência remota, PWA, personalização, relatórios avançados | **Parcial**: autenticação, backend, sincronização e persistência remota implementados; PWA e personalização não | Complemento do Doc. 08, seção 7 |

### 2.2. Prioridades (Documento 07 §12)

| Escopo | Situação |
|---|---|
| P0 — MVP funcional | Implementado e validado (critério do Doc. 07 §14.1 em `e2e/mvp.spec.ts`) |
| P1 — Consolidação | Implementado; algumas partes sem teste (histórico de revisões, exportação do diário, filtros) |
| P2 — Inteligência e aprofundamento | Conselho sem IA implementado; importação implementada; "recomendações contextuais" e "sínteses assistidas" não implementadas |
| P3 — Evolução futura | Sincronização, autenticação e backend implementados **antes** do previsto. Multiusuário, personalização avançada e integrações externas não implementados |

### 2.3. Roadmap técnico (Documento 08 §18)

| Etapa | Situação |
|---|---|
| 1 — Estruturação | Concluída |
| 2 — Domínio e persistência | Concluída, com localStorage em vez de IndexedDB (D-08-01) |
| 3 — Funcionalidades da jornada | Concluída |
| 4 — Conselho de Sabedoria | Parcial (sem IA; com gate de segurança) |
| 5 — Backend e inteligência adaptativa | Backend, autenticação, sincronização e políticas de acesso concluídos; IA e recomendações adaptativas não iniciadas |

### 2.4. Fases do Conselho (Documento 13 v2 §17)

| Fase | Entregas | Situação |
|---|---|---|
| 1 — Catálogo e estrutura | 34 pensadores, normalização de ids, obras, conceitos e virtudes, fontes e limites, integridade referencial | **Não iniciada.** O sistema tem 27 habilitados de composição diferente (complemento do Doc. 04, seção 5); não há conceitos nem fontes com metadados |
| 2 — Motor determinístico | Análise estruturada, mapeamento de virtudes, pontuação, justificativas, teste de repetibilidade | **Parcial.** Motor determinístico existe e é testado, com os pesos do Doc. 04 e sem análise estruturada |
| 3 — Perspectivas e comparação | Conteúdo curado, perspectivas com referências, divergências, síntese aberta | **Parcial.** Só nos 6 casos de referência |
| 4 — Integração com a jornada | Convocação a partir de reflexão ou situação, vínculo com dimensões e virtudes, exercícios e compromissos, retomada e exportação | **Parcial.** Convocação a partir da jornada, do diário e da virtude, vínculo com jornada e exportação já existem |
| 5 — Evolução assistida por IA | RAG, avaliação de fidelidade, medição de alucinações, fallback determinístico | **Não iniciada** |

### 2.5. Testes mínimos do Conselho (Documento 13 v2 §18), contra o motor atual

| # | Teste | Situação | Evidência |
|---|---|---|---|
| 1 | Seleção entre 2 e 5 pensadores | Atendido (com menos de 2, mostra aviso de limitação) | `unit/council-legacy.test.ts` |
| 2 | Mesma entrada, mesma seleção | Atendido | `unit/conselho-seguranca.test.ts` |
| 3 | Pensador sem fonte não sustenta afirmação autoral | **Não atendido**: 9 habilitados sem obra são convocados | `thinkers.json` |
| 4 | Toda perspectiva tem conceito, fonte, aplicação e limite | Parcial: limite sempre; fonte nem sempre; conceito não separado | `CouncilPages.tsx` |
| 5 | Divergências não desaparecem na síntese | Parcial: divergências por regra, não por conteúdo | `council.ts` (`synthesize`) |
| 6 | Nenhuma citação inventada | Atendido por construção (sem texto gerado); só o aviso é testado | `e2e/mvp.spec.ts` |
| 7 | Falha do provedor de IA não corrompe a sessão | Não aplicável (sem IA) | — |
| 8 | Sessões podem ser retomadas | Atendido | `e2e/conselho-seguranca.spec.ts` (regressão) |
| 9 | Situações de risco vão para o fluxo apropriado | Atendido na criação; não em sessões antigas nem na reflexão (SEG-006, SEG-007) | `unit/` e `e2e/conselho-seguranca.*` |
| 10 | Conteúdo e referências exportáveis | Parcial: a sessão é exportada com os ids das obras, não com os títulos | `legacy.ts` |
| 11 | O Conselho não altera metas ou decisões automaticamente | Atendido (sem ação automática) | Inspeção |
| 12 | A interface distingue conteúdo histórico de aplicação contemporânea | Parcial: só a origem da pergunta | `CouncilPages.tsx` |

## 3. Situação consolidada

### A. Implementado e validado

| Item | Evidência |
|---|---|
| Fluxo completo do MVP (12 passos do Doc. 07 §14.1) | `e2e/mvp.spec.ts` |
| Ciclo de vida da jornada (CT-001 a CT-007, RN-002 a RN-011) | `unit/domain.test.ts` |
| Diário, exercícios e revisões (CT-008 a CT-010, RN-016 a RN-019) | `unit/domain.test.ts`; `e2e/mvp.spec.ts` |
| Catálogo de 48 virtudes, 7 dimensões, 27 integrantes e 6 casos, com integridade referencial | `unit/catalog.test.ts` |
| Migração da versão anterior; exportação e importação | `unit/council-legacy.test.ts`; `e2e/exportacao.spec.ts`; `e2e/mvp.spec.ts` |
| Conta opcional e sincronização (lógica de decisão) | `unit/domain.test.ts` ("sincronização"); `e2e/seguranca.spec.ts` (fluxo com API simulada) |
| Leitura da Gita (18 capítulos, quiz, reflexões, ensinamentos) | `unit/gita*.test.ts`; `e2e/gita*.spec.ts` |
| CSP e cabeçalhos de segurança | `e2e/seguranca.spec.ts` |
| Gate de segurança do Conselho na criação de sessão | `unit/conselho-seguranca.test.ts`; `e2e/conselho-seguranca.spec.ts`; produção em Chrome desktop (EV-43) |
| Acessibilidade básica (títulos, contraste, movimento reduzido) e áreas de toque | `e2e/acessibilidade.spec.ts`; `e2e/desempenho.spec.ts` |
| CI com auditoria, typecheck, unitários, build e E2E | `.github/workflows/ci.yml`; run 45191742383 |

### B. Implementado, mas sem validação suficiente

| Item | Lacuna | Id |
|---|---|---|
| Edição e exclusão de registros do diário; filtros por período, tipo e virtude; exportação do diário (RF-067, RF-068, RF-070 a RF-072, RF-116) | Sem teste automatizado | TS-01 |
| Síntese e exportação legível da jornada (RF-110 a RF-113, RF-117) | Sem teste | TS-02 |
| Aviso de falta de fundamentação do Conselho (RF-101, CT-014) | Sem teste | TS-03 |
| Observações gerais da jornada, datas de início e conclusão (RF-017, RF-022) | Sem teste | TS-04 |
| RLS e privilégios no Supabase | Sem teste automatizado no repositório | TS-05 |
| Navegação por teclado (RF-134, RNF-013) | Sem teste nem auditoria com leitor de tela | TS-06 |
| Funcionamento em Safari, Firefox e celular real (RNF-045, RF-133) | E2E só em Chromium; produção só em desktop | TS-07 |
| Fluxo com conta (login real e sincronização real) | Coberto só com API simulada; exportação com conta não verificada em produção (EV-13) | TS-08 |
| Proteção de dados (RNF-029, RNF-030) | Sem política de retenção nem avaliação de LGPD | D-07-04 |

### C. Em desenvolvimento

Nenhum item de código em desenvolvimento: a árvore de trabalho estava limpa no início desta etapa (`b23ddac`). A única atividade em andamento é esta reconstrução documental, ainda sem commit.

### D. Proposto (não iniciado)

| Item | Origem |
|---|---|
| Fases 1, 3 e 5 do Conselho; complemento das Fases 2 e 4 | Doc. 13 v2 §17 |
| Integração do catálogo de 34 integrantes (Doc. 12) | Doc. 12; Doc. 13 v2 |
| Tratamento de segurança para reflexão e sessões antigas (SEG-006, SEG-007) | Execuções 01.1 e 01.2 |
| Revisão da lista de termos de risco com especialista (SEG-008) | Execução 01 |
| PWA (RNF-048); recomendações contextuais; personalização avançada; multiusuário | Doc. 07 §12 |
| Ilustrações das virtudes, retratos com licença, consultoria cultural por tradição, pesquisa com usuários | Relatório final de UX §10 (local) |
| Diagnóstico reflexivo inicial | Doc. 02 §6.2 |

### E. Bloqueado ou dependente de decisão

Itens que não devem avançar sem decisão do responsável pelo produto (ver `../decisoes/historico-decisoes.md`):

| Item bloqueado | Depende de |
|---|---|
| Integração dos 34 integrantes no Conselho | D-04-02 (composição e destino de "Tradições budistas"), D-04-03 (equivalência de virtudes), modelo de fontes obra–pensador |
| Revisão dos pesos do motor | D-08-04 |
| Novos campos na sessão do Conselho (versão, pontuação, fontes) | D-08-03 (schema 5) e D-08-05 |
| Qualquer uso de IA | ADR exigido pelo Doc. 13 v2 §16, consentimento, provedor e orçamento |
| Correção das relações virtude–dimensão | D-04-01 |
| Metodologia (durações, nome da etapa, Gita) | D-05-01 a D-05-04 |

### F. Dívida técnica

| Id | Item | Fonte |
|---|---|---|
| R-08-01 | O saneamento descarta campos desconhecidos | Complemento do Doc. 08 |
| R-08-02 | A síntese do Conselho é recalculada com o catálogo atual | idem |
| R-08-04 | Navegadores-alvo não definidos; E2E só em Chromium | idem |
| R-08-05 | Pacote principal acima de 500 kB | idem |
| R-08-06 | Dois projetos Vercel em produção | idem |
| DT-01 a DT-04 | Casos de uso num único arquivo; tela do Conselho extensa; orquestração do motor na interface; catálogo sem fluxo de validação | idem |
| DT-05 | Patches de `@supabase/supabase-js`, `react-router-dom` e `vitest` não aplicados de propósito (decisão registrada no Relatório de UX, adendo 4) | EV-13 |

## 4. Estratégia de testes

### 4.1. Unitários (Vitest)

| Situação atual | Lacunas | Proposta |
|---|---|---|
| 231 testes em 14 arquivos; regras de domínio, casos de uso, catálogo, migração, sync e gate | Relatório da jornada (`report.ts`); saneamento de sessões com campos novos (quando houver schema 5) | TS-02; testes de ida e volta para cada campo novo antes de mudar o schema |

### 4.2. Integração

| Situação atual | Lacunas | Proposta |
|---|---|---|
| Não há camada separada (RNF-050 parcial); fluxos cobertos por E2E | Integração real com o Supabase (RLS, funções RPC) | TS-05: rodar migrações num banco local ou temporário e testar o acesso de `anon` e `authenticated` antes de cada migração de produção |

### 4.3. E2E (Playwright)

| Situação atual | Lacunas | Proposta |
|---|---|---|
| 80 testes, só Chromium, Supabase simulado com `page.route`; regras em `README.md` (sem espera fixa, asserções que tentam de novo, estresse com `--repeat-each=3 --workers=4`) | Diário (editar, excluir, filtros), exportações em Markdown, CT-014 | TS-01, TS-03 |

### 4.4. Segurança

| Situação atual | Lacunas | Proposta |
|---|---|---|
| CSP com os cabeçalhos reais; gate do Conselho com provas reversas; auditoria de dependências no CI | RLS sem teste automatizado; reflexão e sessões antigas sem verificação de risco; lista de termos sem corpus de falsos positivos e negativos | TS-05; SEG-006 e SEG-007; SEG-008, com conjunto de frases de teste validado por especialista |

### 4.5. Acessibilidade

| Situação atual | Lacunas | Proposta |
|---|---|---|
| Guardas automáticas (títulos, contraste, movimento, áreas de toque); axe-core rodado fora do repositório em auditorias anteriores | axe não automatizado; axe não rodado no estado bloqueado do Conselho; nenhum teste de teclado; nenhum teste com leitor de tela | TS-06: axe no estado bloqueado (em pasta temporária, ou como dependência de desenvolvimento, mediante autorização); roteiro manual com NVDA ou VoiceOver |

### 4.6. Compatibilidade entre navegadores

| Situação atual | Lacunas | Proposta |
|---|---|---|
| Só Chromium (CI) e Google Chrome (local e produção) | Safari, Firefox, celular real | Definir os navegadores-alvo (D-07-03); depois, projetos Playwright para Firefox e WebKit, mais verificação manual em celular |

### 4.7. Testes em produção

| Situação atual | Lacunas | Proposta |
|---|---|---|
| Gate validado em 2026-11-23 nos dois domínios, com Google Chrome 157 desktop e perfil temporário (EV-43) | Ver lista abaixo | Roteiro de verificação pós-publicação para mudanças de segurança, com evidências guardadas em local versionável |

**Limitações conhecidas da validação atual do gate:**

- só Chrome, em ambiente desktop;
- leitor de tela não verificado;
- Safari e Firefox não verificados;
- celular não verificado;
- fluxo autenticado não verificado;
- os artefatos da validação (capturas e JSON) ficaram em pasta temporária e não foram versionados.

## 5. Riscos

| Risco | Probabilidade | Impacto | Mitigação proposta |
|---|---|---|---|
| Pessoa em risco escreve na reflexão de uma sessão existente e recebe deliberação comum | Média | Alto | SEG-006 e SEG-007 |
| Falso positivo do gate bloqueia uma reflexão legítima | Média | Médio | SEG-008 (corpus de teste e revisão especializada) |
| Evolução do modelo do Conselho perde dados no saneamento | Alta, se não for tratada | Alto | D-08-03, com testes de ida e volta |
| Integrar os 34 integrantes sem fontes reproduz atribuições sem fundamento | Alta | Alto | Doc. 13 v2, Fase 1, e critério de qualidade do Doc. 12 §7 |
| Regressão em Safari ou Firefox | Desconhecida | Médio | TS-07 |

## 6. Dependências entre itens

```text
D-04-02, D-04-03 e o modelo obra–pensador ──► Fase 1 do Conselho (34 integrantes)
D-08-03 (schema 5) ──► campos novos na sessão ──► D-08-05 (síntese versionada)
D-08-04 (pesos) ──► Fase 2 do Conselho
Fase 1 + Fase 2 ──► Fase 3 ──► Fase 4 ──► Fase 5 (IA, com ADR)
D-07-03 (navegadores) ──► TS-07
```

## 7. Critérios de aceite para novas entregas

Os critérios do Doc. 07 §14 continuam valendo. Esta reconstrução propõe acrescentar, a validar:

1. Toda mudança em segurança tem prova reversa: o teste falha sem a correção.
2. Toda mudança no modelo de dados tem teste de ida e volta (exportar, importar, sincronizar) para os campos novos.
3. Mudanças de catálogo registram versão, data, responsável e justificativa (Doc. 13 v2 §20) e não reescrevem sessões passadas.
4. Mudanças no Supabase de produção são aplicadas depois de teste local com contagens apresentadas ao responsável, e antes do código que depende delas. Essa prática foi seguida nas entregas da Gita, segundo as sessões de trabalho anteriores, mas **não está documentada no repositório**; esta é a proposta de formalizá-la.

## 8. Priorização sugerida (para validação; não é decisão)

| Ordem | Item | Justificativa |
|---|---|---|
| 1 | SEG-006 e SEG-007 | Lacuna de segurança em fluxo de risco |
| 2 | Decisões D-04-02, D-04-03, D-08-03, D-08-04 e D-08-05 | Bloqueiam a Fase 1 do Conselho |
| 3 | TS-03, TS-01, TS-05 | Requisitos P0 e P1 sem teste; RLS sem teste |
| 4 | D-07-03 e TS-07 | Definir e verificar os navegadores-alvo |
| 5 | Fase 1 do Conselho (catálogo e fontes) | Base para qualquer evolução do Conselho |
| 6 | TS-06 (axe e leitor de tela) | Acessibilidade do estado bloqueado |
