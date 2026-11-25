/* Rótulos da página de detalhe do Conselho (DH-T-12): a interface diz só o que sabe.
 * Funções puras, sem JSX, para poderem ser testadas com todos os casos. Nada aqui altera dados nem seleção:
 * cada regra lê um campo que já existe no modelo e, sem o campo, não afirma nada. */
import { papelDoRegistro, type ReferenciaBase } from '../../domain/curadoria';
import type { Thinker } from '../../domain/types';

/* ---- DH-T-12-A: redação uniforme, sem decidir se a página abriu ----
 * Todas as referências mostram "Referência indicada na conferência" (texto fixo em `ReferenciaItem`). O modelo não registra
 * o resultado do acesso: `conferencia` só tem `situacao`, `fonte`, `registro`, `confirmado` e `lacunas`.
 * `situacao = a_confirmar` quer dizer "metadados ainda não confirmados", não "página inacessível". O HTTP 403 só aparece
 * em `registro`, que é texto livre, e não pode ser lido por código. Por isso não há rótulo condicional. */

/* ---- DH-T-12-D: confiabilidade da fonte lida do dado ---- */

const CONFIABILIDADE: Record<NonNullable<ReferenciaBase['confiabilidade']>['situacao'], string> = {
  nao_avaliada: 'não avaliada (sem rubrica aprovada; não é inferida da falta de metadados)',
};

/** Frase de confiabilidade a partir de `confiabilidade.situacao`. Sem o campo, ou com um valor que o modelo não define,
 *  devolve `null`: ausência de dado não vira "não avaliada" nem qualquer outro estado. */
export function textoConfiabilidade(r: Pick<ReferenciaBase, 'confiabilidade'>): string | null {
  const descricao = r.confiabilidade ? (CONFIABILIDADE as Record<string, string | undefined>)[r.confiabilidade.situacao] : undefined;
  return descricao ? `Confiabilidade da fonte: ${descricao}` : null;
}

/* ---- DH-T-12-B: vocabulário conforme o tipo do registro ---- */

export interface TermosDoRegistro {
  /** "relacionadas a ___ na base" */
  relacionadoA: string;
  /** "não de uma classificação ___" */
  classificacaoDe: string;
  /** "Nenhuma obra ... para ___" */
  paraEste: string;
  /** "valem para ___ como um todo" */
  valemPara: string;
}

/** Tradição, escola e corpus (papel `contextual_corpus`) não são pessoas: o texto fica neutro. Para os demais registros
 *  o texto de pessoa continua exatamente como era. O discriminador é o que o motor de seleção já usa (`papelDoRegistro`). */
export function termosDoRegistro(t: Pick<Thinker, 'id' | 'kind'>): TermosDoRegistro {
  return papelDoRegistro(t) === 'contextual_corpus'
    ? { relacionadoA: 'este registro', classificacaoDe: 'do seu conteúdo', paraEste: 'este registro', valemPara: 'este registro' }
    : { relacionadoA: 'este pensador', classificacaoDe: 'do seu pensamento', paraEste: 'este integrante', valemPara: 'o integrante' };
}

/* DH-T-12-C ("Ver perfil no Conselho") está em `acaoPerfil.ts`, sem importar a camada curatorial. */
