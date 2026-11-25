/* DH-T-01 (alternativa A): notas curatoriais sobre a forma de transmissão do pensamento, em `classificacao.nota`, para
 * Sócrates, Confúcio, Lao-Tsé e Epicteto. Os tipos continuam como estavam; a nota é informativa e não entra na seleção. */
import { describe, expect, it } from 'vitest';
import { thinkers } from '../../src/domain/catalog';
import { candidatos, classificacoes, entradasDoAcervo, getClassificacao, papelDoRegistro, universoPrincipal } from '../../src/domain/curadoria';

const IDS = ['socrates', 'confucio', 'lao-tse', 'epicteto'] as const;
const nota = (id: string) => getClassificacao(id)?.nota ?? '';

/** Tipo e universos de cada um dos quatro, como estavam antes da DH-T-01. */
const ANTES = {
  socrates: { tipo: 'pensador-individual', universos: ['filosofia-etica'] },
  confucio: { tipo: 'pensador-individual', universos: ['filosofia-etica', 'tradicoes-espirituais'] },
  'lao-tse': { tipo: 'pensador-individual', universos: ['filosofia-etica', 'tradicoes-espirituais'] },
  epicteto: { tipo: 'pensador-individual', universos: ['filosofia-etica'] },
};

describe('DH-T-01: notas de transmissão dos quatro habilitados', () => {
  it('cada um dos quatro tem nota própria, diferente das dos outros', () => {
    for (const id of IDS) expect(nota(id).length, id).toBeGreaterThan(60);
    expect(new Set(IDS.map(nota)).size).toBe(4);
    // Situações históricas diferentes não viram um texto homogêneo: nenhuma frase é repetida entre as notas.
    const frases = IDS.flatMap((id) => nota(id).split(/(?<=\.)\s+/));
    expect(new Set(frases).size).toBe(frases.length);
  });

  it('cada nota descreve a forma de transmissão específica da pessoa', () => {
    expect(nota('socrates')).toMatch(/sem corpus autoral próprio conhecido/);
    expect(nota('socrates')).toMatch(/testemunhos e representações produzidos por terceiros/);
    expect(nota('confucio')).toMatch(/Analectos \(Lunyu\)/);
    expect(nota('confucio')).toMatch(/discípulos de primeira e segunda geração/);
    expect(nota('lao-tse')).toMatch(/Tao Te Ching \(Dao De Jing\)/);
    expect(nota('lao-tse')).toMatch(/formação compósita/);
    expect(nota('lao-tse')).toMatch(/debate acadêmico/);
    expect(nota('epicteto')).toMatch(/Arriano/);
    expect(nota('epicteto')).toMatch(/Discursos e no Encheirídion/);
    expect(nota('epicteto')).toMatch(/distinguida de autoria direta/);
    expect(nota('epicteto')).toMatch(/divergência acadêmica/);
  });

  it('nenhuma nota nega a existência, declara obra apócrifa ou afirma consenso onde a auditoria registra controvérsia', () => {
    for (const id of IDS) {
      expect(nota(id), id).not.toMatch(/n[ãa]o existiu|nunca existiu|fict[íi]ci|lend[áa]ri|ap[óo]crif|falsific|consenso|unanim|comprovad/i);
    }
  });

  it('só a nota de Sócrates diz "sem corpus autoral próprio"; as outras três descrevem situações distintas (compilação, texto compósito, registro por discípulo)', () => {
    expect(nota('lao-tse')).not.toMatch(/sem corpus autoral/);
    expect(nota('confucio')).not.toMatch(/sem corpus autoral/);
    expect(nota('epicteto')).not.toMatch(/sem corpus autoral/);
  });
});

describe('DH-T-01: o que não mudou', () => {
  it('tipo e universos dos quatro são os de antes (alternativa A: manter os tipos atuais)', () => {
    for (const id of IDS) {
      const c = getClassificacao(id)!;
      expect({ tipo: c.tipo, universos: c.universos }, id).toEqual(ANTES[id]);
    }
  });

  it('elegibilidade e papel dos quatro no Conselho seguem iguais: voz individual, habilitado, convocável', () => {
    for (const id of IDS) {
      const t = thinkers.find((x) => x.id === id)!;
      expect(t.council, id).toBe(true);
      expect(papelDoRegistro(t), id).toBe('individual_voice');
      const entrada = entradasDoAcervo().find((e) => e.id === id)!;
      expect(entrada.convocavel, id).toBe(true);
      expect(universoPrincipal(id), id).toBe(ANTES[id].universos[0]);
    }
  });

  it('as notas existem em 15 registros: os 8 casos híbridos, os 4 desta decisão e os 3 agregados temáticos legados da DH-T-02, e em nenhum outro', () => {
    const comNota = classificacoes.filter((c) => c.nota).map((c) => c.id).sort();
    expect(comNota).toEqual(
      [
        'benjamin-franklin', 'confucio', 'dalai-lama', 'epicteto', 'karl-popper', 'lao-tse', 'musashi', 'peter-drucker', 'richard-feynman', 'simone-weil', 'socrates', 'tradicoes-budistas',
        // DH-T-02: agregados temáticos legados (não são pessoas; a nota diz que não são tradições específicas).
        'tradicoes-contemplativas', 'tradicoes-humanistas', 'tradicoes-religiosas',
      ].sort(),
    );
    expect(classificacoes).toHaveLength(42);
  });

  it('a nota não participa da seleção: o motor de seleção não a menciona e só lê o primeiro universo da classificação', async () => {
    const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (p: URL, e: string) => string };
    const motor = readFileSync(new URL('../../src/domain/council.ts', import.meta.url), 'utf8');
    expect(motor).not.toMatch(/\bnota\b/);
    expect(motor).not.toMatch(/getClassificacao|classificacoes/);
    expect(motor).toMatch(/universoPrincipal/);
  });
});

describe('DH-T-01: fora do escopo (nada foi criado nem alterado)', () => {
  const candidato = (id: string) => candidatos.find((c) => c.id === id)!;

  it('Mêncio e Hillel (candidatos) não ganharam campo de nota nem mudaram de tipo: seguem pendentes da DH-L-11', () => {
    for (const id of ['mencio', 'hillel']) {
      const c = candidato(id);
      expect(c, id).toBeDefined();
      expect(c.tipo, id).toBe('pensador-individual');
      expect(c.habilitado, id).toBe(false);
      expect(Object.keys(c), id).not.toContain('nota');
    }
  });

  it('nenhum candidato ganhou campo de nota', () => {
    expect(candidatos.some((c) => 'nota' in c)).toBe(false);
  });

  it('Tiruvalluvar segue voz literária e artística; Kopenawa segue pensador individual, sem nota de ausência de corpus', () => {
    expect(candidato('tiruvalluvar').tipo).toBe('voz-literaria-artistica');
    expect(candidato('davi-kopenawa').tipo).toBe('pensador-individual');
    expect(getClassificacao('tiruvalluvar')).toBeUndefined();
    expect(getClassificacao('davi-kopenawa')).toBeUndefined();
  });
});
