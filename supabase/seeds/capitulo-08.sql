-- Jornada da Virtude v2.0 — conteúdo do capítulo 8 (Akshara Brahma Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz (15 alternativas) e as 3 leituras por
-- faixa. Neste capítulo o quiz usa o modo "faixas" (migração 20261119000100_quiz_por_faixas.sql): a alternativa
-- C é a alinhada ao ensinamento e a leitura depende de quantas vezes ela foi escolhida (4 ou mais, 2 ou 3, menos de 2).
-- Idempotente: upsert por numero, (capitulo_id, ordem), (etapa_id, ordem), (pergunta_id, chave) e (etapa_id, minimo).
-- Não insere registros de usuário.
-- O HTML tem seis seções após a introdução; a "Ideia central" abre a etapa 1.

insert into public.capitulos (numero, titulo)
values (8, 'Akshara Brahma Yoga — O Yoga do Absoluto Imperecível')
on conflict (numero) do update set titulo = excluded.titulo;

insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Ideia central

O capítulo 8 examina o que é imperecível em meio às transformações da existência e pergunta como a consciência se orienta diante da morte. Krishna ensina que a lembrança do divino no momento final está relacionada à orientação cultivada ao longo da vida.

O capítulo não trata a morte apenas como encerramento biológico. Dentro da visão espiritual da Gita, ela integra um ciclo mais amplo de existência e continuidade. Por isso, a questão central não é criar uma técnica de última hora, mas formar uma vida cuja atenção, valores e consciência estejam orientados para aquilo que se considera supremo.

> **Pergunta-guia:** se a maneira como vivemos influencia aquilo a que nossa consciência se apega, que tipo de atenção e orientação estamos cultivando todos os dias?

## Contexto histórico e filosófico

Depois de apresentar a natureza divina, os caminhos de conhecimento e a disciplina da meditação, Krishna responde a perguntas de Arjuna sobre conceitos fundamentais: Brahman, adhyatma, karma, adhibhuta, adhidaiva e adhiyajna. O capítulo 8 organiza essas categorias e as relaciona à morte e à libertação.

O texto se insere em tradições indianas que investigam a continuidade da existência, o ciclo de nascimento e morte (*samsara*) e a possibilidade de libertação (*moksha*). A morte é compreendida no horizonte da transmigração e da orientação da consciência, não apenas como evento isolado.

O capítulo também apresenta uma prática de concentração e lembrança do divino no momento da morte. Essa orientação deve ser entendida dentro do quadro metafísico e devocional da obra, e não como uma descrição médica ou científica do processo de morrer.

> **Nota de interpretação:** as escolas indianas divergem sobre a natureza de Brahman, do eu individual e da libertação. O capítulo usa termos que serão interpretados de formas diferentes por tradições Vedanta. Ao estudar, é importante distinguir o texto da Gita das explicações posteriores de cada escola.
$md$),

(2, 'Conceitos fundamentais', $md$
## Conceitos fundamentais e percurso dos versos

### 2.1 As perguntas de Arjuna e as definições de Krishna (8.1–4)

Arjuna pergunta o significado de Brahman, adhyatma, karma, adhibhuta, adhidaiva e adhiyajna, além de querer saber como reconhecer o divino no momento da morte.

- **Brahman:** o princípio imperecível, o Absoluto que não está sujeito à destruição própria das formas condicionadas.
- **Adhyatma:** a dimensão do eu ou da natureza essencial do ser, relacionada à existência interior.
- **Karma:** a ação geradora de processos e consequências, associada à manifestação dos seres.
- **Adhibhuta:** o domínio dos seres e elementos mutáveis, a dimensão material sujeita à transformação.
- **Adhidaiva:** o princípio divino ou cósmico que preside a dimensão dos deuses e das funções universais.
- **Adhiyajna:** o princípio divino presente no sacrifício e no corpo, identificado por Krishna consigo mesmo.

As definições são condensadas e recebem interpretações técnicas distintas nos comentários tradicionais. O importante, neste ponto, é perceber que Krishna relaciona o Absoluto, o ser, a ação, a natureza, a ordem cósmica e a dimensão ritual.

### 2.2 A lembrança no momento da morte (8.5–8)

Krishna afirma que aquele que deixa o corpo lembrando-se dele alcança sua natureza. Em seguida, apresenta uma regra mais ampla: a condição ou objeto que ocupa a consciência no momento final está relacionado àquilo que foi cultivado durante a vida.

Por isso, a orientação é lembrar-se de Krishna em todos os momentos e, ao mesmo tempo, cumprir o próprio dever. A prática não é abandonar a ação para pensar exclusivamente na morte; é integrar lembrança e responsabilidade.

> *“Lembra-te de mim em todos os momentos e luta.”* — Paráfrase de 8.7

A imagem do pensamento final não deve ser reduzida a uma fórmula mecânica. O capítulo enfatiza a formação contínua da atenção: aquilo que repetidamente ocupa a mente tende a moldar nossas disposições profundas.

### 2.3 A meditação no Supremo (8.9–13)

Krishna descreve a contemplação do princípio supremo como eterno, onisciente, sutil, sustentador, além da escuridão e mais antigo que tudo. O praticante deve disciplinar a mente, concentrar a força vital e fixar a atenção no divino.

O som sagrado Om aparece como símbolo do Absoluto e como apoio à concentração. A prática combina recolhimento, domínio dos sentidos, estabilidade mental e orientação devocional.

O objetivo não é simplesmente alcançar um estado de relaxamento. Trata-se de uma disciplina espiritual que, segundo a cosmologia da Gita, orienta a consciência para além do ciclo condicionado.

### 2.4 O destino de quem alcança Krishna (8.14–16)

Krishna afirma que aqueles que se lembram dele com constância e devoção alcançam-no com facilidade. Em contraste, todos os mundos condicionados, inclusive os mais elevados, estão sujeitos ao retorno e à dissolução.

Essa passagem relativiza até as conquistas mais grandiosas dentro da cosmologia: poder, longevidade e acesso a planos celestes continuam pertencendo ao campo da impermanência. A libertação é diferente de obter uma posição mais confortável dentro do ciclo.

> **Distinção essencial:** melhorar as condições da existência não é o mesmo que libertar-se do condicionamento. O capítulo direciona a busca para além de recompensas temporárias.

### 2.5 A escala cósmica do tempo (8.17–19)

O texto apresenta a escala de tempo associada aos dias e noites de Brahma. Um dia cósmico corresponde a um período imenso de manifestação; a noite corresponde à dissolução. Os seres manifestam-se, desaparecem e voltam a surgir conforme os ciclos cósmicos.

Essa cosmologia amplia radicalmente a escala de percepção humana. O que parece permanente em uma vida individual é transitório quando observado em ciclos cósmicos. Ainda assim, a realidade imperecível permanece além dessas alternâncias.

### 2.6 O Absoluto não manifestado e o destino supremo (8.20–22)

Krishna distingue a manifestação periódica do universo de uma realidade não manifestada que não é destruída quando os mundos se dissolvem. Essa realidade é apresentada como destino supremo, alcançado por devoção firme.

O texto retoma a distinção entre o que aparece e desaparece e aquilo que é imperecível. A libertação consiste em alcançar esse princípio, não apenas em atravessar mais um ciclo de manifestação.

### 2.7 Os dois caminhos após a morte (8.23–26)

Krishna descreve dois caminhos simbólicos associados à partida do corpo: um relacionado à luz e outro à escuridão, tradicionalmente interpretados em conexão com ciclos cósmicos, conhecimento e retorno. Um caminho conduz à não repetição do nascimento; o outro, ao retorno à existência condicionada.

As imagens de fogo, luz, dia, quinzena clara e percurso do Sol pertencem à cosmologia religiosa do texto. Há diferentes interpretações sobre se devem ser entendidas literalmente, ritualmente, cosmologicamente ou simbolicamente.

> **Cuidado interpretativo:** não transforme essa passagem em uma regra simplista segundo a qual o horário, a estação ou a circunstância física da morte determinariam isoladamente o destino espiritual de alguém. Os comentários tradicionais divergem e o capítulo inteiro enfatiza orientação da consciência, conhecimento e devoção.

### 2.8 O conhecimento que supera o mérito ritual (8.27–28)

Krishna conclui que o yogue que compreende esses caminhos não se confunde com eles e permanece firme na prática. O conhecimento descrito supera os frutos temporários associados a rituais, austeridades, estudos e doações, conduzindo ao destino supremo.

A mensagem final não desvaloriza toda prática religiosa. Ela afirma que ações meritórias, quando orientadas apenas a recompensas limitadas, não equivalem à libertação. O conhecimento e a devoção transformam a direção fundamental da existência.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com três pensadores ocidentais

As comparações são aproximações conceituais. Não significam influência direta nem equivalência entre tradições.

### Platão · O mundo sensível e o que permanece

Platão distingue o mundo sensível, sujeito à mudança, das realidades inteligíveis que oferecem estabilidade ao conhecimento. A filosofia exige que a alma não se limite ao que aparece e desaparece, mas busque compreender aquilo que permanece.

**Convergência:** o capítulo 8 também distingue o domínio mutável da existência de um princípio imperecível e orienta a consciência para além das aparências transitórias.

**Diferença:** Platão estrutura essa distinção por meio da teoria das Formas e da ascensão racional da alma. A Gita articula Brahman, o eu, karma, cosmologia e devoção a Krishna. Não se deve identificar Brahman com o mundo das Formas.

### Heidegger · Ser-para-a-morte

Heidegger analisa a morte como possibilidade própria, incontornável e não substituível, que pode revelar a finitude da existência e retirar o indivíduo da dispersão cotidiana. Antecipar a própria finitude pode tornar a vida mais autêntica.

**Convergência:** ambos tratam a consciência da morte como algo que transforma a orientação da vida presente. A lembrança da morte pode reorganizar prioridades e escolhas.

**Diferença:** Heidegger não apresenta uma doutrina de reencarnação ou libertação pós-morte. Sua análise é ontológica e existencial, não uma afirmação religiosa sobre a continuidade da alma.

### Spinoza · Eternidade e compreensão

Spinoza distingue a duração das coisas particulares de uma compreensão *sub specie aeternitatis*, isto é, sob a perspectiva da eternidade. A liberdade cresce quando compreendemos nossa existência a partir da ordem necessária da Natureza, e não apenas de afetos passageiros.

**Convergência:** há uma aproximação na busca por uma perspectiva que ultrapasse a experiência imediata e a sucessão de acontecimentos individuais.

**Diferença:** em Spinoza, a eternidade não significa simplesmente uma vida pessoal que continua depois da morte. A libertação está ligada ao conhecimento adequado e ao amor intelectual de Deus ou Natureza. A Gita apresenta outra cosmologia, com transmigração, devoção e libertação do ciclo de renascimentos.

### O que esse diálogo permite perceber?

Platão ajuda a pensar o que permanece para além das aparências; Heidegger, como a finitude pode despertar a vida presente; Spinoza, como uma perspectiva de eternidade altera a compreensão de nós mesmos. A Gita acrescenta uma resposta espiritual própria: cultivar a lembrança do divino e orientar a consciência para o imperecível.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações práticas contemporâneas

### Na vida pessoal: viver de acordo com o que deseja preservar

O capítulo convida a perguntar quais pensamentos, hábitos e compromissos estamos alimentando. Se a atenção é continuamente capturada por ressentimento, comparação e ansiedade, essas disposições tendem a organizar nossa experiência. Cultivar gratidão, lucidez e compaixão é uma forma de orientar a mente durante a vida, não apenas diante da morte.

### Na educação: formar atenção e propósito

Aprender envolve repetição, memória e direção. O estudante não constrói conhecimento apenas no momento da avaliação: forma hábitos de atenção ao longo do tempo. A ideia de prática contínua ajuda a compreender por que pequenas rotinas consistentes podem transformar capacidades e atitudes.

### Na liderança: manter o propósito em meio à pressão

Uma liderança pode perder sua orientação quando passa a reagir exclusivamente a urgências, indicadores ou disputas internas. O capítulo sugere uma pergunta de gestão: qual é o princípio que deve permanecer presente mesmo quando o contexto muda? A lembrança do propósito ajuda a escolher sem confundir urgência com importância.

### No trabalho: integrar ação e sentido

O verso que une lembrança e ação é especialmente relevante: não é necessário abandonar as responsabilidades para cultivar uma orientação interior. É possível trabalhar, decidir, construir e enfrentar conflitos mantendo valores como referência.

### Diante da finitude: priorizar com lucidez

A consciência de que a vida corporal é limitada pode ajudar a reduzir adiamentos indefinidos. Relações importantes, reparações necessárias, projetos significativos e experiências de aprendizado não precisam ficar sempre para depois. A finitude pode ser uma fonte de clareza, sem exigir medo ou obsessão com a morte.

> **Prática diária de orientação:** pela manhã, escolha uma qualidade que deseja cultivar naquele dia. Durante as atividades, retorne conscientemente a ela. À noite, observe em quais situações conseguiu agir de acordo com essa orientação e onde se dispersou. O objetivo é continuidade, não perfeição.

### Um cuidado essencial

As afirmações sobre o destino após a morte pertencem à visão espiritual da Gita e não são fatos empiricamente demonstrados. Também não devem ser usadas para julgar pessoas que morreram, culpabilizar quem sofre ou sugerir que alguém controla inteiramente as circunstâncias da própria morte.
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Exercício de reflexão pessoal

Responda às cinco questões. A devolutiva é um convite à auto-observação, não uma avaliação psicológica ou espiritual.

### Reflexão aberta

Se você pudesse escolher uma única qualidade para orientar suas decisões durante os próximos sete dias, qual seria? Descreva como ela apareceria em três situações concretas da sua rotina.
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese e integração

### O que levar deste capítulo

- **Brahman:** o princípio imperecível que transcende as formas mutáveis.
- **Adhyatma:** a dimensão interior ou essencial do ser.
- **Karma:** ação e processos que participam da manifestação da existência.
- **Lembrança:** a orientação da consciência no momento final está relacionada ao que foi cultivado ao longo da vida.
- **Prática:** concentração, disciplina e devoção devem acompanhar a ação cotidiana.
- **Impermanência:** até os mundos e estados mais elevados estão sujeitos à dissolução.
- **Libertação:** o destino supremo ultrapassa o ciclo de nascimento, morte e retorno.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 8.1–4 | As perguntas de Arjuna e as definições de Krishna. |
| 8.5–8 | A lembrança do divino no momento da morte e a prática contínua. |
| 8.9–13 | A contemplação do Supremo e o símbolo Om. |
| 8.15–16 | A libertação para além dos mundos sujeitos ao retorno. |
| 8.17–22 | Os ciclos cósmicos e o princípio imperecível. |
| 8.23–28 | Os caminhos após a morte e o conhecimento que conduz ao destino supremo. |

### Conexão com a jornada

O capítulo 7 apresentou o conhecimento e a realização da natureza divina. O capítulo 8 aprofunda o tema do imperecível e da orientação da consciência diante da morte. O próximo capítulo, **Raja Vidya Raja Guhya Yoga**, apresenta o conhecimento régio e o segredo supremo: a presença do divino em todos os seres e a possibilidade de dedicar a vida inteira a essa realidade.

> **Frase de integração:** a consciência da finitude não precisa nos paralisar. Ela pode ensinar a viver com atenção, cultivar o que realmente importa e orientar cada ação por um princípio que não dependa apenas das circunstâncias.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 8
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

update public.etapas e
set quiz_modo = 'faixas', quiz_chave_alvo = 'C'
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 8 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado)
select e.id, v.ordem, v.enunciado
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'O que mais ocupa sua atenção ao longo de um dia comum?'),
  (2, 'Quando pensa na finitude da vida, o que acontece?'),
  (3, 'Como você lida com a necessidade de manter uma prática ou compromisso?'),
  (4, 'Diante de uma decisão difícil, o que ajuda a manter sua direção?'),
  (5, 'Como interpretar a orientação de lembrar-se do divino em todos os momentos?')
) as v(ordem, enunciado)
where c.numero = 8 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Preocupações, comparações e problemas que se repetem sem solução.'),
  (1, 'B', 'Demandas imediatas, com pouco espaço para reflexão.'),
  (1, 'C', 'Procuro reservar momentos para lembrar meus valores e orientar minhas ações.'),
  (2, 'A', 'Evito o assunto porque me causa desconforto.'),
  (2, 'B', 'Penso nisso ocasionalmente, mas não altero minhas prioridades.'),
  (2, 'C', 'Uso essa consciência para avaliar o que merece meu tempo e cuidado.'),
  (3, 'A', 'Dependo muito da motivação do momento.'),
  (3, 'B', 'Consigo manter por períodos, mas perco continuidade.'),
  (3, 'C', 'Procuro criar hábitos simples e retomar quando falho.'),
  (4, 'A', 'Principalmente o medo de perder ou desagradar.'),
  (4, 'B', 'A análise das consequências imediatas.'),
  (4, 'C', 'A combinação entre consequências, valores e propósito de longo prazo.'),
  (5, 'A', 'Como abandonar as responsabilidades do cotidiano.'),
  (5, 'B', 'Como pensar apenas na morte e no que virá depois.'),
  (5, 'C', 'Como cultivar uma referência interior que também orienta a ação cotidiana.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 8 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (4, 'Suas respostas sugerem uma prática consistente de orientação por valores, propósito e continuidade. O desafio é preservar essa direção sem transformar a disciplina em rigidez e sem exigir perfeição de si mesmo.'),
  (2, 'Você demonstra alguma intenção de viver com propósito, mas sua atenção pode ser capturada por urgências ou oscilar conforme a motivação. Pequenos rituais de retomada podem ajudar a criar continuidade.'),
  (0, 'Suas respostas apontam uma oportunidade de construir uma referência mais estável para as decisões. Comece escolhendo uma qualidade e pratique-a em situações pequenas e observáveis durante alguns dias.')
) as v(minimo, texto)
where c.numero = 8 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
