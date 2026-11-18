/* Renderiza o Markdown (GFM) das etapas com os estilos do app. Carregado sob demanda
 * (React.lazy) para não pesar o restante da plataforma. HTML cru no texto não é
 * interpretado: o react-markdown o exibe como texto, sem executar nada. */
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* O título da etapa é h3; os títulos do texto descem um nível (## vira h4, ### vira h5). */
const componentes: Components = {
  h2: ({ node: _node, ...props }) => <h4 {...props} />,
  h3: ({ node: _node, ...props }) => <h5 {...props} />,
  table: ({ node: _node, ...props }) => (
    <div className="gita-md-table" tabIndex={0} role="region" aria-label="Tabela (role para ver tudo)">
      <table {...props} />
    </div>
  ),
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="gita-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentes}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
