/* Gate de segurança do Conselho de Sabedoria (Doc. 13 v2, seção 13; Doc. 04, Regra 8).
 * Uma situação com sinal de risco, na situação ou na dúvida, não vira sessão comum:
 * nenhuma seleção, nenhuma gravação. Sem sinal de risco, nada muda. */
import { describe, expect, it } from 'vitest';
import { CRISIS_BLOCKED, DomainError, saveSession } from '../../src/application/useCases';
import { createStore } from '../../src/application/store';
import { detectCrisis as detectCrisisFromCouncil, selectThinkers, suggest } from '../../src/domain/council';
import { detectCrisis, isCrisisInput } from '../../src/domain/crisis';
import type { CouncilSession } from '../../src/domain/types';
import { createLocalRepository, DATA_KEY, type KeyValueStorage } from '../../src/infrastructure/localRepository';
import { emptyData } from '../../src/infrastructure/sanitize';

const TODAY = '2026-11-23';
const NEUTRA = 'Tenho dificuldade em admitir quando estou errado e sempre tento me justificar.';
const RISCO = 'Às vezes penso em suicídio.';

function session(situation: string, doubt = '', id = 's1'): CouncilSession {
  return {
    id, date: TODAY, situation, doubt, caseId: null, dimensionIds: [], virtueIds: [], contributions: [],
    reflection: '', action: '', journeyId: null, createdAt: '', updatedAt: '',
  };
}

function fakeStorage(): KeyValueStorage & { writes: string[]; map: Map<string, string> } {
  const map = new Map<string, string>();
  const writes: string[] = [];
  return {
    map,
    writes,
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      writes.push(key);
      map.set(key, value);
    },
    removeItem: (key) => void map.delete(key),
  };
}

describe('Conselho: avaliação de risco considera situação e dúvida', () => {
  it('mantém os critérios de detectCrisis e a mesma função exportada por council.ts', () => {
    expect(detectCrisisFromCouncil).toBe(detectCrisis);
    expect(detectCrisis(RISCO)).toBe(true);
    expect(detectCrisis('Não quero mais viver assim')).toBe(true);
    expect(detectCrisis('Quero viver com mais calma.')).toBe(false);
    expect(suggest(RISCO).crisis).toBe(true);
  });

  it('situação e dúvida neutras: sem sinal de risco', () => {
    expect(isCrisisInput(NEUTRA, 'Como mudar isso?')).toBe(false);
  });

  it('sinal de risco na situação, com dúvida neutra', () => {
    expect(isCrisisInput(RISCO, 'O que fazer?')).toBe(true);
  });

  it('situação neutra, com sinal de risco na dúvida', () => {
    expect(isCrisisInput(NEUTRA, 'Às vezes penso em me machucar.')).toBe(true);
  });

  it('o fim da situação e o começo da dúvida não formam um termo que não está em nenhum dos dois', () => {
    expect(isCrisisInput('Fico sem saber o que dizer quando ele fala comigo, e me', 'matar o tempo no celular é o que faço')).toBe(false);
  });

  it('textos vazios: sem sinal de risco', () => {
    expect(isCrisisInput('', '')).toBe(false);
  });
});

describe('Conselho: gate de segurança na criação da sessão', () => {
  it('TESTE 1 e 7: situação sem sinal de risco segue o fluxo comum, com seleção determinística', () => {
    const first = suggest(NEUTRA);
    const again = suggest(NEUTRA);
    expect(again).toEqual(first);
    const ids = selectThinkers(first).map((s) => s.thinker.id);
    expect(selectThinkers(again).map((s) => s.thinker.id)).toEqual(ids);
    expect(ids.length).toBeGreaterThanOrEqual(2);

    const created = saveSession(emptyData(), { ...session(NEUTRA), caseId: first.caseIds[0] ?? null, virtueIds: first.virtueIds }, TODAY);
    expect(created.sessions).toHaveLength(1);
    expect(created.sessions[0].situation).toBe(NEUTRA);
  });

  it('TESTE 2 e 4: sinal de risco na situação (com dúvida neutra ou vazia) bloqueia a criação', () => {
    const data = emptyData();
    expect(() => saveSession(data, session(RISCO), TODAY)).toThrow(DomainError);
    expect(() => saveSession(data, session(RISCO, 'O que fazer?'), TODAY)).toThrow(CRISIS_BLOCKED);
    expect(data.sessions).toHaveLength(0);
  });

  it('TESTE 3: situação neutra com sinal de risco na dúvida bloqueia a criação', () => {
    expect(() => saveSession(emptyData(), session(NEUTRA, 'Às vezes penso em me machucar.'), TODAY)).toThrow(CRISIS_BLOCKED);
  });

  it('TESTE 5: após o bloqueio, nada é gravado no armazenamento', () => {
    const storage = fakeStorage();
    const store = createStore(createLocalRepository(storage));
    const writesBefore = storage.writes.length;
    expect(() => store.update((d) => saveSession(d, session(RISCO), TODAY))).toThrow(CRISIS_BLOCKED);
    expect(storage.writes.length).toBe(writesBefore);
    expect(storage.map.has(DATA_KEY)).toBe(false);
    expect(store.getData().sessions).toHaveLength(0);
    expect(JSON.stringify([...storage.map.values()])).not.toContain('suicídio');
  });

  it('TESTE 6: texto vazio mantém a validação de sempre', () => {
    expect(() => saveSession(emptyData(), session('   '), TODAY)).toThrow(/Descreva a situação/);
  });

  it('atualizar uma sessão já existente (reflexão, ação) não é bloqueado, para não perder dados antigos', () => {
    /* Sessão gravada antes do gate existir, com texto que hoje seria bloqueado. */
    const legado = { ...emptyData(), sessions: [session(RISCO)] };
    const atualizado = saveSession(legado, { ...legado.sessions[0], reflection: 'Procurei ajuda.' }, TODAY);
    expect(atualizado.sessions).toHaveLength(1);
    expect(atualizado.sessions[0].reflection).toBe('Procurei ajuda.');
  });

  it('uma sessão nova com sinal de risco é bloqueada mesmo havendo outras sessões gravadas', () => {
    const data = saveSession(emptyData(), session(NEUTRA, '', 'neutra'), TODAY);
    expect(() => saveSession(data, session(RISCO, '', 'nova'), TODAY)).toThrow(CRISIS_BLOCKED);
  });
});
