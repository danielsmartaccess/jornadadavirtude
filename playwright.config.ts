import { defineConfig } from '@playwright/test';

/* Testes ponta a ponta (Documento 08, seção 13.3). Usam o Chrome instalado na máquina;
 * em CI, instale um navegador com `npx playwright install chromium` e remova o canal. */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 45_000,
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    channel: process.env.CI ? undefined : 'chrome',
    locale: 'pt-BR',
    viewport: { width: 1000, height: 1000 },
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
