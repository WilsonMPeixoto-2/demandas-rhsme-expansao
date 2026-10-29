---
name: impeccable-frontend-design
description: "Orquestra direção de arte, repertório profissional, iconografia calibrada e auditoria visual para criar, melhorar ou revisar interfaces web, React, HTML, CSS, design systems e componentes. Use sempre que a tarefa envolver aparência, layout, tipografia, cores, ícones, UX ou acessibilidade visual. Trabalhe com o produto real e valide renderizações antes da publicação."
---

# Impeccable Frontend Design & Visual Architecture

Skill **coordenadora**, permanente e reutilizável. Não substitui as skills originais, nem concede autorização para modificar decisões de produto.

**Princípio central:** design excepcional é demonstrado por uma melhoria visual observável, fiel ao contexto e reproduzível no código, não pelo número de bibliotecas instaladas ou pela sofisticação do discurso.

## Quando usar

- Construção, revisão ou refinamento de interfaces (React, Vite, Next.js, HTML/CSS).
- Layouts, sidebar, headers, tabelas, dashboards, filtros, formulários, modais e páginas.
- Sistemas de design, componentes reutilizáveis, tokens, tipografia e iconografia.
- Auditoria de usabilidade, acessibilidade, interação, estados e renderização.
- Prototipagem visual e comparação de alternativas antes da integração.

Não acionar para tarefas apenas de backend, SQL, regras de negócio ou documentos sem componente visual.

## 0. Hierarquia de autoridade e escopo

1. **Briefing, referência aprovada e identidade real do produto:** preservar os aspectos aprovados. Refinamento não equivale a redesign.
2. **Código e telas atuais:** inspecionar componentes, tokens, assets, rotas, estados e permissões. Usar captura real autenticada ou modo de demonstração claramente identificado.
3. **Governança local:** obedecer a `AGENTS.md`, decisões registradas, critérios de aceite e permissões. Nenhuma skill autoriza mudanças silenciosas em produção.
4. **Skills abaixo:** atuarão em papéis diferentes; se discordarem, priorizar briefing, semântica, acessibilidade e renderização verificada.
5. **Experimentos:** isolar as alternativas. Não reinventar componentes fora do escopo nem instalar várias bibliotecas por tentativa.

A arquitetura visual do produto deve ter continuidade. Descrever algo como “premium” não é evidência de qualidade.

## 1. Responsabilidades dos recursos

### Direção de arte: Anthropic Frontend Design

Se disponível, ler `../frontend-design/SKILL.md` e aplicar seus princípios.

- Derivar a estética do domínio, dos usuários e das tarefas reais.
- Definir direção compacta de cor, tipografia, densidade, composição e um único foco expressivo quando pertinente.
- Criticar clichês de IA: painéis genéricos, chips excessivos, cards dentro de cards, números decorativos e efeitos sem propósito.
- Evitar redesenhar imagem, marca ou fotografia aprovada apenas para produzir outra variante.

### Repertório e critérios: UI/UX Pro Max

Se disponível, ler `../ui-ux-pro-max/SKILL.md` e consultar a base real antes de escolher padrões:

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "navigation icons sidebar" --domain icons
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "administrative dashboard navigation" --domain ux
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "react accessible interaction" --stack react
```

A pesquisa informa opções e seus riscos; não impõe uma paleta ou biblioteca.

### Crítica e acabamento: Impeccable

Se disponível, ler `../impeccable/SKILL.md` e os respectivos roteiros. Distribuir operações por necessidade:

- `critique`: examinar hierarquia, composição, semântica e clareza;
- `distill`: retirar ruído, redundância e molduras desnecessárias;
- `polish`: corrigir precisão de espaçamento, alinhamento, bordas e microinterações;
- `typeset`: calibrar hierarquia tipográfica e ritmo de leitura;
- `quieter` / `bolder`: dosar expressividade conforme a função da área;
- `audit`: avaliar acessibilidade, responsividade, estados e defeitos verificáveis.

O launcher oficial, quando instalado, pode ser `.agents/skills/impeccable/scripts/impeccable`; seguir **o SKILL.md local**, não assumir que `npx impeccable install` corresponde à versão adotada. Não habilitar hooks ou baixar executáveis sem verificar o contexto, a integridade e a política do ambiente.

### Auditoria complementar: Vercel Web Interface Guidelines

Se disponível, ler `../web-design-guidelines/SKILL.md` e consultar as diretrizes atuais do fornecedor. Verificar:

- foco visível no teclado; navegação sem mouse; rótulos e nomes acessíveis;
- texto legível, truncamento intencional e números tabulares quando útil;
- estados carregando, vazio, sucesso, erro, desabilitado e selecionado;
- responsividade, sem overflow acidental nem objetivos de toque inadequados;
- `prefers-reduced-motion`, contraste WCAG e semântica HTML.

Esses testes podem provar problemas ou ausência deles. Não equivalem a uma avaliação artística.

### Apple Human Interface Guidelines

Consultar a fonte oficial em https://developer.apple.com/design/human-interface-guidelines/ como **referência**, sem copiar identidade Apple. Aplicar hierarquia clara, contraste, feedback, consistência e superfícies equilibradas. Transparência, blur e materiais fluidos são opcionais: adotar somente se melhorarem o contexto real e **nunca** reduzirem a legibilidade.

## 2. Iconografia e tamanho óptico

Não pedir a geradores que inventem uma interface inteira esperando que seus ícones saiam excelentes por acaso.

1. Identificar precisamente **quais destinos ou ações** exigem ícones, sem ampliar o escopo.
2. Buscar ícones **reais e licenciados** de famílias profissionais (Phosphor, Tabler, Iconoir e, quando licenciado, Streamline). Verificar a edição/estilo/variante exatos e seu SVG de origem.
3. Montar uma **prancha comparativa** quando a família ainda não estiver escolhida. Preferir três famílias coerentes, mostrando cada símbolo em **16, 20 e 24 px** ou nos tamanhos efetivos da interface, com estado normal, ativo e desabilitado **quando existir**.
4. Avaliar significado sem rótulo, peso visual, contraste, margem interna, stroke, raio, complexidade, centro óptico e fidelidade aos ícones vizinhos.
5. Aplicar compensação por forma somente após observar os SVGs: círculos vazados **podem** exigir ajuste positivo, formas densas **podem** exigir redução e formas assimétricas **podem** exigir deslocamento vertical. `scale(1.05)`, `scale(.95)` ou `translateY(-.5px)` são **pontos de partida experimentais**, nunca regras universais.
6. Testar os símbolos **na composição real**, não apenas em cartela ampliada. Selecionar uma única família de produção e evitar instalações concorrentes.

Bibliotecas profissionais fornecem acabamento gráfico, mas a decisão semântica e a curadoria são responsabilidades do designer.

## 3. Fluxo obrigatório de design com evidências

### Etapa A. Leitura do produto

- Conferir arquivos do componente, estilos efetivos, assets e regras de negócio.
- Recuperar o arquivo original de qualquer imagem ou símbolo aprovado.
- Registrar o que será preservado, o que pode mudar e o que **não** está em escopo.
- Se não houver screenshot autenticada, declarar a limitação. Não chamar uma reconstrução de captura real.

### Etapa B. Exploração delimitada

- Estudar **um componente ou decisão visual por vez**.
- Preparar alternativas com diferenças explícitas e deliberadas, mantendo inalteradas as variáveis não estudadas.
- Aplicar tokens coerentes em `tokens.css` ou CSS Custom Properties existentes. Não adotar Style Dictionary sem benefício concreto.
- Utilizar Figma MCP, Storybook ou workbench isolado quando disponíveis; não exigir a instalação de todos.
- Respeitar tipografia, estrutura e voz do produto já homologados.

### Etapa C. Renderização e autocrítica multimodal

- Abrir no navegador (Chromium/Playwright) e obter **capturas verdadeiras** em escala de uso.
- Comparar base e proposta lado a lado nos **mesmos estados e dimensões**.
- Conferir overflow, alinhamento, responsividade, contraste, espaçamento, peso dos ícones e legibilidade sobre imagens.
- Medir contraste de cada par texto/fundo e verificar WCAG AA relevante. Opacidade de imagens ornamentais (`6%–11%` em alguns estudos) é hipótese, não norma: testar sobre o fundo real.
- Corrigir problemas observados e inspecionar novamente; testes de screenshot identificam regressão, mas não definem o que é bonito.
- Preferir estados reais de hover, foco, ativo, recolhido, responsivo, reduzido e erro conforme o componente.

### Etapa D. Aprovação e implementação

- Mostrar **imagens e/ou preview navegável**, com referência original e proposta verificável.
- Obter aprovação explícita quando o trabalho envolve mudança visual subjetiva.
- Só integrar a variante aprovada, sem efeitos colaterais em outras páginas.
- Executar verificações disponíveis: lint, unitários, acessibilidade, build e Playwright; comparar o browser renderizado em Preview.
- Publicação em Production apenas com autorização e gates do repositório concluídos; manter rollback viável.

## 4. Memória durável e reutilização

Cada projeto deve ter documentação própria das escolhas já aprovadas:

- `PRODUCT.md` ou documento operacional **existente**: objetivo, públicos, tarefas, semântica e limites (não criar duplicação contraditória);
- `DESIGN.md` e/ou tokens locais: cores, tipografia, raio, componentes, referências visuais e decisões consolidadas;
- capturas reais, versões, diffs e parâmetros de renderização;
- indicação de onde vivem as skills originais, quando instaladas.

Este arquivo é portátil. Pode ser instalado em cada repositório em `.agents/skills/impeccable-frontend-design/SKILL.md`. Ele não instala automaticamente os recursos citados e não se transforma sozinho em regra global da conta. Para aplicação automática por agentes, vincular seu uso no `AGENTS.md` ou configuração de agente compatível de cada projeto.

## 5. Barreiras contra falsa conclusão

- Compilar, passar na CI e ter licença regular **não** significam aprovação estética.
- **Não** prometer fidelidade ao produto se o agente apenas gerou um mockup imaginário.
- Não reproduzir logos por aproximação nem inventar endossos governamentais.
- Não adicionar `font-size`, `opacity`, `scale`, bordas ou sombras por regra fixa quando o componente real precisa de outro equilíbrio.
- Não instalar Phosphor, Tabler e Iconoir simultaneamente em produção para experimentação.
- Não usar “Canvas” como pré-requisito: preferir navegador/Preview, Figma ou workbench.
- Não alterar rotas, permissões, regras, métricas, nomes oficiais ou campos sem decisão de produto.
- Não encerrar um trabalho visual apenas com relatório textual: entregar **prova visual**.
