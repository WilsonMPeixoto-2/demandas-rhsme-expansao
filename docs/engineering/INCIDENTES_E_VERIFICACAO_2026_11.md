# CTRH — evidências de instalação, CI e preview

**Registro histórico: 04/11/2026.** Complementa `AGENTS.md`, os atos de governança e a política `docs/product/POLITICA_MANUTENCAO_DEPENDENCIAS_CTRH_v1.1.md`. Não aprova novas atualizações ou releases por si só.

## Caso A — PR #226 (não resolvido na data)
- Branch `dependabot/npm_and_yarn/eslint-10.13.0`, commit `cc471ccdb2220dcc8410223e9bbce2ecb74c7472`; deploy Preview `dpl_4mznwxb4rLE1mNfzTCKYd8yMdW1e` = `ERROR`.
- Logs brutos da Vercel: `npm ci` falhou em `ERESOLVE`: `eslint@10.14.0` incompatível com a faixa peer `^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9` declarada por `eslint-plugin-jsx-a11y@6.10.2`.
- Linha estável da `main` mantinha `eslint@9.39.5`. A atualização não deve ser promovida sem resolver compatibilidade, sincronizar `@eslint/js` e passar pelos gates; não usar `--force`/`--legacy-peer-deps`.

## Caso B — PR #228 (falha corrigida na branch)
- Commit `36b5548113dc26274e4ee3f65940726e8bedc3ec`, deploy `dpl_CbpbGfXBzWWCGmajSmZwgTH4yrr6` = `ERROR`.
- Logs brutos: `npm ci` falhou em `EUSAGE` com o aviso `package.json` e `package-lock.json` fora de sincronia, incluindo `vitest`, `@vitest/coverage-v8`, `@vitejs/plugin-react`, `globals` e `knip`.
- Commit posterior `94d0d1220492db336e54346e937b2a79dc145a79` regenerou o lockfile. Deploy Preview `dpl_9zpZqye7ALEJYSVZu3ddn8dbrN1a` = `READY`. Isso valida o build do preview, **não** equivale a aprovação de merge pela governança do CTRH.

## Método reproduzível
1. Confirmar ambiente/commit/branch e `installCommand`, Node/npm, cache e escopo Vercel; comparar com a `main` `READY`.
2. Ler a **primeira linha fatal** dos logs de build, não apenas o erro resumido do painel.
3. Com `ERESOLVE`, reconstruir grafo peer e propor versão compatível; com `EUSAGE`, regenerar lockfile com npm oficial e provar `npm ci` limpo.
4. Executar `npm run check:full` e gates aplicáveis previstos no `AGENTS.md`; verificar preview e contratos de dados sem tocar Supabase de produção.
5. Dependabot deve seguir a política de dependências e homologação do produto. Não fechar PR nem alterar regras do Dependabot por mera conveniência sem análise/decisão.

**Evidências:** [PR #226](https://github.com/WilsonMPeixoto-2/demandas-rhsme-expansao/pull/226), [PR #228](https://github.com/WilsonMPeixoto-2/demandas-rhsme-expansao/pull/228), [Vercel CTRH](https://vercel.com/wilson-m-peixotos-projects/demandas-rhsme-expansao).

## Encerramentos verificados após o registro histórico
- **PR #228:** integrado à `main` no merge `05b9a6c6eff9a34ff03a72c649c2007f91aeed95`, com Production `READY`. A correção do lockfile tornou-se release, não apenas Preview.
- **PR #230:** integrado no merge `7378c36f5755210fb6820c94305298ab3c9434e6`, deployment de Production `dpl_EMweu2VWj6AS7aZ2hCKnvgeoPCjq` `READY`, domínio oficial HTTP 200. Atualizações seguras: Supabase JS 2.119.0, TanStack Query e complementos 5.106.0, Motion 14.9.1, tipos Node 26.6.6. Provas locais: 379 Vitest e 56 Playwright aprovados; quatro workflows remotos aprovados. Sem mudanças de negócio nem banco.
- **PR #226:** o commit do Dependabot foi rebaseado posteriormente, mas o peer incompatível de `eslint-plugin-jsx-a11y@6.10.2` segue limitado ao ESLint 9 segundo registro npm de 04/11/2026. Logo, atualizar a base não libera o ESLint 10; não reduzir regras de acessibilidade para aprovar esse PR.
- **Knip:** `npm run analyze:unused` foi executado até o fim em sandbox de 8 GiB, Node 24. Em 4 GiB, o parser OXC falhou na reserva do buffer de transferência; o aumento de recursos do ambiente resolveu essa limitação. Achados incluem `fast-check`, dependências transitivas usadas em verificação de compatibilidade e alguns exports não referenciados. Não houve remoção nem autofix.
