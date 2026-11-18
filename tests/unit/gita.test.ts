/* Módulo de leitura da Bhagavad Gita: estrutura fixa e sincronia com o seed do banco. */
import { describe, expect, it } from 'vitest';
import { capitulos, capituloAnterior, capituloSeguinte, dividirNoPrimeiroSubtitulo, etapas, getCapitulo, LIMITE_REFLEXAO, parseNumeroCapitulo, resultadoDoQuiz, splitTitulo, validarReflexao } from '../../src/domain/gita';
import { parseConteudoCapitulo } from '../../src/infrastructure/gitaContent';
import { paraRegistro } from '../../src/infrastructure/registrosGita';
import seed from '../../supabase/seed.sql?raw';

/** Seeds de conteúdo por capítulo (supabase/seeds/capitulo-NN.sql). Cada um que existir é validado;
 * se a pasta estiver vazia (conteúdo mantido fora do repositório), estes testes não têm o que checar. */
const seedsDeCapitulo: [string, string][] = Object.entries(import.meta.glob<string>('../../supabase/seeds/capitulo-*.sql', { query: '?raw', import: 'default', eager: true }));

/** Trecho do seed que insere em capitulos (as linhas de etapas têm o mesmo formato). */
const blocoCapitulos = seed.slice(seed.indexOf('insert into public.capitulos'), seed.indexOf('on conflict (numero)'));
/** Torna a string literal SQL ('') comparável com o texto original. */
const sqlLiteral = (s: string) => `'${s.replace(/'/g, "''")}'`;

describe('estrutura da leitura', () => {
  it('tem 18 capítulos numerados de 1 a 18, sem repetição', () => {
    expect(capitulos.map((c) => c.numero)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
    expect(new Set(capitulos.map((c) => c.titulo)).size).toBe(18);
    for (const c of capitulos) expect(c.titulo.trim()).not.toBe('');
  });

  it('tem seis etapas em ordem de 1 a 6, com nomes distintos', () => {
    expect(etapas.map((e) => e.ordem)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(etapas.map((e) => e.nome)).size).toBe(6);
  });
});

describe('rotas e navegação', () => {
  it('aceita só números inteiros de 1 a 18', () => {
    expect(parseNumeroCapitulo('1')).toBe(1);
    expect(parseNumeroCapitulo('18')).toBe(18);
    for (const ruim of [undefined, '', '0', '19', '-1', '1.5', '01x', 'abc', '001']) expect(parseNumeroCapitulo(ruim)).toBeNull();
  });

  it('anterior e seguinte respeitam as pontas', () => {
    expect(capituloAnterior(1)).toBeUndefined();
    expect(capituloSeguinte(18)).toBeUndefined();
    expect(capituloAnterior(2)?.numero).toBe(1);
    expect(capituloSeguinte(17)?.numero).toBe(18);
    expect(getCapitulo(99)).toBeUndefined();
  });

  it('separa o nome em sânscrito da tradução', () => {
    expect(splitTitulo('Karma Yoga — O yoga da ação')).toEqual({ sanscrito: 'Karma Yoga', traducao: 'O yoga da ação' });
    expect(splitTitulo('Sem separador')).toEqual({ sanscrito: '', traducao: 'Sem separador' });
  });
});

describe('sincronia com supabase/seed.sql', () => {
  it('os capítulos do seed são exatamente os do app (número e título)', () => {
    // Linhas do insert em capitulos: (N,  'Título')
    const doSeed = [...blocoCapitulos.matchAll(/^\s*\((\d+),\s+'((?:[^']|'')*)'\)[,\s]*$/gm)].map((m) => ({ numero: Number(m[1]), titulo: m[2].replace(/''/g, "'") }));
    expect(doSeed).toEqual(capitulos);
  });

  it('toda etapa do app está no seed com a mesma ordem e nome', () => {
    for (const e of etapas) expect(seed, `etapa ${e.ordem}`).toContain(`(${e.ordem}, ${sqlLiteral(e.nome)})`);
  });
});

describe('resultado do quiz de reflexão', () => {
  it('sem respostas não há resultado', () => {
    expect(resultadoDoQuiz([])).toBeNull();
  });

  it('a opção mais escolhida define a leitura, sem empate', () => {
    expect(resultadoDoQuiz(['A', 'A', 'B', 'A', 'C'])).toEqual({ contagem: { A: 3, B: 1, C: 1 }, vencedoras: ['A'], empate: false });
    expect(resultadoDoQuiz(['C', 'C', 'C', 'C', 'C'])?.vencedoras).toEqual(['C']);
  });

  it('em empate devolve todas as opções empatadas, em ordem alfabética', () => {
    expect(resultadoDoQuiz(['B', 'A', 'A', 'B', 'C'])).toEqual({ contagem: { B: 2, A: 2, C: 1 }, vencedoras: ['A', 'B'], empate: true });
    expect(resultadoDoQuiz(['A', 'B', 'C'])?.vencedoras).toEqual(['A', 'B', 'C']);
    expect(resultadoDoQuiz(['C', 'A'])?.empate).toBe(true);
  });

  it('não usa limiar: 2 de 5 já basta para vencer', () => {
    expect(resultadoDoQuiz(['A', 'A', 'B', 'C', 'C', 'B', 'B'])?.vencedoras).toEqual(['B']);
  });
});

describe.each(seedsDeCapitulo)('%s', (_arquivo, sql) => {
  it('não carrega HTML, CSS, JavaScript nem registros de usuário', () => {
    expect(sql).not.toMatch(/<\/?[a-z][^>]*>/i);
    expect(sql).not.toMatch(/style=|class=|<script|function\s*\(|=>/i);
    expect(sql).not.toMatch(/insert\s+into\s+public\.registros/i);
    expect(sql).not.toMatch(/auth\.users/i);
  });

  it('traz os nomes das seis etapas na ordem do app', () => {
    for (const e of etapas) expect(sql, `etapa ${e.ordem}`).toContain(`(${e.ordem}, ${sqlLiteral(e.nome)}, $md$`);
  });

  it('é idempotente: todo insert tem on conflict', () => {
    const inserts = sql.match(/^insert into /gm) ?? [];
    const upserts = sql.match(/^on conflict /gm) ?? [];
    expect(inserts.length).toBeGreaterThan(0);
    expect(upserts).toHaveLength(inserts.length);
  });
});

describe('dividirNoPrimeiroSubtitulo', () => {
  it('separa a introdução do restante no primeiro ###', () => {
    const md = ['## Título', '', 'Intro.', '', '### Reflexão aberta', '', 'Pergunta?'].join('\n');
    expect(dividirNoPrimeiroSubtitulo(md)).toEqual({ introducao: '## Título\n\nIntro.', resto: '### Reflexão aberta\n\nPergunta?' });
  });
  it('sem subtítulo, tudo é introdução', () => {
    expect(dividirNoPrimeiroSubtitulo('Só texto.')).toEqual({ introducao: 'Só texto.', resto: '' });
  });
  it('não confunde #### nem ### no meio da linha', () => {
    expect(dividirNoPrimeiroSubtitulo('a ### b\n#### c').resto).toBe('');
  });
});

describe('parseConteudoCapitulo (resposta da API)', () => {
  const resposta = [
    {
      numero: 14,
      etapas: [
        { id: 505, ordem: 5, nome: 'Reflexão', conteudo_md: '## x', perguntas: [{ ordem: 2, enunciado: 'P2', opcoes: [{ chave: 'B', texto: 'b' }, { chave: 'A', texto: 'a' }] }, { ordem: 1, enunciado: 'P1', opcoes: [] }], leituras: [{ chave: 'C', texto: 'c' }, { chave: 'A', texto: 'a' }] },
        { ordem: 1, nome: 'Contexto', conteudo_md: null, perguntas: [], leituras: [] },
        { ordem: 2, nome: 'Vazio', conteudo_md: '   ', perguntas: [], leituras: [] },
      ],
    },
  ];

  it('ordena etapas, perguntas, opções e leituras', () => {
    const r = parseConteudoCapitulo(resposta);
    expect(r.map((e) => e.ordem)).toEqual([1, 2, 5]);
    const reflexao = r[2];
    expect(reflexao.perguntas.map((p) => p.ordem)).toEqual([1, 2]);
    expect(reflexao.perguntas[1].opcoes.map((o) => o.chave)).toEqual(['A', 'B']);
    expect(reflexao.leituras.map((l) => l.chave)).toEqual(['A', 'C']);
  });

  it('texto nulo ou em branco vira null', () => {
    const r = parseConteudoCapitulo(resposta);
    expect(r[0].conteudoMd).toBeNull();
    expect(r[1].conteudoMd).toBeNull();
    expect(r[2].conteudoMd).toBe('## x');
  });

  it('tolera respostas malformadas sem lançar erro', () => {
    for (const ruim of [null, undefined, [], {}, 'x', 42, [{ etapas: 'x' }], [{ etapas: [{ ordem: 'a', nome: 1 }, null, 7] }]]) expect(parseConteudoCapitulo(ruim)).toEqual([]);
    expect(parseConteudoCapitulo([{ etapas: [{ ordem: 1, nome: 'ok', perguntas: [{ ordem: 'x' }, { enunciado: 1 }], leituras: [{ chave: 1 }] }] }])).toEqual([{ id: null, ordem: 1, nome: 'ok', conteudoMd: null, perguntas: [], leituras: [] }]);
  });
});

describe('id da etapa na resposta da API', () => {
  it('lê o id numérico e usa null quando ausente ou inválido', () => {
    const r = parseConteudoCapitulo([{ etapas: [{ id: 7, ordem: 1, nome: 'a' }, { id: '8', ordem: 2, nome: 'b' }, { ordem: 3, nome: 'c' }] }]);
    expect(r.map((e) => e.id)).toEqual([7, null, null]);
  });
});

describe('validarReflexao', () => {
  it('recusa texto vazio ou só com espaços', () => {
    const quebra = String.fromCharCode(10);
    const tab = String.fromCharCode(9);
    for (const vazio of ['', '   ', `${quebra}${tab} `]) expect(validarReflexao(vazio)).toEqual({ ok: false, erro: 'Escreva algo antes de guardar.' });
  });
  it('aceita e remove espaços nas pontas', () => {
    expect(validarReflexao(`  minha reflexão ${String.fromCharCode(10)}`)).toEqual({ ok: true, texto: 'minha reflexão' });
  });
  it('respeita o limite de caracteres', () => {
    expect(validarReflexao('a'.repeat(LIMITE_REFLEXAO)).ok).toBe(true);
    const longo = validarReflexao('a'.repeat(LIMITE_REFLEXAO + 1));
    expect(longo.ok).toBe(false);
  });
});

describe('paraRegistro (linha de registros)', () => {
  it('converte uma linha válida', () => {
    expect(paraRegistro({ id: 'u1', etapa_id: 5, texto: 't', criado_em: '2026-11-18T10:00:00Z' })).toEqual({ id: 'u1', etapaId: 5, texto: 't', criadoEm: '2026-11-18T10:00:00Z' });
  });
  it('descarta linhas malformadas', () => {
    for (const ruim of [null, undefined, 'x', 1, {}, { id: 'u', etapa_id: '5', texto: 't', criado_em: 'd' }, { id: 'u', etapa_id: 5, texto: 1, criado_em: 'd' }]) expect(paraRegistro(ruim)).toBeNull();
  });
});
