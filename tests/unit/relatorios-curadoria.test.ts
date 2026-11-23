/* Relatórios da Fase 2 de curadoria, gerados a partir dos dados e do motor (nada escrito à mão):
 * - comparação A/B das políticas de seleção (DEC-CUR-05);
 * - inventário de revisão das 189 relações (DEC-CUR-08).
 * Sem RELATORIOS=1, o teste falha se os arquivos versionados estiverem desatualizados. */
import { describe, expect, it } from 'vitest';
import { relatorioAB } from './support/comparacao-politicas';
import { relatorioTresPoliticas } from './support/comparacao-tres-politicas';
import { linhasDoInventario, relatorioInventario } from './support/inventario-relacoes';

const ARQUIVOS = {
  ab: '../../docs/governanca/curadoria/comparacao-politicas-selecao.md',
  ab21: '../../docs/governanca/curadoria/comparacao-politicas-selecao-v2.1.md',
  inventario: '../../docs/governanca/curadoria/inventario-relacoes-v1.md',
};
const atualizar = Boolean((globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.RELATORIOS);
const semCR = (s: string) => s.replace(/\r\n/g, '\n');

async function conferir(caminho: string, gerado: string) {
  const fs = (await import(/* @vite-ignore */ 'node:' + 'fs')) as {
    readFileSync: (p: URL, e: string) => string;
    writeFileSync: (p: URL, d: string) => void;
    mkdirSync: (p: URL, o: { recursive: boolean }) => void;
  };
  const url = new URL(caminho, import.meta.url);
  if (atualizar) {
    fs.mkdirSync(new URL('.', url), { recursive: true });
    fs.writeFileSync(url, gerado);
  }
  expect(semCR(fs.readFileSync(url, 'utf8'))).toBe(semCR(gerado));
}

describe('relatórios da curadoria (Fase 2)', () => {
  it('comparação A/B das políticas: determinística e igual ao arquivo versionado', async () => {
    const a = relatorioAB();
    expect(relatorioAB()).toBe(a);
    await conferir(ARQUIVOS.ab, a);
  });

  it('comparação v1 × v2 × v2.1 (revisão DEC-CUR-10): determinística e igual ao arquivo versionado', async () => {
    const a = relatorioTresPoliticas();
    expect(relatorioTresPoliticas()).toBe(a);
    await conferir(ARQUIVOS.ab21, a);
  });

  it('inventário das 189 relações: nenhuma validada por inferência, nenhum F1–F4, igual ao arquivo versionado', async () => {
    const linhas = linhasDoInventario();
    expect(linhas).toHaveLength(189);
    expect(linhas.every((l) => l.status === 'proposta')).toBe(true);
    expect(linhas.every((l) => l.nivelF === '—')).toBe(true);
    await conferir(ARQUIVOS.inventario, relatorioInventario());
  });
});
