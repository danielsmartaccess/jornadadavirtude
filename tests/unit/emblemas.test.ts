import { describe, expect, it } from 'vitest';
import { virtues } from '../../src/domain/catalog';
import { elementoDeEmblemaValido, emblemaDaVirtude, virtudesComEmblema } from '../../src/domain/identidade';
import emblemasJson from '../../src/data/virtue-emblems.json';

const bruto = emblemasJson as unknown as Record<string, { figura: string; el: unknown[] }>;

describe('emblemas das virtudes', () => {
  it('toda virtude do catálogo tem o seu emblema, e não há emblema sobrando', () => {
    expect([...virtudesComEmblema].sort()).toEqual(virtues.map((v) => v.id).sort());
    for (const v of virtues) expect(emblemaDaVirtude(v.id), v.id).not.toBeNull();
  });

  it('nenhum elemento do arquivo é descartado pelo validador', () => {
    for (const [id, e] of Object.entries(bruto)) {
      expect(e.el.length, id).toBeGreaterThan(0);
      for (const el of e.el) expect(elementoDeEmblemaValido(el), `${id}: ${JSON.stringify(el)}`).toBe(true);
      expect(emblemaDaVirtude(id)?.el.length, id).toBe(e.el.length);
    }
  });

  it('cada virtude tem um desenho próprio e uma figura própria, sem repetição', () => {
    const desenhos = Object.values(bruto).map((e) => JSON.stringify(e.el));
    const figuras = Object.values(bruto).map((e) => e.figura);
    expect(new Set(desenhos).size).toBe(desenhos.length);
    expect(new Set(figuras).size).toBe(figuras.length);
    for (const f of figuras) expect(f.trim().length).toBeGreaterThan(2);
  });

  it('virtude sem emblema devolve null', () => {
    expect(emblemaDaVirtude('V99')).toBeNull();
    expect(emblemaDaVirtude('')).toBeNull();
  });
});

describe('elementoDeEmblemaValido: só geometria segura', () => {
  it('aceita caminhos e círculos bem formados', () => {
    expect(elementoDeEmblemaValido(['p', 'M24 42 V28 L12 12 a6 6 0 0 0 0 12Z'])).toBe(true);
    expect(elementoDeEmblemaValido(['p', 'M8 8 H40', 1])).toBe(true);
    expect(elementoDeEmblemaValido(['c', 24, 24, 6])).toBe(true);
    expect(elementoDeEmblemaValido(['c', 15, 24, 9, 0, '2.5 2'])).toBe(true);
  });

  it('recusa marcação, scripts, comandos inválidos e valores fora do quadro', () => {
    expect(elementoDeEmblemaValido(['p', '<script>alert(1)</script>'])).toBe(false);
    expect(elementoDeEmblemaValido(['p', 'M0 0" onload="x'])).toBe(false);
    expect(elementoDeEmblemaValido(['p', 'M0 0 url(#a)'])).toBe(false);
    expect(elementoDeEmblemaValido(['p', ''])).toBe(false);
    expect(elementoDeEmblemaValido(['p', 'M0 0 H' + '1 '.repeat(300)])).toBe(false);
    expect(elementoDeEmblemaValido(['c', 24, 24, 0])).toBe(false);
    expect(elementoDeEmblemaValido(['c', 24, 24, 99])).toBe(false);
    expect(elementoDeEmblemaValido(['c', 500, 24, 6])).toBe(false);
    expect(elementoDeEmblemaValido(['c', 24, NaN, 6])).toBe(false);
    expect(elementoDeEmblemaValido(['c', 24, 24, 6, 0, 'javascript:1'])).toBe(false);
    expect(elementoDeEmblemaValido(['x', 1])).toBe(false);
    expect(elementoDeEmblemaValido('M0 0')).toBe(false);
    expect(elementoDeEmblemaValido(null)).toBe(false);
  });
});
