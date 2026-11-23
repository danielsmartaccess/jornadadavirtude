/* Comparação A/B entre as políticas de seleção v1 (Documento 04) e v2 (Documento 13), DEC-CUR-05.
 * Gera o relatório docs/governanca/curadoria/comparacao-politicas-selecao.md. Determinístico. */
import { councilCases, dimensions, families, getThinker, virtues } from '../../../src/domain/catalog';
import {
  CONTEXTO_PADRAO,
  deliberarSelecao,
  limitePorUniverso,
  MAX_THINKERS,
  POLITICA_V1,
  POLITICA_V2,
  suggest,
  type PoliticaSelecao,
  type ResultadoSelecao,
  type SelectionInput,
} from '../../../src/domain/council';
import { getUniverso, papelDoRegistro, qualidadeDaFonte } from '../../../src/domain/curadoria';

export interface EntradaAB {
  grupo: string;
  rotulo: string;
  input: SelectionInput;
  max: number;
}

/** As mesmas 79 entradas do snapshot de referência. */
export function entradasAB(): EntradaAB[] {
  const e: EntradaAB[] = [];
  for (const v of virtues) e.push({ grupo: 'virtude', rotulo: `${v.id} ${v.name}`, input: { caseIds: [], virtueIds: [v.id], dimensionIds: [] }, max: MAX_THINKERS });
  for (const f of families)
    e.push({ grupo: 'familia', rotulo: f.name, input: { caseIds: [], virtueIds: virtues.filter((v) => v.familyId === f.id).map((v) => v.id), dimensionIds: ['DIM03', 'DIM04'] }, max: MAX_THINKERS });
  for (const c of councilCases) {
    const s = suggest(c.situation);
    e.push({ grupo: 'caso-situacao', rotulo: `${c.id} ${c.title}`, input: { caseIds: s.caseIds, virtueIds: s.virtueIds, dimensionIds: s.dimensionIds }, max: MAX_THINKERS });
  }
  for (const c of councilCases) e.push({ grupo: 'caso-ids', rotulo: `${c.id} ${c.title}`, input: { caseIds: [c.id], virtueIds: c.virtueIds, dimensionIds: c.dimensionIds }, max: MAX_THINKERS });
  for (const d of dimensions) e.push({ grupo: 'dimensao', rotulo: `${d.id} ${d.name}`, input: { caseIds: [], virtueIds: [], dimensionIds: [d.id] }, max: MAX_THINKERS });
  e.push({ grupo: 'vazia', rotulo: 'entrada vazia', input: { caseIds: [], virtueIds: [], dimensionIds: [] }, max: MAX_THINKERS });
  for (const max of [2, 3, 4]) e.push({ grupo: 'limite', rotulo: `CASE04, máximo ${max}`, input: { caseIds: ['CASE04'], virtueIds: ['V29', 'V26', 'V11'], dimensionIds: ['DIM03'] }, max });
  return e;
}

const nome = (id: string) => getThinker(id)?.name ?? id;
const universoNome = (u?: string) => (u ? getUniverso(u)?.nome ?? u : 'sem universo');
const rodar = (e: EntradaAB, p: PoliticaSelecao) => deliberarSelecao(CONTEXTO_PADRAO, e.input, e.max, p);
const idsDe = (r: ResultadoSelecao) => r.selecionados.map((s) => s.thinker.id);

export interface Metricas {
  comVozes: number;
  mediaVozes: number;
  semFonte: number;
  corpusComoVoz: number;
  dalaiECorpusJuntos: number;
  mediaUniversos: number;
  maxMesmoUniverso: number;
  acimaDoLimite: number;
  relaxadas: number;
  mediaRelacao: number;
  mediaPertinencia: number;
  aparicoes: Map<string, number>;
}

export function metricas(lista: EntradaAB[], p: PoliticaSelecao): Metricas {
  const universo = CONTEXTO_PADRAO.universo!;
  let comVozes = 0, vozes = 0, semFonte = 0, corpus = 0, juntos = 0, universosSoma = 0, maxU = 0, acima = 0, relax = 0, rel = 0, pert = 0, n = 0;
  const aparicoes = new Map<string, number>();
  for (const e of lista) {
    const r = rodar(e, p);
    const ids = idsDe(r);
    if (!ids.length) continue;
    comVozes++;
    vozes += ids.length;
    if (r.diversityConstraintRelaxed) relax++;
    const contagem = new Map<string, number>();
    for (const id of ids) {
      const t = getThinker(id)!;
      if (qualidadeDaFonte(t) === 0) semFonte++;
      if (papelDoRegistro(t) === 'contextual_corpus') corpus++;
      const u = universo(id) ?? 'sem';
      contagem.set(u, (contagem.get(u) ?? 0) + 1);
      aparicoes.set(id, (aparicoes.get(id) ?? 0) + 1);
    }
    if (ids.includes('dalai-lama') && ids.includes('tradicoes-budistas')) juntos++;
    universosSoma += contagem.size;
    const maior = Math.max(...contagem.values());
    maxU = Math.max(maxU, maior);
    if (maior > limitePorUniverso(e.max)) acima++;
    for (const d of r.detalhes) {
      rel += d.criterios.relacaoVirtudes;
      pert += d.criterios.pertinencia;
      n++;
    }
  }
  return {
    comVozes,
    mediaVozes: vozes / Math.max(1, comVozes),
    semFonte,
    corpusComoVoz: corpus,
    dalaiECorpusJuntos: juntos,
    mediaUniversos: universosSoma / Math.max(1, comVozes),
    maxMesmoUniverso: maxU,
    acimaDoLimite: acima,
    relaxadas: relax,
    mediaRelacao: rel / Math.max(1, n),
    mediaPertinencia: pert / Math.max(1, n),
    aparicoes,
  };
}

const f2 = (x: number) => x.toFixed(2).replace('.', ',');
const f3 = (x: number) => x.toFixed(3).replace('.', ',');

function explicarCaso(e: EntradaAB): string[] {
  const a = rodar(e, POLITICA_V1);
  const b = rodar(e, POLITICA_V2);
  const ia = idsDe(a);
  const ib = idsDe(b);
  const linhas: string[] = [];
  linhas.push(`#### ${e.rotulo} (${e.grupo === 'caso-ids' ? 'pelos identificadores do caso' : 'pela situação descrita'})`);
  linhas.push('');
  linhas.push(`- v1: ${ia.map(nome).join(', ') || '—'}`);
  linhas.push(`- v2: ${ib.map(nome).join(', ') || '—'}`);
  const saiu = ia.filter((id) => !ib.includes(id));
  const entrou = ib.filter((id) => !ia.includes(id));
  if (!saiu.length && !entrou.length) linhas.push(`- Mesmas vozes${ia.join() === ib.join() ? ', mesma ordem' : ', ordem diferente'}.`);
  const universo = CONTEXTO_PADRAO.universo!;
  const usados = new Map<string, number>();
  ib.forEach((id) => usados.set(universo(id) ?? 'sem', (usados.get(universo(id) ?? 'sem') ?? 0) + 1));
  for (const id of saiu) {
    const ex = b.excluidos.find((x) => x.thinkerId === id);
    let motivo: string;
    if (ex?.motivo === 'corpus-de-apoio') motivo = 'corpus de apoio, não ocupa vaga como voz (DEC-CUR-02)';
    else if (ex?.motivo === 'sem-fonte') motivo = 'sem fonte recuperável (Documento 13, seção 7.2)';
    else if (
      (usados.get(universo(id) ?? 'sem') ?? 0) >= limitePorUniverso(e.max) &&
      /* Se outra voz do mesmo universo entrou por exceção, o limite não foi a causa. */
      !b.relaxamentos.some((r) => r.endsWith(`(${universo(id)}).`))
    )
      motivo = `limite de ${limitePorUniverso(e.max)} vozes por universo atingido em "${universoNome(universo(id))}" (DEC-CUR-07)`;
    else motivo = 'pontuação menor que a das vozes escolhidas com os pesos do Documento 13 (por exemplo, quem integra o caso de referência passa a pesar mais que a relação com virtudes)';
    linhas.push(`- Saiu ${nome(id)}: ${motivo}.`);
  }
  for (const id of entrou) {
    const d = b.detalhes.find((x) => x.thinkerId === id)!;
    linhas.push(
      `- Entrou ${nome(id)} (${universoNome(d.universo)}): relação com as virtudes ${f2(d.criterios.relacaoVirtudes)}, pertinência ao caso ${f2(d.criterios.pertinencia)}, fontes ${f2(d.criterios.fontes)}.`,
    );
  }
  if (b.relaxamentos.length) for (const r of b.relaxamentos) linhas.push(`- Exceção registrada: ${r}`);
  linhas.push('');
  return linhas;
}

export function relatorioAB(): string {
  const lista = entradasAB();
  const m1 = metricas(lista, POLITICA_V1);
  const m2 = metricas(lista, POLITICA_V2);
  const mudaram = lista.filter((e) => idsDe(rodar(e, POLITICA_V1)).join() !== idsDe(rodar(e, POLITICA_V2)).join());
  const mudaramConjunto = lista.filter((e) => [...idsDe(rodar(e, POLITICA_V1))].sort().join() !== [...idsDe(rodar(e, POLITICA_V2))].sort().join());
  const L: string[] = [];
  L.push('# Comparação das políticas de seleção do Conselho (A/B)');
  L.push('');
  L.push('> Gerado por `tests/unit/support/comparacao-politicas.ts` (teste `relatorios-curadoria.test.ts`). Não editar à mão: rode `RELATORIOS=1 npx vitest run tests/unit/relatorios-curadoria.test.ts`.');
  L.push('');
  L.push('| Campo | Valor |');
  L.push('|---|---|');
  L.push('| Decisão | DEC-CUR-05, DEC-CUR-02 e DEC-CUR-07 (ver ADR-CUR-02 e ADR-CUR-03) |');
  L.push(`| Política A | \`${POLITICA_V1.id}\` (histórica/legada) |`);
  L.push(`| Política B | \`${POLITICA_V2.id}\` (operacional) |`);
  L.push(`| Entradas | ${lista.length} (as mesmas do snapshot de referência: 48 virtudes, 8 famílias, 6 casos pela situação, 6 casos pelos identificadores, 7 dimensões, entrada vazia, limites 2, 3 e 4) |`);
  L.push('');
  L.push('## Pesos');
  L.push('');
  L.push('| Critério (Documento 13, seção 7.1) | Como é calculado (0 a 1) | v1 (Doc. 04) | v2 (Doc. 13) |');
  L.push('|---|---|---:|---:|');
  const lin = (crit: string, como: string, k: keyof PoliticaSelecao['pesos']) =>
    L.push(`| ${crit} | ${como} | ${Math.round(POLITICA_V1.pesos[k] * 100)}% | ${Math.round(POLITICA_V2.pesos[k] * 100)}% |`);
  lin('Pertinência à questão central', 'integra o caso de referência mais aderente (1) ou outro caso reconhecido (0,6)', 'pertinencia');
  lin('Relação fundamentada com virtudes', 'força das relações com as virtudes pedidas, com teto 1 (não soma relações cadastradas fora da pergunta)', 'relacaoVirtudes');
  lin('Disponibilidade e qualidade das fontes', 'v1: obra no catálogo (1/0). v2: obra no catálogo ou referência-base conferida (1), referência-base a conferir (0,5), nada (0)', 'fontes');
  lin('Complementaridade das perspectivas', 'tradição ainda não representada entre os já escolhidos (1/0)', 'complementaridade');
  lin('Diversidade intelectual/cultural pertinente', 'universo principal ainda não representado (1/0); só entre candidatos já pertinentes', 'diversidade');
  lin('Adequação ao contexto', 'fração das dimensões da situação cobertas pelas virtudes do pensador', 'contexto');
  L.push(`| **Total** | | ${Math.round(Object.values(POLITICA_V1.pesos).reduce((a, b) => a + b, 0) * 100)}% | ${Math.round(Object.values(POLITICA_V2.pesos).reduce((a, b) => a + b, 0) * 100)}% |`);
  L.push('');
  L.push('Regras além dos pesos na v2:');
  L.push('');
  L.push('- corpus/tradição não ocupa vaga de voz individual (DEC-CUR-02);');
  L.push('- exige fonte recuperável (Documento 13, seção 7.2);');
  L.push('- limite por universo principal: com 5 vozes, no máximo 2 do mesmo universo; com 2 a 4 vozes, ao menos 2 universos, quando houver alternativa elegível (DEC-CUR-07). Sem alternativa, a exceção é registrada;');
  L.push('- desempate: pertinência, qualidade da fonte, complementaridade e `thinker_id` (Documento 13, seção 7.3). Na v1, o desempate era pelo nome.');
  L.push('');
  L.push('## Resultado agregado');
  L.push('');
  L.push('| Indicador | v1 | v2 |');
  L.push('|---|---:|---:|');
  L.push(`| Entradas com Conselho reunido | ${m1.comVozes} | ${m2.comVozes} |`);
  L.push(`| Média de vozes por Conselho | ${f2(m1.mediaVozes)} | ${f2(m2.mediaVozes)} |`);
  L.push(`| Vozes sem nenhuma fonte recuperável | ${m1.semFonte} | ${m2.semFonte} |`);
  L.push(`| Corpus convocado como voz | ${m1.corpusComoVoz} | ${m2.corpusComoVoz} |`);
  L.push(`| Dalai Lama e Tradições budistas como duas vozes | ${m1.dalaiECorpusJuntos} | ${m2.dalaiECorpusJuntos} |`);
  L.push(`| Média de universos por Conselho | ${f2(m1.mediaUniversos)} | ${f2(m2.mediaUniversos)} |`);
  L.push(`| Maior número de vozes do mesmo universo | ${m1.maxMesmoUniverso} | ${m2.maxMesmoUniverso} |`);
  L.push(`| Conselhos acima do limite por universo | ${m1.acimaDoLimite} | ${m2.acimaDoLimite} |`);
  L.push(`| Conselhos com exceção de diversidade registrada | — | ${m2.relaxadas} |`);
  L.push(`| Média da relação com as virtudes pedidas (vozes escolhidas) | ${f3(m1.mediaRelacao)} | ${f3(m2.mediaRelacao)} |`);
  L.push(`| Média da pertinência ao caso (vozes escolhidas) | ${f3(m1.mediaPertinencia)} | ${f3(m2.mediaPertinencia)} |`);
  L.push(`| Entradas com seleção diferente (vozes ou ordem) | — | ${mudaram.length} de ${lista.length} |`);
  L.push(`| Entradas com conjunto de vozes diferente | — | ${mudaramConjunto.length} de ${lista.length} |`);
  L.push('');
  L.push('## Concentração: aparições por voz nas ' + lista.length + ' entradas');
  L.push('');
  L.push('| Voz | v1 | v2 | Diferença |');
  L.push('|---|---:|---:|---:|');
  const todos = [...new Set([...m1.aparicoes.keys(), ...m2.aparicoes.keys()])].sort(
    (x, y) => (m1.aparicoes.get(y) ?? 0) - (m1.aparicoes.get(x) ?? 0) || (m2.aparicoes.get(y) ?? 0) - (m2.aparicoes.get(x) ?? 0) || x.localeCompare(y),
  );
  for (const id of todos) {
    const a = m1.aparicoes.get(id) ?? 0;
    const b = m2.aparicoes.get(id) ?? 0;
    L.push(`| ${nome(id)} | ${a} | ${b} | ${b - a > 0 ? '+' : ''}${b - a} |`);
  }
  L.push('');
  L.push('## Os seis casos de referência');
  L.push('');
  for (const e of lista.filter((x) => x.grupo === 'caso-ids' || x.grupo === 'caso-situacao')) L.push(...explicarCaso(e));
  L.push('## Determinismo');
  L.push('');
  L.push('Cada entrada foi executada duas vezes por política; os resultados foram idênticos (verificado pelo teste que gera este relatório).');
  L.push('');
  return L.join('\n');
}
