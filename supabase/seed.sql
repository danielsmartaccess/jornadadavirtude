-- Jornada da Virtude v2.0 — seed do módulo de leitura da Bhagavad Gita
--
-- Insere os 18 capítulos e as seis etapas de cada um (108 linhas em etapas).
-- Só estrutura: o texto de cada etapa fica para uma fase posterior.
-- Idempotente: pode ser rodado de novo sem duplicar; reaplica títulos e nomes.
-- Mantenha em sincronia com src/data/gita-capitulos.json e src/domain/gita.ts
-- (tests/unit/gita.test.ts confere).

insert into public.capitulos (numero, titulo) values
  (1,  'Arjuna Vishada Yoga — O desalento de Arjuna'),
  (2,  'Sankhya Yoga — O yoga do conhecimento'),
  (3,  'Karma Yoga — O yoga da ação'),
  (4,  'Jnana Karma Sannyasa Yoga — Conhecimento e renúncia da ação'),
  (5,  'Karma Sannyasa Yoga — O yoga da renúncia'),
  (6,  'Dhyana Yoga — O yoga da meditação'),
  (7,  'Jnana Vijnana Yoga — Conhecimento e discernimento'),
  (8,  'Akshara Brahma Yoga — O Absoluto imperecível'),
  (9,  'Raja Vidya Raja Guhya Yoga — O conhecimento real e o segredo real'),
  (10, 'Vibhuti Yoga — As manifestações divinas'),
  (11, 'Vishvarupa Darshana Yoga — A visão da forma universal'),
  (12, 'Bhakti Yoga — O yoga da devoção'),
  (13, 'Kshetra Kshetrajna Vibhaga Yoga — O campo e o conhecedor do campo'),
  (14, 'Gunatraya Vibhaga Yoga — As três qualidades da natureza'),
  (15, 'Purushottama Yoga — O Espírito supremo'),
  (16, 'Daivasura Sampad Vibhaga Yoga — Disposições divinas e demoníacas'),
  (17, 'Shraddhatraya Vibhaga Yoga — As três formas de fé'),
  (18, 'Moksha Sannyasa Yoga — A libertação pela renúncia')
on conflict (numero) do update set titulo = excluded.titulo;

insert into public.etapas (capitulo_id, ordem, nome)
select c.id, e.ordem, e.nome
from public.capitulos c
cross join (values
  (1, 'Contexto histórico e filosófico'),
  (2, 'Conceitos fundamentais'),
  (3, 'Interpretação filosófica'),
  (4, 'Aplicação prática contemporânea'),
  (5, 'Reflexão pessoal interativa'),
  (6, 'Síntese e versos para revisitar')
) as e(ordem, nome)
on conflict (capitulo_id, ordem) do update set nome = excluded.nome;
