-- Jornada da Virtude v2.0 — conteúdo do capítulo 10 (Vibhuti Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz da etapa 5 (com 15 alternativas)
-- e as 3 leituras por faixa. Neste capítulo o quiz usa o modo "faixas" (migração
-- 20261119000100_quiz_por_faixas.sql): a alternativa C é a alinhada ao ensinamento e a leitura
-- depende de quantas vezes ela foi escolhida (4 ou mais, 2 ou 3, menos de 2).
-- Idempotente: upsert por numero em capitulos, por (capitulo_id, ordem) em etapas, por
-- (etapa_id, ordem) em perguntas, por (pergunta_id, chave) em opcoes e por (etapa_id, minimo) em
-- leituras. Rodar de novo atualiza o texto e não duplica nada. Não insere registros de usuário.
--
-- O Markdown usa GFM (tabelas) e não contém HTML, CSS nem JavaScript.
-- No HTML de origem o capítulo tem um bloco "Ideia central" antes das seis seções; aqui ele abre a etapa 1.

insert into public.capitulos (numero, titulo)
values (10, 'Vibhuti Yoga — O Yoga das Manifestações Divinas')
on conflict (numero) do update set titulo = excluded.titulo;

-- ---------------------------------------------------------------------------
-- Etapas: nome e texto
-- ---------------------------------------------------------------------------
insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Ideia central

O capítulo 10 apresenta as **vibhutis**, manifestações ou expressões da excelência e da potência divina. Krishna afirma ser a origem de tudo e descreve sua presença por meio de exemplos extraordinários da natureza, da cultura, do conhecimento, da força e da ordem cósmica.

A intenção não é oferecer um catálogo completo de divindades, seres ou fenômenos. É ensinar Arjuna a reconhecer que aquilo que há de mais elevado, luminoso, poderoso ou significativo pode funcionar como sinal da realidade divina que sustenta o mundo.

> **Pergunta-guia:** como reconhecer a dimensão maior da existência sem confundir uma manifestação particular com a totalidade do divino?

## Contexto histórico e filosófico

A Bhagavad Gita integra o *Mahabharata*. Nos capítulos anteriores, Krishna apresentou caminhos de ação, conhecimento e meditação, além de explicar sua relação com a natureza e com os seres. No capítulo 10, Arjuna pede que Krishna explique mais profundamente sua origem e suas manifestações.

O termo sânscrito **vibhuti** pode ser entendido como manifestação, poder, glória, excelência ou expressão extraordinária. Krishna utiliza imagens conhecidas da cosmologia, da mitologia e da cultura védica para indicar que a realidade divina se expressa em diferentes níveis do universo.

O capítulo funciona como preparação para o capítulo 11. Primeiro, Arjuna aprende a reconhecer manifestações particulares da grandeza divina; depois, pede para contemplar a forma universal que reúne todas elas.

> **Como ler a lista de manifestações:** os exemplos pertencem ao universo cultural e religioso da Índia antiga. Não devem ser lidos como uma classificação científica ou como uma lista universal de superioridade entre povos e seres. Sua função é pedagógica e contemplativa: apontar para o divino por meio do extraordinário.
$md$),

(2, 'Conceitos fundamentais', $md$
## Conceitos fundamentais e percurso dos versos

### 2.1 A origem de tudo (10.1–7)

Krishna inicia reafirmando que sua origem não pode ser plenamente conhecida por deuses ou grandes sábios, pois ele é apresentado como princípio de onde procedem. Em seguida, enumera qualidades e estados que surgem na existência: inteligência, conhecimento, clareza, perdão, verdade, autocontrole, serenidade, prazer, dor, nascimento, morte, medo e destemor.

A enumeração é significativa porque inclui tanto experiências consideradas positivas quanto experiências difíceis. O texto apresenta a realidade inteira como dependente de um fundamento divino, embora isso não signifique que todas as ações humanas sejam moralmente equivalentes ou automaticamente justificadas.

Krishna afirma que aqueles que compreendem sua manifestação e sua origem permanecem firmes no yoga. Conhecer o princípio não é apenas memorizar uma doutrina: é reorganizar a compreensão da existência.

### 2.2 A devoção nasce do reconhecimento (10.8–11)

Krishna declara ser a origem de tudo e que tudo procede dele. Os que compreendem essa afirmação dedicam-se a ele com devoção. Conversam sobre o divino, iluminam-se mutuamente e encontram satisfação nessa relação.

O texto apresenta uma dimensão comunitária da espiritualidade: a busca não acontece apenas no isolamento. A reflexão compartilhada, a memória do sagrado e a troca entre pessoas comprometidas com a verdade fortalecem a compreensão.

Krishna também afirma que concede a inteligência pela qual seus devotos podem aproximar-se dele e dissipa a ignorância com a luz do conhecimento. A graça divina e o esforço humano aparecem relacionados, embora a maneira de compreender essa relação varie entre as escolas teológicas.

> *A devoção é descrita como uma relação que ilumina a compreensão e transforma a maneira de viver, não apenas como uma emoção passageira.* — Síntese interpretativa de 10.8–11

### 2.3 Arjuna reconhece a grandeza de Krishna (10.12–18)

Arjuna reconhece Krishna como o Supremo, o fundamento e a realidade primordial. Ele afirma que sábios e seres divinos também proclamam essa grandeza. Ainda assim, deseja ouvir do próprio Krishna as manifestações pelas quais pode contemplá-lo continuamente.

O pedido de Arjuna é prático: como manter a lembrança do divino no cotidiano? Em que formas, fenômenos e experiências pode reconhecer essa presença? A resposta de Krishna transforma a contemplação em um exercício de atenção ao mundo.

### 2.4 As manifestações de Krishna (10.19–38)

Krishna apresenta uma série de exemplos. A lista é extensa e combina elementos da cosmologia, da natureza, da mitologia e da sociedade. Em cada grupo, ele se identifica com aquilo que representa o ápice, a força, a luz, a excelência ou a referência mais elevada.

- **No cosmos:** Krishna se apresenta como o princípio luminoso entre os astros, a consciência nos seres e a força que sustenta a ordem universal.
- **Na natureza:** o oceano, a montanha, o vento e o tempo aparecem como imagens de grandeza, movimento e poder.
- **Entre os seres:** seres míticos, animais e figuras exemplares são usados como símbolos de força, majestade ou excelência.
- **No conhecimento e na cultura:** o conhecimento espiritual, a palavra, a memória, a inteligência e a disciplina são apresentados como expressões relevantes da grandeza.

Alguns exemplos conhecidos incluem Krishna como o Eu presente nos corações dos seres; entre as luzes, o Sol; entre as montanhas, Meru; entre os rios, o Ganges; entre as armas, o raio; entre os meses, o período associado à primavera; e entre os guerreiros, Rama.

O ponto não é que apenas esses elementos tenham valor. A lista utiliza referências de grandeza reconhecidas no horizonte cultural do texto para educar a percepção de Arjuna.

### 2.5 A síntese: uma fração do esplendor (10.39–42)

Krishna conclui que não há ser ou realidade que exista independentemente dele. Porém, não é necessário enumerar todas as manifestações: qualquer ser extraordinariamente poderoso, belo ou esplêndido pode ser compreendido como portador de uma parcela de seu brilho.

> *“Com apenas uma fração de mim, sustento todo este universo.”* — Paráfrase de 10.42

Essa conclusão impede que o catálogo seja confundido com a totalidade. As manifestações são sinais, não limites do divino. O princípio que as sustenta excede cada exemplo individual.

> **Distinção filosófica:** reconhecer o divino em uma manifestação não significa afirmar que aquela manifestação esgota o divino. O símbolo aponta para algo maior do que ele próprio.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com três pensadores ocidentais

As comparações são aproximações conceituais. Não significam influência direta nem equivalência entre tradições.

### Platão: participação e beleza

Na filosofia platônica, as coisas belas e justas que encontramos no mundo sensível podem orientar a inteligência para realidades mais fundamentais, como o Belo em si e o Justo em si. A experiência particular pode funcionar como ponto de partida para uma compreensão mais ampla.

**Convergência:** tanto a leitura platônica quanto as vibhutis permitem pensar que uma manifestação particular pode apontar para um fundamento que a ultrapassa.

**Diferença:** Platão organiza sua metafísica em torno das Formas inteligíveis. A Gita apresenta Krishna como origem e sustentação das manifestações, em uma estrutura teísta e devocional própria.

### Spinoza: expressões da Natureza

Para Spinoza, tudo o que existe é expressão da única substância, Deus ou Natureza. Os seres particulares são modos finitos dessa realidade infinita. Compreender as coisas é perceber sua inserção na ordem necessária da Natureza.

**Convergência:** ambos oferecem uma visão na qual os seres não são realidades absolutamente independentes e isoladas. O particular remete a uma totalidade mais ampla.

**Diferença:** Spinoza não descreve Deus como uma pessoa que recebe devoção, concede graça ou escolhe manifestações por vontade. A Gita conserva uma dimensão pessoal e relacional do divino.

### Aristóteles: excelência e finalidade

Aristóteles investiga a natureza dos seres, suas capacidades e aquilo que constitui sua excelência. A virtude representa a realização adequada de uma capacidade humana, orientada pela razão prática e pela busca da vida boa.

**Convergência:** a atenção à excelência pode aproximar-se, em sentido analógico, do modo como Krishna aponta para expressões máximas de força, inteligência e grandeza.

**Diferença:** Aristóteles não interpreta a excelência de cada domínio como manifestação de uma divindade pessoal que sustenta o cosmos. Sua explicação é teleológica e filosófica, com conceitos próprios.

### O que esse diálogo permite perceber?

Platão ajuda a pensar o particular como sinal de uma realidade mais profunda; Spinoza, a integração de cada ser em uma totalidade; Aristóteles, a excelência como realização de capacidades. A Gita combina essas questões em uma perspectiva devocional: o mundo pode ser contemplado como campo de manifestações da grandeza divina.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações práticas contemporâneas

### Na vida pessoal: treinar a atenção para o que tem valor

O capítulo convida a desenvolver um olhar que reconhece beleza, inteligência, coragem, generosidade e excelência. Em vez de atravessar o cotidiano de forma automática, podemos aprender com aquilo que manifesta qualidades que admiramos. A contemplação, nesse sentido, torna-se exercício de atenção e gratidão.

### Na educação: reconhecer excelência sem criar idolatria

Um educador pode apresentar obras, ideias e pessoas exemplares como referências de excelência, ajudando estudantes a investigar o que as torna significativas. O cuidado é não transformar admiração em culto à personalidade: reconhecer uma qualidade não exige considerar alguém infalível.

### Na liderança: identificar e desenvolver potência

Em uma equipe, as manifestações de excelência aparecem de formas diferentes: pensamento analítico, criatividade, coragem para decidir, capacidade de escuta, consistência operacional e generosidade. Liderar bem é perceber essas forças, criar condições para que floresçam e colocá-las a serviço de um propósito comum.

### No trabalho: distinguir o brilho do fundamento

Resultados extraordinários, marcas fortes, tecnologias e talentos podem impressionar. Mas nenhum deles deve ser confundido com o propósito maior da organização. O capítulo sugere uma pergunta útil: a excelência que admiramos está a serviço de quê?

### Na convivência: reverência sem submissão cega

Reconhecer grandeza em pessoas e fenômenos não significa abandonar o discernimento. É possível admirar uma competência e, ao mesmo tempo, questionar uma decisão; aprender com alguém sem aceitar todos os seus comportamentos; reconhecer valor sem entregar a própria autonomia.

> **Prática de contemplação:** ao final do dia, registre três manifestações de excelência que você observou: uma na natureza, uma em uma pessoa e uma em uma ação ou ideia. Em cada caso, identifique a qualidade admirável e pense em como cultivá-la em sua própria vida.

### Um cuidado essencial

A lista de manifestações utiliza referências culturais e religiosas específicas. Não deve ser usada para afirmar que certos povos, grupos ou indivíduos possuem valor humano superior. A dignidade das pessoas não depende de desempenho, poder, fama ou excelência extraordinária.
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Exercício de reflexão pessoal

Responda às cinco questões. A devolutiva é um convite à auto-observação, não uma avaliação psicológica ou espiritual.

### Reflexão aberta

Escolha uma pessoa, obra, fenômeno da natureza ou experiência que desperte sua admiração. Qual qualidade ela manifesta? O que essa qualidade revela sobre aquilo que você considera valioso? Como poderia cultivar algo semelhante sem imitar superficialmente o exemplo?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese e integração

### O que levar deste capítulo

- **Vibhuti:** manifestação, expressão ou sinal da grandeza e da potência divina.
- **Origem:** Krishna é apresentado como fonte de todos os seres e fundamento de suas manifestações.
- **Contemplação:** reconhecer o extraordinário pode educar a percepção para uma realidade maior.
- **Devoção:** a compreensão do divino conduz a uma relação de confiança, dedicação e busca.
- **Limite do símbolo:** nenhuma manifestação particular esgota a totalidade do princípio que representa.
- **Excelência:** beleza, força, inteligência e grandeza podem tornar-se oportunidades de aprendizado e contemplação.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 10.8 | Krishna como origem de tudo. |
| 10.9–11 | A devoção, a troca entre os buscadores e a iluminação do conhecimento. |
| 10.20 | O Eu presente nos corações dos seres. |
| 10.21–38 | Exemplos das manifestações divinas. |
| 10.39 | A presença divina como fundamento dos seres. |
| 10.41–42 | O esplendor das manifestações e a totalidade sustentada por uma fração do divino. |

### Conexão com a jornada

O capítulo 9 apresentou o conhecimento régio e a relação íntima entre o divino e o universo. O capítulo 10 amplia essa visão por meio das manifestações da grandeza divina. No capítulo 11, **Vishvarupa Darshana Yoga**, Arjuna pede para contemplar a forma universal que reúne todas essas manifestações em uma visão cósmica.

> **Frase de integração:** o extraordinário pode ser uma janela para o que é maior do que ele. Aprender a contemplar é reconhecer a grandeza sem aprisioná-la em uma única forma.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 10
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

-- ---------------------------------------------------------------------------
-- Quiz da etapa 5 (modo "faixas": conta as escolhas da alternativa C)
-- ---------------------------------------------------------------------------
update public.etapas e
set quiz_modo = 'faixas', quiz_chave_alvo = 'C'
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 10 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado)
select e.id, v.ordem, v.enunciado
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Quando você encontra alguém com uma qualidade extraordinária, como costuma reagir?'),
  (2, 'Com que frequência você percebe beleza, inteligência ou generosidade no cotidiano?'),
  (3, 'Como você lida com pessoas que admira?'),
  (4, 'Na liderança ou no trabalho em equipe, você identifica as diferentes formas de excelência?'),
  (5, 'Qual é a principal lição das vibhutis?')
) as v(ordem, enunciado)
where c.numero = 10 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Sinto inveja ou comparo imediatamente com minhas próprias capacidades.'),
  (1, 'B', 'Admiro, mas não procuro compreender o que posso aprender.'),
  (1, 'C', 'Reconheço a qualidade e procuro aprender com ela sem diminuir meu próprio valor.'),
  (2, 'A', 'Raramente; estou quase sempre concentrado em problemas e tarefas.'),
  (2, 'B', 'Percebo em ocasiões especiais.'),
  (2, 'C', 'Procuro desenvolver atenção para reconhecer essas qualidades nas pequenas situações.'),
  (3, 'A', 'Tendo a idealizá-las e ignorar seus limites.'),
  (3, 'B', 'Evito admirar para não me decepcionar.'),
  (3, 'C', 'Reconheço suas qualidades sem abrir mão do discernimento.'),
  (4, 'A', 'Valorizo principalmente quem entrega resultados mais visíveis.'),
  (4, 'B', 'Reconheço algumas competências, mas posso deixar talentos pouco evidentes de lado.'),
  (4, 'C', 'Procuro perceber competências diversas e criar espaço para que contribuam.'),
  (5, 'A', 'O extraordinário deve ser admirado como um fim em si mesmo.'),
  (5, 'B', 'A grandeza pertence apenas a figuras ou fenômenos excepcionais.'),
  (5, 'C', 'O que há de extraordinário pode apontar para uma realidade maior que o próprio exemplo.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 10 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (4, 'Suas respostas indicam uma disposição para reconhecer excelência sem perder o discernimento e para aprender com o que há de valioso ao redor. O desafio é transformar admiração em prática, sem idealização.'),
  (2, 'Você demonstra alguma abertura para perceber e aprender com manifestações de excelência. Pode aprofundar esse olhar observando melhor qualidades menos visíveis e distinguindo admiração de idealização.'),
  (0, 'Suas respostas apontam uma oportunidade de exercitar a atenção ao valor presente no cotidiano. Comece reconhecendo uma qualidade concreta em alguém ou em uma experiência e identifique como ela pode inspirar uma ação sua.')
) as v(minimo, texto)
where c.numero = 10 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
