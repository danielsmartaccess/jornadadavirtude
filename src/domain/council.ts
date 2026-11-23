/* Conselho de Sabedoria: seleção contextual, sem inteligência artificial.
 *
 * Segue o protocolo do Documento 04 (seções 7, 8 e 11): a situação relatada sugere
 * dimensões e virtudes (hipóteses, nunca diagnóstico) e os pensadores são ordenados
 * por uma pontuação interna de relevância, que NÃO é exibida ao usuário.
 * Só entra no Conselho quem tem relação registrada na base de conhecimento:
 * nenhuma associação é inventada para preencher lacunas. */
import {
  councilCases,
  councilMembers,
  dimensions,
  getCase,
  getVirtue,
  thinkerVirtues,
  virtueDimensions,
  virtues,
} from './catalog';
import { evidencias, paresNaoIndependentes, relacaoUtilizavel, type EvidenciaRelacao } from './curadoria';
import type { CouncilCase, CouncilContribution, Thinker, ThinkerVirtue } from './types';
import { normalize, unique, words } from '../shared/util';

/** Pesos iniciais do Documento 04, seção 11. */
export const WEIGHTS = { documented: 0.35, situation: 0.3, dimensions: 0.15, complementarity: 0.1, sources: 0.1 };

export const MIN_THINKERS = 2;
export const MAX_THINKERS = 5;

/* Termos genéricos demais para indicar uma virtude ou dimensão. */
const STOP = new Set(
  ['falta', 'exces', 'dific', 'incap', 'propr', 'pesso', 'outro', 'outra', 'diant', 'sobre', 'quand', 'muito', 'minha', 'tenho',
   'estou', 'sinto', 'sempr', 'nunca', 'coisa', 'situa', 'manei', 'forma', 'senti', 'neces', 'indev', 'indis', 'perma', 'injus',
   'desej', 'ativi', 'recur', 'respo', 'reaco', 'reaca', 'pesso', 'inter', 'compo', 'deman', 'estra', 'aquil', 'tambe', 'porqu',
   'ainda', 'depoi', 'antes', 'entre', 'mesmo', 'fazer', 'poder', 'conse', 'consi', 'trabal', 'trabe', 'gente', 'acont'],
);

const stem = (word: string) => word.slice(0, 5);

function stems(text: string): Set<string> {
  return new Set(
    words(text)
      .filter((w) => w.length >= 5)
      .map(stem)
      .filter((s) => !STOP.has(s)),
  );
}

const virtueTerms = virtues.map((v) => ({
  id: v.id,
  name: stems(v.name),
  related: stems(`${v.deficiency} ${v.excess}`),
}));

const dimensionTerms = dimensions.map((d) => ({ id: d.id, terms: stems(d.challenges.join(' ')) }));

/* Sinais de risco: o Conselho não substitui apoio profissional (Doc. 04, Regra 8).
 * A lista e a regra ficam em crisis.ts; continuam exportadas daqui para os usos existentes. */
import { detectCrisis } from './crisis';
export { detectCrisis, isCrisisInput } from './crisis';

function caseHits(council: CouncilCase, textWords: string[], normalized: string): number {
  return council.keywords.filter((keyword) =>
    keyword.includes(' ') ? normalized.includes(keyword) : textWords.some((w) => w.startsWith(keyword)),
  ).length;
}

export interface Suggestion {
  /** Casos de referência reconhecidos, do mais para o menos aderente. */
  caseIds: string[];
  dimensionIds: string[];
  virtueIds: string[];
  crisis: boolean;
}

function top(scores: Map<string, number>, max: number, min: number): string[] {
  return [...scores.entries()]
    .filter(([, score]) => score >= min)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([id]) => id);
}

/** Etapas 2 e 3 do protocolo: dimensões e virtudes possivelmente envolvidas. */
export function suggest(text: string): Suggestion {
  const normalized = normalize(text);
  const textWords = words(text);
  const textStems = stems(text);

  const matched = councilCases
    .map((council) => ({ council, hits: caseHits(council, textWords, normalized) }))
    .filter((m) => m.hits > 0)
    .sort((a, b) => b.hits - a.hits);

  const virtueScores = new Map<string, number>();
  const dimensionScores = new Map<string, number>();
  const bump = (map: Map<string, number>, id: string, value: number) => map.set(id, (map.get(id) ?? 0) + value);

  matched.forEach(({ council, hits }, position) => {
    const weight = (position === 0 ? 4 : 2) + Math.min(hits, 3);
    council.virtueIds.forEach((id) => bump(virtueScores, id, weight));
    council.dimensionIds.forEach((id) => bump(dimensionScores, id, weight));
  });

  for (const v of virtueTerms) {
    let score = 0;
    v.name.forEach((s) => textStems.has(s) && (score += 3));
    v.related.forEach((s) => textStems.has(s) && (score += 2));
    if (score) bump(virtueScores, v.id, score);
  }
  for (const d of dimensionTerms) {
    let score = 0;
    d.terms.forEach((s) => textStems.has(s) && (score += 2));
    if (score) bump(dimensionScores, d.id, score);
  }

  const virtueIds = top(virtueScores, 5, 2);
  for (const relation of virtueDimensions) {
    if (relation.relationType === 'D1' && virtueIds.includes(relation.virtueId)) bump(dimensionScores, relation.dimensionId, 1);
  }

  return {
    caseIds: matched.map((m) => m.council.id),
    dimensionIds: top(dimensionScores, 4, 2).sort(),
    virtueIds,
    crisis: detectCrisis(text),
  };
}

/* ------------------------------------------------------------------------- */
/* Etapa 4: seleção dos pensadores                                            */
/* ------------------------------------------------------------------------- */

/** Relações que podem fundamentar uma perspectiva, por pensador: ficam de fora as suspensas, as
 *  rejeitadas e as classificadas como F4 numa evidência (Documento 14, seção 9). */
function indexarRelacoes(relacoes: ThinkerVirtue[], lista: EvidenciaRelacao[]): Map<string, ThinkerVirtue[]> {
  const index = new Map<string, ThinkerVirtue[]>();
  for (const relation of relacoes) {
    if (!relacaoUtilizavel(relation, lista)) continue;
    const current = index.get(relation.thinkerId) ?? [];
    current.push(relation);
    index.set(relation.thinkerId, current);
  }
  return index;
}

const relationsByThinker = indexarRelacoes(thinkerVirtues, evidencias);

const primaryDimensions = new Map<string, string[]>();
for (const relation of virtueDimensions) {
  if (relation.relationType !== 'D1') continue;
  primaryDimensions.set(relation.virtueId, [...(primaryDimensions.get(relation.virtueId) ?? []), relation.dimensionId]);
}

/** Força da relação documentada: pensador prioritário (1º, 2º, 3º) ou apenas referência. */
function strength(relation: ThinkerVirtue): number {
  if (relation.priority === 1) return 1;
  if (relation.priority === 2) return 0.85;
  if (relation.priority === 3) return 0.7;
  return 0.55;
}

export interface CouncilSelection {
  thinker: Thinker;
  contribution: CouncilContribution;
}

export interface SelectionInput {
  virtueIds: string[];
  dimensionIds: string[];
  caseIds: string[];
}

interface Candidate {
  thinker: Thinker;
  base: number;
  reasons: string[];
  perspective: string;
}

/** Dados usados pela seleção. O padrão é o catálogo do app; testes podem injetar outro. */
export interface ContextoSelecao {
  /** Só quem está aqui pode ser convocado: os integrantes habilitados (`council: true`). */
  membros: Thinker[];
  relacoes: ThinkerVirtue[];
  casos: CouncilCase[];
  evidencias: EvidenciaRelacao[];
  /** Registros que não entram juntos como vozes independentes (tradição × autor nomeado). */
  pares: Map<string, Set<string>>;
}

export const CONTEXTO_PADRAO: ContextoSelecao = {
  membros: councilMembers,
  relacoes: thinkerVirtues,
  casos: councilCases,
  evidencias,
  pares: paresNaoIndependentes(),
};

export function selectThinkers(input: SelectionInput, max: number = MAX_THINKERS): CouncilSelection[] {
  return selecionarPerspectivas(CONTEXTO_PADRAO, input, max);
}

export function selecionarPerspectivas(ctx: ContextoSelecao, input: SelectionInput, max: number = MAX_THINKERS): CouncilSelection[] {
  const porPensador = ctx === CONTEXTO_PADRAO ? relationsByThinker : indexarRelacoes(ctx.relacoes, ctx.evidencias);
  const cases = input.caseIds.flatMap((id) => ctx.casos.find((c) => c.id === id) ?? []);
  const candidates: Candidate[] = [];

  for (const thinker of ctx.membros) {
    const relations = porPensador.get(thinker.id) ?? [];
    const related = relations.filter((r) => input.virtueIds.includes(r.virtueId));
    const documented = Math.min(1, related.reduce((sum, r) => sum + strength(r), 0) / 2);

    let situation = 0;
    let perspective = '';
    const reasons: string[] = [];
    cases.forEach((council, position) => {
      const found = council.contributions.find((c) => c.thinkerId === thinker.id);
      if (!found) return;
      situation = Math.max(situation, position === 0 ? 1 : 0.6);
      if (!perspective) perspective = found.perspective;
      reasons.push(`Integra o caso de referência “${council.title}”.`);
    });

    /* Regra 1 (Fundamentação): sem relação registrada, o pensador não é convocado. */
    if (documented === 0 && situation === 0) continue;

    if (related.length) {
      const names = unique(related.map((r) => getVirtue(r.virtueId)?.name ?? '')).filter(Boolean);
      const priority = related.some((r) => r.priority !== null);
      reasons.push(
        `Relação registrada com ${names.join(', ')}${priority ? ' (pensador prioritário no Documento 04)' : ' (referência do catálogo)'}.`,
      );
    }

    const covered = new Set(relations.flatMap((r) => primaryDimensions.get(r.virtueId) ?? []));
    const dimensionScore = input.dimensionIds.length
      ? input.dimensionIds.filter((id) => covered.has(id)).length / input.dimensionIds.length
      : 0;

    candidates.push({
      thinker,
      base:
        WEIGHTS.documented * documented +
        WEIGHTS.situation * situation +
        WEIGHTS.dimensions * dimensionScore +
        WEIGHTS.sources * (thinker.workIds.length ? 1 : 0),
      reasons,
      perspective: perspective || thinker.field,
    });
  }

  /* Seleção gulosa: a complementaridade favorece tradições ainda não representadas. */
  const chosen: Candidate[] = [];
  const pool = [...candidates];
  while (chosen.length < max && pool.length) {
    const traditions = new Set(chosen.map((c) => c.thinker.tradition));
    const score = (c: Candidate) => c.base + (traditions.has(c.thinker.tradition) ? 0 : WEIGHTS.complementarity);
    pool.sort((a, b) => score(b) - score(a) || a.thinker.name.localeCompare(b.thinker.name));
    const escolhido = pool.shift()!;
    chosen.push(escolhido);
    /* Documento 14, seções 8 e 10: tradição e autor nomeado não entram como vozes independentes. */
    const excluir = ctx.pares.get(escolhido.thinker.id);
    if (excluir) for (let i = pool.length - 1; i >= 0; i--) if (excluir.has(pool[i].thinker.id)) pool.splice(i, 1);
  }

  return chosen.map(({ thinker, reasons, perspective }) => ({
    thinker,
    contribution: { thinkerId: thinker.id, perspective, question: thinker.question, reason: reasons.join(' '), workIds: thinker.workIds },
  }));
}

/* ------------------------------------------------------------------------- */
/* Convergências, divergências e síntese (Documento 06, seção 10.4)           */
/* ------------------------------------------------------------------------- */

export interface CouncilSynthesis {
  convergences: string[];
  divergences: string[];
  /** Síntese registrada na base para o caso de referência, quando existir. */
  documented: string;
  questions: string[];
  /** Preenchido quando não há fundamentação suficiente (RF-101). */
  limitation: string;
}

/** Organiza o que a base de conhecimento permite afirmar, sem inteligência artificial e
 *  sem atribuir falas: agrupa por virtude e por tradição e expõe os limites de cada perspectiva. */
export function synthesize(selection: CouncilSelection[], input: SelectionInput): CouncilSynthesis {
  const limitation =
    selection.length < MIN_THINKERS
      ? 'A base de conhecimento ainda não tem fundamentação suficiente para reunir um Conselho sobre esta questão. Tente indicar uma virtude relacionada ou descrever a situação com outras palavras.'
      : '';

  const convergences: string[] = [];
  for (const virtueId of input.virtueIds) {
    const names = selection
      .filter((s) => (relationsByThinker.get(s.thinker.id) ?? []).some((r) => r.virtueId === virtueId))
      .map((s) => s.thinker.name);
    const virtue = getVirtue(virtueId);
    if (virtue && names.length >= 2) convergences.push(`${names.join(', ')} têm relação registrada com ${virtue.name}: partem de pontos diferentes para tratar da mesma qualidade.`);
  }
  const byTradition = new Map<string, string[]>();
  selection.forEach((s) => byTradition.set(s.thinker.tradition, [...(byTradition.get(s.thinker.tradition) ?? []), s.thinker.name]));
  byTradition.forEach((names, tradition) => {
    if (names.length >= 2) convergences.push(`${names.join(' e ')} pertencem à mesma tradição (${tradition}).`);
  });

  const divergences: string[] = [];
  if (byTradition.size >= 2) {
    divergences.push(`As perspectivas vêm de tradições distintas (${[...byTradition.keys()].join('; ')}): os conceitos não são equivalentes e não devem ser lidos como uma só doutrina.`);
  }
  selection.forEach((s) => s.thinker.limits && divergences.push(`${s.thinker.name}: ${s.thinker.limits}`));

  return {
    convergences,
    divergences,
    documented: getCase(input.caseIds[0] ?? '')?.synthesis ?? '',
    questions: unique([centralQuestion(input.caseIds), ...selection.map((s) => s.contribution.question)].filter(Boolean)),
    limitation,
  };
}

/** Pergunta central do caso de referência mais aderente, se houver. */
export function centralQuestion(caseIds: string[]): string {
  return getCase(caseIds[0] ?? '')?.centralQuestion ?? '';
}
