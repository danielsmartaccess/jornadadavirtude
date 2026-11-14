/* Tela 10 — Histórico de jornadas e síntese (Documento 06, seções 13.4 e 14; RF-103 a RF-118; US-009). */
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRun, useToast, useUserData } from '../../app/hooks';
import { archiveJourney, entriesOf, reviewsOf, sessionsOf, unarchiveJourney } from '../../application/useCases';
import { Accordion, EmptyState, Notice, PageHeader, Section, Tag } from '../../components/ui';
import { getExercise, getThinker, getVirtue } from '../../domain/catalog';
import { canArchiveJourney, entryTypeLabel, INVESTIGATION_BLOCKS, isArchived, isOpenJourney, journeyStats, sortByDateDesc, STAGE_STATES, STAGES, STATUS_LABEL, virtueTrail } from '../../domain/journey';
import { buildJourneyReport } from '../../domain/report';
import type { Journey } from '../../domain/types';
import { downloadText, slug } from '../../infrastructure/download';
import { buildExport } from '../../infrastructure/legacy';
import { formatDate, today } from '../../shared/util';

const EVENT_LABEL: Record<string, string> = {
  criada: 'Jornada criada', iniciada: 'Jornada iniciada', pausada: 'Jornada pausada', retomada: 'Jornada retomada', concluida: 'Jornada concluída',
  arquivada: 'Jornada arquivada', desarquivada: 'Jornada desarquivada', 'virtude-alterada': 'Virtude principal alterada',
};

function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <Link to={`/historico/${journey.id}`} className="card">
      <div className="flex flex-wrap items-center gap-2">
        <Tag accent>{STATUS_LABEL[journey.status]}</Tag>
        {isArchived(journey) && <Tag>Arquivada</Tag>}
      </div>
      <p className="mt-2 font-display text-xl text-accent">{journey.virtueName}</p>
      <p className="meta">
        {journey.title}
        {journey.startedOn && ` · início em ${formatDate(journey.startedOn)}`}
        {journey.completedOn && ` · conclusão em ${formatDate(journey.completedOn)}`}
      </p>
      {journey.intention.motivation && <p className="mt-1">{journey.intention.motivation}</p>}
      <p className="meta mt-2">Ver síntese →</p>
    </Link>
  );
}

export function HistoryPage() {
  const data = useUserData();
  const [showArchived, setShowArchived] = useState(false);
  const journeys = data.journeys;
  const visible = journeys.filter((j) => !isArchived(j));
  const archived = journeys.filter(isArchived);
  const trail = virtueTrail(journeys);
  const learnings = sortByDateDesc(data.reviews.filter((r) => r.kind === 'final' && (r.learnings.trim() || r.synthesis.trim())));
  const groups = [
    { title: 'Em andamento e rascunhos', list: visible.filter((j) => j.status === 'ACTIVE' || j.status === 'DRAFT') },
    { title: 'Pausadas', list: visible.filter((j) => j.status === 'PAUSED') },
    { title: 'Concluídas', list: visible.filter((j) => j.status === 'COMPLETED') },
  ];

  return (
    <>
      <PageHeader crumbs={[{ label: 'Histórico' }]} title="Histórico de jornadas" lede="A memória do seu percurso. Uma nova jornada nunca apaga a anterior." />
      {journeys.length === 0 && (
        <EmptyState title="Nenhuma jornada ainda">
          <Link to="/jornada/nova">Inicie sua primeira jornada</Link>.
        </EmptyState>
      )}

      {trail.length > 0 && (
        <Section title="Virtudes investigadas">
          <p className="font-display text-xl">{trail.join(' → ')}</p>
          <p className="hint mt-1 text-[0.95rem]">Ordem em que você as trabalhou. Não é uma sequência obrigatória de desenvolvimento.</p>
        </Section>
      )}

      {groups.map(
        (group) =>
          group.list.length > 0 && (
            <Section key={group.title} title={group.title}>
              <div className="grid gap-3">
                {group.list.map((j) => (
                  <JourneyCard key={j.id} journey={j} />
                ))}
              </div>
            </Section>
          ),
      )}

      {archived.length > 0 && (
        <Section title="Arquivadas">
          <button type="button" className="btn btn-ghost btn-sm mb-3" aria-expanded={showArchived} onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? 'Ocultar' : `Mostrar ${archived.length} ${archived.length === 1 ? 'jornada arquivada' : 'jornadas arquivadas'}`}
          </button>
          {showArchived && (
            <div className="grid gap-3">
              {archived.map((j) => (
                <JourneyCard key={j.id} journey={j} />
              ))}
            </div>
          )}
        </Section>
      )}

      {learnings.length > 0 && (
        <Section title="Aprendizados registrados">
          <ul className="grid gap-4">
            {learnings.map((r) => {
              const journey = journeys.find((j) => j.id === r.journeyId);
              return (
                <li key={r.id} className="entry">
                  <p className="meta">
                    {formatDate(r.date)} · {journey?.virtueName}
                  </p>
                  {r.learnings.trim() && <p>{r.learnings}</p>}
                  {r.synthesis.trim() && <p className="italic">{r.synthesis}</p>}
                </li>
              );
            })}
          </ul>
        </Section>
      )}
    </>
  );
}

export function JourneyDetailPage() {
  const { id = '' } = useParams();
  const data = useUserData();
  const run = useRun();
  const toast = useToast();
  const journey = data.journeys.find((j) => j.id === id);
  if (!journey) return <EmptyState title="Jornada não encontrada">Volte ao <Link to="/historico">histórico</Link>.</EmptyState>;

  const stats = journeyStats(journey, data);
  const entries = sortByDateDesc(entriesOf(data, journey.id));
  const reviews = sortByDateDesc(reviewsOf(data, journey.id));
  const sessions = sortByDateDesc(sessionsOf(data, journey.id));
  const answered = INVESTIGATION_BLOCKS.flatMap((b) => b.questions).filter((q) => journey.investigation[q.id]?.trim());
  const file = `${slug(journey.title)}-${today()}`;

  function exportReport() {
    const ok = downloadText(`${file}.md`, buildJourneyReport(journey!, data), 'text/markdown');
    toast(ok ? 'Síntese exportada em formato legível.' : 'Não foi possível gerar o arquivo neste navegador.', ok ? 'ok' : 'erro');
  }

  function exportData() {
    const subset = { schema: 4, journeys: [journey], entries: entriesOf(data, journey!.id), reviews: reviewsOf(data, journey!.id), sessions: sessionsOf(data, journey!.id) };
    const ok = downloadText(`${file}.json`, JSON.stringify(buildExport(subset), null, 2), 'application/json');
    toast(ok ? 'Dados da jornada exportados.' : 'Não foi possível gerar o arquivo neste navegador.', ok ? 'ok' : 'erro');
  }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Histórico', to: '/historico' }, { label: journey.virtueName }]} title={journey.title}>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Tag accent>{STATUS_LABEL[journey.status]}</Tag>
          {isArchived(journey) && <Tag>Arquivada</Tag>}
          <span className="meta">
            virtude principal: <Link to={`/virtudes/${journey.virtueId ?? ''}`}>{journey.virtueName}</Link>
            {journey.startedOn && ` · início em ${formatDate(journey.startedOn)}`}
            {journey.completedOn && ` · conclusão em ${formatDate(journey.completedOn)}`}
          </span>
        </div>
        {journey.relatedVirtueIds.length > 0 && <p className="meta mt-1">Virtudes relacionadas: {journey.relatedVirtueIds.map((v) => getVirtue(v)?.name).join(', ')}</p>}
        <div className="no-print mt-4 flex flex-wrap gap-2">
          {isOpenJourney(journey) && (
            <Link to="/jornada" className="btn btn-sm">
              Abrir em Minha Jornada
            </Link>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={exportReport}>
            Exportar síntese
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={exportData}>
            Exportar dados (JSON)
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}>
            Imprimir
          </button>
          {canArchiveJourney(journey) && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => run((d) => archiveJourney(d, journey.id, today()), 'Jornada arquivada. Os registros foram preservados.')}>
              Arquivar
            </button>
          )}
          {isArchived(journey) && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => run((d) => unarchiveJourney(d, journey.id, today()), 'Jornada desarquivada.')}>
              Desarquivar
            </button>
          )}
          {journey.status === 'COMPLETED' && (
            <Link to={`/jornada/nova?virtude=${journey.virtueId ?? ''}`} className="btn btn-ghost btn-sm">
              Nova jornada com esta virtude
            </Link>
          )}
        </div>
        {journey.status === 'COMPLETED' && <p className="hint mt-2 text-[0.95rem]">Concluir encerra um ciclo de investigação e prática. Não significa domínio definitivo da virtude.</p>}
      </PageHeader>

      <Section title="Percepções declaradas por você">
        <p className="label">Intenção inicial</p>
        <p className="mb-3">{journey.intention.motivation || '(não registrada)'}</p>
        {journey.intention.situation && <p className="mb-3"><span className="label">Situação que queria compreender</span>{journey.intention.situation}</p>}
        {journey.intention.expectation && <p className="mb-3"><span className="label">O que esperava aprender</span>{journey.intention.expectation}</p>}
        {journey.plan.trim() && <p className="mb-3"><span className="label">Compromisso de prática</span>{journey.plan}</p>}
        {journey.notes.trim() && <p className="mb-3"><span className="label">Observações gerais</span>{journey.notes}</p>}

        <Accordion title={`Investigação (${answered.length} respostas)`}>
          {answered.length === 0 && <p className="hint">Nenhuma resposta registrada.</p>}
          {answered.map((q) => (
            <p key={q.id} className="mb-3">
              <span className="label">{q.label}</span>
              {journey.investigation[q.id]}
            </p>
          ))}
        </Accordion>
        <Accordion title={`Revisões (${reviews.length})`} open={reviews.some((r) => r.kind === 'final')}>
          {reviews.length === 0 && <p className="hint">Nenhuma revisão registrada.</p>}
          <ul className="grid gap-4">
            {reviews.map((r) => (
              <li key={r.id} className="entry">
                <p className="meta">
                  {formatDate(r.date)} · {r.kind === 'final' ? 'Revisão final' : r.kind === 'legado' ? 'Revisão da versão anterior' : 'Revisão periódica'}
                </p>
                {Object.entries(r.answers).map(([key, value]) => value.trim() && <p key={key}>{value}</p>)}
                {r.learnings.trim() && <p><span className="label">Aprendizados</span>{r.learnings}</p>}
                {r.perception.trim() && <p><span className="label">Como compreendo a virtude agora</span>{r.perception}</p>}
                {r.synthesis.trim() && <p><span className="label">Síntese pessoal</span>{r.synthesis}</p>}
                {(r.firstWeek || r.lastWeek) && <p className="meta">Dias em que a virtude faltou: primeira semana “{r.firstWeek || '—'}”, última semana “{r.lastWeek || '—'}”.</p>}
              </li>
            ))}
          </ul>
        </Accordion>
      </Section>

      <Section title="Informações registradas">
        <Accordion title="Etapas">
          <ul>
            {STAGES.map((s) => (
              <li key={s.id}>
                <span aria-hidden="true">{STAGE_STATES[journey.stages[s.id].state].symbol}</span> {s.name}: {STAGE_STATES[journey.stages[s.id].state].label}
                {journey.stages[s.id].date && <span className="meta"> · {formatDate(journey.stages[s.id].date)}</span>}
              </li>
            ))}
          </ul>
        </Accordion>
        <Accordion title={`Exercícios (${journey.exercises.length})`}>
          {journey.exercises.length === 0 && <p className="hint">Nenhum exercício associado.</p>}
          <ul className="prose-list">
            {journey.exercises.map((e) => (
              <li key={e.exerciseId}>
                {getExercise(e.exerciseId)?.title ?? e.exerciseId}: {e.times} {e.times === 1 ? 'experiência registrada' : 'experiências registradas'}
              </li>
            ))}
          </ul>
        </Accordion>
        <Accordion title={`Diário (${entries.length} registros)`}>
          {entries.length === 0 && <p className="hint">Nenhum registro. O diário é voluntário: isso não significa ausência de prática.</p>}
          <ul className="grid gap-3">
            {entries.map((e) => (
              <li key={e.id} className="entry">
                <p className="meta">
                  {formatDate(e.date)} · {entryTypeLabel(e.type)}
                </p>
                <p>{e.situation}</p>
                {e.learning && <p className="italic">{e.learning}</p>}
              </li>
            ))}
          </ul>
          {entries.length > 0 && (
            <p className="no-print mt-3">
              <Link to={`/diario?jornada=${journey.id}`}>Abrir estes registros no diário</Link>
            </p>
          )}
        </Accordion>
        <Accordion title={`Sessões do Conselho (${sessions.length})`}>
          {sessions.length === 0 && <p className="hint">Nenhuma sessão relacionada.</p>}
          <ul className="grid gap-3">
            {sessions.map((s) => (
              <li key={s.id} className="entry">
                <p className="meta">
                  {formatDate(s.date)} · {s.contributions.map((c) => getThinker(c.thinkerId)?.name).filter(Boolean).join(', ')}
                </p>
                <p>
                  <Link to={`/conselho/sessoes/${s.id}`}>{s.situation.slice(0, 140)}</Link>
                </p>
              </li>
            ))}
          </ul>
        </Accordion>
        <Accordion title="Alterações da jornada">
          <ul>
            {journey.history.map((h, i) => (
              <li key={i} className="meta">
                {formatDate(h.date)} · {EVENT_LABEL[h.kind]} {h.detail}
              </li>
            ))}
            {journey.history.length === 0 && <li className="hint">Jornada trazida da versão anterior: sem histórico de alterações.</li>}
          </ul>
        </Accordion>
      </Section>

      <Section title="Síntese produzida pelo sistema">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [stats.entries, 'registros no diário'],
            [stats.daysWithEntries, 'dias com registro'],
            [stats.exercisesTried, 'exercícios experimentados'],
            [stats.reviews, 'revisões'],
          ].map(([value, label]) => (
            <div key={label} className="card !p-3">
              <p className="font-display text-3xl leading-none">{value}</p>
              <p className="label mt-1">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3">
          {stats.byType.PRACTICE} práticas · {stats.byType.DIFFICULTY} dificuldades · {stats.byType.REFLECTION} reflexões · {stats.byType.DISCOVERY} descobertas · {stats.sessions} sessões do Conselho
        </p>
        <Notice>São contagens de atividades registradas. Indicam participação no percurso; não medem virtude, caráter ou valor pessoal, e a ausência de registros não significa ausência de prática.</Notice>
      </Section>
    </>
  );
}
