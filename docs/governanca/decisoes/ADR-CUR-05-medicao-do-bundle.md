# ADR-CUR-05 — Medição do bundle acima de 500 kB

| Campo | Valor |
|---|---|
| Decisão | DEC-CUR-09 (não bloquear a fase pelo aviso; medir antes de otimizar) |
| Status | Decisão APROVADA pelo responsável pelo produto em 2026-11-23 (Fase 2). Nenhuma otimização implementada. |
| Data | 2026-11-23 |
| Revisão futura | Revisor técnico, se o bundle principal crescer de forma relevante |

## Medição

O Vite avisa que o arquivo principal (`index-*.js`) passa de 500 kB depois da minificação. Medido com `vite build` e mapas de fonte, numa pasta temporária, sem alterar `dist/`.

| Arquivo | `origin/main` (5d81ecc) | Fase 2 | Carregamento |
|---|---:|---:|---|
| `index-*.js` | 506,71 kB (gzip 136,63 kB) | 506,75 kB (gzip 136,67 kB) | Inicial |
| `council-*.js` (motor e camada curatorial) | 30,40 kB (gzip 8,45 kB) | 51,75 kB (gzip 15,18 kB) | Só nas rotas do Conselho |
| `CouncilPages-*.js` | 27,55 kB (gzip 8,22 kB) | 32,19 kB (gzip 9,56 kB) | Só nas rotas do Conselho |

**Composição do arquivo principal** (fonte antes da minificação): `react-dom` (cerca de 620 kB), `react-router` (cerca de 368 kB), `react` e `scheduler`. O código do app é pequeno: os maiores módulos são `useCases.ts`, `journey.ts` e `sanitize.ts`, entre 10 e 17 kB cada. As páginas já são carregadas por rota (lazy).

## Decisão

Não implementar code splitting nesta fase.
- **Por que não há ganho.** O que passa do limite é o próprio framework, necessário para qualquer rota. Separá-lo num chunk de vendor mudaria o cache entre deploys, mas não o download inicial.
- **Variação da Fase 2.** O arquivo principal variou +0,04 kB. Os dados novos foram para o chunk do Conselho, já carregado só sob demanda.

## Alternativas rejeitadas

- **`manualChunks` para React/Router.** Sem redução do download inicial; só cache.
- **Aumentar `chunkSizeWarningLimit`.** Esconderia o aviso sem resolver nada.
- **Trocar dependências.** Fora do escopo e com risco de regressão.

## Revisão futura

Reavaliar se o arquivo principal crescer mais de 10% ou se o tempo de carregamento inicial piorar nos testes de desempenho.
