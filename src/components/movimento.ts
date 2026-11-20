/* Escalonamento da entrada de listas: o índice do item vira o atraso da animação (.revelar e .anel-animado
 * em styles/globals.css). Limitado, para que uma lista longa não faça ninguém esperar. */
import type { CSSProperties } from 'react';

export const MAX_ESCALONAMENTO = 7;

/** Variável CSS --i do item: a posição na lista, no máximo MAX_ESCALONAMENTO. */
export function atraso(indice: number): CSSProperties {
  return { ['--i' as string]: Math.max(0, Math.min(Math.floor(indice), MAX_ESCALONAMENTO)) };
}
