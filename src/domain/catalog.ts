/* Base de conhecimento: registros independentes em src/data/*.json, ligados por id.
 * Este módulo é o único ponto de acesso ao catálogo. Na Etapa 3 ele pode passar a
 * ler de uma API sem que as telas mudem. */
import dimensionsJson from '../data/dimensions.json';
import familiesJson from '../data/virtue-families.json';
import virtuesJson from '../data/virtues.json';
import virtueDimensionsJson from '../data/virtue-dimensions.json';
import thinkersJson from '../data/thinkers.json';
import worksJson from '../data/works.json';
import thinkerVirtuesJson from '../data/thinker-virtues.json';
import casesJson from '../data/council-cases.json';
import distinctionsJson from '../data/virtue-distinctions.json';
import exercisesJson from '../data/exercises.json';
import type {
  CouncilCase,
  Dimension,
  Exercise,
  ExerciseCategory,
  Thinker,
  ThinkerVirtue,
  Virtue,
  VirtueDimension,
  VirtueDistinction,
  VirtueFamily,
  Work,
} from './types';
import { normalize } from '../shared/util';

export const dimensions = dimensionsJson as unknown as Dimension[];
export const families = familiesJson as unknown as VirtueFamily[];
export const virtues = virtuesJson as unknown as Virtue[];
export const virtueDimensions = virtueDimensionsJson as unknown as VirtueDimension[];
export const thinkers = thinkersJson as unknown as Thinker[];
export const works = worksJson as unknown as Work[];
export const thinkerVirtues = thinkerVirtuesJson as unknown as ThinkerVirtue[];
export const councilCases = casesJson as unknown as CouncilCase[];
export const distinctions = distinctionsJson as unknown as VirtueDistinction[];
export const exercises = exercisesJson as unknown as Exercise[];

function index<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

const dimensionIndex = index(dimensions);
const familyIndex = index(families);
const virtueIndex = index(virtues);
const thinkerIndex = index(thinkers);
const workIndex = index(works);
const caseIndex = index(councilCases);
const exerciseIndex = index(exercises);

export const getDimension = (id: string) => dimensionIndex.get(id);
export const getFamily = (id: string) => familyIndex.get(id);
export const getVirtue = (id: string) => virtueIndex.get(id);
export const getThinker = (id: string) => thinkerIndex.get(id);
export const getWork = (id: string) => workIndex.get(id);
export const getCase = (id: string) => caseIndex.get(id);
export const getExercise = (id: string) => exerciseIndex.get(id);

export const EXERCISE_CATEGORIES: { id: ExerciseCategory; label: string }[] = [
  { id: 'consciencia', label: 'Consciência' },
  { id: 'reflexao', label: 'Reflexão' },
  { id: 'acao', label: 'Ação' },
  { id: 'relacao', label: 'Relação' },
  { id: 'contemplacao', label: 'Contemplação' },
];
export const categoryLabel = (id: ExerciseCategory) => EXERCISE_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const exercisesOfVirtue = (virtueId: string) => exercises.filter((e) => e.virtueIds.includes(virtueId));
export const exercisesOfDimension = (dimensionId: string) => exercises.filter((e) => e.dimensionIds.includes(dimensionId));

/** Integrantes do Conselho, na ordem do Documento 04. */
export const councilMembers = thinkers.filter((t) => t.council);

const relationOrder = { D1: 0, D2: 1, D3: 2 } as const;

/** Virtudes relacionadas a uma dimensão: primárias antes das secundárias. */
export function virtuesOfDimension(dimensionId: string) {
  return virtueDimensions
    .filter((r) => r.dimensionId === dimensionId && r.status !== 'suspensa')
    .sort((a, b) => relationOrder[a.relationType] - relationOrder[b.relationType])
    .flatMap((relation) => {
      const virtue = getVirtue(relation.virtueId);
      return virtue ? [{ virtue, relation }] : [];
    });
}

export function dimensionsOfVirtue(virtueId: string) {
  return virtueDimensions
    .filter((r) => r.virtueId === virtueId && r.status !== 'suspensa')
    .flatMap((relation) => {
      const dimension = getDimension(relation.dimensionId);
      return dimension ? [{ dimension, relation }] : [];
    });
}

/** Pensadores e tradições ligados a uma virtude: os prioritários do Doc. 04 primeiro. */
export function thinkersOfVirtue(virtueId: string) {
  return thinkerVirtues
    .filter((r) => r.virtueId === virtueId && r.status !== 'suspensa')
    .sort((a, b) => (a.priority ?? 9) - (b.priority ?? 9))
    .flatMap((relation) => {
      const thinker = getThinker(relation.thinkerId);
      return thinker ? [{ thinker, relation }] : [];
    });
}

export function virtuesOfThinker(thinkerId: string) {
  return thinkerVirtues
    .filter((r) => r.thinkerId === thinkerId && r.status !== 'suspensa')
    .flatMap((relation) => {
      const virtue = getVirtue(relation.virtueId);
      return virtue ? [{ virtue, relation }] : [];
    });
}

export function distinctionsOfVirtue(virtueId: string) {
  return distinctions.filter((d) => d.a === virtueId || d.b === virtueId);
}

export function casesOfThinker(thinkerId: string) {
  return councilCases.filter((c) => c.contributions.some((x) => x.thinkerId === thinkerId));
}

export function worksOfThinker(thinker: Thinker): Work[] {
  return thinker.workIds.flatMap((id) => getWork(id) ?? []);
}

/** Localiza uma virtude do catálogo pelo nome, ignorando acentos e maiúsculas. */
export function findVirtueByName(name: string): Virtue | undefined {
  const key = normalize(name).trim();
  if (!key) return undefined;
  return virtues.find((v) => normalize(v.name) === key);
}

export const SOURCE_LABELS: Record<string, string> = {
  'DOC02-3': 'Documento 02 — Mapa das Sete Dimensões',
  'DOC03-4': 'Documento 03 — Taxonomia das Virtudes, catálogo',
  'DOC03-5': 'Documento 03 — distinções entre virtudes próximas',
  'DOC03-6.1': 'Documento 03 — matriz de relacionamento (seção 6.1)',
  'DOC04-5': 'Documento 04 — matriz geral de integração (seção 5)',
  'DOC04-6': 'Documento 04 — pensadores e especialidades (seção 6)',
  'DOC04-7': 'Documento 04 — matriz de convocação do Conselho (seção 7)',
  'DOC04-12': 'Documento 04 — exemplo completo de funcionamento (seção 12)',
  'DOC04-7 e DOC04-12': 'Documento 04 — convocação do Conselho e exemplo completo (seções 7 e 12)',
};

export const sourceLabel = (source: string) => SOURCE_LABELS[source] ?? source;
