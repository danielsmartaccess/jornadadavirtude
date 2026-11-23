/* Fase 2 do Conselho (DEC-CUR-02 a DEC-CUR-08): corpus de apoio, recorte do Dalai Lama, pesos do
 * Documento 13 v2, limites de diversidade, referências-base e invariantes. */
import { describe, expect, it } from 'vitest';
import { councilCases, councilMembers, getThinker, thinkers, thinkerVirtues, virtues, works } from '../../src/domain/catalog';
import {
  CONTEXTO_PADRAO,
  deliberarSelecao,
  limitePorUniverso,
  MAX_THINKERS,
  MIN_THINKERS,
  POLITICA_ATUAL,
  POLITICA_V1,
  POLITICA_V2,
  POLITICA_V2_1,
  selectThinkers,
  type ContextoSelecao,
  type SelectionInput,
} from '../../src/domain/council';
import {
  apoios,
  candidatos,
  classificacoes,
  entradasDoAcervo,
  evidencias,
  papelDoRegistro,
  qualidadeDaFonte,
  referenciasBase,
  referenciasDe,
  relacaoUtilizavel,
  taxonomia,
  tradicoes,
  vinculos,
  vinculosDe,
} from '../../src/domain/curadoria';
import type { Thinker, ThinkerVirtue } from '../../src/domain/types';
import { entradasAB } from './support/comparacao-politicas';

const TODAS = entradasAB();
const rodar = (input: SelectionInput, max = MAX_THINKERS) => deliberarSelecao(CONTEXTO_PADRAO, input, max, POLITICA_ATUAL);

function pensador(id: string, tradition: string, workIds: string[] = ['W01'], kind: Thinker['kind'] = 'pensador'): Thinker {
  return {
    id, name: id.toUpperCase(), kind, council: true, period: '', tradition, field: `Campo de ${id}`, concepts: [], question: 'Pergunta?',
    questionSource: 'aplicacao', limits: '', priorityVirtueIds: [], workIds, status: 'proposta',
  };
}
function rel(thinkerId: string, virtueId: string, priority: number | null = 1, status: ThinkerVirtue['status'] = 'proposta'): ThinkerVirtue {
  return { id: `TV-${virtueId}-${thinkerId}`, thinkerId, virtueId, relationType: null, priority, sources: [], justification: 'teste', workIds: [], status };
}
function contexto(parcial: Partial<ContextoSelecao>): ContextoSelecao {
  return { membros: [], relacoes: [], casos: [], evidencias: [], pares: new Map(), ...parcial };
}
const entrada = (virtueIds: string[]): SelectionInput => ({ caseIds: [], virtueIds, dimensionIds: [] });

describe('invariantes da Fase 2', () => {
  it('34 registros do Documento 12, 27 habilitados legados, 189 relações, 21 obras, 6 casos', () => {
    expect(thinkers.filter((t) => t.council)).toHaveLength(27);
    expect(councilMembers).toHaveLength(27);
    expect(thinkerVirtues).toHaveLength(189);
    expect(works).toHaveLength(21);
    expect(councilCases).toHaveLength(6);
    expect(candidatos).toHaveLength(28);
    expect(tradicoes).toHaveLength(14);
    expect(evidencias).toHaveLength(0);
    expect(thinkerVirtues.every((r) => r.status === 'proposta')).toBe(true);
  });

  it('a política operacional é a v2.1 do Documento 13 (revisão DEC-CUR-10), com os mesmos pesos da v2; todas somam 100%', () => {
    expect(POLITICA_ATUAL.id).toBe('council-selection-v2.1-doc13-relevance-source');
    expect(POLITICA_V2_1.pesos).toEqual(POLITICA_V2.pesos);
    expect(POLITICA_V2.id).toBe('council-selection-v2-doc13'); // a v2 original continua disponível, sem renomear
    for (const p of [POLITICA_V1, POLITICA_V2, POLITICA_V2_1]) {
      expect(Object.values(p.pesos).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    }
    expect(POLITICA_V2.pesos).toEqual({ pertinencia: 0.3, relacaoVirtudes: 0.25, fontes: 0.15, complementaridade: 0.15, diversidade: 0.1, contexto: 0.05 });
    expect(POLITICA_V1.pesos).toEqual({ relacaoVirtudes: 0.35, pertinencia: 0.3, contexto: 0.15, fontes: 0.1, complementaridade: 0.1, diversidade: 0 });
  });

  it('a pontuação registrada é a soma ponderada dos critérios, cada um entre 0 e 1', () => {
    for (const e of TODAS) {
      for (const d of rodar(e.input, e.max).detalhes) {
        const soma = (Object.keys(POLITICA_V2.pesos) as (keyof typeof POLITICA_V2.pesos)[]).reduce((s, k) => s + POLITICA_V2.pesos[k] * d.criterios[k], 0);
        expect(d.total).toBeCloseTo(soma, 10);
        for (const v of Object.values(d.criterios)) expect(v >= 0 && v <= 1).toBe(true);
        expect(d.total).toBeLessThanOrEqual(1 + 1e-12); // tolerância de arredondamento em ponto flutuante
      }
    }
  });
});

describe('DEC-CUR-02: tradição é corpus de apoio, não pessoa convocável', () => {
  it('Tradições budistas mantém o council: true legado, mas é corpus de apoio e não é convocável', () => {
    const t = getThinker('tradicoes-budistas')!;
    expect(t.council).toBe(true);
    expect(papelDoRegistro(t)).toBe('contextual_corpus');
    const e = entradasDoAcervo().find((x) => x.id === 'tradicoes-budistas')!;
    expect(e.habilitado).toBe(true);
    expect(e.convocavel).toBe(false);
    expect(entradasDoAcervo().filter((x) => x.convocavel)).toHaveLength(26);
  });

  it('nenhum corpus ocupa vaga individual em nenhuma das 79 entradas de referência', () => {
    for (const e of TODAS) {
      const ids = rodar(e.input, e.max).selecionados.map((s) => s.thinker.id);
      expect(ids.some((id) => papelDoRegistro(getThinker(id)!) === 'contextual_corpus'), e.rotulo).toBe(false);
    }
  });

  it('corpus fica fora com motivo registrado e pode fornecer contexto à perspectiva individual', () => {
    const caso = councilCases.find((c) => c.id === 'CASE04')!;
    const r = rodar({ caseIds: [caso.id], virtueIds: caso.virtueIds, dimensionIds: caso.dimensionIds });
    expect(r.excluidos).toContainEqual({ thinkerId: 'tradicoes-budistas', motivo: 'corpus-de-apoio' });
    const dalai = r.selecionados.find((s) => s.thinker.id === 'dalai-lama');
    expect(dalai, 'Dalai Lama convocado como pessoa no caso do perdão').toBeDefined();
    expect(dalai!.contribution.reason).toContain('Contexto de apoio: Tradições budistas, recorte budismo tibetano');
    expect(dalai!.contribution.reason).toContain('não convocado como pessoa');
  });

  it('Dalai Lama e o corpus budista nunca aparecem como duas vozes independentes', () => {
    let comDalai = 0;
    for (const e of TODAS) {
      const ids = rodar(e.input, e.max).selecionados.map((s) => s.thinker.id);
      if (ids.includes('dalai-lama')) comDalai++;
      expect(ids.includes('dalai-lama') && ids.includes('tradicoes-budistas')).toBe(false);
    }
    expect(comDalai).toBeGreaterThan(0);
  });
});

describe('DEC-CUR-03: recorte do Dalai Lama', () => {
  it('vínculo com o budismo tibetano sustentado por fonte oficial', () => {
    const v = vinculosDe('dalai-lama');
    expect(v.find((x) => x.tipo === 'formado_em' && x.alvo === 'Budismo tibetano')?.situacao).toBe('sustentado_por_fonte');
  });

  it('Gelug (revisão final): VIN-DAL-03 (filiação à ordem monástica) a confirmar, com fonte em revisão e histórico preservado', () => {
    const v = vinculosDe('dalai-lama');
    const filiacao = v.find((x) => x.id === 'VIN-DAL-03')!;
    expect(filiacao.situacao).toBe('a_confirmar');
    expect(filiacao.fonte).toBe('https://doi.org/10.3390/rel5030522'); // fonte mantida como referência em revisão
    expect(filiacao.nota).toMatch(/excede o escopo documental adotado/);
    expect(filiacao.versaoAnterior?.situacao).toBe('a_confirmar'); // versão de 63da8ba, literal
    expect(filiacao.historicoDeSituacao?.map((h) => h.situacao)).toEqual(['a_confirmar', 'sustentado_por_fonte', 'a_confirmar']);
    /* Nenhum vínculo sustentado fala em filiação à ordem monástica Gelug. */
    expect(v.filter((x) => x.situacao === 'sustentado_por_fonte').some((x) => /ordem monástica/i.test(`${x.alvo} ${x.escopo ?? ''}`))).toBe(false);
  });

  it('Gelug (revisão DEC-CUR-10): prática inicial pela declaração oficial sustentada; chefia formal não', () => {
    const v = vinculosDe('dalai-lama');
    const inicial = v.find((x) => x.id === 'VIN-DAL-06')!;
    expect(inicial.situacao).toBe('sustentado_por_fonte');
    expect(inicial.tipo).toBe('formado_em');
    expect(inicial.trecho).toBe('In the early part of my life, I followed only the Gelug tradition.');
    expect(inicial.fonte).toBe('https://www.dalailama.com/news/2017/dzogchen-teaching-and-public-dialogue');
    expect(inicial.dataFonte).toBe('2017-09-25');
    expect(inicial.escopo).toMatch(/^Início da vida/);
    /* Formação posterior em outras tradições: o vínculo Gelug não é apresentado como exclusivo. */
    expect(v.find((x) => x.id === 'VIN-DAL-07')?.situacao).toBe('sustentado_por_fonte');
    expect(v.find((x) => x.id === 'VIN-DAL-03')?.escopo).toMatch(/NÃO implica prática exclusiva/);
    /* Chefia formal Gelug = Ganden Tripa: nunca afirmada para o Dalai Lama. */
    const chefia = v.find((x) => x.id === 'VIN-DAL-08')!;
    expect(chefia.situacao).toBe('nao_afirmar');
    expect(chefia.alvo).toMatch(/Ganden Tripa/);
    expect(chefia.localizacao).toMatch(/p\. 527/);
    /* Nenhum vínculo sustentado afirma liderança, chefia ou representação de uma escola ou de todo o budismo. */
    for (const x of v.filter((y) => y.situacao === 'sustentado_por_fonte')) {
      expect(x.tipo === 'lider_de_toda_tradicao').toBe(false);
      if (x.tipo === 'representa_institucionalmente') expect(x.alvo).toBe('Tibete');
      expect(x.fonte && x.trecho && x.escopo && x.dataFonte && x.natureza && x.localizacao, x.id).toBeTruthy();
    }
  });

  it('não generaliza para todos os budismos: liderança de toda a tradição só como "não afirmar"', () => {
    for (const x of vinculos) {
      if (x.tipo === 'lider_de_toda_tradicao') expect(x.situacao).toBe('nao_afirmar');
      if (/todos os budismos|theravāda|theravada|zen|mahāyāna/i.test(x.alvo)) expect(x.situacao).toBe('nao_afirmar');
      if (x.situacao === 'sustentado_por_fonte') expect(x.fonte && x.trecho).toBeTruthy();
    }
    expect(apoios.every((a) => a.recorte === 'budismo tibetano' && getThinker(a.corpus) && getThinker(a.pessoa))).toBe(true);
  });
});

describe('DEC-CUR-05 e DEC-CUR-07: seleção v2', () => {
  it('mesma entrada e mesma versão dão o mesmo resultado', () => {
    for (const e of TODAS) expect(rodar(e.input, e.max)).toEqual(rodar(e.input, e.max));
  });

  it('cada caso de referência reúne de 2 a 5 vozes individuais', () => {
    for (const c of councilCases) {
      const n = selectThinkers({ caseIds: [c.id], virtueIds: c.virtueIds, dimensionIds: c.dimensionIds }).length;
      expect(n).toBeGreaterThanOrEqual(MIN_THINKERS);
      expect(n).toBeLessThanOrEqual(MAX_THINKERS);
    }
  });

  it('cada perspectiva registra a versão dos critérios na justificativa (Documento 13, seção 20)', () => {
    const s = selectThinkers({ caseIds: ['CASE01'], virtueIds: ['V07'], dimensionIds: [] });
    expect(s.every((x) => x.contribution.reason.endsWith('Critérios de seleção: versão 2.1 (Documento 13).'))).toBe(true);
  });

  it('o número de relações cadastradas não aumenta a pontuação', () => {
    const muitas = pensador('muitas', 'A');
    const poucas = pensador('poucas', 'B');
    const relacoes = [rel('poucas', 'V01'), rel('muitas', 'V01'), ...virtues.slice(1, 40).map((v) => rel('muitas', v.id))];
    const r = deliberarSelecao(contexto({ membros: [muitas, poucas], relacoes }), entrada(['V01']), 5, POLITICA_V2);
    const [a, b] = r.detalhes;
    expect(a.criterios.relacaoVirtudes).toBe(b.criterios.relacaoVirtudes);
    expect(a.total).toBe(b.total);
  });

  it('com 5 vozes, no máximo 2 do mesmo universo quando há alternativa pertinente', () => {
    const fil = ['f1', 'f2', 'f3', 'f4'].map((id) => pensador(id, `T-${id}`));
    const psi = pensador('p1', 'T-p1');
    const cie = pensador('c1', 'T-c1');
    const universo = (id: string) => (id.startsWith('f') ? 'filosofia-etica' : id.startsWith('p') ? 'psicologia-ciencias-humanas' : 'ciencia-sistemas');
    const relacoes = [...fil.map((t) => rel(t.id, 'V01', 1)), rel('p1', 'V01', 3), rel('c1', 'V01', 3)];
    const r = deliberarSelecao(contexto({ membros: [...fil, psi, cie], relacoes, universo }), entrada(['V01']), 5, POLITICA_V2);
    const ids = r.selecionados.map((s) => s.thinker.id);
    expect(ids).toHaveLength(5);
    expect(ids.filter((id) => id.startsWith('f'))).toHaveLength(3); // 2 + 1 por exceção: só há 2 alternativas de fora
    expect(ids).toContain('p1');
    expect(ids).toContain('c1');
    expect(r.diversityConstraintRelaxed).toBe(true);
    expect(r.relaxamentos).toHaveLength(1);
    expect(limitePorUniverso(5)).toBe(2);
  });

  it('com 2 a 4 vozes, busca ao menos 2 universos quando possível', () => {
    const fil = ['f1', 'f2', 'f3'].map((id) => pensador(id, `T-${id}`));
    const psi = pensador('p1', 'T-p1');
    const universo = (id: string) => (id.startsWith('f') ? 'filosofia-etica' : 'psicologia-ciencias-humanas');
    const relacoes = [...fil.map((t) => rel(t.id, 'V01', 1)), rel('p1', 'V01', 3)];
    for (const max of [2, 3, 4]) {
      const r = deliberarSelecao(contexto({ membros: [...fil, psi], relacoes, universo }), entrada(['V01']), max, POLITICA_V2);
      const ids = r.selecionados.map((s) => s.thinker.id);
      expect(ids, `máximo ${max}`).toContain('p1');
      expect(r.diversityConstraintRelaxed).toBe(false);
    }
  });

  it('sem alternativa pertinente, a exceção é registrada em vez de rebaixar a pertinência', () => {
    const fil = ['f1', 'f2', 'f3'].map((id) => pensador(id, `T-${id}`));
    /* p1 é de outro universo, mas só tem relação de "referência" (sem prioridade): não é alternativa pertinente. */
    const psi = pensador('p1', 'T-p1');
    const universo = (id: string) => (id.startsWith('f') ? 'filosofia-etica' : 'psicologia-ciencias-humanas');
    const relacoes = [...fil.map((t) => rel(t.id, 'V01', 1)), rel('p1', 'V01', null)];
    const r = deliberarSelecao(contexto({ membros: [...fil, psi], relacoes, universo }), entrada(['V01']), 2, POLITICA_V2);
    expect(r.selecionados.map((s) => s.thinker.id)).toEqual(['f1', 'f2']);
    expect(r.diversityConstraintRelaxed).toBe(true);
    expect(r.relaxamentos[0]).toMatch(/sem alternativa pertinente de outro universo/);
  });

  it('a classificação, sozinha, não convoca: sem relação nem caso, ninguém entra', () => {
    const t = pensador('solo', 'T');
    const r = deliberarSelecao(contexto({ membros: [t], universo: () => 'literatura-artes' }), entrada(['V01']), 5, POLITICA_V2);
    expect(r.selecionados).toEqual([]);
  });

  it('exige fonte recuperável na v2; na v1 a falta de fonte só reduzia a pontuação', () => {
    const sem = pensador('sem', 'T1', []);
    const com = pensador('com', 'T2');
    const ctx = contexto({ membros: [sem, com], relacoes: [rel('sem', 'V01'), rel('com', 'V01')] });
    expect(deliberarSelecao(ctx, entrada(['V01']), 5, POLITICA_V2).excluidos).toContainEqual({ thinkerId: 'sem', motivo: 'sem-fonte' });
    expect(deliberarSelecao(ctx, entrada(['V01']), 5, POLITICA_V1).selecionados.map((s) => s.thinker.id)).toContain('sem');
  });

  it('relações suspensas, rejeitadas ou F4 não são usadas na v2', () => {
    const [a, b, c] = ['a', 'b', 'c'].map((id) => pensador(id, `T-${id}`));
    const relacoes = [rel('a', 'V01', 1, 'suspensa'), rel('b', 'V01', 1, 'rejeitada'), rel('c', 'V01')];
    const ctx = contexto({ membros: [a, b, c], relacoes });
    expect(deliberarSelecao(ctx, entrada(['V01']), 5, POLITICA_V2).selecionados.map((s) => s.thinker.id)).toEqual(['c']);
    const f4 = { id: 'EV', relacaoId: 'TV-V01-c', localizacao: 'x', justificativa: 'x', tipoRelacao: 'conceitual' as const, nivel: 'F4' as const, status: 'proposta' as const };
    expect(deliberarSelecao({ ...ctx, evidencias: [f4] }, entrada(['V01']), 5, POLITICA_V2).selecionados).toEqual([]);
  });

  it('ausência de F1–F4 não é F4: as 189 relações sem evidência continuam utilizáveis', () => {
    expect(thinkerVirtues.every((r) => relacaoUtilizavel(r))).toBe(true);
  });
});

describe('DEC-CUR-04: referências-base dos nove habilitados sem obra', () => {
  const NOVE = ['socrates', 'musashi', 'simone-weil', 'richard-feynman', 'karl-popper', 'edith-stein', 'benjamin-franklin', 'peter-drucker', 'dalai-lama'];

  it('os nove nomes são exatamente os habilitados sem obra no catálogo', () => {
    expect(councilMembers.filter((t) => !t.workIds.length && papelDoRegistro(t) !== 'contextual_corpus').map((t) => t.id).sort()).toEqual([...NOVE].sort());
  });

  it('cada um tem referência-base ou lacuna documentada; nenhuma referência vira obra do catálogo', () => {
    for (const id of NOVE) {
      const refs = referenciasDe(id);
      expect(refs.length, id).toBeGreaterThan(0);
      for (const r of refs) {
        if (r.conferencia.situacao !== 'metadados_confirmados') expect(r.conferencia.lacunas.length, r.workId).toBeGreaterThan(0);
        expect(r.conferencia.fonte).toMatch(/^https:\/\//);
      }
    }
    expect(referenciasBase.every((r) => r.workId.startsWith('REF-') && !works.some((w) => w.id === r.workId))).toBe(true);
    expect(new Set(referenciasBase.map((r) => r.workId)).size).toBe(referenciasBase.length);
    /* Referência-base não é ligada em bloco às relações: nenhuma relação aponta para um REF-*. */
    expect(thinkerVirtues.some((r) => r.workIds.some((w) => w.startsWith('REF-')))).toBe(false);
  });

  it('Sócrates aparece por testemunhos de terceiros, não por obra autoral fictícia', () => {
    const refs = referenciasDe('socrates');
    expect(refs.map((r) => r.autores[0]).sort()).toEqual(['Aristófanes', 'Platão', 'Xenofonte']);
    expect(refs.every((r) => r.relacao === 'source_witness_for' && r.tipoFonte === 'testemunho')).toBe(true);
    expect(refs.some((r) => r.autores.includes('Sócrates'))).toBe(false);
  });

  it('metadados não confirmados ficam vazios, sem invenção (ISBN só quando conferido)', () => {
    for (const r of referenciasBase) {
      if (r.conferencia.situacao === 'a_confirmar') expect([r.editora, r.ano, r.isbn, r.tradutor]).toEqual([null, null, null, null]);
      if (r.isbn) expect(r.conferencia.registro).toContain(r.isbn);
    }
  });

  it('a qualidade da fonte do autor muda a disponibilidade, nunca o status das relações', () => {
    expect(qualidadeDaFonte(getThinker('socrates')!)).toBe(0.5);
    expect(qualidadeDaFonte(getThinker('benjamin-franklin')!)).toBe(0.5);
    expect(qualidadeDaFonte(getThinker('dalai-lama')!)).toBe(1);
    expect(thinkerVirtues.every((r) => r.status === 'proposta')).toBe(true);
  });
});

describe('DEC-CUR-06: taxonomia de navegação v1', () => {
  it('versionada, marcada como sujeita a revisão, com tipo principal e notas para casos híbridos', () => {
    expect(taxonomia.versao).toBe('1.0');
    expect(taxonomia.aviso).toBe('Classificação curatorial v1 — sujeita a revisão especializada');
    expect(classificacoes).toHaveLength(42);
    expect(classificacoes.every((c) => c.universos.length >= 1)).toBe(true);
    for (const id of ['richard-feynman', 'dalai-lama', 'simone-weil']) expect(classificacoes.find((c) => c.id === id)?.nota).toBeTruthy();
  });
});

describe('gate de segurança inalterado', () => {
  it('crisis.ts tem o mesmo conteúdo da versão de origin/main (5d81ecc)', async () => {
    const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (p: URL, e: string) => string };
    const texto = readFileSync(new URL('../../src/domain/crisis.ts', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
    let h = 0x811c9dc5;
    for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 0x01000193) >>> 0;
    expect(h.toString(16)).toBe(IMPRESSAO_CRISIS);
  });
});

/* Impressão digital (FNV-1a, fim de linha normalizado) de src/domain/crisis.ts no merge commit 5d81ecc. */
const IMPRESSAO_CRISIS = '178c6cf5';
