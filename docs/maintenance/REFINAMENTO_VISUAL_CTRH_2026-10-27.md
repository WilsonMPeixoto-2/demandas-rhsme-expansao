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
