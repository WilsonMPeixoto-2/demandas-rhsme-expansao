# Handoff Operacional — Central de Demandas CTRH

## Encerramento do PR #215 e refinamento de monitores amplos — 30/10/2026

O PR #215 foi integrado e publicado: commit `62304923dafa5b0448944c7a7845a703b27d474b`, deployment Vercel Production `dpl_EKxBUMv1pL9iWeVi3uCJTddZsgkB`, **READY**, domínio `demandas-rhsme-expansao.vercel.app`. A árvore de arquivos do merge é idêntica à do último HEAD validado `f75e32a`. CI: 374 testes unitários/de integração e 50 E2E aprovados; revalidação pós-publicação: 24 E2E e build aprovados. HTTP e assets conferidos; nenhuma operação em banco.

Após usar a versão publicada, o responsável apontou espaço útil desperdiçado no monitor de 32 polegadas, tabela comprimida apesar de área livre e baixa qualidade/encaixe da assinatura da Prefeitura. O PR #221, branch `fix/wide-screen-institutional-signature`, prepara um refinamento restrito a esses pontos: área operacional sem teto fixo de largura; assinatura oficial completa de 1490×310 px em faixa própria; nomes da carteira aproveitando colunas maiores. Fluxo CTRH, ícones, Arcos, navegação, dados e permissões são preservados.

**Estado do refinamento:** implementação em Preview para avaliação visual; não publicada. O código funcional `5333e95b431ac6afbd79853a423d2f1c542a6db6` passou nos testes específicos de assinatura desktop/mobile e carteira 2560×1440; o gate integral deve ser conferido no último HEAD antes da promoção. RED registrado sobre a versão anterior: largura de 1830 px para uma janela de 2560 px e assinatura recomposta sem resolução intrínseca verificável. Capturas reais de CI com dados sintéticos estão em [sidebar](design/evidencias/pr221/sidebar-1366.png) e [carteira ampla](design/evidencias/pr221/carteira-2560.jpg). A homologação visual deste refinamento permanece pendente. A suspeita de falha em movimento reduzido no PR #215 foi descartada: o CSS global já limita a transição a 0,01 ms com essa preferência.


Atualizado em: **30 de outubro de 2026 — reconciliação pontual de referências documentais.** Os estados de GitHub, Vercel e Supabase registrados abaixo são fotografias datadas, não indicadores em tempo real; devem ser reconferidos antes de qualquer intervenção.

<!-- IMPLEMENTATION_AUTHORIZATION: V1-E-A01 -->

## Checkpoint de retomada do PR #215 — 30/10/2026

**PR #215 — Opção 2 homologada visualmente pelo responsável pelo produto em 30/10/2026.** O usuário examinou o Preview Vercel da branch `feat/sidebar-impeccable` no SHA `49e1aafa33c65935c181445d44a926b9e0832d6e` (`https://demandas-rhsme-expansao-q8t8gr65n-wilson-m-peixotos-projects.vercel.app`) e autorizou expressamente a promoção à produção. Os gates de documentação, auditoria, lint, cobertura, build, bundle, E2E, Storybook, integridade de design e CodeQL estão aprovados no mesmo SHA, com Vercel Preview `READY`. A correção de foco móvel e a composição estão incluídas nesse commit. **Próxima operação autorizada:** integrar o PR #215 sem alterações funcionais ou artísticas e confirmar a publicação na Vercel pelo SHA de merge. Este registro de pré-integração não equivale a afirmar que a publicação já ocorreu.

**Continuidade:** o [checkpoint técnico do PR #215](design/RETOMADA_PR215_CHECKPOINT_2026-10-30.md) documenta a execução e as falhas anteriores, preservadas como histórico. A homologação mais recente é a registrada acima. A verificação pós-merge deve confrontar o SHA da `main`, o deployment `READY` e o endereço público antes de declarar publicação concluída. As fotografias de 29/10 e 26/10 permanecem históricas.


## Fotografia operacional verificada em 29 de outubro de 2026 (antes do PR #219)

Este quadro reúne verificações realizadas **antes da integração do PR #219**, quando a `main` ainda apontava para o commit do PR #218. A integração do próprio PR #219 gerou novo commit e deployment: os SHAs e deployments abaixo registram proveniência, **não representam o estado ao vivo**. Na retomada, conferir diretamente GitHub, Vercel e Supabase. A fotografia de 26/10 logo abaixo permanece preservada como histórico.

| Verificação | Resultado |
|---|---|
| Branch `main` | `87ef08fc31d702119c281351d3b1918d18464414` — PR #218 integrado |
| Vercel Production | Deploy do SHA `87ef08fc` em estado **READY**; alterações #216–#218 foram documentais/de ferramentas, sem redesenho operacional |
| Supabase `CTRH PROCESSOS` | Projeto `kdhekkzwcokfrpcrsllr` consultado em 29/10: **ACTIVE_HEALTHY**. O registro `INACTIVE` abaixo refere-se exclusivamente à auditoria de 26/10 |
| GitHub Actions | PR #218: **Integridade do repertório de design, CodeQL e Dependency health aprovados** antes do merge; o PR #216 reparou o workflow YAML defeituoso |
| Plugin privado ChatGPT | **Visual Quality v0.1.1**, publicado como plugin pessoal, com diretrizes transversais de testes evolutivos, evidência fiel e aprovação visual humana |
| Governança visual | `AGENTS.md`, `.github/pull_request_template.md` e `docs/design/PROTOCOLO_PERMANENTE_EVOLUCAO_VISUAL_CTRH.md` atualizados e integrados pelo PR #218 |
| Storybook | Infraestrutura para histórias de componentes reais incorporada pelo PR #213; consultar `docs/design/STORYBOOK_CTRH_INTEGRACAO_REAL.md` |
| PR #215 (barra lateral) | **Aberto, não integrado**, branch `feat/sidebar-impeccable`, HEAD `c96fb16e7690620d257208eee2116e5c84873f3a`. O código da Opção 2 enviado pelo Gemini na conversa não foi confirmado nessa branch |
| Próximo passo visual | Auditar a implementação do PR #215, integrar apenas mudanças aprovadas e corrigir testes comprovadamente obsoletos, sem alterar a produção antes da homologação humana |

**Separação obrigatória:** um build em CI ou captura de DEV não substitui o preview autenticado nem a aprovação da composição; comparar imagens reais equivalentes, informar SHA e URL e preservar a funcionalidade do produto. Consulte o protocolo permanente de evolução visual.

## Estado material — fotografia histórica de 26 de outubro de 2026


| Item | Estado |
|---|---|
| Repositório | `WilsonMPeixoto-2/demandas-rhsme-expansao` |
| `main` anterior à Rodada 3.2 | `9be47339bafa6e44cc8a0fb4eaae9f43f90fb21d` |
| R4 | concluído e publicado |
| R5-1 | concluído, homologado e publicado |
| Auditoria transversal de layout | concluída, homologada e publicada |
| R5 Essencial | concluído, homologado e publicado pelos PRs #112 e #113 |
| Recuperação de senha | concluída, configurada no Supabase, homologada e publicada pelos PRs #112 e #113 |
| Rodada técnica 1 | concluída e publicada pelos PRs #116–#122 |
| Rodada técnica 2 | concluída e publicada pelos PRs #123–#128 |
| Correção responsiva da tabela | concluída e publicada pelos PRs #129–#131 |
| Rodada técnica 3 — TanStack Query | concluída e publicada pelos PRs #132–#134 |
| Consolidação documental da Rodada 3.1 | concluída pelo PR #135, merge `343871ffa32cf30f6cddded6b49d83ec05e2d64a` |
| PR documental anterior | #115 encerrado sem merge por substituição e obsolescência temporal |
| Consolidação técnica da Rodada 3.1 | concluída pelo PR #136: constante compartilhada e diagnóstico Knip |
| Preparação anterior ao TypeScript 6 — Rodada 3.2 | concluída pelo PR #137: atualizações de desenvolvimento, redução de exports e auditoria do `tsconfig` |
| PR funcional TanStack Query | #132, merge `e7ca96fa2f1474d27703967db641fd91a4e619c6` |
| PR de release TanStack Query | #133, merge `f9424b34ec9efd02d00f2e989d15816f52c5e480` |
| Encerramento da release | PR #134, merge `15aa5c049c3c7122db365eec6a2e9f629e3c38ea` |
| Production atual | `dpl_EqrEWJ4B9RVjSbbrSuuWNKe45YBN` — `READY` |
| SHA funcional publicado | `706570480288e60cf7070c3a4648fa6d37d9f8fb` |
| Supabase | `CTRH PROCESSOS`, ref `kdhekkzwcokfrpcrsllr`, região `sa-east-1`, **`INACTIVE` em 26/10/2026**; frontend Production continua configurado para esse projeto |
| Integridade conhecida | 379 demandas, zero excluídas, 764 históricos, 13 perfis |
| Deploy automático | `deploymentEnabled: false`, restaurado pelo PR #170 após confirmação da nova Production |
| Testes após TanStack Query | 365 testes unitários e de integração; 42 cenários Playwright aprovados |
| Implementação funcional autorizada | **V1-E-A01 — R5 Essencial e recuperação de senha** |
| Rodada 4 — TypeScript 6 | concluída pelo PR #138; compilador 6.0.3, lockfile reproduzível e gate integral aprovado |
| Atividade técnica atual | janela experimental de 03/09 concluída pelos PRs #176 e #178; TanStack Table 9.2.4 migrado integralmente; `main` em `4d9ec654b6feb1acd43329861eedd1ac5c8c12bf`; Production permanece deliberadamente na versão anterior, com deploy automático bloqueado |
| Próxima atualização candidata | debate B1 do Trilho B, com pré-flight técnico concluído; B2 permanece bloqueado até aprovação expressa das decisões B1 aplicáveis |

## Retomada técnica — 26 de outubro de 2026

- backend atual confirmado como **Supabase**; não há implementação Firebase/Firestore nem migração Supabase → Firebase;
- projeto Supabase `CTRH PROCESSOS` reportado como **INACTIVE**; migrations remotas não puderam ser listadas enquanto o banco permanece pausado;
- Production Vercel continua `READY` no SHA `706570480288e60cf7070c3a4648fa6d37d9f8fb`;
- a configuração de Production possui fallback público explícito para o projeto Supabase atual;
- se houver decisão de migração para Google, a alternativa recomendada para preservar o modelo relacional é **Firebase SQL Connect + Cloud SQL for PostgreSQL**, não uma conversão automática para Firestore;
- dependências foram atualizadas ao máximo viável sem contornar peers incompatíveis e o gate integral do PR #195 foi aprovado;
- TypeScript 7, ESLint 10 e `@hookform/resolvers` 6 permanecem bloqueados por incompatibilidades upstream comprovadas;
- o Axe 4.14 revelou dois padrões de nome acessível incompatíveis com WCAG 2.5.3; ambos foram corrigidos sem desativar regras, e o E2E final aprovou 42/42 cenários;
- relatório completo: `docs/maintenance/BANCO_E_DEPENDENCIAS_2026-10-26.md`;
- nenhuma reativação de banco, migration remota, mudança de provedor ou publicação em Production faz parte desta entrega.

## Rodadas técnicas concluídas

### Rodada 1

- `actions/checkout` e `actions/setup-node` atualizados para v7;
- Playwright 1.62.0;
- `@vitejs/plugin-react` 6.0.4;
- `globals` 17.8.0;
- `@supabase/supabase-js` 2.110.9;
- Error Boundaries globais e regionais;
- estabilização dos testes de fuso operacional e interação com menus;
- publicação concluída e bloqueio automático restaurado.

### Rodada 2

- Node 24 obtido do `package.json` pelos workflows;
- JSDOM 30.0.0 efetivamente usado pelo Vitest;
- Supabase Action 2.1.1 e CLI 2.111.0 fixadas;
- Knip 6.29.0 instalado em modo diagnóstico, sem autofix e fora do gate obrigatório;
- publicação concluída e bloqueio automático restaurado.

### Correção responsiva intermediária

- ampliação da área útil da carteira;
- tabela sem overflow em 1920 px e 1366 px;
- rolagem superior sincronizada em viewports estreitos;
- coluna Ações fixa quando necessária;
- preservação dos filtros, dados, permissões e regras de negócio.

### Rodada 3 — TanStack Query

- `@tanstack/react-query` 5.101.4;
- `QueryClient` único na raiz;
- cache separado por UUID de usuário;
- consultas simultâneas deduplicadas;
- mutations confirmadas pelo repositório;
- invalidação seletiva da carteira e da lixeira;
- agrupamento de eventos Realtime;
- limpeza de cache ao trocar usuário ou encerrar sessão;
- nova tentativa explícita após falha de conexão;
- sem optimistic updates;
- sem retries automáticos de mutation;
- Supabase preservado como fonte de verdade;
- nenhuma mudança em banco, migrations, RLS, dados ou regras de negócio.

A arquitetura vigente está descrita em `docs/architecture/ARQUITETURA_TANSTACK_QUERY_CTRH_v1.0.md`.

## Consolidação pós-TanStack Query — Rodada 3.1

A Rodada 3.1 foi concluída em dois PRs independentes e reversíveis.

### Consolidação documental — PR #135

- substituiu o plano desatualizado do PR #115;
- registrou que as Rodadas 1, 2 e 3 foram concluídas;
- instituiu a política de modernização proativa;
- atualizou o registro de oportunidades técnicas;
- documentou a arquitetura TanStack Query;
- sincronizou `AGENTS.md`, Handoff e Histórico Documental;
- adicionou `npm run check:docs` ao workflow principal de PRs, automatizando uma obrigação já vigente.

O PR #115 foi encerrado sem merge e preservado como histórico da preparação inicial.

### Consolidação técnica — PR #136

- criou `src/query/queryEvents.ts`;
- centralizou `demandas:retry` em `DEMANDAS_QUERY_RETRY_EVENT`;
- fez o Header emitir e `useDemandasData` escutar a mesma constante;
- preservou integralmente o valor e o comportamento de recuperação;
- executou `npm run analyze:unused` sem autofix;
- retirou o passo temporário do Knip antes do gate final;
- manteve o Knip fora do gate obrigatório.

### Resultado do Knip

Não foram encontrados:

- arquivos não utilizados;
- dependências não utilizadas;
- dependências ausentes ou não listadas;
- imports ou executáveis não resolvidos;
- problemas de configuração.

Foram identificados 18 símbolos exportados sem consumidor externo detectado:

- 10 são usados internamente e possuem apenas visibilidade pública maior do que a necessária;
- 7 não participam do runtime atual, mas exigem revisão específica antes de remoção por alcançarem prazos legados, tipos de domínio ou contratos Supabase;
- `Json`, de `database.types.ts`, deve ser preservado como contrato tipado do banco.

Nenhum arquivo, dependência, export ou contrato foi removido na Rodada 3.1. As limpezas possíveis permanecem recomendações separadas e não autorizadas automaticamente.

A análise integral está em `docs/execution/RODADA_3_1_DIAGNOSTICO_KNIP_2026-08-03.md`.

### Limites preservados

A Rodada 3.1 não alterou:

- pacote ou versão;
- comportamento funcional;
- interface;
- banco, migrations, RLS ou dados;
- cache, Realtime, mutations ou sessão;
- regras de negócio;
- deployment de Production.

## Preparação anterior ao TypeScript 6 — Rodada 3.2

A Rodada 3.2 foi executada pelo PR #137 como preparação de baixo risco, sem atualizar o compilador.

### Atualizações integradas

- `@playwright/test` 1.62.1;
- `@types/react` 19.2.18;
- `@types/react-dom` 19.2.4;
- `@vitejs/plugin-react` 6.0.5;
- `csv-parse` 7.0.2;
- `globals` 17.9.0;
- JSDOM 30.0.1;
- Knip 6.31.0.

O lockfile foi regenerado pelo npm no GitHub Actions e gravado na branch pelo commit `2a1e3260640c39a2668564cfd163c2913f4b733e`, sem edição manual.

### Limpeza conservadora

Dez símbolos usados internamente deixaram de ser exportados. Nenhum símbolo, arquivo ou comportamento foi removido.

O diagnóstico final do Knip passou de 18 para oito símbolos preservados:

- `isLegacyDeadlineCompletion`;
- `canPreserveMissingDeadline`;
- `canUseDeadlineStateAfterRegistration`;
- `getPrazoFinalSemantics`;
- `PrazoSemantics`;
- `DatabaseR4`;
- `DeadlineValue`;
- `Json`, como contrato intencional do banco.

Não foram encontrados arquivos ou dependências não utilizadas, dependências ausentes, imports não resolvidos ou problemas de configuração.

### Auditoria do compilador

O `tsconfig.json` atual foi auditado contra a preparação do TypeScript 6. A configuração já usa opções modernas, estritas e compatíveis; nenhuma alteração preventiva ou relaxamento de regra foi necessário.

Permanecem adiadas para PRs isolados, somente com benefício aplicável, as atualizações de Supabase JS, React Hook Form e resolvers, Motion e Vite core. Atualizações major de ESLint, Testing Library, tipos do Node e TypeScript 7 também ficaram fora do escopo.

A Rodada 3.2 não altera banco, migrations, RLS, dados, regras de negócio, cache, Realtime, autenticação ou comportamento funcional.

## Rodada 4 — TypeScript 6

A Rodada 4 foi concluída pelo PR #138.

### Alteração integrada

- TypeScript 5.9.3 atualizado para TypeScript 6.0.3;
- versão exata registrada em `package.json`;
- lockfile regenerado pelo npm em Node 24;
- typescript-eslint 8.65.0 confirmado com a mesma instalação deduplicada do compilador;
- nenhuma outra dependência direta atualizada;
- código-fonte e `tsconfig.json` preservados sem alterações.

### Validação

- zero vulnerabilidades;
- 578 assinaturas e 159 attestations verificadas;
- documentação 9/9;
- lint aprovado;
- 80 arquivos e 365 testes aprovados;
- cobertura global de linhas de 82,54%;
- build TypeScript/Vite aprovado;
- bundle inicial de 219.506 bytes, 54,95% abaixo da linha de base;
- inspeção do bundle público aprovada;
- três testes de compatibilidade transitiva aprovados;
- 42 cenários Playwright aprovados em desktop e mobile;
- Knip sem novos achados.

### Limites preservados

A Rodada 4 não altera comportamento, layout, regras de negócio, Supabase, banco, migrations, RLS, dados, cache, Realtime, autenticação, mutations ou Production. Os workflows temporários de geração e diagnóstico foram removidos antes do gate final.

A evidência completa está em `docs/execution/RODADA_4_TYPESCRIPT_6_RELATORIO_FINAL_2026-08-03.md`.

## Rodada 5 — Atualizações compatíveis de pacotes

A Rodada 5 foi executada pelo PR #143.

### Atualizações integradas

- `@supabase/supabase-js` 2.112.0;
- `react-hook-form` 7.84.0;
- `@hookform/resolvers` 5.7.1;
- `motion` 12.43.0;
- Vite 8.2.0;
- `@testing-library/jest-dom` 7.0.0.

O lockfile foi regenerado pelo npm em Node 24. Node `24.x`, `@types/node` 24.13.3 e TypeScript 6.0.3 foram preservados. Nenhum código-fonte, `tsconfig`, banco, migration, RLS, dado, regra de negócio, Supabase remoto ou Production foi alterado.

### ESLint 10

A instalação limpa do ESLint 10 foi bloqueada pelo peer dependency oficial de `eslint-plugin-jsx-a11y` 6.10.2, que admite somente ESLint até a linha 9. Não foram usados `--force`, `--legacy-peer-deps`, código não publicado nem retirada da fiscalização de acessibilidade. ESLint e `@eslint/js` permanecem em 9.39.5 até uma versão estável compatível do plugin.

### Validação

- zero vulnerabilidades;
- 576 assinaturas e 159 attestations verificadas;
- documentação 9/9;
- lint aprovado;
- 80 arquivos e 365 testes aprovados;
- cobertura global de linhas de 82,54%;
- TypeScript 6.0.3 e Vite 8.2.0 aprovados;
- bundle inicial de 220.300 bytes, 54,79% abaixo da linha de base;
- inspeção pública aprovada;
- Knip sem novos achados;
- 42 cenários Playwright aprovados em desktop e mobile.

A evidência completa está em `docs/execution/RODADA_5_ATUALIZACOES_PACOTES_RELATORIO_FINAL_2026-08-03.md`.

## Correção emergencial de segurança — 9 de agosto de 2026

Durante o gate do pacote G1, o `npm audit --audit-level=high` passou a reprovar a árvore já existente por `GHSA-rgw5-rvv9-x895`, bypass de DoS em `brace-expansion` que alcançou a versão `5.0.8` anteriormente fixada por override global. O alerta não foi introduzido pelo G1.

A investigação no PR #149 comprovou que um único override global é inadequado porque consumidores antigos e modernos de `minimatch` dependem de linhas de API diferentes. Foram testadas e rejeitadas sem integração as alternativas `2.1.3` e override global `2.1.4`. O upstream oficial publicou backports do advisory em múltiplas linhas de manutenção.

A correção adotada remove o override global de `brace-expansion`, deixa o npm resolver a linha segura compatível com cada consumidor, remove os dois patches locais de `minimatch` e retira `patch-package` e seu `postinstall`, que deixam de ter finalidade. O teste transitivo passa a validar consumidores antigos e modernos e reproduz os casos de regressão do advisory.

A validação dedicada comprovou instalação limpa, zero vulnerabilidades de auditoria, assinaturas válidas, compatibilidade transitiva, lint, testes, build e inspeção de bundle. O gate integral inclui ainda cobertura e Playwright antes da integração. O pacote não altera regra de negócio, banco, migrations, RLS, dados, cache, autenticação, Vercel ou interface.

A investigação e as evidências estão em `docs/maintenance/BRACE_EXPANSION_SECURITY_2026-08-09.md`.

## Manutenção geral e G1 — 29–30 de agosto de 2026

A rodada autorizada de modernização foi concluída sem alterar dados, migrations, RLS ou Supabase Production.

### Dependências e segurança

- PR #158 integrou o grupo seguro de dependências de desenvolvimento;
- PR #161 atualizou Supabase JS para 2.112.4, React Hook Form para 7.86.0, resolvers para 5.9.1, React Router para 8.3.1, Sonner para 2.0.8 e demais patches compatíveis;
- `fast-check@4.9.0` foi adicionado como ferramenta de desenvolvimento para os futuros testes gerativos do Trilho B;
- o lockfile foi regenerado pelo npm e a vulnerabilidade transitiva então detectada em `nanoid <3.3.18` foi eliminada sem `--force`;
- audit, assinaturas, lint, testes, cobertura, build, bundle e Playwright permaneceram verdes.

### G1 TanStack Query

O PR #163 concluiu o G1:

- `@tanstack/eslint-plugin-query@5.101.4` com configuração oficial `flat/recommended`;
- `@tanstack/react-query-devtools@5.101.4` somente em desenvolvimento;
- correção da dependência instável de `refetch` identificada pelo novo lint;
- gate `check:dev-only-tools` impedindo Devtools no bundle de produção;
- inspeção pública do bundle mantida no CI.

### Supabase CLI

O PR #166 atualizou `supabase/setup-cli` para v3.0.0 e fixou o Supabase CLI em 2.116.0. O gate local aprovou a inicialização do Supabase efêmero, todos os invariantes existentes e o replay integral das migrations a partir do zero. Nenhuma migration nova foi criada ou aplicada ao Production.

### Motion

O PR #167 atualizou `motion` de 12.43.0 para 13.1.1. A major 13 foi reaplicada sobre a `main` já atualizada e aprovada novamente por audit, assinaturas, lint, cobertura, build, bundle e Playwright.

### Itens deliberadamente não integrados

- TanStack Table 9: o PR #155 comprovou quebra funcional e foi encerrado; exige migração própria;
- TypeScript 7 e ESLint 10: continuam dependentes de avaliação específica de compatibilidade;
- React Compiler/Oxc e Devtools unificados: permanecem experimentais para o nível de risco atual;
- observabilidade externa: depende de desenho prévio de privacidade, retenção e sanitização.

Evidências principais: `docs/maintenance/DEPENDENCY_UPDATES_2026-08-29.md`, `docs/maintenance/G1_QUERY_TOOLING_2026-08-29.md` e `docs/maintenance/SUPABASE_CLI_2_116_0_2026-08-30.md`.

### Publicação e encerramento operacional — 30 de agosto de 2026

- PR #168 sincronizou o Handoff e o Plano Consolidado com a manutenção integrada;
- PR #169 habilitou temporariamente os Git Deployments, passou pelo Preview `dpl_A1FL86oeTNEcyBTzDk1fXUBgGJxV` em estado `READY`, pelo gate `Dependency health` integral e publicou a mesma base em Production;
- a Production vigente é `dpl_EqrEWJ4B9RVjSbbrSuuWNKe45YBN`, estado `READY`, no SHA funcional `706570480288e60cf7070c3a4648fa6d37d9f8fb`;
- PR #170 restaurou `git.deploymentEnabled: false` após a confirmação da Production;
- nenhuma migration, RLS, dado ou regra de negócio foi alterada durante a publicação;
- o Supabase `CTRH PROCESSOS` permaneceu `ACTIVE_HEALTHY`, com health/readiness em HTTP 200 após a promoção.


## Janela experimental pré-migração — 3 de setembro de 2026

O atraso no recebimento dos dados e a inexistência de usuários finais liberados foram usados deliberadamente como janela de experimentação técnica, com autorização para testar versões recém-publicadas e majors de maior risco antes da migração.

O PR #176 integrou à `main`, após gate integral verde:

- `@supabase/supabase-js` 2.114.0;
- TanStack Query, plugin de ESLint e Devtools 5.102.8;
- Motion 13.2.0;
- React Hook Form 7.87.0;
- Zod 4.5.4;
- Testing Library React 16.3.3 e user-event 14.6.7;
- `@types/node` 26.4.1;
- `globals` 17.12.0;
- Knip 6.34.0;
- `typescript-eslint` 8.69.0;
- correção transitiva de `browserslist` no lockfile.

Três limites foram comprovados por execução, não por cautela abstrata:

1. **TanStack Table 9.2.4:** instalou, mas produziu 14 falhas concentradas na API da tabela (`getCoreRowModel is not a function`). Permanece em 8.21.3 e passa a exigir migração estrutural própria.
2. **TypeScript 7.0.2:** instalação bloqueada por peer oficial de `typescript-eslint@8.69.0`, que exige TypeScript abaixo de 6.1.
3. **ESLint 10.9.1:** instalação limpa bloqueada por `eslint-plugin-jsx-a11y@6.10.2`, cujo peer oficial termina na linha ESLint 9.

Nenhum experimento usou `--force`, `--legacy-peer-deps`, retirada de regra de acessibilidade ou supressão artificial de incompatibilidade.

A Production **não foi atualizada nesta rodada**. Continua em `dpl_EqrEWJ4B9RVjSbbrSuuWNKe45YBN`, SHA funcional `706570480288e60cf7070c3a4648fa6d37d9f8fb`, enquanto `git.deploymentEnabled: false` permanece ativo. Nenhuma migration, RLS, dado ou regra de negócio foi alterada.

## Migração estrutural TanStack Table 9 — 3 de setembro de 2026

O PR #178 concluiu a migração da tabela principal para `@tanstack/react-table@9.2.4`, sem recorrer ao adaptador legado `useLegacyTable`.

A migração substituiu a API v8 por:

- `useTable` no lugar de `useReactTable`;
- `tableFeatures` com features explícitas;
- `rowSortingFeature` e `createSortedRowModel()`;
- `rowPaginationFeature` e `createPaginatedRowModel()`;
- `columnSizingFeature` para preservar larguras e `getTotalSize()`;
- `sortFn` no lugar de `sortingFn`;
- `row.getAllCells()` porque o produto não utiliza column visibility;
- helper de colunas tipado pela feature set da v9.

A primeira tentativa simples de upgrade havia falhado porque a v8 incluía implicitamente recursos que na v9 são opt-in. A migração corrigiu esses contratos de forma explícita, preservando o comportamento visível da tabela.

Gate final:

- 80 arquivos de teste aprovados;
- 365 testes unitários e de integração aprovados;
- build TypeScript/Vite aprovado;
- bundle inicial de 220.031 bytes, igual à medição imediatamente anterior à migração;
- inspeção do bundle público aprovada;
- 42/42 cenários Playwright aprovados em desktop e mobile, incluindo os três cenários específicos de responsividade da tabela;
- nenhuma alteração de banco, migrations, RLS, dados ou regra de negócio.

A Production não foi atualizada. O deploy automático permanece bloqueado.

## Pré-flight B1 do Trilho B — 3 de setembro de 2026

A auditoria do caminho histórico de migração confirmou que ele **não deve ser reutilizado sem revisão** para a futura carga real. O normalizador atual pode inferir tipo, aplicar classificação padrão `Outros` e setor padrão; a RPC `importar_sme_demandas_lote`, no modo apply, insere diretamente em `sme_demandas`. Esses comportamentos não atendem ao contrato recomendado de recepção preservativa do B1.

O diagnóstico completo está em `docs/execution/B1_PREIMPLEMENTACAO_CTRH_2026-09-03.md`. Nenhuma decisão B1 foi inferida ou registrada como aprovada. B2 continua bloqueado até decisão expressa. Nenhuma carga, migration, RLS, dado ou serviço remoto foi alterado.


## Regra permanente de modernização proativa

Atualizações e instalações não ficam restritas a rodadas periódicas.

Em qualquer correção, melhoria visual, nova funcionalidade ou investigação de erro, o executor deve avaliar se a tecnologia atual limita a solução. Quando uma atualização, pacote ou ampliação tecnológica puder produzir resultado materialmente melhor, mais confiável ou definitivo, a proposta deve ser apresentada antes da implementação.

A proposta deve informar problema, limite atual, benefício, alternativa sem dependência, compatibilidade, segurança, privacidade, bundle, testes, manutenção e rollback.

Essa regra não autoriza instalação silenciosa nem obriga a adoção. O responsável pelo produto decide. Também não permite manter solução inferior apenas para evitar avaliar tecnologia moderna quando o ganho for concreto e proporcional.

Consulte:

- `docs/product/POLITICA_MANUTENCAO_DEPENDENCIAS_CTRH_v1.1.md`;
- `docs/execution/PLANO_CONSOLIDADO_MANUTENCAO_MODERNIZACAO_CTRH_v1.1.md`;
- `docs/product/REGISTRO_OPORTUNIDADES_TECNICAS_MODERNIZACAO_CTRH_v1.1.md`.

## R5 Essencial — direção e escopo vigente

GOV-013 adota completude operacional em lugar de exaustão documental. Código, Supabase, interface e testes atuais foram confrontados antes da autorização.

O pacote publicado limita-se a:

- expor `Registrar andamento` para administrador/editor em demanda não encerrada;
- preservar o status no andamento e atualizar próxima providência e data;
- reutilizar a transição existente para reabrir demanda encerrada;
- retirar o status atual das opções de destino e usar rótulos contextuais;
- reconhecer o drawer e as rotas profundas como prontuário operacional inicial;
- endurecer as duas RPCs anteriores ao R4 como wrappers das regras atuais, sem nova estrutura ou alteração de dados.

Página completa, snapshots, backfill, categorias de evento, paginação remota, refinamentos avançados de retorno e demais extensões não estão autorizados. O modal histórico permanece como atalho compatível, sem evolução concorrente ao drawer.

## Recuperação de senha essencial

AUTH-E-D01 autoriza o fluxo mínimo `Esqueci minha senha` → confirmação neutra → link do Supabase → `/redefinir-senha` → nova senha. Somente o evento `PASSWORD_RECOVERY` habilita a alteração; links ausentes, inválidos ou expirados permanecem sem acesso ao formulário. O pacote não cria estrutura de banco nem consulta a existência da conta.

Em 1º de agosto de 2026, o redirect exato `https://demandas-rhsme-expansao.vercel.app/redefinir-senha` foi adicionado e confirmado no Supabase Auth. A política remota de senha foi alinhada à aplicação: mínimo de oito caracteres, com minúscula, maiúscula e número. A verificação de senhas vazadas permanece indisponível no plano Free e não houve contratação ou mudança de plano.

A evidência consolidada está em `docs/execution/RELATORIO_VALIDACAO_COMPLETUDE_OPERACIONAL_2026-08-01.md`: zero vulnerabilidades, 76 arquivos/354 testes Vitest, cobertura acima dos limites, 36/36 cenários Playwright, build e bundle aprovados, rota direta de recuperação protegida na Vercel, migration remota presente, ACLs dos wrappers confirmadas e Preview/Production verificados.

## R5-1 — regra vigente

### Exclusão

- somente administrador ativo pode excluir demandas;
- editor e leitor não recebem a ação `Excluir`;
- exclusão é lógica e nunca física;
- motivo com pelo menos dez caracteres é obrigatório;
- banco registra ator, data, hora e evento histórico;
- dados e histórico permanecem preservados.

### Consulta administrativa

A área `/admin` contém a seção `Demandas excluídas`, somente para administradores, com:

- contagem dos registros excluídos;
- pesquisa por número, assunto, responsável, setor, status, motivo e autor comprovável;
- listagem dos dados principais;
- detalhe somente leitura;
- motivo, data e autoria da exclusão;
- dados preservados da demanda;
- histórico completo.

Quando a autoria não puder ser comprovada, a interface usa `Autor não identificado` e não inventa nome.

### Restauração

Não existe restauração no produto:

- não há botão ou fluxo visual;
- não há método público nos tipos, hooks ou repositórios;
- não há edição ou mudança de status na lixeira;
- a função técnica do banco permanece definida, mas não possui `EXECUTE` para `public`, `anon`, `authenticated` ou `service_role`;
- recuperação excepcional somente poderá ocorrer fora da aplicação, por procedimento controlado do proprietário do banco.

O tipo histórico `restauracao` permanece reconhecido apenas para leitura de eventual evento anterior.

## Auditoria transversal de layout

### Problemas corrigidos

- remoção do ID numérico do modal de edição;
- retirada de textos permanentes sobre legado e migração;
- remoção da expressão `Responsável legado`;
- campo `Motivo da alteração *` exibido somente quando a ação exige justificativa;
- textarea do motivo em largura integral, com altura adequada e sem redimensionamento;
- remoção de UUIDs e nomes de campos internos do histórico;
- tradução dos estados e eventos técnicos para linguagem de produto;
- remoção de referências a migration, lote, hash e sistema anterior;
- substituição de `Vínculo legado pendente` por `Responsável não vinculado`;
- substituição de `Processo #ID` por `Processo não localizado`;
- barreira comum contra mensagens brutas de Supabase, PostgREST e PostgreSQL;
- simplificação da linguagem da área administrativa e dos avisos de integridade.

### Verificação final dos formulários

Todos os campos funcionais permaneceram disponíveis.

**Edição:**

- Assunto;
- Responsável;
- Prazo interno;
- Prazo final;
- Setor;
- Motivo da alteração, somente quando aplicável.

**Nova demanda:**

- Tipo;
- Número;
- Assunto;
- Responsável;
- Prazo interno;
- Prazo final;
- Status;
- Setor;
- Classificação;
- Próxima providência;
- Data da próxima providência;
- justificativa de data passada, quando aplicável.

O campo `Próxima providência` recebeu largura integral, altura mínima, rótulo flutuante, foco e tipografia compatíveis com o padrão profissional do produto.

### Avisos e orientações

Foram confirmadas mensagens explicativas no momento pertinente:

- ao salvar alteração sem motivo obrigatório: `Informe o motivo da alteração para continuar (mínimo de 10 caracteres).`;
- orientação do motivo: `O motivo será registrado no histórico da demanda.`;
- ao salvar nova demanda sem prazo interno: diálogo `Prazo interno obrigatório`;
- orientação do diálogo: `Toda nova demanda deve possuir um prazo interno definido. Informe a data antes de salvar o cadastro.`;
- em status ativo sem providência: `Descreva a próxima providência com pelo menos 5 caracteres.`;
- sem data de acompanhamento: `Informe a data de acompanhamento.`

Mensagens específicas, como data parcialmente preenchida, permanecem preservadas. Nenhum aviso de regra usa UUID, código de banco, nome de coluna ou linguagem de infraestrutura.

### Limites

O pacote não altera:

- regras de prazo e justificativa;
- tratamento dos registros importados;
- modelo ou dados do Supabase;
- permissões por papel;
- indicadores do Radar;
- filtros e comportamento por carteira;
- exportação analítica;
- qualquer decisão ou código do R5-2.

## Auditoria transversal já publicada — validação

### Gate combinado final

Deployment: `dpl_8vU2o1ojgQDsjck7twsaaYUbJwGd` — `READY`.

- auditoria de dependências: zero vulnerabilidades;
- assinaturas verificadas: 560 pacotes;
- atestações verificadas: 147 pacotes;
- compatibilidade transitiva: 3/3;
- documentação: 9/9;
- lint: aprovado;
- 71 arquivos e 328 testes aprovados;
- cobertura global de linhas: 81,74%;
- TypeScript e build Vite: aprovados;
- bundle inicial: 194.126 bytes, 60,16% abaixo da linha de base;
- inspeção pública: aprovada.

### Navegador

Foram aprovados quatro cenários focais:

- edição em desktop;
- nova demanda em desktop;
- edição em mobile de 320 px;
- nova demanda em mobile de 320 px.

As provas confirmaram preservação dos campos, mensagens ao salvar, qualidade visual dos controles e ausência de overflow horizontal.

Os 22 cenários regressivos existentes também permaneceram aprovados em desktop e mobile, incluindo acessibilidade, navegação, filtros, modais, exportação e console.

## Auditoria transversal já publicada — Production

- deployment `dpl_7G72xFXcQUKtYELrGhXha1xi7UPE` em estado `READY`;
- target `production`;
- domínio principal: HTTP 200;
- `/demandas`: HTTP 200;
- `/admin`: HTTP 200;
- rewrites SPA preservados;
- assets da versão publicada carregados corretamente.

## Supabase remoto

As Rodadas técnicas 1, 2, 3 e 4, a correção responsiva e as Rodadas 3.1 e 3.2 não alteraram o banco remoto, dados, migrations, RLS ou regras.

Para a conclusão funcional inicial, a migration `20260801044712_r5_essential_harden_pre_r4_progress_status` permanece registrada remotamente. Ela não altera dados: apenas converte os dois contratos anteriores ao R4 em wrappers e deixa `EXECUTE` somente para `authenticated`. A verificação posterior confirmou 379 demandas ativas, zero excluídas, 764 históricos, `search_path` vazio e ausência de execução por `anon` ou `service_role` nesses wrappers.

## Endurecimento técnico integrado — 26 de outubro de 2026

Foi integrada pelo PR #196 uma rodada independente de endurecimento sem alteração funcional:

- CodeQL para JavaScript/TypeScript e GitHub Actions;
- headers HTTP básicos no `vercel.json`: `nosniff`, bloqueio de framing, `no-referrer` e restrição de APIs de navegador não utilizadas;
- nenhuma CSP nesta etapa, por depender da decisão de backend e de futuras integrações externas;
- nenhuma dependência npm, migration, RLS, dado ou regra de negócio alterada;
- proteção/ruleset da `main` permanece configuração externa a ser comprovada diretamente no GitHub;
- `Dependency health` e CodeQL concluíram com sucesso no SHA validado do PR;
- a autorização expressa da rodada foi reconciliada formalmente no Registro de Decisões em `TECH-HARDEN-001`; a proteção da `main` foi autorizada em `TECH-HARDEN-002`;
- ruleset importável `docs/maintenance/rulesets/cthr-main-protection.json` preparado para a branch padrão; a ativação administrativa ainda precisa ser confirmada no GitHub;
- secret scanning básico não exige instalação adicional no repositório público.

Evidência: `docs/maintenance/ENDURECIMENTO_TECNICO_2026-10-26.md`.

## Próxima etapa

Com a rodada de manutenção concluída, a próxima frente técnica de avaliação é a fundação B1 do Trilho B de migração, sujeita às decisões e autorizações específicas previstas na governança. O trabalho deve permanecer sem carga dos 3.201 registros reais em Production e com preservação integral dos dados legados, inclusive estados hoje incompatíveis com regras de criação do sistema novo.

**Frente visual independente:** a próxima análise de interface é a retomada do PR #215, preservando o processo de Preview, testes evolutivos e homologação artística antes de qualquer merge. Esta manutenção documental não inicia essa análise nem autoriza alteração visual.

O `fast-check` já disponível deve ser empregado nos testes gerativos das transformações quando o B1/B2 chegar a essa camada. pgTAP deve ser avaliado para invariantes locais de banco antes de qualquer adoção definitiva. `json-canonicalize` permanece reservado ao B2, quando os hashes canônicos de proveniência forem implementados.

A migração estrutural para TanStack Table 9 **já foi concluída** pelo PR #178; eventuais atualizações futuras são distintas dessa migração. Observabilidade, Lighthouse CI, MSW, ESLint 10 e TypeScript 7 permanecem frentes independentes, sem autorização automática. CodeQL passou a integrar a rodada de endurecimento técnico de 26/10.

Nenhuma extensão funcional do R5 avançado, R1 residual, R2 ou ciclos posteriores é autorizada por inferência. E2, segurança final e homologação consolidada do R12 permanecem gates antes da entrega final do produto.

## Ateliê profissional de design e infraestrutura visual — 29 de outubro de 2026

Aprovada pelo responsável do produto a implantação do repertório de ferramentas de design **para todo o CTRH**, com primeira alteração artística limitada à **barra lateral** e sujeita a aprovação visual independente.

O PR #208 introduz `impeccable-frontend-design` como skill coordenadora, mantendo Frontend Design, UI/UX Pro Max, Impeccable e Vercel Web Interface Guidelines como fontes especializadas; Apple HIG é referência estética. `AGENTS.md` passa a acionar esse método em tarefas visuais. Os recursos são **infraestrutura de trabalho de agente**, não bibliotecas importadas pelo runtime do aplicativo.

O Playwright fornece capturas do componente real e um inventário visual do produto em ambiente de teste. Os quatro SVGs Phosphor e o atlas HTML são candidatos de estudo; não substituem a marca, os ícones, as rotas ou a arte aprovada na operação. A publicação do PR não representa homologação de uma sidebar redesenhada.

As verificações de design e o fluxo de screenshots estão em `.github/workflows/design-tooling-check.yml` e `.github/workflows/sidebar-visual.yml`, respectivamente. O registro vinculante é `TECH-DESIGN-001`; a política vigente de homologação e publicação permanece aplicável.

## Referências documentais — governança, operação e registros históricos

Esta relação reúne fontes de natureza diferente: documentos vinculantes, referências técnicas e relatórios datados de execução. A autoridade e a ordem de leitura são as de `AGENTS.md` e do Registro de Decisões; a presença de um relatório nesta lista não o torna norma vigente. Para alterações visuais, aplica-se também `docs/design/PROTOCOLO_PERMANENTE_EVOLUCAO_VISUAL_CTRH.md`.

1. `docs/execution/ADENDO_GOVERNANCA_POR_ETAPA_CTRH_v2.0.4.md`;
2. `docs/product/PROTOCOLO_HOMOLOGACAO_DECISOES_PRODUTO_CTRH_v1.3.md`;
3. `docs/product/REGISTRO_DECISOES_PRODUTO_CTRH.md`;
4. `docs/product/PRINCIPIO_PRESERVACAO_INFORMACIONAL_CTRH_v1.0.md`;
5. `docs/product/POLITICA_SINCRONIZACAO_DOCUMENTAL_CTRH_v1.1.md`;
6. `docs/product/POLITICA_MANUTENCAO_DEPENDENCIAS_CTRH_v1.1.md`;
7. `docs/PRODUCT_CONTEXT.md`;
8. `docs/execution/Plano_Integrado_Reformulado_CTRH_v3.1.md`;
9. `docs/execution/Plano_Executivo_Operacao_Atual_CTRH_v1.2.md`;
10. `docs/execution/PLANO_CONSOLIDADO_MANUTENCAO_MODERNIZACAO_CTRH_v1.1.md`;
11. `docs/product/REGISTRO_OPORTUNIDADES_TECNICAS_MODERNIZACAO_CTRH_v1.1.md`;
12. `docs/architecture/ARQUITETURA_TANSTACK_QUERY_CTRH_v1.0.md`;
13. `docs/execution/RODADA_3_1_CONSOLIDACAO_DOCUMENTAL_2026-08-03.md`;
14. `docs/execution/RODADA_3_1_DIAGNOSTICO_KNIP_2026-08-03.md`;
15. `docs/execution/RODADA_3_2_PREPARACAO_TYPESCRIPT_2026-08-03.md`;
16. `docs/execution/RODADA_3_2_RESULTADO_FINAL_KNIP_2026-08-03.md`;
17. `docs/execution/ATUALIZACAO_COMPLETUDE_OPERACIONAL_2026-08-01.md`;
18. `docs/execution/RELATORIO_VALIDACAO_COMPLETUDE_OPERACIONAL_2026-08-01.md`;
19. `docs/execution/ATUALIZACAO_POS_R4_PRE_R5_2026-07-30.md`, como histórico de sequência;
20. `docs/product/PAUTA_DECISOES_R5_2026-07-30.md`, como pauta reconciliada;
21. `docs/adr/ADR-003-historico-e-exclusao-logica.md`;
22. `docs/execution/RELATORIO_VALIDACAO_R5_1_2026-07-30.md`;
23. `docs/execution/ENCERRAMENTO_R5_1_2026-07-30.md`;
24. `docs/execution/AUDITORIA_LAYOUT_INFORMACOES_INTERNAS_2026-07-30.md`;
25. `docs/execution/HISTORICO_DOCUMENTAL_CTRH.md`;
26. `docs/maintenance/BRACE_EXPANSION_SECURITY_2026-08-09.md`;
27. `docs/maintenance/DEPENDENCY_UPDATES_2026-08-29.md`;
28. `docs/maintenance/G1_QUERY_TOOLING_2026-08-29.md`;
29. `docs/maintenance/SUPABASE_CLI_2_116_0_2026-08-30.md`;
30. `docs/design/PROTOCOLO_PERMANENTE_EVOLUCAO_VISUAL_CTRH.md`;
31. este Handoff.

## Regra de continuidade

O projeto segue a sequência discutir, decidir, registrar, implementar e homologar.

Além disso, toda tarefa deve incluir avaliação de limites tecnológicos: quando uma atualização ou instalação puder produzir solução substantivamente superior, ela deve ser apresentada como proposta, sem instalação silenciosa e sem transformar recomendação em autorização.

Depois da manutenção de 29–30 de agosto, nenhuma nova modernização se abre automaticamente. A retomada dos trabalhos deve respeitar as autorizações em vigor: Trilho B de migração e a evolução visual específica expressamente aprovada podem ser planejados de forma independente, sem inferir autorização para novos ciclos. A próxima análise de interface é o PR #215; não implica autorização de merge.

## Governança visual permanente e ferramentas ChatGPT — 29 de outubro de 2026

- **PR #216:** corrigiu o YAML de `.github/workflows/design-tooling-check.yml`, com validação verde e integração à `main`.
- **PR #217:** preparou o plugin privado Visual Quality e a habilidade técnica de revisão de PRs. O plugin ChatGPT foi posteriormente atualizado à **versão 0.1.1**, de maneira independente da atualização do repositório.
- **PR #218:** publicou, com CI aprovado, o protocolo `docs/design/PROTOCOLO_PERMANENTE_EVOLUCAO_VISUAL_CTRH.md`, as regras no `AGENTS.md`, as skills coordenadoras e o checklist do template de PR.
- **Uso obrigatório:** sempre avaliar se a reprovação de teste é regressão, expectativa obsoleta, ambiente incompatível ou instabilidade; alterar testes somente para refletir decisões aprovadas, nunca ocultar defeitos; preferir notebooks/monitores de trabalho com mobile essencial; entregar preview real e capturas antes/depois identificadas para homologação humana.
- O **PR #215 continua isolado**, sem merge nem publicação artística. Na retomada, comparar o material do Gemini com o código efetivo antes de qualquer alteração.

## Ateliê Storybook de componentes reais — 29 de outubro de 2026

Em complemento à infraestrutura de design do PR #208, o PR #213 integra Storybook 10.6.x somente como dependência de desenvolvimento, mantendo os scripts Playwright já publicados. Suas histórias importam `SiteNavigation` e `BrandLogo` reais, sem reconstrução do produto e sem alterar a aparência operacional. A documentação técnica fica em `docs/design/STORYBOOK_CTRH_INTEGRACAO_REAL.md`; o registro de autorização é `TECH-DESIGN-002`.

O PR anterior #212 contém arquivos de exemplo do gerador e foi superado pela versão focada nos componentes reais. A execução de build e CI é obrigatória antes do merge, e a arte dos Arcos da Lapa permanece referência ainda não integrada à sidebar.
