/* Tela 06 — Conselho de Sabedoria (Documento 06, seção 10; Documento 04, seções 7 a 9; RF-087 a RF-102).
 * Seleção contextual a partir da base de conhecimento, sem inteligência artificial. */
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRun, useUserData } from '../../app/hooks';
import { activeJourney, deleteSession, journeyById, saveEntry, saveSession } from '../../application/useCases';
import { atraso } from '../../components/movimento';
import { AssinaturaVirtude, ComparacaoAneis, EmblemaTradicaoSimbolo } from '../../components/simbolos';
import { estadosDosAneis, leituraDoConjunto, type TipoRelacaoDimensao } from '../../domain/identidade';
import { Accordion, AutoSaveArea, ConfirmButton, EmptyState, Notice, PageHeader, Section, StatusTag, Tag, TextArea } from '../../components/ui';
import {
  casesOfThinker,
  councilMembers,
  dimensions,
  exercisesOfVirtue,
  getCase,
  getDimension,
  getThinker,
  getVirtue,
  getWork,
  thinkers,
  virtueDimensions,
  virtues,
  virtuesOfThinker,
  worksOfThinker,
} from '../../domain/catalog';
import { detectCrisis, selectThinkers, suggest, synthesize, type CouncilSelection } from '../../domain/council';
import { isOpenJourney, sortByDateDesc } from '../../domain/journey';
import type { CouncilSession, DiaryEntry } from '../../domain/types';
import { formatDate, newId, today, unique } from '../../shared/util';

const TRANSPARENCY =
  'As contribuições são interpretações organizadas pela plataforma a partir de ideias e obras documentadas. Não são falas literais dos pensadores nem simulam sua personalidade. O Conselho amplia a reflexão; a conclusão e a decisão são suas.';

function CrisisNotice() {
  return (
    <Notice title="Você não precisa passar por isso sem apoio">
      Se estiver em sofrimento intenso ou em risco, procure ajuda agora: CVV 188 (24 horas, gratuito), SAMU 192 ou Polícia 190. Central de Atendimento à Mulher: 180. A reflexão filosófica não substitui assistência médica, psicológica ou jurídica.
    </Notice>
  );
}

/** Relações do pensador com as dimensões, derivadas das virtudes relacionadas a ele na base. Não classifica o pensamento do autor. */
function relacoesDoPensador(thinkerId: string): { dimensionOrder: number; tipo: TipoRelacaoDimensao }[] {
  const ids = new Set(virtuesOfThinker(thinkerId).map((r) => r.virtue.id));
  return virtueDimensions.flatMap((r) => {
    const d = getDimension(r.dimensionId);
    return ids.has(r.virtueId) && d ? [{ dimensionOrder: d.order, tipo: r.relationType as TipoRelacaoDimensao }] : [];
  });
}

/** Compõe as contribuições de uma sessão a partir da situação e das escolhas da pessoa. */
function compose(situation: string, doubt: string, virtueIds: string[], dimensionIds: string[]) {
  const hypothesis = suggest(`${situation} ${doubt}`);
  const allVirtues = unique([...virtueIds, ...hypothesis.virtueIds]).slice(0, 6);
  const allDimensions = unique([...dimensionIds, ...hypothesis.dimensionIds]).sort();
  const selection = selectThinkers({ caseIds: hypothesis.caseIds, virtueIds: allVirtues, dimensionIds: allDimensions });
  return { caseId: hypothesis.caseIds[0] ?? null, virtueIds: allVirtues, dimensionIds: allDimensions, contributions: selection.map((s) => s.contribution) };
}

export function CouncilPage() {
  const data = useUserData();
  const run = useRun();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fromJourney = journeyById(data, params.get('jornada')) ?? (params.get('virtude') || params.get('registro') ? undefined : activeJourney(data));
  const fromEntry = data.entries.find((e) => e.id === params.get('registro'));
  const presetVirtue = getVirtue(params.get('virtude') ?? '')?.id ?? fromEntry?.virtueId ?? fromJourney?.virtueId ?? '';

  const [situation, setSituation] = useState(fromEntry ? [fromEntry.situation, fromEntry.context].filter(Boolean).join('. ') : '');
  const [doubt, setDoubt] = useState('');
  const [virtueId, setVirtueId] = useState(presetVirtue);
  const [dimensionId, setDimensionId] = useState('');
  const [link, setLink] = useState(!!fromJourney && isOpenJourney(fromJourney));
  const [attempted, setAttempted] = useState(false);
  const sessions = sortByDateDesc(data.sessions);

  function convene() {
    setAttempted(true);
    const session: CouncilSession = {
      id: newId(), date: today(), situation: situation.trim(), doubt: doubt.trim(), reflection: '', action: '',
      journeyId: link && fromJourney ? fromJourney.id : null, createdAt: '', updatedAt: '',
      ...compose(situation, doubt, virtueId ? [virtueId] : [], dimensionId ? [dimensionId] : []),
    };
    if (run((d) => saveSession(d, session, today()), 'Sessão do Conselho registrada.')) navigate(`/conselho/sessoes/${session.id}`);
  }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Conselho de Sabedoria', to: '/conselho' }, { label: 'Nova reflexão' }]} title="Conselho de Sabedoria" lede="Perspectivas documentadas de diferentes tradições para pensar uma situação, uma dúvida ou uma questão.">
        <div className="mt-4">
          <Link to="/conselho/pensadores" className="btn btn-ghost btn-sm">
            Pensadores e referências
          </Link>
        </div>
      </PageHeader>
      <Notice title="Transparência">{TRANSPARENCY}</Notice>

      <Section title="Nova reflexão">
        <TextArea
          label="Qual situação você deseja analisar?"
          value={situation}
          onChange={setSituation}
          rows={4}
          error={attempted && !situation.trim() ? 'Descreva a situação para convocar o Conselho.' : undefined}
          hint="O acontecimento, o contexto, as pessoas envolvidas e a dificuldade percebida."
        />
        {detectCrisis(situation) && <CrisisNotice />}
        <TextArea label="Qual é a sua principal dúvida? (opcional)" value={doubt} onChange={setDoubt} rows={2} />
        <div className="grid gap-x-3 sm:grid-cols-2">
          <div className="mb-4">
            <label className="label mb-1.5" htmlFor="c-virtude">Virtude relacionada (opcional)</label>
            <select id="c-virtude" className="field" value={virtueId} onChange={(e) => setVirtueId(e.target.value)}>
              <option value="">Deixar a plataforma sugerir</option>
              {virtues.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="label mb-1.5" htmlFor="c-dimensao">Dimensão especialmente envolvida (opcional)</label>
            <select id="c-dimensao" className="field" value={dimensionId} onChange={(e) => setDimensionId(e.target.value)}>
              <option value="">Deixar a plataforma sugerir</option>
              {dimensions.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        {fromJourney && isOpenJourney(fromJourney) && (
          <label className="mb-4 flex items-start gap-2">
            <input type="checkbox" className="mt-1.5" checked={link} onChange={(e) => setLink(e.target.checked)} />
            <span>Relacionar esta reflexão à jornada “{fromJourney.title}”</span>
          </label>
        )}
        <button type="button" className="btn" onClick={convene}>
          Convocar o Conselho
        </button>
        <p className="hint mt-2 text-[0.95rem]">A situação fica guardada com seus dados, neste navegador. Nada é enviado a serviços de inteligência artificial.</p>
      </Section>

      <Section title="Sessões anteriores">
        {sessions.length === 0 && <p className="hint">Nenhuma sessão registrada.</p>}
        <ul className="grid gap-3">
          {sessions.map((s) => (
            <li key={s.id} className="entry">
              <p className="meta">
                {formatDate(s.date)} · {s.contributions.map((c) => getThinker(c.thinkerId)?.name).filter(Boolean).join(', ') || 'sem perspectivas'}
              </p>
              <p>
                <Link to={`/conselho/sessoes/${s.id}`}>{s.situation.slice(0, 160)}</Link>
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

export function SessionPage() {
  const { id = '' } = useParams();
  const data = useUserData();
  const run = useRun();
  const navigate = useNavigate();
  const session = data.sessions.find((s) => s.id === id);
  if (!session) return <EmptyState title="Sessão não encontrada">Volte ao <Link to="/conselho">Conselho de Sabedoria</Link>.</EmptyState>;

  const selection: CouncilSelection[] = session.contributions.flatMap((contribution) => {
    const thinker = getThinker(contribution.thinkerId);
    return thinker ? [{ thinker, contribution }] : [];
  });
  const input = { caseIds: session.caseId ? [session.caseId] : [], virtueIds: session.virtueIds, dimensionIds: session.dimensionIds };
  const synthesis = synthesize(selection, input);
  const reference = getCase(session.caseId ?? '');
  const journey = journeyById(data, session.journeyId);
  const active = activeJourney(data);
  const inDiary = data.entries.some((e) => e.sessionId === session.id);
  const update = (patch: Partial<CouncilSession>, message?: string) => run((d) => saveSession(d, { ...session, ...patch }, today()), message);

  /** Ajustar as hipóteses recompõe as perspectivas a partir da base de conhecimento. */
  function toggleVirtue(virtueId: string) {
    const virtueIds = session!.virtueIds.includes(virtueId) ? session!.virtueIds.filter((v) => v !== virtueId) : [...session!.virtueIds, virtueId];
    const dims = unique(virtueDimensions.filter((r) => r.relationType === 'D1' && virtueIds.includes(r.virtueId)).map((r) => r.dimensionId)).sort();
    const contributions = selectThinkers({ caseIds: input.caseIds, virtueIds, dimensionIds: dims }).map((s) => s.contribution);
    update({ virtueIds, dimensionIds: dims.length ? dims : session!.dimensionIds, contributions }, 'Hipóteses ajustadas. As perspectivas foram recompostas.');
  }

  function toDiary() {
    const entry: DiaryEntry = {
      id: newId(), journeyId: session!.journeyId, date: today(), type: 'REFLECTION', virtueId: session!.virtueIds[0] ?? null, virtue: getVirtue(session!.virtueIds[0] ?? '')?.name ?? '',
      situation: session!.situation.slice(0, 400), context: session!.doubt, thoughts: '', feelings: [], actions: [], consequences: '', learning: session!.reflection, note: session!.action,
      stage: '', exerciseId: null, sessionId: session!.id, createdAt: '', updatedAt: '',
    };
    run((d) => saveEntry(d, entry, today()), 'Reflexão registrada no diário.');
  }

  const suggestedVirtues = unique([...session.virtueIds, ...suggest(`${session.situation} ${session.doubt}`).virtueIds]);

  return (
    <>
      <PageHeader crumbs={[{ label: 'Conselho de Sabedoria', to: '/conselho' }, { label: `Sessão de ${formatDate(session.date)}` }]} title="Reflexão no Conselho" />
      <Notice title="Transparência">{TRANSPARENCY}</Notice>
      {detectCrisis(`${session.situation} ${session.doubt}`) && <CrisisNotice />}

      <Section title="1. Compreensão da situação">
        <p className="label">Situação apresentada</p>
        <p className="mb-3 whitespace-pre-wrap">{session.situation}</p>
        {session.doubt && (
          <>
            <p className="label">Principal dúvida</p>
            <p className="mb-3">{session.doubt}</p>
          </>
        )}
        {reference && (
          <p className="mb-3">
            <Tag accent>Caso de referência</Tag> {reference.title}
          </p>
        )}
        <p className="label mb-1">Virtudes possivelmente relacionadas</p>
        <div className="flex flex-wrap gap-2">
          {suggestedVirtues.map((vid) => (
            <button key={vid} type="button" className="chip" aria-pressed={session.virtueIds.includes(vid)} onClick={() => toggleVirtue(vid)}>
              {getVirtue(vid)?.name}
            </button>
          ))}
          {suggestedVirtues.length === 0 && <span className="hint">Nenhuma hipótese. Volte e indique uma virtude relacionada.</span>}
        </div>
        <p className="label mb-1 mt-3">Dimensões possivelmente envolvidas</p>
        <div className="flex flex-wrap gap-2">
          {session.dimensionIds.map((did) => (
            <Link key={did} to={`/dimensoes/${did}`} className="chip">
              {getDimension(did)?.name}
            </Link>
          ))}
          {session.dimensionIds.length === 0 && <span className="hint">Nenhuma destacada.</span>}
        </div>
        <p className="hint mt-2 text-[0.95rem]">São hipóteses para orientar a reflexão, nunca um diagnóstico. Toque em uma virtude para incluí-la ou retirá-la.</p>
      </Section>

      <Section title="2. Perspectivas selecionadas">
        {synthesis.limitation && <Notice title="Limitação">{synthesis.limitation}</Notice>}
        <div className="grid gap-4">
          {selection.map(({ thinker, contribution }) => (
            <article key={thinker.id} className="card">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3>
                  <Link to={`/conselho/pensadores/${thinker.id}`}>{thinker.name}</Link>
                </h3>
                <span className="flex items-center gap-2">
                  <EmblemaTradicaoSimbolo tradicao={thinker.tradition} size={28} />
                  <span className="meta">{[thinker.tradition, thinker.period].filter(Boolean).join(' · ')}</span>
                </span>
              </div>
              <p className="mt-2">
                <span className="label">Perspectiva</span>
                {contribution.perspective}
              </p>
              <p className="mt-2 font-display text-[1.15rem] text-accent">{contribution.question}</p>
              <p className="meta">{thinker.questionSource === 'documento' ? 'Pergunta registrada no Documento 04.' : 'Pergunta de aplicação pedagógica da plataforma, não uma citação.'}</p>
              <p className="mt-2">
                <span className="label">Por que foi convocado</span>
                {contribution.reason}
              </p>
              <p className="mt-2">
                <span className="label">Fontes</span>
                {contribution.workIds.length ? contribution.workIds.map((w) => getWork(w)?.title).filter(Boolean).join('; ') : 'Sem obra de referência registrada na base: fundamentação a completar pela curadoria.'}
              </p>
              <div className="entry mt-4">
                <p className="label mb-1">Limites desta perspectiva</p>
                <p>{thinker.limits}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="3. Convergências e divergências">
        {selection.length >= 2 && (
          <div className="mb-5 flex flex-wrap items-center gap-5">
            <ComparacaoAneis leitura={leituraDoConjunto(selection.map(({ thinker }) => estadosDosAneis(relacoesDoPensador(thinker.id))))} size={72} />
            <p className="meta max-w-[46ch]">
              Dimensões em comum entre as perspectivas. Anel cheio: todas se ligam a essa dimensão pelas virtudes da base. Tracejado: só algumas. Fino: nenhuma. É uma leitura de conjunto, não uma avaliação de quem tem razão.
            </p>
          </div>
        )}
        <p className="label mb-1">Convergências</p>
        {synthesis.convergences.length ? <ul className="prose-list">{synthesis.convergences.map((c) => <li key={c}>{c}</li>)}</ul> : <p className="hint">A base não registra pontos comuns entre estas perspectivas.</p>}
        <p className="label mb-1 mt-4">Divergências e limites</p>
        {synthesis.divergences.length ? <ul className="prose-list">{synthesis.divergences.map((c) => <li key={c}>{c}</li>)}</ul> : <p className="hint">Nada a destacar.</p>}
      </Section>

      <Section title="4. Síntese do Conselho">
        <p className="meta mb-2">Organizada pela plataforma a partir da base de conhecimento. Sem inteligência artificial.</p>
        {synthesis.documented && <p className="mb-3">{synthesis.documented}</p>}
        <p className="label mb-1">Perguntas para a sua reflexão</p>
        <ul className="prose-list">
          {synthesis.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        {session.virtueIds.length > 0 && (
          <>
            <p className="label mb-1 mt-4">Práticas possíveis</p>
            <ul className="prose-list">
              {session.virtueIds.flatMap(exercisesOfVirtue).slice(0, 5).map((e) => (
                <li key={e.id}>
                  <strong>{e.title}:</strong> {e.description}
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      <Section title="5. Minha reflexão">
        <AutoSaveArea label="O que penso depois de consultar o Conselho" value={session.reflection} onSave={(reflection) => update({ reflection }, 'Reflexão salva.')} rows={4} hint="Grava automaticamente." />
        <AutoSaveArea label="Ação concreta que escolho (opcional)" value={session.action} onSave={(action) => update({ action }, 'Ação salva.')} rows={2} />
        <div className="flex flex-wrap gap-2">
          {!inDiary && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={toDiary}>
              Registrar no diário
            </button>
          )}
          {inDiary && <Tag>Registrada no diário</Tag>}
          {!session.journeyId && active && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ journeyId: active.id }, 'Sessão relacionada à jornada.')}>
              Relacionar à jornada em andamento
            </button>
          )}
          {journey && (
            <Link to={isOpenJourney(journey) ? '/jornada?etapa=refletir' : `/historico/${journey.id}`} className="btn btn-ghost btn-sm">
              Retornar à jornada
            </Link>
          )}
          <ConfirmButton
            label="Excluir sessão"
            confirmLabel="Confirmar exclusão"
            onConfirm={() => {
              navigate('/conselho');
              run((d) => deleteSession(d, session.id), 'Sessão excluída.');
            }}
          />
        </div>
      </Section>
    </>
  );
}

export function ThinkersPage() {
  const others = thinkers.filter((t) => !t.council);
  return (
    <>
      <PageHeader crumbs={[{ label: 'Conselho de Sabedoria', to: '/conselho' }, { label: 'Pensadores' }]} title="Pensadores e referências" lede="Cada integrante do Conselho tem um campo de contribuição baseado em suas obras e ideias, com limites declarados." />
      <Section title="Integrantes do Conselho">
        <div className="grid gap-3 sm:grid-cols-2">
          {councilMembers.map((t, i) => (
            <Link key={t.id} to={`/conselho/pensadores/${t.id}`} className="card revelar" style={atraso(i)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3>{t.name}</h3>
                  <p className="meta">{[t.tradition, t.period].filter(Boolean).join(' · ')}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <EmblemaTradicaoSimbolo tradicao={t.tradition} size={36} />
                  <AssinaturaVirtude cor="var(--fg)" rotulo="assinatura-pensador" relacoes={relacoesDoPensador(t.id)} size={36} />
                </div>
              </div>
              <p className="mt-1">{t.field}</p>
            </Link>
          ))}
        </div>
      </Section>
      <Section title="Outras referências citadas no catálogo">
        <p className="hint mb-2">Autores e tradições indicados como referência de virtudes, ainda sem perfil no Conselho.</p>
        <p>{others.map((t) => t.name).join(' · ')}</p>
      </Section>
    </>
  );
}

export function ThinkerPage() {
  const { id = '' } = useParams();
  const thinker = getThinker(id);
  if (!thinker) return <EmptyState title="Pensador não encontrado">Volte à <Link to="/conselho/pensadores">lista de pensadores</Link>.</EmptyState>;
  const works = worksOfThinker(thinker);
  const related = virtuesOfThinker(thinker.id);
  const cases = casesOfThinker(thinker.id);
  return (
    <>
      <PageHeader crumbs={[{ label: 'Conselho de Sabedoria', to: '/conselho' }, { label: 'Pensadores', to: '/conselho/pensadores' }, { label: thinker.name }]} title={thinker.name} lede={thinker.field}>
        <p className="meta mt-2">{[thinker.tradition, thinker.period].filter(Boolean).join(' · ')}</p>
        <div className="mt-4 flex flex-wrap items-end gap-5 text-accent">
          <EmblemaTradicaoSimbolo tradicao={thinker.tradition} size={56} />
          <AssinaturaVirtude cor="var(--fg)" rotulo="assinatura-pensador" relacoes={relacoesDoPensador(thinker.id)} size={56} animado />
          <p className="meta max-w-[34ch] text-muted">O emblema marca a tradição. Os anéis vêm das dimensões das virtudes relacionadas a este pensador na base, não de uma classificação do seu pensamento.</p>
        </div>
        <div className="mt-2">
          <StatusTag status={thinker.status} />
        </div>
      </PageHeader>

      <Section title="Contribuição">
        {thinker.concepts.length > 0 && (
          <p>
            <span className="label">Virtudes e conceitos prioritários</span>
            {thinker.concepts.join(' · ')}
          </p>
        )}
        {thinker.question && (
          <>
            <p className="label mt-4">Pergunta característica</p>
            <p className="font-display text-[1.3rem] text-accent">{thinker.question}</p>
            <p className="meta">{thinker.questionSource === 'documento' ? 'Registrada no Documento 04.' : 'Formulação pedagógica da plataforma a partir do campo de contribuição. Não é uma citação.'}</p>
          </>
        )}
        {thinker.limits && <Notice title="Limites e divergências desta perspectiva">{thinker.limits}</Notice>}
      </Section>

      <Section title="Obras de referência">
        {works.length ? (
          <ul className="prose-list">
            {works.map((w) => (
              <li key={w.id}>{w.title}</li>
            ))}
          </ul>
        ) : (
          <p className="hint">Nenhuma obra registrada na base para este integrante. Fundamentação a completar pela curadoria.</p>
        )}
      </Section>

      <Section title="Virtudes relacionadas">
        <div className="flex flex-wrap gap-2">
          {related.map(({ virtue, relation }) => (
            <Link key={relation.id} to={`/virtudes/${virtue.id}`} className="chip">
              {virtue.name}
              {relation.relationType && <span className="meta ml-2">{relation.relationType}</span>}
            </Link>
          ))}
        </div>
      </Section>

      {cases.length > 0 && (
        <Section title="Situações de referência">
          {cases.map((c) => (
            <Accordion key={c.id} title={c.title}>
              <p>{c.contributions.find((x) => x.thinkerId === thinker.id)?.perspective}</p>
              <p className="mt-2 italic">{c.centralQuestion}</p>
            </Accordion>
          ))}
        </Section>
      )}
    </>
  );
}
