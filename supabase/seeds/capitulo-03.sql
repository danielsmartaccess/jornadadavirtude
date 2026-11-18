-- Jornada da Virtude v2.0 — conteúdo do capítulo 3 (Karma Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz de compreensão (15 alternativas,
-- uma correta em cada pergunta) e as 3 leituras por número de acertos (modo "acertos").
-- Idempotente: upsert por numero, (capitulo_id, ordem), (etapa_id, ordem), (pergunta_id, chave) e
-- (etapa_id, minimo). Não insere registros de usuário.
-- O HTML tem 7 seções: "Mapa do capítulo" e "Conceitos fundamentais" formam a etapa 2.

insert into public.capitulos (numero, titulo)
values (3, 'Karma Yoga — O Yoga da Ação')
on conflict (numero) do update set titulo = excluded.titulo;

insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Contexto: por que agir?

Depois de ouvir Krishna falar sobre conhecimento, discernimento e equanimidade no capítulo 2, Arjuna percebe uma aparente contradição: se o conhecimento é tão elevado, por que deveria entrar em combate?

A pergunta de Arjuna é também uma pergunta humana recorrente: se compreendo que o apego causa sofrimento, devo me afastar do mundo? Se a contemplação é superior à agitação, por que assumir responsabilidades? Krishna responde que a questão não é escolher entre pensar e agir como se fossem caminhos mutuamente excludentes. O ponto decisivo é **como se age, com que consciência e a serviço de quê**.

> **Tese do capítulo:** ninguém permanece verdadeiramente sem agir. A saída não é fugir da ação, mas transformar sua motivação, sua qualidade e sua relação com os frutos.

### O cenário filosófico

A Gita dialoga com tradições indianas que investigam dever, conhecimento, renúncia, disciplina e libertação. O termo *karma* significa ação, mas também pode envolver a ideia de consequência da ação. Neste capítulo, Krishna desenvolve o *Karma Yoga*: uma disciplina de ação consciente, orientada pelo dever e livre da apropriação egoísta dos resultados.

O texto se situa em uma narrativa épica e religiosa. Suas afirmações sobre ordem cósmica, renascimento e libertação pertencem ao horizonte metafísico da obra; não devem ser confundidas com descrições científicas contemporâneas.
$md$),

(2, 'Conceitos fundamentais', $md$
## Mapa do capítulo: os 47 versos

### 3.1–3.2 · A dúvida de Arjuna

Arjuna pede clareza: se o conhecimento parece superior à ação, por que Krishna o conduz a uma tarefa tão difícil? A dúvida revela o risco de transformar ensinamentos espirituais em justificativa para evitar decisões concretas.

### 3.3–3.9 · Dois caminhos, uma disciplina

Krishna distingue a via do conhecimento, associada à contemplação, e a via da ação disciplinada. Não são convites à passividade. A natureza humana está continuamente em atividade; até a tentativa de não agir pode ser uma forma de ação. O verso 3.8 recomenda cumprir a ação necessária, e o 3.9 afirma que a ação realizada como oferta, sem apego, não aprisiona da mesma maneira que a ação egoísta.

> *“A ação é superior à inação.”* — ideia central do verso 3.8, em tradução livre.

### 3.10–3.16 · Yajna e interdependência

*Yajna*, frequentemente traduzido como sacrifício ou oferenda, é apresentado como princípio de reciprocidade. A vida depende de uma rede de contribuições: seres, alimento, chuva, trabalho e ordem natural. A leitura contemporânea pode reconhecer aqui uma ética da interdependência, sem reduzir o sentido ritual e cosmológico original do texto a uma metáfora ambiental moderna.

### 3.17–3.26 · O sábio age e sustenta o mundo

Quem encontrou realização interior não age apenas por recompensa ou reconhecimento. Ainda assim, Krishna afirma que pessoas de referência devem agir com responsabilidade, pois suas escolhas influenciam outras. Surge *loka-sangraha*: a sustentação, coesão ou preservação do mundo social. O sábio não usa sua liberdade como desculpa para abandonar os demais.

### 3.27–3.35 · Natureza, ego e dever próprio

As ações são condicionadas pelos *gunas*, qualidades constitutivas da natureza. O ego se engana quando reivindica autoria absoluta, ignorando condições, disposições e relações. Isso não elimina responsabilidade: o texto orienta a agir com discernimento e a cumprir o próprio *svadharma*, em vez de imitar superficialmente o caminho alheio. O verso 3.35 exige interpretação cuidadosa: não deve ser usado para naturalizar injustiças ou aprisionar pessoas em posições sociais.

### 3.36–3.43 · Desejo, raiva e governo de si

Arjuna pergunta o que leva alguém a agir contra o próprio discernimento. Krishna aponta o desejo insaciável e a raiva, ligados à qualidade de *rajas*. Eles obscurecem o conhecimento como fumaça encobre o fogo. A resposta é fortalecer o discernimento e ordenar sentidos, mente e intelecto, sem imaginar que a transformação ocorre por simples repressão.

## Conceitos fundamentais

- **Karma:** ação e, em contextos mais amplos, suas consequências. O capítulo investiga como a motivação e o apego alteram a qualidade ética e espiritual do agir.
- **Karma Yoga:** disciplina de agir com atenção, responsabilidade e desapego dos frutos. Não é indiferença ao resultado: é reconhecer que o resultado não está sob controle absoluto.
- **Yajna:** oferenda ou sacrifício. Expressa reciprocidade e participação em uma ordem maior do que o interesse individual.
- **Loka-sangraha:** sustentação do mundo comum. A ação de quem exerce influência deve considerar o efeito de seu exemplo sobre a coletividade.
- **Svadharma:** dever ou caminho próprio, compreendido à luz da condição, das capacidades e das responsabilidades. Não é licença para justificar hierarquias injustas.
- **Gunas:** as três qualidades da natureza: *sattva* (clareza), *rajas* (atividade e impulso) e *tamas* (inércia e obscurecimento). Elas condicionam tendências, mas o texto propõe discernimento diante delas.

### Uma distinção essencial: desapego não é descuido

O ensinamento não recomenda trabalhar sem planejamento, ignorar indicadores, aceitar resultados ruins ou fugir de prestação de contas. Uma leitura consistente separa três dimensões:

| Dimensão | O que depende de nós | O que exige humildade |
|---|---|---|
| Intenção | Examinar motivos, valores e propósito. | Reconhecer autoenganos e motivações misturadas. |
| Execução | Preparar, decidir, agir e corrigir. | Aceitar limites de informação, recursos e circunstâncias. |
| Resultado | Avaliar evidências e aprender com consequências. | Não supor controle total sobre pessoas, contexto e acaso. |

> Desapego é liberdade em relação à necessidade de possuir o resultado. Não é licença para produzir um trabalho medíocre e chamar isso de espiritualidade.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com a filosofia ocidental

As aproximações abaixo são comparações interpretativas. Não significam que os autores tenham defendido a mesma metafísica ou a mesma ética de Krishna.

### Aristóteles: caráter construído pela prática

Na ética aristotélica, virtudes são desenvolvidas por hábitos e escolhas reiteradas. A excelência não nasce apenas de conhecer o bem, mas de aprender a agir bem. Há convergência com a ênfase da Gita na disciplina da ação. A diferença é que Aristóteles organiza sua ética em torno da realização humana e da vida na pólis, enquanto a Gita integra a ação a uma visão espiritual de libertação, dever e relação com o divino.

### Immanuel Kant: dever e motivação

Kant distingue agir por dever de agir apenas conforme o dever por interesse ou inclinação. A comparação ajuda a perguntar se uma ação é guiada por princípios ou por recompensa. Mas há diferenças importantes: a autonomia racional e a universalização da máxima ocupam o centro da ética kantiana; na Gita, o dever aparece ligado ao *dharma*, à ordem cósmica e à realização espiritual. Não se deve traduzir *dharma* simplesmente como “imperativo categórico”.

### Max Weber: ética da responsabilidade

Weber destaca que a ação pública exige considerar consequências previsíveis, especialmente quando se exerce liderança. Isso conversa com *loka-sangraha*: o exemplo de quem ocupa uma posição de influência afeta a coletividade. A diferença é que Weber analisa a tensão entre convicção e responsabilidade em contextos políticos modernos; a Gita apresenta uma orientação espiritual e normativa ancorada em seu próprio universo religioso.

| Autor | Pergunta que ilumina | Diferença em relação à Gita |
|---|---|---|
| Aristóteles | Que hábitos formam uma pessoa virtuosa? | Ética da florescência humana e da pólis, sem a mesma estrutura de libertação espiritual. |
| Kant | Qual princípio orienta minha ação? | Autonomia racional e universalização, em vez de dever situado no dharma. |
| Weber | Que consequências decorrem da minha atuação? | Análise sociológica e política moderna, não uma doutrina de yoga. |
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações contemporâneas

- **Vida pessoal · Agir sem viver refém:** defina o que está sob sua responsabilidade, faça o melhor possível e avalie o resultado sem transformar cada êxito em identidade ou cada fracasso em sentença sobre seu valor.
- **Educação · Ensinar como contribuição:** o educador prepara situações de aprendizagem, acompanha evidências e ajusta estratégias. Não controla integralmente o ritmo, a história ou as escolhas de cada estudante. Sua responsabilidade está na qualidade da mediação.
- **Liderança · O exemplo tem consequências:** uma liderança não pode exigir colaboração enquanto pratica individualismo. Decisões, critérios e comportamentos criam padrões que a equipe tende a reproduzir.
- **Trabalho · Processo, resultado e integridade:** metas importam, mas não justificam qualquer meio. Combine critérios claros, execução competente, transparência e revisão de resultados. O desapego impede que a meta se torne desculpa para comprometer valores.

### Exercício: círculo da ação consciente

1. **Nomeie a ação:** qual responsabilidade concreta estou evitando ou assumindo?
2. **Examine a intenção:** quero contribuir, obter aprovação, controlar alguém ou evitar desconforto?
3. **Separe controle e influência:** o que posso decidir diretamente e o que depende de outras pessoas ou circunstâncias?
4. **Escolha um padrão de qualidade:** que preparação e critério tornam a ação responsável?
5. **Revise sem se aprisionar:** depois de agir, o que os resultados ensinam para a próxima decisão?
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Questionário de reflexão

Responda pensando no sentido do capítulo. A devolutiva identifica tendências de interpretação, não mede caráter, espiritualidade ou competência.

### Reflexão aberta

Em qual situação da sua vida você precisa agir com mais responsabilidade e, ao mesmo tempo, reduzir a necessidade de controlar o resultado?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese: a liberdade está no modo de agir

O capítulo 3 não opõe vida espiritual e participação no mundo. Ele questiona a fantasia de que podemos escapar da ação e propõe transformar a relação com ela.

- Agir é inevitável; a questão é a qualidade da ação.
- O trabalho pode ser entendido como contribuição, não apenas como instrumento de ganho pessoal.
- Quem lidera ou ensina deve considerar o efeito do próprio exemplo.
- O ego exagera sua autoria e seu controle; o discernimento reconhece condicionamentos e responsabilidades.
- Desejo e raiva podem sequestrar a razão; disciplina interior amplia a liberdade de escolha.

> **Versos para revisitar:** 3.8 (ação necessária); 3.9 (ação como oferenda); 3.19 (agir sem apego); 3.21 (o exemplo dos que lideram); 3.30 (entrega da ação); 3.35 (dever próprio); 3.37 (desejo e raiva).

Depois de compreender a ação disciplinada, o capítulo 4 aprofunda o conhecimento, a tradição do ensinamento e a relação entre sabedoria e ação. A pergunta avança: como o conhecimento transforma aquilo que fazemos?

*Nota de estudo: os nomes sânscritos e a numeração dos versos seguem a divisão tradicional de 47 versos. As formulações em português são sínteses explicativas, não uma tradução integral de uma edição específica.*
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 3
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

update public.etapas e
set quiz_modo = 'acertos', quiz_chave_alvo = null
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 3 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado, chave_correta)
select e.id, v.ordem, v.enunciado, v.chave_correta
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Qual é a resposta central de Krishna à dúvida de Arjuna sobre agir?', 'B'),
  (2, 'No capítulo, agir como yajna significa principalmente:', 'A'),
  (3, 'O conceito de loka-sangraha destaca:', 'C'),
  (4, 'O desapego aos frutos da ação deve ser entendido como:', 'B'),
  (5, 'Segundo o capítulo, o desejo e a raiva:', 'A')
) as v(ordem, enunciado, chave_correta)
where c.numero = 3 and e.ordem = 5
on conflict (etapa_id, ordem) do update
  set enunciado = excluded.enunciado, chave_correta = excluded.chave_correta;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'A ação deve ser abandonada por completo.'),
  (1, 'B', 'A ação pode ser um caminho de disciplina quando realizada com consciência e desapego.'),
  (1, 'C', 'Apenas os resultados determinam o valor da ação.'),
  (2, 'A', 'Participar de uma lógica de oferenda e reciprocidade, para além do interesse individual.'),
  (2, 'B', 'Fazer qualquer tarefa sem refletir sobre ela.'),
  (2, 'C', 'Buscar reconhecimento público por cada contribuição.'),
  (3, 'A', 'O isolamento do sábio em relação à sociedade.'),
  (3, 'B', 'A obrigação de controlar todas as pessoas.'),
  (3, 'C', 'A responsabilidade de contribuir para a sustentação do mundo comum.'),
  (4, 'A', 'Indiferença à qualidade do trabalho.'),
  (4, 'B', 'Fazer o que cabe com competência, reconhecendo que o resultado não está sob controle absoluto.'),
  (4, 'C', 'Recusar planejamento e avaliação.'),
  (5, 'A', 'Podem obscurecer o discernimento e precisam ser compreendidos e governados.'),
  (5, 'B', 'São sempre sinais de sabedoria.'),
  (5, 'C', 'Desaparecem quando a pessoa evita toda responsabilidade.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 3 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (5, 'Você identificou com precisão os eixos do capítulo. O próximo desafio é testar essas ideias em decisões reais, onde intenção, dever e consequência nem sempre apontam na mesma direção.'),
  (3, 'Sua leitura captou boa parte do argumento. Retome especialmente a diferença entre desapego e descuido, e a ideia de que a ação pode contribuir para o mundo comum.'),
  (0, 'Vale reler o mapa dos versos e os conceitos fundamentais. O capítulo não recomenda passividade: propõe agir com discernimento, responsabilidade e menor apego ao controle dos resultados.')
) as v(minimo, texto)
where c.numero = 3 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
