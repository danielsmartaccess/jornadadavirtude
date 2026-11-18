/* Leitura do conteúdo da Gita no Supabase (tabelas capitulos, etapas, perguntas, opcoes e leituras).
 *
 * O conteúdo é fixo e de leitura pública: a chave publishable basta e não há sessão envolvida.
 * Usa a API REST direta (uma requisição com os dados aninhados) em vez de um segundo cliente
 * do Supabase, que duplicaria o controle de sessão do módulo de sincronização. */
import { cloudConfigured, SUPABASE_KEY, SUPABASE_URL } from '../config';
import type { Alternativa, ConteudoEtapa, PerguntaQuiz } from '../domain/gita';

const SELECT = 'numero,etapas(id,ordem,nome,conteudo_md,perguntas(ordem,enunciado,opcoes(chave,texto)),leituras(chave,texto))';

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const list = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? v.filter(isRecord) : []);

function alternativas(v: unknown): Alternativa[] {
  return list(v)
    .filter((a) => typeof a.chave === 'string' && typeof a.texto === 'string')
    .map((a) => ({ chave: a.chave as string, texto: a.texto as string }))
    .sort((a, b) => a.chave.localeCompare(b.chave));
}

/** Valida a resposta da API e a converte para o domínio. Itens malformados são descartados. */
export function parseConteudoCapitulo(raw: unknown): ConteudoEtapa[] {
  const capitulo = Array.isArray(raw) ? raw[0] : raw;
  if (!isRecord(capitulo)) return [];
  return list(capitulo.etapas)
    .filter((e) => typeof e.ordem === 'number' && typeof e.nome === 'string')
    .map((e): ConteudoEtapa => {
      const perguntas = list(e.perguntas)
        .filter((p) => typeof p.ordem === 'number' && typeof p.enunciado === 'string')
        .map((p): PerguntaQuiz => ({ ordem: p.ordem as number, enunciado: p.enunciado as string, opcoes: alternativas(p.opcoes) }))
        .sort((a, b) => a.ordem - b.ordem);
      return {
        id: typeof e.id === 'number' ? e.id : null,
        ordem: e.ordem as number,
        nome: e.nome as string,
        conteudoMd: typeof e.conteudo_md === 'string' && e.conteudo_md.trim() ? e.conteudo_md : null,
        perguntas,
        leituras: alternativas(e.leituras),
      };
    })
    .sort((a, b) => a.ordem - b.ordem);
}

const cache = new Map<number, ConteudoEtapa[]>();

/** Carrega as etapas de um capítulo. Lança Error com mensagem em português se a leitura falhar. */
export async function carregarCapitulo(numero: number, signal?: AbortSignal): Promise<ConteudoEtapa[]> {
  const guardado = cache.get(numero);
  if (guardado) return guardado;
  if (!cloudConfigured) throw new Error('O conteúdo do capítulo fica na nuvem e este aparelho não está configurado para acessá-la.');

  let resposta: Response;
  try {
    resposta = await fetch(`${SUPABASE_URL}/rest/v1/capitulos?numero=eq.${numero}&select=${encodeURIComponent(SELECT)}`, {
      headers: { apikey: SUPABASE_KEY, Accept: 'application/json' },
      signal,
    });
  } catch (erro) {
    if (signal?.aborted) throw erro;
    throw new Error('Sem conexão com o servidor. Verifique a internet e tente de novo.');
  }
  if (!resposta.ok) throw new Error(`O servidor não respondeu como esperado (código ${resposta.status}).`);

  const etapas = parseConteudoCapitulo(await resposta.json());
  cache.set(numero, etapas);
  return etapas;
}
