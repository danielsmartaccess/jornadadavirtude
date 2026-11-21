/* Dashboard do módulo Gita: menu lateral com os 18 capítulos e, ao lado, a área principal
 * (rota filha). Rotas: /gita (apresentação) e /gita/:numero (capítulo).
 * O menu pode ser recolhido no computador: a coluna vira uma faixa fina com o botão de reabrir e o
 * texto ganha largura (a página também é mais larga nesta área; ver app/Layout.tsx). */
import { Link, Outlet } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { ROTA_ENSINAMENTOS } from '../../domain/gita';
import { ChapterSidebar } from './ChapterSidebar';
import { useMenuCapitulos } from './useMenuCapitulos';

export function GitaIntro() {
  return (
    <>
      <PageHeader crumbs={[{ label: 'Bhagavad Gita' }]} title="Leitura da Bhagavad Gita" lede="Uma jornada em 18 capítulos, cada um com seis etapas de estudo." />
      <p>
        Escolha um capítulo no menu para começar, por exemplo o <Link to="/gita/1">capítulo 1</Link>. Ao final, a parte dos <Link to={`/gita/${ROTA_ENSINAMENTOS}`}>Ensinamentos de Krishna</Link>.
      </p>
    </>
  );
}

export function GitaLayout() {
  const menu = useMenuCapitulos();
  return (
    <div className={`grid grid-cols-1 gap-6 ${menu.recolhido ? 'md:grid-cols-[2.75rem_minmax(0,1fr)] md:gap-4' : 'md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8'}`}>
      <aside className={`min-w-0 md:sticky md:top-4 md:self-start ${menu.recolhido ? '' : 'md:max-h-[calc(100dvh-2rem)] md:overflow-y-auto'}`}>
        <ChapterSidebar menu={menu} />
      </aside>
      {/* min-w-0: sem isso, tabelas largas esticam a coluna em vez de rolar dentro do próprio contêiner.
          O limite de largura é maior com o menu recolhido, para aproveitar o espaço liberado. */}
      <div className={`min-w-0 md:w-full ${menu.recolhido ? 'md:mx-auto md:max-w-leitura-larga' : 'md:max-w-leitura'}`}>
        <Outlet />
      </div>
    </div>
  );
}
