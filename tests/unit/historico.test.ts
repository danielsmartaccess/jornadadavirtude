import { describe, expect, it } from 'vitest';
import { registrosPorDimensao, virtudesNaOrdem, type RelacaoVirtudeDimensao } from '../../src/domain/historico';

const relacoes: RelacaoVirtudeDimensao[] = [
  { virtueId: 'V07', dimensionOrder: 3, tipo: 'D1' },
  { virtueId: 'V07', dimensionOrder: 4, tipo: 'D2' },
  { virtueId: 'V07', dimensionOrder: 6, tipo: 'D3' },
  { virtueId: 'V01', dimensionOrder: 4, tipo: 'D1' },
];

describe('registrosPorDimensao', () => {
  it('devolve sete linhas, uma por dimensão, mesmo sem registros', () => {
    const linhas = registrosPorDimensao([], relacoes);
    expect(linhas.map((l) => l.ordem)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(linhas.every((l) => l.registros === 0)).toBe(true);
  });

  it('conta registros pela relação primária e secundária, não pela contextual', () => {
    const linhas = registrosPorDimensao([{ virtueId: 'V07' }], relacoes);
    expect(linhas.find((l) => l.ordem === 3)?.registros).toBe(1);
    expect(linhas.find((l) => l.ordem === 4)?.registros).toBe(1);
    expect(linhas.find((l) => l.ordem === 6)?.registros).toBe(0);
  });

  it('cada registro conta uma vez por dimensão, mesmo com várias relações para ela', () => {
    const linhas = registrosPorDimensao([{ virtueId: 'V07' }, { virtueId: 'V01' }], relacoes);
    expect(linhas.find((l) => l.ordem === 4)?.registros).toBe(2);
    expect(linhas.find((l) => l.ordem === 3)?.registros).toBe(1);
  });

  it('ignora registros sem virtude', () => {
    const linhas = registrosPorDimensao([{ virtueId: null }], relacoes);
    expect(linhas.every((l) => l.registros === 0)).toBe(true);
  });
});

describe('virtudesNaOrdem', () => {
  it('lista cada virtude uma vez, na ordem da primeira aparição', () => {
    expect(virtudesNaOrdem([{ virtueId: 'V07' }, { virtueId: null }, { virtueId: 'V01' }, { virtueId: 'V07' }])).toEqual(['V07', 'V01']);
  });
});
