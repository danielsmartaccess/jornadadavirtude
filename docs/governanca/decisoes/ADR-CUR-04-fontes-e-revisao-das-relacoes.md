# ADR-CUR-04 — Fontes-base e revisão das relações

| Campo | Valor |
|---|---|
| Decisões | DEC-CUR-04 (bibliografia-base dos nove habilitados sem obra) e DEC-CUR-08 (revisão das 189 relações, sem validação em lote) |
| Status | Decisões de produto APROVADAS pelo responsável pelo produto em 2026-11-23 (Fase 2). Nenhuma relação foi validada, suspensa ou rejeitada. |
| Data | 2026-11-23 |
| Base | Documento 13 v2 §7.2 ("fonte recuperável"); Documento 14 §9; ADR-CUR-01 (conflito C-CUR-2) |
| Revisão futura | Revisor filosófico/curatorial: edições e traduções consultadas; revisão individual das relações |

## DEC-CUR-04 — Referências-base

**Onde ficam.** Em `src/data/curadoria/referencias-base.json`: 12 referências para os 9 habilitados que não tinham obra no catálogo.
- **Identificadores.** Usam o prefixo `REF-` e não colidem com as obras W01–W21. As 21 obras e o `works.json` não mudaram.
- **Campos de cada registro.** `workId`, título e título original, autores, organizador, tradutor, editora, ano, edição, ISBN, DOI, URL, idioma, tipo de fonte, situação da conferência (fonte consultada, registro, o que foi confirmado e lacunas) e nota de atribuição.
- **Regra de preenchimento.** Só o que a página do editor ou o registro institucional mostrou na data da conferência; o resto fica `null` e aparece em "lacunas".
- **Discrepâncias.** ISBN visto apenas na URL **não** foi registrado como ISBN.

| Pessoa | Referência | Tipo | Conferência | Principais lacunas |
|---|---|---|---|---|
| Sócrates | Platão, *Apologia de Sócrates*; Xenofonte, *Memorabilia*; Aristófanes, *As Nuvens* | Testemunho (`source_witness_for`) | Natureza dos testemunhos conferida na SEP (Nails e Monoson, rev. 2022) | Edição e tradução de cada texto |
| Miyamoto Musashi | *The Book of Five Rings* | Obra autoral traduzida | Shambhala: tradução de William Scott Wilson, 2012, ISBN 9781590309841 | Título original na página; linhagem textual; ISBN divergente nos links de varejo |
| Simone Weil | *Gravity and Grace* | Compilação póstuma (org. Gustave Thibon) | Routledge Classics, 2003 | Tradutor; ISBN no texto da página |
| Richard Feynman | *"Surely You're Joking, Mr. Feynman!"* | Memórias editadas (Ralph Leighton, Editor) | W. W. Norton, ISBN 9780393316049 | Data da edição sem rótulo |
| Richard Feynman | *The Character of Physical Law* | Divulgação científica | A confirmar (página do editor: HTTP 403) | Editora, ano, ISBN |
| Karl Popper | *The Logic of Scientific Discovery* | Obra autoral | Routledge Classics, 2ª ed., 2002 | ISBN no texto; original alemão; tradução consultada |
| Edith Stein | *On the Problem of Empathy* | Obra autoral traduzida | Crossref (DOI 10.1007/978-94-017-7127-6): Springer Netherlands, 1964, ISBN 9789401770910 | Tradutor; edição consultada |
| Benjamin Franklin | *The Autobiography of Benjamin Franklin* | Obra autoral | **A confirmar**: o guia da Library of Congress não pôde ser lido (HTTP 403) | Edição crítica, editor, editora, ano, ISBN |
| Peter Drucker | *The Effective Executive* | Obra autoral | Routledge, 1st Edition, 2007 | ISBN no texto; ano da primeira publicação |
| Dalai Lama | *Ethics for the New Millennium* | Obra autoral (a página credita só o autor) | Riverhead Books, 2001-05-01, ISBN 9781573228831 | Colaboração editorial a conferir no exemplar; edição brasileira |

**Cuidados de atribuição registrados em cada nota:**
- Sócrates não deixou obra autoral; os testemunhos de Platão, Xenofonte e Aristófanes divergem e não são textos dele.
- Weil é compilação póstuma.
- As memórias de Feynman foram editadas por Leighton e não provam teoria epistemológica.
- Drucker trata de eficácia gerencial, não de teoria geral das virtudes.
- Franklin tem história editorial complexa.

**Efeito na seleção (DEC-CUR-05).** A qualidade da fonte do autor vale:
- 1 com obra no catálogo ou referência conferida;
- 0,5 com referência a conferir (Sócrates e Franklin);
- 0 sem nada.

É disponibilidade de fonte do autor. **Não** liga referência a relação: nenhuma das 189 relações aponta para um `REF-*` (teste), e o conflito C-CUR-2 fica resolvido sem excluir ninguém.

## DEC-CUR-08 — Inventário de revisão das 189 relações

**Onde fica.** `docs/governanca/curadoria/inventario-relacoes-v1.md`, gerado por teste a partir dos dados (não editável à mão). Contém:
- ID, autor e papel, virtude;
- P1–P4, prioridade no Documento 04, fontes documentais, obras;
- disponibilidade de fonte do autor;
- tipo de justificativa;
- F1–F4 (vazio);
- status, prioridade de revisão, necessidade de especialista;
- conceito, revisor e data (em branco).

**Relatórios no mesmo arquivo:**
- resumo da triagem;
- concentração por autor;
- cobertura por virtude e por universo.

**Regras da triagem** (ordem de trabalho; não é validação nem escala de evidência):
- **Alta:** tradição/corpus, tradição espiritual ou contemplativa, Sócrates, ou justificativa pendente.
- **Média:** justificativa genérica do autor e nenhuma obra ligada à relação.
- **Baixa:** as demais. Baixa não significa validada.

**Resultado:**
- **Prioridade:** 81 alta, 19 média, 89 baixa; 71 precisam de especialista.
- **Justificativas:** 161 repetem o campo geral do autor, não a virtude; 23 estão pendentes; só 5 são específicas (Documento 04 §3.2).
- **Obras:** 57 relações não têm obra ligada.

**Auditoria anterior.** A triagem 41 / 125 / 15 / 8 da auditoria não foi reconfirmada item a item, porque a lista não foi registrada no repositório. Os números deste inventário vêm de regras explícitas e reproduzíveis.

**Garantias:**
- todas as 189 continuam `proposta`;
- nenhuma evidência F1–F4 foi preenchida;
- ausência de fonte cadastrada **não** é F4: as 189 continuam utilizáveis (teste);
- anacronismos não são detectáveis automaticamente com os dados atuais e ficam para a revisão individual.

**Fluxo:**
1. Inventariar (feito).
2. Agrupar por autor, virtude e fonte (feito no relatório).
3. Identificar justificativas genéricas (feito).
4. Propor fontes por relação.
5. Revisar individualmente.
6. Encaminhar casos frágeis a especialista.
7. Só então, por decisão humana formal, alterar status.

## Alternativas rejeitadas

- **Associar as referências-base em bloco às relações dos nove.** Proibido pela DEC-CUR-04.
- **Preencher F3 em lote para relações com justificativa do Documento 04.** Seria validação por inferência.
- **Marcar F4 nas relações sem obra.** Ausência de fonte não é F4.
- **Completar ISBN, tradutor ou edição de memória.** Rejeitado.

## Pendências

- Conferir as edições de Franklin e de *The Character of Physical Law*.
- Registrar tradutores e edições consultadas.
- Avaliar *Attente de Dieu* (Weil) e *Conjectures and Refutations* (Popper), indicados como "considerar".
- Revisar individualmente as 189 relações.

## Revisão humana (2026-11-23) — DEC-CUR-10: Sócrates e o fator 0,5

### Origem do 0,5

- **Onde nasce.** `qualidadeDaFonte` (`src/domain/curadoria.ts`), usada só pela política v2: vale 1 com obra no catálogo ou referência-base com metadados conferidos; **0,5** quando as referências-base existem mas nenhuma tem metadados conferidos; 0 sem nada.
- **Quem recebia 0,5:** Sócrates (três testemunhos com edição a confirmar) e Benjamin Franklin (edição crítica não escolhida).
- **O que afetava:** só o critério "fontes" (15%) e o 2º desempate do Documento 13 §7.3; não exclui ninguém.
- **O problema.** Ele misturava duas coisas diferentes: a ausência de metadados editoriais (completude bibliográfica) virava meia nota de qualidade de fonte, sem nenhuma avaliação epistemológica.

### Dimensões separadas

| Dimensão | Onde fica | Valores | Entra na pontuação? |
|---|---|---|---|
| Fonte identificada (disponibilidade) | `temFonteIdentificada` | sim / não | Sim, na v2.1 (1/0): obra do catálogo ou referência-base que identifica obra ou testemunho |
| Completude bibliográfica | `completudeBibliografica` | completa / parcial / pendente (editora, ano, ISBN ou DOI) | Não |
| Situação da conferência | `conferencia.situacao` | metadados conferidos / edição a confirmar / a confirmar | Não |
| Confiabilidade epistemológica | `confiabilidade` | `nao_avaliada` para todas as referências; para Sócrates, natureza de cada testemunho com localização | Não: sem rubrica aprovada, não é inferida e não pontua para ninguém |

### Testemunhos de Sócrates (SEP, Nails e Monoson, rev. 2022-05-26)

- **Sem obra escrita:** introdução, "despite having written nothing"; §2.1, Plato, "a dead philosopher who never wrote anything himself".
- **Platão (§2.1, Plato):** relato privilegiado pelos filósofos; Platão pode ter moldado o personagem.
- **Xenofonte (§2.1, Xenophon):** memórias descritas como "pastiches", algumas impossíveis como apresentadas.
- **Aristófanes (§2.1, Aristophanes):** comédia, fonte mais antiga preservada (c. 423 a.C.), gênero "tricky"; o texto preservado é uma revisão da peça.
- **Independência entre os testemunhos:** a SEP não a declara (há divergência, corroboração parcial entre Platão e Xenofonte, e alusão de Platão à comédia). O cadastro mantém os três separados, como `source_witness_for`, nunca como obras de Sócrates, e não os associa às 189 relações.

### Efeito no CASE05 (pelos identificadores)

- **Na v2:** Sócrates (0,5313) perdia a 5ª vaga para Musashi (0,5438) por 0,0125. A diferença vinha inteira do 0,5 de fonte: as demais pontuações de Sócrates não mudaram.
- **Na v2.1:** com fonte identificada = 1, Sócrates soma 0,6062 e volta.
- **Pertinência:** pelas definições da DEC-CUR-10, Sócrates é a voz com pertinência contextual documentada (integra o caso: "Investigação dos pressupostos"; temática demonstrada em TV-V03-socrates). Musashi não integra o caso (contextual `insufficient_data`), embora tenha relação mais forte com as virtudes pedidas (0,775 contra 0,425).
- **Vaga acima do limite:** a vaga 5 continua acima do limite de "Filosofia e ética", com exceção registrada (`sem-alternativa-qualificada`).

Detalhe reproduzível em `comparacao-politicas-selecao-v2.1.md`, seção "CASE05".

### Pendências editoriais que continuam

Edição e tradução dos três testemunhos; edição crítica da autobiografia de Franklin; *The Character of Physical Law*; tradutores de Weil e Stein. Uma rubrica de confiabilidade, se adotada, exige decisão própria.

## Revisão DH-T-04 (2026-11-25) — DEC-CUR-14: identidade bibliográfica de W08

### Problema identificado

A obra W08 ("Tratado das Virtudes"), atribuída a Tomás de Aquino, tem identidade bibliográfica ambígua:

- **Origem única.** Só o Documento 03 (§14) a lista, ao lado da *Suma Teológica*. O Documento 04 lista só a *Suma Teológica*; o Documento 12 lista *Suma Teológica* e *Suma contra os Gentios*. O campo `source` de W08 ("Documentos 03 e 04") é impreciso.
- **Duas fontes distintas na interface.** A página do pensador, o bloco de cada virtude e a linha "Fontes" da contribuição do Conselho mostram *Suma Teológica* e *Tratado das Virtudes* como obras independentes.
- **Dez relações.** V01, V03, V06, V13, V18, V22, V39, V44, V45 e V46 citam `["W07","W08"]` juntas, com a mesma justificativa genérica do Documento 04.

### Decisão humana (aprovada em 25/11/2026)

1. **Identidade.** W08 é o título editorial *Treatise on the Virtues*, correspondente à seção da *Suma Teológica*, I-II, questões 49–67, e não uma obra autônoma. A decisão registra que essa é a identidade **mais provável**, sustentada pela correspondência entre o título e a faixa de questões, e que **não confirma a intenção original do autor do Documento 03**.
2. **Registro.** (a) `classificacao.nota` de `tomas-de-aquino`; (b) complemento do título de W08: "(Suma Teológica, I-II, qq. 49–67)".
3. **Não autorizado.** Remover W08, alterar as dez relações ou outros registros bibliográficos.
4. **Pendências separadas.** Correção do campo `source`; confirmação da intenção do Documento 03; duplicidade W07/W08, que fica para a revisão geral das relações.

### Fontes reabertas (25/11/2026)

| Fonte | O que confirma | O que não confirma |
|---|---|---|
| Project MUSE, livro 45466 (Notre Dame Press) | Título "Treatise on the Virtues"; sumário da Questão XLIX ("Habits in General") à LXVII ("The Duration of the Virtues after this Life"); a página cita a tradução de Oesterle e mostra 1966 (copyright) e 2019 (cabeçalho) | Que o volume seja a *Suma Teológica*, I-II: a página não menciona "Summa" nem "I-II" |
| SEP, "Aquinas" | A *Suma* tem a `prima secundae` sobre ação humana, paixão, virtude, vício, lei e graça; as questões disputadas formam categoria própria, distinta das *summae* | A numeração exata das questões |
| CiNii e Cambridge (*Disputed Questions on Virtue*) | As *Quaestiones disputatae de virtutibus* são obra distinta, em cinco partes (virtudes em geral, caridade, correção fraterna, esperança, virtudes cardeais), do segundo magistério parisiense, 1269–1272 | Qualquer ligação com o título "Tratado das Virtudes" |
| Dois artigos acadêmicos que citam a *Suma de Teologia* (Loyola, 2012, coordenação de Carlos-Josaphat Pinto de Oliveira) | O volume 4 contém o texto de I-II sobre hábitos e virtudes | Conferência com o catálogo da editora (inferido das citações) |
| Biblioteca do Congresso, LCCN 66018262 | Nada: o catálogo respondeu 403 e **não foi verificado**. A informação de que a edição de 1966 estaria catalogada como "De virtutibus in communi" vem só da Fase 3A | Título uniforme, tradutor, editora e notas |

### Evidência e grau

- **Fato.** O volume de Oesterle tem o título "Treatise on the Virtues" e cobre as Questões XLIX a LXVII. A faixa "55–67", sugerida por um relatório da Fase 3A, está refutada: o volume começa na q. 49.
- **Inferência de alta confiança.** Essas questões são da *Suma Teológica*, I-II. A página do MUSE não diz isso. A correspondência vem dos títulos e da numeração das questões.
- **Inferência de confiança moderada.** "Tratado das Virtudes" é a tradução literal de "Treatise on the Virtues", e o Documento 03 lista *Suma* e *Tratado* lado a lado. Isso combina com um rótulo editorial de parte da *Suma*. Nenhum documento do projeto confirma a intenção.
- **Hipótese descartada nesta etapa, não refutada.** A de que W08 seja as *Quaestiones disputatae de virtutibus*. Combina com "cardeais e teologais" e com esperança e caridade, mas o título em português seria outro e nada no projeto aponta para ela. A nota não a adota nem a exclui.
- **Hipótese não verificada.** "Tratado das Virtudes" como nome convencional de seção na literatura lusófona. A pista de um relatório anterior (um capítulo de Strefling, UFPel) não foi aberta, e não achei edição brasileira com esse título.

### O que foi alterado

| Onde | Mudança |
|---|---|
| `works.json` | Título de W08: "Tratado das Virtudes" passa a "Tratado das Virtudes (Suma Teológica, I-II, qq. 49–67)". O restante do registro (ID, `thinkerId`, `source`) fica igual. A impressão digital do arquivo passa de `659be0a8` para `78192ed3` |
| `classificacao.json` | `nota` de `tomas-de-aquino`: "W08 corresponde ao título editorial Treatise on the Virtues, associado à Suma Teológica, I-II, questões 49–67. Não deve ser interpretado como obra autônoma distinta da Suma Teológica. A identificação decorre da correspondência bibliográfica entre o título e o conteúdo do volume, não de confirmação explícita da intenção do Documento 03." Tipo e universos não mudam |

### O que foi preservado

- W08 e seu ID, W07 e as dez relações (mesmos `workIds`, mesma justificativa, todas `proposta`).
- `thinkers.json` (Tomás segue com `workIds` `["W07","W08"]`), as 189 relações, os flags `council`, pesos, política de diversidade, gate de crise, schema e os snapshots v1, v2 e v2.1. Os snapshots fixam o ID W08, não o título.
- O motor de seleção só usa `workIds` (IDs); não lê título de obra nem `nota`.

### Fora do escopo e limitações

- **Duplicidade W07/W08.** Se W08 é parte de W07, as dez relações contam o mesmo texto duas vezes. Isso é decisão de curadoria da revisão geral das relações, e esta correção bibliográfica não a disfarça.
- **Cobertura de W08.** O volume trata das teologais só em geral (I-II q. 62). O tratamento específico de fé e esperança está na II-II, parte de W07. A identificação de W08 não valida nem derruba as dez relações.
- **Campo `source`.** Segue "Documentos 03 e 04", embora W08 conste só do Documento 03. Pendência separada.
- **Intenção do Documento 03.** Só o responsável pela curadoria original pode confirmá-la.
- **Registro da Biblioteca do Congresso.** Não verificado (acesso negado ao catálogo). Não é necessário para esta decisão: o sumário do MUSE fixa a faixa de questões.
- **Efeito.** Nenhum na seleção. O chunk do Conselho vai de 65,49 para 65,85 kB (+0,36 kB, o texto da nota) e o arquivo principal de 506,83 para 506,87 kB (+0,04 kB, o título novo, que fica em `works.json`). Medido isolado sobre a `main`. Com a DH-T-03 integrada, o chunk do Conselho fica em 66,81 kB (+1,32 sobre a `main`) e o arquivo principal em 506,87 kB (+0,04).

### Arquivos e testes

- Alterados: `works.json`, `classificacao.json`, `tests/unit/conselho-w08-dht04.test.ts` (novo, 12 testes), `tests/unit/curadoria-conselho.test.ts` (impressão de `works`), `tests/unit/conselho-notas-transmissao.test.ts` (conjunto de registros com nota, de 15 para 16), `tests/e2e/conselho-biblioteca.spec.ts` (um teste novo), `historico-decisoes.md` (v0.11) e este ADR.
- Estabilidade: impressões digitais medidas na `main` antes da alteração provam que as outras 20 obras, os outros campos de W08, as outras 41 classificações e os outros campos de Tomás são idênticos.
- Prova de que os testes pegam mudanças: 11 mutações nos dados (título original de volta, faixa errada, fonte de W08, título de W07, título de outra obra, limite da nota removido, hipótese alternativa adotada, nota removida, tipo de Tomás, W08 retirada de uma relação, W08 retirada do registro de Tomás), todas reprovadas, mais uma mutação reprovada pelo E2E. A mutação de uma relação não se aplicou na primeira tentativa (lista em várias linhas) e foi refeita via JSON antes de ser contada.
- Resultados: 357 testes unitários (25 arquivos), `tsc --noEmit`, build e 96 testes E2E (suíte completa, 4 workers, uma rodada). Ressalva: a suíte E2E tem instabilidade sob carga conhecida nesta máquina (na rodada equivalente da DH-T-03, 3 testes de outros arquivos falharam a 4 workers e passaram em série; a `main` também falha de forma intermitente). Uma rodada limpa não é evidência de estabilidade, e a CI e as Previews seguem como a barreira de validação. Na árvore integrada com a DH-T-03: 371 testes unitários (26 arquivos), `tsc` e build sem falhas e 97 testes E2E. A primeira rodada completa teve 2 falhas, que não foram capturadas por nome; as três rodadas seguintes passaram 97/97 (4 workers). Isso não é evidência de estabilidade.
