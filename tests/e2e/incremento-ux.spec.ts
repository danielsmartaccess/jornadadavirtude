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
  // API simulada (como nos demais testes da Gita): o teste não depende da rede nem do banco real.
  const opcoes = ['A', 'B', 'C'].map((chave) => ({ chave, texto: `Opção ${chave}` }));
  const quiz = [1, 2, 3].map((ordem) => ({ ordem, enunciado: `Pergunta ${ordem}`, conta_no_resultado: true, opcoes }));
  await page.route('**/rest/v1/capitulos*', (rota) =>
    rota.fulfill({
      json: [{ numero: 1, etapas: [{ id: 105, ordem: 5, nome: 'Reflexão pessoal interativa', conteudo_md: '## Reconhecer\n\nIntrodução.\n\n### Reflexão aberta\n\nPergunta aberta?', perguntas: quiz, leituras: opcoes.map((o) => ({ chave: o.chave, texto: `Leitura ${o.chave}` })) }] }],
    }),
  );
  await page.goto('/gita/1');
  await expect(page.getByText('Responda às 3 perguntas para ver a leitura.')).toBeVisible();
  await page.getByRole('radio', { name: 'Opção A' }).first().check(); // responde só a pergunta 1
  await expect(page.getByText('Faltam as perguntas 2, 3 para ver a leitura.')).toBeVisible();
  await page.getByRole('radio', { name: 'Opção B' }).nth(1).check(); // pergunta 2
  await expect(page.getByText('Faltam as perguntas 3 para ver a leitura.')).toBeVisible();
});

test('identidade: cada família, dimensão e integrante do Conselho aparece com seu símbolo', async ({ page }) => {
  await page.goto('/virtudes');
  await expect(page.locator('svg[data-simbolo="familia"]')).toHaveCount(8);
  await page.goto('/dimensoes');
  await expect(page.locator('svg[data-simbolo="dimensao"]')).toHaveCount(7);
  await page.goto('/conselho/pensadores');
  await expect(page.locator('svg[data-simbolo="tradicao"]')).toHaveCount(27);
});

test('diário: o registro ligado a uma virtude mostra o símbolo da família', async ({ page }) => {
  await page.goto('/jornada/nova');
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await page.getByLabel('O que motiva você a começar esta jornada?').fill('Reagir com mais calma nas discussões');
  await page.getByLabel('Virtude que você quer desenvolver').selectOption({ label: 'Paciência' });
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await expect(page).toHaveURL(/\/jornada$/);
  await page.goto('/diario?novo=1');
  await page.getByLabel('Situação', { exact: true }).fill('Espera longa em uma fila');
  await page.getByRole('button', { name: 'Registrar', exact: true }).click();
  await expect(page.getByText('Registro salvo no diário.')).toBeVisible();
  await expect(page.locator('li.entry svg[data-simbolo="familia"]')).toHaveCount(1);
});

test('assinatura da virtude e percurso por dimensão no histórico', async ({ page }) => {
  await page.goto('/virtudes');
  await expect(page.locator('svg[data-simbolo="assinatura"]')).toHaveCount(48);
  await page.goto('/virtudes/V07');
  await expect(page.locator('svg[data-simbolo="assinatura"]')).toHaveCount(1);
  await page.goto('/jornada/nova');
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await page.getByLabel('O que motiva você a começar esta jornada?').fill('Reagir com mais calma nas discussões');
  await page.getByLabel('Virtude que você quer desenvolver').selectOption({ label: 'Paciência' });
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await page.goto('/historico');
  await page.getByRole('link', { name: /Paciência/ }).first().click();
  await expect(page.getByRole('heading', { level: 2, name: 'Dimensões trabalhadas' })).toBeVisible();
  await expect(page.getByText('Contagem descritiva de atividades')).toBeVisible();
});

test('Conselho: cada pensador tem assinatura própria e a sessão mostra a leitura de conjunto', async ({ page }) => {
  await page.goto('/conselho/pensadores');
  await expect(page.locator('svg[data-simbolo="assinatura-pensador"]')).toHaveCount(27);
  await page.goto('/conselho');
  await page.getByLabel('Qual situação você deseja analisar?').fill('Tenho dificuldade em admitir quando estou errado e sempre tento me justificar.');
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page).toHaveURL(/conselho\/sessoes\//);
  await expect(page.locator('svg[data-simbolo="comparacao"]')).toHaveCount(1);
});
