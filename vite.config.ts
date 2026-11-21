import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* Precarrega as fontes do primeiro desenho (latim, peso 400). Sem isso o navegador só as descobre depois de ler o CSS,
 * e a troca da fonte desloca o texto (CLS). Os arquivos têm hash no nome, então a lista vem do próprio build. */
const FONTES_CRITICAS = [/gloock-latin-400-normal-.*.woff2$/, /crimson-pro-latin-400-(normal|italic)-.*.woff2$/, /geist-mono-latin-400-normal-.*.woff2$/];
function precarregarFontes(): Plugin {
  return {
    name: 'precarregar-fontes',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, contexto) {
        return Object.keys(contexto.bundle ?? {})
          .filter((arquivo) => FONTES_CRITICAS.some((padrao) => padrao.test(arquivo)))
          .map((arquivo) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous', href: `/${arquivo}` },
            injectTo: 'head' as const,
          }));
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), precarregarFontes()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
