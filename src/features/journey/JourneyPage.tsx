/* Tela 04 — Minha Jornada (Documento 06, seção 8; RF-012 a RF-022; US-007). */
import { Link, useSearchParams } from 'react-router-dom';
import { useRun, useUserData } from '../../app/hooks';
import { discardDraft, focusJourney, pauseJourney, resumeJourney, setStageState, startJourney } from '../../application/useCases';
import { ConfirmButton, EmptyState, PageHeader, Section, Tag } from '../../components/ui';
import {
  canDiscardJourney,
  canPauseJourney,
  canResumeJourney,
  canStartJourney,
  currentStage,
  getStage,
  nextAction,
  sortByDateDesc,
  STAGE_IDS,
  STAGE_STATES,
  STAGES,
  STATUS_LABEL,
  workedStages,
} from '../../domain/journey';
import type { StageId, StageState } from '../../domain/types';
import { formatDate, today } from '../../shared/util';
import { StagePanel } from './StagePanels';

export function JourneyPage() {
  const data = useUserData();
  const run = useRun();
  const [params, setParams] = useSearchParams();
  const journey = focusJourney(data);

  if (!journey) {
    return (
      <>
        <PageHeader crumbs={[{ label: 'Minha Jornada' }]} title="Minha Jornada" />
        <EmptyState title="Nenhuma jornada em andamento">
          <p>A jornada organiza o desenvolvimento de uma virtude: intenção, investigação, prática, registro e revisão.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 not-italic">
            <Link to="/jornada/nova" className="btn">
              Iniciar minha jornada
            </Link>
            <Link to="/virtudes" className="btn btn-ghost">
              Explorar as virtudes
            </Link>
            {data.journeys.length > 0 && (
              <Link to="/historico" className="btn btn-ghost">
                Ver histórico
              </Link>
            )}
          </div>
        </EmptyState>
      </>
    );
  }

  const requested = params.get('etapa') as StageId | null;
  const stageId: StageId = requested && STAGE_IDS.includes(requested) ? requested : (currentStage(journey)?.id ?? 'revisar');
  const stage = getStage(stageId);
  const progress = journey.stages[stageId];
  const lastEntry = sortByDateDesc(data.entries.filter((e) => e.journeyId === journey.id))[0];
  const lastReview = sortByDateDesc(data.reviews.filter((r) => r.journeyId === journey.id))[0];
  const suggestion = nextAction(journey);
  const id = journey.id;

  return (
    <>
      <PageHeader crumbs={[{ label: 'Minha Jornada', to: '/jornada' }, { label: stage.name }]} title={journey.title}>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Tag accent>{STATUS_LABEL[journey.status]}</Tag>
          <span className="meta">
            virtude principal: <Link to={`/virtudes/${journey.virtueId ?? ''}`}>{journey.virtueName}</Link>
            {journey.startedOn && ` · início em ${formatDate(journey.startedOn)}`}
          </span>
        </div>
        <p className="mt-3">
          <span className="label">Intenção inicial</span>
          {journey.intention.motivation}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {canStartJourney(journey) && (
            <button type="button" className="btn" onClick={() => run((d) => startJourney(d, id, today(), { pauseActive: true }), 'Jornada iniciada.')}>
              Iniciar a jornada
            </button>
          )}
          {canResumeJourney(journey) && (
            <button type="button" className="btn" onClick={() => run((d) => resumeJourney(d, id, today(), { pauseActive: true }), 'Jornada retomada.')}>
              Retomar a jornada
            </button>
          )}
          {canPauseJourney(journey) && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => run((d) => pauseJourney(d, id, today()), 'Jornada pausada. Você pode retomá-la quando quiser.')}>
              Pausar
            </button>
          )}
          {canDiscardJourney(journey) && <ConfirmButton label="Descartar rascunho" confirmLabel="Confirmar descarte" onConfirm={() => run((d) => discardDraft(d, id), 'Rascunho descartado.')} />}
          <Link to="/jornada/nova" className="btn btn-ghost btn-sm">
            Nova jornada
          </Link>
        </div>
        {journey.status === 'DRAFT' && <p className="hint mt-2 text-[0.95rem]">Rascunho: você pode editar tudo antes de iniciar.</p>}
        {journey.status === 'PAUSED' && <p className="hint mt-2 text-[0.95rem]">Jornada pausada. Pausar faz parte do percurso; nada foi perdido.</p>}
      </PageHeader>

      <nav aria-label="Etapas da jornada" className="rule-top">
        <p className="label mb-2">
          Etapas trabalhadas: {workedStages(journey)} de 7 <span className="normal-case tracking-normal">· indica participação no percurso, não uma nota</span>
        </p>
        {/* Percurso: cada etapa é um marco numa linha. A cor da régua indica o estado (com texto e símbolo, nunca só cor). */}
        <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          {STAGES.map((s, i) => {
            const state = journey.stages[s.id].state;
            const current = s.id === stageId;
            const rule = state === 'concluida' ? 'border-ink' : state === 'em-andamento' || state === 'retomada' ? 'border-accent' : 'border-rule';
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={`group flex min-h-[72px] w-full flex-col items-start gap-1 border-t-[3px] px-2 pb-2 pt-2.5 text-left transition-colors hover:bg-panel ${rule} ${current ? 'bg-panel' : ''}`}
                  aria-current={current ? 'step' : undefined}
                  title={`${s.name}: ${STAGE_STATES[state].label}`}
                  onClick={() => setParams({ etapa: s.id }, { replace: true })}
                >
                  <span className={`font-mono text-[11px] tracking-wider ${current ? 'text-accent' : 'text-muted'}`}>
                    {String(i + 1).padStart(2, '0')} <span aria-hidden="true">{STAGE_STATES[state].symbol}</span>
                  </span>
                  <span className="text-[15px] leading-snug">{s.name}</span>
                  <span className="sr-only">: {STAGE_STATES[state].label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section aria-labelledby="etapa-atual" className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="etapa-atual">{stage.name}</h2>
            <p className="hint">
              {stage.hint}
              {stage.reference && ` Referência inicial do método: ${stage.reference}. O ritmo é seu.`}
            </p>
          </div>
          <div>
            <label className="label mb-1" htmlFor="estado-etapa">
              Estado da etapa
            </label>
            <select
              id="estado-etapa"
              className="field !w-auto"
              value={progress.state}
              onChange={(e) => run((d) => setStageState(d, id, stageId, e.target.value as StageState, today()), 'Estado da etapa atualizado.')}
            >
              {(Object.keys(STAGE_STATES) as StageState[]).map((state) => (
                <option key={state} value={state}>
                  {STAGE_STATES[state].symbol} {STAGE_STATES[state].label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="hint mt-1 text-[0.95rem]">Concluir uma etapa significa que uma atividade foi realizada, não que a virtude foi adquirida. As etapas podem ser revisitadas.</p>
        <div className="mt-5">
          <StagePanel journey={journey} stage={stageId} />
        </div>
      </section>

      <Section title="Continuidade">
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="label">Próxima ação sugerida</dt>
            <dd>
              <Link to={`/jornada?etapa=${suggestion.stage}`}>{suggestion.text}</Link>
            </dd>
          </div>
          <div>
            <dt className="label">Último registro</dt>
            <dd>{lastEntry ? `${formatDate(lastEntry.date)} · ${lastEntry.situation}` : 'Nenhum ainda.'}</dd>
          </div>
          <div>
            <dt className="label">Última revisão</dt>
            <dd>{lastReview ? formatDate(lastReview.date) : 'Nenhuma ainda.'}</dd>
          </div>
          <div>
            <dt className="label">Atalhos</dt>
            <dd className="flex flex-wrap gap-x-4">
              <Link to="/diario?novo=1">Novo registro no diário</Link>
              <Link to={`/historico/${journey.id}`}>Síntese da jornada</Link>
            </dd>
          </div>
        </dl>
      </Section>
    </>
  );
}
