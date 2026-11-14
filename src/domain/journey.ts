/* Regras da jornada individual (puras: não dependem de React, navegador ou banco).
 * Ciclo de vida: Documento 07, seção 9. Etapas e estados: Documento 06, seção 8.
 * Investigação: Doc. 06 seção 9 e RF-033 a RF-041. Revisões: RF-075 a RF-086.
 * As durações são só a referência inicial do Documento 01: o ritmo é de quem faz a jornada. */
import { exercises, exercisesOfDimension, exercisesOfVirtue, virtueDimensions } from './catalog';
import type {
  CouncilSession,
  DiaryEntry,
  EntryType,
  Exercise,
  Journey,
  JourneyStatus,
  Review,
  StageId,
  StageProgress,
  StageState,
} from './types';
import { isDate } from '../shared/util';

/* ------------------------------------------------------------------------- */
/* Ciclo de vida                                                              */
/* ------------------------------------------------------------------------- */

export const STATUS_LABEL: Record<JourneyStatus, string> = {
  DRAFT: 'Rascunho',
  ACTIVE: 'Em andamento',
  PAUSED: 'Pausada',
  COMPLETED: 'Concluída',
};

export const isArchived = (journey: Journey) => journey.archivedAt !== '';
/** RN-006: um rascunho pode ser iniciado, editado ou descartado. */
export const canStartJourney = (journey: Journey) => journey.status === 'DRAFT';
export const canDiscardJourney = (journey: Journey) => journey.status === 'DRAFT';
/** RN-007. */
export const canPauseJourney = (journey: Journey) => journey.status === 'ACTIVE';
/** RN-008 e RN-009: só uma jornada pausada é retomada; a concluída não volta a ficar ativa. */
export const canResumeJourney = (journey: Journey) => journey.status === 'PAUSED';
export const canCompleteJourney = (journey: Journey) => journey.status === 'ACTIVE' || journey.status === 'PAUSED';
/** RN-011: arquivar organiza o histórico e não muda o estado. */
export const canArchiveJourney = (journey: Journey) => journey.status === 'COMPLETED' && !isArchived(journey);
/** Jornadas que ainda aceitam trabalho (etapas, investigação, exercícios, revisões). */
export const isOpenJourney = (journey: Journey) => journey.status !== 'COMPLETED';

export const defaultTitle = (virtueName: string) => (virtueName ? `Jornada: ${virtueName}` : 'Nova jornada');

/* ------------------------------------------------------------------------- */
/* Etapas                                                                     */
/* ------------------------------------------------------------------------- */

export interface StageInfo {
  id: StageId;
  name: string;
  hint: string;
  /** Duração de referência herdada do método original, quando houver correspondência. */
  reference?: string;
}

export const STAGES: StageInfo[] = [
  { id: 'despertar', name: 'Despertar', hint: 'Reconhecer a motivação e registrar a intenção da jornada.' },
  { id: 'identificar', name: 'Identificar', hint: 'Conhecer a virtude principal e observar, sem julgamento, onde ela aparece.', reference: '1 semana' },
  { id: 'investigar', name: 'Investigar', hint: 'Compreender a virtude e a própria relação com ela.', reference: '2 semanas' },
  { id: 'refletir', name: 'Refletir', hint: 'Ampliar a compreensão com diferentes perspectivas. O Conselho é opcional.' },
  { id: 'praticar', name: 'Praticar', hint: 'Experimentar exercícios e comportamentos intencionais.', reference: '4 semanas' },
  { id: 'registrar', name: 'Registrar', hint: 'Anotar experiências no diário, em qualquer momento da jornada.' },
  { id: 'revisar', name: 'Revisar', hint: 'Reconhecer aprendizados e decidir como continuar.', reference: '1 semana' },
];

export const STAGE_IDS = STAGES.map((s) => s.id);
export const getStage = (id: StageId) => STAGES.find((s) => s.id === id)!;

/** Rótulo e símbolo de cada estado: o símbolo evita depender só de cor. */
export const STAGE_STATES: Record<StageState, { label: string; symbol: string }> = {
  'nao-iniciada': { label: 'Não iniciada', symbol: '○' },
  'em-andamento': { label: 'Em andamento', symbol: '◐' },
  concluida: { label: 'Concluída', symbol: '●' },
  retomada: { label: 'Retomada', symbol: '↻' },
  'nao-aplicavel': { label: 'Não aplicável', symbol: '–' },
};

export function emptyStages(): Record<StageId, StageProgress> {
  return Object.fromEntries(STAGE_IDS.map((id) => [id, { state: 'nao-iniciada', date: '' }])) as Record<StageId, StageProgress>;
}

const isOpenStage = (state: StageState) => state !== 'concluida' && state !== 'nao-aplicavel';

/** Etapa em que a pessoa está: a primeira ainda aberta. null quando todas foram concluídas. */
export function currentStage(journey: Journey): StageInfo | null {
  return STAGES.find((s) => isOpenStage(journey.stages[s.id].state)) ?? null;
}

export const currentStageName = (journey: Journey) => currentStage(journey)?.name ?? 'Etapas concluídas';

/** "Etapas trabalhadas: N de 7" indica participação no percurso, nunca desenvolvimento moral. */
export function workedStages(journey: Journey): number {
  return STAGE_IDS.filter((id) => ['em-andamento', 'concluida', 'retomada'].includes(journey.stages[id].state)).length;
}

/** Próxima ação sugerida: orienta sem impor (Documento 06, seção 2.2). */
export function nextAction(journey: Journey): { text: string; stage: StageId } {
  const stage = currentStage(journey)?.id ?? 'revisar';
  const text: Record<StageId, string> = {
    despertar: 'Rever a intenção desta jornada.',
    identificar: 'Conhecer os fundamentos da virtude principal.',
    investigar: 'Responder às perguntas de investigação, no seu ritmo.',
    refletir: 'Consultar perspectivas do Conselho de Sabedoria, se fizer sentido.',
    praticar: 'Escolher um exercício e experimentá-lo.',
    registrar: 'Anotar uma experiência no diário.',
    revisar: 'Fazer uma revisão do período ou a revisão final.',
  };
  return { text: text[stage], stage };
}

/* ------------------------------------------------------------------------- */
/* Diário, investigação e revisão: opções e perguntas                         */
/* ------------------------------------------------------------------------- */

export const ENTRY_TYPES: { id: EntryType; label: string }[] = [
  { id: 'PRACTICE', label: 'Prática' },
  { id: 'DIFFICULTY', label: 'Dificuldade' },
  { id: 'REFLECTION', label: 'Reflexão' },
  { id: 'DISCOVERY', label: 'Descoberta' },
];
export const entryTypeLabel = (type: EntryType) => ENTRY_TYPES.find((t) => t.id === type)?.label ?? type;

export const SITUATIONS = ['Discussão', 'Decisão adiada', 'Reação impulsiva', 'Silêncio que pesou', 'Promessa não cumprida'];
export const FEELINGS = ['Medo', 'Irritação', 'Vergonha', 'Cansaço', 'Pressa', 'Orgulho', 'Indiferença'];
export const ACTIONS = ['Reagi na hora', 'Adiei', 'Falei sem pensar', 'Calei', 'Fiz o que devia', 'Pedi desculpas'];

type IntakeId = 'admira' | 'situacao' | 'pedido';

export interface InvestigationBlock {
  id: string;
  title: string;
  intro: string;
  questions: { id: string; label: string }[];
  /** Pergunta de múltipla escolha herdada da versão anterior, quando houver. */
  intake?: { id: IntakeId; label: string; options: string[] };
}

/** Quatro blocos da investigação (Documento 06, seção 9.2). Perguntas de aplicação da plataforma. */
export const INVESTIGATION_BLOCKS: InvestigationBlock[] = [
  {
    id: 'compreender',
    title: 'Compreender',
    intro: 'O conceito da virtude e o que ela significa para você.',
    questions: [
      { id: 'inv-entendimento', label: 'Com as minhas palavras, o que é esta virtude?' },
      { id: 'inv-admira', label: 'O que admiro em quem a pratica?' },
    ],
    intake: { id: 'admira', label: 'Quem você admira faz algo que você não faz. O quê?', options: ['Mantém a calma sob pressão', 'Fala a verdade mesmo quando custa', 'Ouve antes de responder', 'Assume erros sem se justificar', 'Age sem esperar reconhecimento', 'Decide sem adiar'] },
  },
  {
    id: 'reconhecer',
    title: 'Reconhecer',
    intro: 'Situações vividas em que a virtude esteve presente ou foi difícil.',
    questions: [
      { id: 'rec-presente', label: 'Em que situações pratiquei esta virtude, mesmo de forma discreta?' },
      { id: 'rec-falta', label: 'Em que situações tive dificuldade de praticá-la?' },
    ],
    intake: { id: 'situacao', label: 'Qual situação da última semana você faria diferente?', options: ['Uma discussão com alguém próximo', 'Uma tarefa adiada', 'Uma crítica que engoli', 'Uma promessa não cumprida', 'Um silêncio que devia ter sido quebrado'] },
  },
  {
    id: 'padroes',
    title: 'Investigar',
    intro: 'Comportamentos e padrões que se repetem.',
    questions: [
      { id: 'pad-repete', label: 'Que comportamento meu se repete nessas situações?' },
      { id: 'pad-desvio', label: 'Entre a deficiência e o excesso desta virtude, para qual lado costumo pender?' },
      { id: 'pad-proximos', label: 'O que pessoas próximas percebem ou comentam sobre isso? (se quiser registrar)' },
    ],
    intake: { id: 'pedido', label: 'O que as pessoas próximas costumam pedir que você faça?', options: ['Responder com menos pressa', 'Falar de forma mais clara', 'Cumprir o que combinou', 'Não fugir de conversas difíceis', 'Escutar mais'] },
  },
  {
    id: 'motivacoes',
    title: 'Motivações',
    intro: 'Pensamentos, sentimentos e decisões por trás das reações.',
    questions: [
      { id: 'mot-pensamento', label: 'O que penso logo antes de agir assim?' },
      { id: 'mot-sentimento', label: 'O que sinto nesse momento?' },
      { id: 'mot-busca', label: 'O que estou tentando proteger ou obter quando decido assim?' },
    ],
  },
];

/** Perguntas da revisão periódica (RF-077 a RF-081). */
export const REVIEW_QUESTIONS = [
  { id: 'rev-praticas', label: 'Em que situações pratiquei a virtude neste período?' },
  { id: 'rev-dificuldades', label: 'Em que situações tive dificuldade?' },
  { id: 'rev-padroes', label: 'Que padrões eu mesmo percebo?' },
  { id: 'rev-aprendizados', label: 'O que aprendi neste período?' },
  { id: 'rev-atencao', label: 'O que merece atenção daqui para a frente?' },
];

/** Escala da versão anterior, usada apenas para ler revisões legadas. */
export const SCALE = ['0 dias', '1 a 2', '3 a 4', '5 a 6', '7 dias'];

/* ------------------------------------------------------------------------- */
/* Exercícios                                                                 */
/* ------------------------------------------------------------------------- */

export interface ExerciseOption {
  exercise: Exercise;
  recommended: boolean;
  /** Por que o exercício aparece (Documento 06, seção 11.4, item 2). */
  reason: string;
}

/** Exercícios da virtude principal, das relacionadas e das dimensões primárias vêm primeiro. */
export function exerciseOptions(virtueId: string | null, relatedVirtueIds: string[] = []): ExerciseOption[] {
  const recommended = new Map<string, string>();
  const add = (list: Exercise[], reason: string) => list.forEach((e) => !recommended.has(e.id) && recommended.set(e.id, reason));
  if (virtueId) {
    add(exercisesOfVirtue(virtueId), 'Exercício proposto no catálogo para a virtude principal da sua jornada.');
    add(relatedVirtueIds.flatMap(exercisesOfVirtue), 'Exercício de uma virtude relacionada à sua jornada.');
    add(
      virtueDimensions.filter((r) => r.virtueId === virtueId && r.relationType === 'D1').flatMap((r) => exercisesOfDimension(r.dimensionId)),
      'Exercício de uma dimensão com relação primária com a virtude da sua jornada.',
    );
  }
  const first = exercises.filter((e) => recommended.has(e.id));
  const rest = exercises.filter((e) => !recommended.has(e.id));
  return [...first, ...rest].map((exercise) => ({
    exercise,
    recommended: recommended.has(exercise.id),
    reason: recommended.get(exercise.id) ?? 'Exercício do catálogo, disponível para qualquer jornada.',
  }));
}

export function exerciseStatusLabel(journey: Journey, exerciseId: string, recommended: boolean): string {
  const own = journey.exercises.find((e) => e.exerciseId === exerciseId);
  if (own) {
    return { 'em-andamento': 'Em andamento', experimentado: 'Experimentado', repetido: `Repetido (${own.times} vezes)`, arquivado: 'Arquivado' }[own.state];
  }
  return recommended ? 'Recomendado' : 'Disponível';
}

/* ------------------------------------------------------------------------- */
/* Indicadores e ordenação                                                    */
/* ------------------------------------------------------------------------- */

/** Atividades registradas. Nunca representam a qualidade moral da pessoa (Doc. 07, seção 16.1). */
export interface JourneyStats {
  entries: number;
  byType: Record<EntryType, number>;
  /** Datas distintas com pelo menos um registro. */
  daysWithEntries: number;
  exercisesTried: number;
  reviews: number;
  sessions: number;
}

export function journeyStats(journey: Journey, data: { entries: DiaryEntry[]; reviews: Review[]; sessions: CouncilSession[] }): JourneyStats {
  const own = data.entries.filter((e) => e.journeyId === journey.id);
  const byType: Record<EntryType, number> = { PRACTICE: 0, DIFFICULTY: 0, REFLECTION: 0, DISCOVERY: 0 };
  own.forEach((e) => byType[e.type]++);
  return {
    entries: own.length,
    byType,
    daysWithEntries: new Set(own.map((e) => e.date)).size,
    exercisesTried: journey.exercises.filter((e) => e.times > 0).length,
    reviews: data.reviews.filter((r) => r.journeyId === journey.id).length,
    sessions: data.sessions.filter((s) => s.journeyId === journey.id).length,
  };
}

/** Mais recente primeiro; em empate de data, o inserido por último vem antes. */
export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return items
    .map((item, order) => ({ item, order }))
    .sort((x, y) => y.item.date.localeCompare(x.item.date) || y.order - x.order)
    .map(({ item }) => item);
}

/** Leitura neutra de uma revisão legada: autoavaliação que indica tendência, não medida. */
export function compareLegacyReview(firstWeek: string, lastWeek: string): string {
  const a = SCALE.indexOf(firstWeek);
  const b = SCALE.indexOf(lastWeek);
  if (a === -1 || b === -1) return 'Comparação incompleta: falta a faixa da primeira ou da última semana.';
  if (b < a) return `A virtude faltou em menos dias: de “${firstWeek}” na primeira semana para “${lastWeek}” na última.`;
  if (b === a) return `A frequência ficou na mesma faixa (“${lastWeek}”).`;
  return `Na última semana a virtude faltou em mais dias: de “${firstWeek}” para “${lastWeek}”. Isso não é um veredito: semanas diferentes trazem situações diferentes.`;
}

/** Virtudes investigadas ao longo das jornadas, em ordem cronológica e sem repetir vizinhas. */
export function virtueTrail(journeys: Journey[]): string[] {
  const names = [...journeys]
    .filter((j) => j.virtueName && j.status !== 'DRAFT')
    .sort((a, b) => (a.startedOn || a.createdAt).localeCompare(b.startedOn || b.createdAt))
    .map((j) => j.virtueName);
  return names.filter((name, i) => name !== names[i - 1]);
}

export const validPeriod = (start: string, end: string) => isDate(start) && isDate(end) && start <= end;
