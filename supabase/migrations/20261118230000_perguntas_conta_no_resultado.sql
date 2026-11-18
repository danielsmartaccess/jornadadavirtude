-- Jornada da Virtude v2.0 — pergunta do quiz que não entra no cálculo da leitura
--
-- Em alguns quizzes uma pergunta tem alternativas em outra escala (por exemplo, a pergunta 5
-- do capítulo 16 escolhe entre três "portões", não entre as tendências A/B/C das demais).
-- Contá-la distorceria a leitura. A coluna marca a pergunta como só de reflexão: ela aparece
-- na tela, mas a escolha não soma no resultado. Aditiva e com padrão true, não altera as
-- migrações anteriores nem o comportamento dos quizzes já carregados. O grant de leitura de
-- perguntas (migração 20261118180000) já cobre a coluna nova.

alter table public.perguntas
  add column conta_no_resultado boolean not null default true;
comment on column public.perguntas.conta_no_resultado is 'false: a pergunta é só de reflexão e a escolha não entra no cálculo da leitura do quiz.';
