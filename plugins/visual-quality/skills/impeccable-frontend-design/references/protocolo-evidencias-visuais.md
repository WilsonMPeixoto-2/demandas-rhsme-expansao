# Protocolo geral de testes e homologação para evolução visual

Esta referência é **transversal a sistemas e projetos**. Em cada repositório, a referência aprovada, o contexto dos usuários e o `AGENTS.md` local determinam prioridades específicas. Não impor os nomes, pixels ou decisões do CTRH a outros produtos.

## Separar contrato de produto de implementação anterior

- **Requisitos invariantes:** funções, autorização, rotas, acessibilidade, informação íntegra, comandos utilizáveis, teclado/foco e ausência de layout quebrado. Não flexibilizar para fazer um PR passar.
- **Mudança visual aprovada:** composições, ícones, marcas, hierarquia e layout podem evoluir. Atualizar expectativas legítimas e baselines no PR correspondente **depois de registrada a mudança intencional**.
- **Teste acoplado indevidamente:** não usar um seletor CSS, classe, estrutura de DOM, nome interno do componente, SVG exato ou localização de pixel como substituto de comportamento sem razão documental. Preferir papéis acessíveis, comandos e efeitos observáveis.
- **Logs/screenshots:** são evidências, não aprovação artística automática.

Para toda falha: classificar entre **regressão real**, **teste desatualizado**, **condição de ambiente/fixture**, **flakiness**. Localizar assertiva e requisito, reproduzir, buscar causa e sugerir correção mínima no produto ou no teste conforme o contrato aprovado. Documentar motivo de cada ajuste em teste. Não pular testes, baixar expectativas indiscriminadamente, regenerar snapshots cegamente ou deduplicar eliminando cobertura.

## Tela, resolução e uso real

Planejar viewports em **pixels CSS**, incluindo desktop pequeno/médio, monitores grandes e breakpoints reais; adequar cobertura ao perfil do usuário do sistema. Medidas físicas (15″, 24″, 32″) e resolução física (1080p/4K) não equivalem diretamente à área CSS; considerar zoom, dimensionamento do sistema e densidade de pixels. Preferir SVG apropriado e assets responsivos de boa definição sem exigir maiores dimensões de layout.

Se uma área lateral reduzir espaço para tabela, analisar a geometria e o comportamento da tabela separadamente: rolagem interna pode ser correta; o critério é que dados e ações permaneçam acessíveis e a página inteira não apresente overflow prejudicial. Não criar uma refatoração lateral de conteúdo como consequência automática de um redesenho.

## Evidência visual inequívoca

Sempre que relevante:
1. Compartilhar **URL de preview real**, SHA, branch, viewport, zoom/escala, estado e origem dos dados.
2. Fornecer **antes/depois capturados em navegador real** nos mesmos parâmetros, quando possível; evitar mockups sem identificação e não apresentar capturas de DEV como espelho fiel do preview.
3. Excluir overlays/Devtools via configuração da captura; não alterar imagem original para aparentar fidelidade.
4. Distinguir verificação técnica objetiva de julgamento estético; **responsável do produto aprova visualmente**.
5. Usar snapshots `toHaveScreenshot()` para preservar **composição já aprovada** e não para vetar toda proposta que mude intencionalmente uma imagem.
6. Inspecionar estados reais, legibilidade, alinhamentos, menu, navegação, contraste, overflow, tipografia, focalização e assets, sem confundir CI verde com qualidade visual.

## Priorizar uso e reduzir ruído

A matriz deve refletir usuários reais do produto. Não transformar a versão móvel em projeto paralelo quando já estiver adequada e pouco usada, sem prejuízo da usabilidade mínima. Não fabricar dezenas de testes redundantes; cada teste deve ter comportamento significativo e uma falha compreensível. Evitar capturas repetitivas, ilustrações inventadas ou análises que não identifiquem causa e correção.

## Fluxo obrigatório

Decisão de produto → delimitação do componente → atualização do contrato de teste quando necessário → implementação isolada → testes de comportamento e evidência visual → classificar falhas → preview real e antes/depois → aceite visual humano → merge/publicação autorizados.

Revisão somente leitura e sem conflito quando outro agente estiver alterando a mesma branch.
