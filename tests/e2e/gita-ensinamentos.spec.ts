/* Parte final da leitura da Gita: Ensinamentos de Krishna (transcritos de um quadro de estudo e guardados
 * no Supabase). A API é simulada (page.route), como nos demais testes da Gita: sem rede e sem banco. */
import { expect, test, type Page } from '@playwright/test';

const PONTOS = [
  { ordem: 1, linhas: ['Despertar consciência'], ensinamentos_gunas: [] },
  { ordem: 2, linhas: ['Medo → coragem', 'Dúvidas → decisão'], ensinamentos_gunas: [] },
  { ordem: 3, linhas: ['Teoria da reencarnação'], ensinamentos_gunas: [] },
  { ordem: 4, linhas: ['Imortalidade da alma'], ensinamentos_gunas: [] },
  {
    ordem: 5,
    linhas: ['3 gunas'],
    ensinamentos_gunas: [
      { ordem: 1, sigla: 'R', nome: 'Rajas', sentido: 'impulsividade' },
      { ordem: 2, sigla: 'S', nome: 'Satwa', sentido: 'justo meio' },
      { ordem: 3, sigla: 'T', nome: 'Tamas', sentido: 'inércia' },
    ],
  },
  { ordem: 6, linhas: ['Reta-ação → agir por dever, sem esperar nada em troca'], ensinamentos_gunas: [] },
  { ordem: 7, linhas: ['Sacrifício da sabedoria – esforço'], ensinamentos_gunas: [] },
];

const simularApi = (page: Page, json: unknown = PONTOS) => page.route('**/rest/v1/ensinamentos*', (rota) => rota.fulfill({ json }));

test('página: os sete ensinamentos do quadro, com os três gunas e o esquema', async ({ page }) => {
  await simularApi(page);
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

test('a página pede os pontos com os gunas aninhados, em ordem, ao Supabase', async ({ page }) => {
  let url = '';
  await page.route('**/rest/v1/ensinamentos*', (rota) => {
    url = decodeURIComponent(rota.request().url());
    return rota.fulfill({ json: PONTOS });
  });
  await page.goto('/gita/ensinamentos');
  await expect(page.getByText('Despertar consciência', { exact: true })).toBeVisible();
  expect(url).toContain('select=ordem,linhas,ensinamentos_gunas(ordem,sigla,nome,sentido)');
  expect(url).toContain('order=ordem.asc');
});

test('falha de rede: avisa e permite tentar de novo', async ({ page }) => {
  await page.route('**/rest/v1/ensinamentos*', (rota) => rota.abort());
  await page.goto('/gita/ensinamentos');
  await expect(page.getByText('Não foi possível carregar os ensinamentos agora')).toBeVisible();
  await expect(page.getByRole('list', { name: 'Os sete ensinamentos de Krishna' })).toHaveCount(0);

  await page.unroute('**/rest/v1/ensinamentos*');
  await simularApi(page);
  await page.getByRole('button', { name: 'Tentar de novo' }).click();
  await expect(page.getByText('Despertar consciência', { exact: true })).toBeVisible();
  await expect(page.getByText('Não foi possível carregar os ensinamentos agora')).toHaveCount(0);
});

test('conteúdo ainda não publicado: mostra "Conteúdo em preparação."', async ({ page }) => {
  await simularApi(page, []);
  await page.goto('/gita/ensinamentos');
  await expect(page.getByText('Conteúdo em preparação.')).toBeVisible();
  await expect(page.getByRole('list', { name: 'Os sete ensinamentos de Krishna' })).toHaveCount(0);
});

test('menu: a parte final fica fora da lista dos 18 capítulos e leva à página', async ({ page }) => {
  await simularApi(page);
  await page.goto('/gita/ensinamentos');
  await expect(page.getByRole('navigation', { name: 'Capítulos da Bhagavad Gita' }).getByRole('link')).toHaveCount(18);
  const parteFinal = page.getByRole('navigation', { name: 'Parte final da leitura' }).getByRole('link', { name: 'Ensinamentos de Krishna' });
  await expect(parteFinal).toHaveAttribute('aria-current', 'page');
  await page.goto('/gita');
  await page.getByRole('navigation', { name: 'Parte final da leitura' }).getByRole('link', { name: 'Ensinamentos de Krishna' }).click();
  await expect(page).toHaveURL(/\/gita\/ensinamentos$/);
});

test('capítulo 18: o fim da leitura leva aos Ensinamentos de Krishna e dá para voltar', async ({ page }) => {
  await page.route('**/rest/v1/capitulos*', (rota) => rota.abort());
  await simularApi(page);
  await page.goto('/gita/18');
  await page.getByRole('link', { name: 'Ensinamentos de Krishna →' }).click();
  await expect(page).toHaveURL(/\/gita\/ensinamentos$/);
  await expect(page.getByText('Despertar consciência', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: '← Capítulo 18' }).click();
  await expect(page).toHaveURL(/\/gita\/18$/);
});
