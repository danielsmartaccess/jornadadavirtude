/* Configurações, dados pessoais e fundamentos (RF-119 a RF-126; Documento 06, seção 2.6). */
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreMeta, useSync, useToast, useUserData } from '../../app/hooks';
import { BulletList, ConfirmButton, Notice, PageHeader, Section, Tag, TextInput } from '../../components/ui';
import { councilMembers, dimensions, exercises, virtues } from '../../domain/catalog';
import type { UserData } from '../../domain/types';
import { downloadText } from '../../infrastructure/download';
import { buildExport, parseImport } from '../../infrastructure/legacy';
import { store } from '../../infrastructure/localRepository';
import { isEmptyData } from '../../infrastructure/sanitize';
import { deleteCloudData, resolveConflict, sendMagicLink, signIn, signOut, signUp, syncNow } from '../../infrastructure/sync';
import { plural, today } from '../../shared/util';

const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

const summary = (data: UserData) =>
  `${plural(data.journeys.length, 'jornada', 'jornadas')}, ${plural(data.entries.length, 'registro', 'registros')} no diário, ${plural(data.reviews.length, 'revisão', 'revisões')} e ${plural(data.sessions.length, 'sessão', 'sessões')} do Conselho`;

function Account() {
  const sync = useSync();
  const toast = useToast();
  const data = useUserData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function act(action: () => Promise<{ ok: boolean; message: string }>) {
    setBusy(true);
    const result = await action();
    setBusy(false);
    toast(result.message, result.ok ? 'ok' : 'erro');
  }

  if (!sync.configured) return <p className="hint">A sincronização na nuvem não está configurada nesta instalação. Seus dados ficam apenas neste navegador.</p>;
  if (!sync.ready) return <p className="hint" role="status">Verificando sua sessão…</p>;

  if (sync.user) {
    const label = { local: 'Sem sincronização', sincronizando: 'Sincronizando…', sincronizado: 'Sincronizado', pendente: 'Alterações aguardando envio', conflito: 'Escolha necessária', erro: 'Falha na sincronização' }[sync.status];
    return (
      <>
        <p>
          Conectado como <strong>{sync.user.email}</strong>. <Tag accent>{label}</Tag>
        </p>
        {sync.message && <p className="hint mt-1">{sync.message}</p>}
        {sync.conflict && (
          <Notice title="Este aparelho e a nuvem têm dados diferentes">
            <p>Neste aparelho: {summary(data)}.</p>
            <p>Na nuvem: {summary(sync.conflict.remote)}.</p>
            <p className="mt-1">Escolha qual conjunto manter. O outro será substituído. Se tiver dúvida, exporte os dados deste aparelho antes de decidir.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ConfirmButton className="btn btn-sm" label="Manter os dados deste aparelho" confirmLabel="Confirmar: substituir a nuvem" onConfirm={() => void resolveConflict('local')} />
              <ConfirmButton label="Usar os dados da nuvem" confirmLabel="Confirmar: substituir este aparelho" onConfirm={() => void resolveConflict('nuvem')} />
            </div>
          </Notice>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost btn-sm" disabled={busy || !!sync.conflict} onClick={() => void syncNow()}>
            Sincronizar agora
          </button>
          <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => void act(signOut)}>
            Sair da conta
          </button>
          <ConfirmButton label="Apagar meus dados da nuvem" confirmLabel="Confirmar exclusão na nuvem" onConfirm={() => void act(deleteCloudData)} />
        </div>
        <p className="hint mt-2 text-[0.95rem]">Ao sair, os dados continuam neste aparelho. Apagar da nuvem remove jornadas, diário, revisões e sessões do servidor e encerra a sessão; a cópia local é mantida.</p>
      </>
    );
  }

  const ready = email.includes('@') && password.length >= 6;
  return (
    <>
      <p className="mb-3">A conta é opcional. Com ela, seus dados são copiados para a nuvem e ficam disponíveis em outros aparelhos. Sem ela, tudo continua funcionando só neste navegador.</p>
      <div className="grid gap-x-3 sm:grid-cols-2">
        <TextInput label="E-mail" type="email" autoComplete="email" value={email} onChange={setEmail} />
        <TextInput label="Senha" type="password" autoComplete="current-password" value={password} onChange={setPassword} hint="Mínimo de 6 caracteres." />
      </div>
      <label className="mb-4 flex items-start gap-2">
        <input type="checkbox" className="mt-1.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>Para criar a conta: autorizo guardar na nuvem meus registros pessoais (jornadas, diário, revisões e sessões do Conselho), que são dados sensíveis, para sincronizá-los entre meus aparelhos. Posso apagá-los quando quiser.</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" disabled={busy || !ready} onClick={() => void act(() => signIn(email, password))}>
          Entrar
        </button>
        <button type="button" className="btn btn-ghost" disabled={busy || !ready || !consent} onClick={() => void act(() => signUp(email, password))}>
          Criar conta
        </button>
        <button type="button" className="btn btn-ghost" disabled={busy || !email.includes('@')} onClick={() => void act(() => sendMagicLink(email))}>
          Receber link de acesso
        </button>
      </div>
      <p className="hint mt-2 text-[0.95rem]">Esqueceu a senha? Informe o e-mail e peça o link de acesso.</p>
    </>
  );
}

export function SettingsPage() {
  const data = useUserData();
  const meta = useStoreMeta();
  const sync = useSync();
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ data: UserData; ignored: number; kind: string; name: string } | null>(null);

  function exportAll() {
    const ok = downloadText(`jornada-da-virtude-${today()}.json`, JSON.stringify(buildExport(data), null, 2), 'application/json');
    toast(ok ? 'Arquivo de exportação gerado com todos os seus dados.' : 'Não foi possível gerar o arquivo neste navegador.', ok ? 'ok' : 'erro');
  }

  async function readFile(file: File | undefined) {
    if (fileInput.current) fileInput.current.value = '';
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) return toast('O arquivo é grande demais para ser uma exportação da Jornada da Virtude.', 'erro');
    try {
      const parsed = parseImport(await file.text());
      if (isEmptyData(parsed.data)) return toast('O arquivo não contém jornadas nem registros.', 'erro');
      setPending({ ...parsed, name: file.name });
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível ler o arquivo.', 'erro');
    }
  }

  function confirmImport() {
    if (!pending) return;
    const saved = store.commit(pending.data);
    setPending(null);
    toast(saved ? 'Dados importados. Eles substituíram os que estavam neste aparelho.' : 'Os dados foram carregados, mas o navegador não permitiu gravá-los.', saved ? 'ok' : 'erro');
  }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Configurações' }]} title="Configurações e dados" lede="Você controla seus registros: onde ficam, como exportar e como excluir." />

      <Section title="Onde seus dados ficam">
        <BulletList
          items={[
            'Neste navegador: jornadas, diário, revisões e sessões do Conselho ficam no armazenamento local deste aparelho. Ninguém mais tem acesso a eles.',
            sync.user
              ? `Na nuvem: como você entrou com ${sync.user.email}, uma cópia fica no banco de dados da plataforma (Supabase, região de São Paulo), protegida por regras que só permitem o acesso da sua própria conta.`
              : 'Na nuvem: nada é enviado enquanto você não criar ou entrar em uma conta. A conta é opcional.',
            'Inteligência artificial: nenhuma informação sua é enviada a serviços de IA. O Conselho usa apenas a base de conhecimento da plataforma.',
            'Limitação: limpar os dados do navegador ou trocar de aparelho apaga a cópia local. Exporte um arquivo de tempos em tempos ou use a conta.',
          ]}
        />
        {!store.persistent() && <Notice title="Gravação indisponível">Este navegador está bloqueando o armazenamento local (modo privado, por exemplo). O que você registrar vale só enquanto esta página estiver aberta.</Notice>}
        <p className="mt-3">Agora neste aparelho: {summary(data)}.</p>
        {meta.legacyMigrated && <p className="hint">Inclui os dados trazidos automaticamente da versão anterior do aplicativo.</p>}
      </Section>

      <Section title="Conta e sincronização">
        <Account />
      </Section>

      <Section title="Exportar e importar">
        <p className="mb-3">O arquivo exportado contém todos os seus dados em formato aberto (JSON) e serve como cópia de segurança ou para levar a outro aparelho. A importação aceita também arquivos da versão anterior.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn" onClick={exportAll}>
            Exportar meus dados
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => fileInput.current?.click()}>
            Importar arquivo
          </button>
          <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={(e) => void readFile(e.target.files?.[0])} />
        </div>
        {pending && (
          <Notice title="Confirmar importação">
            <p>
              “{pending.name}” ({pending.kind === 'legado' ? 'formato da versão anterior' : 'formato atual'}) contém {summary(pending.data)}.
              {pending.ignored > 0 && ` ${plural(pending.ignored, 'item foi ignorado', 'itens foram ignorados')} por formato inválido.`}
            </p>
            <p className="mt-1">Importar <strong>substitui</strong> os dados deste aparelho ({summary(data)}).</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn btn-sm" onClick={confirmImport}>
                Substituir meus dados
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPending(null)}>
                Cancelar
              </button>
            </div>
          </Notice>
        )}
      </Section>

      <Section title="Excluir dados">
        <p className="mb-3">Apaga todas as jornadas, registros, revisões e sessões deste aparelho. Não há como desfazer: exporte antes, se quiser guardar uma cópia.</p>
        <ConfirmButton
          label="Apagar os dados deste aparelho"
          confirmLabel="Confirmar: apagar tudo deste aparelho"
          onConfirm={() => {
            store.clear();
            toast('Os dados deste aparelho foram apagados.');
          }}
        />
        {sync.user && <p className="hint mt-2 text-[0.95rem]">Você está conectado: para remover também a cópia da nuvem, use “Apagar meus dados da nuvem” acima, antes de apagar os dados locais.</p>}
      </Section>

      <Section title="Sobre">
        <p>
          Jornada da Virtude 2.0 · <Link to="/sobre">Fundamentos, limites e referências</Link>
        </p>
      </Section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: 'Sobre' }]} title="Fundamentos e limites" lede="Conhecer a virtude é o começo. Compreendê-la é aprofundar o caminho. Praticá-la é incorporá-la à vida." />

      <Section title="O que é">
        <p>
          A Jornada da Virtude é uma plataforma de desenvolvimento humano e formação filosófica. Ajuda a conhecer as virtudes, reconhecer desafios e desenvolver hábitos coerentes com os próprios valores. Não oferece fórmulas de felicidade, não classifica pessoas e não mede superioridade moral.
        </p>
        <p className="meta mt-3">
          Base de conhecimento desta versão: {dimensions.length} dimensões · {virtues.length} virtudes · {councilMembers.length} integrantes do Conselho · {exercises.length} exercícios
        </p>
      </Section>

      <Section title="Princípios">
        <BulletList
          items={[
            'Autonomia: você escolhe a virtude, o ritmo, os exercícios e quando pausar ou concluir.',
            'Não julgamento: a plataforma não classifica ninguém como virtuoso ou não virtuoso. Falhas são oportunidades de aprendizado.',
            'Sem notas morais: os indicadores mostram atividades registradas, nunca o valor de uma pessoa.',
            'A ausência de registros não significa ausência de prática ou de desenvolvimento.',
            'Pluralidade: perspectivas de tradições diferentes são apresentadas sem falsas equivalências.',
            'Concluir uma jornada encerra um ciclo; não significa dominar definitivamente uma virtude.',
            'Privacidade: os registros pessoais são seus.',
          ]}
        />
      </Section>

      <Section title="Natureza dos conceitos">
        <p className="mb-2">
          As sete dimensões seguem a concepção septenária do ser humano apresentada em conteúdos filosóficos da Nova Acrópole e relacionada a tradições do Oriente. É uma representação filosófica e espiritual, não uma classificação científica consensual.
        </p>
        <BulletList
          items={[
            'As sete dimensões não são órgãos nem estruturas físicas.',
            'A dimensão vital não é uma grandeza energética mensurável.',
            'A dimensão emocional não é uma teoria psicológica completa.',
            'A mente pura não é uma capacidade cientificamente mensurada.',
            'A intuição não se confunde com palpites ou certezas subjetivas.',
            'A vontade não é simples força de vontade ou motivação momentânea.',
            'A associação entre virtudes e dimensões é uma proposta pedagógica, não uma correspondência exclusiva estabelecida pela tradição.',
          ]}
        />
      </Section>

      <Section title="Três níveis de conteúdo">
        <BulletList
          items={[
            'Fundamentação: o que está documentado nas referências filosóficas.',
            'Interpretação: a explicação adotada pela Jornada para tornar os conceitos compreensíveis.',
            'Aplicação: exercícios, perguntas e experiências desenvolvidos para a plataforma.',
          ]}
        />
        <p className="mt-3">
          Todo o conteúdo conceitual desta versão está no estado <Tag>Proposta · aguarda revisão</Tag>: são associações iniciais vindas dos documentos do projeto, ainda não validadas por curadoria. A classificação do tipo de relação entre pensadores e virtudes só aparece onde foi documentada.
        </p>
      </Section>

      <Section title="O Conselho de Sabedoria">
        <BulletList
          items={[
            'Não é uma simulação de personalidades históricas: é uma ferramenta interpretativa baseada em ideias documentadas.',
            'Não atribui falas nem citações: as perguntas são formulações pedagógicas, identificadas como tal.',
            'Cada perspectiva tem limites declarados e fontes indicadas quando existem.',
            'Não diagnostica, não decide por você e não substitui assistência médica, psicológica, jurídica ou profissional.',
            'Nesta versão não há inteligência artificial: a seleção usa apenas as relações registradas na base de conhecimento.',
          ]}
        />
      </Section>

      <Section title="Referências">
        <p className="label mb-1">Sete dimensões</p>
        <BulletList
          items={[
            'Nova Acrópole Brasil. As Sete Dimensões do Ser Humano (notícia institucional, Ribeirão Preto).',
            'Nova Acrópole Portugal. Matemática para Filósofos, n.º 8, abril de 2021.',
            'Nova Acrópole Portugal. Pandava: A Sabedoria da Índia, n.º 11, abril de 2022.',
            'Nova Acrópole. Programa de Estudos.',
          ]}
        />
        <p className="label mb-1 mt-4">Virtudes e Conselho</p>
        <p>
          Aristóteles, Ética a Nicômaco · Platão, A República e Protágoras · Epicteto, Manual · Sêneca, Cartas a Lucílio · Marco Aurélio, Meditações · Confúcio, Analectos · Lao-Tsé, Tao Te Ching · Bhagavad Gita · textos budistas sobre as Paramitas · Tomás de Aquino, Suma Teológica · Kant, Fundamentação da Metafísica dos Costumes · Locke, Carta sobre a Tolerância · Mill, Sobre a Liberdade · Rawls, Uma Teoria da Justiça · Fromm, A Arte de Amar · Frankl, Em Busca de Sentido · Kahneman, Rápido e Devagar · Meadows, Pensando em Sistemas · Taleb, Antifrágil.
        </p>
        <p className="hint mt-3">Esta plataforma é um projeto independente que adota essas referências. Não é um canal oficial das instituições e autores citados.</p>
      </Section>
    </>
  );
}
