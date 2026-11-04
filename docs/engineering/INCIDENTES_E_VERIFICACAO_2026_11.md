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
