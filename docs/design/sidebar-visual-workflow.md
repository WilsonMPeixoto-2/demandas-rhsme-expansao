# Fluxo CTRH · Ateliê de revisão visual da barra lateral

**Escopo único:** navegação lateral implementada por `SiteNavigation.tsx` e `design-shell.css`.  
**Referência histórica de 29/10 e continuidade em 30/10:** as ferramentas de verificação e o Storybook estão integrados. O PR #215 contém a Opção 2 original do usuário, com quatro ícones lineares, brasão e Arcos originais; a alteração ainda depende dos gates e da homologação artística antes de produção. Para todo trabalho novo, aplicar `docs/design/PROTOCOLO_PERMANENTE_EVOLUCAO_VISUAL_CTRH.md` e as instruções vigentes de `AGENTS.md`.

## Referência que não deve ser reinterpretada

- Preservar os três caminhos vetoriais do símbolo oficial implementado em `BrandLogo.tsx`, o nome **Fluxo CTRH**, e o endosso institucional `/prefeitura-rio-educacao.svg`.
- Preservar a composição com os Arcos da Lapa **do estudo escolhido pelo usuário**. Não regenerar o aqueduto, nem usar nova imagem aproximada em seu lugar.
- Quatro destinos, sem inventar outros: Radar de Governança, Todas as demandas, Minhas demandas e Administração (esta última somente com permissão).
- Preservar colapso da barra, estados ativos, acessibilidade e navegação móvel já implementados.

## Processo de produção: um componente de cada vez

1. **Referência verdadeira:** fornecer o link do preview e identificar SHA, ambiente, viewport, dados e estado. As capturas de `npm run test:sidebar-visual` são **evidências do modo DEV/demonstração**, não uma reprodução comprovadamente fiel do preview autenticado. Comparar antes/depois equivalentes e evitar Devtools.
2. **Ateliê iconográfico:** selecionar uma única família profissional candidata para *os quatro ícones* e comparar com os quatro atuais. Avaliar desenho, equilíbrio óptico, peso, margens, clareza sem rótulos, percepção a 20/24/28 px e estados inativo/ativo/foco.
3. **Estudo aplicado:** integrar os quatro candidatos à composição original **sem substituir a marca, o texto, as cores ou a arte arquitetônica**. Não gerar uma interface inteira por imagem.
4. **Revisão visual em PR:** capturar barra expandida, recolhida e navegação móvel via Playwright; avaliar fidelidade com imagens lado a lado e conferir a interação por teclado.
5. **Aprovação e integração:** a proposta pode ser desenvolvida e validada no componente real em branch isolada e Preview antes do aceite artístico. Somente após homologação visual expressa e verificações aplicáveis ela pode ser integrada à produção. Em produção, não adicionar bibliotecas iconográficas de forma indiscriminada.

## Ferramentas e dependências já verificadas

- **Em uso:** React 19, Vite 8, Motion, Radix e Playwright.
- **Storybook:** já integrado pelo PR #213, exclusivamente como ferramenta de desenvolvimento. Histórias dos componentes reais disponíveis; conferir os comandos e a integração em `docs/design/STORYBOOK_CTRH_INTEGRACAO_REAL.md`. Não reinstalar sem necessidade.
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

O workflow `sidebar-visual.yml` arquiva o relatório, inclusive capturas, como artifact de GitHub Actions. Esses arquivos documentam estados técnicos, mas **não comprovam, por si só, fidelidade ao preview autenticado ou à composição aprovada**. A inspeção real e a decisão humana permanecem obrigatórias.

**Escopo do ateliê original (registro histórico):** não incluiu nova arte dos Arcos da Lapa, alteração de componentes operacionais, Storybook ou publicação do redesenho. O Storybook foi incorporado depois, no PR #213; o PR #215 é uma proposta visual independente ainda em revisão. O atlas antigo não comprova o desenho atual dos ícones; inspecionar o componente real `SiteNavigation.tsx` e sua história no Storybook.
