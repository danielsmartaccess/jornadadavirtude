/* Parte final da leitura da Bhagavad Gita: os ensinamentos de Krishna, em sete pontos.
 * Conteúdo transcrito de um quadro de estudo (src/data/gita-ensinamentos.json). Nada foi acrescentado. */
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { capitulos, ensinamentosDeKrishna, type GunaDoQuadro } from '../../domain/gita';

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

export function EnsinamentosPage() {
  const ultimo = capitulos[capitulos.length - 1];
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Bhagavad Gita', to: '/gita' }, { label: ensinamentosDeKrishna.titulo }]}
        title={ensinamentosDeKrishna.titulo}
        lede="Parte final da leitura: os sete ensinamentos."
      />
      <ol aria-label="Os sete ensinamentos de Krishna" className="m-0 grid list-none gap-0 p-0">
        {ensinamentosDeKrishna.itens.map((item) => (
          <li key={item.numero} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-t border-rule py-5 first:border-t-2 first:border-ink">
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
      <p className="meta mt-4">{ensinamentosDeKrishna.fonte}</p>
      <nav aria-label="Navegação entre capítulos" className="no-print mt-8 flex flex-wrap justify-between gap-3">
        <Link to={`/gita/${ultimo.numero}`} className="btn btn-ghost btn-sm">
          ← Capítulo {ultimo.numero}
        </Link>
      </nav>
    </>
  );
}
