/* Tela 03 — Catálogo de virtudes e dimensões (Documento 06, seção 7; RF-023 a RF-032 e RF-042 a RF-047). */
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { atraso } from '../../components/movimento';
import { AneisDimensao, AssinaturaVirtude, SimboloFamilia } from '../../components/simbolos';
import { Accordion, BulletList, EmptyState, Notice, PageHeader, Section, StatusTag, Tag } from '../../components/ui';
import { corDaFamilia } from '../../domain/identidade';
import {
  categoryLabel,
  dimensions,
  dimensionsOfVirtue,
  distinctionsOfVirtue,
  exercisesOfDimension,
  exercisesOfVirtue,
  families,
  getDimension,
  getFamily,
  getVirtue,
  sourceLabel,
  thinkersOfVirtue,
  virtueDimensions,
  virtues,
  virtuesOfDimension,
  worksOfThinker,
} from '../../domain/catalog';
import type { Exercise } from '../../domain/types';
import { normalize } from '../../shared/util';

const RELATION_LABEL = { D1: 'Relação primária', D2: 'Relação secundária', D3: 'Relação contextual' } as const;
const P_LABEL = { P1: 'Fundamentação direta', P2: 'Contribuição relevante', P3: 'Perspectiva complementar', P4: 'Interpretação contemporânea' } as const;

/** Relações da virtude com as dimensões, no formato da assinatura visual (anel e tipo D1 a D3). */
function relacoesDaVirtude(virtueId: string) {
  return dimensionsOfVirtue(virtueId).map(({ dimension, relation }) => ({ dimensionOrder: dimension.order, tipo: relation.relationType }));
}

const INTERPRETIVE ='A relação entre virtudes e dimensões é uma proposta pedagógica da plataforma: uma referência para interpretar, não uma classificação da pessoa nem uma correspondência exclusiva das tradições filosóficas.';

export function ExerciseSummary({ exercise }: { exercise: Exercise }) {
  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2">
        <Tag accent>{categoryLabel(exercise.category)}</Tag>
        <Tag>{exercise.duration}</Tag>
      </div>
      <h3 className="mt-2">{exercise.title}</h3>
      <p>{exercise.description}</p>
      {exercise.steps.length > 0 && <BulletList items={exercise.steps} />}
    </div>
  );
}

export function VirtuesPage() {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('');
  const [dimension, setDimension] = useState('');
  const q = normalize(query.trim());
  const inDimension = new Set(virtueDimensions.filter((r) => r.dimensionId === dimension).map((r) => r.virtueId));
  const filtered = virtues.filter(
    (v) =>
      (!family || v.familyId === family) &&
      (!dimension || inDimension.has(v.id)) &&
      (!q || normalize(`${v.name} ${v.definition} ${v.notConfuse} ${v.deficiency} ${v.excess} ${v.behaviors.join(" ")}`).includes(q)),
  );

  return (
    <>
      <PageHeader crumbs={[{ label: 'Virtudes' }]} title="Catálogo de virtudes" lede="48 virtudes em oito famílias. Uma virtude é uma disposição que se desenvolve pelo conhecimento, pela reflexão e pela prática.">
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/dimensoes" className="btn btn-ghost btn-sm">
            As sete dimensões
          </Link>
          <Link to="/conselho/pensadores" className="btn btn-ghost btn-sm">
            Pensadores e referências
          </Link>
          <Link to="/gita" className="btn btn-ghost btn-sm">
            Leitura da Bhagavad Gita
          </Link>
        </div>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label mb-1.5" htmlFor="busca">
            Palavra-chave
          </label>
          <input id="busca" type="search" className="field" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ex.: paciência, medo, verdade" />
        </div>
        <div>
          <label className="label mb-1.5" htmlFor="familia">
            Família
          </label>
          <select id="familia" className="field" value={family} onChange={(e) => setFamily(e.target.value)}>
            <option value="">Todas</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-1.5" htmlFor="dimensao">
            Dimensão
          </label>
          <select id="dimensao" className="field" value={dimension} onChange={(e) => setDimension(e.target.value)}>
            <option value="">Todas</option>
            {dimensions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="meta mt-3" role="status">
        {filtered.length} de {virtues.length} virtudes
      </p>

      {filtered.length === 0 && <EmptyState title="Nenhuma virtude encontrada">Tente outra palavra ou limpe os filtros.</EmptyState>}

      {families
        .filter((f) => filtered.some((v) => v.familyId === f.id))
        .map((f) => (
          <Section
            key={f.id}
            title={f.name}
            aside={
              <span className="flex items-center gap-2">
                <SimboloFamilia familyId={f.id} size={28} />
                <span className="meta">{f.field}</span>
              </span>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered
                .filter((v) => v.familyId === f.id)
                .map((v, i) => (
                  <Link key={v.id} to={`/virtudes/${v.id}`} className="card revelar" style={{ borderTop: `4px solid ${corDaFamilia(v.familyId)}`, ...atraso(i) }}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="uppercase tracking-wide">{v.name}</h3>
                      <AssinaturaVirtude cor={corDaFamilia(v.familyId)} relacoes={relacoesDaVirtude(v.id)} size={40} />
                    </div>
                    <p>{v.definition}</p>
                    <p className="meta mt-2">Conhecer esta virtude →</p>
                  </Link>
                ))}
            </div>
          </Section>
        ))}
    </>
  );
}

export function VirtuePage() {
  const { id = '' } = useParams();
  const virtue = getVirtue(id);
  if (!virtue) return <EmptyState title="Virtude não encontrada">Volte ao <Link to="/virtudes">catálogo</Link>.</EmptyState>;
  const family = getFamily(virtue.familyId);
  const related = distinctionsOfVirtue(virtue.id);
  const thinkers = thinkersOfVirtue(virtue.id);

  return (
    <>
      <PageHeader crumbs={[{ label: 'Virtudes', to: '/virtudes' }, { label: family?.name ?? '' }, { label: virtue.name }]} title={virtue.name} lede={virtue.definition}>
        <div className="mt-4 flex flex-wrap items-end gap-5">
          <SimboloFamilia familyId={virtue.familyId} size={64} />
          <AssinaturaVirtude cor={corDaFamilia(virtue.familyId)} relacoes={relacoesDaVirtude(virtue.id)} size={64} animado />
          <p className="meta max-w-[30ch]">Os anéis são as sete dimensões. A espessura mostra o tipo de relação: primária, secundária, contextual ou sem relação registrada.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={`/jornada/nova?virtude=${virtue.id}`} className="btn">
            Iniciar uma jornada com esta virtude
          </Link>
          <Link to={`/conselho?virtude=${virtue.id}`} className="btn btn-ghost">
            Levar ao Conselho
          </Link>
        </div>
      </PageHeader>

      <Section title="Compreender">
        <p>
          <strong>Não confundir com:</strong> {virtue.notConfuse}
        </p>
        {virtue.note && <Notice>{virtue.note}</Notice>}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="card">
            <p className="label">Deficiência</p>
            <p>{virtue.deficiency}</p>
          </div>
          <div className="card">
            <p className="label">{virtue.excessApparent ? 'Excesso aparente' : 'Excesso'}</p>
            <p>{virtue.excess}</p>
          </div>
        </div>
        <p className="hint mt-3 text-[0.95rem]">A virtude é a medida adequada à situação, não uma média matemática entre os extremos.</p>
      </Section>

      <Section title="Comportamentos observáveis">
        <BulletList items={virtue.behaviors} />
        <p className="hint mt-2 text-[0.95rem]">Servem para reconhecer situações de prática e refletir sobre escolhas. Não são critérios de nota.</p>
      </Section>

      <Section title="Dimensões associadas">
        <div className="flex flex-wrap gap-2">
          {dimensionsOfVirtue(virtue.id).map(({ dimension, relation }) => (
            <Link key={dimension.id} to={`/dimensoes/${dimension.id}`} className="chip" title={RELATION_LABEL[relation.relationType]}>
              {dimension.name}
              <span className="meta ml-2">{relation.relationType === 'D1' ? 'primária' : relation.relationType === 'D2' ? 'secundária' : 'contextual'}</span>
            </Link>
          ))}
        </div>
        <p className="hint mt-3 text-[0.95rem]">{INTERPRETIVE}</p>
      </Section>

      {related.length > 0 && (
        <Section title="Virtudes relacionadas e distinções">
          <ul className="grid gap-3">
            {related.map((d) => {
              const otherId = d.a === virtue.id ? d.b : d.a;
              const otherName = d.a === virtue.id ? d.bName : d.aName;
              return (
                <li key={d.id} className="entry">
                  <p className="meta">{otherId ? <Link to={`/virtudes/${otherId}`}>{otherName}</Link> : `${otherName} (conceito próximo, fora do catálogo)`}</p>
                  <p>{d.distinction}</p>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section title="Exercícios">
        <div className="grid gap-3">
          {exercisesOfVirtue(virtue.id).map((e) => (
            <ExerciseSummary key={e.id} exercise={e} />
          ))}
        </div>
        <p className="hint mt-3 text-[0.95rem]">Para acompanhar um exercício e registrar a experiência, inicie uma jornada com esta virtude.</p>
      </Section>

      <Section title="Pensadores e referências">
        <p className="hint mb-2 text-[0.95rem]">
          Associações registradas nos documentos do projeto. A classificação do tipo de relação (P1 a P4) só aparece onde foi documentada; as demais aguardam curadoria.
        </p>
        {thinkers.map(({ thinker, relation }) => (
          <Accordion
            key={relation.id}
            title={
              <>
                {thinker.name} {relation.priority && <span className="meta ml-1">· referência prioritária</span>}
              </>
            }
          >
            <p>{relation.justification}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Tag accent={!!relation.relationType}>{relation.relationType ? `${relation.relationType} · ${P_LABEL[relation.relationType]}` : 'Tipo de relação a classificar'}</Tag>
              <StatusTag status={relation.status} />
            </div>
            {worksOfThinker(thinker).length > 0 && <p className="meta mt-2">Obras de referência: {worksOfThinker(thinker).map((w) => w.title).join('; ')}</p>}
            <p className="meta mt-1">Fonte da associação: {relation.sources.map(sourceLabel).join(' · ')}</p>
            {thinker.council && (
              <p className="mt-2">
                <Link to={`/conselho/pensadores/${thinker.id}`}>Ver perfil no Conselho</Link>
              </p>
            )}
          </Accordion>
        ))}
      </Section>
    </>
  );
}

export function DimensionsPage() {
  const groups = [
    { id: 'personalidade', title: 'Personalidade', text: 'Quatro dimensões ligadas à manifestação do indivíduo na existência concreta.' },
    { id: 'individualidade', title: 'Individualidade ou tríade superior', text: 'Três dimensões ligadas aos princípios superiores do ser humano.' },
  ] as const;
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Virtudes', to: '/virtudes' }, { label: 'Dimensões' }]}
        title="As sete dimensões do ser humano"
        lede="Um mapa filosófico para compreender o desenvolvimento humano de maneira integral."
      />
      <Notice title="Natureza dos conceitos">
        A constituição septenária é uma representação filosófica e espiritual, apresentada em conteúdos da Nova Acrópole e relacionada a tradições do Oriente. As dimensões não são estruturas anatômicas nem grandezas cientificamente mensuráveis, e não devem ser lidas como compartimentos isolados.
      </Notice>
      {groups.map((group) => (
        <Section key={group.id} title={group.title}>
          <p className="hint mb-3">{group.text}</p>
          <div className="grid gap-3">
            {dimensions
              .filter((d) => d.group === group.id)
              .map((d) => (
                <Link key={d.id} to={`/dimensoes/${d.id}`} className="card grid grid-cols-[48px_1fr] gap-3">
                  <AneisDimensao order={d.order} size={44} />
                  <div>
                    <h3>{d.name}</h3>
                    <p className="meta">Dimensão {d.order} de 7 · {d.traditionalName} · {d.field}</p>
                    <p className="mt-1 italic">{d.guidingQuestion}</p>
                  </div>
                </Link>
              ))}
          </div>
        </Section>
      ))}
      <Section title="Uma situação, sete dimensões">
        <p>Uma mesma situação cotidiana pode envolver todas as dimensões. A sequência abaixo é uma proposta metodológica da Jornada, não uma ordem obrigatória:</p>
        <ol className="mt-3 list-decimal pl-6">
          {['Perceber a experiência.', 'Reconhecer as reações.', 'Examinar os pensamentos.', 'Identificar os princípios envolvidos.', 'Ampliar a compreensão.', 'Escolher conscientemente.', 'Transformar a escolha em ação.'].map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>
    </>
  );
}

export function DimensionPage() {
  const { id = '' } = useParams();
  const dimension = getDimension(id);
  if (!dimension) return <EmptyState title="Dimensão não encontrada">Volte às <Link to="/dimensoes">sete dimensões</Link>.</EmptyState>;
  const related = virtuesOfDimension(dimension.id);
  const blocks: [string, string[]][] = [
    ['Características', dimension.characteristics],
    ['Potencialidades', dimension.potentials],
    ['Desafios', dimension.challenges],
    ['Aplicações práticas', dimension.applications],
  ];
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Virtudes', to: '/virtudes' }, { label: 'Dimensões', to: '/dimensoes' }, { label: dimension.shortName }]}
        title={dimension.name}
        lede={dimension.guidingQuestion}
      >
        <div className="mt-4 text-accent">
          <AneisDimensao order={dimension.order} size={88} animado />
        </div>
        <p className="meta mt-2">
          Dimensão {dimension.order} de 7 · {dimension.group === 'personalidade' ? 'Personalidade' : 'Individualidade superior'} · nome tradicional associado: {dimension.traditionalName}
        </p>
      </PageHeader>

      <Section title="Conceito">
        {dimension.concept.map((p) => (
          <p key={p} className="mb-2">
            {p}
          </p>
        ))}
        <Notice title="Cuidado conceitual">{dimension.caution}</Notice>
      </Section>

      <Section title="Conhecer a dimensão">
        {blocks.map(([title, items], i) => (
          <Accordion key={title} title={title} open={i === 0}>
            <BulletList items={items} />
          </Accordion>
        ))}
      </Section>

      <Section title="Perguntas de autoconhecimento">
        <ol className="list-decimal pl-6">
          {dimension.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
        <p className="hint mt-3 text-[0.95rem]">Perguntas para refletir, sem resposta certa. O resultado é sempre uma oportunidade de reflexão, nunca um rótulo.</p>
      </Section>

      <Section title="Virtudes relacionadas">
        {(['D1', 'D2'] as const).map((type) => {
          const list = related.filter((r) => r.relation.relationType === type);
          if (!list.length) return null;
          return (
            <div key={type} className="mb-4">
              <p className="label mb-2">{RELATION_LABEL[type]}</p>
              <div className="flex flex-wrap gap-2">
                {list.map(({ virtue }) => (
                  <Link key={virtue.id} to={`/virtudes/${virtue.id}`} className="chip">
                    {virtue.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        <p className="hint text-[0.95rem]">{INTERPRETIVE}</p>
      </Section>

      <Section title="Exercício proposto">
        <div className="grid gap-3">
          {exercisesOfDimension(dimension.id).map((e) => (
            <ExerciseSummary key={e.id} exercise={e} />
          ))}
        </div>
      </Section>
    </>
  );
}
