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
import {
  apoiosDe,
  evidencias,
  papelDoRegistro,
  paresNaoIndependentes,
  qualidadeDaFonte,
  relacaoUtilizavel,
  universoPrincipal,
  type ApoioContextual,
  type EvidenciaRelacao,
  type PapelSelecao,
} from './curadoria';
import type { CouncilCase, CouncilContribution, Thinker, ThinkerVirtue } from './types';
import { normalize, unique, words } from '../shared/util';

/* ------------------------------------------------------------------------- */
/* Políticas de seleção versionadas (DEC-CUR-05)                              */
/* ------------------------------------------------------------------------- */

/** Critérios da seleção. Cada um vale de 0 a 1; a pontuação é a soma ponderada (pesos somam 1). */
export type CriterioSelecao = 'pertinencia' | 'relacaoVirtudes' | 'fontes' | 'complementaridade' | 'diversidade' | 'contexto';

export interface PoliticaSelecao {
  id: 'council-selection-v1-doc04' | 'council-selection-v2-doc13';
  /** Rótulo legível, gravado na justificativa de cada perspectiva (Documento 13, seção 20). */
  rotulo: string;
  pesos: Record<CriterioSelecao, number>;
  /** v1: tradição/corpus disputa vaga como voz. v2: nunca (DEC-CUR-02). */
  corpusOcupaVaga: boolean;
  /** v2: exige fonte recuperável (Documento 13, seção 7.2). */
  exigeFonte: boolean;
  /** v1: só obras do catálogo. v2: obras do catálogo ou referências-base (DEC-CUR-04). */
  fonte: 'catalogo' | 'catalogo-e-referencias-base';
  /** v2: limites de concentração por universo (DEC-CUR-07). */
  limiteDeUniverso: boolean;
  /** v1: desempate pelo nome. v2: ordem do Documento 13, seção 7.3. */
  desempate: 'nome' | 'doc13';
}

/** Versão histórica/legada: pesos do Documento 04, seção 11 (35/30/15/10/10), algoritmo do commit 093ef96. */
export const POLITICA_V1: PoliticaSelecao = {
  id: 'council-selection-v1-doc04',
  rotulo: 'versão 1 (Documento 04)',
  pesos: { relacaoVirtudes: 0.35, pertinencia: 0.3, contexto: 0.15, fontes: 0.1, complementaridade: 0.1, diversidade: 0 },
  corpusOcupaVaga: true,
  exigeFonte: false,
  fonte: 'catalogo',
  limiteDeUniverso: false,
  desempate: 'nome',
};

/** Política operacional: pesos do Documento 13 v2.0, seção 7.1 (30/25/15/15/10/5). */
export const POLITICA_V2: PoliticaSelecao = {
  id: 'council-selection-v2-doc13',
  rotulo: 'versão 2 (Documento 13)',
  pesos: { pertinencia: 0.3, relacaoVirtudes: 0.25, fontes: 0.15, complementaridade: 0.15, diversidade: 0.1, contexto: 0.05 },
  corpusOcupaVaga: false,
  exigeFonte: true,
  fonte: 'catalogo-e-referencias-base',
  limiteDeUniverso: true,
  desempate: 'doc13',
};

/** Política usada pelo app. */
export const POLITICA_ATUAL: PoliticaSelecao = POLITICA_V2;

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
  /** Critérios estáticos (não dependem de quem já foi escolhido). */
  criterios: Pick<Record<CriterioSelecao, number>, 'pertinencia' | 'relacaoVirtudes' | 'fontes' | 'contexto'>;
  base: number;
  /** Pertinência mínima para que a diversidade conte (DEC-CUR-07): integra caso reconhecido ou tem relação
   *  prioritária (Documento 04) com virtude pedida. Uma relação só de "referência do catálogo" não basta. */
  pertinente: boolean;
  universo?: string;
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
  /** Papel na seleção. Padrão: derivado da classificação curatorial (corpus de apoio não é voz). */
  papel?: (t: Thinker) => PapelSelecao;
  /** Universo principal (DEC-CUR-06/07). Padrão: classificação curatorial v1. */
  universo?: (thinkerId: string) => string | undefined;
  /** Disponibilidade de fonte de 0 a 1 na política v2. Padrão: catálogo + referências-base. */
  qualidadeFonte?: (t: Thinker) => number;
  /** Corpora que contextualizam uma pessoa (DEC-CUR-02/03). */
  apoios?: (thinkerId: string) => ApoioContextual[];
}

export const CONTEXTO_PADRAO: ContextoSelecao = {
  membros: councilMembers,
  relacoes: thinkerVirtues,
  casos: councilCases,
  evidencias,
  pares: paresNaoIndependentes(),
  papel: papelDoRegistro,
  universo: universoPrincipal,
  qualidadeFonte: (t) => qualidadeDaFonte(t),
  apoios: apoiosDe,
};

/** Pontuação de uma perspectiva escolhida, para auditoria. Nunca é exibida à pessoa usuária. */
export interface DetalheSelecao {
  thinkerId: string;
  posicao: number;
  total: number;
  criterios: Record<CriterioSelecao, number>;
  universo?: string;
}

export interface ResultadoSelecao {
  politica: PoliticaSelecao['id'];
  selecionados: CouncilSelection[];
  detalhes: DetalheSelecao[];
  /** Verdadeiro quando o limite de universo (DEC-CUR-07) não pôde ser cumprido por falta de alternativa. */
  diversityConstraintRelaxed: boolean;
  relaxamentos: string[];
  /** Integrantes habilitados que ficaram fora por regra, com o motivo. */
  excluidos: { thinkerId: string; motivo: 'corpus-de-apoio' | 'sem-fonte' }[];
}

/** Limite por universo principal (DEC-CUR-07): com 5 vozes, no máximo 2; com 2 a 4, ao menos 2 universos. */
export const limitePorUniverso = (max: number) => (max >= 5 ? 2 : Math.max(1, max - 1));

export function selectThinkers(input: SelectionInput, max: number = MAX_THINKERS): CouncilSelection[] {
  return deliberarSelecao(CONTEXTO_PADRAO, input, max, POLITICA_ATUAL).selecionados;
}

export function selecionarPerspectivas(
  ctx: ContextoSelecao,
  input: SelectionInput,
  max: number = MAX_THINKERS,
  politica: PoliticaSelecao = POLITICA_ATUAL,
): CouncilSelection[] {
  return deliberarSelecao(ctx, input, max, politica).selecionados;
}

/** Seleção completa, com pontuações e restrições aplicadas, para testes e auditoria. */
export function deliberarSelecao(
  ctx: ContextoSelecao,
  input: SelectionInput,
  max: number = MAX_THINKERS,
  politica: PoliticaSelecao = POLITICA_ATUAL,
): ResultadoSelecao {
  const P = politica.pesos;
  const porPensador = ctx === CONTEXTO_PADRAO ? relationsByThinker : indexarRelacoes(ctx.relacoes, ctx.evidencias);
  const cases = input.caseIds.flatMap((id) => ctx.casos.find((c) => c.id === id) ?? []);
  const papel = ctx.papel ?? ((t: Thinker) => (t.kind === 'tradicao' ? 'contextual_corpus' : 'individual_voice'));
  const candidates: Candidate[] = [];
  const excluidos: ResultadoSelecao['excluidos'] = [];

  for (const thinker of ctx.membros) {
    const relations = porPensador.get(thinker.id) ?? [];
    const related = relations.filter((r) => input.virtueIds.includes(r.virtueId));
    /* Só as relações com as virtudes pedidas contam, com teto: o total de relações cadastradas não pontua. */
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

    /* DEC-CUR-02: corpus/tradição não ocupa vaga de voz individual. */
    if (!politica.corpusOcupaVaga && papel(thinker) === 'contextual_corpus') {
      excluidos.push({ thinkerId: thinker.id, motivo: 'corpus-de-apoio' });
      continue;
    }

    const fontes =
      politica.fonte === 'catalogo' ? (thinker.workIds.length ? 1 : 0) : (ctx.qualidadeFonte ?? ((t: Thinker) => (t.workIds.length ? 1 : 0)))(thinker);
    /* Documento 13, seção 7.2: exigir fonte recuperável. */
    if (politica.exigeFonte && fontes === 0) {
      excluidos.push({ thinkerId: thinker.id, motivo: 'sem-fonte' });
      continue;
    }

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
      criterios: { relacaoVirtudes: documented, pertinencia: situation, contexto: dimensionScore, fontes },
      /* Mesma ordem de soma do algoritmo original, para reproduzir a v1 sem diferença de arredondamento. */
      base: P.relacaoVirtudes * documented + P.pertinencia * situation + P.contexto * dimensionScore + P.fontes * fontes,
      pertinente: situation > 0 || related.some((r) => r.priority !== null),
      universo: ctx.universo?.(thinker.id),
      reasons,
      perspective: perspective || thinker.field,
    });
  }

  /* Seleção gulosa: a cada vaga, recalcula complementaridade (tradição nova) e diversidade (universo novo). */
  const chosen: { c: Candidate; criterios: Record<CriterioSelecao, number>; total: number }[] = [];
  const pool = [...candidates];
  const limite = limitePorUniverso(max);
  const relaxamentos: string[] = [];
  while (chosen.length < max && pool.length) {
    const traditions = new Set(chosen.map((x) => x.c.thinker.tradition));
    const universosUsados = new Map<string, number>();
    chosen.forEach((x) => x.c.universo && universosUsados.set(x.c.universo, (universosUsados.get(x.c.universo) ?? 0) + 1));
    const dinamicos = (c: Candidate) => ({
      complementaridade: traditions.has(c.thinker.tradition) ? 0 : 1,
      /* Diversidade não compensa baixa pertinência: só conta para quem já é pertinente. */
      diversidade: c.pertinente && c.universo && !universosUsados.has(c.universo) ? 1 : 0,
    });
    const total = (c: Candidate) => {
      const d = dinamicos(c);
      return c.base + P.complementaridade * d.complementaridade + P.diversidade * d.diversidade;
    };
    pool.sort((a, b) => {
      const diff = total(b) - total(a);
      if (diff) return diff;
      if (politica.desempate === 'nome') return a.thinker.name.localeCompare(b.thinker.name);
      /* Documento 13, seção 7.3: pertinência, qualidade de fonte, complementaridade, thinker_id. */
      return (
        b.criterios.pertinencia - a.criterios.pertinencia ||
        b.criterios.fontes - a.criterios.fontes ||
        dinamicos(b).complementaridade - dinamicos(a).complementaridade ||
        (a.thinker.id < b.thinker.id ? -1 : a.thinker.id > b.thinker.id ? 1 : 0)
      );
    });

    let indice = 0;
    if (politica.limiteDeUniverso) {
      const viola = (c: Candidate) => Boolean(c.universo && (universosUsados.get(c.universo) ?? 0) >= limite);
      if (viola(pool[0])) {
        /* A alternativa de outro universo precisa ser pertinente; senão, a exceção é registrada. */
        const permitido = pool.findIndex((c) => !viola(c) && c.pertinente);
        if (permitido === -1) {
          relaxamentos.push(
            `Vaga ${chosen.length + 1}: sem alternativa pertinente de outro universo; ${pool[0].thinker.name} entra acima do limite de ${limite} por universo (${pool[0].universo}).`,
          );
        } else indice = permitido;
      }
    }
    const [escolhido] = pool.splice(indice, 1);
    chosen.push({ c: escolhido, criterios: { ...escolhido.criterios, ...dinamicos(escolhido) }, total: total(escolhido) });
    /* Documento 14, seções 8 e 10: tradição e autor nomeado não entram como vozes independentes. */
    const excluir = ctx.pares.get(escolhido.thinker.id);
    if (excluir) for (let i = pool.length - 1; i >= 0; i--) if (excluir.has(pool[i].thinker.id)) pool.splice(i, 1);
  }

  const selecionados = chosen.map(({ c: { thinker, reasons, perspective } }) => {
    const partes = [...reasons];
    if (politica.id !== POLITICA_V1.id) {
      for (const apoio of ctx.apoios?.(thinker.id) ?? []) {
        const nome = ctx.membros.find((m) => m.id === apoio.corpus)?.name ?? apoio.corpus;
        partes.push(`Contexto de apoio: ${nome}, recorte ${apoio.recorte} (corpus de apoio, não convocado como pessoa).`);
      }
      partes.push(`Critérios de seleção: ${politica.rotulo}.`);
    }
    return {
      thinker,
      contribution: { thinkerId: thinker.id, perspective, question: thinker.question, reason: partes.join(' '), workIds: thinker.workIds },
    };
  });

  return {
    politica: politica.id,
    selecionados,
    detalhes: chosen.map((x, posicao) => ({ thinkerId: x.c.thinker.id, posicao, total: x.total, criterios: x.criterios, universo: x.c.universo })),
    diversityConstraintRelaxed: relaxamentos.length > 0,
    relaxamentos,
    excluidos,
  };
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
