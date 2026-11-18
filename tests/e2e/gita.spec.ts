/* Módulo de leitura da Gita: conteúdo em Markdown, quiz com a regra de não empate e falha de rede.
 * A API do Supabase é simulada (page.route): o teste não depende da rede nem do banco. */
import { expect, test, type Page } from '@playwright/test';

const alternativas = (textos: string[]) => textos.map((texto, i) => ({ chave: 'ABC'[i], texto }));
const CAPITULO = [
  {
    numero: 14,
    etapas: [
      { ordem: 1, nome: 'Contexto histórico e filosófico', conteudo_md: '## Título do contexto\n\nTexto com **negrito** e *itálico*.', perguntas: [], leituras: [] },
      { ordem: 2, nome: 'Conceitos fundamentais', conteudo_md: '| Modo | Risco |\n|---|---|\n| **Sattva** | Apego |\n| **Rajas** | Inquietação |', perguntas: [], leituras: [] },
      { ordem: 3, nome: 'Interpretação filosófica', conteudo_md: null, perguntas: [], leituras: [] },
      {
        ordem: 5,
        nome: 'Reflexão pessoal interativa',
        conteudo_md: '## Reconhecer\n\nIntrodução.\n\n### Reflexão aberta\n\nPergunta aberta?',
        perguntas: [1, 2, 3].map((ordem) => ({ ordem, enunciado: `Pergunta ${ordem}`, opcoes: alternativas(['Opção clara', 'Opção ativa', 'Opção inerte']) })),
        leituras: alternativas(['Leitura da clareza.', 'Leitura da ação.', 'Leitura da inércia.']),
      },
    ],
  },
];

async function simularApi(page: Page) {
  await page.route('**/rest/v1/capitulos*', (route) => route.fulfill({ json: CAPITULO }));
}

test('renderiza o Markdown das etapas e deixa em preparação as que não têm texto', async ({ page }) => {
  await simularApi(page);
  await page.goto('/gita/14');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('As três qualidades da natureza');
  await expect(page.locator('#etapa-1 h4')).toHaveText('Título do contexto');
  await expect(page.locator('#etapa-1 strong')).toHaveText('negrito');
  await expect(page.locator('#etapa-2 table tbody tr')).toHaveCount(2);
  await expect(page.locator('#etapa-2 th').first()).toHaveText('Modo');
  await expect(page.locator('#etapa-3')).toContainText('Conteúdo em preparação.');
  await expect(page.locator('#etapa-4')).toContainText('Conteúdo em preparação.');
  await expect(page.locator('main')).not.toContainText('**');
});

test('quiz: a opção mais escolhida define a leitura; em empate mostra as empatadas', async ({ page }) => {
  await simularApi(page);
  await page.goto('/gita/14');
  const etapa = page.locator('#etapa-5');
  const ver = etapa.getByRole('button', { name: 'Ver minha leitura' });
  await expect(ver).toBeDisabled();
  await expect(etapa.getByRole('heading', { name: 'Reflexão aberta' })).toBeVisible();

  // Sem empate: A, A, B
  await etapa.locator('fieldset').nth(0).getByLabel('Opção clara').check();
  await etapa.locator('fieldset').nth(1).getByLabel('Opção clara').check();
  await etapa.locator('fieldset').nth(2).getByLabel('Opção ativa').check();
  await ver.click();
  const resultado = etapa.getByRole('status');
  await expect(resultado).toContainText('Leitura da clareza.');
  await expect(resultado).not.toContainText('Leitura da ação.');
  await expect(resultado).not.toContainText('empatadas');

  // Mudar uma resposta limpa o resultado; A, B, C empata em três.
  await etapa.locator('fieldset').nth(1).getByLabel('Opção ativa').check();
  await etapa.locator('fieldset').nth(2).getByLabel('Opção inerte').check();
  await expect(resultado).not.toContainText('Leitura da clareza.');
  await ver.click();
  await expect(resultado).toContainText('empatadas com 1 escolha cada');
  for (const leitura of ['Leitura da clareza.', 'Leitura da ação.', 'Leitura da inércia.']) await expect(resultado).toContainText(leitura);
  await expect(resultado).toContainText('A: 1 · B: 1 · C: 1');
});

test('falha de rede: avisa, mantém as seis etapas e permite tentar de novo', async ({ page }) => {
  await page.route('**/rest/v1/capitulos*', (route) => route.abort());
  await page.goto('/gita/14');
  await expect(page.getByText('Não foi possível carregar o texto agora')).toBeVisible();
  await expect(page.locator('main article')).toHaveCount(6);

  await page.unroute('**/rest/v1/capitulos*');
  await simularApi(page);
  await page.getByRole('button', { name: 'Tentar de novo' }).click();
  await expect(page.locator('#etapa-1 h4')).toHaveText('Título do contexto');
  await expect(page.getByText('Não foi possível carregar o texto agora')).toHaveCount(0);
});

test('mobile: a tabela rola dentro do contêiner e a página não ganha rolagem horizontal', async ({ page }) => {
  await simularApi(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/gita/14');
  await expect(page.locator('#etapa-2 table')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
