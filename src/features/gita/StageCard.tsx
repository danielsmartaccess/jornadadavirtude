/* Uma das seis etapas de um capítulo: título e, quando o texto já está no banco, o conteúdo
 * em Markdown e, na etapa de reflexão, o quiz. Sem texto, mostra "Conteúdo em preparação". */
import { lazy, Suspense } from 'react';
import { Tag } from '../../components/ui';
import { dividirNoPrimeiroSubtitulo, type ConteudoEtapa, type Etapa } from '../../domain/gita';
import { Quiz, type RegraQuiz } from './Quiz';
import { ReflexaoAberta } from './ReflexaoAberta';

const Markdown = lazy(() => import('./Markdown'));

function Texto({ markdown }: { markdown: string }) {
  return (
    <Suspense fallback={<p className="hint">Carregando o texto…</p>}>
      <Markdown>{markdown}</Markdown>
    </Suspense>
  );
}

function regraDoQuiz(c: ConteudoEtapa): RegraQuiz {
  return c.quizModo === 'faixas' && c.quizChaveAlvo ? { modo: 'faixas', chaveAlvo: c.quizChaveAlvo, faixas: c.faixas } : { modo: 'mais_escolhida', leituras: c.leituras };
}

function Conteudo({ conteudo }: { conteudo: ConteudoEtapa & { conteudoMd: string } }) {
  if (conteudo.perguntas.length === 0) return <Texto markdown={conteudo.conteudoMd} />;
  // O quiz fica entre a introdução e a reflexão aberta, como no material de origem.
  const { introducao, resto } = dividirNoPrimeiroSubtitulo(conteudo.conteudoMd);
  return (
    <>
      {introducao && <Texto markdown={introducao} />}
      <Quiz perguntas={conteudo.perguntas} regra={regraDoQuiz(conteudo)} />
      {resto && <Texto markdown={resto} />}
      {conteudo.id !== null && <ReflexaoAberta etapaId={conteudo.id} />}
    </>
  );
}

export function StageCard({ etapa, conteudo, carregando }: { etapa: Etapa; conteudo?: ConteudoEtapa; carregando?: boolean }) {
  return (
    <article id={`etapa-${etapa.ordem}`} className="card scroll-mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Tag accent>Etapa {etapa.ordem}</Tag>
      </div>
      <h3 className="mt-2">{etapa.nome}</h3>
      {conteudo?.conteudoMd ? (
        <Conteudo conteudo={{ ...conteudo, conteudoMd: conteudo.conteudoMd }} />
      ) : (
        <p className="hint">{carregando ? 'Carregando…' : 'Conteúdo em preparação.'}</p>
      )}
    </article>
  );
}
