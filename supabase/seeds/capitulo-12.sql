-- Jornada da Virtude v2.0 — conteúdo do capítulo 12 (Bhakti Yoga)
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
values (12, 'Bhakti Yoga — O Yoga da Devoção')
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

A devoção, na Bhagavad Gita, não é apenas sentimento religioso ou declaração de fé. É uma orientação integral da existência: dirigir a mente ao divino, agir com dedicação, cultivar equanimidade e tratar os seres com amizade, compaixão e ausência de hostilidade.

O capítulo 12 responde a uma pergunta de Arjuna: quem está mais firmemente estabelecido no yoga, aquele que cultua o divino em forma pessoal ou aquele que contempla o Absoluto não manifestado?

> **Pergunta-guia:** como transformar aquilo em que acredito ou considero sagrado em uma prática diária de caráter, atenção e relação com os outros?

## Contexto histórico e filosófico

A Bhagavad Gita está inserida no *Mahabharata* e apresenta o diálogo entre Krishna e Arjuna no campo de batalha. Depois de discutir ação, conhecimento, meditação e a natureza do divino, o texto chega a uma questão decisiva: como o ser humano pode estabelecer uma relação viva e estável com o Supremo?

O termo **bhakti** deriva da ideia de participação, devoção ou dedicação amorosa. No contexto da Gita, não significa apenas emoção intensa. Envolve confiança, lembrança constante, disciplina, serviço, entrega dos frutos da ação e transformação ética.

O capítulo também trata de duas formas de orientação espiritual: a devoção ao divino concebido de modo pessoal e a contemplação do Absoluto não manifestado, sem forma ou atributos perceptíveis. O texto reconhece a legitimidade do segundo caminho, mas afirma que ele é mais difícil para quem vive identificado com o corpo e com a experiência concreta.

> **Nota de interpretação:** diferentes escolas Vedanta compreendem a relação entre o devoto, o divino e o Absoluto de maneiras distintas. Algumas enfatizam a relação pessoal e a diferença entre alma e Deus; outras interpretam a devoção como caminho que culmina no reconhecimento da unidade última. Não existe uma única leitura que represente todas as tradições.
$md$),

(2, 'Conceitos fundamentais', $md$
## Conceitos fundamentais e percurso dos versos

### 2.1 A pergunta de Arjuna: pessoal e impessoal (12.1–5)

Arjuna pergunta quem conhece melhor o yoga: os que mantêm a mente dedicada a Krishna, em forma pessoal, ou os que contemplam o princípio imperecível e não manifestado.

Krishna considera firmemente estabelecidos aqueles que o adoram com mente concentrada e fé. Também reconhece os que contemplam o Absoluto não manifestado, mas observa que esse caminho é mais difícil para seres encarnados, pois exige lidar com uma realidade que não pode ser apreendida por formas e referências sensoriais.

> *A questão não é simplesmente qual caminho é intelectualmente superior, mas qual caminho pode ser efetivamente vivido e sustentado pelo praticante.* — Síntese interpretativa de 12.1–5

### 2.2 Entrega da mente e da inteligência (12.6–8)

O caminho da devoção é descrito como uma entrega contínua: realizar as ações tendo o divino como referência, manter a mente orientada para ele e cultivar confiança. A promessa de Krishna é de amparo e libertação do ciclo de sofrimento e condicionamento.

“Fixar a mente” não significa repetir uma ideia mecanicamente. Significa permitir que um princípio orientador influencie escolhas, prioridades, reações e compromissos. A devoção torna-se real quando reorganiza a vida.

### 2.3 Uma escada de práticas (12.9–12)

O texto oferece alternativas graduais para quem ainda não consegue manter a mente constantemente concentrada:

1. **Concentração direta:** manter a mente e a inteligência orientadas ao divino.
2. **Prática disciplinada:** se a concentração falhar, cultivar o retorno por meio de exercícios constantes.
3. **Ação dedicada:** se a prática contemplativa ainda for difícil, agir em função do divino.
4. **Renúncia aos frutos:** quando nem isso for possível, aprender a abandonar o apego aos resultados.

O movimento é pedagogicamente importante: a Gita não apresenta a incapacidade momentânea como fracasso definitivo. Oferece um caminho de aproximação, prática e amadurecimento.

> **Leitura prática:** não espere sentir devoção perfeita para começar a agir com integridade. Comece pela ação possível, pela disciplina e pela redução do egoísmo.

### 2.4 A paz que nasce do desapego (12.13–16)

Krishna descreve o devoto querido como alguém que não cultiva ódio, é amigo e compassivo, não se considera proprietário absoluto, mantém equilíbrio diante de prazer e dor, perdoa, tem autocontrole e permanece firme na dedicação.

Também aparecem qualidades relacionais: não causar perturbação desnecessária, não ser dominado pela agitação alheia, não viver preso ao medo, à ansiedade e à expectativa. O devoto não é apresentado como alguém sem emoções, mas como alguém que não se deixa governar por elas de modo destrutivo.

### 2.5 Equanimidade diante dos opostos (12.17–19)

O texto valoriza a capacidade de atravessar prazer e sofrimento, elogio e crítica, honra e desonra, sem perder o eixo interior. A equanimidade não exige indiferença diante de injustiças nem abandono de decisões necessárias. Ela indica estabilidade para responder sem ser arrastado pela oscilação dos acontecimentos.

O devoto não depende inteiramente da aprovação externa para sustentar seus valores. Essa independência não é arrogância: é coerência interior.

### 2.6 A conclusão: fé e compromisso (12.20)

O capítulo conclui destacando aqueles que seguem com fé o caminho do dharma descrito por Krishna e o consideram como referência suprema. A devoção aparece, assim, como vínculo entre confiança, prática e orientação ética.

> *O devoto é reconhecido menos por declarações grandiosas do que pela qualidade de sua presença, de suas ações e de suas relações.* — Síntese interpretativa do capítulo
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com três pensadores ocidentais

As comparações são aproximações conceituais, não equivalências históricas ou doutrinárias.

### Aristóteles: caráter e hábito

Para Aristóteles, a virtude é formada pelo hábito e se expressa em escolhas consistentes. Não basta conhecer o bem: é necessário praticá-lo até que se torne parte do caráter.

**Convergência:** a devoção da Gita também precisa aparecer em atitudes concretas, como autocontrole, generosidade, coragem e amizade.

**Diferença:** Aristóteles organiza sua ética em torno da eudaimonia, da razão prática e da vida humana na pólis. A Gita insere a transformação ética em uma relação com o divino e em um horizonte de libertação espiritual.

### Spinoza: amor intelectual e liberdade

Spinoza compreende o amor a Deus como ligado ao conhecimento adequado da realidade, identificada com Deus ou Natureza. A liberdade cresce quando deixamos de ser conduzidos por paixões passivas e compreendemos a ordem necessária das coisas.

**Convergência:** ambos associam uma relação mais profunda com o divino à transformação da vida e à redução da servidão aos afetos desordenados.

**Diferença:** a devoção da Gita pode envolver relação pessoal, entrega e graça; o Deus de Spinoza não é uma pessoa que escolhe, deseja ou intervém no mundo. Seu amor intelectual não deve ser confundido com bhakti.

### Kant: dever e intenção moral

Kant sustenta que a moralidade não depende de recompensas, vantagens ou inclinações momentâneas, mas da ação por dever e do respeito à lei moral.

**Convergência:** a Gita valoriza agir sem apego aos frutos e não transformar a ação em instrumento de ganho egoísta.

**Diferença:** em Kant, a autonomia racional e a universalidade da lei moral são centrais. Na Gita, a ação é situada no dharma, na ordem cósmica e na relação de entrega ao divino. Não se deve reduzir dharma a dever kantiano.

### O que o diálogo revela?

Aristóteles ajuda a compreender a devoção como formação do caráter; Spinoza, como transformação da relação com os afetos e com a totalidade; Kant, como ação que não depende de recompensa. A Gita reúne elementos que não se deixam reduzir a nenhum deles: amor devocional, entrega, disciplina e libertação.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações práticas contemporâneas

### Na vida pessoal: transformar valores em rotina

Se a compaixão é um valor, ela precisa aparecer na maneira como você conversa, escuta, discorda e trata quem não pode oferecer vantagem. Se a honestidade é central, ela precisa orientar também as pequenas decisões em que ninguém está olhando.

### Na educação: ensinar pelo exemplo

Um educador pode falar sobre respeito e, ao mesmo tempo, humilhar um estudante diante da turma. A incoerência destrói a força pedagógica do discurso. A leitura do capítulo sugere que valores precisam ser encarnados em práticas, limites e relações.

### Na liderança: servir sem transformar o cargo em identidade

Liderar com espírito de serviço não significa abrir mão de autoridade ou evitar decisões difíceis. Significa usar a autoridade para orientar, desenvolver pessoas e proteger o propósito coletivo, sem exigir adoração, obediência cega ou reconhecimento permanente.

### No trabalho: excelência sem escravidão ao resultado

Dedicação não é obsessão. É possível perseguir metas com rigor, avaliar indicadores e corrigir rotas sem fazer do sucesso uma medida absoluta do próprio valor. O resultado importa, mas não deve justificar qualquer meio nem consumir toda a identidade.

### Nas relações: firmeza sem hostilidade

Não cultivar ódio não significa tolerar abuso. É possível estabelecer limites, denunciar injustiças e encerrar relações nocivas sem transformar a hostilidade em princípio de vida. Compaixão não é passividade; é reconhecer a humanidade sem abandonar o discernimento.

> **Prática diária:** escolha uma ação concreta para dedicar a um valor maior do que o ganho imediato. Execute-a com atenção, faça o melhor possível e, ao terminar, avalie o que pode aprender sem se aprisionar à aprovação ou ao resultado.
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Exercício de reflexão pessoal

Responda às cinco questões. A devolutiva é um convite à auto-observação, não um diagnóstico nem uma medida de valor espiritual.

### Reflexão aberta

Qual valor você afirma considerar essencial, mas ainda não pratica com a consistência que gostaria? Identifique uma situação concreta em que esse valor será colocado à prova e descreva uma ação observável que poderá realizar.
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese e integração

### O que levar deste capítulo

- **Bhakti:** devoção como dedicação amorosa, confiança e orientação da vida ao divino.
- **Entrega:** oferecer ações e resultados sem transformar o ego e a recompensa em centro absoluto.
- **Prática gradual:** concentração, disciplina, ação dedicada e renúncia aos frutos são caminhos de aproximação.
- **Caráter:** compaixão, humildade, perdão, autocontrole e equanimidade expressam a maturidade do devoto.
- **Equanimidade:** estabilidade diante de elogio e crítica, prazer e dor, sem confundir serenidade com indiferença.
- **Coerência:** a qualidade da devoção é visível na maneira de agir e tratar os outros.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 12.1–5 | A pergunta sobre o caminho pessoal e o Absoluto não manifestado. |
| 12.6–8 | Entrega da mente, da inteligência e das ações. |
| 12.9–12 | A progressão de práticas possíveis. |
| 12.13–16 | As qualidades do devoto querido. |
| 12.17–19 | Equanimidade diante dos opostos. |
| 12.20 | Fé e compromisso com o caminho do dharma. |

### Conexão com a jornada

O capítulo 11 apresentou a visão da forma universal e a dimensão grandiosa do divino. O capítulo 12 mostra como responder a essa visão na vida cotidiana: pela devoção, pelo caráter e pela entrega. O próximo capítulo, **Kshetra Kshetrajna Vibhaga Yoga**, investiga a distinção entre o campo da experiência e o conhecedor do campo.

> **Frase de integração:** devoção não é apenas aquilo que sinto diante do sagrado; é aquilo que minhas escolhas revelam quando volto ao mundo, às pessoas e às responsabilidades.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 12
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

-- ---------------------------------------------------------------------------
-- Quiz da etapa 5 (modo "faixas": conta as escolhas da alternativa C)
-- ---------------------------------------------------------------------------
update public.etapas e
set quiz_modo = 'faixas', quiz_chave_alvo = 'C'
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 12 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado)
select e.id, v.ordem, v.enunciado
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Quando você realiza algo importante, o que mais pesa na sua motivação?'),
  (2, 'Diante de alguém que pensa muito diferente de você, como costuma reagir?'),
  (3, 'Quando seus planos não se concretizam, o que acontece?'),
  (4, 'Como seus valores aparecem no cotidiano?'),
  (5, 'Qual alternativa melhor expressa uma devoção madura, segundo a leitura do capítulo?')
) as v(ordem, enunciado)
where c.numero = 12 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'O reconhecimento e a aprovação que posso receber.'),
  (1, 'B', 'O resultado, mesmo que eu me desgaste excessivamente.'),
  (1, 'C', 'O propósito da ação e a qualidade com que posso realizá-la.'),
  (2, 'A', 'Sinto necessidade de vencer a discussão.'),
  (2, 'B', 'Evito o assunto para não gerar desconforto.'),
  (2, 'C', 'Procuro compreender, mantendo meus limites e convicções.'),
  (3, 'A', 'Meu equilíbrio depende muito de o resultado ser o esperado.'),
  (3, 'B', 'Desisto ou me culpo por bastante tempo.'),
  (3, 'C', 'Reconheço a frustração, aprendo e reorganizo a ação.'),
  (4, 'A', 'Principalmente no que digo defender.'),
  (4, 'B', 'Em algumas situações, mas não de forma consistente.'),
  (4, 'C', 'Procuro traduzi-los em escolhas, hábitos e relações.'),
  (5, 'A', 'Esperar que a fé elimine todos os problemas.'),
  (5, 'B', 'Demonstrar crença por meio de declarações e rituais, apenas.'),
  (5, 'C', 'Orientar a vida por um compromisso profundo que se manifesta em ações e caráter.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 12 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (4, 'Suas respostas apontam para uma tendência de traduzir valores em escolhas e manter algum equilíbrio diante dos resultados. O desafio é sustentar essa coerência quando houver pressão, conflito ou falta de reconhecimento.'),
  (2, 'Há sinais de compromisso com valores, mas sua aplicação parece variar conforme as circunstâncias. Observe quais situações tornam mais difícil agir de acordo com aquilo que considera importante.'),
  (0, 'Suas respostas indicam uma oportunidade de aproximar discurso e prática. Escolha um valor e transforme-o em uma ação pequena, específica e verificável nesta semana.')
) as v(minimo, texto)
where c.numero = 12 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
