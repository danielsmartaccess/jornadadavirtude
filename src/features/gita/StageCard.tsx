/* Uma das seis etapas de um capítulo. Ainda sem conteúdo real: mostra só a estrutura. */
import type { Etapa } from '../../domain/gita';
import { Tag } from '../../components/ui';

export function StageCard({ etapa }: { etapa: Etapa }) {
  return (
    <article className="card">
      <div className="flex flex-wrap items-center gap-2">
        <Tag accent>Etapa {etapa.ordem}</Tag>
      </div>
      <h3 className="mt-2">{etapa.nome}</h3>
      <p className="hint">Conteúdo em preparação.</p>
    </article>
  );
}
