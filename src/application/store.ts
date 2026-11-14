/* Estado dos dados do usuário e contrato de persistência (Documento 08, seção 11).
 * A aplicação depende do contrato UserDataRepository, não de uma tecnologia: hoje a
 * implementação é localStorage (infrastructure/localRepository.ts); trocar por
 * IndexedDB ou por um backend não muda os casos de uso nem as telas. */
import type { UserData } from '../domain/types';

export interface StoreMeta {
  /** Conta à qual os dados locais estão vinculados (null = nunca sincronizado). */
  userId: string | null;
  /** Última revisão da nuvem conhecida por este aparelho. */
  revision: number;
  /** Há alterações locais ainda não enviadas. */
  dirty: boolean;
  /** Os dados vieram da versão anterior do aplicativo neste mesmo navegador. */
  legacyMigrated: boolean;
}

export const defaultMeta = (): StoreMeta => ({ userId: null, revision: 0, dirty: false, legacyMigrated: false });

export interface UserDataRepository {
  /** Devolve os dados já validados (ou vazios) e os metadados. */
  load(): { data: UserData; meta: StoreMeta };
  /** false quando a gravação falhou: a tela não pode tratar o dado como salvo (CT-013). */
  save(data: UserData): boolean;
  saveMeta(meta: StoreMeta): boolean;
  clear(): void;
  /** false quando o navegador não permite persistir (dados valem só nesta sessão). */
  persistent(): boolean;
  empty(): UserData;
}

export function createStore(repository: UserDataRepository) {
  const listeners = new Set<() => void>();
  let { data, meta } = repository.load();
  let version = 0;

  const notify = () => listeners.forEach((listener) => listener());

  /** Grava um novo estado. Devolve false se a persistência falhou. */
  function commit(next: UserData, options: { fromSync?: boolean } = {}): boolean {
    if (next === data) return true;
    data = next;
    version++;
    const ok = repository.save(data);
    if (!options.fromSync && !meta.dirty) {
      meta = { ...meta, dirty: true };
      repository.saveMeta(meta);
    }
    notify();
    return ok;
  }

  return {
    getData: () => data,
    getMeta: () => meta,
    /** Muda a cada alteração de dados: usado para detectar edições durante um envio. */
    getVersion: () => version,
    persistent: () => repository.persistent(),

    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    commit,

    /** Aplica um caso de uso. Erros de regra de negócio sobem para quem chamou. */
    update(change: (current: UserData) => UserData): boolean {
      return commit(change(data));
    },

    setMeta(patch: Partial<StoreMeta>) {
      meta = { ...meta, ...patch };
      repository.saveMeta(meta);
      notify();
    },

    /** Apaga os dados deste aparelho (não afeta a nuvem). */
    clear() {
      data = repository.empty();
      version++;
      meta = defaultMeta();
      repository.clear();
      notify();
    },
  };
}

export type Store = ReturnType<typeof createStore>;
