/* Exportação de dados com as reflexões da Gita (que ficam só na nuvem). A API do Supabase é simulada (page.route). */
import { expect, test, type Page } from '@playwright/test';

type Janela = { __blobs: Blob[] };

const REFLEXAO = (n: number) => ({
  id: `r${n}`,
  texto: `Reflexão ${n}`,
  criado_em: `2026-11-18T09:${String(n % 60).padStart(2, '0')}:00Z`,
  etapas: { ordem: 5, nome: 'Reflexão pessoal interativa', capitulos: { numero: 14, titulo: 'Gunatraya Vibhaga Yoga — Os três modos da natureza' } },
});

/** Guarda os Blobs dos downloads, para ler o conteúdo do arquivo exportado dentro da página (sem APIs do Node). */
async function capturarDownloads(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as Janela;
    w.__blobs = [];
    const original = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (objeto: Blob | MediaSource) => {
      if (objeto instanceof Blob) w.__blobs.push(objeto);
      return original(objeto);
    };
  });
}
const arquivoExportado = async (page: Page) => JSON.parse(await page.evaluate(async () => (await (window as unknown as Janela).__blobs.at(-1)!.text())));

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
  await page.route('**/rest/v1/rpc/jv_pull_state*', (rota) => rota.fulfill({ json: { revision: 0, state: { schema: 4, journeys: [], entries: [], reviews: [], sessions: [] } } }));
}

const exportar = async (page: Page) => {
  await page.goto('/configuracoes');
  await page.getByRole('button', { name: 'Exportar meus dados' }).click();
};

test('com conta: o arquivo inclui as reflexões da Gita, com capítulo e etapa de cada uma', async ({ page }) => {
  await capturarDownloads(page);
  await entrarComoUsuario(page);
  const pedidos: string[] = [];
  await page.route('**/rest/v1/registros*', (rota) => {
    pedidos.push(decodeURIComponent(rota.request().url()));
    return rota.fulfill({ json: [REFLEXAO(1), REFLEXAO(2)] });
  });
  await exportar(page);
  await expect(page.getByText('incluindo 2 reflexões da Gita')).toBeVisible();
  const arquivo = await arquivoExportado(page);
  expect(arquivo.application).toBeTruthy();
  expect(arquivo.data.schema).toBe(4);
  expect(arquivo.reflexoesGita).toEqual([
    { capitulo: 14, tituloDoCapitulo: 'Gunatraya Vibhaga Yoga — Os três modos da natureza', etapa: 5, nomeDaEtapa: 'Reflexão pessoal interativa', texto: 'Reflexão 1', criadoEm: '2026-11-18T09:01:00Z' },
    { capitulo: 14, tituloDoCapitulo: 'Gunatraya Vibhaga Yoga — Os três modos da natureza', etapa: 5, nomeDaEtapa: 'Reflexão pessoal interativa', texto: 'Reflexão 2', criadoEm: '2026-11-18T09:02:00Z' },
  ]);
  // A consulta pede a relação com capítulo e etapa, em ordem cronológica, em páginas de 1.000 (limit e offset na URL).
  expect(pedidos).toHaveLength(1);
  expect(pedidos[0]).toContain('select=id,texto,criado_em,etapas(ordem,nome,capitulos(numero,titulo))');
  expect(pedidos[0]).toContain('order=criado_em.asc,id.asc');
  expect(pedidos[0]).toContain('limit=1000');
  expect(pedidos[0]).toContain('offset=0');
});

test('com conta e muitas reflexões: busca por páginas de 1.000 e junta tudo', async ({ page }) => {
  await capturarDownloads(page);
  await entrarComoUsuario(page);
  const deslocamentos: string[] = [];
  await page.route('**/rest/v1/registros*', (rota) => {
    const inicio = Number(new URL(rota.request().url()).searchParams.get('offset') ?? '0');
    deslocamentos.push(String(inicio));
    const total = inicio === 0 ? 1000 : 3; // a segunda página vem incompleta: é a última
    return rota.fulfill({ json: Array.from({ length: total }, (_, i) => REFLEXAO(inicio + i)) });
  });
  await exportar(page);
  await expect(page.getByText('incluindo 1003 reflexões da Gita')).toBeVisible();
  expect(deslocamentos).toEqual(['0', '1000']);
  expect((await arquivoExportado(page)).reflexoesGita).toHaveLength(1003);
});

test('com conta mas sem nenhuma reflexão: o campo vai vazio e a mensagem não cita reflexões', async ({ page }) => {
  await capturarDownloads(page);
  await entrarComoUsuario(page);
  await page.route('**/rest/v1/registros*', (rota) => rota.fulfill({ json: [] }));
  await exportar(page);
  await expect(page.getByText('Arquivo de exportação gerado com todos os seus dados.')).toBeVisible();
  expect((await arquivoExportado(page)).reflexoesGita).toEqual([]);
});

test('com conta, mas a nuvem falha: o arquivo sai com os dados do aparelho e a pessoa é avisada', async ({ page }) => {
  await capturarDownloads(page);
  await entrarComoUsuario(page);
  await page.route('**/rest/v1/registros*', (rota) => rota.fulfill({ status: 500, json: { message: 'erro interno' } }));
  await exportar(page);
  await expect(page.getByText('sem as reflexões da Gita')).toBeVisible();
  const arquivo = await arquivoExportado(page);
  expect(arquivo.data.schema).toBe(4); // a exportação do aparelho não depende da nuvem
  expect('reflexoesGita' in arquivo).toBe(false); // e não finge que as reflexões foram incluídas
  await expect(page.getByRole('button', { name: 'Exportar meus dados' })).toBeEnabled();
});

test('sem conta: o arquivo é o de sempre e a nuvem nem é consultada', async ({ page }) => {
  await capturarDownloads(page);
  let consultas = 0;
  await page.route('**/rest/v1/registros*', (rota) => {
    consultas += 1;
    return rota.fulfill({ json: [] });
  });
  await exportar(page);
  await expect(page.getByText('Arquivo de exportação gerado com todos os seus dados.')).toBeVisible();
  const arquivo = await arquivoExportado(page);
  expect('reflexoesGita' in arquivo).toBe(false);
  expect(Object.keys(arquivo).sort()).toEqual(['application', 'data', 'exportedAt', 'schemaVersion']);
  expect(consultas).toBe(0);
});

test('ida e volta: um arquivo com dados e reflexões é importado como "formato atual", sem restaurar as reflexões', async ({ browser }) => {
  // 1) Sem conta: cria uma jornada e exporta, para ter dados reais do aparelho.
  const semConta = await browser.newPage();
  await capturarDownloads(semConta);
  await semConta.goto('/jornada/nova');
  await semConta.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await semConta.getByLabel('O que motiva você a começar esta jornada?').fill('Reagir com mais calma');
  await semConta.getByLabel('Virtude que você quer desenvolver').selectOption({ label: 'Paciência' });
  await semConta.getByRole('button', { name: 'Criar e iniciar a jornada' }).click();
  await expect(semConta).toHaveURL(/\/jornada$/);
  await exportar(semConta);
  await expect(semConta.getByText('Arquivo de exportação gerado com todos os seus dados.')).toBeVisible();
  const dadosDoAparelho = (await arquivoExportado(semConta)).data;
  await semConta.close();

  // 2) Com conta: exporta e obtém o envelope com as reflexões.
  const comConta = await browser.newPage();
  await capturarDownloads(comConta);
  await entrarComoUsuario(comConta);
  await comConta.route('**/rest/v1/registros*', (rota) => rota.fulfill({ json: [REFLEXAO(1)] }));
  await exportar(comConta);
  await expect(comConta.getByText('incluindo 1 reflexão da Gita')).toBeVisible();
  const envelope = await arquivoExportado(comConta);
  await comConta.close();
  expect(envelope.reflexoesGita).toHaveLength(1);

  // 3) O arquivo completo (dados do aparelho e reflexões) é importado num aparelho novo.
  const texto = JSON.stringify({ ...envelope, data: dadosDoAparelho });
  const destino = await browser.newPage();
  await destino.goto('/configuracoes');
  await expect(destino.getByRole('heading', { level: 1, name: 'Configurações e dados' })).toBeVisible(); // a tela é carregada por rota
  await destino.evaluate((conteudo) => {
    const campo = document.querySelector('input[type="file"]') as HTMLInputElement;
    const transferencia = new DataTransfer();
    transferencia.items.add(new File([conteudo], 'exportacao.json', { type: 'application/json' }));
    campo.files = transferencia.files;
    campo.dispatchEvent(new Event('change', { bubbles: true }));
  }, texto);
  await expect(destino.getByText('formato atual')).toBeVisible();
  await expect(destino.getByText(/contém 1 jornada/)).toBeVisible();
  await destino.getByRole('button', { name: 'Substituir meus dados' }).click();
  await destino.goto('/jornada');
  await expect(destino.getByRole('heading', { level: 1, name: 'Jornada: Paciência' })).toBeVisible();
  await destino.close();
});
