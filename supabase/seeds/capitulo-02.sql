-- Jornada da Virtude v2.0 — conteúdo do capítulo 2 (Sankhya Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz de compreensão (15 alternativas,
-- uma correta em cada pergunta) e as 3 leituras por número de acertos (modo "acertos").
-- Idempotente: upsert por numero, (capitulo_id, ordem), (etapa_id, ordem), (pergunta_id, chave) e
-- (etapa_id, minimo). Não insere registros de usuário.
-- O HTML tem 7 seções: "Mapa do capítulo" e "Conceitos fundamentais" formam a etapa 2.

insert into public.capitulos (numero, titulo)
values (2, 'Sankhya Yoga — O Yoga do Conhecimento')
on conflict (numero) do update set titulo = excluded.titulo;

insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Contexto histórico e filosófico

O capítulo 2 é a primeira grande resposta de Krishna à crise de Arjuna. Depois de abandonar o arco e declarar que não lutará, Arjuna reconhece sua perplexidade e pede orientação. O diálogo passa da descrição do sofrimento para uma investigação sobre identidade, dever, ação e sabedoria.

### A virada do diálogo

Krishna começa questionando o abatimento de Arjuna, mas não se limita a uma repreensão. Apresenta uma distinção fundamental entre o corpo, sujeito à mudança e à morte, e o *Atman*, o princípio espiritual que não nasce nem morre. A partir dessa perspectiva, examina o dever de Arjuna como guerreiro e introduz a disciplina da ação sem apego.

O capítulo reúne diferentes linhas de pensamento: uma reflexão sobre a natureza do ser, uma orientação ética sobre o dever, uma disciplina da ação e uma descrição do sábio de mente estável. Por isso, funciona como uma espécie de mapa para os temas que serão desenvolvidos ao longo da Gita.

> **Chave de leitura:** Krishna não pede que Arjuna deixe de sentir. Ele o convida a examinar as ideias que organizam seu sofrimento e a agir a partir de uma compreensão mais ampla. A questão não é tornar-se insensível, mas desenvolver discernimento.

*O título tradicional, *Sankhya Yoga*, pode ser traduzido como Yoga do Conhecimento ou da Análise Discriminativa. O capítulo combina elementos de reflexão metafísica e prática espiritual; não corresponde integralmente a todas as formulações históricas da escola filosófica Sankhya.*
$md$),

(2, 'Conceitos fundamentais', $md$
## Mapa do capítulo: versos por temas

### Versos 1–10 · Arjuna pede orientação

Sanjaya descreve Arjuna tomado pela compaixão e pelo abatimento. Krishna questiona sua postura e o chama a não ceder à fraqueza. Arjuna, porém, reconhece que está confuso sobre o que é correto e pede para ser instruído. O diálogo muda de tom: ele deixa de apenas argumentar e assume a posição de aprendiz.

### Versos 11–30 · O Atman e a impermanência do corpo

Krishna afirma que os sábios não lamentam nem pelos vivos nem pelos mortos, pois compreendem a continuidade do princípio espiritual. O corpo passa por infância, juventude e velhice; da mesma forma, a morte é apresentada como passagem para outra condição. O Atman não nasce, não morre e não é destruído quando o corpo é destruído.

As experiências sensoriais de frio e calor, prazer e dor, surgem do contato com o mundo e são transitórias. Krishna aconselha suportá-las com discernimento. A imagem das roupas usadas e trocadas por roupas novas expressa a distinção entre o corpo e o princípio espiritual.

### Versos 31–38 · Dharma e dever diante do conflito

Krishna retoma a posição de Arjuna como guerreiro e apresenta o combate como uma circunstância ligada ao seu dever. Também considera a honra, a reputação e as consequências de abandonar a luta. O texto enfatiza que Arjuna deve agir sem se fixar em vitória ou derrota, ganho ou perda, prazer ou dor.

### Versos 39–53 · Karma Yoga e equanimidade

Krishna apresenta a inteligência disciplinada que permite agir sem apego aos frutos. A ação deve ser realizada, mas a pessoa não deve reivindicar controle absoluto sobre seus resultados. A equanimidade é chamada de yoga. O apego aos frutos produz ansiedade e aprisionamento; a clareza permite agir com maior liberdade.

O texto também critica a busca ritualista por recompensas celestes quando ela se limita ao desejo de prazer e poder. A sabedoria exige ultrapassar a fixação nos resultados e permanecer firme no discernimento.

### Versos 54–72 · O sábio de mente estável

Arjuna pergunta como reconhecer uma pessoa cuja sabedoria está firme. Krishna descreve alguém que não é dominado por desejos, que permanece estável diante de prazer e sofrimento, que não reage com apego ou aversão e que governa os sentidos com discernimento.

A sequência dos versos 62–63 descreve como a contemplação insistente dos objetos pode gerar apego, desejo, raiva, confusão, perda de memória e destruição do discernimento. Em contraste, a pessoa equilibrada atravessa as experiências sem ser arrastada por elas. A imagem do oceano que recebe rios sem transbordar representa a estabilidade do sábio.

## Conceitos fundamentais

- **Atman:** o princípio espiritual ou si mesmo profundo, apresentado como não nascido, imutável e indestrutível. Não deve ser confundido com personalidade, memória ou ego psicológico.
- **Deha e Dehin:** o corpo e aquele que o habita. A distinção ajuda a compreender a diferença entre a condição corporal, sujeita a mudanças, e o princípio espiritual descrito no capítulo.
- **Dharma:** dever, responsabilidade e ordem apropriada. No contexto narrativo, Krishna considera o papel de Arjuna como guerreiro, mas o conceito tem sentidos amplos na tradição hindu.
- **Karma Yoga:** disciplina da ação. Agir com atenção e responsabilidade sem fazer da recompensa ou do resultado a condição da própria estabilidade interior.
- **Buddhi Yoga:** yoga da inteligência ou do discernimento. Orientar a ação por uma compreensão firme, em vez de oscilar conforme desejos, medos e expectativas.
- **Sthitaprajna:** pessoa de sabedoria estável. Não é alguém sem emoções, mas alguém que não entrega o comando da vida a impulsos, desejos e aversões.
- **Samatva:** equanimidade. Estabilidade diante de pares de opostos, como prazer e dor, ganho e perda, vitória e derrota. Não significa indiferença diante da injustiça.
- **Indriyas:** os sentidos e suas capacidades de contato com o mundo. O capítulo destaca a necessidade de orientá-los com discernimento, em vez de permitir que governem a mente.

### A cadeia da perda de discernimento (2.62–63)

| Etapa | Processo descrito | Leitura prática |
|---|---|---|
| Contemplação insistente | A mente permanece fixada no objeto desejado | A atenção passa a girar repetidamente em torno de algo |
| Apego | Surge identificação e dependência | O objeto começa a parecer indispensável |
| Desejo | O apego se converte em impulso de posse ou obtenção | A expectativa passa a dirigir as escolhas |
| Raiva | O desejo frustrado pode produzir irritação | Obstáculos e pessoas são percebidos como ameaças |
| Confusão | A percepção e o julgamento ficam obscurecidos | Fatos e consequências são avaliados de modo distorcido |
| Perda de memória e discernimento | Perdem-se referências e capacidade de julgar | Esquecem-se valores, compromissos e aprendizados |
| Queda | A pessoa perde a direção consciente | Age de modo contrário ao que reconhece como importante |

> **Leitura cuidadosa:** a sequência não é uma lei psicológica universal nem uma descrição clínica. É um modelo filosófico e espiritual sobre como a atenção fixada e o apego podem comprometer o julgamento.

### O que caracteriza o Sthitaprajna?

- Não depende da satisfação de todos os desejos para encontrar estabilidade.
- Não é arrastado automaticamente por prazer, dor, medo ou raiva.
- Consegue orientar os sentidos, sem negar a existência do mundo sensorial.
- Age com discernimento e não transforma resultados externos em medida absoluta de seu valor.
- Permanece lúcido diante das experiências, como o oceano que recebe rios sem perder sua profundidade.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com a filosofia ocidental

### Platão · A distinção entre aparência e realidade

**Convergência:** Platão e a Gita investigam a diferença entre aquilo que muda no mundo sensível e uma dimensão mais estável da realidade. Ambos questionam a ideia de que a percepção imediata oferece, sozinha, conhecimento suficiente.

**Diferença:** as Formas platônicas não equivalem ao Atman. Platão desenvolve uma teoria da alma, do conhecimento e das Formas; a Gita apresenta o Atman como princípio espiritual e insere a reflexão numa visão de karma, renascimento, dharma e relação com Krishna.

### Estoicismo · Equanimidade e domínio das respostas

**Convergência:** os estoicos defendem que não controlamos todos os acontecimentos, mas podemos trabalhar sobre nossos juízos e respostas. Isso dialoga com a equanimidade da Gita e com a orientação para não depender inteiramente dos frutos da ação.

**Diferença:** o estoicismo não pressupõe a mesma doutrina do Atman nem a mesma concepção de libertação espiritual. Sua ética se fundamenta na razão, na virtude e na natureza, enquanto a Gita articula esses temas com devoção e metafísica hindu.

### Immanuel Kant · Dever e autonomia moral

**Convergência:** Kant e a Gita permitem discutir a diferença entre agir por princípio e agir apenas por inclinação ou recompensa. Ambos questionam uma conduta guiada exclusivamente por interesses imediatos.

**Diferença:** Kant fundamenta a moral na autonomia racional e na universalidade da lei moral. O dever de Arjuna está situado numa tradição de dharma e numa narrativa de guerra específica. Portanto, não se deve identificar dharma com dever kantiano nem usar o capítulo como autorização genérica para obedecer a qualquer papel social.

> **Critério de comparação:** os paralelos iluminam questões comuns sobre identidade, mudança, dever e liberdade. As respostas permanecem diferentes porque os autores partem de pressupostos metafísicos e éticos distintos.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações contemporâneas

- **Vida pessoal · Distinguir o que muda do que orienta:** observe quanto da sua identidade está apoiado em cargos, aparência, bens, aprovação ou resultados. Esses elementos podem ter importância, mas são mutáveis. Procure também princípios e compromissos que deem continuidade às suas escolhas.
- **Educação · Formar discernimento, não só desempenho:** o estudante precisa aprender a avaliar fontes, consequências e motivações, e não apenas perseguir notas. O educador pode trabalhar a diferença entre esforço, resultado e valor pessoal.
- **Liderança · Decidir sem ser refém da aprovação:** uma liderança responsável considera dados, pessoas e consequências, mas não pode transformar popularidade ou medo de crítica no único critério. Equanimidade ajuda a sustentar decisões difíceis sem desumanizar quem discorda.
- **Trabalho · Comprometer-se com o processo:** defina objetivos e indicadores, execute com qualidade e aprenda com os resultados. Não confunda uma meta não alcançada com fracasso total, nem um sucesso pontual com prova de infalibilidade.

### Exercício: observar a cadeia do apego

Escolha um desejo ou preocupação recorrente e registre:

1. **Foco:** em que objeto, resultado ou reconhecimento minha atenção está presa?
2. **Apego:** o que passei a acreditar que preciso obter ou evitar?
3. **Reação:** como respondo quando algo ameaça esse resultado?
4. **Discernimento:** que fatos, valores ou consequências posso estar deixando de considerar?
5. **Ação:** qual resposta seria coerente com meus princípios, mesmo sem garantia de resultado?

*O exercício é uma ferramenta de reflexão inspirada nos versos 2.62–63, não um instrumento de diagnóstico psicológico.*

### Equanimidade não é indiferença

| Confusão comum | O que a equanimidade propõe |
|---|---|
| “Não devo sentir tristeza.” | Reconhecer a tristeza sem permitir que ela determine sozinha a decisão. |
| “O resultado não importa.” | Planejar e avaliar resultados sem fazer deles a medida absoluta da própria identidade. |
| “Preciso aceitar qualquer situação.” | Distinguir aceitação dos fatos de aprovação moral; agir contra injustiças quando necessário. |
| “Devo tratar vitória e derrota como iguais em tudo.” | Manter estabilidade interior sem apagar diferenças concretas de consequência e responsabilidade. |
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Questionário de reflexão

Responda às cinco questões. A devolutiva verifica a compreensão dos conceitos e propõe uma pergunta para aprofundamento. Não é teste psicológico nem avaliação espiritual.

### Reflexão aberta

Qual resultado, reconhecimento ou situação tem exercido influência excessiva sobre suas decisões? Como seria agir com o mesmo compromisso, mas com menos dependência emocional do resultado?

*Registre uma situação concreta e uma ação observável para os próximos sete dias. A proposta não é abandonar objetivos, mas mudar a relação com eles.*
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese do capítulo

O capítulo 2 transforma o desalento de Arjuna em investigação sobre a natureza do ser e a maneira correta de agir. Krishna apresenta o Atman como princípio que não nasce nem morre, distingue o permanente do transitório e ensina que a ação pode ser realizada sem apego aos frutos.

A sabedoria não é ausência de emoção, mas estabilidade de discernimento. O sábio não precisa controlar o mundo para agir corretamente. Ele aprende a orientar os sentidos, examinar os desejos e permanecer firme diante dos resultados. A imagem do oceano que recebe rios sem transbordar resume essa maturidade: a vida continua chegando com suas experiências, mas não precisa arrastar a consciência.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 2.13 | as mudanças do corpo são comparadas às passagens da vida. |
| 2.20 | o Atman é descrito como não nascido e indestrutível. |
| 2.22 | a metáfora das roupas expressa a distinção entre corpo e princípio espiritual. |
| 2.47 | a orientação sobre ação e frutos, frequentemente citada e muitas vezes simplificada. |
| 2.48 | yoga como equanimidade. |
| 2.62–63 | a cadeia que liga atenção fixada, apego e perda de discernimento. |
| 2.70 | a imagem do oceano que permanece estável mesmo recebendo águas. |
| 2.71–72 | a paz associada à renúncia ao apego e à firmeza de compreensão. |

> **Conexão com o capítulo 3:** depois de apresentar o conhecimento do Atman e a ação sem apego, Arjuna questiona por que deveria agir. O capítulo 3 aprofunda o Karma Yoga e explica por que a ação é inevitável e como pode ser realizada como disciplina.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 2
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

-- ---------------------------------------------------------------------------
-- Quiz da etapa 5 (modo "acertos")
-- ---------------------------------------------------------------------------
update public.etapas e
set quiz_modo = 'acertos', quiz_chave_alvo = null
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 2 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado, chave_correta)
select e.id, v.ordem, v.enunciado, v.chave_correta
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Qual é uma das distinções centrais apresentadas por Krishna no capítulo 2?', 'B'),
  (2, 'O que significa agir com equanimidade?', 'C'),
  (3, 'Segundo a orientação do capítulo, qual é a relação adequada com os frutos da ação?', 'A'),
  (4, 'O que descreve a cadeia dos versos 2.62–63?', 'B'),
  (5, 'Como o capítulo caracteriza o Sthitaprajna?', 'C')
) as v(ordem, enunciado, chave_correta)
where c.numero = 2 and e.ordem = 5
on conflict (etapa_id, ordem) do update
  set enunciado = excluded.enunciado, chave_correta = excluded.chave_correta;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Entre riqueza e pobreza como medidas do valor humano.'),
  (1, 'B', 'Entre o corpo, sujeito à mudança, e o Atman, apresentado como princípio espiritual imperecível.'),
  (1, 'C', 'Entre pessoas que podem agir e pessoas que devem permanecer inativas.'),
  (2, 'A', 'Não se importar com as consequências das próprias ações.'),
  (2, 'B', 'Evitar qualquer decisão que possa produzir sofrimento.'),
  (2, 'C', 'Manter discernimento diante de prazer e dor, ganho e perda, sem abandonar a responsabilidade.'),
  (3, 'A', 'Agir com empenho, sem transformar o resultado em objeto de apego absoluto.'),
  (3, 'B', 'Não estabelecer objetivos nem avaliar resultados.'),
  (3, 'C', 'Buscar apenas resultados que garantam reconhecimento público.'),
  (4, 'A', 'Um método para eliminar todos os sentidos.'),
  (4, 'B', 'Como a atenção fixada pode alimentar apego, desejo, raiva, confusão e perda de discernimento.'),
  (4, 'C', 'Uma sequência inevitável que ocorre igualmente com todas as pessoas.'),
  (5, 'A', 'Como alguém que nunca enfrenta emoções ou dificuldades.'),
  (5, 'B', 'Como alguém que abandona todas as relações e responsabilidades.'),
  (5, 'C', 'Como alguém cuja sabedoria permanece estável e que não é governado automaticamente por desejos e aversões.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 2 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (5, 'Você compreendeu os principais eixos do capítulo. O desafio é perceber como conhecimento, equanimidade e ação sem apego podem orientar decisões concretas.'),
  (3, 'Você captou boa parte do argumento. Retome especialmente a distinção entre corpo e Atman, a ação sem apego e a descrição do sábio de mente estável.'),
  (0, 'Vale reler o mapa dos versos e os conceitos fundamentais. O capítulo articula metafísica, dever e disciplina da ação; não se limita a uma mensagem genérica para “não se preocupar”.')
) as v(minimo, texto)
where c.numero = 2 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
