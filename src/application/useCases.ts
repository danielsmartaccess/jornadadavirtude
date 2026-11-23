/* Casos de uso (Documento 08, seção 12). Funções puras: recebem o estado do usuário
 * e devolvem um novo estado, aplicando as regras de negócio do Documento 07 (RN-xxx).
 * Não dependem de React nem de armazenamento. Violação de regra lança DomainError
 * com mensagem pronta para ser mostrada à pessoa. */
import {
  canArchiveJourney,
  canCompleteJourney,
  canDiscardJourney,
  canPauseJourney,
  canResumeJourney,
  canStartJourney,
  currentStageName,
  defaultTitle,
  emptyStages,
  isOpenJourney,
} from '../domain/journey';
import type {
  CouncilSession,
  DiaryEntry,
  Journey,
  JourneyEvent,
  JourneyOrigin,
  Review,
  StageId,
  StageState,
  UserData,
} from '../domain/types';
import { isCrisisInput } from '../domain/crisis';
import { isDate, newId, stamp } from '../shared/util';

export class DomainError extends Error {}

/** Mensagem da recusa de criar sessão comum do Conselho quando o texto traz sinal de risco. */
export const CRISIS_BLOCKED =
  'O Conselho não foi convocado: o texto menciona algo que pede o apoio de pessoas e serviços preparados. Nenhuma sessão foi criada.';

export const activeJourney = (data: UserData): Journey | undefined => data.journeys.find((j) => j.status === 'ACTIVE');
export const journeyById = (data: UserData, id: string | null | undefined) => data.journeys.find((j) => j.id === id);
export const entriesOf = (data: UserData, journeyId: string) => data.entries.filter((e) => e.journeyId === journeyId);
export const reviewsOf = (data: UserData, journeyId: string) => data.reviews.filter((r) => r.journeyId === journeyId);
export const sessionsOf = (data: UserData, journeyId: string) => data.sessions.filter((s) => s.journeyId === journeyId);

/** Jornada que a tela "Minha Jornada" mostra: a ativa; senão a pausada ou o rascunho mais recente. */
export function focusJourney(data: UserData): Journey | undefined {
  return (
    activeJourney(data) ??
    data.journeys.find((j) => j.status === 'PAUSED' && !j.archivedAt) ??
    data.journeys.find((j) => j.status === 'DRAFT')
  );
}

type Stamped = { id: string; createdAt: string; updatedAt: string };

function upsert<T extends Stamped>(items: T[], item: T): T[] {
  const stamped = stamp(item);
  return items.some((x) => x.id === item.id) ? items.map((x) => (x.id === item.id ? stamped : x)) : [...items, stamped];
}

function requireJourney(data: UserData, id: string): Journey {
  const journey = journeyById(data, id);
  if (!journey) throw new DomainError('Jornada não encontrada.');
  return journey;
}

function mapJourney(data: UserData, id: string, change: (journey: Journey) => Journey): UserData {
  requireJourney(data, id);
  return { ...data, journeys: data.journeys.map((j) => (j.id === id ? stamp(change(j)) : j)) };
}

const event = (date: string, kind: JourneyEvent['kind'], detail = ''): JourneyEvent => ({ date, kind, detail });

/* ------------------------------------------------------------------------- */
/* Jornada: criação e ciclo de vida                                           */
/* ------------------------------------------------------------------------- */

export interface CreateJourneyInput {
  title?: string;
  virtueId: string | null;
  virtueName: string;
  origin?: JourneyOrigin;
  motivation: string;
  situation?: string;
  expectation?: string;
}

/** CreateJourney. RN-001 a RN-005: id único, intenção e virtude principal obrigatórias, nasce em rascunho. */
export function createJourney(data: UserData, input: CreateJourneyInput, today: string): { data: UserData; journey: Journey } {
  const virtueName = input.virtueName.trim();
  if (!virtueName) throw new DomainError('Escolha a virtude principal antes de criar a jornada.');
  if (!input.motivation.trim()) throw new DomainError('Registre a intenção da jornada: o que motiva você a começar?');
  const now = new Date().toISOString();
  const journey: Journey = {
    id: newId(),
    title: input.title?.trim() || defaultTitle(virtueName),
    virtueId: input.virtueId,
    virtueName,
    relatedVirtueIds: [],
    status: 'DRAFT',
    archivedAt: '',
    origin: input.origin ?? 'virtude',
    startedOn: '',
    pausedOn: '',
    completedOn: '',
    history: [event(today, 'criada')],
    notes: '',
    intention: { motivation: input.motivation.trim(), situation: input.situation?.trim() ?? '', expectation: input.expectation?.trim() ?? '' },
    stages: { ...emptyStages(), despertar: { state: 'em-andamento', date: today } },
    investigation: {},
    intake: { admira: [], situacao: [], pedido: [] },
    plan: '',
    exercises: [],
    createdAt: now,
    updatedAt: now,
  };
  return { data: { ...data, journeys: [journey, ...data.journeys] }, journey };
}

/** StartJourney (DRAFT → ACTIVE). Só há uma jornada ativa: a outra precisa ser pausada antes. */
export function startJourney(data: UserData, id: string, today: string, options: { pauseActive?: boolean } = {}): UserData {
  const journey = requireJourney(data, id);
  if (!canStartJourney(journey)) throw new DomainError('Só uma jornada em rascunho pode ser iniciada.');
  return activate(data, id, today, options, (j) => ({ ...j, status: 'ACTIVE', startedOn: today, history: [...j.history, event(today, 'iniciada')] }));
}

/** PauseJourney (ACTIVE → PAUSED). */
export function pauseJourney(data: UserData, id: string, today: string): UserData {
  if (!canPauseJourney(requireJourney(data, id))) throw new DomainError('Só uma jornada em andamento pode ser pausada.');
  return mapJourney(data, id, (j) => ({ ...j, status: 'PAUSED', pausedOn: today, history: [...j.history, event(today, 'pausada')] }));
}

/** ResumeJourney (PAUSED → ACTIVE). RN-009: uma jornada concluída não volta a ficar ativa. */
export function resumeJourney(data: UserData, id: string, today: string, options: { pauseActive?: boolean } = {}): UserData {
  const journey = requireJourney(data, id);
  if (!canResumeJourney(journey)) {
    throw new DomainError(journey.status === 'COMPLETED' ? 'Uma jornada concluída não pode ser retomada. Você pode iniciar uma nova jornada com a mesma virtude.' : 'Só uma jornada pausada pode ser retomada.');
  }
  return activate(data, id, today, options, (j) => ({ ...j, status: 'ACTIVE', pausedOn: '', history: [...j.history, event(today, 'retomada')] }));
}

function activate(data: UserData, id: string, today: string, options: { pauseActive?: boolean }, change: (journey: Journey) => Journey): UserData {
  const other = activeJourney(data);
  let next = data;
  if (other && other.id !== id) {
    if (!options.pauseActive) throw new DomainError(`Você já tem uma jornada em andamento (“${other.title}”). Pause ou conclua essa jornada antes.`);
    next = pauseJourney(data, other.id, today);
  }
  return mapJourney(next, id, change);
}

/** CompleteJourney (ACTIVE|PAUSED → COMPLETED), com a revisão final e a síntese pessoal (US-008). */
export function completeJourney(data: UserData, review: Review, today: string): UserData {
  const journey = requireJourney(data, review.journeyId);
  if (!canCompleteJourney(journey)) throw new DomainError('Só uma jornada em andamento ou pausada pode ser concluída.');
  if (!review.synthesis.trim()) throw new DomainError('Escreva uma síntese pessoal para concluir a jornada.');
  let next = saveReview(data, { ...review, kind: 'final' }, today);
  next = setStageState(next, journey.id, 'revisar', 'concluida', today);
  /* RN-010: nada é apagado; a jornada passa ao histórico com todos os registros. */
  return mapJourney(next, journey.id, (j) => ({ ...j, status: 'COMPLETED', completedOn: today, pausedOn: '', history: [...j.history, event(today, 'concluida')] }));
}

/** RN-011 e RN-012: arquivar preenche archivedAt, sem mudar o estado nem excluir registros. */
export function archiveJourney(data: UserData, id: string, today: string): UserData {
  if (!canArchiveJourney(requireJourney(data, id))) throw new DomainError('Só uma jornada concluída e ainda não arquivada pode ser arquivada.');
  return mapJourney(data, id, (j) => ({ ...j, archivedAt: new Date().toISOString(), history: [...j.history, event(today, 'arquivada')] }));
}

export function unarchiveJourney(data: UserData, id: string, today: string): UserData {
  return mapJourney(data, id, (j) => (j.archivedAt ? { ...j, archivedAt: '', history: [...j.history, event(today, 'desarquivada')] } : j));
}

/** RN-006: só um rascunho pode ser descartado. Registros eventuais deixam de apontar para ele. */
export function discardDraft(data: UserData, id: string): UserData {
  if (!canDiscardJourney(requireJourney(data, id))) throw new DomainError('Só uma jornada em rascunho pode ser descartada.');
  return {
    ...data,
    journeys: data.journeys.filter((j) => j.id !== id),
    reviews: data.reviews.filter((r) => r.journeyId !== id),
    entries: data.entries.map((e) => (e.journeyId === id ? { ...e, journeyId: null } : e)),
    sessions: data.sessions.map((s) => (s.journeyId === id ? { ...s, journeyId: null } : s)),
  };
}

/** Edição dos dados de configuração e de trabalho da jornada (título, intenção, investigação, plano, observações). */
export function patchJourney(
  data: UserData,
  id: string,
  patch: Partial<Pick<Journey, 'title' | 'intention' | 'investigation' | 'intake' | 'plan' | 'notes'>>,
): UserData {
  if (patch.title !== undefined && !patch.title.trim()) throw new DomainError('Dê um título à jornada.');
  if (patch.intention && !patch.intention.motivation.trim()) throw new DomainError('A intenção da jornada não pode ficar vazia.');
  return mapJourney(data, id, (j) => ({ ...j, ...patch }));
}

/** SelectPrimaryVirtue. A decisão anterior fica no histórico de alterações da jornada (RF-018). */
export function selectPrimaryVirtue(data: UserData, id: string, virtue: { virtueId: string | null; virtueName: string }, today: string): UserData {
  if (!virtue.virtueName.trim()) throw new DomainError('Escolha uma virtude.');
  return mapJourney(data, id, (j) => {
    if (j.virtueName === virtue.virtueName && j.virtueId === virtue.virtueId) return j;
    return {
      ...j,
      ...virtue,
      relatedVirtueIds: j.relatedVirtueIds.filter((v) => v !== virtue.virtueId),
      history: [...j.history, event(today, 'virtude-alterada', `De “${j.virtueName}” para “${virtue.virtueName}”.`)],
    };
  });
}

/** AddRelatedVirtue. RN-004: virtudes relacionadas não substituem a principal. */
export function addRelatedVirtue(data: UserData, id: string, virtueId: string): UserData {
  return mapJourney(data, id, (j) =>
    j.virtueId === virtueId || j.relatedVirtueIds.includes(virtueId) ? j : { ...j, relatedVirtueIds: [...j.relatedVirtueIds, virtueId] },
  );
}

export function removeRelatedVirtue(data: UserData, id: string, virtueId: string): UserData {
  return mapJourney(data, id, (j) => ({ ...j, relatedVirtueIds: j.relatedVirtueIds.filter((v) => v !== virtueId) }));
}

/* ------------------------------------------------------------------------- */
/* Etapas e exercícios                                                        */
/* ------------------------------------------------------------------------- */

/** As etapas podem ser revisitadas; o estado é declarado pela pessoa (Doc. 06, RN04). */
export function setStageState(data: UserData, id: string, stage: StageId, state: StageState, today: string): UserData {
  return mapJourney(data, id, (j) => ({ ...j, stages: { ...j.stages, [stage]: { state, date: today } } }));
}

/** Trabalhar em uma etapa ainda não iniciada passa-a para "em andamento". */
export function touchStage(data: UserData, id: string, stage: StageId, today: string): UserData {
  const journey = journeyById(data, id);
  if (!journey || !isOpenJourney(journey) || journey.stages[stage].state !== 'nao-iniciada') return data;
  return setStageState(data, id, stage, 'em-andamento', today);
}

/** Associa um exercício à jornada (RF-052). A pessoa escolhe livremente, inclusive fora dos recomendados. */
export function startExercise(data: UserData, journeyId: string, exerciseId: string, today: string): UserData {
  const next = mapJourney(data, journeyId, (j) => {
    const own = j.exercises.find((e) => e.exerciseId === exerciseId);
    if (!own) return { ...j, exercises: [...j.exercises, { exerciseId, state: 'em-andamento', startedOn: today, times: 0 }] };
    if (own.state !== 'arquivado') return j;
    const state = own.times > 1 ? 'repetido' : own.times ? 'experimentado' : 'em-andamento';
    return { ...j, exercises: j.exercises.map((e) => (e === own ? { ...e, state } : e)) };
  });
  return touchStage(next, journeyId, 'praticar', today);
}

/** CreateExerciseRecord. RN-016 e RN-017: repetir faz parte; é experiência, não prova de domínio. */
function recordExercise(data: UserData, journeyId: string, exerciseId: string, today: string): UserData {
  return mapJourney(startExercise(data, journeyId, exerciseId, today), journeyId, (j) => ({
    ...j,
    exercises: j.exercises.map((e) =>
      e.exerciseId === exerciseId ? { ...e, times: e.times + 1, state: e.times + 1 > 1 ? 'repetido' : 'experimentado' } : e,
    ),
  }));
}

export function archiveExercise(data: UserData, journeyId: string, exerciseId: string): UserData {
  return mapJourney(data, journeyId, (j) => ({
    ...j,
    exercises: j.exercises.map((e) => (e.exerciseId === exerciseId ? { ...e, state: 'arquivado' } : e)),
  }));
}

/* ------------------------------------------------------------------------- */
/* Diário, revisões e Conselho                                                */
/* ------------------------------------------------------------------------- */

/** Um registro novo guarda a virtude e a etapa vigentes da jornada. */
export function stampEntry(journey: Journey | undefined, entry: DiaryEntry): DiaryEntry {
  if (!journey) return { ...entry, journeyId: null };
  return {
    ...entry,
    journeyId: journey.id,
    virtueId: entry.virtueId ?? journey.virtueId,
    virtue: entry.virtue || journey.virtueName,
    stage: entry.stage || currentStageName(journey),
  };
}

/** CreateDiaryEntry / edição. RN-018 e RN-019: o diário é voluntário e independe de exercício. */
export function saveEntry(data: UserData, entry: DiaryEntry, today: string): UserData {
  if (!entry.situation.trim()) throw new DomainError('Descreva a situação antes de salvar o registro.');
  if (!isDate(entry.date)) throw new DomainError('Informe uma data válida para o registro.');
  if (entry.journeyId && !journeyById(data, entry.journeyId)) throw new DomainError('A jornada deste registro não foi encontrada.');
  const isNew = !data.entries.some((e) => e.id === entry.id);
  let next: UserData = { ...data, entries: upsert(data.entries, { ...entry, situation: entry.situation.trim() }) };
  if (isNew && entry.journeyId) {
    next = touchStage(next, entry.journeyId, 'registrar', today);
    const journey = journeyById(next, entry.journeyId);
    if (entry.exerciseId && journey && isOpenJourney(journey)) next = recordExercise(next, entry.journeyId, entry.exerciseId, today);
  }
  return next;
}

export const deleteEntry = (data: UserData, id: string): UserData => ({ ...data, entries: data.entries.filter((e) => e.id !== id) });

/** CreateReview. Cada revisão é um item datado; não exige registros no diário (RN-020, CT-010). */
export function saveReview(data: UserData, review: Review, today: string): UserData {
  requireJourney(data, review.journeyId);
  if (!isDate(review.date)) throw new DomainError('Informe uma data válida para a revisão.');
  const hasContent = [review.synthesis, review.learnings, review.perception, ...Object.values(review.answers)].some((t) => t.trim());
  if (!hasContent) throw new DomainError('Responda ao menos uma pergunta ou escreva a síntese para salvar a revisão.');
  return touchStage({ ...data, reviews: upsert(data.reviews, review) }, review.journeyId, 'revisar', today);
}

export const deleteReview = (data: UserData, id: string): UserData => ({ ...data, reviews: data.reviews.filter((r) => r.id !== id) });

/** Uma sessão do Conselho pode estar ligada a uma jornada ou ser independente. */
export function saveSession(data: UserData, session: CouncilSession, today: string): UserData {
  if (!session.situation.trim()) throw new DomainError('Descreva a situação que deseja analisar.');
  /* Gate de segurança (Doc. 13 v2, seção 13): uma situação com sinal de risco não vira sessão comum.
   * Vale só para a criação; atualizar uma sessão já existente (reflexão, ação, hipóteses) segue igual. */
  const isNew = !data.sessions.some((s) => s.id === session.id);
  if (isNew && isCrisisInput(session.situation, session.doubt)) throw new DomainError(CRISIS_BLOCKED);
  const next: UserData = { ...data, sessions: upsert(data.sessions, session) };
  return session.journeyId ? touchStage(next, session.journeyId, 'refletir', today) : next;
}

export const deleteSession = (data: UserData, id: string): UserData => ({
  ...data,
  sessions: data.sessions.filter((s) => s.id !== id),
  entries: data.entries.map((e) => (e.sessionId === id ? { ...e, sessionId: null } : e)),
});
