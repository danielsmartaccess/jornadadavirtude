/* Referência do comportamento da seleção do Conselho em produção.
 *
 * O snapshot foi gravado ANTES da curadoria ampliada (Documento 14), com o motor do commit 093ef96.
 * A ampliação acrescenta candidatos, tradições e evidências em camada separada e regras de
 * elegibilidade que não afetam os dados atuais: estas seleções precisam continuar idênticas.
 * Se uma decisão de produto mudar a seleção de propósito, o snapshot deve ser revisto junto com ela.
 *
 * Fase 2 (DEC-CUR-05): a política operacional passou a ser a v2 (Documento 13). Este snapshot NÃO foi
 * regravado: ele agora testa a política v1 (Documento 04), chamada explicitamente, e prova que o algoritmo
 * legado foi reconstruído sem diferença. A política v2 tem snapshot próprio (conselho-selecao-v2.test.ts). */
import { describe, expect, it } from 'vitest';
import { councilCases, dimensions, families, virtues } from '../../src/domain/catalog';
import { CONTEXTO_PADRAO, deliberarSelecao, POLITICA_V1, suggest, synthesize, type SelectionInput } from '../../src/domain/council';

function resumo(input: SelectionInput, max?: number) {
  const selecao = deliberarSelecao(CONTEXTO_PADRAO, input, max, POLITICA_V1).selecionados;
  return {
    entrada: input,
    selecionados: selecao.map((s) => ({ id: s.thinker.id, motivo: s.contribution.reason, perspectiva: s.contribution.perspective, obras: s.contribution.workIds })),
    sintese: synthesize(selecao, input),
  };
}

describe('Conselho: seleção em produção permanece a mesma (referência gravada antes do Documento 14)', () => {
  it('cada virtude isolada', () => {
    expect(virtues.map((v) => resumo({ caseIds: [], virtueIds: [v.id], dimensionIds: [] }))).toMatchSnapshot();
  });

  it('cada família de virtudes, com as dimensões primárias', () => {
    const entradas = families.map((f) => ({ caseIds: [], virtueIds: virtues.filter((v) => v.familyId === f.id).map((v) => v.id), dimensionIds: ['DIM03', 'DIM04'] }));
    expect(entradas.map((e) => resumo(e))).toMatchSnapshot();
  });

  it('cada caso de referência: pela situação descrita e pelos próprios identificadores', () => {
    const pelaSituacao = councilCases.map((c) => {
      const s = suggest(c.situation);
      return resumo({ caseIds: s.caseIds, virtueIds: s.virtueIds, dimensionIds: s.dimensionIds });
    });
    const pelosIds = councilCases.map((c) => resumo({ caseIds: [c.id], virtueIds: c.virtueIds, dimensionIds: c.dimensionIds }));
    expect({ pelaSituacao, pelosIds }).toMatchSnapshot();
  });

  it('dimensões isoladas, entrada vazia e limites menores', () => {
    const porDimensao = dimensions.map((d) => resumo({ caseIds: [], virtueIds: [], dimensionIds: [d.id] }));
    const vazia = resumo({ caseIds: [], virtueIds: [], dimensionIds: [] });
    const limites = [2, 3, 4].map((max) => resumo({ caseIds: ['CASE04'], virtueIds: ['V29', 'V26', 'V11'], dimensionIds: ['DIM03'] }, max));
    expect({ porDimensao, vazia, limites }).toMatchSnapshot();
  });
});
