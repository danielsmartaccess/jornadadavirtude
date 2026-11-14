/* Tela 02 — Início de uma jornada (Documento 06, seção 6; RF-007 a RF-013; US-001). */
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useRun, useUserData } from '../../app/hooks';
import { activeJourney, createJourney, startJourney } from '../../application/useCases';
import { Notice, PageHeader, Section, TextArea, TextInput } from '../../components/ui';
import { families, getVirtue, virtues } from '../../domain/catalog';
import { suggest } from '../../domain/council';
import { defaultTitle } from '../../domain/journey';
import { store } from '../../infrastructure/localRepository';
import { today } from '../../shared/util';

export function StartJourneyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const run = useRun();
  const data = useUserData();
  const active = activeJourney(data);

  const [virtueId, setVirtueId] = useState(getVirtue(params.get('virtude') ?? '')?.id ?? '');
  const [title, setTitle] = useState('');
  const [motivation, setMotivation] = useState('');
  const [situation, setSituation] = useState('');
  const [expectation, setExpectation] = useState('');
  const [attempted, setAttempted] = useState(false);

  const virtue = getVirtue(virtueId);
  const fromSituation = params.get('caminho') === 'situacao';
  const suggestion = situation.trim().length > 15 ? suggest(situation) : null;

  function submit(start: boolean) {
    setAttempted(true);
    let createdId = '';
    const ok = run((current) => {
      const created = createJourney(
        current,
        { title, virtueId: virtue?.id ?? null, virtueName: virtue?.name ?? '', origin: fromSituation ? 'situacao' : 'virtude', motivation, situation, expectation },
        today(),
      );
      createdId = created.journey.id;
      return start ? startJourney(created.data, createdId, today(), { pauseActive: true }) : created.data;
    }, start ? 'Jornada criada e iniciada.' : 'Jornada salva como rascunho.');
    if (ok && createdId && store.getData().journeys.some((j) => j.id === createdId)) navigate('/jornada');
  }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Minha Jornada', to: '/jornada' }, { label: 'Nova jornada' }]} title="Iniciar uma jornada" lede="Um ciclo de investigação e prática de uma virtude, no seu ritmo." />

      {active && (
        <Notice title="Você já tem uma jornada em andamento">
          “{active.title}” será <strong>pausada</strong> se você iniciar a nova agora. Nada é apagado, e ela pode ser retomada depois. Se preferir, salve a nova como rascunho.
        </Notice>
      )}

      <Section title="1. Sua intenção">
        <TextArea
          label="O que motiva você a começar esta jornada?"
          value={motivation}
          onChange={setMotivation}
          error={attempted && !motivation.trim() ? 'Registre a intenção: é ela que dá sentido à jornada.' : undefined}
          hint="Uma frase basta. Você poderá editar depois."
        />
        <TextArea
          label="Há uma situação que você deseja compreender? (opcional)"
          value={situation}
          onChange={setSituation}
          hint="Se descrever a situação, a plataforma indica virtudes possivelmente relacionadas. São hipóteses, não um diagnóstico."
        />
        {suggestion && suggestion.virtueIds.length > 0 && (
          <div className="mb-4">
            <p className="label mb-2">Virtudes possivelmente relacionadas</p>
            <div className="flex flex-wrap gap-2">
              {suggestion.virtueIds.map((id) => (
                <button key={id} type="button" className="chip" aria-pressed={virtueId === id} onClick={() => setVirtueId(id)}>
                  {getVirtue(id)?.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {suggestion?.crisis && (
          <Notice title="Você não precisa passar por isso sem apoio">
            Se estiver em sofrimento intenso ou em risco, procure ajuda agora: CVV 188 (24 horas, gratuito), SAMU 192 ou Polícia 190. Central de Atendimento à Mulher: 180. A reflexão filosófica não substitui apoio profissional.
          </Notice>
        )}
        <TextArea label="O que você espera aprender? (opcional)" value={expectation} onChange={setExpectation} rows={2} />
      </Section>

      <Section title="2. A virtude principal">
        <div className="mb-4">
          <label className="label mb-1.5" htmlFor="virtude-principal">
            Virtude que você quer desenvolver
          </label>
          <select id="virtude-principal" className="field" value={virtueId} aria-invalid={attempted && !virtue ? true : undefined} onChange={(e) => setVirtueId(e.target.value)}>
            <option value="">Escolha uma virtude…</option>
            {families.map((f) => (
              <optgroup key={f.id} label={f.name}>
                {virtues
                  .filter((v) => v.familyId === f.id)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          {attempted && !virtue && (
            <p role="alert" className="mt-1 text-[0.95rem] text-accent">
              ⚠ Escolha a virtude principal antes de criar a jornada.
            </p>
          )}
          <p className="hint mt-1 text-[0.95rem]">
            Ainda não sabe? <Link to="/virtudes">Explore o catálogo</Link> ou as <Link to="/dimensoes">sete dimensões</Link> e volte quando quiser.
          </p>
        </div>
        {virtue && (
          <div className="card mb-4">
            <p className="font-display text-xl text-accent">{virtue.name}</p>
            <p>{virtue.definition}</p>
            <p className="meta mt-1">
              <Link to={`/virtudes/${virtue.id}`}>Conhecer os fundamentos desta virtude</Link>
            </p>
          </div>
        )}
        <TextInput label="Título da jornada (opcional)" value={title} onChange={setTitle} placeholder={defaultTitle(virtue?.name ?? '')} />
      </Section>

      <div className="rule-top flex flex-wrap gap-3">
        <button type="button" className="btn" onClick={() => submit(true)}>
          Criar e iniciar a jornada
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => submit(false)}>
          Salvar como rascunho
        </button>
      </div>
      <p className="hint mt-3 text-[0.95rem]">Concluir uma jornada, mais adiante, não significará dominar a virtude: significa encerrar um ciclo de investigação e prática.</p>
    </>
  );
}
