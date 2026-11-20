import { describe, expect, it } from 'vitest';
import { families, councilMembers, dimensions, virtues } from '../../src/domain/catalog';
import { anelDaDimensao, corDaFamilia, emblemaDaTradicao, estadosDosAneis, motivoDaFamilia, MOTIVO_FAMILIA, numeroDaFamilia } from '../../src/domain/identidade';

describe('identidade das famílias', () => {
  it('toda família da base tem cor e motivo próprios', () => {
    expect(families).toHaveLength(MOTIVO_FAMILIA.length);
    for (const f of families) {
      expect(motivoDaFamilia(f.id), f.id).not.toBeNull();
      expect(corDaFamilia(f.id), f.id).toMatch(/^var\(--fam-[1-8]\)$/);
    }
  });

  it('cada família usa um motivo diferente, para não depender só de cor', () => {
    const motivos = families.map((f) => motivoDaFamilia(f.id));
    expect(new Set(motivos).size).toBe(families.length);
  });

  it('toda virtude pertence a uma família com identidade', () => {
    for (const v of virtues) expect(motivoDaFamilia(v.familyId), v.id).not.toBeNull();
  });

  it('ids fora do padrão não recebem cor nem motivo', () => {
    expect(numeroDaFamilia('F09')).toBeNull();
    expect(numeroDaFamilia('X01')).toBeNull();
    expect(corDaFamilia('X01')).toBe('var(--fg)');
    expect(motivoDaFamilia('F00')).toBeNull();
  });
});

describe('anéis das dimensões', () => {
  it('cada dimensão da base ocupa o anel de sua ordem, de 1 a 7', () => {
    for (const d of dimensions) expect(anelDaDimensao(d.order), d.id).toBe(d.order);
    expect(anelDaDimensao(0)).toBeNull();
    expect(anelDaDimensao(8)).toBeNull();
    expect(anelDaDimensao(2.5)).toBeNull();
  });
});

describe('emblemas das tradições', () => {
  it('tradições conhecidas recebem o emblema correspondente', () => {
    expect(emblemaDaTradicao('Filosofia grega clássica')).toBe('grega');
    expect(emblemaDaTradicao('Tradição confuciana')).toBe('confuciana');
    expect(emblemaDaTradicao('Taoismo')).toBe('taoista');
    expect(emblemaDaTradicao('Budismo tibetano')).toBe('budista');
    expect(emblemaDaTradicao('Estoicismo')).toBe('estoica');
    expect(emblemaDaTradicao('Tradição marcial japonesa')).toBe('marcial');
  });

  it('tradições sem emblema próprio caem no emblema geral, sem inventar símbolo', () => {
    expect(emblemaDaTradicao('Fenomenologia')).toBe('geral');
    expect(emblemaDaTradicao('')).toBe('geral');
  });

  it('todos os integrantes do Conselho têm um emblema resolvido', () => {
    for (const t of councilMembers) expect(emblemaDaTradicao(t.tradition), t.id).toBeTruthy();
  });
});

describe('assinatura da virtude', () => {
  it('sem relações, os sete anéis ficam sem relação registrada', () => {
    expect(estadosDosAneis([])).toEqual(['nenhuma', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma']);
  });

  it('cada tipo ocupa o anel da sua dimensão', () => {
    const e = estadosDosAneis([
      { dimensionOrder: 1, tipo: 'D1' },
      { dimensionOrder: 3, tipo: 'D2' },
      { dimensionOrder: 7, tipo: 'D3' },
    ]);
    expect(e).toEqual(['primaria', 'nenhuma', 'secundaria', 'nenhuma', 'nenhuma', 'nenhuma', 'contextual']);
  });

  it('em duplicidade, vale a relação mais forte', () => {
    expect(estadosDosAneis([{ dimensionOrder: 2, tipo: 'D3' }, { dimensionOrder: 2, tipo: 'D1' }])[1]).toBe('primaria');
    expect(estadosDosAneis([{ dimensionOrder: 2, tipo: 'D1' }, { dimensionOrder: 2, tipo: 'D2' }])[1]).toBe('primaria');
  });

  it('ordens fora de 1 a 7 são ignoradas', () => {
    expect(estadosDosAneis([{ dimensionOrder: 9, tipo: 'D1' }])).toEqual(Array(7).fill('nenhuma'));
  });
});
