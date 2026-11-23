# Inventário de revisão das relações pensador–virtude (v1)

> Gerado por `tests/unit/support/inventario-relacoes.ts` (teste `relatorios-curadoria.test.ts`). Não editar à mão: rode `RELATORIOS=1 npx vitest run tests/unit/relatorios-curadoria.test.ts`.

| Campo | Valor |
|---|---|
| Decisão | DEC-CUR-08 (ver ADR-CUR-04) |
| Relações | 189 |
| Status | 189 proposta |
| Evidências F1–F4 preenchidas | 0 |
| Revisor e data | Nenhuma relação revisada individualmente ainda |

## Como ler

- **Nenhuma relação foi validada, suspensa ou rejeitada por este inventário.** Mudança de status só depois de revisão individual e decisão humana formal.
- **Ausência de fonte cadastrada não é F4.** F4 é "fundamentação insuficiente" depois de análise; aqui a coluna F fica vazia até haver evidência conferida.
- **Três escalas que não se confundem:** `relationType` P1–P4 (Documento 04); F1–F4 (Documento 14, só em evidências); e a prioridade de revisão abaixo (alta, média, baixa), que é só ordem de trabalho.
- **Prioridade de revisão (regras):**
  - *alta*: tradição/corpus, tradição espiritual ou contemplativa, Sócrates (testemunhos) ou justificativa pendente;
  - *média*: justificativa genérica do autor e nenhuma obra ligada à relação;
  - *baixa*: as demais (justificativa específica do Documento 04, ou genérica com obra ligada). Baixa não quer dizer validada.
- **Anacronismos e limites:** os dados não têm marcação que permita detectá-los automaticamente. Ficam para a revisão individual, junto com o campo "Limites" de cada autor no catálogo.
- **Auditoria anterior:** sugeriu a triagem 41 / 125 / 15 / 8 (manter proposta com justificativa / buscar fonte / especialista / avaliar suspensão). A lista item a item não foi registrada no repositório; por isso estes números não foram reconfirmados um a um. Os totais abaixo vêm das regras explícitas deste inventário.

## Resumo da triagem

| Indicador | Relações |
|---|---:|
| Prioridade de revisão alta | 81 |
| Prioridade de revisão média | 19 |
| Prioridade de revisão baixa | 89 |
| Precisam de revisão especializada | 71 |
| Justificativa: Campo geral do autor, repetido em várias virtudes | 161 |
| Justificativa: Específica (Documento 04, seção 3.2) | 5 |
| Justificativa: Pendente ("justificativa detalhada pendente de curadoria") | 23 |
| Nenhuma obra ligada à relação | 57 |
| Autor sem nenhuma fonte recuperável | 22 |
| Autor com fonte identificada, mas metadados editoriais a conferir (não é falta de fonte nem baixa confiabilidade) | 12 |
| De registros não habilitados (não fundamentam perspectiva hoje) | 23 |
| De corpus de apoio (Tradições budistas) | 11 |

## Concentração por autor

| Autor | Papel | Relações | Parte do total | Prioridade alta | Sem obra na relação |
|---|---|---:|---:|---:|---:|
| Aristóteles | voz | 30 | 15,9% | 0 | 0 |
| Confúcio | voz | 18 | 9,5% | 18 | 0 |
| Marco Aurélio | voz | 12 | 6,3% | 0 | 0 |
| Tradições budistas | corpus de apoio | 11 | 5,8% | 11 | 0 |
| Platão | voz | 10 | 5,3% | 0 | 0 |
| Tomás de Aquino | voz | 10 | 5,3% | 10 | 0 |
| Sócrates | voz | 9 | 4,8% | 9 | 9 |
| Immanuel Kant | voz | 7 | 3,7% | 0 | 0 |
| Miyamoto Musashi | voz | 6 | 3,2% | 0 | 6 |
| Sêneca | voz | 6 | 3,2% | 0 | 0 |
| Epicteto | voz | 4 | 2,1% | 0 | 0 |
| Estoicismo | não habilitado | 4 | 2,1% | 4 | 4 |
| Simone Weil | voz | 4 | 2,1% | 4 | 4 |
| Benjamin Franklin | voz | 3 | 1,6% | 0 | 3 |
| Cícero | não habilitado | 3 | 1,6% | 3 | 3 |
| Dalai Lama (Tenzin Gyatso) | voz | 3 | 1,6% | 3 | 3 |
| Daniel Kahneman | voz | 3 | 1,6% | 0 | 0 |
| Donella Meadows | voz | 3 | 1,6% | 0 | 0 |
| John Stuart Mill | voz | 3 | 1,6% | 0 | 0 |
| Karl Popper | voz | 3 | 1,6% | 0 | 3 |
| Lao-Tsé | voz | 3 | 1,6% | 3 | 0 |
| Peter Drucker | voz | 3 | 1,6% | 0 | 3 |
| Richard Feynman | voz | 3 | 1,6% | 0 | 3 |
| Tradições cristãs | não habilitado | 3 | 1,6% | 3 | 3 |
| Viktor Frankl | voz | 3 | 1,6% | 0 | 0 |
| Erich Fromm | voz | 2 | 1,1% | 0 | 0 |
| John Locke | voz | 2 | 1,1% | 0 | 0 |
| John Rawls | voz | 2 | 1,1% | 0 | 0 |
| Nassim Taleb | voz | 2 | 1,1% | 0 | 0 |
| Tradições humanistas | não habilitado | 2 | 1,1% | 2 | 2 |
| Adam Smith | não habilitado | 1 | 0,5% | 1 | 1 |
| Bertrand Russell | não habilitado | 1 | 0,5% | 1 | 1 |
| Bhagavad Gita | não habilitado | 1 | 0,5% | 1 | 0 |
| Edith Stein | voz | 1 | 0,5% | 0 | 1 |
| Ernst Bloch | não habilitado | 1 | 0,5% | 1 | 1 |
| Francis Bacon | não habilitado | 1 | 0,5% | 1 | 1 |
| Søren Kierkegaard | não habilitado | 1 | 0,5% | 1 | 1 |
| Leonardo da Vinci | não habilitado | 1 | 0,5% | 1 | 1 |
| Tradições contemplativas | não habilitado | 1 | 0,5% | 1 | 1 |
| Tradições religiosas | não habilitado | 1 | 0,5% | 1 | 1 |
| Voltaire | não habilitado | 1 | 0,5% | 1 | 1 |
| William James | não habilitado | 1 | 0,5% | 1 | 1 |

## Cobertura por virtude

Vozes convocáveis (habilitadas e que não são corpus) com relação utilizável para cada virtude, e universos principais que elas cobrem.

| Virtude | Vozes convocáveis | Prioritárias (Doc. 04) | Universos cobertos |
|---|---:|---:|---|
| V01 Prudência | 5 | 3 | Filosofia e ética; Psicologia e ciências humanas; Ciência e pensamento sistêmico |
| V02 Sabedoria | 4 | 3 | Filosofia e ética |
| V03 Discernimento | 6 | 3 | Filosofia e ética; Psicologia e ciências humanas; Ciência e pensamento sistêmico |
| V04 Atenção | 2 | 1 | Filosofia e ética |
| V05 Abertura intelectual | 3 | 3 | Filosofia e ética |
| V06 Temperança | 4 | 3 | Filosofia e ética |
| V07 Paciência | 3 | 2 | Filosofia e ética |
| V08 Serenidade | 4 | 3 | Filosofia e ética |
| V09 Moderação | 4 | 3 | Filosofia e ética |
| V10 Autodomínio | 4 | 3 | Filosofia e ética |
| V11 Equanimidade | 1 | 0 | Tradições espirituais e contemplativas |
| V12 Coragem | 4 | 3 | Filosofia e ética |
| V13 Fortaleza | 4 | 3 | Filosofia e ética |
| V14 Perseverança | 3 | 3 | Filosofia e ética |
| V15 Determinação | 3 | 3 | Filosofia e ética |
| V16 Resiliência | 3 | 2 | Psicologia e ciências humanas; Ciência e pensamento sistêmico |
| V17 Constância | 3 | 3 | Filosofia e ética |
| V18 Justiça | 6 | 3 | Filosofia e ética |
| V19 Honestidade | 4 | 3 | Filosofia e ética |
| V20 Integridade | 4 | 3 | Filosofia e ética |
| V21 Responsabilidade | 5 | 3 | Filosofia e ética; Psicologia e ciências humanas; Ciência e pensamento sistêmico |
| V22 Equidade | 3 | 3 | Filosofia e ética |
| V23 Fidelidade | 2 | 2 | Filosofia e ética |
| V24 Generosidade | 2 | 2 | Filosofia e ética |
| V25 Empatia | 2 | 2 | Filosofia e ética |
| V26 Compaixão | 3 | 2 | Tradições espirituais e contemplativas; Filosofia e ética |
| V27 Benevolência | 3 | 2 | Filosofia e ética; Tradições espirituais e contemplativas |
| V28 Gratidão | 1 | 1 | Filosofia e ética |
| V29 Perdão | 2 | 1 | Filosofia e ética |
| V30 Tolerância | 2 | 2 | Filosofia e ética |
| V31 Fraternidade | 2 | 2 | Filosofia e ética |
| V32 Respeito | 3 | 2 | Filosofia e ética |
| V33 Humildade intelectual | 3 | 2 | Filosofia e ética; Ciência e pensamento sistêmico |
| V34 Curiosidade | 3 | 2 | Filosofia e ética; Ciência e pensamento sistêmico |
| V35 Sinceridade | 3 | 3 | Filosofia e ética |
| V36 Amor à verdade | 5 | 3 | Filosofia e ética; Ciência e pensamento sistêmico |
| V37 Objetividade | 2 | 2 | Filosofia e ética; Psicologia e ciências humanas |
| V38 Disciplina | 4 | 3 | Filosofia e ética |
| V39 Diligência | 4 | 3 | Filosofia e ética; Psicologia e ciências humanas |
| V40 Compromisso | 4 | 3 | Filosofia e ética; Psicologia e ciências humanas |
| V41 Iniciativa | 3 | 3 | Filosofia e ética; Psicologia e ciências humanas |
| V42 Autonomia | 4 | 3 | Filosofia e ética |
| V43 Serviço | 2 | 2 | Filosofia e ética |
| V44 Humildade | 5 | 3 | Filosofia e ética |
| V45 Esperança | 2 | 1 | Psicologia e ciências humanas; Filosofia e ética |
| V46 Fé | 1 | 1 | Filosofia e ética |
| V47 Amor | 3 | 3 | Filosofia e ética; Psicologia e ciências humanas |
| V48 Contemplação | 3 | 3 | Filosofia e ética |

## Cobertura por universo principal

| Universo | Vozes convocáveis | Relações dessas vozes |
|---|---:|---:|
| Filosofia e ética | 18 | 133 |
| Tradições espirituais e contemplativas | 1 | 3 |
| Psicologia e ciências humanas | 4 | 11 |
| Literatura e artes | 0 | 0 |
| Ciência e pensamento sistêmico | 3 | 8 |

## Inventário completo

Colunas: P1–P4 = `relationType` do Documento 04; Doc. 04 = posição do autor na lista da virtude; F = nível F1–F4 de evidência conferida (vazio = não avaliada); Conceito, revisor e data ficam em branco até a revisão individual.

| ID | Autor | Virtude | P1–P4 | Doc. 04 | Fontes documentais | Obras | Fonte do autor | Justificativa | F | Status | Revisão | Especialista | Conceito | Revisor | Data |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TV-V01-aristoteles | Aristóteles | V01 Prudência | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V01-tomas-de-aquino | Tomás de Aquino | V01 Prudência | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V01-platao | Platão | V01 Prudência | — | 3º | DOC03-4, DOC04-5 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V01-daniel-kahneman | Daniel Kahneman | V01 Prudência | P3 | referência | DOC04-6 | W19 | disponível | específica | — | proposta | Baixa | não | — | — | — |
| TV-V01-nassim-taleb | Nassim Taleb | V01 Prudência | — | referência | DOC04-6 | W21 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V02-socrates | Sócrates | V02 Sabedoria | — | 1º | DOC03-4, DOC04-5, DOC04-6 | — | identificada; metadados a conferir | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V02-platao | Platão | V02 Sabedoria | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V02-aristoteles | Aristóteles | V02 Sabedoria | — | 3º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V02-marco-aurelio | Marco Aurélio | V02 Sabedoria | — | referência | DOC03-4 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V03-aristoteles | Aristóteles | V03 Discernimento | — | 1º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V03-socrates | Sócrates | V03 Discernimento | — | 2º | DOC03-4, DOC04-5 | — | identificada; metadados a conferir | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V03-epicteto | Epicteto | V03 Discernimento | — | 3º | DOC04-5 | W04 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V03-daniel-kahneman | Daniel Kahneman | V03 Discernimento | P3 | referência | DOC04-6 | W19 | disponível | específica | — | proposta | Baixa | não | — | — | — |
| TV-V03-donella-meadows | Donella Meadows | V03 Discernimento | — | referência | DOC04-6 | W20 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V03-tomas-de-aquino | Tomás de Aquino | V03 Discernimento | — | referência | DOC03-4 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V04-simone-weil | Simone Weil | V04 Atenção | — | 1º | DOC03-4, DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V04-tradicoes-budistas | Tradições budistas | V04 Atenção | — | 2º | DOC03-4, DOC04-5 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V04-william-james | William James | V04 Atenção | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V04-musashi | Miyamoto Musashi | V04 Atenção | — | referência | DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V05-socrates | Sócrates | V05 Abertura intelectual | — | 1º | DOC03-4, DOC04-5 | — | identificada; metadados a conferir | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V05-john-stuart-mill | John Stuart Mill | V05 Abertura intelectual | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W15 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V05-karl-popper | Karl Popper | V05 Abertura intelectual | — | 3º | DOC03-4, DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V06-platao | Platão | V06 Temperança | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V06-aristoteles | Aristóteles | V06 Temperança | P1 | 2º | DOC03-4, DOC04-5, DOC04-6 | W01 | disponível | específica | — | proposta | Baixa | não | — | — | — |
| TV-V06-tomas-de-aquino | Tomás de Aquino | V06 Temperança | — | 3º | DOC03-4, DOC04-5, DOC04-6 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V06-marco-aurelio | Marco Aurélio | V06 Temperança | — | referência | DOC04-6 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V07-seneca | Sêneca | V07 Paciência | — | 1º | DOC04-5, DOC04-6 | W05 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V07-marco-aurelio | Marco Aurélio | V07 Paciência | — | 2º | DOC03-4, DOC04-5 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V07-tradicoes-budistas | Tradições budistas | V07 Paciência | — | 3º | DOC03-4, DOC04-5 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V07-aristoteles | Aristóteles | V07 Paciência | — | referência | DOC03-4 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V08-epicteto | Epicteto | V08 Serenidade | — | 1º | DOC04-5, DOC04-6 | W04 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V08-seneca | Sêneca | V08 Serenidade | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W05 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V08-marco-aurelio | Marco Aurélio | V08 Serenidade | — | 3º | DOC03-4, DOC04-5 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V08-lao-tse | Lao-Tsé | V08 Serenidade | — | referência | DOC04-6 | W10 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V08-tradicoes-budistas | Tradições budistas | V08 Serenidade | — | referência | DOC03-4 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V08-estoicismo | Estoicismo | V08 Serenidade | — | referência | DOC03-4 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V09-aristoteles | Aristóteles | V09 Moderação | — | 1º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V09-platao | Platão | V09 Moderação | — | 2º | DOC03-4, DOC04-5 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V09-confucio | Confúcio | V09 Moderação | — | 3º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V09-lao-tse | Lao-Tsé | V09 Moderação | — | referência | DOC04-6 | W10 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V10-platao | Platão | V10 Autodomínio | — | 1º | DOC03-4, DOC04-5 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V10-epicteto | Epicteto | V10 Autodomínio | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W04 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V10-marco-aurelio | Marco Aurélio | V10 Autodomínio | — | 3º | DOC03-4, DOC04-5 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V10-aristoteles | Aristóteles | V10 Autodomínio | — | referência | DOC03-4 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V11-tradicoes-budistas | Tradições budistas | V11 Equanimidade | — | 1º | DOC03-4, DOC04-5 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V11-bhagavad-gita | Bhagavad Gita | V11 Equanimidade | — | 2º | DOC03-4, DOC04-5 | W11 | disponível | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V11-estoicismo | Estoicismo | V11 Equanimidade | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V11-dalai-lama | Dalai Lama (Tenzin Gyatso) | V11 Equanimidade | — | referência | DOC04-6 | — | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V12-aristoteles | Aristóteles | V12 Coragem | P1 | 1º | DOC03-4, DOC04-5, DOC04-6 | W01 | disponível | específica | — | proposta | Baixa | não | — | — | — |
| TV-V12-platao | Platão | V12 Coragem | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V12-marco-aurelio | Marco Aurélio | V12 Coragem | — | 3º | DOC03-4, DOC04-5 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V12-musashi | Miyamoto Musashi | V12 Coragem | — | referência | DOC03-4 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V13-tomas-de-aquino | Tomás de Aquino | V13 Fortaleza | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V13-aristoteles | Aristóteles | V13 Fortaleza | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V13-seneca | Sêneca | V13 Fortaleza | — | 3º | DOC04-5, DOC04-6 | W05 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V13-marco-aurelio | Marco Aurélio | V13 Fortaleza | — | referência | DOC04-6 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V13-estoicismo | Estoicismo | V13 Fortaleza | — | referência | DOC03-4 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V14-aristoteles | Aristóteles | V14 Perseverança | — | 1º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V14-seneca | Sêneca | V14 Perseverança | — | 2º | DOC03-4, DOC04-5 | W05 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V14-musashi | Miyamoto Musashi | V14 Perseverança | — | 3º | DOC04-5 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V14-tradicoes-budistas | Tradições budistas | V14 Perseverança | — | referência | DOC03-4 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V15-musashi | Miyamoto Musashi | V15 Determinação | — | 1º | DOC03-4, DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V15-aristoteles | Aristóteles | V15 Determinação | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V15-marco-aurelio | Marco Aurélio | V15 Determinação | — | 3º | DOC03-4, DOC04-5 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V16-viktor-frankl | Viktor Frankl | V16 Resiliência | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W18 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V16-estoicismo | Estoicismo | V16 Resiliência | — | 2º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V16-nassim-taleb | Nassim Taleb | V16 Resiliência | — | 3º | DOC04-5, DOC04-6 | W21 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V16-donella-meadows | Donella Meadows | V16 Resiliência | — | referência | DOC03-4 | W20 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V17-confucio | Confúcio | V17 Constância | — | 1º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V17-aristoteles | Aristóteles | V17 Constância | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V17-musashi | Miyamoto Musashi | V17 Constância | — | 3º | DOC04-5 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V17-tradicoes-budistas | Tradições budistas | V17 Constância | — | referência | DOC03-4 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V18-platao | Platão | V18 Justiça | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V18-aristoteles | Aristóteles | V18 Justiça | P1 | 2º | DOC03-4, DOC04-5, DOC04-6 | W01 | disponível | específica | — | proposta | Baixa | não | — | — | — |
| TV-V18-tomas-de-aquino | Tomás de Aquino | V18 Justiça | — | 3º | DOC03-4, DOC04-5, DOC04-6 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V18-confucio | Confúcio | V18 Justiça | — | referência | DOC03-4 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V18-marco-aurelio | Marco Aurélio | V18 Justiça | — | referência | DOC04-6 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V18-john-rawls | John Rawls | V18 Justiça | — | referência | DOC04-6 | W16 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V19-socrates | Sócrates | V19 Honestidade | — | 1º | DOC03-4, DOC04-5 | — | identificada; metadados a conferir | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V19-aristoteles | Aristóteles | V19 Honestidade | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V19-kant | Immanuel Kant | V19 Honestidade | — | 3º | DOC03-4, DOC04-5, DOC04-6 | W13 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V19-confucio | Confúcio | V19 Honestidade | — | referência | DOC03-4 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V20-aristoteles | Aristóteles | V20 Integridade | — | 1º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V20-kant | Immanuel Kant | V20 Integridade | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W13 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V20-confucio | Confúcio | V20 Integridade | — | 3º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V20-socrates | Sócrates | V20 Integridade | — | referência | DOC03-4 | — | identificada; metadados a conferir | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V21-kant | Immanuel Kant | V21 Responsabilidade | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W13 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V21-aristoteles | Aristóteles | V21 Responsabilidade | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V21-viktor-frankl | Viktor Frankl | V21 Responsabilidade | — | 3º | DOC03-4, DOC04-5, DOC04-6 | W18 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V21-erich-fromm | Erich Fromm | V21 Responsabilidade | — | referência | DOC04-6 | W17 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V21-donella-meadows | Donella Meadows | V21 Responsabilidade | — | referência | DOC04-6 | W20 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V22-aristoteles | Aristóteles | V22 Equidade | — | 1º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V22-john-rawls | John Rawls | V22 Equidade | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W16 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V22-tomas-de-aquino | Tomás de Aquino | V22 Equidade | — | 3º | DOC03-4, DOC04-5 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V23-confucio | Confúcio | V23 Fidelidade | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V23-aristoteles | Aristóteles | V23 Fidelidade | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V23-cicero | Cícero | V23 Fidelidade | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V24-aristoteles | Aristóteles | V24 Generosidade | — | 1º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V24-confucio | Confúcio | V24 Generosidade | — | 2º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V24-tradicoes-budistas | Tradições budistas | V24 Generosidade | — | 3º | DOC03-4, DOC04-5 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V25-edith-stein | Edith Stein | V25 Empatia | — | 1º | DOC03-4, DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V25-confucio | Confúcio | V25 Empatia | — | 2º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V25-adam-smith | Adam Smith | V25 Empatia | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V26-tradicoes-budistas | Tradições budistas | V26 Compaixão | — | 1º | DOC03-4, DOC04-5 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V26-dalai-lama | Dalai Lama (Tenzin Gyatso) | V26 Compaixão | — | 2º | DOC03-4, DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V26-simone-weil | Simone Weil | V26 Compaixão | — | 3º | DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V26-confucio | Confúcio | V26 Compaixão | — | referência | DOC03-4 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V27-confucio | Confúcio | V27 Benevolência | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V27-aristoteles | Aristóteles | V27 Benevolência | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V27-tradicoes-budistas | Tradições budistas | V27 Benevolência | — | 3º | DOC03-4, DOC04-5 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V27-dalai-lama | Dalai Lama (Tenzin Gyatso) | V27 Benevolência | — | referência | DOC04-6 | — | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V28-seneca | Sêneca | V28 Gratidão | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W05 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V28-cicero | Cícero | V28 Gratidão | — | 2º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V28-tradicoes-budistas | Tradições budistas | V28 Gratidão | — | 3º | DOC03-4, DOC04-5 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V29-marco-aurelio | Marco Aurélio | V29 Perdão | — | 1º | DOC03-4, DOC04-5 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V29-tradicoes-cristas | Tradições cristãs | V29 Perdão | — | 2º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V29-tradicoes-budistas | Tradições budistas | V29 Perdão | — | 3º | DOC03-4, DOC04-5 | W12 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V29-seneca | Sêneca | V29 Perdão | — | referência | DOC03-4 | W05 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V30-john-locke | John Locke | V30 Tolerância | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W14 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V30-voltaire | Voltaire | V30 Tolerância | — | 2º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V30-john-stuart-mill | John Stuart Mill | V30 Tolerância | — | 3º | DOC03-4, DOC04-5, DOC04-6 | W15 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V31-confucio | Confúcio | V31 Fraternidade | — | 1º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V31-marco-aurelio | Marco Aurélio | V31 Fraternidade | — | 2º | DOC03-4, DOC04-5 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V31-tradicoes-humanistas | Tradições humanistas | V31 Fraternidade | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V32-confucio | Confúcio | V32 Respeito | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V32-kant | Immanuel Kant | V32 Respeito | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W13 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V32-cicero | Cícero | V32 Respeito | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V32-john-locke | John Locke | V32 Respeito | — | referência | DOC04-6 | W14 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V33-socrates | Sócrates | V33 Humildade intelectual | — | 1º | DOC03-4, DOC04-5, DOC04-6 | — | identificada; metadados a conferir | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V33-confucio | Confúcio | V33 Humildade intelectual | — | 2º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V33-bertrand-russell | Bertrand Russell | V33 Humildade intelectual | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V33-richard-feynman | Richard Feynman | V33 Humildade intelectual | — | referência | DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V34-socrates | Sócrates | V34 Curiosidade | — | 1º | DOC03-4, DOC04-5 | — | identificada; metadados a conferir | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V34-aristoteles | Aristóteles | V34 Curiosidade | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V34-leonardo-da-vinci | Leonardo da Vinci | V34 Curiosidade | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V34-richard-feynman | Richard Feynman | V34 Curiosidade | — | referência | DOC03-4, DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V35-confucio | Confúcio | V35 Sinceridade | — | 1º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V35-aristoteles | Aristóteles | V35 Sinceridade | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V35-kant | Immanuel Kant | V35 Sinceridade | — | 3º | DOC03-4, DOC04-5 | W13 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V36-socrates | Sócrates | V36 Amor à verdade | — | 1º | DOC03-4, DOC04-5 | — | identificada; metadados a conferir | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V36-platao | Platão | V36 Amor à verdade | — | 2º | DOC03-4, DOC04-5 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V36-karl-popper | Karl Popper | V36 Amor à verdade | — | 3º | DOC03-4, DOC04-5 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V36-aristoteles | Aristóteles | V36 Amor à verdade | — | referência | DOC03-4 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V36-richard-feynman | Richard Feynman | V36 Amor à verdade | — | referência | DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V37-francis-bacon | Francis Bacon | V37 Objetividade | — | 1º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V37-karl-popper | Karl Popper | V37 Objetividade | — | 2º | DOC03-4, DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V37-daniel-kahneman | Daniel Kahneman | V37 Objetividade | — | 3º | DOC03-4, DOC04-5, DOC04-6 | W19 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V38-aristoteles | Aristóteles | V38 Disciplina | — | 1º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V38-musashi | Miyamoto Musashi | V38 Disciplina | — | 2º | DOC03-4, DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V38-confucio | Confúcio | V38 Disciplina | — | 3º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V38-benjamin-franklin | Benjamin Franklin | V38 Disciplina | — | referência | DOC04-6 | — | identificada; metadados a conferir | genérica | — | proposta | Média | não | — | — | — |
| TV-V39-aristoteles | Aristóteles | V39 Diligência | — | 1º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V39-tomas-de-aquino | Tomás de Aquino | V39 Diligência | — | 2º | DOC03-4, DOC04-5 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V39-benjamin-franklin | Benjamin Franklin | V39 Diligência | — | 3º | DOC03-4, DOC04-5, DOC04-6 | — | identificada; metadados a conferir | genérica | — | proposta | Média | não | — | — | — |
| TV-V39-peter-drucker | Peter Drucker | V39 Diligência | — | referência | DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V40-confucio | Confúcio | V40 Compromisso | — | 1º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V40-kant | Immanuel Kant | V40 Compromisso | — | 2º | DOC03-4, DOC04-5 | W13 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V40-aristoteles | Aristóteles | V40 Compromisso | — | 3º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V40-peter-drucker | Peter Drucker | V40 Compromisso | — | referência | DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V41-aristoteles | Aristóteles | V41 Iniciativa | — | 1º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V41-benjamin-franklin | Benjamin Franklin | V41 Iniciativa | — | 2º | DOC03-4, DOC04-5, DOC04-6 | — | identificada; metadados a conferir | genérica | — | proposta | Média | não | — | — | — |
| TV-V41-peter-drucker | Peter Drucker | V41 Iniciativa | — | 3º | DOC03-4, DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Média | não | — | — | — |
| TV-V42-kant | Immanuel Kant | V42 Autonomia | — | 1º | DOC03-4, DOC04-5 | W13 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V42-epicteto | Epicteto | V42 Autonomia | — | 2º | DOC03-4, DOC04-5, DOC04-6 | W04 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V42-aristoteles | Aristóteles | V42 Autonomia | — | 3º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V42-john-stuart-mill | John Stuart Mill | V42 Autonomia | — | referência | DOC04-6 | W15 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V43-confucio | Confúcio | V43 Serviço | — | 1º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V43-simone-weil | Simone Weil | V43 Serviço | — | 2º | DOC03-4, DOC04-5, DOC04-6 | — | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V43-tradicoes-humanistas | Tradições humanistas | V43 Serviço | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V44-socrates | Sócrates | V44 Humildade | — | 1º | DOC03-4, DOC04-5 | — | identificada; metadados a conferir | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V44-confucio | Confúcio | V44 Humildade | — | 2º | DOC03-4, DOC04-5 | W09 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V44-marco-aurelio | Marco Aurélio | V44 Humildade | — | 3º | DOC03-4, DOC04-5, DOC04-6 | W06 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V44-lao-tse | Lao-Tsé | V44 Humildade | — | referência | DOC04-6 | W10 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V44-tomas-de-aquino | Tomás de Aquino | V44 Humildade | — | referência | DOC03-4 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V45-viktor-frankl | Viktor Frankl | V45 Esperança | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W18 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V45-tradicoes-cristas | Tradições cristãs | V45 Esperança | — | 2º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V45-ernst-bloch | Ernst Bloch | V45 Esperança | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | não | — | — | — |
| TV-V45-tomas-de-aquino | Tomás de Aquino | V45 Esperança | — | referência | DOC04-6 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V46-tomas-de-aquino | Tomás de Aquino | V46 Fé | — | 1º | DOC03-4, DOC04-5, DOC04-6 | W07, W08 | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V46-kierkegaard | Søren Kierkegaard | V46 Fé | — | 2º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V46-tradicoes-religiosas | Tradições religiosas | V46 Fé | — | 3º | DOC03-4, DOC04-5 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V47-platao | Platão | V47 Amor | — | 1º | DOC03-4, DOC04-5 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V47-aristoteles | Aristóteles | V47 Amor | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V47-erich-fromm | Erich Fromm | V47 Amor | — | 3º | DOC03-4, DOC04-5, DOC04-6 | W17 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V47-tradicoes-cristas | Tradições cristãs | V47 Amor | — | referência | DOC03-4 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
| TV-V48-platao | Platão | V48 Contemplação | — | 1º | DOC03-4, DOC04-5 | W02, W03 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V48-aristoteles | Aristóteles | V48 Contemplação | — | 2º | DOC03-4, DOC04-5 | W01 | disponível | genérica | — | proposta | Baixa | não | — | — | — |
| TV-V48-simone-weil | Simone Weil | V48 Contemplação | — | 3º | DOC03-4, DOC04-5 | — | disponível | genérica | — | proposta | Alta | sim | — | — | — |
| TV-V48-tradicoes-contemplativas | Tradições contemplativas | V48 Contemplação | — | referência | DOC03-4 | — | nenhuma | pendente | — | proposta | Alta | sim | — | — | — |
