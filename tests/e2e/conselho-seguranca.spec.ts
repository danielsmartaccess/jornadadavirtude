/* Gate de segurança do Conselho (Doc. 13 v2, seção 13): com sinal de risco na situação ou na
 * dúvida, o Conselho não é convocado, nenhuma sessão é criada, nada é gravado e a pessoa
 * continua vendo os contatos de ajuda. Sem sinal de risco, o fluxo comum segue igual. */
import { expect, test, type Page } from '@playwright/test';

const DATA_KEY = 'jornada-virtude-v4';
const NEUTRA = 'Tenho dificuldade em admitir quando estou errado e sempre tento me justificar.';
const RISCO = 'Às vezes penso em suicídio depois das discussões em casa.';
/** Frase sobre armazenamento: vale no fluxo comum e contradiria o alerta no bloqueio. */
const FRASE_ARMAZENAMENTO = 'A situação fica guardada com seus dados, neste navegador.';

const errors = (page: Page) => {
  const list: string[] = [];
  page.on('pageerror', (e) => list.push(e.message));
  page.on('console', (m) => m.type() === 'error' && list.push(m.text()));
  return list;
};

const sessoesGravadas = (page: Page) =>
  page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw).sessions as unknown[]).length : 0;
  }, DATA_KEY);

const tudoQueFoiGravado = (page: Page) =>
  page.evaluate(() => Object.keys(localStorage).map((k) => localStorage.getItem(k) ?? '').join('\n'));

async function preencher(page: Page, situacao: string, duvida = '') {
  await page.getByLabel('Qual situação você deseja analisar?').fill(situacao);
  if (duvida) await page.getByLabel('Qual é a sua principal dúvida? (opcional)').fill(duvida);
}

async function esperarBloqueio(page: Page, textoBloqueado: string) {
  const alerta = page.getByRole('alert').filter({ hasText: 'O Conselho não foi convocado' });
  await expect(alerta).toBeVisible();
  await expect(alerta).toContainText('CVV 188');
  await expect(alerta).toContainText('nenhuma sessão foi criada');
  /* A frase de armazenamento sumiria em contradição com o alerta. */
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toHaveCount(0);
  /* Nenhuma navegação para sessão, nenhuma sessão gravada e o texto não ficou no navegador. */
  await expect(page).toHaveURL(/\/conselho(\?.*)?$/);
  await expect(page).not.toHaveURL(/sessoes/);
  await expect.poll(() => sessoesGravadas(page)).toBe(0);
  await expect.poll(() => tudoQueFoiGravado(page)).not.toContain(textoBloqueado.slice(0, 30));
  await expect(page.getByText('Nenhuma sessão registrada.')).toBeVisible();
  /* Nada do fluxo comum aparece como resposta. */
  await expect(page.getByRole('heading', { name: 'Perspectivas selecionadas' })).toHaveCount(0);
}

test('TESTE 1 e 7: sem sinal de risco, a sessão é criada e gravada como sempre', async ({ page }) => {
  const problems = errors(page);
  await page.goto('/conselho');
  await preencher(page, NEUTRA, 'Como mudar isso?');
  /* No fluxo comum a frase de armazenamento continua, porque a sessão será gravada. */
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toBeVisible();
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page).toHaveURL(/conselho\/sessoes\//);
  await expect(page.getByRole('heading', { name: 'Sócrates' })).toBeVisible();
  await expect.poll(() => sessoesGravadas(page)).toBe(1);
  await expect(page.getByRole('alert').filter({ hasText: 'O Conselho não foi convocado' })).toHaveCount(0);
  expect(problems, problems.join('\n')).toEqual([]);
});

test('TESTE 2 e 5: sinal de risco na situação bloqueia a convocação sem gravar nem navegar', async ({ page }) => {
  const problems = errors(page);
  await page.goto('/conselho');
  await preencher(page, RISCO);
  /* O aviso aparece antes do clique, como já acontecia, e a frase de armazenamento já sai. */
  await expect(page.getByText('CVV 188', { exact: false })).toBeVisible();
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toHaveCount(0);
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await esperarBloqueio(page, RISCO);
  expect(problems, problems.join('\n')).toEqual([]);
});

test('TESTE 3: situação neutra com sinal de risco na dúvida também bloqueia', async ({ page }) => {
  await page.goto('/conselho');
  const duvida = 'Às vezes penso em me machucar quando isso acontece.';
  await preencher(page, NEUTRA, duvida);
  /* A dúvida passa a contar para o aviso, que antes olhava só a situação. */
  await expect(page.getByText('CVV 188', { exact: false })).toBeVisible();
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toHaveCount(0);
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await esperarBloqueio(page, duvida);
});

test('TESTE 4: sinal de risco na situação com dúvida neutra bloqueia', async ({ page }) => {
  await page.goto('/conselho');
  await preencher(page, RISCO, 'O que posso fazer agora?');
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await esperarBloqueio(page, RISCO);
});

test('TESTE 6: texto vazio mantém a validação de sempre, sem o aviso de segurança', async ({ page }) => {
  await page.goto('/conselho');
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page.getByText('Descreva a situação para convocar o Conselho.')).toBeVisible();
  await expect(page).not.toHaveURL(/sessoes/);
  await expect(page.getByRole('alert').filter({ hasText: 'O Conselho não foi convocado' })).toHaveCount(0);
  await expect.poll(() => sessoesGravadas(page)).toBe(0);
});

test('depois de um bloqueio, um novo texto sem sinal de risco convoca o Conselho normalmente', async ({ page }) => {
  await page.goto('/conselho');
  await preencher(page, RISCO);
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'O Conselho não foi convocado' })).toBeVisible();
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toHaveCount(0);
  await preencher(page, NEUTRA);
  await expect(page.getByRole('alert').filter({ hasText: 'O Conselho não foi convocado' })).toHaveCount(0);
  /* Saindo do bloqueio, a frase volta, junto com o fluxo comum. */
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toBeVisible();
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page).toHaveURL(/conselho\/sessoes\//);
  await expect.poll(() => sessoesGravadas(page)).toBe(1);
});

test('regressão: o fluxo comum segue completo (jornada, reflexão, diário, sessões anteriores e exportação)', async ({ page }) => {
  const problems = errors(page);
  /* Jornada em andamento. */
  await page.goto('/jornada/nova');
  await page.getByLabel('O que motiva você a começar esta jornada?').fill('Reconhecer meus erros com mais facilidade');
  await page.getByLabel('Virtude que você quer desenvolver').selectOption({ label: 'Humildade' });
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await expect(page).toHaveURL(/\/jornada$/);

  /* Sessão ligada à jornada (a caixa vem marcada quando há jornada em andamento). */
  await page.goto('/conselho');
  await expect(page.getByLabel(/Relacionar esta reflexão à jornada/)).toBeChecked();
  await preencher(page, NEUTRA);
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page).toHaveURL(/conselho\/sessoes\//);
  await expect(page.getByRole('link', { name: 'Retornar à jornada' })).toBeVisible();

  /* Reflexão e registro no diário. */
  await page.getByLabel('O que penso depois de consultar o Conselho').fill('Quero compreender, não proteger minha imagem');
  await page.getByLabel('O que penso depois de consultar o Conselho').blur();
  await expect(page.getByText('Reflexão salva.')).toBeVisible();
  await page.getByRole('button', { name: 'Registrar no diário' }).click();
  await expect(page.getByText('Reflexão registrada no diário.')).toBeVisible();

  /* Segunda sessão, independente, relacionada depois à jornada. */
  await page.goto('/conselho');
  await page.getByLabel(/Relacionar esta reflexão à jornada/).uncheck();
  await preencher(page, 'Fico com raiva e reajo por impulso nas discussões.');
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page).toHaveURL(/conselho\/sessoes\//);
  await page.getByRole('button', { name: 'Relacionar à jornada em andamento' }).click();
  await expect(page.getByText('Sessão relacionada à jornada.')).toBeVisible();

  /* O que ficou gravado: duas sessões ligadas à jornada e o registro do diário apontando para a primeira. */
  const gravado = () =>
    page.evaluate((key) => {
      const d = JSON.parse(localStorage.getItem(key) ?? '{}');
      const s = d.sessions ?? [];
      return { sessoes: s.length, ligadas: s.filter((x: { journeyId: string | null }) => x.journeyId).length, diario: (d.entries ?? []).filter((e: { sessionId: string | null }) => e.sessionId === s[0]?.id).length };
    }, DATA_KEY);
  await expect.poll(gravado).toEqual({ sessoes: 2, ligadas: 2, diario: 1 });

  /* Sessões anteriores listadas e exportação disponível. */
  await page.goto('/conselho');
  await expect(page.getByRole('link', { name: NEUTRA.slice(0, 40) })).toBeVisible();
  await page.goto('/configuracoes');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar meus dados' }).click();
  expect((await download).suggestedFilename()).toMatch(/\.json$/);
  expect(problems, problems.join('\n')).toEqual([]);
});

test('convocar a partir de um registro do diário com sinal de risco também é bloqueado', async ({ page }) => {
  const situacao = 'Penso em me machucar quando as discussões não param.';
  await page.addInitScript(
    ([key, text]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({ schema: 4, journeys: [], reviews: [], sessions: [], entries: [{ id: 'e-risco', date: '2026-11-20', type: 'DIFFICULTY', situation: text }] }),
      );
    },
    [DATA_KEY, situacao],
  );
  await page.goto('/conselho?registro=e-risco');
  await expect(page.getByLabel('Qual situação você deseja analisar?')).toHaveValue(new RegExp(situacao.slice(0, 20)));
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toHaveCount(0);
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  const alerta = page.getByRole('alert').filter({ hasText: 'O Conselho não foi convocado' });
  await expect(alerta).toBeVisible();
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toHaveCount(0);
  await expect(page).not.toHaveURL(/sessoes/);
  await expect.poll(() => sessoesGravadas(page)).toBe(0);
});

test('registro do diário com situação neutra e sinal de risco só no contexto: convocação bloqueada, nada gravado', async ({ page }) => {
  const problems = errors(page);
  const situacao = 'Discussões frequentes com meu companheiro sobre as tarefas da casa.';
  const contexto = 'Às vezes ele me agride quando a discussão fica mais forte.';
  await page.addInitScript(
    ([key, s, c]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({ schema: 4, journeys: [], reviews: [], sessions: [], entries: [{ id: 'e-contexto', date: '2026-11-20', type: 'DIFFICULTY', situation: s, context: c }] }),
      );
    },
    [DATA_KEY, situacao, contexto],
  );
  await page.goto('/conselho?registro=e-contexto');

  /* A tela junta situação e contexto do registro, nessa ordem, no campo da situação. */
  const campo = page.getByLabel('Qual situação você deseja analisar?');
  await expect(campo).toHaveValue(`${situacao}. ${contexto}`);
  /* O sinal vem do contexto: o aviso aparece antes mesmo do clique, sem a frase de armazenamento. */
  await expect(page.getByText('CVV 188', { exact: false })).toBeVisible();
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toHaveCount(0);

  /* Retrato do armazenamento antes da tentativa: nada pode mudar depois dela. */
  const antes = await tudoQueFoiGravado(page);
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();

  const alerta = page.getByRole('alert').filter({ hasText: 'O Conselho não foi convocado' });
  await expect(alerta).toBeVisible();
  await expect(alerta).toContainText('CVV 188');
  await expect(alerta).toContainText('SAMU 192');
  await expect(alerta).toContainText('nenhuma sessão foi criada');
  await expect(page.getByText(FRASE_ARMAZENAMENTO)).toHaveCount(0);

  await expect(page).toHaveURL(/\/conselho\?registro=e-contexto$/);
  await expect(page).not.toHaveURL(/sessoes/);
  await expect.poll(() => sessoesGravadas(page)).toBe(0);
  await expect.poll(() => tudoQueFoiGravado(page)).toBe(antes);
  /* O texto de risco só existe no registro original do diário, nunca fora dele. */
  const foraDoDiario = () =>
    page.evaluate((key) => {
      const { entries, ...resto } = JSON.parse(localStorage.getItem(key) ?? '{}');
      return { entradas: (entries ?? []).length, resto: JSON.stringify(resto) };
    }, DATA_KEY);
  await expect.poll(foraDoDiario).toEqual({ entradas: 1, resto: expect.not.stringContaining('me agride') });

  /* Nenhuma perspectiva filosófica foi selecionada nem apresentada. */
  await expect(page.getByRole('heading', { name: 'Perspectivas selecionadas' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Síntese do Conselho' })).toHaveCount(0);
  await expect(page.getByText('Por que foi convocado')).toHaveCount(0);
  await expect(page.getByText('Nenhuma sessão registrada.')).toBeVisible();
  expect(problems, problems.join('\n')).toEqual([]);
});
