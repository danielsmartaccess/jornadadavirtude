/* Módulo de leitura da Gita: conteúdo em Markdown, quiz com a regra de não empate, reflexão aberta
 * (guardada em registros) e falha de rede. A API do Supabase é simulada (page.route): os testes
 * não dependem da rede nem do banco. A RLS de registros é verificada à parte, no banco local. */
import { expect, test, type Page, type Route } from '@playwright/test';

const alternativas = (textos: string[]) => textos.map((texto, i) => ({ chave: 'ABC'[i], texto }));
const CAPITULO = [
  {
    numero: 14,
    etapas: [
      { id: 501, ordem: 1, nome: 'Contexto histórico e filosófico', conteudo_md: '## Título do contexto\n\nTexto com **negrito** e *itálico*.', perguntas: [], leituras: [] },
      { id: 502, ordem: 2, nome: 'Conceitos fundamentais', conteudo_md: '| Modo | Risco |\n|---|---|\n| **Sattva** | Apego |\n| **Rajas** | Inquietação |', perguntas: [], leituras: [] },
      { id: 503, ordem: 3, nome: 'Interpretação filosófica', conteudo_md: null, perguntas: [], leituras: [] },
      {
        id: 505,
        ordem: 5,
        nome: 'Reflexão pessoal interativa',
        conteudo_md: '## Reconhecer\n\nIntrodução.\n\n### Reflexão aberta\n\nPergunta aberta?',
        perguntas: [1, 2, 3, 4].map((ordem) => ({ ordem, enunciado: `Pergunta ${ordem}`, conta_no_resultado: ordem !== 4, opcoes: alternativas(['Opção clara', 'Opção ativa', 'Opção inerte']) })),
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Os três modos da natureza');
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
  const resultado = etapa.getByRole('status').first();
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

  // A pergunta 4 é só de reflexão: escolher C nela não entra no cálculo e o empate se mantém.
  await expect(etapa.getByText('não entra no cálculo da leitura')).toBeVisible();
  await etapa.locator('fieldset').nth(3).getByLabel('Opção inerte').check();
  await ver.click();
  await expect(resultado).toContainText('empatadas com 1 escolha cada');
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

/* ---------------------------- Reflexão aberta ---------------------------- */

test('reflexão aberta sem conta: explica como guardar e não mostra o campo', async ({ page }) => {
  await simularApi(page);
  await page.goto('/gita/14');
  const etapa = page.locator('#etapa-5');
  await expect(etapa.getByText('Guardar sua reflexão')).toBeVisible();
  await expect(etapa.getByRole('link', { name: 'Configurações' })).toHaveAttribute('href', '/configuracoes');
  await expect(etapa.getByLabel('Sua reflexão')).toHaveCount(0);
});

/** Sessão salva do Supabase (o cliente a restaura sem chamar a rede). */
async function entrarComoUsuario(page: Page) {
  await page.addInitScript(() => {
    const agora = Math.floor(Date.now() / 1000);
    localStorage.setItem(
      'sb-nfjanvrgroozomymlndt-auth-token',
      JSON.stringify({
        access_token: 'cabecalho.carga.assinatura',
        refresh_token: 'renovacao',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: agora + 3600,
        user: { id: 'usuario-1', email: 'pessoa@exemplo.com', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-11-01T00:00:00Z' },
      }),
    );
  });
  await page.route('**/rest/v1/rpc/jv_pull_state*', (route) => route.fulfill({ json: { revision: 0, state: { schema: 4, journeys: [], entries: [], reviews: [], sessions: [] } } }));
}

test('reflexão aberta com conta: lista, guarda e apaga em registros', async ({ page }) => {
  const existente = { id: 'reg-1', etapa_id: 505, texto: 'Reflexão de ontem', criado_em: '2026-11-17T20:00:00Z' };
  let guardados = [existente];
  const enviados: { user_id: string; etapa_id: number; texto: string }[] = [];
  const apagados: string[] = [];

  await simularApi(page);
  await entrarComoUsuario(page);
  await page.route('**/rest/v1/registros*', async (route: Route) => {
    const req = route.request();
    if (req.method() === 'GET') {
      expect(req.url()).toContain('etapa_id=eq.505');
      return route.fulfill({ json: guardados });
    }
    if (req.method() === 'POST') {
      const corpo = req.postDataJSON();
      enviados.push(corpo);
      const novo = { id: 'reg-2', etapa_id: corpo.etapa_id, texto: corpo.texto, criado_em: '2026-11-18T09:00:00Z' };
      guardados = [novo, ...guardados];
      return route.fulfill({ status: 201, json: novo });
    }
    if (req.method() === 'DELETE') {
      const id = new URL(req.url()).searchParams.get('id') ?? '';
      apagados.push(id);
      guardados = guardados.filter((r) => `eq.${r.id}` !== id);
      return route.fulfill({ status: 204, body: '' });
    }
    return route.continue();
  });

  await page.goto('/gita/14');
  const etapa = page.locator('#etapa-5');
  const campo = etapa.getByLabel('Sua reflexão');
  await expect(campo).toBeVisible();
  await expect(etapa.getByText('Reflexão de ontem')).toBeVisible();

  const guardar = etapa.getByRole('button', { name: 'Guardar reflexão' });
  await expect(guardar).toBeDisabled();
  await campo.fill('   ');
  await expect(guardar).toBeDisabled();

  await campo.fill('  Meu galho é o trabalho.  ');
  await guardar.click();
  await expect(etapa.getByText('Reflexão guardada.')).toBeVisible();
  await expect(etapa.getByText('Meu galho é o trabalho.')).toBeVisible();
  await expect(campo).toHaveValue('');
  expect(enviados).toEqual([{ user_id: 'usuario-1', etapa_id: 505, texto: 'Meu galho é o trabalho.' }]);

  // Apagar exige confirmação (dois cliques).
  const item = etapa.getByRole('listitem').filter({ hasText: 'Reflexão de ontem' });
  await item.getByRole('button', { name: 'Apagar' }).click();
  expect(apagados).toEqual([]);
  await item.getByRole('button', { name: /Confirmar exclusão/ }).click();
  await expect(etapa.getByText('Reflexão apagada.')).toBeVisible();
  await expect(etapa.getByText('Reflexão de ontem')).toHaveCount(0);
  expect(apagados).toEqual(['eq.reg-1']);
});

test('reflexão aberta com conta: falha ao guardar mostra o erro e mantém o texto', async ({ page }) => {
  await simularApi(page);
  await entrarComoUsuario(page);
  await page.route('**/rest/v1/registros*', (route) => (route.request().method() === 'GET' ? route.fulfill({ json: [] }) : route.abort()));

  await page.goto('/gita/14');
  const etapa = page.locator('#etapa-5');
  await etapa.getByLabel('Sua reflexão').fill('Não quero perder este texto');
  await etapa.getByRole('button', { name: 'Guardar reflexão' }).click();
  await expect(etapa.getByRole('alert')).toContainText('Sem conexão com a nuvem');
  await expect(etapa.getByLabel('Sua reflexão')).toHaveValue('Não quero perder este texto');
});

test('apagar os dados da nuvem remove também as reflexões da Gita, antes do apagamento do restante', async ({ page }) => {
  const chamadas: string[] = [];
  await entrarComoUsuario(page);
  await page.route('**/rest/v1/registros*', (route) => {
    chamadas.push(`${route.request().method()} registros ${new URL(route.request().url()).searchParams.get('user_id')}`);
    return route.fulfill({ status: 204, body: '' });
  });
  await page.route('**/rest/v1/rpc/jv_delete_my_data*', (route) => {
    chamadas.push('RPC jv_delete_my_data');
    return route.fulfill({ status: 204, body: '' });
  });
  await page.route('**/auth/v1/logout*', (route) => route.fulfill({ status: 204, body: '' }));

  await page.goto('/configuracoes');
  await page.getByRole('button', { name: 'Apagar meus dados da nuvem' }).click();
  await page.getByRole('button', { name: /Confirmar exclusão na nuvem/ }).click();
  await expect(page.getByText('Seus dados foram apagados da nuvem')).toBeVisible();
  expect(chamadas).toEqual(['DELETE registros eq.usuario-1', 'RPC jv_delete_my_data']);
});

/* ------------------------- Quiz por faixas (caps. 11 a 13) ------------------------- */

const CAPITULO_FAIXAS = [
  {
    numero: 11,
    etapas: [
      {
        id: 905,
        ordem: 5,
        nome: 'Reflexão pessoal interativa',
        conteudo_md: '## Exercício\n\nIntrodução.\n\n### Reflexão aberta\n\nPergunta aberta?',
        quiz_modo: 'faixas',
        quiz_chave_alvo: 'C',
        perguntas: [1, 2, 3, 4, 5].map((ordem) => ({ ordem, enunciado: `Pergunta ${ordem}`, conta_no_resultado: true, opcoes: alternativas(['Opção a', 'Opção b', 'Opção c']) })),
        leituras: [
          { chave: null, minimo: 4, texto: 'Leitura alta.' },
          { chave: null, minimo: 2, texto: 'Leitura média.' },
          { chave: null, minimo: 0, texto: 'Leitura baixa.' },
        ],
      },
    ],
  },
];

test('quiz por faixas: a leitura vem da quantidade de respostas C, sem regra de empate', async ({ page }) => {
  await page.route('**/rest/v1/capitulos*', (route) => route.fulfill({ json: CAPITULO_FAIXAS }));
  await page.goto('/gita/11');
  const etapa = page.locator('#etapa-5');
  const ver = etapa.getByRole('button', { name: 'Ver minha leitura' });
  const resultado = etapa.getByRole('status').first();
  const responder = async (letras: string[]) => {
    for (let i = 0; i < 5; i++) await etapa.locator('fieldset').nth(i).getByLabel(`Opção ${letras[i]}`).check();
    await ver.click();
  };

  await expect(ver).toBeDisabled();
  await responder(['c', 'c', 'c', 'c', 'a']); // 4 C
  await expect(resultado).toContainText('Leitura alta.');
  await expect(resultado).toContainText('Respostas alinhadas ao ensinamento: 4 de 5');
  await expect(resultado).not.toContainText('empatadas');

  await responder(['c', 'c', 'a', 'b', 'a']); // 2 C (A e B somam 3 e não "empatam" nada)
  await expect(resultado).toContainText('Leitura média.');
  await expect(resultado).toContainText('2 de 5');

  await responder(['a', 'b', 'a', 'b', 'c']); // 1 C
  await expect(resultado).toContainText('Leitura baixa.');
  await expect(resultado).not.toContainText('Opção');

  await responder(['c', 'c', 'c', 'c', 'c']); // 5 C
  await expect(resultado).toContainText('Leitura alta.');
  await expect(resultado).toContainText('5 de 5');
});
