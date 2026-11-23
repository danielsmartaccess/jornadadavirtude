# Inventário de evidências

| Campo | Valor |
|---|---|
| Versão | 0.2 |
| Data | 2026-11-23 |
| Status | ARTEFATO DE GOVERNANÇA PARA VALIDAÇÃO |
| Base do repositório | `main` em `b23ddac` (sincronizada com `origin/main`) |
| Finalidade | Registrar as fontes de cada afirmação relevante dos documentos de governança. Os demais documentos citam estas fontes pelo identificador `EV-xx`. |

## Histórico de revisão

| Versão | Data | Descrição |
|---|---|---|
| 0.1 | 2026-11-23 | Primeira versão do inventário. |
| 0.2 | 2026-11-23 | Reclassificação documental: ARTEFATO DE GOVERNANÇA PARA VALIDAÇÃO. Fontes e conteúdo preservados. |

## Regras de leitura

- **Repositório** significa versionado em `danielsmartaccess/jornadadavirtude`.
- **Local** significa arquivo da pasta de trabalho do projeto, fora do repositório. Não é público e pode não estar acessível a outros revisores.
- "Não localizado nas fontes examinadas" não significa que o documento nunca existiu.
- Contagens foram obtidas por leitura direta dos arquivos em 2026-11-23, no commit `b23ddac`.

## 1. Documentos do projeto

| ID | Fonte | Onde | Versão / status declarado | Uso nesta governança |
|---|---|---|---|---|
| EV-01 | Documento 01 — Visão conceitual | Repositório: `docs/DOCUMENTO-01-visao-conceitual.txt` | 1.0 | Princípios; §4: quatro etapas do MVP (Reconhecer 1 sem., Investigar 2, Praticar 4, Revisar 1) declaradas como "parâmetros iniciais do MVP, não prazos universais"; §10: lista dos próximos documentos. |
| EV-02 | Documento 02 — Sete dimensões | Repositório: `docs/DOCUMENTO-02-sete-dimensoes.txt` | 1.0, "Documento conceitual de referência" | Definição das sete dimensões; §5: matriz preliminar dimensões × 20 virtudes. |
| EV-03 | Documento 03 — Taxonomia das virtudes | Repositório: `docs/DOCUMENTO-03-taxonomia-das-virtudes.txt` | 1.0 | 8 famílias e 48 virtudes, com definição, deficiências, excessos, dimensões e referências. |
| EV-04 | Documento 04 — Matriz de integração | Repositório: `docs/DOCUMENTO-04-matriz-de-integracao.txt` | 1.0, "Referência conceitual e estrutural" | §3: códigos D1–D3 e P1–P4; §5: pensadores prioritários por virtude; §6: 26 pensadores; §7: seis casos de convocação; §11: pesos 35/30/15/10/10; §14: estados proposta/validada/suspensa. |
| EV-05 | Documento 06 — Arquitetura funcional e UX | Repositório: `docs/DOCUMENTO-06-arquitetura-funcional-e-ux.txt` | 1.0, "Proposta para validação" | §8.2: sete etapas (Despertar → Revisar); §8.3: estados das etapas; §10: tela do Conselho; cita o "Documento Oficial 05". |
| EV-06 | Documento 07 — Especificação funcional | Repositório: `docs/DOCUMENTO-07-especificacao-funcional.txt` | 2.0, "Documento de referência para desenvolvimento" | RF-001 a RF-135, RNF-001 a RNF-053, RN-001 a RN-024, US-001 a US-010, CT-001 a CT-015; §12: prioridades; §13: fases; §17: cita Documentos 05 e 09. |
| EV-07 | Documento 08 — Arquitetura técnica | Repositório: `docs/DOCUMENTO-08-arquitetura-tecnica.txt` | 2.0, "Proposta técnica revisada" | ADR-001 a ADR-015; IndexedDB "a avaliar"; Supabase "futuro"; §18: roadmap técnico em 5 etapas; §22: anuncia o Documento 09. |
| EV-08 | Documento 12 — Catálogo de pensadores | Repositório: `docs/DOCUMENTO-12-catalogo-de-pensadores.md` | 2.0, "versão consolidada para validação editorial e filosófica" | 34 integrantes (PENS-001 a PENS-034) e nota de proveniência (26 do Doc. 04, Hillel de lista anterior, 7 acrescentados). |
| EV-09 | Documento 13 v2 — Metodologia do Conselho | Repositório: `docs/DOCUMENTO-13-metodologia-do-conselho-v2.md` | 2.0 | Nove etapas; pesos 30/25/15/15/10/5; 2 a 5 pensadores; seleção determinística; IA só na Fase 5; local-first. |
| EV-10 | Documento 13 v1 — Metodologia de deliberação | Local, pasta `docs/` de trabalho (não versionado) | 1.0 | Versão anterior: IA já na Fase 1, Edge Functions presumidas, quantidade de pensadores por complexidade. Substituída pela v2 (EV-09). |
| EV-11 | Engenharia Reversa — Jornada da Virtude (v1 analisada, v3 implementada) | Local, pasta `Jornada da Virtude v1.0/` (não versionado) | sem versão declarada | Protótipo anterior: RN-01 "4 etapas de duração fixa, total 8 semanas / 56 dias"; requisitos RF-01 a RF-23 da v1/v3; persistência em `localStorage`. |
| EV-12 | Apresentação "Jornada da Virtude" (PDF, 8 páginas, gerada no Canva) | Local, pasta de downloads (não versionado) | sem versão; criada em 2026-11-14 | Resumo visual do Documento 01; p. 6: ciclo de quatro etapas com durações e a ressalva "parâmetros iniciais do MVP". Texto lido por extração; imagens não examinadas. |
| EV-13 | Auditoria UX e Relatório final de UX | Local, pasta `docs/` de trabalho (não versionado) | 2026-11-20 e 2026-11-21 | Decisões de identidade visual, acessibilidade, desempenho, CSP; limitações remanescentes (retratos, tradição judaica, validação cultural). |
| EV-14 | Prompts para o ChatGPT (pendências externas) | Local, pasta `docs/` de trabalho (não versionado) | 2026-11-21 | Registra "27 integrantes do Conselho" e as pendências de curadoria visual e cultural. |
| EV-15 | Arquitetura da taxonomia (nota) | Local, pasta `docs/` de trabalho (não versionado) | sem versão | Diretriz: virtude como registro independente com relações próprias. |

## 2. Código e dados (repositório, commit `b23ddac`)

| ID | Fonte | Símbolos ou conteúdo verificados |
|---|---|---|
| EV-20 | `src/domain/journey.ts` | `STAGES`: 7 etapas (`despertar`, `identificar`, `investigar`, `refletir`, `praticar`, `registrar`, `revisar`); referências de duração só em Identificar (1 semana), Investigar (2), Praticar (4) e Revisar (1); `STAGE_STATES`; `INVESTIGATION_BLOCKS` (4 blocos); `REVIEW_QUESTIONS` (5 perguntas); `exerciseOptions`; `journeyStats`. |
| EV-21 | `src/domain/types.ts` | `JourneyStatus` = DRAFT, ACTIVE, PAUSED, COMPLETED; `archivedAt`; `UserData` com `schema: 4`; entidades do catálogo e do usuário. |
| EV-22 | `src/application/useCases.ts` | Casos de uso: `createJourney`, `startJourney`, `pauseJourney`, `resumeJourney`, `completeJourney`, `archiveJourney`, `unarchiveJourney`, `discardDraft`, `selectPrimaryVirtue`, `addRelatedVirtue`, `removeRelatedVirtue`, `setStageState`, `startExercise`, `archiveExercise`, `saveEntry`, `deleteEntry`, `saveReview`, `deleteReview`, `saveSession`, `deleteSession`; `DomainError`; `CRISIS_BLOCKED`. |
| EV-23 | `src/application/store.ts`, `src/infrastructure/localRepository.ts` | Contrato `UserDataRepository`; persistência em `localStorage` (chaves `jornada-virtude-v4` e `jornada-virtude-v4-meta`); comentário "Decisão registrada: o MVP usa localStorage... IndexedDB foi avaliado e fica para quando houver anexos, volume ou consultas". |
| EV-24 | `src/infrastructure/sanitize.ts` | `schema: 4`; `LIMITS` = 100 jornadas, 5.000 registros, 2.000 revisões, 500 sessões; reconstrução campo a campo. |
| EV-25 | `src/infrastructure/legacy.ts` | Migração do formato da versão anterior (`LEGACY_KEY`); `buildExport`; `parseImport` (recusa versão mais nova). |
| EV-26 | `src/infrastructure/sync.ts`, `src/application/syncLogic.ts` | Conta opcional; `jv_pull_state`, `jv_push_state` com controle de revisão; conflito decidido pela pessoa; `deleteCloudData`. |
| EV-27 | `src/config.ts`, `.env.example` | URL do projeto Supabase e chave *publishable*; `cloudConfigured`. |
| EV-28 | `supabase/migrations/` (8 arquivos) | Tabelas `profiles`, `journeys`, `council_sessions`, `council_contributions`, `diary_entries`, `journey_reviews` (dados do usuário, RLS por dono); `capitulos`, `etapas`, `registros`, `perguntas`, `opcoes`, `leituras`, `ensinamentos`, `ensinamentos_gunas` (Gita). |
| EV-29 | `src/domain/council.ts` | `suggest`, `selectThinkers`, `synthesize`; `WEIGHTS` = 0,35 / 0,30 / 0,15 / 0,10 / 0,10 (Doc. 04 §11); `MIN_THINKERS` 2, `MAX_THINKERS` 5. |
| EV-30 | `src/domain/crisis.ts`, `src/features/council/CouncilPages.tsx` | `detectCrisis` (18 termos), `isCrisisInput(situação, dúvida)`; gate em `convene()` antes de compor, gravar e navegar; frase de armazenamento oculta quando há sinal de risco. |
| EV-31 | `src/data/*.json` | 7 dimensões; 8 famílias; 48 virtudes; 176 relações virtude–dimensão (120 D1, 56 D2, 0 D3, 0 com justificativa); 42 pensadores e tradições (35 pensadores, 7 tradições; 27 no Conselho); 189 relações pensador–virtude (3 P1, 2 P3, 184 sem tipo; 132 com obra); 21 obras; 56 exercícios; 18 distinções; 6 casos; 48 emblemas. Todos os registros com status `proposta`. |
| EV-32 | `src/app/main.tsx` | Rotas: `/`, `/jornada`, `/jornada/nova`, `/virtudes`, `/virtudes/:id`, `/dimensoes`, `/dimensoes/:id`, `/conselho`, `/conselho/sessoes/:id`, `/conselho/pensadores`, `/conselho/pensadores/:id`, `/diario`, `/historico`, `/historico/:id`, `/gita`, `/gita/ensinamentos`, `/gita/:numero`, `/configuracoes`, `/sobre`. |
| EV-33 | `src/features/**` | Telas por módulo: `home`, `journey`, `virtues`, `council`, `diary`, `history`, `settings`, `gita`. |
| EV-34 | `src/domain/report.ts`, `src/features/history/HistoryPages.tsx`, `src/features/diary/DiaryPage.tsx` | Síntese da jornada em Markdown, exportação JSON da jornada, exportação do diário em Markdown. |
| EV-35 | `vercel.json` | Cabeçalhos de segurança e `Content-Security-Policy` ativa. |
| EV-36 | `.github/workflows/ci.yml` | CI em push para `main` e em PR: `npm ci`, `npm audit --omit=dev --audit-level=high`, typecheck, testes unitários, build, Playwright (Chromium). |
| EV-37 | `README.md` | Descrição do MVP v2.0, arquitetura, conta opcional, Gita, sistema visual, regras de E2E, conteúdo em validação. |

## 3. Testes (repositório, commit `b23ddac`)

| ID | Fonte | Conteúdo |
|---|---|---|
| EV-40 | `tests/unit/` | 14 arquivos, 231 testes (Vitest). Destaques: `domain.test.ts` (ciclo de vida, CT-001 a CT-010, RN-002 a RN-019, RF-130/131), `council-legacy.test.ts` (seleção do Conselho, migração, armazenamento local, CT-013), `conselho-seguranca.test.ts` (gate de risco), `catalog.test.ts`, `exportacao.test.ts`, `gita*.test.ts`, `identidade.test.ts`, `design-system.test.ts`. |
| EV-41 | `tests/e2e/` | 9 especificações e 1 auxiliar, 80 testes (Playwright, Chromium). Destaques: `mvp.spec.ts` (fluxo completo do MVP), `conselho-seguranca.spec.ts` (gate), `seguranca.spec.ts` (CSP), `acessibilidade.spec.ts`, `exportacao.spec.ts`, `gita*.spec.ts`, `incremento-ux.spec.ts`, `desempenho.spec.ts`. |
| EV-42 | Execução local e no CI, 2026-11-23, commit `b23ddac` | typecheck ok; 231/231 unitários; build ok; 80/80 E2E; CI run 45191742383 com sucesso. |
| EV-43 | Validação em produção do gate, 2026-11-23, commit `5368603` | Google Chrome 157 (desktop, perfil temporário), nos dois domínios Vercel: convocação neutra ok; bloqueio com risco na situação e na dúvida sem sessão, sem gravação e sem requisição de rede; demais áreas acessíveis. Não verificados: leitor de tela, Safari, Firefox, celular, fluxo autenticado. Registro feito no relatório da sessão; os artefatos (capturas e JSON) ficaram em pasta temporária e não foram versionados. |

## 4. Histórico Git

| ID | Fonte | Conteúdo |
|---|---|---|
| EV-50 | `git log` (38 commits, de `bdc26b8` em 2026-11-13 a `b23ddac` em 2026-11-23) | `bdc26b8` MVP v2.0; `7fbfdee`…`9bdaf35` módulo Gita; `30d6d20`…`ab06019` evolução de UX; `774d48f`/`0c4ae82` CSP; `94430a7` exportação com reflexões da Gita; `eb41ac8` CI; `d00d3f2` documentos no repositório; `5368603` gate de segurança; `b23ddac` correção do aviso de armazenamento. |

## 5. Fontes citadas e não localizadas

Procurei estes documentos no repositório, na pasta de trabalho do projeto e, pelo nome dos arquivos, nas pastas Área de Trabalho, Downloads, Documentos e OneDrive do computador. Busquei também no histórico Git e por referências cruzadas.

| Fonte | Onde é citada | Resultado |
|---|---|---|
| Documento 05 — Metodologia da Jornada e Desenvolvimento das Virtudes | Doc. 06 (linhas 1031 e 1309), Doc. 07 §17 e §19, Doc. 08 §9 e §22 | Não localizado nas fontes examinadas |
| Documento 09 — Plano de Implementação, Estratégia de Testes e Gestão da Evolução | Doc. 07 §15 e §17, Doc. 08 §22 | Não localizado nas fontes examinadas |
| Documento 10 | Nenhuma referência encontrada | Não localizado nas fontes examinadas, título desconhecido |
| Documento 11 | Nenhuma referência encontrada | Não localizado nas fontes examinadas, título desconhecido |
| Auditoria Consolidada da Jornada da Virtude — 23/11/2026 | Pedido da Etapa 02 | Não localizada nas fontes examinadas |
| Revisão de Compatibilidade Documental | Pedido da Etapa 02 | Não localizada nas fontes examinadas |
| Épicos E01–E10, propostas E11–E16, itens CS-00–CS-16, ADR-CS-01–ADR-CS-08 | Pedido da Etapa 02, atribuídos à "auditoria anterior" | Nenhuma ocorrência dos identificadores nas fontes examinadas |
| Documento 07 V1.0 | Doc. 07 V2.0 §18 | Não localizado; o próprio V2.0 diz que a correspondência com a V1.0 depende de seu texto integral |
