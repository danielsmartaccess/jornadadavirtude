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
  { ordem: 3, nome: 'Interpretação filosófica' },
  { ordem: 4, nome: 'Aplicação prática contemporânea' },
  { ordem: 5, nome: 'Reflexão pessoal interativa' },
  { ordem: 6, nome: 'Síntese e versos para revisitar' },
];

/** Conteúdo de uma etapa, como vem do banco (tabelas etapas, perguntas, opcoes e leituras). */
export interface Alternativa {
  chave: string;
  texto: string;
}

export interface PerguntaQuiz {
  ordem: number;
  enunciado: string;
  opcoes: Alternativa[];
}

export interface ConteudoEtapa {
  /** Identificador da etapa no banco; liga os registros da pessoa a esta etapa. */
  id: number | null;
  ordem: number;
  nome: string;
  /** Markdown (GFM); null enquanto o texto da etapa não foi carregado no banco. */
  conteudoMd: string | null;
  perguntas: PerguntaQuiz[];
  /** Leitura de cada chave do quiz; usada no resultado. */
  leituras: Alternativa[];
}

/** Separa o texto antes do primeiro subtítulo (###) do restante. Na etapa de reflexão, o quiz
 * entra entre a introdução e a reflexão aberta. Sem subtítulo, tudo é introdução. */
export function dividirNoPrimeiroSubtitulo(markdown: string): { introducao: string; resto: string } {
  const i = markdown.search(/^### /m);
  if (i < 0) return { introducao: markdown, resto: '' };
  return { introducao: markdown.slice(0, i).trimEnd(), resto: markdown.slice(i) };
}

/** Tamanho máximo de uma reflexão, em caracteres (cerca de cinco páginas). */
export const LIMITE_REFLEXAO = 10000;

/** Valida o texto de uma reflexão antes de guardar: sem espaços nas pontas, não vazio, dentro do limite. */
export function validarReflexao(entrada: string): { ok: true; texto: string } | { ok: false; erro: string } {
  const texto = entrada.trim();
  if (!texto) return { ok: false, erro: 'Escreva algo antes de guardar.' };
  if (texto.length > LIMITE_REFLEXAO) return { ok: false, erro: `A reflexão passou do limite de ${LIMITE_REFLEXAO} caracteres (${texto.length}).` };
  return { ok: true, texto };
}

export interface ResultadoQuiz {
  /** Quantas vezes cada chave foi escolhida. */
  contagem: Record<string, number>;
  /** Chave mais escolhida; mais de uma em caso de empate, em ordem alfabética. */
  vencedoras: string[];
  empate: boolean;
}

/** Resultado do quiz de reflexão: a opção mais escolhida define a leitura; se houver
 * empate, todas as opções empatadas são devolvidas. Sem respostas, não há resultado. */
export function resultadoDoQuiz(respostas: readonly string[]): ResultadoQuiz | null {
  if (respostas.length === 0) return null;
  const contagem: Record<string, number> = {};
  for (const chave of respostas) contagem[chave] = (contagem[chave] ?? 0) + 1;
  const maximo = Math.max(...Object.values(contagem));
  const vencedoras = Object.keys(contagem)
    .filter((chave) => contagem[chave] === maximo)
    .sort();
  return { contagem, vencedoras, empate: vencedoras.length > 1 };
}

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
