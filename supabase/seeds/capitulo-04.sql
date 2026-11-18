-- Jornada da Virtude v2.0 — conteúdo do capítulo 4 (Jnana Karma Sannyasa Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz de compreensão (15 alternativas,
-- uma correta em cada pergunta) e as 3 leituras por número de acertos (modo "acertos").
-- Idempotente: upsert por numero, (capitulo_id, ordem), (etapa_id, ordem), (pergunta_id, chave) e
-- (etapa_id, minimo). Não insere registros de usuário.
-- O HTML tem 7 seções: "Mapa do capítulo" e "Conceitos fundamentais" formam a etapa 2.

insert into public.capitulos (numero, titulo)
values (4, 'Jnana Karma Sannyasa Yoga — O Yoga do Conhecimento, da Ação e da Renúncia')
on conflict (numero) do update set titulo = excluded.titulo;

insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Contexto: conhecimento que transforma a ação

No capítulo 3, Krishna ensinou que a liberdade não exige abandonar a ação. No capítulo 4, aprofunda a questão: a ação pode deixar de aprisionar quando é iluminada pelo conhecimento, pela compreensão de sua natureza e pela renúncia ao ego que reivindica seus resultados.

Krishna inicia afirmando que ensinou esse yoga a Vivasvat, o Sol, que o transmitiu a Manu e este a Ikshvaku. Arjuna questiona como Krishna poderia ter ensinado algo em uma era tão remota. A resposta introduz a dimensão divina da narrativa: Krishna afirma que, embora seja não nascido e imperecível, manifesta-se no mundo quando o *dharma* enfraquece.

> **Tese do capítulo:** conhecimento não é acumular informação. É discernimento capaz de revelar a natureza da ação, desfazer a ignorância e transformar a maneira como participamos do mundo.

### Contexto filosófico e religioso

O capítulo articula três temas: a transmissão de um ensinamento ao longo do tempo, a manifestação divina para restaurar o *dharma* e a libertação por meio do conhecimento. A linguagem de Krishna combina cosmologia, devoção, ética e investigação da ação. Não é adequado reduzir a manifestação divina a uma simples metáfora de liderança moral, embora seja possível extrair implicações éticas para a vida contemporânea.

O texto também apresenta diferentes formas de ação ritual e disciplina espiritual como caminhos que podem culminar no conhecimento. O ponto culminante é a compreensão que dissolve a ignorância, não a execução mecânica de práticas.
$md$),

(2, 'Conceitos fundamentais', $md$
## Mapa do capítulo: os 42 versos

### 4.1–4.3 · A tradição do ensinamento

Krishna apresenta uma linhagem antiga de transmissão do yoga. Com o passar do tempo, esse conhecimento teria se perdido ou se tornado pouco acessível. Ele o revela novamente a Arjuna, seu devoto e amigo. O trecho destaca a importância da transmissão, da confiança e da disposição para aprender.

### 4.4–4.9 · A manifestação divina

Arjuna pergunta como Krishna poderia ter ensinado a sabedoria em eras anteriores. Krishna distingue sua existência divina da condição comum dos seres: manifesta-se por sua própria potência quando o *dharma* declina. Os versos 4.7–8 descrevem a manifestação para proteger os justos, conter a desordem e restabelecer o dharma. O verso 4.9 associa a compreensão dessa natureza divina à libertação.

> *“Sempre que há declínio do dharma [...] eu me manifesto.”* — síntese do sentido dos versos 4.7–8.

### 4.10–4.15 · Desejo, conhecimento e ação

Krishna descreve pessoas que, livres de apego, medo e ira, alcançam sua natureza por meio do conhecimento e da entrega. O verso 4.11 afirma que as pessoas se aproximam do divino de diferentes maneiras, e o divino corresponde a elas. O trecho também trata da relação entre ação, ordem social e não identificação egoica com a autoria.

### 4.16–4.23 · O enigma da ação

Krishna afirma que é preciso compreender o que é ação, ação indevida e inação. O tema é sutil: alguém pode estar fisicamente ocupado e, ainda assim, agir sem compreensão; outro pode permanecer exteriormente quieto, mas continuar dominado por desejos e impulsos. O sábio percebe a complexidade da ação e não se prende aos frutos.

> *“Aquele que vê inação na ação e ação na inação é sábio.”* — paráfrase do verso 4.18.

### 4.24–4.32 · A ação como oferenda

O capítulo apresenta diferentes formas de *yajna*: oferendas rituais, disciplina dos sentidos, estudo, austeridade, respiração e conhecimento. A diversidade não significa que todos os métodos sejam idênticos; o texto os reúne como práticas que podem ser orientadas à transformação interior. O verso 4.24 oferece uma visão contemplativa na qual oferenda, ato, instrumento e destinatário são percebidos em relação ao Brahman.

### 4.33–4.42 · O conhecimento como purificação

Krishna considera o sacrifício do conhecimento superior ao sacrifício material, pois as ações encontram sua culminação no conhecimento. Recomenda buscar a verdade com humildade, perguntas sinceras e serviço a quem conhece. O conhecimento é comparado a um fogo que consome as amarras do karma. O encerramento convoca Arjuna a cortar a dúvida nascida da ignorância com a espada do conhecimento e a agir.

## Conceitos fundamentais

- **Jnana:** conhecimento ou sabedoria. Neste capítulo, é compreensão transformadora da realidade, da ação e do princípio divino, não mera informação acumulada.
- **Avatar:** manifestação ou descida divina. Krishna afirma manifestar-se quando o dharma declina. É uma afirmação teológica central da tradição, não uma categoria equivalente a um líder político ou social.
- **Dharma:** ordem, dever, retidão e sustentação da vida. Seu sentido depende do contexto; não cabe traduzi-lo sempre por uma única palavra.
- **Karma:** ação e suas consequências. O capítulo investiga por que a ação pode aprisionar e como o conhecimento altera a relação do agente com ela.
- **Yajna:** oferenda ou sacrifício. O texto amplia o conceito para diferentes disciplinas e práticas que orientam a ação para além do interesse egoísta.
- **Brahman:** realidade absoluta, fundamento último do ser na linguagem filosófica da tradição. No verso 4.24, os elementos do ato ritual são contemplados como Brahman.
- **Sannyasa:** renúncia. Aqui, o sentido não se limita a abandonar atividades externas: envolve renunciar à apropriação egoica e à ignorância que distorcem a ação.
- **Guru e transmissão:** o conhecimento é buscado com humildade, perguntas e serviço. A relação pedagógica exige abertura do aprendiz e discernimento sobre a autoridade de quem ensina.

### O paradoxo: ação e inação

O verso 4.18 não recomenda confusão entre agir e não agir. Ele desafia uma leitura superficial baseada apenas no movimento externo. A ação humana possui intenção, condicionamentos, consequências e identificação subjetiva. A pessoa pode agir sem apego e sem reivindicar controle absoluto; também pode aparentar inatividade enquanto permanece interiormente dominada por ambição, ressentimento ou medo.

| Leitura superficial | Discernimento proposto pelo capítulo |
|---|---|
| Agir é apenas executar uma tarefa. | A ação inclui intenção, consciência, contexto e consequências. |
| Não agir é simplesmente ficar parado. | A quietude externa não garante liberdade interior. |
| Conhecer é acumular conceitos. | Conhecer é compreender de modo que a ignorância e o apego percam força. |
| Renunciar é abandonar responsabilidades. | A renúncia pode ocorrer na relação com o ego e com os frutos, sem fuga do dever. |

> **Cuidado interpretativo:** a ideia de que o conhecimento queima o karma pertence ao horizonte espiritual da Gita. Na aplicação cotidiana, podemos falar em rever padrões, reconhecer consequências e agir com maior lucidez, sem afirmar que isso prova ou elimina metafisicamente o karma.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com a filosofia ocidental

As aproximações são pontes de reflexão, não equivalências. A Gita possui fundamentos religiosos e metafísicos próprios, que não devem ser dissolvidos em categorias ocidentais.

### Sócrates: reconhecer a própria ignorância

O método socrático expõe contradições e convida a examinar crenças antes de agir. Há convergência com a valorização da investigação, das perguntas e do conhecimento como transformação da vida. A diferença é que a busca socrática se desenvolve pela investigação racional e dialógica, enquanto o capítulo 4 integra conhecimento, devoção, revelação divina, karma e libertação espiritual.

### Immanuel Kant: autonomia e esclarecimento

Kant associa o esclarecimento à saída da menoridade intelectual e à coragem de usar o próprio entendimento. A comparação ilumina a necessidade de não agir mecanicamente sob autoridade ou hábito. Mas a sabedoria da Gita não se reduz à autonomia racional kantiana: inclui uma realidade divina, uma ordem do dharma e uma concepção de libertação que não são centrais no sistema de Kant.

### Spinoza: liberdade pela compreensão

Para Spinoza, compreender as causas que nos determinam pode ampliar nossa liberdade, reduzindo a servidão às paixões. A aproximação com a Gita está na ideia de que a ignorância e o apego limitam a ação lúcida. A diferença é decisiva: Spinoza formula uma filosofia racional da substância única, Deus ou Natureza; a Gita apresenta Krishna como realidade divina pessoal e ensina caminhos de conhecimento, ação e devoção dentro de uma tradição hindu plural.

| Autor | Questão que ilumina | Diferença em relação à Gita |
|---|---|---|
| Sócrates | Minhas crenças resistem ao exame? | Investigação dialógica e racional, sem a mesma doutrina de manifestação divina e libertação. |
| Kant | Estou pensando por conta própria ou obedecendo sem crítica? | Autonomia moral racional, distinta do dharma e da metafísica da Gita. |
| Spinoza | Compreender as causas pode me libertar das paixões? | Necessidade e substância em Spinoza não equivalem à relação devocional com Krishna. |
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações contemporâneas

- **Vida pessoal · Conhecer os próprios padrões:** antes de repetir uma reação, investigue o que a alimenta: medo, necessidade de aprovação, ressentimento, desejo ou hábito. Nomear causas não elimina a responsabilidade, mas abre espaço para escolher melhor.
- **Educação · Aprender com perguntas:** o capítulo valoriza humildade, investigação e transmissão do conhecimento. Na educação, isso implica criar espaço para perguntas autênticas, ensinar critérios para avaliar autoridades e distinguir compreensão de memorização.
- **Liderança · Restaurar princípios, não apenas controlar sintomas:** quando uma equipe perde confiança ou coerência, não basta impor procedimentos. É necessário recuperar propósito, critérios, transparência e práticas consistentes. A analogia com o restabelecimento do dharma é ética, não uma identificação entre liderança e avatar.
- **Trabalho · Transformar execução em aprendizado:** uma tarefa pode ser repetida mecanicamente ou realizada com entendimento de seu propósito e impacto. Conhecimento aplicado permite melhorar processos, reconhecer erros e agir sem transformar o ego em dono exclusivo do resultado.

### Exercício: da reação ao discernimento

1. **Escolha uma situação recorrente:** uma conversa difícil, uma decisão adiada ou um conflito no trabalho.
2. **Identifique a ação automática:** o que você costuma fazer ou evitar?
3. **Investigue as causas:** quais medos, desejos, crenças ou hábitos alimentam essa resposta?
4. **Formule uma pergunta melhor:** que informação ou perspectiva ainda falta?
5. **Escolha uma ação consciente:** qual atitude respeita seus valores e responsabilidades, mesmo sem garantir o resultado desejado?
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Questionário de reflexão

Responda considerando o argumento do capítulo. A devolutiva é educativa e não mede espiritualidade, inteligência ou caráter.

### Reflexão aberta

Que crença, hábito ou reação você precisa compreender melhor para deixar de agir no piloto automático?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese: conhecer para agir de outro modo

O capítulo 4 aprofunda o Karma Yoga: não basta agir sem apego; é preciso compreender a natureza da ação e as ilusões que fazem o ego imaginar-se autor absoluto de tudo.

- O conhecimento é transmitido, questionado e realizado, não apenas repetido.
- Krishna apresenta sua manifestação como resposta ao declínio do dharma.
- A ação não pode ser compreendida apenas pelo movimento exterior.
- As práticas de oferenda podem assumir diferentes formas, e o conhecimento é apresentado como especialmente transformador.
- Humildade, perguntas e discernimento são condições importantes da aprendizagem.
- A sabedoria não conduz à fuga: no encerramento, Krishna convoca Arjuna a superar a dúvida e agir.

> **Versos para revisitar:** 4.7–8 (manifestação divina); 4.11 (diferentes caminhos de aproximação); 4.18 (ação e inação); 4.24 (visão de Brahman na oferenda); 4.33 (sacrifício do conhecimento); 4.34 (humildade e investigação); 4.38 (conhecimento como purificação); 4.42 (cortar a dúvida e agir).

O capítulo 5 retoma a tensão entre renúncia e ação. Depois de compreender que o conhecimento transforma o agir, a próxima pergunta é: como conciliar a renúncia interior com a participação ativa no mundo?

*Nota de estudo: a divisão tradicional contém 42 versos. As formulações em português são sínteses explicativas, não uma tradução integral de uma edição específica. Termos sânscritos podem receber traduções diferentes conforme a escola filosófica e a tradição interpretativa.*
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 4
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

update public.etapas e
set quiz_modo = 'acertos', quiz_chave_alvo = null
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 4 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado, chave_correta)
select e.id, v.ordem, v.enunciado, v.chave_correta
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Qual é a função do conhecimento no capítulo 4?', 'B'),
  (2, 'O que Krishna afirma nos versos 4.7–8?', 'C'),
  (3, 'Como compreender a ideia de “ver inação na ação e ação na inação” (4.18)?', 'A'),
  (4, 'Por que o capítulo valoriza o conhecimento acima da oferenda material?', 'B'),
  (5, 'Como o aprendiz deve buscar conhecimento, segundo o verso 4.34?', 'C')
) as v(ordem, enunciado, chave_correta)
where c.numero = 4 and e.ordem = 5
on conflict (etapa_id, ordem) do update
  set enunciado = excluded.enunciado, chave_correta = excluded.chave_correta;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Acumular informações sem alterar a conduta.'),
  (1, 'B', 'Dissolver a ignorância e transformar a relação com a ação.'),
  (1, 'C', 'Evitar qualquer participação no mundo.'),
  (2, 'A', 'Que o dharma não tem importância para a vida.'),
  (2, 'B', 'Que toda pessoa pode reivindicar ser uma manifestação divina.'),
  (2, 'C', 'Que se manifesta quando o dharma declina, para protegê-lo e restabelecê-lo.'),
  (3, 'A', 'É preciso olhar além do movimento externo e compreender intenção, apego e consciência.'),
  (3, 'B', 'Toda atividade é inútil.'),
  (3, 'C', 'Ficar parado garante libertação.'),
  (4, 'A', 'Porque rituais e práticas não possuem qualquer lugar no texto.'),
  (4, 'B', 'Porque a compreensão profunda transforma a ignorância que mantém a pessoa presa.'),
  (4, 'C', 'Porque o conhecimento é apenas uma coleção de dados.'),
  (5, 'A', 'Com obediência cega e sem perguntas.'),
  (5, 'B', 'Apenas por leitura solitária, sem diálogo.'),
  (5, 'C', 'Com humildade, perguntas sinceras e serviço a quem conhece.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 4 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (5, 'Você identificou com precisão os eixos do capítulo. O próximo passo é observar como o conhecimento altera suas decisões, especialmente quando uma reação automática parece inevitável.'),
  (3, 'Sua leitura captou boa parte do argumento. Retome a distinção entre movimento externo e liberdade interior, e o papel da investigação humilde na aprendizagem.'),
  (0, 'Vale reler o mapa dos versos e os conceitos fundamentais. O capítulo não trata conhecimento como informação: trata-o como compreensão capaz de transformar a ação e dissolver a ignorância.')
) as v(minimo, texto)
where c.numero = 4 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
