/* Relatório da jornada e exportação legível do diário (Documento 06, seção 13.4; RF-110 a RF-117).
 * O relatório separa três coisas: informações registradas, percepções declaradas pela
 * pessoa e sínteses produzidas pelo sistema (que são só contagens, nunca avaliação). */
import { getExercise, getThinker, getVirtue } from './catalog';
import { entryTypeLabel, INVESTIGATION_BLOCKS, journeyStats, REVIEW_QUESTIONS, STAGE_STATES, STAGES, STATUS_LABEL } from './journey';
import type { DiaryEntry, Journey, UserData } from './types';
import { formatDate } from '../shared/util';

const byDate = <T extends { date: string }>(items: T[]) => [...items].sort((a, b) => a.date.localeCompare(b.date));

function entryLines(e: DiaryEntry): string[] {
  const lines = [`### ${formatDate(e.date)} · ${entryTypeLabel(e.type)} · ${e.situation}`];
  const add = (label: string, value: string) => value.trim() && lines.push(`- ${label}: ${value.trim()}`);
  add('Virtude', e.virtue);
  add('Contexto', e.context);
  add('Pensamentos', e.thoughts);
  add('Sentimentos', e.feelings.join(', '));
  add('Ações', e.actions.join(', '));
  add('Consequências', e.consequences);
  add('Aprendizado', e.learning);
  add('Observação', e.note);
  add('Exercício', e.exerciseId ? (getExercise(e.exerciseId)?.title ?? '') : '');
  return [...lines, ''];
}

export function buildDiaryExport(entries: DiaryEntry[]): string {
  return ['# Meu diário — Jornada da Virtude', '', `${entries.length} registros, do mais antigo ao mais recente.`, '', ...byDate(entries).flatMap(entryLines)].join('\n');
}

export function buildJourneyReport(journey: Journey, data: UserData): string {
  const entries = byDate(data.entries.filter((e) => e.journeyId === journey.id));
  const reviews = byDate(data.reviews.filter((r) => r.journeyId === journey.id));
  const sessions = byDate(data.sessions.filter((s) => s.journeyId === journey.id));
  const stats = journeyStats(journey, data);
  const out: string[] = [];
  const section = (title: string) => out.push('', `## ${title}`, '');

  out.push(`# ${journey.title}`, '', `Virtude principal: ${journey.virtueName}`);
  if (journey.relatedVirtueIds.length) out.push(`Virtudes relacionadas: ${journey.relatedVirtueIds.map((id) => getVirtue(id)?.name).filter(Boolean).join(', ')}`);
  out.push(`Situação: ${STATUS_LABEL[journey.status]}${journey.archivedAt ? ' (arquivada)' : ''}`);
  if (journey.startedOn) out.push(`Início: ${formatDate(journey.startedOn)}`);
  if (journey.completedOn) out.push(`Conclusão: ${formatDate(journey.completedOn)}`);

  out.push('', '---', '', '# Parte 1 — Informações registradas');
  section('Etapas');
  STAGES.forEach((s) => out.push(`- ${s.name}: ${STAGE_STATES[journey.stages[s.id].state].label}`));
  section('Exercícios');
  if (!journey.exercises.length) out.push('Nenhum exercício associado.');
  journey.exercises.forEach((e) => out.push(`- ${getExercise(e.exerciseId)?.title ?? e.exerciseId}: ${e.times} ${e.times === 1 ? 'experiência registrada' : 'experiências registradas'}`));
  section('Diário');
  if (!entries.length) out.push('Nenhum registro. O diário é voluntário: a ausência de registros não significa ausência de prática.');
  out.push(...entries.flatMap(entryLines));
  if (sessions.length) {
    section('Sessões do Conselho de Sabedoria');
    sessions.forEach((s) => {
      out.push(`### ${formatDate(s.date)} · ${s.situation.slice(0, 120)}`);
      out.push(`- Perspectivas consultadas: ${s.contributions.map((c) => getThinker(c.thinkerId)?.name ?? c.thinkerId).join(', ') || 'nenhuma'}`);
      if (s.reflection.trim()) out.push(`- Minha reflexão: ${s.reflection.trim()}`);
      if (s.action.trim()) out.push(`- Ação escolhida: ${s.action.trim()}`);
      out.push('');
    });
  }

  out.push('', '---', '', '# Parte 2 — Percepções declaradas por mim');
  section('Intenção inicial');
  out.push(journey.intention.motivation || '(não registrada)');
  if (journey.intention.situation) out.push('', `Situação que eu queria compreender: ${journey.intention.situation}`);
  if (journey.intention.expectation) out.push('', `O que eu esperava aprender: ${journey.intention.expectation}`);
  section('Investigação');
  let answered = 0;
  for (const block of INVESTIGATION_BLOCKS) {
    for (const q of block.questions) {
      const answer = journey.investigation[q.id];
      if (!answer?.trim()) continue;
      answered++;
      out.push(`**${q.label}**`, answer.trim(), '');
    }
  }
  if (!answered) out.push('Nenhuma resposta registrada.');
  if (journey.plan.trim()) {
    section('Compromisso de prática');
    out.push(journey.plan.trim());
  }
  section('Revisões');
  if (!reviews.length) out.push('Nenhuma revisão registrada.');
  reviews.forEach((r) => {
    out.push(`### ${formatDate(r.date)} · ${r.kind === 'final' ? 'Revisão final' : r.kind === 'legado' ? 'Revisão da versão anterior' : 'Revisão periódica'}`);
    REVIEW_QUESTIONS.forEach((q) => r.answers[q.id]?.trim() && out.push(`- ${q.label} ${r.answers[q.id].trim()}`));
    if (r.learnings.trim()) out.push(`- Aprendizados: ${r.learnings.trim()}`);
    if (r.perception.trim()) out.push(`- Como compreendo a virtude agora: ${r.perception.trim()}`);
    if (r.synthesis.trim()) out.push(`- Síntese pessoal: ${r.synthesis.trim()}`);
    if (r.firstWeek || r.lastWeek) out.push(`- Dias em que a virtude faltou: primeira semana “${r.firstWeek || '—'}”, última semana “${r.lastWeek || '—'}”`);
    if (r.moments.length) out.push(`- Momentos em que percebi a virtude: ${r.moments.join(', ')}`);
    out.push('');
  });
  if (journey.notes.trim()) {
    section('Observações gerais');
    out.push(journey.notes.trim());
  }

  out.push('', '---', '', '# Parte 3 — Síntese produzida pelo sistema');
  out.push('', 'Contagens de atividades registradas. Indicam participação no percurso; não medem virtude, caráter ou valor pessoal.', '');
  out.push(`- Registros no diário: ${stats.entries} (${stats.byType.PRACTICE} práticas, ${stats.byType.DIFFICULTY} dificuldades, ${stats.byType.REFLECTION} reflexões, ${stats.byType.DISCOVERY} descobertas)`);
  out.push(`- Dias com registro: ${stats.daysWithEntries}`);
  out.push(`- Exercícios experimentados: ${stats.exercisesTried}`);
  out.push(`- Revisões: ${stats.reviews}`);
  out.push(`- Sessões do Conselho: ${stats.sessions}`);
  return out.join('\n');
}
