/* Módulo de leitura da Bhagavad Gita: estrutura fixa (18 capítulos x 6 etapas).
 * Espelha as tabelas capitulos e etapas do banco (supabase/seed.sql). O texto de cada
 * etapa entra em uma fase posterior; aqui só existe a estrutura. */
import capitulosJson from '../data/gita-capitulos.json';

export interface Capitulo {
  numero: number;
  /** "Nome em sânscrito — Tradução", como gravado em capitulos.titulo. */
  titulo: string;
}

export interface Etapa {
  ordem: number;
  nome: string;
}

export const capitulos = capitulosJson as Capitulo[];

/** As seis etapas de estudo, iguais em todos os capítulos. */
export const etapas: Etapa[] = [
  { ordem: 1, nome: 'Contexto histórico e filosófico' },
  { ordem: 2, nome: 'Conceitos fundamentais' },
  { ordem: 3, nome: 'Interpretação dos ensinamentos de Krishna' },
  { ordem: 4, nome: 'Relações com Spinoza, estoicismo e filosofia ocidental' },
  { ordem: 5, nome: 'Aplicação prática à vida contemporânea' },
  { ordem: 6, nome: 'Reflexão para aprofundar' },
];

export function getCapitulo(numero: number): Capitulo | undefined {
  return capitulos.find((c) => c.numero === numero);
}

/** Converte o parâmetro da rota em número de capítulo; null quando não é um capítulo válido. */
export function parseNumeroCapitulo(param: string | undefined): number | null {
  if (!param || !/^\d{1,2}$/.test(param)) return null;
  const numero = Number(param);
  return getCapitulo(numero) ? numero : null;
}

/** Separa "Sânscrito — Tradução" nas duas partes; sem separador, tudo vira tradução. */
export function splitTitulo(titulo: string): { sanscrito: string; traducao: string } {
  const i = titulo.indexOf(' — ');
  if (i < 0) return { sanscrito: '', traducao: titulo };
  return { sanscrito: titulo.slice(0, i), traducao: titulo.slice(i + 3) };
}

export function capituloAnterior(numero: number): Capitulo | undefined {
  return getCapitulo(numero - 1);
}

export function capituloSeguinte(numero: number): Capitulo | undefined {
  return getCapitulo(numero + 1);
}
