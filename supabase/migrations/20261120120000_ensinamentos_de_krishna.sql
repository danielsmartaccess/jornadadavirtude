-- Jornada da Virtude v2.0 — Ensinamentos de Krishna (parte final da leitura da Bhagavad Gita)
--
-- Os sete ensinamentos transcritos de um quadro de estudo, como dados. São conteúdo fixo
-- com leitura pública (mesmo regime de capitulos, etapas, perguntas, opcoes e leituras):
-- escrita só pelo dono do banco, nada de dados da pessoa. Independente das migrações
-- anteriores; não altera nenhuma tabela existente.
--
--   ensinamentos         um registro por ponto do quadro (ordem 1 a 7) e as linhas de texto do ponto.
--   ensinamentos_gunas   os três gunas do ponto 5 (sigla, nome e sentido), na ordem do quadro.
--
-- O título da parte, a nota de origem e o esquema desenhado são do app (src/features/gita).

create table public.ensinamentos (
  ordem  integer primary key check (ordem > 0),
  linhas text[] not null check (cardinality(linhas) >= 1 and btrim(array_to_string(linhas, '')) <> '')
);
comment on table public.ensinamentos is 'Pontos do quadro Ensinamentos de Krishna, em ordem. Conteúdo fixo, leitura pública.';
comment on column public.ensinamentos.linhas is 'Linhas de texto do ponto, na ordem em que aparecem.';

create table public.ensinamentos_gunas (
  ensinamento_ordem integer not null references public.ensinamentos (ordem) on delete cascade,
  ordem             integer not null check (ordem > 0),
  sigla             text    not null check (sigla ~ '^[A-Z]$'),
  nome              text    not null check (btrim(nome) <> ''),
  sentido           text    not null check (btrim(sentido) <> ''),
  primary key (ensinamento_ordem, ordem),
  unique (ensinamento_ordem, sigla)
);
comment on table public.ensinamentos_gunas is 'Os três gunas de um ponto do quadro, com o sentido escrito nele. Conteúdo fixo, leitura pública.';

-- ---------------------------------------------------------------------------
-- Conteúdo fixo: leitura pública, escrita bloqueada. revoke all inclui authenticated
-- porque os privilégios padrão do Supabase concedem também TRUNCATE, REFERENCES e TRIGGER.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['ensinamentos', 'ensinamentos_gunas'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select on table public.%I to anon, authenticated', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_leitura_publica', t
    );
  end loop;
end $$;
