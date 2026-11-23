/* Curadoria ampliada do Conselho de Sabedoria (Documento 14).
 *
 * Camada separada do catálogo original: candidatos, tradições/corpora, classificação por
 * universo e tipo de participação, mapa do Documento 12 e evidências por relação.
 * Nada aqui altera thinkers.json, thinker-virtues.json ou works.json, e nada aqui habilita
 * alguém no Conselho: a habilitação continua sendo o campo `council` do catálogo original.
 *
 * Três escalas que não se confundem:
 * - `relationType` (P1–P4) do Documento 04, nas relações do catálogo, intocado;
 * - a escala P1–P4 da auditoria de curadoria, que NÃO é importada para o produto;
 * - `nivel` (F1–F4) do Documento 14, só nas evidências desta camada. */
import candidatosJson from '../data/curadoria/candidatos.json';
import classificacaoJson from '../data/curadoria/classificacao.json';
import doc12Json from '../data/curadoria/doc12.json';
import evidenciasJson from '../data/curadoria/evidencias.json';
import referenciasJson from '../data/curadoria/referencias-base.json';
import tradicoesJson from '../data/curadoria/tradicoes.json';
import universosJson from '../data/curadoria/universos.json';
import vinculosJson from '../data/curadoria/vinculos.json';
import { getThinker, getWork, thinkers, thinkerVirtues } from './catalog';
import type { Thinker, ThinkerVirtue, ValidationStatus } from './types';

export type Universo = 'filosofia-etica' | 'tradicoes-espirituais' | 'psicologia-ciencias-humanas' | 'literatura-artes' | 'ciencia-sistemas';
export type TipoParticipacao =
  | 'pensador-individual'
  | 'perspectiva-cientifica-profissional'
  | 'voz-literaria-artistica'
  | 'tradicao-corpus'
  | 'escola-corrente';
/** Escala do Documento 14, seção 9.1. Não substitui o status de validação. */
export type NivelFundamentacao = 'F1' | 'F2' | 'F3' | 'F4';
export type TipoRelacaoEvidencia = 'direta' | 'conceitual' | 'interpretacao-curatorial';
export type OrigemCandidato = 'doc12' | 'doc14-prioritario' | 'doc14-pesquisa' | 'doc14-literaria';

export interface UniversoInfo {
  id: Universo;
  nome: string;
  conteudo: string;
  contribuicoes: string;
}

export interface Candidato {
  id: string;
  nome: string;
  doc12Id?: string;
  origem: OrigemCandidato;
  tipo: TipoParticipacao;
  universos: Universo[];
  campo: string;
  contribuicao: string;
  temasAInvestigar?: string;
  cuidado?: string;
  fonteDoRegistro: string;
  /** Sempre falso nesta camada: candidatos nunca entram na seleção. */
  habilitado: false;
  status: ValidationStatus;
}

export interface TradicaoCorpus {
  id: string;
  nome: string;
  tipo: 'tradicao-corpus' | 'escola-corrente';
  universos: Universo[];
  escopo: string;
  cuidado: string;
  /** Autores nomeados explicitamente no Documento 14. Não são convocados junto com a tradição como vozes independentes. */
  autoresRelacionados: string[];
  /** Registros de thinkers.json que correspondem a esta tradição, sem alterá-los. */
  registrosNoCatalogo: string[];
  obras?: string[];
  edicaoTraducao?: string;
  parteDe?: string;
  corpora?: string[];
  conflito?: string;
  status: ValidationStatus;
}

/** Evidência de UMA relação pensador–virtude (Documento 14, seção 9.3). */
export interface EvidenciaRelacao {
  id: string;
  /** Identificador da relação em thinker-virtues.json (ex.: TV-V01-aristoteles). */
  relacaoId: string;
  /** Obra específica do catálogo (works.json), quando cadastrada. */
  obraId?: string;
  /** Obra ainda não cadastrada, descrita por extenso. */
  obraDescricao?: string;
  edicao?: string;
  tradutor?: string;
  ano?: string;
  /** Localização precisa (livro, capítulo, página) ou "a confirmar". Nunca inventada. */
  localizacao: string;
  conceito?: string;
  justificativa: string;
  tipoRelacao: TipoRelacaoEvidencia;
  /** null = ainda não avaliada. */
  nivel: NivelFundamentacao | null;
  status: ValidationStatus;
  revisor?: string;
  dataRevisao?: string;
  limites?: string;
}

export interface Classificacao {
  id: string;
  tipo: TipoParticipacao;
  /** O primeiro é o universo principal (DEC-CUR-06). */
  universos: Universo[];
  /** Nota para casos híbridos (filósofo/escritor, cientista/divulgador, líder religioso/autor). */
  nota?: string;
}

/** Taxonomia de navegação v1 (DEC-CUR-06): metadado editorial, não ontologia nem hierarquia de valor. */
export interface TaxonomiaInfo {
  versao: string;
  decisao: string;
  uso: string;
  aviso: string;
  regras: string;
}

/* ---- Papel na seleção (DEC-CUR-02) ---- */

/** Como um registro pode entrar no Conselho. `contextual_corpus` nunca ocupa vaga de voz individual. */
export type PapelSelecao = 'individual_voice' | 'literary_voice' | 'contextual_corpus';

export const PAPEL_SELECAO: Record<PapelSelecao, string> = {
  individual_voice: 'Voz individual',
  literary_voice: 'Voz literária',
  contextual_corpus: 'Corpus de apoio — não convocado como pessoa',
};

/* ---- Referências-base (DEC-CUR-04) ---- */

export type SituacaoConferencia = 'metadados_confirmados' | 'edicao_a_confirmar' | 'a_confirmar';
export type TipoFonte =
  | 'obra_autoral'
  | 'obra_autoral_traduzida'
  | 'compilacao_postuma'
  | 'memorias_editadas'
  | 'divulgacao_cientifica'
  | 'testemunho';

/** Referência bibliográfica de uma pessoa. `source_witness_for` = testemunho de terceiro sobre a pessoa (caso de Sócrates). */
export interface ReferenciaBase {
  workId: string;
  pessoa: string;
  relacao: 'autor_de' | 'source_witness_for';
  titulo: string;
  tituloOriginal: string | null;
  autores: string[];
  organizador: string | null;
  tradutor: string | null;
  editora: string | null;
  ano: string | null;
  edicao: string | null;
  isbn: string | null;
  doi: string | null;
  url: string | null;
  idioma: string | null;
  tipoFonte: TipoFonte;
  conferencia: { situacao: SituacaoConferencia; fonte: string; registro: string; confirmado: string; lacunas: string[] };
  notaAtribuicao: string;
}

export const SITUACAO_CONFERENCIA: Record<SituacaoConferencia, string> = {
  metadados_confirmados: 'Metadados conferidos na página do editor ou em registro institucional',
  edicao_a_confirmar: 'Obra identificada; edição e tradução a confirmar',
  a_confirmar: 'Metadados a confirmar',
};

export const TIPO_FONTE: Record<TipoFonte, string> = {
  obra_autoral: 'Obra autoral',
  obra_autoral_traduzida: 'Obra autoral (tradução)',
  compilacao_postuma: 'Compilação póstuma',
  memorias_editadas: 'Memórias editadas por terceiro',
  divulgacao_cientifica: 'Divulgação científica',
  testemunho: 'Testemunho de terceiro',
};

/* ---- Vínculos pessoa–tradição–corpus (DEC-CUR-02 e DEC-CUR-03) ---- */

export type TipoVinculo = 'pertence_a' | 'formado_em' | 'representa_institucionalmente' | 'lider_de_toda_tradicao';
export type SituacaoVinculo = 'sustentado_por_fonte' | 'a_confirmar' | 'nao_afirmar';

export interface Vinculo {
  id: string;
  pessoa: string;
  alvo: string;
  tipo: TipoVinculo;
  situacao: SituacaoVinculo;
  fonte: string | null;
  trecho: string | null;
  nota: string;
}

/** Corpus que contextualiza uma perspectiva individual, sem virar segunda voz. */
export interface ApoioContextual {
  corpus: string;
  pessoa: string;
  recorte: string;
  papel: string;
  status: ValidationStatus;
}

export const TIPO_VINCULO: Record<TipoVinculo, string> = {
  pertence_a: 'Pertence à tradição',
  formado_em: 'Formado na tradição',
  representa_institucionalmente: 'Representa institucionalmente',
  lider_de_toda_tradicao: 'Líder de toda a tradição',
};

export const SITUACAO_VINCULO: Record<SituacaoVinculo, string> = {
  sustentado_por_fonte: 'Sustentado por fonte',
  a_confirmar: 'A confirmar',
  nao_afirmar: 'Não afirmar',
};

export const universos = universosJson as unknown as UniversoInfo[];
export const candidatos = (candidatosJson as unknown as { candidatos: Candidato[] }).candidatos;
export const tradicoes = (tradicoesJson as unknown as { tradicoes: TradicaoCorpus[] }).tradicoes;
export const classificacoes = (classificacaoJson as unknown as { entradas: Classificacao[] }).entradas;
export const taxonomia = (classificacaoJson as unknown as { taxonomia: TaxonomiaInfo }).taxonomia;
export const mapaDoc12 = (doc12Json as unknown as { integrantes: { doc12Id: string; id: string }[] }).integrantes;
export const evidencias = (evidenciasJson as unknown as { evidencias: EvidenciaRelacao[] }).evidencias;
export const referenciasBase = (referenciasJson as unknown as { referencias: ReferenciaBase[] }).referencias;
export const vinculos = (vinculosJson as unknown as { vinculos: Vinculo[] }).vinculos;
export const apoios = (vinculosJson as unknown as { apoios: ApoioContextual[] }).apoios;

export const referenciasDe = (pessoa: string) => referenciasBase.filter((r) => r.pessoa === pessoa);
export const vinculosDe = (pessoa: string) => vinculos.filter((v) => v.pessoa === pessoa);
export const apoiosDe = (pessoa: string) => apoios.filter((a) => a.pessoa === pessoa);
export const apoiadosPor = (corpus: string) => apoios.filter((a) => a.corpus === corpus);

/** Papel derivado do tipo de participação: tradição/corpus e escola/corrente são corpus de apoio. */
export function papelDoTipo(tipo: TipoParticipacao): PapelSelecao {
  if (tipo === 'tradicao-corpus' || tipo === 'escola-corrente') return 'contextual_corpus';
  if (tipo === 'voz-literaria-artistica') return 'literary_voice';
  return 'individual_voice';
}

/** Papel de um registro do catálogo. Sem classificação, um registro de `kind: tradicao` continua corpus. */
export function papelDoRegistro(t: Pick<Thinker, 'id' | 'kind'>): PapelSelecao {
  const c = classificacaoIndex.get(t.id);
  if (c) return papelDoTipo(c.tipo);
  return t.kind === 'tradicao' ? 'contextual_corpus' : 'individual_voice';
}

/** Universo principal (primeiro da lista), usado só na regra de diversidade da seleção. */
export const universoPrincipal = (id: string): Universo | undefined => classificacaoIndex.get(id)?.universos[0];

/** Disponibilidade de fonte de um registro, de 0 a 1 (critério "fontes" da política v2):
 *  obra no catálogo ou referência-base com metadados conferidos = 1; referência-base ainda a conferir = 0,5; nada = 0.
 *  É disponibilidade de fonte do autor, não validação de nenhuma relação com virtude. */
export function qualidadeDaFonte(t: Pick<Thinker, 'id' | 'workIds'>, lista: ReferenciaBase[] = referenciasBase): number {
  if (t.workIds.length) return 1;
  const refs = lista.filter((r) => r.pessoa === t.id);
  if (refs.some((r) => r.conferencia.situacao === 'metadados_confirmados')) return 1;
  return refs.length ? 0.5 : 0;
}

const classificacaoIndex = new Map(classificacoes.map((c) => [c.id, c]));
const candidatoIndex = new Map(candidatos.map((c) => [c.id, c]));
const tradicaoIndex = new Map(tradicoes.map((t) => [t.id, t]));

export const getClassificacao = (id: string) => classificacaoIndex.get(id);
export const getCandidato = (id: string) => candidatoIndex.get(id);
export const getTradicao = (id: string) => tradicaoIndex.get(id);
export const getUniverso = (id: string) => universos.find((u) => u.id === id);

export const TIPO_PARTICIPACAO: Record<TipoParticipacao, { nome: string; descricao: string }> = {
  'pensador-individual': { nome: 'Pensador', descricao: 'Pessoa com corpus autoral identificável.' },
  'perspectiva-cientifica-profissional': { nome: 'Perspectiva científica ou profissional', descricao: 'Contribuição baseada em pesquisa, prática ou teoria de um campo.' },
  'voz-literaria-artistica': { nome: 'Voz literária ou artística', descricao: 'Autor cuja obra oferece representação, narrativa ou experiência estética.' },
  'tradicao-corpus': { nome: 'Tradição ou corpus', descricao: 'Conjunto histórico de textos, práticas e interpretações. Não é uma pessoa.' },
  'escola-corrente': { nome: 'Escola ou corrente', descricao: 'Conjunto de ideias com diversidade interna e história própria. Não é uma pessoa.' },
};

export const NIVEL_FUNDAMENTACAO: Record<NivelFundamentacao, { nome: string; criterio: string }> = {
  F1: { nome: 'Fundamentação textual direta', criterio: 'Obra ou fonte identificada trata explicitamente do conceito ou da virtude.' },
  F2: { nome: 'Fundamentação conceitual consistente', criterio: 'A relação decorre de conceito central da obra, com explicação contextual.' },
  F3: { nome: 'Interpretação curatorial', criterio: 'Aplicação pedagógica plausível, identificada como interpretação.' },
  F4: { nome: 'Fundamentação insuficiente', criterio: 'Relação vaga, anacrônica, contraditória ou sem fonte adequada.' },
};

export const ORIGEM_CANDIDATO: Record<OrigemCandidato, string> = {
  doc12: 'Integrante do Documento 12 ainda não incorporado ao app',
  'doc14-prioritario': 'Candidato prioritário (Documento 14, seção 7.1)',
  'doc14-pesquisa': 'Candidato para pesquisa complementar (Documento 14, seção 7.2)',
  'doc14-literaria': 'Voz literária (Documento 14, seção 7.3)',
};

/** Tradições e escolas não são pessoas, mesmo quando registradas como integrante no catálogo original. */
export function ehTradicao(id: string): boolean {
  const tipo = getClassificacao(id)?.tipo ?? getCandidato(id)?.tipo ?? getTradicao(id)?.tipo;
  return tipo === 'tradicao-corpus' || tipo === 'escola-corrente' || getThinker(id)?.kind === 'tradicao';
}

/* ------------------------------------------------------------------------- */
/* Evidências e elegibilidade das relações                                    */
/* ------------------------------------------------------------------------- */

const STATUS_FORA_DE_USO: ValidationStatus[] = ['suspensa', 'rejeitada'];
const LOCALIZACAO_PENDENTE = /^\s*(a confirmar|)\s*$/i;

export function evidenciasDaRelacao(relacaoId: string, lista: EvidenciaRelacao[] = evidencias): EvidenciaRelacao[] {
  return lista.filter((e) => e.relacaoId === relacaoId);
}

/** A relação pode fundamentar uma perspectiva? Não, se estiver suspensa ou rejeitada, ou se
 *  alguma evidência registrada a classificou como F4 (fundamentação insuficiente). */
export function relacaoUtilizavel(relacao: ThinkerVirtue, lista: EvidenciaRelacao[] = evidencias): boolean {
  if (STATUS_FORA_DE_USO.includes(relacao.status)) return false;
  return !evidenciasDaRelacao(relacao.id, lista).some((e) => e.nivel === 'F4');
}

/** Problemas de uma evidência, segundo o Documento 14 (seções 9.1 a 9.3). Lista vazia = consistente. */
export function problemasDaEvidencia(
  e: EvidenciaRelacao,
  ctx: { relacoes?: ThinkerVirtue[]; obraExiste?: (id: string) => boolean } = {},
): string[] {
  const relacoes = ctx.relacoes ?? thinkerVirtues;
  const obraExiste = ctx.obraExiste ?? ((id: string) => Boolean(getWork(id)));
  const p: string[] = [];
  if (!relacoes.some((r) => r.id === e.relacaoId)) p.push('relação inexistente');
  if (e.obraId && !obraExiste(e.obraId)) p.push('obra inexistente no catálogo');
  const temObra = Boolean(e.obraId || e.obraDescricao?.trim());
  const localizacaoConferida = !LOCALIZACAO_PENDENTE.test(e.localizacao ?? '');
  if ((e.nivel === 'F1' || e.nivel === 'F2') && !temObra) p.push(`${e.nivel} exige obra específica`);
  if (e.nivel === 'F1' && (!localizacaoConferida || !e.revisor)) p.push('F1 exige localização conferida e revisor');
  if (e.status === 'validada') {
    if (!e.justificativa?.trim()) p.push('validada sem justificativa individualizada');
    if (!temObra) p.push('validada sem obra');
    if (!localizacaoConferida) p.push('validada com localização a confirmar');
    if (!e.nivel || e.nivel === 'F4') p.push('validada sem nível F1–F3');
    if (!e.revisor || !e.dataRevisao) p.push('validada sem revisor e data');
  }
  return p;
}

/** Uma relação só pode constar como validada se tiver ao menos uma evidência validada e consistente. */
export function validacaoTemFonte(relacao: ThinkerVirtue, lista: EvidenciaRelacao[] = evidencias): boolean {
  if (relacao.status !== 'validada') return true;
  return evidenciasDaRelacao(relacao.id, lista).some((e) => e.status === 'validada' && problemasDaEvidencia(e).length === 0);
}

/* ------------------------------------------------------------------------- */
/* Tradição e autores: não contar como vozes independentes                    */
/* ------------------------------------------------------------------------- */

/** Pares de registros do catálogo que não devem ser convocados juntos como vozes independentes
 *  (registro da tradição × autor nomeado no Documento 14). Simétrico. */
export function paresNaoIndependentes(lista: TradicaoCorpus[] = tradicoes): Map<string, Set<string>> {
  const pares = new Map<string, Set<string>>();
  const ligar = (a: string, b: string) => pares.set(a, new Set([...(pares.get(a) ?? []), b]));
  for (const t of lista) {
    for (const registro of t.registrosNoCatalogo) {
      for (const autor of t.autoresRelacionados) {
        ligar(registro, autor);
        ligar(autor, registro);
      }
    }
  }
  return pares;
}

/* ------------------------------------------------------------------------- */
/* Acervo: visão única para a biblioteca de perspectivas                      */
/* ------------------------------------------------------------------------- */

export type CategoriaAcervo = 'integrante' | 'referencia' | 'candidato' | 'tradicao';

export interface EntradaAcervo {
  id: string;
  nome: string;
  categoria: CategoriaAcervo;
  tipo: TipoParticipacao;
  universos: Universo[];
  /** Participa da seleção do Conselho (campo `council` do catálogo original). */
  habilitado: boolean;
  /** Convocável como voz pelo Conselho: habilitado e não é corpus de apoio (DEC-CUR-02). */
  convocavel: boolean;
  papel: PapelSelecao;
  status: ValidationStatus;
  /** Tradição/campo como texto (catálogo original, Doc. 12 ou Doc. 14). */
  campo: string;
  resumo: string;
  doc12Id?: string;
  thinker?: Thinker;
  candidato?: Candidato;
  tradicao?: TradicaoCorpus;
}

const doc12PorId = new Map(mapaDoc12.map((m) => [m.id, m.doc12Id]));

export function entradasDoAcervo(): EntradaAcervo[] {
  const doCatalogo: EntradaAcervo[] = thinkers.map((t) => {
    const c = getClassificacao(t.id);
    return {
      id: t.id,
      nome: t.name,
      categoria: t.council ? 'integrante' : 'referencia',
      tipo: c?.tipo ?? (t.kind === 'tradicao' ? 'tradicao-corpus' : 'pensador-individual'),
      universos: c?.universos ?? [],
      habilitado: t.council,
      convocavel: t.council && papelDoRegistro(t) !== 'contextual_corpus',
      papel: papelDoRegistro(t),
      status: t.status,
      campo: t.tradition,
      resumo: t.field,
      doc12Id: doc12PorId.get(t.id),
      thinker: t,
    };
  });
  const propostos: EntradaAcervo[] = candidatos.map((c) => ({
    id: c.id, nome: c.nome, categoria: 'candidato', tipo: c.tipo, universos: c.universos, habilitado: false, convocavel: false, papel: papelDoTipo(c.tipo),
    status: c.status, campo: c.campo, resumo: c.contribuicao, doc12Id: c.doc12Id, candidato: c,
  }));
  const corpora: EntradaAcervo[] = tradicoes.map((t) => ({
    id: t.id, nome: t.nome, categoria: 'tradicao', tipo: t.tipo, universos: t.universos, habilitado: false, convocavel: false, papel: papelDoTipo(t.tipo),
    status: t.status, campo: t.escopo, resumo: t.cuidado, tradicao: t,
  }));
  return [...doCatalogo, ...propostos, ...corpora];
}
