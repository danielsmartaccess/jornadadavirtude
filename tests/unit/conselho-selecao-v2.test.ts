/* Referência da política operacional v2 (Documento 13 v2.0, DEC-CUR-05), gravada na Fase 2.
 * Mesmas 79 entradas do snapshot da v1. Qualquer mudança de pesos, regras ou dados que altere a
 * seleção aparece aqui e precisa ser revista junto com a decisão que a motivou. */
import { describe, expect, it } from 'vitest';
import { CONTEXTO_PADRAO, deliberarSelecao, POLITICA_V2, synthesize } from '../../src/domain/council';
import { entradasAB } from './support/comparacao-politicas';

const arred = (x: number) => Math.round(x * 1e6) / 1e6;

describe('Conselho: seleção pela política v2 (Documento 13)', () => {
  it('as 79 entradas de referência', () => {
    const resultado = entradasAB().map((e) => {
      const r = deliberarSelecao(CONTEXTO_PADRAO, e.input, e.max, POLITICA_V2);
      return {
        entrada: `${e.grupo}: ${e.rotulo}`,
        politica: r.politica,
        selecionados: r.detalhes.map((d) => ({
          id: d.thinkerId,
          total: arred(d.total),
          universo: d.universo ?? null,
          criterios: Object.fromEntries(Object.entries(d.criterios).map(([k, v]) => [k, arred(v)])),
        })),
        motivos: r.selecionados.map((s) => s.contribution.reason),
        excluidos: r.excluidos,
        relaxamentos: r.relaxamentos,
        limitacao: synthesize(r.selecionados, e.input).limitation,
      };
    });
    expect(resultado).toMatchSnapshot();
  });
});
