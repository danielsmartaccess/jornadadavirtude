-- Jornada da Virtude v2.0 — conteúdo do capítulo 11 (Vishvarupa Darshana Yoga)
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
values (11, 'Vishvarupa Darshana Yoga — O Yoga da Visão da Forma Universal')
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

O capítulo 11 apresenta a visão da **forma universal** (*Vishvarupa*): Arjuna vê em Krishna a totalidade do universo, com seus seres, tempos, acontecimentos, nascimentos e mortes. A visão rompe a percepção limitada e revela uma realidade que ultrapassa a compreensão individual.

Essa experiência é simultaneamente fascinante e aterradora. Arjuna contempla beleza, multiplicidade e esplendor, mas também destruição e finitude. A totalidade não é apenas aquilo que acolhe e encanta; inclui forças que dissolvem as formas e encerram ciclos.

> **Pergunta-guia:** o que acontece com nossa visão de mundo quando percebemos que fazemos parte de uma realidade muito maior do que nossos interesses e planos individuais?

## Contexto histórico e filosófico

A Bhagavad Gita integra o *Mahabharata*. Depois de apresentar a Arjuna diferentes caminhos de conhecimento, ação, meditação e compreensão do divino, Krishna oferece uma manifestação extraordinária de sua natureza universal.

Nos capítulos anteriores, Krishna descreveu suas manifestações e afirmou ser a origem e o fundamento de tudo. Arjuna, convencido pela exposição, pede para contemplar essa realidade diretamente. A visão do capítulo 11 não é uma demonstração racional comum: é uma experiência reveladora, concedida por uma capacidade especial de percepção.

O episódio pertence à linguagem teológica, poética e simbólica da tradição indiana. A forma universal expressa a impossibilidade de reduzir o divino a uma imagem limitada ou a uma manifestação isolada. O cosmos inteiro, com sua diversidade e seus processos, aparece integrado em uma única visão.

> **Distinção de leitura:** a narrativa pode ser estudada como revelação religiosa, imagem metafísica da totalidade ou símbolo da transformação da consciência. Essas leituras podem dialogar, mas não são idênticas. O texto não está descrevendo uma observação científica do universo.
$md$),

(2, 'Conceitos fundamentais', $md$
## Conceitos fundamentais e percurso dos versos

### 2.1 O pedido de Arjuna (11.1–4)

Arjuna afirma que suas dúvidas foram profundamente esclarecidas pelas palavras de Krishna. Ele ouviu sobre a origem e a natureza dos seres e deseja contemplar a forma divina em sua plenitude. Seu pedido é uma passagem da compreensão recebida pela palavra para uma experiência direta.

Krishna aceita, mas avisa que a visão exige uma forma especial de percepção. Não basta o olhar comum. A realidade que será revelada excede os limites habituais dos sentidos.

### 2.2 A revelação da forma universal (11.5–14)

Krishna apresenta inúmeras formas, cores, rostos, olhos, ornamentos e armas. Arjuna vê divindades, seres e dimensões do cosmos reunidos em uma única manifestação. A imagem é de multiplicidade sem separação: incontáveis formas aparecem integradas em uma realidade abrangente.

A descrição não pretende oferecer um retrato anatômico ou uma imagem literal. A linguagem acumulativa comunica excesso, vastidão e impossibilidade de representação. O universo inteiro parece estar presente em um só corpo cósmico.

> *A visão reúne o múltiplo sem apagar sua diversidade: muitos rostos, muitos seres e incontáveis manifestações em uma totalidade.* — Síntese interpretativa de 11.10–14

### 2.3 O espanto diante do cosmos (11.15–22)

Arjuna reconhece os deuses, sábios e seres de diferentes planos da existência na forma universal. Ele percebe que a realidade contemplada não pode ser delimitada: não encontra começo, meio ou fim. O esplendor é extraordinário e, ao mesmo tempo, difícil de suportar.

O capítulo apresenta uma tensão importante: o divino não cabe nas categorias habituais de conforto humano. A experiência do sagrado pode produzir reverência, assombro e desorientação, não apenas serenidade.

### 2.4 O terror da destruição (11.23–30)

A visão se torna aterradora. Arjuna vê seres e guerreiros sendo conduzidos às bocas flamejantes da forma universal, como rios que correm para o oceano ou insetos atraídos pelo fogo. A imagem comunica a força inevitável do tempo e da morte.

O universo não é apresentado como um cenário imóvel, organizado apenas para a satisfação humana. Ele envolve criação e dissolução, nascimento e morte, construção e destruição. A forma universal inclui processos que ultrapassam a vontade individual.

> **Uma leitura difícil, mas necessária:** reconhecer a dimensão destrutiva da realidade não significa aprovar a violência humana. O texto trabalha com a escala cósmica do tempo e da dissolução; não oferece licença moral para crueldade ou abuso.

### 2.5 Krishna como Tempo (11.31–34)

Arjuna pergunta quem é essa forma terrível. Krishna responde que é o Tempo, destruidor dos mundos, que avança para consumir os seres. A declaração desloca a perspectiva de Arjuna: os acontecimentos não dependem exclusivamente de sua vontade ou de sua ação individual.

Krishna diz a Arjuna que se levante e cumpra seu papel. Os guerreiros já estão destinados à morte dentro da ordem narrativa da visão; Arjuna é convocado a agir como instrumento. Essa passagem deve ser lida dentro do debate da Gita sobre dharma, ação e responsabilidade, não como autorização geral para violência.

> *“Eu sou o Tempo, o grande destruidor dos mundos.”* — Paráfrase de 11.32

### 2.6 O retorno à relação pessoal (11.35–46)

Arjuna, tomado pelo temor e pela reverência, reconhece a grandeza de Krishna e pede perdão por tê-lo tratado anteriormente como amigo em situações cotidianas, sem compreender plenamente sua natureza divina. Ele solicita que Krishna retorne a uma forma mais familiar e acessível.

Esse pedido é significativo: a experiência da totalidade é grandiosa, mas a relação pessoal também possui valor. O ser humano precisa de formas de vínculo e comunicação que tornem possível viver a compreensão no cotidiano.

### 2.7 A visão, a devoção e a graça (11.47–55)

Krishna afirma que a visão não é alcançada por estudo, sacrifício ou austeridade isoladamente. Ela é concedida por graça. O capítulo conclui que a devoção exclusiva, acompanhada de ação dedicada e orientação ao divino, permite conhecer e aproximar-se de Krishna.

A revelação não termina em espetáculo. Ela exige transformação: dedicação, ação, desapego e ausência de hostilidade em relação aos seres.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com três pensadores ocidentais

As comparações são aproximações filosóficas. Não indicam influência direta nem identidade entre sistemas.

### Plotino: o Uno e a origem da multiplicidade

Plotino concebe o Uno como princípio supremo, além das determinações comuns, do qual procede a multiplicidade da realidade. A experiência filosófica de retorno ao princípio envolve ultrapassar a percepção fragmentada.

**Convergência:** ambos permitem pensar uma unidade que fundamenta a diversidade e excede a apreensão comum.

**Diferença:** o Uno plotiniano está além do ser e do pensamento, enquanto a forma universal da Gita é uma manifestação divina que inclui e apresenta visualmente a multiplicidade cósmica. As arquiteturas metafísicas não são equivalentes.

### Spinoza: Deus ou Natureza como totalidade

Spinoza sustenta que existe uma única substância infinita, Deus ou Natureza, da qual todas as coisas são modos. O ser humano é uma expressão finita dessa realidade, não um reino separado dela.

**Convergência:** a ideia de que o indivíduo integra uma totalidade maior questiona o antropocentrismo e a ilusão de independência absoluta.

**Diferença:** Spinoza rejeita a imagem de um Deus pessoal que decide e intervém por vontade. A Gita apresenta Krishna como realidade divina pessoal e universal, com linguagem de relação, graça e devoção.

### Nietzsche: o trágico e a afirmação da existência

Nietzsche enfrenta a dimensão trágica da existência: sofrimento, transformação, destruição e ausência de garantias confortáveis. Sua filosofia questiona a expectativa de que a realidade deva se ajustar aos desejos humanos.

**Convergência:** a visão de Arjuna rompe uma percepção ingênua e o obriga a encarar a realidade para além de seus desejos e medos.

**Diferença:** Nietzsche não oferece uma doutrina de entrega a um Deus criador e destruidor. Sua afirmação trágica da vida não deve ser confundida com a submissão devocional da Gita.

### O que esse diálogo permite perceber?

Plotino ajuda a pensar a unidade por trás da multiplicidade; Spinoza, a integração do indivíduo na totalidade da Natureza; Nietzsche, a coragem de encarar a dimensão trágica da existência. A Gita acrescenta uma perspectiva própria: a totalidade é revelada como forma divina e a experiência conduz Arjuna à devoção e à ação orientada pelo dharma.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações práticas contemporâneas

### Na vida pessoal: sair do centro de tudo

A visão universal desafia a tendência de interpretar cada acontecimento apenas pelo impacto que produz em nós. Nossos projetos importam, mas não são a medida de toda a realidade. Reconhecer limites e interdependências pode reduzir a arrogância e ampliar a responsabilidade.

### Na educação: formar visão sistêmica

Um problema complexo raramente tem uma única causa. Na educação, resultados dependem de condições familiares, institucionais, econômicas, pedagógicas e individuais. A visão de totalidade convida a abandonar explicações simplistas sem apagar a responsabilidade de cada agente.

### Na liderança: compreender consequências e interdependências

Decisões de gestão produzem efeitos que ultrapassam o setor ou a pessoa que as tomou. Uma liderança madura considera impactos sobre equipes, clientes, parceiros, comunidade e ambiente. Ver o sistema não é perder capacidade de decidir; é decidir com mais consciência das consequências.

### No trabalho: aceitar limites sem abandonar a ação

Há fatores que não controlamos: tempo, mudanças de mercado, decisões de terceiros e acontecimentos imprevistos. Reconhecer isso não significa passividade. Significa separar o que depende de nossa ação, o que podemos influenciar e o que precisamos aceitar, preservando energia para agir onde existe possibilidade real.

### Diante da finitude: dar perspectiva ao que importa

A lembrança de que o tempo é limitado pode reorganizar prioridades. Em vez de viver apenas acumulando reconhecimento, podemos investir em relações, trabalho significativo, aprendizado e contribuição. A consciência da finitude não precisa produzir desespero; pode produzir clareza.

> **Prática de perspectiva:** diante de uma decisão difícil, escreva: (1) o que está sob meu controle; (2) quem será afetado; (3) quais consequências podem surgir no curto e no longo prazo; (4) qual ação é coerente com meus valores, mesmo sem garantia de resultado.

### Um cuidado essencial

A ideia de que fazemos parte de uma totalidade não deve apagar a singularidade das pessoas nem justificar fatalismo. “Tudo faz parte de um plano” não é resposta suficiente diante de sofrimento, injustiça ou violência. A visão ampla precisa aumentar a responsabilidade, não dissolvê-la.
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Exercício de reflexão pessoal

Responda às cinco questões. A devolutiva é um instrumento de auto-observação, não uma avaliação psicológica ou espiritual.

### Reflexão aberta

Identifique uma situação em que você está excessivamente concentrado no seu próprio ponto de vista. Quem mais é afetado? Que fatores você talvez não esteja enxergando? O que mudaria em sua decisão se considerasse o quadro mais amplo?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese e integração

### O que levar deste capítulo

- **Vishvarupa:** a forma universal que manifesta a totalidade cósmica em Krishna.
- **Visão ampliada:** perceber que a realidade excede a perspectiva e os interesses individuais.
- **Tempo:** força que transforma e dissolve as formas; a finitude integra a existência.
- **Assombro e temor:** a experiência do sagrado pode desestabilizar certezas e exigir humildade.
- **Ação:** reconhecer limites do controle não elimina a responsabilidade de cumprir o próprio papel.
- **Devoção:** a visão culmina em entrega, dedicação e ausência de hostilidade em relação aos seres.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 11.4–8 | O pedido de Arjuna e a concessão da visão divina. |
| 11.10–14 | A manifestação da forma universal. |
| 11.23–30 | O assombro e o terror diante da destruição. |
| 11.32 | Krishna como Tempo, destruidor dos mundos. |
| 11.45–46 | O pedido de Arjuna para retornar à forma familiar. |
| 11.54–55 | Devoção, ação dedicada e aproximação do divino. |

### Conexão com a jornada

O capítulo 10 apresentou as manifestações da grandeza divina no mundo. O capítulo 11 amplia essa compreensão até a visão da totalidade cósmica. O capítulo 12, **Bhakti Yoga**, responde à pergunta prática: como viver uma relação com o divino depois de contemplar essa grandeza? A resposta passa pela devoção, pelo caráter e pela entrega.

> **Frase de integração:** minha perspectiva é parcial, minha existência é finita e minhas ações fazem parte de uma realidade maior. Essa consciência deve produzir humildade, lucidez e responsabilidade, não passividade.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 11
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

-- ---------------------------------------------------------------------------
-- Quiz da etapa 5 (modo "faixas": conta as escolhas da alternativa C)
-- ---------------------------------------------------------------------------
update public.etapas e
set quiz_modo = 'faixas', quiz_chave_alvo = 'C'
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 11 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado)
select e.id, v.ordem, v.enunciado
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Quando algo foge ao seu planejamento, qual é sua reação mais comum?'),
  (2, 'Ao tomar uma decisão, quanto você considera os efeitos sobre o sistema ao redor?'),
  (3, 'Como você reage diante daquilo que não consegue compreender completamente?'),
  (4, 'A consciência de que o tempo é limitado influencia suas prioridades?'),
  (5, 'O que a visão universal de Krishna pode representar como aprendizado prático?')
) as v(ordem, enunciado)
where c.numero = 11 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Tento controlar tudo e fico muito frustrado quando não consigo.'),
  (1, 'B', 'Desisto de agir porque entendo que não depende de mim.'),
  (1, 'C', 'Reavalio o cenário e identifico onde ainda posso agir.'),
  (2, 'A', 'Principalmente o impacto imediato sobre mim.'),
  (2, 'B', 'Considero alguns efeitos, mas nem sempre de forma organizada.'),
  (2, 'C', 'Procuro mapear pessoas, relações e consequências de curto e longo prazo.'),
  (3, 'A', 'Rejeito ou simplifico para recuperar a sensação de controle.'),
  (3, 'B', 'Fico paralisado pela incerteza.'),
  (3, 'C', 'Reconheço os limites do meu conhecimento e continuo investigando.'),
  (4, 'A', 'Raramente penso nisso.'),
  (4, 'B', 'Penso, mas tenho dificuldade de transformar isso em escolhas.'),
  (4, 'C', 'Procuro orientar meu tempo para relações, projetos e valores importantes.'),
  (5, 'A', 'Que os acontecimentos estão determinados e minha ação não importa.'),
  (5, 'B', 'Que devo ignorar o sofrimento porque tudo pertence à totalidade.'),
  (5, 'C', 'Que minha perspectiva é limitada e devo agir com humildade e responsabilidade.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 11 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (4, 'Suas respostas sugerem uma boa disposição para considerar contextos amplos, reconhecer limites e agir com responsabilidade. O desafio é manter essa perspectiva quando a pressão emocional estreitar seu campo de visão.'),
  (2, 'Você demonstra alguma abertura para ampliar a perspectiva, mas pode haver situações em que o controle, a incerteza ou o foco imediato dominem suas decisões. Observe esses momentos sem julgamento.'),
  (0, 'Suas respostas apontam uma oportunidade de praticar a visão sistêmica e distinguir controle de responsabilidade. Comece por uma decisão pequena: mapeie quem é afetado e identifique uma ação concreta que depende de você.')
) as v(minimo, texto)
where c.numero = 11 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
