# Evolução visual CTRH | Arquitetura de navegação e composição

## Diretriz estética
Continuar a identidade aprovada (Fluxo CTRH em Georgia e símbolo SVG original,
azul institucional, tipografia Inter e linguagem gráfica do panorama operacional).
Proibido introduzir logotipo alternativo ou componentes genéricos de aparência
incompatível. A nova camada 'design-shell.css' é aditiva e específica.

## Alterações
- Desktop: navegação vertical com marca original, quatro destinos, estados ativos,
  recolhimento acessível; persiste na rolagem. Nenhuma rota ou permissão alterada.
- Telas até 940px: navegação inferior adaptada a áreas seguras do dispositivo.
- Os cinco cartões KPI do cabeçalho permanecem completos no Radar; as demais
  telas ficam com cabeçalho mais compacto e ações globais preservadas.
- Gráfico por responsável saiu apenas da representação do Radar e passou para
  Administração com a mesma função de distribuição, legenda e cálculos.
- Qualidade dos dados, prazos e histórico recente permanecem no Radar, mas sob
  painéis de expansão sem perda de conteúdo e sem requisições novas ao banco.
- Todas as decisões de filtragem e navegação reutilizam a lógica em App.tsx.

## Critérios de aceite
- Preservação integral da marca e assinaturas originais.
- Testes de navegação, responsividade (desktop e celular), acessibilidade,
  filtros, ações globais e comportamento do navegador.
- Dados protegidos, sem edição de conteúdo no Supabase.
- Publicar apenas Preview até homologação visual e funcional do responsável.
