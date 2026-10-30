# Protocolo permanente de evolução visual e testes — Fluxo CTRH

**Natureza:** regra de processo e qualidade para toda mudança de UI no CTRH, não apenas para a barra lateral. Complementa `AGENTS.md` e o plugin pessoal **Visual Quality**. Não autoriza redesenhos, alterações funcionais ou publicação sem homologação.

## Decisões de produto consolidadas

- Prioridade de uso: **notebooks corporativos de 15 polegadas e monitores de 21 a 24 polegadas**, com funcionamento também em monitores grandes, inclusive 32 polegadas/4K. A largura física ou o rótulo 4K não determina os pixels CSS disponíveis: considerar janela, zoom do navegador e escala do sistema.
- Mobile mantém a solução atual de **menu retrátil**, considerada satisfatória; exigir acesso e ausência de falhas básicas, sem inflar o escopo com um redesenho móvel. Não sacrificar as telas de trabalho por estética de celular.
- A qualidade de logotipos e ícones deve ser apropriada à densidade do dispositivo: **vetores quando aplicáveis, imagens nítidas e otimizadas**, preservando arquivos aprovados. Alta resolução de asset não exige aumento do espaço ocupado por um componente.
- A interface e o usuário determinam os requisitos. Testes são instrumentos de verificação, **não autoridades para congelar DOM, classes ou design antigos**.
- **A aprovação estética final é do responsável pelo produto.** Agentes devem diagnosticar defeitos objetivos e preparar evidência visual fiel e comparável; CI verde não substitui homologação.

## Contrato de testes adaptável, sem perder rigor

Antes de alterar testes ou layout, classifique cada expectativa:

1. **Invariante funcional:** rotas, autorização, comandos, tabelas acessíveis, comportamento móvel aprovado, foco/teclado, sem perda de dados e sem transbordamento da página que impeça uso. Preservar em toda mudança não relacionada.
2. **Contrato de apresentação aprovado:** identidade, elementos visíveis, legibilidade, layout/estados homologados. Pode mudar mediante decisão explícita; atualizar seu teste junto com a implementação e a nova referência visual.
3. **Detalhe de implementação:** `className`, estrutura DOM, biblioteca SVG, posição rígida, seletor técnico ou texto antigo sem significado de negócio. Preferir consultas semânticas e teste do comportamento; atualizar seletores quando a mudança intencional os tornar obsoletos.
4. **Evidência diagnóstica:** screenshots, traces e logs. Não concluir aprovação visual porque a captura foi gerada ou porque testes passaram.

Toda reprovação deve ser classificada como **regressão real**, **teste desatualizado**, **ambiente/fixture diferente** ou **instabilidade não reproduzida**. Registrar diagnóstico com reprodução, arquivos/seletores, causa e ação. Atualizar um teste só quando o contrato de produto mudou ou sua implementação do teste está incorreta, nunca apenas para ocultar falhas. Não remover, pular, afrouxar assertivas ou regenerar baseline automaticamente para tornar CI verde. Identificar e eliminar execuções redundantes por configuração de projetos/viewport, sem reduzir cobertura de cenários.

## Barra lateral × área de trabalho e tabelas

- Uma mudança na barra lateral altera o espaço horizontal disponível para **outras telas**, inclusive **Todas as demandas**. **Não alterar a tabela só por ter alterado o menu.**
- Distinguir largura da página, largura útil do painel principal, largura mínima de uma tabela e sua região de rolagem. Se todas as colunas não couberem, avaliar **rolagem interna da tabela com ações acessíveis**, preservação de dados e ausência de overflow da página; não exigir encaixe simultâneo se não for requisito do produto.
- Em notebook, priorizar densidade e acessibilidade da carteira; avaliar sidebar compacta, retrátil ou outro layout somente com observação real. A altura do fundo colorido é uma decisão visual da navegação, **não precisa seguir a altura da tabela** se isso criar um bloco vazio sem função. Isso é hipótese de design, não regra para cortar o fundo em todas as páginas.
- Para mudanças específicas de layout, testar a transição desktop/compacto e a interação com a tabela antes de atribuir falhas ao componente alterado.

## Matriz de visualização por tarefa

A cobertura deve representar **área CSS real da janela**, não apenas polegadas ou pixels físicos. Mínimo recomendado para mudanças de layout com impacto geral:

| Viewport (px CSS) | Propósito | Prioridade |
| --- | --- | --- |
| 1280 × 800 | notebook corporativo / espaço restrito | Alta |
| 1366 × 768 | notebook 15″ típico | Alta |
| 1920 × 1080 | monitor 21–24″ comum | Alta |
| 2560 × 1440 ou 3840 × 2160 | monitor grande/4K; aplicar escala/zoom realista | Alta, quando renderização disponível |
| 320–390 px de largura | celular: menu retrátil e funções essenciais | Básica, sem redesenho |
| 768–960 px | limite de transição responsiva | Focada quando CSS/breakpoints forem afetados |

É permitido selecionar casos equivalentes em vez de multiplicar testes cegamente; registrar quais foram efetivamente executados. Validar também zoom de interface significativo, densidade de pixels para assets e contraste/foco quando pertinentes.

## Evidências e homologação visual

Toda alteração visual relevante deve entregar:

1. **Link direto do preview** e identificação de PR, branch, commit, viewport, dados/estado e ambiente; indicar quando há login.
2. **Antes e depois do mesmo componente/tela**, com mesma dimensão CSS, escala, conteúdo/estado e contexto sempre que possível. Identificar cada imagem, procedência e limitações.
3. **Capturas reais do navegador**, com Devtools, overlays de desenvolvimento, ponteiros e artefatos externos excluídos por configuração documentada. Nunca reconstruir uma captura com IA, alterar o design dentro dela ou apresentar mockup como se fosse preview real.
4. Estados relevantes (seleção, expandido/recolhido, hover/foco e mobile onde houver efeito), em especial em telas de maior uso.
5. **Relatório curto e causal:** defeito comprovado vs. suspeita vs. preferência estética; resultado dos testes, falhas, correções e pendências. A pessoa deve poder abrir o preview e avaliar a composição visual completa.
6. Comparações automáticas por screenshots podem proteger **versões já homologadas**. Criar ou substituir snapshots apenas após aceitação da nova composição; não usar baseline antigo para reprovar mudanças visuais expressamente aprovadas.

O Playwright do CTRH usa modo local de demonstração em muitos testes; essas capturas são úteis para CI, **mas não equivalem à tela do preview autenticado com dados reais**. Nunca inferir dados, identidade, composição ou estado real a partir delas.

## Aceite e fluxo permanente

1. Delimitar mudanças aprovadas e registrar a referência estética real.
2. Auditar o impacto cruzado antes de codificar e identificar quais testes descrevem comportamento, quais descrevem implementação anterior.
3. Construir no componente/branch, sincronizar ajustes legítimos de testes no mesmo PR, preservar invariantes e executar lint, build, E2E relevantes, acessibilidade e screenshots.
4. Classificar falhas, corrigir o produto quando existir defeito; corrigir o teste quando o **teste** estiver desatualizado; separar instabilidade ambiental.
5. Enviar URL do preview e evidências antes/depois confiáveis; **homologação artística pelo responsável**.
6. Somente após aprovação explícita, integrar à produção conforme a governança do projeto.

## Reutilização

Este documento é obrigatório para agentes que leem `AGENTS.md` neste repositório. Seus princípios **gerais** também devem constar do plugin pessoal Visual Quality para uso em outros sistemas; decisões particulares do CTRH (nomes, dimensões específicas e foco operacional) não devem ser impostas a produtos diferentes.
