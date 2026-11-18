-- Jornada da Virtude v2.0 — quiz com leitura por faixas (capítulos 11, 12 e 13 da Gita)
--
-- Até aqui a leitura de um quiz é por opção: a chave (A, B ou C) mais escolhida define a leitura e,
-- em empate, mostram-se as empatadas (capítulos 14 a 18). Nos capítulos 11, 12 e 13 as alternativas
-- têm outra lógica: a "C" é sempre a alinhada ao ensinamento, e a leitura depende de QUANTAS vezes
-- ela foi escolhida (4 ou mais, 2 ou 3, menos de 2). Esta migração acrescenta esse segundo modo,
-- sem alterar o primeiro:
--
--   etapas.quiz_modo        'mais_escolhida' (padrão) ou 'faixas'.
--   etapas.quiz_chave_alvo  chave contada no modo 'faixas' (por exemplo, 'C').
--   leituras.minimo         no modo 'faixas', a leitura vale a partir de tantas escolhas da chave-alvo;
--                           vence a faixa com maior mínimo atingido (o mínimo 0 cobre o restante).
--   leituras.chave          passa a ser opcional: uma leitura tem chave (modo 'mais_escolhida') ou
--                           mínimo (modo 'faixas'), nunca os dois.
--
-- Aditiva: as tabelas continuam de conteúdo fixo, com leitura pública e escrita bloqueada (os grants
-- e as políticas das migrações anteriores já cobrem as colunas novas).

alter table public.etapas
  add column quiz_modo text not null default 'mais_escolhida'
    check (quiz_modo in ('mais_escolhida', 'faixas')),
  add column quiz_chave_alvo text
    check (quiz_chave_alvo is null or quiz_chave_alvo ~ '^[A-Z]$'),
  add constraint etapas_faixas_exigem_chave_alvo
    check (quiz_modo <> 'faixas' or quiz_chave_alvo is not null);
comment on column public.etapas.quiz_modo is 'Como o quiz da etapa vira leitura: mais_escolhida (opção mais escolhida) ou faixas (contagem da chave-alvo).';
comment on column public.etapas.quiz_chave_alvo is 'No modo faixas, a chave cujas escolhas são contadas.';

alter table public.leituras
  alter column chave drop not null,
  add column minimo integer check (minimo >= 0),
  add constraint leituras_chave_ou_minimo
    check ((chave is not null and minimo is null) or (chave is null and minimo is not null));
comment on column public.leituras.minimo is 'No modo faixas, número mínimo de escolhas da chave-alvo para esta leitura valer.';

create unique index leituras_etapa_minimo on public.leituras (etapa_id, minimo) where minimo is not null;
