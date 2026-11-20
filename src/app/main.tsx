import { lazy, StrictMode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../styles/globals.css';
import { HomePage } from '../features/home/HomePage';
import { initSync } from '../infrastructure/sync';
import { ToastProvider } from './hooks';
import { Layout } from './Layout';
import { EmptyState } from '../components/ui';

/* Telas carregadas por rota (o Início fica no pacote principal): o celular baixa só o que a pessoa abre. */
const pagina = (carregar: () => Promise<object>, nome: string) =>
  lazy(() => carregar().then((m) => ({ default: (m as Record<string, ComponentType>)[nome] })));

const CouncilPage = pagina(() => import('../features/council/CouncilPages'), 'CouncilPage');
const SessionPage = pagina(() => import('../features/council/CouncilPages'), 'SessionPage');
const ThinkersPage = pagina(() => import('../features/council/CouncilPages'), 'ThinkersPage');
const ThinkerPage = pagina(() => import('../features/council/CouncilPages'), 'ThinkerPage');
const DiaryPage = pagina(() => import('../features/diary/DiaryPage'), 'DiaryPage');
const HistoryPage = pagina(() => import('../features/history/HistoryPages'), 'HistoryPage');
const JourneyDetailPage = pagina(() => import('../features/history/HistoryPages'), 'JourneyDetailPage');
const ChapterPage = pagina(() => import('../features/gita/ChapterPage'), 'ChapterPage');
const GitaIntro = pagina(() => import('../features/gita/GitaLayout'), 'GitaIntro');
const GitaLayout = pagina(() => import('../features/gita/GitaLayout'), 'GitaLayout');
const EnsinamentosPage = pagina(() => import('../features/gita/EnsinamentosPage'), 'EnsinamentosPage');
const JourneyPage = pagina(() => import('../features/journey/JourneyPage'), 'JourneyPage');
const StartJourneyPage = pagina(() => import('../features/journey/StartJourneyPage'), 'StartJourneyPage');
const AboutPage = pagina(() => import('../features/settings/SettingsPages'), 'AboutPage');
const SettingsPage = pagina(() => import('../features/settings/SettingsPages'), 'SettingsPage');
const DimensionPage = pagina(() => import('../features/virtues/VirtuePages'), 'DimensionPage');
const DimensionsPage = pagina(() => import('../features/virtues/VirtuePages'), 'DimensionsPage');
const VirtuePage = pagina(() => import('../features/virtues/VirtuePages'), 'VirtuePage');
const VirtuesPage = pagina(() => import('../features/virtues/VirtuePages'), 'VirtuesPage');

void initSync();

function NotFound() {
  return <EmptyState title="Página não encontrada">Use o menu para voltar a uma das áreas da plataforma.</EmptyState>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="jornada" element={<JourneyPage />} />
            <Route path="jornada/nova" element={<StartJourneyPage />} />
            <Route path="virtudes" element={<VirtuesPage />} />
            <Route path="virtudes/:id" element={<VirtuePage />} />
            <Route path="dimensoes" element={<DimensionsPage />} />
            <Route path="dimensoes/:id" element={<DimensionPage />} />
            <Route path="conselho" element={<CouncilPage />} />
            <Route path="conselho/sessoes/:id" element={<SessionPage />} />
            <Route path="conselho/pensadores" element={<ThinkersPage />} />
            <Route path="conselho/pensadores/:id" element={<ThinkerPage />} />
            <Route path="diario" element={<DiaryPage />} />
            <Route path="historico" element={<HistoryPage />} />
            <Route path="historico/:id" element={<JourneyDetailPage />} />
            <Route path="gita" element={<GitaLayout />}>
              <Route index element={<GitaIntro />} />
              <Route path="ensinamentos" element={<EnsinamentosPage />} />
              <Route path=":numero" element={<ChapterPage />} />
            </Route>
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="sobre" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
);
