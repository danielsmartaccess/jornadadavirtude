/* Símbolos da identidade visual (ver domain/identidade.ts). Decorativos: aria-hidden, porque o nome
 * da virtude, da dimensão ou do pensador já vem como texto ao lado. Traços em currentColor. */
import type { ReactNode } from 'react';
import { corDaFamilia, emblemaDaTradicao, motivoDaFamilia, anelDaDimensao, type EmblemaTradicao, type MotivoFamilia } from '../domain/identidade';

function Base({ size, color, dado, children }: { size: number; color?: string; dado: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      data-simbolo={dado}
      style={{ color, flexShrink: 0 }}
    >
      {children}
    </svg>
  );
}

const MOTIVOS: Record<MotivoFamilia, ReactNode> = {
  raios: (
    <>
      <circle cx="24" cy="24" r="8" />
      <path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2" />
    </>
  ),
  'meia-lua': (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 8a16 16 0 0 1 0 32z" fill="currentColor" />
    </>
  ),
  triangulo: (
    <>
      <path d="M24 6 42 40H6Z" />
      <path d="M24 20 33 36H15Z" />
    </>
  ),
  balanca: <path d="M24 8v32M12 14h24M12 14 6 28h12ZM36 14l-6 14h12Z" />,
  'duplo-circulo': (
    <>
      <circle cx="18" cy="24" r="12" />
      <circle cx="30" cy="24" r="12" />
    </>
  ),
  alvo: (
    <>
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="10" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </>
  ),
  seta: <path d="M8 40 40 8M24 8h16v16" />,
  estrela: <path d="M24 4 30 18 44 24 30 30 24 44 18 30 4 24 18 18Z" />,
};

/** Símbolo da família. A cor vem do token --fam-N, que muda no tema escuro. */
export function SimboloFamilia({ familyId, size = 36 }: { familyId: string; size?: number }) {
  const motivo = motivoDaFamilia(familyId);
  if (!motivo) return null;
  return (
    <Base size={size} color={corDaFamilia(familyId)} dado="familia">
      {MOTIVOS[motivo]}
    </Base>
  );
}

/** Sete anéis concêntricos; o anel da dimensão vem em destaque (1 externo, 7 central). */
export function AneisDimensao({ order, size = 56 }: { order: number; size?: number }) {
  const destaque = anelDaDimensao(order);
  if (!destaque) return null;
  return (
    <Base size={size} dado="dimensao">
      {[1, 2, 3, 4, 5, 6, 7].map((k) => {
        const r = 22 - 3 * (k - 1);
        const ativo = k === destaque;
        return <circle key={k} cx="24" cy="24" r={r} strokeWidth={ativo ? 3 : 1} style={ativo ? { color: 'var(--accent)' } : undefined} fill={k === 7 && ativo ? 'currentColor' : 'none'} />;
      })}
    </Base>
  );
}

const EMBLEMAS: Record<EmblemaTradicao, ReactNode> = {
  grega: (
    <>
      <path d="M6 42V6h36v36H6Z" />
      <path d="M12 36V12h24v24H12Z" />
    </>
  ),
  confuciana: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 6a18 18 0 0 0 0 36 9 9 0 0 1 0-18 9 9 0 0 0 0-18z" />
    </>
  ),
  taoista: <path d="M24 4 44 24 24 44 4 24Z" />,
  budista: (
    <>
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="6" />
    </>
  ),
  estoica: <path d="M8 40 40 8M8 8l32 32" />,
  marcial: <path d="M6 24h36M24 6v36M12 12l24 24M36 12 12 36" />,
  geral: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M6 24h36" />
    </>
  ),
};

/** Emblema da tradição filosófica, sem rosto: nenhum retrato é inventado (ver direção de arte). */
export function EmblemaTradicaoSimbolo({ tradicao, size = 40 }: { tradicao: string; size?: number }) {
  return <Base size={size} dado="tradicao">{EMBLEMAS[emblemaDaTradicao(tradicao)]}</Base>;
}
