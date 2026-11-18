-- Jornada da Virtude v2.0 — conteúdo do capítulo 1 (Arjuna Vishada Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz da etapa 5 (com 15 alternativas,
-- uma correta em cada pergunta) e as 3 leituras por número de acertos. Neste capítulo o quiz é de
-- compreensão e usa o modo "acertos" (migração 20261119010000_quiz_por_acertos.sql): a leitura depende
-- de quantas perguntas foram acertadas (5; 3 ou 4; menos de 3).
-- Idempotente: upsert por numero em capitulos, por (capitulo_id, ordem) em etapas, por
-- (etapa_id, ordem) em perguntas, por (pergunta_id, chave) em opcoes e por (etapa_id, minimo) em
-- leituras. Rodar de novo atualiza o texto e não duplica nada. Não insere registros de usuário.
--
-- O Markdown usa GFM (tabelas) e não contém HTML, CSS nem JavaScript.
-- No HTML de origem este capítulo tem 7 seções; "Mapa do capítulo" e "Conceitos fundamentais" formam a etapa 2.

insert into public.capitulos (numero, titulo)
values (1, 'Arjuna Vishada Yoga — O Yoga do Desalento de Arjuna')
on conflict (numero) do update set titulo = excluded.titulo;

-- ---------------------------------------------------------------------------
-- Etapas: nome e texto
-- ---------------------------------------------------------------------------
insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Contexto histórico e filosófico

A Bhagavad Gita começa não com uma resposta, mas com uma pergunta e uma crise. Arjuna, guerreiro dos Pandavas, pede que seu carro seja conduzido entre os dois exércitos reunidos para a guerra de Kurukshetra. Ao reconhecer parentes, mestres, amigos e antigos companheiros do outro lado, sua determinação desmorona.

### A cena inicial

O diálogo está inserido no grande épico indiano *Mahabharata*, que narra o conflito entre os Pandavas e os Kauravas. A disputa envolve sucessão, poder, justiça, honra, alianças e violações de deveres. A guerra não é apresentada como uma aventura gloriosa: desde o primeiro capítulo, seu custo humano e moral ocupa o centro da narrativa.

Dhritarashtra, rei cego, pergunta a Sanjaya o que aconteceu no campo de Kurukshetra. Sanjaya narra a disposição dos exércitos, as falas dos comandantes e, por fim, a crise de Arjuna. O capítulo termina antes de Krishna oferecer a instrução filosófica que ocupará os capítulos seguintes.

> **Chave de leitura:** Arjuna não está simplesmente com medo de morrer. Ele enfrenta um conflito entre dever, afeto, lealdade, justiça e consequências. Sua crise revela que decisões difíceis podem desorganizar até mesmo alguém experiente e preparado.

*Nota de contexto: a Gita é um texto religioso e filosófico da tradição hindu, situado dentro de uma narrativa épica. Datas de composição, camadas textuais e contexto histórico são objeto de debate acadêmico; por isso, não se deve tratar uma data única como consenso.*
$md$),

(2, 'Conceitos fundamentais', $md$
## Mapa do capítulo: versos por temas

### Versos 1–11 · Os exércitos e a tensão antes do combate

Dhritarashtra pergunta sobre os acontecimentos no campo. Duryodhana observa o exército dos Pandavas, dirige-se a Drona, menciona os principais guerreiros e organiza suas forças. Os dois lados se preparam para a batalha. A narrativa estabelece a dimensão política, familiar e militar do conflito.

### Versos 12–19 · As conchas anunciam a guerra

Os guerreiros tocam suas conchas e instrumentos. O som anuncia a disposição para o combate e intensifica a tensão. Krishna e Arjuna também sopram suas conchas, cada uma identificada pelo nome tradicional no poema. O campo deixa de ser apenas um espaço de preparação: a guerra está prestes a começar.

### Versos 20–23 · Arjuna pede para observar os dois lados

Arjuna ergue o arco e pede a Krishna que conduza o carro entre os exércitos. Quer ver aqueles com quem terá de lutar e compreender quem está reunido para apoiar Duryodhana. O pedido o coloca diante da realidade concreta da decisão.

### Versos 24–27 · O reconhecimento dos vínculos

Krishna posiciona o carro diante de figuras centrais, incluindo Bhishma e Drona. Arjuna vê pais, avôs, mestres, tios, irmãos, filhos, netos, amigos e parentes. A classificação abstrata de inimigos se desfaz diante de rostos e relações.

### Versos 28–30 · A crise física e emocional

Arjuna relata compaixão, tristeza e perturbação. Seus membros enfraquecem, a boca seca, o corpo treme, os pelos se arrepiam, o arco escapa de sua mão e a mente parece girar. A crise é corporal, afetiva e cognitiva.

### Versos 31–35 · A recusa em buscar vitória a qualquer preço

Arjuna não vê sentido em desejar vitória, reino ou prazeres se aqueles com quem gostaria de compartilhá-los serão mortos. Questiona o valor de conquistar poder ao custo da destruição da própria família e de seus mestres.

### Versos 36–39 · O problema moral de matar os próprios parentes

Arjuna considera errado eliminar os membros da própria família, mesmo que eles estejam dominados pela cobiça. Argumenta que a violência contra os parentes produz consequências morais graves e que a consciência do dano deveria impedir a ação.

### Versos 40–44 · A ruptura da ordem familiar e social

Arjuna teme que a destruição das famílias comprometa práticas, deveres e referências transmitidas entre gerações. O texto apresenta a preocupação com a continuidade dos costumes e com a desorganização social. Essas passagens refletem categorias tradicionais da sociedade antiga e exigem leitura histórica crítica, sem transformar hierarquias sociais antigas em normas universais atuais.

### Versos 45–47 · A decisão de não lutar

Arjuna considera preferível ser morto desarmado a participar da matança de seus parentes. Tomado pelo desalento, deixa cair o arco e as flechas e senta-se no carro. O capítulo termina com sua paralisia, abrindo espaço para a orientação de Krishna no capítulo seguinte.

## Conceitos fundamentais

- **Vishada:** desalento, aflição ou abatimento profundo. No título do capítulo, não é apenas tristeza: é uma crise que abala a capacidade de decidir e agir.
- **Dharma:** dever, ordem, responsabilidade e conduta apropriada. O termo tem sentidos complexos na tradição indiana e não equivale simplesmente a uma regra moral universal ou a uma profissão.
- **Moha:** confusão, obscurecimento ou apego que distorce a compreensão. A questão que surgirá no diálogo é como distinguir compaixão lúcida de uma percepção dominada pela confusão.
- **Karuna:** compaixão ou sensibilidade diante do sofrimento. A crise de Arjuna inclui uma percepção real do custo humano da guerra, embora Krishna venha a questionar sua interpretação e sua paralisia.
- **Svajana:** os seus, os próprios parentes e pessoas próximas. O reconhecimento dos vínculos transforma o campo de batalha em um cenário de conflito íntimo e familiar.
- **Kurukshetra:** o campo em que ocorre a batalha épica. Na narrativa, é um lugar histórico-mítico; em leituras simbólicas posteriores, também pode representar o campo de conflito interior. Essa leitura simbólica não substitui o enredo literal.

### As camadas da crise de Arjuna

| Dimensão | O que aparece no capítulo | Pergunta que permanece |
|---|---|---|
| Física | Tremor, fraqueza, boca seca, perda de firmeza | Como o corpo manifesta conflitos que ainda não conseguimos organizar? |
| Emocional | Tristeza, compaixão, medo e angústia | Como acolher emoções sem deixar que decidam tudo sozinhas? |
| Relacional | Reconhecimento de mestres, parentes e amigos | Como agir quando deveres entram em choque com vínculos afetivos? |
| Moral | Receio de produzir sofrimento e destruir a ordem familiar | Quais consequências devem entrar no julgamento de uma decisão? |
| Existencial | Perda de sentido da vitória e do poder | O que torna uma conquista realmente valiosa? |

> **Uma tensão que não deve ser simplificada:** a compaixão de Arjuna é moralmente significativa, mas o texto também apresenta sua argumentação como incompleta e atravessada por confusão. O capítulo 1 não resolve essa tensão. Ele a expõe para que o diálogo possa examiná-la.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com a filosofia ocidental

### Platão · A razão diante do conflito interior

**Convergência:** em diálogos platônicos, a alma aparece atravessada por impulsos, desejos e exigências que nem sempre apontam na mesma direção. A crise de Arjuna também revela uma pessoa dividida, que precisa examinar seus motivos antes de agir.

**Diferença:** Platão desenvolve sua reflexão a partir de uma teoria própria da alma, das Formas e da justiça. A Gita parte de conceitos como dharma, karma, Atman e uma relação específica entre o ser humano e Krishna. Não são mapas filosóficos equivalentes.

### Kierkegaard · Angústia e decisão

**Convergência:** Kierkegaard investiga a angústia ligada à possibilidade, à responsabilidade e à decisão. Arjuna também se encontra diante de uma escolha que não pode ser resolvida por automatismo ou mera técnica: qualquer caminho parece envolver perda.

**Diferença:** Kierkegaard pensa a existência individual em relação à fé cristã e à singularidade diante de Deus. A Gita situa a decisão num universo de dever, renascimento, ação e conhecimento espiritual próprio da tradição hindu.

### Simone Weil · Atenção ao sofrimento

**Convergência:** Simone Weil atribui grande valor à atenção verdadeira, capaz de reconhecer a realidade do sofrimento sem reduzi-lo aos interesses do observador. Arjuna, ao reconhecer os rostos no outro exército, deixa de enxergar apenas posições militares e percebe vidas e vínculos.

**Diferença:** Weil desenvolve uma reflexão cristã e social sobre atenção, aflição e justiça. A Gita não se limita à contemplação do sofrimento: o diálogo posterior procurará integrar discernimento, dever e ação.

> **Critério de comparação:** esses autores ajudam a formular perguntas sobre conflito, decisão e sofrimento. Não oferecem a mesma resposta nem compartilham os pressupostos religiosos e metafísicos da Gita.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações contemporâneas

- **Vida pessoal · Reconhecer o conflito antes de decidir:** quando uma escolha parece impossível, nomeie os valores em tensão: lealdade, justiça, cuidado, segurança, responsabilidade. Dar nome ao conflito não resolve tudo, mas reduz a confusão.
- **Educação · Criar espaço para perguntas difíceis:** estudantes podem enfrentar dilemas em que regras, pertencimento e justiça entram em choque. O educador não precisa oferecer respostas instantâneas; pode ajudar a examinar fatos, perspectivas e consequências.
- **Liderança · Enxergar pessoas além das posições:** em conflitos organizacionais, não reduza colegas a obstáculos ou cargos. Reconheça interesses, relações e impactos humanos, sem abandonar critérios, responsabilidades ou decisões necessárias.
- **Trabalho · Não confundir paralisia com prudência:** adiar uma decisão pode ser necessário para reunir informações. Mas a postergação também pode virar fuga. Diferencie o que ainda precisa ser compreendido daquilo que você já sabe e evita enfrentar.

### Exercício: cartografia de um dilema

Escolha uma decisão real que esteja gerando tensão. Registre:

1. **Fatos:** o que sei e o que ainda estou supondo?
2. **Vínculos:** quem será afetado e quais relações estão envolvidas?
3. **Valores:** quais princípios parecem entrar em conflito?
4. **Consequências:** quais danos e benefícios são previsíveis no curto e no longo prazo?
5. **Próximo passo:** qual conversa, informação ou ação responsável pode reduzir a confusão?

*O exercício não substitui aconselhamento jurídico, profissional ou especializado em decisões de alto risco. Seu objetivo é organizar a reflexão antes de agir.*

### Três armadilhas diante de um dilema

| Armadilha | Como aparece | Movimento de discernimento |
|---|---|---|
| Reação impulsiva | Decidir para encerrar rapidamente o desconforto | Fazer uma pausa e separar emoção de evidência |
| Paralisia | Esperar certeza absoluta antes de qualquer passo | Identificar o que já é suficientemente conhecido para agir |
| Justificação seletiva | Considerar apenas consequências que confirmam a preferência inicial | Buscar a melhor objeção à própria posição e ouvir os afetados |
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Questionário de reflexão

Responda às cinco questões. A devolutiva verifica a compreensão do capítulo e propõe uma pergunta para aprofundamento. Não é teste psicológico nem avaliação moral.

### Reflexão aberta

Qual decisão da sua vida colocou em tensão dois valores importantes para você? O que Arjuna nos ensina sobre a importância de reconhecer o conflito antes de buscar uma resposta?

*Registre o dilema sem tentar resolvê-lo imediatamente. Depois, identifique quais fatos, conversas ou perspectivas ainda faltam para decidir com maior clareza.*
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese do capítulo

A Bhagavad Gita começa com um homem que não consegue agir. Arjuna vê, no exército adversário, não apenas inimigos, mas pessoas que fazem parte de sua história. A guerra deixa de ser uma questão abstrata e se torna um dilema moral vivido no corpo e na consciência.

O capítulo não entrega uma solução pronta. Ele torna visíveis as tensões entre dever, afeto, justiça e consequência. Sua importância está em mostrar que a sabedoria não começa negando a crise, mas examinando-a com honestidade. O ensinamento de Krishna começa justamente onde a certeza de Arjuna termina.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 1.1 | a pergunta de Dhritarashtra situa o conflito no campo de Kurukshetra. |
| 1.20–23 | Arjuna pede para observar aqueles com quem terá de lutar. |
| 1.26–27 | o reconhecimento dos vínculos transforma sua percepção do combate. |
| 1.28–30 | a crise se manifesta no corpo, nas emoções e na mente. |
| 1.31–35 | Arjuna questiona o sentido da vitória sem aqueles com quem gostaria de compartilhá-la. |
| 1.46–47 | o arco cai; o guerreiro se cala e o diálogo filosófico está prestes a começar. |

> **Conexão com o capítulo 2:** diante do silêncio e do desalento de Arjuna, Krishna começa a responder. O capítulo 2 introduz distinções fundamentais sobre o corpo, o Atman, a ação, a sabedoria e a equanimidade. A crise se transforma em investigação filosófica.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 1
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

-- ---------------------------------------------------------------------------
-- Quiz da etapa 5 (modo "acertos": conta as respostas corretas)
-- ---------------------------------------------------------------------------
update public.etapas e
set quiz_modo = 'acertos', quiz_chave_alvo = null
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 1 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado, chave_correta)
select e.id, v.ordem, v.enunciado, v.chave_correta
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Qual é o papel de Arjuna Vishada Yoga na estrutura da Bhagavad Gita?', 'B'),
  (2, 'O que provoca a crise mais profunda de Arjuna?', 'A'),
  (3, 'Como o capítulo apresenta a crise de Arjuna?', 'C'),
  (4, 'Qual cuidado é importante ao interpretar as passagens sobre ordem familiar e social?', 'B'),
  (5, 'Qual aplicação contemporânea melhor expressa o convite deste capítulo?', 'C')
) as v(ordem, enunciado, chave_correta)
where c.numero = 1 and e.ordem = 5
on conflict (etapa_id, ordem) do update
  set enunciado = excluded.enunciado, chave_correta = excluded.chave_correta;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Apresentar todas as respostas filosóficas de Krishna.'),
  (1, 'B', 'Descrever uma crise que prepara o terreno para o ensinamento dos capítulos seguintes.'),
  (1, 'C', 'Encerrar a narrativa com a vitória dos Pandavas.'),
  (2, 'A', 'O reconhecimento de parentes, mestres e amigos entre os adversários.'),
  (2, 'B', 'A falta de armas e de treinamento militar.'),
  (2, 'C', 'A ausência de um plano estratégico para o exército.'),
  (3, 'A', 'Como um problema exclusivamente físico.'),
  (3, 'B', 'Como uma demonstração de que ele não possui qualquer vínculo afetivo.'),
  (3, 'C', 'Como uma crise física, emocional, relacional e moral.'),
  (4, 'A', 'Transformá-las automaticamente em regras universais para a sociedade atual.'),
  (4, 'B', 'Reconhecer seu contexto histórico e examinar criticamente as categorias sociais antigas.'),
  (4, 'C', 'Ignorar todas as preocupações éticas apresentadas por Arjuna.'),
  (5, 'A', 'Evitar decisões sempre que houver conflito entre valores.'),
  (5, 'B', 'Agir imediatamente para não sentir desconforto.'),
  (5, 'C', 'Reconhecer os valores em tensão, considerar os afetados e organizar a reflexão antes de decidir.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 1 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (5, 'Você identificou os principais elementos da crise de Arjuna. O próximo passo é aplicar esse olhar a dilemas reais, sem apressar respostas nem romantizar a paralisia.'),
  (3, 'Você compreendeu boa parte do capítulo. Retome especialmente o reconhecimento dos vínculos, as dimensões da crise e o contexto histórico das preocupações sociais.'),
  (0, 'Vale reler o mapa dos versos e o contexto. O capítulo não é apenas uma descrição de medo: apresenta um conflito complexo entre dever, afeto, justiça e consequências.')
) as v(minimo, texto)
where c.numero = 1 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
