/* Área principal do módulo Gita: o capítulo escolhido e suas seis etapas. */
import { Link, useParams } from 'react-router-dom';
import { EmptyState, PageHeader, Section } from '../../components/ui';
import { capituloAnterior, capituloSeguinte, etapas, getCapitulo, parseNumeroCapitulo, splitTitulo } from '../../domain/gita';
import { StageCard } from './StageCard';

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

  const { sanscrito, traducao } = splitTitulo(capitulo.titulo);
  const anterior = capituloAnterior(numero);
  const seguinte = capituloSeguinte(numero);

  return (
    <>
      <PageHeader crumbs={[{ label: 'Bhagavad Gita', to: '/gita' }, { label: `Capítulo ${numero}` }]} title={traducao} lede={sanscrito ? `Capítulo ${numero} · ${sanscrito}` : `Capítulo ${numero}`} />
      <Section title="As seis etapas do capítulo">
        <ol className="m-0 grid list-none gap-4 p-0">
          {etapas.map((etapa) => (
            <li key={etapa.ordem}>
              <StageCard etapa={etapa} />
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
