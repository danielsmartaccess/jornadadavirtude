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
  /** false: pergunta só de reflexão (alternativas em outra escala); a escolha não soma no resultado. */
  contaNoResultado: boolean;
  /** Modo "acertos": chave da alternativa correta; nulo nos demais modos. */
  chaveCorreta: string | null;
}

/** No modo "faixas", a leitura vale a partir de tantas escolhas da chave-alvo. */
export interface FaixaLeitura {
  minimo: number;
  texto: string;
}

export interface ConteudoEtapa {
  /** Identificador da etapa no banco; liga os registros da pessoa a esta etapa. */
  id: number | null;
  ordem: number;
  nome: string;
  /** Markdown (GFM); null enquanto o texto da etapa não foi carregado no banco. */
  conteudoMd: string | null;
  perguntas: PerguntaQuiz[];
  /** Como o quiz vira leitura: pela opção mais escolhida, por faixas de uma chave-alvo ou pelo número de acertos. */
  quizModo: 'mais_escolhida' | 'faixas' | 'acertos';
  /** Modo "faixas": a chave cujas escolhas são contadas (por exemplo, "C"). */
  quizChaveAlvo: string | null;
  /** Modo "mais_escolhida": leitura de cada chave do quiz. */
  leituras: Alternativa[];
  /** Modos "faixas" e "acertos": leituras por número mínimo (de escolhas da chave-alvo ou de acertos). */
  faixas: FaixaLeitura[];
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

export interface ResultadoFaixas {
  /** Quantas respostas foram a chave-alvo. */
  alinhadas: number;
  /** Quantas perguntas foram respondidas. */
  total: number;
  /** Texto da faixa de maior mínimo atingido; null se nenhuma faixa for atingida. */
  leitura: string | null;
}

/** Resultado do quiz por faixas: conta as escolhas da chave-alvo e devolve a leitura da faixa de
 * maior mínimo atingido (o mínimo 0 cobre o restante). Sem respostas, não há resultado. */
export function resultadoPorFaixas(respostas: readonly string[], chaveAlvo: string, faixas: readonly FaixaLeitura[]): ResultadoFaixas | null {
  if (respostas.length === 0) return null;
  const alinhadas = respostas.filter((r) => r === chaveAlvo).length;
  const atingidas = faixas.filter((f) => f.minimo <= alinhadas).sort((a, b) => b.minimo - a.minimo);
  return { alinhadas, total: respostas.length, leitura: atingidas[0]?.texto ?? null };
}

export interface ResultadoAcertos {
  acertos: number;
  /** Quantas perguntas com resposta correta cadastrada foram respondidas. */
  total: number;
  leitura: string | null;
}

/** Resultado do quiz de compreensão: conta as respostas iguais à chave correta de cada pergunta e devolve a
 * leitura da faixa de maior mínimo atingido. Perguntas sem chave correta não entram. Sem respostas, não há resultado. */
export function resultadoPorAcertos(respostas: Readonly<Record<number, string>>, perguntas: readonly { ordem: number; chaveCorreta: string | null }[], faixas: readonly FaixaLeitura[]): ResultadoAcertos | null {
  const respondidas = perguntas.filter((p) => p.chaveCorreta !== null && respostas[p.ordem] !== undefined);
  if (respondidas.length === 0) return null;
  const acertos = respondidas.filter((p) => respostas[p.ordem] === p.chaveCorreta).length;
  const atingidas = faixas.filter((f) => f.minimo <= acertos).sort((a, b) => b.minimo - a.minimo);
  return { acertos, total: respondidas.length, leitura: atingidas[0]?.texto ?? null };
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
