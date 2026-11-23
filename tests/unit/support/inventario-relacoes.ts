/* Inventário de revisão das 189 relações pensador–virtude (DEC-CUR-08).
 * Gera docs/governanca/curadoria/inventario-relacoes-v1.md. Não altera nenhuma relação: só lê.
 *
 * A triagem usa regras explícitas e reproduzíveis (abaixo). Ela NÃO é validação, NÃO é a escala
 * P1–P4 do Documento 04, NÃO é a escala F1–F4 do Documento 14 e NÃO reproduz a classificação item a
 * item da auditoria anterior (que não foi registrada no repositório). */
import { getThinker, getVirtue, thinkers, thinkerVirtues, virtues } from '../../../src/domain/catalog';
import { evidenciasDaRelacao, getClassificacao, getUniverso, papelDoRegistro, qualidadeDaFonte, universos } from '../../../src/domain/curadoria';
import type { ThinkerVirtue } from '../../../src/domain/types';

export type TipoJustificativa = 'especifica-doc04' | 'campo-do-autor' | 'pendente';
export type PrioridadeRevisao = 'alta' | 'media' | 'baixa';

export interface LinhaInventario {
  id: string;
  autor: string;
  autorId: string;
  papel: 'voz' | 'corpus' | 'nao-habilitado';
  virtude: string;
  relationType: string;
  prioridadeDoc04: string;
  fontes: string;
  obrasNaRelacao: string;
  fonteDoAutor: string;
  justificativa: TipoJustificativa;
  nivelF: string;
  status: string;
  prioridade: PrioridadeRevisao;
  motivos: string[];
  especialista: boolean;
}

export function tipoDeJustificativa(r: ThinkerVirtue): TipoJustificativa {
  if (r.justification.startsWith('Referência indicada nos documentos do projeto')) return 'pendente';
  if (r.justification.startsWith('Campo de contribuição registrado no Documento 04')) return 'campo-do-autor';
  return 'especifica-doc04';
}

const JUSTIFICATIVA: Record<TipoJustificativa, string> = {
  'especifica-doc04': 'Específica (Documento 04, seção 3.2)',
  'campo-do-autor': 'Campo geral do autor, repetido em várias virtudes',
  pendente: 'Pendente ("justificativa detalhada pendente de curadoria")',
};

export function linhasDoInventario(): LinhaInventario[] {
  return thinkerVirtues.map((r) => {
    const t = getThinker(r.thinkerId)!;
    const c = getClassificacao(t.id);
    const papel = !t.council ? 'nao-habilitado' : papelDoRegistro(t) === 'contextual_corpus' ? 'corpus' : 'voz';
    const justificativa = tipoDeJustificativa(r);
    const espiritual = (c?.universos ?? []).includes('tradicoes-espirituais');
    const motivos: string[] = [];
    const especialista = papelDoRegistro(t) === 'contextual_corpus' || espiritual || t.id === 'socrates';
    if (papelDoRegistro(t) === 'contextual_corpus') motivos.push('tradição ou corpus: exige recorte e especialista');
    else if (espiritual) motivos.push('tradição espiritual ou contemplativa: exige especialista');
    if (t.id === 'socrates') motivos.push('Sócrates só é conhecido por testemunhos');
    if (justificativa === 'pendente') motivos.push('justificativa detalhada pendente');
    if (justificativa === 'campo-do-autor') motivos.push('justificativa genérica do autor, não da virtude');
    if (!r.workIds.length) motivos.push('nenhuma obra ligada à relação');
    if (papel === 'nao-habilitado') motivos.push('registro não habilitado: a relação não fundamenta perspectiva hoje');
    const prioridade: PrioridadeRevisao =
      especialista || justificativa === 'pendente' ? 'alta' : justificativa === 'campo-do-autor' && !r.workIds.length ? 'media' : 'baixa';
    const fonteAutor = qualidadeDaFonte(t);
    const niveis = evidenciasDaRelacao(r.id).map((e) => e.nivel).filter(Boolean);
    return {
      id: r.id,
      autor: t.name,
      autorId: t.id,
      papel,
      virtude: `${r.virtueId} ${getVirtue(r.virtueId)?.name ?? ''}`.trim(),
      relationType: r.relationType ?? '—',
      prioridadeDoc04: r.priority === null ? 'referência' : `${r.priority}º`,
      fontes: r.sources.join(', '),
      obrasNaRelacao: r.workIds.join(', ') || '—',
      /* DEC-CUR-10: disponibilidade de fonte separada da completude dos metadados editoriais. */
      fonteDoAutor: fonteAutor === 1 ? 'disponível' : fonteAutor === 0.5 ? 'identificada; metadados a conferir' : 'nenhuma',
      justificativa,
      nivelF: niveis.length ? niveis.join(', ') : '—',
      status: r.status,
      prioridade,
      motivos,
      especialista,
    };
  });
}

const PRIORIDADE: Record<PrioridadeRevisao, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

export function relatorioInventario(): string {
  const linhas = linhasDoInventario();
  const conta = <T,>(f: (l: LinhaInventario) => T) => {
    const m = new Map<T, number>();
    linhas.forEach((l) => m.set(f(l), (m.get(f(l)) ?? 0) + 1));
    return m;
  };
  const L: string[] = [];
  L.push('# Inventário de revisão das relações pensador–virtude (v1)');
  L.push('');
  L.push('> Gerado por `tests/unit/support/inventario-relacoes.ts` (teste `relatorios-curadoria.test.ts`). Não editar à mão: rode `RELATORIOS=1 npx vitest run tests/unit/relatorios-curadoria.test.ts`.');
  L.push('');
  L.push('| Campo | Valor |');
  L.push('|---|---|');
  L.push('| Decisão | DEC-CUR-08 (ver ADR-CUR-04) |');
  L.push(`| Relações | ${linhas.length} |`);
  L.push(`| Status | ${[...conta((l) => l.status)].map(([s, n]) => `${n} ${s}`).join('; ')} |`);
  L.push(`| Evidências F1–F4 preenchidas | ${linhas.filter((l) => l.nivelF !== '—').length} |`);
  L.push('| Revisor e data | Nenhuma relação revisada individualmente ainda |');
  L.push('');
  L.push('## Como ler');
  L.push('');
  L.push('- **Nenhuma relação foi validada, suspensa ou rejeitada por este inventário.** Mudança de status só depois de revisão individual e decisão humana formal.');
  L.push('- **Ausência de fonte cadastrada não é F4.** F4 é "fundamentação insuficiente" depois de análise; aqui a coluna F fica vazia até haver evidência conferida.');
  L.push('- **Três escalas que não se confundem:** `relationType` P1–P4 (Documento 04); F1–F4 (Documento 14, só em evidências); e a prioridade de revisão abaixo (alta, média, baixa), que é só ordem de trabalho.');
  L.push('- **Prioridade de revisão (regras):**');
  L.push('  - *alta*: tradição/corpus, tradição espiritual ou contemplativa, Sócrates (testemunhos) ou justificativa pendente;');
  L.push('  - *média*: justificativa genérica do autor e nenhuma obra ligada à relação;');
  L.push('  - *baixa*: as demais (justificativa específica do Documento 04, ou genérica com obra ligada). Baixa não quer dizer validada.');
  L.push('- **Anacronismos e limites:** os dados não têm marcação que permita detectá-los automaticamente. Ficam para a revisão individual, junto com o campo "Limites" de cada autor no catálogo.');
  L.push('- **Auditoria anterior:** sugeriu a triagem 41 / 125 / 15 / 8 (manter proposta com justificativa / buscar fonte / especialista / avaliar suspensão). A lista item a item não foi registrada no repositório; por isso estes números não foram reconfirmados um a um. Os totais abaixo vêm das regras explícitas deste inventário.');
  L.push('');
  L.push('## Resumo da triagem');
  L.push('');
  L.push('| Indicador | Relações |');
  L.push('|---|---:|');
  for (const p of ['alta', 'media', 'baixa'] as PrioridadeRevisao[]) L.push(`| Prioridade de revisão ${PRIORIDADE[p].toLowerCase()} | ${linhas.filter((l) => l.prioridade === p).length} |`);
  L.push(`| Precisam de revisão especializada | ${linhas.filter((l) => l.especialista).length} |`);
  for (const [j, n] of conta((l) => l.justificativa)) L.push(`| Justificativa: ${JUSTIFICATIVA[j]} | ${n} |`);
  L.push(`| Nenhuma obra ligada à relação | ${linhas.filter((l) => l.obrasNaRelacao === '—').length} |`);
  L.push(`| Autor sem nenhuma fonte recuperável | ${linhas.filter((l) => l.fonteDoAutor === 'nenhuma').length} |`);
  L.push(`| Autor com fonte identificada, mas metadados editoriais a conferir (não é falta de fonte nem baixa confiabilidade) | ${linhas.filter((l) => l.fonteDoAutor === 'identificada; metadados a conferir').length} |`);
  L.push(`| De registros não habilitados (não fundamentam perspectiva hoje) | ${linhas.filter((l) => l.papel === 'nao-habilitado').length} |`);
  L.push(`| De corpus de apoio (Tradições budistas) | ${linhas.filter((l) => l.papel === 'corpus').length} |`);
  L.push('');
  L.push('## Concentração por autor');
  L.push('');
  L.push('| Autor | Papel | Relações | Parte do total | Prioridade alta | Sem obra na relação |');
  L.push('|---|---|---:|---:|---:|---:|');
  const porAutor = [...conta((l) => l.autorId)].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  for (const [id, n] of porAutor) {
    const ls = linhas.filter((l) => l.autorId === id);
    L.push(
      `| ${ls[0].autor} | ${ls[0].papel === 'voz' ? 'voz' : ls[0].papel === 'corpus' ? 'corpus de apoio' : 'não habilitado'} | ${n} | ${((n / linhas.length) * 100).toFixed(1).replace('.', ',')}% | ${ls.filter((l) => l.prioridade === 'alta').length} | ${ls.filter((l) => l.obrasNaRelacao === '—').length} |`,
    );
  }
  L.push('');
  L.push('## Cobertura por virtude');
  L.push('');
  L.push('Vozes convocáveis (habilitadas e que não são corpus) com relação utilizável para cada virtude, e universos principais que elas cobrem.');
  L.push('');
  L.push('| Virtude | Vozes convocáveis | Prioritárias (Doc. 04) | Universos cobertos |');
  L.push('|---|---:|---:|---|');
  for (const v of virtues) {
    const ls = linhas.filter((l) => l.virtude.startsWith(`${v.id} `) && l.papel === 'voz');
    const univ = [...new Set(ls.map((l) => getClassificacao(l.autorId)?.universos[0]).filter(Boolean))].map((u) => getUniverso(u!)?.nome ?? u);
    L.push(`| ${v.id} ${v.name} | ${ls.length} | ${ls.filter((l) => l.prioridadeDoc04 !== 'referência').length} | ${univ.join('; ') || '—'} |`);
  }
  L.push('');
  L.push('## Cobertura por universo principal');
  L.push('');
  L.push('| Universo | Vozes convocáveis | Relações dessas vozes |');
  L.push('|---|---:|---:|');
  for (const u of universos) {
    const vozes = thinkers.filter((t) => t.council && papelDoRegistro(t) !== 'contextual_corpus' && getClassificacao(t.id)?.universos[0] === u.id);
    L.push(`| ${u.nome} | ${vozes.length} | ${linhas.filter((l) => vozes.some((t) => t.id === l.autorId)).length} |`);
  }
  L.push('');
  L.push('## Inventário completo');
  L.push('');
  L.push('Colunas: P1–P4 = `relationType` do Documento 04; Doc. 04 = posição do autor na lista da virtude; F = nível F1–F4 de evidência conferida (vazio = não avaliada); Conceito, revisor e data ficam em branco até a revisão individual.');
  L.push('');
  L.push('| ID | Autor | Virtude | P1–P4 | Doc. 04 | Fontes documentais | Obras | Fonte do autor | Justificativa | F | Status | Revisão | Especialista | Conceito | Revisor | Data |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  const J: Record<TipoJustificativa, string> = { 'especifica-doc04': 'específica', 'campo-do-autor': 'genérica', pendente: 'pendente' };
  for (const l of linhas)
    L.push(
      `| ${l.id} | ${l.autor} | ${l.virtude} | ${l.relationType} | ${l.prioridadeDoc04} | ${l.fontes} | ${l.obrasNaRelacao} | ${l.fonteDoAutor} | ${J[l.justificativa]} | ${l.nivelF} | ${l.status} | ${PRIORIDADE[l.prioridade]} | ${l.especialista ? 'sim' : 'não'} | — | — | — |`,
    );
  L.push('');
  return L.join('\n');
}
