-- Jornada da Virtude v2.0 — conteúdo do capítulo 13 (Kshetra Kshetrajna Vibhaga Yoga)
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
values (13, 'Kshetra Kshetrajna Vibhaga Yoga — O Campo e o Conhecedor do Campo')
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

O capítulo propõe distinguir **o campo da experiência** daquilo que **conhece o campo**. Corpo, sentidos, pensamentos, emoções e disposições mentais pertencem ao campo. O conhecedor é a consciência que os percebe.

Essa distinção não convida a desprezar o corpo ou a negar a vida concreta. Ela oferece uma ferramenta de discernimento: não somos obrigados a confundir tudo o que acontece em nós com aquilo que somos em nossa dimensão mais profunda.

> **Pergunta-guia:** se consigo observar meu corpo, meus pensamentos e minhas emoções, o que exatamente está observando?

## Contexto histórico e filosófico

A Bhagavad Gita integra o *Mahabharata*, grande épico da tradição indiana. No diálogo entre Krishna e Arjuna, a crise inicial do guerreiro se transforma em investigação sobre ação, conhecimento, dever, devoção e libertação.

O capítulo 13 desloca o foco para uma questão metafísica e experiencial: qual é a diferença entre aquilo que é conhecido e aquilo que conhece? O texto utiliza a imagem do **campo** (*kshetra*) e do **conhecedor do campo** (*kshetrajna*).

O vocabulário dialoga com tradições filosóficas indianas, especialmente com debates sobre *prakriti* (natureza), *purusha* (princípio consciente), conhecimento e libertação. As escolas Vedanta não interpretam todos esses termos da mesma maneira. O capítulo oferece uma base importante para leituras posteriores, mas não elimina as diferenças entre elas.

> **Distinção importante:** a linguagem do capítulo é filosófica e espiritual, não uma descrição científica do cérebro ou uma teoria psicológica contemporânea. As aproximações com ciência e psicologia devem ser tratadas como analogias, não como identidade conceitual.
$md$),

(2, 'Conceitos fundamentais', $md$
## Conceitos fundamentais e percurso dos versos

### 2.1 Kshetra: o campo da experiência (13.1–6)

Krishna chama de campo o corpo, entendido em sentido amplo: não apenas a estrutura física, mas também sentidos, mente, desejos, aversões, prazer, dor, organização psicofísica e suas transformações. É o território no qual a experiência acontece.

O campo é mutável. O corpo envelhece, sensações surgem e desaparecem, pensamentos mudam, emoções se alteram e circunstâncias se transformam. Reconhecer essa impermanência ajuda a não tratar estados passageiros como definições absolutas da identidade.

### 2.2 Kshetrajna: o conhecedor do campo (13.2–3)

O conhecedor é aquele que conhece ou testemunha o campo. Krishna afirma também conhecer todos os campos. Essa passagem abre uma questão teológica e metafísica: a consciência individual e a consciência divina estão relacionadas, mas a natureza dessa relação recebe interpretações distintas nas escolas indianas.

> *“Conhece-me como o conhecedor do campo em todos os campos.”* — Paráfrase de 13.2

O ponto prático é investigar a diferença entre a experiência observada e a capacidade de reconhecê-la. “Estou sentindo raiva” descreve uma experiência; “sou a raiva” transforma um estado transitório em identidade.

### 2.3 O que é conhecimento? (13.7–11)

O texto apresenta uma lista de qualidades que constituem conhecimento: humildade, ausência de ostentação, não violência, tolerância, retidão, serviço ao mestre, pureza, firmeza, autocontrole, desapego, reconhecimento dos limites da existência condicionada e busca da verdade.

Não se trata apenas de acumular informações. Conhecer exige transformação do modo de perceber e agir. A humildade, por exemplo, não é submissão intelectual: é reconhecer que nossa perspectiva é parcial e pode ser corrigida.

- **Humildade:** não confundir convicção com infalibilidade.
- **Não violência:** reduzir dano na intenção, na palavra e na ação.
- **Autodomínio:** não obedecer automaticamente a cada impulso.
- **Desapego:** participar da vida sem transformar posse e resultado em identidade.

### 2.4 O Conhecível: o princípio supremo (13.12–18)

Krishna descreve aquilo que deve ser conhecido como princípio supremo, associado ao fundamento da realidade. A linguagem é paradoxal: está em toda parte e além das limitações dos sentidos; parece dividido nos seres, mas é descrito como indiviso; sustenta, ilumina e transcende a natureza.

O capítulo utiliza imagens que não devem ser reduzidas a uma definição simples. O texto aponta para uma realidade que não é apreendida como mais um objeto entre objetos.

### 2.5 Prakriti e Purusha (13.19–23)

**Prakriti** é a natureza, o princípio da manifestação e das mudanças. **Purusha** é o princípio consciente, associado à experiência e ao testemunho. O capítulo relaciona a natureza aos processos de causa, efeito e ação, e a consciência à experiência de prazer e dor.

O apego aos modos da natureza é apresentado como fator que mantém o ser condicionado. O reconhecimento do princípio consciente abre a possibilidade de liberdade. Em algumas leituras, Purusha e prakriti são princípios distintos; em outras tradições, a relação entre consciência individual e realidade suprema é compreendida de modo diferente.

### 2.6 Ver com discernimento (13.24–30)

O texto apresenta diferentes caminhos de realização: meditação, conhecimento, ação disciplinada e escuta orientada. Nem todos começam do mesmo ponto, mas o discernimento é decisivo: perceber que as ações se desenrolam no campo da natureza e que a consciência não deve ser confundida com cada movimento observado.

Ver a mesma realidade fundamental em todos os seres enfraquece a arrogância e a indiferença. Se a presença do princípio divino é reconhecida em todos, a dignidade do outro não pode ser tratada como detalhe descartável.

### 2.7 A consciência não age como o campo (13.31–35)

O capítulo conclui que o conhecedor, em sua natureza mais profunda, não é reduzido às mudanças do campo. A metáfora do espaço ajuda: o espaço está presente e permite que as coisas apareçam, mas não se confunde com cada objeto que nele surge.

> *“Aquele que vê a diferença entre o campo e o conhecedor do campo [...] alcança o Supremo.”* — Paráfrase de 13.34

> **Leitura cuidadosa:** isso não significa que “nada importa” ou que alguém possa fugir das consequências de suas ações. A distinção é metafísica e espiritual; não serve como desculpa para negligência, passividade ou irresponsabilidade.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com três pensadores ocidentais

As comparações abaixo são aproximações interpretativas. Não significam que os autores tenham defendido a mesma teoria ou que exista influência histórica direta.

### Platão: aparência, conhecimento e realidade

Em Platão, especialmente na alegoria da caverna, há uma diferença entre tomar as aparências como realidade última e orientar a inteligência para um conhecimento mais profundo. A Gita também convida a ultrapassar a identificação imediata com o que muda.

**Convergência:** a experiência imediata não esgota a realidade; é necessário educar o olhar.

**Diferença:** Platão organiza sua reflexão em torno das Formas inteligíveis e da ascensão da alma ao conhecimento. A Gita trabalha com categorias próprias, como campo, conhecedor, prakriti, purusha e relação com o Supremo. Não são mapas metafísicos intercambiáveis.

### Descartes: o sujeito que pensa

Descartes procura uma certeza que resista à dúvida e encontra no ato de pensar uma evidência fundamental: enquanto duvido, penso; enquanto penso, existo. Isso oferece um ponto de contato com a investigação sobre quem conhece a experiência.

**Convergência:** a consciência não deve ser confundida sem exame com os objetos percebidos.

**Diferença:** o sujeito cartesiano é formulado a partir do pensamento e de uma distinção entre mente e corpo. O conhecedor da Gita não se limita ao pensamento discursivo; pensamentos e operações mentais também podem ser incluídos no campo observado.

### Spinoza: superar a compreensão parcial

Spinoza critica a tendência de imaginar que somos uma realidade isolada, independente da ordem da natureza. A liberdade cresce quando compreendemos as causas que nos atravessam, em vez de sermos conduzidos cegamente por afetos e ideias inadequadas.

**Convergência:** compreender a experiência e reduzir a servidão a impulsos favorece uma vida mais livre.

**Diferença:** Spinoza sustenta uma única substância, Deus ou Natureza, da qual tudo é expressão. A linguagem da Gita sobre prakriti, purusha e o Supremo não deve ser traduzida diretamente para o sistema spinozano.

### O que esse diálogo permite concluir?

Os três autores ajudam a formular uma pergunta comum: como deixar de viver prisioneiro da primeira aparência? Platão enfatiza a educação do conhecimento; Descartes, a investigação da certeza do sujeito; Spinoza, a compreensão das causas. A Gita acrescenta uma dimensão contemplativa e espiritual: discernir o campo e o conhecedor para transformar a relação com a experiência.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações práticas contemporâneas

### Na vida pessoal: observar sem se confundir

Em vez de “sou um fracasso”, experimente formular: “estou vivendo uma experiência de frustração diante de um resultado”. A segunda formulação não apaga o problema; cria espaço para compreendê-lo e agir.

### Na educação: ensinar a pensar sobre o próprio pensamento

O professor pode ajudar o estudante a distinguir fato, interpretação e reação emocional. Um erro em uma avaliação é um acontecimento do campo da experiência, não uma sentença definitiva sobre a capacidade ou o valor de alguém.

### Na liderança: separar identidade, papel e desempenho

Um gestor que recebe uma crítica pode observar o desconforto sem reagir defensivamente. A crítica pode conter dados úteis, ruído ou injustiça. O trabalho é examinar evidências, compreender causas e decidir com responsabilidade, sem transformar o cargo em extensão do ego.

### Na tomada de decisão: reconhecer condicionantes

Decisões são influenciadas por corpo, contexto, repertório, incentivos, emoções e informação disponível. Reconhecer essas forças não elimina a responsabilidade; melhora a qualidade da decisão porque torna visíveis fatores que antes operavam no automático.

> **Prática de 90 segundos:** pare, respire e nomeie mentalmente: “sensação”, “pensamento”, “emoção”, “impulso”. Depois pergunte: “qual é o fato observável e qual é a interpretação que estou acrescentando?”. Escolha a próxima ação com base no que importa, não apenas no impulso mais alto.

### Um cuidado essencial

O testemunho consciente não deve virar distanciamento frio, repressão emocional ou negação do corpo. Observar uma emoção é diferente de fingir que ela não existe. O discernimento saudável inclui reconhecer necessidades, limites e consequências concretas.
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Exercício de reflexão pessoal

Responda às cinco questões. O objetivo não é medir sua espiritualidade nem produzir um diagnóstico. É tornar visíveis seus hábitos de percepção e reação.

### Reflexão aberta

Descreva uma situação recente em que você confundiu uma emoção, um pensamento ou um resultado com uma definição sobre si mesmo. Como poderia observar essa experiência com mais discernimento, sem negar o que sentiu e sem fugir da responsabilidade?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese e integração

### O que levar deste capítulo

- **Campo:** corpo, sentidos, mente, emoções, desejos e processos da experiência.
- **Conhecedor:** princípio consciente que conhece o campo, conforme a linguagem metafísica da Gita.
- **Conhecimento:** não é apenas informação; envolve humildade, autocontrole, não violência e busca da verdade.
- **Prakriti:** natureza e dinâmica dos processos condicionados.
- **Purusha:** princípio consciente, cuja relação com a natureza é central para o discernimento.
- **Liberdade:** nasce do reconhecimento que impede a identificação cega com aquilo que muda.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 13.2 | A distinção entre o campo e o conhecedor do campo. |
| 13.7–11 | As qualidades que constituem o conhecimento. |
| 13.19–23 | A relação entre prakriti, purusha e experiência. |
| 13.27–28 | A visão da mesma realidade em todos os seres. |
| 13.34–35 | O discernimento entre campo e conhecedor. |

### Conexão com a jornada

O capítulo 12 apresentou a devoção como caminho. O capítulo 13 aprofunda a investigação sobre quem vive a experiência e qual é a natureza da realidade. O próximo capítulo, **Gunatraya Vibhaga Yoga**, examina os três modos da natureza (*gunas*) e como eles condicionam pensamento, ação e comportamento.

> **Frase de integração:** posso reconhecer o que acontece em mim sem transformar cada acontecimento em definição de quem sou. Observar com clareza não é fugir da vida; é criar condições para participar dela com mais liberdade e responsabilidade.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 13
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

-- ---------------------------------------------------------------------------
-- Quiz da etapa 5 (modo "faixas": conta as escolhas da alternativa C)
-- ---------------------------------------------------------------------------
update public.etapas e
set quiz_modo = 'faixas', quiz_chave_alvo = 'C'
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 13 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado)
select e.id, v.ordem, v.enunciado
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Quando uma emoção intensa aparece, qual costuma ser sua primeira reação?'),
  (2, 'Ao cometer um erro, o que tende a acontecer?'),
  (3, 'Como você lida com pensamentos recorrentes?'),
  (4, 'Na relação com outras pessoas, qual atitude mais se aproxima da sua prática?'),
  (5, 'O que significa, na prática, distinguir o campo do conhecedor?')
) as v(ordem, enunciado)
where c.numero = 13 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Identifico-me completamente com ela e ajo no impulso.'),
  (1, 'B', 'Tento reprimi-la ou fingir que não está acontecendo.'),
  (1, 'C', 'Procuro reconhecê-la, entender sua origem e escolher como agir.'),
  (2, 'A', 'Transformo o erro em definição sobre quem sou.'),
  (2, 'B', 'Procuro culpados para afastar o desconforto.'),
  (2, 'C', 'Distingo o fato, suas causas e o que posso aprender ou reparar.'),
  (3, 'A', 'Presumo que, se pensei, deve ser verdade.'),
  (3, 'B', 'Tento expulsá-los sem investigar.'),
  (3, 'C', 'Observo o pensamento e verifico se ele corresponde aos fatos.'),
  (4, 'A', 'Avalio rapidamente e reduzo a pessoa ao comportamento que vi.'),
  (4, 'B', 'Evito julgamentos, mas também evito conversas difíceis.'),
  (4, 'C', 'Reconheço a dignidade da pessoa e avalio suas ações com clareza.'),
  (5, 'A', 'Afastar-me dos problemas e deixar que aconteçam.'),
  (5, 'B', 'Considerar o corpo e as emoções irrelevantes.'),
  (5, 'C', 'Reconhecer experiências e condicionantes sem reduzir minha identidade a eles.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 13 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (4, 'Suas respostas indicam uma tendência a criar espaço entre experiência e reação. O desafio é sustentar essa observação também sob pressão, sem transformá-la em distanciamento ou excesso de autocontrole.'),
  (2, 'Há sinais de discernimento em algumas situações, mas ele parece variar conforme o contexto. Observe em quais momentos o impulso, a autocrítica ou a evitação assumem o comando.'),
  (0, 'Suas respostas sugerem uma oportunidade de praticar a observação antes da reação. Comece por uma situação cotidiana e pequena: nomeie o que sente, identifique os fatos e escolha uma ação possível.')
) as v(minimo, texto)
where c.numero = 13 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
