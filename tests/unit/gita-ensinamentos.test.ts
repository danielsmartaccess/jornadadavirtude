import { describe, expect, it } from 'vitest';
import { parseNumeroCapitulo, ROTA_ENSINAMENTOS } from '../../src/domain/gita';
import { parseEnsinamentos } from '../../src/infrastructure/ensinamentosContent';
import migracao from '../../supabase/migrations/20261120120000_ensinamentos_de_krishna.sql?raw';
import seed from '../../supabase/seeds/ensinamentos-de-krishna.sql?raw';

/** Lê do SQL do seed os pontos e os gunas, para conferir o conteúdo na fonte, sem banco. */
function lerSeed(sql: string) {
  const pontos = [...sql.matchAll(/^\s*\((\d+), array\[(.*)\]\)[,\s]*$/gm)].map((m) => ({
    ordem: Number(m[1]),
    linhas: [...m[2].matchAll(/'([^']*)'/g)].map((l) => l[1]),
  }));
  const gunas = [...sql.matchAll(/^\s*\((\d+), (\d+), '([A-Z])', '([^']*)', '([^']*)'\)/gm)].map((m) => ({
    ensinamento: Number(m[1]),
    ordem: Number(m[2]),
    sigla: m[3],
    nome: m[4],
    sentido: m[5],
  }));
  return { pontos, gunas };
}

describe('seed dos Ensinamentos de Krishna', () => {
  const { pontos, gunas } = lerSeed(seed);

  it('tem sete pontos numerados de 1 a 7, com o texto do quadro e sem acréscimos', () => {
    expect(pontos).toEqual([
      { ordem: 1, linhas: ['Despertar consciência'] },
      { ordem: 2, linhas: ['Medo → coragem', 'Dúvidas → decisão'] },
      { ordem: 3, linhas: ['Teoria da reencarnação'] },
      { ordem: 4, linhas: ['Imortalidade da alma'] },
      { ordem: 5, linhas: ['3 gunas'] },
      { ordem: 6, linhas: ['Reta-ação → agir por dever, sem esperar nada em troca'] },
      { ordem: 7, linhas: ['Sacrifício da sabedoria – esforço'] },
    ]);
  });

  it('os três gunas ficam só no ponto 5, com o sentido escrito no quadro', () => {
    expect(gunas).toEqual([
      { ensinamento: 5, ordem: 1, sigla: 'R', nome: 'Rajas', sentido: 'impulsividade' },
      { ensinamento: 5, ordem: 2, sigla: 'S', nome: 'Satwa', sentido: 'justo meio' },
      { ensinamento: 5, ordem: 3, sigla: 'T', nome: 'Tamas', sentido: 'inércia' },
    ]);
  });

  it('é idempotente: upsert por chave e nenhum dado de usuário', () => {
    expect(seed).toMatch(/on conflict \(ordem\) do update/);
    expect(seed).toMatch(/on conflict \(ensinamento_ordem, ordem\) do update/);
    expect(seed).not.toMatch(/(insert into|update|delete from)\s+public\.registros|auth\./i);
    expect([...seed.matchAll(/insert into public\.(\w+)/g)].map((m) => m[1])).toEqual(['ensinamentos', 'ensinamentos_gunas']);
  });
});

describe('migração dos Ensinamentos de Krishna', () => {
  it('liga RLS, só concede leitura e revoga o restante nas duas tabelas', () => {
    expect(migracao).toMatch(/create table public\.ensinamentos \(/);
    expect(migracao).toMatch(/create table public\.ensinamentos_gunas \(/);
    expect(migracao).toMatch(/array\['ensinamentos', 'ensinamentos_gunas'\]/);
    expect(migracao).toMatch(/enable row level security/);
    expect(migracao).toMatch(/revoke all on table public\.%I from anon, authenticated/);
    expect(migracao).toMatch(/grant select on table public\.%I to anon, authenticated/);
    expect(migracao).not.toMatch(/grant (insert|update|delete|all)/i);
  });
});

describe('parseEnsinamentos', () => {
  const resposta = [
    { ordem: 5, linhas: ['3 gunas'], ensinamentos_gunas: [{ ordem: 2, sigla: 'S', nome: 'Satwa', sentido: 'justo meio' }, { ordem: 1, sigla: 'R', nome: 'Rajas', sentido: 'impulsividade' }] },
    { ordem: 1, linhas: ['Despertar consciência'], ensinamentos_gunas: [] },
  ];

  it('ordena os pontos e os gunas e só inclui gunas quando existem', () => {
    const itens = parseEnsinamentos(resposta);
    expect(itens.map((i) => i.numero)).toEqual([1, 5]);
    expect(itens[0]).toEqual({ numero: 1, linhas: ['Despertar consciência'] });
    expect(itens[1].gunas?.map((g) => g.sigla)).toEqual(['R', 'S']);
  });

  it('descarta itens e gunas malformados', () => {
    const itens = parseEnsinamentos([
      { ordem: 'um', linhas: ['x'] },
      { ordem: 2, linhas: [] },
      { ordem: 3, linhas: ['  '] },
      { ordem: 4, linhas: ['ok'], ensinamentos_gunas: [{ ordem: 1, sigla: 'r', nome: 'x', sentido: 'y' }, { ordem: 2, sigla: 'R', nome: '', sentido: 'y' }] },
      null,
    ]);
    expect(itens).toEqual([{ numero: 4, linhas: ['ok'] }]);
  });

  it('resposta que não é lista vira lista vazia', () => {
    expect(parseEnsinamentos(null)).toEqual([]);
    expect(parseEnsinamentos({ ordem: 1 })).toEqual([]);
  });
});

describe('rota da parte final', () => {
  it('não colide com a de nenhum capítulo', () => {
    expect(parseNumeroCapitulo(ROTA_ENSINAMENTOS)).toBeNull();
  });
});
