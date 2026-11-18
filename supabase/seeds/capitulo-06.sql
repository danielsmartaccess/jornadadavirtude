-- Jornada da Virtude v2.0 — conteúdo do capítulo 6 (Dhyana Yoga)
--
-- Carrega o texto das seis etapas (Markdown), as 5 perguntas do quiz de compreensão (15 alternativas,
-- uma correta em cada pergunta) e as 3 leituras por número de acertos (modo "acertos").
-- Idempotente: upsert por numero, (capitulo_id, ordem), (etapa_id, ordem), (pergunta_id, chave) e
-- (etapa_id, minimo). Não insere registros de usuário.
-- O HTML tem 7 seções: "Mapa do capítulo" e "Conceitos fundamentais" formam a etapa 2.

insert into public.capitulos (numero, titulo)
values (6, 'Dhyana Yoga — O Yoga da Meditação')
on conflict (numero) do update set titulo = excluded.titulo;

insert into public.etapas (capitulo_id, ordem, nome, conteudo_md)
select c.id, v.ordem, v.nome, btrim(v.conteudo_md, E'\n')
from public.capitulos c
cross join (values

(1, 'Contexto histórico e filosófico', $md$
## Contexto histórico e filosófico

No capítulo 6, Krishna aprofunda a disciplina interior. Depois de discutir ação, renúncia e equilíbrio, apresenta a meditação como caminho de autoconhecimento e integração da mente.

### Continuidade do diálogo

Arjuna está tentando compreender como agir corretamente sem ser dominado por desejos, medos e apegos. Krishna esclarece que renunciar não significa simplesmente abandonar atividades externas. A renúncia mais profunda envolve agir sem depender obsessivamente dos frutos da ação.

O capítulo descreve uma prática meditativa: preparar um lugar adequado, manter o corpo estável, orientar a atenção e treinar a mente para retornar ao foco. Também enfrenta uma dificuldade muito humana: a mente é inquieta, poderosa e difícil de controlar.

> **Chave de leitura:** meditação, na Gita, não é fuga do mundo nem anestesia emocional. É treinamento da atenção, da vontade e do discernimento para viver e agir com maior liberdade.
$md$),

(2, 'Conceitos fundamentais', $md$
## Mapa do capítulo: versos por temas

### Versos 1–4 · A verdadeira renúncia e o yoga

Krishna afirma que o verdadeiro renunciante é aquele que age sem apego aos frutos, e não simplesmente quem deixa de realizar ações. A disciplina do yoga exige superar a dependência dos desejos e cultivar uma relação equilibrada com a ação.

### Versos 5–9 · O eu como aliado ou adversário

A pessoa deve elevar a si mesma por meio do próprio esforço. A mente disciplinada torna-se aliada; a mente desgovernada, adversária. O sábio mantém equanimidade diante de prazer e dor, sucesso e fracasso, honra e desonra, amigo e inimigo.

### Versos 10–17 · A prática meditativa e a moderação

Krishna descreve a postura, o lugar e a orientação da meditação. A atenção deve ser recolhida e estável. A disciplina não depende de extremos: alimentação, sono, atividade e repouso precisam de equilíbrio.

### Versos 18–23 · A mente estável e a experiência do yoga

Quando a mente repousa, livre da agitação dos desejos, a pessoa experimenta uma alegria interior que não depende dos estímulos externos. Yoga é apresentado como uma condição de união e liberdade diante do sofrimento.

### Versos 24–28 · Como lidar com a mente dispersa

Os desejos devem ser examinados e gradualmente abandonados. Sempre que a mente se dispersar, deve ser conduzida de volta, com paciência, ao foco escolhido. A prática é repetida, não conquistada de uma vez.

### Versos 29–32 · Ver a si mesmo em todos os seres

A visão meditativa amadurece em percepção de unidade: o praticante reconhece a presença do mesmo princípio em todos os seres e considera o prazer e a dor alheios com sensibilidade comparável à que dedica a si.

### Versos 33–36 · A objeção de Arjuna

Arjuna compara a mente ao vento: inquieta, turbulenta, forte e difícil de controlar. Krishna concorda que a tarefa é difícil, mas afirma que pode ser desenvolvida por meio da prática constante e do desapego.

### Versos 37–47 · O destino de quem não conclui a prática

Arjuna pergunta o que acontece com quem começa o caminho, mas não alcança a perfeição. Krishna responde que o esforço espiritual não se perde e descreve continuidade de aprendizado através de renascimentos. O capítulo termina afirmando a primazia do yogi cuja vida é orientada pela fé, disciplina e interioridade.

## Conceitos fundamentais

- **Dhyana:** meditação ou contemplação sustentada. Envolve recolher a atenção e estabilizá-la, sem confundir concentração com repressão dos pensamentos.
- **Abhyasa:** prática constante. A mente é treinada pelo retorno repetido ao foco, não por uma tentativa isolada de obter controle absoluto.
- **Vairagya:** desapego ou não dependência. Não significa indiferença, mas reduzir a submissão da ação aos desejos e aos resultados esperados.
- **Atman:** o si mesmo ou princípio profundo da identidade espiritual, que não deve ser confundido com o fluxo variável de pensamentos e emoções.
- **Samyama e equilíbrio:** autodomínio e moderação. O capítulo enfatiza equilíbrio no comer, dormir, trabalhar e descansar como condições para a prática.
- **Samadarshana:** visão equânime: reconhecer dignidade e conexão entre os seres, sem reduzir pessoas às diferenças de posição ou circunstância.

### A disciplina descrita pela Gita

| Dimensão | Orientação do capítulo | Sentido prático |
|---|---|---|
| Ambiente | Lugar limpo, estável e apropriado | Reduzir distrações e criar condições para a atenção |
| Postura | Corpo firme, confortável e alinhado | Estabilidade sem tensão desnecessária |
| Atenção | Recolher a mente e mantê-la orientada | Perceber a dispersão e retornar ao foco |
| Hábitos | Moderação na alimentação, sono e atividade | Evitar extremos que prejudiquem a constância |
| Atitude | Prática e desapego | Persistir sem exigir resultados imediatos |
| Ética | Equanimidade e consideração pelos outros | Levar a disciplina interior para as relações |

> **Uma passagem essencial (6.35):** Krishna reconhece que a mente é difícil de dominar, mas afirma que pode ser treinada por prática e desapego. A resposta não é negar a dificuldade: é construir um método para trabalhar com ela.

### O equilíbrio não é passividade

Equanimidade não significa aceitar injustiças, abandonar responsabilidades ou deixar de sentir. Significa não entregar automaticamente o comando das ações a impulsos momentâneos. É possível sentir medo e ainda agir com discernimento; sentir raiva e ainda escolher uma resposta responsável.
$md$),

(3, 'Interpretação filosófica', $md$
## Diálogo com a filosofia ocidental

### Aristóteles · Hábito e formação do caráter

**Convergência:** Aristóteles e a Gita reconhecem que uma vida bem orientada depende de prática, disciplina e formação de disposições estáveis. Não basta conhecer intelectualmente o bem; é preciso formar hábitos que sustentem boas escolhas.

**Diferença:** Aristóteles concentra sua ética na realização humana por meio da virtude e da razão prática. A Gita insere a disciplina meditativa numa visão espiritual de libertação, do Atman e da relação com o divino.

### Estoicismo · Governo das representações

**Convergência:** Epicteto e outros estoicos ensinam a examinar impressões e a distinguir o que depende de nós daquilo que não controlamos. Isso dialoga com o esforço da Gita para reduzir o domínio dos desejos e manter estabilidade diante dos resultados.

**Diferença:** o estoicismo se organiza em torno da razão, da natureza e da virtude, sem exigir a mesma prática devocional ou a mesma metafísica do eu espiritual apresentada pela Gita.

### William James · Atenção e experiência

**Convergência:** James estudou a atenção, os hábitos e a experiência religiosa, reconhecendo a importância da prática na transformação da vida mental. A orientação para retornar a atenção ao foco pode ser comparada ao papel da atenção na psicologia.

**Diferença:** James investiga a experiência por uma abordagem psicológica e pragmática. A Gita apresenta a meditação como caminho espiritual e afirma uma realidade última que ultrapassa a descrição psicológica.

> **Nota de rigor:** essas aproximações são diálogos interpretativos, não prova de que as tradições ensinem a mesma coisa. Cada autor parte de pressupostos próprios sobre mente, liberdade, natureza e finalidade da vida.
$md$),

(4, 'Aplicação prática contemporânea', $md$
## Aplicações contemporâneas

- **Vida pessoal · Treinar o retorno:** ao perceber que a atenção foi capturada por preocupação ou distração, reconheça o desvio e retorne à atividade escolhida. O progresso está no retorno consciente, não em nunca se distrair.
- **Educação · Aprender a sustentar atenção:** organize períodos de estudo focado, pausas e revisão. Ensinar autorregulação é ajudar o estudante a perceber quando perdeu o foco e a reconstruí-lo sem humilhação.
- **Liderança · Responder em vez de reagir:** em situações tensas, faça uma pausa, identifique o impulso inicial e escolha uma resposta coerente com os objetivos e valores. Equanimidade melhora a decisão, não elimina a responsabilidade.
- **Trabalho · Equilibrar desempenho e recuperação:** produtividade sustentável exige ciclos de concentração, descanso e sono. A moderação defendida no capítulo contraria tanto a dispersão permanente quanto a cultura do esgotamento.

### Prática breve de atenção: 5 minutos

1. **Preparar:** sente-se de maneira estável e confortável, num local com poucas interrupções.
2. **Escolher:** use a respiração natural como referência de atenção, sem tentar controlá-la.
3. **Observar:** perceba pensamentos, sons e sensações sem precisar segui-los.
4. **Retornar:** quando notar que se distraiu, volte gentilmente à respiração.
5. **Encerrar:** observe como está e retome suas atividades com intenção.

*Esta é uma adaptação contemporânea simples inspirada no princípio de abhyasa. Não substitui orientação clínica quando necessária e não exige forçar a respiração ou permanecer numa postura desconfortável.*

### Da agitação à escolha consciente

| Situação | Reação automática | Possibilidade de prática |
|---|---|---|
| Receber uma crítica | Defender-se imediatamente | Escutar, separar fato de interpretação e responder depois |
| Falhar numa tarefa | Desistir ou se atacar | Identificar o erro e definir o próximo ajuste |
| Esperar um resultado | Ruminar e tentar controlar tudo | Agir no que depende de você e aceitar a incerteza restante |
| Estudar ou trabalhar | Alternar continuamente entre estímulos | Definir um intervalo de foco e retornar quando dispersar |
$md$),

(5, 'Reflexão pessoal interativa', $md$
## Questionário de reflexão

Responda às cinco questões. A devolutiva verifica a compreensão dos conceitos e propõe uma pergunta para levar à prática. Não é teste psicológico nem avaliação espiritual.

### Reflexão aberta

Em que situação você percebe que sua mente assume o comando antes que você consiga escolher como agir? Qual pequeno exercício de prática e desapego poderia experimentar nessa situação?

*Registre uma situação concreta e uma ação observável para os próximos sete dias. Evite promessas grandiosas: constância costuma nascer de compromissos pequenos.*
$md$),

(6, 'Síntese e versos para revisitar', $md$
## Síntese do capítulo

O capítulo 6 apresenta a meditação como disciplina de autoconhecimento e liberdade. A mente não precisa ser destruída nem obedecida cegamente: precisa ser educada.

Krishna propõe prática constante, desapego e moderação. Reconhece que a mente é difícil de conduzir, mas não considera essa dificuldade uma sentença. A cada dispersão, existe a possibilidade de retorno. E a maturidade da prática aparece também na maneira como enxergamos os outros: com equanimidade e sensibilidade à experiência alheia.

### Versos para revisitar

| Versos | Tema |
|---|---|
| 6.5–6 | a mente pode funcionar como aliada ou adversária. |
| 6.16–17 | equilíbrio nos hábitos sustenta a prática. |
| 6.26 | sempre que a mente se dispersar, conduzi-la de volta. |
| 6.29–32 | a visão de unidade amplia a consideração pelos outros. |
| 6.35 | prática e desapego como resposta à inquietação mental. |
| 6.46–47 | a importância do caminho do yoga e da devoção. |

> **Conexão com o capítulo 7:** depois de apresentar a disciplina da mente, a Gita aprofunda o conhecimento e a realização da natureza divina. A prática meditativa prepara o terreno para investigar o que sustenta a realidade e como reconhecê-lo.
$md$)

) as v(ordem, nome, conteudo_md)
where c.numero = 6
on conflict (capitulo_id, ordem) do update
  set nome = excluded.nome, conteudo_md = excluded.conteudo_md;

update public.etapas e
set quiz_modo = 'acertos', quiz_chave_alvo = null
from public.capitulos c
where c.id = e.capitulo_id and c.numero = 6 and e.ordem = 5;

insert into public.perguntas (etapa_id, ordem, enunciado, chave_correta)
select e.id, v.ordem, v.enunciado, v.chave_correta
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (1, 'Segundo o capítulo 6, quem é o verdadeiro renunciante?', 'B'),
  (2, 'O que significa a mente ser aliada ou adversária?', 'C'),
  (3, 'Qual é a orientação de Krishna sobre alimentação, sono e atividade?', 'A'),
  (4, 'Como lidar com a mente quando ela se dispersa durante a meditação?', 'B'),
  (5, 'Qual resposta Krishna oferece à dificuldade apontada por Arjuna?', 'C')
) as v(ordem, enunciado, chave_correta)
where c.numero = 6 and e.ordem = 5
on conflict (etapa_id, ordem) do update
  set enunciado = excluded.enunciado, chave_correta = excluded.chave_correta;

insert into public.opcoes (pergunta_id, chave, texto)
select p.id, v.chave, v.texto
from public.perguntas p
join public.etapas e on e.id = p.etapa_id
join public.capitulos c on c.id = e.capitulo_id
join (values
  (1, 'A', 'Quem abandona todas as atividades externas.'),
  (1, 'B', 'Quem age sem apego aos frutos da ação.'),
  (1, 'C', 'Quem evita qualquer responsabilidade.'),
  (2, 'A', 'A mente é sempre inimiga e deve ser eliminada.'),
  (2, 'B', 'Apenas pessoas com talento especial conseguem discipliná-la.'),
  (2, 'C', 'Quando disciplinada, favorece o discernimento; sem direção, pode dominar a pessoa.'),
  (3, 'A', 'Buscar moderação e equilíbrio, evitando extremos.'),
  (3, 'B', 'Reduzir todos ao mínimo possível.'),
  (3, 'C', 'Considerá-los irrelevantes para a prática.'),
  (4, 'A', 'Culpar-se e interromper a prática.'),
  (4, 'B', 'Reconhecer a dispersão e conduzi-la de volta, com paciência.'),
  (4, 'C', 'Tentar impedir à força qualquer pensamento.'),
  (5, 'A', 'A mente é impossível de trabalhar.'),
  (5, 'B', 'Basta esperar que a mente se acalme sozinha.'),
  (5, 'C', 'A prática constante e o desapego ajudam a disciplinar a mente.')
) as v(pergunta_ordem, chave, texto) on v.pergunta_ordem = p.ordem
where c.numero = 6 and e.ordem = 5
on conflict (pergunta_id, chave) do update set texto = excluded.texto;

insert into public.leituras (etapa_id, minimo, texto)
select e.id, v.minimo, v.texto
from public.etapas e
join public.capitulos c on c.id = e.capitulo_id
cross join (values
  (5, 'Você compreendeu os principais eixos do capítulo. O desafio agora é transformar essa compreensão em uma prática pequena, regular e observável.'),
  (3, 'Você captou boa parte do argumento. Retome especialmente a relação entre renúncia, moderação, prática constante e desapego.'),
  (0, 'Vale reler o mapa dos versos e os conceitos fundamentais. O capítulo não propõe eliminar a mente, mas educá-la por meio de prática e desapego.')
) as v(minimo, texto)
where c.numero = 6 and e.ordem = 5
on conflict (etapa_id, minimo) where minimo is not null do update set texto = excluded.texto;
