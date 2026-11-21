import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSync } from './hooks';

/** As seis áreas da plataforma (Documento 06, seção 3). */
const AREAS = [
  { to: '/', label: 'Início', short: 'Início', end: true },
  { to: '/jornada', label: 'Minha Jornada', short: 'Jornada' },
  { to: '/virtudes', label: 'Virtudes', short: 'Virtudes' },
  { to: '/conselho', label: 'Conselho', short: 'Conselho' },
  { to: '/diario', label: 'Diário', short: 'Diário' },
  { to: '/historico', label: 'Histórico', short: 'Histórico' },
];

type Theme = 'system' | 'light' | 'dark' | 'roxo';
const THEME_LABEL: Record<Theme, string> = { system: 'Tema: sistema', light: 'Tema: claro', dark: 'Tema: escuro', roxo: 'Tema: roxo e dourado' };
const NEXT_THEME: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'roxo', roxo: 'system' };

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('jv-theme');
    return stored === 'light' || stored === 'dark' || stored === 'roxo' ? stored : 'system';
  } catch {
    return 'system';
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  function next() {
    const value: Theme = NEXT_THEME[theme];
    setTheme(value);
    if (value === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', value);
    try {
      if (value === 'system') localStorage.removeItem('jv-theme');
      else localStorage.setItem('jv-theme', value);
    } catch {
      /* preferência vale só nesta sessão */
    }
  }
  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={next} aria-label={`${THEME_LABEL[theme]}. Alterar tema`}>
      {THEME_LABEL[theme]}
    </button>
  );
}

function SyncBadge() {
  const sync = useSync();
  if (!sync.configured || !sync.user) return null;
  const text = { local: '', sincronizando: 'Sincronizando…', sincronizado: 'Sincronizado', pendente: 'Alterações a enviar', conflito: 'Escolha necessária', erro: 'Falha na sincronização' }[sync.status];
  if (!text) return null;
  return (
    <Link to="/configuracoes" className="tag no-underline" title={sync.message || text}>
      {sync.status === 'conflito' || sync.status === 'erro' ? '⚠ ' : '☁ '}
      {text}
    </Link>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  // A leitura da Gita usa mais largura: menu lateral, texto e tabelas precisam de espaço.
  const larga = pathname === '/gita' || pathname.startsWith('/gita/');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`mx-auto min-h-dvh ${larga ? 'max-w-pagina-larga' : 'max-w-pagina'} px-4 pb-28 md:pb-12`} style={{ paddingLeft: 'max(16px, env(safe-area-inset-left))', paddingRight: 'max(16px, env(safe-area-inset-right))' }}>
      <a href="#conteudo" className="btn btn-sm sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50">
        Pular para o conteúdo
      </a>
      <header className="no-print flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink py-4">
        <Link to="/" className="flex items-center gap-3 no-underline hover:text-ink">
          <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
            <path d="M32 12 54 52H10Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="32" cy="12" r="4.5" fill="var(--accent)" />
          </svg>
          <span className="font-display text-destaque leading-none">Jornada da Virtude</span>
        </Link>
        <div className="flex items-center gap-2">
          <SyncBadge />
          <ThemeToggle />
          <NavLink to="/configuracoes" className="btn btn-ghost btn-sm">
            Configurações
          </NavLink>
        </div>
      </header>

      <nav aria-label="Áreas da plataforma" className="no-print hidden gap-2 border-b border-rule py-3 md:flex md:flex-wrap">
        {AREAS.map((area) => (
          <NavLink key={area.to} to={area.to} end={area.end} className="chip !min-h-9 font-mono !text-rotulo uppercase tracking-wider">
            {area.label}
          </NavLink>
        ))}
      </nav>

      <main id="conteudo" className="pt-8">
        {/* Enquanto a tela carrega, o aviso ocupa uma altura de viewport: com um aviso curto, o rodapé subia para perto do topo e
            descia de uma vez quando a tela chegava (deslocamento de layout em todas as rotas carregadas por demanda). */}
        <Suspense
          fallback={
            <div className="min-h-dvh">
              <p className="hint" role="status">
                Carregando…
              </p>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <footer className="no-print mt-12 border-t-2 border-ink pt-4 font-mono text-rotulo text-muted">
        <p>
          Seus registros ficam neste navegador. A conta na nuvem é opcional. <Link to="/configuracoes">Seus dados e privacidade</Link> · <Link to="/sobre">Fundamentos e limites</Link>
        </p>
        <p className="mt-1">A plataforma não atribui notas morais nem substitui apoio médico, psicológico ou jurídico.</p>
      </footer>

      <nav aria-label="Áreas da plataforma" className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t-2 border-ink bg-paper md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {AREAS.map((area) => (
          <NavLink
            key={area.to}
            to={area.to}
            end={area.end}
            className={({ isActive }) => `flex min-h-14 items-center justify-center px-0.5 text-center font-mono text-minimo uppercase tracking-wide no-underline ${isActive ? 'bg-ink text-paper' : 'text-ink'}`}
          >
            {area.short}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
