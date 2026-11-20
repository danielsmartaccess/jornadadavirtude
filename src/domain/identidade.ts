/* Identidade visual da base de conhecimento: cor e símbolo por família de virtudes, anel por dimensão
 * e emblema por tradição filosófica. Funções puras, sem React. Os símbolos são motivos geométricos
 * provisórios, aguardando validação da direção de arte (ver docs de auditoria); nada aqui afirma
 * relações filosóficas: só associa forma e cor a dados que já existem na base. */

import emblemasJson from '../data/virtue-emblems.json';

/** Motivos geométricos das famílias, na ordem do catálogo (F01 a F08). */
export const MOTIVO_FAMILIA = ['raios', 'meia-lua', 'triangulo', 'balanca', 'duplo-circulo', 'alvo', 'seta', 'estrela'] as const;
export type MotivoFamilia = (typeof MOTIVO_FAMILIA)[number];

/** Número da família a partir do id da base ("F01" → 1). Null para ids fora do padrão. */
export function numeroDaFamilia(familyId: string): number | null {
  const m = /^F(\d{2})$/.exec(familyId);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= MOTIVO_FAMILIA.length ? n : null;
}

/** Cor da família como token CSS (definida em styles/globals.css, com variante para tema escuro). */
export function corDaFamilia(familyId: string): string {
  const n = numeroDaFamilia(familyId);
  return n ? `var(--fam-${n})` : 'var(--fg)';
}

/** Motivo geométrico da família. Null quando o id não existe na base. */
export function motivoDaFamilia(familyId: string): MotivoFamilia | null {
  const n = numeroDaFamilia(familyId);
  return n ? MOTIVO_FAMILIA[n - 1] : null;
}

/** Emblema por tradição. "geral" para tradições sem emblema próprio ainda, sem inventar símbolo. */
export type EmblemaTradicao = 'grega' | 'confuciana' | 'taoista' | 'budista' | 'estoica' | 'marcial' | 'geral';

export function emblemaDaTradicao(tradicao: string): EmblemaTradicao {
  const t = tradicao
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
  if (t.includes('grega')) return 'grega';
  if (t.includes('confucian')) return 'confuciana';
  if (t.includes('taois')) return 'taoista';
  if (t.includes('budis')) return 'budista';
  if (t.includes('estoic')) return 'estoica';
  if (t.includes('marcial')) return 'marcial';
  return 'geral';
}

/** Anel da dimensão: 1 é o anel externo e 7 o centro (ordem do Documento 04). */
export function anelDaDimensao(order: number): number | null {
  return Number.isInteger(order) && order >= 1 && order <= 7 ? order : null;
}

/** Tipo de relação entre virtude e dimensão, da mais forte para a mais fraca (Documento 04). */
export type TipoRelacaoDimensao = 'D1' | 'D2' | 'D3';
export type EstadoAnel = 'primaria' | 'secundaria' | 'contextual' | 'nenhuma';

const FORCA: Record<TipoRelacaoDimensao, number> = { D1: 3, D2: 2, D3: 1 };
const ESTADO: Record<TipoRelacaoDimensao, EstadoAnel> = { D1: 'primaria', D2: 'secundaria', D3: 'contextual' };

/** Estado de cada um dos sete anéis (1 a 7) a partir das relações da virtude. Em caso de duplicidade, vence a mais forte. */
export function estadosDosAneis(relacoes: { dimensionOrder: number; tipo: TipoRelacaoDimensao }[]): EstadoAnel[] {
  const melhor = new Map<number, TipoRelacaoDimensao>();
  for (const r of relacoes) {
    if (anelDaDimensao(r.dimensionOrder) === null) continue;
    const atual = melhor.get(r.dimensionOrder);
    if (!atual || FORCA[r.tipo] > FORCA[atual]) melhor.set(r.dimensionOrder, r.tipo);
  }
  return [1, 2, 3, 4, 5, 6, 7].map((ordem) => {
    const tipo = melhor.get(ordem);
    return tipo ? ESTADO[tipo] : 'nenhuma';
  });
}

/** Leitura de um conjunto de perspectivas por anel: comum (todas tocam a dimensão), parcial (algumas) ou ausente (nenhuma). */
export type LeituraAnel = 'comum' | 'parcial' | 'ausente';

export function leituraDoConjunto(conjuntos: EstadoAnel[][]): LeituraAnel[] {
  return [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const tocam = conjuntos.filter((c) => (c[i] ?? 'nenhuma') !== 'nenhuma').length;
    if (tocam === 0) return 'ausente';
    return tocam === conjuntos.length ? 'comum' : 'parcial';
  });
}

/* ------------------------------------------------------------------------- */
/* Emblema próprio de cada virtude (src/data/virtue-emblems.json)            */
/* ------------------------------------------------------------------------- */

/** Elementos de um emblema, em viewBox 48 x 48: ["p", d, preenchido?, tracejado?] ou ["c", cx, cy, r, preenchido?, tracejado?]. */
export type ElementoEmblema = ['p', string, (0 | 1)?, string?] | ['c', number, number, number, (0 | 1)?, string?];

export interface EmblemaDaVirtude {
  /** Figura escolhida, em palavras (documentação para curadoria; não aparece na interface). */
  figura: string;
  el: ElementoEmblema[];
}

const DADOS_DE_CAMINHO = /^[MmLlHhVvCcSsQqTtAaZz0-9 .,-]{1,400}$/;
const TRACEJADO = /^[0-9. ]{1,20}$/;
const numeroNoQuadro = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n >= -2 && n <= 50;
const marca = (v: unknown) => v === undefined || v === 0 || v === 1;
const tracejado = (v: unknown) => v === undefined || v === '' || (typeof v === 'string' && TRACEJADO.test(v));

/** Só desenha o que é geometria segura: comandos e números de caminho SVG, círculos dentro do quadro. Nunca marcação. */
export function elementoDeEmblemaValido(e: unknown): e is ElementoEmblema {
  if (!Array.isArray(e)) return false;
  if (e[0] === 'p') return typeof e[1] === 'string' && DADOS_DE_CAMINHO.test(e[1]) && marca(e[2]) && tracejado(e[3]) && e.length <= 4;
  if (e[0] === 'c') return numeroNoQuadro(e[1]) && numeroNoQuadro(e[2]) && typeof e[3] === 'number' && e[3] > 0 && e[3] <= 24 && marca(e[4]) && tracejado(e[5]) && e.length <= 6;
  return false;
}

const emblemas = emblemasJson as unknown as Record<string, EmblemaDaVirtude>;

/** Emblema da virtude, só com os elementos válidos. Null quando a virtude não tem emblema. */
export function emblemaDaVirtude(virtueId: string): EmblemaDaVirtude | null {
  const e = emblemas[virtueId];
  if (!e || !Array.isArray(e.el)) return null;
  const el = e.el.filter(elementoDeEmblemaValido);
  return el.length > 0 ? { figura: e.figura, el } : null;
}

/** Ids com emblema na base (para conferir que toda virtude tem o seu). */
export const virtudesComEmblema = Object.keys(emblemas);
