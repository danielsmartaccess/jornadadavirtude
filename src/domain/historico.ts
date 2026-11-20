/* Percurso por dimensão (Documento 06, seção 14): quantos registros de uma jornada se ligam a cada
 * dimensão, pela relação primária (D1) ou secundária (D2) da virtude. É uma contagem descritiva de
 * atividades: não mede virtude, caráter nem evolução. Função pura, sem React ou catálogo. */

export interface RelacaoVirtudeDimensao {
  virtueId: string;
  dimensionOrder: number;
  tipo: 'D1' | 'D2' | 'D3';
}

export interface ContagemDimensao {
  ordem: number;
  registros: number;
}

/** Sete linhas (uma por dimensão, na ordem 1 a 7). Cada registro conta uma vez por dimensão. */
export function registrosPorDimensao(entradas: { virtueId: string | null }[], relacoes: RelacaoVirtudeDimensao[]): ContagemDimensao[] {
  const contagem = new Map<number, number>();
  for (const entrada of entradas) {
    if (!entrada.virtueId) continue;
    const ordens = new Set(relacoes.filter((r) => r.virtueId === entrada.virtueId && (r.tipo === 'D1' || r.tipo === 'D2')).map((r) => r.dimensionOrder));
    for (const ordem of ordens) contagem.set(ordem, (contagem.get(ordem) ?? 0) + 1);
  }
  return [1, 2, 3, 4, 5, 6, 7].map((ordem) => ({ ordem, registros: contagem.get(ordem) ?? 0 }));
}

/** Virtudes trabalhadas na jornada, na ordem da primeira aparição nos registros, sem repetir. */
export function virtudesNaOrdem(entradas: { virtueId: string | null }[]): string[] {
  const vistas: string[] = [];
  for (const e of entradas) if (e.virtueId && !vistas.includes(e.virtueId)) vistas.push(e.virtueId);
  return vistas;
}
