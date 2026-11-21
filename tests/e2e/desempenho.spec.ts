/* Guardas de desempenho que o Lighthouse apontou: fontes do primeiro desenho precarregadas e nenhum salto de layout
 * (CLS) nas telas carregadas por rota, no viewport de celular do Lighthouse. */
import { expect, test } from '@playwright/test';
import { CELULAR_LIGHTHOUSE, instalarMedidorDeCls, lerCls } from './ajuda-cls';

test('fontes do primeiro desenho são precarregadas no HTML (Gloock, Crimson Pro normal e itálico, Geist Mono)', async ({ page, request }) => {
  const resposta = await request.get('/');
  const html = await resposta.text();
  const links = [...html.matchAll(/<link rel="preload" as="font"[^>]*href="([^"]+)"[^>]*>/g)].map((m) => m[1]);
  expect(links.map((l) => l.replace(/^.*\/assets\//, '').replace(/-[\w-]{8}\.woff2$/, ''))).toEqual(
    expect.arrayContaining(['crimson-pro-latin-400-italic', 'crimson-pro-latin-400-normal', 'geist-mono-latin-400-normal', 'gloock-latin-400-normal']),
  );
  expect(links).toHaveLength(4);
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200); // cada arquivo existe de verdade
  // E o navegador de fato reaproveita o que foi precarregado: se o preload não casasse com o uso (por exemplo, por
  // erro de crossorigin), cada fonte seria baixada duas vezes.
  const pedidos = new Map<string, number>();
  page.on('request', (r) => links.some((l) => r.url().endsWith(l)) && pedidos.set(r.url(), (pedidos.get(r.url()) ?? 0) + 1));
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(pedidos.size, 'as quatro fontes foram pedidas').toBe(4);
  for (const [url, vezes] of pedidos) expect(vezes, `${url} baixada ${vezes} vezes`).toBe(1);
});

for (const rota of ['/virtudes', '/virtudes/V07', '/dimensoes', '/conselho/pensadores', '/diario', '/historico', '/configuracoes']) {
  test(`sem salto de layout em ${rota} (celular, CLS abaixo de 0,1)`, async ({ page }) => {
    await page.setViewportSize(CELULAR_LIGHTHOUSE);
    await instalarMedidorDeCls(page);
    await page.goto(rota, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const cls = await lerCls(page);
    expect(cls, `${rota}: CLS medido ${cls}`).toBeLessThan(0.1);
  });
}

test.describe('áreas de toque', () => {
  test('em tela de toque, botões e opções têm ao menos 44 px de altura', async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, locale: 'pt-BR' });
    const page = await contexto.newPage();
    await page.goto('/virtudes');
    await expect(page.getByRole('heading', { level: 1, name: 'Catálogo de virtudes' })).toBeVisible(); // a tela é carregada por rota
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    for (const seletor of ['a.btn-sm', 'button.chip', '.btn-sm']) {
      const alturas = await page.locator(seletor).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(alturas.length, seletor).toBeGreaterThan(0);
      for (const h of alturas) expect(h, `${seletor}: ${h}px`).toBeGreaterThanOrEqual(44);
    }
    await contexto.close();
  });

  test('com mouse, os tamanhos compactos continuam (a regra vale só para toque)', async ({ page }) => {
    await page.goto('/virtudes');
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(false);
    const pequeno = await page.locator('a.btn-sm').first().evaluate((e) => Math.round(e.getBoundingClientRect().height));
    expect(pequeno).toBeLessThan(44);
  });
});
