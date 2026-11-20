/* Parte final da leitura da Gita: Ensinamentos de Krishna (transcritos de um quadro de estudo). */
import { expect, test } from '@playwright/test';

test('página: os sete ensinamentos do quadro, com os três gunas e o esquema', async ({ page }) => {
  await page.goto('/gita/ensinamentos');
  await expect(page.getByRole('heading', { level: 1, name: 'Ensinamentos de Krishna' })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Os sete ensinamentos de Krishna' }).locator(':scope > li')).toHaveCount(7);
  for (const texto of [
    'Despertar consciência',
    'Medo → coragem',
    'Dúvidas → decisão',
    'Teoria da reencarnação',
    'Imortalidade da alma',
    'Reta-ação → agir por dever, sem esperar nada em troca',
    'Sacrifício da sabedoria – esforço',
  ]) {
    await expect(page.getByText(texto, { exact: true })).toBeVisible();
  }
  await expect(page.getByText('Rajas')).toBeVisible();
  await expect(page.getByText('(impulsividade)')).toBeVisible();
  await expect(page.getByText('Satwa')).toBeVisible();
  await expect(page.getByText('(justo meio)')).toBeVisible();
  await expect(page.getByText('Tamas')).toBeVisible();
  await expect(page.getByText('(inércia)')).toBeVisible();
  await expect(page.getByRole('img', { name: /Esquema dos três gunas/ })).toBeVisible();
  await expect(page.getByText('Transcrição de um quadro de estudo.', { exact: false })).toBeVisible();
});

test('menu: a parte final fica fora da lista dos 18 capítulos e leva à página', async ({ page }) => {
  await page.goto('/gita/ensinamentos');
  await expect(page.getByRole('navigation', { name: 'Capítulos da Bhagavad Gita' }).getByRole('link')).toHaveCount(18);
  const parteFinal = page.getByRole('navigation', { name: 'Parte final da leitura' }).getByRole('link', { name: 'Ensinamentos de Krishna' });
  await expect(parteFinal).toHaveAttribute('aria-current', 'page');
  await page.goto('/gita');
  await page.getByRole('navigation', { name: 'Parte final da leitura' }).getByRole('link', { name: 'Ensinamentos de Krishna' }).click();
  await expect(page).toHaveURL(/\/gita\/ensinamentos$/);
});

test('capítulo 18: o fim da leitura leva aos Ensinamentos de Krishna e dá para voltar', async ({ page }) => {
  await page.route('**/rest/v1/**', (rota) => rota.abort());
  await page.goto('/gita/18');
  await page.getByRole('link', { name: 'Ensinamentos de Krishna →' }).click();
  await expect(page).toHaveURL(/\/gita\/ensinamentos$/);
  await page.getByRole('link', { name: '← Capítulo 18' }).click();
  await expect(page).toHaveURL(/\/gita\/18$/);
});
