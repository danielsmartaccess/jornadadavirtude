# ADR-CUR-01 — Camada curatorial do Conselho de Sabedoria

| Campo | Valor |
|---|---|
| Status | PROPOSTA PARA VALIDAÇÃO (decisão técnica desta entrega; não altera status de governança) |
| Data | 2026-11-23 |
| Base | Documento 14 v1.0 ("Proposta curatorial para validação"), Documentos 04, 08, 12 v2.0 e 13 v2.0; código no commit `093ef96` |
| Papéis de validação | Responsável pelo produto; revisor técnico; revisor filosófico/curatorial |

## Contexto

O Documento 14 propõe ampliar o Conselho para um acervo plural, com universos, tipos de participação, tradições que não são pessoas, candidatos em estado proposto e evidências por relação (escala F1–F4 e status independentes). Ele também exige preservar os 34 integrantes do Documento 12, os 27 habilitados e as 189 relações, sem habilitar ninguém novo.

No código, o catálogo é JSON somente leitura em `src/data/`, embutido no build. Os dados do usuário ficam em `localStorage` (schema 4, saneados por `sanitize.ts`), e o Supabase só guarda dados do usuário e o conteúdo da Gita. O catálogo não passa por nenhum dos dois.

## Decisão

1. **Camada separada, aditiva.** O que é novo fica em `src/data/curadoria/`:
   - `universos.json`;
   - `classificacao.json` (tipo e universos das 42 entradas existentes);
   - `candidatos.json` (28);
   - `tradicoes.json` (14);
   - `doc12.json` (mapa PENS-001…034);
   - `evidencias.json`.

   O domínio fica em `src/domain/curadoria.ts`. Os JSON originais (`thinkers`, `thinker-virtues`, `works`, `council-cases`) **não são editados**. Um teste guarda a impressão digital do conteúdo de cada um.
2. **Habilitação inalterada.** Participar da seleção continua sendo o campo `council` do catálogo original. Os candidatos têm `habilitado: false` fixo e não têm relações com virtudes.
3. **Identificadores.** Seguem a convenção existente (slugs). Os do Documento 12 (`PENS-NNN`) ficam como correspondência, em `doc12.json`, sem renomear nada. As sessões já gravadas usam os slugs.
4. **Três escalas separadas:**
   - `relationType` (P1–P4 do Documento 04), intocado;
   - a escala da auditoria de curadoria, **não importada**;
   - `nivel` (F1–F4 do Documento 14), que existe só nas evidências da camada nova. Nenhum valor F1–F4 foi preenchido: `evidencias.json` começa vazio.
5. **Status ampliado de forma aditiva.** `ValidationStatus` ganha `em_revisao` e `rejeitada`. Os valores antigos continuam válidos, e nenhum dado muda de status.
6. **Seleção:**
   - **Contexto injetável:** `selecionarPerspectivas`, para testes com dados de teste.
   - **Relações fora da seleção:** além das `suspensa` (que já eram ignoradas), também as `rejeitada` e as que têm evidência F4.
   - **Tradição × autor nomeado:** o registro de uma tradição e um autor nomeado no Documento 14 (`autoresRelacionados`) não entram juntos como vozes independentes.
   - **Prova de não mudança:** com os dados atuais, nenhuma dessas regras altera a seleção. Isso é provado pelo snapshot `tests/unit/__snapshots__/conselho-selecao-referencia.test.ts.snap`, gravado antes da mudança, no commit `931cd9c`.
   - **Sem mudança de regra numérica:** pesos e limites não mudaram.
7. **Dados do usuário:** nenhuma mudança de schema, de `sanitize.ts`, de `localRepository.ts` ou do Supabase. Não há migração de dados do usuário, porque o catálogo não é dado do usuário.
8. **Interface (`/conselho/pensadores`):**
   - A página vira uma biblioteca com quatro grupos: integrantes (27), tradições (14), candidatos (28) e outras referências (15).
   - Filtros por categoria, universo, tipo de participação, virtude, dimensão e palavra-chave.
   - Cada cartão mostra tipo, universos e se participa ou não do Conselho. Candidatos, tradições e referências trazem "Não habilitado · não participa do Conselho". Tradições e escolas trazem "não é uma pessoa".
   - Candidatos e tradições têm página própria na mesma rota de detalhe; a tradição é apresentada como recorte de estudo, sem biografia.
   - Sem imagens: emblemas e assinaturas continuam só nos integrantes; as demais entradas usam monograma tipográfico. Nenhum recurso remoto.
   - A página do integrante mostra tipo, universos e o estado da fundamentação por relação (hoje: não avaliada).

## Conflitos registrados (não resolvidos)

| Id | Conflito | Situação nesta entrega |
|---|---|---|
| C-CUR-1 | "Tradições budistas" está habilitada e disputa a seleção com indivíduos. O Documento 14 §8 diz que tradições budistas não devem disputar com autores; o §6 manda preservar os 27 habilitados. | Mantida habilitada; classificada como `tradicao-corpus`; conflito anotado em `tradicoes.json`. Decisão de produto pendente. |
| C-CUR-2 | O Documento 13 v2 exige "fonte recuperável", mas 9 habilitados não têm obra cadastrada. Excluí-los violaria "os 27 continuam elegíveis". | Nenhuma exclusão. Pendente de cadastro bibliográfico ou de decisão. |
| C-CUR-3 | O motor usa os pesos do Documento 04 (35/30/15/10/10); o Documento 13 propõe 30/25/15/15/10/5 (já registrado como C-02 e D-08-04). | Pesos não alterados. |
| C-CUR-4 | Universo e tipo de participação das 42 entradas existentes e dos 28 candidatos foram atribuídos nesta entrega a partir do campo/tradição descrito nos documentos. | Classificação marcada como `proposta`; exige validação curatorial. |
| C-CUR-5 | A relação entre "Tradições budistas" e Dalai Lama (tradição × representante) não está explícita no Documento 14. | Não inferida. Hoje os dois podem ser convocados juntos. |

## Consequências

- **Positivas.** O catálogo ganha estrutura para pluralidade e evidência sem risco para os dados atuais. Todas as regras novas têm teste com dados de teste e prova reversa.
- **Limites.**
  - Nenhuma das 189 relações recebeu evidência nova.
  - As obras continuam associadas em bloco no catálogo original; o vínculo por relação só existirá quando a curadoria preencher `evidencias.json`.
  - O limite de concentração de um autor não foi definido (Documento 14 §16). O teste prova apenas que o número de relações cadastradas não aumenta a pontuação.
- **Para habilitar um candidato,** será preciso uma decisão formal: incluir no catálogo original com `council: true`, relações individualizadas e evidências validadas.

## Pendências (Documento 14 §16)

Composição final do catálogo habilitado; validação individual dos 15 candidatos e pesquisa dos 3 adicionais; modelo definitivo das vozes literárias; recorte de cada tradição; revisão especializada; revisão individual das 189 relações; limites quantitativos de concentração; eventual suspensão de relações.
