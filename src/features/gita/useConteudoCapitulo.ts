/* Carrega o conteúdo de um capítulo e expõe o estado da leitura. */
import { useCallback, useEffect, useState } from 'react';
import type { ConteudoEtapa } from '../../domain/gita';
import { carregarCapitulo } from '../../infrastructure/gitaContent';

export type EstadoConteudo = { estado: 'carregando' } | { estado: 'pronto'; etapas: ConteudoEtapa[] } | { estado: 'erro'; mensagem: string };

export function useConteudoCapitulo(numero: number): { conteudo: EstadoConteudo; tentarDeNovo: () => void } {
  const [conteudo, setConteudo] = useState<EstadoConteudo>({ estado: 'carregando' });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controle = new AbortController();
    setConteudo({ estado: 'carregando' });
    carregarCapitulo(numero, controle.signal)
      .then((etapas) => setConteudo({ estado: 'pronto', etapas }))
      .catch((erro: unknown) => {
        if (controle.signal.aborted) return;
        setConteudo({ estado: 'erro', mensagem: erro instanceof Error ? erro.message : 'Não foi possível carregar o conteúdo.' });
      });
    return () => controle.abort();
  }, [numero, tentativa]);

  const tentarDeNovo = useCallback(() => setTentativa((t) => t + 1), []);
  return { conteudo, tentarDeNovo };
}
