-- Jornada da Virtude v2.0 — quiz de compreensão: leitura pelo número de acertos (capítulo 1 da Gita)
--
-- Além da leitura pela opção mais escolhida (capítulos 14 a 18) e por faixas de uma chave-alvo
-- (capítulos 10 a 13), o capítulo 1 tem um quiz de compreensão: cada pergunta tem uma alternativa
-- correta e a leitura depende de quantas a pessoa acertou (todas; 3 ou mais; menos de 3).
--
--   etapas.quiz_modo       passa a aceitar também 'acertos'.
--   perguntas.chave_correta  chave da alternativa correta (A, B ou C); usada só no modo 'acertos'.
--   leituras.minimo         reaproveitado: no modo 'acertos', número mínimo de acertos para a leitura valer.
--
-- Aditiva: não altera as migrações anteriores nem o comportamento dos outros modos. As tabelas seguem de
-- conteúdo fixo, com leitura pública e escrita bloqueada (grants e políticas anteriores cobrem a coluna nova).

alter table public.etapas drop constraint etapas_quiz_modo_check;
alter table public.etapas
  add constraint etapas_quiz_modo_check check (quiz_modo in ('mais_escolhida', 'faixas', 'acertos'));

alter table public.perguntas
  add column chave_correta text check (chave_correta is null or chave_correta ~ '^[A-Z]$');
comment on column public.perguntas.chave_correta is 'Modo acertos: chave da alternativa correta. Nulo nos demais modos.';
