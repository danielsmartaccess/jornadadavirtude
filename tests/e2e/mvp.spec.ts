/* Fluxo completo do MVP (Documento 07, seção 14.1) e preservação dos dados da versão anterior. */
import { expect, test, type Page } from '@playwright/test';

const errors = (page: Page) => {
  const list: string[] = [];
  page.on('pageerror', (e) => list.push(e.message));
  page.on('console', (m) => m.type() === 'error' && list.push(m.text()));
  return list;
};

test('fluxo completo: criar, investigar, praticar, registrar, revisar, pausar, concluir, histórico e exportar', async ({ page }) => {
  const problems = errors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('conhecimento, consciência e prática');

  /* 1 a 3. Criar a jornada, registrar a intenção e selecionar a virtude. */
  await page.getByRole('link', { name: 'Iniciar minha jornada' }).click();
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await expect(page.getByText('Registre a intenção')).toBeVisible();
  await expect(page.getByText('Escolha a virtude principal antes').first()).toBeVisible();
  await page.getByLabel('O que motiva você a começar esta jornada?').fill('Reagir com mais calma nas discussões');
  await page.getByLabel('Virtude que você quer desenvolver').selectOption({ label: 'Paciência' });
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await expect(page).toHaveURL(/\/jornada$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jornada: Paciência');
  await expect(page.getByText('Em andamento').first()).toBeVisible();

  /* 4 e 5. Investigar e consultar as dimensões relacionadas. */
  await page.getByRole('button', { name: /Identificar/ }).click();
  await expect(page.getByRole('link', { name: /Emocional/ }).first()).toBeVisible();
  await page.getByRole('button', { name: /Investigar/ }).click();
  await page.getByLabel('Com as minhas palavras, o que é esta virtude?').fill('Esperar sem perder o equilíbrio');
  await page.getByLabel('Com as minhas palavras, o que é esta virtude?').blur();
  await expect(page.getByText('Resposta salva.')).toBeVisible();

  /* 6 e 7. Consultar exercícios e registrar a experiência no diário. */
  await page.getByRole('button', { name: /Praticar/ }).click();
  await expect(page.getByText('Recomendado').first()).toBeVisible();
  await page.getByRole('button', { name: 'Iniciar exercício' }).first().click();
  await expect(page.getByText('Exercício associado à jornada.')).toBeVisible();
  await page.getByRole('link', { name: 'Registrar experiência' }).first().click();
  await expect(page).toHaveURL(/diario\?novo=1&exercicio=EX-V07/);
  await page.getByRole('button', { name: 'Registrar', exact: true }).click();
  await expect(page.getByText('Descreva a situação: é o único campo obrigatório.')).toBeVisible();
  await page.getByRole('button', { name: 'Discussão' }).click();
  await page.locator('label.chip', { hasText: 'Irritação' }).click();
  await page.getByRole('button', { name: 'Registrar', exact: true }).click();
  await expect(page.getByText('Registro salvo no diário.')).toBeVisible();
  await expect(page.getByText('1 de 1 registros')).toBeVisible();

  /* 8. Revisão periódica, sem depender de registros. */
  await page.goto('/jornada?etapa=revisar');
  await page.getByLabel('O que aprendi neste período?').fill('Respirar antes de responder ajuda');
  await page.getByRole('button', { name: 'Guardar revisão' }).click();
  await expect(page.getByText('Revisão guardada.')).toBeVisible();

  /* 9. Pausar e retomar. */
  await page.getByRole('button', { name: 'Pausar' }).click();
  await expect(page.getByText('Jornada pausada. Você pode retomá-la quando quiser.')).toBeVisible();
  await page.getByRole('button', { name: 'Retomar a jornada' }).click();
  await expect(page.getByText('Jornada retomada.')).toBeVisible();

  /* 10. Concluir exige síntese pessoal. */
  await page.getByRole('button', { name: 'Fazer a revisão final e concluir a jornada' }).click();
  await page.getByRole('button', { name: 'Concluir a jornada' }).click();
  await page.getByRole('button', { name: /Confirmar conclusão/ }).click();
  await expect(page.getByText('Escreva uma síntese pessoal para concluir a jornada.').first()).toBeVisible();
  await page.getByLabel(/Parte 5/).fill('Aprendi a esperar');
  await page.getByRole('button', { name: 'Concluir a jornada' }).click();
  await page.getByRole('button', { name: /Confirmar conclusão/ }).click();
  await expect(page).toHaveURL(/\/historico\//);
  await expect(page.getByText('Concluída').first()).toBeVisible();

  /* 11. Histórico preserva os registros; 12. exportar os dados. */
  await expect(page.getByText('Diário (1 registros)')).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar dados (JSON)' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/\.json$/);

  /* Concluída não volta a ficar ativa, mas pode ser arquivada sem perder nada. */
  await page.getByRole('button', { name: 'Arquivar' }).click();
  await expect(page.getByText('Jornada arquivada. Os registros foram preservados.')).toBeVisible();
  await expect(page.getByText('Concluída').first()).toBeVisible();
  await page.goto('/jornada');
  await expect(page.getByText('Nenhuma jornada em andamento')).toBeVisible();

  /* Iniciar outra jornada não apaga a anterior. */
  await page.goto('/historico');
  await page.getByRole('button', { name: /Mostrar 1 jornada arquivada/ }).click();
  await expect(page.getByText('Paciência').first()).toBeVisible();

  expect(problems, problems.join('\n')).toEqual([]);
});

test('Conselho: reconhece a situação, convoca perspectivas com fontes e limites e não inventa falas', async ({ page }) => {
  const problems = errors(page);
  await page.goto('/conselho');
  await page.getByLabel('Qual situação você deseja analisar?').fill('Tenho dificuldade em admitir quando estou errado e sempre tento me justificar.');
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page).toHaveURL(/conselho\/sessoes\//);
  await expect(page.getByText('Dificuldade em admitir erros').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sócrates' })).toBeVisible();
  await expect(page.getByText('Não são falas literais dos pensadores')).toBeVisible();
  await expect(page.getByText('Limites desta perspectiva').first()).toBeVisible();
  await page.getByLabel('O que penso depois de consultar o Conselho').fill('Quero compreender, não proteger minha imagem');
  await page.getByLabel('O que penso depois de consultar o Conselho').blur();
  await expect(page.getByText('Reflexão salva.')).toBeVisible();
  expect(problems, problems.join('\n')).toEqual([]);
});

test('preserva automaticamente os dados da versão anterior', async ({ page }) => {
  const problems = errors(page);
  await page.addInitScript(() => {
    if (localStorage.getItem('jornada-virtude-v2')) return;
    localStorage.setItem(
      'jornada-virtude-v2',
      JSON.stringify({
        sel: { virtude: ['Paciência'] },
        stages: [true, false, false, false],
        stageDates: ['2026-10-08', '', '', ''],
        startedOn: '2026-10-01',
        journeyId: 'J1',
        journeys: [],
        reviews: [],
        entries: [{ id: 'e1', date: '2026-10-02', type: 'Falha', scene: 'Discussão', felt: ['Irritação'], did: ['Reagi na hora'], note: 'No trânsito', virtue: 'Paciência', stage: 'Reconhecer', journey: 'J1' }],
      }),
    );
  });
  await page.goto('/');
  await expect(page.getByText('Seus dados anteriores foram preservados')).toBeVisible();
  await expect(page.getByText('Jornada: Paciência').first()).toBeVisible();
  await page.goto('/diario');
  await expect(page.getByText('Discussão').first()).toBeVisible();
  await expect(page.getByText('No trânsito')).toBeVisible();
  await expect(page.getByText('Dificuldade').first()).toBeVisible();
  expect(problems, problems.join('\n')).toEqual([]);
});

test('catálogo: 48 virtudes, filtros e página da virtude com fontes', async ({ page }) => {
  await page.goto('/virtudes');
  await expect(page.getByText('48 de 48 virtudes')).toBeVisible();
  await page.getByLabel('Família').selectOption({ label: 'Coragem e fortaleza' });
  await expect(page.getByText('6 de 48 virtudes')).toBeVisible();
  await page.getByLabel('Palavra-chave').fill('teimosia');
  await expect(page.getByText('1 de 48 virtudes')).toBeVisible();
  await page.getByRole('link', { name: /Determinação/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Determinação');
  await page.locator('summary', { hasText: 'Aristóteles' }).click();
  const open = page.locator('details[open]');
  await expect(open.getByText('Tipo de relação a classificar')).toBeVisible();
  await expect(open.getByText('Fonte da associação')).toBeVisible();
});
