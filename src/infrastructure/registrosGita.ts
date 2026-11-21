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

/* ------------------------------------------------------------------------- */
/* Exportação: todas as reflexões da pessoa, com o capítulo e a etapa de cada uma */
/* ------------------------------------------------------------------------- */

/** Uma reflexão no arquivo de exportação. O id interno da etapa não serve fora do banco, então vai o capítulo e o nome da etapa. */
export interface ReflexaoExportada {
  capitulo: number | null;
  tituloDoCapitulo: string | null;
  etapa: number | null;
  nomeDaEtapa: string | null;
  texto: string;
  criadoEm: string;
}

const COLUNAS_EXPORTACAO = 'id,texto,criado_em,etapas(ordem,nome,capitulos(numero,titulo))';
const TAMANHO_DA_PAGINA = 1000;
const MAXIMO_DE_PAGINAS = 20;

const objeto = (v: unknown): Record<string, unknown> | null => {
  const item = Array.isArray(v) ? v[0] : v; // uma relação de muitos para um vem como objeto; por cautela aceita lista de um item
  return typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : null;
};
const texto = (v: unknown) => (typeof v === 'string' ? v : null);
const numero = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

/** Converte uma linha da consulta de exportação. Devolve null se faltar o texto ou a data. Capítulo e etapa ausentes viram null. */
export function paraReflexaoExportada(linha: unknown): ReflexaoExportada | null {
  const l = objeto(linha);
  if (!l || typeof l.texto !== 'string' || typeof l.criado_em !== 'string') return null;
  const etapa = objeto(l.etapas);
  const capitulo = etapa ? objeto(etapa.capitulos) : null;
  return {
    capitulo: capitulo ? numero(capitulo.numero) : null,
    tituloDoCapitulo: capitulo ? texto(capitulo.titulo) : null,
    etapa: etapa ? numero(etapa.ordem) : null,
    nomeDaEtapa: etapa ? texto(etapa.nome) : null,
    texto: l.texto,
    criadoEm: l.criado_em,
  };
}

/** Todas as reflexões da pessoa (a RLS limita ao dono), da mais antiga para a mais recente, em páginas de 1.000. */
export async function listarTodasAsReflexoes(): Promise<ReflexaoExportada[]> {
  const todas: ReflexaoExportada[] = [];
  for (let pagina = 0; pagina < MAXIMO_DE_PAGINAS; pagina++) {
    const de = pagina * TAMANHO_DA_PAGINA;
    const { data, error } = await cliente().from('registros').select(COLUNAS_EXPORTACAO).order('criado_em', { ascending: true }).order('id', { ascending: true }).range(de, de + TAMANHO_DA_PAGINA - 1);
    if (error) throw falha(error, 'ler suas reflexões');
    const linhas = data ?? [];
    todas.push(...linhas.map(paraReflexaoExportada).filter((r): r is ReflexaoExportada => r !== null));
    if (linhas.length < TAMANHO_DA_PAGINA) break;
  }
  return todas;
}
