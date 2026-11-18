-- Jornada da Virtude v2.0 — conteúdo do capítulo 16 (Daivasura Sampad Vibhaga Yoga)
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
values (16, 'Daivasura Sampad Vibhaga Yoga — Disposições divinas e demoníacas')
on conflict (numero) do update set titulo = excluded.titulo;

-- ---------------------------------------------------------------------------
-- Etapas: nome e texto
-- ---------------------------------------------------------------------------
insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## O caráter como direção da vida

Depois de apresentar a árvore da existência e o Ser Supremo no capítulo 15, Krishna desloca o foco para a conduta humana: que qualidades aproximam uma pessoa da liberdade e quais a aprisionam em padrões destrutivos?

O capítulo 16 recebe o nome **Daivasura Sampad Vibhaga Yoga**. *Daiva* remete ao divino; *asura*, ao demoníaco ou antagônico ao divino; *sampad*, a riqueza, conjunto de qualidades ou disposição; e *vibhaga*, distinção. O título pode ser entendido como “o Yoga da distinção entre as disposições divinas e demoníacas”.

O diálogo continua no campo de Kurukshetra. Arjuna recebe uma descrição de qualidades éticas e psicológicas que favorecem uma vida orientada pelo discernimento, e de disposições que alimentam arrogância, violência, insaciabilidade e autoengano.

### O lugar do capítulo na sequência da Gita

No capítulo 14, Krishna explicou os três gunas, tendências constitutivas da natureza. No capítulo 15, apresentou o Ser Supremo como fundamento. Agora, no capítulo 16, descreve como determinadas disposições se expressam na conduta e influenciam o destino humano. O capítulo 17 continuará a investigação examinando como a fé e as práticas também são condicionadas pelos gunas.

> **Cuidado interpretativo:** “divino” e “demoníaco” são categorias éticas e espirituais da linguagem da Gita. Não devem ser usadas para classificar povos, religiões, grupos sociais ou pessoas como essências fixas. O texto descreve disposições e padrões de comportamento, não identidades imutáveis.

*A linguagem sobre destinos após a morte e mundos inferiores pertence à cosmologia religiosa do texto. A análise ética dessas imagens pode ser feita sem tratá-las como fatos empiricamente demonstrados.*
$md$),

(2, 'Conceitos fundamentais', $md$
## Duas orientações éticas em contraste

### 1. As qualidades da disposição divina (16.1–3)

Krishna começa enumerando qualidades associadas à *daivi sampad*, a disposição divina. Entre elas estão destemor, pureza de coração, firmeza no conhecimento e na disciplina, generosidade, autocontrole, sacrifício, estudo, austeridade, retidão, não violência, verdade, ausência de ira, renúncia, serenidade, compaixão, modéstia, perdão, fortaleza, limpeza e ausência de inveja e orgulho.

- **Discernimento:** clareza para distinguir o que constrói do que destrói; compromisso com conhecimento e verdade.
- **Autodomínio:** capacidade de regular impulsos, agir com firmeza e não ser governado pela ira ou pelo desejo imediato.
- **Relação com o outro:** compaixão, não violência, generosidade, perdão e ausência de inveja.
- **Humildade:** ausência de arrogância e orgulho; abertura para reconhecer limites e aprender.

Essas qualidades não significam passividade. Coragem, firmeza e disciplina aparecem ao lado da compaixão e da não violência. A disposição divina combina força com responsabilidade ética.

### 2. As qualidades da disposição demoníaca (16.4)

Em contraste, o verso 16.4 associa à disposição *asuri* hipocrisia, arrogância, presunção, ira, aspereza e ignorância. O ponto não é que uma pessoa esteja condenada por um traço isolado, mas que certos padrões, quando cultivados, deformam a percepção e a relação com os outros.

- **Arrogância:** transforma a própria opinião em medida absoluta e torna a correção quase impossível.
- **Hipocrisia:** exibe virtudes como fachada, sem compromisso real com elas.
- **Ira e aspereza:** fazem do conflito uma oportunidade de ferir, dominar ou humilhar.
- **Ignorância moral:** perde a capacidade de avaliar consequências, limites e responsabilidades.

### 3. Consequências e ciclos de comportamento (16.5–20)

Krishna afirma que a disposição divina conduz à libertação, enquanto a demoníaca conduz à servidão (16.5). Em seguida, apresenta uma distinção entre dois modos de orientar a vida e descreve a visão de mundo atribuída aos que vivem dominados pela disposição demoníaca (16.6–9).

Nos versos 16.10–18, o texto critica a insaciabilidade do desejo, a preocupação excessiva com acumulação, o orgulho, a vaidade e a crença de que poder e riqueza justificam qualquer ação. A pessoa passa a interpretar o mundo apenas em função de seus interesses e trata os outros como instrumentos.

Os versos 16.19–20 usam imagens severas de queda e destinos inferiores. Essas passagens expressam a gravidade espiritual que a Gita atribui à persistência de condutas destrutivas. Sua leitura exige atenção ao contexto religioso e não autoriza condenar pessoas ou grupos.

### 4. Os três portões da autodestruição (16.21–22)

Um dos núcleos mais conhecidos do capítulo aparece no verso 16.21: **desejo compulsivo, ira e ganância** são apresentados como três portões que conduzem à autodestruição. O verso seguinte recomenda abandoná-los porque obscurecem o discernimento e prejudicam o bem-estar.

> **Três portões para observar:**
>
> - Desejo compulsivo: “preciso ter isso para ficar bem”.
> - Ira: “tenho o direito de ferir porque fui contrariado”.
> - Ganância: “nunca é suficiente, mesmo quando o custo recai sobre os outros”.

### 5. A importância de critérios éticos (16.23–24)

O capítulo termina afirmando que agir apenas segundo impulsos e desejos, rejeitando referências éticas, conduz à confusão. O verso 16.24 apresenta os ensinamentos e princípios normativos como referência para discernir o que deve ou não ser feito.

Isso não significa obedecer cegamente a qualquer regra humana. A passagem está inserida na visão religiosa da Gita, em que ensinamento, discernimento e dever se articulam. A questão é não transformar a preferência individual em único critério moral.
$md$),

(3, 'Interpretação filosófica', $md$
## Três diálogos com a filosofia ocidental

### Aristóteles: virtude como hábito

Aristóteles entende a virtude como uma disposição estável formada pela prática. Coragem, temperança, justiça e prudência não surgem apenas de boas intenções: exigem educação dos desejos, repetição de escolhas e deliberação. Isso se aproxima da lista de qualidades da disposição divina, que descreve virtudes incorporadas ao modo de agir.

**Diferença:** Aristóteles organiza sua ética em torno da eudaimonia, a vida humana florescente, e da razão prática. A Gita insere as qualidades éticas em um caminho espiritual de libertação e relação com o divino.

### Spinoza: servidão às paixões e liberdade

Spinoza chama de servidão a condição em que somos conduzidos por afetos que não compreendemos adequadamente. A ira, a inveja e a ambição podem reduzir nossa capacidade de agir racionalmente. A liberdade cresce quando compreendemos as causas dos afetos e passamos a agir com maior atividade e entendimento.

**Diferença:** Spinoza explica a transformação ética por uma compreensão racional e afetiva da necessidade da Natureza. A Gita combina discernimento e disciplina com devoção, dever e uma cosmologia espiritual própria.

### Kant: autonomia e princípio moral

Kant oferece uma aproximação pela ideia de que a moralidade não pode depender apenas de inclinações, vantagens ou resultados desejados. A ação moral exige que a pessoa examine o princípio que orienta sua conduta e considere se ele pode valer universalmente. Isso dialoga com a crítica da Gita ao egoísmo, à ganância e à ação guiada exclusivamente pelo desejo.

**Diferença:** Kant fundamenta a moral na razão prática e na autonomia, não na devoção a Krishna nem na libertação do ciclo de renascimentos. A fonte e a estrutura da obrigação moral são diferentes.

| Pensador | Ponto de encontro | Diferença decisiva |
|---|---|---|
| Aristóteles | Virtudes como disposições formadas por hábitos e prática. | Florescimento humano e razão prática, em vez de libertação espiritual como horizonte último. |
| Spinoza | Superação da servidão aos afetos por compreensão e transformação. | Ética imanente à Natureza, sem a estrutura devocional da Gita. |
| Kant | Não submeter a ação apenas a inclinações e interesses particulares. | Autonomia racional como fundamento moral, não autoridade espiritual revelada. |

### Uma interpretação integradora

O capítulo 16 pode ser lido como uma análise da arquitetura moral do caráter. Uma escolha isolada importa, mas o que transforma a vida é a repetição de padrões: como lidamos com poder, desejo, frustração, verdade, dinheiro e vulnerabilidade alheia. As qualidades construtivas ampliam a capacidade de discernir e conviver; as destrutivas estreitam o mundo até que tudo pareça servir ao próprio ego.

Uma leitura madura evita usar o capítulo como instrumento para apontar “pessoas demoníacas”. A pergunta mais exigente é outra: quais dessas tendências encontro em mim, especialmente quando tenho poder, estou frustrado ou acredito que ninguém está observando?
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Ética quando há poder, pressão e desejo

O capítulo ganha força quando sai da abstração e chega aos momentos em que nossas escolhas têm consequências para outras pessoas. Ética não é apenas o que defendemos em público; é o que fazemos quando temos vantagem, estamos sob pressão ou podemos agir sem prestar contas.

### Na liderança e na gestão

- **Humildade:** criar espaço para discordância e reconhecer erros sem transformar a correção em ameaça à autoridade.
- **Verdade:** comunicar riscos e resultados sem manipular indicadores para proteger reputações.
- **Generosidade e justiça:** distribuir oportunidades e reconhecimento com critérios transparentes.
- **Autocontrole:** não tomar decisões importantes no auge da ira ou da necessidade de provar poder.

### Na educação

As qualidades da disposição divina podem orientar a convivência pedagógica: firmeza sem humilhação, disciplina sem autoritarismo, verdade sem crueldade, compaixão sem ausência de limites. Para estudantes, o capítulo oferece uma oportunidade de discutir como escolhas individuais afetam o clima coletivo e a confiança.

### Na vida cotidiana: os três portões

1. **Desejo:** antes de buscar algo, pergunte se é uma necessidade, um objetivo legítimo ou uma tentativa de preencher uma insatisfação que sempre muda de forma.
2. **Ira:** quando sentir raiva, adie a resposta impulsiva. Nomeie o que aconteceu, o que interpretou e qual consequência sua reação pode produzir.
3. **Ganância:** examine o custo daquilo que quer acumular. Quem paga a conta? O que está sendo sacrificado? Em que momento “mais” deixa de significar “melhor”?

> **Exercício de sete dias:** escolha um dos três portões como foco. Ao perceber o impulso, registre o gatilho, a interpretação automática, a ação que desejou tomar e uma resposta alternativa coerente com verdade, autocontrole e respeito. O objetivo não é reprimir emoções, mas responder a elas com discernimento.

*A lista de virtudes não deve virar perfeccionismo moral. O caminho ético envolve reconhecer falhas, reparar danos e cultivar disposições melhores, não construir uma imagem de pureza impecável.*
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Quais disposições estão orientando minhas escolhas?

Responda com base em situações reais. Não há diagnóstico nem classificação moral automática. As respostas servem para abrir uma investigação honesta sobre hábitos e decisões.

### Reflexão aberta

Em que situação você percebeu recentemente orgulho, ira, desejo ou ganância influenciando sua conduta? Que reparação ou mudança concreta seria possível?
$md$),

(6, 'Síntese e versos para revisitar', $md$
## O que levar deste capítulo

1. **Caráter é direção:** nossas disposições se revelam na maneira como tratamos a verdade, o poder, os desejos e as outras pessoas.
2. **Virtudes precisam ser cultivadas:** coragem, autocontrole, compaixão, humildade e generosidade exigem prática.
3. **O ego pode distorcer a realidade:** arrogância, hipocrisia e vaidade tornam difícil reconhecer limites e consequências.
4. **Desejo, ira e ganância são portões de risco:** quando dominam a ação, comprometem discernimento e convivência.
5. **Ética exige referências:** preferências e impulsos individuais não bastam para decidir o que é correto.
6. **A leitura começa por si:** o capítulo é mais útil como exame das próprias disposições do que como ferramenta para condenar os outros.

### Versos para revisitar

| Versos | Tema | Pergunta para leitura |
|---|---|---|
| 16.1–3 | Qualidades da disposição divina | Quais virtudes dependem de prática e quais exigem coragem? |
| 16.4 | Disposições destrutivas | Como orgulho e hipocrisia afetam o julgamento? |
| 16.5–9 | Libertação, servidão e visões de mundo | Como uma visão de mundo centrada apenas no ego altera a conduta? |
| 16.10–18 | Desejo, poder e autoengano | Em que momento a ambição deixa de servir a um propósito legítimo? |
| 16.21–22 | Os três portões | Como desejo, ira e ganância podem ser reconhecidos antes de virar ação? |
| 16.23–24 | Critérios para agir | Que princípios orientam decisões quando o impulso aponta para outro lado? |

> **Síntese interpretativa:** a oposição entre disposições divinas e demoníacas não precisa ser transformada em julgamento sobre quem é “bom” ou “mau” por essência. Ela pode funcionar como um espelho ético: que tipo de pessoa minhas escolhas estão formando? A resposta aparece menos no discurso e mais nos hábitos, sobretudo quando desejo, ira ou poder entram em cena.

Próxima etapa: **Capítulo 17 — Shraddhatraya Vibhaga Yoga**, a distinção entre os três tipos de fé. A leitura examinará como a fé, os hábitos alimentares, os sacrifícios, as austeridades e as doações são influenciados pelos três gunas.

### Três questões para orientar a próxima leitura

1. Por que Krishna afirma que a fé de cada pessoa se relaciona com sua constituição interior?
2. Como Sattva, Rajas e Tamas aparecem na alimentação, nas práticas e nas doações?
3. O que diferencia uma prática feita com clareza e propósito de outra realizada por vaidade, medo ou inércia?
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 16
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

-- ---------------------------------------------------------------------------
-- Quiz da etapa 5: perguntas, alternativas e leituras
-- A chave é a mesma em todas as perguntas: A, B e C apontam para a mesma leitura.
-- ---------------------------------------------------------------------------
-- A pergunta 5 escolhe entre os três portões (desejo, ira e ganância), não entre as tendências
-- A/B/C das perguntas 1 a 4: fica na tela como reflexão, mas não entra no cálculo da leitura.
insert into public.perguntas (etapa_id, ordem, enunciado, conta_no_resultado)
select e.id, v.ordem, v.enunciado, v.conta_no_resultado
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Quando alguém aponta um erro seu, qual reação aparece primeiro?', true),
  (2, 'Quando você tem poder de decisão sobre outras pessoas, tende a:', true),
  (3, 'Diante de um desejo intenso, o que costuma acontecer?', true),
  (4, 'Quando surge um conflito, qual atitude você considera mais construtiva?', true),
  (5, 'Qual dos três portões merece mais atenção em sua vida neste momento?', false)
) as v(ordem, enunciado, conta_no_resultado)
where c.numero = 16 and e.ordem = 5
on conflict (etapa_id, ordem) do update
  set enunciado = excluded.enunciado, conta_no_resultado = excluded.conta_no_resultado;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Escuto, avalio o argumento e reconheço o que procede.'),
  (1, 'B', 'Tento justificar minha posição ou recuperar o controle da situação.'),
  (1, 'C', 'Rejeito a conversa, desqualifico a pessoa ou finjo que não aconteceu.'),
  (2, 'A', 'Considerar critérios, consequências e dignidade de quem será afetado.'),
  (2, 'B', 'Priorizar eficiência e resultado, às vezes sem escutar o suficiente.'),
  (2, 'C', 'Usar a autoridade para evitar questionamentos ou proteger interesses pessoais.'),
  (3, 'A', 'Consigo avaliar se o desejo é coerente com meus valores e responsabilidades.'),
  (3, 'B', 'Tento satisfazê-lo rapidamente e depois avalio as consequências.'),
  (3, 'C', 'Sinto que nunca é suficiente, mesmo depois de conseguir o que queria.'),
  (4, 'A', 'Ser firme sem humilhar, buscar a verdade e reparar o que for necessário.'),
  (4, 'B', 'Vencer a discussão para não parecer fraco.'),
  (4, 'C', 'Evitar qualquer responsabilidade, mesmo quando minha ação contribuiu para o problema.'),
  (5, 'A', 'Desejo compulsivo: querer algo a ponto de perder a medida.'),
  (5, 'B', 'Ira: reagir de modo que fere ou obscurece o julgamento.'),
  (5, 'C', 'Ganância: dificuldade de reconhecer limites e suficiência.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 16 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, chave, texto)
select e.id, v.chave, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  ('A', 'Suas respostas indicam uma tendência a valorizar reflexão, responsabilidade e critérios éticos. O desafio é manter essas qualidades também sob pressão, quando reconhecer um erro ou abrir mão de uma vantagem custa algo.'),
  ('B', 'Suas respostas sugerem que resultado, defesa da posição ou reação imediata podem ganhar força em situações de tensão. Investigue quando a eficiência vira atropelo e quando a firmeza se transforma em necessidade de vencer.'),
  ('C', 'Suas respostas sugerem pontos de atenção ligados a evasão, insaciabilidade ou uso defensivo da autoridade. Em vez de se condenar, escolha um comportamento específico para interromper e uma ação concreta de reparação ou mudança.')
) as v(chave, texto)
where c.numero = 16 and e.ordem = 5
on conflict (etapa_id, chave) do update set texto = excluded.texto;
