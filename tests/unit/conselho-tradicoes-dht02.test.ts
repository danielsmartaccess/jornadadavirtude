/* DH-T-02: clareza no catálogo de tradições. Quatro pares de registros semelhantes ficam separados e com as remissões;
 * três agregados temáticos legados ganham nota; dois agregados culturais amplos ficam como estavam (só auditoria);
 * o campo `conflito` de Budismos reflete a DEC-CUR-02. Nenhum ID, relação ou regra de seleção muda. */
import { describe, expect, it } from 'vitest';
import { thinkers, thinkerVirtues } from '../../src/domain/catalog';
import { classificacoes, getClassificacao, paresNaoIndependentes, tradicoes } from '../../src/domain/curadoria';

/** [registro do catálogo (thinkers.json), recorte curatorial (tradicoes.json)] */
const PARES: [string, string][] = [
  ['estoicismo', 'tradicao-estoicismo'],
  ['bhagavad-gita', 'corpus-bhagavad-gita'],
  ['tradicoes-budistas', 'tradicao-budismos'],
  ['tradicoes-cristas', 'tradicao-cristianismos'],
];
const AGREGADOS_LEGADOS = ['tradicoes-humanistas', 'tradicoes-religiosas', 'tradicoes-contemplativas'];
const NOTA_AGREGADO =
  'Agregado temático legado, sem escopo conceitual suficientemente delimitado para ser tratado como uma tradição específica. Registro legado preservado nesta etapa, incluindo suas relações, sem que isso represente validação de seu escopo como tradição específica.';
const tradicao = (id: string) => tradicoes.find((t) => t.id === id)!;
const registro = (id: string) => thinkers.find((t) => t.id === id)!;

describe('DH-T-02: os quatro pares continuam separados, com remissão nos dois sentidos', () => {
  it('os oito IDs existem, cada um no seu arquivo, e nenhum ID é compartilhado entre os dois conjuntos', () => {
    for (const [catalogo, recorte] of PARES) {
      expect(registro(catalogo), catalogo).toBeDefined();
      expect(tradicao(recorte), recorte).toBeDefined();
      expect(registro(recorte), `${recorte} não é registro do catálogo`).toBeUndefined();
      expect(tradicao(catalogo), `${catalogo} não é recorte curatorial`).toBeUndefined();
    }
  });

  it('remissão do recorte para o catálogo (TradicaoView) e do catálogo para o recorte (ThinkerPage), conforme o mapeamento', () => {
    for (const [catalogo, recorte] of PARES) {
      expect(tradicao(recorte).registrosNoCatalogo, recorte).toEqual([catalogo]);
      // O mesmo cálculo que a ThinkerPage faz para "Recorte curatorial".
      expect(tradicoes.filter((t) => t.registrosNoCatalogo.includes(catalogo)).map((t) => t.id), catalogo).toEqual([recorte]);
    }
  });

  it('só esses quatro recortes apontam para registros do catálogo (nenhuma remissão nova nem removida)', () => {
    const comRegistros = tradicoes.filter((t) => t.registrosNoCatalogo.length > 0).map((t) => t.id).sort();
    expect(comRegistros).toEqual(PARES.map(([, recorte]) => recorte).sort());
  });

  it('a função de cada lado está nos dados: o catálogo guarda as relações com virtudes; o recorte não tem nenhuma', () => {
    for (const [catalogo, recorte] of PARES) {
      expect(thinkerVirtues.filter((r) => r.thinkerId === catalogo).length, catalogo).toBeGreaterThan(0);
      expect(thinkerVirtues.filter((r) => r.thinkerId === recorte).length, recorte).toBe(0);
    }
    expect(thinkerVirtues.some((r) => tradicoes.some((t) => t.id === r.thinkerId))).toBe(false);
  });

  it('o tipo é o mesmo nos dois lados de cada par, e os dois lados são tradição, escola ou corpus (nunca pessoa)', () => {
    for (const [catalogo, recorte] of PARES) {
      expect(getClassificacao(catalogo)!.tipo, catalogo).toBe(tradicao(recorte).tipo);
      expect(registro(catalogo).kind, catalogo).toBe('tradicao');
    }
  });

  it('as 189 relações seguem todas "proposta" e os flags council não mudaram (só Tradições budistas é council:true entre os pares)', () => {
    expect(thinkerVirtues).toHaveLength(189);
    expect(thinkerVirtues.every((r) => r.status === 'proposta')).toBe(true);
    expect(PARES.filter(([c]) => registro(c).council).map(([c]) => c)).toEqual(['tradicoes-budistas']);
    expect(thinkers.filter((t) => t.council)).toHaveLength(27);
  });
});

describe('DH-T-02: dependência funcional dos estoicos (registrosNoCatalogo × autoresRelacionados)', () => {
  it('o recorte do Estoicismo mantém o registro do catálogo e os três autores, exatamente como antes', () => {
    expect(tradicao('tradicao-estoicismo').registrosNoCatalogo).toEqual(['estoicismo']);
    expect([...tradicao('tradicao-estoicismo').autoresRelacionados].sort()).toEqual(['epicteto', 'marco-aurelio', 'seneca']);
  });

  it('o mecanismo de pares não independentes segue igual: Estoicismo × os três estoicos, nos dois sentidos, e mais nenhum par', () => {
    const pares = paresNaoIndependentes();
    expect([...(pares.get('estoicismo') ?? [])].sort()).toEqual(['epicteto', 'marco-aurelio', 'seneca']);
    for (const autor of ['epicteto', 'marco-aurelio', 'seneca']) expect([...(pares.get(autor) ?? [])]).toEqual(['estoicismo']);
    expect([...pares.keys()].sort()).toEqual(['epicteto', 'estoicismo', 'marco-aurelio', 'seneca']);
  });
});

describe('DH-T-02: os três agregados temáticos legados', () => {
  it('seguem disponíveis, com os mesmos tipo, universo, status e relações de antes, e não são tradições da curadoria', () => {
    const esperado: Record<string, { tipo: string; universo: string; relacoes: number }> = {
      'tradicoes-humanistas': { tipo: 'escola-corrente', universo: 'filosofia-etica', relacoes: 2 },
      'tradicoes-religiosas': { tipo: 'tradicao-corpus', universo: 'tradicoes-espirituais', relacoes: 1 },
      'tradicoes-contemplativas': { tipo: 'tradicao-corpus', universo: 'tradicoes-espirituais', relacoes: 1 },
    };
    for (const id of AGREGADOS_LEGADOS) {
      const t = registro(id);
      expect(t, id).toBeDefined();
      expect(t.kind, id).toBe('tradicao');
      expect(t.council, id).toBe(false);
      expect(t.status, id).toBe('proposta');
      expect(getClassificacao(id)!.tipo, id).toBe(esperado[id].tipo);
      expect(getClassificacao(id)!.universos, id).toEqual([esperado[id].universo]);
      expect(thinkerVirtues.filter((r) => r.thinkerId === id), id).toHaveLength(esperado[id].relacoes);
      expect(tradicao(id), `${id} não existe em tradicoes.json`).toBeUndefined();
    }
  });

  it('cada um tem a nota curatorial: agregado temático legado, sem escopo delimitado, não uma tradição específica', () => {
    for (const id of AGREGADOS_LEGADOS) {
      const nota = getClassificacao(id)?.nota ?? '';
      expect(nota, id).toBe(NOTA_AGREGADO);
      expect(nota, id).toMatch(/^Agregado temático legado/);
      expect(nota, id).toMatch(/sem escopo conceitual suficientemente delimitado/);
      expect(nota, id).toMatch(/tradição específica/);
      // Preservação por decisão curatorial, sem validar o escopo e sem alegar dependência técnica permanente.
      expect(nota, id).toMatch(/Registro legado preservado nesta etapa, incluindo suas relações/);
      expect(nota, id).toMatch(/sem que isso represente validação de seu escopo como tradição específica/);
      expect(nota, id).not.toMatch(/compatibilidade/);
      expect(nota, id).not.toMatch(/pensador|integrante|pessoa|convoca/i);
    }
  });

  it('nenhum outro registro de tradição do catálogo ganhou nota: só Tradições budistas (DEC-CUR-02) e os três agregados', () => {
    const comNota = thinkers.filter((t) => t.kind === 'tradicao' && getClassificacao(t.id)?.nota).map((t) => t.id).sort();
    expect(comNota).toEqual(['tradicoes-budistas', ...AGREGADOS_LEGADOS].sort());
  });

  it('as 42 classificações seguem com os mesmos IDs', () => {
    expect(classificacoes).toHaveLength(42);
  });
});

describe('DH-T-02: agregados culturais amplos ficam como estavam (só auditoria)', () => {
  it('Filosofias africanas e Pensamentos indígenas seguem separados, sem fusão, sem nota, sem autores nem registros ligados', () => {
    const africanas = tradicao('tradicao-filosofias-africanas');
    expect(africanas.nome).toBe('Filosofias africanas');
    expect(africanas.escopo).toBe('Debates Akan, Ubuntu e outras tradições identificadas');
    expect(africanas.cuidado).toBe('Não transformar África em tradição única');
    const indigenas = tradicao('tradicao-pensamentos-indigenas');
    expect(indigenas.nome).toBe('Pensamentos indígenas');
    expect(indigenas.escopo).toBe('Autores, povos e obras específicos');
    expect(indigenas.cuidado).toBe('Não homogeneizar povos indígenas');
    for (const t of [africanas, indigenas]) {
      expect(t.tipo, t.id).toBe('tradicao-corpus');
      expect(t.universos, t.id).toEqual(['filosofia-etica']);
      expect(t.autoresRelacionados, t.id).toEqual([]);
      expect(t.registrosNoCatalogo, t.id).toEqual([]);
      expect(Object.keys(t), t.id).not.toContain('conflito');
      expect(Object.keys(t), t.id).not.toContain('nota');
    }
  });

  it('o catálogo segue com 14 recortes da curadoria', () => {
    expect(tradicoes).toHaveLength(14);
  });
});

describe('DH-T-02: campo conflito de Budismos reflete a DEC-CUR-02', () => {
  const conflito = tradicao('tradicao-budismos').conflito ?? '';

  it('não afirma que tradições participam da seleção como indivíduos; diz que são fontes de apoio, não pessoas convocáveis', () => {
    expect(conflito).not.toMatch(/participa da seleção como os indivíduos/);
    expect(conflito).toMatch(/DEC-CUR-02/);
    expect(conflito).toMatch(/fontes de apoio e contextualização/);
    expect(conflito).toMatch(/não são pessoas convocáveis nem participantes individuais da seleção/);
    expect(conflito).toMatch(/não ocupam vaga entre as vozes do Conselho/);
  });

  it('preserva o conteúdo válido: o registro segue habilitado (council: true), o Documento 14 §8 e o ponto ainda em aberto', () => {
    expect(conflito).toMatch(/tradicoes-budistas/);
    expect(conflito).toMatch(/council: true/);
    expect(conflito).toMatch(/Documento 14 \(seção 8\)/);
    expect(conflito).toMatch(/D-04-02/);
    expect(registro('tradicoes-budistas').council).toBe(true);
  });

  it('é o único registro da curadoria com conflito, e o campo não é lido pelo motor de seleção', async () => {
    expect(tradicoes.filter((t) => 'conflito' in t).map((t) => t.id)).toEqual(['tradicao-budismos']);
    const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (p: URL, e: string) => string };
    const motor = readFileSync(new URL('../../src/domain/council.ts', import.meta.url), 'utf8');
    expect(motor).not.toMatch(/conflito/);
  });
});
