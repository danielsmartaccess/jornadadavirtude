/* Medição do deslocamento cumulativo de layout (CLS), o mesmo que o Lighthouse reporta. Fica fora dos arquivos *.spec.ts
 * para ser compartilhado. Use instalarMedidorDeCls antes de page.goto e lerCls depois que a tela terminou de carregar. */
import type { Page } from '@playwright/test';

/** Viewport de celular do Lighthouse: no computador o rodapé costuma ficar fora da tela e esconde o problema. */
export const CELULAR_LIGHTHOUSE = { width: 412, height: 823 };

export async function instalarMedidorDeCls(page: Page) {
  await page.addInitScript(() => {
    type Registro = { value: number; hadRecentInput: boolean };
    const w = window as unknown as { __cls: number; __ler: () => number };
    w.__cls = 0;
    const soma = (lista: Registro[]) => lista.forEach((e) => !e.hadRecentInput && (w.__cls += e.value));
    const observador = new PerformanceObserver((lista) => soma(lista.getEntries() as unknown as Registro[]));
    observador.observe({ type: 'layout-shift', buffered: true });
    // O navegador entrega os registros com atraso: ao ler, somar também os que ainda estão pendentes.
    w.__ler = () => {
      soma(observador.takeRecords() as unknown as Registro[]);
      return w.__cls;
    };
  });
}

/** CLS acumulado até agora, depois de dois quadros de animação para o navegador registrar os deslocamentos pendentes. */
export async function lerCls(page: Page): Promise<number> {
  await page.evaluate(() => new Promise<void>((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok()))));
  return page.evaluate(() => (window as unknown as { __ler: () => number }).__ler());
}
