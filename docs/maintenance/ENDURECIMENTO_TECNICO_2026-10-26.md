# Endurecimento técnico — 26 de outubro de 2026

**Status:** IMPLEMENTADO E INTEGRADO NO PR #196  
**Escopo:** segurança estática e headers HTTP independentes da decisão de backend.

## 1. Objetivo

Adicionar proteções de baixo risco e alto retorno sem alterar regras de negócio, banco, autenticação, dados, bundle funcional ou dependências npm.

## 2. CodeQL

Foi adicionado o workflow `.github/workflows/codeql.yml` com:

- análise de JavaScript/TypeScript;
- análise dos próprios workflows do GitHub Actions;
- execução em pull requests para `main`;
- execução após push em `main`;
- execução semanal;
- execução manual;
- permissões mínimas explícitas;
- CodeQL Action v4, compatível com a documentação oficial vigente.

O CodeQL complementa `npm audit`: o audit trata vulnerabilidades conhecidas nas dependências; o CodeQL analisa fluxos e padrões inseguros no código do projeto.

## 3. Headers HTTP

O `vercel.json` passou a declarar, para todas as rotas:

- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: no-referrer`;
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`.

A Content Security Policy não foi incluída nesta etapa. A CSP depende das origens efetivamente utilizadas após a decisão entre Supabase e Google/Firebase e de eventual adoção de observabilidade ou Speed Insights.

## 4. Itens deliberadamente não alterados

- nenhuma dependência npm;
- nenhuma migration;
- nenhuma RLS ou grant;
- nenhum dado;
- nenhuma configuração do Supabase;
- nenhuma configuração do Firebase/Google;
- nenhum deploy em Production;
- nenhuma regra de negócio;
- nenhuma telemetria;
- nenhuma CSP;
- nenhum Sentry;
- nenhum Speed Insights.

## 5. Proteção da main

A auditoria confirmou anteriormente que `main` está sem proteção e sem ruleset. A criação do ruleset permanece uma configuração de repositório separada do código e deve exigir, no mínimo, PR e o gate `Dependency health`.

A alteração do ruleset não é representada por arquivo versionado; sua ativação deve ser comprovada diretamente no estado do GitHub.

## 6. Validação concluída

O PR #196 foi integrado no SHA `0d9f2469e67e9a185e09ae08677c062f0924fb27`.

Resultados no SHA do PR:

- `Dependency health`: **success**;
- CodeQL `actions`: **success**;
- CodeQL `javascript-typescript`: **success**.

A revisão automatizada identificou uma única pendência de governança: a autorização expressa do responsável havia ocorrido na conversa antes da implementação, mas não havia sido transcrita para o Registro de Decisões antes da criação da branch. A omissão documental foi reconciliada em `TECH-HARDEN-001`, sem ampliação de escopo.


## 7. Proteção da main — artefato de importação

Foi preparado o arquivo versionado `docs/maintenance/rulesets/cthr-main-protection.json`, compatível com a importação de rulesets do GitHub.

O ruleset:

- aplica-se somente à branch padrão;
- exige Pull Request;
- exige resolução das discussões de revisão;
- exige o check `Audit, lint, coverage, build and browser QA`, que corresponde ao job do workflow `Dependency health`;
- impede exclusão da branch;
- impede force push;
- não exige aprovação de terceiro, preservando o fluxo de manutenção de um repositório pessoal;
- não exige branch estritamente atualizada antes do merge, evitando repetição desnecessária do gate quando a base recebe alteração independente.

A conexão GitHub utilizada nesta execução possui acesso de conteúdo, pull requests e workflows, mas não possui permissão administrativa para criar ou alterar rulesets. Por isso, o arquivo foi preparado para importação pelo proprietário em `Settings > Rulesets > Rulesets > New ruleset > Import a ruleset`.

A proteção somente deve ser considerada **ativa** depois de o GitHub confirmar o ruleset no estado do repositório.

## 8. Secret scanning e push protection

O repositório é público. O GitHub executa secret scanning automaticamente em repositórios públicos, portanto não há pacote ou workflow adicional a instalar para a varredura básica.

A proteção de push em nível de usuário permanece uma proteção do GitHub.com para pushes em repositórios públicos. A proteção de push em nível de repositório é uma configuração administrativa de Secret Protection e não é exposta pela conexão GitHub usada nesta execução.

Nenhuma credencial, token ou segredo foi adicionado por esta rodada.
