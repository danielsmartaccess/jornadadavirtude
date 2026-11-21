import { describe, expect, it } from 'vitest';
import { buildExport, parseImport } from '../../src/infrastructure/legacy';
import { paraReflexaoExportada, type ReflexaoExportada } from '../../src/infrastructure/registrosGita';
import { emptyData } from '../../src/infrastructure/sanitize';

const linha = {
  id: 'r1',
  texto: 'O que decido hoje?',
  criado_em: '2026-11-18T09:00:00Z',
  etapas: { ordem: 5, nome: 'Reflexão pessoal interativa', capitulos: { numero: 14, titulo: 'Gunatraya Vibhaga Yoga — Os três modos da natureza' } },
};

describe('paraReflexaoExportada', () => {
  it('traz o capítulo e a etapa de cada reflexão, no lugar do id interno', () => {
    expect(paraReflexaoExportada(linha)).toEqual({
      capitulo: 14,
      tituloDoCapitulo: 'Gunatraya Vibhaga Yoga — Os três modos da natureza',
      etapa: 5,
      nomeDaEtapa: 'Reflexão pessoal interativa',
      texto: 'O que decido hoje?',
      criadoEm: '2026-11-18T09:00:00Z',
    });
  });

  it('aceita a relação como lista de um item (cautela com a forma da resposta)', () => {
    const r = paraReflexaoExportada({ ...linha, etapas: [{ ...linha.etapas, capitulos: [linha.etapas.capitulos] }] });
    expect(r?.capitulo).toBe(14);
    expect(r?.etapa).toBe(5);
  });

  it('sem a relação, mantém o texto e a data e deixa capítulo e etapa vazios', () => {
    expect(paraReflexaoExportada({ id: 'r2', texto: 'Sem contexto', criado_em: '2026-11-19T10:00:00Z' })).toEqual({
      capitulo: null,
      tituloDoCapitulo: null,
      etapa: null,
      nomeDaEtapa: null,
      texto: 'Sem contexto',
      criadoEm: '2026-11-19T10:00:00Z',
    });
  });

  it('descarta linhas malformadas e ignora campos de tipo errado', () => {
    expect(paraReflexaoExportada(null)).toBeNull();
    expect(paraReflexaoExportada('texto')).toBeNull();
    expect(paraReflexaoExportada({ criado_em: '2026-11-19T10:00:00Z' })).toBeNull();
    expect(paraReflexaoExportada({ texto: 'sem data' })).toBeNull();
    expect(paraReflexaoExportada({ texto: 'x', criado_em: 'y', etapas: { ordem: 'cinco', nome: 7, capitulos: 'x' } })).toMatchObject({ capitulo: null, etapa: null, nomeDaEtapa: null });
  });
});

describe('buildExport', () => {
  const agora = new Date('2026-11-21T12:00:00Z');
  const reflexoes: ReflexaoExportada[] = [paraReflexaoExportada(linha)!];

  it('sem conta, o arquivo é exatamente o de antes: nenhum campo novo', () => {
    const arquivo = buildExport(emptyData(), agora);
    expect(Object.keys(arquivo).sort()).toEqual(['application', 'data', 'exportedAt', 'schemaVersion']);
    expect('reflexoesGita' in arquivo).toBe(false);
  });

  it('com reflexões, entram como campo irmão de data, sem tocar nos dados do aparelho', () => {
    const arquivo = buildExport(emptyData(), agora, reflexoes) as Record<string, unknown>;
    expect(arquivo.reflexoesGita).toEqual(reflexoes);
    expect(arquivo.data).toEqual(emptyData());
    expect(arquivo.schemaVersion).toBe(buildExport(emptyData(), agora).schemaVersion);
  });

  it('uma lista vazia também é incluída (a pessoa tem conta, mas ainda nenhuma reflexão)', () => {
    expect(buildExport(emptyData(), agora, [])).toHaveProperty('reflexoesGita', []);
  });
});

describe('importação de um arquivo que traz reflexões', () => {
  it('importa os dados normalmente e ignora o campo reflexoesGita', () => {
    const comReflexoes = JSON.stringify(buildExport(emptyData(), new Date('2026-11-21T12:00:00Z'), [paraReflexaoExportada(linha)!]));
    const semReflexoes = JSON.stringify(buildExport(emptyData(), new Date('2026-11-21T12:00:00Z')));
    const a = parseImport(comReflexoes);
    const b = parseImport(semReflexoes);
    expect(a.kind).toBe('atual');
    expect(a.data).toEqual(b.data);
    expect(a.ignored).toBe(b.ignored);
  });
});
