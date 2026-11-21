/* Cabeçalhos de segurança (vercel.json). O servidor de preview não os envia, então estes testes injetam, nas respostas
 * de documento, os mesmos cabeçalhos do vercel.json (com a política de conteúdo aplicada de verdade, mesmo que o
 * arquivo a tenha em modo somente relatório) e exigem zero violações nos fluxos principais. Assim, mudar o app de um jeito
 * que a política bloqueie (script ou estilo inline, origem nova) reprova aqui, antes de chegar à produção. */
import { expect, test, type Page } from '@playwright/test';
import vercel from '../../vercel.json' with { type: 'json' };

const lista = vercel.headers[0].headers;
const cabecalhos = Object.fromEntries(lista.map((h) => [h.key.toLowerCase(), h.value]));
const politica = cabecalhos['content-security-policy'] ?? cabecalhos['content-security-policy-report-only'];

type Janela = { __csp: string[] };

async function comCabecalhosDeProducao(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as Janela).__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => (window as unknown as Janela).__csp.push(`${e.violatedDirective} ← ${e.blockedURI || 'inline'}`));
  });
  await page.route('**/*', async (rota) => {
    if (rota.request().resourceType() !== 'document') return rota.fallback();
    const resposta = await rota.fetch();
    const h = { ...resposta.headers() };
    delete h['content-security-policy-report-only'];
    h['content-security-policy'] = politica;
    await rota.fulfill({ response: resposta, headers: h });
  });
}

const violacoes = (page: Page) => page.evaluate(() => (window as unknown as Janela).__csp);

const PONTOS = [{ ordem: 1, linhas: ['Despertar consciência'], ensinamentos_gunas: [] }];
const CAPITULO = [{ numero: 14, etapas: [{ id: 501, ordem: 1, nome: 'Contexto histórico e filosófico', conteudo_md: '## Título\n\n### Subtítulo\n\nTexto.', perguntas: [], leituras: [] }] }];

test('cabeçalhos simples e política de conteúdo restritiva (lidos do vercel.json)', () => {
  expect(cabecalhos['x-content-type-options']).toBe('nosniff');
  expect(cabecalhos['x-frame-options']).toBe('DENY');
  expect(cabecalhos['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(cabecalhos['permissions-policy']).toContain('camera=()');
  expect(cabecalhos['content-security-policy'], 'a política é aplicada (bloqueia), não só observada').toBeTruthy();
  expect(cabecalhos['content-security-policy-report-only'], 'sem a versão só de relatório').toBeUndefined();
  expect(politica).toContain("default-src 'self'");
  expect(politica).toContain("object-src 'none'");
  expect(politica).toContain("frame-ancestors 'none'");
  expect(politica).toContain("base-uri 'self'");
  expect(politica, 'sem unsafe-inline nem unsafe-eval').not.toMatch(/unsafe-(inline|eval)/);
  expect(politica, 'conexões só com o próprio site e o Supabase').toContain("connect-src 'self' https://*.supabase.co");
});

test('o hash do script de tema na política confere com o HTML servido (um único script inline)', async ({ page, request }) => {
  const html = await (await request.get('/')).text();
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  expect(inline, 'apenas o script de tema é inline').toHaveLength(1);
  expect(inline[0], 'uma linha só: o hash não pode depender de CRLF ou LF').not.toMatch(/[\r\n]/);
  await page.goto('/');
  const hash = await page.evaluate(async (texto) => {
    const bytes = new TextEncoder().encode(texto);
    const resumo = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    return btoa(String.fromCharCode(...resumo));
  }, inline[0]);
  expect(politica).toContain(`'sha256-${hash}'`);
});

test('política aplicada: tema, navegação e catálogo sem violações', async ({ page }) => {
  await comCabecalhosDeProducao(page);
  await page.addInitScript(() => localStorage.setItem('jv-theme', 'roxo'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'roxo'); // o script inline de tema rodou
  const botao = page.getByRole('button', { name: /Alterar tema/ });
  await botao.click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
  for (const rota of ['/virtudes', '/virtudes/V07', '/dimensoes', '/conselho/pensadores', '/conselho/pensadores/socrates', '/sobre']) {
    await page.goto(rota);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  expect(await violacoes(page)).toEqual([]);
});

test('política aplicada: jornada, diário, Conselho e exportação de dados sem violações', async ({ page }) => {
  await comCabecalhosDeProducao(page);
  await page.goto('/jornada/nova');
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await page.getByLabel('O que motiva você a começar esta jornada?').fill('Reagir com mais calma nas discussões');
  await page.getByLabel('Virtude que você quer desenvolver').selectOption({ label: 'Paciência' });
  await page.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await expect(page).toHaveURL(/\/jornada$/);
  await page.goto('/diario?novo=1');
  await page.getByLabel('Situação', { exact: true }).fill('Uma discussão no trabalho');
  await page.getByRole('button', { name: 'Registrar', exact: true }).click();
  await expect(page.getByText('Registro salvo no diário.')).toBeVisible();
  await page.goto('/conselho');
  await page.getByLabel('Qual situação você deseja analisar?').fill('Tenho dificuldade em admitir quando estou errado.');
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page).toHaveURL(/conselho\/sessoes\//);
  await page.goto('/historico');
  await page.getByRole('link', { name: /Paciência/ }).first().click();
  await expect(page.getByRole('heading', { level: 2, name: 'Dimensões trabalhadas' })).toBeVisible();
  // Exportação de dados: baixa um arquivo gerado no navegador (blob), que a política não pode impedir.
  await page.goto('/configuracoes');
  const [arquivo] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Exportar meus dados' }).click()]);
  expect(arquivo.suggestedFilename()).toMatch(/\.json$/);
  expect(await violacoes(page)).toEqual([]);
});

test('política aplicada: Gita e Ensinamentos de Krishna, com a API do Supabase, sem violações', async ({ page }) => {
  await comCabecalhosDeProducao(page);
  // Simulada com page.route: a política de conexão é avaliada pelo navegador antes da rede, então a origem real do Supabase é checada.
  await page.route('**/rest/v1/capitulos*', (rota) => rota.fulfill({ json: CAPITULO }));
  await page.route('**/rest/v1/ensinamentos*', (rota) => rota.fulfill({ json: PONTOS }));
  await page.goto('/gita/14');
  await expect(page.locator('#etapa-1 h4')).toBeVisible();
  await page.goto('/gita/ensinamentos');
  await expect(page.getByText('Despertar consciência', { exact: true })).toBeVisible();
  expect(await violacoes(page)).toEqual([]);
});

test('política aplicada: entrar na conta e sincronizar (Supabase Auth e RPC) sem violações', async ({ page }) => {
  await comCabecalhosDeProducao(page);
  const usuario = { id: 'usuario-1', email: 'pessoa@exemplo.com', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-11-01T00:00:00Z' };
  await page.route('**/auth/v1/token*', (rota) =>
    rota.fulfill({ json: { access_token: 'cabecalho.carga.assinatura', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'renovacao', user: usuario } }),
  );
  await page.route('**/auth/v1/user*', (rota) => rota.fulfill({ json: usuario }));
  await page.route('**/rest/v1/rpc/jv_pull_state*', (rota) => rota.fulfill({ json: { revision: 0, state: { schema: 4, journeys: [], entries: [], reviews: [], sessions: [] } } }));
  await page.route('**/rest/v1/rpc/jv_push_state*', (rota) => rota.fulfill({ json: { revision: 1 } }));
  await page.route('**/rest/v1/registros*', (rota) => rota.fulfill({ json: [] }));
  await page.goto('/configuracoes');
  await page.getByLabel('E-mail').fill('pessoa@exemplo.com');
  await page.getByLabel('Senha').fill('senha-segura-1');
  // O login chama o Supabase Auth e, em seguida, a sincronização chama as funções do banco: ambos são conexões que a política precisa permitir.
  const [login, sincronizacao] = await Promise.all([
    page.waitForResponse('**/auth/v1/token*'),
    page.waitForRequest('**/rest/v1/rpc/jv_pull_state*'),
    page.getByRole('button', { name: 'Entrar', exact: true }).click(),
  ]);
  expect(login.status()).toBe(200);
  expect(sincronizacao.method()).toBe('POST');
  expect(await violacoes(page)).toEqual([]);
});
