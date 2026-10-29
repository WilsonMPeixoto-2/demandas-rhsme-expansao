# Fluxo CTRH · Ateliê de revisão visual da barra lateral

**Escopo único:** navegação lateral implementada por `SiteNavigation.tsx` e `design-shell.css`.  
**Estado:** infraestrutura de verificação visual em revisão; **nenhuma substituição artística está aprovada**.

## Referência que não deve ser reinterpretada

- Preservar os três caminhos vetoriais do símbolo oficial implementado em `BrandLogo.tsx`, o nome **Fluxo CTRH**, e o endosso institucional `/prefeitura-rio-educacao.svg`.
- Preservar a composição com os Arcos da Lapa **do estudo escolhido pelo usuário**. Não regenerar o aqueduto, nem usar nova imagem aproximada em seu lugar.
- Quatro destinos, sem inventar outros: Radar de Governança, Todas as demandas, Minhas demandas e Administração (esta última somente com permissão).
- Preservar colapso da barra, estados ativos, acessibilidade e navegação móvel já implementados.

## Processo de produção: um componente de cada vez

1. **Referência verdadeira:** executar `npm run test:sidebar-visual` e abrir as capturas no relatório do Playwright; comparar as mesmas dimensões e estado de interação.
2. **Ateliê iconográfico:** selecionar uma única família profissional candidata para *os quatro ícones* e comparar com os quatro atuais. Avaliar desenho, equilíbrio óptico, peso, margens, clareza sem rótulos, percepção a 20/24/28 px e estados inativo/ativo/foco.
3. **Estudo aplicado:** integrar os quatro candidatos à composição original **sem substituir a marca, o texto, as cores ou a arte arquitetônica**. Não gerar uma interface inteira por imagem.
4. **Revisão visual em PR:** capturar barra expandida, recolhida e navegação móvel via Playwright; avaliar fidelidade com imagens lado a lado e conferir a interação por teclado.
5. **Aprovação:** somente depois do aceite visual explícito alterar a sidebar operacional. Em produção, não adicionar bibliotecas iconográficas de forma indiscriminada.

## Ferramentas e dependências já verificadas

- **Em uso:** React 19, Vite 8, Motion, Radix e Playwright.
- **Storybook:** candidato apropriado para um ateliê de componente independente, mas ausente das dependências atuais. Instalar apenas numa etapa própria, com `npm create storybook@latest` ou `@storybook/react-vite`, gerando e validando o `package-lock.json` e executando CI. Não inserir dependências apenas no `package.json`.
- **Figma:** conector disponível para organizar alternativas aprovadas em camadas e componentes editáveis.
- **Mobbin:** o conector exige plano pago; esta etapa não depende dele.
- **Phosphor / Tabler / Iconoir:** candidatos a curadoria, não decisões de instalação. Comparar quatro símbolos antes de escolher uma família.
- **Style Dictionary:** adiar. Consolidar primeiro os tokens locais da barra lateral e só adotar outro gerador se houver múltiplos consumidores.
- **Chromatic:** não instalar antes de termos histórias e capturas confiáveis.

## Evidência produzida por esta branch

`npm run test:sidebar-visual` utiliza o modo de demonstração local e anexa imagens PNG no teste Playwright em desktop e mobile.

Capturas esperadas:
- `sidebar-chromium-desktop-inicio`
- `sidebar-chromium-desktop-recolhida`
- `sidebar-chromium-desktop-carteira`
- `sidebar-chromium-mobile-inicio`
- `sidebar-chromium-mobile-carteira`

O workflow `sidebar-visual.yml` arquiva o relatório, inclusive capturas, como artifact de GitHub Actions. Esses arquivos documentam **fidelidade e regressão**, não julgam automaticamente a beleza da interface.

**Não incluído nesta branch:** nova arte dos Arcos da Lapa, alteração de componentes de produção, instalação de Storybook ou bibliotecas de ícones e publicação na Vercel.
