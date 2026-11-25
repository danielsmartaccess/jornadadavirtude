/* DH-T-12-C: quando a página da virtude oferece "Ver perfil no Conselho".
 * Fica fora de `rotulos.ts` de propósito: este módulo não importa a camada curatorial, porque a página da virtude
 * não deve carregar esses dados (eles ficam só no chunk do Conselho; ver ADR-CUR-05). Um teste confere que a regra
 * coincide com o discriminador do motor de seleção (`papelDoRegistro`) nos 42 registros do catálogo. */
import type { Thinker } from '../../domain/types';

/** O perfil só é oferecido a quem é integrante do Conselho e não é tradição, escola nem corpus (`kind: 'tradicao'`):
 *  esses registros são corpus de apoio, não integrantes individuais convocáveis. A flag histórica `council: true` de
 *  Tradições budistas, por si só, não basta. */
export function temAcaoVerPerfil(t: Pick<Thinker, 'kind' | 'council'>): boolean {
  return t.council && t.kind !== 'tradicao';
}
