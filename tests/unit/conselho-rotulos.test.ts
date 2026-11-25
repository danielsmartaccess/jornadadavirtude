/* DH-T-12: a interface diz só o que sabe. Rótulo uniforme da referência ("Referência indicada na conferência"),
 * vocabulário conforme o tipo do registro, ação "Ver perfil no Conselho" e confiabilidade lida do dado.
 * Só regras de apresentação: nenhum dado é alterado. */
import { describe, expect, it } from 'vitest';
import { thinkers } from '../../src/domain/catalog';
import { entradasDoAcervo, papelDoRegistro, referenciasBase, type ReferenciaBase } from '../../src/domain/curadoria';
import { temAcaoVerPerfil } from '../../src/features/council/acaoPerfil';
import { termosDoRegistro, textoConfiabilidade } from '../../src/features/council/rotulos';

describe('DH-T-12-A (redação uniforme): a_confirmar não vira afirmação de inacessibilidade', () => {
  const CHAVES_DE_CONFERENCIA = ['confirmado', 'fonte', 'lacunas', 'registro', 'situacao'];

  it('o modelo não tem campo estruturado com o resultado do acesso à página: conferencia só tem situacao, fonte, registro, confirmado e lacunas', () => {
    // Se um campo de acesso for criado (decisão futura), este teste falha de propósito: o rótulo da página deve ser reavaliado.
    for (const r of referenciasBase) expect(Object.keys(r.conferencia).sort(), r.workId).toEqual(CHAVES_DE_CONFERENCIA);
    expect(new Set(referenciasBase.flatMap((r) => Object.keys(r))).has('acesso')).toBe(false);
  });

  it('situacao não codifica acesso: REF-STE-01 está metadados_confirmados mesmo com a página do editor não lida (os metadados vieram do registro do DOI)', () => {
    // Só documenta por que a inferência é inválida; nenhum código de interface lê esse texto livre.
    const stein = referenciasBase.find((r) => r.workId === 'REF-STE-01')!;
    expect(stein.conferencia.situacao).toBe('metadados_confirmados');
    expect(stein.conferencia.confirmado).toMatch(/página do editor não pôde ser lida/);
  });

  it('a_confirmar descreve metadados ainda não confirmados (todos nulos e com lacunas), não uma falha de acesso', () => {
    const aConfirmar = referenciasBase.filter((r) => r.conferencia.situacao === 'a_confirmar');
    expect(aConfirmar.map((r) => r.workId).sort()).toEqual(['REF-FEY-02', 'REF-FRA-01']);
    for (const r of aConfirmar) {
      expect([r.editora, r.ano, r.isbn, r.tradutor], r.workId).toEqual([null, null, null, null]);
      expect(r.conferencia.lacunas.length, r.workId).toBeGreaterThan(0);
    }
  });

  it('todas as referências usam a redação aprovada, num texto fixo e sem condição: "Referência indicada na conferência"', async () => {
    const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (p: URL, e: string) => string };
    const ler = (arquivo: string) => readFileSync(new URL(`../../src/features/council/${arquivo}`, import.meta.url), 'utf8');
    const paginas = ler('CouncilPages.tsx');
    // Todas as referências passam por ReferenciaItem, e o link da conferência é um texto literal, sem expressão nem condição.
    expect(paginas.match(/Referência indicada na conferência/g)).toHaveLength(1);
    expect(paginas).toMatch(/<a href=\{r\.conferencia\.fonte\}[^>]*>\s*Referência indicada na conferência\s*<\/a>/);
  });

  it('nenhum código de apresentação traz a afirmação antiga, afirma inacessibilidade ou decide por a_confirmar', async () => {
    const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (p: URL, e: string) => string };
    const ler = (arquivo: string) => readFileSync(new URL(`../../src/features/council/${arquivo}`, import.meta.url), 'utf8');
    for (const arquivo of ['CouncilPages.tsx', 'rotulos.ts', 'acaoPerfil.ts']) {
      expect(ler(arquivo), arquivo).not.toMatch(/Página consultada na conferência/);
      expect(ler(arquivo), arquivo).not.toMatch(/não foi possível abrir|Página indicada/);
    }
    expect(ler('CouncilPages.tsx')).not.toMatch(/conferencia\.situacao\s*===\s*'a_confirmar'/);
    expect(ler('rotulos.ts')).not.toMatch(/situacao\s*===\s*'a_confirmar'/);
  });
});

describe('DH-T-12-B: vocabulário conforme o tipo do registro', () => {
  const naoPessoas = thinkers.filter((t) => papelDoRegistro(t) === 'contextual_corpus');
  const pessoas = thinkers.filter((t) => papelDoRegistro(t) !== 'contextual_corpus');

  it('os 7 registros de tradição, escola ou corpus não são chamados de pessoa, pensador ou integrante', () => {
    expect(naoPessoas.map((t) => t.id).sort()).toEqual(
      ['bhagavad-gita', 'estoicismo', 'tradicoes-budistas', 'tradicoes-contemplativas', 'tradicoes-cristas', 'tradicoes-humanistas', 'tradicoes-religiosas'],
    );
    for (const t of naoPessoas) {
      const termos = termosDoRegistro(t);
      for (const texto of Object.values(termos)) expect(texto, t.id).not.toMatch(/pensador|integrante|pessoa|pensamento/i);
      expect(termos.paraEste, t.id).toBe('este registro');
    }
  });

  it('os 35 registros de pessoa mantêm o texto de pessoa exatamente como era (inclusive os não habilitados)', () => {
    expect(pessoas).toHaveLength(35);
    for (const t of pessoas) {
      expect(termosDoRegistro(t), t.id).toEqual({
        relacionadoA: 'este pensador',
        classificacaoDe: 'do seu pensamento',
        paraEste: 'este integrante',
        valemPara: 'o integrante',
      });
    }
  });
});

describe('DH-T-12-C: ação "Ver perfil no Conselho"', () => {
  it('tradição e corpus não têm a ação, mesmo com a flag histórica council:true (Tradições budistas)', () => {
    const budistas = thinkers.find((t) => t.id === 'tradicoes-budistas')!;
    expect(budistas.council).toBe(true);
    expect(temAcaoVerPerfil(budistas)).toBe(false);
    for (const t of thinkers.filter((x) => x.kind === 'tradicao')) expect(temAcaoVerPerfil(t), t.id).toBe(false);
  });

  it('as 26 pessoas habilitadas mantêm a ação; quem não é habilitado continua sem ela', () => {
    const comAcao = thinkers.filter(temAcaoVerPerfil).map((t) => t.id);
    expect(comAcao).toHaveLength(26);
    expect(comAcao).toContain('aristoteles');
    expect(comAcao).toContain('dalai-lama');
    expect(thinkers.filter((t) => !t.council).some(temAcaoVerPerfil)).toBe(false);
  });

  it('é a mesma regra de "convocável" do acervo e do motor (papelDoRegistro), nos 42 registros: sem divergência', () => {
    const convocaveis = entradasDoAcervo()
      .filter((e) => e.convocavel)
      .map((e) => e.id)
      .sort();
    expect(thinkers.filter(temAcaoVerPerfil).map((t) => t.id).sort()).toEqual(convocaveis);
    for (const t of thinkers) expect(temAcaoVerPerfil(t), t.id).toBe(t.council && papelDoRegistro(t) !== 'contextual_corpus');
  });

  it('a regra não importa a camada curatorial (a página da virtude não carrega esses dados; ADR-CUR-05)', async () => {
    const { readFileSync } = (await import(/* @vite-ignore */ 'node:' + 'fs')) as { readFileSync: (p: URL, e: string) => string };
    const codigo = readFileSync(new URL('../../src/features/council/acaoPerfil.ts', import.meta.url), 'utf8');
    const importacoes = [...codigo.matchAll(/^import\s.*from\s+'([^']+)'/gm)].map((m) => m[1]);
    expect(importacoes).toEqual(['../../domain/types']);
  });
});

describe('DH-T-12-D: confiabilidade da fonte lida do dado', () => {
  it('com o campo estruturado, mostra o valor real (as 12 referências hoje são "não avaliada")', () => {
    expect(referenciasBase.every((r) => r.confiabilidade?.situacao === 'nao_avaliada')).toBe(true);
    for (const r of referenciasBase) {
      expect(textoConfiabilidade(r), r.workId).toBe('Confiabilidade da fonte: não avaliada (sem rubrica aprovada; não é inferida da falta de metadados)');
    }
  });

  it('sem o campo, não afirma nada: ausência não vira "não avaliada"', () => {
    expect(textoConfiabilidade({})).toBeNull();
    expect(textoConfiabilidade({ confiabilidade: undefined })).toBeNull();
  });

  it('com um valor que o modelo não define, também não afirma nada (nada de nível inventado)', () => {
    const r = { confiabilidade: { situacao: 'alta' } } as unknown as Pick<ReferenciaBase, 'confiabilidade'>;
    expect(textoConfiabilidade(r)).toBeNull();
  });

  it('o texto depende só de confiabilidade.situacao, não de URL, falha de acesso nem completude', () => {
    const base = referenciasBase.find((r) => r.workId === 'REF-FEY-02')!; // a_confirmar, 403, metadados pendentes
    const semCampo = { ...base, confiabilidade: undefined };
    expect(textoConfiabilidade(base)).not.toBeNull();
    expect(textoConfiabilidade(semCampo)).toBeNull();
  });
});
