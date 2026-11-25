/* DH-T-04: identidade bibliográfica de W08 ("Tratado das Virtudes").
 * Dois campos de texto mudam: o título de W08 (works.json) e a nota de Tomás de Aquino (curadoria/classificacao.json).
 * W08 não é removida, as dez relações não mudam, e a duplicidade W07/W08 segue como decisão da revisão geral das relações. */
import { describe, expect, it } from 'vitest';
import { getWork, thinkers, thinkerVirtues, works } from '../../src/domain/catalog';
import { getClassificacao, papelDoRegistro, universoPrincipal } from '../../src/domain/curadoria';

const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (caminho: URL, codificacao: string) => string };
const lista = (caminho: string): Record<string, unknown>[] => {
  const o = JSON.parse(readFileSync(new URL(caminho, import.meta.url), 'utf8')) as unknown;
  return (Array.isArray(o) ? o : Object.values(o as object).find(Array.isArray)) as Record<string, unknown>[];
};

/** FNV-1a, a mesma impressão digital dos outros testes de curadoria. */
const impressao = (valor: unknown) => {
  const s = JSON.stringify(valor);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
};

const TITULO = 'Tratado das Virtudes (Suma Teológica, I-II, qq. 49–67)';
const NOTA =
  'W08 corresponde ao título editorial Treatise on the Virtues, associado à Suma Teológica, I-II, questões 49–67. Não deve ser interpretado como obra autônoma distinta da Suma Teológica. A identificação decorre da correspondência bibliográfica entre o título e o conteúdo do volume, não de confirmação explícita da intenção do Documento 03.';
const tomas = () => thinkers.find((t) => t.id === 'tomas-de-aquino')!;
const relacoesW08 = () => thinkerVirtues.filter((r) => r.workIds.includes('W08'));

describe('DH-T-04: só dois campos de texto mudaram (impressões digitais de tudo o mais, medidas na main antes da DH-T-04)', () => {
  const obras = lista('../../src/data/works.json');
  const classificacao = lista('../../src/data/curadoria/classificacao.json');

  it('works.json: as outras 20 obras e todos os campos de W08, menos o título, são idênticos ao que eram', () => {
    expect(obras).toHaveLength(21);
    expect(impressao(obras.filter((w) => w.id !== 'W08'))).toBe('a9e27899');
    const { title: _title, ...semTitulo } = obras.find((w) => w.id === 'W08')!;
    expect(impressao(semTitulo)).toBe('a6a05803');
  });

  it('classificacao.json: as outras 40 entradas (fora Tomás e budistas) e todos os campos de Tomás de Aquino, menos a nota, são idênticos ao que eram', () => {
    expect(classificacao).toHaveLength(42);
    // Exclui também tradicoes-budistas, cuja nota é da DH-T-03 (conferida no teste dela). Medido na main: 8998830e (era '992711de' só sem Tomás, antes da integração).
    expect(impressao(classificacao.filter((c) => c.id !== 'tomas-de-aquino' && c.id !== 'tradicoes-budistas'))).toBe('8998830e');
    const { nota: _nota, ...semNota } = classificacao.find((c) => c.id === 'tomas-de-aquino')!;
    expect(impressao(semNota)).toBe('1110a5e0');
  });
});

describe('DH-T-04: W08 complementada, não removida', () => {
  it('o título de W08 ganha a localização na Suma e mantém o título original no início; ID, autor e fonte seguem iguais', () => {
    expect(getWork('W08')).toEqual({ id: 'W08', thinkerId: 'tomas-de-aquino', title: TITULO, source: 'Referências dos Documentos 03 e 04' });
    expect(TITULO.startsWith('Tratado das Virtudes')).toBe(true);
  });

  it('W07 continua como estava, e Tomás de Aquino segue ligado às duas obras', () => {
    expect(getWork('W07')).toEqual({ id: 'W07', thinkerId: 'tomas-de-aquino', title: 'Suma Teológica', source: 'Referências dos Documentos 03 e 04' });
    expect(tomas().workIds).toEqual(['W07', 'W08']);
    expect(works.filter((w) => w.thinkerId === 'tomas-de-aquino').map((w) => w.id)).toEqual(['W07', 'W08']);
  });

  it('as dez relações seguem citando W07 e W08 juntas, com a mesma justificativa e o mesmo status (a duplicidade não foi decidida aqui)', () => {
    const r = relacoesW08();
    expect(r.map((x) => x.virtueId)).toEqual(['V01', 'V03', 'V06', 'V13', 'V18', 'V22', 'V39', 'V44', 'V45', 'V46']);
    expect(r.every((x) => x.thinkerId === 'tomas-de-aquino')).toBe(true);
    expect(r.every((x) => JSON.stringify(x.workIds) === JSON.stringify(['W07', 'W08']))).toBe(true);
    expect(r.every((x) => x.justification === 'Campo de contribuição registrado no Documento 04: virtudes cardeais e teologais.')).toBe(true);
    expect(r.every((x) => x.status === 'proposta')).toBe(true);
  });
});

describe('DH-T-04: a nota registra a identificação e declara seu limite', () => {
  const nota = () => getClassificacao('tomas-de-aquino')?.nota ?? '';

  it('o texto da nota é o aprovado, sem acréscimos', () => {
    expect(nota()).toBe(NOTA);
  });

  it('diz que W08 é título editorial ligado à Suma, I-II, qq. 49–67, e não obra autônoma', () => {
    expect(nota()).toMatch(/título editorial Treatise on the Virtues/);
    expect(nota()).toMatch(/Suma Teológica, I-II, questões 49–67/);
    expect(nota()).toMatch(/Não deve ser interpretado como obra autônoma distinta da Suma Teológica/);
  });

  it('declara que a identificação é inferência bibliográfica, não confirmação da intenção do Documento 03', () => {
    expect(nota()).toMatch(/decorre da correspondência bibliográfica/);
    expect(nota()).toMatch(/não de confirmação explícita da intenção do Documento 03/);
  });

  it('não adota a hipótese alternativa (Quaestiones disputatae) nem afirma validação das relações', () => {
    expect(nota()).not.toMatch(/disputa|De virtutibus|Quaestiones/i);
    expect(nota()).not.toMatch(/valida|confirmad|comprovad|consenso/i);
  });

  it('tipo, universos, papel e universo principal de Tomás de Aquino seguem como estavam', () => {
    const c = getClassificacao('tomas-de-aquino')!;
    expect(c.tipo).toBe('pensador-individual');
    expect(c.universos).toEqual(['filosofia-etica', 'tradicoes-espirituais']);
    expect(papelDoRegistro(tomas())).toBe('individual_voice');
    expect(tomas().council).toBe(true);
    expect(universoPrincipal('tomas-de-aquino')).toBe('filosofia-etica');
  });
});

describe('DH-T-04: a seleção permanece estável', () => {
  it('o motor de seleção não lê `nota` nem o título das obras', () => {
    const motor = readFileSync(new URL('../../src/domain/council.ts', import.meta.url), 'utf8');
    expect(motor).not.toMatch(/\bnota\b/);
    expect(motor).not.toMatch(/getWork|worksOfThinker|\bworks\b/); // o motor só usa `workIds` (IDs); o `.title` que ele cita é o do caso de referência
    expect(motor).toMatch(/workIds: thinker\.workIds/);
    expect(motor).not.toMatch(/getClassificacao|classificacoes/);
  });

  it('a contribuição de Tomás de Aquino carrega os IDs W07 e W08 (os snapshots pinam IDs, não o título)', () => {
    expect(tomas().workIds).toEqual(['W07', 'W08']);
    expect(JSON.stringify(thinkerVirtues)).not.toContain('Tratado das Virtudes');
  });
});
