-- Jornada da Virtude v2.0 — conteúdo do capítulo 17 (Shraddhatraya Vibhaga Yoga)
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
values (17, 'Shraddhatraya Vibhaga Yoga — Os três tipos de fé')
on conflict (numero) do update set titulo = excluded.titulo;

-- ---------------------------------------------------------------------------
-- Etapas: nome e texto
-- ---------------------------------------------------------------------------
insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## A fé também revela como vivemos

No capítulo 16, Krishna contrastou disposições construtivas e destrutivas. Agora Arjuna faz uma pergunta importante: o que acontece com aqueles que têm fé, mas não seguem as prescrições das escrituras? Que tipo de fé orienta essas pessoas?

O capítulo 17 chama-se **Shraddhatraya Vibhaga Yoga**. *Shraddha* costuma ser traduzida como fé, confiança, convicção ou disposição de confiar; *traya* significa três; *vibhaga*, distinção ou análise; e *yoga*, caminho ou disciplina. O título indica a análise dos três tipos de fé.

A resposta de Krishna retoma os três *gunas* estudados no capítulo 14: Sattva, Rajas e Tamas. A fé de cada pessoa acompanha sua constituição interior. O capítulo mostra essa influência não apenas nas crenças abstratas, mas também nas escolhas concretas: o que se come, como se pratica um ritual, por que se faz uma doação e como se exerce a disciplina.

### O sentido de shraddha

Na tradição indiana, *shraddha* é mais ampla do que aceitar uma proposição como verdadeira. Ela envolve confiança, orientação interior e disposição para dedicar atenção e ação a algo considerado significativo. Por isso, a fé aparece no capítulo como uma força que se manifesta em práticas e hábitos.

> **Chave de leitura:** a Gita não está apenas perguntando “no que você acredita?”. Está perguntando também: “como sua crença aparece no modo como você vive, trata o corpo, disciplina a mente, realiza suas práticas e compartilha o que possui?”.

*As categorias de alimento, sacrifício e austeridade refletem o contexto cultural e religioso do texto. Elas podem ser interpretadas filosoficamente, mas não substituem conhecimento científico contemporâneo sobre nutrição, saúde ou comportamento.*
$md$),

(2, 'Conceitos fundamentais', $md$
## Os três modos da fé em ação

### 1. A fé acompanha a constituição interior (17.1–4)

Arjuna pergunta sobre aqueles que realizam práticas com fé, mas sem seguir as prescrições das escrituras. Krishna responde que a fé é de três tipos, conforme a predominância dos gunas: Sattva, Rajas e Tamas (17.2–3). O verso 17.3 apresenta uma ideia central: a pessoa é constituída por sua fé; em certo sentido, aquilo em que confia e a que se dedica participa da formação de quem ela se torna.

O verso 17.4 relaciona a orientação da fé aos objetos de culto: pessoas de natureza sáttvica dirigem-se a formas divinas; as rajásicas, a poderes associados a riqueza e força; e as tamásicas, a espíritos e forças descritas como inferiores ou obscuras na cosmologia do texto.

- **Fé sáttvica:** orientada por clareza, discernimento, equilíbrio e compromisso com o que é considerado elevado e benéfico.
- **Fé rajásica:** marcada por desejo de resultado, reconhecimento, poder, recompensa ou prestígio.
- **Fé tamásica:** associada à confusão, ao medo, à superstição, à negligência e a práticas sem discernimento.

### 2. Práticas sem discernimento e austeridade distorcida (17.5–6)

Krishna critica práticas severas realizadas por orgulho, desejo ou apego, especialmente quando envolvem sofrimento desnecessário e desrespeito ao corpo. O texto afirma que tais práticas não são verdadeiramente sábias e podem ser consideradas demoníacas em sua linguagem religiosa.

O ponto ético é importante: disciplina não é sinônimo de violência contra si mesmo. Uma prática que destrói o corpo ou alimenta vaidade pode contradizer o propósito de desenvolvimento espiritual que afirma perseguir.

### 3. A alimentação segundo os gunas (17.7–10)

O capítulo aplica a distinção dos gunas à alimentação. Os alimentos sáttvicos são descritos como aqueles que favorecem vitalidade, saúde, força, bem-estar e satisfação. Os rajásicos são associados a excesso de amargor, acidez, sal, ardor, pungência ou calor, e a desconforto. Os tamásicos são descritos como alimentos sem frescor, deteriorados, sem sabor, impuros ou inadequados.

| Guna | Descrição no texto | Leitura cuidadosa hoje |
|---|---|---|
| **Sattva** | Alimentos que favorecem vitalidade, saúde, força e satisfação. | Valorização de equilíbrio, qualidade e atenção ao efeito da alimentação. |
| **Rajas** | Alimentos excessivamente intensos, irritantes ou estimulantes, na classificação tradicional. | Alerta simbólico contra excesso e busca constante de estímulo; não é uma tabela nutricional moderna. |
| **Tamas** | Alimentos sem frescor, deteriorados, impuros ou inadequados. | Atenção à qualidade, conservação e cuidado; critérios sanitários atuais devem vir da ciência. |

Essas passagens devem ser lidas em seu contexto. Não se deve converter a classificação antiga em diagnóstico nutricional, nem concluir que um alimento específico determina o caráter moral de quem o consome.

### 4. Sacrifício: intenção e qualidade da ação (17.11–13)

O termo *yajna*, frequentemente traduzido como sacrifício ou oferenda ritual, é analisado em três modalidades. O sacrifício sáttvico é realizado como dever, com atenção e sem expectativa de recompensa. O rajásico é feito buscando frutos, prestígio ou reconhecimento. O tamásico é realizado sem respeito às orientações, sem distribuição adequada, sem fórmulas ou oferendas apropriadas e sem fé, conforme os critérios do texto.

A distinção ultrapassa o ritual: uma ação pode parecer nobre por fora, mas sua motivação pode ser vaidade ou interesse. A intenção importa, assim como a qualidade da execução e o cuidado com as pessoas envolvidas.

### 5. Austeridade do corpo, da fala e da mente (17.14–19)

Krishna apresenta três dimensões da austeridade, *tapas*:

- **Corpo (17.14):** respeito aos que merecem reverência, pureza, retidão, continência e não violência.
- **Fala (17.15):** palavras que não causam agitação desnecessária, que são verdadeiras, agradáveis e benéficas, além do estudo regular.
- **Mente (17.16):** serenidade, gentileza, silêncio interior, autocontrole e pureza de intenção.

Essa tríade oferece uma visão integrada da disciplina: o corpo expressa respeito, a fala constrói ou fere relações, e a mente sustenta a qualidade da intenção. A austeridade sáttvica é praticada com fé e sem expectativa de recompensa; a rajásica busca honra e reconhecimento; a tamásica envolve sofrimento ou práticas equivocadas que prejudicam a si ou aos outros.

> **Uma regra prática do verso 17.15:** antes de falar, examine se suas palavras são verdadeiras, necessárias ou benéficas, e se podem ser expressas sem causar dano gratuito. Ser agradável não significa esconder a verdade; ser verdadeiro não exige ser cruel.

### 6. A doação segundo os gunas (17.20–22)

A doação sáttvica é feita no momento e lugar adequados, a quem dela necessita ou é digno, sem expectativa de retorno. A rajásica é feita esperando recompensa ou benefício, ou com relutância. A tamásica é oferecida em contexto inadequado, sem respeito, sem cuidado ou de modo humilhante.

O capítulo mostra que a generosidade não se mede apenas pelo valor entregue. Importam a intenção, o contexto, o respeito à pessoa que recebe e a ausência de manipulação.

### 7. Om Tat Sat: intenção, dedicação e verdade (17.23–28)

Os versos finais apresentam **Om Tat Sat** como uma tríplice designação de Brahman, associada a práticas de sacrifício, austeridade e doação. *Om* é a sílaba sagrada; *Tat* significa “Aquilo”; *Sat* remete ao ser, à realidade, à verdade ou ao que é bom e duradouro, conforme o contexto interpretativo.

O texto relaciona essas expressões à consagração das ações e à orientação para o absoluto, sem apego aos frutos. O verso 17.28 adverte que atos de sacrifício, doação ou austeridade realizados sem fé são considerados *asat*, sem fundamento ou sem valor espiritual duradouro.

Isso não significa que toda ação secular sem fé religiosa seja inútil. A afirmação pertence ao quadro teológico do capítulo: trata do valor espiritual das práticas descritas em relação à fé e à consagração.
$md$),

(3, 'Interpretação filosófica', $md$
## Três diálogos com a filosofia ocidental

### William James: a experiência da fé

Em *As variedades da experiência religiosa*, William James investiga como experiências e convicções religiosas se manifestam na vida concreta. Seu olhar ajuda a compreender por que a fé não é apenas uma declaração intelectual: ela pode reorganizar hábitos, escolhas, emoções e sentidos de vida.

**Diferença:** James adota uma abordagem pragmática e psicológica, examinando experiências e seus efeitos. A Gita apresenta uma cosmologia espiritual específica e classifica a fé a partir dos três gunas.

### Aristóteles: hábito e formação do caráter

Aristóteles sustenta que nos tornamos justos praticando ações justas e temperantes praticando ações temperantes. A aproximação com o capítulo 17 está na ideia de que convicções e disposições ganham forma em práticas repetidas: alimentação, disciplina, fala e generosidade não são detalhes externos, mas expressões de uma maneira de viver.

**Diferença:** Aristóteles não organiza as práticas por Sattva, Rajas e Tamas, nem fundamenta a ética em Om Tat Sat ou na consagração a Brahman. Seu horizonte é a vida boa e a excelência humana na comunidade política.

### Kant: intenção e dever

Kant distingue agir por dever de agir apenas conforme o dever por interesse, medo ou busca de recompensa. Isso dialoga com a distinção da Gita entre uma oferenda ou doação realizada sem expectativa de retorno e outra praticada por prestígio ou benefício pessoal.

**Diferença:** Kant fundamenta a moral na autonomia da razão prática e na universalidade da máxima. A Gita insere a ação em uma ordem espiritual e devocional, na qual a renúncia aos frutos e a relação com o divino têm papel próprio.

| Pensador | Ponto de encontro | Diferença decisiva |
|---|---|---|
| William James | A fé se manifesta na experiência e transforma a vida prática. | Investigação pragmática da experiência, não cosmologia dos gunas. |
| Aristóteles | Práticas repetidas formam hábitos e caráter. | Ética da virtude e florescimento humano, sem a estrutura espiritual da Gita. |
| Kant | Distinção entre ação orientada por princípio e ação por recompensa. | Autonomia racional como fundamento moral, não consagração devocional. |

### Uma interpretação integradora

O capítulo 17 permite avaliar a coerência entre crença, intenção e prática. Uma pessoa pode defender generosidade e doar para ser admirada; pode falar em verdade e usar palavras para humilhar; pode buscar disciplina e transformar austeridade em autopunição. A forma externa de uma prática não revela, sozinha, sua qualidade interior.

Uma leitura filosófica contemporânea pode resumir o desafio assim: nossas convicções precisam ser examinadas não apenas pelo que afirmam, mas também pelo tipo de pessoa e de relação que ajudam a produzir.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Coerência entre convicção, intenção e ação

O capítulo oferece uma matriz para examinar práticas cotidianas sem transformar cada escolha em julgamento moral. A pergunta não é se alguém é “sáttvico” ou “rajásico” como identidade, mas que qualidade está predominando em determinada ação.

### Na liderança e na gestão

- **Doação de recursos:** uma iniciativa social é feita para atender uma necessidade real ou para produzir publicidade? A comunicação pode existir, mas não deve apagar a dignidade de quem recebe.
- **Disciplina:** metas e rotinas desenvolvem capacidade ou servem apenas para demonstrar controle e produtividade?
- **Comunicação:** a fala é verdadeira e útil? É possível dar feedback direto sem humilhar?
- **Rituais organizacionais:** reuniões, indicadores e cerimônias ajudam a cumprir propósitos ou viraram formalidades mantidas por vaidade e inércia?

### Na educação

A austeridade da fala pode ser traduzida em uma prática pedagógica poderosa: comunicar com verdade, clareza e benefício. O professor não precisa evitar conversas difíceis; precisa evitar o dano gratuito. A disciplina corporal, verbal e mental também pode orientar a construção de ambientes de aprendizagem seguros, exigentes e respeitosos.

### Na vida cotidiana: auditoria de uma prática

1. Escolha uma prática recorrente: estudar, treinar, trabalhar, doar, alimentar-se ou participar de uma atividade espiritual.
2. Identifique a intenção predominante: clareza e benefício, recompensa e reconhecimento, ou automatismo e falta de discernimento?
3. Observe a execução: há respeito ao corpo, às pessoas e ao contexto?
4. Avalie o efeito: a prática produz saúde, lucidez e relações melhores ou alimenta ansiedade, vaidade e desgaste?
5. Faça um ajuste pequeno e verificável na próxima repetição.

> **Exercício de sete dias: a tríade da fala.** Ao final de cada dia, escolha uma conversa importante e registre: o que eu disse era verdadeiro? Era necessário ou benéfico? Poderia ter sido dito com mais respeito? O objetivo não é falar pouco por medo, mas desenvolver uma palavra confiável.

*As classificações alimentares do capítulo são históricas e religiosas. Para decisões nutricionais individuais, use evidências científicas e orientação profissional adequada, não rótulos morais sobre alimentos.*
$md$),

(5, 'Reflexão pessoal interativa', $md$
## O que sua fé produz na prática?

Responda pensando em comportamentos reais, não na imagem que gostaria de transmitir. O exercício é reflexivo e não classifica sua espiritualidade.

### Reflexão aberta

Escolha uma prática importante na sua vida. O que você diz que valoriza nela? Qual é sua motivação real? Que mudança aproximaria intenção e ação?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## O que levar deste capítulo

1. **A fé molda a orientação da vida:** aquilo em que confiamos influencia nossas escolhas, práticas e prioridades.
2. **Os gunas aparecem nas práticas:** Sattva, Rajas e Tamas não se limitam ao temperamento; também qualificam a intenção e a execução de ações.
3. **A forma externa não basta:** sacrifício, disciplina e doação precisam ser examinados pela motivação, pelo contexto e pelo efeito.
4. **Austeridade é integrada:** corpo, fala e mente precisam participar da disciplina.
5. **A palavra tem responsabilidade:** verdade e benefício devem caminhar com respeito, sem confundir franqueza com crueldade.
6. **Om Tat Sat orienta a consagração:** as ações podem ser dedicadas a um princípio maior, sem apego exclusivo à recompensa pessoal.

### Versos para revisitar

| Versos | Tema | Pergunta para leitura |
|---|---|---|
| 17.1–4 | Os três tipos de fé | Como a fé se relaciona com a constituição interior? |
| 17.5–6 | Austeridade distorcida | Quando disciplina se transforma em orgulho ou violência contra si? |
| 17.7–10 | Alimentação e gunas | Que visão de cuidado e equilíbrio está por trás da classificação? |
| 17.11–13 | Três formas de sacrifício | Qual é a diferença entre dever, recompensa e prática sem discernimento? |
| 17.14–19 | Austeridade do corpo, fala e mente | Como a disciplina pode integrar ação, comunicação e intenção? |
| 17.20–22 | Doação | O que torna uma doação respeitosa e livre de expectativa de retorno? |
| 17.23–28 | Om Tat Sat | Como a consagração altera a relação com os frutos da ação? |

> **Síntese interpretativa:** o capítulo 17 propõe examinar a qualidade interior das práticas. A fé não se prova apenas pelo discurso ou pela aparência ritual: ela se revela na intenção, no cuidado com o corpo, na qualidade da palavra, na disciplina e na generosidade. A pergunta decisiva é se nossas práticas nos tornam mais lúcidos, responsáveis e respeitosos.

Próxima e última etapa: **Capítulo 18 — Moksha Sannyasa Yoga**, o Yoga da Libertação pela Renúncia. O capítulo final retoma os grandes temas da obra: ação, dever, conhecimento, renúncia, devoção, discernimento e entrega.

### Três questões para orientar a leitura final

1. Qual é a diferença entre renunciar à ação e renunciar ao apego aos frutos da ação?
2. Como Krishna articula dever, conhecimento, ação e devoção no encerramento da Gita?
3. O que significa entregar-se ao divino sem abandonar a responsabilidade de agir?
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 17
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
  (1, 'Quando você realiza algo que considera importante, qual motivação costuma pesar mais?'),
  (2, 'Quando precisa dar um feedback difícil, você tende a:'),
  (3, 'Ao fazer uma doação ou ajudar alguém, o que melhor descreve sua postura?'),
  (4, 'Como você costuma lidar com disciplina e autocuidado?'),
  (5, 'Qual aspecto do capítulo mais merece sua atenção neste momento?')
) as v(ordem, enunciado)
where c.numero = 17 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'O valor da ação e o benefício que ela pode produzir.'),
  (1, 'B', 'O reconhecimento, o resultado ou a vantagem que posso obter.'),
  (1, 'C', 'O hábito, a pressão externa ou a vontade de cumprir logo a obrigação.'),
  (2, 'A', 'Buscar verdade, clareza e benefício, preservando o respeito.'),
  (2, 'B', 'Pensar em como a conversa afetará minha imagem ou autoridade.'),
  (2, 'C', 'Evitar a conversa ou falar de modo impulsivo, sem avaliar o impacto.'),
  (3, 'A', 'Procuro entender a necessidade e ajudar sem exigir retorno.'),
  (3, 'B', 'Gosto que saibam que fui eu quem ajudou.'),
  (3, 'C', 'Ajudo sem atenção ao contexto, às vezes de forma pouco respeitosa.'),
  (4, 'A', 'Busco constância equilibrada, respeitando limites e propósito.'),
  (4, 'B', 'Exijo muito de mim para alcançar resultados ou provar capacidade.'),
  (4, 'C', 'Oscilo entre negligência e práticas excessivas, sem muita reflexão.'),
  (5, 'A', 'Tornar minhas convicções mais coerentes com minhas ações.'),
  (5, 'B', 'Examinar minha necessidade de reconhecimento e recompensa.'),
  (5, 'C', 'Romper automatismos e agir com mais discernimento.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 17 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, chave, texto)
select e.id, v.chave, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  ('A', 'Suas respostas indicam uma orientação frequente para propósito, cuidado e coerência. O desafio é sustentar essa intenção também quando não há reconhecimento, quando a tarefa é difícil ou quando o resultado não aparece.'),
  ('B', 'Suas respostas sugerem que reconhecimento, recompensa ou desempenho podem influenciar bastante suas práticas. Isso não torna automaticamente uma ação inválida, mas vale perguntar se o resultado externo está ocupando o lugar do propósito.'),
  ('C', 'Suas respostas sugerem pontos de atenção ligados a automatismo, evasão ou falta de discernimento. Escolha uma prática pequena para realizar com presença, respeito aos limites e clareza de intenção.')
) as v(chave, texto)
where c.numero = 17 and e.ordem = 5
on conflict (etapa_id, chave) do update set texto = excluded.texto;
