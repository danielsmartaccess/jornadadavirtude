/* Ligação entre a interface e a camada de aplicação (Documento 08, seção 6.2).
 * Os hooks só leem estado e encaminham casos de uso; as regras ficam no domínio. */
import { createContext, useCallback, useContext, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { DomainError } from '../application/useCases';
import type { UserData } from '../domain/types';
import { store } from '../infrastructure/localRepository';
import { getSyncState, subscribeSync } from '../infrastructure/sync';

export const useUserData = () => useSyncExternalStore(store.subscribe, store.getData);
export const useStoreMeta = () => useSyncExternalStore(store.subscribe, store.getMeta);
export const useSync = () => useSyncExternalStore(subscribeSync, getSyncState);

/* ------------------------------------------------------------------------- */
/* Mensagens de retorno (toast): sucesso e erro refletem o que realmente houve */
/* ------------------------------------------------------------------------- */

type ToastKind = 'ok' | 'erro';
interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

const ToastContext = createContext<(text: string, kind?: ToastKind) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const notify = useCallback((text: string, kind: ToastKind = 'ok') => {
    const id = nextId.current++;
    setToasts((list) => [...list.slice(-2), { id, kind, text }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), kind === 'erro' ? 7000 : 3500);
  }, []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="no-print fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6" aria-live="polite">
        {toasts.map((t) => (
          <p
            key={t.id}
            role={t.kind === 'erro' ? 'alert' : 'status'}
            className={`revelar max-w-xl border px-4 py-2 font-mono text-meta shadow-lg ${t.kind === 'erro' ? 'border-accent bg-paper text-ink' : 'border-ink bg-ink text-paper'}`}
          >
            {t.kind === 'erro' ? '⚠ ' : '✓ '}
            {t.text}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const SAVE_FAILED = 'Não foi possível gravar neste navegador. A alteração vale só enquanto esta página estiver aberta: exporte seus dados em Configurações.';

/** Executa um caso de uso e informa o resultado real da gravação (RF-128, RF-129, CT-013). */
export function useRun() {
  const toast = useToast();
  return useCallback(
    (change: (data: UserData) => UserData, success?: string): boolean => {
      try {
        const saved = store.update(change);
        if (!saved) toast(SAVE_FAILED, 'erro');
        else if (success) toast(success);
        return true;
      } catch (error) {
        if (error instanceof DomainError) {
          toast(error.message, 'erro');
          return false;
        }
        throw error;
      }
    },
    [toast],
  );
}
