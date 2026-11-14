-- Jornada da Virtude v2.0 — dados do usuário (conta opcional e sincronização)
--
-- O catálogo (dimensões, virtudes, pensadores, exercícios) é versionado no
-- repositório, em src/data/*.json. Este esquema guarda apenas o que pertence à
-- pessoa: jornadas, diário, revisões e sessões do Conselho (Documento 06, seção 20).
-- São dados pessoais sensíveis (LGPD): toda tabela tem Row Level Security e só o
-- dono lê ou escreve.
--
-- Desenho: cada linha tem colunas tipadas para chaves, filtros e integridade, e a
-- coluna "doc" com o registro completo no formato do aplicativo. Assim o modelo
-- funcional pode evoluir (Documento 07 em diante) sem uma migração por campo.
-- Ids são gerados no aparelho (texto), por isso a chave é (user_id, id).
-- "position" preserva a ordem de inserção usada nas listagens.

create table public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  revision   integer not null default 0,
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Controle de sincronização por usuário: revision cresce a cada envio aceito.';

create table public.journeys (
  user_id     uuid not null references auth.users (id) on delete cascade,
  id          text not null,
  position    integer not null default 0,
  status      text not null check (status in ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED')),
  virtue_id   text,
  virtue_name text not null default '',
  started_on  date,
  completed_on date,
  archived_at timestamptz,
  doc         jsonb not null,
  primary key (user_id, id)
);
comment on table public.journeys is 'Jornada: ciclo de desenvolvimento de uma virtude. doc guarda intenção, etapas, investigação e exercícios.';

-- Uma jornada ativa por usuário. O arquivamento (archived_at) é atributo próprio e não altera o estado (RN-011).
create unique index journeys_one_active_per_user on public.journeys (user_id) where status = 'ACTIVE';

create table public.council_sessions (
  user_id    uuid not null references auth.users (id) on delete cascade,
  id         text not null,
  position   integer not null default 0,
  date       date not null,
  case_id    text,
  journey_id text,
  doc        jsonb not null,
  primary key (user_id, id),
  foreign key (user_id, journey_id) references public.journeys (user_id, id) on delete set null (journey_id)
);
comment on table public.council_sessions is 'Sessões do Conselho de Sabedoria, vinculadas a uma jornada ou independentes (RN06).';

create index council_sessions_journey on public.council_sessions (user_id, journey_id);

create table public.council_contributions (
  user_id          uuid not null references auth.users (id) on delete cascade,
  session_id       text not null,
  position         integer not null,
  thinker_id       text not null,
  perspective      text not null default '',
  question         text not null default '',
  relevance_reason text not null default '',
  primary key (user_id, session_id, position),
  foreign key (user_id, session_id) references public.council_sessions (user_id, id) on delete cascade
);
comment on table public.council_contributions is 'Perspectivas selecionadas em cada sessão, com a justificativa da convocação (rastreabilidade, Doc. 04).';

create table public.diary_entries (
  user_id     uuid not null references auth.users (id) on delete cascade,
  id          text not null,
  position    integer not null default 0,
  journey_id  text,
  date        date not null,
  type        text not null check (type in ('PRACTICE', 'DIFFICULTY', 'REFLECTION', 'DISCOVERY')),
  virtue_id   text,
  exercise_id text,
  session_id  text,
  doc         jsonb not null,
  primary key (user_id, id),
  foreign key (user_id, journey_id) references public.journeys (user_id, id) on delete set null (journey_id)
);
comment on table public.diary_entries is 'Diário de experiências; aceita registros fora de qualquer jornada (RN05).';

create index diary_entries_journey on public.diary_entries (user_id, journey_id, date);

create table public.journey_reviews (
  user_id    uuid not null references auth.users (id) on delete cascade,
  id         text not null,
  position   integer not null default 0,
  journey_id text not null,
  date       date not null,
  kind       text not null check (kind in ('periodica', 'final', 'legado')),
  doc        jsonb not null,
  primary key (user_id, id),
  foreign key (user_id, journey_id) references public.journeys (user_id, id) on delete cascade
);
comment on table public.journey_reviews is 'Revisões periódicas e finais de uma jornada; cada uma é um item datado (RN08).';

create index journey_reviews_journey on public.journey_reviews (user_id, journey_id, date);

-- ---------------------------------------------------------------------------
-- Segurança: RLS em tudo, acesso apenas do dono autenticado.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'journeys', 'council_sessions', 'council_contributions', 'diary_entries', 'journey_reviews'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon', t);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))',
      t || '_owner', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Envio: substitui o retrato do usuário de forma atômica.
-- Recusa quando a nuvem mudou desde a última leitura deste aparelho.
-- ---------------------------------------------------------------------------
create or replace function public.jv_push_state(p_state jsonb, p_expected_revision integer)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_rev integer;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_state is null or jsonb_typeof(p_state) <> 'object' then
    raise exception 'invalid_state' using errcode = '22023';
  end if;
  if pg_column_size(p_state) > 4000000 then
    raise exception 'state_too_large' using errcode = '54000';
  end if;

  insert into public.profiles (user_id) values (v_uid) on conflict (user_id) do nothing;
  select revision into v_rev from public.profiles where user_id = v_uid for update;

  if p_expected_revision is distinct from v_rev then
    raise exception 'revision_conflict' using errcode = 'P0001', detail = v_rev::text;
  end if;

  -- Revisões e contribuições saem em cascata; diário e sessões podem existir sem
  -- jornada, por isso são apagados explicitamente.
  delete from public.diary_entries where user_id = v_uid;
  delete from public.council_sessions where user_id = v_uid;
  delete from public.journeys where user_id = v_uid;

  insert into public.journeys (user_id, id, position, status, virtue_id, virtue_name, started_on, completed_on, archived_at, doc)
  select v_uid, j.val ->> 'id', j.ord, j.val ->> 'status', nullif(j.val ->> 'virtueId', ''),
         coalesce(j.val ->> 'virtueName', ''), nullif(j.val ->> 'startedOn', '')::date,
         nullif(j.val ->> 'completedOn', '')::date, nullif(j.val ->> 'archivedAt', '')::timestamptz, j.val
  from jsonb_array_elements(coalesce(p_state -> 'journeys', '[]'::jsonb)) with ordinality as j(val, ord);

  insert into public.council_sessions (user_id, id, position, date, case_id, journey_id, doc)
  select v_uid, s.val ->> 'id', s.ord, (s.val ->> 'date')::date, nullif(s.val ->> 'caseId', ''),
         nullif(s.val ->> 'journeyId', ''), s.val
  from jsonb_array_elements(coalesce(p_state -> 'sessions', '[]'::jsonb)) with ordinality as s(val, ord);

  insert into public.council_contributions (user_id, session_id, position, thinker_id, perspective, question, relevance_reason)
  select v_uid, s.val ->> 'id', c.ord, c.val ->> 'thinkerId', coalesce(c.val ->> 'perspective', ''),
         coalesce(c.val ->> 'question', ''), coalesce(c.val ->> 'reason', '')
  from jsonb_array_elements(coalesce(p_state -> 'sessions', '[]'::jsonb)) as s(val)
  cross join lateral jsonb_array_elements(coalesce(s.val -> 'contributions', '[]'::jsonb)) with ordinality as c(val, ord);

  insert into public.diary_entries (user_id, id, position, journey_id, date, type, virtue_id, exercise_id, session_id, doc)
  select v_uid, e.val ->> 'id', e.ord, nullif(e.val ->> 'journeyId', ''), (e.val ->> 'date')::date, e.val ->> 'type',
         nullif(e.val ->> 'virtueId', ''), nullif(e.val ->> 'exerciseId', ''), nullif(e.val ->> 'sessionId', ''), e.val
  from jsonb_array_elements(coalesce(p_state -> 'entries', '[]'::jsonb)) with ordinality as e(val, ord);

  insert into public.journey_reviews (user_id, id, position, journey_id, date, kind, doc)
  select v_uid, r.val ->> 'id', r.ord, r.val ->> 'journeyId', (r.val ->> 'date')::date, r.val ->> 'kind', r.val
  from jsonb_array_elements(coalesce(p_state -> 'reviews', '[]'::jsonb)) with ordinality as r(val, ord);

  update public.profiles set revision = v_rev + 1, updated_at = now() where user_id = v_uid
  returning revision into v_rev;
  return v_rev;
end;
$$;

-- ---------------------------------------------------------------------------
-- Leitura: devolve o retrato no mesmo formato que o aplicativo envia.
-- ---------------------------------------------------------------------------
create or replace function public.jv_pull_state()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with me as (select auth.uid() as uid)
  select jsonb_build_object(
    'revision', coalesce((select p.revision from public.profiles p, me where p.user_id = me.uid), 0),
    'state', jsonb_build_object(
      'schema', 4,
      'journeys', coalesce((select jsonb_agg(j.doc order by j.position) from public.journeys j, me where j.user_id = me.uid), '[]'::jsonb),
      'entries', coalesce((select jsonb_agg(e.doc order by e.position) from public.diary_entries e, me where e.user_id = me.uid), '[]'::jsonb),
      'reviews', coalesce((select jsonb_agg(r.doc order by r.position) from public.journey_reviews r, me where r.user_id = me.uid), '[]'::jsonb),
      'sessions', coalesce((select jsonb_agg(s.doc order by s.position) from public.council_sessions s, me where s.user_id = me.uid), '[]'::jsonb)
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- Direito de exclusão (LGPD): apaga todos os dados do usuário na nuvem.
-- ---------------------------------------------------------------------------
create or replace function public.jv_delete_my_data()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  delete from public.diary_entries where user_id = v_uid;
  delete from public.council_sessions where user_id = v_uid;
  delete from public.journeys where user_id = v_uid;
  delete from public.profiles where user_id = v_uid;
end;
$$;

revoke all on function public.jv_push_state(jsonb, integer) from public, anon;
revoke all on function public.jv_pull_state() from public, anon;
revoke all on function public.jv_delete_my_data() from public, anon;
grant execute on function public.jv_push_state(jsonb, integer) to authenticated;
grant execute on function public.jv_pull_state() to authenticated;
grant execute on function public.jv_delete_my_data() to authenticated;
