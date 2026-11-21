/* Disciplina do sistema visual: tamanhos de texto, larguras, espaçamento entre letras e cores vêm dos tokens de
 * src/styles/globals.css. Estes testes varrem o código e impedem a volta de valores soltos nas telas. */
import { describe, expect, it } from 'vitest';

// O Vitest entrega CSS importado como texto vazio, e o projeto não tem os tipos do Node: o módulo é carregado de
// forma dinâmica (o TypeScript aceita especificador não literal) para ler o arquivo-fonte direto do disco.
const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (caminho: URL, codificacao: string) => string };
const css = readFileSync(new URL('../../src/styles/globals.css', import.meta.url), 'utf8').replaceAll('\r\n', '\n');

const telas = import.meta.glob<string>('../../src/**/*.tsx', { query: '?raw', import: 'default', eager: true });
const arquivos = Object.entries(telas);

const achados = (padrao: RegExp) => arquivos.flatMap(([arq, texto]) => [...texto.matchAll(padrao)].map((m) => `${arq.replace('../../', '')}: ${m[0]}`));

describe('sistema visual: nada de valor solto nas telas', () => {
  it('há telas para varrer', () => {
    expect(arquivos.length).toBeGreaterThan(20);
  });

  it('tamanhos de texto vêm da escala (nada de text-[12px] ou text-[1.2rem])', () => {
    expect(achados(/\btext-\[[0-9.]+(px|rem|em)\]/g)).toEqual([]);
  });

  it('larguras de conteúdo e espaçamento entre letras vêm de tokens', () => {
    expect(achados(/\bmax-w-\[[^\]]+\]/g)).toEqual([]);
    expect(achados(/\btracking-\[[^\]]+\]/g)).toEqual([]);
  });

  it('cores vêm dos tokens: nenhum hexadecimal ou rgb() nas telas', () => {
    const cores = achados(/(?<![&\w-])#[0-9a-fA-F]{6}\b|(?<![&\w-])#[0-9a-fA-F]{3}\b(?![\w-])|\brgba?\(/g);
    // Âncoras (#conteudo, #etapa-1) não são cores: o padrão exige 3 ou 6 dígitos hexadecimais, sem letras depois.
    expect(cores.filter((c) => !/#(?:etapa|conteudo|f[0-9])/i.test(c))).toEqual([]);
  });
});

describe('sistema visual: o CSS global usa a escala', () => {
  const tokens = [...css.matchAll(/^\s*--text-([a-z-]+):/gm)].map((m) => m[1]);

  it('a escala tipográfica está definida', () => {
    expect(tokens).toEqual(expect.arrayContaining(['minimo', 'micro', 'rotulo', 'meta', 'nota', 'chip', 'corpo', 'lede', 'subtitulo', 'titulo', 'destaque']));
  });

  it('todo font-size das regras usa um token (a única exceção é o título fluido com clamp)', () => {
    const soltos = [...css.matchAll(/^\s*font-size:\s*([^;]+);/gm)].map((m) => m[1].trim()).filter((v) => !v.startsWith('var(--text-') && !v.startsWith('clamp('));
    expect(soltos).toEqual([]);
  });

  it('as classes de tamanho usadas nas telas existem na escala', () => {
    const usadas = new Set([...arquivos.flatMap(([, t]) => [...t.matchAll(/\btext-(minimo|micro|rotulo|meta|nota|chip|corpo|lede|subtitulo|titulo|destaque|leitura-[a-z]+)\b/g)].map((m) => m[1]))]);
    for (const nome of usadas) expect(tokens, `text-${nome} sem token --text-${nome}`).toContain(nome);
    expect(usadas.size).toBeGreaterThan(5);
  });

  it('larguras e espaçamento usados nas telas existem como token', () => {
    const containers = [...css.matchAll(/^\s*--container-([a-z-]+):/gm)].map((m) => m[1]);
    const usados = new Set(arquivos.flatMap(([, t]) => [...t.matchAll(/\bmax-w-(pagina-larga|pagina|leitura-larga|leitura|legenda-larga|legenda)\b/g)].map((m) => m[1])));
    for (const nome of usados) expect(containers, `max-w-${nome} sem token`).toContain(nome);
    expect(css).toMatch(/--tracking-rotulo:/);
  });
});
