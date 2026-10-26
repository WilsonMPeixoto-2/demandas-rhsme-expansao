# Auditoria de banco de dados e dependências — 26/10/2026

**Estado:** diagnóstico técnico concluído; atualização de dependências validada; nenhuma troca de provedor, reativação de banco, migration remota ou publicação em Production executada nesta entrega.

## 1. Conclusão executiva

A Central de Demandas CTRH está implementada sobre **Supabase**, não Firebase.

O backend canônico existente é o projeto Supabase **CTRH PROCESSOS** (`kdhekkzwcokfrpcrsllr`, `sa-east-1`). Em 26/10/2026, a API de gestão do Supabase reportou o projeto como **INACTIVE**. A tentativa de listar migrations remotas terminou por timeout de conexão, compatível com o projeto inativo.

Não existe no repositório:

- SDK Firebase;
- Firestore;
- `firebaseConfig`;
- variáveis `VITE_FIREBASE_*`;
- adaptador de dados Firebase;
- branch ou commit de migração Supabase → Firebase;
- procedimento implementado de migração do banco atual para Firebase.

A única ocorrência de Firebase em `supabase/config.toml` é o bloco padrão e desativado `[auth.third_party.firebase]`, destinado a aceitar Firebase Auth como provedor de autenticação de terceiros no Supabase. Isso **não** representa migração de banco.

## 2. Como a aplicação escolhe o backend hoje

`src/config/appConfig.ts` admite somente:

- modo `local`, exclusivo de desenvolvimento/testes;
- modo `supabase`;
- configuração inválida.

`src/services/createAppServices.ts` instancia somente serviços locais ou os serviços Supabase:

- `SupabaseAuthService`;
- `SupabaseDemandasRepository`;
- `SupabaseProfilesService`.

O build de Production possui fallback explícito para:

```text
https://kdhekkzwcokfrpcrsllr.supabase.co
```

e para a publishable key pública correspondente. Portanto, a ausência de variáveis públicas na Vercel não muda silenciosamente o provedor. A consulta administrativa das variáveis da Vercel retornou HTTP 403 para a credencial atual do conector, mas isso não impede identificar o backend usado pelo bundle.

## 3. Dependências do Supabase existentes no produto

A implementação atual usa capacidades que precisam ser consideradas em qualquer troca de provedor:

- PostgreSQL relacional;
- Supabase Auth;
- Row Level Security;
- RPCs/funções transacionais;
- Realtime;
- migrations SQL versionadas;
- autoria por `auth.uid()`;
- regras de papel no banco;
- criação, edição, andamento, status e exclusão lógica auditáveis na mesma transação;
- histórico operacional;
- importação/migração do legado baseada em Postgres/Supabase.

Por isso, substituir o Supabase por Firestore não é troca de configuração. Exigiria reescrever persistência, transações, segurança/autorização, consultas e parte relevante da camada de serviços.

## 4. Migração existente no repositório

`docs/MIGRACAO_LEGADO.md` trata de **dados do sistema legado → Supabase**.

Esse fluxo histórico:

- recebe CSV/XLSX;
- prepara e normaliza o lote;
- faz dry-run por RPC no Supabase;
- não acessa Firebase;
- não migra usuários/senhas;
- não está autorizado para a próxima carga real enquanto o desenho B1/B2 não for aprovado.

Logo, não há migração Supabase → Firebase configurada.

## 5. Caminho A — reativar o Supabase atual

Este é o caminho de menor mudança arquitetural.

A ação material que falta é **restaurar/despausar o projeto `kdhekkzwcokfrpcrsllr`**. Após retornar a `ACTIVE_HEALTHY`, a reativação deve ser tratada como incompleta até executar:

1. listar migrations remotas e comparar com `supabase/migrations/`;
2. executar `db push --dry-run` antes de qualquer DDL;
3. conferir schema, tabelas, índices e funções/RPCs operacionais;
4. conferir grants e RLS por papel;
5. conferir Auth e o redirect de recuperação de senha;
6. testar leitura autenticada e Realtime;
7. executar Advisors de segurança e desempenho;
8. conferir contagens e invariantes dos dados existentes;
9. executar smoke funcional sem escrita destrutiva;
10. somente depois considerar nova publicação da aplicação.

Nenhuma dessas etapas exige mudança de frontend para continuar no Supabase.

## 6. Caminho B — mover para o ecossistema Firebase/Google

Se a decisão for usar Google, **Firestore não é a correspondência arquitetural mais próxima** do CTRH atual.

Desde 2026, o produto anteriormente chamado Firebase Data Connect chama-se **Firebase SQL Connect**. Ele trabalha com **Cloud SQL for PostgreSQL**, preservando um modelo relacional muito mais próximo do banco atual.

Referências oficiais:

- Firebase SQL Connect: https://firebase.google.com/docs/data-connect
- Existing PostgreSQL / brownfield: https://firebase.google.com/docs/data-connect/sql-migration
- Cloud SQL PostgreSQL import/export: https://cloud.google.com/sql/docs/postgres/import-export
- Database Migration Service para PostgreSQL: https://cloud.google.com/database-migration/docs/postgres

### Migração recomendada se Google for escolhido

1. criar/selecionar o projeto Firebase/GCP;
2. provisionar Cloud SQL for PostgreSQL;
3. restaurar temporariamente o Supabase atual para permitir extração consistente;
4. obter backup/snapshot e inventário de schema;
5. migrar PostgreSQL com Database Migration Service ou `pg_dump/pg_restore`, conforme a estratégia escolhida;
6. validar tabelas, constraints, funções e dados;
7. redesenhar os contratos hoje dependentes de RLS/RPC/Auth do Supabase;
8. decidir e implementar a estratégia de autenticação;
9. configurar Firebase SQL Connect e conectores necessários, ou outra camada de acesso ao Cloud SQL;
10. criar adaptadores de aplicação sem apagar o backend Supabase antes da homologação;
11. executar testes de equivalência funcional e segurança;
12. fazer cutover somente depois de reconciliação e rollback comprovados.

A migração para Google deve manter o Supabase como origem recuperável até a validação final. Não há motivo técnico para converter o domínio relacional do CTRH em documentos Firestore apenas para adotar Firebase.

## 7. Situação da Vercel

Production permanece no deployment:

```text
dpl_EqrEWJ4B9RVjSbbrSuuWNKe45YBN
SHA 706570480288e60cf7070c3a4648fa6d37d9f8fb
```

O deployment está `READY`. O deploy automático continua bloqueado. Esta manutenção não publica a nova `main`.

## 8. Atualização de dependências — 26/10/2026

A instalação limpa da baseline de 03/09 passou a reportar **10 vulnerabilidades**, sendo 6 altas e 4 moderadas. O lote candidato foi atualizado sem `--force` e sem `--legacy-peer-deps`; `npm audit fix` foi usado somente na forma não destrutiva.

### Versões atualizadas

Runtime:

- `@hookform/resolvers` 5.9.1 → 5.9.2;
- Radix Alert Dialog 1.1.23 → 1.2.1;
- Radix Dialog 1.1.23 → 1.3.1;
- Radix Dropdown Menu 2.1.24 → 2.2.1;
- Supabase JS 2.114.0 → 2.118.0;
- TanStack Query 5.102.8 → 5.105.0;
- TanStack Table 9.2.4 → 9.3.1;
- Motion 13.2.0 → 14.6.0;
- React/React DOM 19.2.8 → 19.3.1;
- React Hook Form 7.87.0 → 7.91.0;
- React Router 8.3.1 → 8.5.0;
- Zod 4.5.4 → 4.6.7.

Desenvolvimento:

- Axe Playwright 4.13.0 → 4.14.0;
- Playwright 1.62.1 → 1.64.1;
- TanStack Query ESLint/Devtools 5.102.8 → 5.105.0;
- Testing Library user-event 14.6.7 → 14.6.8;
- tipos Node 26.4.1 → 26.6.5;
- tipos React 19.2.18 → 19.3.0;
- tipos React DOM 19.2.5 → 19.3.0;
- plugin React/Vite 6.1.1 → 6.1.2;
- Vitest + cobertura 4.1.11 → 5.0.5;
- csv-parse 7.0.2 → 7.0.3;
- fast-check 4.9.0 → 4.10.2;
- globals 17.12.0 → 17.13.0;
- JSDOM 30.0.1 → 30.1.3;
- JSZip 3.10.1 → 3.10.2;
- Knip 6.34.0 → 6.43.0;
- typescript-eslint 8.69.0 → 8.72.1;
- Vite 8.2.2 → 8.3.5.

### Majors deliberadamente não forçadas

- **TypeScript 7.0.2:** `typescript-eslint@8.72.1` ainda declara TypeScript `<6.1.0`.
- **ESLint 10.x / @eslint/js 10:** `eslint-plugin-jsx-a11y@6.10.2` continua declarando peer somente até ESLint 9.
- **@hookform/resolvers 6.0.0:** instalação limpa produz `ERESOLVE` por conflito de peers opcionais na cadeia `effect/@typeschema`. Mantida a última versão 5.x, 5.9.2.

## 9. Validação do candidato

Executado com Node 24:

- `npm audit --audit-level=high`: **0 vulnerabilidades**;
- assinaturas do registry: **583 verificadas**;
- attestations: **174 verificadas**;
- compatibilidade transitiva: **5/5**;
- consistência documental: **9/9**;
- lint: aprovado;
- testes unitários/integração: **365/365** em **80 arquivos**;
- cobertura global: 82,43% linhas, 81,56% funções, 73,89% branches;
- TypeScript/build: aprovado;
- Vite 8.3.5: 953 módulos transformados;
- orçamento de bundle: aprovado;
- bundle inicial: 249.599 bytes, ainda 48,77% abaixo da baseline;
- inspeção de bundle público: aprovada;
- Query Devtools: confirmado fora do bundle de Production.

O sandbox Vercel não possui as bibliotecas Linux nativas exigidas pelo Chromium novo e não oferece `apt-get`; por isso o E2E de navegador não é considerado validado localmente. O workflow oficial do GitHub instala Chromium com `playwright install --with-deps chromium` e é o gate autoritativo para os 42 cenários desktop/mobile desta atualização.

## 10. Limites desta entrega

Não foram executados:

- restore/despause do Supabase;
- criação de Firebase, Firestore, SQL Connect ou Cloud SQL;
- migração de dados;
- alteração de Auth;
- alteração de RLS/RPC/schema remoto;
- escrita em Production;
- publicação Vercel Production.

A escolha entre reativar Supabase e migrar para Google permanece uma decisão arquitetural explícita, agora com os dois caminhos tecnicamente delimitados.
