/* Incremento de UX: percurso das etapas, provocação do dia, área de escrita do diário e linha do tempo do histórico. */
import { expect, test } from '@playwright/test';

test('Início mostra uma provocação rotulada como pergunta da plataforma, não como citação', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Para pensar hoje')).toBeVisible();
  await expect(page.getByText('Pergunta da plataforma para a sua reflexão. Não é uma citação.')).toBeVisible();
});

test('diário: a situação é uma área de texto e continua obrigatória', async ({ page }) => {
  await page.goto('/diario?novo=1');
  const situacao = page.getByLabel('Situação', { exact: true });
  expect(await situacao.evaluate((el) => el.tagName)).toBe('TEXTAREA');
  await page.getByRole('button', { name: 'Registrar', exact: true }).click();
  await expect(page.getByText('Descreva a situação: é o único campo obrigatório.')).toBeVisible();
});

test('jornada e histórico: percurso das etapas com estado e linha do tempo das jornadas', async ({ page }) => {
  await page.goto('/jornada/nova');
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await page.getByLabel('O que motiva você a começar esta jornada?').fill('Reagir com mais calma nas discussões');
  await page.getByLabel('Virtude que você quer desenvolver').selectOption({ label: 'Paciência' });
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await expect(page).toHaveURL(/\/jornada$/);

  // Barra de etapas: sete marcos, o atual com aria-current e o estado em texto para leitores de tela.
  const etapas = page.getByRole('navigation', { name: 'Etapas da jornada' }).getByRole('listitem');
  await expect(etapas).toHaveCount(7);
  await expect(page.getByRole('navigation', { name: 'Etapas da jornada' }).locator('button[aria-current="step"]')).toHaveCount(1);

  // Histórico: a jornada aparece no percurso, com o estado escrito no cartão.
  await page.goto('/historico');
  await expect(page.getByRole('heading', { level: 2, name: 'Percurso' })).toBeVisible();
  await expect(page.getByText('1 jornada', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Paciência/ }).first()).toBeVisible();
  await expect(page.getByText('Em andamento').first()).toBeVisible();
});

test('quiz da Gita: o aviso lista só as perguntas que faltam', async ({ page }) => {
  await page.goto('/gita/1');
  const aviso = page.getByText(/Responda às \d+ perguntas|Faltam as perguntas/).first();
  await expect(aviso).toBeVisible();
  await page.locator('input[type="radio"]').first().check();
  await expect(page.getByText(/^Faltam as perguntas [\d, ]+ para ver a leitura\.$/)).toBeVisible();
  await expect(page.getByText(/^Faltam as perguntas 1[,\s]/)).toHaveCount(0);
});
