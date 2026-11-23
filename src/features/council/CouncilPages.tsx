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
import { detectCrisis, isCrisisInput, selectThinkers, suggest, synthesize, type CouncilSelection } from '../../domain/council';
import {
  entradasDoAcervo,
  evidenciasDaRelacao,
  getCandidato,
  getClassificacao,
  getTradicao,
  getUniverso,
  apoiadosPor,
  COMPLETUDE_BIBLIOGRAFICA,
  completudeBibliografica,
  apoiosDe,
  NIVEL_FUNDAMENTACAO,
  ORIGEM_CANDIDATO,
  PAPEL_SELECAO,
  papelDoRegistro,
  referenciasDe,
  SITUACAO_CONFERENCIA,
  SITUACAO_VINCULO,
  taxonomia,
  TIPO_FONTE,
  TIPO_PARTICIPACAO,
  TIPO_VINCULO,
  tradicoes,
  universos,
  vinculosDe,
  type ReferenciaBase,
  type CategoriaAcervo,
  type Candidato,
  type EntradaAcervo,
  type TipoParticipacao,
  type TradicaoCorpus,
  type Universo,
} from '../../domain/curadoria';
import { isOpenJourney, sortByDateDesc } from '../../domain/journey';
import type { CouncilSession, DiaryEntry } from '../../domain/types';
import { formatDate, newId, normalize, today, unique } from '../../shared/util';

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
  /** Tentativa de convocação recusada pelo gate de segurança. */
  const [blocked, setBlocked] = useState(false);
  const sessions = sortByDateDesc(data.sessions);
  const risk = isCrisisInput(situation, doubt);
  /** Estado bloqueado visível: a tentativa foi recusada e o texto ainda traz o sinal de risco. */
  const blockedShown = blocked && risk;

  function convene() {
    setAttempted(true);
    /* Gate de segurança: antes de compor perspectivas, gravar ou navegar. Com sinal de risco
     * na situação ou na dúvida, o fluxo comum não roda e nada é registrado. */
    if (isCrisisInput(situation, doubt)) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
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
        <TextArea label="Qual é a sua principal dúvida? (opcional)" value={doubt} onChange={setDoubt} rows={2} />
        {risk && !blocked && <CrisisNotice />}
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
        {blockedShown && (
          <div role="alert" className="mt-4">
            <Notice title="O Conselho não foi convocado">
              O texto menciona algo que pode envolver risco à sua integridade ou à de outra pessoa. Nesses casos, o Conselho não conduz uma reflexão filosófica: nenhuma sessão foi criada e nada foi registrado.
            </Notice>
            <CrisisNotice />
          </div>
        )}
        {/* Com sinal de risco a convocação será recusada e nada é guardado: a frase só vale sem ele. */}
        {!risk && (
          <p className="hint mt-2 text-nota">A situação fica guardada com seus dados, neste navegador. Nada é enviado a serviços de inteligência artificial.</p>
        )}
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
        <p className="hint mt-2 text-nota">São hipóteses para orientar a reflexão, nunca um diagnóstico. Toque em uma virtude para incluí-la ou retirá-la.</p>
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
              <p className="mt-2 font-display text-lede text-accent">{contribution.question}</p>
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
            <p className="meta max-w-legenda-larga">
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

/* Biblioteca de perspectivas (Documento 14, seções 4, 5, 8 e 10). Só os integrantes participam da seleção;
 * candidatos e tradições aparecem para consulta, sempre marcados como não habilitados. */
const ACERVO = entradasDoAcervo();

const CATEGORIAS: { id: CategoriaAcervo; titulo: string; filtro: string; nota: string }[] = [
  { id: 'integrante', titulo: 'Integrantes do Conselho', filtro: 'Integrantes', nota: 'Habilitados no Conselho. As vozes individuais participam da seleção; o corpus de apoio dá contexto, sem ocupar vaga.' },
  { id: 'tradicao', titulo: 'Tradições, corpora e escolas', filtro: 'Tradições', nota: 'Conjuntos de textos, práticas e interpretações. Não são pessoas. Não participam do Conselho por este registro.' },
  { id: 'candidato', titulo: 'Candidatos em estudo', filtro: 'Candidatos', nota: 'Propostos para validação curatorial. Não habilitados: não participam do Conselho.' },
  { id: 'referencia', titulo: 'Outras referências do catálogo', filtro: 'Referências', nota: 'Citadas como referência de virtudes, sem perfil no Conselho.' },
];

const TIPOS = Object.keys(TIPO_PARTICIPACAO) as TipoParticipacao[];

const virtudesDaEntrada = new Map(thinkers.map((t) => [t.id, new Set(virtuesOfThinker(t.id).map((r) => r.virtue.id))]));

const naoEPessoa = (tipo: TipoParticipacao) => tipo === 'tradicao-corpus' || tipo === 'escola-corrente';

function iniciais(nome: string): string {
  const partes = nome.replace(/\(.*?\)/g, '').split(/\s+/).filter((p) => p.length > 2 || /^[A-Z]/.test(p));
  return partes.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
}

/** Composição tipográfica no lugar de retrato: não há imagem com origem e licença identificáveis para estas entradas. */
function Monograma({ nome, tipo }: { nome: string; tipo: TipoParticipacao }) {
  return (
    <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center font-display text-nota text-muted ${naoEPessoa(tipo) ? 'rounded-full' : ''}`} style={{ border: `1px ${naoEPessoa(tipo) ? 'double' : 'solid'} var(--color-rule)`, borderWidth: naoEPessoa(tipo) ? 3 : 1 }}>
      {iniciais(nome)}
    </span>
  );
}

function TagsDaEntrada({ tipo, lista }: { tipo: TipoParticipacao; lista: Universo[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <Tag accent={naoEPessoa(tipo)} quebra>{TIPO_PARTICIPACAO[tipo].nome}{naoEPessoa(tipo) ? ' · não é uma pessoa' : ''}</Tag>
      {lista.map((u) => (
        <Tag key={u}>{getUniverso(u)?.nome ?? u}</Tag>
      ))}
    </div>
  );
}

const BORDA: Record<CategoriaAcervo, string> = {
  integrante: '4px solid var(--accent)',
  tradicao: '4px double var(--fg)',
  candidato: '4px dashed var(--muted)',
  referencia: '1px solid var(--color-rule)',
};

function CartaoAcervo({ e, i }: { e: EntradaAcervo; i: number }) {
  const t = e.thinker;
  return (
    <Link to={`/conselho/pensadores/${e.id}`} className="card revelar" data-categoria={e.categoria} style={{ borderTop: BORDA[e.categoria], ...atraso(i) }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3>{e.nome}</h3>
          <p className="meta">{t ? [t.tradition, t.period].filter(Boolean).join(' · ') : e.campo}</p>
        </div>
        {e.categoria === 'integrante' && t ? (
          <div className="flex shrink-0 items-center gap-2">
            <EmblemaTradicaoSimbolo tradicao={t.tradition} size={36} />
            <AssinaturaVirtude cor="var(--fg)" rotulo="assinatura-pensador" relacoes={relacoesDoPensador(t.id)} size={36} />
          </div>
        ) : (
          <Monograma nome={e.nome} tipo={e.tipo} />
        )}
      </div>
      <p className="mt-1">{e.categoria === 'tradicao' ? `Cuidado de leitura: ${e.resumo}` : e.resumo}</p>
      <TagsDaEntrada tipo={e.tipo} lista={e.universos} />
      <p className="meta mt-2">{e.convocavel ? 'Participa do Conselho' : e.habilitado ? PAPEL_SELECAO.contextual_corpus : NAO_HABILITADO}</p>
    </Link>
  );
}

export function ThinkersPage() {
  const [categoria, setCategoria] = useState<CategoriaAcervo | ''>('');
  const [universo, setUniverso] = useState('');
  const [tipo, setTipo] = useState('');
  const [virtude, setVirtude] = useState('');
  const [dimensao, setDimensao] = useState('');
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());
  const daDimensao = new Set(virtueDimensions.filter((r) => r.dimensionId === dimensao).map((r) => r.virtueId));
  const filtrarPorVirtude = Boolean(virtude || dimensao);
  const filtradas = ACERVO.filter((e) => {
    const vs = virtudesDaEntrada.get(e.id);
    return (
      (!categoria || e.categoria === categoria) &&
      (!universo || e.universos.includes(universo as Universo)) &&
      (!tipo || e.tipo === tipo) &&
      (!virtude || Boolean(vs?.has(virtude))) &&
      (!dimensao || [...(vs ?? [])].some((v) => daDimensao.has(v))) &&
      (!q || normalize(`${e.nome} ${e.campo} ${e.resumo} ${TIPO_PARTICIPACAO[e.tipo].nome}`).includes(q))
    );
  });
  const limpar = () => {
    setCategoria('');
    setUniverso('');
    setTipo('');
    setVirtude('');
    setDimensao('');
    setQuery('');
  };
  const algumFiltro = Boolean(categoria || universo || tipo || virtude || dimensao || q);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Conselho de Sabedoria', to: '/conselho' }, { label: 'Pensadores' }]}
        title="Pensadores e referências"
        lede="Uma biblioteca de perspectivas: pensadores, tradições e vozes de vários universos do conhecimento. Cada entrada mostra o tipo de participação, o campo de contribuição e o estado da curadoria."
      >
        <p className="hint mt-2 max-w-leitura">
          Dos {ACERVO.filter((e) => e.habilitado).length} integrantes habilitados, {ACERVO.filter((e) => e.convocavel).length} são vozes individuais convocáveis; Tradições budistas permanece como corpus de apoio, não convocado como pessoa. Tradições e candidatos estão aqui para consulta e aguardam validação curatorial. Pessoas e tradições não se confundem: uma tradição é um conjunto histórico de textos e práticas, não um autor.
        </p>
        <p className="meta mt-2" data-taxonomia={taxonomia.versao}>
          {taxonomia.aviso}. Universos e tipos servem à navegação: não são hierarquia de valor e não convocam ninguém sozinhos.
        </p>
      </PageHeader>

      <div role="group" aria-label="Categorias do acervo" className="mb-4 flex flex-wrap gap-2">
        {CATEGORIAS.map((c) => (
          <button key={c.id} type="button" className="chip !min-h-9 !text-nota" aria-pressed={categoria === c.id} onClick={() => setCategoria(categoria === c.id ? '' : c.id)}>
            {c.filtro} <span className="meta ml-1.5">{ACERVO.filter((e) => e.categoria === c.id).length}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="label mb-1.5" htmlFor="acervo-busca">
            Palavra-chave
          </label>
          <input id="acervo-busca" type="search" className="field" value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Ex.: estoicismo, cuidado, justiça" />
        </div>
        <div>
          <label className="label mb-1.5" htmlFor="acervo-universo">
            Universo
          </label>
          <select id="acervo-universo" className="field" value={universo} onChange={(ev) => setUniverso(ev.target.value)}>
            <option value="">Todos</option>
            {universos.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-1.5" htmlFor="acervo-tipo">
            Tipo de participação
          </label>
          <select id="acervo-tipo" className="field" value={tipo} onChange={(ev) => setTipo(ev.target.value)}>
            <option value="">Todos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {TIPO_PARTICIPACAO[t].nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-1.5" htmlFor="acervo-virtude">
            Virtude relacionada
          </label>
          <select id="acervo-virtude" className="field" value={virtude} onChange={(ev) => setVirtude(ev.target.value)}>
            <option value="">Todas</option>
            {virtues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-1.5" htmlFor="acervo-dimensao">
            Dimensão
          </label>
          <select id="acervo-dimensao" className="field" value={dimensao} onChange={(ev) => setDimensao(ev.target.value)}>
            <option value="">Todas</option>
            {dimensions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button type="button" className="btn btn-ghost w-full" onClick={limpar} disabled={!algumFiltro}>
            Limpar filtros
          </button>
        </div>
      </div>
      <p className="meta mt-3" role="status">
        {filtradas.length} de {ACERVO.length} entradas
      </p>
      {filtrarPorVirtude && <p className="hint mt-1">Os filtros de virtude e dimensão usam as relações cadastradas no catálogo. Tradições e candidatos ainda não têm relações e não aparecem nesses filtros.</p>}

      {filtradas.length === 0 && (
        <div className="mt-4">
          <EmptyState title="Nenhuma entrada encontrada">Tente outra palavra ou limpe os filtros.</EmptyState>
        </div>
      )}

      {CATEGORIAS.filter((c) => filtradas.some((e) => e.categoria === c.id)).map((c) => (
        <Section key={c.id} title={c.titulo} aside={<span className="meta">{c.nota}</span>}>
          <div className="grid gap-3 sm:grid-cols-2">
            {filtradas
              .filter((e) => e.categoria === c.id)
              .map((e, i) => (
                <CartaoAcervo key={e.id} e={e} i={i} />
              ))}
          </div>
        </Section>
      ))}
    </>
  );
}

const NAO_HABILITADO = 'Não habilitado · não participa do Conselho';

function nomeDaEntrada(id: string): { nome: string; existe: boolean } {
  const n = getThinker(id)?.name ?? getCandidato(id)?.nome ?? getTradicao(id)?.nome;
  return { nome: n ?? id, existe: Boolean(n) };
}

function LinksDeEntradas({ ids }: { ids: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ids.map((id) => {
        const { nome, existe } = nomeDaEntrada(id);
        return existe ? (
          <Link key={id} to={`/conselho/pensadores/${id}`} className="chip">
            {nome}
          </Link>
        ) : (
          <span key={id} className="tag">
            {nome}
          </span>
        );
      })}
    </div>
  );
}

function CandidatoView({ c }: { c: Candidato }) {
  return (
    <>
      <PageHeader crumbs={[{ label: 'Conselho de Sabedoria', to: '/conselho' }, { label: 'Pensadores', to: '/conselho/pensadores' }, { label: c.nome }]} title={c.nome} lede={c.contribuicao}>
        <p className="meta mt-2">{c.campo}</p>
        <TagsDaEntrada tipo={c.tipo} lista={c.universos} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          <StatusTag status={c.status} />
          <Tag accent quebra>{NAO_HABILITADO}</Tag>
        </div>
      </PageHeader>
      <Section title="Por que está no acervo">
        <p>{ORIGEM_CANDIDATO[c.origem]}.</p>
        <p className="meta mt-2">Registro: {c.fonteDoRegistro}{c.doc12Id && !c.fonteDoRegistro.includes(c.doc12Id) ? ` · ${c.doc12Id}` : ''}</p>
      </Section>
      {c.temasAInvestigar && (
        <Section title="Temas a investigar">
          <p>{c.temasAInvestigar}</p>
        </Section>
      )}
      {c.cuidado && (
        <Section title="Cuidados de interpretação">
          <Notice title="Limites desta perspectiva">{c.cuidado}</Notice>
        </Section>
      )}
      <Section title="O que falta para participar do Conselho">
        <p>Decisão formal de curadoria, relações com virtudes registradas uma a uma e evidências com obra e localização revisadas. Enquanto isso não acontece, esta perspectiva não é convocada.</p>
      </Section>
    </>
  );
}

function TradicaoView({ t }: { t: TradicaoCorpus }) {
  const obras = (t.obras ?? []).flatMap((id) => {
    const w = getWork(id);
    return w ? [w] : [];
  });
  return (
    <>
      <PageHeader crumbs={[{ label: 'Conselho de Sabedoria', to: '/conselho' }, { label: 'Pensadores', to: '/conselho/pensadores' }, { label: t.nome }]} title={t.nome} lede={t.escopo}>
        <TagsDaEntrada tipo={t.tipo} lista={t.universos} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          <StatusTag status={t.status} />
          <Tag>Recorte curatorial</Tag>
        </div>
      </PageHeader>
      <Section title="Como ler esta entrada">
        <p>{TIPO_PARTICIPACAO[t.tipo].descricao} Esta página descreve um recorte de estudo, não uma biografia, e não fala em nome da tradição.</p>
        <Notice title="Cuidados de interpretação">{t.cuidado}</Notice>
      </Section>
      {t.conflito && (
        <Section title="Ponto em aberto na curadoria">
          <p>{t.conflito}</p>
        </Section>
      )}
      {t.registrosNoCatalogo.length > 0 && (
        <Section title="Registros correspondentes no catálogo">
          <LinksDeEntradas ids={t.registrosNoCatalogo} />
        </Section>
      )}
      {t.autoresRelacionados.length > 0 && (
        <Section title="Autores relacionados">
          <p className="hint mb-2">Autores e esta tradição não entram juntos no Conselho como vozes independentes.</p>
          <LinksDeEntradas ids={t.autoresRelacionados} />
        </Section>
      )}
      {(obras.length > 0 || t.edicaoTraducao) && (
        <Section title="Obras e edição">
          {obras.length > 0 && (
            <ul className="prose-list">
              {obras.map((w) => (
                <li key={w.id}>{w.title}</li>
              ))}
            </ul>
          )}
          {t.edicaoTraducao && <p className="meta mt-2">Edição ou tradução de referência: {t.edicaoTraducao}</p>}
        </Section>
      )}
      {(t.parteDe || (t.corpora ?? []).length > 0) && (
        <Section title="Relações com outras entradas">
          <LinksDeEntradas ids={[...(t.parteDe ? [t.parteDe] : []), ...(t.corpora ?? [])]} />
        </Section>
      )}
    </>
  );
}

const CONFERENCIA_CURTA: Record<ReferenciaBase['conferencia']['situacao'], string> = {
  metadados_confirmados: 'Metadados conferidos',
  edicao_a_confirmar: 'Edição a confirmar',
  a_confirmar: 'A confirmar',
};

/** Uma referência-base (DEC-CUR-04): só mostra o que foi conferido; o resto aparece como lacuna. */
function ReferenciaItem({ r }: { r: ReferenciaBase }) {
  const dados = [
    r.autores.length ? `${r.relacao === 'source_witness_for' ? 'Autor do testemunho' : 'Autoria'}: ${r.autores.join(', ')}` : '',
    r.organizador ? `Organização ou edição: ${r.organizador}` : '',
    r.tradutor ? `Tradução: ${r.tradutor}` : '',
    r.editora ? `Editora: ${r.editora}` : '',
    r.ano ? `Ano: ${r.ano}` : '',
    r.edicao ? `Edição: ${r.edicao}` : '',
    r.isbn ? `ISBN ${r.isbn}` : '',
    r.doi ? `DOI ${r.doi}` : '',
  ].filter(Boolean);
  return (
    <li className="entry" data-referencia={r.workId}>
      <p>
        <strong>{r.titulo}</strong>
        {r.tituloOriginal && <span className="meta"> · {r.tituloOriginal}</span>}
      </p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        <Tag>{TIPO_FONTE[r.tipoFonte]}</Tag>
        {/* Etiqueta curta (a .tag não quebra linha); a descrição completa vem no parágrafo abaixo, para caber em 360px. */}
        <Tag accent={r.conferencia.situacao !== 'metadados_confirmados'}>{CONFERENCIA_CURTA[r.conferencia.situacao]}</Tag>
      </div>
      <p className="meta mt-1">{SITUACAO_CONFERENCIA[r.conferencia.situacao]}.</p>
      {dados.length > 0 && <p className="meta mt-2">{dados.join(' · ')}</p>}
      <p className="hint mt-1">{r.notaAtribuicao}</p>
      {/* DEC-CUR-10: completude bibliográfica e confiabilidade são dimensões diferentes. */}
      <p className="meta mt-1" data-completude={completudeBibliografica(r)}>
        {COMPLETUDE_BIBLIOGRAFICA[completudeBibliografica(r)]}. Confiabilidade da fonte: não avaliada (sem rubrica aprovada; não é inferida da falta de metadados).
      </p>
      {r.confiabilidade?.natureza && (
        <p className="hint mt-1" data-natureza-testemunho>
          {r.confiabilidade.natureza}
          {r.confiabilidade.localizacao && <span className="meta"> ({r.confiabilidade.localizacao})</span>}
        </p>
      )}
      {r.conferencia.lacunas.length > 0 && <p className="meta mt-1">A confirmar: {r.conferencia.lacunas.join('; ')}.</p>}
      <p className="meta mt-1">
        <a href={r.conferencia.fonte} target="_blank" rel="noopener noreferrer">
          Página consultada na conferência
        </a>
      </p>
    </li>
  );
}

export function ThinkerPage() {
  const { id = '' } = useParams();
  const thinker = getThinker(id);
  if (!thinker) {
    const candidato = getCandidato(id);
    if (candidato) return <CandidatoView c={candidato} />;
    const tradicao = getTradicao(id);
    if (tradicao) return <TradicaoView t={tradicao} />;
    return <EmptyState title="Pensador não encontrado">Volte à <Link to="/conselho/pensadores">lista de pensadores</Link>.</EmptyState>;
  }
  const works = worksOfThinker(thinker);
  const related = virtuesOfThinker(thinker.id);
  const cases = casesOfThinker(thinker.id);
  const classificacao = getClassificacao(thinker.id);
  const recortes = tradicoes.filter((t) => t.registrosNoCatalogo.includes(thinker.id));
  const avaliadas = related.filter(({ relation }) => evidenciasDaRelacao(relation.id).length > 0).length;
  const corpusDeApoio = thinker.council && papelDoRegistro(thinker) === 'contextual_corpus';
  const contextualiza = apoiadosPor(thinker.id);
  const apoiosDaPessoa = apoiosDe(thinker.id);
  const vinculosDaPessoa = vinculosDe(thinker.id);
  const referencias = referenciasDe(thinker.id);
  const testemunhos = referencias.length > 0 && referencias.every((r) => r.relacao === 'source_witness_for');
  return (
    <>
      <PageHeader crumbs={[{ label: 'Conselho de Sabedoria', to: '/conselho' }, { label: 'Pensadores', to: '/conselho/pensadores' }, { label: thinker.name }]} title={thinker.name} lede={thinker.field}>
        <p className="meta mt-2">{[thinker.tradition, thinker.period].filter(Boolean).join(' · ')}</p>
        <div className="mt-4 flex flex-wrap items-end gap-5 text-accent">
          <EmblemaTradicaoSimbolo tradicao={thinker.tradition} size={56} />
          <AssinaturaVirtude cor="var(--fg)" rotulo="assinatura-pensador" relacoes={relacoesDoPensador(thinker.id)} size={56} animado />
          <p className="meta max-w-legenda text-muted">O emblema marca a tradição. Os anéis vêm das dimensões das virtudes relacionadas a este pensador na base, não de uma classificação do seu pensamento.</p>
        </div>
        {classificacao && <TagsDaEntrada tipo={classificacao.tipo} lista={classificacao.universos} />}
        {classificacao && (
          <p className="meta mt-2">
            {classificacao.nota ? `${classificacao.nota} ` : ''}
            {taxonomia.aviso}.
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <StatusTag status={thinker.status} />
          {!thinker.council && <Tag accent quebra>{NAO_HABILITADO}</Tag>}
          {corpusDeApoio && <Tag accent quebra>{PAPEL_SELECAO.contextual_corpus}</Tag>}
        </div>
        {corpusDeApoio && (
          <Notice title="Corpus de apoio, não pessoa">
            Este registro continua habilitado no catálogo, mas não ocupa vaga entre as vozes do Conselho e não fala em primeira pessoa. Ele pode dar contexto, conceitos e fontes a uma perspectiva individual
            {contextualiza.length > 0 && (
              <>
                {': '}
                {contextualiza.map((a, i) => (
                  <span key={a.pessoa}>
                    {i > 0 && '; '}
                    <Link to={`/conselho/pensadores/${a.pessoa}`}>{getThinker(a.pessoa)?.name ?? a.pessoa}</Link> (recorte {a.recorte})
                  </span>
                ))}
              </>
            )}
            .
          </Notice>
        )}
        {recortes.length > 0 && (
          <p className="meta mt-2">
            Recorte curatorial:{' '}
            {recortes.map((t, i) => (
              <span key={t.id}>
                {i > 0 && ' · '}
                <Link to={`/conselho/pensadores/${t.id}`}>{t.nome}</Link>
              </span>
            ))}
          </p>
        )}
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
            <p className="font-display text-subtitulo text-accent">{thinker.question}</p>
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
          <p className="hint">
            {referencias.length
              ? `Nenhuma obra no catálogo para este integrante. ${testemunhos ? 'Veja os testemunhos abaixo.' : 'Veja as referências-base abaixo.'}`
              : 'Nenhuma obra registrada na base para este integrante. Fundamentação a completar pela curadoria.'}
          </p>
        )}
      </Section>

      {referencias.length > 0 && (
        <Section title={testemunhos ? `Testemunhos sobre ${thinker.name}` : 'Referências-base'}>
          <p className="hint mb-3">
            {testemunhos
              ? `${thinker.name} não deixou obra escrita preservada. O que se sabe vem de testemunhos de terceiros, com vieses e divergências entre si. Nenhum destes textos é de autoria de ${thinker.name}.`
              : 'Referência bibliográfica cadastrada pela curadoria. Cadastrar uma referência não valida nenhuma relação com virtude.'}
          </p>
          <ul className="grid gap-3">
            {referencias.map((r) => (
              <ReferenciaItem key={r.workId} r={r} />
            ))}
          </ul>
        </Section>
      )}

      {(vinculosDaPessoa.length > 0 || apoiosDaPessoa.length > 0) && (
        <Section title="Recorte desta perspectiva">
          <p className="hint mb-3">O vínculo com uma tradição é registrado com o tipo de relação e a fonte. O que não tem fonte específica fica a confirmar; o que não deve ser afirmado fica marcado.</p>
          <ul className="grid gap-3">
            {vinculosDaPessoa.map((v) => (
              <li key={v.id} className="entry" data-vinculo={v.situacao}>
                <p>
                  <strong>{v.alvo}</strong> <span className="meta">· {TIPO_VINCULO[v.tipo]}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Tag accent={v.situacao !== 'sustentado_por_fonte'}>{SITUACAO_VINCULO[v.situacao]}</Tag>
                </div>
                {v.escopo && <p className="mt-2">Escopo: {v.escopo}</p>}
                {v.trecho && <p className="meta mt-2">“{v.trecho}”</p>}
                {(v.natureza || v.localizacao || v.dataFonte) && (
                  <p className="meta mt-1">{[v.natureza, v.localizacao, v.dataFonte ? `data: ${v.dataFonte}` : ''].filter(Boolean).join(' · ')}</p>
                )}
                <p className="hint mt-1">{v.nota}</p>
                {v.fonte && v.situacao === 'a_confirmar' && (
                  <p className="meta mt-1" data-fonte-em-revisao>
                    Fonte registrada em revisão: não conta como confirmação deste vínculo.
                  </p>
                )}
                {v.fonte && (
                  <p className="meta mt-1">
                    <a href={v.fonte} target="_blank" rel="noopener noreferrer">
                      {v.situacao === 'a_confirmar' ? 'Fonte em revisão' : 'Fonte consultada'}
                    </a>
                  </p>
                )}
                {(v.fontesComplementares ?? []).map((fc) => (
                  <p key={fc.url + fc.localizacao} className="meta mt-1">
                    Também: {fc.referencia}, {fc.localizacao} — “{fc.trecho}” ({fc.natureza}).{' '}
                    <a href={fc.url} target="_blank" rel="noopener noreferrer">
                      Abrir fonte
                    </a>
                  </p>
                ))}
              </li>
            ))}
          </ul>
          {apoiosDaPessoa.map((a) => (
            <p key={a.corpus} className="mt-3">
              Contexto de apoio: <Link to={`/conselho/pensadores/${a.corpus}`}>{getThinker(a.corpus)?.name ?? a.corpus}</Link>, recorte {a.recorte}. {a.papel}
            </p>
          ))}
        </Section>
      )}

      <Section title="Virtudes relacionadas">
        <div className="flex flex-wrap gap-2">
          {related.map(({ virtue, relation }) => (
            <Link key={relation.id} to={`/virtudes/${virtue.id}`} className="chip">
              {virtue.name}
              {relation.relationType && <span className="meta ml-2">{relation.relationType}</span>}
              {evidenciasDaRelacao(relation.id).map((ev, j) => ev.nivel && <span key={j} className="meta ml-2" title={NIVEL_FUNDAMENTACAO[ev.nivel].nome}>{ev.nivel}</span>)}
            </Link>
          ))}
        </div>
        <p className="hint mt-3">
          {avaliadas === 0
            ? 'A fundamentação de cada relação (níveis F1 a F4 do Documento 14) ainda não foi avaliada pela curadoria. As obras e referências acima valem para o integrante como um todo, não para cada virtude: referência cadastrada não é relação validada.'
            : `${avaliadas} de ${related.length} relações têm evidência registrada pela curadoria.`}
        </p>
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
