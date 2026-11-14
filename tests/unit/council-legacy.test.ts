/* Conselho de Sabedoria (Documento 04, seções 7, 8 e 11), preservação dos dados da
 * versão anterior e armazenamento local. */
import { describe, expect, it } from 'vitest';
import { councilCases, getThinker } from '../../src/domain/catalog';
import { detectCrisis, MAX_THINKERS, selectThinkers, suggest } from '../../src/domain/council';
import { buildExport, isLegacyData, LEGACY_KEY, migrateLegacy, parseImport } from '../../src/infrastructure/legacy';
import { createLocalRepository, DATA_KEY, META_KEY, type KeyValueStorage } from '../../src/infrastructure/localRepository';
import { emptyData } from '../../src/infrastructure/sanitize';
import { createStore } from '../../src/application/store';

describe('Conselho: hipóteses a partir da situação', () => {
  const samples: [string, string][] = [
    ['Perco a paciência e fico com raiva quando discutem comigo, acabo gritando.', 'CASE01'],
    ['Tenho dificuldade em admitir quando estou errado e sempre tento me justificar.', 'CASE02'],
    ['Vivo procrastinando e não consigo manter meus compromissos nem uma rotina.', 'CASE03'],
    ['Não consigo perdoar meu irmão, guardo mágoa e ressentimento há anos.', 'CASE04'],
    ['Estou adiando uma decisão importante, fico indeciso entre duas escolhas.', 'CASE05'],
    ['Minha esposa diz que eu não sei ouvir e que interrompo todo mundo.', 'CASE06'],
  ];

  it.each(samples)('reconhece o caso de referência em “%s”', (text, caseId) => {
    const suggestion = suggest(text);
    const reference = councilCases.find((c) => c.id === caseId)!;
    expect(suggestion.caseIds[0]).toBe(caseId);
    expect(suggestion.virtueIds).toEqual(expect.arrayContaining(reference.virtueIds.slice(0, 3)));
    expect(suggestion.dimensionIds.length).toBeGreaterThan(0);
    expect(suggestion.crisis).toBe(false);
  });

  it('sugere virtudes pelo vocabulário do catálogo mesmo fora dos casos de referência', () => {
    const suggestion = suggest('Sinto inveja dos colegas e ando com muita arrogância no trabalho.');
    expect(suggestion.virtueIds).toContain('V44');
    expect(suggestion.dimensionIds).toContain('DIM03');
  });

  it('não força hipóteses quando o texto não dá base', () => {
    expect(suggest('Hoje choveu bastante.')).toMatchObject({ caseIds: [], virtueIds: [], dimensionIds: [] });
  });

  it('sinaliza situações que pedem apoio profissional (Regra 8)', () => {
    expect(detectCrisis('Às vezes penso em suicídio.')).toBe(true);
    expect(detectCrisis('Não quero mais viver assim')).toBe(true);
    expect(detectCrisis('Quero viver com mais calma.')).toBe(false);
  });
});

describe('Conselho: seleção de pensadores', () => {
  it('convoca de dois a cinco pensadores, todos com justificativa e pergunta', () => {
    const { caseIds, virtueIds, dimensionIds } = suggest('Fico com raiva e reajo por impulso nas discussões.');
    const selected = selectThinkers({ caseIds, virtueIds, dimensionIds });
    expect(selected.length).toBeGreaterThanOrEqual(2);
    expect(selected.length).toBeLessThanOrEqual(MAX_THINKERS);
    for (const s of selected) {
      expect(s.thinker.council).toBe(true);
      expect(s.contribution.reason).not.toBe('');
      expect(s.contribution.question).toMatch(/\?$/);
      expect(s.contribution.perspective).not.toBe('');
    }
    /* Os pensadores do caso de referência têm prioridade pela adequação à situação. */
    const reference = councilCases[0].contributions.map((c) => c.thinkerId);
    expect(selected.filter((s) => reference.includes(s.thinker.id)).length).toBeGreaterThanOrEqual(4);
  });

  it('favorece a diversidade de tradições (Regra 4)', () => {
    const selected = selectThinkers({ caseIds: [], virtueIds: ['V08'], dimensionIds: ['DIM03'] });
    const traditions = selected.map((s) => s.thinker.tradition);
    expect(new Set(traditions).size).toBeGreaterThan(1);
  });

  it('não convoca ninguém sem relação registrada (Regra 1)', () => {
    expect(selectThinkers({ caseIds: [], virtueIds: [], dimensionIds: ['DIM01'] })).toEqual([]);
  });

  it('só convoca a partir de uma virtude quem tem relação documentada com ela', () => {
    const selected = selectThinkers({ caseIds: [], virtueIds: ['V25'], dimensionIds: [] });
    expect(selected.map((s) => s.thinker.id)).toContain('edith-stein');
    expect(selected.every((s) => getThinker(s.thinker.id))).toBe(true);
    expect(selected.every((s) => s.contribution.reason.includes('Empatia'))).toBe(true);
  });
});

/* Formato exportado pela versão anterior ("version": 3). */
const legacy = {
  sel: { virtude: ['Outra'], admira: ['Ouve antes de responder', 'Outro'], rev1: ['3 a 4'], rev2: [], rev3: [] },
  other: { virtude: 'Paciência', admira: 'Não leva para o lado pessoal' },
  stages: [true, true, false, false],
  stageDates: ['2026-10-08', '2026-10-15', '', ''],
  startedOn: '2026-09-28',
  reviewDate: '2026-10-29',
  reviews: [{ id: 'r1', date: '2026-10-28', rev1: ['3 a 4'], rev2: ['1 a 2'], rev3: ['Numa discussão'] }],
  journeyId: 'JATUAL',
  journeys: [
    {
      id: 'JANTIGA', virtue: 'Coragem', startedOn: '2026-08-01', endedOn: '2026-09-20', stages: [true, false, false, false],
      stageDates: ['2026-08-09', '', '', ''], reviews: [{ id: 'r0', date: '2026-09-19', rev1: [], rev2: ['5 a 6'], rev3: [] }],
      sel: { virtude: ['Coragem'] }, other: {},
    },
  ],
  entries: [
    { id: 'e1', date: '2026-10-02', type: 'Falha', scene: 'Discussão', felt: ['Irritação'], did: ['Reagi na hora'], note: 'No trânsito', virtue: 'Paciência', stage: 'Reconhecer', journey: 'JATUAL' },
    { id: 'e2', date: '2026-10-20', type: 'Prática', scene: 'Calei', felt: [], did: [], note: '', virtue: 'Paciência', stage: 'Investigar', journey: 'JATUAL' },
    { id: 'e3', date: '2026-08-05', type: 'Falha', scene: 'Decisão adiada', felt: ['Medo'], did: ['Adiei'], note: '', virtue: 'Coragem', stage: '', journey: 'JANTIGA' },
    { id: 'e4', date: '2026-10-21', type: 'Falha', scene: 'Órfão', journey: 'NAOEXISTE' },
    { id: 'e5', date: 'data ruim', type: 'Falha', scene: 'Inválido' },
  ],
};

describe('dados da versão anterior', () => {
  it('reconhece o formato antigo', () => {
    expect(isLegacyData(legacy)).toBe(true);
    expect(isLegacyData(emptyData())).toBe(false);
    expect(isLegacyData(null)).toBe(false);
  });

  it('converte jornadas, etapas, registros e revisões sem perder conteúdo', () => {
    const { data, ignored } = migrateLegacy(legacy, '2026-11-13');
    expect(ignored).toBe(1);

    const [current, old] = data.journeys;
    expect(current).toMatchObject({ id: 'JATUAL', virtueName: 'Paciência', virtueId: 'V07', status: 'ACTIVE', origin: 'legado', startedOn: '2026-09-28', title: 'Jornada: Paciência' });
    expect(current.stages.identificar).toEqual({ state: 'concluida', date: '2026-10-08' });
    expect(current.stages.investigar).toEqual({ state: 'concluida', date: '2026-10-15' });
    expect(current.stages.praticar.state).toBe('nao-iniciada');
    expect(current.intake.admira).toEqual(['Ouve antes de responder', 'Não leva para o lado pessoal']);
    expect(old).toMatchObject({ id: 'JANTIGA', virtueName: 'Coragem', virtueId: 'V12', status: 'COMPLETED', completedOn: '2026-09-20' });

    expect(data.entries).toHaveLength(4);
    expect(data.entries[0]).toMatchObject({
      journeyId: 'JATUAL', type: 'DIFFICULTY', situation: 'Discussão', feelings: ['Irritação'], actions: ['Reagi na hora'],
      note: 'No trânsito', virtue: 'Paciência', virtueId: 'V07', stage: 'Identificar',
    });
    expect(data.entries[1].type).toBe('PRACTICE');
    expect(data.entries[2].journeyId).toBe('JANTIGA');
    /* Registro que apontava para jornada desconhecida vai para a atual. */
    expect(data.entries[3].journeyId).toBe('JATUAL');

    /* A revisão guardada, o rascunho em andamento e a revisão da jornada antiga. */
    expect(data.reviews.map((r) => [r.journeyId, r.kind, r.date, r.firstWeek, r.lastWeek])).toEqual([
      ['JATUAL', 'legado', '2026-10-28', '3 a 4', '1 a 2'],
      ['JATUAL', 'legado', '2026-10-29', '3 a 4', ''],
      ['JANTIGA', 'legado', '2026-09-19', '', '5 a 6'],
    ]);
  });

  it('importa tanto o arquivo antigo quanto o atual, e recusa o que não reconhece', () => {
    const old = parseImport(JSON.stringify({ app: 'jornada-virtude', version: 3, data: legacy }));
    expect(old.kind).toBe('legado');
    expect(old.data.journeys).toHaveLength(2);

    const again = parseImport(JSON.stringify(buildExport(old.data)));
    expect(again.kind).toBe('atual');
    expect(again.ignored).toBe(0);
    expect(again.data).toEqual(old.data);

    expect(() => parseImport('isto não é json')).toThrow(/JSON válido/);
    expect(() => parseImport('{"qualquer":"coisa"}')).toThrow(/não foi reconhecido/);
    expect(() => parseImport('[1,2]')).toThrow();
    expect(() => parseImport(JSON.stringify({ application: 'Jornada da Virtude', schemaVersion: 99, data: {} }))).toThrow(/versão mais nova/);
  });
});

function fakeStorage(initial: Record<string, string> = {}): KeyValueStorage & { map: Map<string, string> } {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key),
  };
}

describe('armazenamento local', () => {
  const open = (storage: KeyValueStorage | null) => createStore(createLocalRepository(storage));

  it('migra automaticamente os dados da versão anterior encontrados no navegador, sem apagá-los', () => {
    const storage = fakeStorage({ [LEGACY_KEY]: JSON.stringify(legacy) });
    const store = open(storage);
    expect(store.getMeta().legacyMigrated).toBe(true);
    expect(store.getData().journeys).toHaveLength(2);
    expect(storage.map.has(LEGACY_KEY)).toBe(true);
    expect(storage.map.has(DATA_KEY)).toBe(true);
    /* Ao reabrir, vale o dado novo. */
    expect(open(storage).getData()).toEqual(store.getData());
  });

  it('grava alterações, marca pendência de envio e avisa os ouvintes', () => {
    const storage = fakeStorage();
    const store = open(storage);
    let calls = 0;
    const off = store.subscribe(() => calls++);
    expect(store.update((d) => ({ ...d, entries: [] }))).toBe(true);
    expect(calls).toBe(1);
    expect(store.getMeta().dirty).toBe(true);
    expect(JSON.parse(storage.map.get(DATA_KEY)!).schema).toBe(4);
    expect(JSON.parse(storage.map.get(META_KEY)!).dirty).toBe(true);
    store.setMeta({ dirty: false });
    store.commit({ ...store.getData() }, { fromSync: true });
    expect(store.getMeta().dirty).toBe(false);
    off();
    store.clear();
    expect(storage.map.has(DATA_KEY)).toBe(false);
  });

  it('CT-013: avisa que a gravação falhou, em vez de tratar o dado como salvo', () => {
    const storage = fakeStorage();
    storage.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    const store = open(storage);
    expect(store.update((d) => ({ ...d, sessions: [] }))).toBe(false);
    expect(store.getData().schema).toBe(4);
  });

  it('continua funcionando em memória quando o navegador bloqueia o armazenamento', () => {
    const store = open(null);
    expect(store.persistent()).toBe(false);
    expect(store.update((d) => ({ ...d, sessions: [] }))).toBe(false);
  });

  it('descarta conteúdo corrompido em vez de quebrar a abertura', () => {
    const store = open(fakeStorage({ [DATA_KEY]: '{corrompido' }));
    expect(store.getData()).toEqual(emptyData());
  });
});
