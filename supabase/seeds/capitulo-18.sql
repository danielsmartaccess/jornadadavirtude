-- Jornada da Virtude v2.0 — conteúdo do capítulo 18 (Moksha Sannyasa Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz da etapa 5
-- (com 15 alternativas) e as 3 leituras do resultado. Idempotente: o upsert é por
-- numero em capitulos, por (capitulo_id, ordem) em etapas, por (etapa_id, ordem) em
-- perguntas, por (pergunta_id, chave) em opcoes e por (etapa_id, chave) em leituras.
-- Rodar de novo atualiza o texto e não duplica nada. Não insere registros de usuário.
-- Pré-requisito: migrações aplicadas (inclui 20261118180000_gita_conteudo_e_quiz.sql).
--
-- O Markdown usa GFM (tabelas) e não contém HTML, CSS nem JavaScript.
-- Observação: no HTML de origem a seção 6 se chama "Síntese e encerramento da jornada";
-- aqui usa o nome padrão das etapas (o texto da seção é o do HTML).

insert into public.capitulos (numero, titulo)
values (18, 'Moksha Sannyasa Yoga — O Yoga da Libertação pela Renúncia')
on conflict (numero) do update set titulo = excluded.titulo;

-- ---------------------------------------------------------------------------
-- Etapas: nome e texto
-- ---------------------------------------------------------------------------
insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## O encerramento da jornada de Arjuna

O capítulo 18 é a grande síntese da Bhagavad Gita. Depois de percorrer conhecimento, ação, meditação, devoção, natureza, virtude e fé, Krishna retorna à questão que abriu o diálogo: como Arjuna deve agir diante de um dever difícil?

O título **Moksha Sannyasa Yoga** reúne três ideias: *moksha*, libertação; *sannyasa*, renúncia; e *yoga*, caminho ou disciplina de integração. O capítulo investiga a relação entre renunciar, agir e alcançar a libertação.

A conversa começa com uma pergunta de Arjuna sobre a diferença entre *sannyasa* e *tyaga*. Krishna responde que renunciar não significa necessariamente abandonar toda ação. A distinção decisiva está entre deixar de realizar ações motivadas por desejo egoísta e agir sem apego aos frutos, oferecendo a ação a um princípio maior.

### Uma recapitulação dos capítulos anteriores

O capítulo 18 retoma os temas centrais da obra: os gunas (capítulos 14 e 17), a natureza do ser e do mundo (13 e 15), as disposições éticas (16), a fé e as práticas (17), o conhecimento e a ação (2 a 5), a meditação (6) e a devoção (7 a 12). Não é apenas um apêndice: é uma arquitetura de síntese que prepara a decisão final de Arjuna.

> **Pergunta central:** é possível agir plenamente no mundo sem ser escravizado pelo desejo de controlar os resultados? A resposta da Gita combina discernimento, dever, renúncia ao apego e entrega ao divino.

*O capítulo contém elementos metafísicos, devocionais e sociais próprios de sua tradição. A análise filosófica pode dialogar com outras tradições, mas não deve apagar diferenças nem tratar suas afirmações religiosas como fatos empíricos demonstrados.*
$md$),

(2, 'Conceitos fundamentais', $md$
## Os movimentos do capítulo final

### 1. Sannyasa e Tyaga: renúncia e abandono do apego (18.1–12)

Arjuna pergunta a diferença entre *sannyasa* e *tyaga*. Krishna associa sannyasa à renúncia de ações motivadas pelo desejo e tyaga ao abandono dos frutos da ação. Há interpretações variadas desses termos nas escolas indianas, mas o argumento do capítulo torna-se claro nos versos seguintes: ações de sacrifício, doação e austeridade não devem ser simplesmente abandonadas; devem ser realizadas sem apego e sem expectativa egoísta.

Krishna distingue três formas de renúncia. A renúncia sáttvica é feita por compreensão e dever, sem apego ao resultado. A rajásica ocorre por medo do desconforto ou por aversão ao esforço. A tamásica nasce de confusão e abandono de deveres que deveriam ser cumpridos.

> **Distinção essencial:** renunciar ao fruto não é renunciar à responsabilidade. A Gita não recomenda fugir de toda ação difícil. Ela questiona a motivação, o apego e a identificação que transformam a ação em prisão.

### 2. A ação tem múltiplas causas (18.13–18)

Krishna apresenta cinco fatores envolvidos na realização de uma ação: o corpo ou campo de ação; o agente; os instrumentos; os diferentes esforços; e o elemento divino ou fator que ultrapassa o controle individual. O verso 18.14 enumera esses fatores. A ideia limita a fantasia de que o indivíduo é causa única e soberana de tudo o que acontece.

Os versos 18.16–17 criticam a visão estreita de quem se considera o único autor da ação. Isso não elimina responsabilidade. Significa reconhecer que resultados dependem de condições, instrumentos, cooperação, circunstâncias e fatores que não controlamos integralmente.

### 3. Conhecimento, ação e agente segundo os gunas (18.19–28)

O capítulo classifica conhecimento, ação e agente em três modalidades:

- **Sattva**
  - **Conhecimento:** percebe uma realidade integrada e reconhece unidade na diversidade.
  - **Ação:** é realizada sem apego, sem desejo compulsivo e sem aversão, com equilíbrio.
  - **Agente:** age com firmeza e entusiasmo, sem arrogância ou apego ao resultado.
- **Rajas**
  - **Conhecimento:** enfatiza separações e diferenças como se fossem realidades isoladas.
  - **Ação:** é motivada por desejo, ego e esforço excessivo em busca de recompensa.
  - **Agente:** é apegado aos frutos, ambicioso, ansioso e sujeito a oscilações.
- **Tamas**
  - **Conhecimento:** é estreito, pouco fundamentado e preso a uma parte como se fosse o todo.
  - **Ação:** é iniciada sem avaliar consequências, capacidade ou dano envolvido.
  - **Agente:** age com negligência, teimosia, confusão e falta de cuidado.

Essa classificação é uma ferramenta de análise da qualidade da percepção e da ação. Não é uma divisão permanente entre tipos de pessoas.

### 4. Intelecto, firmeza e felicidade (18.29–40)

Krishna distingue o intelecto (*buddhi*) e a firmeza ou determinação (*dhriti*) conforme os gunas. O intelecto sáttvico distingue ação e renúncia, dever e não dever, medo e destemor, vínculo e libertação. O rajásico compreende essas distinções de modo incompleto ou interessado; o tamásico as inverte, confundindo o errado com o correto.

A firmeza sáttvica sustenta a mente, a respiração e os sentidos com disciplina. A rajásica busca sustentar objetivos ligados a prazer, poder e recompensa. A tamásica permanece presa ao sono, ao medo, à tristeza, à depressão da energia e à negligência, conforme a linguagem tradicional do texto.

As três felicidades também são diferenciadas. A sáttvica pode começar como esforço difícil, mas amadurece em clareza e bem-estar. A rajásica parece prazerosa no início, mas pode produzir sofrimento. A tamásica nasce e permanece ligada à negligência, à confusão e à inércia.

### 5. Dever, natureza e trabalho (18.41–48)

O capítulo relaciona deveres e atividades às qualidades da natureza e às disposições individuais. Nos versos 18.41–44, apresenta funções sociais tradicionais associadas às categorias de *varna*: brâmanes, kshatriyas, vaishyas e shudras. As qualidades descritas incluem serenidade, coragem, capacidade de organização, produção, comércio e serviço.

Esses versos precisam ser lidos com atenção ao contexto histórico e social da Índia antiga. A passagem não deve ser usada para justificar discriminação, hierarquias de dignidade humana ou restrições modernas de oportunidade por nascimento. A discussão filosófica pode concentrar-se na relação entre aptidões, responsabilidades e contribuição social, sem naturalizar sistemas de desigualdade.

Nos versos 18.45–48, Krishna afirma que a pessoa pode alcançar perfeição ao realizar o próprio trabalho, oferecendo-o àquele de quem procede a existência. O verso 18.47 recomenda realizar o próprio dever, ainda que imperfeitamente, em vez de executar perfeitamente o dever alheio. O sentido não é defender incompetência ou impedir mudança de trajetória, mas questionar a imitação e a fuga de responsabilidades por comparação.

### 6. Renúncia, conhecimento e devoção (18.49–55)

Krishna descreve a pessoa que alcança liberdade interior por desapego, autocontrole e serenidade. A partir daí, apresenta uma sequência em que o conhecimento de Brahman, a equanimidade e a devoção conduzem à compreensão de Krishna. O verso 18.55 afirma que, por meio da devoção, é possível conhecer Krishna em sua realidade e entrar em relação com ele.

### 7. Entrega e ação (18.56–66)

Nos versos 18.56–60, Krishna recomenda agir sob sua orientação, com a mente voltada para ele. Mesmo que Arjuna pense em não lutar, sua própria natureza e disposição o conduzirão à ação que lhe cabe. A mensagem não é que o indivíduo não tenha escolha, mas que não pode simplesmente apagar sua constituição, seus compromissos e as consequências de sua decisão.

O verso 18.61 apresenta o divino como presença no coração de todos os seres, enquanto o verso 18.62 recomenda buscar refúgio nele. O verso 18.63 preserva a importância do discernimento: Krishna expõe o ensinamento e convida Arjuna a refletir plenamente antes de agir.

O verso 18.66 é um dos mais conhecidos da Gita: Krishna convida Arjuna a abandonar todas as formas de apoio ou obrigação entendidas como caminhos autossuficientes e a tomar refúgio nele, prometendo libertação. A interpretação desse verso varia entre escolas: algumas enfatizam a entrega total à graça divina; outras o leem como síntese da superação do apego às práticas e aos frutos. Em qualquer caso, ele não deve ser usado para justificar irresponsabilidade ou violação ética.

### 8. O ensinamento é transmitido e Arjuna responde (18.67–73)

Krishna fala sobre a transmissão cuidadosa desse ensinamento (18.67–71), declara sua relação com Arjuna e conclui perguntando se a confusão foi dissipada (18.72). Arjuna responde no verso 18.73 que sua ilusão foi destruída, que recuperou a memória e que agirá conforme a orientação recebida.

### 9. A conclusão de Sanjaya (18.74–78)

Sanjaya encerra a narrativa relatando sua admiração pelo diálogo e afirmando que, onde Krishna e Arjuna estão juntos, ali estão prosperidade, vitória, bem-estar e firmeza. O fechamento retorna ao campo de batalha: a sabedoria não termina em contemplação abstrata. Ela precisa encontrar expressão na ação.
$md$),

(3, 'Interpretação filosófica', $md$
## Três diálogos com a filosofia ocidental

### Aristóteles: prudência, virtude e realização

Aristóteles entende a vida ética como formação do caráter por hábitos e escolhas deliberadas. A prudência, ou *phronesis*, permite avaliar o que convém fazer em situações concretas. Isso dialoga com a insistência da Gita em discernir dever, ação, motivação e consequência, em vez de agir apenas por impulso.

**Diferença:** Aristóteles orienta a ética para a eudaimonia, o florescimento humano, enquanto a Gita integra a ação virtuosa a um caminho de libertação espiritual e devoção ao divino.

### Kant: dever e autonomia moral

Kant distingue agir por dever de agir apenas por inclinação ou interesse. Essa distinção aproxima-se da crítica da Gita à ação realizada exclusivamente por recompensa e da valorização de cumprir responsabilidades sem apego aos frutos.

**Diferença:** para Kant, a obrigação moral deriva da razão prática autônoma e da universalidade da máxima. Na Gita, o dever está ligado à ordem espiritual, à natureza e à devoção a Krishna. Não são fundamentos equivalentes.

### Spinoza: liberdade e compreensão da necessidade

Spinoza entende que a liberdade cresce quando compreendemos as causas que nos determinam e deixamos de ser conduzidos cegamente por afetos. A Gita também convida a reconhecer condicionamentos, superar reações automáticas e agir com discernimento, sem imaginar que controlamos sozinhos todos os resultados.

**Diferença:** Spinoza concebe a liberdade dentro da necessidade da Natureza, identificada com Deus, e não como entrega a uma divindade pessoal que orienta o devoto. A Gita preserva uma dimensão teísta e devocional explícita.

| Pensador | Ponto de encontro | Diferença decisiva |
|---|---|---|
| Aristóteles | Deliberação, virtude e ação adequada à situação. | Florescimento humano como horizonte, não libertação devocional. |
| Kant | Dever não deve ser reduzido a interesse ou recompensa. | Autonomia racional como fundamento moral, não ordem divina revelada. |
| Spinoza | Compreender condicionamentos para agir com mais liberdade. | Liberdade imanente à Natureza, sem entrega a um Deus pessoal. |

### Uma interpretação integradora

O capítulo 18 oferece uma resposta à tensão entre liberdade e responsabilidade. Não escolhemos todas as condições em que agimos, nem controlamos todos os resultados. Ainda assim, somos convocados a discernir, assumir nossa parte, agir com competência e renunciar à fantasia de controle absoluto.

A renúncia madura não é fuga do mundo nem indiferença aos resultados. É agir com seriedade, mas sem transformar o sucesso em identidade, o fracasso em condenação ou o reconhecimento em condição para fazer o que é correto.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Agir plenamente, sem ser possuído pelo resultado

O capítulo final oferece uma orientação prática: não confundir responsabilidade com controle absoluto. Uma pessoa pode planejar, decidir, executar, avaliar e corrigir, reconhecendo que o resultado também depende de equipe, contexto, recursos, tempo e circunstâncias.

### Na liderança e na gestão

- **Defina o dever com clareza:** explicite propósito, responsabilidades, limites e critérios de qualidade. Não use “desapego” como desculpa para falta de planejamento.
- **Reconheça as múltiplas causas:** avalie o papel de pessoas, processos, ferramentas, contexto e esforço. Evite atribuir todo sucesso a si e todo fracasso aos outros.
- **Renuncie ao ego do resultado:** acompanhe indicadores e aprenda com eles, sem transformar cada número em julgamento sobre seu valor pessoal.
- **Escolha com discernimento:** não confunda o caminho mais confortável com o mais correto, nem o mais prestigioso com o mais necessário.

### Na educação

O professor tem responsabilidade pelo planejamento, pela mediação, pela avaliação e pela qualidade das oportunidades de aprendizagem. Não controla integralmente o ritmo, a história ou as escolhas de cada estudante. A ação pedagógica responsável combina compromisso alto com humildade diante dos limites do próprio controle.

### Na vida cotidiana: método de ação sem apego

1. **Nomeie o que precisa ser feito:** qual é a responsabilidade concreta, sem dramatização?
2. **Separe controle e influência:** o que depende de você, o que depende de outras pessoas e o que está fora do alcance?
3. **Escolha o princípio:** qual valor deve orientar a decisão, mesmo que o resultado não seja o mais conveniente?
4. **Execute com qualidade:** faça sua parte com presença, competência e constância.
5. **Aprenda e solte:** avalie o resultado, corrija o que for possível e não transforme o que não controla em culpa ou vaidade.

> **Exemplo:** você lidera um projeto que não alcança a meta. A resposta alinhada ao capítulo não é dizer “o resultado não importa”. Importa, sim. É investigar causas, reconhecer decisões equivocadas, corrigir processos, apoiar a equipe e assumir sua responsabilidade, sem reduzir toda a experiência a uma ferida no ego.

### Exercício de fechamento: compromisso e desapego

Escolha uma responsabilidade atual. Escreva: (1) o que precisa ser feito; (2) por que isso importa; (3) qual parte depende de você; (4) qual resultado você deseja, mas não controla; e (5) como agirá com integridade mesmo diante de um resultado diferente do esperado.
$md$),

(5, 'Reflexão pessoal interativa', $md$
## O que significa agir com liberdade?

Este é o exercício de encerramento da jornada. Responda pensando em decisões reais. Não existe resultado perfeito: o objetivo é reconhecer como você relaciona dever, motivação, controle e entrega.

### Reflexão final da jornada

Depois de 18 capítulos, que ideia da Bhagavad Gita mais alterou ou desafiou sua maneira de compreender a ação, o dever, o sofrimento, a liberdade ou a devoção? Como pretende colocá-la em prática?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## O que levar dos 18 capítulos

1. **A crise pode abrir caminho ao conhecimento:** a jornada começa quando Arjuna reconhece sua confusão e aceita investigar.
2. **A ação é inevitável:** a questão não é simplesmente agir ou não agir, mas compreender a motivação, a qualidade e a consequência da ação.
3. **O desapego transforma a ação:** fazer o que precisa ser feito sem depender do resultado para definir o próprio valor.
4. **A mente precisa ser educada:** conhecimento, meditação e discernimento ajudam a não ser governado por impulsos e condicionamentos.
5. **As virtudes são práticas:** coragem, compaixão, verdade, autocontrole, humildade e generosidade precisam aparecer nas escolhas concretas.
6. **A devoção é uma via de entrega:** na visão da Gita, a relação com Krishna integra conhecimento, ação e libertação.
7. **Liberdade não é ausência de responsabilidade:** é agir com consciência, reconhecer limites e não se tornar escravo do apego aos frutos.

### Versos para revisitar no capítulo 18

| Versos | Tema | Pergunta para leitura |
|---|---|---|
| 18.1–12 | Sannyasa e Tyaga | O que deve ser renunciado: a ação ou o apego aos seus frutos? |
| 18.13–18 | As cinco causas da ação | Por que o indivíduo não é a causa única de tudo o que realiza? |
| 18.19–28 | Conhecimento, ação e agente | Como os gunas qualificam nossa maneira de conhecer e agir? |
| 18.29–40 | Intelecto, firmeza e felicidade | Como distinguir uma felicidade que amadurece de um prazer que aprisiona? |
| 18.41–48 | Dever e trabalho | Como relacionar aptidões, responsabilidades e contribuição sem justificar desigualdade? |
| 18.49–55 | Libertação e devoção | Como conhecimento e devoção se relacionam no caminho descrito? |
| 18.56–66 | Entrega e refúgio | Como entregar-se ao divino sem abandonar a responsabilidade de agir? |
| 18.63–73 | Discernimento e decisão de Arjuna | Por que o ensinamento termina com reflexão e uma decisão pessoal? |
| 18.74–78 | Conclusão de Sanjaya | Por que a sabedoria precisa retornar ao campo da ação? |

> **Síntese interpretativa final:** a Bhagavad Gita não resolve a tensão humana eliminando a ação. Ela propõe transformar a maneira de agir. O indivíduo é chamado a compreender, discernir, cumprir responsabilidades, educar os desejos e abandonar a pretensão de controlar todos os frutos. Na dimensão devocional do texto, essa transformação culmina na entrega a Krishna. Na leitura filosófica, permanece uma pergunta poderosa: como fazer o que é correto com inteireza, sem se tornar prisioneiro do resultado?

### Jornada concluída

Você percorreu os 18 capítulos, da crise de Arjuna à decisão de agir. A conclusão não precisa ser um ponto final: os capítulos podem ser revisitados conforme surgirem novas situações, conflitos e decisões.

### Uma proposta para continuar a prática

Durante os próximos 18 dias, escolha um princípio de cada capítulo e registre uma situação em que ele possa orientar uma decisão concreta. Ao final de cada dia, anote o que fez, qual foi sua motivação e o que aprendeu sobre sua relação com os resultados.

> **Última pergunta para guardar:** estou agindo porque reconheço o que precisa ser feito ou porque preciso que o mundo confirme a imagem que construí de mim?
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 18
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
  (1, 'Quando uma responsabilidade é difícil e pouco reconhecida, o que mais orienta sua decisão?'),
  (2, 'Quando um resultado importante foge ao seu controle, você costuma:'),
  (3, 'O que melhor descreve renunciar aos frutos da ação?'),
  (4, 'Ao tomar uma decisão complexa, qual postura parece mais madura?'),
  (5, 'Ao concluir esta jornada, qual ensinamento você mais deseja incorporar?')
) as v(ordem, enunciado)
where c.numero = 18 and e.ordem = 5
on conflict (etapa_id, ordem) do update set enunciado = excluded.enunciado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'O propósito e o dever envolvidos, mesmo sem garantia de reconhecimento.'),
  (1, 'B', 'A possibilidade de recompensa, visibilidade ou vantagem futura.'),
  (1, 'C', 'A tendência de evitar o esforço ou transferir a responsabilidade.'),
  (2, 'A', 'Analisar causas, assumir sua parte e aprender com o que não controla.'),
  (2, 'B', 'Ficar preso à frustração e tentar controlar ainda mais as variáveis.'),
  (2, 'C', 'Desistir de avaliar o que aconteceu ou atribuir tudo ao acaso.'),
  (3, 'A', 'Fazer o que é correto com qualidade, sem fazer do resultado minha identidade.'),
  (3, 'B', 'Não me importar com resultados ou consequências.'),
  (3, 'C', 'Evitar compromissos para não correr o risco de fracassar.'),
  (4, 'A', 'Refletir, considerar deveres e consequências e então assumir a escolha.'),
  (4, 'B', 'Seguir o impulso mais forte ou a opinião que oferece maior aprovação.'),
  (4, 'C', 'Esperar que outra pessoa decida para evitar responsabilidade.'),
  (5, 'A', 'Agir com discernimento, responsabilidade e desapego aos frutos.'),
  (5, 'B', 'Buscar resultados melhores sem deixar de observar minhas motivações.'),
  (5, 'C', 'Reconhecer onde ainda fujo de escolhas e responsabilidades difíceis.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 18 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, chave, texto)
select e.id, v.chave, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  ('A', 'Suas respostas apontam para uma orientação frequente ao propósito, ao discernimento e à responsabilidade. O desafio é manter essa postura quando há pressão, incerteza ou ausência de reconhecimento, sem transformar desapego em indiferença.'),
  ('B', 'Suas respostas sugerem que resultados, aprovação ou controle podem exercer influência importante. A proposta não é deixar de buscar bons resultados, mas evitar que eles determinem sozinhos suas escolhas e sua autoestima.'),
  ('C', 'Suas respostas indicam pontos de atenção ligados à evasão ou à dificuldade de assumir decisões. Escolha uma responsabilidade possível, divida-a em passos e pratique agir sem esperar condições perfeitas.')
) as v(chave, texto)
where c.numero = 18 and e.ordem = 5
on conflict (etapa_id, chave) do update set texto = excluded.texto;
