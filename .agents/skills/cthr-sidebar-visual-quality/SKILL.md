---
name: cthr-sidebar-visual-quality
description: Ateliê de revisão visual exclusivo da barra lateral do Fluxo CTRH: identidade institucional, arte dos Arcos da Lapa, quatro ícones vetoriais e comparação visual com Playwright.
---

# Fluxo CTRH · Qualidade visual da barra lateral

## Escopo e precedência
Aplicar apenas ao componente de navegação lateral do Fluxo CTRH / SME-RJ e aos artefatos de revisão desse componente. Todas as regras de `AGENTS.md` e decisões aprovadas do produto prevalecem. Isto é uma habilidade de análise e de produção sob autorização, **não** autorização de redesign, alteração de produção, deploy, merge ou instalação de pacotes.

## Identidade e elementos imutáveis
- Preservar a marca vetorial original implementada em `BrandLogo.tsx`, o nome **Fluxo CTRH** e a assinatura institucional da Secretaria Municipal de Educação.
- Preservar a **imagem dos Arcos da Lapa do estudo aprovado**, com transparência e composição originais; nunca substituí-la por uma representação genérica gerada por IA.
- Respeitar a direção editorial institucional carioca já escolhida. Evitar aplicar paletas, fontes, gradientes, Glassmorphism ou templates genéricos como se fossem uma nova aprovação.
- Preservar os quatro destinos existentes, sem inventar novos: **Radar de Governança**, **Todas as demandas**, **Minhas demandas** e **Administração** (somente com permissão).
- Preservar recolhimento da barra, seleção ativa, navegação por teclado, responsividade e estrutura de permissões.

## Etapas de trabalho
1. Inspecionar o código atual e a referência aprovada; não presumir que um mockup arbitrário é a referência.
2. Conferir se existe infraestrutura de snapshots na branch corrente; a branch de revisão visual foi proposta no PR #208. Não afirmar que está disponível na main antes de verificar o merge.
3. Criar **prancha comparativa somente dos quatro ícones**, utilizando uma família coerente por vez (Phosphor, Tabler ou Iconoir são candidatos). Comparar com os símbolos atuais em 20, 24 e 28 px, em estados ativo/inativo/foco.
4. Analisar peso óptico, margens internas, espessura de traço, significado sem rótulos, contraste, hierarquia e convivência com a imagem de fundo.
5. Revisar a barra expandida, recolhida e mobile com Playwright. Evidência visual precisa ser screenshot real, nunca imaginado.
6. Registrar comparação com a referência, limitações, acessibilidade e recomendações ordenadas por impacto. Distinguir alterações aprovadas de propostas novas.
7. Solicitar homologação visual antes de alterar o componente operacional; merge e produção precisam de autorização própria.

## Skills complementares
- `frontend-design`: repertório de composição, tipografia e identidade; seguir somente quando compatível com o design já aprovado.
- `web-design-guidelines`: avaliação de acessibilidade e UX; nunca confundir aprovação técnica com superioridade estética.
- `npx impeccable detect`: opção **não instalada** a avaliar em ambiente local isolado; requer execução explícita e revisão prévia de scripts.
- Figma: pode estruturar estudos visuais editáveis; não presumir arquivo de Figma sem chave real.
- Mobbin: consulta bloqueada por requisito de plano pago na verificação de 29/10/2026. Não afirmar que está conectado gratuitamente.
- Apple HIG: inspiração qualitativa para navegação e materiais, não especificação nativa obrigatória em uma aplicação React web.

## Gate de aceitação
Não concluir apenas porque CSS compilou. Incluir revisão lado a lado, screenshots reais, teste de teclado/foco, checagem de nomes acessíveis, contraste, `prefers-reduced-motion`, estados de ícones e ausência de regressão das quatro rotas. Se não houver execução de browser, declarar a limitação.
