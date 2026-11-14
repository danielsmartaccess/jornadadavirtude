import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../styles/globals.css';
import { CouncilPage, SessionPage, ThinkerPage, ThinkersPage } from '../features/council/CouncilPages';
import { DiaryPage } from '../features/diary/DiaryPage';
import { HistoryPage, JourneyDetailPage } from '../features/history/HistoryPages';
import { HomePage } from '../features/home/HomePage';
import { JourneyPage } from '../features/journey/JourneyPage';
import { StartJourneyPage } from '../features/journey/StartJourneyPage';
import { AboutPage, SettingsPage } from '../features/settings/SettingsPages';
import { DimensionPage, DimensionsPage, VirtuePage, VirtuesPage } from '../features/virtues/VirtuePages';
import { initSync } from '../infrastructure/sync';
import { ToastProvider } from './hooks';
import { Layout } from './Layout';
import { EmptyState } from '../components/ui';

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
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="sobre" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
);
