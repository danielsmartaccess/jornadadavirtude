/* Decisão de sincronização ao entrar na conta (pura, testável).
 * Princípio: nunca sobrescrever dados em silêncio. Sempre que os dois lados têm
 * conteúdo e não há como saber qual é o mais recente, a pessoa decide. */

export type SyncDecision = 'nada' | 'enviar' | 'baixar' | 'conflito';

export interface SyncInput {
  localEmpty: boolean;
  remoteEmpty: boolean;
  /** Conta à qual os dados locais já estavam vinculados (null = nunca sincronizado). */
  localUserId: string | null;
  userId: string;
  localRevision: number;
  remoteRevision: number;
  dirty: boolean;
}

export function decideSync(input: SyncInput): SyncDecision {
  const { localEmpty, remoteEmpty, localUserId, userId, localRevision, remoteRevision, dirty } = input;

  if (localEmpty) return remoteEmpty ? 'nada' : 'baixar';

  /* Dados locais pertencem a outra conta: nunca são enviados sem confirmação. */
  if (localUserId !== null && localUserId !== userId) return 'conflito';

  if (localUserId === null) return remoteEmpty ? 'enviar' : 'conflito';

  /* Mesma conta. */
  if (remoteRevision === localRevision) return dirty ? 'enviar' : 'nada';
  if (remoteRevision > localRevision) return dirty ? 'conflito' : 'baixar';
  /* A nuvem regrediu (dados da nuvem foram apagados em outro aparelho, por exemplo). */
  return remoteEmpty ? 'enviar' : 'conflito';
}
