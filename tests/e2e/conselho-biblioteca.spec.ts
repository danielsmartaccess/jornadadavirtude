/* Biblioteca de perspectivas do Conselho (Documento 14, seções 4, 5, 8 e 10). Confere que pessoas,
 * tradições e candidatos são distinguíveis, que candidatos e tradições aparecem como não habilitados,
 * que os filtros funcionam e que nenhum candidato é convocado numa sessão. */
import { expect, test, type Page } from '@playwright/test';

const TOTAL = 84; // 42 entradas do catálogo original + 28 candidatos + 14 tradições
const NEUTRA = 'Tenho dificuldade em admitir quando estou errado e sempre tento me justificar.';

const cartoes = (page: Page, categoria?: string) => page.locator(categoria ? `a.card[data-categoria="${categoria}"]` : 'a.card[data-categoria]');
const status = (page: Page) => page.getByRole('status').filter({ hasText: 'entradas' });

const errors = (page: Page) => {
  const list: string[] = [];
  page.on('pageerror', (e) => list.push(e.message));
  page.on('console', (m) => m.type() === 'error' && list.push(m.text()));
  return list;
};

test('acervo completo: integrantes, tradições, candidatos e referências distinguíveis', async ({ page }) => {
  const erros = errors(page);
  await page.goto('/conselho/pensadores');
  await expect(status(page)).toHaveText(`${TOTAL} de ${TOTAL} entradas`);
  await expect(cartoes(page, 'integrante')).toHaveCount(27);
  await expect(cartoes(page, 'tradicao')).toHaveCount(14);
  await expect(cartoes(page, 'candidato')).toHaveCount(28);
  await expect(cartoes(page, 'referencia')).toHaveCount(15);
  // Só os integrantes dizem que participam; todos os outros dizem que não.
  await expect(cartoes(page).filter({ hasText: /Participa do Conselho/ })).toHaveCount(27); // regex diferencia maiúscula: não casa com “não participa”
  for (const c of ['tradicao', 'candidato', 'referencia']) {
    const n = await cartoes(page, c).count();
    await expect(cartoes(page, c).filter({ hasText: 'Não habilitado · não participa do Conselho' })).toHaveCount(n);
  }
  // Tradições se apresentam como tradição, não como pessoa.
  await expect(cartoes(page, 'tradicao').filter({ hasText: 'não é uma pessoa' })).toHaveCount(14);
  // Emblemas de tradição e assinaturas continuam só nos 27 integrantes; o resto usa composição tipográfica.
  await expect(page.locator('svg[data-simbolo="tradicao"]')).toHaveCount(27);
  await expect(cartoes(page, 'candidato').locator('svg')).toHaveCount(0);
  await expect(page.locator('img')).toHaveCount(0);
  expect(erros).toEqual([]);
});

test('filtros: categoria, tipo, universo, virtude, palavra-chave, estado vazio e limpar', async ({ page }) => {
  await page.goto('/conselho/pensadores');
  const candidatos = page.getByRole('group', { name: 'Categorias do acervo' }).getByRole('button', { name: /Candidatos/ });
  await candidatos.click();
  await expect(candidatos).toHaveAttribute('aria-pressed', 'true');
  await expect(status(page)).toHaveText(`28 de ${TOTAL} entradas`);
  await expect(cartoes(page, 'integrante')).toHaveCount(0);
  await candidatos.click();
  await expect(status(page)).toHaveText(`${TOTAL} de ${TOTAL} entradas`);

  await page.getByLabel('Tipo de participação').selectOption({ label: 'Tradição ou corpus' });
  const n = await cartoes(page).count();
  expect(n).toBeGreaterThan(0);
  await expect(cartoes(page).filter({ hasText: 'Tradição ou corpus · não é uma pessoa' })).toHaveCount(n);
  await page.getByLabel('Tipo de participação').selectOption('');

  await page.getByLabel('Universo').selectOption({ label: 'Psicologia e ciências humanas' });
  await expect(cartoes(page).first()).toBeVisible();
  await expect(cartoes(page).filter({ hasNotText: 'Psicologia e ciências humanas' })).toHaveCount(0);
  await page.getByLabel('Universo').selectOption('');

  // Virtude: candidatos e tradições não têm relações cadastradas e saem do resultado, com aviso.
  await page.getByLabel('Virtude relacionada').selectOption({ label: 'Paciência' });
  await expect(cartoes(page).first()).toBeVisible();
  await expect(cartoes(page, 'candidato')).toHaveCount(0);
  await expect(cartoes(page, 'tradicao')).toHaveCount(0);
  await expect(page.getByText('Tradições e candidatos ainda não têm relações')).toBeVisible();

  await page.getByLabel('Palavra-chave').fill('zzzz-inexistente');
  await expect(page.getByText('Nenhuma entrada encontrada')).toBeVisible();
  await expect(status(page)).toHaveText(`0 de ${TOTAL} entradas`);
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(status(page)).toHaveText(`${TOTAL} de ${TOTAL} entradas`);
  await expect(page.getByLabel('Virtude relacionada')).toHaveValue('');
});

test('candidato: página própria, marcada como não habilitada, sem retrato', async ({ page }) => {
  await page.goto('/conselho/pensadores');
  await page.getByRole('link', { name: /Hannah Arendt/ }).click();
  await expect(page).toHaveURL(/\/conselho\/pensadores\/hannah-arendt$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hannah Arendt');
  await expect(page.getByText('Não habilitado · não participa do Conselho')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'O que falta para participar do Conselho' })).toBeVisible();
  await expect(page.locator('main img, main svg[data-simbolo]')).toHaveCount(0);
});

test('tradição: recorte curatorial, não biografia, com autores relacionados', async ({ page }) => {
  await page.goto('/conselho/pensadores/tradicao-estoicismo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Estoicismo');
  await expect(page.getByText('não é uma pessoa').first()).toBeVisible();
  await expect(page.getByText('não uma biografia')).toBeVisible();
  const autores = page.getByRole('region', { name: 'Autores relacionados' });
  await expect(autores.getByRole('link', { name: 'Epicteto' })).toBeVisible();
  await expect(autores.getByRole('link', { name: 'Sêneca' })).toBeVisible();
});

test('integrante e referência: tipo, universo e estado da fundamentação visíveis', async ({ page }) => {
  await page.goto('/conselho/pensadores/socrates');
  await expect(page.getByText('Pensador', { exact: true })).toBeVisible();
  await expect(page.getByText('ainda não foi avaliada pela curadoria')).toBeVisible();
  await expect(page.getByText('Não habilitado · não participa do Conselho')).toHaveCount(0);
  await page.goto('/conselho/pensadores/estoicismo');
  await expect(page.getByText('Não habilitado · não participa do Conselho')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Estoicismo' }).first()).toBeVisible(); // link para o recorte curatorial
  await page.goto('/conselho/pensadores/nao-existe');
  await expect(page.getByText('Pensador não encontrado')).toBeVisible();
});

test('candidatos não são convocados numa sessão do Conselho', async ({ page }) => {
  await page.goto('/conselho/pensadores');
  await expect(cartoes(page, 'candidato')).toHaveCount(28);
  const nomes = await cartoes(page, 'candidato').locator('h3').allTextContents();
  expect(nomes).toHaveLength(28);
  await page.goto('/conselho');
  await page.getByLabel('Qual situação você deseja analisar?').fill(NEUTRA);
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page).toHaveURL(/conselho\/sessoes\//);
  const texto = (await page.locator('main').textContent()) ?? '';
  for (const nome of nomes) expect(texto, nome).not.toContain(nome);
  const ids = await page.locator('main a[href^="/conselho/pensadores/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(ids.length).toBeGreaterThanOrEqual(2);
  for (const href of ids) expect(href).not.toMatch(/hannah-arendt|paulo-freire|tradicao-/);
});

test('celular: biblioteca e páginas de detalhe sem rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const rota of ['/conselho/pensadores', '/conselho/pensadores/hannah-arendt', '/conselho/pensadores/corpus-bhagavad-gita']) {
    await page.goto(rota);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(sobra, rota).toBeLessThanOrEqual(0);
  }
});
