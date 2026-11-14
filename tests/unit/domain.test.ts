/* Regras da jornada, do diário e das revisões (Documento 07, seções 8, 9 e 15; Documento 06, seção 21). */
import { describe, expect, it } from 'vitest';
import {
  activeJourney,
  addRelatedVirtue,
  archiveJourney,
  completeJourney,
  createJourney,
  discardDraft,
  DomainError,
  pauseJourney,
  resumeJourney,
  saveEntry,
  saveReview,
  saveSession,
  selectPrimaryVirtue,
  setStageState,
  stampEntry,
  startExercise,
  startJourney,
  touchStage,
  unarchiveJourney,
} from '../../src/application/useCases';
import { decideSync } from '../../src/application/syncLogic';
import {
  canArchiveJourney,
  compareLegacyReview,
  currentStage,
  exerciseOptions,
  exerciseStatusLabel,
  journeyStats,
  nextAction,
  sortByDateDesc,
  virtueTrail,
  workedStages,
} from '../../src/domain/journey';
import { emptyData, isEmptyData, sanitizeWithReport } from '../../src/infrastructure/sanitize';
import type { CouncilSession, DiaryEntry, Review, UserData } from '../../src/domain/types';
import { daysBetween, isDate } from '../../src/shared/util';

const TODAY = '2026-11-13';

const entry = (over: Partial<DiaryEntry> = {}): DiaryEntry => ({
  id: 'e1', journeyId: null, date: TODAY, type: 'DIFFICULTY', virtueId: null, virtue: '', situation: 'Discussão',
  context: '', thoughts: '', feelings: [], actions: [], consequences: '', learning: '', note: '', stage: '',
  exerciseId: null, sessionId: null, createdAt: '', updatedAt: '', ...over,
});

const review = (journeyId: string, over: Partial<Review> = {}): Review => ({
  id: 'r1', journeyId, kind: 'periodica', date: TODAY, periodStart: '', periodEnd: '', answers: {}, synthesis: 'Percebi algo',
  learnings: '', perception: '', firstWeek: '', lastWeek: '', moments: [], createdAt: '', updatedAt: '', ...over,
});

const input = { virtueId: 'V07', virtueName: 'Paciência', motivation: 'Reagir menos' };

/** Jornada criada em rascunho (CT-001). */
function draft(): { data: UserData; id: string } {
  const created = createJourney(emptyData(), input, TODAY);
  return { data: created.data, id: created.journey.id };
}

/** Jornada em andamento. */
function active(): { data: UserData; id: string } {
  const { data, id } = draft();
  return { data: startJourney(data, id, TODAY), id };
}

describe('datas', () => {
  it('aceita apenas datas de calendário reais', () => {
    expect(isDate('2026-02-28')).toBe(true);
    expect(isDate('2026-02-30')).toBe(false);
    expect(isDate('2026-13-01')).toBe(false);
    expect(isDate('30/10/2026')).toBe(false);
    expect(daysBetween('2026-10-30', '2026-11-13')).toBe(14);
  });
});

describe('ciclo de vida da jornada (Doc. 07, seção 9)', () => {
  it('CT-001: cria jornada válida em DRAFT, com UUID, intenção e virtude principal', () => {
    const { data, id } = draft();
    const journey = data.journeys[0];
    expect(journey.id).toBe(id);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(journey).toMatchObject({ status: 'DRAFT', virtueName: 'Paciência', archivedAt: '', startedOn: '' });
    expect(journey.title).toBe('Jornada: Paciência');
    expect(journey.history.map((h) => h.kind)).toEqual(['criada']);
    expect(journey.stages.despertar.state).toBe('em-andamento');
  });

  it('CT-002: recusa jornada sem virtude principal ou sem intenção, com mensagem clara (RN-002, RN-003)', () => {
    expect(() => createJourney(emptyData(), { ...input, virtueName: '  ' }, TODAY)).toThrow(/virtude principal/);
    expect(() => createJourney(emptyData(), { ...input, motivation: '' }, TODAY)).toThrow(/intenção/);
    expect(() => createJourney(emptyData(), { ...input, motivation: '' }, TODAY)).toThrow(DomainError);
  });

  it('CT-003: iniciar leva de DRAFT para ACTIVE e registra a data', () => {
    const { data, id } = active();
    expect(activeJourney(data)).toMatchObject({ id, status: 'ACTIVE', startedOn: TODAY });
    expect(() => startJourney(data, id, TODAY)).toThrow(/rascunho/);
  });

  it('CT-004 e CT-005: pausa a jornada ativa e a retoma', () => {
    const { data, id } = active();
    const paused = pauseJourney(data, id, TODAY);
    expect(paused.journeys[0]).toMatchObject({ status: 'PAUSED', pausedOn: TODAY });
    expect(() => pauseJourney(paused, id, TODAY)).toThrow();
    const resumed = resumeJourney(paused, id, TODAY);
    expect(resumed.journeys[0]).toMatchObject({ status: 'ACTIVE', pausedOn: '' });
    expect(resumed.journeys[0].history.map((h) => h.kind)).toEqual(['criada', 'iniciada', 'pausada', 'retomada']);
  });

  it('mantém uma só jornada ativa: exige pausar a outra, ou o faz quando autorizado (RN do Doc. 06)', () => {
    const first = active();
    const second = createJourney(first.data, { ...input, virtueId: 'V12', virtueName: 'Coragem' }, TODAY);
    expect(() => startJourney(second.data, second.journey.id, TODAY)).toThrow(/em andamento/);
    const started = startJourney(second.data, second.journey.id, TODAY, { pauseActive: true });
    expect(started.journeys.filter((j) => j.status === 'ACTIVE')).toHaveLength(1);
    expect(started.journeys.find((j) => j.id === first.id)!.status).toBe('PAUSED');
  });

  it('CT-006: conclui com revisão final e síntese pessoal, preservando registros (RN-010)', () => {
    let { data, id } = active();
    data = saveEntry(data, stampEntry(activeJourney(data), entry()), TODAY);
    expect(() => completeJourney(data, review(id, { synthesis: '   ' }), TODAY)).toThrow(/síntese/);
    const done = completeJourney(data, review(id, { synthesis: 'Aprendi a esperar' }), TODAY);
    expect(done.journeys[0]).toMatchObject({ status: 'COMPLETED', completedOn: TODAY });
    expect(done.journeys[0].stages.revisar.state).toBe('concluida');
    expect(done.reviews[0].kind).toBe('final');
    expect(done.entries).toHaveLength(1);
  });

  it('RN-009: uma jornada concluída não volta a ficar ativa', () => {
    const { data, id } = active();
    const done = completeJourney(data, review(id), TODAY);
    expect(() => resumeJourney(done, id, TODAY)).toThrow(/concluída não pode ser retomada/);
    expect(() => pauseJourney(done, id, TODAY)).toThrow();
  });

  it('CT-007 e RN-011: arquivar preenche archivedAt sem alterar COMPLETED nem apagar registros', () => {
    let { data, id } = active();
    data = saveEntry(data, stampEntry(activeJourney(data), entry()), TODAY);
    expect(() => archiveJourney(data, id, TODAY)).toThrow();
    const done = completeJourney(data, review(id), TODAY);
    expect(canArchiveJourney(done.journeys[0])).toBe(true);
    const archived = archiveJourney(done, id, TODAY);
    expect(archived.journeys[0].status).toBe('COMPLETED');
    expect(archived.journeys[0].archivedAt).not.toBe('');
    expect(archived.entries).toHaveLength(1);
    expect(unarchiveJourney(archived, id, TODAY).journeys[0].archivedAt).toBe('');
  });

  it('RN-006: só o rascunho pode ser descartado; os registros ficam sem jornada', () => {
    const { data, id } = draft();
    const withEntry = saveEntry(data, stampEntry(data.journeys[0], entry()), TODAY);
    const discarded = discardDraft(withEntry, id);
    expect(discarded.journeys).toHaveLength(0);
    expect(discarded.entries[0].journeyId).toBeNull();
    const started = startJourney(data, id, TODAY);
    expect(() => discardDraft(started, id)).toThrow(/rascunho/);
  });

  it('registra a troca da virtude principal no histórico e aceita virtudes relacionadas (RN-004)', () => {
    const { data, id } = active();
    const changed = selectPrimaryVirtue(data, id, { virtueId: 'V08', virtueName: 'Serenidade' }, TODAY);
    expect(changed.journeys[0].virtueName).toBe('Serenidade');
    expect(changed.journeys[0].history.at(-1)).toMatchObject({ kind: 'virtude-alterada', detail: expect.stringContaining('Paciência') });
    const related = addRelatedVirtue(addRelatedVirtue(changed, id, 'V06'), id, 'V06');
    expect(related.journeys[0].relatedVirtueIds).toEqual(['V06']);
    expect(addRelatedVirtue(related, id, 'V08').journeys[0].relatedVirtueIds).toEqual(['V06']);
  });
});

describe('etapas', () => {
  it('nasce com sete etapas e permite declarar e revisitar o estado (RN04)', () => {
    let { data, id } = active();
    const journey = activeJourney(data)!;
    expect(Object.keys(journey.stages)).toHaveLength(7);
    expect(workedStages(journey)).toBe(1);
    data = setStageState(data, id, 'despertar', 'concluida', TODAY);
    data = setStageState(data, id, 'identificar', 'nao-aplicavel', TODAY);
    expect(nextAction(activeJourney(data)!).stage).toBe('investigar');
    data = setStageState(data, id, 'despertar', 'retomada', TODAY);
    expect(currentStage(activeJourney(data)!)?.id).toBe('despertar');
    expect(touchStage(data, id, 'despertar', TODAY)).toBe(data);
  });
});

describe('diário e exercícios', () => {
  it('CT-008: salva o registro associado à jornada, com virtude e etapa vigentes', () => {
    const { data, id } = active();
    const saved = saveEntry(data, stampEntry(activeJourney(data), entry()), TODAY);
    expect(saved.entries[0]).toMatchObject({ journeyId: id, virtue: 'Paciência', virtueId: 'V07', stage: 'Despertar' });
    expect(saved.entries[0].createdAt).not.toBe('');
    expect(activeJourney(saved)!.stages.registrar.state).toBe('em-andamento');
  });

  it('CT-009 e RN-019: registra sem exercício e sem jornada', () => {
    const saved = saveEntry(emptyData(), stampEntry(undefined, entry()), TODAY);
    expect(saved.entries[0].journeyId).toBeNull();
  });

  it('valida situação, data e jornada antes de gravar (RF-130, RF-131)', () => {
    const { data } = active();
    expect(() => saveEntry(data, entry({ situation: '  ' }), TODAY)).toThrow(/situação/);
    expect(() => saveEntry(data, entry({ date: 'ontem' }), TODAY)).toThrow(/data válida/);
    expect(() => saveEntry(data, entry({ journeyId: 'nao-existe' }), TODAY)).toThrow(/jornada/);
  });

  it('recomenda exercícios da virtude e trata a repetição como parte da prática (RN-016, RN-017)', () => {
    const { data, id } = active();
    const options = exerciseOptions('V07');
    expect(options[0]).toMatchObject({ recommended: true });
    expect(options[0].exercise.id).toBe('EX-V07');
    expect(options.some((o) => !o.recommended)).toBe(true);

    let next = startExercise(data, id, 'EX-V07', TODAY);
    expect(exerciseStatusLabel(activeJourney(next)!, 'EX-V07', true)).toBe('Em andamento');
    next = saveEntry(next, stampEntry(activeJourney(next), entry({ id: 'e1', exerciseId: 'EX-V07' })), TODAY);
    expect(exerciseStatusLabel(activeJourney(next)!, 'EX-V07', true)).toBe('Experimentado');
    next = saveEntry(next, stampEntry(activeJourney(next), entry({ id: 'e2', exerciseId: 'EX-V07' })), TODAY);
    expect(exerciseStatusLabel(activeJourney(next)!, 'EX-V07', true)).toBe('Repetido (2 vezes)');
    /* Editar um registro existente não conta uma nova experiência. */
    next = saveEntry(next, { ...next.entries[0], note: 'editado' }, TODAY);
    expect(activeJourney(next)!.exercises[0].times).toBe(2);
    expect(journeyStats(activeJourney(next)!, next)).toMatchObject({ entries: 2, exercisesTried: 1, daysWithEntries: 1 });
  });

  it('ordena do mais recente para o mais antigo, com o último inserido primeiro em caso de empate', () => {
    const sorted = sortByDateDesc([{ date: '2026-10-01', n: 1 }, { date: '2026-10-02', n: 2 }, { date: '2026-10-02', n: 3 }]);
    expect(sorted.map((x) => x.n)).toEqual([3, 2, 1]);
  });
});

describe('revisões e Conselho', () => {
  it('CT-010 e RN-008: aceita revisão sem registros no diário; cada revisão é um item próprio', () => {
    const { data, id } = active();
    let next = saveReview(data, review(id, { id: 'r1' }), TODAY);
    next = saveReview(next, review(id, { id: 'r2', synthesis: 'Outra' }), TODAY);
    expect(next.reviews.map((r) => r.synthesis)).toEqual(['Percebi algo', 'Outra']);
    expect(next.entries).toHaveLength(0);
    expect(activeJourney(next)!.stages.revisar.state).toBe('em-andamento');
  });

  it('recusa revisão vazia ou com data inválida', () => {
    const { data, id } = active();
    expect(() => saveReview(data, review(id, { synthesis: '' }), TODAY)).toThrow(/ao menos uma pergunta/);
    expect(() => saveReview(data, review(id, { date: 'x' }), TODAY)).toThrow(/data válida/);
  });

  it('salva sessão do Conselho ligada à jornada ou independente (RN06)', () => {
    const { data, id } = active();
    const base = { id: 's1', date: TODAY, situation: 'Dúvida', doubt: '', caseId: null, dimensionIds: [], virtueIds: [], contributions: [], reflection: '', action: '', createdAt: '', updatedAt: '' };
    const linked = saveSession(data, { ...base, journeyId: id } as CouncilSession, TODAY);
    expect(activeJourney(linked)!.stages.refletir.state).toBe('em-andamento');
    const free = saveSession(data, { ...base, journeyId: null } as CouncilSession, TODAY);
    expect(free.sessions[0].journeyId).toBeNull();
    expect(() => saveSession(data, { ...base, situation: ' ', journeyId: null } as CouncilSession, TODAY)).toThrow(/situação/);
  });

  it('lê revisões legadas em tom neutro, sem julgamento', () => {
    expect(compareLegacyReview('3 a 4', '1 a 2')).toContain('menos dias');
    expect(compareLegacyReview('1 a 2', '5 a 6')).toContain('não é um veredito');
    expect(compareLegacyReview('', '1 a 2')).toContain('incompleta');
  });

  it('mostra as virtudes investigadas em ordem cronológica, sem rascunhos', () => {
    expect(virtueTrail(draft().data.journeys)).toEqual([]);
    const j1 = { ...active().data.journeys[0], startedOn: '2026-09-01', virtueName: 'Paciência' };
    const j2 = { ...j1, id: 'x', startedOn: '2026-10-01', virtueName: 'Temperança' };
    expect(virtueTrail([j2, j1])).toEqual(['Paciência', 'Temperança']);
  });
});

describe('saneamento', () => {
  it('descarta itens inválidos sem lançar erro e informa quantos ignorou', () => {
    const { data, ignored } = sanitizeWithReport({
      journeys: [
        { id: 'j1', status: 'ACTIVE', virtueName: 'Paciência', stages: { despertar: { state: 'concluida', date: '2026-02-30' } } },
        'lixo',
        { id: 'j1', status: 'ACTIVE' },
      ],
      entries: [
        { id: 'e1', journeyId: 'j1', date: '2026-11-01', situation: 'Discussão', type: 'PRACTICE', feelings: ['Medo', 7] },
        { id: 'e2', journeyId: 'inexistente', date: '2026-11-02', situation: 'Solta' },
        { id: 'e3', date: 'ontem', situation: 'Sem data' },
        { id: 'e4', date: '2026-11-02', situation: '   ' },
      ],
      reviews: [{ journeyId: 'j1', date: '2026-11-03', synthesis: 'ok' }, { journeyId: 'x', date: '2026-11-03', synthesis: 'órfã' }, { journeyId: 'j1', date: '2026-11-03' }],
      sessions: [{ date: '2026-11-03', journeyId: 'x', contributions: [{ thinkerId: 'socrates' }, {}] }, { situation: 'sem data' }],
    });
    expect(ignored).toBe(6);
    expect(data.journeys.map((j) => j.status)).toEqual(['ACTIVE', 'PAUSED']);
    expect(data.journeys[0].stages.despertar).toEqual({ state: 'concluida', date: '' });
    expect(data.journeys[0].id).not.toBe(data.journeys[1].id);
    expect(data.entries).toHaveLength(2);
    expect(data.entries[0]).toMatchObject({ type: 'PRACTICE', feelings: ['Medo'], journeyId: 'j1' });
    expect(data.entries[1].journeyId).toBeNull();
    expect(data.reviews).toHaveLength(1);
    expect(data.sessions[0]).toMatchObject({ journeyId: null, contributions: [{ thinkerId: 'socrates' }] });
    expect(isEmptyData(sanitizeWithReport(null).data)).toBe(true);
    expect(isEmptyData(sanitizeWithReport('texto').data)).toBe(true);
  });

  it('não deixa a virtude principal aparecer também como relacionada', () => {
    const { data } = sanitizeWithReport({ journeys: [{ id: 'j', status: 'DRAFT', virtueId: 'V07', virtueName: 'Paciência', relatedVirtueIds: ['V07', 'V06', 'V06', 'lixo'] }] });
    expect(data.journeys[0].relatedVirtueIds).toEqual(['V06']);
  });
});

describe('sincronização', () => {
  const base = { localEmpty: false, remoteEmpty: false, localUserId: 'u1', userId: 'u1', localRevision: 3, remoteRevision: 3, dirty: false };
  it('não faz nada quando os dois lados estão iguais, e envia quando há alteração local', () => {
    expect(decideSync(base)).toBe('nada');
    expect(decideSync({ ...base, dirty: true })).toBe('enviar');
  });
  it('baixa quando a nuvem avançou e este aparelho não tem alterações', () => {
    expect(decideSync({ ...base, remoteRevision: 5 })).toBe('baixar');
    expect(decideSync({ ...base, localEmpty: true, localUserId: null })).toBe('baixar');
  });
  it('pede decisão em vez de sobrescrever em silêncio', () => {
    expect(decideSync({ ...base, remoteRevision: 5, dirty: true })).toBe('conflito');
    expect(decideSync({ ...base, localUserId: null })).toBe('conflito');
  });
  it('nunca envia dados vinculados a outra conta sem confirmação', () => {
    expect(decideSync({ ...base, localUserId: 'outra', remoteEmpty: true, remoteRevision: 0 })).toBe('conflito');
  });
  it('faz o primeiro envio quando a nuvem está vazia', () => {
    expect(decideSync({ ...base, localUserId: null, remoteEmpty: true, remoteRevision: 0, localRevision: 0 })).toBe('enviar');
    expect(decideSync({ ...base, localEmpty: true, remoteEmpty: true, localUserId: null })).toBe('nada');
  });
});
