-- Jornada da Virtude v2.0 — módulo de leitura da Bhagavad Gita
--
-- Uma jornada de leitura em 18 etapas de capítulo; cada capítulo tem seis etapas
-- de estudo. Duas camadas com regras de acesso diferentes:
--
--   * capitulos e etapas: conteúdo fixo e público. Leitura aberta; escrita só pelo
--     dono do banco (migrações e seed), nunca pela API.
--   * registros: texto escrito pela pessoa durante a leitura. Dado pessoal (LGPD):
--     RLS com quatro políticas, apenas o dono lê e escreve.
--
-- Esta migração é independente de 20261113180000_user_data.sql e não a altera.
-- O conteúdo (os 18 capítulos e as seis etapas de cada um) está em supabase/seed.sql.

create table public.capitulos (
  id     integer generated always as identity primary key,
  numero integer not null unique check (numero between 1 and 18),
  titulo text not null check (btrim(titulo) <> '')
);
comment on table public.capitulos is 'Os 18 capítulos da Bhagavad Gita. Conteúdo fixo, leitura pública.';

create table public.etapas (
  id          integer generated always as identity primary key,
  capitulo_id integer not null references public.capitulos (id) on delete cascade,
  ordem       integer not null check (ordem > 0),
  nome        text not null check (btrim(nome) <> ''),
  unique (capitulo_id, ordem)
);
comment on table public.etapas is 'Etapas de estudo de cada capítulo, em ordem. Conteúdo fixo, leitura pública.';

create table public.registros (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users (id) on delete cascade,
  -- restrict: apagar uma etapa nunca leva junto o que a pessoa escreveu.
  etapa_id  integer not null references public.etapas (id) on delete restrict,
  texto     text not null,
  criado_em timestamptz not null default now()
);
comment on table public.registros is 'Anotações da pessoa em cada etapa. Dado pessoal: só o dono lê e escreve.';

create index registros_user_etapa on public.registros (user_id, etapa_id, criado_em);

-- ---------------------------------------------------------------------------
-- registros: RLS, acesso apenas do dono autenticado (quatro políticas).
-- ---------------------------------------------------------------------------
alter table public.registros enable row level security;

-- Supabase concede todos os privilégios (inclusive truncate) por padrão: retira de ambos e devolve só o necessário.
revoke all on table public.registros from anon, authenticated;
grant select, insert, update, delete on table public.registros to authenticated;

create policy registros_select on public.registros
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy registros_insert on public.registros
  for insert to authenticated
  with check (user_id = (select auth.uid()));

-- with check impede reatribuir a linha a outro usuário.
create policy registros_update on public.registros
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy registros_delete on public.registros
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- capitulos e etapas: conteúdo fixo, sem RLS restritiva.
--
-- A chave publishable do app é pública (src/config.ts). No Supabase, tabela de
-- public sem proteção de escrita ficaria editável por qualquer visitante, então:
--   1) as permissões de escrita são retiradas de anon e authenticated;
--   2) a RLS fica ligada só com uma política de leitura aberta (using true), que
--      não restringe ninguém de ler. Sem políticas de escrita, a API não grava.
-- ---------------------------------------------------------------------------
alter table public.capitulos enable row level security;
alter table public.etapas enable row level security;

revoke all on table public.capitulos from anon, authenticated;
revoke all on table public.etapas from anon, authenticated;
grant select on table public.capitulos to anon, authenticated;
grant select on table public.etapas to anon, authenticated;

create policy capitulos_leitura_publica on public.capitulos
  for select to anon, authenticated
  using (true);

create policy etapas_leitura_publica on public.etapas
  for select to anon, authenticated
  using (true);
