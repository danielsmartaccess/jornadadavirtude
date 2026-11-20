/* Menu lateral do módulo Gita: os 18 capítulos.
 * Computador: pode ser recolhido para uma faixa fina e expandido de novo (amplia a área de leitura).
 * Celular: lista expansível acima do conteúdo. */
import { useId } from 'react';
import { NavLink } from 'react-router-dom';
import { capitulos, ROTA_ENSINAMENTOS, splitTitulo } from '../../domain/gita';
import type { MenuCapitulos } from './useMenuCapitulos';

export function ChapterSidebar({ menu }: { menu: MenuCapitulos }) {
  const listId = useId();

  return (
    <div className="no-print">
      {/* Celular */}
      <button type="button" className="btn btn-ghost btn-sm mb-2 md:hidden" aria-expanded={menu.aberto} aria-controls={listId} onClick={menu.alternarAberto}>
        {menu.aberto ? 'Ocultar capítulos' : 'Capítulos (18)'}
      </button>

      {/* Computador */}
      <button
        type="button"
        className={`btn btn-ghost btn-sm mb-2 hidden md:inline-flex ${menu.recolhido ? '!w-11 !px-0' : ''}`}
        aria-expanded={!menu.recolhido}
        aria-controls={listId}
        aria-label={menu.recolhido ? 'Mostrar capítulos' : 'Ocultar capítulos'}
        title={menu.recolhido ? 'Mostrar a lista de capítulos' : 'Ocultar a lista de capítulos e ampliar a leitura'}
        onClick={menu.alternarRecolhido}
      >
        {menu.recolhido ? '☰' : '‹ Ocultar capítulos'}
      </button>

      <nav id={listId} aria-label="Capítulos da Bhagavad Gita" className={`${menu.aberto ? 'block' : 'hidden'} ${menu.recolhido ? 'md:hidden' : 'md:block'}`}>
        <ol className="m-0 list-none p-0">
          {capitulos.map((c) => (
            <li key={c.numero}>
              <NavLink
                to={`/gita/${c.numero}`}
                onClick={menu.fecharAberto}
                className={({ isActive }) =>
                  `flex items-baseline gap-3 border-l-2 px-3 py-2 text-[0.95rem] leading-snug no-underline ${isActive ? 'border-accent bg-panel text-ink' : 'border-transparent text-muted hover:text-ink'}`
                }
              >
                <span className="w-5 shrink-0 text-right font-mono text-[12px]">{c.numero}</span>
                <span>{splitTitulo(c.titulo).traducao}</span>
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>

      {/* Parte final: fica fora da lista dos 18 capítulos e recolhe junto com ela. */}
      <nav aria-label="Parte final da leitura" className={`mt-3 border-t border-rule pt-3 ${menu.aberto ? 'block' : 'hidden'} ${menu.recolhido ? 'md:hidden' : 'md:block'}`}>
        <NavLink
          to={`/gita/${ROTA_ENSINAMENTOS}`}
          onClick={menu.fecharAberto}
          className={({ isActive }) =>
            `flex items-baseline gap-3 border-l-2 px-3 py-2 text-[0.95rem] leading-snug no-underline ${isActive ? 'border-accent bg-panel text-ink' : 'border-transparent text-muted hover:text-ink'}`
          }
        >
          <span className="w-5 shrink-0 text-right font-mono text-[12px]" aria-hidden="true">
            ✦
          </span>
          <span>Ensinamentos de Krishna</span>
        </NavLink>
      </nav>
    </div>
  );
}
