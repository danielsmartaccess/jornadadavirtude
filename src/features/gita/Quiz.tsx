/* Quiz de reflexão de uma etapa. Perguntas, alternativas e leituras vêm do banco; a regra do
 * resultado é resultadoDoQuiz (domain/gita.ts): a opção mais escolhida define a leitura e,
 * em empate, mostram-se as opções empatadas. Nada é pontuado nem guardado. */
import { useId, useState } from 'react';
import { resultadoDoQuiz, type Alternativa, type PerguntaQuiz } from '../../domain/gita';

export function Quiz({ perguntas, leituras }: { perguntas: PerguntaQuiz[]; leituras: Alternativa[] }) {
  const grupo = useId();
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [calculado, setCalculado] = useState(false);

  const completo = perguntas.every((p) => respostas[p.ordem]);
  const resultado = calculado ? resultadoDoQuiz(perguntas.map((p) => respostas[p.ordem]).filter(Boolean)) : null;
  const leitura = (chave: string) => leituras.find((l) => l.chave === chave)?.texto;

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
        </fieldset>
      ))}

      <button type="submit" className="btn" disabled={!completo}>
        Ver minha leitura
      </button>
      {!completo && <p className="hint mt-2 text-[0.95rem]">Responda às {perguntas.length} perguntas para ver a leitura.</p>}

      <div role="status" aria-live="polite">
        {resultado && (
          <div className="entry my-5">
            <p className="label mb-1">Leitura reflexiva, não diagnóstica</p>
            {resultado.empate ? (
              <>
                <p>
                  Suas respostas se dividiram entre {resultado.vencedoras.length} opções, empatadas com {resultado.contagem[resultado.vencedoras[0]]} {resultado.contagem[resultado.vencedoras[0]] === 1 ? 'escolha' : 'escolhas'} cada. Observe o que as duas leituras abaixo dizem sobre situações diferentes da sua vida.
                </p>
                {resultado.vencedoras.map((chave) => (
                  <p key={chave}>
                    <strong>Opção {chave}:</strong> {leitura(chave) ?? 'Sem leitura cadastrada para esta opção.'}
                  </p>
                ))}
              </>
            ) : (
              <p>{leitura(resultado.vencedoras[0]) ?? `A opção mais escolhida foi a ${resultado.vencedoras[0]}.`}</p>
            )}
            <p className="meta mt-2">
              Distribuição das respostas:{' '}
              {Object.entries(resultado.contagem)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([chave, n]) => `${chave}: ${n}`)
                .join(' · ')}
            </p>
            <p className="hint mt-2 text-[0.95rem]">Não é uma avaliação de quem você é: mostra o que predominou nas suas respostas desta vez.</p>
          </div>
        )}
      </div>
    </form>
  );
}
