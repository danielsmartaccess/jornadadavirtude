/* Parte final da leitura da Bhagavad Gita: os ensinamentos de Krishna, em sete pontos.
 * Conteúdo transcrito de um quadro de estudo e guardado no Supabase (ensinamentos e ensinamentos_gunas,
 * seed em supabase/seeds/ensinamentos-de-krishna.sql). Nada foi acrescentado ao quadro. */
import { Link } from 'react-router-dom';
import { atraso } from '../../components/movimento';
import { Notice, PageHeader } from '../../components/ui';
import { capitulos, NOTA_ENSINAMENTOS, TITULO_ENSINAMENTOS, type GunaDoQuadro, type ItemEnsinamento } from '../../domain/gita';
import { useEnsinamentos } from './useEnsinamentos';

/** Esquema dos três gunas, redesenhado a partir do quadro: S no alto, R e T nas pontas da base. */
function EsquemaGunas() {
  return (
    <svg viewBox="0 0 240 150" width="240" height="150" role="img" aria-label="Esquema dos três gunas: S no alto, R à esquerda e T à direita" className="max-w-full text-ink">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="120" cy="76" rx="88" ry="40" />
        <circle cx="120" cy="58" r="20" />
        <circle cx="120" cy="50" r="10" />
        <path d="M32 100h176" />
      </g>
      <g fill="currentColor">
        <circle cx="120" cy="36" r="4" />
        <circle cx="32" cy="100" r="4" />
        <circle cx="120" cy="100" r="3" />
        <circle cx="208" cy="100" r="4" />
      </g>
      <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="13" textAnchor="middle">
        <text x="120" y="26">S</text>
        <text x="32" y="124">R</text>
        <text x="208" y="124">T</text>
      </g>
    </svg>
  );
}

function Gunas({ gunas }: { gunas: GunaDoQuadro[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
      <ul className="m-0 grid list-none gap-2 p-0">
        {gunas.map((g) => (
          <li key={g.sigla} className="flex items-baseline gap-3">
            <span className="tag tag-accent" aria-hidden="true">
              {g.sigla}
            </span>
            <span>
              <strong>{g.nome}</strong> ({g.sentido})
            </span>
          </li>
        ))}
      </ul>
      <EsquemaGunas />
    </div>
  );
}

function ListaDeEnsinamentos({ itens }: { itens: ItemEnsinamento[] }) {
  return (
    <ol aria-label="Os sete ensinamentos de Krishna" className="m-0 grid list-none gap-0 p-0">
      {itens.map((item, i) => (
        <li key={item.numero} style={atraso(i)} className="revelar grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-t border-rule py-5 first:border-t-2 first:border-ink">
          <span className="pt-1.5 font-mono text-[13px] tracking-[0.12em] text-accent" aria-hidden="true">
            {String(item.numero).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            {item.linhas.map((linha) => (
              <p key={linha} className="m-0 font-display text-[1.45rem] leading-snug">
                {linha}
              </p>
            ))}
            {item.gunas && <Gunas gunas={item.gunas} />}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function EnsinamentosPage() {
  const ultimo = capitulos[capitulos.length - 1];
  const { ensinamentos, tentarDeNovo } = useEnsinamentos();
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Bhagavad Gita', to: '/gita' }, { label: TITULO_ENSINAMENTOS }]}
        title={TITULO_ENSINAMENTOS}
        lede="Parte final da leitura: os ensinamentos de Krishna."
      />
      {ensinamentos.estado === 'carregando' && (
        // Reserva o espaço da lista (de 709 px no computador a cerca de 900 px no celular estreito): sem isso, a lista
        // chega de uma vez e empurra tudo o que vem depois (CLS de 0,27 medido no Lighthouse).
        <div className="min-h-[56rem] lg:min-h-[44.5rem]">
          <p className="hint" role="status">
            Carregando…
          </p>
        </div>
      )}
      {ensinamentos.estado === 'erro' && (
        <Notice title="Não foi possível carregar os ensinamentos agora">
          <p>{ensinamentos.mensagem}</p>
          <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={tentarDeNovo}>
            Tentar de novo
          </button>
        </Notice>
      )}
      {ensinamentos.estado === 'pronto' && ensinamentos.itens.length === 0 && <p className="hint">Conteúdo em preparação.</p>}
      {ensinamentos.estado === 'pronto' && ensinamentos.itens.length > 0 && (
        <>
          <ListaDeEnsinamentos itens={ensinamentos.itens} />
          <p className="meta mt-4">{NOTA_ENSINAMENTOS}</p>
        </>
      )}
      <nav aria-label="Navegação entre capítulos" className="no-print mt-8 flex flex-wrap justify-between gap-3">
        <Link to={`/gita/${ultimo.numero}`} className="btn btn-ghost btn-sm">
          ← Capítulo {ultimo.numero}
        </Link>
      </nav>
    </>
  );
}
