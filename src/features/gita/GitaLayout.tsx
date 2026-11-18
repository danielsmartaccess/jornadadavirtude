/* Dashboard do módulo Gita: menu lateral com os 18 capítulos e, ao lado, a área principal
 * (rota filha). Rotas: /gita (apresentação) e /gita/:numero (capítulo). */
import { Link, Outlet } from 'react-router-dom';
import { EmptyState } from '../../components/ui';
import { ChapterSidebar } from './ChapterSidebar';

export function GitaIntro() {
  return (
    <EmptyState title="Leitura da Bhagavad Gita">
      Uma jornada em 18 capítulos, cada um com seis etapas de estudo. Escolha um capítulo no menu para começar, por exemplo o <Link to="/gita/1">capítulo 1</Link>.
    </EmptyState>
  );
}

export function GitaLayout() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8">
      <aside className="min-w-0 md:sticky md:top-4 md:max-h-[calc(100dvh-2rem)] md:self-start md:overflow-y-auto">
        <ChapterSidebar />
      </aside>
      {/* min-w-0: sem isso, tabelas largas esticam a coluna em vez de rolar dentro do próprio contêiner. */}
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
