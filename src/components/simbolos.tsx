/* Símbolos da identidade visual (ver domain/identidade.ts). Decorativos: aria-hidden, porque o nome
 * da virtude, da dimensão ou do pensador já vem como texto ao lado. Traços em currentColor. */
import type { ReactNode } from 'react';
import { atraso } from './movimento';
import { corDaFamilia, emblemaDaTradicao, emblemaDaVirtude, estadosDosAneis, motivoDaFamilia, anelDaDimensao, type EmblemaTradicao, type EstadoAnel, type LeituraAnel, type MotivoFamilia, type TipoRelacaoDimensao } from '../domain/identidade';

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
export function SimboloFamilia({ familyId, size = 36, cor }: { familyId: string; size?: number; cor?: string }) {
  const motivo = motivoDaFamilia(familyId);
  if (!motivo) return null;
  return (
    <Base size={size} color={cor ?? corDaFamilia(familyId)} dado="familia">
      {MOTIVOS[motivo]}
    </Base>
  );
}

/** Sete anéis concêntricos; o anel da dimensão vem em destaque (1 externo, 7 central). */
export function AneisDimensao({ order, size = 56, animado = false }: { order: number; size?: number; animado?: boolean }) {
  const destaque = anelDaDimensao(order);
  if (!destaque) return null;
  return (
    <Base size={size} dado="dimensao">
      {[1, 2, 3, 4, 5, 6, 7].map((k) => {
        const r = 22 - 3 * (k - 1);
        const ativo = k === destaque;
        return (
          <circle
            key={k}
            cx="24"
            cy="24"
            r={r}
            strokeWidth={ativo ? 3 : 1}
            className={animado ? 'anel-animado' : undefined}
            style={{ ...(ativo ? { color: 'var(--accent)' } : {}), ...(animado ? atraso(k - 1) : {}) }}
            fill={k === 7 && ativo ? 'currentColor' : 'none'}
          />
        );
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
  medieval: (
    <>
      <path d="M10 42V22Q10 8 24 4Q38 8 38 22V42M6 42H42" />
      <circle cx="24" cy="22" r="6" />
      <path d="M24 16V28M18.8 19L29.2 25M18.8 25L29.2 19" />
    </>
  ),
  iluminista: (
    <>
      <circle cx="24" cy="6" r="2.5" />
      <path d="M24 8.5L12 42M24 8.5L36 42M17.5 28H30.5" />
    </>
  ),
  ciencia: (
    <>
      <circle cx="24" cy="24" r="3" fill="currentColor" />
      <path d="M4 24A20 8 0 1 0 44 24A20 8 0 1 0 4 24Z" />
      <path d="M24 4A8 20 0 1 0 24 44A8 20 0 1 0 24 4Z" />
    </>
  ),
  mente: <path d="M24 24a2 2 0 0 1 4 0a5 5 0 0 1-10 0a8 8 0 0 1 16 0a11 11 0 0 1-22 0a14 14 0 0 1 28 0" />,
  contemporanea: (
    <>
      <path d="M35.3 12.7A16 16 0 1 0 40 24" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </>
  ),
  politica: (
    <>
      <path d="M10 24H38V40H10Z M20 24H28" />
      <path d="M18 8H30V20H18Z M21 12H27M21 16H27" />
    </>
  ),
  gestao: (
    <>
      <path d="M18 6H30V14H18Z M24 14V22M9 22H39M9 22V28M24 22V28M39 22V28" />
      <path d="M4 28H14V38H4Z M19 28H29V38H19Z M34 28H44V38H34Z" />
    </>
  ),
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

const ESPESSURA_ANEL: Record<EstadoAnel, { width: number; dash?: string; opacity: number }> = {
  primaria: { width: 3.25, opacity: 1 },
  secundaria: { width: 2, opacity: 1 },
  contextual: { width: 1.25, dash: '2.5 2', opacity: 1 },
  nenhuma: { width: 0.75, opacity: 0.35 },
};

/** Assinatura da virtude: os sete anéis, cada um com a espessura do tipo de relação (primária, secundária, contextual ou nenhuma). A forma diz o tipo; a cor só acompanha a família. */
export function AssinaturaVirtude({ cor, relacoes, size = 64, rotulo = 'assinatura', animado = false }: { cor: string; relacoes: { dimensionOrder: number; tipo: TipoRelacaoDimensao }[]; size?: number; rotulo?: string; animado?: boolean }) {
  const estados = estadosDosAneis(relacoes);
  return (
    <Base size={size} color={cor} dado={rotulo}>
      {estados.map((estado, i) => {
        const cfg = ESPESSURA_ANEL[estado];
        return (
          <circle key={i} cx="24" cy="24" r={22 - 3 * i} strokeWidth={cfg.width} strokeDasharray={cfg.dash} opacity={cfg.opacity} className={animado ? 'anel-animado' : undefined} style={animado ? atraso(i) : undefined} />
        );
      })}
    </Base>
  );
}

const ESTILO_LEITURA: Record<LeituraAnel, { width: number; dash?: string; opacity: number }> = {
  comum: { width: 3, opacity: 1 },
  parcial: { width: 1.5, dash: '3 2', opacity: 1 },
  ausente: { width: 0.75, opacity: 0.35 },
};

/** Dimensões em comum de um grupo de perspectivas: anel cheio (todas tocam), tracejado (algumas) ou fino (nenhuma). */
export function ComparacaoAneis({ leitura, size = 64 }: { leitura: LeituraAnel[]; size?: number }) {
  return (
    <Base size={size} dado="comparacao">
      {leitura.map((estado, i) => {
        const cfg = ESTILO_LEITURA[estado];
        return <circle key={i} cx="24" cy="24" r={22 - 3 * i} strokeWidth={cfg.width} strokeDasharray={cfg.dash} opacity={cfg.opacity} />;
      })}
    </Base>
  );
}

/** Emblema próprio da virtude: figura linear ligada ao sentido da definição, na cor da família. Decorativo (aria-hidden): o nome já está no texto. */
export function EmblemaVirtude({ virtueId, size = 56, cor }: { virtueId: string; size?: number; cor?: string }) {
  const emblema = emblemaDaVirtude(virtueId);
  if (!emblema) return null;
  return (
    <Base size={size} color={cor} dado="emblema">
      {emblema.el.map((e, i) =>
        e[0] === 'p' ? (
          <path key={i} d={e[1]} fill={e[2] ? 'currentColor' : 'none'} strokeDasharray={e[3] || undefined} />
        ) : (
          <circle key={i} cx={e[1]} cy={e[2]} r={e[3]} fill={e[4] ? 'currentColor' : 'none'} strokeDasharray={e[5] || undefined} />
        ),
      )}
    </Base>
  );
}
