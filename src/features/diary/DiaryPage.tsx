/* Tela 08 — Meu Diário (Documento 06, seção 12; RF-059 a RF-074; US-004). */
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useRun, useToast, useUserData } from '../../app/hooks';
import { activeJourney, deleteEntry, journeyById, saveEntry, stampEntry } from '../../application/useCases';
import { Chips, ConfirmButton, EmptyState, PageHeader, Section, Tag, TextArea, TextInput } from '../../components/ui';
import { SimboloFamilia } from '../../components/simbolos';
import { dimensions, getExercise, getVirtue, relacoesDeAnel } from '../../domain/catalog';
import { ACTIONS, ENTRY_TYPES, entryTypeLabel, FEELINGS, SITUATIONS, sortByDateDesc } from '../../domain/journey';
import { buildDiaryExport } from '../../domain/report';
import type { DiaryEntry, EntryType } from '../../domain/types';
import { downloadText } from '../../infrastructure/download';
import { formatDate, newId, normalize, today } from '../../shared/util';

function blankEntry(exerciseId: string | null): DiaryEntry {
  return {
    id: newId(), journeyId: null, date: today(), type: exerciseId ? 'PRACTICE' : 'DIFFICULTY', virtueId: null, virtue: '', situation: '', context: '', thoughts: '',
    feelings: [], actions: [], consequences: '', learning: '', note: '', stage: '', exerciseId, sessionId: null, createdAt: '', updatedAt: '',
  };
}

function EntryForm({ initial, isNew, onDone }: { initial: DiaryEntry; isNew: boolean; onDone: () => void }) {
  const data = useUserData();
  const run = useRun();
  const [entry, setEntry] = useState(initial);
  const [attempted, setAttempted] = useState(false);
  const journey = isNew ? activeJourney(data) : journeyById(data, entry.journeyId);
  const [linked, setLinked] = useState(isNew ? !!journey : !!entry.journeyId);
  const exercise = getExercise(entry.exerciseId ?? '');
  const set = <K extends keyof DiaryEntry>(key: K) => (value: DiaryEntry[K]) => setEntry((e) => ({ ...e, [key]: value }));

  function submit() {
    setAttempted(true);
    const toSave = isNew ? stampEntry(linked ? journey : undefined, entry) : entry;
    if (run((d) => saveEntry(d, toSave, today()), isNew ? 'Registro salvo no diário.' : 'Registro atualizado.')) onDone();
  }

  return (
    <div className="card mb-6">
      {/* Novo registro vem logo abaixo do h1 (antes da linha do tempo): h2. Editar fica dentro da linha do tempo: h3. */}
      {isNew ? <h2 className="mb-3 text-[1.2rem]">Novo registro</h2> : <h3 className="mb-3">Editar registro</h3>}
      {exercise && (
        <p className="mb-3">
          <Tag accent>Exercício</Tag> {exercise.title}
        </p>
      )}
      <div className="grid gap-x-3 sm:grid-cols-2">
        <TextInput label="Data" type="date" value={entry.date} onChange={set('date')} />
        <Chips legend="Tipo de registro" options={ENTRY_TYPES.map((t) => t.label)} value={[entryTypeLabel(entry.type)]} onChange={([label]) => label && set('type')(ENTRY_TYPES.find((t) => t.label === label)!.id as EntryType)} />
      </div>
      {/* A escrita é o centro do diário: a situação ocupa uma área de texto, não uma linha. */}
      <TextArea
        label="Situação"
        rows={3}
        value={entry.situation}
        onChange={set('situation')}
        placeholder="O que aconteceu?"
        error={attempted && !entry.situation.trim() ? 'Descreva a situação: é o único campo obrigatório.' : undefined}
      />
      <div className="-mt-2 mb-4 flex flex-wrap gap-2">
        {SITUATIONS.map((s) => (
          <button key={s} type="button" className="chip !min-h-8 !py-1 !text-[14px]" onClick={() => set('situation')(s)}>
            {s}
          </button>
        ))}
      </div>
      <Chips legend="O que senti" options={FEELINGS} value={entry.feelings} onChange={set('feelings')} multiple allowOther />
      <Chips legend="O que fiz" options={ACTIONS} value={entry.actions} onChange={set('actions')} multiple allowOther />
      <details className="mb-4">
        <summary className="label">Detalhar mais (opcional): contexto, pensamentos, consequências, aprendizado</summary>
        <div className="pt-3">
          <TextArea label="Contexto" rows={2} value={entry.context} onChange={set('context')} />
          <TextArea label="Pensamentos" rows={2} value={entry.thoughts} onChange={set('thoughts')} />
          <TextArea label="Consequências" rows={2} value={entry.consequences} onChange={set('consequences')} />
          <TextArea label="Aprendizado" rows={2} value={entry.learning} onChange={set('learning')} />
        </div>
      </details>
      <TextArea label="Observação complementar (opcional)" rows={2} value={entry.note} onChange={set('note')} placeholder="Uma frase, se quiser" />
      {isNew && journey && (
        <label className="mb-4 flex items-start gap-2">
          <input type="checkbox" className="mt-1.5" checked={linked} onChange={(e) => setLinked(e.target.checked)} />
          <span>
            Associar à jornada em andamento (“{journey.title}”)
          </span>
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn" onClick={submit}>
          {isNew ? 'Registrar' : 'Salvar alterações'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onDone}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function DiaryPage() {
  const data = useUserData();
  const run = useRun();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [virtue, setVirtue] = useState('');
  const [dimension, setDimension] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const journeyFilter = params.get('jornada') ?? '';
  const creating = params.get('novo') === '1';
  const exerciseId = getExercise(params.get('exercicio') ?? '')?.id ?? null;

  const closeForm = () => setParams(journeyFilter ? { jornada: journeyFilter } : {}, { replace: true });
  const q = normalize(query.trim());
  const virtueNames = Array.from(new Set(data.entries.map((e) => e.virtue).filter(Boolean))).sort();
  const filtered = sortByDateDesc(data.entries).filter(
    (e) =>
      (!journeyFilter || e.journeyId === journeyFilter) &&
      (!type || e.type === type) &&
      (!virtue || e.virtue === virtue) &&
      (!dimension || relacoesDeAnel(e.virtueId ?? '').some((r) => String(r.dimensionOrder) === dimension && (r.tipo === 'D1' || r.tipo === 'D2'))) &&
      (!from || e.date >= from) &&
      (!to || e.date <= to) &&
      (!q || normalize([e.situation, e.context, e.thoughts, e.consequences, e.learning, e.note, ...e.feelings, ...e.actions].join(' ')).includes(q)),
  );
  const filteredJourney = journeyById(data, journeyFilter);

  function exportDiary() {
    const ok = downloadText(`diario-jornada-da-virtude-${today()}.md`, buildDiaryExport(filtered), 'text/markdown');
    toast(ok ? `Diário exportado (${filtered.length} registros).` : 'Não foi possível gerar o arquivo neste navegador.', ok ? 'ok' : 'erro');
  }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Diário', to: '/diario' }, ...(creating ? [{ label: 'Novo registro' }] : [])]} title="Meu Diário" lede="Práticas, dificuldades, reflexões e descobertas. Tudo é opcional, exceto a situação.">
        {!creating && (
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn" onClick={() => setParams({ ...(journeyFilter ? { jornada: journeyFilter } : {}), novo: '1' })}>
              Novo registro
            </button>
            {data.entries.length > 0 && (
              <button type="button" className="btn btn-ghost" onClick={exportDiary}>
                Exportar diário
              </button>
            )}
          </div>
        )}
      </PageHeader>

      {creating && <EntryForm key={`novo-${exerciseId}`} initial={blankEntry(exerciseId)} isNew onDone={closeForm} />}

      <Section title="Linha do tempo" aside={<span className="meta" role="status">{filtered.length} de {data.entries.length} registros</span>}>
        {filteredJourney && (
          <p className="mb-3">
            <Tag accent>Jornada</Tag> {filteredJourney.title} · <Link to="/diario">ver todos os registros</Link>
          </p>
        )}
        {data.entries.length > 0 && (
          <details className="mb-4">
            <summary className="label">Filtros e pesquisa</summary>
            <div className="grid gap-x-3 pt-3 sm:grid-cols-2">
              <TextInput label="Pesquisar no texto" type="search" value={query} onChange={setQuery} />
              <div className="mb-4">
                <label className="label mb-1.5" htmlFor="f-tipo">Tipo</label>
                <select id="f-tipo" className="field" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Todos</option>
                  {ENTRY_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="label mb-1.5" htmlFor="f-virtude">Virtude</label>
                <select id="f-virtude" className="field" value={virtue} onChange={(e) => setVirtue(e.target.value)}>
                  <option value="">Todas</option>
                  {virtueNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="label mb-1.5" htmlFor="f-dimensao">Dimensão</label>
                <select id="f-dimensao" className="field" value={dimension} onChange={(e) => setDimension(e.target.value)} aria-describedby="f-dimensao-nota">
                  <option value="">Todas</option>
                  {dimensions.map((d) => (
                    <option key={d.id} value={String(d.order)}>{d.order}. {d.name}</option>
                  ))}
                </select>
                <p id="f-dimensao-nota" className="hint mt-1 text-[0.95rem]">Registros cujas virtudes se ligam à dimensão pela relação primária ou secundária.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextInput label="De" type="date" value={from} onChange={setFrom} />
                <TextInput label="Até" type="date" value={to} onChange={setTo} />
              </div>
            </div>
          </details>
        )}

        {data.entries.length === 0 && !creating && <EmptyState title="Nenhum registro ainda">A primeira cena já é um dado. O diário é voluntário: registrar pouco não significa praticar pouco.</EmptyState>}
        {data.entries.length > 0 && filtered.length === 0 && <EmptyState title="Nenhum registro com esses filtros" />}

        <ul className="grid gap-5">
          {filtered.map((e) =>
            editing === e.id ? (
              <li key={e.id}>
                <EntryForm initial={e} isNew={false} onDone={() => setEditing(null)} />
              </li>
            ) : (
              <li key={e.id} className="entry">
                <p className="meta">
                  {formatDate(e.date)} · {entryTypeLabel(e.type)}
                  {e.virtue && (
                    <span className="inline-flex items-center gap-1.5">
                      {' · '}
                      {e.virtueId && getVirtue(e.virtueId) && <SimboloFamilia familyId={getVirtue(e.virtueId)!.familyId} size={16} />}
                      {e.virtue}
                    </span>
                  )}
                  {e.stage && ` · etapa ${e.stage}`}
                </p>
                <p className="mt-1 whitespace-pre-wrap font-display text-[1.25rem] leading-snug">{e.situation}</p>
                {e.context && <p>{e.context}</p>}
                {e.thoughts && <p><span className="label">Pensei</span>{e.thoughts}</p>}
                {e.feelings.length > 0 && <p>Senti: {e.feelings.join(', ')}</p>}
                {e.actions.length > 0 && <p>Fiz: {e.actions.join(', ')}</p>}
                {e.consequences && <p><span className="label">Consequências</span>{e.consequences}</p>}
                {e.learning && <p><span className="label">Aprendizado</span>{e.learning}</p>}
                {e.note && <p className="italic">{e.note}</p>}
                <p className="meta mt-1 flex flex-wrap gap-x-3">
                  {e.exerciseId && <span>Exercício: {getExercise(e.exerciseId)?.title}</span>}
                  {e.sessionId && <Link to={`/conselho/sessoes/${e.sessionId}`}>Sessão do Conselho</Link>}
                  {e.journeyId && journeyById(data, e.journeyId) && <Link to={`/historico/${e.journeyId}`}>{journeyById(data, e.journeyId)!.title}</Link>}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(e.id)}>
                    Editar
                  </button>
                  <Link to={`/conselho?registro=${e.id}`} className="btn btn-ghost btn-sm">
                    Levar ao Conselho
                  </Link>
                  <ConfirmButton label="Excluir" confirmLabel="Confirmar exclusão" onConfirm={() => run((d) => deleteEntry(d, e.id), 'Registro excluído.')} />
                </div>
              </li>
            ),
          )}
        </ul>
        {data.entries.length > 0 && <p className="hint mt-6 text-[0.95rem]">Dificuldades, dúvidas e situações não resolvidas também fazem parte do processo.</p>}
      </Section>
    </>
  );
}
