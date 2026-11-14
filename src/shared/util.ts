/** Utilidades puras: datas (YYYY-MM-DD no fuso do aparelho), ids e texto. */

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Aceita apenas datas de calendário reais no formato YYYY-MM-DD. */
export function isDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const m = DATE_RE.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

export function today(now: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

function toUtc(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Dias inteiros de `from` até `to` (negativo se `to` for anterior). */
export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / 86_400_000);
}

export function addDays(date: string, days: number): string {
  return new Date(toUtc(date) + days * 86_400_000).toISOString().slice(0, 10);
}

/** 2026-10-30 → 30/10/2026 */
export function formatDate(date: string): string {
  if (!isDate(date)) return '';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

/** Identificador único (UUID), como recomenda o Documento 08, seção 9.1. */
export function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Marca criação e atualização de um registro (Documento 06, seção 19.3). */
export function stamp<T extends { createdAt: string; updatedAt: string }>(item: T, now: string = new Date().toISOString()): T {
  return { ...item, createdAt: item.createdAt || now, updatedAt: now };
}

/** Minúsculas e sem acentos, para comparação e busca. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function words(text: string): string[] {
  return normalize(text).match(/[a-z]+/g) ?? [];
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
