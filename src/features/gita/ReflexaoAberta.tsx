/* Reflexão aberta da etapa de reflexão: a pessoa escreve e a resposta é guardada em registros,
 * ligada à conta (RLS: só o dono lê). Sem conta, a leitura e o quiz seguem funcionando e a tela
 * explica como guardar. Várias reflexões por etapa são permitidas; cada uma pode ser apagada. */
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSync } from '../../app/hooks';
import { ConfirmButton, Notice, TextArea } from '../../components/ui';
import { LIMITE_REFLEXAO, validarReflexao } from '../../domain/gita';
import { apagarRegistro, criarRegistro, listarRegistros, type RegistroGita } from '../../infrastructure/registrosGita';

const quando = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const mensagemDe = (erro: unknown) => (erro instanceof Error ? erro.message : 'Algo deu errado. Tente de novo.');

export function ReflexaoAberta({ etapaId }: { etapaId: number }) {
  const sync = useSync();
  if (!sync.configured) return null;
  if (!sync.ready) return <p className="hint">Verificando sua conta…</p>;
  if (!sync.user) {
    return (
      <Notice title="Guardar sua reflexão">
        Para guardar o que você escrever, entre na sua conta em <Link to="/configuracoes">Configurações</Link>. A conta é opcional: a leitura e o quiz funcionam sem ela.
      </Notice>
    );
  }
  return <Registros etapaId={etapaId} userId={sync.user.id} />;
}

function Registros({ etapaId, userId }: { etapaId: number; userId: string }) {
  const [registros, setRegistros] = useState<RegistroGita[] | null>(null);
  const [texto, setTexto] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(() => {
    let ativo = true;
    setErro('');
    listarRegistros(etapaId)
      .then((lista) => ativo && setRegistros(lista))
      .catch((e: unknown) => {
        if (!ativo) return;
        setRegistros([]);
        setErro(mensagemDe(e));
      });
    return () => {
      ativo = false;
    };
  }, [etapaId]);

  useEffect(() => carregar(), [carregar, userId]);

  const validacao = validarReflexao(texto);

  async function guardar() {
    if (!validacao.ok || salvando) return;
    setSalvando(true);
    setErro('');
    setAviso('');
    try {
      const novo = await criarRegistro(userId, etapaId, validacao.texto);
      setRegistros((lista) => [novo, ...(lista ?? [])]);
      setTexto('');
      setAviso('Reflexão guardada.');
    } catch (e) {
      setErro(mensagemDe(e));
    } finally {
      setSalvando(false);
    }
  }

  async function apagar(id: string) {
    setErro('');
    setAviso('');
    try {
      await apagarRegistro(id);
      setRegistros((lista) => (lista ?? []).filter((r) => r.id !== id));
      setAviso('Reflexão apagada.');
    } catch (e) {
      setErro(mensagemDe(e));
    }
  }

  return (
    <div className="my-4">
      <TextArea
        label="Sua reflexão"
        value={texto}
        onChange={(v) => {
          setTexto(v);
          setAviso('');
        }}
        rows={5}
        hint={`Fica guardada na nuvem, ligada à sua conta; só você consegue ler. ${texto.trim().length}/${LIMITE_REFLEXAO}`}
        error={!validacao.ok && texto.trim() ? validacao.erro : undefined}
      />
      <button type="button" className="btn" disabled={!validacao.ok || salvando} onClick={() => void guardar()}>
        {salvando ? 'Guardando…' : 'Guardar reflexão'}
      </button>
      <div role="status" aria-live="polite" className="mt-2 min-h-6 text-[0.95rem]">
        {aviso}
      </div>
      {erro && (
        <p role="alert" className="text-accent">
          ⚠ {erro}
        </p>
      )}

      {registros && registros.length > 0 && (
        <section aria-label="Suas reflexões anteriores" className="mt-4">
          <p className="label mb-2">Suas reflexões anteriores</p>
          <ul className="m-0 list-none p-0">
            {registros.map((r) => (
              <li key={r.id} className="entry mb-3">
                <p className="meta">{quando(r.criadoEm)}</p>
                <p className="whitespace-pre-wrap">{r.texto}</p>
                <ConfirmButton label="Apagar" confirmLabel="Confirmar exclusão" onConfirm={() => void apagar(r.id)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
