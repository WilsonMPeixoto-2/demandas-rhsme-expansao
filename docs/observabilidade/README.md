# Observabilidade do CTRH — cadernos reproduzíveis

Escopo: **CTRH PROCESSOS** (Supabase). Material para Explorer & Notebooks e SQL Editor.
Consultas **somente leitura**, validadas em 28/10/2026 contra o esquema real.
Não criar tabelas, extensões, funções ou políticas ao executar estes cadernos.

## Cadernos disponíveis

1. [01 — Integridade e completude](01-integridade.sql): estoque agregado, preenchimento e chaves quebradas.
2. [02 — Desempenho PostgreSQL](02-desempenho.sql): `pg_stat_user_tables` e `pg_stat_statements`, sem extrair texto de SQL.
3. [03 — RLS e funções](03-permissoes.sql): inventário de RLS e permissões de execução.
4. [04 — Movimentações](04-movimentacao.sql): eventos mensais e distribuição por status.

**Como utilizar:** no Supabase Dashboard > Explorer & Notebooks (prévia),
crie um Notebook e copie cada bloco SQL correspondente, ou execute-o no SQL Editor.
A conexão atual permite executar SQL, mas **não cria Notebooks nativos automaticamente**.
O objetivo desta pasta é preservar consultas versionadas e revisáveis.

## Interpretação correta

- O produto está em preparação para retomada. A falta de movimentações atuais **não é incidente**.
- Eventos históricos, especialmente reatribuições em lote, **não representam produtividade**.
- Cobertura de campos é informacional, não atestado de acompanhamento do processo.
- `pg_stat_statements` mistura consultas internas do Supabase e da aplicação.
- Estatísticas de acesso SQL acumulam desde o último reset e podem não refletir o período exibido no Dashboard.
- Os perfis e a RLS seguem sendo controlados pelas RPCs e migrações existentes.
- Se um diagnóstico apontar risco, apure a causa e revise a migração correspondente. Não execute `UPDATE`, `DELETE`, `GRANT`, `CREATE` ou `DROP` por impulso.

## Monitoramento contínuo

Uma automação externa ao repositório monitora diariamente os estados oficiais
de deploy Vercel, checks GitHub e alertas de Supabase. Evita notificação
quando há somente desatualização do acervo legado.

## Acompanhamentos que dependem do Dashboard

- Habilitar o Web Analytics do projeto na Vercel: o SDK já está no React, mas o serviço não foi confirmado habilitado pela API.
- No Supabase, salvar estes scripts como Notebooks e, quando útil, criar Custom Reports.
- No GitHub, revisar regras de Copilot Code Review e proteção da `main` pelo menu administrativo.
- Verificar resultados reais do Speed Insights após a retomada e tráfego suficiente.

Referências oficiais:
- https://supabase.com/docs/guides/platform/metrics
- https://supabase.com/docs/guides/database/extensions/pg_stat_statements
- https://vercel.com/docs/speed-insights
- https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning
