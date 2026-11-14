/* Porta única de entrada de dados do usuário: tudo o que vem do localStorage, de um
 * arquivo importado ou da nuvem passa por aqui antes de chegar às telas. Nunca lança
 * erro por conteúdo malformado: descarta ou corrige e informa quantos itens ignorou. */
import { defaultTitle, emptyStages, STAGE_IDS } from '../domain/journey';
import type {
  CouncilContribution,
  CouncilSession,
  DiaryEntry,
  EntryType,
  ExerciseState,
  Journey,
  JourneyEvent,
  JourneyExercise,
  JourneyOrigin,
  JourneyStatus,
  Review,
  ReviewKind,
  StageState,
  UserData,
} from '../domain/types';
import { isDate, newId } from '../shared/util';

export const LIMITS = { journeys: 100, entries: 5000, reviews: 2000, sessions: 500 };

const DIM_RE = /^DIM0[1-7]$/;
const VIRTUE_RE = /^V\d{2}$/;
const STATUSES: JourneyStatus[] = ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'];
const EVENTS: JourneyEvent['kind'][] = ['criada', 'iniciada', 'pausada', 'retomada', 'concluida', 'arquivada', 'desarquivada', 'virtude-alterada'];
const ORIGINS: JourneyOrigin[] = ['virtude', 'situacao', 'exploracao', 'legado'];
const STAGE_STATES: StageState[] = ['nao-iniciada', 'em-andamento', 'concluida', 'retomada', 'nao-aplicavel'];
const EXERCISE_STATES: ExerciseState[] = ['em-andamento', 'experimentado', 'repetido', 'arquivado'];
const ENTRY_TYPES: EntryType[] = ['PRACTICE', 'DIFFICULTY', 'REFLECTION', 'DISCOVERY'];
const REVIEW_KINDS: ReviewKind[] = ['periodica', 'final', 'legado'];

export function emptyData(): UserData {
  return { schema: 4, journeys: [], entries: [], reviews: [], sessions: [] };
}

export function isEmptyData(data: UserData): boolean {
  return !data.journeys.length && !data.entries.length && !data.reviews.length && !data.sessions.length;
}

export function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export function strList(value: unknown, maxItems = 30, maxLength = 200): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
    .slice(0, maxItems)
    .map((item) => item.slice(0, maxLength));
}

const date = (value: unknown) => (isDate(value) ? value : '');
const record = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
const list = (value: unknown, max: number): unknown[] => (Array.isArray(value) ? value.slice(0, max) : []);
const oneOf = <T extends string>(value: unknown, allowed: T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;
const virtueId = (value: unknown) => (VIRTUE_RE.test(str(value, 10)) ? str(value, 10) : null);

/** Respostas livres por id de pergunta: só texto, sem chaves vazias. */
function answers(value: unknown, maxLength = 4000): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, text] of Object.entries(record(value) ?? {}).slice(0, 40)) {
    if (typeof text === 'string' && text.trim() && key.length <= 40) out[key] = text.slice(0, maxLength);
  }
  return out;
}

function idFactory() {
  const seen = new Set<string>();
  return (value: unknown): string => {
    let id = str(value, 60);
    if (!id || seen.has(id)) id = newId();
    seen.add(id);
    return id;
  };
}

function timestamps(raw: Record<string, unknown>, fallback: string) {
  const createdAt = str(raw.createdAt, 40) || fallback;
  return { createdAt, updatedAt: str(raw.updatedAt, 40) || createdAt };
}

function sanitizeJourney(raw: Record<string, unknown>, id: string): Journey {
  const intention = record(raw.intention) ?? {};
  const intake = record(raw.intake) ?? {};
  const rawStages = record(raw.stages) ?? {};
  const stages = emptyStages();
  for (const stage of STAGE_IDS) {
    const s = record(rawStages[stage]);
    if (s) stages[stage] = { state: oneOf(s.state, STAGE_STATES, 'nao-iniciada'), date: date(s.date) };
  }
  const exercises: JourneyExercise[] = [];
  for (const item of list(raw.exercises, 100)) {
    const e = record(item);
    const exerciseId = e ? str(e.exerciseId, 20) : '';
    if (!e || !exerciseId || exercises.some((x) => x.exerciseId === exerciseId)) continue;
    exercises.push({
      exerciseId,
      state: oneOf(e.state, EXERCISE_STATES, 'em-andamento'),
      startedOn: date(e.startedOn),
      times: typeof e.times === 'number' && e.times > 0 ? Math.min(Math.floor(e.times), 9999) : 0,
    });
  }
  const history: JourneyEvent[] = list(raw.history, 200).flatMap((item) => {
    const h = record(item);
    return h && isDate(h.date) && EVENTS.includes(h.kind as JourneyEvent['kind'])
      ? [{ date: h.date, kind: h.kind as JourneyEvent['kind'], detail: str(h.detail, 300) }]
      : [];
  });
  const startedOn = date(raw.startedOn);
  const virtueName = str(raw.virtueName, 100).trim();
  const primary = virtueId(raw.virtueId);
  return {
    id,
    title: str(raw.title, 120).trim() || defaultTitle(virtueName),
    virtueId: primary,
    virtueName,
    relatedVirtueIds: Array.from(new Set(strList(raw.relatedVirtueIds, 12).filter((v) => VIRTUE_RE.test(v) && v !== primary))),
    status: oneOf(raw.status, STATUSES, 'COMPLETED'),
    archivedAt: str(raw.archivedAt, 40),
    origin: oneOf(raw.origin, ORIGINS, 'virtude'),
    startedOn,
    pausedOn: date(raw.pausedOn),
    completedOn: date(raw.completedOn),
    history,
    notes: str(raw.notes, 4000),
    intention: {
      motivation: str(intention.motivation, 2000),
      situation: str(intention.situation, 4000),
      expectation: str(intention.expectation, 2000),
    },
    stages,
    investigation: answers(raw.investigation),
    intake: { admira: strList(intake.admira), situacao: strList(intake.situacao), pedido: strList(intake.pedido) },
    plan: str(raw.plan, 2000),
    exercises,
    ...timestamps(raw, startedOn),
  };
}

function sanitizeContribution(raw: unknown): CouncilContribution | null {
  const c = record(raw);
  const thinkerId = c ? str(c.thinkerId, 60) : '';
  if (!c || !thinkerId) return null;
  return {
    thinkerId,
    perspective: str(c.perspective, 600),
    question: str(c.question, 600),
    reason: str(c.reason, 600),
    workIds: strList(c.workIds, 10, 20),
  };
}

export interface SanitizeResult {
  data: UserData;
  /** Itens descartados por formato inválido. */
  ignored: number;
}

export function sanitizeWithReport(input: unknown): SanitizeResult {
  const raw = record(input) ?? {};
  let ignored = 0;

  /* Jornadas: ids únicos e no máximo uma ativa; as demais ativas ficam pausadas. */
  const journeyId = idFactory();
  const journeys: Journey[] = [];
  for (const item of list(raw.journeys, LIMITS.journeys)) {
    const j = record(item);
    if (!j) {
      ignored++;
      continue;
    }
    journeys.push(sanitizeJourney(j, journeyId(j.id)));
  }
  let activeFound = false;
  for (const j of journeys) {
    if (j.status !== 'ACTIVE') continue;
    if (activeFound) j.status = 'PAUSED';
    activeFound = true;
  }
  const known = new Set(journeys.map((j) => j.id));

  /* Sessões do Conselho: vinculadas a uma jornada ou independentes (RN06). */
  const sessionId = idFactory();
  const sessions: CouncilSession[] = [];
  for (const item of list(raw.sessions, LIMITS.sessions)) {
    const s = record(item);
    if (!s || !isDate(s.date)) {
      ignored++;
      continue;
    }
    const linked = str(s.journeyId, 60);
    sessions.push({
      id: sessionId(s.id),
      date: s.date,
      situation: str(s.situation, 4000),
      doubt: str(s.doubt, 2000),
      caseId: str(s.caseId, 20) || null,
      dimensionIds: strList(s.dimensionIds, 7).filter((d) => DIM_RE.test(d)),
      virtueIds: strList(s.virtueIds, 12).filter((v) => VIRTUE_RE.test(v)),
      contributions: list(s.contributions, 8).flatMap((c) => sanitizeContribution(c) ?? []),
      reflection: str(s.reflection, 4000),
      action: str(s.action, 2000),
      journeyId: known.has(linked) ? linked : null,
      ...timestamps(s, s.date),
    });
  }
  const knownSessions = new Set(sessions.map((s) => s.id));

  /* Diário: situação e data são obrigatórias; a jornada é opcional (RN05). */
  const entryId = idFactory();
  const entries: DiaryEntry[] = [];
  for (const item of list(raw.entries, LIMITS.entries)) {
    const e = record(item);
    const situation = e ? str(e.situation, 400).trim() : '';
    if (!e || !situation || !isDate(e.date)) {
      ignored++;
      continue;
    }
    const jid = str(e.journeyId, 60);
    const sid = str(e.sessionId, 60);
    entries.push({
      id: entryId(e.id),
      journeyId: known.has(jid) ? jid : null,
      date: e.date,
      type: oneOf(e.type, ENTRY_TYPES, 'DIFFICULTY'),
      virtueId: virtueId(e.virtueId),
      virtue: str(e.virtue, 100),
      situation,
      context: str(e.context, 2000),
      thoughts: str(e.thoughts, 2000),
      feelings: strList(e.feelings),
      actions: strList(e.actions),
      consequences: str(e.consequences, 2000),
      learning: str(e.learning, 2000),
      note: str(e.note, 2000),
      stage: str(e.stage, 40),
      exerciseId: str(e.exerciseId, 20) || null,
      sessionId: knownSessions.has(sid) ? sid : null,
      ...timestamps(e, e.date),
    });
  }

  /* Revisões: precisam de data válida, jornada conhecida e algum conteúdo. */
  const reviewId = idFactory();
  const reviews: Review[] = [];
  for (const item of list(raw.reviews, LIMITS.reviews)) {
    const r = record(item);
    if (!r || !isDate(r.date) || !known.has(str(r.journeyId, 60))) {
      ignored++;
      continue;
    }
    const review: Review = {
      id: reviewId(r.id),
      journeyId: str(r.journeyId, 60),
      kind: oneOf(r.kind, REVIEW_KINDS, 'periodica'),
      date: r.date,
      periodStart: date(r.periodStart),
      periodEnd: date(r.periodEnd),
      answers: answers(r.answers),
      synthesis: str(r.synthesis, 4000),
      learnings: str(r.learnings, 4000),
      perception: str(r.perception, 4000),
      firstWeek: str(r.firstWeek, 40),
      lastWeek: str(r.lastWeek, 40),
      moments: strList(r.moments),
      ...timestamps(r, r.date),
    };
    const hasContent =
      Object.keys(review.answers).length > 0 ||
      [review.synthesis, review.learnings, review.perception, review.firstWeek, review.lastWeek].some((t) => t.trim()) ||
      review.moments.length > 0;
    if (!hasContent) {
      ignored++;
      continue;
    }
    reviews.push(review);
  }

  return { data: { schema: 4, journeys, entries, reviews, sessions }, ignored };
}

export function sanitizeUserData(input: unknown): UserData {
  return sanitizeWithReport(input).data;
}
