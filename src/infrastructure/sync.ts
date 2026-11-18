/* Conta opcional e sincronização com o Supabase.
 *
 * O aplicativo é local-first: funciona sem conta e sem rede. Ao entrar, os dados
 * locais são reconciliados com a nuvem (ver syncLogic.ts). Cada envio substitui o
 * retrato do usuário de forma atômica (função jv_push_state) e só é aceito se a
 * revisão conhecida por este aparelho ainda for a da nuvem. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { cloudConfigured, SUPABASE_KEY, SUPABASE_URL } from '../config';
import { isEmptyData, sanitizeUserData } from './sanitize';
import { store } from './localRepository';
import { decideSync } from '../application/syncLogic';
import type { UserData } from '../domain/types';

export type SyncStatus = 'local' | 'sincronizando' | 'sincronizado' | 'pendente' | 'conflito' | 'erro';

export interface SyncState {
  configured: boolean;
  /** false enquanto a sessão salva ainda está sendo restaurada. */
  ready: boolean;
  user: { id: string; email: string } | null;
  status: SyncStatus;
  message: string;
  /** Preenchido quando a pessoa precisa escolher entre os dados locais e os da nuvem. */
  conflict: { revision: number; remote: UserData } | null;
}

let state: SyncState = {
  configured: cloudConfigured,
  ready: !cloudConfigured,
  user: null,
  status: 'local',
  message: '',
  conflict: null,
};

const listeners = new Set<() => void>();
let client: SupabaseClient | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pushing = false;

function set(patch: Partial<SyncState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export const getSyncState = () => state;

/** Cliente já autenticado como a pessoa conectada (para tabelas fora do retrato sincronizado,
 * como registros da Gita). Nulo enquanto o cliente não foi iniciado ou sem a nuvem configurada. */
export const getCloudClient = (): SupabaseClient | null => client;
export function subscribeSync(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function describe(error: unknown): string {
  const message = error instanceof Error ? error.message : typeof error === 'object' && error ? String((error as { message?: unknown }).message ?? '') : '';
  if (/Invalid login credentials/i.test(message)) return 'E-mail ou senha incorretos.';
  if (/Email not confirmed/i.test(message)) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (/already registered/i.test(message)) return 'Este e-mail já tem conta. Use "Entrar".';
  if (/Password should be/i.test(message)) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (/rate limit|too many/i.test(message)) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if (/Failed to fetch|NetworkError|network/i.test(message)) return 'Sem conexão com a nuvem. Seus dados continuam salvos neste aparelho.';
  return message || 'Não foi possível concluir a operação.';
}

async function pull(): Promise<{ revision: number; remote: UserData }> {
  const { data, error } = await client!.rpc('jv_pull_state');
  if (error) throw error;
  const payload = (data ?? {}) as { revision?: number; state?: unknown };
  return { revision: Number(payload.revision ?? 0), remote: sanitizeUserData(payload.state) };
}

async function push(expectedRevision: number): Promise<void> {
  if (!client || !state.user || pushing) return;
  pushing = true;
  const userId = state.user.id;
  const versionAtStart = store.getVersion();
  set({ status: 'sincronizando', message: '' });
  try {
    const { data, error } = await client.rpc('jv_push_state', {
      p_state: store.getData(),
      p_expected_revision: expectedRevision,
    });
    if (error) {
      if (/revision_conflict/.test(error.message)) {
        const latest = await pull();
        set({ status: 'conflito', conflict: latest, message: 'Os dados da nuvem mudaram em outro aparelho.' });
        return;
      }
      throw error;
    }
    const changedMeanwhile = store.getVersion() !== versionAtStart;
    store.setMeta({ userId, revision: Number(data), dirty: changedMeanwhile });
    set({ status: changedMeanwhile ? 'pendente' : 'sincronizado', conflict: null, message: '' });
    if (changedMeanwhile) schedulePush();
  } catch (error) {
    set({ status: 'erro', message: describe(error) });
  } finally {
    pushing = false;
  }
}

function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    if (state.user && !state.conflict && store.getMeta().dirty) void push(store.getMeta().revision);
  }, 1500);
}

function adopt(remote: UserData, revision: number) {
  store.commit(remote, { fromSync: true });
  store.setMeta({ userId: state.user!.id, revision, dirty: false });
  set({ status: 'sincronizado', conflict: null, message: '' });
}

/** Compara este aparelho com a nuvem e envia, baixa ou pede uma decisão. */
async function reconcile(): Promise<void> {
  if (!client || !state.user) return;
  set({ status: 'sincronizando', message: '', conflict: null });
  try {
    const latest = await pull();
    const meta = store.getMeta();
    const decision = decideSync({
      localEmpty: isEmptyData(store.getData()),
      remoteEmpty: isEmptyData(latest.remote),
      localUserId: meta.userId,
      userId: state.user.id,
      localRevision: meta.revision,
      remoteRevision: latest.revision,
      dirty: meta.dirty,
    });
    if (decision === 'enviar') {
      await push(latest.revision);
    } else if (decision === 'baixar') {
      adopt(latest.remote, latest.revision);
    } else if (decision === 'conflito') {
      set({ status: 'conflito', conflict: latest, message: 'Este aparelho e a nuvem têm dados diferentes.' });
    } else {
      store.setMeta({ userId: state.user.id, revision: latest.revision, dirty: false });
      set({ status: 'sincronizado' });
    }
  } catch (error) {
    set({ status: 'erro', message: describe(error) });
  }
}

/** Inicia o cliente e restaura a sessão salva. Chamado uma vez, na abertura. */
export async function initSync(): Promise<void> {
  if (!cloudConfigured || client) return;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    client = createClient(SUPABASE_URL, SUPABASE_KEY);
    client.auth.onAuthStateChange((_event, session) => {
      /* Fora do callback, como recomenda o Supabase, para não travar a renovação do token. */
      setTimeout(() => {
        const user = session?.user ? { id: session.user.id, email: session.user.email ?? '' } : null;
        const changed = user?.id !== state.user?.id;
        set({ ready: true, user, ...(user ? {} : { status: 'local' as const, conflict: null }) });
        if (user && changed) void reconcile();
      }, 0);
    });
    store.subscribe(() => {
      if (!state.user || state.conflict || !store.getMeta().dirty) return;
      if (state.status === 'sincronizado') set({ status: 'pendente' });
      schedulePush();
    });
  } catch (error) {
    set({ ready: true, status: 'erro', message: describe(error) });
  }
}

type Result = { ok: boolean; message: string };

async function attempt(action: () => Promise<string>): Promise<Result> {
  if (!client) return { ok: false, message: 'A sincronização não está configurada nesta instalação.' };
  try {
    return { ok: true, message: await action() };
  } catch (error) {
    return { ok: false, message: describe(error) };
  }
}

export const signIn = (email: string, password: string) =>
  attempt(async () => {
    const { error } = await client!.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return 'Você entrou na sua conta.';
  });

export const signUp = (email: string, password: string) =>
  attempt(async () => {
    const { data, error } = await client!.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    return data.session ? 'Conta criada.' : 'Conta criada. Confirme pelo link que enviamos ao seu e-mail e depois entre.';
  });

/** Entrada sem senha; serve também para quem esqueceu a senha. */
export const sendMagicLink = (email: string) =>
  attempt(async () => {
    const { error } = await client!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin, shouldCreateUser: false },
    });
    if (error) throw error;
    return 'Enviamos um link de acesso para o seu e-mail.';
  });

export const signOut = () =>
  attempt(async () => {
    const { error } = await client!.auth.signOut();
    if (error) throw error;
    return 'Você saiu da conta. Os dados continuam neste aparelho.';
  });

export async function syncNow(): Promise<void> {
  if (state.conflict) return;
  await reconcile();
}

/** A pessoa decide qual lado vale quando há divergência. */
export async function resolveConflict(keep: 'local' | 'nuvem'): Promise<void> {
  const conflict = state.conflict;
  if (!conflict || !state.user) return;
  if (keep === 'nuvem') {
    adopt(conflict.remote, conflict.revision);
  } else {
    set({ conflict: null });
    await push(conflict.revision);
  }
}

/** Direito de exclusão (LGPD): apaga os dados da nuvem e sai da conta. */
export const deleteCloudData = () =>
  attempt(async () => {
    // As reflexões da Gita (registros) ficam fora do retrato que jv_delete_my_data apaga.
    if (state.user) {
      const { error: registrosError } = await client!.from('registros').delete().eq('user_id', state.user.id);
      if (registrosError) throw registrosError;
    }
    const { error } = await client!.rpc('jv_delete_my_data');
    if (error) throw error;
    store.setMeta({ userId: null, revision: 0, dirty: false });
    await client!.auth.signOut();
    return 'Seus dados foram apagados da nuvem. A cópia deste aparelho foi mantida.';
  });
