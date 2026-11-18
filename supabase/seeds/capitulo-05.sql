-- Jornada da Virtude v2.0 — conteúdo do capítulo 5 (Karma Sannyasa Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz de compreensão (15 alternativas,
-- uma correta em cada pergunta) e as 3 leituras por número de acertos (modo "acertos").
-- Idempotente: upsert por numero, (capitulo_id, ordem), (etapa_id, ordem), (pergunta_id, chave) e
-- (etapa_id, minimo). Não insere registros de usuário.
-- O HTML tem 7 seções: "Mapa do capítulo" e "Conceitos fundamentais" formam a etapa 2.

insert into public.capitulos (numero, titulo)
values (5, 'Karma Sannyasa Yoga — O Yoga da Renúncia à Ação')
on conflict (numero) do update set titulo = excluded.titulo;

insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Contexto histórico e filosófico

O capítulo 5 responde a uma dúvida central de Arjuna: se a renúncia é um caminho de libertação, por que Krishna insiste que ele aja? A resposta distingue abandonar a ação de abandonar o apego que contamina a ação.

### A pergunta de Arjuna

Arjuna percebe uma tensão entre dois caminhos apresentados por Krishna: *sannyasa*, a renúncia, e *karma yoga*, a disciplina da ação. Ele quer saber qual conduz com mais segurança à libertação.

Krishna afirma que ambos podem conduzir ao mesmo objetivo quando compreendidos corretamente, mas destaca o caminho da ação desinteressada como especialmente adequado. A renúncia mais profunda não depende apenas de mudar a aparência da vida; depende de transformar a relação com desejo, aversão e ego.

> **Chave de leitura:** não agir por medo, comodismo ou fuga não é o mesmo que renunciar. A questão é participar da vida sem transformar cada ação numa tentativa de garantir identidade, reconhecimento ou controle sobre o futuro.
$md$),

(2, 'Conceitos fundamentais', $md$
## Mapa do capítulo: versos por temas

### Versos 1–6 · Renúncia e ação disciplinada

Arjuna pergunta qual caminho é superior. Krishna explica que renúncia e yoga da ação podem conduzir à libertação, mas a ação realizada sem apego costuma ser mais adequada. Quem não é dominado por desejo e aversão é apresentado como verdadeiro renunciante, mesmo permanecendo ativo no mundo.

### Versos 7–12 · Agir sem se apropriar da ação

O praticante disciplinado age com corpo, mente e sentidos, mas não se identifica inteiramente como autor independente nem se apega aos frutos. A imagem da folha de lótus que permanece sobre a água sem ser molhada ilustra a possibilidade de agir no mundo sem ser interiormente aprisionado por ele.

### Versos 13–16 · O eu, a ação e o conhecimento

O texto descreve a pessoa que, interiormente, renuncia à apropriação das ações e permanece em paz. O princípio consciente não cria, por si só, a ação nem distribui os resultados como um agente humano; a ignorância encobre a compreensão. O conhecimento dissipa essa ignorância, como a luz revela o que estava oculto.

### Versos 17–21 · Igualdade de visão e liberdade interior

Quem alcança conhecimento vê com equanimidade diferentes seres e condições sociais. A igualdade de visão não significa negar diferenças concretas, mas reconhecer uma mesma realidade fundamental. A pessoa deixa de depender exclusivamente de prazeres externos e encontra estabilidade interior.

### Versos 22–26 · Prazeres, desejo e paz

Os prazeres derivados do contato dos sentidos são transitórios e podem trazer sofrimento. O sábio aprende a não ser governado por impulsos de desejo e raiva. A paz é associada ao autodomínio, à interioridade e à ausência de hostilidade.

### Versos 27–29 · Meditação e paz suprema

O capítulo termina com uma descrição da disciplina meditativa: regular a atenção, observar a respiração, controlar os sentidos e reduzir desejo, medo e raiva. Krishna conclui apresentando-se como aquele que recebe os sacrifícios, senhor dos mundos e amigo de todos os seres. Reconhecer essa relação conduz à paz.

## Conceitos fundamentais

- **Sannyasa:** renúncia. Pode indicar abandono formal de atividades e vínculos, mas o capítulo enfatiza a dimensão interior: renunciar à apropriação egoica e ao apego.
- **Karma Yoga:** disciplina da ação. Realizar o que deve ser feito com atenção e responsabilidade, sem fazer da recompensa o fundamento da própria identidade.
- **Nishkama Karma:** ação sem desejo possessivo pelos frutos. Não significa agir sem objetivos ou planejamento, mas não exigir controle absoluto sobre os resultados.
- **Samatva:** equanimidade. Estabilidade diante de prazer e dor, ganho e perda, elogio e crítica, sem indiferença moral ou emocional.
- **Atman:** o si mesmo ou princípio espiritual profundo, distinto das mudanças do corpo, dos sentidos e dos estados mentais.
- **Jnana:** conhecimento que dissipa a ignorância e permite reconhecer a realidade para além das identificações limitadas.

### Renúncia externa e renúncia interior

| Dimensão | Renúncia entendida superficialmente | Renúncia interior no espírito do capítulo |
|---|---|---|
| Ação | Deixar de fazer para evitar dificuldades | Agir quando necessário, sem apego possessivo |
| Resultados | Fingir que objetivos não importam | Planejar e buscar resultados sem exigir controle total |
| Identidade | Construir uma imagem de superioridade espiritual | Reduzir a necessidade de reconhecimento e autopromoção |
| Relações | Afastar-se de pessoas e responsabilidades | Relacionar-se sem transformar o outro em instrumento do próprio desejo |
| Emoções | Reprimir desejo, raiva ou tristeza | Reconhecer emoções sem permitir que determinem automaticamente a ação |

> **Um cuidado importante:** agir sem apego não significa aceitar exploração, negligenciar contratos, dispensar planejamento ou tolerar injustiça. A Gita não oferece uma desculpa para irresponsabilidade. O foco é a qualidade interior da ação, não a eliminação dos deveres concretos.

### A metáfora da folha de lótus (5.10)

Assim como a folha de lótus permanece na água sem ser absorvida por ela, a pessoa pode participar das atividades do mundo sem permitir que o apego determine sua identidade. A metáfora não pede isolamento: pede liberdade no meio da participação.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com a filosofia ocidental

### Estoicismo · Fazer o que depende de nós

**Convergência:** os estoicos distinguem aquilo que está sob nosso controle, como juízos e escolhas, daquilo que não controlamos integralmente, como reputação, circunstâncias e resultados. Isso dialoga com a orientação da Gita para agir com responsabilidade sem se tornar dependente do fruto.

**Diferença:** o estoicismo fundamenta sua ética na razão e na natureza cósmica; a Gita insere a ação num horizonte espiritual que inclui Atman, libertação e relação devocional com Krishna. A Gita não reduz o desapego a uma técnica de controle das representações.

### Immanuel Kant · Dever e motivação moral

**Convergência:** Kant sustenta que o valor moral de uma ação não deve depender apenas da vantagem que ela produz. A Gita também questiona a ação guiada exclusivamente por recompensa, prestígio ou interesse pessoal.

**Diferença:** para Kant, a moralidade se funda na autonomia racional e no respeito à lei moral universal. Na Gita, a ação disciplinada integra uma visão de dever, ordem cósmica, conhecimento espiritual e devoção. Não se deve equiparar *dharma* ao imperativo categórico.

### Spinoza · Liberdade e compreensão das paixões

**Convergência:** Spinoza entende que a liberdade cresce quando compreendemos as causas que nos determinam, em vez de sermos arrastados por paixões inadequadamente compreendidas. Isso se aproxima do esforço da Gita para superar ignorância, desejo compulsivo e aversão.

**Diferença:** Spinoza não propõe renúncia à ação no sentido religioso da Gita. Sua liberdade decorre do conhecimento adequado da necessidade e de Deus ou Natureza; a Gita articula ação, disciplina espiritual, libertação e devoção a Krishna.

> **Critério de comparação:** as três tradições ajudam a pensar a motivação e a liberdade, mas não dizem a mesma coisa. O diálogo é produtivo justamente porque preserva as diferenças.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações contemporâneas

- **Vida pessoal · Separar compromisso de controle:** defina o que está ao seu alcance, faça sua parte e reconheça o que depende de outras pessoas ou circunstâncias. Isso reduz a ansiedade sem transformar aceitação em passividade.
- **Educação · Ensinar pelo processo, não só pela nota:** valorize planejamento, esforço, revisão e aprendizagem. Resultados e avaliações continuam importantes, mas não devem ser a única medida do valor do estudante ou do trabalho docente.
- **Liderança · Delegar sem abandonar responsabilidade:** estabeleça objetivos, critérios e acompanhamento. Depois, permita que a equipe execute sem microgerenciar cada movimento. Desapego ao controle não é ausência de prestação de contas.
- **Trabalho · Agir por propósito e qualidade:** busque metas, remuneração e reconhecimento de forma legítima, mas não permita que esses resultados justifiquem qualquer meio ou definam completamente sua autoestima.

### Exercício: círculo de ação e resultado

Escolha uma situação que esteja gerando tensão. Divida uma folha em três partes:

1. **Minha ação:** o que posso fazer diretamente, com competência e responsabilidade?
2. **Minha influência:** o que posso negociar, comunicar ou favorecer, mas não determinar?
3. **Fora do meu controle:** o que preciso reconhecer e deixar de tentar controlar?

Defina uma ação concreta para a primeira parte, uma conversa ou tentativa para a segunda e um limite de energia para a terceira.

*Adaptação prática inspirada no desapego aos frutos. Não elimina a necessidade de avaliar riscos, direitos, deveres ou consequências.*

### Da motivação automática à ação consciente

| Motivação dominante | Risco | Reorientação possível |
|---|---|---|
| Buscar aprovação a qualquer custo | Perder autonomia e coerência | Verificar se a ação corresponde aos valores e responsabilidades |
| Evitar qualquer possibilidade de fracasso | Paralisia e fuga | Definir um passo viável e aprender com o resultado |
| Controlar todas as etapas | Exaustão e desconfiança | Delegar com critérios claros e acompanhamento proporcional |
| Agir apenas pela recompensa | Comprometer meios e relações | Considerar também o propósito e a qualidade ética do processo |
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Questionário de reflexão

Responda às cinco questões. A devolutiva verifica a compreensão dos conceitos e propõe uma pergunta para aprofundamento. Não é teste psicológico nem avaliação espiritual.

### Reflexão aberta

Em qual situação você está confundindo fazer sua parte com controlar o resultado? O que mudaria na sua postura se mantivesse o compromisso com a ação, mas reduzisse a necessidade de controlar aquilo que não depende inteiramente de você?

*Registre uma situação concreta e uma mudança observável que possa experimentar nos próximos sete dias.*
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese do capítulo

O capítulo 5 não opõe simplesmente vida ativa e vida contemplativa. Ele mostra que a liberdade depende menos da aparência externa da ação e mais da relação interior que estabelecemos com ela.

Renunciar é deixar de ser governado pelo desejo possessivo, pela aversão e pela necessidade de reconhecimento. Karma Yoga é agir com competência e responsabilidade, sem transformar o resultado em condição absoluta de paz ou identidade. A visão de unidade amplia essa liberdade: quem reconhece a mesma realidade fundamental nos seres não pode tratar os outros apenas como instrumentos.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 5.2 | a ação disciplinada é destacada como caminho especialmente adequado. |
| 5.10 | a imagem da folha de lótus expressa ação sem apego. |
| 5.12 | a paz está associada à renúncia ao apego aos frutos. |
| 5.18 | a visão equânime reconhece a mesma realidade fundamental nos seres. |
| 5.22–23 | os prazeres sensoriais são transitórios; o autodomínio é parte da liberdade. |
| 5.29 | reconhecer Krishna como amigo de todos os seres está ligado à paz. |

> **Conexão com o capítulo 6:** depois de explicar como agir sem apego, a Gita aprofunda a disciplina interior necessária para sustentar essa liberdade. O capítulo 6 apresenta a meditação, o treinamento da mente e o equilíbrio dos hábitos como parte do caminho.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 5
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

update public.etapas e
set quiz_modo = 'acertos', quiz_chave_alvo = null
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 5 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado, chave_correta)
select e.id, v.ordem, v.enunciado, v.chave_correta
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Qual é a distinção central entre renúncia e Karma Yoga no capítulo 5?', 'B'),
  (2, 'O que significa agir sem apego aos frutos?', 'C'),
  (3, 'O que representa a imagem da folha de lótus sobre a água?', 'A'),
  (4, 'Como o capítulo relaciona conhecimento e liberdade?', 'B'),
  (5, 'Qual aplicação contemporânea melhor expressa a proposta do capítulo?', 'C')
) as v(ordem, enunciado, chave_correta)
where c.numero = 5 and e.ordem = 5
on conflict (etapa_id, ordem) do update
  set enunciado = excluded.enunciado, chave_correta = excluded.chave_correta;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Renúncia exige abandonar toda atividade; Karma Yoga exige agir sem pensar.'),
  (1, 'B', 'Os dois caminhos podem conduzir à libertação, mas a ação sem apego é destacada como especialmente adequada.'),
  (1, 'C', 'São caminhos incompatíveis e sem objetivo comum.'),
  (2, 'A', 'Não ter objetivos nem se preocupar com a qualidade do trabalho.'),
  (2, 'B', 'Evitar responsabilidades para não sofrer consequências.'),
  (2, 'C', 'Agir com responsabilidade sem fazer da recompensa o fundamento da própria identidade.'),
  (3, 'A', 'Participar do mundo sem ser interiormente aprisionado pelo apego.'),
  (3, 'B', 'Isolar-se de todas as relações humanas.'),
  (3, 'C', 'Evitar qualquer ação que envolva outras pessoas.'),
  (4, 'A', 'Conhecimento serve apenas para acumular informações religiosas.'),
  (4, 'B', 'O conhecimento dissipa a ignorância e transforma a maneira de compreender a ação e o eu.'),
  (4, 'C', 'A liberdade depende de ignorar as consequências das próprias escolhas.'),
  (5, 'A', 'Trabalhar sem planejamento, pois os resultados não importam.'),
  (5, 'B', 'Evitar metas para não desenvolver desejos.'),
  (5, 'C', 'Planejar, agir com responsabilidade e não confundir resultado com controle absoluto.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 5 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (5, 'Você compreendeu os principais eixos do capítulo. O desafio é levar essa compreensão para situações em que há responsabilidade real, mas controle limitado sobre os resultados.'),
  (3, 'Você captou boa parte do argumento. Retome especialmente a diferença entre abandonar a ação e abandonar o apego, além da relação entre conhecimento e liberdade.'),
  (0, 'Vale reler o mapa dos versos e os conceitos fundamentais. O capítulo não defende omissão: propõe agir com responsabilidade sem transformar os frutos em prisão.')
) as v(minimo, texto)
where c.numero = 5 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
