/* Identidade visual da base de conhecimento: cor e símbolo por família de virtudes, anel por dimensão
 * e emblema por tradição filosófica. Funções puras, sem React. Os símbolos são motivos geométricos
 * provisórios, aguardando validação da direção de arte (ver docs de auditoria); nada aqui afirma
 * relações filosóficas: só associa forma e cor a dados que já existem na base. */

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
