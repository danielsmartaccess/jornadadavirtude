/* Estado do menu de capítulos da Gita.
 *  - recolhido: preferência no computador (menu lateral oculto para ampliar a leitura); fica guardada
 *    no navegador. Se o armazenamento estiver bloqueado, vale só nesta visita.
 *  - aberto: lista de capítulos no celular, sempre fechada ao abrir a página. */
import { useCallback, useState } from 'react';

const CHAVE = 'jv-gita-menu';

function lerRecolhido(): boolean {
  try {
    return localStorage.getItem(CHAVE) === 'recolhido';
  } catch {
    return false;
  }
}

function guardarRecolhido(recolhido: boolean) {
  try {
    if (recolhido) localStorage.setItem(CHAVE, 'recolhido');
    else localStorage.removeItem(CHAVE);
  } catch {
    /* a preferência vale só nesta visita */
  }
}

export interface MenuCapitulos {
  recolhido: boolean;
  aberto: boolean;
  alternarRecolhido: () => void;
  alternarAberto: () => void;
  fecharAberto: () => void;
}

export function useMenuCapitulos(): MenuCapitulos {
  const [recolhido, setRecolhido] = useState(lerRecolhido);
  const [aberto, setAberto] = useState(false);

  const alternarRecolhido = useCallback(() => {
    const proximo = !recolhido;
    setRecolhido(proximo);
    guardarRecolhido(proximo);
  }, [recolhido]);
  const alternarAberto = useCallback(() => setAberto((v) => !v), []);
  const fecharAberto = useCallback(() => setAberto(false), []);

  return { recolhido, aberto, alternarRecolhido, alternarAberto, fecharAberto };
}
