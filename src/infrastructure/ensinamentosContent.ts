/* Leitura dos Ensinamentos de Krishna no Supabase (tabelas ensinamentos e ensinamentos_gunas).
 *
 * Mesmo regime do conteúdo dos capítulos (gitaContent.ts): conteúdo fixo, leitura pública, chave
 * publishable, uma requisição com os gunas aninhados e a API REST direta. */
import { cloudConfigured, SUPABASE_KEY, SUPABASE_URL } from '../config';
import type { GunaDoQuadro, ItemEnsinamento } from '../domain/gita';

const SELECT = 'ordem,linhas,ensinamentos_gunas(ordem,sigla,nome,sentido)';

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const naoVazio = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

/** Valida a resposta da API e a converte para o domínio. Itens malformados são descartados. */
export function parseEnsinamentos(raw: unknown): ItemEnsinamento[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(isRecord)
    .filter((p) => typeof p.ordem === 'number' && Array.isArray(p.linhas) && p.linhas.length > 0 && p.linhas.every(naoVazio))
    .map((p): ItemEnsinamento => {
      const gunas = (Array.isArray(p.ensinamentos_gunas) ? p.ensinamentos_gunas : [])
        .filter(isRecord)
        .filter((g) => typeof g.ordem === 'number' && typeof g.sigla === 'string' && /^[A-Z]$/.test(g.sigla) && naoVazio(g.nome) && naoVazio(g.sentido))
        .sort((a, b) => (a.ordem as number) - (b.ordem as number))
        .map((g): GunaDoQuadro => ({ sigla: g.sigla as string, nome: g.nome as string, sentido: g.sentido as string }));
      return { numero: p.ordem as number, linhas: p.linhas as string[], ...(gunas.length > 0 ? { gunas } : {}) };
    })
    .sort((a, b) => a.numero - b.numero);
}

let cache: ItemEnsinamento[] | null = null;

/** Carrega os pontos do quadro. Lança Error com mensagem em português se a leitura falhar. */
export async function carregarEnsinamentos(signal?: AbortSignal): Promise<ItemEnsinamento[]> {
  if (cache) return cache;
  if (!cloudConfigured) throw new Error('O conteúdo fica na nuvem e este aparelho não está configurado para acessá-la.');

  let resposta: Response;
  try {
    resposta = await fetch(`${SUPABASE_URL}/rest/v1/ensinamentos?select=${encodeURIComponent(SELECT)}&order=ordem.asc`, {
      headers: { apikey: SUPABASE_KEY, Accept: 'application/json' },
      signal,
    });
  } catch (erro) {
    if (signal?.aborted) throw erro;
    throw new Error('Sem conexão com o servidor. Verifique a internet e tente de novo.');
  }
  if (!resposta.ok) throw new Error(`O servidor não respondeu como esperado (código ${resposta.status}).`);

  const itens = parseEnsinamentos(await resposta.json());
  if (itens.length > 0) cache = itens; // lista vazia não fica guardada: o conteúdo pode ser publicado a qualquer momento
  return itens;
}
