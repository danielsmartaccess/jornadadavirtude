import { describe, expect, it } from 'vitest';
import { contarTabelas, menorNivelDeTitulo, semTituloInicialRepetido } from '../../src/domain/gita';

describe('menorNivelDeTitulo', () => {
  it('devolve o menor nível de título usado no texto', () => {
    expect(menorNivelDeTitulo('## A\n\ntexto\n\n### B')).toBe(2);
    expect(menorNivelDeTitulo('### B\n\ntexto\n\n#### C')).toBe(3);
  });

  it('devolve null quando não há título', () => {
    expect(menorNivelDeTitulo('Só um parágrafo.\n\n- lista')).toBeNull();
  });

  it('ignora títulos dentro de blocos de código e # sem espaço', () => {
    expect(menorNivelDeTitulo('```\n# falso\n```\n\n### de verdade')).toBe(3);
    expect(menorNivelDeTitulo('#hashtag e ##outra')).toBeNull();
  });

  it('depois de remover o título repetido da etapa, o primeiro subtítulo passa a ser o menor nível', () => {
    const md = '## Contexto histórico e filosófico\n\nIntro.\n\n### A cena inicial\n\nTexto.';
    expect(menorNivelDeTitulo(md)).toBe(2);
    expect(menorNivelDeTitulo(semTituloInicialRepetido(md, 'Contexto histórico e filosófico'))).toBe(3);
  });
});

describe('contarTabelas', () => {
  const tabela = '| A | B |\n|---|---|\n| 1 | 2 |';

  it('conta 0, 1 e 2 tabelas', () => {
    expect(contarTabelas('Sem tabela.')).toBe(0);
    expect(contarTabelas(tabela)).toBe(1);
    expect(contarTabelas(`${tabela}\n\nTexto entre elas.\n\n${tabela}`)).toBe(2);
  });

  it('reconhece alinhamento de colunas e ignora tabelas em blocos de código', () => {
    expect(contarTabelas('| A | B |\n|:---:|---:|\n| 1 | 2 |')).toBe(1);
    expect(contarTabelas('```\n' + tabela + '\n```')).toBe(0);
  });

  it('não confunde uma linha horizontal com tabela', () => {
    expect(contarTabelas('Texto\n\n---\n\nOutro texto')).toBe(0);
  });
});
