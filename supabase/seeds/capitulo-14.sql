-- Jornada da Virtude v2.0 — conteúdo do capítulo 14 (Gunatraya Vibhaga Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz da etapa 5
-- (com 15 alternativas) e as 3 leituras do resultado. Idempotente: o upsert é por
-- numero em capitulos, por (capitulo_id, ordem) em etapas, por (etapa_id, ordem) em
-- perguntas, por (pergunta_id, chave) em opcoes e por (etapa_id, chave) em leituras.
-- Rodar de novo atualiza o texto e não duplica nada. Não insere registros de usuário.
-- Pré-requisito: migrações aplicadas (inclui 20261118180000_gita_conteudo_e_quiz.sql).
--
-- O Markdown usa GFM (tabelas) e não contém HTML, CSS nem JavaScript.

insert into public.capitulos (numero, titulo)
values (14, 'Gunatraya Vibhaga Yoga — Os três modos da natureza')
on conflict (numero) do update set titulo = excluded.titulo;

-- ---------------------------------------------------------------------------
-- Etapas: nome e texto
-- ---------------------------------------------------------------------------
insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## O ser humano entre natureza e liberdade

No capítulo 14, Krishna aprofunda uma questão que atravessa a Gita: se nossas ações são influenciadas por forças, desejos, hábitos e disposições, em que sentido somos livres?

A *Bhagavad Gita* integra o *Mahabharata*, grande épico da tradição indiana. O diálogo ocorre no campo de batalha de Kurukshetra, mas a crise de Arjuna também funciona como cenário para uma investigação sobre ação, consciência, dever e libertação.

O capítulo recebe o nome **Gunatraya Vibhaga Yoga**: *guna* pode ser traduzido como qualidade, atributo ou modo; *traya* significa três; *vibhaga*, distinção ou análise; e *yoga*, caminho ou disciplina de integração. O tema é a distinção entre os três modos que constituem e condicionam a natureza.

### A relação com Samkhya e Vedanta

O vocabulário dos três *gunas* tem raízes importantes na tradição Samkhya. Nela, **Prakriti** é a natureza primordial, dinâmica e constituída pelos três modos; **Purusha** é o princípio consciente, testemunha da experiência. A Gita dialoga com esse repertório, mas o integra à sua própria visão teísta e devocional: Krishna apresenta-se como fundamento último e indica a possibilidade de transcender os gunas.

> **Distinção importante:** os gunas não são três espécies de pessoas nem categorias clínicas. São tendências ou qualidades da natureza que podem predominar alternadamente em qualquer pessoa, situação ou atividade.

*A narrativa sobre nascimento, morte e destinos após a morte pertence à cosmologia religiosa da Gita. Pode ser estudada filosoficamente, mas não deve ser apresentada como resultado empiricamente comprovado pela ciência.*
$md$),

(2, 'Conceitos fundamentais', $md$
## Os três modos da natureza

Krishna descreve três forças que se combinam e disputam predominância. Nenhuma delas deve ser reduzida a um rótulo moral simples: cada uma tem uma função, uma potência e uma forma própria de aprisionamento.

1. **Sattva:** clareza, harmonia e lucidez. Favorece conhecimento, equilíbrio, discernimento e bem-estar. Seu risco é o apego à felicidade, à pureza ou ao próprio conhecimento. Até a serenidade pode virar uma identidade à qual nos agarramos.
2. **Rajas:** atividade, desejo e movimento. Mobiliza, produz, conquista e transforma. Seu risco é a inquietação: a pessoa passa a depender de resultados, reconhecimento e estímulos, confundindo movimento com realização.
3. **Tamas:** inércia, obscuridade e negligência. Está associado à confusão, ao adiamento, à apatia e à falta de discernimento. Seu risco é a acomodação que obscurece consequências e reduz a capacidade de agir.

### Como os gunas se alternam

O verso 14.10 descreve a alternância: quando um modo ganha predominância, os outros recuam. Isso ajuda a evitar uma leitura rígida. Uma pessoa pode demonstrar clareza pela manhã, agir movida pela ambição à tarde e terminar o dia em exaustão e inércia.

| Modo | Quando predomina | Forma de aprisionamento | Pergunta de observação |
|---|---|---|---|
| **Sattva** | Clareza, equilíbrio, estudo, serenidade. | Apego ao conforto, à virtude ou ao saber. | Estou buscando compreender ou provar que sou alguém esclarecido? |
| **Rajas** | Pressa, competição, desejo, excesso de atividade. | Apego à ação e aos frutos da ação. | Estou agindo por propósito ou por ansiedade de resultado? |
| **Tamas** | Confusão, adiamento, desatenção, apatia. | Inércia e incapacidade de perceber com clareza. | O que estou evitando encarar ou decidir? |

### Do condicionamento à transcendência

Nos versos 14.14–15, o texto relaciona a predominância de cada guna no momento da morte a diferentes destinos, segundo sua cosmologia. Mais adiante, nos versos 14.19–20, Krishna aponta para uma compreensão que reconhece os gunas como agentes da natureza e permite ultrapassar sua identificação com eles.

Nos versos 14.22–25, a pessoa que transcende os gunas é descrita como alguém que não se deixa arrastar por prazer e aversão, honra e desonra, elogio e censura. Isso não significa indiferença passiva, mas estabilidade diante das oscilações.

> **Ideia central:** Sattva é mais favorável ao discernimento do que Rajas e Tamas, mas a liberdade descrita no capítulo não consiste em ficar preso a Sattva. Consiste em reconhecer os três modos sem reduzir a própria identidade a nenhum deles.
$md$),

(3, 'Interpretação filosófica', $md$
## Três diálogos com a filosofia ocidental

### Aristóteles: hábito, caráter e virtude

Em Aristóteles, o caráter é formado por hábitos e a virtude exige educação dos desejos, deliberação e prática. Há um ponto de contato com a Gita: não somos apenas espectadores de nossas disposições; podemos cultivá-las e aprender a agir melhor.

**Diferença:** Aristóteles busca a excelência humana e a vida boa no interior da vida política e prática. A Gita propõe também uma libertação espiritual que ultrapassa a identificação com os modos da natureza.

### Spinoza: afetos e liberdade pela compreensão

Spinoza entende que somos frequentemente conduzidos por causas e afetos que não compreendemos. A liberdade cresce quando entendemos essas causas e deixamos de ser simplesmente arrastados por paixões passivas. Isso conversa com a observação dos gunas: reconhecer o que nos move é condição para responder com mais lucidez.

**Diferença:** Spinoza não apresenta uma alma individual que transcende três qualidades cósmicas por devoção a Krishna. Sua liberdade é compreendida dentro da necessidade da Natureza, identificada com Deus, e não como saída da ordem natural.

### Nietzsche: forças, afirmação e superação

Nietzsche investiga forças, impulsos, valores e formas de vida. Sua crítica à passividade pode ajudar a pensar Tamas; sua análise da ambição e da disputa ilumina aspectos de Rajas; e sua suspeita diante de ideais de pureza pode provocar uma leitura crítica do apego a Sattva.

**Diferença:** Nietzsche não propõe a transcendência dos gunas nem a submissão devocional ao Ser Supremo. Sua afirmação da vida e sua crítica à metafísica entram em tensão real com a orientação espiritual da Gita.

| Pensador | Ponto de encontro | Diferença decisiva |
|---|---|---|
| Aristóteles | Formação do caráter e educação dos hábitos. | Virtude prática e vida boa, não libertação dos gunas. |
| Spinoza | Compreender as forças que nos determinam. | Liberdade como compreensão da necessidade, não transcendência devocional. |
| Nietzsche | Investigação das forças e crítica à passividade. | Afirmação imanente da vida, em tensão com a metafísica da Gita. |

### Uma interpretação integradora

O capítulo 14 pode ser lido como uma cartografia da experiência humana. Sattva esclarece, Rajas impulsiona e Tamas desacelera ou obscurece. O problema não é simplesmente possuir essas tendências, mas ser governado por elas sem percebê-las. A liberdade começa quando surge um espaço entre o impulso e a resposta.

Essa leitura não elimina as diferenças entre as tradições. Ela as coloca em diálogo: Aristóteles ajuda a pensar a formação do caráter; Spinoza, a compreensão dos condicionamentos; Nietzsche, a suspeita diante de formas disfarçadas de fraqueza ou apego.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Observar antes de obedecer ao impulso

Uma aplicação contemporânea do capítulo é tratar os gunas como uma linguagem de auto-observação. Não é necessário transformar a ideia em diagnóstico ou classificar pessoas. O objetivo é perceber estados e escolher respostas mais conscientes.

### No trabalho e na liderança

- **Sattva:** analisar dados com serenidade, escutar a equipe e decidir com clareza. Cuidado para não transformar análise em perfeccionismo ou superioridade intelectual.
- **Rajas:** mobilizar pessoas, cumprir metas e executar projetos. Cuidado para não criar urgência artificial, competição improdutiva ou dependência de reconhecimento.
- **Tamas:** reconhecer fadiga, desorganização e bloqueios. Cuidado para não normalizar a omissão nem confundir descanso necessário com fuga persistente.

### Na educação

Um professor pode cultivar Sattva ao criar um ambiente de atenção e investigação; usar Rajas para mobilizar participação e projetos; e reconhecer sinais de Tamas, como desinteresse ou confusão, sem rotular o estudante. A pergunta pedagógica deixa de ser “que tipo de aluno ele é?” e passa a ser “que condições estão favorecendo este estado e que intervenção pode ajudar?”.

### Exercício de observação em três momentos

1. **Antes de agir:** nomeie o estado predominante. Há clareza, agitação ou inércia?
2. **Durante a ação:** observe se está buscando cumprir um propósito ou aliviar uma tensão imediata.
3. **Depois:** avalie se a ação produziu lucidez, apenas mais agitação ou maior confusão.

> **Prática de sete dias:** ao final de cada dia, registre uma situação em que Sattva, Rajas ou Tamas pareceu predominar. Descreva o comportamento observado, sem transformar o guna em identidade. Depois, anote uma resposta alternativa que teria sido mais consciente.
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Reconhecer os modos em ação

Responda pensando em situações reais recentes. Não existe pontuação moral: o exercício serve para tornar visíveis padrões e escolhas.

### Reflexão aberta

Em que situação recente você percebeu que estava sendo conduzido por agitação, apego ou inércia? O que poderia fazer diferente?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## O que levar deste capítulo

1. **A experiência é condicionada:** nossas disposições e ações são influenciadas por tendências que nem sempre percebemos.
2. **Sattva esclarece:** favorece conhecimento e equilíbrio, mas pode aprisionar pelo apego à felicidade e ao saber.
3. **Rajas movimenta:** impulsiona a ação, mas pode produzir inquietação e dependência dos resultados.
4. **Tamas obscurece:** favorece inércia, confusão e negligência.
5. **Os modos se alternam:** não são identidades fixas nem diagnósticos de personalidade.
6. **A liberdade exige discernimento:** observar os gunas sem se confundir inteiramente com eles abre espaço para uma ação mais consciente.

### Versos para revisitar

| Versos | Tema | Pergunta para leitura |
|---|---|---|
| 14.2 | Conhecimento e libertação | Que tipo de conhecimento transforma a maneira de viver? |
| 14.5–8 | Os três gunas | Como cada modo condiciona a experiência? |
| 14.10 | Alternância dos modos | O que faz um estado ganhar predominância? |
| 14.14–15 | Consequências segundo a cosmologia da Gita | Como o texto relaciona disposição interior e destino? |
| 14.19–20 | Transcendência | O que muda quando reconheço os gunas como modos da natureza? |
| 14.22–25 | Equanimidade | Como responder a prazer, dor, elogio e censura sem ser arrastado? |
| 14.26 | Devoção e transcendência | Qual é o papel da devoção no caminho apresentado? |
| 14.27 | Krishna como fundamento de Brahman | Como este verso se conecta à visão teísta da Gita? |

> **Síntese interpretativa:** o capítulo não pede que eliminemos toda atividade, desejo ou repouso. Ele nos convida a compreender as forças que atravessam a experiência e a não entregar a elas, sem exame, o comando da consciência e da ação.

Próxima etapa: **Capítulo 15 — Purushottama Yoga**, o Yoga do Ser Supremo. A leitura investigará a imagem da árvore cósmica invertida, o desapego como instrumento de libertação e a distinção entre o perecível, o imperecível e o Ser Supremo.

### Três questões para orientar a próxima leitura

1. Por que a existência condicionada é representada como uma árvore com raízes acima e galhos abaixo?
2. O que significa cortar essa árvore com a arma do desapego?
3. Como o capítulo distingue o perecível, o imperecível e Purushottama?
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 14
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

-- ---------------------------------------------------------------------------
-- Quiz da etapa 5: perguntas, alternativas e leituras
-- A chave é a mesma em todas as perguntas: A, B e C apontam para a mesma leitura.
-- ---------------------------------------------------------------------------
insert into public.perguntas (etapa_id, ordem, enunciado)
select e.id, v.ordem, v.enunciado
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Quando surge um problema complexo, sua reação mais frequente é:'),
  (2, 'Quando alcança um resultado positivo, o que tende a acontecer?'),
  (3, 'Em uma discussão, o que mais costuma capturar sua atenção?'),
  (4, 'Quando sua rotina fica desorganizada, você tende a:'),
  (5, 'Qual atitude melhor representa a liberdade descrita no capítulo?')
) as v(ordem, enunciado)
where c.numero = 14 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Buscar compreender com calma antes de agir.'),
  (1, 'B', 'Agir rapidamente para resolver e recuperar o controle.'),
  (1, 'C', 'Adiar, evitar ou esperar que o problema desapareça.'),
  (2, 'A', 'Sinto satisfação e tento compreender o que aprendi.'),
  (2, 'B', 'Já penso na próxima meta e em como avançar mais.'),
  (2, 'C', 'Perco energia e tenho dificuldade para manter o ritmo.'),
  (3, 'A', 'Compreender os argumentos e distinguir fatos de interpretações.'),
  (3, 'B', 'Defender minha posição e conseguir que ela prevaleça.'),
  (3, 'C', 'Desligar-me da conversa ou evitar pensar sobre o assunto.'),
  (4, 'A', 'Reavaliar prioridades e reorganizar o que é essencial.'),
  (4, 'B', 'Aumentar o ritmo e tentar dar conta de tudo ao mesmo tempo.'),
  (4, 'C', 'Sentir-se bloqueado e deixar as tarefas acumularem.'),
  (5, 'A', 'Perceber os estados internos sem se identificar completamente com eles.'),
  (5, 'B', 'Manter-se sempre ocupado e produtivo.'),
  (5, 'C', 'Evitar qualquer situação que provoque desconforto.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 14 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, chave, texto)
select e.id, v.chave, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  ('A', 'Há sinais de uma orientação frequente à clareza e à observação (associada a Sattva). O cuidado é não se apegar à imagem de estar sempre lúcido ou correto.'),
  ('B', 'Há sinais de forte mobilização e orientação à ação (associada a Rajas). O cuidado é distinguir propósito de pressa e realização de dependência dos resultados.'),
  ('C', 'Há sinais de adiamento, retração ou bloqueio em algumas situações (associados a Tamas). O cuidado é investigar as condições que alimentam a inércia e construir um primeiro passo possível.')
) as v(chave, texto)
where c.numero = 14 and e.ordem = 5
on conflict (etapa_id, chave) do update set texto = excluded.texto;
