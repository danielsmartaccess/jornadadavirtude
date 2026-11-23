# Governança documental — Jornada da Virtude

| Campo | Valor |
|---|---|
| Versão | 0.7 |
| Status | ÍNDICE DE GOVERNANÇA (nenhum documento desta pasta está aprovado) |
| Data de atualização | 2026-11-23 |
| Base do repositório | `main` em `b23ddac` |
| Responsáveis pela validação | Papéis: **responsável pelo produto**, **revisor técnico** e **revisor filosófico/curatorial**. As pessoas não estão designadas (D-GOV-02). Até a designação, nenhum documento desta pasta muda de status. |

## Histórico de revisão

| Versão | Data | Descrição |
|---|---|---|
| 0.1 | 2026-11-23 | Primeira versão do índice. |
| 0.2 | 2026-11-23 | Classificação documental por tipo (complemento, reconstrução, artefato, registro, índice); papéis de validação; separação entre status de implementação e status de evidência nos requisitos. Conteúdo e proveniência preservados. |
| 0.3 | 2026-11-23 | Totais do histórico de decisões corrigidos: 24 pendentes, 1 aprovada (D-GOV-01, formalizada em DEC-15), 11 conflitos preservados. |
| 0.4 | 2026-11-23 | Inclusão do Documento 14 (curadoria ampliada) e do ADR-CUR-01 no índice. Nenhum status alterado. |
| 0.5 | 2026-11-23 | Fase 2 de curadoria: ADR-CUR-02 a ADR-CUR-05 e relatórios gerados (comparação das políticas de seleção e inventário das 189 relações). Totais do histórico atualizados. Nenhum documento oficial original foi alterado. |
| 0.6 | 2026-11-23 | Revisão humana da Fase 2 (DEC-CUR-10): comparação v1 × v2 × v2.1 incluída; ADR-CUR-02 a 04 com seções de revisão. Nenhum documento oficial original foi alterado. |
| 0.7 | 2026-11-23 | Revisão final: VIN-DAL-03 volta a "a confirmar" (ADR-CUR-02, histórico v0.7). Nenhum documento oficial original foi alterado. |

## Classificação documental

| Classificação | Aplica-se a |
|---|---|
| COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO | Documentos 04, 07 e 08 (os originais existem e foram preservados) |
| RECONSTRUÍDO PARA VALIDAÇÃO | Documentos 05 e 09 (originais não localizados) |
| ARTEFATO DE GOVERNANÇA PARA VALIDAÇÃO | Matriz de rastreabilidade e inventário de evidências |
| REGISTRO DE DECISÕES PARA VALIDAÇÃO | Histórico de decisões |
| ÍNDICE DE GOVERNANÇA | Este README |

Os Documentos 10 e 11 não são criados sem evidência.

## Visão geral

Esta pasta organiza a documentação do projeto e liga cada documento ao código e aos testes que lhe servem de evidência.

- Os **documentos oficiais originais** ficam em `docs/` e **não foram alterados**.
- Esta pasta contém:
  - **complementos de conformidade** dos documentos que existem e divergem do código (04, 07, 08);
  - **reconstruções** dos documentos citados e não localizados (05, 09);
  - **rastreabilidade** (matriz e inventário de evidências);
  - o **registro de decisões**.

O objetivo é deixar a documentação pronta para validação. Nenhuma aprovação é presumida.

## Índice

### Documentos oficiais (originais, em `docs/`)

| Nº | Título | Arquivo | Versão | Status declarado no documento |
|---|---|---|---|---|
| 01 | Visão conceitual do produto | `../DOCUMENTO-01-visao-conceitual.txt` | 1.0 | — |
| 02 | Mapa das Sete Dimensões do Ser Humano | `../DOCUMENTO-02-sete-dimensoes.txt` | 1.0 | Documento conceitual de referência |
| 03 | Taxonomia das Virtudes | `../DOCUMENTO-03-taxonomia-das-virtudes.txt` | 1.0 | Referência conceitual e pedagógica |
| 04 | Matriz de Integração | `../DOCUMENTO-04-matriz-de-integracao.txt` | 1.0 | Referência conceitual e estrutural |
| 05 | Metodologia da Jornada e Desenvolvimento das Virtudes | **Não localizado nas fontes examinadas** | — | — |
| 06 | Arquitetura Funcional e UX | `../DOCUMENTO-06-arquitetura-funcional-e-ux.txt` | 1.0 | Proposta para validação |
| 07 | Especificação Funcional e Requisitos | `../DOCUMENTO-07-especificacao-funcional.txt` | 2.0 | Documento de referência para desenvolvimento |
| 08 | Arquitetura Técnica e Modelo de Dados | `../DOCUMENTO-08-arquitetura-tecnica.txt` | 2.0 | Proposta técnica revisada |
| 09 | Plano de Implementação, Estratégia de Testes e Gestão da Evolução | **Não localizado nas fontes examinadas** | — | — |
| 10 | Título desconhecido | **Não localizado nas fontes examinadas**; nenhuma referência encontrada | — | — |
| 11 | Título desconhecido | **Não localizado nas fontes examinadas**; nenhuma referência encontrada | — | — |
| 12 | Catálogo de Pensadores (34 integrantes) | `../DOCUMENTO-12-catalogo-de-pensadores.md` | 2.0 | Para validação editorial e filosófica |
| 13 | Metodologia do Conselho de Sabedoria | `../DOCUMENTO-13-metodologia-do-conselho-v2.md` | 2.0 | Especificação metodológica consolidada (a v1.0 existe só localmente) |
| 14 | Curadoria Ampliada do Conselho de Sabedoria | `../DOCUMENTO-14-curadoria-ampliada-do-conselho.md` | 1.0 | Proposta curatorial para validação |

### Documentos desta governança

| Documento | Arquivo | Classificação | Fontes principais | Validação necessária (papéis) |
|---|---|---|---|---|
| 04 — Matriz de Integração | `documentos/Documento-04-Matriz-Integracao-Conformidade.md` | COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO | Docs. 02, 03, 04, 12; `src/data/*.json` | Revisor filosófico/curatorial (associações, D-04-01 a D-04-03); responsável pelo produto (composição do Conselho) |
| 05 — Metodologia da Jornada | `documentos/Documento-05-Metodologia-Jornada.md` | RECONSTRUÍDO PARA VALIDAÇÃO | Docs. 01, 06, 07; protótipo anterior; `src/domain/journey.ts` | Responsável pelo produto (D-05-01 a D-05-05); revisor técnico (camada "implementada") |
| 07 — Especificação Funcional | `documentos/Documento-07-Especificacao-Funcional-Conformidade.md` | COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO | Doc. 07 V2.0; código; testes | Revisor técnico (status de implementação e de evidência); responsável pelo produto (SEG-xxx, D-07-01 a D-07-04) |
| 08 — Arquitetura Técnica | `documentos/Documento-08-Arquitetura-Tecnica-Conformidade.md` | COMPLEMENTO DE CONFORMIDADE PARA VALIDAÇÃO | Doc. 08 v2.0; código; migrações; CI; Vercel | Revisor técnico (arquitetura, riscos); responsável pelo produto (D-08-01 a D-08-08) |
| 09 — Backlog e Testes | `documentos/Documento-09-Backlog-Testes.md` | RECONSTRUÍDO PARA VALIDAÇÃO | Docs. 07, 08, 13 v2; testes; relatórios locais | Responsável pelo produto (prioridades, reconciliação com a auditoria não localizada); revisor técnico (estratégia de testes) |
| Matriz de rastreabilidade | `rastreabilidade/matriz-rastreabilidade.md` | ARTEFATO DE GOVERNANÇA PARA VALIDAÇÃO | Complemento do Doc. 07 | Revisor técnico |
| Inventário de evidências | `rastreabilidade/inventario-evidencias.md` | ARTEFATO DE GOVERNANÇA PARA VALIDAÇÃO | Todas as fontes examinadas | Revisor técnico; revisor filosófico/curatorial (fontes documentais) |
| Histórico de decisões | `decisoes/historico-decisoes.md` | REGISTRO DE DECISÕES PARA VALIDAÇÃO | Documentos, commits, código | Responsável pelo produto (23 decisões pendentes; 2 aprovadas: D-GOV-01 em DEC-15 e D-08-04 em DEC-CUR-05; DEC-CUR-02 a 09 registradas; 11 conflitos preservados, 1 resolvido) |
| ADR-CUR-01 — Camada curatorial do Conselho | `decisoes/ADR-CUR-01-camada-curatorial-do-conselho.md` | REGISTRO DE DECISÕES PARA VALIDAÇÃO | Doc. 14; Docs. 04, 08, 12, 13; código | Responsável pelo produto (conflitos C-CUR-1 a C-CUR-5); revisor filosófico/curatorial (classificação, candidatos, tradições); revisor técnico (modelo de dados e seleção) |
| ADR-CUR-02 — Tradições como corpus de apoio; recorte do Dalai Lama | `decisoes/ADR-CUR-02-papel-das-tradicoes-e-corpora.md` | REGISTRO DE DECISÕES PARA VALIDAÇÃO | DEC-CUR-02, DEC-CUR-03; fontes oficiais do Dalai Lama | Revisor filosófico/curatorial (vínculo Gelug, recorte das tradições) |
| ADR-CUR-03 — Pesos, taxonomia e diversidade da seleção | `decisoes/ADR-CUR-03-pesos-e-diversidade-da-selecao.md` | REGISTRO DE DECISÕES PARA VALIDAÇÃO | DEC-CUR-05, 06, 07; Docs. 04, 13 v2, 14 | Revisor técnico (critérios, piso de pertinência); responsável pelo produto (efeito da diversidade) |
| ADR-CUR-04 — Fontes-base e revisão das relações | `decisoes/ADR-CUR-04-fontes-e-revisao-das-relacoes.md` | REGISTRO DE DECISÕES PARA VALIDAÇÃO | DEC-CUR-04, 08; páginas de editores e registros institucionais | Revisor filosófico/curatorial (edições, traduções, revisão das relações) |
| ADR-CUR-05 — Medição do bundle | `decisoes/ADR-CUR-05-medicao-do-bundle.md` | REGISTRO DE DECISÕES PARA VALIDAÇÃO | DEC-CUR-09; medição do build | Revisor técnico |
| Comparação v1 × v2 × v2.1 (revisão DEC-CUR-10) | `curadoria/comparacao-politicas-selecao-v2.1.md` | ARTEFATO DE GOVERNANÇA PARA VALIDAÇÃO (gerado por teste) | Motor de seleção; 79 entradas de referência | Revisor técnico; responsável pelo produto |
| Comparação das políticas de seleção (A/B) | `curadoria/comparacao-politicas-selecao.md` | ARTEFATO DE GOVERNANÇA PARA VALIDAÇÃO (gerado por teste) | Motor de seleção; 79 entradas de referência | Revisor técnico; responsável pelo produto |
| Inventário das 189 relações (v1) | `curadoria/inventario-relacoes-v1.md` | ARTEFATO DE GOVERNANÇA PARA VALIDAÇÃO (gerado por teste) | `thinker-virtues.json`; camada curatorial | Revisor filosófico/curatorial |

## Fontes

As fontes, com identificador, localização e uso, estão em `rastreabilidade/inventario-evidencias.md`. Resumo:

- Documentos oficiais no repositório (01, 02, 03, 04, 06, 07, 08, 12, 13 v2).
- Documentos locais, fora do repositório e não públicos: Documento 13 v1, Engenharia Reversa do protótipo, apresentação em PDF, Auditoria UX, Relatório final de UX, prompts de pendências externas.
- Código, dados, migrações, testes, CI e `vercel.json` no commit `b23ddac`.
- Histórico Git (38 commits).

## Documentos e fontes não localizados

"Não localizado" significa ausente das fontes examinadas, e não que nunca tenha existido.

| Item | Situação |
|---|---|
| Documento 05 | Citado pelos Docs. 06, 07 e 08; não localizado. Reconstruído para validação. |
| Documento 09 | Anunciado pelos Docs. 07 e 08; não localizado. Reconstruído para validação. |
| Documentos 10 e 11 | Nenhum arquivo, referência cruzada, menção no README ou registro no histórico Git. **Não foram criados.** |
| Documento 07 V1.0 | Citado no controle de alterações do V2.0; não localizado. |
| Auditoria Consolidada da Jornada da Virtude — 23/11/2026 | Não localizada. |
| Revisão de Compatibilidade Documental | Não localizada. |
| Épicos E01–E16, itens CS-00–CS-16, ADR-CS-01–08 | Identificadores não encontrados em nenhuma fonte examinada. |

## Regras de manutenção

1. **Originais intocados.** Os documentos oficiais em `docs/` não são editados por esta governança. Uma nova versão de um oficial é um arquivo novo, com histórico, e preserva o anterior.
2. **Status.** Todo documento desta pasta começa com a classificação "… PARA VALIDAÇÃO" do seu tipo (seção "Classificação documental") e só muda de status por decisão registrada em `decisoes/historico-decisoes.md`, com papel, responsável e data.
3. **Requisitos em dois eixos.** Nos requisitos, o **status de implementação** (IMPLEMENTADO, PARCIALMENTE IMPLEMENTADO, NÃO IMPLEMENTADO, PROPOSTO, A VALIDAR) é separado do **status de evidência** (TESTE UNITÁRIO, TESTE DE INTEGRAÇÃO, TESTE E2E, INSPEÇÃO ESTÁTICA, VALIDAÇÃO MANUAL EM PRODUÇÃO, SEM EVIDÊNCIA IDENTIFICADA). Os totais contam cada item uma vez.
4. **Evidência obrigatória.** Toda afirmação sobre o que está implementado cita arquivo, símbolo, teste ou commit. Sem teste, a coluna "Teste" diz SEM TESTE IDENTIFICADO, e o status de evidência é INSPEÇÃO ESTÁTICA (código lido) ou SEM EVIDÊNCIA IDENTIFICADA (nada verificável). Itens sem código recebem o status de implementação NÃO IMPLEMENTADO, PROPOSTO ou A VALIDAR.
5. **Divergências não se resolvem em silêncio.** Documento e código divergentes geram um conflito (`C-xx`) ou uma pendência (`D-xx`), com as duas posições.
6. **Matriz sincronizada.** A matriz de rastreabilidade é gerada a partir do complemento do Documento 07. Ao alterar um, atualize o outro.
7. **Histórico de revisão.** Toda alteração acrescenta uma linha ao histórico do documento: versão, data e descrição.
8. **Privacidade.** O repositório é público. Não incluir dados pessoais, caminhos locais de máquina nem registros de usuários.
9. **Ciclo de revisão.** Revisar esta pasta a cada entrega que mude requisitos, arquitetura, dados ou segurança.
