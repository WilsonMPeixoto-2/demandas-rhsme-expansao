# Conciliação dos identificadores de migrations — 27/10/2026

## Escopo e evidências

Após a reativação do projeto Supabase `kdhekkzwcokfrpcrsllr`, a consulta de leitura às migrations remotas confirmou 24 registros. O repositório `main` também continha 24 arquivos SQL de migration, com os mesmos nomes descritivos. Apenas sete timestamps dos arquivos locais divergiam dos timestamps registrados em `supabase_migrations.schema_migrations`.

Este commit **renomeia exclusivamente esses sete arquivos**, conservando seus mesmos objetos Git (SHA dos blobs), sem alterar uma única linha de SQL. Não executa SQL no Supabase, não modifica a tabela de histórico remoto e não migra dados.

| Versão antiga no repositório | Versão registrada no Supabase | Migration |
| --- | --- | --- |
| `20260730023000` | `20260730063742` | `r4_deadlines_and_follow_up_rules` |
| `20260730023100` | `20260730063806` | `r4_deadline_consistency_constraints` |
| `20260730023200` | `20260730063832` | `r4_preserve_legacy_deadline_metadata` |
| `20260730023300` | `20260730063856` | `r4_final_deadline_state_constraints` |
| `20260730023400` | `20260730063923` | `r4_optional_reason_compatibility` |
| `20260730023500` | `20260730064021` | `r4_preserve_exceptional_internal_state` |
| `20260730170000` | `20260730180713` | `r5_1_disable_product_restore` |

## Verificações exigidas

1. Confirmar 24 migrations locais e 24 remotas com timestamps idênticos após o merge.
2. Rodar o gate de replay de migrations em banco efêmero; não reutilizar o banco de produção nesse teste.
3. Antes de qualquer novo DDL, rodar `supabase migration list --linked` e `supabase db push --dry-run` com o projeto de destino explicitamente conferido.
4. Confirmar schema e autorizações do banco real; a equivalência de nomes e versões **não constitui prova, por si só, de equivalência do SQL aplicado** nem substitui a inspeção do schema.

## Segurança operacional

Não usar `migration repair`, `db reset` nem reaplicar scripts na base de produção nesta reconciliação. Caso a verificação completa identifique divergência material de schema, registrar nova análise e migration específica, mediante autorização. O arquivo de teste CI (`.github/workflows/supabase-local-migrations.yml`) executa as migrations apenas contra instância local efêmera.
