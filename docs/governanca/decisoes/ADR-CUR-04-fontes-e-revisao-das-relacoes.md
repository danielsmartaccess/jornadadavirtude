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
