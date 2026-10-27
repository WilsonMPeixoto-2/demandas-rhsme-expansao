# Refinamento visual inicial do CTRH — 27/10/2026

Implementação de legibilidade, identidade visual e navegação do Radar. O pacote preserva
a logomarca, a fonte Inter e a paleta institucional; unifica tokens de status no CSS,
amplia legendas e indicadores, cria barras de status clicáveis com foco de teclado e
introduz leitura de cobertura operacional sem inventar dados.

O clique no status navega à carteira coletiva com filtro correspondente e zera
filtros antigos para que o resultado corresponda ao gráfico. O cabeçalho mostra
o contexto da rota aberta. Os indicadores de cobertura medem apenas presença
de providência/data e link oficial, sem significar desempenho ou atraso.

Não há mudanças no Supabase, migrations, RLS, autenticação, contratos de dados,
exclusões ou registros legados. Série temporal, novas bibliotecas gráficas e
saneamento do legado permanecem fora deste primeiro pacote.

Validar build, unit tests, Playwright e Preview antes de integrar à main.

## Segunda iteração: mudança visual perceptível
A primeira entrega foi considerada sutil demais para os objetivos. A segunda iteração mantém o PR
e adiciona um painel de panorama com gráfico circular proporcional ao estoque real e quatro
cartões operacionais clicáveis (providência da equipe, aguardando retorno, monitoramento
e encerramentos). O cabeçalho ganha iconografia e microações com hierarquia explícita.
Uma camada CSS específica cria layout, espaçamento, superfícies, responsividade
e interação visual, sem substituir a identidade aprovada.

A distribuição por categoria usa a semântica existente em `workSemantics.ts`.
A soma dos quatro grupos corresponde ao número de demandas carregadas; não há
percentuais ou datas fabricados. O número exibido representa o acervo retornado
pela consulta atual, cuja paginação remota está programada para correção separada.

Acessibilidade: controles são botões de verdade, com nome derivado do texto
visível, foco identificado e consideração por redução de movimento. A visualização
não depende exclusivamente de cores: cada categoria tem nome e quantidade.
