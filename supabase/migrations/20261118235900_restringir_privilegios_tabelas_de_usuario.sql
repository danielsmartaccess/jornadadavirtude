-- Jornada da Virtude v2.0 — privilégios mínimos nas tabelas de dados do usuário
--
-- A migração 20261113180000_user_data.sql retirou os privilégios de anon e deu select/insert/
-- update/delete a authenticated, mas não retirou os privilégios que o Supabase concede por
-- padrão a authenticated em tabelas novas de public. Resultado: authenticated ficou também com
-- TRUNCATE (que ignora a RLS e apagaria as linhas de todos os usuários), REFERENCES e TRIGGER.
-- A API do Supabase não expõe TRUNCATE, então não havia caminho pelo app, mas o privilégio é
-- desnecessário e viola o princípio do menor privilégio.
--
-- Esta migração (aditiva; não altera a anterior) retira tudo e devolve só o que o app usa.
-- As funções jv_push_state, jv_pull_state e jv_delete_my_data são security invoker e só
-- precisam de select, insert, update e delete; a RLS por dono continua valendo.
--
-- Já foi aplicado o mesmo ajuste em public.registros (migração 20261118120000).

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'journeys', 'council_sessions', 'council_contributions', 'diary_entries', 'journey_reviews'
  ] loop
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', t);
  end loop;
end $$;
