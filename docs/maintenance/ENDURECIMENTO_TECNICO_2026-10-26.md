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

## 6. Encerramento

O PR #196 foi integrado após `Dependency health` e `CodeQL` concluírem com sucesso. A autorização expressa do responsável pelo produto está registrada como `TECH-HARDEN-A01` em `docs/product/REGISTRO_DECISOES_PRODUTO_CTRH.md`.
