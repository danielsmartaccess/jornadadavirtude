import { describe, expect, it } from 'vitest';
import { ensinamentosDeKrishna, parseNumeroCapitulo, ROTA_ENSINAMENTOS } from '../../src/domain/gita';

describe('Ensinamentos de Krishna (parte final)', () => {
  const { itens } = ensinamentosDeKrishna;

  it('tem sete pontos numerados de 1 a 7, na ordem do quadro', () => {
    expect(itens.map((i) => i.numero)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('transcreve o texto do quadro, sem acréscimos', () => {
    expect(itens.map((i) => i.linhas)).toEqual([
      ['Despertar consciência'],
      ['Medo → coragem', 'Dúvidas → decisão'],
      ['Teoria da reencarnação'],
      ['Imortalidade da alma'],
      ['3 gunas'],
      ['Reta-ação → agir por dever, sem esperar nada em troca'],
      ['Sacrifício da sabedoria – esforço'],
    ]);
  });

  it('os três gunas (R, S e T) ficam só no ponto 5, com o sentido escrito no quadro', () => {
    expect(itens.filter((i) => i.gunas).map((i) => i.numero)).toEqual([5]);
    expect(itens[4].gunas).toEqual([
      { sigla: 'R', nome: 'Rajas', sentido: 'impulsividade' },
      { sigla: 'S', nome: 'Satwa', sentido: 'justo meio' },
      { sigla: 'T', nome: 'Tamas', sentido: 'inércia' },
    ]);
  });

  it('a rota da parte final não colide com a de nenhum capítulo', () => {
    expect(parseNumeroCapitulo(ROTA_ENSINAMENTOS)).toBeNull();
  });
});
