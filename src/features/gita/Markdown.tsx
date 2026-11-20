/* Renderiza o Markdown (GFM) das etapas com os estilos do app. Carregado sob demanda
 * (React.lazy) para não pesar o restante da plataforma. HTML cru no texto não é
 * interpretado: o react-markdown o exibe como texto, sem executar nada. */
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { contarTabelas, menorNivelDeTitulo } from '../../domain/gita';

/** O título da etapa é h3. Os títulos do texto começam em h4: o menor nível do texto vira h4, o seguinte h5 e assim por diante,
 * sem pular nível (a ordem dos títulos precisa descer de um em um). */
function componentesDoTexto(menor: number, totalTabelas: number, rotulo: string): Components {
  const nivel = (n: number) => `h${Math.min(6, 4 + (n - menor))}` as 'h4' | 'h5' | 'h6';
  const titulo = (n: number): Components['h1'] => ({ node: _node, ...props }) => {
    const Tag = nivel(n);
    return <Tag {...props} />;
  };
  let indice = 0;
  return {
    h1: titulo(1),
    h2: titulo(2),
    h3: titulo(3),
    h4: titulo(4),
    h5: titulo(5),
    h6: titulo(6),
    table: ({ node: _node, ...props }) => {
      indice += 1;
      const nome = totalTabelas > 1 ? `Tabela ${indice} de ${totalTabelas}` : 'Tabela';
      return (
        <div className="gita-md-table" tabIndex={0} role="region" aria-label={`${nome}${rotulo ? ` · ${rotulo}` : ''} (role para ver tudo)`}>
          <table {...props} />
        </div>
      );
    },
  };
}

/** `rotulo` distingue as tabelas de etapas diferentes para leitores de tela (ex.: o nome da etapa). */
export default function Markdown({ children, rotulo = '' }: { children: string; rotulo?: string }) {
  const componentes = componentesDoTexto(menorNivelDeTitulo(children) ?? 2, contarTabelas(children), rotulo);
  return (
    <div className="gita-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentes}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
