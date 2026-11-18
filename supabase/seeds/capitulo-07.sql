-- Jornada da Virtude v2.0 — conteúdo do capítulo 7 (Jnana Vijnana Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz de compreensão (15 alternativas,
-- uma correta em cada pergunta) e as 3 leituras por número de acertos (modo "acertos").
-- Idempotente: upsert por numero, (capitulo_id, ordem), (etapa_id, ordem), (pergunta_id, chave) e
-- (etapa_id, minimo). Não insere registros de usuário.
-- O HTML tem 7 seções: "Mapa do capítulo" e "Conceitos fundamentais" formam a etapa 2.

insert into public.capitulos (numero, titulo)
values (7, 'Jnana Vijnana Yoga — Conhecimento e realização')
on conflict (numero) do update set titulo = excluded.titulo;

insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Contexto histórico e filosófico

O sétimo capítulo marca uma mudança importante no diálogo: Krishna passa a explicar sua natureza, a relação entre o divino e o mundo e os diferentes modos pelos quais os seres humanos se aproximam da realidade suprema.

### Onde estamos na narrativa

Arjuna está diante de uma crise que não é apenas militar. Sua dificuldade envolve identidade, dever, apego, medo e compreensão da existência. Nos capítulos anteriores, Krishna apresentou caminhos de ação disciplinada e discernimento. Agora, aprofunda o conhecimento de sua própria natureza e da estrutura da realidade.

O capítulo articula duas dimensões: *jnana*, conhecimento, e *vijnana*, conhecimento realizado ou compreensão experiencial. A distinção não deve ser reduzida a teoria versus emoção: trata-se de saber e reconhecer concretamente o que se sabe.

> **Chave de leitura:** o capítulo não propõe apenas acreditar numa afirmação sobre o divino. Ele convida a investigar como a consciência, a natureza, o desejo e a percepção condicionam nossa relação com o real.
$md$),

(2, 'Conceitos fundamentais', $md$
## Mapa do capítulo: versos por temas

### Versos 1–3 · Conhecimento e realização

Krishna promete ensinar como conhecê-lo plenamente, com a mente orientada e apoiada na prática. Afirma que poucos se empenham profundamente nesse conhecimento e que, entre os que se empenham, poucos o compreendem em sua plenitude.

### Versos 4–7 · Duas naturezas e a origem de tudo

A natureza material é descrita por oito componentes: terra, água, fogo, ar, espaço, mente, intelecto e sentido de individualidade. Krishna apresenta uma natureza superior, associada ao princípio consciente que sustenta a vida. Tudo está ligado a ele como contas em um fio.

### Versos 8–12 · O divino nas qualidades do mundo

Krishna se apresenta como o sabor da água, a luz do sol e da lua, o som no espaço, a força vital, a inteligência, a capacidade e a potência que não se separa do equilíbrio ético. O sagrado é reconhecido nas fontes e qualidades da existência.

### Versos 13–19 · Os gunas, maya e os que buscam

Os três *gunas* da natureza condicionam a percepção e mantêm os seres sob a influência de *maya*, a potência de aparência e obscurecimento. Quatro tipos de pessoas se voltam para o divino: quem sofre, quem busca compreender, quem deseja alcançar algo e quem já conhece. Krishna destaca o sábio cuja devoção é estável.

### Versos 20–23 · Desejos e resultados limitados

Quem busca resultados específicos pode dirigir sua devoção a diferentes divindades, conforme sua inclinação. O texto reconhece a eficácia relativa desses caminhos, mas considera temporários os frutos obtidos quando comparados à realização do absoluto.

### Versos 24–30 · O divino não se reduz ao que aparece

Krishna critica a compreensão que toma o não manifestado como se fosse apenas uma forma humana. A ignorância e os pares de opostos obscurecem a percepção. Os que se libertam dessas limitações podem reconhecer o divino e orientar a consciência para ele, inclusive diante da morte.

## Conceitos fundamentais

- **Jnana:** conhecimento: compreensão da natureza da realidade, de suas causas e de seus princípios.
- **Vijnana:** conhecimento realizado: discernimento que deixa de ser apenas formulação intelectual e passa a orientar a experiência.
- **Prakriti:** natureza ou matriz material. No capítulo, inclui tanto elementos físicos quanto mente, intelecto e senso de individualidade.
- **Para prakriti:** a natureza superior, associada ao princípio consciente que sustenta os seres vivos. Não é simplesmente mais um elemento material.
- **Gunas:** as três qualidades que modulam a natureza: *sattva* (clareza e equilíbrio), *rajas* (atividade e desejo) e *tamas* (inércia e obscurecimento).
- **Maya:** potência que condiciona a percepção e faz com que a realidade seja apreendida de modo parcial, confundido ou limitado.

### A natureza em oito componentes

| Componente | Sentido no contexto | Leitura contemporânea possível |
|---|---|---|
| Terra | Solidez e estrutura | Materialidade, corpo e suporte físico |
| Água | Fluidez e coesão | Processos vitais e adaptação |
| Fogo | Calor e transformação | Energia e metabolismo |
| Ar | Movimento | Respiração e dinâmica |
| Espaço | Campo de manifestação | Extensão e possibilidade de relação |
| Mente | Coordenação de impressões e desejos | Processamento de experiências |
| Intelecto | Discernimento e decisão | Julgamento e raciocínio |
| Sentido de individualidade | Identificação do eu separado | Construção da identidade pessoal |

*A tabela oferece aproximações didáticas, não equivalências científicas. Os elementos pertencem a uma cosmologia filosófica antiga e não devem ser confundidos com a tabela periódica ou com categorias da neurociência.*

> **Uma distinção decisiva:** a Gita não trata a mente como algo automaticamente idêntico à consciência. A mente aparece entre os componentes da natureza; o princípio consciente é apresentado como dimensão distinta e superior.

### Os quatro tipos de devotos (7.16–18)

- **Arta:** aquele que se aproxima em meio ao sofrimento e busca alívio.
- **Jijnasu:** aquele que busca conhecer e compreender.
- **Artharthi:** aquele que busca prosperidade, realização ou um resultado desejado.
- **Jnani:** aquele que reconhece o divino com conhecimento e devoção estável.

O texto não precisa ser lido como uma escala moral rígida. Os motivos humanos podem coexistir e mudar ao longo da vida. Krishna, porém, atribui especial profundidade à relação do sábio, que não depende apenas de obter algo.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com a filosofia ocidental

### Spinoza · Deus ou Natureza

**Convergência:** tanto a Gita quanto Spinoza procuram compreender a realidade como uma totalidade interligada, e não como um conjunto de coisas absolutamente independentes. A ideia de que tudo se sustenta numa realidade fundamental permite um diálogo fértil com a noção spinozista de Deus ou Natureza.

**Diferença:** Spinoza formula uma metafísica na qual Deus não é uma pessoa que decide conceder favores. A Gita apresenta Krishna como realidade suprema que também se relaciona com os seres por meio de devoção, graça e entrega. Não são concepções idênticas.

### Aristóteles · Potência, ato e causas

**Convergência:** a investigação sobre os princípios que sustentam a realidade pode ser comparada à busca aristotélica pelas causas e pelos fundamentos do movimento e da existência. A distinção entre conhecimento abstrato e compreensão efetiva também abre diálogo com a ideia de sabedoria prática.

**Diferença:** Aristóteles não apresenta a mesma distinção entre natureza material e princípio consciente nem a mesma doutrina de devoção a uma divindade pessoal. Seu primeiro motor imóvel não corresponde diretamente a Krishna.

### William James · Experiência religiosa

**Convergência:** James investigou a experiência religiosa a partir de seus efeitos na vida, na conduta e na transformação pessoal. Isso conversa com a diferença entre conhecer uma doutrina e realizar seu sentido na própria existência.

**Diferença:** James adota uma abordagem psicológica e pragmática para estudar experiências religiosas. A Gita apresenta afirmações metafísicas e soteriológicas sobre a realidade última e a libertação. Uma análise da experiência não confirma, por si só, essas afirmações.

> **Critério de comparação:** aproximar ideias é útil quando ilumina uma pergunta comum; torna-se erro quando apaga diferenças de época, método, linguagem e pressupostos.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações contemporâneas

- **Vida pessoal · Investigar o que dirige suas escolhas:** observe quando uma decisão nasce de clareza, de desejo impulsivo ou de medo e inércia. Antes de agir, pergunte: estou vendo a situação inteira ou apenas a parte que confirma meu interesse?
- **Educação · Ir além da informação:** aprender não é repetir conceitos. É conseguir aplicá-los, reconhecer limites e revisar interpretações diante de novas evidências. O professor favorece a passagem do conteúdo para a compreensão.
- **Liderança · Perceber os condicionamentos:** uma equipe pode confundir urgência com importância, movimento com progresso e estabilidade com acomodação. Nomear esses padrões ajuda a decidir com mais consciência.
- **Trabalho · Questionar a motivação:** resultados importam, mas não são o único critério. Examine se a busca por reconhecimento, dinheiro ou controle está comprometendo valores, relações e qualidade das decisões.

### Exercício de observação: os três modos de reação

| Modo | Sinais possíveis | Pergunta de revisão |
|---|---|---|
| **Sattva** | Clareza, equilíbrio, atenção, serenidade | O que estou percebendo com lucidez? |
| **Rajas** | Pressa, agitação, comparação, desejo de resultado | Estou agindo por propósito ou por inquietação? |
| **Tamas** | Negação, confusão, adiamento, apatia | O que estou evitando enxergar ou enfrentar? |

*Os gunas são categorias tradicionais de interpretação da natureza e da experiência. Use-as como lentes de reflexão, não como rótulos fixos para classificar pessoas.*
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Questionário de reflexão

Responda às cinco questões. A devolutiva identifica tendências nas respostas e oferece perguntas para aprofundamento. Não é teste psicológico nem avaliação espiritual.

### Reflexão aberta

Em qual área da sua vida você já acumulou bastante informação, mas ainda precisa transformar esse conhecimento em uma prática mais consciente?

*Escreva sua resposta em um caderno ou diário. Procure registrar uma ação concreta que possa experimentar nos próximos sete dias.*
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese do capítulo

O capítulo 7 ensina que a realidade não se esgota naquilo que os sentidos captam nem nas explicações que a mente constrói. A natureza tem dimensões materiais e mentais, mas o texto aponta para um princípio consciente que a sustenta.

Conhecer, nesse contexto, é perceber a relação entre as partes e o todo. Realizar esse conhecimento é deixar que ele transforme a maneira de desejar, agir e compreender. A devoção amadurece quando deixa de ser apenas busca por resultados e se torna reconhecimento estável da realidade suprema.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 7.3 | a profundidade do conhecimento exige empenho e transformação. |
| 7.7 | a imagem das contas enfiadas em um fio expressa a unidade que sustenta a multiplicidade. |
| 7.8–12 | o divino é reconhecido nas qualidades essenciais da existência. |
| 7.16–19 | diferentes motivações podem iniciar a busca; a compreensão madura aprofunda a relação. |
| 7.27–30 | superar a confusão dos opostos permite orientar a consciência para o que é fundamental. |

> **Conexão com o capítulo 8:** depois de investigar a natureza do divino, o capítulo seguinte aprofunda o Absoluto Imperecível, a lembrança constante e a orientação da consciência diante da morte. A pergunta se desloca de “o que sustenta a realidade?” para “como orientar a consciência para essa realidade?”.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 7
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

update public.etapas e
set quiz_modo = 'acertos', quiz_chave_alvo = null
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 7 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado, chave_correta)
select e.id, v.ordem, v.enunciado, v.chave_correta
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Qual é a distinção central entre jnana e vijnana neste capítulo?', 'A'),
  (2, 'Como o capítulo apresenta a natureza material inferior?', 'B'),
  (3, 'O que os três gunas ajudam a compreender?', 'C'),
  (4, 'Qual é a diferença destacada entre buscar o divino por um resultado e a devoção do sábio?', 'B'),
  (5, 'Qual aplicação prática melhor traduz o convite do capítulo?', 'A')
) as v(ordem, enunciado, chave_correta)
where c.numero = 7 and e.ordem = 5
on conflict (etapa_id, ordem) do update
  set enunciado = excluded.enunciado, chave_correta = excluded.chave_correta;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Conhecimento teórico e conhecimento realizado na experiência.'),
  (1, 'B', 'Conhecimento científico e conhecimento tecnológico.'),
  (1, 'C', 'Memória do passado e previsão do futuro.'),
  (2, 'A', 'Apenas como os cinco elementos físicos.'),
  (2, 'B', 'Como oito componentes, incluindo mente, intelecto e sentido de individualidade.'),
  (2, 'C', 'Como algo sem relação com a experiência humana.'),
  (3, 'A', 'Três castas ou grupos sociais imutáveis.'),
  (3, 'B', 'Três etapas cronológicas da vida.'),
  (3, 'C', 'Qualidades que condicionam a natureza e a percepção.'),
  (4, 'A', 'O sábio não precisa agir nem se relacionar com o mundo.'),
  (4, 'B', 'A devoção do sábio é mais estável e não depende apenas de obter benefícios.'),
  (4, 'C', 'Quem busca resultados é necessariamente incapaz de aprender.'),
  (5, 'A', 'Examinar os condicionamentos e transformar conhecimento em discernimento vivido.'),
  (5, 'B', 'Abandonar todo desejo sem investigar sua origem.'),
  (5, 'C', 'Aceitar qualquer crença sem reflexão.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 7 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (5, 'Você identificou com precisão os eixos centrais do capítulo. O próximo desafio é perceber onde esse entendimento aparece nas suas escolhas reais.'),
  (3, 'Você captou boa parte da estrutura do capítulo. Retome especialmente a distinção entre natureza material e princípio consciente, e a função dos gunas.'),
  (0, 'Vale reler o mapa dos versos e os conceitos fundamentais. O capítulo combina cosmologia, psicologia filosófica e devoção; não é uma lista de crenças isoladas.')
) as v(minimo, texto)
where c.numero = 7 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
