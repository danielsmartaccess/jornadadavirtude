/* Área principal do módulo Gita: o capítulo escolhido e suas seis etapas. */
import { Link, useParams } from 'react-router-dom';
import { EmptyState, Notice, PageHeader, Section } from '../../components/ui';
import { capituloAnterior, capituloSeguinte, etapas, getCapitulo, parseNumeroCapitulo, splitTitulo } from '../../domain/gita';
import { StageCard } from './StageCard';
import { useConteudoCapitulo } from './useConteudoCapitulo';

export function ChapterPage() {
  const { numero: param } = useParams();
  const numero = parseNumeroCapitulo(param);
  const capitulo = numero === null ? undefined : getCapitulo(numero);

  if (numero === null || !capitulo) {
    return (
      <EmptyState title="Capítulo não encontrado">
        A Bhagavad Gita tem 18 capítulos. Escolha um no menu. <Link to="/gita">Voltar ao início da leitura</Link>
      </EmptyState>
    );
  }
  return <Capitulo key={numero} numero={numero} titulo={capitulo.titulo} />;
}

function Capitulo({ numero, titulo }: { numero: number; titulo: string }) {
  const { conteudo, tentarDeNovo } = useConteudoCapitulo(numero);
  const { sanscrito, traducao } = splitTitulo(titulo);
  const anterior = capituloAnterior(numero);
  const seguinte = capituloSeguinte(numero);
  const doBanco = conteudo.estado === 'pronto' ? conteudo.etapas : [];

  return (
    <>
      <PageHeader crumbs={[{ label: 'Bhagavad Gita', to: '/gita' }, { label: `Capítulo ${numero}` }]} title={traducao} lede={sanscrito ? `Capítulo ${numero} · ${sanscrito}` : `Capítulo ${numero}`} />

      {conteudo.estado === 'erro' && (
        <Notice title="Não foi possível carregar o texto agora">
          <p>{conteudo.mensagem}</p>
          <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={tentarDeNovo}>
            Tentar de novo
          </button>
        </Notice>
      )}

      <Section title="As seis etapas do capítulo">
        <nav aria-label="Etapas deste capítulo" className="no-print mb-4 flex flex-wrap gap-2">
          {etapas.map((etapa) => (
            <a key={etapa.ordem} href={`#etapa-${etapa.ordem}`} className="chip !min-h-9 no-underline">
              {etapa.ordem}. {etapa.nome}
            </a>
          ))}
        </nav>
        <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0">
          {etapas.map((etapa) => (
            <li key={etapa.ordem} className="min-w-0">
              <StageCard etapa={etapa} conteudo={doBanco.find((e) => e.ordem === etapa.ordem)} carregando={conteudo.estado === 'carregando'} />
            </li>
          ))}
        </ol>
      </Section>
      <nav aria-label="Navegação entre capítulos" className="no-print flex flex-wrap justify-between gap-3">
        {anterior ? (
          <Link to={`/gita/${anterior.numero}`} className="btn btn-ghost btn-sm">
            ← Capítulo {anterior.numero}
          </Link>
        ) : (
          <span />
        )}
        {seguinte && (
          <Link to={`/gita/${seguinte.numero}`} className="btn btn-ghost btn-sm">
            Capítulo {seguinte.numero} →
          </Link>
        )}
      </nav>
    </>
  );
}
