-- Jornada da Virtude v2.0 — conteúdo das etapas e quiz de reflexão (Bhagavad Gita)
--
-- Acrescenta o texto de cada etapa (Markdown) e o quiz da etapa de reflexão como
-- dados. Não altera as migrações anteriores: só adiciona uma coluna em etapas e
-- três tabelas novas, todas de conteúdo fixo com leitura pública (mesmo regime de
-- capitulos e etapas). O que a pessoa responde ou escreve fica em registros.
--
--   etapas.conteudo_md  texto da etapa em Markdown (a interface é do app; sem HTML).
--   perguntas           enunciado de cada pergunta do quiz de uma etapa.
--   opcoes              alternativas de cada pergunta, identificadas por chave (A, B, C).
--   leituras            texto de leitura de cada chave, usado no resultado do quiz.
--
-- A regra de resultado (a chave mais escolhida define a leitura; em empate, mostram-se
-- as chaves empatadas) é do app (src/domain/gita.ts), não do banco.

alter table public.etapas
  add column conteudo_md text check (conteudo_md is null or btrim(conteudo_md) <> '');
comment on column public.etapas.conteudo_md is 'Texto da etapa em Markdown (GFM). Nulo enquanto o conteúdo não foi carregado.';

create table public.perguntas (
  id        integer generated always as identity primary key,
  etapa_id  integer not null references public.etapas (id) on delete cascade,
  ordem     integer not null check (ordem > 0),
  enunciado text not null check (btrim(enunciado) <> ''),
  unique (etapa_id, ordem)
);
comment on table public.perguntas is 'Perguntas do quiz de reflexão de uma etapa. Conteúdo fixo, leitura pública.';

create table public.opcoes (
  id          integer generated always as identity primary key,
  pergunta_id integer not null references public.perguntas (id) on delete cascade,
  chave       text not null check (chave ~ '^[A-Z]$'),
  texto       text not null check (btrim(texto) <> ''),
  unique (pergunta_id, chave)
);
comment on table public.opcoes is 'Alternativas de uma pergunta. A mesma chave em perguntas diferentes aponta para a mesma leitura.';

create table public.leituras (
  id       integer generated always as identity primary key,
  etapa_id integer not null references public.etapas (id) on delete cascade,
  chave    text not null check (chave ~ '^[A-Z]$'),
  texto    text not null check (btrim(texto) <> ''),
  unique (etapa_id, chave)
);
comment on table public.leituras is 'Leitura exibida quando a chave é a mais escolhida no quiz da etapa.';

-- ---------------------------------------------------------------------------
-- Conteúdo fixo: leitura pública, escrita bloqueada (igual a capitulos e etapas).
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['perguntas', 'opcoes', 'leituras'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select on table public.%I to anon, authenticated', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_leitura_publica', t
    );
  end loop;
end $$;
