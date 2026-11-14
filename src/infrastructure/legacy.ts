/* Preservação dos dados existentes (Documento 01, Etapa 2; Documento 06, seção 2.5).
 * Converte o formato da versão anterior (chave "jornada-virtude-v2", arquivo exportado
 * com "version": 3) para o modelo atual.
 *
 * Correspondência das etapas antigas com as sete etapas do Documento 06:
 *   Reconhecer → Identificar · Investigar → Investigar · Praticar → Praticar · Revisar → Revisar
 * Registros "Falha" passam a DIFFICULTY e "Prática" a PRACTICE; a jornada "arquivada"
 * da versão anterior equivale a COMPLETED. */
import { findVirtueByName } from '../domain/catalog';
import { emptyStages } from '../domain/journey';
import { sanitizeWithReport, type SanitizeResult } from './sanitize';
import type { StageId } from '../domain/types';
import { isDate, today } from '../shared/util';

export const LEGACY_KEY = 'jornada-virtude-v2';
/** Envelope de exportação (Documento 08, seção 16). */
export const EXPORT_APPLICATION = 'Jornada da Virtude';
export const SCHEMA_VERSION = 4;
/** Identificação usada pelos arquivos da versão anterior. */
const LEGACY_EXPORT_APP = 'jornada-virtude';

type Raw = Record<string, unknown>;

const record = (value: unknown): Raw | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Raw) : null;
const texts = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
const text = (value: unknown) => (typeof value === 'string' ? value : '');

const OTHER = new Set(['Outro', 'Outra']);
const LEGACY_STAGES: StageId[] = ['identificar', 'investigar', 'praticar', 'revisar'];
const LEGACY_STAGE_NAMES: Record<string, string> = { Reconhecer: 'Identificar', 'Jornada concluída': 'Etapas concluídas' };

/** Respostas de um grupo de chips; "Outro(a)" vira o texto livre informado (se houver). */
function pick(sel: Raw | null, other: Raw | null, key: string): string[] {
  const typed = text(other?.[key]).trim();
  return texts(sel?.[key]).flatMap((value) => (OTHER.has(value) ? (typed ? [typed] : []) : [value]));
}

function legacyReviews(reviews: unknown, journeyId: string) {
  return (Array.isArray(reviews) ? reviews : []).flatMap((item) => {
    const r = record(item);
    if (!r) return [];
    return [
      {
        id: r.id,
        journeyId,
        kind: 'legado',
        date: r.date,
        firstWeek: texts(r.rev1)[0] ?? '',
        lastWeek: texts(r.rev2)[0] ?? '',
        moments: texts(r.rev3),
      } as Raw,
    ];
  });
}

function legacyJourney(params: { id: string; sel: Raw | null; other: Raw | null; label: string; source: Raw; status: 'ACTIVE' | 'COMPLETED' }) {
  const { id, sel, other, label, source, status } = params;
  const virtueName = (label || pick(sel, other, 'virtude')[0] || '').trim();
  const done = Array.isArray(source.stages) ? source.stages : [];
  const dates = Array.isArray(source.stageDates) ? source.stageDates : [];
  const stages = emptyStages();
  LEGACY_STAGES.forEach((stage, i) => {
    if (done[i] === true) stages[stage] = { state: 'concluida', date: isDate(dates[i]) ? dates[i] : '' };
  });
  if (virtueName && stages.identificar.state === 'nao-iniciada') stages.identificar = { state: 'em-andamento', date: '' };
  return {
    id,
    virtueId: findVirtueByName(virtueName)?.id ?? null,
    virtueName,
    status,
    origin: 'legado',
    startedOn: source.startedOn,
    completedOn: status === 'COMPLETED' ? source.endedOn : '',
    stages,
    intake: {
      admira: pick(sel, other, 'admira'),
      situacao: pick(sel, other, 'situacao'),
      pedido: pick(sel, other, 'pedido'),
    },
  };
}

/** Reconhece o objeto de dados da versão anterior (sem o envelope de exportação). */
export function isLegacyData(value: unknown): boolean {
  const raw = record(value);
  if (!raw || raw.schema === 4) return false;
  return 'sel' in raw || 'other' in raw || 'stages' in raw || 'journeyId' in raw;
}

export function migrateLegacy(value: unknown, todayStr: string = today()): SanitizeResult {
  const raw = record(value) ?? {};
  const sel = record(raw.sel);
  const other = record(raw.other);
  const currentId = text(raw.journeyId) || 'legado-atual';
  const entriesRaw = Array.isArray(raw.entries) ? raw.entries : [];

  const archived = (Array.isArray(raw.journeys) ? raw.journeys : []).flatMap((item) => {
    const j = record(item);
    const id = j ? text(j.id) : '';
    return j && id && id !== currentId ? [{ j, id }] : [];
  });
  const knownIds = new Set([currentId, ...archived.map((a) => a.id)]);

  const entries = entriesRaw.map((item) => {
    const e = record(item);
    if (!e) return item;
    const jid = text(e.journey);
    const virtue = text(e.virtue);
    return {
      id: e.id,
      journeyId: knownIds.has(jid) ? jid : currentId,
      date: e.date,
      type: e.type === 'Prática' ? 'PRACTICE' : 'DIFFICULTY',
      virtueId: findVirtueByName(virtue)?.id ?? null,
      virtue,
      situation: e.scene,
      feelings: e.felt,
      actions: e.did,
      note: e.note,
      stage: LEGACY_STAGE_NAMES[text(e.stage)] ?? e.stage,
    };
  });

  const reviews = legacyReviews(raw.reviews, currentId);
  /* O rascunho de revisão em andamento vira mais um item do histórico. */
  const draft = { firstWeek: texts(sel?.rev1)[0] ?? '', lastWeek: texts(sel?.rev2)[0] ?? '', moments: texts(sel?.rev3) };
  if (draft.firstWeek || draft.lastWeek || draft.moments.length) {
    reviews.push({ journeyId: currentId, kind: 'legado', date: isDate(raw.reviewDate) ? raw.reviewDate : todayStr, ...draft });
  }

  /* Início da jornada atual: o informado; senão, a data mais antiga registrada nela. */
  const currentDates = entries
    .map((e) => record(e))
    .filter((e): e is Raw => !!e && e.journeyId === currentId && isDate(e.date))
    .map((e) => e.date as string)
    .sort();
  const current = legacyJourney({
    id: currentId,
    sel,
    other,
    label: '',
    source: { ...raw, startedOn: isDate(raw.startedOn) ? raw.startedOn : (currentDates[0] ?? '') },
    status: 'ACTIVE',
  });
  const hasStage = Array.isArray(raw.stages) && raw.stages.some((s) => s === true);
  const hasIntake = current.intake.admira.length + current.intake.situacao.length + current.intake.pedido.length > 0;
  const currentHasContent = !!current.virtueName || currentDates.length > 0 || hasStage || reviews.length > 0 || hasIntake;

  const journeys: unknown[] = archived.map(({ j, id }) => {
    reviews.push(...legacyReviews(j.reviews, id));
    return legacyJourney({ id, sel: record(j.sel), other: record(j.other), label: text(j.virtue), source: j, status: 'COMPLETED' });
  });
  if (currentHasContent) journeys.unshift(current);

  return sanitizeWithReport({ schema: 4, journeys, entries, reviews, sessions: [] });
}

export type ImportKind = 'atual' | 'legado';

/** Interpreta o texto de um arquivo exportado (formato atual ou da versão anterior). */
export function parseImport(fileText: string): SanitizeResult & { kind: ImportKind } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fileText);
  } catch {
    throw new Error('O arquivo não é um JSON válido.');
  }
  const root = record(parsed);
  if (!root) throw new Error('O arquivo não contém dados da Jornada da Virtude.');

  const wrapped = (root.application === EXPORT_APPLICATION || root.app === LEGACY_EXPORT_APP) && record(root.data);
  const payload = wrapped ? (root.data as Raw) : root;
  if (typeof root.schemaVersion === 'number' && root.schemaVersion > SCHEMA_VERSION) {
    throw new Error('O arquivo foi gerado por uma versão mais nova da Jornada da Virtude. Atualize o aplicativo para importá-lo.');
  }
  if (payload.schema === 4 || root.schemaVersion === SCHEMA_VERSION) {
    return { ...sanitizeWithReport(payload), kind: 'atual' };
  }
  if (isLegacyData(payload)) {
    return { ...migrateLegacy(payload), kind: 'legado' };
  }
  throw new Error('O arquivo não foi reconhecido como exportação da Jornada da Virtude.');
}

export function buildExport(data: unknown, now: Date = new Date()) {
  return { application: EXPORT_APPLICATION, schemaVersion: SCHEMA_VERSION, exportedAt: now.toISOString(), data };
}
