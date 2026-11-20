/* Tela 01 — Início (Documento 06, seção 5; RF-001 a RF-006). */
import { Link } from 'react-router-dom';
import { useStoreMeta, useUserData } from '../../app/hooks';
import { focusJourney } from '../../application/useCases';
import { Notice, Section, Tag } from '../../components/ui';
import { currentStageName, journeyStats, nextAction, sortByDateDesc, STATUS_LABEL, workedStages } from '../../domain/journey';
import { formatDate } from '../../shared/util';

/* Provocações escritas pela própria plataforma para a reflexão. Não são citações: nenhuma frase é atribuída a pensadores. */
const PROVOCACOES = [
  'Em qual situação recente você percebeu uma virtude em ação, mesmo que por instantes?',
  'O que você tem evitado observar em si mesmo(a)? Não é preciso responder agora.',
  'Que escolha pequena, feita hoje, poderia ser feita com mais atenção?',
  'Quando você se sente mais inteiro(a) ao agir? O que estava presente nesse momento?',
  'O que mudaria na sua semana se você pensasse antes de reagir?',
  'Diante de uma dificuldade repetida, o que ela pode estar ensinando?',
  'O que você faria diferente se não precisasse provar nada a ninguém?',
];

/** Uma provocação por dia do ano: estável durante o dia, sem sorteio a cada visita. */
function provocacaoDoDia(date: Date): string {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86_400_000);
  return PROVOCACOES[day % PROVOCACOES.length];
}

function ProvocacaoDoDia() {
  return (
    <section aria-labelledby="provocacao" className="mb-8">
      <p className="label mb-2" id="provocacao">
        Para pensar hoje
      </p>
      <p className="font-display text-[1.4rem] leading-snug text-accent">{provocacaoDoDia(new Date())}</p>
      <p className="meta mt-2">Pergunta da plataforma para a sua reflexão. Não é uma citação.</p>
    </section>
  );
}

export function HomePage() {
  const data = useUserData();
  const meta = useStoreMeta();
  const journey = focusJourney(data);
  const completed = data.journeys.filter((j) => j.status === 'COMPLETED');
  const lastCompleted = sortByDateDesc(completed.map((j) => ({ ...j, date: j.completedOn })))[0];
  const firstAccess = data.journeys.length === 0 && data.entries.length === 0;

  return (
    <>
      <header className="pb-8">
        <p className="label mb-3">Filosofia prática · desenvolvimento humano</p>
        <h1>Uma jornada de conhecimento, consciência e prática.</h1>
        <p className="hint mt-3 text-[1.2rem]">Conheça as virtudes, observe suas escolhas e desenvolva novas maneiras de agir.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {journey ? (
            <>
              <Link to="/jornada" className="btn">
                {journey.status === 'ACTIVE' ? 'Continuar minha jornada' : journey.status === 'PAUSED' ? 'Ver jornada pausada' : 'Abrir rascunho da jornada'}
              </Link>
              <Link to="/diario" className="btn btn-ghost">
                Consultar meu diário
              </Link>
            </>
          ) : (
            <>
              <Link to="/jornada/nova" className="btn">
                Iniciar minha jornada
              </Link>
              <Link to="/virtudes" className="btn btn-ghost">
                Explorar as virtudes
              </Link>
            </>
          )}
        </div>
      </header>

      {meta.legacyMigrated && (
        <Notice title="Seus dados anteriores foram preservados">
          Encontramos neste navegador os registros da versão anterior da Jornada da Virtude e os trouxemos para cá: jornadas, registros e revisões. Nada foi apagado da versão antiga.
        </Notice>
      )}

      {journey && (
        <Section title="Sua jornada">
          <div className="card">
            <div className="flex flex-wrap items-center gap-2">
              <Tag accent>{STATUS_LABEL[journey.status]}</Tag>
              {journey.startedOn && <span className="meta">início em {formatDate(journey.startedOn)}</span>}
            </div>
            <p className="mt-2 font-display text-2xl text-accent">{journey.virtueName}</p>
            <p className="meta">{journey.title}</p>
            <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <div>
                <dt className="label">Etapa atual</dt>
                <dd>
                  {currentStageName(journey)} · etapas trabalhadas: {workedStages(journey)} de 7
                </dd>
              </div>
              <div>
                <dt className="label">Próxima ação sugerida</dt>
                <dd>
                  <Link to={`/jornada?etapa=${nextAction(journey).stage}`}>{nextAction(journey).text}</Link>
                </dd>
              </div>
              <Activity />
            </dl>
            <p className="hint mt-3 text-[0.95rem]">Os números indicam atividades registradas e participação no percurso. Não medem virtude nem valor pessoal.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/diario?novo=1" className="btn btn-ghost btn-sm">
              Novo registro
            </Link>
            <Link to="/jornada?etapa=praticar" className="btn btn-ghost btn-sm">
              Exercícios
            </Link>
            <Link to="/jornada?etapa=revisar" className="btn btn-ghost btn-sm">
              Revisões
            </Link>
            <Link to="/conselho" className="btn btn-ghost btn-sm">
              Conselho de Sabedoria
            </Link>
          </div>
        </Section>
      )}

      {!journey && lastCompleted && (
        <Section title="Última jornada concluída">
          <Link to={`/historico/${lastCompleted.id}`} className="card">
            <p className="font-display text-xl text-accent">{lastCompleted.virtueName}</p>
            <p className="meta">concluída em {formatDate(lastCompleted.completedOn)} · ver síntese</p>
          </Link>
          <p className="hint mt-3">Concluir uma jornada encerra um ciclo de investigação e prática. Não significa domínio definitivo da virtude: você pode iniciar outra quando quiser.</p>
        </Section>
      )}

      {firstAccess && (
        <Section title="Como funciona">
          <ol className="grid gap-4">
            {[
              ['01', 'Escolha uma virtude', 'São 48 virtudes em oito famílias, cada uma com definição, comportamentos observáveis, exercícios e referências filosóficas.'],
              ['02', 'Investigue e pratique', 'Sete etapas, no seu ritmo: despertar, identificar, investigar, refletir, praticar, registrar e revisar.'],
              ['03', 'Registre e revise', 'O diário guarda práticas, dificuldades e descobertas. As revisões ajudam a reconhecer aprendizados.'],
              ['04', 'Consulte o Conselho, se quiser', 'Perspectivas documentadas de pensadores de diferentes tradições, sempre com fontes e limites. A decisão é sua.'],
            ].map(([n, title, text]) => (
              <li key={n} className="grid grid-cols-[40px_1fr] gap-3">
                <span className="pt-1 font-mono text-sm text-accent">{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p className="text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      <ProvocacaoDoDia />

      <Section title="Três maneiras de começar">
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/virtudes" className="card">
            <p className="label">A</p>
            <h3>Já sei qual virtude quero desenvolver</h3>
            <p className="text-muted">Escolha no catálogo e crie sua jornada.</p>
          </Link>
          <Link to="/jornada/nova?caminho=situacao" className="card">
            <p className="label">B</p>
            <h3>Quero compreender uma situação que estou vivendo</h3>
            <p className="text-muted">Descreva a situação e veja virtudes possivelmente relacionadas.</p>
          </Link>
          <Link to="/dimensoes" className="card">
            <p className="label">C</p>
            <h3>Quero conhecer melhor as virtudes</h3>
            <p className="text-muted">Explore as sete dimensões do ser humano e as famílias de virtudes.</p>
          </Link>
        </div>
      </Section>
    </>
  );

  function Activity() {
    if (!journey) return null;
    const stats = journeyStats(journey, data);
    const lastEntry = sortByDateDesc(data.entries.filter((e) => e.journeyId === journey.id))[0];
    const lastReview = sortByDateDesc(data.reviews.filter((r) => r.journeyId === journey.id))[0];
    return (
      <>
        <div>
          <dt className="label">Último registro</dt>
          <dd>{lastEntry ? `${formatDate(lastEntry.date)} · ${lastEntry.situation}` : 'Nenhum ainda. O diário é voluntário.'}</dd>
        </div>
        <div>
          <dt className="label">Atividades registradas</dt>
          <dd>
            {stats.entries} no diário · {stats.exercisesTried} exercícios · {stats.reviews} revisões{lastReview ? ` (última em ${formatDate(lastReview.date)})` : ''}
          </dd>
        </div>
      </>
    );
  }
}
