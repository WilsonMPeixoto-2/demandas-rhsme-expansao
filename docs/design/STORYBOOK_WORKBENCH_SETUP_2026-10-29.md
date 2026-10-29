# Storybook · bancada visual de componentes do Fluxo CTRH

**Proposta autorizada para instalação:** 29/10/2026.  
**Estado:** instalação por job isolado, com homologação em PR específico. Nenhuma nova arte ou UI de produção autorizada.

## Escolha técnica
Instalar Storybook 10.6 para React 19 + Vite 8 + TypeScript 6 + Node 24, com documentação e acessibilidade. Evitar integração automática adicional com Vitest, pois já há Vitest 5 e Playwright 1.64.1 no repositório e não há ganho imediato em duplicar o executor de testes.

**Motivação:** ateliê isolado para observar variantes dos quatro ícones e estados da sidebar (expandida/recolhida/mobile) antes de aprovar alterações no produto.

## Processo
- Executar o gerador oficial com `npm create storybook@10.6 -- --type react --yes --features docs a11y --package-manager npm --disable-telemetry --no-dev`.
- Instalar dependências com npm e atualizar corretamente `package-lock.json`.
- Executar `npm ci`, `npm run build-storybook`, `npm run lint`, `npm run build` e `npm run test:coverage` no mesmo SHA da geração.
- CI completa do projeto deve ser aprovada posteriormente, incluindo browser E2E.

## Exclusões
Não modificar `src/components` nem a imagem aprovada dos Arcos da Lapa, marca, quatro rotas, acessibilidade operacional ou Supabase. Arquivos de exemplo do Storybook não constituem aprovação para substituir o layout; uma história real da sidebar deverá ser produzida e homologada numa etapa própria.

## Riscos e rollback
O gerador altera dependências de desenvolvimento, npm lockfile e arquivos de configuração. Revisar pares npm, size do build, Vite e TypeScript. Rollback: reverter este PR (o ambiente publicado permanece inalterado até merge e deploy autorizado).
