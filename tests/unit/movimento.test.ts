import { describe, expect, it } from 'vitest';
import { atraso, MAX_ESCALONAMENTO } from '../../src/components/movimento';

describe('atraso (escalonamento da entrada)', () => {
  it('usa a posição do item como variável --i', () => {
    expect(atraso(0)).toEqual({ '--i': 0 });
    expect(atraso(3)).toEqual({ '--i': 3 });
  });

  it('limita o escalonamento, para que uma lista longa não faça ninguém esperar', () => {
    expect(atraso(47)).toEqual({ '--i': MAX_ESCALONAMENTO });
    expect(MAX_ESCALONAMENTO).toBeLessThanOrEqual(8);
  });

  it('ignora valores inválidos: negativos viram 0 e fracionários são arredondados para baixo', () => {
    expect(atraso(-2)).toEqual({ '--i': 0 });
    expect(atraso(2.9)).toEqual({ '--i': 2 });
  });
});
