/* Curadoria ampliada do Conselho (Documento 14): preservação do catálogo, candidatos não
 * habilitados, tradições que não são pessoas, evidências por relação e regras da seleção. */
import { describe, expect, it } from 'vitest';
import { councilCases, councilMembers, getThinker, thinkers, thinkerVirtues, virtues, works } from '../../src/domain/catalog';
import {
  CONTEXTO_PADRAO,
  deliberarSelecao,
  MAX_THINKERS,
  POLITICA_V1,
  POLITICA_V2,
  selecionarPerspectivas,
  type PoliticaSelecao,
  selectThinkers,
  synthesize,
  type ContextoSelecao,
} from '../../src/domain/council';
import {
  candidatos,
  classificacoes,
  ehTradicao,
  entradasDoAcervo,
  evidencias,
  getCandidato,
  mapaDoc12,
  paresNaoIndependentes,
  problemasDaEvidencia,
  relacaoUtilizavel,
  tradicoes,
  universos,
  validacaoTemFonte,
  type EvidenciaRelacao,
} from '../../src/domain/curadoria';
import type { Thinker, ThinkerVirtue } from '../../src/domain/types';

const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (caminho: URL, codificacao: string) => string };

/** FNV-1a: impressão digital do conteúdo, para provar que o catálogo original não mudou. */
const impressao = (valor: unknown) => {
  const s = JSON.stringify(valor);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
};

const HABILITADOS_ORIGINAIS = [
  'socrates', 'platao', 'aristoteles', 'confucio', 'lao-tse', 'epicteto', 'seneca', 'marco-aurelio', 'tomas-de-aquino', 'kant',
  'musashi', 'simone-weil', 'viktor-frankl', 'daniel-kahneman', 'richard-feynman', 'karl-popper', 'john-stuart-mill', 'john-locke',
  'john-rawls', 'edith-stein', 'erich-fromm', 'nassim-taleb', 'donella-meadows', 'benjamin-franklin', 'peter-drucker', 'dalai-lama',
  'tradicoes-budistas',
];

const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s*\(.*\)\s*/g, '').trim();

describe('preservação do catálogo original', () => {
  it('thinkers, relações, obras e casos têm exatamente o conteúdo de antes da curadoria ampliada', () => {
    expect(impressao(thinkers)).toBe('4e220f35');
    expect(impressao(thinkerVirtues)).toBe('aa9d6a08');
    expect(impressao(works)).toBe('659be0a8');
    expect(impressao(councilCases)).toBe('284650c2');
  });

  it('as 189 relações continuam com ids únicos, status proposta e o P1–P4 do Documento 04 intocado', () => {
    expect(thinkerVirtues).toHaveLength(189);
    expect(new Set(thinkerVirtues.map((r) => r.id)).size).toBe(189);
    expect(thinkerVirtues.every((r) => r.status === 'proposta')).toBe(true);
    expect(thinkerVirtues.filter((r) => r.relationType).map((r) => `${r.thinkerId}:${r.virtueId}:${r.relationType}`).sort()).toEqual([
      'aristoteles:V06:P1', 'aristoteles:V12:P1', 'aristoteles:V18:P1', 'daniel-kahneman:V01:P3', 'daniel-kahneman:V03:P3',
    ]);
  });

  it('os 27 integrantes habilitados continuam habilitados e elegíveis, com relação utilizável', () => {
    expect(councilMembers.map((t) => t.id)).toEqual(HABILITADOS_ORIGINAIS);
    expect(CONTEXTO_PADRAO.membros.map((t) => t.id)).toEqual(HABILITADOS_ORIGINAIS);
    for (const id of HABILITADOS_ORIGINAIS) {
      expect(thinkerVirtues.some((r) => r.thinkerId === id && relacaoUtilizavel(r)), id).toBe(true);
    }
  });

  it('os 34 integrantes do Documento 12 estão preservados: 26 no catálogo e 8 como candidatos', () => {
    const doc12 = readFileSync(new URL('../../docs/DOCUMENTO-12-catalogo-de-pensadores.md', import.meta.url), 'utf8');
    const linhas = [...doc12.matchAll(/^\| (PENS-\d{3}) \| ([^|]+) \|/gm)].map((m) => ({ doc12Id: m[1], nome: m[2].trim() }));
    expect(linhas).toHaveLength(34);
    expect(mapaDoc12.map((m) => m.doc12Id)).toEqual(linhas.map((l) => l.doc12Id));
    const apelidos: Record<string, string> = { kant: 'immanuel kant', 'nassim-taleb': 'nassim nicholas taleb' };
    for (const { doc12Id, id } of mapaDoc12) {
      const nomeDoc = normalizar(linhas.find((l) => l.doc12Id === doc12Id)!.nome);
      const registro = getThinker(id) ?? getCandidato(id);
      expect(registro, `${doc12Id} → ${id}`).toBeTruthy();
      const nomeApp = normalizar('name' in registro! ? registro.name : registro!.nome);
      expect(apelidos[id] ?? nomeApp, doc12Id).toBe(apelidos[id] ? apelidos[id] : nomeDoc);
    }
    expect(mapaDoc12.filter((m) => getThinker(m.id))).toHaveLength(26);
    expect(mapaDoc12.filter((m) => getCandidato(m.id)?.origem === 'doc12')).toHaveLength(8);
  });
});

describe('candidatos e tradições não entram no Conselho', () => {
  it('registra os 28 candidatos do Documento 12 e do Documento 14, todos propostos e não habilitados', () => {
    const porOrigem = (o: string) => candidatos.filter((c) => c.origem === o).map((c) => c.nome);
    expect(porOrigem('doc12')).toHaveLength(8);
    expect(porOrigem('doc14-prioritario')).toEqual([
      'Emmanuel Levinas', 'B. R. Ambedkar', 'Śāntideva', 'Thich Nhat Hanh', 'Ibn Miskawayh', 'Kwame Gyekye', 'Kwasi Wiredu', 'Ailton Krenak',
      'Davi Kopenawa', 'Enrique Dussel', 'Lélia Gonzalez', 'Carl Rogers', 'Carol Gilligan', 'Iris Murdoch', 'John Dewey',
    ]);
    expect(porOrigem('doc14-pesquisa')).toEqual(['Rabindranath Tagore', 'Tiruvalluvar', 'Rumi']);
    expect(porOrigem('doc14-literaria')).toEqual(['Toni Morrison', 'Clarice Lispector']);
    expect(candidatos.every((c) => c.habilitado === false && c.status === 'proposta')).toBe(true);
    for (const c of candidatos) {
      expect(getThinker(c.id), `${c.id} não pode estar no catálogo original`).toBeUndefined();
      expect(thinkerVirtues.some((r) => r.thinkerId === c.id), `${c.id} sem relações com virtudes`).toBe(false);
    }
  });

  it('nenhuma seleção, para nenhuma virtude ou caso, convoca candidato ou entrada da camada de tradições', () => {
    const foraDoConselho = new Set([...candidatos.map((c) => c.id), ...tradicoes.map((t) => t.id)]);
    const entradas = [
      ...virtues.map((v) => ({ caseIds: [], virtueIds: [v.id], dimensionIds: [] })),
      ...councilCases.map((c) => ({ caseIds: [c.id], virtueIds: c.virtueIds, dimensionIds: c.dimensionIds })),
    ];
    for (const e of entradas) {
      for (const s of selectThinkers(e)) {
        expect(foraDoConselho.has(s.thinker.id)).toBe(false);
        expect(s.thinker.council).toBe(true);
      }
    }
  });

  it('tradições não são pessoas: tipo próprio, sem biografia, e os registros de tradição do catálogo são reconhecidos', () => {
    expect(tradicoes).toHaveLength(14);
    for (const t of tradicoes) {
      expect(['tradicao-corpus', 'escola-corrente']).toContain(t.tipo);
      expect(Object.keys(t)).not.toContain('period');
      expect(Object.keys(t)).not.toContain('question');
      expect(ehTradicao(t.id)).toBe(true);
    }
    for (const t of thinkers.filter((x) => x.kind === 'tradicao')) expect(ehTradicao(t.id), t.id).toBe(true);
    for (const t of thinkers.filter((x) => x.kind === 'pensador')) expect(ehTradicao(t.id), t.id).toBe(false);
    expect(candidatos.some((c) => c.tipo === 'tradicao-corpus' || c.tipo === 'escola-corrente')).toBe(false);
  });

  it('referências internas da camada curatorial apontam para registros que existem', () => {
    const ids = new Set([...thinkers.map((t) => t.id), ...candidatos.map((c) => c.id)]);
    for (const t of tradicoes) {
      for (const a of t.autoresRelacionados) expect(ids.has(a), `${t.id} → ${a}`).toBe(true);
      for (const r of t.registrosNoCatalogo) expect(getThinker(r), `${t.id} → ${r}`).toBeTruthy();
      for (const o of t.obras ?? []) expect(works.some((w) => w.id === o)).toBe(true);
    }
    expect(classificacoes.map((c) => c.id).sort()).toEqual(thinkers.map((t) => t.id).sort());
    const universoIds = new Set(universos.map((u) => u.id));
    expect(universos).toHaveLength(5);
    for (const e of entradasDoAcervo()) for (const u of e.universos) expect(universoIds.has(u), `${e.id}: ${u}`).toBe(true);
    const todos = entradasDoAcervo().map((e) => e.id);
    expect(new Set(todos).size).toBe(todos.length);
  });

  it('Estoicismo é corpus ligado aos três estoicos, não uma quarta voz', () => {
    const pares = paresNaoIndependentes();
    expect([...(pares.get('estoicismo') ?? [])].sort()).toEqual(['epicteto', 'marco-aurelio', 'seneca']);
    expect(pares.get('seneca')?.has('estoicismo')).toBe(true);
  });
});

describe('evidências por relação (Documento 14, seção 9)', () => {
  const relacao = thinkerVirtues[0];
  const base: EvidenciaRelacao = {
    id: 'EV-teste', relacaoId: relacao.id, localizacao: 'a confirmar', justificativa: 'Justificativa específica.',
    tipoRelacao: 'conceitual', nivel: null, status: 'proposta',
  };

  it('o arquivo de evidências começa vazio: nenhuma fonte foi conferida nem classificada por inferência', () => {
    expect(evidencias).toEqual([]);
  });

  it('F1 e F2 exigem obra específica; F1 exige localização conferida e revisor', () => {
    expect(problemasDaEvidencia({ ...base, nivel: 'F2' })).toContain('F2 exige obra específica');
    expect(problemasDaEvidencia({ ...base, nivel: 'F2', obraId: 'W01' })).toEqual([]);
    expect(problemasDaEvidencia({ ...base, nivel: 'F1', obraId: 'W01' })).toContain('F1 exige localização conferida e revisor');
    expect(problemasDaEvidencia({ ...base, nivel: 'F1', obraId: 'W01', localizacao: 'Livro VI', revisor: 'Revisor' })).toEqual([]);
    expect(problemasDaEvidencia({ ...base, obraId: 'W999' })).toContain('obra inexistente no catálogo');
    expect(problemasDaEvidencia({ ...base, relacaoId: 'TV-inexistente' })).toContain('relação inexistente');
  });

  it('relação sem fonte não aparece como validada', () => {
    expect(thinkerVirtues.every((r) => validacaoTemFonte(r))).toBe(true);
    const validada: ThinkerVirtue = { ...relacao, status: 'validada' };
    expect(validacaoTemFonte(validada, [])).toBe(false);
    const semLocal: EvidenciaRelacao = { ...base, status: 'validada', nivel: 'F2', obraId: 'W01', revisor: 'R', dataRevisao: '2026-11-23' };
    expect(validacaoTemFonte(validada, [semLocal])).toBe(false);
    expect(validacaoTemFonte(validada, [{ ...semLocal, localizacao: 'Livro VI' }])).toBe(true);
    expect(problemasDaEvidencia({ ...semLocal, localizacao: 'Livro VI', nivel: 'F4' })).toContain('validada sem nível F1–F3');
  });

  it('relação suspensa, rejeitada ou com evidência F4 não fundamenta perspectiva', () => {
    expect(relacaoUtilizavel({ ...relacao, status: 'suspensa' })).toBe(false);
    expect(relacaoUtilizavel({ ...relacao, status: 'rejeitada' })).toBe(false);
    expect(relacaoUtilizavel({ ...relacao, status: 'em_revisao' })).toBe(true);
    expect(relacaoUtilizavel(relacao, [{ ...base, nivel: 'F4' }])).toBe(false);
    expect(relacaoUtilizavel(relacao, [{ ...base, nivel: 'F3' }])).toBe(true);
  });
});

/* ------------------------------------------------------------------------- */
/* Regras da seleção com dados de teste                                       */
/* ------------------------------------------------------------------------- */

function pensador(id: string, name: string, tradition: string, workIds: string[] = ['W01']): Thinker {
  return {
    id, name, kind: 'pensador', council: true, period: '', tradition, field: `Campo de ${name}`, concepts: [], question: 'Pergunta?',
    questionSource: 'aplicacao', limits: '', priorityVirtueIds: [], workIds, status: 'proposta',
  };
}
function rel(thinkerId: string, virtueId: string, priority: number | null = 1, status: ThinkerVirtue['status'] = 'proposta'): ThinkerVirtue {
  return { id: `TV-${virtueId}-${thinkerId}`, thinkerId, virtueId, relationType: null, priority, sources: [], justification: 'teste', workIds: [], status };
}
function contexto(parcial: Partial<ContextoSelecao>): ContextoSelecao {
  return { membros: [], relacoes: [], casos: [], evidencias: [], pares: new Map(), ...parcial };
}
const ids = (ctx: ContextoSelecao, virtueIds: string[], max?: number, politica?: PoliticaSelecao) =>
  selecionarPerspectivas(ctx, { caseIds: [], virtueIds, dimensionIds: [] }, max, politica).map((s) => s.thinker.id);

describe('seleção: regras de elegibilidade e equilíbrio', () => {
  it('é determinística e fica entre 2 e 5 perspectivas quando há fundamentação', () => {
    for (const v of virtues) {
      const entrada = { caseIds: [], virtueIds: [v.id], dimensionIds: [] };
      const a = selectThinkers(entrada).map((s) => s.thinker.id);
      expect(selectThinkers(entrada).map((s) => s.thinker.id)).toEqual(a);
      expect(a.length).toBeLessThanOrEqual(MAX_THINKERS);
    }
    for (const c of councilCases) {
      const n = selectThinkers({ caseIds: [c.id], virtueIds: c.virtueIds, dimensionIds: c.dimensionIds }).length;
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(MAX_THINKERS);
    }
  });

  it('quem tem muitas relações cadastradas não ganha pontos por isso', () => {
    const muitas = pensador('muitas', 'Zeta', 'Tradição A');
    const poucas = pensador('poucas', 'Alfa', 'Tradição B');
    const relacoes = [rel('poucas', 'V01'), rel('muitas', 'V01'), ...virtues.slice(1, 30).map((v) => rel('muitas', v.id))];
    const ctx = contexto({ membros: [muitas, poucas], relacoes });
    /* Mesma força na virtude pedida nas duas políticas: as 29 relações a mais não pontuam. */
    for (const politica of [POLITICA_V1, POLITICA_V2]) {
      const r = deliberarSelecao(ctx, { caseIds: [], virtueIds: ['V01'], dimensionIds: [] }, undefined, politica);
      const [m, p] = ['muitas', 'poucas'].map((id) => r.detalhes.find((d) => d.thinkerId === id)!);
      expect(m.criterios.relacaoVirtudes).toBe(p.criterios.relacaoVirtudes);
      expect(m.criterios.fontes).toBe(p.criterios.fontes);
    }
    /* O empate é decidido pelo nome na v1 e pelo thinker_id na v2 (Documento 13, seção 7.3). */
    expect(ids(ctx, ['V01'], undefined, POLITICA_V1)).toEqual(['poucas', 'muitas']);
    expect(ids(ctx, ['V01'], undefined, POLITICA_V2)).toEqual(['muitas', 'poucas']);
  });

  it('relações suspensas, rejeitadas ou F4 não convocam ninguém', () => {
    const a = pensador('a', 'A', 'T1');
    const b = pensador('b', 'B', 'T2');
    const c = pensador('c', 'C', 'T3');
    const relacoes = [rel('a', 'V01', 1, 'suspensa'), rel('b', 'V01', 1, 'rejeitada'), rel('c', 'V01')];
    const f4: EvidenciaRelacao = {
      id: 'EV-f4', relacaoId: 'TV-V01-c', localizacao: 'a confirmar', justificativa: 'x', tipoRelacao: 'interpretacao-curatorial', nivel: 'F4', status: 'proposta',
    };
    expect(ids(contexto({ membros: [a, b, c], relacoes }), ['V01'])).toEqual(['c']);
    expect(ids(contexto({ membros: [a, b, c], relacoes, evidencias: [f4] }), ['V01'])).toEqual([]);
  });

  it('candidato fora da lista de membros nunca é convocado, mesmo com relação forte', () => {
    const membro = pensador('membro', 'Membro', 'T1');
    const ctx = contexto({ membros: [membro], relacoes: [rel('membro', 'V01'), rel('candidato', 'V01')] });
    expect(ids(ctx, ['V01'])).toEqual(['membro']);
  });

  it('tradição e autor nomeado não entram juntos como vozes independentes', () => {
    const tradicao: Thinker = { ...pensador('estoicismo-teste', 'Estoicismo', 'Estoicismo'), kind: 'tradicao' };
    const autor = pensador('seneca-teste', 'Sêneca', 'Estoicismo');
    const outro = pensador('outro', 'Outro', 'Outra tradição');
    const relacoes = [rel('estoicismo-teste', 'V07'), rel('seneca-teste', 'V07'), rel('outro', 'V07', 2)];
    const pares = new Map([['estoicismo-teste', new Set(['seneca-teste'])], ['seneca-teste', new Set(['estoicismo-teste'])]]);
    /* v1 (legado): a tradição disputa vaga; o par impede tradição e autor juntos. */
    const sem = ids(contexto({ membros: [tradicao, autor, outro], relacoes }), ['V07'], undefined, POLITICA_V1);
    const com = ids(contexto({ membros: [tradicao, autor, outro], relacoes, pares }), ['V07'], undefined, POLITICA_V1);
    expect(sem).toHaveLength(3);
    expect(com).toHaveLength(2);
    expect(com.filter((id) => id === 'estoicismo-teste' || id === 'seneca-teste')).toHaveLength(1);
    expect(com).toContain('outro');
    /* v2 (DEC-CUR-02): a tradição nunca ocupa vaga, com ou sem par; o autor continua convocável. */
    for (const ctx of [contexto({ membros: [tradicao, autor, outro], relacoes }), contexto({ membros: [tradicao, autor, outro], relacoes, pares })]) {
      expect(ids(ctx, ['V07'], undefined, POLITICA_V2).sort()).toEqual(['outro', 'seneca-teste']);
    }
  });

  it('a complementaridade favorece tradição ainda não representada, sem dispensar a pertinência', () => {
    const a1 = pensador('a1', 'A1', 'Tradição A');
    const a2 = pensador('a2', 'A2', 'Tradição A');
    const b1 = pensador('b1', 'B1', 'Tradição B');
    const semRelacao = pensador('c1', 'C1', 'Tradição C');
    const relacoes = [rel('a1', 'V01', 1), rel('a2', 'V01', 1), rel('b1', 'V01', 2)];
    const escolha = ids(contexto({ membros: [a1, a2, b1, semRelacao], relacoes }), ['V01'], 2);
    expect(escolha).toEqual(['a1', 'b1']);
    expect(ids(contexto({ membros: [a1, a2, b1, semRelacao], relacoes }), ['V01'])).not.toContain('c1');
  });

  it('sem fundamentação suficiente, informa a limitação em vez de improvisar', () => {
    const vazio = { caseIds: [], virtueIds: [], dimensionIds: ['DIM01'] };
    expect(selectThinkers(vazio)).toEqual([]);
    expect(synthesize([], vazio).limitation).toMatch(/não tem fundamentação suficiente/);
  });

  it('divergências entre tradições continuam visíveis na síntese', () => {
    const caso = councilCases[0];
    const entrada = { caseIds: [caso.id], virtueIds: caso.virtueIds, dimensionIds: caso.dimensionIds };
    const s = synthesize(selectThinkers(entrada), entrada);
    expect(s.divergences.length).toBeGreaterThan(0);
    expect(s.divergences.some((d) => d.includes('tradições distintas'))).toBe(true);
  });
});
