-- Jornada da Virtude v2.0 — conteúdo dos Ensinamentos de Krishna
--
-- Carrega os 7 pontos do quadro de estudo e os 3 gunas do ponto 5. Idempotente: o upsert é
-- por ordem em ensinamentos e por (ensinamento_ordem, ordem) em ensinamentos_gunas. Rodar de
-- novo atualiza o texto e não duplica nada. Não insere registros de usuário.
-- Pré-requisito: migração 20261120120000_ensinamentos_de_krishna.sql aplicada.
-- O texto é a transcrição do quadro, sem acréscimos.

insert into public.ensinamentos (ordem, linhas) values
  (1, array['Despertar consciência']),
  (2, array['Medo → coragem', 'Dúvidas → decisão']),
  (3, array['Teoria da reencarnação']),
  (4, array['Imortalidade da alma']),
  (5, array['3 gunas']),
  (6, array['Reta-ação → agir por dever, sem esperar nada em troca']),
  (7, array['Sacrifício da sabedoria – esforço'])
on conflict (ordem) do update set linhas = excluded.linhas;

insert into public.ensinamentos_gunas (ensinamento_ordem, ordem, sigla, nome, sentido) values
  (5, 1, 'R', 'Rajas', 'impulsividade'),
  (5, 2, 'S', 'Satwa', 'justo meio'),
  (5, 3, 'T', 'Tamas', 'inércia')
on conflict (ensinamento_ordem, ordem) do update
  set sigla = excluded.sigla, nome = excluded.nome, sentido = excluded.sentido;
