/* Guardas de acessibilidade, sem dependências extras: estrutura de títulos em todas as telas, nomes únicos
 * das tabelas da Gita e contraste do acento e das cores de família nos dois temas (lido do CSS real).
 * A auditoria completa com axe-core foi feita à parte; estes testes impedem as regressões que ela achou. */
import { expect, test, type Page } from '@playwright/test';

const niveis = (page: Page) => page.evaluate(() => [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => Number(h.tagName[1])));
/** Um único h1 no começo e, depois, nenhum título que pule mais de um nível para baixo. */
const estruturaValida = (n: number[]) => n.filter((v) => v === 1).length === 1 && n[0] === 1 && n.every((v, i) => i === 0 || v <= n[i - 1] + 1);

const alternativas = (textos: string[]) => textos.map((texto, i) => ({ chave: 'ABC'[i], texto }));
const TABELA = '| Modo | Risco |\n|---|---|\n| **Sattva** | Apego |';
const CAPITULO = [
  {
    numero: 14,
    etapas: [
      // Primeiro título igual ao nome da etapa (é removido na tela) e subtítulo logo em seguida: caso da regressão.
      { id: 501, ordem: 1, nome: 'Contexto histórico e filosófico', conteudo_md: '## Contexto histórico e filosófico\n\n### A cena inicial\n\nTexto.\n\n#### Detalhe\n\nMais texto.', perguntas: [], leituras: [] },
      { id: 502, ordem: 2, nome: 'Conceitos fundamentais', conteudo_md: `## Modos\n\n${TABELA}\n\nEntre as tabelas.\n\n${TABELA}`, perguntas: [], leituras: [] },
      { id: 503, ordem: 3, nome: 'Interpretação filosófica', conteudo_md: `## Outra\n\n${TABELA}`, perguntas: [], leituras: [] },
      {
        id: 505,
        ordem: 5,
        nome: 'Reflexão pessoal interativa',
        conteudo_md: '## Reconhecer\n\nIntrodução.\n\n### Reflexão aberta\n\nPergunta aberta?',
        perguntas: [1, 2].map((ordem) => ({ ordem, enunciado: `Pergunta ${ordem}`, conta_no_resultado: true, opcoes: alternativas(['A', 'B', 'C']) })),
        leituras: alternativas(['x', 'y', 'z']),
      },
    ],
  },
];
const PONTOS = [{ ordem: 1, linhas: ['Despertar consciência'], ensinamentos_gunas: [] }];

const ROTAS = ['/', '/jornada', '/jornada/nova', '/virtudes', '/virtudes/V07', '/dimensoes', '/dimensoes/DIM03', '/conselho', '/conselho/pensadores', '/conselho/pensadores/socrates', '/diario', '/diario?novo=1', '/historico', '/configuracoes', '/sobre', '/gita', '/gita/ensinamentos', '/gita/14'];

test('estrutura de títulos: um h1 e nenhum salto de nível em todas as telas', async ({ page }) => {
  await page.route('**/rest/v1/capitulos*', (r) => r.fulfill({ json: CAPITULO }));
  await page.route('**/rest/v1/ensinamentos*', (r) => r.fulfill({ json: PONTOS }));
  for (const rota of ROTAS) {
    await page.goto(rota);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    if (rota === '/gita/14') await expect(page.locator('#etapa-2 table')).toHaveCount(2);
    const n = await niveis(page);
    expect(estruturaValida(n), `${rota}: níveis de título ${n.join(',')}`).toBe(true);
  }
});

test('Gita: depois de remover o título repetido, o primeiro subtítulo desce só um nível', async ({ page }) => {
  await page.route('**/rest/v1/capitulos*', (r) => r.fulfill({ json: CAPITULO }));
  await page.goto('/gita/14');
  await expect(page.locator('#etapa-1 h4')).toHaveText('A cena inicial');
  await expect(page.locator('#etapa-1 h5')).toHaveText('Detalhe');
});

test('Gita: cada tabela tem um nome próprio para leitores de tela, na página inteira', async ({ page }) => {
  await page.route('**/rest/v1/capitulos*', (r) => r.fulfill({ json: CAPITULO }));
  await page.goto('/gita/14');
  await expect(page.locator('[role="region"][aria-label*="Tabela"]')).toHaveCount(3);
  const nomes = await page.locator('[role="region"][aria-label*="Tabela"]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')));
  expect(new Set(nomes).size).toBe(nomes.length);
});

/** Razão de contraste WCAG entre duas cores #rrggbb. */
function contraste(a: string, b: string): number {
  const lum = (h: string) => {
    const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Lê as cores do tema ativo e confere o contraste dos textos e das cores de família. */
async function conferirContraste(page: Page, rotulo: string) {
  const cores = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement);
    const ler = (nome: string) => css.getPropertyValue(nome).trim();
    return { bg: ler('--bg'), fg: ler('--fg'), muted: ler('--muted'), panel: ler('--panel'), accent: ler('--accent'), fam: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ler(`--fam-${n}`)) };
  });
  const textos: [string, string][] = [['--fg', cores.fg], ['--muted', cores.muted], ['--accent', cores.accent], ...cores.fam.map((c, i): [string, string] => [`--fam-${i + 1}`, c])];
  for (const [nome, cor] of textos) {
    for (const [sobre, fundo] of [['fundo', cores.bg], ['painel', cores.panel]]) {
      expect(contraste(cor, fundo), `${rotulo}: ${nome} ${cor} sobre ${sobre} ${fundo}`).toBeGreaterThanOrEqual(4.5);
    }
  }
  // O texto do botão em hover (cor de fundo da página sobre o acento) também precisa passar.
  expect(contraste(cores.bg, cores.accent), `${rotulo}: texto do botão em hover`).toBeGreaterThanOrEqual(4.5);
}

for (const esquema of ['light', 'dark'] as const) {
  test(`contraste (${esquema}): textos, acento e cores de família passam de 4,5:1 no fundo e no painel`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: esquema });
    await page.goto('/');
    await conferirContraste(page, esquema);
  });
}

test('contraste (roxo e dourado): textos, acento e cores de família passam de 4,5:1 no fundo e no painel', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('jv-theme', 'roxo'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'roxo');
  await conferirContraste(page, 'roxo');
});

test('botão de tema: percorre sistema, claro, escuro e roxo e dourado, e lembra a escolha', async ({ page }) => {
  await page.goto('/');
  const botao = page.getByRole('button', { name: /Alterar tema/ });
  await expect(botao).toContainText('Tema: sistema');
  await botao.click();
  await expect(botao).toContainText('Tema: claro');
  await botao.click();
  await expect(botao).toContainText('Tema: escuro');
  await botao.click();
  await expect(botao).toContainText('Tema: roxo e dourado');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'roxo');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'roxo');
  await expect(page.getByRole('button', { name: /Alterar tema/ })).toContainText('Tema: roxo e dourado');
  await page.getByRole('button', { name: /Alterar tema/ }).click();
  await expect(page.getByRole('button', { name: /Alterar tema/ })).toContainText('Tema: sistema');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
});

test('movimento: os cartões entram com animação e terminam visíveis, no estado normal da página', async ({ page }) => {
  await page.goto('/virtudes');
  const primeiro = page.locator('a.card.revelar').first();
  expect(await primeiro.evaluate((el) => getComputedStyle(el).animationName)).toBe('revelar');
  await page.waitForTimeout(900); // animação (240 ms) + o maior atraso (7 x 60 ms)
  expect(await primeiro.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  expect(await page.locator('a.card.revelar').last().evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});

test('movimento: com prefers-reduced-motion nada anima e tudo aparece de uma vez', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/virtudes/V07');
  for (const seletor of ['a.card.revelar', 'svg[data-simbolo="assinatura"] circle']) {
    await page.goto(seletor.startsWith('a.card') ? '/virtudes' : '/virtudes/V07');
    const el = page.locator(seletor).first();
    expect(await el.evaluate((e) => getComputedStyle(e).animationName), seletor).toBe('none');
  }
  await page.goto('/virtudes');
  expect(await page.locator('a.card.revelar').first().evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
});

test('movimento: a animação dos anéis não muda o significado do símbolo (anel sem relação segue esmaecido)', async ({ page }) => {
  await page.goto('/virtudes/V07');
  await page.waitForTimeout(900);
  const opacidades = await page.locator('svg[data-simbolo="assinatura"] circle').evaluateAll((cs) => cs.map((c) => getComputedStyle(c).opacity));
  expect(opacidades).toHaveLength(7);
  expect(opacidades).toContain('0.35'); // pelo menos um anel sem relação registrada
  expect(opacidades).toContain('1'); // e pelo menos um com relação
});
