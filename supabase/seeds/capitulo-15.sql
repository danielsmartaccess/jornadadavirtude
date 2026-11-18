-- Jornada da Virtude v2.0 — conteúdo do capítulo 15 (Purushottama Yoga)
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
values (15, 'Purushottama Yoga — O Espírito supremo')
on conflict (numero) do update set titulo = excluded.titulo;

-- ---------------------------------------------------------------------------
-- Etapas: nome e texto
-- ---------------------------------------------------------------------------
insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Da árvore da existência à origem do real

Depois de explicar os três gunas no capítulo 14, Krishna amplia a investigação: de onde vem a existência condicionada, o que nos mantém presos a ela e qual é o princípio que a sustenta?

O capítulo 15, **Purushottama Yoga**, pode ser traduzido como “Yoga do Ser Supremo” ou “caminho de compreensão do Purushottama”. O termo combina *purusha*, que pode significar pessoa, princípio consciente ou ser, e *uttama*, superior ou supremo.

A abertura do capítulo apresenta uma imagem poderosa: a árvore Ashvattha, com raízes acima e galhos abaixo. A imagem inverte a árvore comum para sugerir que o mundo manifestado depende de um fundamento que não se encontra simplesmente no mesmo plano das coisas que vemos.

### Diálogo com tradições indianas

A imagem da árvore cósmica aparece em diferentes textos da tradição indiana, inclusive em passagens das Upanishads. A Gita a utiliza para falar da existência condicionada, de suas ramificações e da necessidade de investigar sua origem. O capítulo combina elementos associados ao Samkhya, ao Vedanta e à devoção a Krishna.

O texto também apresenta uma distinção entre **Kshara**, o perecível; **Akshara**, o imperecível; e **Purushottama**, o Ser Supremo que transcende ambos. A interpretação exata dessas categorias varia entre escolas do Vedanta. Não existe uma única leitura aceita por todas elas.

> **Chave de leitura:** o capítulo não é apenas uma descrição do universo. É também um convite a investigar o que sustenta nossas escolhas, identidades, desejos e vínculos, e a não confundir as manifestações da realidade com seu fundamento último.

*A árvore cósmica, a continuidade da existência entre corpos e a natureza divina de Krishna pertencem ao horizonte metafísico e religioso da Gita. Podem ser examinados filosoficamente, mas não devem ser apresentados como descrições científicas empiricamente demonstradas.*
$md$),

(2, 'Conceitos fundamentais', $md$
## Os movimentos do capítulo

### 1. A árvore Ashvattha: uma existência de cabeça para baixo (15.1–4)

Krishna descreve uma árvore com raízes acima, galhos abaixo e folhas associadas aos hinos védicos. Seus ramos se estendem pelos mundos, alimentados pelos gunas, enquanto raízes adicionais se aprofundam no mundo humano, ligadas às ações e às consequências da ação.

```text
  Raiz superior
  fundamento transcendente
          │
          ▼
  ┌─ Galhos e ramificações
  │    mundos e experiências
  ├─ Folhas
  │    conhecimento védico
  └─ Raízes secundárias
       ações e vínculos
```

*Esquema conceitual inspirado na imagem dos versos 15.1–2, não uma ilustração literal do texto.*

A árvore representa a existência condicionada, extensa e difícil de compreender em sua totalidade. O problema não é simplesmente que o mundo exista, mas que nos prendamos às suas ramificações como se fossem o fundamento definitivo.

Nos versos 15.3–4, Krishna afirma que a forma completa dessa árvore não é facilmente percebida. O instrumento para cortá-la é o **desapego firme**. Isso não significa desprezar o mundo ou abandonar responsabilidades. Significa interromper a identificação compulsiva com aquilo que é transitório e buscar a origem da existência.

### 2. O caminho de quem busca a origem (15.5–6)

O verso 15.5 descreve pessoas que superam orgulho, ilusão, apego, desejos persistentes e oscilações entre prazer e sofrimento. Elas se orientam para o princípio imperecível. O verso 15.6 descreve a morada suprema como um estado que não depende da luz do Sol, da Lua ou do fogo e do qual não há retorno, segundo a linguagem espiritual do texto.

> **Desapego não é abandono:** é deixar de tratar pessoas, cargos, resultados, objetos e imagens de si mesmo como se fossem permanentes ou capazes de garantir, sozinhos, sentido e segurança.

### 3. O Jiva e a experiência condicionada (15.7–11)

O verso 15.7 afirma que o *jiva*, o ser individual, é uma porção ou participação do próprio Krishna e, na condição encarnada, atrai para si a mente e os sentidos. A palavra “porção” não deve ser entendida necessariamente como se Deus fosse uma substância física dividida em pedaços. As escolas interpretam essa relação de maneiras diferentes: como dependência, participação, distinção real ou relação entre o individual e o absoluto.

O verso 15.8 usa a imagem do vento que transporta aromas: quando o ser individual deixa um corpo e assume outro, leva consigo a mente e os sentidos sutis, conforme a cosmologia da Gita. A metáfora comunica continuidade de tendências e instrumentos da experiência. Não é uma descrição fisiológica ou uma evidência científica de reencarnação.

Os versos 15.9–11 tratam da experiência sensorial e da dificuldade de perceber o princípio consciente. Quem está preso à identificação com o corpo e os sentidos não reconhece facilmente o que está acontecendo; quem possui discernimento pode perceber a dimensão mais profunda da experiência.

### 4. Krishna como sustentação da vida (15.12–15)

Krishna se apresenta como a luz que está no Sol, na Lua e no fogo (15.12), como aquele que penetra a Terra e sustenta os seres (15.13), e como o princípio relacionado à digestão dos alimentos (15.14). No verso 15.15, afirma estar no coração de todos, de onde procedem memória, conhecimento e também esquecimento.

Essa passagem amplia a ideia de divindade: Krishna não aparece apenas como uma figura externa que intervém no mundo, mas como fundamento presente na ordem cósmica e na própria possibilidade de conhecer e viver.

### 5. Kshara, Akshara e Purushottama (15.16–18)

| Termo | Sentido geral | Função no argumento |
|---|---|---|
| **Kshara** | Perecível, mutável. | Refere-se ao domínio dos seres e formas condicionadas, sujeitos à mudança. |
| **Akshara** | Imperecível, não perecível. | Designa o princípio ou realidade imperecível, interpretado de formas distintas pelas escolas. |
| **Purushottama** | Ser Supremo. | É apresentado como aquele que transcende e sustenta os dois, segundo a teologia do capítulo. |

Nos versos 15.16–18, Krishna estabelece a distinção e afirma sua posição como Purushottama. Em algumas leituras vedânticas, Akshara é associado ao ser individual imperecível; em outras, recebe enquadramentos metafísicos diferentes. O ponto textual central é a superioridade do Ser Supremo em relação tanto ao mutável quanto ao imperecível.

### 6. O conhecimento mais elevado (15.19–20)

Quem reconhece Krishna como Purushottama, sem confusão, conhece o sentido mais elevado da realidade e se orienta por essa compreensão. O capítulo termina afirmando que esse ensinamento é extremamente profundo e que compreendê-lo conduz à sabedoria e à realização.
$md$),

(3, 'Interpretação filosófica', $md$
## Três diálogos com a filosofia ocidental

### Platão: aparência, fundamento e conhecimento

A árvore invertida pode ser aproximada, com cautela, da distinção platônica entre o mundo sensível e uma realidade inteligível que fundamenta o conhecimento. Em ambos os casos, a experiência imediata não esgota o real: é preciso ultrapassar a aparência e investigar princípios mais fundamentais.

**Diferença:** Platão desenvolve uma metafísica das Formas e uma teoria do conhecimento; a Gita apresenta uma realidade suprema pessoal, identificada com Krishna, e integra conhecimento, ação e devoção. A raiz superior da árvore não é simplesmente uma Forma platônica.

### Plotino: o Uno e a origem da multiplicidade

Plotino concebe o Uno como princípio absolutamente primeiro, do qual procede a multiplicidade. A imagem da árvore que depende de uma raiz superior pode ajudar a pensar a relação entre fundamento e manifestações. A multiplicidade não explica a si mesma: remete a uma origem.

**Diferença:** o Uno plotiniano está além de toda determinação e não é um Deus pessoal no sentido devocional da Gita. Krishna, no capítulo 15, fala, age e se apresenta como fundamento supremo em uma relação explícita com o devoto.

### Spinoza: Deus, Natureza e dependência

Spinoza oferece um contraste produtivo. Para ele, tudo existe em Deus ou Natureza, e os seres finitos são modos da única substância. Isso permite discutir a dependência das coisas particulares em relação ao fundamento da realidade e questionar a ideia de autonomia absoluta do indivíduo.

**Diferença:** Spinoza rejeita a concepção de um Deus pessoal que decide, recompensa ou recebe devoção como um soberano. A Gita, por sua vez, apresenta Krishna como Ser Supremo e atribui à devoção um papel central na realização espiritual.

| Pensador | Ponto de encontro | Diferença decisiva |
|---|---|---|
| Platão | Distinção entre experiência imediata e fundamento inteligível. | Formas inteligíveis não equivalem ao Krishna pessoal da Gita. |
| Plotino | Um princípio superior como origem da multiplicidade. | O Uno está além da pessoalidade; Krishna é apresentado em chave teísta e devocional. |
| Spinoza | Dependência dos seres finitos em relação ao fundamento da realidade. | Deus sive Natura não é um Senhor pessoal que exige devoção. |

### Uma interpretação integradora

O capítulo 15 propõe uma mudança de perspectiva: em vez de tomar as ramificações da vida como realidade última, investigar suas raízes. A árvore pode representar nossas estruturas de dependência: hábitos, desejos, papéis sociais, narrativas pessoais e expectativas. O desapego corta a identificação absoluta com essas estruturas e permite perguntar de onde vem o sentido que atribuímos a elas.

Essa leitura prática não substitui a dimensão religiosa do texto. A Gita vai além de uma técnica de autoconhecimento: afirma uma realidade suprema e um caminho de realização em relação a ela.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Desapegar sem abandonar o mundo

Uma leitura contemporânea do capítulo permite distinguir compromisso de apego. Posso cuidar de um projeto sem fazer dele minha identidade; liderar uma equipe sem exigir que todos confirmem meu valor; amar alguém sem tentar controlar cada escolha dessa pessoa.

### Quatro aplicações concretas

- **Trabalho:** diferenciar o propósito de um projeto do cargo, do prestígio ou do reconhecimento que podem acompanhá-lo. O projeto merece dedicação, mas não precisa se tornar a medida total do próprio valor.
- **Educação:** investir no desenvolvimento dos estudantes sem confundir aprendizagem com obediência, nem o resultado de uma avaliação com o valor de uma pessoa.
- **Liderança:** identificar as raízes de conflitos recorrentes. Às vezes, o problema visível é apenas um galho: a raiz pode estar em incentivos mal desenhados, falta de confiança, papéis confusos ou medo de perder controle.
- **Vida pessoal:** reconhecer desejos e hábitos que transportamos de uma situação para outra. Perceber um padrão não significa estar condenado a repeti-lo.

### Exercício: investigar as raízes

1. Escolha uma situação recorrente que esteja consumindo energia: conflito, ansiedade por reconhecimento, procrastinação ou necessidade de controle.
2. Descreva o que aparece na superfície, sem julgamento.
3. Pergunte cinco vezes “o que está sustentando isso?”. Procure a raiz, não apenas o sintoma.
4. Identifique o apego envolvido: resultado, imagem, segurança, aprovação, posse ou controle.
5. Defina uma ação responsável que preserve o compromisso, mas reduza a dependência psicológica daquele resultado.

> **Exemplo:** “Preciso que minha equipe entregue exatamente como imaginei.” A raiz talvez não seja apenas uma exigência de qualidade, mas o medo de perder controle ou de ser julgado. A resposta não é abandonar o padrão de qualidade: é explicitar critérios, delegar com responsabilidade e aceitar que bons caminhos podem ser diferentes do seu.

*Desapego não deve ser usado para justificar negligência, indiferença afetiva ou fuga de compromissos. Na Gita, a questão é transformar a relação com a ação e seus frutos, não deixar de agir.*
$md$),

(5, 'Reflexão pessoal interativa', $md$
## O que são raízes e o que são ramificações?

Responda a partir de experiências reais. O exercício não mede espiritualidade nem produz diagnóstico; ele organiza perguntas para aprofundar a leitura.

### Reflexão aberta

Qual “galho” da sua vida tem recebido muita energia? Que raiz pode estar sustentando esse vínculo? Como agir com responsabilidade e, ao mesmo tempo, com mais desapego?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## O que levar deste capítulo

1. **A existência condicionada é uma árvore:** suas ramificações são numerosas e dependem de raízes que nem sempre percebemos.
2. **O desapego corta a identificação:** não significa abandonar o mundo, mas deixar de tratar o transitório como fundamento absoluto.
3. **O ser individual está condicionado:** o texto descreve o jiva em relação à mente e aos sentidos, dentro de uma cosmologia de continuidade entre corpos.
4. **O divino sustenta a vida:** Krishna é apresentado como luz, sustentação, força vital e fundamento da memória e do conhecimento.
5. **Há uma distinção entre perecível e imperecível:** Purushottama é apresentado como o Ser Supremo que transcende ambos.
6. **Conhecer o fundamento transforma a perspectiva:** a sabedoria não se limita a acumular informações; ela reorganiza a relação com a existência.

### Versos para revisitar

| Versos | Tema | Pergunta para leitura |
|---|---|---|
| 15.1–2 | A árvore Ashvattha | Por que a árvore tem raízes acima e galhos abaixo? |
| 15.3–4 | O instrumento do desapego | O que precisa ser cortado: o mundo ou a identificação com ele? |
| 15.5–6 | O caminho ao estado supremo | Quais disposições precisam ser superadas? |
| 15.7–8 | Jiva, mente e sentidos | Como o texto descreve a continuidade da experiência individual? |
| 15.12–15 | Krishna como sustentação | O que significa dizer que o divino sustenta a vida e o conhecimento? |
| 15.16–18 | Kshara, Akshara e Purushottama | Como o capítulo diferencia o mutável, o imperecível e o Ser Supremo? |
| 15.19–20 | Conhecimento supremo | O que muda quando Purushottama é reconhecido como fundamento? |

> **Síntese interpretativa:** o capítulo 15 convida a olhar além das ramificações da existência e investigar suas raízes. O desapego não destrói o compromisso com a vida; ele procura libertá-lo da ilusão de que nossa identidade depende inteiramente do que muda, do que possuímos ou do que conseguimos controlar.

Próxima etapa: **Capítulo 16 — Daivasura Sampad Vibhaga Yoga**, a distinção entre as naturezas divina e demoníaca. O capítulo examinará qualidades construtivas e destrutivas no comportamento humano. “Divino” e “demoníaco” devem ser lidos como categorias éticas e espirituais do texto, não como rótulos fixos para identidades ou grupos de pessoas.

### Três questões para orientar a próxima leitura

1. Quais qualidades a Gita associa à natureza divina e quais associa à natureza demoníaca?
2. Como orgulho, desejo, raiva e arrogância podem deformar o julgamento e a ação?
3. Como cultivar qualidades construtivas sem transformar a ética em julgamento simplista dos outros?
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 15
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
  (1, 'Quando um projeto importante não sai como você esperava, o que mais pesa?'),
  (2, 'O que a imagem da árvore invertida mais provoca em sua reflexão?'),
  (3, 'Em sua vida, qual apego tende a ser mais difícil de soltar?'),
  (4, 'Qual afirmação expressa melhor o desapego apresentado na Gita?'),
  (5, 'O que você entende como uma busca pelo fundamento da própria vida?')
) as v(ordem, enunciado)
where c.numero = 15 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'A distância entre o resultado e o propósito que considero importante.'),
  (1, 'B', 'A perda de reconhecimento, controle ou status.'),
  (1, 'C', 'A vontade de desistir e não lidar mais com o assunto.'),
  (2, 'A', 'A necessidade de investigar os fundamentos por trás do que aparece.'),
  (2, 'B', 'A percepção de que estou muito envolvido com resultados e ramificações.'),
  (2, 'C', 'A dificuldade de encontrar sentido ou uma origem para minhas escolhas.'),
  (3, 'A', 'A necessidade de aprovação e reconhecimento.'),
  (3, 'B', 'A necessidade de controlar processos e resultados.'),
  (3, 'C', 'Hábitos conhecidos, mesmo quando já não ajudam.'),
  (4, 'A', 'Cumprir responsabilidades sem transformar o resultado em identidade absoluta.'),
  (4, 'B', 'Evitar compromissos para não sofrer com perdas.'),
  (4, 'C', 'Agir apenas quando houver garantia de sucesso.'),
  (5, 'A', 'Investigar valores, consciência e o sentido que orienta minhas ações.'),
  (5, 'B', 'Acumular conquistas que comprovem meu valor.'),
  (5, 'C', 'Repetir as escolhas que me dão segurança, sem questioná-las.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 15 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, chave, texto)
select e.id, v.chave, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  ('A', 'Suas respostas apontam para uma orientação frequente à investigação de fundamentos, valores e propósitos. O desafio é transformar essa clareza em prática, sem presumir que compreender uma ideia significa já tê-la incorporado.'),
  ('B', 'Suas respostas sugerem que reconhecimento, controle ou segurança podem ocupar bastante espaço. Investigue o que esses resultados representam para você e como preservar a responsabilidade sem depender deles para definir seu valor.'),
  ('C', 'Suas respostas sugerem que a familiaridade e a proteção contra desconfortos podem influenciar escolhas. Pergunte-se quais hábitos ainda servem à vida que deseja construir e quais apenas mantêm você preso ao conhecido.')
) as v(chave, texto)
where c.numero = 15 and e.ordem = 5
on conflict (etapa_id, chave) do update set texto = excluded.texto;
