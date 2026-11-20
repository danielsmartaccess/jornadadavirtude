import { describe, expect, it } from 'vitest';
import { leituraDoConjunto } from '../../src/domain/identidade';

describe('leituraDoConjunto', () => {
  it('sem perspectivas, todos os anéis ficam ausentes', () => {
    expect(leituraDoConjunto([])).toEqual(Array(7).fill('ausente'));
  });

  it('um anel é comum quando todas as perspectivas o tocam, parcial quando só algumas', () => {
    const a = ['primaria', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma'] as const;
    const b = ['secundaria', 'nenhuma', 'contextual', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma'] as const;
    const leitura = leituraDoConjunto([[...a], [...b]]);
    expect(leitura[0]).toBe('comum');
    expect(leitura[1]).toBe('ausente');
    expect(leitura[2]).toBe('parcial');
    const c = ['nenhuma', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma', 'nenhuma'] as const;
    expect(leituraDoConjunto([[...a], [...c]])[0]).toBe('parcial');
  });
});
