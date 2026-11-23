# Documento 08 — Arquitetura Técnica e Modelo de Dados: complemento de conformidade

| Campo | Valor |
|---|---|
| Número e título | Documento 08 — Arquitetura Técnica e Modelo de Dados (complemento de conformidade) |
| Versão | 0.2 |
| Data de reconstrução | 2026-11-23 |
| Status | COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO |
| Relação com o original | **Não substitui** o Documento 08 v2.0 (`docs/DOCUMENTO-08-arquitetura-tecnica.txt`), que descreve a arquitetura **planejada**. Este complemento descreve a arquitetura **encontrada no código** e as diferenças entre as duas. |
| Fontes utilizadas | EV-07, EV-09, EV-20 a EV-37, EV-40 a EV-43, EV-50 |
| Limitações conhecidas | Leitura estática do código no commit `b23ddac`, mais os resultados dos testes daquele commit. Não houve perfil de desempenho nem auditoria de segurança independente. O estado do banco em produção não foi consultado; o esquema descrito é o das migrações versionadas. |

## Histórico de revisão

| Versão | Data | Descrição |
|---|---|---|
| 0.1 | 2026-11-23 | Primeira versão do complemento. |
| 0.2 | 2026-11-23 | Reclassificação documental: COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO. Conteúdo e proveniência preservados. |

---

## 1. Arquitetura geral (atual)

Aplicação web de página única, com renderização no navegador. Funciona sem conta e sem rede para os dados pessoais e, opcionalmente, sincroniza com o Supabase.

| Item | Tecnologia encontrada | Evidência |
|---|---|---|
| Interface | React 19, React Router 7 | `package.json`; `src/app/main.tsx` |
| Build | Vite 8; telas carregadas por rota | `vite.config.ts`; `lazy` em `main.tsx` |
| Linguagem | TypeScript 7; typecheck obrigatório no build e no CI | `tsconfig.json`; `package.json` (`build`) |
| Estilo | Tailwind CSS 4 (plugin Vite) e tokens em `src/styles/globals.css` | `package.json`; `unit/design-system.test.ts` |
| Markdown (Gita) | `react-markdown`, `remark-gfm` | `package.json` |
| Backend opcional | `@supabase/supabase-js` 2, carregado sob demanda | `src/infrastructure/sync.ts` (`await import`) |
| Fontes | `@fontsource` (Gloock, Crimson Pro, Geist Mono), servidas pelo próprio site | `package.json`; `vercel.json` (`font-src 'self'`) |
| Testes | Vitest 5 e Playwright 1.65 (Chromium) | `package.json`; `playwright.config.ts` |

Recomendações do Documento 08 que **não foram adotadas** e não são dependência: IndexedDB, Dexie, Zod, TanStack Query, React Hook Form, React Testing Library, ESLint e Prettier.

## 2. Organização de diretórios (atual)

```text
src/
  app/             main.tsx (rotas), Layout.tsx, hooks.tsx (estado do store, retorno de operações)
  application/     useCases.ts (casos de uso), store.ts (contrato de persistência e store), syncLogic.ts
  domain/          types.ts, journey.ts, catalog.ts, council.ts, crisis.ts, gita.ts, identidade.ts, historico.ts, report.ts
  infrastructure/  localRepository.ts, sanitize.ts, legacy.ts, sync.ts, gitaContent.ts,
                   ensinamentosContent.ts, registrosGita.ts, download.ts
  features/        home, journey, virtues, council, diary, history, settings, gita
  components/      ui.tsx, simbolos.tsx, movimento.ts
  data/            catálogo em JSON (dimensões, famílias, virtudes, relações, pensadores, obras, exercícios, casos, emblemas)
  shared/          util.ts
  styles/          globals.css
supabase/          migrations/ (8), seed.sql, seeds/ (19 arquivos da Gita)
tests/             unit/ (14), e2e/ (9 especificações + 1 auxiliar)
docs/              documentos oficiais e esta governança
```

Diferenças em relação ao Documento 08 §5.1:

- Não existem as subpastas `domain/entities`, `application/use-cases` e `infrastructure/persistence/indexeddb`.
- Os casos de uso estão num único arquivo (`useCases.ts`, 323 linhas).
- Não há `tests/integration/`.

O próprio Documento 08 diz que a estrutura "é uma referência inicial", sem exigência de criar diretórios vazios.

## 3. Camadas

| Camada | Responsabilidade | Arquivos | Observações |
|---|---|---|---|
| Apresentação | Telas, rotas, componentes | `src/app`, `src/features`, `src/components` | `CouncilPages.tsx` tem a função `compose()`, que orquestra `suggest` e `selectThinkers` dentro da tela (ver seção 12, item DT-03) |
| Aplicação | Casos de uso puros e store | `src/application` | `useCases.ts` não depende de React nem de armazenamento; erros de regra viram `DomainError` |
| Domínio | Regras, tipos, catálogo, motor do Conselho | `src/domain` | Funções puras e testáveis |
| Infraestrutura | Persistência, saneamento, migração, sync, acesso ao Supabase | `src/infrastructure` | Isolada atrás de contratos |

## 4. Persistência (atual)

| Aspecto | Situação | Evidência |
|---|---|---|
| Mecanismo | **`localStorage`** | `src/infrastructure/localRepository.ts` |
| Chaves | `jornada-virtude-v4` (dados), `jornada-virtude-v4-meta` (metadados de sync e migração) | idem |
| Preferências | `jv-theme` (tema), `jv-gita-menu` (menu da Gita) | `src/app/Layout.tsx`, `src/features/gita/useMenuCapitulos.ts` |
| IndexedDB | **Não implementado.** O código registra a decisão: "o MVP usa localStorage [...] IndexedDB foi avaliado e fica para quando houver anexos, volume ou consultas" | comentário em `localRepository.ts` |
| Contrato | `UserDataRepository`, permitindo trocar a implementação | `src/application/store.ts` |
| Falha de gravação | O store devolve falso, e a interface avisa que o dado não foi salvo (CT-013) | `hooks.tsx` (`useRun`); `unit/council-legacy.test.ts` |
| Armazenamento bloqueado | Funciona em memória e avisa | `unit/council-legacy.test.ts` |
| Migração da versão anterior | Lê a chave do protótipo, converte e não apaga o original | `legacy.ts`; `e2e/mvp.spec.ts` |

**Divergência D-08-01:** o Documento 08 (ADR-009, §10, §20) recomenda IndexedDB e localStorage só para preferências. O código usa localStorage para os dados, por uma decisão registrada só em comentário. O Documento 08 não foi atualizado.

## 5. Modelo de dados e contratos (atual)

### 5.1. Dados do usuário

`UserData` (`src/domain/types.ts`), **schema 4**:

| Coleção | Limite no saneamento | Observações |
|---|---:|---|
| `journeys` | 100 | Estado, `archivedAt`, etapas, investigação, exercícios, histórico de eventos |
| `entries` (diário) | 5.000 | Jornada opcional; vínculo opcional com exercício e com sessão do Conselho |
| `reviews` | 2.000 | Tipos `periodica`, `final`, `legado` |
| `sessions` (Conselho) | 500 | Situação, dúvida, caso, dimensões, virtudes, contribuições, reflexão, ação, jornada |

O Documento 08 propõe 21 entidades relacionais (`users`, `journey_intentions`, `journey_virtues`, `exercise_records`, `learning_insights` e outras). No código, várias delas existem como campos aninhados da jornada, e não como entidades próprias.

### 5.2. Arquivo de exportação

`{ application, schemaVersion: 4, exportedAt, data, reflexoesGita? }` (`buildExport` em `legacy.ts`).
- `reflexoesGita` só aparece para quem tem conta e não é restaurado na importação.
- A importação aceita o formato atual e o da versão anterior.
- Arquivos com `schemaVersion` maior que 4 são recusados.

### 5.3. Catálogo (somente leitura)

Arquivos JSON em `src/data`, embutidos no build. Os números estão em EV-31. **Não há tabelas de catálogo no Supabase**, exceto o conteúdo da Gita.

### 5.4. Banco (Supabase), pelas migrações versionadas

| Grupo | Tabelas | Acesso |
|---|---|---|
| Dados do usuário | `profiles`, `journeys`, `council_sessions`, `council_contributions`, `diary_entries`, `journey_reviews` | RLS só para o dono; `anon` sem acesso; privilégios mínimos para `authenticated` |
| Funções | `jv_push_state` (substitui o retrato inteiro de forma atômica, com controle de revisão), `jv_pull_state`, `jv_delete_my_data` | Só `authenticated` |
| Gita | `capitulos`, `etapas`, `perguntas`, `opcoes`, `leituras`, `ensinamentos`, `ensinamentos_gunas` (leitura pública); `registros` (reflexões, só do dono) | Conforme as migrações de 2026-11-18 a 2026-11-20 |

Desenho registrado na primeira migração: cada linha guarda colunas tipadas para chaves e filtros, mais a coluna `doc` (jsonb) com o registro completo no formato do app.

## 6. Validação, saneamento e erros

| Mecanismo | Onde | Comportamento |
|---|---|---|
| Regras de negócio | `useCases.ts` | `DomainError` com mensagem pronta para exibição |
| Saneamento de dados externos | `sanitize.ts` | **Reconstrói cada registro campo a campo**; descarta itens inválidos e informa quantos ignorou; aplica limites |
| Parsers da Gita | `src/domain/gita.ts`, `gitaContent.ts` | Validam a resposta da API |
| Mensagens ao usuário | `hooks.tsx` (`useRun`), `sync.ts` (`describe`) | Sucesso e erro refletem o resultado real |
| Falha de rede | Gita, ensinamentos, sync | Aviso e opção de tentar de novo; os dados do aparelho são preservados |

**Risco R-08-01:** por reconstruir campo a campo, o saneamento **descarta campos que não conhece**. Qualquer campo novo na sessão do Conselho (versão do algoritmo, pontuações, fontes) seria perdido na importação e na sincronização, se `sanitize.ts` não for ampliado junto. Nenhuma migração de schema foi implementada; o schema continua 4.

## 7. Autenticação, Supabase e sincronização

- **Situação real.** O código traz a URL do projeto e a chave *publishable* como padrão (`src/config.ts`), então `cloudConfigured` é verdadeiro nas publicações atuais. A **conta é opcional**: sem login, nenhum dado pessoal sai do aparelho.
- **Dependência fora dos dados pessoais.** A **leitura da Gita** depende do Supabase: o conteúdo dos capítulos e dos ensinamentos vem da API pública e não está no build. Sem rede, essa área mostra o aviso de falha. As reflexões da Gita exigem conta.
- **Autenticação.** E-mail e senha, link mágico e saída (Supabase Auth).
- **Sincronização** (`sync.ts`, `syncLogic.ts`). Modelo de retrato inteiro com controle de revisão:
  - envia quando só o aparelho mudou;
  - baixa quando só a nuvem avançou;
  - pede decisão em conflito;
  - nunca envia dados vinculados a outra conta sem confirmação.

  Testado em `unit/domain.test.ts` ("sincronização").
- **Exclusão.** Apaga as reflexões da Gita e depois o restante na nuvem, e mantém a cópia do aparelho.

**Divergência D-08-02:** o Documento 08 classifica o Supabase como "Futuro" e a autenticação como "se necessária", e o Documento 13 v2 §16 pede ADR antes de persistência remota. O código já tem conta, RLS e sincronização em produção. Não foi localizado nenhum ADR formal sobre essa decisão.

## 8. Segurança

| Controle | Evidência | Teste |
|---|---|---|
| Sem segredos no frontend; só a chave *publishable* | `src/config.ts`, `.env.example` | Inspeção |
| RLS por dono e privilégios mínimos | Migrações `20261113180000` e `20261118235900` | Sem teste automatizado no repositório |
| CSP sem `unsafe-inline` e `unsafe-eval`; `frame-ancestors 'none'`; cabeçalhos | `vercel.json` | `e2e/seguranca.spec.ts` |
| Hash do script de tema na CSP | `index.html`, `vercel.json` | `e2e/seguranca.spec.ts` |
| Auditoria de dependências de produção no CI | `.github/workflows/ci.yml` | CI |
| Gate de segurança do Conselho | `crisis.ts`, `CouncilPages.tsx`, `useCases.ts` | `unit/conselho-seguranca.test.ts`, `e2e/conselho-seguranca.spec.ts` |
| Nenhum envio a IA | Não há código de IA | Validação em produção (EV-43) |

## 9. Fluxo do Conselho e mecanismo de segurança

```text
/conselho (CouncilPage)
  │  situação, dúvida, virtude e dimensão (opcionais), vínculo com jornada
  │
  ├─ aviso ao vivo: isCrisisInput(situação, dúvida)
  │     verdadeiro → mostra os contatos de ajuda e esconde a frase "fica guardada"
  │
  └─ clique em "Convocar o Conselho" → convene()
        1. isCrisisInput(situação, dúvida)?
             SIM → bloqueio: alerta "O Conselho não foi convocado" com os contatos
                   (não compõe, não grava, não navega)
             NÃO ↓
        2. compose(): suggest() → hipóteses de caso, virtudes e dimensões
                      selectThinkers() → 2 a 5 pensadores, determinístico,
                      com os pesos do Doc. 04 (35/30/15/10/10)
        3. saveSession() no caso de uso
             proteção extra: sessão NOVA com sinal de risco → DomainError
        4. navega para /conselho/sessoes/:id

/conselho/sessoes/:id (SessionPage)
  - contribuições gravadas na sessão (perspectiva, pergunta, motivo, obras)
  - synthesize(): convergências, divergências, síntese do caso e perguntas,
    RECALCULADOS A CADA ABERTURA a partir do catálogo atual
  - mudar virtudes → recompõe e grava uma nova seleção (toggleVirtue)
  - "Minha reflexão" e "Ação" com salvamento automático, sem verificação de risco
  - "Registrar no diário" copia a reflexão para um registro do diário
```

**Divergência D-08-05:** o Documento 13 v2 §20 diz que "alterações no catálogo não devem reescrever silenciosamente sessões passadas" e que cada sessão deve registrar a versão do catálogo e do algoritmo. Hoje a síntese de uma sessão antiga é recalculada com o catálogo atual, e a sessão não guarda versão nenhuma.

## 10. Testes

| Tipo | Ferramenta | Quantidade (commit `b23ddac`) | Observações |
|---|---|---:|---|
| Unitários | Vitest | 231 em 14 arquivos | Domínio, casos de uso, catálogo, migração, sync, Gita, sistema visual |
| Integração | — | — | Não há camada separada; os fluxos são cobertos por E2E |
| E2E | Playwright | 80 | Só Chromium; Supabase simulado com `page.route` |
| Segurança | Playwright | incluído nos 80 | CSP aplicada com os cabeçalhos reais do `vercel.json` |
| Acessibilidade | Playwright (verificações próprias) | incluído nos 80 | Títulos, contraste, movimento; axe-core rodado fora do repositório em auditorias anteriores (EV-13), não automatizado |
| Produção | Manual, com roteiro | — | Gate validado em Chrome desktop (EV-43) |

## 11. Build e deploy

- `npm run build` executa `tsc --noEmit` e `vite build`. Há o aviso de que o pacote principal passa de 500 kB (506,64 kB; 136,61 kB com gzip).
- **CI (GitHub Actions)** em push para `main` e em PR: `npm ci`, auditoria, typecheck, unitários, build, instalação do Chromium e E2E.
- **Vercel:** dois projetos publicam o mesmo repositório em produção: `jornadadavirtude` e `jornadadavirtudejustgo` (domínios `*.vercel.app`). Os dois publicaram o commit `5368603`, segundo EV-43.
- Não há evidência no repositório de que a publicação espere o CI (D-08-06).

## 12. Arquitetura planejada (documentos) e não implementada

| Item planejado | Fonte | Situação |
|---|---|---|
| IndexedDB (talvez com Dexie) | Doc. 08 ADR-009, §10.2 | Não implementado; decisão contrária registrada em comentário |
| Zod para contratos | Doc. 08 §6.3, §20 | Não adotado; validação manual em `sanitize.ts` |
| Casos de uso em módulos separados | Doc. 08 §5, §12 | Arquivo único |
| Serviços do Conselho (`SituationAnalyzer`, `ContextClarifier`, `VirtueMapper`, `ThinkerSelector`, `KnowledgeRetriever`, `PerspectiveBuilder`, `PerspectiveComparator`, `CouncilSynthesizer`, `ExerciseGenerator`, `CouncilSessionManager`, `SafetyRouter`) | Doc. 13 v2 §14 | Existem equivalentes parciais: `suggest` faz parte de `SituationAnalyzer`/`VirtueMapper`; `selectThinkers` corresponde a `ThinkerSelector`; `synthesize` faz parte de `PerspectiveComparator`/`CouncilSynthesizer`; o gate faz parte de `SafetyRouter` |
| Entidades `Concept`, `KnowledgeSource`, `ThinkerConcept`, `ConceptVirtue`, `CouncilCriterion` e outras | Doc. 13 v2 §15 | Não implementadas |
| Adaptador `AIProvider` em ambiente seguro | Doc. 08 §17; Doc. 13 v2 §16 | Não implementado; o Doc. 13 v2 exige ADR antes |
| Versionamento de catálogo e algoritmo por sessão | Doc. 13 v2 §20 | Não implementado |

## 13. Decisões pendentes

| Id | Pergunta |
|---|---|
| D-08-01 | Formalizar localStorage como persistência do MVP (atualizando o Doc. 08) ou planejar a troca para IndexedDB? |
| D-08-02 | Registrar ADR retroativo da adoção do Supabase (conta, RLS, sync)? |
| D-08-03 | Como evoluir o schema (4 → 5) quando a sessão do Conselho ganhar campos novos, sem perder dados no saneamento? |
| D-08-04 | Quais pesos do motor valem: Doc. 04 §11 (35/30/15/10/10, no código) ou Doc. 13 v2 §7.1 (30/25/15/15/10/5)? |
| D-08-05 | A síntese das sessões passa a ser gravada com versão de catálogo e algoritmo, ou continua recalculada? |
| D-08-06 | A publicação na Vercel deve depender do CI verde? |
| D-08-07 | Os dois projetos Vercel são intencionais? Qual é o domínio oficial? |
| D-08-08 | A Gita deve funcionar sem rede (conteúdo no build) ou continua dependendo da API? |

## 14. Riscos técnicos e dívida arquitetural

| Id | Item | Impacto |
|---|---|---|
| R-08-01 | O saneamento descarta campos desconhecidos (seção 6) | Perda silenciosa de dados em evoluções do modelo |
| R-08-02 | A síntese do Conselho é recalculada com o catálogo atual (D-08-05) | Sessões antigas mudam sem aviso quando o catálogo muda |
| R-08-03 | Sessão antiga com sinal de risco mostra a deliberação; a reflexão não é verificada | Lacuna de segurança (SEG-006 e SEG-007 no complemento do Doc. 07) |
| R-08-04 | E2E só em Chromium; nenhum navegador-alvo definido | Falhas em Safari ou Firefox não detectadas |
| R-08-05 | Pacote principal acima de 500 kB | Aviso do build; desempenho medido como bom (EV-13), sem monitoramento contínuo |
| R-08-06 | Duas publicações de produção do mesmo código | Risco de divergência de configuração entre domínios |
| DT-01 | Casos de uso num único arquivo de 323 linhas | Manutenção |
| DT-02 | `CouncilPages.tsx` com 478 linhas | Manutenção; o Doc. 13 v2 §14 pede a lógica fora da interface |
| DT-03 | `compose()` orquestra o motor dentro da tela | Lógica de aplicação na apresentação |
| DT-04 | Catálogo inteiro em `proposta`, sem fluxo de validação | Governança de conteúdo |
