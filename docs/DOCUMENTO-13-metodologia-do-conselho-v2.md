# JORNADA DA VIRTUDE
# DOCUMENTO OFICIAL 13 — METODOLOGIA DO CONSELHO DE SABEDORIA
## Versão 2.0 | Compatibilizada com o Catálogo de 34 Pensadores

**Status:** especificação metodológica consolidada para orientar produto, conteúdo e implementação.  
**Dependência de conteúdo:** Documento 12 — Catálogo de Pensadores, versão 2.0.  
**Princípio central:** o Conselho não pensa pelo indivíduo. Organiza perspectivas fundamentadas para que o indivíduo desenvolva sua própria capacidade de reflexão.

---

# 1. Finalidade

O Conselho de Sabedoria é um componente da Jornada da Virtude que ajuda o usuário a examinar situações humanas complexas por meio de perspectivas intelectuais distintas. Não é oráculo, terapeuta, juiz moral ou mecanismo de decisão automática.

O Conselho:
- interpreta a questão apresentada;
- identifica tensões e virtudes envolvidas;
- seleciona pensadores pertinentes do catálogo;
- recupera conceitos e fontes associados;
- constrói perspectivas individuais;
- compara convergências e divergências;
- oferece síntese aberta, perguntas e possibilidades de ação;
- preserva a autonomia do usuário.

# 2. Princípios inegociáveis

1. **Autonomia:** nenhuma recomendação substitui a decisão do usuário.
2. **Pluralidade:** apresentar diferenças reais, sem fabricar consenso.
3. **Rastreabilidade:** toda afirmação atribuída a um pensador deve apontar para fonte cadastrada.
4. **Contextualização:** ideias devem ser apresentadas em seu contexto histórico e cultural.
5. **Não anacronismo:** aplicação contemporânea não deve ser confundida com posição literal do autor.
6. **Não moralização:** o Conselho não classifica o usuário como bom, mau, virtuoso ou fracassado.
7. **Não patologização:** não diagnostica condições psicológicas ou médicas.
8. **Transparência:** distinguir fato, interpretação, inferência e sugestão.
9. **Segurança:** situações de risco exigem fluxos de segurança próprios, não deliberação filosófica comum.
10. **Revisabilidade:** seleção, conteúdo e síntese precisam ser auditáveis.

# 3. Universo de conhecimento

O Documento 12 mantém 34 integrantes. O catálogo é um universo de seleção, não uma assembleia convocada integralmente a cada interação.

A ficha de cada pensador deve conter:
- `thinker_id`;
- nome e variantes;
- tradição e campos;
- contexto histórico;
- obras/fontes;
- conceitos;
- virtudes relacionadas;
- perguntas orientadoras;
- aplicação pedagógica;
- limitações;
- referências e status de validação.

A curadoria deverá preservar a rastreabilidade de proveniência: 26 nomes recuperados da relação nominal do Documento 04, Hillel recuperado de relação curatorial anterior e sete nomes adicionados na reconstrução autorizada para completar o universo de 34.

# 4. Modelo de deliberação

Cada sessão seguirá nove etapas:

1. Recepção da situação.
2. Clarificação da questão central.
3. Identificação de contexto, envolvidos e restrições.
4. Mapeamento de tensões e virtudes.
5. Seleção dos pensadores.
6. Recuperação de fontes e conceitos.
7. Construção de perspectivas individuais.
8. Confrontação, convergências, divergências e síntese.
9. Perguntas finais, possibilidades de ação e registro da sessão.

O sistema pode retornar à etapa anterior quando detectar ambiguidade relevante. Não deve inventar contexto para preencher lacunas.

# 5. Recepção e interpretação da situação

A entrada pode ser texto livre, uma situação selecionada na Jornada ou uma reflexão registrada pelo usuário.

O analisador deverá extrair, quando disponíveis:
- questão central;
- contexto;
- pessoas ou grupos envolvidos;
- decisão em aberto;
- emoções declaradas;
- valores em conflito;
- consequências percebidas;
- restrições e riscos.

Não inferir dados sensíveis, intenções ocultas ou diagnósticos. Quando a informação ausente alterar materialmente a análise, fazer uma única pergunta de esclarecimento. Caso contrário, declarar a hipótese de trabalho.

# 6. Mapeamento de virtudes

O mapeamento parte da taxonomia oficial da Jornada, não de uma lista improvisada pelo modelo.

Para cada virtude sugerida, registrar:
- `virtue_id`;
- evidência textual que motivou a associação;
- papel na situação (central, secundária ou tensão);
- grau de confiança;
- virtudes em conflito ou complementaridade.

O sistema deve admitir que uma situação não tenha uma virtude dominante. Também deve distinguir virtude, habilidade, valor, emoção e resultado.

# 7. Seleção dos pensadores

## 7.1 Critérios e pesos iniciais

| Critério | Peso |
|---|---:|
| Pertinência à questão central | 30% |
| Relação fundamentada com virtudes | 25% |
| Disponibilidade e qualidade das fontes | 15% |
| Complementaridade das perspectivas | 15% |
| Diversidade intelectual/cultural pertinente | 10% |
| Adequação ao contexto | 5% |

Os pesos são parâmetros iniciais sujeitos a avaliação, não verdades científicas. A seleção deve ser determinística no MVP: mesma entrada, catálogo e versão de critérios devem produzir a mesma seleção.

## 7.2 Regras de seleção

- Selecionar de dois a cinco pensadores por sessão.
- Exigir pertinência mínima e fonte recuperável.
- Preferir perspectivas complementares, não apenas semelhantes.
- Incluir contraponto quando houver divergência relevante.
- Não convocar um pensador apenas por fama, nacionalidade ou tradição.
- Não usar diversidade como decoração: deve ampliar a análise da questão.
- Registrar pontuação, justificativa e versão do algoritmo.

## 7.3 Empate e fallback

Em caso de empate, aplicar ordem determinística:
1. maior pertinência à questão;
2. maior qualidade de fonte;
3. maior complementaridade;
4. ordem estável por `thinker_id`.

Se não houver fontes suficientes, o sistema deve informar a limitação e reduzir o número de perspectivas, em vez de improvisar.

# 8. Recuperação de conhecimento

A recuperação inicial será relacional e baseada em registros curados:
- pensador;
- obra;
- conceito;
- virtude;
- fonte;
- relação entre conceito e virtude;
- trecho ou resumo autorizado;
- referência bibliográfica.

RAG e embeddings podem ser introduzidos em etapa posterior, quando houver corpus confiável, direitos de uso definidos e avaliação de recuperação.

A recuperação deve retornar metadados de proveniência. Um texto sem fonte não pode sustentar atribuição autoral.

# 9. Construção das perspectivas individuais

Cada perspectiva deverá apresentar:

1. **Lente do pensador:** qual questão ele ajuda a enxergar.
2. **Conceito fundamentador:** ideia vinculada a obra ou fonte.
3. **Leitura da situação:** aplicação explicitamente identificada como interpretação.
4. **Pergunta desafiadora:** pergunta que amplia a reflexão.
5. **Limite:** o que essa lente não explica bem ou pode obscurecer.

A perspectiva deve ser redigida com clareza, sem imitar estilo literário do autor, inventar fala em primeira pessoa ou fabricar citações.

# 10. Confrontação entre perspectivas

O Conselho deverá apresentar:
- convergências;
- divergências;
- pressupostos incompatíveis;
- pontos cegos;
- perguntas que permanecem abertas.

A divergência não deve ser apagada por uma síntese artificial. Por exemplo, uma perspectiva centrada no dever pode divergir de uma perspectiva consequencialista; uma visão relacional pode questionar uma abordagem excessivamente individualista. O sistema deve explicar o motivo da diferença.

# 11. Síntese aberta

A síntese não é veredito. Deve conter:
- o que ficou mais claro;
- quais valores ou virtudes estão em tensão;
- quais perspectivas oferecem caminhos diferentes;
- quais consequências merecem atenção;
- quais perguntas permanecem;
- duas ou três possibilidades de ação, quando apropriado.

Evitar frases como “o Conselho decidiu”, “a resposta correta é” ou “você deve”. Preferir formulações como “uma possibilidade”, “esta perspectiva sugere” e “vale considerar”.

# 12. Perguntas e exercícios

O Conselho pode gerar:
- pergunta de autoconhecimento;
- exercício de observação;
- experimento comportamental pequeno;
- reflexão escrita;
- compromisso verificável;
- revisão posterior.

Exercícios devem ser proporcionais, seguros e reversíveis. Não sugerir confrontos, rupturas, exposição pública ou decisões irreversíveis com base apenas em uma sessão filosófica.

# 13. Segurança e limites de atuação

O Conselho não substitui profissionais de saúde, assistência social, direito ou outros especialistas. Não diagnostica, prescreve, faz avaliação de risco clínico ou determina conduta legal.

Em situações com indícios de violência, abuso, autolesão, risco iminente ou perigo a terceiros, interromper o fluxo filosófico comum e acionar o protocolo de segurança apropriado. A prioridade é proteção e acesso a ajuda adequada.

O sistema deve evitar:
- culpabilizar a pessoa por sofrimento ou violência sofrida;
- tratar adversidade como oportunidade obrigatória de crescimento;
- usar autoridade filosófica para pressionar decisões;
- apresentar tradição religiosa como obrigação para usuários;
- confundir autocontrole com tolerância a abuso.

# 14. Arquitetura funcional

Serviços lógicos sugeridos:

- `SituationAnalyzer`: estrutura a situação.
- `ContextClarifier`: identifica ambiguidades relevantes.
- `VirtueMapper`: relaciona situação e taxonomia.
- `ThinkerSelector`: seleciona integrantes de forma determinística.
- `KnowledgeRetriever`: recupera conceitos, obras e fontes.
- `PerspectiveBuilder`: constrói perspectivas individuais.
- `PerspectiveComparator`: identifica convergências e divergências.
- `CouncilSynthesizer`: produz síntese aberta.
- `ExerciseGenerator`: propõe exercícios e perguntas.
- `CouncilSessionManager`: persiste e retoma sessões.
- `SafetyRouter`: encaminha situações que exigem protocolo de segurança.

Os serviços devem ter contratos explícitos e ser testáveis de forma isolada. A camada de interface não deve conter regras de seleção ou lógica de domínio.

# 15. Contratos de dados conceituais

Entidades sugeridas para o domínio Conselho:

- `Thinker`
- `Tradition`
- `Work`
- `Concept`
- `KnowledgeSource`
- `ThinkerConcept`
- `ConceptVirtue`
- `CouncilCriterion`
- `CouncilSession`
- `CouncilSelection`
- `CouncilPerspective`
- `CouncilComparison`
- `CouncilSynthesis`
- `CouncilQuestion`
- `CouncilExercise`
- `CouncilReference`

Relacionamentos essenciais:
- um pensador pode estar associado a várias obras;
- uma obra pode sustentar vários conceitos;
- conceitos podem relacionar-se a várias virtudes;
- uma sessão seleciona de dois a cinco pensadores;
- cada perspectiva deve referenciar conceitos e fontes;
- síntese deve manter links para perspectivas que a fundamentam.

# 16. Compatibilidade com a arquitetura técnica da Jornada

A metodologia não impõe mudança de stack nem de persistência.

Preservar as decisões técnicas do Documento 08:
- React + Vite + TypeScript + Tailwind;
- arquitetura em camadas;
- abordagem local-first;
- IndexedDB para dados estruturados;
- localStorage para preferências;
- identidade local na versão inicial;
- exportação e recuperação de dados;
- domínio Conselho desacoplado do domínio Jornada.

A integração com IA deve ocorrer por adaptador (`AIProvider`) em ambiente seguro. Credenciais privadas nunca devem ser incluídas no bundle do frontend. A escolha entre Edge Function e backend dedicado exige ADR próprio.

Se houver evolução para persistência remota, autenticação, RLS e sincronização, isso deverá ser formalizado em decisão arquitetural e não presumido por este documento.

# 17. Estratégia de implementação

## Fase 1 — Catálogo e estrutura
- cadastrar os 34 pensadores;
- normalizar IDs, obras, conceitos e virtudes;
- registrar fontes e limitações;
- validar integridade referencial.

## Fase 2 — Motor determinístico
- implementar análise estruturada;
- mapear virtudes;
- calcular pontuação dos pensadores;
- registrar justificativas;
- testar repetibilidade.

## Fase 3 — Perspectivas e comparação
- recuperar conteúdo curado;
- gerar perspectivas com referências;
- comparar divergências;
- produzir síntese aberta.

## Fase 4 — Integração com a Jornada
- permitir convocação a partir de uma reflexão ou situação;
- vincular sessão a dimensões e virtudes;
- registrar exercícios e compromissos;
- permitir retomada e exportação.

## Fase 5 — Evolução assistida por IA
- introduzir recuperação semântica/RAG;
- avaliar qualidade e fidelidade;
- medir alucinações e citações sem fonte;
- manter fallback determinístico.

# 18. Requisitos de qualidade e testes

Testes mínimos:
1. Seleção retorna entre dois e cinco pensadores.
2. Mesma entrada e mesma versão produzem mesma seleção.
3. Pensador sem fonte válida não é usado para afirmação autoral.
4. Toda perspectiva contém conceito, fonte, aplicação e limite.
5. Divergências não desaparecem na síntese.
6. Nenhuma citação é inventada.
7. Falha do provedor de IA não corrompe a sessão.
8. Sessões podem ser retomadas.
9. Situações de risco são encaminhadas ao fluxo apropriado.
10. Conteúdo e referências são exportáveis.
11. O Conselho não altera automaticamente metas ou decisões do usuário.
12. A interface distingue conteúdo histórico de aplicação contemporânea.

# 19. Indicadores de avaliação

Avaliar qualidade, não obediência:
- pertinência percebida das perspectivas;
- diversidade efetiva de lentes;
- proporção de afirmações com fonte;
- taxa de referências verificáveis;
- incidência de atribuições incorretas;
- clareza das divergências;
- utilidade das perguntas;
- percepção de autonomia do usuário;
- taxa de conclusão e retomada de exercícios;
- falhas de segurança e encaminhamento.

Não usar como indicador de sucesso a concordância do usuário com a síntese.

# 20. Governança e versionamento

Toda alteração no catálogo, pesos ou regras de seleção deve registrar:
- versão;
- data;
- responsável;
- justificativa;
- impacto sobre sessões existentes;
- testes realizados.

Alterações no catálogo não devem reescrever silenciosamente sessões passadas. Cada sessão registra a versão do catálogo e do algoritmo utilizados.

# 21. Critérios de aceite do Documento 13

O documento será considerado implementável quando:
- os 34 integrantes estiverem cadastrados com IDs estáveis;
- a proveniência de cada integrante estiver registrada;
- as fontes mínimas estiverem disponíveis;
- a taxonomia de virtudes estiver vinculada por IDs;
- os critérios de seleção estiverem versionados;
- os contratos de dados estiverem definidos;
- os testes mínimos estiverem automatizados;
- os limites de segurança estiverem implementados.

**FIM DO DOCUMENTO OFICIAL 13 — VERSÃO 2.0**
