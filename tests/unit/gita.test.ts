/* Módulo de leitura da Bhagavad Gita: estrutura fixa e sincronia com o seed do banco. */
import { describe, expect, it } from 'vitest';
import { capitulos, capituloAnterior, capituloSeguinte, etapas, getCapitulo, parseNumeroCapitulo, splitTitulo } from '../../src/domain/gita';
import seed from '../../supabase/seed.sql?raw';

/** Trecho do seed que insere em capitulos (as linhas de etapas têm o mesmo formato). */
const blocoCapitulos = seed.slice(seed.indexOf('insert into public.capitulos'), seed.indexOf('on conflict (numero)'));
/** Torna a string literal SQL ('') comparável com o texto original. */
const sqlLiteral = (s: string) => `'${s.replace(/'/g, "''")}'`;

describe('estrutura da leitura', () => {
  it('tem 18 capítulos numerados de 1 a 18, sem repetição', () => {
    expect(capitulos.map((c) => c.numero)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
    expect(new Set(capitulos.map((c) => c.titulo)).size).toBe(18);
    for (const c of capitulos) expect(c.titulo.trim()).not.toBe('');
  });

  it('tem seis etapas em ordem de 1 a 6, com nomes distintos', () => {
    expect(etapas.map((e) => e.ordem)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(etapas.map((e) => e.nome)).size).toBe(6);
  });
});

describe('rotas e navegação', () => {
  it('aceita só números inteiros de 1 a 18', () => {
    expect(parseNumeroCapitulo('1')).toBe(1);
    expect(parseNumeroCapitulo('18')).toBe(18);
    for (const ruim of [undefined, '', '0', '19', '-1', '1.5', '01x', 'abc', '001']) expect(parseNumeroCapitulo(ruim)).toBeNull();
  });

  it('anterior e seguinte respeitam as pontas', () => {
    expect(capituloAnterior(1)).toBeUndefined();
    expect(capituloSeguinte(18)).toBeUndefined();
    expect(capituloAnterior(2)?.numero).toBe(1);
    expect(capituloSeguinte(17)?.numero).toBe(18);
    expect(getCapitulo(99)).toBeUndefined();
  });

  it('separa o nome em sânscrito da tradução', () => {
    expect(splitTitulo('Karma Yoga — O yoga da ação')).toEqual({ sanscrito: 'Karma Yoga', traducao: 'O yoga da ação' });
    expect(splitTitulo('Sem separador')).toEqual({ sanscrito: '', traducao: 'Sem separador' });
  });
});

describe('sincronia com supabase/seed.sql', () => {
  it('os capítulos do seed são exatamente os do app (número e título)', () => {
    // Linhas do insert em capitulos: (N,  'Título')
    const doSeed = [...blocoCapitulos.matchAll(/^\s*\((\d+),\s+'((?:[^']|'')*)'\)[,\s]*$/gm)].map((m) => ({ numero: Number(m[1]), titulo: m[2].replace(/''/g, "'") }));
    expect(doSeed).toEqual(capitulos);
  });

  it('toda etapa do app está no seed com a mesma ordem e nome', () => {
    for (const e of etapas) expect(seed, `etapa ${e.ordem}`).toContain(`(${e.ordem}, ${sqlLiteral(e.nome)})`);
  });
});
