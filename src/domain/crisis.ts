/* Sinais de risco no texto levado ao Conselho de Sabedoria.
 *
 * O Conselho não substitui apoio profissional (Doc. 04, Regra 8; Doc. 13 v2, seção 13):
 * quando o texto menciona um destes sinais, o fluxo comum de deliberação não é executado.
 * É uma verificação por termos, não uma avaliação clínica ou psicológica: não classifica a
 * pessoa nem estima risco, apenas decide que a reflexão filosófica não é o caminho adequado.
 *
 * Fica fora de council.ts para que a camada de aplicação (casos de uso, no pacote principal)
 * possa aplicar a regra sem carregar o motor do Conselho e o catálogo de pensadores. */
import { normalize } from '../shared/util';

/* Critérios mantidos como estavam em council.ts. */
const CRISIS_TERMS = [
  'suicid', 'me matar', 'tirar minha vida', 'tirar a minha vida', 'acabar com minha vida', 'acabar com a minha vida',
  'nao quero mais viver', 'nao aguento mais viver', 'quero morrer', 'automutil', 'me machucar', 'me cortar',
  'abuso sexual', 'estupr', 'violencia domestica', 'me bate', 'me agride', 'ameaca de morte',
];

export function detectCrisis(text: string): boolean {
  const normalized = normalize(text);
  return CRISIS_TERMS.some((term) => normalized.includes(term));
}

/** Avalia tudo o que a pessoa escreveu para convocar o Conselho: a situação e a dúvida.
 *  A quebra de linha entre os dois impede que o fim de um campo e o começo do outro formem
 *  um termo que não está em nenhum deles. */
export function isCrisisInput(situation: string, doubt = ''): boolean {
  return detectCrisis(`${situation}\n${doubt}`);
}
