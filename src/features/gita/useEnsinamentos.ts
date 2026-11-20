/* Carrega os Ensinamentos de Krishna e expõe o estado da leitura. */
import { useCallback, useEffect, useState } from 'react';
import type { ItemEnsinamento } from '../../domain/gita';
import { carregarEnsinamentos } from '../../infrastructure/ensinamentosContent';

export type EstadoEnsinamentos = { estado: 'carregando' } | { estado: 'pronto'; itens: ItemEnsinamento[] } | { estado: 'erro'; mensagem: string };

export function useEnsinamentos(): { ensinamentos: EstadoEnsinamentos; tentarDeNovo: () => void } {
  const [ensinamentos, setEnsinamentos] = useState<EstadoEnsinamentos>({ estado: 'carregando' });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controle = new AbortController();
    setEnsinamentos({ estado: 'carregando' });
    carregarEnsinamentos(controle.signal)
      .then((itens) => setEnsinamentos({ estado: 'pronto', itens }))
      .catch((erro: unknown) => {
        if (controle.signal.aborted) return;
        setEnsinamentos({ estado: 'erro', mensagem: erro instanceof Error ? erro.message : 'Não foi possível carregar o conteúdo.' });
      });
    return () => controle.abort();
  }, [tentativa]);

  const tentarDeNovo = useCallback(() => setTentativa((t) => t + 1), []);
  return { ensinamentos, tentarDeNovo };
}
