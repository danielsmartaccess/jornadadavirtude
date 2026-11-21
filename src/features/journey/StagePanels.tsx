/* Conteúdo de cada etapa da jornada (Documento 06, seções 8 a 13).
 * Componentes de apresentação: as regras ficam nos casos de uso e no domínio. */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRun, useUserData } from '../../app/hooks';
import {
  addRelatedVirtue,
  archiveExercise,
  completeJourney,
  deleteReview,
  patchJourney,
  removeRelatedVirtue,
  saveReview,
  selectPrimaryVirtue,
  sessionsOf,
  startExercise,
  touchStage,
} from '../../application/useCases';
import { Accordion, AutoSaveArea, BulletList, Chips, ConfirmButton, Notice, Tag, TextArea, TextInput } from '../../components/ui';
import { categoryLabel, dimensionsOfVirtue, EXERCISE_CATEGORIES, getThinker, getVirtue, thinkersOfVirtue, virtues } from '../../domain/catalog';
import {
  canCompleteJourney,
  compareLegacyReview,
  entryTypeLabel,
  exerciseOptions,
  exerciseStatusLabel,
  INVESTIGATION_BLOCKS,
  isOpenJourney,
  journeyStats,
  REVIEW_QUESTIONS,
  sortByDateDesc,
  validPeriod,
  type ExerciseOption,
} from '../../domain/journey';
import type { Journey, Review, StageId } from '../../domain/types';
import { addDays, formatDate, newId, today } from '../../shared/util';

interface PanelProps {
  journey: Journey;
}

export function StagePanel({ journey, stage }: PanelProps & { stage: StageId }) {
  const Panel = { despertar: Despertar, identificar: Identificar, investigar: Investigar, refletir: Refletir, praticar: Praticar, registrar: Registrar, revisar: Revisar }[stage];
  return <Panel journey={journey} />;
}

/* ------------------------------------------------------------------------- */

function Despertar({ journey }: PanelProps) {
  const run = useRun();
  const open = isOpenJourney(journey);
  const setIntention = (key: keyof Journey['intention']) => (value: string) =>
    run((d) => patchJourney(d, journey.id, { intention: { ...journey.intention, [key]: value } }), 'Intenção salva.');
  return (
    <>
      <AutoSaveArea label="O que motiva você nesta jornada?" value={journey.intention.motivation} onSave={setIntention('motivation')} disabled={!open} hint="Grava automaticamente." />
      <AutoSaveArea label="Situação que você deseja compreender (opcional)" value={journey.intention.situation} onSave={setIntention('situation')} disabled={!open} />
      <AutoSaveArea label="O que você espera aprender (opcional)" value={journey.intention.expectation} onSave={setIntention('expectation')} disabled={!open} rows={2} />
      <AutoSaveArea label="Título da jornada" value={journey.title} onSave={(title) => run((d) => patchJourney(d, journey.id, { title }), 'Título salvo.')} rows={1} disabled={!open} />
      <AutoSaveArea label="Observações gerais sobre a jornada (opcional)" value={journey.notes} onSave={(notes) => run((d) => patchJourney(d, journey.id, { notes }), 'Observações salvas.')} disabled={!open} />
    </>
  );
}

/* ------------------------------------------------------------------------- */

function Identificar({ journey }: PanelProps) {
  const run = useRun();
  const virtue = getVirtue(journey.virtueId ?? '');
  const [changeTo, setChangeTo] = useState('');
  const [relatedTo, setRelatedTo] = useState('');
  const open = isOpenJourney(journey);
  const others = virtues.filter((v) => v.id !== journey.virtueId);
  const changes = journey.history.filter((h) => h.kind === 'virtude-alterada');

  return (
    <>
      <div className="card">
        <p className="label">Virtude principal</p>
        <p className="font-display text-2xl text-accent">{journey.virtueName}</p>
        {virtue ? (
          <>
            <p>{virtue.definition}</p>
            <p className="mt-2">
              <strong>Não confundir com:</strong> {virtue.notConfuse}
            </p>
            <p className="meta mt-2">
              <Link to={`/virtudes/${virtue.id}`}>Fundamentos, comportamentos e referências desta virtude</Link>
            </p>
          </>
        ) : (
          <p className="hint">Virtude definida por você, fora do catálogo: os conteúdos conceituais não estão disponíveis para ela.</p>
        )}
      </div>

      {virtue && (
        <div className="mt-4">
          <p className="label mb-2">Dimensões associadas</p>
          <div className="flex flex-wrap gap-2">
            {dimensionsOfVirtue(virtue.id).map(({ dimension, relation }) => (
              <Link key={dimension.id} to={`/dimensoes/${dimension.id}`} className="chip">
                {dimension.shortName}
                <span className="meta ml-2">{relation.relationType === 'D1' ? 'primária' : 'secundária'}</span>
              </Link>
            ))}
          </div>
          <p className="hint mt-2 text-nota">Referência para interpretar onde a virtude costuma se manifestar. Não é uma classificação sua.</p>
        </div>
      )}

      {open && (
        <>
          <div className="mt-6">
            <p className="label mb-2">Virtudes relacionadas (opcional)</p>
            <div className="flex flex-wrap gap-2">
              {journey.relatedVirtueIds.map((vid) => (
                <button key={vid} type="button" className="chip" onClick={() => run((d) => removeRelatedVirtue(d, journey.id, vid), 'Virtude relacionada removida.')} title="Remover">
                  {getVirtue(vid)?.name} <span className="ml-2" aria-hidden="true">×</span>
                  <span className="sr-only"> (remover)</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <select className="field !w-auto" aria-label="Adicionar virtude relacionada" value={relatedTo} onChange={(e) => setRelatedTo(e.target.value)}>
                <option value="">Adicionar virtude relacionada…</option>
                {others
                  .filter((v) => !journey.relatedVirtueIds.includes(v.id))
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={!relatedTo}
                onClick={() => run((d) => addRelatedVirtue(d, journey.id, relatedTo), 'Virtude relacionada adicionada.') && setRelatedTo('')}
              >
                Adicionar
              </button>
            </div>
            <p className="hint mt-1 text-nota">As relacionadas acompanham a jornada sem substituir a virtude principal.</p>
          </div>

          <Accordion title="Trocar a virtude principal">
            <p className="mb-2">A decisão anterior fica registrada no histórico da jornada. Os registros do diário já feitos mantêm a virtude com que foram criados.</p>
            <div className="flex flex-wrap gap-2">
              <select className="field !w-auto" aria-label="Nova virtude principal" value={changeTo} onChange={(e) => setChangeTo(e.target.value)}>
                <option value="">Escolha a nova virtude…</option>
                {others.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <ConfirmButton
                label="Trocar"
                confirmLabel="Confirmar troca"
                onConfirm={() => {
                  const next = getVirtue(changeTo);
                  if (next && run((d) => selectPrimaryVirtue(d, journey.id, { virtueId: next.id, virtueName: next.name }, today()), 'Virtude principal alterada.')) setChangeTo('');
                }}
              />
            </div>
          </Accordion>
        </>
      )}

      {changes.length > 0 && (
        <div className="mt-4">
          <p className="label mb-1">Alterações da virtude principal</p>
          <ul>
            {changes.map((h, i) => (
              <li key={i} className="meta">
                {formatDate(h.date)} · {h.detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------------- */

function Investigar({ journey }: PanelProps) {
  const run = useRun();
  const virtue = getVirtue(journey.virtueId ?? '');
  const open = isOpenJourney(journey);
  const answer = (qid: string) => (value: string) =>
    run((d) => touchStage(patchJourney(d, journey.id, { investigation: { ...journey.investigation, [qid]: value } }), journey.id, 'investigar', today()), 'Resposta salva.');

  return (
    <>
      <p className="hint mb-3">Quatro blocos, sem ordem obrigatória. As respostas são gravadas automaticamente e podem ser revistas a qualquer momento.</p>
      {INVESTIGATION_BLOCKS.map((block, i) => (
        <Accordion key={block.id} title={`Bloco ${i + 1} — ${block.title}`} open={i === 0}>
          <p className="hint mb-3">{block.intro}</p>
          {block.id === 'compreender' && virtue && (
            <div className="card mb-4">
              <p>{virtue.definition}</p>
              <p className="mt-2">
                <strong>Não confundir com:</strong> {virtue.notConfuse}
              </p>
              <p className="meta mt-2">Referências: {thinkersOfVirtue(virtue.id).map((t) => t.thinker.name).join(', ')}.</p>
            </div>
          )}
          {block.id === 'padroes' && virtue && (
            <div className="card mb-4">
              <p>
                <span className="label">Deficiência</span> {virtue.deficiency}
              </p>
              <p className="mt-2">
                <span className="label">{virtue.excessApparent ? 'Excesso aparente' : 'Excesso'}</span> {virtue.excess}
              </p>
              <p className="label mt-3">Comportamentos que expressam a virtude</p>
              <BulletList items={virtue.behaviors} />
            </div>
          )}
          {block.questions.map((q) => (
            <AutoSaveArea key={q.id} label={q.label} value={journey.investigation[q.id] ?? ''} onSave={answer(q.id)} disabled={!open} />
          ))}
          {block.intake && (
            <Chips
              legend={block.intake.label}
              hint="Toque nas opções, se alguma fizer sentido."
              options={block.intake.options}
              value={journey.intake[block.intake.id]}
              multiple
              allowOther
              onChange={(value) => open && run((d) => patchJourney(d, journey.id, { intake: { ...journey.intake, [block.intake!.id]: value } }))}
            />
          )}
        </Accordion>
      ))}
      <p className="mt-4">
        Quer ampliar a reflexão? <Link to="/jornada?etapa=refletir">Consulte perspectivas no Conselho de Sabedoria</Link>.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------------- */

function Refletir({ journey }: PanelProps) {
  const data = useUserData();
  const sessions = sortByDateDesc(sessionsOf(data, journey.id));
  const thinkers = journey.virtueId ? thinkersOfVirtue(journey.virtueId).filter((t) => t.thinker.council) : [];
  return (
    <>
      <p>
        O Conselho de Sabedoria reúne perspectivas documentadas de pensadores de diferentes tradições sobre uma situação ou dúvida. É um recurso opcional: orienta a reflexão, mas não decide por você. Se não fizer sentido agora, marque esta etapa como “Não aplicável”.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to={`/conselho?jornada=${journey.id}`} className="btn">
          Nova reflexão no Conselho
        </Link>
      </div>
      {thinkers.length > 0 && (
        <div className="mt-6">
          <p className="label mb-2">Referências para {journey.virtueName}</p>
          <div className="flex flex-wrap gap-2">
            {thinkers.map(({ thinker }) => (
              <Link key={thinker.id} to={`/conselho/pensadores/${thinker.id}`} className="chip">
                {thinker.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6">
        <p className="label mb-2">Sessões desta jornada</p>
        {sessions.length === 0 && <p className="hint">Nenhuma sessão ainda.</p>}
        <ul className="grid gap-3">
          {sessions.map((s) => (
            <li key={s.id} className="entry">
              <p className="meta">
                {formatDate(s.date)} · {s.contributions.map((c) => getThinker(c.thinkerId)?.name).filter(Boolean).join(', ')}
              </p>
              <p>
                <Link to={`/conselho/sessoes/${s.id}`}>{s.situation.slice(0, 140) || 'Sessão sem descrição'}</Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------------- */

function ExerciseCard({ journey, option }: PanelProps & { option: ExerciseOption }) {
  const run = useRun();
  const { exercise } = option;
  const own = journey.exercises.find((e) => e.exerciseId === exercise.id);
  const virtue = getVirtue(exercise.virtueIds[0] ?? journey.virtueId ?? '');
  const open = isOpenJourney(journey);
  const active = own && own.state !== 'arquivado';
  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2">
        <Tag accent>{exerciseStatusLabel(journey, exercise.id, option.recommended)}</Tag>
        <Tag>{categoryLabel(exercise.category)}</Tag>
        <Tag>{exercise.duration}</Tag>
      </div>
      <h3 className="mt-2">{exercise.title}</h3>
      <p>{exercise.description}</p>
      <details className="mt-2">
        <summary className="meta">Orientações do exercício</summary>
        <dl className="mt-2 grid gap-2">
          <div>
            <dt className="label">O que pretende desenvolver</dt>
            <dd>{virtue ? `${virtue.name}: ${virtue.definition}` : 'Consciência sobre uma dimensão da própria experiência.'}</dd>
          </div>
          <div>
            <dt className="label">Por que aparece aqui</dt>
            <dd>{option.reason}</dd>
          </div>
          {exercise.steps.length > 0 && (
            <div>
              <dt className="label">Como realizar</dt>
              <dd>
                <BulletList items={exercise.steps} />
              </dd>
            </div>
          )}
          {virtue && (
            <div>
              <dt className="label">O que observar</dt>
              <dd>
                Deficiência: {virtue.deficiency} {virtue.excessApparent ? 'Excesso aparente' : 'Excesso'}: {virtue.excess}
              </dd>
            </div>
          )}
          <div>
            <dt className="label">Como registrar</dt>
            <dd>Use “Registrar experiência”: o registro vai para o diário, ligado a este exercício. Repetir um exercício faz parte da prática e não indica falha.</dd>
          </div>
        </dl>
      </details>
      {open && (
        <div className="mt-3 flex flex-wrap gap-2">
          {!active && (
            <button type="button" className="btn btn-sm" onClick={() => run((d) => startExercise(d, journey.id, exercise.id, today()), 'Exercício associado à jornada.')}>
              Iniciar exercício
            </button>
          )}
          {active && (
            <>
              <Link to={`/diario?novo=1&exercicio=${exercise.id}`} className="btn btn-sm">
                Registrar experiência
              </Link>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => run((d) => archiveExercise(d, journey.id, exercise.id), 'Exercício arquivado.')}>
                Arquivar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Praticar({ journey }: PanelProps) {
  const run = useRun();
  const options = exerciseOptions(journey.virtueId, journey.relatedVirtueIds);
  const mine = options.filter((o) => journey.exercises.some((e) => e.exerciseId === o.exercise.id));
  const recommended = options.filter((o) => o.recommended && !mine.includes(o));
  const rest = options.filter((o) => !o.recommended && !mine.includes(o));
  return (
    <>
      <AutoSaveArea
        label="Meu compromisso de prática"
        hint="Que comportamento concreto vai expressar esta virtude? Em que situação? Que obstáculo pode aparecer?"
        value={journey.plan}
        disabled={!isOpenJourney(journey)}
        onSave={(plan) => run((d) => touchStage(patchJourney(d, journey.id, { plan }), journey.id, 'praticar', today()), 'Compromisso salvo.')}
      />
      {mine.length > 0 && (
        <>
          <p className="label mb-2 mt-2">Exercícios desta jornada</p>
          <div className="grid gap-3">
            {mine.map((o) => (
              <ExerciseCard key={o.exercise.id} journey={journey} option={o} />
            ))}
          </div>
        </>
      )}
      <p className="label mb-2 mt-6">Recomendados para {journey.virtueName}</p>
      {recommended.length === 0 && <p className="hint">Todos os exercícios recomendados já estão na jornada.</p>}
      <div className="grid gap-3">
        {recommended.map((o) => (
          <ExerciseCard key={o.exercise.id} journey={journey} option={o} />
        ))}
      </div>
      <p className="label mb-1 mt-6">Outros exercícios do catálogo</p>
      <p className="hint text-nota">Você pode escolher exercícios diferentes dos recomendados.</p>
      {EXERCISE_CATEGORIES.map((category) => {
        const list = rest.filter((o) => o.exercise.category === category.id);
        if (!list.length) return null;
        return (
          <Accordion key={category.id} title={`${category.label} (${list.length})`}>
            <div className="grid gap-3">
              {list.map((o) => (
                <ExerciseCard key={o.exercise.id} journey={journey} option={o} />
              ))}
            </div>
          </Accordion>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------------- */

function Registrar({ journey }: PanelProps) {
  const data = useUserData();
  const entries = sortByDateDesc(data.entries.filter((e) => e.journeyId === journey.id));
  return (
    <>
      <p>O diário recebe registros em qualquer etapa. É voluntário: a ausência de registros não significa ausência de prática, e não impede a continuidade da jornada.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/diario?novo=1" className="btn">
          Novo registro
        </Link>
        <Link to={`/diario?jornada=${journey.id}`} className="btn btn-ghost">
          Ver registros desta jornada ({entries.length})
        </Link>
      </div>
      <ul className="mt-5 grid gap-3">
        {entries.slice(0, 5).map((e) => (
          <li key={e.id} className="entry">
            <p className="meta">
              {formatDate(e.date)} · {entryTypeLabel(e.type)}
            </p>
            <p>{e.situation}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ------------------------------------------------------------------------- */

function blankReview(journeyId: string): Review {
  return {
    id: newId(), journeyId, kind: 'periodica', date: today(), periodStart: addDays(today(), -6), periodEnd: today(), answers: {}, synthesis: '',
    learnings: '', perception: '', firstWeek: '', lastWeek: '', moments: [], createdAt: '', updatedAt: '',
  };
}

function ReviewItem({ review, canDelete }: { review: Review; canDelete: boolean }) {
  const run = useRun();
  const kind = review.kind === 'final' ? 'Revisão final' : review.kind === 'legado' ? 'Revisão da versão anterior' : 'Revisão periódica';
  return (
    <li className="entry">
      <p className="meta">
        {formatDate(review.date)} · {kind}
        {validPeriod(review.periodStart, review.periodEnd) && ` · período de ${formatDate(review.periodStart)} a ${formatDate(review.periodEnd)}`}
      </p>
      {REVIEW_QUESTIONS.map((q) => review.answers[q.id]?.trim() && (
        <p key={q.id}>
          <span className="label">{q.label}</span>
          {review.answers[q.id]}
        </p>
      ))}
      {review.learnings.trim() && <p><span className="label">Aprendizados</span>{review.learnings}</p>}
      {review.perception.trim() && <p><span className="label">Como compreendo a virtude agora</span>{review.perception}</p>}
      {review.synthesis.trim() && <p><span className="label">Síntese pessoal</span>{review.synthesis}</p>}
      {review.kind === 'legado' && <p>{compareLegacyReview(review.firstWeek, review.lastWeek)}</p>}
      {review.moments.length > 0 && <p className="meta">Momentos em que percebi a virtude: {review.moments.join(', ')}</p>}
      {canDelete && (
        <div className="mt-2">
          <ConfirmButton label="Excluir revisão" confirmLabel="Confirmar exclusão" onConfirm={() => run((d) => deleteReview(d, review.id), 'Revisão excluída.')} />
        </div>
      )}
    </li>
  );
}

function Revisar({ journey }: PanelProps) {
  const data = useUserData();
  const run = useRun();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Review>(() => blankReview(journey.id));
  const [final, setFinal] = useState({ learnings: '', perception: '', synthesis: '' });
  const [closing, setClosing] = useState(false);
  const open = isOpenJourney(journey);
  const reviews = sortByDateDesc(data.reviews.filter((r) => r.journeyId === journey.id));
  const stats = journeyStats(journey, data);
  const inPeriod = validPeriod(draft.periodStart, draft.periodEnd)
    ? sortByDateDesc(data.entries.filter((e) => e.journeyId === journey.id && e.date >= draft.periodStart && e.date <= draft.periodEnd))
    : [];

  function savePeriodic() {
    if (run((d) => saveReview(d, draft, today()), 'Revisão guardada.')) setDraft(blankReview(journey.id));
  }

  function conclude() {
    const review: Review = { ...blankReview(journey.id), kind: 'final', periodStart: journey.startedOn, ...final };
    if (run((d) => completeJourney(d, review, today()), 'Jornada concluída. Ela continua disponível no histórico.')) navigate(`/historico/${journey.id}`);
  }

  return (
    <>
      {open && (
        <Accordion title="Nova revisão periódica" open={reviews.length === 0}>
          <div className="grid gap-x-3 sm:grid-cols-2">
            <TextInput label="Início do período" type="date" value={draft.periodStart} onChange={(periodStart) => setDraft({ ...draft, periodStart })} />
            <TextInput label="Fim do período" type="date" value={draft.periodEnd} onChange={(periodEnd) => setDraft({ ...draft, periodEnd })} />
          </div>
          <p className="label mb-1">Registros do período ({inPeriod.length})</p>
          {inPeriod.length === 0 ? (
            <p className="hint mb-4">Nenhum registro no período. A revisão pode ser feita mesmo assim: vale o que você percebeu.</p>
          ) : (
            <ul className="mb-4 grid gap-1">
              {inPeriod.slice(0, 8).map((e) => (
                <li key={e.id} className="meta">
                  {formatDate(e.date)} · {entryTypeLabel(e.type)} · {e.situation}
                </li>
              ))}
            </ul>
          )}
          {REVIEW_QUESTIONS.map((q) => (
            <TextArea key={q.id} label={q.label} rows={2} value={draft.answers[q.id] ?? ''} onChange={(value) => setDraft({ ...draft, answers: { ...draft.answers, [q.id]: value } })} />
          ))}
          <TextArea label="Síntese pessoal do período" value={draft.synthesis} onChange={(synthesis) => setDraft({ ...draft, synthesis })} />
          <button type="button" className="btn" onClick={savePeriodic}>
            Guardar revisão
          </button>
          <p className="hint mt-2 text-nota">Cada revisão fica guardada com data própria. A plataforma não transforma revisões em notas.</p>
        </Accordion>
      )}

      <div className="mt-6">
        <p className="label mb-2">Revisões guardadas ({reviews.length})</p>
        {reviews.length === 0 && <p className="hint">Nenhuma revisão ainda.</p>}
        <ul className="grid gap-4">
          {reviews.map((r) => (
            <ReviewItem key={r.id} review={r} canDelete={open} />
          ))}
        </ul>
      </div>

      {canCompleteJourney(journey) && (
        <div className="rule-top mt-8">
          <h3>Como você quer seguir?</h3>
          <p className="hint mb-3">Continuar, fazer uma pausa ou concluir este ciclo. A escolha é sua, e nenhuma delas é melhor que as outras.</p>
          {!closing ? (
            <button type="button" className="btn btn-ghost" onClick={() => setClosing(true)}>
              Fazer a revisão final e concluir a jornada
            </button>
          ) : (
            <div>
              <p className="label">Parte 1 — Minha intenção inicial</p>
              <p className="mb-4">{journey.intention.motivation}</p>
              <p className="label">Parte 2 — Minhas experiências</p>
              <p className="mb-4">
                {stats.entries} registros no diário em {stats.daysWithEntries} dias, {stats.exercisesTried} exercícios experimentados, {stats.reviews} revisões e {stats.sessions} sessões do Conselho.{' '}
                <span className="hint">São atividades registradas, não uma medida do seu desenvolvimento.</span>
              </p>
              <TextArea label="Parte 3 — Meus aprendizados" hint="Mudanças percebidas e dificuldades que permanecem." value={final.learnings} onChange={(learnings) => setFinal({ ...final, learnings })} />
              <TextArea label="Parte 4 — Como compreendo esta virtude agora" value={final.perception} onChange={(perception) => setFinal({ ...final, perception })} />
              <TextArea label="Parte 5 — Síntese pessoal da jornada" hint="Obrigatória para concluir." value={final.synthesis} onChange={(synthesis) => setFinal({ ...final, synthesis })} />
              <Notice>
                Concluir encerra este ciclo: a jornada vai para o histórico com todos os registros e não volta a ficar ativa. Isso não significa domínio definitivo da virtude, e você pode iniciar outra jornada com ela quando quiser.
              </Notice>
              <div className="flex flex-wrap gap-3">
                <ConfirmButton className="btn" label="Concluir a jornada" confirmLabel="Confirmar conclusão" onConfirm={conclude} />
                <button type="button" className="btn btn-ghost" onClick={() => setClosing(false)}>
                  Continuar a jornada
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
