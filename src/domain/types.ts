/* ---------------------------------------------------------------------------
 * Modelo de dados da Jornada da Virtude.
 *
 * Catálogo (base de conhecimento, somente leitura): espelha as entidades do
 * Documento 04, seção 10. Cada registro vive em src/data/*.json.
 * Dados do usuário (Documento 06, seção 20): jornadas, diário, revisões e
 * sessões do Conselho. Vivem no navegador e, opcionalmente, no Supabase.
 * ------------------------------------------------------------------------- */

/** Estado de validação de um conteúdo ou relação (Documento 04, seção 14).
 *  `em_revisao` e `rejeitada` vêm do Documento 14, seção 9.2 (acréscimo: os valores antigos continuam válidos). */
export type ValidationStatus = 'proposta' | 'em_revisao' | 'validada' | 'suspensa' | 'rejeitada';

export interface Dimension {
  id: string;
  order: number;
  name: string;
  shortName: string;
  traditionalName: string;
  group: 'personalidade' | 'individualidade';
  field: string;
  guidingQuestion: string;
  contribution: string;
  diagnosticQuestion: string;
  concept: string[];
  characteristics: string[];
  potentials: string[];
  challenges: string[];
  applications: string[];
  questions: string[];
  caution: string;
  source: string;
  status: ValidationStatus;
}

export interface VirtueFamily {
  id: string;
  name: string;
  field: string;
  description: string;
}

export interface Virtue {
  id: string;
  name: string;
  familyId: string;
  definition: string;
  notConfuse: string;
  deficiency: string;
  excess: string;
  /** true quando o documento fala em "excesso aparente". */
  excessApparent: boolean;
  behaviors: string[];
  note?: string;
}

export type ExerciseCategory = 'consciencia' | 'reflexao' | 'acao' | 'relacao' | 'contemplacao';

/** Exercício do catálogo (Documento 06, seção 11). Categoria e duração são propostas da plataforma. */
export interface Exercise {
  id: string;
  title: string;
  category: ExerciseCategory;
  duration: string;
  virtueIds: string[];
  dimensionIds: string[];
  description: string;
  steps: string[];
  source: string;
  status: ValidationStatus;
}

/** D1 = primária, D2 = secundária, D3 = contextual (Documento 04, seção 3.1). */
export type DimensionRelationType = 'D1' | 'D2' | 'D3';

export interface VirtueDimension {
  id: string;
  virtueId: string;
  dimensionId: string;
  relationType: DimensionRelationType;
  justification: string | null;
  source: string;
  status: ValidationStatus;
}

export interface Thinker {
  id: string;
  name: string;
  kind: 'pensador' | 'tradicao';
  /** Integra a tabela do Conselho (Documento 04, seção 6). */
  council: boolean;
  period: string;
  tradition: string;
  field: string;
  concepts: string[];
  question: string;
  /** 'documento' = registrada no Doc. 04; 'aplicacao' = proposta pedagógica da plataforma. */
  questionSource: 'documento' | 'aplicacao' | '';
  limits: string;
  priorityVirtueIds: string[];
  workIds: string[];
  status: ValidationStatus;
}

export interface Work {
  id: string;
  thinkerId: string;
  title: string;
  source: string;
}

/** P1..P4 (Documento 04, seção 3.2). null = classificação pendente de curadoria. */
export type ThinkerRelationType = 'P1' | 'P2' | 'P3' | 'P4';

export interface ThinkerVirtue {
  id: string;
  thinkerId: string;
  virtueId: string;
  relationType: ThinkerRelationType | null;
  /** Posição entre os "pensadores prioritários" do Doc. 04, seção 5 (1 a 3) ou null. */
  priority: number | null;
  sources: string[];
  justification: string;
  workIds: string[];
  status: ValidationStatus;
}

export interface CouncilCase {
  id: string;
  title: string;
  situation: string;
  dimensionIds: string[];
  virtueIds: string[];
  contributions: { thinkerId: string; perspective: string }[];
  centralQuestion: string;
  keywords: string[];
  synthesis?: string;
  exerciseId?: string;
  reviewQuestions?: string[];
  source: string;
  status: ValidationStatus;
}

export interface VirtueDistinction {
  id: string;
  a: string | null;
  aName: string;
  b: string | null;
  bName: string;
  distinction: string;
  source: string;
}

/* ------------------------------------------------------------------------- */
/* Dados do usuário (Documento 06, seção 20)                                  */
/* ------------------------------------------------------------------------- */

/** As sete etapas da jornada (Documento 06, seção 8.2). */
export type StageId = 'despertar' | 'identificar' | 'investigar' | 'refletir' | 'praticar' | 'registrar' | 'revisar';

/** Estados de uma etapa (Documento 06, seção 8.3). Indicam participação, não qualidade moral. */
export type StageState = 'nao-iniciada' | 'em-andamento' | 'concluida' | 'retomada' | 'nao-aplicavel';

export interface StageProgress {
  state: StageState;
  /** Data da última mudança de estado. */
  date: string;
}

/** Ciclo de vida da jornada (Documento 07, secao 9). O arquivamento e um atributo a parte. */
export type JourneyStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
export type JourneyOrigin = 'virtude' | 'situacao' | 'exploracao' | 'legado';

export interface JourneyIntention {
  motivation: string;
  situation: string;
  expectation: string;
}

/** Respostas de múltipla escolha herdadas da versão anterior (bloco "Reconhecer"). */
export interface JourneyIntake {
  admira: string[];
  situacao: string[];
  pedido: string[];
}

/** Estados gravados de um exercício na jornada; "Disponível" e "Recomendado" são derivados. */
export type ExerciseState = 'em-andamento' | 'experimentado' | 'repetido' | 'arquivado';

export interface JourneyExercise {
  exerciseId: string;
  state: ExerciseState;
  startedOn: string;
  /** Quantas vezes a experiência foi registrada. Repetir faz parte da prática. */
  times: number;
}

/** Alteracao relevante da jornada (RF-018): mudancas de estado e de virtude principal. */
export interface JourneyEvent {
  date: string;
  kind: 'criada' | 'iniciada' | 'pausada' | 'retomada' | 'concluida' | 'arquivada' | 'desarquivada' | 'virtude-alterada';
  detail: string;
}

export interface Journey {
  id: string;
  title: string;
  /** Virtude principal (RN-003). Id do catalogo (V01...) ou null para virtude livre ou herdada. */
  virtueId: string | null;
  virtueName: string;
  /** Virtudes relacionadas, sem substituir a principal (RN-004). */
  relatedVirtueIds: string[];
  status: JourneyStatus;
  /** Preenchido quando a jornada esta arquivada; nao altera o estado (RN-011). */
  archivedAt: string;
  origin: JourneyOrigin;
  startedOn: string;
  pausedOn: string;
  completedOn: string;
  history: JourneyEvent[];
  /** Observacoes gerais sobre a jornada (RF-022). */
  notes: string;
  intention: JourneyIntention;
  stages: Record<StageId, StageProgress>;
  /** Respostas da investigação, por id de pergunta. */
  investigation: Record<string, string>;
  intake: JourneyIntake;
  /** Compromisso concreto de prática escolhido pela pessoa. */
  plan: string;
  exercises: JourneyExercise[];
  createdAt: string;
  updatedAt: string;
}

/** Tipos de registro do diario (Documento 08, secao 7.3). */
export type EntryType = 'PRACTICE' | 'DIFFICULTY' | 'REFLECTION' | 'DISCOVERY';

export interface DiaryEntry {
  id: string;
  /** O diário aceita registros fora de qualquer jornada (RN05). */
  journeyId: string | null;
  date: string;
  type: EntryType;
  virtueId: string | null;
  virtue: string;
  situation: string;
  context: string;
  thoughts: string;
  feelings: string[];
  actions: string[];
  consequences: string;
  learning: string;
  note: string;
  /** Etapa em que a jornada estava quando o registro foi criado. */
  stage: string;
  exerciseId: string | null;
  sessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 'legado' = revisão trazida da versão anterior (escala de dias em que a virtude faltou). */
export type ReviewKind = 'periodica' | 'final' | 'legado';

export interface Review {
  id: string;
  journeyId: string;
  kind: ReviewKind;
  date: string;
  periodStart: string;
  periodEnd: string;
  /** Respostas às perguntas de reflexão, por id de pergunta. */
  answers: Record<string, string>;
  synthesis: string;
  /** Revisão final: aprendizados e percepção atual da virtude. */
  learnings: string;
  perception: string;
  /** Revisão legada. */
  firstWeek: string;
  lastWeek: string;
  moments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CouncilContribution {
  thinkerId: string;
  perspective: string;
  question: string;
  reason: string;
  /** Obras de referencia registradas para a perspectiva (rastreabilidade das fontes). */
  workIds: string[];
}

export interface CouncilSession {
  id: string;
  date: string;
  situation: string;
  doubt: string;
  caseId: string | null;
  dimensionIds: string[];
  virtueIds: string[];
  contributions: CouncilContribution[];
  /** "Minha reflexão": o que a pessoa pensa depois de consultar o Conselho. */
  reflection: string;
  action: string;
  /** Uma sessão pode estar ligada a uma jornada ou ser independente (RN06). */
  journeyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  schema: 4;
  journeys: Journey[];
  entries: DiaryEntry[];
  reviews: Review[];
  sessions: CouncilSession[];
}
