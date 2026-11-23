/* Comparação entre v1 (histórica), v2 (baseline da branch antes da revisão) e v2.1 (revisão DEC-CUR-10).
 * Gera docs/governanca/curadoria/comparacao-politicas-selecao-v2.1.md. A comparação v1 × v2 anterior continua
 * em comparacao-politicas-selecao.md, sem alteração. Determinístico: não usa data nem relógio. */
import { getThinker } from '../../../src/domain/catalog';
import {
  CONTEXTO_PADRAO,
  deliberarSelecao,
  limitePorUniverso,
  POLITICA_V1,
  POLITICA_V2,
  POLITICA_V2_1,
  type PoliticaSelecao,
  type ResultadoSelecao,
} from '../../../src/domain/council';
import { completudeBibliografica, getUniverso, papelDoRegistro, referenciasDe } from '../../../src/domain/curadoria';
import { entradasAB, type EntradaAB } from './comparacao-politicas';

const POLITICAS = [POLITICA_V1, POLITICA_V2, POLITICA_V2_1] as const;
const ROTULO: Record<string, string> = {
  [POLITICA_V1.id]: 'v1',
  [POLITICA_V2.id]: 'v2',
  [POLITICA_V2_1.id]: 'v2.1',
};
const nome = (id: string) => getThinker(id)?.name ?? id;
const universoNome = (u?: string) => (u ? getUniverso(u)?.nome ?? u : 'sem universo');
const rodar = (e: EntradaAB, p: PoliticaSelecao) => deliberarSelecao(CONTEXTO_PADRAO, e.input, e.max, p);
const idsDe = (r: ResultadoSelecao) => r.selecionados.map((s) => s.thinker.id);
const f3 = (x: number) => x.toFixed(3).replace('.', ',');
const f4 = (x: number) => x.toFixed(4).replace('.', ',');
const pct = (x: number) => `${x >= 0 ? '+' : ''}${(x * 100).toFixed(2).replace('.', ',')}%`;

/** Fonte "pendente": a voz só tem referências-base cujos metadados editoriais não estão completos. */
const fontePendente = (id: string) => {
  const t = getThinker(id);
  if (!t || t.workIds.length) return false;
  const refs = referenciasDe(id);
  return refs.length > 0 && refs.every((r) => completudeBibliografica(r) !== 'completa');
};

interface M {
  comVozes: number;
  vozes: number;
  corpus: number;
  juntos: number;
  universosSoma: number;
  maxU: number;
  acima: number;
  conselhosComExcecao: number;
  excecoesPorMotivo: Map<string, number>;
  substituicoes: number;
  substituicoesQualificadas: number;
  somaRelacao: number;
  somaPertinencia: number;
  tematica: number;
  contextual: number;
  elegiveis: number;
  pendentes: number;
}

function medir(lista: EntradaAB[], p: PoliticaSelecao): M {
  const m: M = {
    comVozes: 0, vozes: 0, corpus: 0, juntos: 0, universosSoma: 0, maxU: 0, acima: 0, conselhosComExcecao: 0,
    excecoesPorMotivo: new Map(), substituicoes: 0, substituicoesQualificadas: 0, somaRelacao: 0, somaPertinencia: 0,
    tematica: 0, contextual: 0, elegiveis: 0, pendentes: 0,
  };
  const universo = CONTEXTO_PADRAO.universo!;
  for (const e of lista) {
    const r = rodar(e, p);
    const ids = idsDe(r);
    if (!ids.length) continue;
    m.comVozes++;
    m.vozes += ids.length;
    if (r.diversityConstraintRelaxed) m.conselhosComExcecao++;
    for (const x of r.excecoes) m.excecoesPorMotivo.set(x.motivo, (m.excecoesPorMotivo.get(x.motivo) ?? 0) + 1);
    m.substituicoes += r.substituicoes.length;
    m.substituicoesQualificadas += r.substituicoes.filter((s) => s.avaliacaoIncluida.diversityEligible).length;
    const cont = new Map<string, number>();
    for (const id of ids) {
      if (papelDoRegistro(getThinker(id)!) === 'contextual_corpus') m.corpus++;
      const u = universo(id) ?? 'sem';
      cont.set(u, (cont.get(u) ?? 0) + 1);
      const a = r.avaliacoes[id];
      if (a.thematicRelevance === 'demonstrada') m.tematica++;
      if (a.contextualRelevance === 'documentada') m.contextual++;
      if (a.diversityEligible) m.elegiveis++;
      if (fontePendente(id)) m.pendentes++;
    }
    if (ids.includes('dalai-lama') && ids.includes('tradicoes-budistas')) m.juntos++;
    m.universosSoma += cont.size;
    const maior = Math.max(...cont.values());
    m.maxU = Math.max(m.maxU, maior);
    if (maior > limitePorUniverso(e.max)) m.acima++;
    for (const d of r.detalhes) {
      m.somaRelacao += d.criterios.relacaoVirtudes;
      m.somaPertinencia += d.criterios.pertinencia;
    }
  }
  return m;
}

function explicar(e: EntradaAB): string[] {
  const [a, b, c] = POLITICAS.map((p) => rodar(e, p));
  const [ia, ib, ic] = [a, b, c].map(idsDe);
  const L: string[] = [];
  L.push(`#### ${e.rotulo} (${e.grupo === 'caso-ids' ? 'pelos identificadores do caso' : 'pela situação descrita'})`);
  L.push('');
  L.push(`- v1: ${ia.map(nome).join(', ') || '—'}`);
  L.push(`- v2: ${ib.map(nome).join(', ') || '—'}`);
  L.push(`- v2.1: ${ic.map(nome).join(', ') || '—'}`);
  const saiu = ib.filter((id) => !ic.includes(id));
  const entrou = ic.filter((id) => !ib.includes(id));
  if (!saiu.length && !entrou.length) L.push(`- De v2 para v2.1: mesmas vozes${ib.join() === ic.join() ? ', mesma ordem' : ', ordem diferente'}.`);
  for (const id of saiu) {
    const sub = b.substituicoes.find((s) => s.incluida === id);
    const dv2 = b.detalhes.find((d) => d.thinkerId === id)!;
    let motivo: string;
    if (sub) {
      const av = sub.avaliacaoIncluida;
      motivo = `na v2 entrou por diversidade no lugar de ${nome(sub.preterida)}, mas não é alternativa qualificada (pertinência temática ${av.thematicRelevance}; contextual ${av.contextualRelevance})`;
    } else if (dv2.criterios.diversidade === 1 && !rodar(e, POLITICA_V2_1).avaliacoes[id]) {
      motivo = `na v2 recebia o critério de diversidade; na v2.1 esse critério só vale para alternativa qualificada, e a pontuação ficou abaixo das vozes escolhidas`;
    } else motivo = 'pontuação menor que a das vozes escolhidas na v2.1';
    L.push(`- Saiu ${nome(id)} (${universoNome(dv2.universo)}): ${motivo}.`);
  }
  for (const id of entrou) {
    const d = c.detalhes.find((x) => x.thinkerId === id)!;
    const av = c.avaliacoes[id];
    const antes = deliberarSelecao(CONTEXTO_PADRAO, e.input, 26, POLITICA_V2).detalhes.find((x) => x.thinkerId === id);
    const fonte = antes && antes.criterios.fontes !== d.criterios.fontes ? `; critério de fonte ${f3(antes.criterios.fontes)} na v2 → ${f3(d.criterios.fontes)} na v2.1` : '';
    L.push(
      `- Entrou ${nome(id)} (${universoNome(d.universo)}): relação com as virtudes ${f3(d.criterios.relacaoVirtudes)}, integra o caso ${f3(d.criterios.pertinencia)}, fonte ${f3(d.criterios.fontes)}; pertinência temática ${av.thematicRelevance}, contextual ${av.contextualRelevance}${fonte}.`,
    );
  }
  for (const s of c.substituicoes)
    L.push(
      `- Substituição na v2.1 (vaga ${s.vaga}): ${nome(s.incluida)} no lugar de ${nome(s.preterida)} — temática ${s.avaliacaoIncluida.thematicRelevance} (${s.avaliacaoIncluida.evidencia.relacoes.join(', ')}), contextual ${s.avaliacaoIncluida.contextualRelevance} (${s.avaliacaoIncluida.evidencia.caso}: "${s.avaliacaoIncluida.evidencia.perspectiva}"); universos antes: ${s.universosAntes.map(universoNome).join(', ')}.`,
    );
  for (const x of c.excecoes) L.push(`- Exceção na v2.1 (vaga ${x.vaga}): ${nome(x.candidato)}, ${universoNome(x.universo)}, motivo \`${x.motivo}\`.`);
  L.push('');
  return L;
}

function explicarCase05(lista: EntradaAB[]): string[] {
  const e = lista.find((x) => x.grupo === 'caso-ids' && x.rotulo.startsWith('CASE05'))!;
  const todos = (p: PoliticaSelecao) => deliberarSelecao(CONTEXTO_PADRAO, e.input, 26, p).detalhes;
  const linha = (p: PoliticaSelecao, id: string) => {
    const d = todos(p).find((x) => x.thinkerId === id);
    return d ? `fonte ${f3(d.criterios.fontes)}, relação ${f3(d.criterios.relacaoVirtudes)}, integra o caso ${f3(d.criterios.pertinencia)}` : 'não pontuado';
  };
  const ordem = (p: PoliticaSelecao) => todos(p).map((d) => `${nome(d.thinkerId)} (${f4(d.total)})`).join('; ');
  const v21 = rodar(e, POLITICA_V2_1);
  return [
    '## CASE05 (decisões) pelos identificadores: reavaliação',
    '',
    'Ordem completa de escolha, sem corte de vagas (pontuação total da vaga entre parênteses), para mostrar onde cada voz ficaria:',
    '',
    `- v2: ${ordem(POLITICA_V2)}`,
    `- v2.1: ${ordem(POLITICA_V2_1)}`,
    '',
    `- Sócrates: v2 → ${linha(POLITICA_V2, 'socrates')}; v2.1 → ${linha(POLITICA_V2_1, 'socrates')}. Avaliação na v2.1: ${JSON.stringify(v21.avaliacoes.socrates ?? 'não escolhido entre as 5')}.`,
    `- Miyamoto Musashi: v2 → ${linha(POLITICA_V2, 'musashi')}; v2.1 → ${linha(POLITICA_V2_1, 'musashi')}. Avaliação na v2.1: ${JSON.stringify(v21.avaliacoes.musashi ?? 'não escolhido entre as 5')}.`,
    '',
  ];
}

export function relatorioTresPoliticas(): string {
  const lista = entradasAB();
  const ms = POLITICAS.map((p) => medir(lista, p));
  const mud = (p1: PoliticaSelecao, p2: PoliticaSelecao, conjunto: boolean) =>
    lista.filter((e) => {
      const a = idsDe(rodar(e, p1));
      const b = idsDe(rodar(e, p2));
      return conjunto ? [...a].sort().join() !== [...b].sort().join() : a.join() !== b.join();
    }).length;
  const L: string[] = [];
  L.push('# Comparação das políticas de seleção: v1, v2 e v2.1');
  L.push('');
  L.push('> Gerado por `tests/unit/support/comparacao-tres-politicas.ts` (teste `relatorios-curadoria.test.ts`). Não editar à mão. Regenerar: `RELATORIOS=1 npx vitest run tests/unit/relatorios-curadoria.test.ts`.');
  L.push('');
  L.push('| Campo | Valor |');
  L.push('|---|---|');
  L.push('| Decisão | DEC-CUR-10 (revisão humana da Fase 2), sobre DEC-CUR-05 e DEC-CUR-07; ver ADR-CUR-03 e ADR-CUR-04 |');
  L.push('| Data da execução | 2026-11-23 |');
  L.push('| Commit-base | `0b2c40d` (branch `curadoria/fase-2-decisoes` antes da revisão), sobre `5d81ecc` |');
  L.push(`| Políticas | \`${POLITICA_V1.id}\` (histórica), \`${POLITICA_V2.id}\` (baseline da branch), \`${POLITICA_V2_1.id}\` (operacional) |`);
  L.push(`| Entradas | ${lista.length}, as mesmas dos snapshots: 48 virtudes, 8 famílias, 6 casos pela situação, 6 casos pelos identificadores, 7 dimensões, entrada vazia, limites 2, 3 e 4 |`);
  L.push('| Ambiente | Vitest (Node), dados do catálogo da branch; sem rede, sem dados de usuários |');
  L.push('| Comparação anterior | `comparacao-politicas-selecao.md` (v1 × v2), preservada e ainda reproduzida pelo mesmo teste |');
  L.push('');
  L.push('## O que muda da v2 para a v2.1');
  L.push('');
  L.push('Pesos iguais (30/25/15/15/10/5). Duas regras mudam:');
  L.push('');
  L.push('1. **Alternativa qualificada para a diversidade.** Na v2, bastava integrar o caso ou ter relação prioritária no Documento 04. Na v2.1, é preciso pertinência temática demonstrada (relação prioritária ou `relationType` com uma virtude pedida) **e** pertinência contextual documentada (o caso de referência registra uma perspectiva própria para a pessoa, distinta do campo geral dela). Só quem é qualificado recebe o critério de diversidade ou pode substituir uma voz acima do limite por universo. Sem caso de referência, a pertinência contextual é `insufficient_data` e não há substituição.');
  L.push('2. **Fonte.** Na v2, uma referência-base com metadados editoriais a conferir valia 0,5. Na v2.1, o critério mede só se há fonte identificada (obra do catálogo ou referência-base que identifica a obra ou o testemunho): 1 ou 0. Completude bibliográfica e confiabilidade são registradas à parte e não pontuam.');
  L.push('');
  L.push('## Definições das métricas');
  L.push('');
  L.push('- **Média de "integra o caso"**: média, entre as vozes escolhidas, do critério de pertinência do Documento 13 como calculado pelo motor (1 se integra o caso mais aderente, 0,6 se integra outro caso, 0 se não integra). Mede pertença ao caso, não pertinência contextual comprovada.');
  L.push('- **Média da relação com as virtudes pedidas**: média do critério de relação (força das relações com as virtudes pedidas, com teto 1).');
  L.push('- **Vozes com pertinência temática demonstrada / contextual documentada / qualificadas**: contagem de vozes escolhidas, somadas em todas as entradas, segundo a avaliação da v2.1 (calculada para as três políticas, para comparação).');
  L.push('- **Substituições**: vagas em que a voz mais pontuada excedia o limite do universo e foi trocada por uma alternativa de outro universo. **Qualificadas**: a alternativa tinha as duas pertinências.');
  L.push('- **Fonte com metadados pendentes**: vozes escolhidas cuja única fonte são referências-base sem editora, ano e ISBN/DOI completos.');
  L.push('- Não há teste estatístico: as diferenças descrevem estas 79 entradas, não uma população.');
  L.push('');
  L.push('## Resultado agregado');
  L.push('');
  L.push('| Indicador | v1 | v2 | v2.1 |');
  L.push('|---|---:|---:|---:|');
  const row = (rotulo: string, f: (m: M) => string) => L.push(`| ${rotulo} | ${ms.map(f).join(' | ')} |`);
  row('Entradas com Conselho reunido', (m) => String(m.comVozes));
  row('Total de vozes escolhidas', (m) => String(m.vozes));
  row('Média de vozes por Conselho', (m) => f3(m.vozes / m.comVozes));
  row('Corpus convocado como voz', (m) => String(m.corpus));
  row('Dalai Lama e Tradições budistas como duas vozes', (m) => String(m.juntos));
  row('Média de "integra o caso"', (m) => f4(m.somaPertinencia / m.vozes));
  row('Média da relação com as virtudes pedidas', (m) => f4(m.somaRelacao / m.vozes));
  row('Vozes com pertinência temática demonstrada', (m) => `${m.tematica} de ${m.vozes}`);
  row('Vozes com pertinência contextual documentada', (m) => `${m.contextual} de ${m.vozes}`);
  row('Vozes qualificadas (temática e contextual)', (m) => `${m.elegiveis} de ${m.vozes}`);
  row('Média de universos por Conselho', (m) => f3(m.universosSoma / m.comVozes));
  row('Maior número de vozes do mesmo universo', (m) => String(m.maxU));
  row('Conselhos acima do limite por universo', (m) => String(m.acima));
  row('Vagas com substituição por diversidade', (m) => String(m.substituicoes));
  row('Vagas com substituição por alternativa qualificada', (m) => String(m.substituicoesQualificadas));
  row('Conselhos com ao menos uma exceção de diversidade', (m) => String(m.conselhosComExcecao));
  row('Vagas em exceção: sem alternativa pertinente (regra da v2)', (m) => String(m.excecoesPorMotivo.get('sem-alternativa-pertinente') ?? 0));
  row('Vagas em exceção: sem alternativa qualificada', (m) => String(m.excecoesPorMotivo.get('sem-alternativa-qualificada') ?? 0));
  row('Vagas em exceção: sem caso, contexto não avaliável', (m) => String(m.excecoesPorMotivo.get('contexto-nao-avaliavel') ?? 0));
  row('Vozes com fonte de metadados pendentes', (m) => String(m.pendentes));
  L.push('');
  const [m1, m2, m21] = ms;
  const p1 = m1.somaPertinencia / m1.vozes;
  const p2 = m2.somaPertinencia / m2.vozes;
  const p21 = m21.somaPertinencia / m21.vozes;
  const r1 = m1.somaRelacao / m1.vozes;
  const r2 = m2.somaRelacao / m2.vozes;
  const r21 = m21.somaRelacao / m21.vozes;
  L.push('**Variação relativa** (mesma base de 79 entradas, sem inferência estatística):');
  L.push('');
  L.push(`- "Integra o caso": v1 → v2 ${pct(p2 / p1 - 1)}; v2 → v2.1 ${pct(p21 / p2 - 1)}; v1 → v2.1 ${pct(p21 / p1 - 1)}.`);
  L.push(`- Relação com as virtudes pedidas: v1 → v2 ${pct(r2 / r1 - 1)}; v2 → v2.1 ${pct(r21 / r2 - 1)}; v1 → v2.1 ${pct(r21 / r1 - 1)}.`);
  L.push('');
  L.push('## Mudanças de seleção');
  L.push('');
  L.push('| Comparação | Vozes ou ordem diferentes | Conjunto de vozes diferente |');
  L.push('|---|---:|---:|');
  L.push(`| v1 → v2 | ${mud(POLITICA_V1, POLITICA_V2, false)} de ${lista.length} | ${mud(POLITICA_V1, POLITICA_V2, true)} de ${lista.length} |`);
  L.push(`| v2 → v2.1 | ${mud(POLITICA_V2, POLITICA_V2_1, false)} de ${lista.length} | ${mud(POLITICA_V2, POLITICA_V2_1, true)} de ${lista.length} |`);
  L.push(`| v1 → v2.1 | ${mud(POLITICA_V1, POLITICA_V2_1, false)} de ${lista.length} | ${mud(POLITICA_V1, POLITICA_V2_1, true)} de ${lista.length} |`);
  L.push('');
  L.push('## Os seis casos de referência');
  L.push('');
  for (const e of lista.filter((x) => x.grupo === 'caso-ids' || x.grupo === 'caso-situacao')) L.push(...explicar(e));
  L.push(...explicarCase05(lista));
  L.push('## Determinismo');
  L.push('');
  L.push('Cada entrada foi executada duas vezes por política; os resultados foram idênticos (verificado pelo teste que gera este relatório e por `conselho-fase2-revisao.test.ts`).');
  L.push('');
  L.push(`Rótulos: ${POLITICAS.map((p) => `${ROTULO[p.id]} = \`${p.id}\``).join('; ')}.`);
  L.push('');
  return L.join('\n');
}
