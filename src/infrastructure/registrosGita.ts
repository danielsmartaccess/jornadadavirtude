/* Reflexões da pessoa na leitura da Gita: tabela registros (RLS: só o dono lê e escreve).
 * Usa o cliente já autenticado do módulo de sincronização; sem sessão, não há acesso. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { getCloudClient } from './sync';

export interface RegistroGita {
  id: string;
  etapaId: number;
  texto: string;
  /** Data e hora de criação, em ISO 8601. */
  criadoEm: string;
}

const COLUNAS = 'id,etapa_id,texto,criado_em';

/** Converte uma linha da API; devolve null se vier malformada. */
export function paraRegistro(linha: unknown): RegistroGita | null {
  if (typeof linha !== 'object' || linha === null) return null;
  const l = linha as Record<string, unknown>;
  if (typeof l.id !== 'string' || typeof l.etapa_id !== 'number' || typeof l.texto !== 'string' || typeof l.criado_em !== 'string') return null;
  return { id: l.id, etapaId: l.etapa_id, texto: l.texto, criadoEm: l.criado_em };
}

function cliente(): SupabaseClient {
  const c = getCloudClient();
  if (!c) throw new Error('A conta ainda não está pronta. Tente de novo em instantes.');
  return c;
}

/** Traduz falhas da API em mensagens para a pessoa, sem expor detalhes técnicos. */
function falha(erro: unknown, acao: string): Error {
  const texto = erro instanceof Error ? erro.message : typeof erro === 'object' && erro ? String((erro as { message?: unknown }).message ?? '') : '';
  if (/Failed to fetch|NetworkError|network/i.test(texto)) return new Error('Sem conexão com a nuvem. Verifique a internet e tente de novo.');
  if (/JWT|not authenticated|permission denied|row-level security/i.test(texto)) return new Error('Sua sessão expirou. Entre de novo em Configurações.');
  return new Error(`Não foi possível ${acao} agora. Tente de novo.`);
}

/** Reflexões da pessoa em uma etapa, da mais recente para a mais antiga. */
export async function listarRegistros(etapaId: number): Promise<RegistroGita[]> {
  const { data, error } = await cliente().from('registros').select(COLUNAS).eq('etapa_id', etapaId).order('criado_em', { ascending: false });
  if (error) throw falha(error, 'carregar suas reflexões');
  return (data ?? []).map(paraRegistro).filter((r): r is RegistroGita => r !== null);
}

export async function criarRegistro(userId: string, etapaId: number, texto: string): Promise<RegistroGita> {
  const { data, error } = await cliente().from('registros').insert({ user_id: userId, etapa_id: etapaId, texto }).select(COLUNAS).single();
  if (error) throw falha(error, 'guardar sua reflexão');
  const registro = paraRegistro(data);
  if (!registro) throw new Error('O servidor respondeu de forma inesperada. Recarregue a página para ver sua reflexão.');
  return registro;
}

export async function apagarRegistro(id: string): Promise<void> {
  const { error } = await cliente().from('registros').delete().eq('id', id);
  if (error) throw falha(error, 'apagar a reflexão');
}
