/* Quiz de reflexão de uma etapa. Perguntas, alternativas e leituras vêm do banco. Há dois modos de
 * transformar as respostas em leitura (domain/gita.ts):
 *  - mais_escolhida: a opção mais escolhida define a leitura e, em empate, mostram-se as empatadas;
 *  - faixas: conta as escolhas de uma chave-alvo e mostra a leitura da faixa atingida;
 *  - acertos: quiz de compreensão; conta as respostas corretas e mostra a leitura da faixa atingida.
 * Nada é pontuado como nota nem guardado. */
import { useId, useState } from 'react';
import { resultadoDoQuiz, resultadoPorAcertos, resultadoPorFaixas, type Alternativa, type FaixaLeitura, type PerguntaQuiz } from '../../domain/gita';

export type RegraQuiz =
  | { modo: 'mais_escolhida'; leituras: Alternativa[] }
  | { modo: 'faixas'; chaveAlvo: string; faixas: FaixaLeitura[] }
  | { modo: 'acertos'; faixas: FaixaLeitura[] };

export function Quiz({ perguntas, regra }: { perguntas: PerguntaQuiz[]; regra: RegraQuiz }) {
  const grupo = useId();
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [calculado, setCalculado] = useState(false);

  // Só as perguntas que contam entram no resultado e são obrigatórias; as demais são reflexão.
  const contam = perguntas.filter((p) => p.contaNoResultado);
  const completo = contam.every((p) => respostas[p.ordem]);
  const escolhidas = contam.map((p) => respostas[p.ordem]).filter(Boolean);
  const porOpcao = calculado && regra.modo === 'mais_escolhida' ? resultadoDoQuiz(escolhidas) : null;
  const porFaixa = calculado && regra.modo === 'faixas' ? resultadoPorFaixas(escolhidas, regra.chaveAlvo, regra.faixas) : null;
  const porAcertos = calculado && regra.modo === 'acertos' ? resultadoPorAcertos(respostas, contam, regra.faixas) : null;
  const leitura = (chave: string) => (regra.modo === 'mais_escolhida' ? regra.leituras.find((l) => l.chave === chave)?.texto : undefined);

  function escolher(ordem: number, chave: string) {
    setRespostas((atual) => ({ ...atual, [ordem]: chave }));
    setCalculado(false);
  }

  return (
    <form
      className="my-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (completo) setCalculado(true);
      }}
    >
      {perguntas.map((p) => (
        <fieldset key={p.ordem} className="mb-5 min-w-0 border-0 p-0">
          <legend className="mb-2 font-display text-[1.1rem] leading-snug">
            {p.ordem}. {p.enunciado}
          </legend>
          {p.opcoes.map((o) => (
            <label key={o.chave} className="flex cursor-pointer items-start gap-3 border border-rule px-3 py-2.5 [&:not(:last-child)]:mb-1.5 has-[:checked]:border-accent has-[:checked]:bg-paper">
              <input type="radio" className="mt-1.5 accent-[var(--accent)]" name={`${grupo}-${p.ordem}`} value={o.chave} checked={respostas[p.ordem] === o.chave} onChange={() => escolher(p.ordem, o.chave)} />
              <span>{o.texto}</span>
            </label>
          ))}
          {!p.contaNoResultado && <p className="hint mt-1.5 text-[0.95rem]">Esta pergunta é só para a sua reflexão: não entra no cálculo da leitura.</p>}
        </fieldset>
      ))}

      <button type="submit" className="btn" disabled={!completo}>
        Ver minha leitura
      </button>
      {!completo && (
        <p className="hint mt-2 text-[0.95rem]">
          Responda às {contam.length} perguntas{contam.length < perguntas.length ? ' que entram no cálculo' : ''} para ver a leitura.
        </p>
      )}

      <div role="status" aria-live="polite">
        {porOpcao && (
          <div className="entry my-5">
            <p className="label mb-1">Leitura reflexiva, não diagnóstica</p>
            {porOpcao.empate ? (
              <>
                <p>
                  Suas respostas se dividiram entre {porOpcao.vencedoras.length} opções, empatadas com {porOpcao.contagem[porOpcao.vencedoras[0]]} {porOpcao.contagem[porOpcao.vencedoras[0]] === 1 ? 'escolha' : 'escolhas'} cada. Observe o que as duas leituras abaixo dizem sobre situações diferentes da sua vida.
                </p>
                {porOpcao.vencedoras.map((chave) => (
                  <p key={chave}>
                    <strong>Opção {chave}:</strong> {leitura(chave) ?? 'Sem leitura cadastrada para esta opção.'}
                  </p>
                ))}
              </>
            ) : (
              <p>{leitura(porOpcao.vencedoras[0]) ?? `A opção mais escolhida foi a ${porOpcao.vencedoras[0]}.`}</p>
            )}
            <p className="meta mt-2">
              Distribuição das respostas:{' '}
              {Object.entries(porOpcao.contagem)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([chave, n]) => `${chave}: ${n}`)
                .join(' · ')}
            </p>
            <p className="hint mt-2 text-[0.95rem]">Não é uma avaliação de quem você é: mostra o que predominou nas suas respostas desta vez.</p>
          </div>
        )}
        {porFaixa && (
          <div className="entry my-5">
            <p className="label mb-1">Leitura reflexiva, não diagnóstica</p>
            <p>{porFaixa.leitura ?? 'Não há leitura cadastrada para este resultado.'}</p>
            <p className="meta mt-2">
              Respostas alinhadas ao ensinamento: {porFaixa.alinhadas} de {porFaixa.total}
            </p>
            <p className="hint mt-2 text-[0.95rem]">Não é uma avaliação de quem você é nem uma medida de evolução espiritual: é um recurso de auto-observação.</p>
          </div>
        )}
        {porAcertos && (
          <div className="entry my-5">
            <p className="label mb-1">Devolutiva de compreensão</p>
            <p>
              <strong>
                {porAcertos.acertos} de {porAcertos.total} {porAcertos.acertos === 1 ? 'resposta correta' : 'respostas corretas'}.
              </strong>
            </p>
            <p>{porAcertos.leitura ?? 'Não há leitura cadastrada para este resultado.'}</p>
            <p className="hint mt-2 text-[0.95rem]">Esta devolutiva verifica a compreensão do capítulo. Não é teste psicológico nem avaliação de quem você é.</p>
          </div>
        )}
      </div>
    </form>
  );
}
