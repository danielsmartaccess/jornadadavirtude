/* Revisão humana da Fase 2 (DEC-CUR-10): política v2.1.
 * - Diversidade só entre alternativas qualificadas: elegível + pertinência temática demonstrada + pertinência
 *   contextual documentada. Integrar o caso ou ter relação prioritária, isoladamente, não basta.
 * - Fonte: disponibilidade separada de completude bibliográfica e de confiabilidade (Sócrates).
 * Os testes de dados de teste usam ids e textos fictícios. */
import { describe, expect, it } from 'vitest';
import { councilCases, getThinker } from '../../src/domain/catalog';
import {
  CONTEXTO_PADRAO,
  deliberarSelecao,
  POLITICA_ATUAL,
  POLITICA_V2,
  POLITICA_V2_1,
  type ContextoSelecao,
  type SelectionInput,
} from '../../src/domain/council';
import { completudeBibliografica, qualidadeDaFonte, referenciasDe, temFonteIdentificada } from '../../src/domain/curadoria';
import type { CouncilCase, Thinker, ThinkerVirtue } from '../../src/domain/types';
import { entradasAB } from './support/comparacao-politicas';

function pessoa(id: string, workIds: string[] = ['W01']): Thinker {
  return {
    id, name: id.toUpperCase(), kind: 'pensador', council: true, period: '', tradition: `Tradição ${id}`, field: `Campo geral de ${id}`,
    concepts: [], question: 'Pergunta?', questionSource: 'aplicacao', limits: '', priorityVirtueIds: [], workIds, status: 'proposta',
  };
}
function rel(thinkerId: string, virtueId: string, priority: number | null = 1, status: ThinkerVirtue['status'] = 'proposta'): ThinkerVirtue {
  return { id: `TV-${virtueId}-${thinkerId}`, thinkerId, virtueId, relationType: null, priority, sources: [], justification: 'teste', workIds: [], status };
}
function caso(contribuicoes: [string, string][]): CouncilCase {
  return {
    id: 'CASO-T', title: 'Caso de teste', situation: 'Situação fictícia', dimensionIds: [], virtueIds: ['V01'],
    contributions: contribuicoes.map(([thinkerId, perspective]) => ({ thinkerId, perspective })),
    centralQuestion: 'Pergunta central?', keywords: [], source: 'teste', status: 'proposta',
  } as unknown as CouncilCase;
}
const universo = (id: string) => (id.startsWith('f') ? 'filosofia-etica' : 'psicologia-ciencias-humanas');
function ctx(parcial: Partial<ContextoSelecao>): ContextoSelecao {
  return { membros: [], relacoes: [], casos: [], evidencias: [], pares: new Map(), universo, ...parcial };
}
const comCaso: SelectionInput = { caseIds: ['CASO-T'], virtueIds: ['V01', 'V02'], dimensionIds: [] };
const semCaso: SelectionInput = { caseIds: [], virtueIds: ['V01', 'V02'], dimensionIds: [] };
const ids = (r: ReturnType<typeof deliberarSelecao>) => r.selecionados.map((s) => s.thinker.id);

/* Três vozes de filosofia fortes (relação com as duas virtudes pedidas) e uma de psicologia; com 2 vagas, o
 * limite por universo é 1. As de filosofia superam p1 na pontuação, para que só a regra de diversidade possa trocá-las. */
const f1 = pessoa('f1');
const f2 = pessoa('f2');
const f3 = pessoa('f3');
const p1 = pessoa('p1');
const relFil = ['f1', 'f2', 'f3'].flatMap((id) => [rel(id, 'V01'), rel(id, 'V02')]);

describe('v2.1: pertinência antes da diversidade', () => {
  it('integrante do caso SEM pertinência temática não é alternativa qualificada (na v2 era)', () => {
    const c = ctx({ membros: [f1, f2, f3, p1], relacoes: relFil, casos: [caso([['f1', 'Aspecto A'], ['f2', 'Aspecto B'], ['p1', 'Aspecto C']])] });
    const v2 = deliberarSelecao(c, comCaso, 2, POLITICA_V2);
    expect(v2.substituicoes).toHaveLength(1); // falso positivo da regra antiga
    expect(v2.substituicoes[0].incluida).toBe('p1');
    expect(v2.substituicoes[0].avaliacaoIncluida.thematicRelevance).toBe('ausente');
    const v21 = deliberarSelecao(c, comCaso, 2, POLITICA_V2_1);
    expect(v21.substituicoes).toEqual([]);
    expect(ids(v21)).toEqual(['f1', 'f2']);
    expect(v21.excecoes).toEqual([{ vaga: 2, candidato: 'f2', universo: 'filosofia-etica', limite: 1, motivo: 'sem-alternativa-qualificada' }]);
    expect(v21.diversityConstraintRelaxed).toBe(true);
  });

  it('relação prioritária no Documento 04, isolada, não garante pertinência contextual', () => {
    const c = ctx({ membros: [f1, f2, p1], relacoes: [...relFil.slice(0, 4), rel('p1', 'V01', 1)] });
    const r = deliberarSelecao(c, semCaso, 2, POLITICA_V2_1);
    const avaliacaoP1 = deliberarSelecao(c, semCaso, 3, POLITICA_V2_1).avaliacoes.p1;
    expect(avaliacaoP1.thematicRelevance).toBe('demonstrada');
    expect(avaliacaoP1.contextualRelevance).toBe('insufficient_data');
    expect(avaliacaoP1.diversityEligible).toBe(false);
    expect(r.substituicoes).toEqual([]);
    expect(r.excecoes[0].motivo).toBe('contexto-nao-avaliavel');
    /* Na v2 antiga, a relação prioritária bastava para substituir. */
    expect(deliberarSelecao(c, semCaso, 2, POLITICA_V2).substituicoes).toHaveLength(1);
  });

  it('alternativa com pertinência temática E contextual pode substituir, com justificativa auditável', () => {
    const c = ctx({
      membros: [f1, f2, f3, p1],
      relacoes: [...relFil, rel('p1', 'V01', 3)],
      casos: [caso([['f1', 'Aspecto A'], ['f2', 'Aspecto B'], ['p1', 'Vieses na reação imediata']])],
    });
    const r = deliberarSelecao(c, comCaso, 2, POLITICA_V2_1);
    expect(ids(r)).toEqual(['f1', 'p1']);
    expect(r.substituicoes).toEqual([
      {
        vaga: 2,
        politica: 'council-selection-v2.1-doc13-relevance-source',
        preterida: 'f2',
        incluida: 'p1',
        universoPreterida: 'filosofia-etica',
        universoIncluida: 'psicologia-ciencias-humanas',
        universosAntes: ['filosofia-etica'],
        limite: 1,
        ambasElegiveis: true,
        avaliacaoIncluida: {
          caseMember: true, thematicRelevance: 'demonstrada', contextualRelevance: 'documentada', diversityEligible: true,
          evidencia: { relacoes: ['TV-V01-p1'], caso: 'CASO-T', perspectiva: 'Vieses na reação imediata' },
        },
        avaliacaoPreterida: {
          caseMember: true, thematicRelevance: 'demonstrada', contextualRelevance: 'documentada', diversityEligible: true,
          evidencia: { relacoes: ['TV-V01-f2', 'TV-V02-f2'], caso: 'CASO-T', perspectiva: 'Aspecto B' },
        },
      },
    ]);
    expect(r.diversityConstraintRelaxed).toBe(false);
  });

  it('perspectiva do caso igual ao campo geral do autor não conta como pertinência contextual', () => {
    const c = ctx({ membros: [f1, f2, p1], relacoes: [...relFil.slice(0, 4), rel('p1', 'V01', 1)], casos: [caso([['f1', 'A'], ['f2', 'B'], ['p1', p1.field]])] });
    const r = deliberarSelecao(c, comCaso, 3, POLITICA_V2_1);
    expect(r.avaliacoes.p1.contextualRelevance).toBe('insufficient_data');
    expect(r.avaliacoes.p1.diversityEligible).toBe(false);
  });

  it('diversidade não introduz candidato sem fonte', () => {
    const semFonte = pessoa('p1', []);
    const c = ctx({ membros: [f1, f2, semFonte], relacoes: [...relFil.slice(0, 4), rel('p1', 'V01', 1)], casos: [caso([['f1', 'A'], ['f2', 'B'], ['p1', 'C']])] });
    const r = deliberarSelecao(c, comCaso, 2, POLITICA_V2_1);
    expect(r.excluidos).toContainEqual({ thinkerId: 'p1', motivo: 'sem-fonte' });
    expect(ids(r)).not.toContain('p1');
    expect(r.substituicoes).toEqual([]);
  });

  it('diversidade não supera relação suspensa, rejeitada ou F4', () => {
    for (const relP1 of [rel('p1', 'V01', 1, 'suspensa'), rel('p1', 'V01', 1, 'rejeitada')]) {
      const c = ctx({ membros: [f1, f2, p1], relacoes: [...relFil.slice(0, 4), relP1], casos: [caso([['f1', 'A'], ['f2', 'B'], ['p1', 'C']])] });
      const r = deliberarSelecao(c, comCaso, 2, POLITICA_V2_1);
      expect(r.substituicoes, relP1.status).toEqual([]);
    }
    const f4 = { id: 'EV', relacaoId: 'TV-V01-p1', localizacao: 'x', justificativa: 'x', tipoRelacao: 'conceitual' as const, nivel: 'F4' as const, status: 'proposta' as const };
    const c = ctx({ membros: [f1, f2, p1], relacoes: [...relFil.slice(0, 4), rel('p1', 'V01', 1)], evidencias: [f4], casos: [caso([['f1', 'A'], ['f2', 'B'], ['p1', 'C']])] });
    expect(deliberarSelecao(c, comCaso, 2, POLITICA_V2_1).substituicoes).toEqual([]);
  });

  it('o número de relações cadastradas não aumenta a pontuação na v2.1', () => {
    const muitas = pessoa('muitas');
    const poucas = pessoa('poucas');
    const relacoes = [rel('poucas', 'V01'), rel('muitas', 'V01'), ...['V03', 'V04', 'V05', 'V06', 'V07', 'V08'].map((v) => rel('muitas', v))]; // relações extras fora das virtudes pedidas
    const r = deliberarSelecao(ctx({ membros: [muitas, poucas], relacoes, universo: () => undefined }), semCaso, 5, POLITICA_V2_1);
    expect(r.detalhes[0].total).toBe(r.detalhes[1].total);
  });

  it('determinística nas 79 entradas de referência', () => {
    for (const e of entradasAB()) {
      expect(deliberarSelecao(CONTEXTO_PADRAO, e.input, e.max, POLITICA_V2_1)).toEqual(deliberarSelecao(CONTEXTO_PADRAO, e.input, e.max, POLITICA_V2_1));
    }
  });

  it('toda substituição real nas 79 entradas passa pelas duas dimensões; toda exceção tem motivo específico', () => {
    for (const e of entradasAB()) {
      const r = deliberarSelecao(CONTEXTO_PADRAO, e.input, e.max, POLITICA_ATUAL);
      for (const s of r.substituicoes) {
        expect(s.avaliacaoIncluida.thematicRelevance, e.rotulo).toBe('demonstrada');
        expect(s.avaliacaoIncluida.contextualRelevance, e.rotulo).toBe('documentada');
      }
      expect(r.excecoes.length).toBe(r.relaxamentos.length);
      for (const x of r.excecoes) expect(['sem-alternativa-qualificada', 'contexto-nao-avaliavel']).toContain(x.motivo);
      if (!e.input.caseIds.length) expect(r.substituicoes).toEqual([]); // sem caso, nada é contextual "por inferência"
    }
  });
});

describe('v2.1: fonte de Sócrates — disponibilidade, completude e confiabilidade separadas', () => {
  const socrates = getThinker('socrates')!;

  it('a v2 dava 0,5 por metadados editoriais a conferir; a v2.1 registra fonte identificada', () => {
    expect(qualidadeDaFonte(socrates)).toBe(0.5); // comportamento histórico da v2, preservado para auditoria
    expect(temFonteIdentificada(socrates)).toBe(true);
    expect(temFonteIdentificada(getThinker('benjamin-franklin')!)).toBe(true);
    expect(temFonteIdentificada({ id: 'ninguem', workIds: [] })).toBe(false);
  });

  it('testemunhos: completude bibliográfica pendente, confiabilidade não avaliada (sem nota numérica), natureza registrada com localização', () => {
    const refs = referenciasDe('socrates');
    expect(refs).toHaveLength(3);
    for (const r of refs) {
      expect(r.relacao).toBe('source_witness_for');
      expect(completudeBibliografica(r)).toBe('pendente');
      expect(r.confiabilidade?.situacao).toBe('nao_avaliada');
      expect(r.confiabilidade?.natureza).toBeTruthy();
      expect(r.confiabilidade?.localizacao).toMatch(/SEP, "Socrates"/);
      expect(Object.keys(r.confiabilidade ?? {})).not.toContain('nota');
    }
  });

  it('CASE05 pelos identificadores: na v2 Sócrates saía; o critério de fonte dele passa de 0,5 para 1 na v2.1', () => {
    const c = councilCases.find((x) => x.id === 'CASE05')!;
    const input = { caseIds: [c.id], virtueIds: c.virtueIds, dimensionIds: c.dimensionIds };
    const v2 = deliberarSelecao(CONTEXTO_PADRAO, input, 5, POLITICA_V2);
    expect(v2.selecionados.map((s) => s.thinker.id)).not.toContain('socrates');
    const v21 = deliberarSelecao(CONTEXTO_PADRAO, input, 5, POLITICA_V2_1);
    const d = v21.detalhes.find((x) => x.thinkerId === 'socrates');
    if (d) expect(d.criterios.fontes).toBe(1);
  });
});
