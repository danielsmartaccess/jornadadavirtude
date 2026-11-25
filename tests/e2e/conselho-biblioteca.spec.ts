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
  await expect(cartoes(page).filter({ hasText: /Participa do Conselho/ })).toHaveCount(26); // regex diferencia maiúscula: não casa com “não participa”
  // DEC-CUR-02: dos 27 habilitados, Tradições budistas é corpus de apoio, não voz.
  await expect(cartoes(page, 'integrante').filter({ hasText: 'Corpus de apoio — não convocado como pessoa' })).toHaveCount(1);
  await expect(page.getByText('Classificação curatorial v1 — sujeita a revisão especializada')).toBeVisible();
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
  /* Todas as variantes de página de detalhe: integrante com referências-base ou testemunhos, corpus de apoio,
   * candidato, tradição e referência do catálogo (a falta de Dalai Lama e Sócrates aqui deixou passar um estouro). */
  for (const rota of [
    '/conselho/pensadores',
    '/conselho/pensadores/hannah-arendt',
    '/conselho/pensadores/corpus-bhagavad-gita',
    '/conselho/pensadores/tradicao-estoicismo',
    '/conselho/pensadores/estoicismo',
    '/conselho/pensadores/tradicoes-budistas',
    '/conselho/pensadores/dalai-lama',
    '/conselho/pensadores/socrates',
    '/conselho/pensadores/benjamin-franklin',
    '/conselho/pensadores/richard-feynman',
  ]) {
    await page.goto(rota);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(sobra, rota).toBeLessThanOrEqual(0);
  }
});

test('Fase 2: corpus de apoio, recorte do Dalai Lama e testemunhos de Sócrates', async ({ page }) => {
  const erros = errors(page);
  await page.goto('/conselho/pensadores/tradicoes-budistas');
  await expect(page.getByText('Corpus de apoio, não pessoa')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dalai Lama (Tenzin Gyatso)' })).toBeVisible();

  await page.goto('/conselho/pensadores/dalai-lama');
  const recorte = page.getByRole('region', { name: 'Recorte desta perspectiva' });
  await expect(recorte.locator('[data-vinculo="sustentado_por_fonte"]').first()).toContainText('Budismo tibetano');
  // Revisão DEC-CUR-10: prática Gelug no início da vida sustentada pela declaração oficial; chefia formal (Ganden Tripa) não afirmada.
  // Revisão final: filiação à ordem monástica (VIN-DAL-03) a confirmar, com a fonte marcada como em revisão.
  const filiacao = recorte.locator('[data-vinculo="a_confirmar"]');
  await expect(filiacao).toHaveCount(1);
  await expect(filiacao).toContainText('Escola Gelug');
  await expect(filiacao).toContainText('A confirmar');
  await expect(filiacao.locator('[data-fonte-em-revisao]')).toHaveCount(1);
  await expect(recorte.locator('[data-vinculo="sustentado_por_fonte"]').filter({ hasText: /ordem monástica/i })).toHaveCount(0);
  const inicial = recorte.locator('[data-vinculo="sustentado_por_fonte"]').filter({ hasText: 'Tradição Gelug — prática no início da vida' });
  await expect(inicial).toContainText('In the early part of my life, I followed only the Gelug tradition.');
  await expect(inicial).toContainText('2017-09-25');
  await expect(recorte.locator('[data-vinculo="nao_afirmar"]').filter({ hasText: 'Ganden Tripa' })).toContainText('p. 527');
  await expect(recorte.locator('[data-vinculo="nao_afirmar"]').filter({ hasText: 'Todos os budismos' })).toHaveCount(1);
  await expect(recorte.locator('[data-vinculo="sustentado_por_fonte"]').filter({ hasText: /chefe formal|líder de toda/i })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Referências-base' })).toContainText('Ethics for the New Millennium');
  await expect(page.getByText('referência cadastrada não é relação validada')).toBeVisible();

  await page.goto('/conselho/pensadores/socrates');
  const testemunhos = page.getByRole('region', { name: 'Testemunhos sobre Sócrates' });
  await expect(testemunhos.locator('[data-referencia]')).toHaveCount(3);
  await expect(testemunhos).toContainText('Nenhum destes textos é de autoria de Sócrates');
  // Revisão DEC-CUR-10: metadados pendentes não viram baixa confiabilidade; natureza de cada testemunho com localização.
  await expect(testemunhos.locator('[data-completude="pendente"]')).toHaveCount(3);
  await expect(testemunhos.locator('[data-natureza-testemunho]')).toHaveCount(3);
  await expect(testemunhos.getByText('Confiabilidade da fonte: não avaliada', { exact: false })).toHaveCount(3);
  expect(erros).toEqual([]);
});

test('Fase 2: no caso do perdão, Dalai Lama é voz e Tradições budistas só dá contexto', async ({ page }) => {
  await page.goto('/conselho');
  await page.getByLabel('Qual situação você deseja analisar?').fill('A pessoa guarda ressentimento por uma ofensa ou injustiça sofrida.');
  await page.getByRole('button', { name: 'Convocar o Conselho' }).click();
  await expect(page).toHaveURL(/conselho\/sessoes\//);
  const vozes = await page.locator('main a[href^="/conselho/pensadores/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(vozes).toContain('/conselho/pensadores/dalai-lama');
  expect(vozes).not.toContain('/conselho/pensadores/tradicoes-budistas');
  await expect(page.getByText('Contexto de apoio: Tradições budistas, recorte budismo tibetano').first()).toBeVisible();
  await expect(page.getByText('Critérios de seleção: versão 2.1 (Documento 13).').first()).toBeVisible();
});

/* DH-T-12: a interface diz só o que sabe. Nenhum dado muda; só rótulos e uma ação. Três testes curtos, um por assunto.
 * No subitem A, o modelo não registra o resultado do acesso à página (ver rotulos.ts): a redação é uniforme. */
const INDICADA = 'Referência indicada na conferência'; // redação aprovada, igual em todas as referências
// Textos que NÃO podem aparecer em nenhuma página: a afirmação antiga de consulta e a de inacessibilidade.
const CONSULTADA_ANTIGA = 'Página consultada na conferência';
const NAO_ABERTA = 'Página indicada (não foi possível abrir na conferência)';
const link = (escopo: ReturnType<Page['locator']>, nome: string) => escopo.getByRole('link', { name: nome, exact: true });

test('DH-T-12-A e D: as 12 referências usam a mesma redação, sem afirmar consulta nem inacessibilidade; confiabilidade lida do dado', async ({ page }) => {
  const erros = errors(page);

  // A: sem campo estruturado com o resultado do acesso, todas as referências, inclusive as a_confirmar (REF-FEY-02 e REF-FRA-01),
  // trazem a redação aprovada e nenhuma afirma que a página foi consultada ou que não abriu.
  let total = 0;
  for (const id of ['socrates', 'richard-feynman', 'benjamin-franklin', 'dalai-lama', 'simone-weil', 'musashi', 'edith-stein', 'karl-popper', 'peter-drucker']) {
    await page.goto(`/conselho/pensadores/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const n = await page.locator('[data-referencia]').count();
    total += n;
    await expect(link(page.locator('main'), INDICADA), id).toHaveCount(n);
    await expect(link(page.locator('[data-referencia]'), INDICADA), id).toHaveCount(n); // um por referência, dentro do próprio item
    await expect(link(page.locator('main'), CONSULTADA_ANTIGA), id).toHaveCount(0);
    await expect(link(page.locator('main'), NAO_ABERTA), id).toHaveCount(0);
    const texto = await page.locator('main').innerText();
    expect(texto, id).not.toContain(CONSULTADA_ANTIGA);
    expect(texto, id).not.toMatch(/não foi possível abrir/i);
  }
  expect(total).toBe(12);
  // As duas referências a_confirmar (página do editor/guia que a conferência registrou como HTTP 403) não ganham texto próprio.
  for (const [id, ref] of [['richard-feynman', 'REF-FEY-02'], ['benjamin-franklin', 'REF-FRA-01']]) {
    await page.goto(`/conselho/pensadores/${id}`);
    await expect(link(page.locator(`[data-referencia="${ref}"]`), INDICADA), ref).toHaveCount(1);
  }

  // D: a frase de confiabilidade vem do dado (campo `confiabilidade`), também na referência a_confirmar.
  await page.goto('/conselho/pensadores/richard-feynman');
  await expect(page.locator('[data-referencia="REF-FEY-02"]').getByText('Confiabilidade da fonte: não avaliada', { exact: false })).toHaveCount(1);
  expect(erros).toEqual([]);
});

test('DH-T-12-B: tradição, escola e corpus não são chamados de pensador nem de integrante; as pessoas mantêm o texto', async ({ page }) => {
  const erros = errors(page);
  for (const id of ['tradicoes-budistas', 'estoicismo', 'bhagavad-gita', 'tradicoes-cristas', 'tradicoes-humanistas', 'tradicoes-religiosas', 'tradicoes-contemplativas']) {
    await page.goto(`/conselho/pensadores/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const texto = await page.locator('main').innerText();
    expect(texto, id).not.toMatch(/\b(pensador|integrante)\b/i);
    expect(texto, id).toContain('relacionadas a este registro na base');
    expect(texto, id).toContain('valem para este registro como um todo');
  }
  await page.goto('/conselho/pensadores/aristoteles');
  await expect(page.getByText('relacionadas a este pensador na base, não de uma classificação do seu pensamento')).toBeVisible();
  await expect(page.getByText('valem para o integrante como um todo')).toBeVisible();
  await page.goto('/conselho/pensadores/william-james'); // legado não habilitado: fora desta decisão (DH-T-10), texto igual ao de antes
  await expect(page.getByText('Nenhuma obra registrada na base para este integrante')).toBeVisible();
  expect(erros).toEqual([]);
});

test('DH-T-12-C: na página da virtude, o corpus de apoio não oferece "Ver perfil no Conselho"; a pessoa continua oferecendo', async ({ page }) => {
  const erros = errors(page);
  await page.goto('/virtudes/V04');
  const bloco = (nome: string) => page.locator('details').filter({ has: page.locator('summary', { hasText: nome }) });
  for (const nome of ['Tradições budistas', 'Simone Weil']) await bloco(nome).locator('summary').click();
  await expect(bloco('Tradições budistas').getByText('Fonte da associação')).toBeVisible(); // o bloco está aberto e legível
  await expect(link(bloco('Tradições budistas'), 'Ver perfil no Conselho')).toHaveCount(0);
  await expect(link(bloco('Simone Weil'), 'Ver perfil no Conselho')).toHaveCount(1);
  await expect(link(bloco('Simone Weil'), 'Ver perfil no Conselho')).toHaveAttribute('href', '/conselho/pensadores/simone-weil');
  expect(erros).toEqual([]);
});

/* DH-T-01: notas curatoriais sobre a forma de transmissão (pensadores sem corpus autoral próprio). Só texto informativo. */
test('DH-T-01: a nota de transmissão aparece na página dos quatro, em 360px, junto do aviso da taxonomia; candidatos seguem sem nota', async ({ page }) => {
  const erros = errors(page);
  await page.setViewportSize({ width: 360, height: 800 });
  const AVISO = 'Classificação curatorial v1 — sujeita a revisão especializada';
  const notas: [string, string][] = [
    ['socrates', 'Pensador individual sem corpus autoral próprio conhecido. Seu pensamento é reconstruído principalmente a partir de testemunhos e representações produzidos por terceiros'],
    ['confucio', 'os Analectos (Lunyu) resultam de compilação por discípulos de primeira e segunda geração e de transmissão posterior ao mestre'],
    ['lao-tse', 'Figura tradicionalmente associada ao Tao Te Ching (Dao De Jing), texto de formação compósita. A historicidade de Lao-Tsé e a atribuição do corpus são objeto de debate acadêmico'],
    ['epicteto', 'Pensador individual cujos ensinamentos foram registrados por seu discípulo Arriano, nos Discursos e no Encheirídion (Manual)'],
  ];
  for (const [id, trecho] of notas) {
    await page.goto(`/conselho/pensadores/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const paragrafo = page.locator('p').filter({ hasText: trecho });
    await expect(paragrafo, id).toHaveCount(1);
    await expect(paragrafo, id).toContainText(AVISO); // a nota e o aviso da taxonomia ficam no mesmo parágrafo do cabeçalho
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), id).toBeLessThanOrEqual(0);
  }
  // Fora do escopo: a página de Mêncio e a de Hillel (candidatos) não ganharam nota, e a de Aristóteles segue igual.
  for (const id of ['mencio', 'hillel', 'aristoteles']) {
    await page.goto(`/conselho/pensadores/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const texto = await page.locator('main').innerText();
    expect(texto, id).not.toMatch(/sem corpus autoral próprio|transmitida por discípulos|registrados por seu discípulo|formação compósita/);
  }
  expect(erros).toEqual([]);
});

/* DH-T-02: pares de registros semelhantes (catálogo × recorte curatorial) com remissão e função explicadas; agregados legados
 * com nota; agregados culturais amplos inalterados. Tudo a 360px, onde o texto novo mais pode estourar a largura. */
const PARES_DHT02: [string, string, string][] = [
  ['estoicismo', 'tradicao-estoicismo', 'Estoicismo'],
  ['bhagavad-gita', 'corpus-bhagavad-gita', 'Bhagavad Gita'],
  ['tradicoes-budistas', 'tradicao-budismos', 'Budismos'],
  ['tradicoes-cristas', 'tradicao-cristianismos', 'Cristianismos'],
];
const semRolagem = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test('DH-T-02: nos quatro pares, cada página remete à outra e diz a função do seu registro', async ({ page }) => {
  const erros = errors(page);
  await page.setViewportSize({ width: 360, height: 800 });
  for (const [catalogo, recorte, nomeDoRecorte] of PARES_DHT02) {
    // Registro do catálogo (ThinkerPage): "Recorte curatorial" leva ao recorte, e diz onde ficam as relações com virtudes.
    await page.goto(`/conselho/pensadores/${catalogo}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const remissao = page.locator('p').filter({ hasText: 'Recorte curatorial:' });
    await expect(remissao, catalogo).toHaveCount(1);
    await expect(remissao.getByRole('link', { name: nomeDoRecorte, exact: true }), catalogo).toHaveAttribute('href', `/conselho/pensadores/${recorte}`);
    await expect(remissao, catalogo).toContainText('as relações com virtudes ficam neste registro do catálogo');
    expect(await semRolagem(page), catalogo).toBeLessThanOrEqual(0);

    // Recorte curatorial (TradicaoView): "Registros correspondentes" leva ao catálogo, e diz que a página não tem relações.
    await page.goto(`/conselho/pensadores/${recorte}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const secao = page.getByRole('region', { name: 'Registros correspondentes no catálogo' });
    await expect(secao, recorte).toHaveCount(1);
    await expect(secao, recorte).toContainText('Esta página é o recorte curatorial');
    await expect(secao, recorte).toContainText('não tem relações com virtudes');
    await expect(secao.locator(`a[href="/conselho/pensadores/${catalogo}"]`), recorte).toHaveCount(1);
    expect(await semRolagem(page), recorte).toBeLessThanOrEqual(0);
  }
  // Sem par, nada muda: um recorte sem registro no catálogo e uma pessoa não ganham o texto novo.
  for (const id of ['tradicao-hinduismo', 'aristoteles']) {
    await page.goto(`/conselho/pensadores/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const texto = await page.locator('main').innerText();
    expect(texto, id).not.toContain('Esta página é o recorte curatorial');
    expect(texto, id).not.toContain('as relações com virtudes ficam neste registro do catálogo');
  }
  expect(erros).toEqual([]);
});

test('DH-T-02: Budismos corrige o ponto em aberto; os três agregados legados têm nota; os dois culturais seguem iguais', async ({ page }) => {
  const erros = errors(page);
  await page.setViewportSize({ width: 360, height: 800 });

  // Budismos: o texto errado saiu, o conteúdo válido ficou, e o título da seção continua verdadeiro (ainda há ponto em aberto).
  await page.goto('/conselho/pensadores/tradicao-budismos');
  const ponto = page.getByRole('region', { name: 'Ponto em aberto na curadoria' });
  await expect(ponto).toHaveCount(1);
  await expect(ponto).toContainText('pela DEC-CUR-02, tradições e corpora são fontes de apoio e contextualização');
  await expect(ponto).toContainText('não são pessoas convocáveis nem participantes individuais da seleção');
  await expect(ponto).toContainText('Documento 14 (seção 8)');
  await expect(ponto).toContainText('Segue em aberto a composição do Conselho habilitado');
  expect(await page.locator('main').innerText()).not.toContain('participa da seleção como os indivíduos');
  expect(await semRolagem(page)).toBeLessThanOrEqual(0);

  // Agregados temáticos legados: continuam existindo, com a nota, junto do aviso da taxonomia.
  for (const id of ['tradicoes-humanistas', 'tradicoes-religiosas', 'tradicoes-contemplativas']) {
    await page.goto(`/conselho/pensadores/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const nota = page.locator('p').filter({ hasText: 'Agregado temático legado, sem escopo conceitual suficientemente delimitado' });
    await expect(nota, id).toHaveCount(1);
    await expect(nota, id).toContainText('tradição específica');
    await expect(nota, id).toContainText('Classificação curatorial v1 — sujeita a revisão especializada');
    expect(await semRolagem(page), id).toBeLessThanOrEqual(0);
  }

  // Agregados culturais amplos: nada mudou (só auditoria). Seguem separados, com escopo e cuidado originais e sem remissão nova.
  for (const [id, escopo, cuidado] of [
    ['tradicao-filosofias-africanas', 'Debates Akan, Ubuntu e outras tradições identificadas', 'Não transformar África em tradição única'],
    ['tradicao-pensamentos-indigenas', 'Autores, povos e obras específicos', 'Não homogeneizar povos indígenas'],
  ]) {
    await page.goto(`/conselho/pensadores/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const texto = await page.locator('main').innerText();
    expect(texto, id).toContain(escopo);
    expect(texto, id).toContain(cuidado);
    expect(texto, id).not.toContain('Agregado temático legado');
    await expect(page.getByRole('region', { name: 'Registros correspondentes no catálogo' }), id).toHaveCount(0);
    await expect(page.getByRole('region', { name: 'Ponto em aberto na curadoria' }), id).toHaveCount(0);
    expect(await semRolagem(page), id).toBeLessThanOrEqual(0);
  }
  expect(erros).toEqual([]);
});

/* DH-T-03: referências bibliográficas e classificação budista. Só texto informativo nas duas páginas. */
test('DH-T-03: a Gita diz que integra o Mahābhārata; Tradições budistas explica a lista e a rubrica W12; nada mais muda', async ({ page }) => {
  const erros = errors(page);
  await page.setViewportSize({ width: 360, height: 800 });

  // Corpus da Gita: ponto em aberto novo, escopo e cuidado transcritos do Documento 14 intactos.
  await page.goto('/conselho/pensadores/corpus-bhagavad-gita');
  const ponto = page.getByRole('region', { name: 'Ponto em aberto na curadoria' });
  await expect(ponto).toHaveCount(1);
  await expect(ponto).toContainText('sexto livro do Mahābhārata');
  await expect(ponto).toContainText('não atribui a ele um autor individual');
  await expect(ponto).toContainText("edição e tradução seguem 'a confirmar'");
  const textoGita = await page.locator('main').innerText();
  expect(textoGita).toContain('Obra/corpus independente, com edição e tradução próprias');
  expect(textoGita).toContain('a confirmar antes de qualquer validação');
  expect(textoGita).not.toMatch(/Vy[āa]sa/);
  expect(await semRolagem(page)).toBeLessThanOrEqual(0);

  // Tradições budistas: a nota ampliada fica no parágrafo do aviso da taxonomia; o campo do catálogo segue o mesmo.
  await page.goto('/conselho/pensadores/tradicoes-budistas');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const nota = page.locator('p').filter({ hasText: 'Corpus de apoio (DEC-CUR-02)' });
  await expect(nota).toHaveCount(1);
  await expect(nota).toContainText('seis perfeições (pāramitās) Mahāyāna');
  await expect(nota).toContainText('dez perfeições (pāramī) da tradição Theravāda');
  await expect(nota).toContainText('quatro brahmavihāras');
  await expect(nota).toContainText('(W12) é uma rubrica bibliográfica dos Documentos 03 e 04, não uma obra identificada');
  await expect(nota).toContainText('Classificação curatorial v1 — sujeita a revisão especializada');
  const textoBudistas = await page.locator('main').innerText();
  expect(textoBudistas).toContain('Aperfeiçoamento da conduta: generosidade, conduta ética, paciência, esforço diligente, concentração, sabedoria, benevolência e equanimidade');
  expect(textoBudistas).toContain('não formam uma doutrina única');
  expect(await semRolagem(page)).toBeLessThanOrEqual(0);

  // Fora do escopo: a virtude continua mostrando a obra W12 com o mesmo título (nada foi substituído).
  await page.goto('/virtudes/V04');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const bloco = page.locator('details').filter({ has: page.locator('summary', { hasText: 'Tradições budistas' }) });
  await expect(bloco).toHaveCount(1);
  await bloco.locator('summary').click(); // o título só é lido com o bloco aberto
  await expect(bloco.getByText('Obras de referência: Textos budistas sobre as Paramitas')).toBeVisible();
  expect(erros).toEqual([]);
});

/* DH-T-04: identidade bibliográfica de W08 ("Tratado das Virtudes"). Só texto informativo; W08 não é removida. */
test('DH-T-04: W08 mostra a localização na Suma; a nota de Tomás declara o limite da identificação; nada mais muda', async ({ page }) => {
  const erros = errors(page);
  await page.setViewportSize({ width: 360, height: 800 });
  const TITULO_W08 = 'Tratado das Virtudes (Suma Teológica, I-II, qq. 49–67)';

  // Página de Tomás de Aquino: nota no parágrafo do aviso da taxonomia; as duas obras seguem listadas.
  await page.goto('/conselho/pensadores/tomas-de-aquino');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const nota = page.locator('p').filter({ hasText: 'W08 corresponde ao título editorial Treatise on the Virtues' });
  await expect(nota).toHaveCount(1);
  await expect(nota).toContainText('Suma Teológica, I-II, questões 49–67');
  await expect(nota).toContainText('Não deve ser interpretado como obra autônoma distinta da Suma Teológica');
  await expect(nota).toContainText('não de confirmação explícita da intenção do Documento 03');
  await expect(nota).toContainText('Classificação curatorial v1 — sujeita a revisão especializada');
  await expect(page.getByRole('region', { name: 'Obras de referência' }).getByRole('listitem')).toHaveText(['Suma Teológica', TITULO_W08]);
  expect(await semRolagem(page)).toBeLessThanOrEqual(0);

  // Página da virtude: o bloco de Tomás mostra as duas obras, com o título novo de W08.
  await page.goto('/virtudes/V01');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const blocoTomas = page.locator('details').filter({ has: page.locator('summary', { hasText: 'Tomás de Aquino' }) });
  await expect(blocoTomas).toHaveCount(1);
  await blocoTomas.locator('summary').click(); // o título só é lido com o bloco aberto
  await expect(blocoTomas.getByText(`Obras de referência: Suma Teológica; ${TITULO_W08}`)).toBeVisible();
  expect(await semRolagem(page)).toBeLessThanOrEqual(0);

  // Fora do escopo: outro pensador não ganha a nota, e a obra de Tomás não aparece como obra autônoma sem a localização.
  await page.goto('/conselho/pensadores/aristoteles');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const textoAristoteles = await page.locator('main').innerText();
  expect(textoAristoteles.length).toBeGreaterThan(300);
  expect(textoAristoteles).not.toContain('W08 corresponde');
  expect(erros).toEqual([]);
});
