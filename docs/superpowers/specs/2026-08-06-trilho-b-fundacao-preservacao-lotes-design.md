# Trilho B — Fundação de preservação e migração por lotes

**Data:** 6 de agosto de 2026  
**Status:** especificação técnica para revisão do responsável pelo produto  
**Repositório:** `WilsonMPeixoto-2/demandas-rhsme-expansao`  
**Base analisada:** `main` em `f60acc3fa7bc69761a9c46bce824935c450e1de6`  
**Supabase de referência:** `CTRH PROCESSOS` (`kdhekkzwcokfrpcrsllr`)  
**Efeito deste documento:** define arquitetura e limites; não autoriza carga real, aplicação de migration em Production, publicação na Vercel ou promoção de dados.

---

## 1. Objetivo

Criar a fundação técnica do Trilho B para receber integralmente o snapshot real do Firebase, preservar todos os documentos e eventos históricos e permitir normalização, correlação e promoção operacional em lotes pequenos, auditáveis e reversíveis.

O desenho separa duas responsabilidades:

1. **preservação histórica integral**, que deve aceitar o acervo como ele existe;
2. **operação atual do SITE CTRH**, que continua submetida às regras vigentes de status, responsável, prazo, próxima providência, classificação, permissões e auditoria.

A camada operacional `public.sme_demandas` não será transformada em depósito do payload bruto do Firebase.

---

## 2. Fatos verificados que condicionam o desenho

### 2.1 Acervo real disponível

O snapshot integral contém:

- 3.201 documentos de demanda;
- 9.288 eventos históricos;
- IDs originais do Firestore;
- datas técnicas de criação e atualização;
- variações históricas dos nomes dos campos;
- valores que não obedecem integralmente aos domínios atuais.

### 2.2 Estado atual do Supabase

A base operacional possui:

- 379 demandas;
- 764 eventos em `sme_historico`;
- 379 demandas marcadas como `origem = legado`;
- 369 demandas sem prazo interno;
- 354 demandas sem prazo final;
- 1 demanda sem `responsavel_id`;
- 0 demandas logicamente excluídas;
- 13 perfis ativos.

A base atual representa uma incorporação parcial e resumida do legado, não a reprodução integral do histórico do Firebase.

### 2.3 Restrições do modelo operacional

`public.sme_demandas` possui, entre outras regras:

- número único literal;
- número único após normalização;
- seis status operacionais;
- três tipos;
- responsável oficial opcional por UUID;
- estados controlados de prazo;
- uma representação operacional por número normalizado.

Essas regras são adequadas ao trabalho atual, mas não conseguem armazenar literalmente todos os documentos brutos do Firebase.

### 2.4 Limitações do importador tabular existente

O importador atual foi criado para CSV ou XLSX saneado. Ele:

- rejeita número fora do padrão;
- rejeita duplicidade;
- rejeita colisão com demanda existente;
- exige status, tipo e classificação reconhecidos;
- exige responsável textual preenchido;
- cria um único evento genérico de importação;
- não preserva o documento bruto;
- não preserva o ID original do Firestore;
- não importa os 9.288 eventos;
- não diferencia versões ou documentos repetidos do mesmo número.

O novo Trilho B reutilizará os princípios de hash, dry-run, idempotência, transação e reconciliação, mas não ampliará silenciosamente esse importador para um problema estruturalmente diferente.

---

## 3. Alternativas avaliadas

### Alternativa A — Inserir diretamente em `sme_demandas`

**Vantagem:** menor quantidade inicial de estruturas.

**Problemas:** colisão com as 379 demandas atuais, impossibilidade de preservar duplicidades, coerção de domínios históricos, risco de sobrescrever trabalho posterior e ausência de local seguro para guardar o payload original.

**Decisão:** rejeitada.

### Alternativa B — Manter tudo em arquivos e promover diretamente

**Vantagem:** menor alteração de schema.

**Problemas:** rastreabilidade distribuída, reconciliação difícil, maior risco de duplicação e ausência de relacionamento persistente entre fonte, evento, pendência e demanda operacional.

**Decisão:** rejeitada como arquitetura principal. Os arquivos originais continuam preservados externamente, mas o banco receberá uma representação histórica privada e auditável.

### Alternativa C — Camada privada de preservação, análise e promoção

O snapshot integral é recebido em estruturas privadas append-only. Normalização, correlação e promoção são executadas em etapas distintas e vinculadas por hashes e IDs de origem.

**Vantagens:** preservação integral, repetição segura, isolamento entre fonte e operação, tratamento explícito de duplicidades e conflitos, lotes pequenos sem fragmentar a fonte original e reconciliação das 379 demandas sem apagar trabalho posterior.

**Custo:** maior investimento inicial em schema e testes.

**Decisão recomendada e aprovada conceitualmente:** Alternativa C.

---

## 4. Decomposição do programa

Cada pacote terá branch e PR próprios, aprovação, testes e documentação sincronizada.

### B0 — Especificação e autorização

Entrega esta especificação, o registro das decisões aprovadas e o plano detalhado do B1. Não inclui código funcional, migration ou dados reais.

### B1 — Fundação privada de preservação

Cria somente as estruturas mínimas para representar fonte, blocos técnicos, documentos e eventos. Inclui constraints, índices essenciais, imutabilidade e testes sintéticos. Não inclui ingestão real.

### B2 — Validador e ingestão do snapshot

Cria leitor do JSON integral, verificação de manifesto e hash, divisão técnica em blocos, dry-run, ingestão privada idempotente e recibos. A primeira execução real depende de autorização separada.

### B3 — Normalização e inventário de pendências

Cria regras versionadas de normalização segura, interpretações, agrupamento de duplicidades e inventário de status, tipos, classificações, responsáveis, datas e identificadores. Não promove automaticamente dados à carteira.

### B4 — Reconciliação das 379 demandas atuais

Associa documentos do Firebase às demandas existentes, compara campos, preserva alterações posteriores do SITE CTRH e identifica eventos históricos ausentes.

### B5 — Piloto de promoção P0

Executa dry-run e promoção controlada de 25 grupos representativos, com homologação da interface, históricos e relatório antes/depois.

### B6 — Promoção progressiva P1 a P7

Aplica lotes pequenos classificados por risco e encerra somente após contabilização de 3.201 documentos e 9.288 eventos.

---

## 5. Escopo exato do primeiro pacote implementável: B1

O B1 cria somente quatro tabelas privadas e os mecanismos necessários para protegê-las. Estruturas de análise, correlação e promoção serão criadas nos pacotes que efetivamente as utilizarem.

### 5.1 Regras comuns

Usar o schema `private`, já existente.

Todas as tabelas do B1:

- terão RLS habilitada;
- não terão policies para `anon` ou `authenticated`;
- terão `REVOKE ALL` para `public`, `anon` e `authenticated`;
- não serão consultadas diretamente pelo frontend;
- serão acessadas somente por rotinas administrativas autorizadas em pacote posterior;
- usarão UUID gerado por `extensions.gen_random_uuid()` quando o identificador não for `bigint identity`.

### 5.2 `private.legacy_sources`

Uma linha por fonte integral recebida.

Campos:

- `id uuid primary key default extensions.gen_random_uuid()`;
- `source_system text not null`;
- `source_project text not null`;
- `source_collection text not null`;
- `extracted_at timestamptz not null`;
- `source_file_sha256 text not null unique`;
- `expected_document_count integer not null`;
- `expected_event_count integer not null`;
- `format_version integer not null`;
- `status text not null`;
- `created_at timestamptz not null default now()`;
- `completed_at timestamptz`.

Estados permitidos:

- `registered`;
- `ingesting`;
- `ingested`;
- `reconciled`;
- `rejected`.

Constraints:

- hash com 64 caracteres hexadecimais minúsculos;
- quantidades esperadas positivas;
- `format_version > 0`;
- `completed_at` obrigatório para `ingested`, `reconciled` e `rejected`;
- `completed_at` nulo para `registered` e `ingesting`.

### 5.3 `private.legacy_ingestion_batches`

Uma linha por bloco técnico de ingestão.

Campos:

- `id uuid primary key default extensions.gen_random_uuid()`;
- `source_id uuid not null references private.legacy_sources(id) on delete restrict`;
- `batch_number integer not null`;
- `first_document_ordinal integer not null`;
- `last_document_ordinal integer not null`;
- `expected_document_count integer not null`;
- `expected_event_count integer not null`;
- `payload_sha256 text not null`;
- `status text not null`;
- `attempt_count integer not null default 0`;
- `started_at timestamptz`;
- `completed_at timestamptz`;
- `failure_code text`;
- `created_at timestamptz not null default now()`.

Estados permitidos:

- `registered`;
- `processing`;
- `completed`;
- `failed`.

Constraints:

- `unique (source_id, batch_number)`;
- `unique (source_id, id)` para sustentar a FK composta dos documentos;
- `batch_number > 0`;
- ordinais positivos e `last_document_ordinal >= first_document_ordinal`;
- `expected_document_count = last_document_ordinal - first_document_ordinal + 1`;
- `expected_event_count >= 0`;
- hash válido;
- `attempt_count >= 0`;
- lote `completed` exige `completed_at` e não admite `failure_code`;
- lote `failed` exige `failure_code` e não admite `completed_at`.

### 5.4 `private.legacy_documents`

Uma linha por documento original do Firestore.

Campos:

- `id bigint generated always as identity primary key`;
- `source_id uuid not null references private.legacy_sources(id) on delete restrict`;
- `ingestion_batch_id uuid not null`;
- `source_document_id text not null`;
- `source_document_path text not null`;
- `source_ordinal integer not null`;
- `source_create_time timestamptz`;
- `source_update_time timestamptz`;
- `source_payload jsonb not null`;
- `decoded_payload jsonb not null`;
- `source_payload_sha256 text not null`;
- `processing_state text not null default 'received'`;
- `created_at timestamptz not null default now()`.

Estados previstos desde a fundação:

- `received`;
- `normalized`;
- `fit`;
- `pending`;
- `conflicting`;
- `promoted`;
- `isolated`.

Constraints:

- `foreign key (source_id, ingestion_batch_id) references private.legacy_ingestion_batches(source_id, id) on delete restrict`;
- `unique (source_id, source_document_id)`;
- `unique (source_id, source_ordinal)`;
- `source_ordinal > 0`;
- IDs e caminhos não vazios e sem espaços externos;
- hash válido;
- `processing_state` limitado aos estados previstos;
- `source_update_time >= source_create_time` quando ambas existirem.

Um trigger de integridade verificará que `source_ordinal` está dentro de `first_document_ordinal` e `last_document_ordinal` do lote informado. Assim, um documento não pode ser associado a lote da mesma fonte com intervalo incompatível.

`source_payload_sha256` representa o objeto individual em serialização canônica definida pelo importador. A prova byte a byte do arquivo completo permanece em `legacy_sources.source_file_sha256`.

### 5.5 `private.legacy_events`

Uma linha por evento histórico do documento.

Campos:

- `id bigint generated always as identity primary key`;
- `legacy_document_id bigint not null references private.legacy_documents(id) on delete restrict`;
- `source_event_ordinal integer not null`;
- `source_status text`;
- `source_text text`;
- `source_user text`;
- `source_event_at timestamptz`;
- `source_payload jsonb not null`;
- `event_sha256 text not null`;
- `processing_state text not null default 'received'`;
- `created_at timestamptz not null default now()`.

Constraints:

- `unique (legacy_document_id, source_event_ordinal)`;
- `source_event_ordinal > 0`;
- hash válido;
- `processing_state` limitado aos estados previstos;
- comentário textual vazio permitido;
- status, usuário ou data ausentes permitidos;
- índice não único por `event_sha256` para auditoria e diagnóstico, sem apagar eventos idênticos repetidos em posições diferentes.

Nenhum evento é inserido automaticamente em `public.sme_historico` no B1 ou B2.

### 5.6 Imutabilidade do conteúdo de origem

O B1 criará trigger privada que rejeita alteração dos seguintes campos depois da inserção:

- identidade e metadados da fonte após seu registro;
- identidade, caminho, lote, ordinal, datas, payloads e hash do documento;
- documento de origem, ordinal, valores históricos, payload e hash do evento.

Campos de controle como `status`, `processing_state`, horários de processamento e `attempt_count` poderão mudar somente por rotinas administrativas futuras. O trigger não permitirá que uma rotina de normalização reescreva a fonte.

---

## 6. Estruturas futuras, fora do B1

Essas estruturas fazem parte da arquitetura aprovada, mas serão detalhadas e criadas somente quando seus pacotes começarem.

### B3

- `private.legacy_document_interpretations`;
- `private.legacy_event_interpretations`;
- `private.legacy_issues`;
- `private.legacy_duplicate_groups`.

Cada interpretação armazenará valor original referenciado, valor normalizado, valor operacional proposto, regra, versão e confiança. O payload de origem continuará imutável.

### B4

- `private.legacy_demand_correlations`.

Tipos previstos: `same_record`, `version_of`, `duplicate_candidate`, `history_only` e `unrelated`. Correlações ambíguas nunca serão aprovadas automaticamente. `approved_by` será UUID com FK para `public.perfis_usuarios(id)`.

### B5 e B6

- `private.legacy_promotion_batches`;
- `private.legacy_promotion_items`.

Ações previstas: `create_operational`, `enrich_existing`, `history_only` e `hold`. O ledger registrará hash, ruleset, recibo do dry-run, resultado e vínculo com a fonte.

---

## 7. Integridade e identidade

### 7.1 Identidade da fonte

A identidade de um documento legado é:

```text
source_id + source_document_id
```

O número da demanda não é usado como identidade da fonte, porque existem documentos repetidos e versões históricas.

### 7.2 Hashes

Serão preservados três níveis:

1. `source_file_sha256` — bytes exatos do arquivo integral;
2. `payload_sha256` — conteúdo canônico de cada bloco técnico;
3. `source_payload_sha256` e `event_sha256` — documento e evento individuais em serialização canônica.

O hash do arquivo integral sempre prevalece como prova de integralidade. Dividir o processamento em blocos não cria novas fontes independentes.

### 7.3 Idempotência

Reexecutar a mesma fonte, bloco, documento ou evento deve retornar estado já conhecido ou atualizar somente o controle da tentativa, sem criar duplicidade.

Eventos historicamente idênticos em posições diferentes são preservados. Idempotência usa documento + ordinal, não deduplicação semântica por texto ou hash.

---

## 8. Fluxo de dados

```text
arquivo integral externo e imutável
→ validação de bytes, manifesto e hash
→ registro de legacy_sources
→ preparação dos blocos técnicos
→ dry-run de contagens e hashes
→ ingestão privada de documentos e eventos
→ reconciliação integral da fonte
→ normalização versionada
→ inventário de pendências e duplicidades
→ correlação com sme_demandas
→ preparação do lote de promoção
→ dry-run operacional
→ aprovação expressa
→ aplicação atômica do lote
→ reconciliação pós-lote
```

A passagem de uma etapa para outra não altera o payload original.

---

## 9. Estratégia de lotes

### 9.1 Blocos técnicos de ingestão

O snapshot continua sendo uma única fonte. A ingestão será inicialmente dividida em:

- 12 blocos de até 250 documentos;
- 1 bloco final de 201 documentos.

Os eventos acompanham sempre o documento correspondente. Um documento e seus eventos nunca são separados entre blocos.

O tamanho de 250 pode ser reduzido por limite comprovado, mas não ampliado antes de medição real de tempo, memória e payload.

### 9.2 Categorias de promoção

- **P0:** piloto com 25 grupos representativos;
- **P1:** reconciliação das 379 demandas atuais em aproximadamente quatro lotes;
- **P2:** correspondências diretas inéditas, até 100 demandas por lote;
- **P3:** responsáveis pendentes ou ambíguos, 50 a 100 por lote;
- **P4:** domínios históricos, 25 a 50 por lote;
- **P5:** duplicidades e versões, 10 a 25 grupos completos por lote;
- **P6:** número ausente ou fora do padrão, até 25 por lote;
- **P7:** excluídos, arquivados e estados históricos especiais, 25 a 50 por lote.

Nenhuma categoria autoriza por si só a promoção. Cada lote precisa de manifesto, dry-run, aprovação e reconciliação.

---

## 10. Regras permanentes de transformação

O B1 não implementa transformação, mas prepara o armazenamento sob estas regras:

- valor original sempre preservado;
- normalização segura não substitui o original;
- aproximação por semelhança não cria vínculo automático;
- ausência de UUID não apaga o nome histórico;
- classificação desconhecida não vira `Outros` automaticamente;
- status antigo não vira `Encerrado` automaticamente;
- ausência de prazo não vira data inventada;
- par de prazos invertido não é corrigido silenciosamente;
- comentário vazio não elimina evento;
- duplicidade de número não implica descarte;
- alteração feita no sistema novo não é sobrescrita pela fotografia histórica.

Número normalizado isolado não basta para correlação determinística quando houver mais de um documento de origem no grupo.

---

## 11. Eventos históricos

Todos os 9.288 eventos serão preservados em `private.legacy_events`, inclusive os que possuem texto vazio.

Eventos brutos não serão inseridos diretamente em `public.sme_historico` quando:

- o status não pertencer ao domínio operacional;
- o autor for apenas texto histórico sem identidade comprovada;
- o evento for duplicado ou versão conflitante;
- a relação com a demanda operacional ainda estiver pendente.

Os eventos técnicos já existentes no Supabase permanecem preservados. O processo não os apaga nem afirma que vieram do Firebase.

A apresentação ao usuário e eventual projeção para o histórico operacional serão desenhadas após o B3 e o B4 demonstrarem os formatos reais.

---

## 12. Segurança e privacidade

- Nenhum dado real será commitado no Git.
- Nenhum payload real aparecerá em fixture, screenshot, log de CI, comentário de PR ou artefato público.
- Chave administrativa nunca será usada no frontend.
- Scripts administrativos usarão variáveis de ambiente e modo explícito.
- O default de qualquer importador será `dry-run`.
- O modo de aplicação exigirá recibo correspondente ao mesmo hash.
- Tabelas privadas não terão acesso direto para usuários autenticados.
- Testes de migration usarão somente dados sintéticos.
- O projeto Supabase Production não será alterado no B0.
- A migration do B1 somente será aplicada em Production depois de PR, replay integral, testes por papel, revisão de grants, Advisors e autorização expressa separada.

---

## 13. Falhas e retomada

### Falha antes da gravação

Hash, manifesto, formato ou contagem divergente impedem o registro do bloco.

### Falha durante um bloco

Cada bloco técnico será transacional. Falha em qualquer documento ou evento cancela integralmente o bloco. Blocos anteriores concluídos permanecem válidos.

O lote recebe `status = failed`, `failure_code` controlado e incremento de `attempt_count`. Nenhum payload real integra a mensagem de erro.

### Retomada

A reexecução identifica fonte e lote pelo hash. Itens concluídos são reconciliados e não inseridos novamente.

### Fonte incompleta

A fonte somente muda para `ingested` quando:

- 3.201 documentos estiverem contabilizados;
- 9.288 eventos estiverem contabilizados;
- todos os blocos estiverem concluídos;
- nenhum evento estiver órfão;
- nenhum documento estiver associado a mais de uma posição;
- o hash integral continuar igual ao manifesto.

Caso contrário, permanece `ingesting` ou é marcada `rejected`, sem promoção operacional.

---

## 14. Rollback e reversibilidade

### B1

O B1 é aditivo. O rollback técnico remove apenas as estruturas novas quando estiver comprovado que nenhuma fonte real foi carregada.

### B2

A ingestão privada não altera `public.sme_demandas` nem `public.sme_historico`. Um bloco falho é revertido pela própria transação.

Uma fonte real concluída não será apagada para corrigir interpretação. A correção ocorre por nova regra, ocorrência ou correlação.

### Promoções futuras

Cada lote de promoção será atômico e armazenará a fotografia mínima necessária para reconciliação. Depois de uso operacional, rollback destrutivo é proibido; correções serão compensatórias e preservarão fonte, lote e auditoria.

---

## 15. Testes obrigatórios do B1

O pacote deverá provar, com dados sintéticos:

1. criação das quatro tabelas, constraints e índices;
2. ausência de grants para `anon` e `authenticated`;
3. RLS habilitada em todas as tabelas novas;
4. rejeição de hash inválido;
5. rejeição de contagem não positiva;
6. rejeição de lote com intervalo incoerente;
7. rejeição de documento associado a lote de outra fonte;
8. rejeição de documento com ordinal fora do intervalo do lote;
9. idempotência da identidade da fonte;
10. idempotência do documento por ID do Firestore;
11. preservação de dois documentos cujos payloads contenham o mesmo número operacional;
12. preservação de eventos idênticos em ordinais diferentes;
13. preservação de evento com comentário vazio;
14. preservação de status histórico desconhecido;
15. rejeição de evento órfão;
16. imutabilidade do payload e metadados de origem;
17. impossibilidade de alterar fonte concluída;
18. ausência de qualquer escrita em `sme_demandas` e `sme_historico`;
19. replay integral de todas as migrations em ambiente efêmero;
20. reversão integral dos dados sintéticos;
21. geração de tipos compatível com o schema resultante.

O gate global do repositório permanece obrigatório.

---

## 16. Dependências e pacotes

### Decisão para B1

Nenhuma nova dependência é necessária. O pacote é predominantemente SQL e testes de migration.

A pilha atual já possui Node.js 24, TypeScript 6, `@supabase/supabase-js`, Zod, Vitest, bibliotecas de CSV e Excel e módulos nativos como `node:crypto` e `node:fs`.

### Decisão inicial para B2

O snapshot com 3.201 documentos é pequeno o suficiente para validação controlada em memória usando módulos nativos e Zod. Biblioteca de streaming JSON não será instalada preventivamente.

Nova dependência somente será proposta se medição comprovar pelo menos um destes limites:

- arquivo superior a 50 MB;
- memória de processo desproporcional;
- tempo de parse que prejudique a repetição do dry-run;
- necessidade de JSON incremental que não possa ser implementada com segurança usando recursos nativos.

Qualquer instalação terá proposta separada com compatibilidade, segurança, bundle, manutenção e rollback. Dependência administrativa não deverá integrar o bundle público.

---

## 17. Estrutura prevista do B1

O plano detalhado deverá considerar:

- nova migration em `supabase/migrations/`;
- testes no padrão atual de `supabase/migrations/migration.test.ts` ou arquivo dedicado;
- atualização dos tipos somente quando necessária aos testes ou a ferramenta administrativa;
- atualização do Registro de Decisões após aprovação;
- atualização de `docs/PRODUCT_CONTEXT.md`;
- atualização de `docs/HANDOFF.md`;
- atualização do Plano Integrado quando necessária para registrar o estado efetivamente implementado;
- nenhum arquivo real em `data/`, `public/`, fixtures ou artefatos versionados.

A decomposição exata de arquivos será fixada no plano de implementação depois da revisão desta especificação.

---

## 18. Critérios de aceitação do B1

O B1 estará concluído quando:

- a migration for exclusivamente aditiva;
- somente as quatro tabelas mínimas forem criadas;
- nenhuma tabela operacional for modificada;
- nenhuma linha real for inserida;
- todas as estruturas privadas possuírem proteção adequada;
- os testes sintéticos cobrirem integridade, idempotência e imutabilidade;
- o replay integral das migrations passar;
- os gates do repositório passarem;
- documentação e decisões estiverem sincronizadas;
- o PR estiver aprovado;
- qualquer aplicação em Production tiver autorização separada;
- Vercel e frontend permanecerem inalterados.

---

## 19. Escopo excluído do B1

O B1 não inclui:

- leitura do snapshot real;
- commit de dados reais;
- importação em Production;
- tabelas de interpretação, pendência, correlação ou promoção;
- correlação de responsáveis;
- normalização de status ou classificação;
- criação de demanda operacional;
- atualização das 379 demandas;
- importação de eventos para `sme_historico`;
- tela administrativa;
- alteração de RLS existente;
- modificação de RPC operacional;
- mudança em Vercel;
- pacote de streaming JSON;
- limpeza do importador tabular existente.

---

## 20. Gate de revisão

Após aprovação desta especificação:

1. registrar a autorização do B1 no Registro de Decisões;
2. atualizar os documentos vigentes afetados;
3. escrever o plano detalhado e executável do B1;
4. revisar o plano contra esta especificação;
5. executar o B1 em branch funcional própria, distinta desta branch documental;
6. abrir PR sem aplicar a migration em Production;
7. validar replay, grants, RLS, testes e documentação;
8. solicitar autorização separada para aplicação remota.

A aprovação do B1 não autoriza B2, carga real ou promoção operacional.
