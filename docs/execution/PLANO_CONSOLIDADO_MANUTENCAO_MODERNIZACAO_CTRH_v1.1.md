# Plano Consolidado de Manutenção e Modernização — CTRH v1.1

**Data:** 30 de agosto de 2026  
**Status:** VIGENTE como plano técnico complementar; não autoriza automaticamente nenhuma implementação  
**Linha de base técnica da rodada:** `eb741e173231d891492314d975d9ea447c045acd`  
**Publicação em Production:** PR #169, SHA funcional `706570480288e60cf7070c3a4648fa6d37d9f8fb`, deployment `dpl_EqrEWJ4B9RVjSbbrSuuWNKe45YBN` em `READY`  
**Encerramento operacional:** PR #170, com `git.deploymentEnabled: false` restaurado

## 1. Finalidade

Organizar a manutenção técnica, a atualização de dependências e a adoção de capacidades modernas sem separar artificialmente esse trabalho das necessidades reais do produto.

Este plano complementa, sem substituir:

- o `Plano_Integrado_Reformulado_CTRH_v3.1.md`;
- o `Plano_Executivo_Operacao_Atual_CTRH_v1.2.md`;
- o Registro de Decisões;
- o Adendo de Governança;
- o Product Context;
- o Handoff vigente.

A presença de uma possibilidade neste documento não constitui autorização. Cada atualização, instalação, refatoração estrutural ou mudança funcional continua sujeita a análise, escopo explícito, branch própria, validação integral e autorização do responsável pelo produto.

## 2. Princípios

1. Manutenção técnica e evolução funcional devem servir ao produto e às pessoas que o utilizam.
2. Não se instala ou atualiza um pacote apenas porque existe versão mais recente.
3. Não se mantém uma solução limitada apenas para evitar avaliar uma tecnologia mais adequada.
4. Sempre que uma tarefa, erro, limitação, melhoria visual ou nova capacidade puder alcançar resultado materialmente melhor por meio de atualização, instalação ou ampliação tecnológica, essa alternativa deve ser apresentada ao responsável pelo produto.
5. A proposta tecnológica deve ser feita antes da implementação e explicar benefício, impacto, riscos, compatibilidade, segurança, esforço de testes e rollback.
6. Nenhum agente pode instalar silenciosamente uma dependência, alterar runtime ou introduzir nova arquitetura sem autorização expressa.
7. Mudanças com causas de falha, superfícies ou rollbacks distintos permanecem em PRs separados.
8. Nenhuma incompatibilidade será mascarada com `--force`, `--legacy-peer-deps`, relaxamento artificial de tipos ou supressão permanente de erro.
9. A solução deve preservar regras de negócio, segurança, RLS, dados, histórico, acessibilidade, responsividade e rastreabilidade, salvo decisão expressa em sentido diferente.
10. O ganho esperado deve ser proporcional ao custo de adoção e manutenção.

## 3. Critérios para propor modernização durante qualquer tarefa

Ao receber uma solicitação de correção, melhoria ou nova funcionalidade, o executor deve avaliar se a tecnologia atual:

- impede a solução definitiva;
- exige contornos frágeis ou duplicação excessiva;
- limita acessibilidade, responsividade, desempenho ou confiabilidade;
- dificulta testes, observabilidade, manutenção ou segurança;
- torna a implementação desproporcionalmente complexa;
- não oferece capacidade já madura e estável no ecossistema do projeto;
- produz experiência inferior à que poderia ser alcançada com atualização ou pacote especializado.

Quando uma dessas condições for material, a proposta deve conter:

1. problema concreto observado;
2. limite da abordagem atual;
3. pacote, atualização ou capacidade sugerida;
4. benefício funcional e técnico esperado;
5. alternativa sem nova dependência;
6. impacto no bundle e no runtime;
7. compatibilidade com React, TypeScript, Vite, Vitest, Playwright, Supabase e Node, conforme aplicável;
8. riscos de segurança, privacidade e dados;
9. estratégia de testes e homologação;
10. rollback;
11. recomendação técnica claramente identificada como recomendação;
12. necessidade de autorização expressa antes da implementação.

A proposta não deve interromper tarefas independentes que possam prosseguir com segurança. Somente o item materialmente afetado pelo limite tecnológico deve aguardar decisão.

## 4. Estado real das rodadas

### Rodada 0 — Governança e linha de base

O PR #115 foi criado sobre uma base anterior e permaneceu aberto enquanto as Rodadas 1, 2 e 3 foram executadas em PRs independentes. Seu conteúdo tornou-se temporalmente desatualizado antes do merge.

Este plano v1.1 substitui o plano proposto naquele PR. O PR #115 deve ser encerrado sem merge após a criação do PR substituto, preservando seu histórico como registro da preparação inicial.

### Rodada 1 — Mudanças seguras e reversíveis — CONCLUÍDA

| Unidade | Resultado | PR |
|---|---|---:|
| Ferramentas de desenvolvimento | Playwright 1.62.0, plugin React 6.0.4 e `globals` 17.8.0 | #117 |
| Supabase JavaScript | `@supabase/supabase-js` 2.110.9 | #118 |
| Recuperação localizada de erros | Error Boundaries globais e regionais | #119 |
| Estabilização de testes | fuso operacional e interação robusta com menu | #120 |
| Publicação | Production e restauração do bloqueio da Vercel | #121 e #122 |

### Rodada 2 — Configuração controlada — CONCLUÍDA

| Unidade | Resultado | PR |
|---|---|---:|
| Node | Node 24 definido pelo `package.json` como fonte única para CI | #125 |
| JSDOM | JSDOM 30.0.0 usado pelo Vitest | #124 |
| Supabase CLI | Action 2.1.1 e CLI 2.111.0 fixadas e verificadas | #126 |
| Knip | Knip 6.29.0 disponível em modo diagnóstico, sem autofix e fora do gate obrigatório | #123 |
| Publicação | Production e restauração do bloqueio da Vercel | #127 e #128 |

### Correção responsiva intermediária — CONCLUÍDA

A tabela de demandas foi adaptada à largura disponível, com uso de área ampla, rolagem superior sincronizada e coluna de ações fixa quando necessária. A correção foi integrada pelo PR #129, publicada pelo PR #130 e encerrada operacionalmente pelo PR #131.

### Rodada 3 — TanStack Query — CONCLUÍDA

A integração de `@tanstack/react-query` 5.101.4 foi concluída pelo PR #132 e publicada pelos PRs #133 e #134.

Resultado consolidado:

- `QueryClient` único na raiz da aplicação;
- cache separado por usuário;
- consultas simultâneas deduplicadas;
- mutations confirmadas pelo repositório;
- invalidação seletiva;
- eventos Realtime agrupados;
- limpeza de cache na troca de sessão;
- recuperação explícita após falha de conectividade;
- ausência deliberada de optimistic updates e retries automáticos;
- 365 testes unitários e de integração aprovados;
- build, bundle, auditoria e testes de navegador aprovados;
- Production em estado `READY`.

A arquitetura está detalhada em `docs/architecture/ARQUITETURA_TANSTACK_QUERY_CTRH_v1.0.md`.

## 5. Rodada 3.1 — Consolidação pós-TanStack Query

### Escopo documental

- substituir o plano temporalmente superado do PR #115;
- registrar a conclusão real das Rodadas 1, 2 e 3;
- instituir a política de manutenção e modernização proativa;
- atualizar o registro de oportunidades;
- documentar a arquitetura atual do TanStack Query;
- sincronizar `AGENTS.md`, Handoff e índice documental.

### Escopo técnico pequeno e reversível

- extrair o nome do evento `demandas:retry` para constante compartilhada;
- executar `npm run analyze:unused`;
- revisar manualmente os achados do Knip;
- não excluir arquivos, exports ou dependências automaticamente;
- registrar falsos positivos, itens preservados e eventuais oportunidades reais em relatório próprio.

### Fora do escopo

- novos pacotes;
- mudanças de banco, migrations, RLS ou dados;
- mudanças de regra de negócio;
- optimistic updates;
- alteração do comportamento de cache;
- mudança visual;
- publicação funcional automática.

## 6. Rodada 4 — TypeScript 6 — CONCLUÍDA

O TypeScript 6.0.3 foi integrado pelo PR #138 em branch exclusiva. A versão foi fixada exatamente, o lockfile foi regenerado pelo npm em Node 24 e nenhuma outra dependência direta foi alterada.

A atualização compilou o projeto sem mudança em código ou `tsconfig.json`, preservou todas as opções estritas e não exigiu supressão de erro ou depreciação. Segurança, lint, 365 testes, cobertura, build, bundle, inspeção pública, compatibilidade transitiva, Knip e 42 cenários Playwright foram aprovados.

O TypeScript 7 não é continuação automática. Exige experiência própria após análise integral do compilador nativo e do ecossistema. A próxima investigação técnica recomendada é observabilidade de erros com minimização de dados, sem autorização automática de instalação.

## 7. Rodada 5 — Atualizações compatíveis de pacotes — CONCLUÍDA

O PR #143 integrou Supabase JavaScript 2.112.0, React Hook Form 7.84.0, resolvers 5.7.1, Motion 12.43.0, Vite 8.2.0 e jest-dom 7.0.0. O lockfile foi regenerado pelo npm em Node 24 e o gate integral aprovou segurança, lint, 365 testes, cobertura, build, bundle, inspeção pública, Knip e 42 cenários Playwright.

A atualização do ESLint 10 foi tentada e interrompida corretamente porque `eslint-plugin-jsx-a11y` 6.10.2 ainda declara suporte somente até ESLint 9. A manutenção preservou ESLint 9.39.5, todas as regras de acessibilidade e uma árvore reproduzível, sem flags de contorno. O ESLint 10 será retomado após suporte oficial estável do plugin.

Node 24, `@types/node` 24.13.3 e TypeScript 6.0.3 permaneceram inalterados. Não houve mudança de código, banco, migrations, RLS, dados, regras de negócio ou Production.

## 7.1 Correção emergencial de segurança transitiva — 9 de agosto de 2026

Durante a preparação do G1, o gate de auditoria detectou o novo advisory `GHSA-rgw5-rvv9-x895` em `brace-expansion@5.0.8`, versão que já fazia parte da linha de base. A correção foi isolada no PR #149 antes da continuidade das modernizações gerais.

A análise mostrou que um override global é inadequado para a árvore atual porque versões antigas e modernas de `minimatch` esperam APIs diferentes. A solução remove o override global, permite que o npm resolva os backports oficiais compatíveis de cada linha, elimina dois patches locais e retira `patch-package` quando sua última finalidade desaparece.

O pacote adiciona regressões específicas do advisory e mantém `npm audit --audit-level=high`, assinaturas, lint, cobertura, build, bundle e Playwright como gates. Não altera comportamento funcional, banco, migrations, RLS, dados ou Production. A evidência detalhada está em `docs/maintenance/BRACE_EXPANSION_SECURITY_2026-08-09.md`.

A continuidade do G1 TanStack Query permanece independente: o plugin oficial de ESLint e os Devtools de desenvolvimento serão retomados sobre a linha de base já corrigida. A atualização do Supabase Action v3 permanece condicionada ao pacote npm estável do CLI alcançar a versão já validada no CI, evitando downgrade ou adoção beta por conveniência.

## 7.2 Manutenção geral, G1, Supabase CLI e Motion — 29–30 de agosto de 2026

A rodada autorizada foi concluída em unidades independentes:

- PR #158: grupo seguro de dependências de desenvolvimento;
- PR #161: atualizações patch/minor de runtime e desenvolvimento, correção transitiva de `nanoid` e instalação de `fast-check@4.9.0`;
- PR #163: G1 TanStack Query com lint oficial, Devtools somente em desenvolvimento e gate contra vazamento no bundle;
- PR #166: `supabase/setup-cli@v3.0.0` e Supabase CLI 2.116.0, aprovados pelo replay integral do Supabase local;
- PR #167: Motion 13.1.1, aprovado novamente sobre a base já atualizada.

A integração técnica preservou banco, migrations, RLS, dados, regras de negócio e Production até a homologação. Nenhum pacote major incompatível foi forçado. TanStack Table 9 permaneceu fora após quebra funcional comprovada no PR #155; TypeScript 7 e ESLint 10 continuam sujeitos a experimentos próprios.

O fechamento da rodada ocorreu em três passos adicionais: o PR #168 sincronizou a documentação autoritativa; o PR #169 promoveu a base validada para Production, gerando o deployment `dpl_EqrEWJ4B9RVjSbbrSuuWNKe45YBN` em estado `READY` no SHA `706570480288e60cf7070c3a4648fa6d37d9f8fb`; e o PR #170 restaurou `git.deploymentEnabled: false`. A publicação não criou nem aplicou migrations, não alterou RLS, dados ou regras de negócio e manteve o Supabase Production saudável.

A próxima modernização não é automática. O foco técnico retorna ao Trilho B de migração. `fast-check` já está disponível para testes gerativos; pgTAP será avaliado na fundação local de banco e `json-canonicalize` permanece reservado ao B2.

## 7.3 Janela experimental pré-migração — 3 de setembro de 2026 — CONCLUÍDA

A ausência de usuários finais liberados e o atraso no recebimento dos dados para migração foram usados como janela deliberada de maior tolerância a risco técnico. A autorização permitiu testar versões recém-publicadas e majors, desde que incompatibilidades não fossem mascaradas com `--force`, `--legacy-peer-deps` ou retirada de gates.

O PR #176 integrou o lote tecnicamente viável:

- `@supabase/supabase-js` 2.114.0;
- `@tanstack/react-query`, plugin de ESLint e Devtools 5.102.8;
- Motion 13.2.0;
- React Hook Form 7.87.0;
- Zod 4.5.4;
- Testing Library React 16.3.3 e user-event 14.6.7;
- `@types/node` 26.4.1;
- `globals` 17.12.0;
- Knip 6.34.0;
- `typescript-eslint` 8.69.0.

O primeiro gate detectou duas vulnerabilidades altas em `browserslist <=4.28.6`. Como o próprio audit oferecia correção transitiva não destrutiva, `npm audit fix` atualizou somente o lockfile; o gate seguinte ficou limpo.

### Majors experimentados na primeira passagem

**TanStack Table 9.2.4** foi instalado e executado inicialmente como simples atualização. A suíte apresentou 14 falhas concentradas em `DemandasTable.tsx`, com ruptura da API v8 (`getCoreRowModel is not a function`). O resultado reclassificou corretamente a mudança como migração estrutural. Essa migração foi posteriormente concluída no PR #178, conforme a seção 7.4.

**TypeScript 7.0.2** falhou na resolução limpa da árvore porque `typescript-eslint@8.69.0` declara peer `typescript >=4.8.4 <6.1.0`. TypeScript permanece em 6.0.3 até mudança upstream.

**ESLint 10.9.1 / @eslint/js 10.0.1** falharam em instalação limpa porque `eslint-plugin-jsx-a11y@6.10.2` declara suporte apenas até ESLint 9. A acessibilidade não foi removida nem contornada; ESLint e `@eslint/js` permanecem em 9.39.5.

### Gate final

Depois de retirar somente TanStack Table 9 e corrigir `browserslist` transitivamente, passaram instalação reproduzível, documentação, audit, assinaturas/proveniência, lint, testes e cobertura, build, orçamento e inspeção pública do bundle, exclusão dos Devtools do bundle de Production e smoke tests Playwright/Chromium.

A primeira integração da janela resultou em `fbaf9c006e503680787152bd3804404887c2e7d6`. A migração estrutural subsequente do TanStack Table 9 elevou a `main` para `4d9ec654b6feb1acd43329861eedd1ac5c8c12bf`. Nenhuma dessas mudanças foi publicada em Production e nenhuma alterou banco, migrations, RLS, dados ou regras de negócio.

## 7.4 Migração estrutural TanStack Table 9 — 3 de setembro de 2026 — CONCLUÍDA

O PR #178 migrou `DemandasTable.tsx` para a API completa do TanStack Table 9.2.4, sem usar `useLegacyTable`.

Mudanças técnicas:

- `useReactTable` → `useTable`;
- feature set estática definida com `tableFeatures`;
- sorting e pagination registrados explicitamente;
- row models v9 adotados;
- `columnSizingFeature` habilitado apenas para preservar sizing fixo e `getTotalSize`, sem ativar resizing;
- `sortingFn` → `sortFn`;
- `row.getVisibleCells()` substituído por `row.getAllCells()`, já que column visibility não é usada pelo produto;
- helper de colunas adaptado à nova assinatura tipada por features.

A migração completa passou 80 arquivos/365 testes, build, bundle, inspeção pública e 42 cenários Playwright. Os três cenários dedicados à tabela responsiva permaneceram aprovados em desktop e mobile.

O bundle inicial medido após a migração foi 220.031 bytes, exatamente a mesma medição do lote anterior com Table 8. Portanto, não há redução de bundle comprovada nesta aplicação específica; o benefício atual é a adoção da arquitetura v9, com features explícitas, melhor base para tree-shaking futuro e melhorias internas de desempenho/memória da biblioteca.

A `main` após o merge é `4d9ec654b6feb1acd43329861eedd1ac5c8c12bf`. Production permanece deliberadamente na versão anterior e `git.deploymentEnabled: false` continua vigente.

## 7.5 Manutenção focal de formulários — experimento de 05/11/2026

**Natureza:** checkpoint de homologação de dependência, sem autorizar automaticamente publicação. A versão `@hookform/resolvers@7.0.2` foi ensaiada em branch isolada sobre a versão publicada após o PR #229; o projeto usa exclusivamente `zodResolver` para os formulários. O resolvedor Zod foi comparado byte a byte entre os pacotes npm 6.0.2 e 7.0.2, sem diferenças em seu diretório; a alteração major recai principalmente sobre resolvedores de outros validadores, fora do escopo desta aplicação.

Foram executados `npm ci`, `npm run check`, 379 testes Vitest/84 arquivos, 56 cenários Playwright desktop/mobile, build TypeScript/Vite, auditoria de vulnerabilidades, limites e integridade de bundle. O PR específico precisará concluir os checks remotos e Preview Vercel READY antes do merge; os resultados locais não autorizam, isoladamente, publicação. O pacote altera apenas a versão direta do resolvedor, o lockfile e a reconciliação documental. Sem alterações de regras, formulários, banco, dados, RLS, autenticação ou UI; rollback por revert da versão e lockfile juntos. O resultado definitivo do PR deverá ser confrontado com o Handoff.

## 8. Oportunidades funcionais condicionadas

Permanecem sujeitas a necessidade comprovada e desenho específico:

- observabilidade de erros com minimização de dados;
- métricas reais de desempenho;
- Radar interativo com drill-down;
- agenda de prazos e providências;
- PWA com política segura de cache;
- prontuário institucional em PDF;
- virtualização da tabela;
- paginação e busca remotas;
- central de comandos.

Nenhuma dessas possibilidades deve ser instalada ou implementada apenas por disponibilidade tecnológica. Da mesma forma, nenhuma deve ser descartada quando resolver de maneira substancial uma necessidade real do produto.

## 9. Validação por PR

Conforme aplicável:

```bash
npm ci
npm run check:docs
npm audit --audit-level=high
npm audit signatures
npm run lint
npm run test:coverage
npm run build
npm run check:bundle
npm run check:public-bundle
npm run check:dev-only-tools
npm run test:e2e
```

Mudanças de dependência, CI, runtime, cache, Realtime, Supabase ou interface exigem testes específicos adicionais.

## 10. Rollback

- cada PR deve ser independente e reversível;
- dependências e lockfile devem ser revertidos juntos;
- nenhuma migration destrutiva integra esta agenda sem autorização específica;
- falha em uma unidade não invalida automaticamente unidades independentes;
- nenhuma atualização será promovida para produção sem confirmação do mesmo SHA;
- documentação temporalmente superada será preservada como histórico, não usada como orientação atual.

## 11. Autoridade

Este documento organiza manutenção e modernização. Não substitui decisões de produto, não autoriza novas funcionalidades por inferência e não cria uma sequência imutável.

O responsável pelo produto pode incluir, retirar, alterar ou reorganizar unidades. A documentação deve refletir a decisão mais recente e nunca funcionar como obstáculo artificial à adoção de uma solução tecnicamente superior e devidamente autorizada.