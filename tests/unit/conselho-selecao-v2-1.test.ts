/* Referência da política v2.1 (DEC-CUR-10: pertinência temática e contextual antes da diversidade; fonte
 * identificada separada de completude bibliográfica). Mesmas 79 entradas dos snapshots da v1 e da v2, que
 * continuam gravados sem alteração. */
import { describe, expect, it } from 'vitest';
import { CONTEXTO_PADRAO, deliberarSelecao, POLITICA_V2_1, synthesize } from '../../src/domain/council';
import { entradasAB } from './support/comparacao-politicas';

const arred = (x: number) => Math.round(x * 1e6) / 1e6;

describe('Conselho: seleção pela política v2.1 (Documento 13, revisão DEC-CUR-10)', () => {
  it('as 79 entradas de referência', () => {
    const resultado = entradasAB().map((e) => {
      const r = deliberarSelecao(CONTEXTO_PADRAO, e.input, e.max, POLITICA_V2_1);
      return {
        entrada: `${e.grupo}: ${e.rotulo}`,
        politica: r.politica,
        selecionados: r.detalhes.map((d) => ({
          id: d.thinkerId,
          total: arred(d.total),
          universo: d.universo ?? null,
          criterios: Object.fromEntries(Object.entries(d.criterios).map(([k, v]) => [k, arred(v)])),
          avaliacao: r.avaliacoes[d.thinkerId],
        })),
        motivos: r.selecionados.map((s) => s.contribution.reason),
        excluidos: r.excluidos,
        substituicoes: r.substituicoes,
        excecoes: r.excecoes,
        limitacao: synthesize(r.selecionados, e.input).limitation,
      };
    });
    expect(resultado).toMatchSnapshot();
  });
});
