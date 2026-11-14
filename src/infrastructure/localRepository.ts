/* Persistência local (ADR-009 do Documento 08).
 *
 * Decisão registrada: o MVP usa localStorage. O volume é pequeno (texto de um único
 * usuário, na casa dos kilobytes), cada gravação substitui o retrato inteiro de forma
 * atômica e a leitura síncrona dispensa estados de carregamento. IndexedDB foi avaliado
 * e fica para quando houver anexos, volume ou consultas que o justifiquem; a troca é
 * feita aqui, atrás do contrato UserDataRepository, sem tocar no restante do sistema. */
import { defaultMeta, createStore, type StoreMeta, type UserDataRepository } from '../application/store';
import type { UserData } from '../domain/types';
import { isLegacyData, LEGACY_KEY, migrateLegacy } from './legacy';
import { emptyData, sanitizeUserData } from './sanitize';

export const DATA_KEY = 'jornada-virtude-v4';
export const META_KEY = 'jornada-virtude-v4-meta';

export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function createLocalRepository(storage: KeyValueStorage | null): UserDataRepository {
  function read(key: string): unknown {
    try {
      const text = storage?.getItem(key);
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  }

  function write(key: string, value: unknown): boolean {
    if (!storage) return false;
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  return {
    load() {
      let meta: StoreMeta = { ...defaultMeta(), ...(read(META_KEY) as Partial<StoreMeta> | null) };
      const stored = read(DATA_KEY);
      if (stored) return { data: sanitizeUserData(stored), meta };

      /* Dados da versão anterior neste navegador: convertidos e mantidos na chave antiga. */
      const legacy = read(LEGACY_KEY);
      if (isLegacyData(legacy)) {
        const data: UserData = migrateLegacy(legacy).data;
        meta = { ...meta, legacyMigrated: true };
        write(DATA_KEY, data);
        write(META_KEY, meta);
        return { data, meta };
      }
      return { data: emptyData(), meta };
    },
    save: (data) => write(DATA_KEY, data),
    saveMeta: (meta) => write(META_KEY, meta),
    clear() {
      try {
        storage?.removeItem(DATA_KEY);
        storage?.removeItem(META_KEY);
      } catch {
        /* armazenamento indisponível: o estado em memória já foi limpo */
      }
    },
    persistent: () => storage !== null,
    empty: emptyData,
  };
}

function browserStorage(): KeyValueStorage | null {
  try {
    const probe = '__jv_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Instância única usada pela aplicação no navegador. */
export const store = createStore(createLocalRepository(typeof window === 'undefined' ? null : browserStorage()));
