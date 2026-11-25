/* DH-T-03: revisão de referências bibliográficas e classificação budista.
 * Só dois campos de texto mudam: `conflito` do corpus da Gita (curadoria/tradicoes.json) e `nota` de `tradicoes-budistas`
 * (curadoria/classificacao.json). W11, W12, IDs, relações, pesos, critérios, política e snapshots seguem como estavam. */
import { describe, expect, it } from 'vitest';
import { thinkers, thinkerVirtues, works } from '../../src/domain/catalog';
import { getClassificacao, papelDoRegistro, tradicoes, universoPrincipal } from '../../src/domain/curadoria';

const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (caminho: URL, codificacao: string) => string };
const arquivo = (nome: string) => readFileSync(new URL(`../../src/data/curadoria/${nome}`, import.meta.url), 'utf8');
const lista = (bruto: string): Record<string, unknown>[] => {
  const o = JSON.parse(bruto) as unknown;
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

const corpusGita = () => tradicoes.find((t) => t.id === 'corpus-bhagavad-gita')!;
const budistas = () => thinkers.find((t) => t.id === 'tradicoes-budistas')!;
const nota = () => getClassificacao('tradicoes-budistas')?.nota ?? '';
const conflito = () => corpusGita().conflito ?? '';

describe('DH-T-03: só dois campos de texto mudaram (impressões digitais de tudo o mais, medidas na main antes da DH-T-03)', () => {
  const tradicoesJson = lista(arquivo('tradicoes.json'));
  const classificacaoJson = lista(arquivo('classificacao.json'));

  it('curadoria/tradicoes.json: os outros 13 recortes e todos os campos do corpus da Gita, menos o conflito, são idênticos ao que eram', () => {
    expect(tradicoesJson).toHaveLength(14);
    expect(impressao(tradicoesJson.filter((t) => t.id !== 'corpus-bhagavad-gita'))).toBe('f2234a59');
    const { conflito: _conflito, ...semConflito } = tradicoesJson.find((t) => t.id === 'corpus-bhagavad-gita')!;
    expect(impressao(semConflito)).toBe('617a7cb9');
  });

  it('curadoria/classificacao.json: as outras 40 entradas (fora budistas e Tomás) e todos os campos de tradicoes-budistas, menos a nota, são idênticos ao que eram', () => {
    expect(classificacaoJson).toHaveLength(42);
    // Exclui também tomas-de-aquino, cuja nota é da DH-T-04 (conferida no teste dela). Medido na main: 8998830e (era 'c2b460cd' só sem budistas, antes da integração).
    expect(impressao(classificacaoJson.filter((c) => c.id !== 'tradicoes-budistas' && c.id !== 'tomas-de-aquino'))).toBe('8998830e');
    const { nota: _nota, ...semNota } = classificacaoJson.find((c) => c.id === 'tradicoes-budistas')!;
    expect(impressao(semNota)).toBe('a7f16487');
  });
});

describe('DH-T-03 (decisão 1): W11 preservada; a Gita integra o Mahābhārata, sem inventar autor', () => {
  it('W11 e o registro bhagavad-gita seguem como estavam (ID, título, fonte, ligação e papel)', () => {
    expect(works.find((w) => w.id === 'W11')).toEqual({ id: 'W11', thinkerId: 'bhagavad-gita', title: 'Bhagavad Gita', source: 'Referências dos Documentos 03 e 04' });
    const gita = thinkers.find((t) => t.id === 'bhagavad-gita')!;
    expect(gita.council).toBe(false);
    expect(gita.workIds).toEqual(['W11']);
    expect(getClassificacao('bhagavad-gita')?.nota).toBeUndefined();
  });

  it('escopo e cuidado, transcritos do Documento 14, e a edição/tradução "a confirmar" não foram tocados', () => {
    const c = corpusGita();
    expect(c.escopo).toBe('Obra/corpus independente, com edição e tradução próprias');
    expect(c.cuidado).toBe('Edição e tradução usadas no módulo de leitura do app ainda não registradas: a confirmar antes de qualquer validação');
    expect(c.edicaoTraducao).toBe('a confirmar');
    expect(c.obras).toEqual(['W11']);
    expect(c.parteDe).toBe('tradicao-hinduismo');
  });

  it('o ponto em aberto diz que o texto integra o Mahābhārata (sexto livro), cita a fonte, preserva W11 e a edição pendente', () => {
    expect(conflito()).toMatch(/Mahābhārata/);
    expect(conflito()).toMatch(/sexto livro/);
    expect(conflito()).toMatch(/Internet Encyclopedia of Philosophy/);
    expect(conflito()).toMatch(/W11/);
    expect(conflito()).toMatch(/'a confirmar'/);
  });

  it('não inventa autor individual nem afirma autoria coletiva, que a fonte consultada não estabelece', () => {
    expect(conflito()).toMatch(/não atribui a ele um autor individual/);
    expect(conflito()).not.toMatch(/Vy[āa]sa|coletiv|composit|compósit|apócrif|consenso|comprovad/i);
  });
});

describe('DH-T-03 (decisões 2 e 4): W12 como rubrica bibliográfica e nota sobre a composição do campo budista', () => {
  it('W12 segue com o mesmo ID, título, fonte e ligação, e continua citada pelas mesmas 11 relações', () => {
    expect(works.find((w) => w.id === 'W12')).toEqual({ id: 'W12', thinkerId: 'tradicoes-budistas', title: 'Textos budistas sobre as Paramitas', source: 'Referências dos Documentos 03 e 04' });
    expect(budistas().workIds).toEqual(['W12']);
    const relacoes = thinkerVirtues.filter((r) => r.thinkerId === 'tradicoes-budistas');
    expect(relacoes.map((r) => r.virtueId)).toEqual(['V04', 'V07', 'V08', 'V11', 'V14', 'V17', 'V24', 'V26', 'V27', 'V28', 'V29']);
    expect(relacoes.every((r) => r.workIds.length === 1 && r.workIds[0] === 'W12')).toBe(true);
    expect(relacoes.every((r) => r.status === 'proposta')).toBe(true);
  });

  it('field, limits e pergunta de tradicoes-budistas ficam intactos (estão no snapshot de referência)', () => {
    expect(budistas().field).toBe('Aperfeiçoamento da conduta: generosidade, conduta ética, paciência, esforço diligente, concentração, sabedoria, benevolência e equanimidade');
    expect(budistas().limits).toBe('Reúnem escolas e listas diferentes de qualidades e perfeições; não formam uma doutrina única.');
    expect(budistas().question).toBe('O que nesta reação nasce de apego ou de aversão?');
    expect(budistas().council).toBe(true);
  });

  it('a nota mantém a frase da DEC-CUR-02 que já existia', () => {
    expect(nota().startsWith('Corpus de apoio (DEC-CUR-02): não ocupa vaga como voz individual; mantém council: true legado no catálogo.')).toBe(true);
  });

  it('a nota explica a composição da lista: seis pāramitās Mahāyāna + benevolência e equanimidade (Theravāda e brahmavihāras)', () => {
    expect(nota()).toMatch(/seis perfeições \(pāramitās\) Mahāyāna/);
    for (const termo of ['generosidade', 'conduta ética', 'paciência', 'esforço', 'concentração', 'sabedoria']) expect(nota(), termo).toContain(termo);
    expect(nota()).toMatch(/benevolência e equanimidade/);
    expect(nota()).toMatch(/dez perfeições \(pāramī\) da tradição Theravāda/);
    expect(nota()).toMatch(/quatro brahmavihāras/);
  });

  it('a nota diz que W12 é uma rubrica dos Documentos 03 e 04, não uma obra identificada, e não a substitui por uma obra', () => {
    expect(nota()).toMatch(/\(W12\) é uma rubrica bibliográfica dos Documentos 03 e 04, não uma obra identificada/);
    expect(nota()).toMatch(/revisão das relações/);
    expect(nota()).not.toMatch(/Bodhic|Śāntideva|Shantideva|Cariy|Buddhava|Dhammap/i);
  });
});

describe('DH-T-03: a seleção permanece estável', () => {
  it('as duas páginas seguem com o mesmo papel e o mesmo universo principal (nada do que o motor lê mudou)', () => {
    expect(papelDoRegistro(budistas())).toBe('contextual_corpus');
    expect(universoPrincipal('tradicoes-budistas')).toBe('tradicoes-espirituais');
    expect(getClassificacao('tradicoes-budistas')?.tipo).toBe('tradicao-corpus');
    expect(universoPrincipal('bhagavad-gita')).toBe(getClassificacao('bhagavad-gita')?.universos[0]);
  });

  it('o motor de seleção não lê `nota` nem `conflito`, e continua lendo só o primeiro universo da classificação', () => {
    const motor = readFileSync(new URL('../../src/domain/council.ts', import.meta.url), 'utf8');
    expect(motor).not.toMatch(/\bnota\b/);
    expect(motor).not.toMatch(/conflito/);
    expect(motor).not.toMatch(/getClassificacao|classificacoes|tradicoes/);
    expect(motor).toMatch(/universoPrincipal/);
  });

  it('W11 e W12 não ganharam campo novo (a impressão de works.json, em curadoria-conselho.test.ts, segue a de antes)', () => {
    for (const w of works.filter((x) => ['W11', 'W12'].includes(x.id))) expect(Object.keys(w).sort()).toEqual(['id', 'source', 'thinkerId', 'title']);
  });
});
