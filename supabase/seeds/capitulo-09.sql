-- Jornada da Virtude v2.0 — conteúdo do capítulo 9 (Raja Vidya Raja Guhya Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz (15 alternativas) e as 3 leituras por
-- faixa. Neste capítulo o quiz usa o modo "faixas" (migração 20261119000100_quiz_por_faixas.sql): a alternativa
-- C é a alinhada ao ensinamento e a leitura depende de quantas vezes ela foi escolhida (4 ou mais, 2 ou 3, menos de 2).
-- Idempotente: upsert por numero, (capitulo_id, ordem), (etapa_id, ordem), (pergunta_id, chave) e (etapa_id, minimo).
-- Não insere registros de usuário.
-- O HTML tem seis seções após a introdução; a "Ideia central" abre a etapa 1.

insert into public.capitulos (numero, titulo)
values (9, 'Raja Vidya Raja Guhya Yoga — O Yoga do Conhecimento Régio e do Segredo Supremo')
on conflict (numero) do update set titulo = excluded.titulo;

insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Ideia central

O capítulo 9 apresenta o conhecimento considerado régio porque revela uma compreensão decisiva sobre a relação entre o divino e o universo: Krishna é apresentado como fundamento de toda a existência, permanece presente em todos os seres e, ao mesmo tempo, não se reduz ao mundo manifestado.

O segredo não está reservado a uma elite intelectual. O texto afirma que esse conhecimento pode ser vivido por meio da fé, da devoção e de uma relação sincera com o divino. Até uma oferta simples, quando feita com devoção, ganha significado.

> **Pergunta-guia:** como reconhecer uma dimensão sagrada na existência e transformar essa percepção em uma prática cotidiana de presença, responsabilidade e devoção?

## Contexto histórico e filosófico

A Bhagavad Gita integra o *Mahabharata* e acompanha o diálogo entre Krishna e Arjuna. Nos capítulos anteriores, Krishna apresentou caminhos de ação, conhecimento e meditação, além de explicar sua relação com a natureza e com o princípio consciente.

O capítulo 9 aprofunda essa exposição. Seu título, **Raja Vidya Raja Guhya**, costuma ser traduzido como “conhecimento régio, segredo régio”. “Régio” indica importância suprema; “segredo” aponta para uma verdade profunda que não é compreendida apenas por informação, mas exige abertura e transformação interior.

O texto articula duas afirmações que parecem tensionadas: o divino permeia e sustenta todos os seres, mas não está limitado por eles. Essa relação entre imanência e transcendência é central para a teologia da Gita e recebe interpretações diferentes nas escolas Vedanta.

> **Nota de leitura:** não se deve reduzir o capítulo a uma fórmula única sobre Deus e o mundo. Leituras não dualistas, qualificadamente não dualistas e dualistas interpretam de modos distintos a relação entre Krishna, as almas e a natureza. O texto oferece o terreno para esse debate, não uma resolução aceita por todas as tradições.
$md$),

(2, 'Conceitos fundamentais', $md$
## Conceitos fundamentais e percurso dos versos

### 2.1 O conhecimento que liberta (9.1–3)

Krishna promete transmitir a Arjuna um conhecimento acompanhado de realização direta. Ele o descreve como puro, elevado, acessível pela experiência, conforme o dharma e capaz de libertar. Não é apenas uma teoria sobre o divino: é uma compreensão que deve transformar a maneira de existir.

A dificuldade está na confiança. O texto afirma que quem não desenvolve fé nesse caminho permanece preso ao ciclo da existência condicionada. Fé, aqui, não precisa ser confundida com credulidade cega: no contexto do diálogo, ela envolve disposição para praticar, ouvir e verificar existencialmente o ensinamento.

### 2.2 O divino como fundamento e sustentação (9.4–10)

Krishna declara que o universo inteiro está permeado por sua presença, mas que os seres não o contêm como um objeto contém outro. Ele sustenta os seres sem estar limitado por eles. A imagem do vento que se move no espaço ajuda a comunicar essa relação.

O capítulo apresenta o divino como fundamento da manifestação cósmica. A natureza opera sob sua supervisão, os ciclos do universo se desenrolam e os seres surgem e desaparecem. Krishna não é apresentado como uma peça dentro do universo, mas como princípio que o sustenta e transcende.

> *“Todos os seres permanecem em mim, mas eu não estou limitado por eles.”* — Paráfrase de 9.4–5

Essa passagem exige cuidado: não descreve uma relação espacial simples. A linguagem procura expressar uma dependência ontológica, isto é, a relação entre os seres e o fundamento de sua existência.

### 2.3 Diferentes maneiras de se relacionar com o divino (9.11–15)

Krishna critica aqueles que, por desconhecimento, reduzem sua natureza à aparência humana. Em contraste, descreve pessoas de disposição elevada que o reconhecem como fonte e fundamento, dedicando-se a ele com firmeza, devoção e busca contínua.

O texto também menciona diferentes formas de aproximação: louvor, conhecimento, disciplina e contemplação. Essa diversidade indica que a relação com o divino pode assumir formas variadas, embora o capítulo privilegie a devoção dirigida a Krishna.

### 2.4 O divino como ritual, oferenda e realidade (9.16–19)

Krishna afirma ser o ritual, a oferenda, a fórmula sagrada, a manteiga clarificada, o fogo e o ato de oferecer. Também se apresenta como pai, mãe, sustentador, ancestral, objetivo do conhecimento, purificador e testemunha.

A enumeração amplia a percepção: o sagrado não está restrito a um espaço ritual isolado. O próprio processo da oferenda, seus elementos e sua finalidade são relacionados ao divino. Krishna também se associa aos ciclos naturais: calor, chuva, imortalidade e morte.

> **Ideia central:** o capítulo dissolve a separação rígida entre o que é considerado sagrado e o que é vivido no cotidiano. Isso não torna tudo automaticamente correto; convida a reconhecer a dependência da existência em relação a um fundamento maior.

### 2.5 A diferença entre buscar recompensas e buscar o divino (9.20–25)

Krishna descreve pessoas que realizam rituais buscando os frutos celestes. Elas podem alcançar resultados temporários, mas, quando os méritos se esgotam, retornam ao ciclo da existência. O texto contrasta essa busca por recompensas limitadas com a dedicação à realidade divina.

A passagem não é simplesmente uma condenação de toda prática ritual. Seu foco é a limitação de uma espiritualidade orientada exclusivamente por ganhos: mesmo recompensas elevadas continuam sendo temporárias quando dependem de mérito e desejo.

### 2.6 A oferenda simples e a intenção devocional (9.26–29)

Krishna afirma que aceita uma folha, uma flor, uma fruta ou água quando oferecidas com devoção. O valor não está no custo material do presente, mas na sinceridade da entrega. O capítulo desloca a espiritualidade do espetáculo e da ostentação para a qualidade da intenção.

> *“Quem me oferece com devoção uma folha, uma flor, uma fruta ou água, essa oferenda de coração devoto eu aceito.”* — Paráfrase de 9.26

Krishna também afirma que tudo o que alguém faz, come, oferece ou pratica pode ser dedicado a ele. A consequência é uma transformação da vida inteira em prática espiritual. A dedicação não elimina o cuidado com a ação; torna sua intenção mais consciente.

O verso 9.29 afirma a igualdade da presença divina em todos, sem favoritismo, mas acrescenta que aqueles que se dedicam a Krishna estão nele e ele neles. A passagem combina universalidade e intimidade devocional.

### 2.7 A possibilidade de transformação (9.30–34)

O capítulo afirma que mesmo alguém que tenha cometido erros graves pode orientar-se para o caminho correto por meio de uma devoção firme. A afirmação não deve ser lida como autorização para continuar prejudicando os outros nem como apagamento automático das consequências. O ponto é que o passado não precisa determinar definitivamente a possibilidade de transformação.

Krishna declara que seus devotos alcançam paz e que ninguém que se dedica sinceramente a ele está espiritualmente excluído por origem ou condição social. A conclusão é um convite à lembrança constante, à devoção e à entrega da mente.

> **Leitura ética:** a inclusão espiritual afirmada no capítulo deve ser levada a sério. Não é coerente usar o texto para legitimar humilhação ou discriminação. A transformação interior precisa aparecer em conduta responsável e respeito aos outros.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com três pensadores ocidentais

As comparações são aproximações conceituais, não equivalências doutrinárias ou afirmações de influência histórica.

### Spinoza · Deus como fundamento de tudo

Spinoza identifica Deus com a única substância infinita, da qual todas as coisas são expressões. Nada existe fora dessa realidade; cada ser finito depende dela e expressa sua potência de modo determinado.

**Convergência:** ambos oferecem uma visão na qual os seres não são independentes de um fundamento mais amplo. A realidade particular deve ser compreendida em relação à totalidade.

**Diferença:** a Gita apresenta Krishna como realidade pessoal, capaz de receber devoção e conceder graça. Spinoza rejeita a concepção de Deus como pessoa que deseja, escolhe ou intervém por vontade. A imanência spinozana e a relação entre imanência e transcendência na Gita não são a mesma coisa.

### Plotino · O princípio que excede o mundo

Plotino descreve o Uno como princípio supremo, além das categorias comuns, do qual procede a multiplicidade. A realidade depende de uma fonte que não se esgota nos seres que dela derivam.

**Convergência:** a ideia de um fundamento que sustenta a multiplicidade e não se reduz a ela aproxima-se de uma dimensão importante do capítulo 9.

**Diferença:** o Uno de Plotino está além do ser e do pensamento, enquanto a Gita articula a realidade suprema com uma dimensão pessoal e devocional em Krishna. As estruturas metafísicas são distintas.

### William James · Experiência religiosa e transformação

William James investiga a experiência religiosa a partir de seus efeitos na vida das pessoas. Em vez de avaliar uma crença apenas por sua formulação abstrata, observa as transformações de caráter, sentido e conduta que podem acompanhá-la.

**Convergência:** o capítulo 9 insiste que o conhecimento espiritual precisa ser realizado e vivido. A devoção não se limita a uma opinião: reorganiza a existência.

**Diferença:** James analisa experiências religiosas por uma abordagem pragmática e psicológica, sem afirmar como conclusão filosófica a verdade metafísica específica da teologia da Gita.

### O que esse diálogo permite perceber?

Spinoza ajuda a pensar a dependência de tudo em relação a um fundamento; Plotino, a transcendência desse princípio em relação às formas particulares; James, os efeitos concretos da experiência religiosa. A Gita integra esses temas em uma proposta própria: conhecer o divino, confiar nele e dedicar a vida à sua presença.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações práticas contemporâneas

### Na vida pessoal: dar intenção às ações comuns

O capítulo convida a não separar completamente valores e rotina. Uma refeição, uma conversa, um trabalho bem executado ou um gesto de cuidado podem expressar gratidão e compromisso. A prática espiritual deixa de depender apenas de momentos especiais e passa a orientar escolhas comuns.

### Na educação: valorizar intenção e processo

Na aprendizagem, não basta premiar o resultado final. A dedicação, a honestidade intelectual, a colaboração e a disposição para corrigir erros também importam. Uma pequena conquista construída com esforço e integridade pode ter mais valor formativo do que um resultado obtido por atalhos.

### Na liderança: servir ao propósito, não ao ego

Uma liderança orientada por propósito não transforma a organização em palco de vaidade pessoal. Ela conecta decisões a uma finalidade que ultrapassa o prestígio individual. A pergunta deixa de ser apenas “o que ganho com isso?” e passa a incluir “a quem serve esta decisão e que consequências produz?”.

### No trabalho: excelência sem ostentação

A imagem da oferenda simples questiona a necessidade de impressionar. Nem toda contribuição precisa ser grandiosa ou visível. Consistência, confiabilidade, cuidado com detalhes e disposição para colaborar são formas concretas de dedicação.

### Nas relações: dignidade sem favoritismo

Se a presença divina é reconhecida em todos, a dignidade humana não deve depender de status, origem, riqueza ou utilidade. Isso não significa tratar todas as condutas como equivalentes. Significa distinguir o valor da pessoa da avaliação crítica de suas ações.

> **Prática diária:** escolha uma atividade comum que você faria de qualquer maneira. Antes de começar, defina a intenção: realizar com honestidade, cuidado e benefício real. Ao terminar, avalie a qualidade da sua dedicação, não apenas o reconhecimento recebido.

### Um cuidado essencial

Dedicar ações a um princípio maior não deve servir para justificar negligência, fanatismo ou obediência cega a líderes humanos. A devoção madura exige discernimento, responsabilidade e atenção às consequências concretas das ações.
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Exercício de reflexão pessoal

Responda às cinco questões. A devolutiva é um convite à auto-observação, não uma avaliação psicológica ou espiritual.

### Reflexão aberta

Escolha uma atividade cotidiana que costuma parecer pequena ou automática. Como ela poderia se transformar em uma oferenda simbólica, isto é, em uma ação realizada com mais intenção, cuidado e compromisso com algo maior do que o reconhecimento pessoal?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese e integração

### O que levar deste capítulo

- **Raja Vidya:** conhecimento régio, compreensão elevada que precisa ser realizada na experiência.
- **Raja Guhya:** segredo supremo, verdade profunda que transforma a relação com a existência.
- **Imanência e transcendência:** o divino permeia e sustenta os seres, mas não se reduz ao mundo manifestado.
- **Devoção:** confiança e dedicação que reorganizam a mente, a intenção e a ação.
- **Oferenda:** a sinceridade pode dar significado a gestos simples, sem depender de ostentação.
- **Transformação:** o passado não precisa definir definitivamente o futuro; mudança exige orientação e prática.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 9.1–3 | O conhecimento régio e sua capacidade libertadora. |
| 9.4–10 | O divino como presença que permeia e sustenta o universo. |
| 9.11–15 | As diferentes atitudes diante da realidade divina. |
| 9.16–19 | O divino como ritual, oferenda, testemunha e fundamento. |
| 9.20–25 | A diferença entre recompensas temporárias e dedicação ao Supremo. |
| 9.26–29 | A oferenda simples, a devoção e a presença divina em todos. |
| 9.30–34 | Transformação, acolhimento e entrega. |

### Conexão com a jornada

O capítulo 8 tratou do Absoluto, da morte e da continuidade espiritual. O capítulo 9 aprofunda a relação entre o divino e a existência, mostrando que a devoção pode atravessar todas as ações. O próximo capítulo, **Vibhuti Yoga**, apresenta manifestações específicas da grandeza divina no universo.

> **Frase de integração:** a espiritualidade não precisa ficar confinada a momentos extraordinários. Uma ação simples, realizada com intenção sincera, cuidado e responsabilidade, pode expressar aquilo que considero mais elevado.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 9
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

update public.etapas e
set quiz_modo = 'faixas', quiz_chave_alvo = 'C'
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 9 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado)
select e.id, v.ordem, v.enunciado
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'O que mais orienta suas ações cotidianas?'),
  (2, 'Como você lida com tarefas simples que ninguém vai reconhecer?'),
  (3, 'Quando pensa em espiritualidade ou valores, qual é sua relação com a prática?'),
  (4, 'Como você trata pessoas que não podem oferecer vantagem ou reconhecimento?'),
  (5, 'O que melhor representa a oferenda simples de 9.26?')
) as v(ordem, enunciado)
where c.numero = 9 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Principalmente reconhecimento, recompensa ou vantagem pessoal.'),
  (1, 'B', 'Uma mistura de propósito e necessidade de aprovação.'),
  (1, 'C', 'A intenção de agir com integridade e contribuir para algo que considero valioso.'),
  (2, 'A', 'Tendo a fazer apenas o mínimo necessário.'),
  (2, 'B', 'Faço bem quando tenho tempo ou disposição.'),
  (2, 'C', 'Procuro manter cuidado e qualidade mesmo sem visibilidade.'),
  (3, 'A', 'Fica mais no campo das ideias e declarações.'),
  (3, 'B', 'Tento praticar, mas sem muita regularidade.'),
  (3, 'C', 'Busco traduzir minhas convicções em hábitos e decisões concretas.'),
  (4, 'A', 'Minha atenção varia conforme a relação pode ser útil.'),
  (4, 'B', 'Procuro ser respeitoso, mas nem sempre percebo minhas diferenças de tratamento.'),
  (4, 'C', 'Procuro preservar a dignidade e o respeito independentemente do status.'),
  (5, 'A', 'O valor espiritual depende do tamanho ou custo do que se oferece.'),
  (5, 'B', 'A intenção importa, mesmo que a qualidade da ação seja irrelevante.'),
  (5, 'C', 'A sinceridade da intenção dá sentido à oferta, sem dispensar cuidado e responsabilidade.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 9 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (4, 'Suas respostas sugerem uma disposição consistente para conectar intenção, valores e ações, inclusive nas tarefas pouco visíveis. O desafio é preservar essa coerência sem transformar a dedicação em cobrança excessiva ou busca disfarçada de reconhecimento.'),
  (2, 'Você demonstra alguma aproximação entre propósito e prática, mas pode haver situações em que a aprovação, a recompensa ou a rotina automática assumam o comando. Observe onde uma intenção mais consciente faria diferença.'),
  (0, 'Suas respostas apontam uma oportunidade de aproximar convicções e cotidiano. Comece com uma tarefa pequena e defina uma intenção concreta antes de realizá-la. Depois avalie a qualidade da dedicação, não apenas o resultado.')
) as v(minimo, texto)
where c.numero = 9 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
