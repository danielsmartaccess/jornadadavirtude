/* Integridade da base de conhecimento.
 * Cobre os critérios de aceitação do Documento 04 (seção 15) e as regras de qualidade
 * do catálogo do Documento 03 (seção 11) que podem ser verificadas automaticamente. */
import { describe, expect, it } from 'vitest';
import {
  councilCases,
  councilMembers,
  dimensions,
  distinctions,
  dimensionsOfVirtue,
  exercises,
  exercisesOfVirtue,
  families,
  findVirtueByName,
  getDimension,
  getExercise,
  getFamily,
  getThinker,
  getVirtue,
  getWork,
  thinkerVirtues,
  thinkers,
  thinkersOfVirtue,
  virtueDimensions,
  virtues,
  virtuesOfDimension,
} from '../../src/domain/catalog';

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('catálogo', () => {
  it('cadastra as sete dimensões, em dois grupos (critério 1)', () => {
    expect(dimensions.map((d) => d.id)).toEqual(['DIM01', 'DIM02', 'DIM03', 'DIM04', 'DIM05', 'DIM06', 'DIM07']);
    expect(dimensions.filter((d) => d.group === 'personalidade')).toHaveLength(4);
    expect(dimensions.filter((d) => d.group === 'individualidade')).toHaveLength(3);
  });

  it('identifica as 48 virtudes por códigos únicos, em oito famílias (critério 2)', () => {
    expect(virtues).toHaveLength(48);
    expect(unique(virtues.map((v) => v.id))).toBe(true);
    expect(unique(virtues.map((v) => v.name))).toBe(true);
    expect(families).toHaveLength(8);
    for (const v of virtues) expect(getFamily(v.familyId), v.name).toBeDefined();
  });

  it('só publica virtudes completas (Doc. 03, seção 11)', () => {
    for (const v of virtues) {
      expect(v.definition.length, v.name).toBeGreaterThan(20);
      expect(v.notConfuse, v.name).not.toBe('');
      expect(v.deficiency && v.excess, v.name).toBeTruthy();
      expect(v.behaviors.length, v.name).toBeGreaterThanOrEqual(4);
      expect(dimensionsOfVirtue(v.id).length, v.name).toBeGreaterThanOrEqual(1);
      expect(exercisesOfVirtue(v.id).length, v.name).toBeGreaterThanOrEqual(1);
      expect(thinkersOfVirtue(v.id).length, v.name).toBeGreaterThanOrEqual(3);
    }
  });

  it('estrutura as relações dimensão–virtude sem ids órfãos (critério 3)', () => {
    expect(unique(virtueDimensions.map((r) => r.id))).toBe(true);
    for (const r of virtueDimensions) {
      expect(getVirtue(r.virtueId), r.id).toBeDefined();
      expect(getDimension(r.dimensionId), r.id).toBeDefined();
      expect(['D1', 'D2', 'D3']).toContain(r.relationType);
    }
    for (const d of dimensions) expect(virtuesOfDimension(d.id).length, d.name).toBeGreaterThan(0);
  });

  it('cadastra os pensadores individualmente, com pergunta e limites (critérios 4 e 6)', () => {
    expect(unique(thinkers.map((t) => t.id))).toBe(true);
    expect(councilMembers.filter((t) => t.kind === 'pensador')).toHaveLength(26);
    for (const t of councilMembers) {
      expect(t.field, t.name).not.toBe('');
      expect(t.question, t.name).toMatch(/\?$/);
      expect(t.limits, t.name).not.toBe('');
      for (const id of t.workIds) expect(getWork(id), `${t.name} ${id}`).toBeDefined();
    }
  });

  it('justifica toda relação pensador–virtude e não inventa classificações (critério 5)', () => {
    expect(unique(thinkerVirtues.map((r) => r.id))).toBe(true);
    for (const r of thinkerVirtues) {
      expect(getThinker(r.thinkerId), r.id).toBeDefined();
      expect(getVirtue(r.virtueId), r.id).toBeDefined();
      expect(r.justification, r.id).not.toBe('');
      expect(r.sources.length, r.id).toBeGreaterThan(0);
    }
    /* P1..P4 só onde o Documento 04 declara; o restante aguarda curadoria. */
    const typed = thinkerVirtues.filter((r) => r.relationType !== null).map((r) => `${r.thinkerId}:${r.relationType}`);
    expect(new Set(typed)).toEqual(new Set(['aristoteles:P1', 'daniel-kahneman:P3']));
  });

  it('registra os seis casos de convocação do Conselho com referências válidas (critério 7)', () => {
    expect(councilCases).toHaveLength(6);
    for (const c of councilCases) {
      expect(c.centralQuestion, c.id).toMatch(/\?$/);
      expect(c.keywords.length, c.id).toBeGreaterThan(3);
      for (const id of c.virtueIds) expect(getVirtue(id), `${c.id} ${id}`).toBeDefined();
      for (const id of c.dimensionIds) expect(getDimension(id), `${c.id} ${id}`).toBeDefined();
      expect(c.contributions.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.contributions.length, c.id).toBeLessThanOrEqual(5);
      for (const x of c.contributions) expect(getThinker(x.thinkerId)?.council, `${c.id} ${x.thinkerId}`).toBe(true);
      if (c.exerciseId) expect(getExercise(c.exerciseId), c.id).toBeDefined();
    }
  });

  it('mantém o catálogo de exercícios com categoria e vínculos válidos (Doc. 06, seção 11)', () => {
    expect(unique(exercises.map((e) => e.id))).toBe(true);
    for (const e of exercises) {
      expect(['consciencia', 'reflexao', 'acao', 'relacao', 'contemplacao'], e.id).toContain(e.category);
      expect(e.duration, e.id).not.toBe('');
      expect(e.virtueIds.length + e.dimensionIds.length, e.id).toBeGreaterThan(0);
      for (const id of e.virtueIds) expect(getVirtue(id), e.id).toBeDefined();
      for (const id of e.dimensionIds) expect(getDimension(id), e.id).toBeDefined();
    }
  });

  it('registra as distinções entre virtudes próximas', () => {
    expect(distinctions).toHaveLength(18);
    for (const d of distinctions) {
      if (d.a) expect(getVirtue(d.a)?.name).toBe(d.aName);
      if (d.b) expect(getVirtue(d.b)?.name).toBe(d.bName);
    }
  });

  it('encontra virtudes pelo nome sem depender de acentos ou maiúsculas', () => {
    expect(findVirtueByName('paciencia')?.id).toBe('V07');
    expect(findVirtueByName(' AMOR À VERDADE ')?.id).toBe('V36');
    expect(findVirtueByName('Paciência II')).toBeUndefined();
  });
});
