/* Menu lateral do módulo Gita: os 18 capítulos. Em telas estreitas vira lista recolhível. */
import { useId, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { capitulos, splitTitulo } from '../../domain/gita';

export function ChapterSidebar() {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <div className="no-print">
      <button type="button" className="btn btn-ghost btn-sm mb-2 md:hidden" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((v) => !v)}>
        {open ? 'Ocultar capítulos' : 'Capítulos (18)'}
      </button>
      <nav id={listId} aria-label="Capítulos da Bhagavad Gita" className={`${open ? 'block' : 'hidden'} md:block`}>
        <ol className="m-0 list-none p-0">
          {capitulos.map((c) => (
            <li key={c.numero}>
              <NavLink
                to={`/gita/${c.numero}`}
                onClick={() => setOpen(false)}
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
    </div>
  );
}
