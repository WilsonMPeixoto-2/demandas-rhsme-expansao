# REGISTRO DE DECISÕES DE PRODUTO — CTRH

<!-- IMPLEMENTATION_AUTHORIZATION: V1-E-A01 -->

**Status:** vigente  
**Atualizado em:** 29 de outubro de 2026
**Finalidade:** registrar somente decisões expressamente aprovadas pelo responsável pelo produto antes da implementação de cada pacote.

## 1. Regra de uso

- O Plano Integrado v3.1 e o Plano Executivo v1.2 organizam o trabalho possível, não autorização automática.
- Cada pacote passa primeiro por debate pré-implementação.
- O pacote será desmontado em decisões independentes.
- Somente decisões expressas entram neste registro.
- Silêncio, ausência de objeção, recomendação técnica, texto anterior do plano ou aprovação do objetivo geral não equivalem a aprovação dos itens internos.
- Qualquer consequência nova descoberta durante a implementação retorna para decisão antes de ser codificada.
- A branch funcional somente pode ser criada depois que o escopo aprovado estiver registrado.
- A decisão mais recente registrada prevalece sobre descrição incompatível em plano, especificação ou relatório anterior.
- A implementação somente é concluída quando os documentos vigentes afetados foram sincronizados.

## 2. Decisões de governança

### GOV-001 — Aprovação obrigatória antes de cada ciclo

**Data:** 23 de julho de 2026  
**Decisão:** APROVADA.

Cada Ciclo R1 a R12 deverá ser explicado e debatido antes de sua implementação. A explicação traduzirá os itens técnicos para mudanças concretas de lógica de produto, funcionalidades, telas, fluxos, permissões, dados e experiência do usuário.

A implementação somente começa após concordância expressa ou após a proposta ter sido retificada e então aprovada. A autorização abrange exclusivamente o escopo consolidado e aprovado.

### GOV-002 — Revisão sequencial, não integral antecipada

**Data:** 23 de julho de 2026  
**Decisão:** APROVADA.

Não é necessário homologar antecipadamente todos os ciclos. O processo ocorre sequencialmente:

```text
debate do ciclo atual
→ decisões e retificações
→ aprovação expressa
→ implementação
→ homologação
→ debate do ciclo seguinte
```

### GOV-003 — Conteúdo mínimo da explicação de cada decisão

**Data:** 23 de julho de 2026  
**Decisão:** APROVADA.

Para cada decisão independente, deverão ser apresentados:

1. como o sistema funciona hoje;
2. o que mudaria concretamente na tela e na rotina;
3. quais usuários seriam afetados;
4. um cenário real de uso;
5. alternativas possíveis, inclusive manter o comportamento atual;
6. recomendação identificada apenas como recomendação;
7. impactos positivos e negativos;
8. dependências com decisões de outros ciclos;
9. dificuldade e custo de reverter depois;
10. decisão expressa: aprovar, rejeitar, alterar ou adiar.

### GOV-004 — Classificação obrigatória dos itens

**Data:** 23 de julho de 2026  
**Decisão:** APROVADA.

Cada item deverá ser classificado como:

- necessidade técnica;
- preservação do que já existe;
- decisão anteriormente confirmada;
- nova decisão proposta;
- melhoria opcional;
- questão ainda aberta;
- reconciliação documental, quando a regra já foi decidida e implantada, mas os documentos vigentes ainda divergem.

### GOV-005 — Nova decisão descoberta durante a implementação

**Data:** 23 de julho de 2026  
**Decisão:** APROVADA.

Se durante a implementação surgir uma escolha de produto, consequência ou ampliação não apresentada no debate, o item afetado deverá parar e voltar ao responsável pelo produto. O restante do escopo poderá prosseguir apenas se for independente e seguro.

### GOV-006 — Sincronização documental obrigatória

**Data:** 25 de julho de 2026  
**Classificação:** decisão de governança  
**Decisão:** APROVADA.

Toda alteração concreta de lógica, regra de negócio, permissão, obrigatoriedade, modelo de dados, cálculo, rota ou comportamento visível deverá atualizar, no mesmo trabalho versionado, todos os documentos vigentes afetados.

A entrega somente será considerada concluída quando:

1. a decisão estiver registrada;
2. código e banco refletirem a decisão;
3. `docs/PRODUCT_CONTEXT.md`, o Plano Integrado e o Plano Executivo afetado descreverem a mesma regra;
4. `AGENTS.md`, ADRs e documentação técnica afetados estiverem atualizados;
5. documentos históricos potencialmente conflitantes estiverem identificados como históricos ou superados;
6. `docs/HANDOFF.md` registrar o estado efetivamente implantado;
7. a busca por termos antigos não retornar orientação contraditória como se fosse vigente.

A documentação é parte do contrato do produto. Não será tratada como tarefa editorial opcional nem adiada para outro ciclo.

Consulte `docs/product/POLITICA_SINCRONIZACAO_DOCUMENTAL_CTRH_v1.1.md`.

### GOV-007 — Adoção da cadeia documental v3.1/v1.2

**Data:** 26 de julho de 2026  
**Classificação:** reconciliação documental  
**Decisão:** APROVADA.

A cadeia documental passa a distinguir:

1. `docs/execution/Plano_Integrado_Reformulado_CTRH_v3.1.md` como estratégia geral dos Trilhos A e B;
2. `docs/execution/Plano_Executivo_Operacao_Atual_CTRH_v1.2.md` como roteiro do trabalho possível do Trilho A;
3. este Registro como fonte exclusiva das decisões expressamente aprovadas;
4. Adendo v2.0.4, Protocolo v1.3 e Política v1.1 como governança vigente;
5. Plano Remanescente v2.1 e versões documentais anteriores como registros históricos.

A adoção dos planos não aprova nenhuma decisão `OP-Dxx`, não autoriza implementação funcional e não converte recomendações em regras de produto. Pacotes e decisões continuam sujeitos a debate, registro e autorização expressa.

### GOV-008 — Autorização exclusiva do Pacote E0

**Data:** 26 de julho de 2026  
**Classificação:** reconciliação documental e necessidade técnica  
**Decisão:** APROVADA E CONCLUÍDA.

O Pacote E0 foi autorizado exclusivamente para consolidar a cadeia documental v3.1/v1.2, criar o gate automatizado e corrigir referências documentais. Foi concluído no PR #58. A conclusão do E0 não autorizou automaticamente os pacotes seguintes.

### GOV-009 — Preservação informacional universal

**Data:** 27 de julho de 2026  
**Classificação:** preservação do que já existe e decisão de governança de dados  
**Decisão:** APROVADA.

As regras atuais governam novos cadastros e novas operações. Dados oficiais legados, históricos ou já registrados não podem ser apagados, omitidos, sobrescritos, truncados, convertidos silenciosamente em vazio nem substituídos por valor aparentemente compatível apenas porque não atendem a uma regra atual ou futura.

O tratamento obrigatório é:

1. preservar o valor original e sua proveniência;
2. tentar normalização, tradução e correlação segura;
3. aplicar a regra atual automaticamente somente quando a correspondência for comprovável;
4. registrar como pendente, ambíguo, conflitante ou não associado o que não puder ser adaptado com segurança;
5. manter a informação consultável e recuperável para saneamento posterior;
6. nunca inventar correspondência nem transformar ausência de correlação em ausência de informação.

A regra vale para responsáveis, setores, tipos, classificações, status, prazos, datas, assuntos, números, comentários, observações, documentos, links, eventos históricos e qualquer outro dado oficial.

O caso `Vanessa Migrado` é o exemplo canônico: a informação textual histórica permanece preservada sem UUID até que exista decisão e vínculo oficial. A exceção histórica não reintroduz nome livre para novos cadastros.

Toda mudança futura que possa apagar, reduzir, ocultar, reinterpretar ou sobrescrever informação oficial deve ser apresentada ao responsável pelo produto antes da implementação. O item afetado deve parar até decisão expressa.

Consulte `docs/product/PRINCIPIO_PRESERVACAO_INFORMACIONAL_CTRH_v1.0.md`.

### GOV-010 — Separação entre auditoria técnica e apresentação operacional

**Data:** 27 de julho de 2026  
**Classificação:** decisão de produto e correção de apresentação  
**Decisão:** APROVADA E IMPLEMENTADA.

Metadados técnicos de migration, lote, hash, rotina ou versão podem e devem permanecer preservados para auditoria, mas não substituem informação operacional nem devem ser exibidos literalmente ao usuário quando não ajudam a compreender ou executar o trabalho.

A interface apresenta linguagem administrativa útil. Os registros brutos permanecem preservados no banco.

A correção implementada no PR #69, publicada pelo PR #70 e protegida pelo PR #71 determinou:

- `Demanda importada do lote saneado <hash>.` e `Demanda importada da planilha inicial.` são apresentadas como `Demanda importada do sistema legado.`;
- `Responsável vinculado a perfil oficial na migração R3.` é apresentado como `Responsável vinculado ao perfil oficial.`;
- eventos técnicos permanecem no histórico individual, mas não aparecem como movimentação operacional global;
- nenhum comentário ou evento bruto foi apagado ou reescrito.

### GOV-011 — Segurança e exposição consolidadas ao final da fase funcional

**Data:** 27 de julho de 2026  
**Classificação:** mudança de sequência  
**Decisão:** APROVADA.

A retirada de dados reais dos repositórios, a contenção do repositório predecessor, a revisão de deployments antigos e eventual reescrita de histórico Git ficam adiadas para um pacote consolidado de segurança ao final das implementações funcionais e antes da entrega do produto para uso.

Até esse pacote final:

- nenhum arquivo real será apagado por esse motivo;
- nenhum histórico Git será reescrito;
- a frente de segurança não bloqueará as implementações funcionais independentes;
- a preservação para desenvolvimento e conferência prevalece sobre limpeza prematura.

## 3. Decisões do Pacote E3

### OP-D02 — Semântica neutra de setor, acompanhamento e distribuição por responsável

**Data:** 27 de julho de 2026  
**Classificação:** correção de linguagem e prevenção de inferência indevida  
**Decisão:** APROVADA E IMPLEMENTADA.

O campo `setor` permanece textual e registra o setor informado na demanda. A contagem de demandas agrupadas por esse campo não comprova atividade recente, produtividade, desempenho, esforço realizado nem estrutura organizacional oficial.

A quantidade de demandas vinculadas a um responsável representa distribuição de carteira ou estoque, não classificação competitiva nem avaliação de desempenho. Para as demandas não encerradas, o conceito oficial permanece `Em acompanhamento`.

As redações vigentes são:

- `Setores mais Ativos` → `Demandas por setor informado`;
- `Ativas` → `Em acompanhamento`;
- `Ranking de responsáveis — 10 maiores volumes` → `Distribuição por responsável — 10 maiores volumes`.

Os dados, cálculos, contagens, filtros e regras operacionais permanecem inalterados. A correção do histórico técnico foi implementada nos PRs #69–#71; as demais semânticas do E3 foram implementadas no PR #73.

Consulte `docs/adr/ADR-005-semantica-setor-e-distribuicoes.md`.

## 4. Decisões do Ciclo R3

### R3-D01 — Identidade oficial do responsável

**Data:** 23 de julho de 2026  
**Classificação:** nova decisão proposta  
**Decisão:** APROVADA.

O responsável por uma demanda passa a ser identificado oficialmente pelo UUID de um usuário cadastrado no Supabase Auth e em `perfis_usuarios`. O nome textual permanece apenas como fotografia legível da identidade vinculada.

### R3-D02 — Seleção restrita a usuários cadastrados

**Data:** 23 de julho de 2026  
**Classificação:** nova decisão proposta  
**Decisão:** APROVADA.

Novas demandas e futuras reatribuições não aceitam nome digitado livremente nem responsável externo. O responsável é selecionado entre usuários cadastrados, independentemente de serem administradores, editores ou leitores e independentemente do status do perfil. A regra existente que permite demanda sem responsável é preservada.

Esta decisão substitui descrições anteriores de responsável externo com UUID nulo e texto livre.

### R3-D03 — Permissões existentes preservadas

**Data:** 23 de julho de 2026  
**Classificação:** preservação do que já existe  
**Decisão:** APROVADA.

A mudança de identificação do responsável não altera quem pode criar, editar, consultar, excluir ou administrar usuários. Papéis, status, permissões e políticas de acesso permanecem como estavam.

### R3-D04 — Migração dos responsáveis históricos

**Data:** 23 de julho de 2026  
**Classificação:** necessidade técnica  
**Decisão:** APROVADA E IMPLEMENTADA.

As formas textuais `Erica`, `Giselle`, `Sabrina`, `Thiago`, `Jaqueline`, `Jailson`, `Jessica`, `Beth` e `Helena`, inclusive suas ocorrências com sufixo `Migrado`, foram vinculadas aos respectivos perfis oficiais. `Jaqueline IHA` foi vinculada a Jaqueline Lima Ximenes Melo.

A migração abrangeu 378 demandas e registrou eventos auditáveis de reatribuição.

### R3-D05 — Preservação de Vanessa Migrado

**Data:** 23 de julho de 2026  
**Classificação:** preservação do que já existe  
**Decisão:** APROVADA E IMPLEMENTADA.

A única ocorrência `Vanessa Migrado` permanece preservada como informação histórica, com `responsavel_id` nulo, enquanto não existir perfil oficial cadastrado para Vanessa. Editar outros campos dessa demanda não pode apagar nem substituir silenciosamente essa informação.

A informação não transforma Vanessa em opção de novo cadastro ou reatribuição.

### R3-D06 — Coerência obrigatória no servidor

**Data:** 23 de julho de 2026  
**Classificação:** necessidade técnica  
**Decisão:** APROVADA E IMPLEMENTADA.

Quando houver `responsavel_id`, o banco valida a existência do usuário e deriva o nome diretamente do perfil. O cliente não pode criar divergência entre UUID e nome. A proteção foi aplicada nas RPCs e por gatilho de banco, sem modificar outras regras de negócio.

### R3-D07 — Acesso visual inicial à carteira pessoal

**Data:** 24 de julho de 2026  
**Classificação:** nova decisão proposta  
**Decisão:** APROVADA E POSTERIORMENTE AJUSTADA POR R3-D08.

A primeira implementação exibiu, abaixo de `Atenção agora`, um bloco central destacado com o título `Minhas demandas`, o subtítulo `Acompanhe sua carteira de processos.` e o botão `Acessar minha carteira`.

A ação abria a rota geral de demandas com `escopo=meu`. O vínculo por UUID e a identidade visual foram validados, mas a carteira pessoal ainda era percebida tecnicamente como filtro, o que tornou pouco evidente a navegação inversa e a reentrada a partir da carteira geral.

### R3-D08 — Carteiras como áreas próprias de navegação

**Data:** 24 de julho de 2026  
**Classificação:** nova decisão proposta  
**Decisão:** APROVADA E IMPLEMENTADA.

A carteira geral e a carteira pessoal são áreas distintas e permanentes:

- `/demandas` representa a carteira completa da equipe;
- `/minhas-demandas` representa somente demandas vinculadas ao UUID autenticado;
- a navegação principal contém aba própria `Minhas demandas`;
- ambas exibem cabeçalho contextual e alternância direta;
- `Limpar filtros` limpa critérios de pesquisa e nunca muda a carteira;
- o acesso pessoal permanece disponível em cartão compacto destacado;
- URLs antigas com `escopo=meu` redirecionam para `/minhas-demandas`, preservando os demais filtros;
- demandas sem `responsavel_id`, inclusive `Vanessa Migrado`, não integram carteira pessoal.

A alteração é de navegação e apresentação. Não modifica permissões, papéis ou demais regras de negócio.

### R3-D09 — Indicadores contextuais por carteira

**Data:** 24 de julho de 2026  
**Classificação:** nova decisão proposta  
**Decisão:** APROVADA E IMPLEMENTADA.

Os indicadores superiores refletem a carteira aberta:

- na Visão geral e em `/demandas`, usam a carteira completa;
- em `/minhas-demandas`, usam somente demandas vinculadas ao UUID autenticado;
- o clique preserva a carteira e aplica o filtro dentro dela;
- alternar entre carteiras recalcula imediatamente as quantidades.

A decisão não cria categorias ou regras novas de prazo. Aplica regras existentes à coleção delimitada pela rota.

### R3-D10 — Reconciliação documental pós-R3

**Data:** 25 de julho de 2026  
**Classificação:** reconciliação documental  
**Decisão:** APROVADA.

Todos os documentos vigentes devem refletir as decisões R3-D01 a R3-D09. Em particular:

- excluir responsável externo e nome livre das regras atuais de cadastro e reatribuição;
- manter somente usuário cadastrado por UUID ou ausência de responsável;
- preservar informação textual legada sem convertê-la em opção futura;
- registrar `/demandas` e `/minhas-demandas` como rotas canônicas;
- tratar `escopo=meu` apenas como compatibilidade legada;
- registrar o R3 como implementado, sem reexecução;
- retomar cronologicamente o debate por R1 e R2 antes de R4 e R5.

O Plano Remanescente v2.1 e o Product Context atualizado substituem as descrições conflitantes anteriores. Documentos históricos permanecem preservados, mas não orientam regressão.

**Nota de precedência:** a orientação de continuidade por R1/R2 registrada naquele momento foi superada, quanto à próxima atividade, por GOV-007, GOV-008 e pelas decisões posteriores deste Registro. As regras materiais do R3 permanecem vigentes; nenhum pacote posterior está autorizado automaticamente.

## 5. Decisão de interface autorizada

### UX-RADAR-001 — Consolidação da identidade e da microcopy operacional do Radar

**Data:** 28 de julho de 2026  
**Classificação:** decisão expressamente aprovada pelo responsável pelo produto.  
**Decisão:** APROVADA E IMPLEMENTADA.

A identidade completa `Radar de Governança` — ícone, título e subtítulo — será apresentada no cabeçalho principal, ocupando o lugar de `Painel de Demandas`, sem repetição de um segundo hero dentro da página. O botão inicial de navegação também passará a se chamar `Radar de Governança`.

Serão retiradas da interface as três frases explicativas que repetem decisões internas sobre produtividade, desempenho e interpretação da ausência de prazo. Permanecem preservados os cálculos, denominadores explícitos, contadores de cobertura, rótulos neutros e a documentação de governança; a mudança é exclusivamente de exposição ao usuário.

O badge técnico que cita fornecedor ou mecanismo de armazenamento será substituído por estado operacional derivado da condição real da aplicação: sistema online, sincronização em curso, conexão indisponível ou modo de demonstração. O indicador visual `Ctrl/⌘ K` será removido, mantendo-se integralmente o atalho de teclado.

Não há autorização nem necessidade de alterar dados, schema, migrations, permissões, métricas, regras de cálculo ou integração do Supabase.

### UX-RADAR-002 — Clareza da carteira e polimento visual contido

**Data:** 28 de julho de 2026  
**Classificação:** decisão expressamente aprovada pelo responsável pelo produto.  
**Decisão:** APROVADA E IMPLEMENTADA.

O botão de navegação da carteira coletiva passa de `Demandas` para `Todas as demandas`, distinguindo de forma explícita o escopo da equipe em relação a `Minhas demandas`. O título contextual da própria carteira permanece `Todas as demandas`.

Os rótulos visuais `Composição atual` e `Leitura da carteira` serão retirados do Radar por não acrescentarem orientação acionável. A região analítica manterá nome acessível, e todos os cartões, cálculos, denominadores, rótulos de dados e comportamentos permanecem preservados.

O polimento visual fica restrito ao sistema existente: remover o espaçamento residual deixado pelo cabeçalho retirado, harmonizar o ritmo entre blocos e acomodar os quatro destinos de navegação em uma grade de duas colunas em telas estreitas. Não serão introduzidos novos componentes, cores, métricas ou padrões de interação.

Não há autorização nem necessidade de alterar dados, schema, migrations, permissões, integração do Supabase, regras de negócio, rotas ou cálculos.

A implementação funcional foi concluída no PR #91 e publicada pelo PR #92 no deployment Production `dpl_GuVDMjfxjKYgnU2uTgidxE3Em2yh`, SHA `1aa5e6c7fa7c1158881e44d9c75af94f81d18204`. O bloqueio automático de deploy foi restaurado pelo PR #93.

## 6. Decisões do Pacote E4

### OP-D17 — Visibilidade de demandas excluídas e seus históricos

**Data:** 29 de julho de 2026  
**Classificação:** decisão de permissão e endurecimento de segurança.  
**Decisão:** APROVADA PARA IMPLEMENTAÇÃO.

As demandas ativas e seus históricos continuam consultáveis por todos os usuários ativos, conforme as permissões vigentes. Demandas logicamente excluídas e os respectivos históricos somente podem ser consultados por administrador ativo, inclusive em requisição direta ao banco ou à API.

Editor e leitor não podem consultar a lixeira nem reconstruir seu conteúdo por acesso técnico. O E4 corrige a proteção no banco e não cria ainda a página administrativa de lixeira, restauração ou qualquer nova ação visual; essas capacidades permanecem no R5-1.

### E4-D01 — Separação entre responsabilidade e autoria das ações

**Data:** 29 de julho de 2026  
**Classificação:** preservação do funcionamento existente e decisão de integridade de auditoria.  
**Decisão:** APROVADA PARA IMPLEMENTAÇÃO.

`responsavel_id` identifica a pessoa oficialmente atribuída como referência da demanda. Essa atribuição não cria posse exclusiva, não limita a continuidade por colegas e não integra a autorização para editar, comentar, registrar andamento ou praticar outra ação permitida pelo papel do usuário.

Administrador ou editor ativo pode atuar em qualquer demanda ativa, ainda que outra pessoa seja a responsável oficial. Cada comentário, movimentação ou alteração deve registrar o usuário que efetivamente praticou a ação:

- operação autenticada registra obrigatoriamente `auth.uid()` como ator;
- o evento grava o ator em `sme_historico.created_by`;
- a demanda grava o último ator em `sme_demandas.updated_by`;
- registrar uma ação não modifica `responsavel_id` nem o nome do responsável;
- o responsável somente muda por reatribuição explícita, que também registra seu próprio ator;
- leitor permanece sem permissão de mutação;
- nenhuma policy, RPC ou regra de interface pode exigir que o ator seja o responsável cadastrado.

Quando uma rotina administrativa privilegiada executar uma operação sem sessão pessoal, ela somente poderá informar um ator depois de validar essa identidade e sua autorização. Nessa situação, o gatilho preserva o ator explicitamente validado. Não haverá preenchimento retroativo dos registros legados sem autoria comprovada.

### E4-A01 — Autorização consolidada do pacote

**Data:** 29 de julho de 2026  
**Classificação:** autorização de implementação.  
**Decisão:** APROVADA.

Está autorizada a implementação isolada do E4 para:

1. restringir no banco a leitura de demandas excluídas e de seus históricos a administradores ativos;
2. preservar as regras atuais de leitura das demandas ativas;
3. corrigir `private.touch_updated_at()` para registrar o usuário autenticado e preservar ator administrativo previamente validado quando não houver `auth.uid()`;
4. provar que o ator da ação independe do responsável oficial e que nenhuma ação comum reatribui a demanda;
5. preservar todos os dados, UUIDs, históricos e autorias legadas, inclusive valores nulos;
6. atualizar migrations, invariantes, workflow de replay, tipos e documentação afetada;
7. executar replay integral, testes por papel, Advisors, revisão de grants e verificação pós-migration.

Ficam fora do E4: tela da lixeira, restauração, concorrência otimista, revogação de RPCs antigas, importadores, índices de outros pacotes, R1, R2, R4, R5, frontend, Preview e deployment Vercel.

### E4-C01 — Encerramento da implementação

**Data:** 29 de julho de 2026  
**Classificação:** encerramento operacional e sincronização documental.  
**Estado:** CONCLUÍDO EM PRODUCTION.

O E4 foi autorizado no PR #94, precedido pela reconciliação da versão remota do R3 no PR #95 e implementado no PR #96. A migration canônica `20260729133230_security_deleted_visibility_and_actor.sql` está aplicada em Production.

A verificação pós-migration confirmou:

- somente administrador ativo consulta demandas logicamente excluídas e seus históricos;
- editor ativo pode atuar em demanda atribuída a outra pessoa, com o executor registrado e o responsável preservado;
- leitor e perfil inativo permanecem sem as permissões vedadas;
- grants e execução da função de gatilho não foram ampliados;
- 379 demandas, nenhuma excluída, 764 históricos, 13 perfis ativos, 378 `updated_by` nulos legados e 378 `created_by` nulos legados foram preservados;
- não houve backfill, reatribuição, alteração de frontend ou deployment da Vercel;
- Advisors não apresentaram achado novo introduzido pelo E4 e as chamadas recentes da API permaneceram saudáveis.

Durante a aplicação, a integração Git registrou automaticamente a migration canônica enquanto uma reaplicação idempotente era iniciada. A entrada redundante `20260729135047` foi identificada e removida do histórico por guarda exata, sem reversão de schema, DDL adicional ou alteração de dados. O histórico remoto final contém apenas a versão canônica `20260729133230`.

O E4 está encerrado. A orientação de iniciar um R1 amplo foi superada por GOV-012 e A1-CORE-A01: a próxima atividade autorizada é somente o A1-Core residual.

---

## 7. Decisões e autorização do A1-Core residual

### GOV-012 — Prioridade de conclusão funcional independente do legado futuro

**Data:** 29 de julho de 2026  
**Classificação:** mudança de sequência e foco de produto  
**Decisão:** APROVADA.

A chegada, o formato e o volume dos dados legados futuros deixam de integrar o caminho crítico das funcionalidades da operação atual. O produto será concluído com o modelo e os dados hoje disponíveis, mantendo preservação informacional e flexibilidade para compatibilização posterior, sem antecipar regras de importação, domínios ou limites ainda desconhecidos.

A sequência executiva vigente passa a ser:

1. **A1-Core residual:** gate dinâmico de migrations, retirada dos contratos operacionais obsoletos e proteção contra sobrescrita concorrente;
2. **R4 operacional:** debate itemizado e, somente após autorização expressa, prazos, próxima providência, dados operacionais e apresentação equivalente em desktop/mobile e Excel;
3. **R5 e demais funcionalidades operacionais:** priorizar andamento, prontuário, recuperação administrativa e fechamento dos fluxos; antecipar apenas os recortes de consulta do R2 que forem dependência técnica direta de uma função aprovada, evitando arquitetura temporária;
4. **R2 remanescente e otimizações de escala:** executar depois das funções prioritárias, antes da entrega final quando necessárias à qualidade do produto atual ou quando houver evidência de degradação.

Esta sequência define prioridade de planejamento e não autoriza automaticamente R4, R5 ou qualquer item do R2. R1-1, R1-4 autônomo, preparação específica de cargas e regras dependentes do formato futuro permanecem fora do caminho crítico. R1-2 será consumido como fundação do R4-1, sem ciclo independente.

### OP-D15 — Retirada dos contratos e acessos operacionais obsoletos

**Data:** 29 de julho de 2026  
**Classificação:** necessidade técnica e segurança de contrato  
**Decisão:** APROVADA.

O cliente deixa de expor ou chamar `LegacyCreateDemandaInput`, `update`, `updateStatus`, `delete`, `criar_sme_demanda` e `atualizar_status_sme_demanda`. Todos os fluxos visuais permanecem nas RPCs nomeadas, transacionais e auditáveis já implantadas.

O papel `authenticated` perde a execução das duas RPCs antigas. Os símbolos podem permanecer temporariamente definidos no banco, mas sem execução por `public`, `anon`, `authenticated` ou `service_role`. Esta decisão não cria concessão nova para ferramenta administrativa; qualquer consumidor privilegiado futuro exigirá contrato e autorização próprios. Não haverá apagamento de dados, eventos ou migrations históricas.

### OP-D01 — Tratamento de edição concorrente

**Data:** 29 de julho de 2026  
**Classificação:** integridade multiusuário e experiência de conflito  
**Decisão:** APROVADA.

Toda mutação sobre demanda existente deve enviar a versão `updated_at` sobre a qual o formulário foi aberto. Depois de bloquear a linha, a RPC compara essa versão com o estado atual.

Quando outra pessoa já tiver alterado a demanda:

- a operação é rejeitada sem atualizar a demanda e sem criar histórico;
- o conteúdo digitado permanece preservado na interface;
- o sistema informa que existe uma versão mais recente e apresenta os campos alterados quando consultáveis;
- o usuário pode cancelar ou recarregar a versão atual para reaplicar conscientemente seu conteúdo;
- não haverá combinação automática, gravação forçada ou transferência de responsabilidade;
- a resposta de conflito jamais devolverá informação que a RLS não permita consultar.

### A1-CORE-A01 — Autorização consolidada do núcleo residual

**Data:** 29 de julho de 2026  
**Classificação:** autorização de implementação  
**Decisão:** APROVADA.

Está autorizada a implementação sequencial do A1-Core para:

1. substituir a enumeração manual de migrations por staging dinâmico e um manifesto canônico com `boundary`, `baseline`, `cycle3`, `postCycle3` e `all`, preservando as fixtures e invariantes históricas;
2. remover contratos, adaptadores e chamadas operacionais legadas do TypeScript;
3. revogar de `public`, `anon`, `authenticated` e `service_role` a execução das RPCs `criar_sme_demanda` e `atualizar_status_sme_demanda`, sem criar grant privilegiado novo, DML, backfill ou exclusão histórica;
4. publicar primeiro as RPCs v2 de concorrência de forma aditiva, mantendo as assinaturas modernas atuais para compatibilidade e rollback;
5. publicar e validar em Production o frontend que envia a versão esperada e trata o conflito conforme OP-D01;
6. somente depois da prova de Production, retirar a execução das assinaturas modernas sem controle de versão, mantendo como rollback um deployment já compatível com v2;
7. preservar R3, E4, papéis, responsabilidade oficial, autoria do executor, busca, filtros, Excel, acessibilidade, responsividade, Realtime e rotas;
8. executar RED/GREEN, replay integral, invariantes por papel, revisão de grants, Advisors, gate completo e sincronização documental em cada release.

O A1-Core é uma autorização guarda-chuva, mas não um único release: fundação, banco aditivo, frontend e limpeza final usam branches e PRs próprios. Ficam fora do A1-Core: validação das cinco constraints, dois índices residuais, limites de texto, catálogo definitivo, importação futura, paginação R2 e as funcionalidades visuais do R4/R5. Após o encerramento do A1-Core começa o debate itemizado do R4; sua implementação depende de autorização expressa própria.

## 8. Decisões e autorização do Ciclo R4

### R4-D01 — Regra de prazo interno para novos cadastros

**Data:** 30 de julho de 2026  
**Classificação:** nova regra de negócio e coerência temporal  
**Decisão:** APROVADA E IMPLEMENTADA.

Toda nova demanda exige prazo interno com data definida. O prazo interno não admite `Não se aplica` nem `Não informado` em cadastro novo. Quando prazo interno e prazo final estiverem definidos, o prazo interno não pode ser posterior ao prazo final.

Data passada pode ser informada no primeiro registro do prazo e, isoladamente, não exige justificativa.

### R4-D02 — Regra de prazo final para novos cadastros

**Data:** 30 de julho de 2026  
**Classificação:** nova regra de negócio  
**Decisão:** APROVADA E IMPLEMENTADA.

Toda nova demanda exige escolha explícita entre:

- prazo final com data definida; ou
- `Não se aplica`.

`Não informado` não é opção para cadastro novo. Marcar `Não se aplica` não exige justificativa inicial.

### R4-D03 — Preservação dos prazos legados e adequação progressiva

**Data:** 30 de julho de 2026  
**Classificação:** preservação informacional e transição operacional  
**Decisão:** APROVADA E IMPLEMENTADA.

A ausência de prazo interno ou final em demanda legada não bloqueia consulta nem edição de campos não relacionados. O sistema não exige que usuários inventem datas históricas desconhecidas e não classifica ausência de prazo como vencimento.

O primeiro preenchimento de prazo ausente no legado é adequação progressiva, não alteração de prazo, e não exige justificativa. Toda alteração posterior de prazo já registrado exige justificativa, independentemente de antecipação, prorrogação, data passada ou futura, prazo interno ou final, inclusive mudança entre data e `Não se aplica`.

O histórico registra campo alterado, valor anterior, valor novo, justificativa, usuário e momento da operação.

### R4-D04 — Próxima providência nas operações atuais e no legado

**Data:** 30 de julho de 2026  
**Classificação:** continuidade operacional e adequação progressiva  
**Decisão:** APROVADA E IMPLEMENTADA.

Toda demanda não encerrada criada pelo sistema exige próxima providência e data de acompanhamento.

Nas demandas legadas, a ausência anterior desses campos não bloqueia consulta nem edição meramente cadastral. Entretanto, quando o usuário registrar andamento, alterar para status não encerrado, reabrir ou realizar outra movimentação que exija continuidade operacional, deverá informar a próxima providência e sua data. O primeiro preenchimento nesses casos não exige justificativa por estar anteriormente vazio.

Ao encerrar a demanda, os campos correntes de próxima providência são limpos; os eventos anteriores permanecem preservados no histórico.

### R4-D05 — Data passada da próxima providência

**Data:** 30 de julho de 2026  
**Classificação:** auditabilidade de operação excepcional  
**Decisão:** APROVADA E IMPLEMENTADA.

A data da próxima providência pode ser passada, mas o salvamento exige justificativa obrigatória com registro no histórico. Sem justificativa, a operação é bloqueada.

### R4-D06 — Leitura temporal e apresentação na carteira

**Data:** 30 de julho de 2026  
**Classificação:** arquitetura da informação e clareza operacional  
**Decisão:** APROVADA E IMPLEMENTADA.

A organização atual da carteira, do banco e das rotas é preservada. A implementação complementa as superfícies existentes:

- cartões `Vencem Hoje` e `Vencidas` passam a `Prazo final hoje` e `Prazo final vencido`;
- filtros específicos permitem localizar prazo interno vencido ou hoje e próxima providência vencida ou hoje;
- o seletor de período inclui a data da próxima providência;
- a tabela mantém suas colunas e acrescenta `Próxima providência`;
- o detalhe apresenta a próxima providência em destaque antes dos prazos;
- a faixa comum de proximidade é de sete dias corridos;
- `Atenção agora` permanece sem novo motor combinado no R4;
- a exportação Excel preserva equivalência semântica com a carteira.

A faixa de sete dias informa proximidade e não transforma automaticamente a demanda em urgente.

### R4-D07 — Reavaliações futuras, reclassificadas por GOV-013

**Data:** 30 de julho de 2026  
**Classificação:** compromisso de reavaliação, sem autorização automática  
**Decisão:** APROVADA.

Devem permanecer registradas para avaliação futura:

1. representação conjunta de prazo interno, prazo final e próxima providência quando houver cobertura real suficiente;
2. eventual maior destaque dos filtros operacionais depois do início do uso pelos usuários;
3. revisão da apresentação da próxima providência em tabela, detalhe e mobile com dados reais;
4. possível evolução do bloco `Atenção agora`, condicionada a evidência de limitação do componente atual;
5. novos indicadores do Radar somente após cobertura e uso consistentes dos novos campos.

Esses itens não autorizam implementação futura sem novo debate e aprovação. GOV-013 superou a obrigação de implementá-los em ciclo predeterminado; a lista permanece como referência de observação do uso real.

### R4-A01 — Autorização consolidada

**Data:** 30 de julho de 2026  
**Classificação:** autorização de implementação  
**Decisão:** APROVADA.

Foi autorizada a implementação integral das decisões R4-D01 a R4-D07 em todas as camadas afetadas: domínio, validações, formulários, carteira, detalhe, filtros, histórico, Excel, repositórios, RPCs, constraints, migrations, testes e documentação.

A autorização exigiu preservação integral dos dados legados, ausência de preenchimento automático, validação duplicada no cliente e no banco, migrations aditivas, testes transacionais e manutenção do bloqueio de deploy automático fora das branches temporárias de homologação.

### R4-C01 — Homologação técnica e remota

**Data:** 30 de julho de 2026  
**Classificação:** encerramento técnico e sincronização documental  
**Estado:** IMPLEMENTAÇÃO HOMOLOGADA; PUBLICAÇÃO DO FRONTEND PELO PR #103.

A aplicação foi validada com 67 arquivos e 309 testes unitários e de integração, lint, TypeScript, build, auditoria, documentação, Excel, orçamento de bundle e 22 cenários Playwright em desktop e mobile de 320 px.

As seis migrations do R4 foram aplicadas ao projeto Supabase `CTRH PROCESSOS` (`kdhekkzwcokfrpcrsllr`) e registradas remotamente como:

- `20260730063742_r4_deadlines_and_follow_up_rules`;
- `20260730063806_r4_deadline_consistency_constraints`;
- `20260730063832_r4_preserve_legacy_deadline_metadata`;
- `20260730063856_r4_final_deadline_state_constraints`;
- `20260730063923_r4_optional_reason_compatibility`;
- `20260730064021_r4_preserve_exceptional_internal_state`.

A homologação remota confirmou, em transações sintéticas integralmente revertidas:

- edição cadastral do legado sem exigência ou invenção de prazo e providência;
- primeira adequação de prazo sem justificativa e com evento auditável;
- bloqueio de alteração posterior sem justificativa;
- exigência de próxima providência nas movimentações pertinentes;
- bloqueio de novo cadastro sem prazo interno;
- prazo final `Não se aplica` sem justificativa inicial;
- bloqueio de providência passada sem justificativa;
- histórico com autoria e justificativa;
- limpeza da providência corrente no encerramento;
- sobrecargas de compatibilidade sem contorno das novas regras;
- grants apenas para `authenticated`, sem execução por `anon` ou `service_role`.

As contagens permaneceram inalteradas após migrations e testes: 379 demandas, todas legadas; 764 registros históricos; 369 demandas sem prazo interno; 354 sem prazo final; 379 sem próxima providência; zero fixture de homologação persistida. Não houve backfill, reclassificação ou atualização em massa.

Os Advisors não apresentaram bloqueio novo introduzido pelo R4. Os avisos de `SECURITY DEFINER` correspondem à arquitetura intencional das RPCs protegidas por `private.can_edit()` e grants restritos; os demais avisos são preexistentes e informativos.

Nenhum pacote posterior ao R4 está automaticamente autorizado.

## 9. Decisões e autorização do R5-1

### R5-1-D01 — Lixeira administrativa sem restauração de produto

**Data:** 30 de julho de 2026  
**Classificação:** simplificação de produto, permissão e auditabilidade  
**Decisão:** APROVADA.

O pacote R5-1 passa a se chamar **Lixeira administrativa e auditoria**. A decisão pendente OP-D11 fica encerrada sem criação de fluxo de restauração.

A regra vigente é:

- somente perfil ativo de nível `administrador` pode excluir demandas;
- editor e leitor não visualizam a ação `Excluir` e não podem consultar a lixeira;
- a exclusão é lógica, exige motivo e registra autoria, data e hora;
- não existe exclusão física disponível aos usuários;
- a demanda excluída conserva todos os seus dados e todo o histórico;
- a área `/admin` apresenta aos administradores a relação de demandas excluídas, pesquisa e detalhe somente leitura;
- o detalhe informa dados preservados, status, motivo, data e autor da exclusão quando comprováveis, além do histórico completo;
- não há botão, fluxo, edição, mudança de status ou retorno automático da demanda à carteira;
- a restauração não pode ser executada por `public`, `anon`, `authenticated` ou `service_role`, inclusive quando o usuário autenticado é administrador.

A expressão `recuperável` significa somente que o registro não foi destruído. Uma recuperação excepcional poderá ocorrer fora do produto, mediante procedimento técnico controlado pelo proprietário do banco e necessidade administrativa específica. A função técnica existente pode ser preservada sem grants para os papéis da API.

### R5-1-A01 — Autorização consolidada

**Data:** 30 de julho de 2026  
**Classificação:** autorização de implementação  
**Decisão:** APROVADA.

Está autorizada a implementação integral e isolada do R5-1 em todas as camadas afetadas:

1. retirar restauração dos tipos, contratos, hooks e repositórios públicos do frontend;
2. preservar a leitura de eventuais eventos históricos antigos do tipo `restauracao`;
3. revogar a execução da função técnica de restauração para todos os papéis da API, sem apagar a função e sem alterar linhas existentes;
4. manter `excluir_sme_demanda` restrita internamente a administrador ativo, com motivo e histórico;
5. criar na área administrativa a consulta pesquisável das demandas excluídas e o detalhe somente leitura;
6. provar que editor e leitor não veem a ação de exclusão nem consultam dados excluídos;
7. preservar RLS, dados, históricos, autoria, legado e bloqueio de deployment automático;
8. executar testes unitários, integração, build, browser, validação remota do Supabase, documentação e release controlado.

A autorização não abrange andamento, reabertura, prontuário, autoria futura, busca histórica, links, exclusão física ou qualquer outro pacote do R5.

## 10. Direção de completude operacional e conclusão funcional inicial

### GOV-013 — Completude operacional em lugar de exaustão documental

**Data:** 1º de agosto de 2026
**Classificação:** governança de produto e priorização transversal
**Decisão:** APROVADA.

Os planos permanecem como inventário de possibilidades, riscos e dependências, mas não como lista obrigatória de funcionalidades do lançamento. Toda nova implementação deve confrontar primeiro código, Supabase, interface e testes atuais e ser classificada como `materializada`, `essencial` ou `evolução condicionada`.

O caminho crítico do produto inicial limita-se às capacidades necessárias para localizar demandas, organizar a carteira por prazos e próxima providência e compreender ou registrar status, andamento, anotações e mudanças principais. Integridade, segurança, preservação informacional, acessibilidade, correções de defeito e compatibilidade com o legado continuam obrigatórias.

### R5-E-D01 — Andamento simples exposto na interface

**Data:** 1º de agosto de 2026
**Classificação:** fluxo operacional
**Decisão:** APROVADA.

Administrador ou editor ativo pode registrar andamento em demanda não encerrada sem alterar seu status. O formulário usa o contrato já existente e exige comentário do trabalho realizado, próxima providência e data; data passada exige justificativa. Leitor não recebe a ação. Demandas encerradas devem ser reabertas antes de novo andamento.

### OP-D07 — Reabertura como transição explícita existente

**Data:** 1º de agosto de 2026
**Classificação:** transição de status e auditabilidade
**Decisão:** APROVADA.

Reabrir significa transicionar explicitamente uma demanda `Encerrado` para qualquer outro status oficial usando a mesma RPC auditável de status. A interface não oferece o status atual como destino, usa rótulo contextual de reabertura e exige comentário, próxima providência e data. Se a data estiver no passado, permanece obrigatória a justificativa temporal adicional prevista no R4; o comentário comum não a substitui. Não haverá tabela, estado intermediário, RPC ou máquina de estados adicional.

### OP-D08 — Drawer como prontuário operacional do produto inicial

**Data:** 1º de agosto de 2026
**Classificação:** superfície canônica e simplificação
**Decisão:** APROVADA.

O `DemandDetailDrawer`, aberto pelas rotas `/demandas/:id` e `/minhas-demandas/:id`, é o prontuário operacional canônico do produto inicial. Ele preserva identificação, responsabilidade, prazos, próxima providência, situação e histórico e passa a oferecer as ações essenciais. O modal histórico existente pode permanecer como atalho de leitura compatível, mas não recebe evolução concorrente. Uma página completa separada e a remoção desse atalho ficam condicionadas a limitação ou redundância comprovada no uso.

### R5-E-D02 — Capacidades atuais de busca, link e retorno suficientes para o lançamento

**Data:** 1º de agosto de 2026
**Classificação:** reconhecimento de capacidade materializada
**Decisão:** APROVADA.

A busca em campos atuais e históricos, a explicação da correspondência, as rotas profundas e a preservação de carteira e filtros atendem ao produto inicial. Cópia dedicada de link, retorno exato de scroll, foco ou página, paginação remota, consulta individual com cursor e especialização de `link_origem` ficam como evolução condicionada.

OP-D09 e OP-D10 permanecem adiadas: não serão criados snapshots de autoria, taxonomia de contexto ou backfill sem evidência e decisão específica. OP-D12 permanece adiada, mantendo `link_origem` armazenado e não obrigatório enquanto não houver fonte institucional definida. OP-D19 não exige implementação adicional no lançamento porque as rotas internas compartilháveis já existem; refinamentos de cópia ou contexto ficam condicionados a uso comprovado.

### R5-E-A01 — Autorização consolidada do R5 Essencial

**Data:** 1º de agosto de 2026
**Classificação:** autorização de implementação
**Decisão:** APROVADA.

Está autorizada a menor implementação completa para:

1. expor `Registrar andamento` na tabela e no prontuário atual, respeitando papel e estado da demanda;
2. conectar o formulário ao contrato `registerProgress` já existente;
3. remover o status atual das opções de transição e apresentar reabertura contextual;
4. reconhecer e ajustar o drawer atual como prontuário inicial, sem criar nova página;
5. transformar as duas RPCs anteriores ao R4 em wrappers das regras atuais e retirar `EXECUTE` de `service_role`, sem alterar dados;
6. criar testes comportamentais, atualizar a documentação vigente e homologar sem nova tabela, coluna ou backfill.

Ficam fora desta autorização R1 residual, R2, página completa, snapshots ou categorias históricas, backfill, restauração, novas permissões, refinamentos avançados de navegação, extensões funcionais de R6 a R11 e qualquer mudança no Trilho B. A recuperação de senha autorizada separadamente por AUTH-E-D01 não amplia esses limites. Segurança, release e a homologação final do R12 continuam gates obrigatórios. A classificação transversal e os detalhes estão em `docs/execution/ATUALIZACAO_COMPLETUDE_OPERACIONAL_2026-08-01.md`.

### AUTH-E-D01 — Recuperação de senha como complemento operacional essencial

**Data:** 1º de agosto de 2026
**Classificação:** acesso e continuidade operacional
**Decisão:** APROVADA.

A autenticação, o primeiro acesso, a aprovação administrativa e os papéis atuais atendem ao produto inicial. A ausência de recuperação de senha, porém, cria dependência técnica previsível e integra o caminho crítico.

O login deve oferecer `Esqueci minha senha`. Para e-mail institucional válido, a solicitação usa `resetPasswordForEmail` e apresenta sempre a mesma confirmação neutra, sem revelar se existe conta. O destino é `/redefinir-senha`, e a alteração somente é permitida após o Supabase emitir `PASSWORD_RECOVERY`. Nova senha e confirmação devem coincidir e obedecer à política forte já usada no primeiro acesso. Link ausente, inválido ou expirado não abre o formulário. Após sucesso, a sessão de recuperação é encerrada e o usuário volta ao login.

Não haverá tabela, RPC, consulta prévia de conta, ação administrativa, senha em log ou persistência local. A lista de redirects autorizados do Supabase deve conter o destino exato de produção antes da publicação.

### V1-E-A01 — Autorização consolidada da conclusão funcional inicial

**Data:** 1º de agosto de 2026
**Classificação:** autorização de implementação
**Decisão:** APROVADA.

Fica autorizada, na mesma linha de completude operacional, a implementação e homologação conjunta de:

1. todo o escopo delimitado por R5-E-A01;
2. todo o fluxo mínimo delimitado por AUTH-E-D01;
3. rebaseline explícito dos ciclos históricos 6 a 13, sem transformá-los em fila;
4. testes unitários, integração, desktop e mobile, documentação e verificação remota necessárias aos dois complementos.

Não estão autorizados motor avançado de alertas, Central de Relatórios, novos painéis, visões salvas, métricas temporais imaturas, R1 residual, R2 antecipado ou execução do Trilho B sem fonte real. A ampliação simples de `Atenção agora` permanece recomendável, mas separável e condicionada à evidência de uso.

**Resultado de execução:** o escopo foi implementado pelo PR #112, homologado no Preview `dpl_GkBQLRVNk98sJyU4z5e8eNz48Vry` e publicado pelo PR #113 em Production no deployment `dpl_AZARXi92PqtR5WrRJtgpvDZgxZjD`, SHA `501f8cfb6c193f90a71ffabc2456230dbe0dc026`. O PR #114 restaura o bloqueio de deployments automáticos. Nenhuma extensão condicionada foi promovida por inferência.

## 11. Modelo de registro de decisão do ciclo

| Campo | Conteúdo |
|---|---|
| ID | Código único do ciclo e da decisão |
| Classificação | Uma das classes aprovadas |
| Situação atual | Funcionamento existente |
| Mudança prática | Efeito em tela, rotina e lógica de produto |
| Usuários afetados | Administrador, editor, leitor ou grupo específico |
| Cenário real | Exemplo operacional do CTRH |
| Alternativas | Opções consideradas, inclusive manter como está |
| Recomendação | Recomendação não vinculante da ferramenta |
| Impactos | Benefícios, custos e riscos |
| Dependências | Relação com outras decisões ou ciclos |
| Reversibilidade | Facilidade e custo de desfazer depois |
| Documentos afetados | Documentos vigentes e históricos a sincronizar |
| Decisão | Aprovada, alterada, adiada, rejeitada ou pendente |
| Redação final | Regra objetiva autorizada para implementação |

## 12. Controle por ciclo

| Ciclo | Debate prévio | Decisões registradas | Implementação autorizada | Estado |
|---|---|---|---|---|
| E0 | Concluído | GOV-007 e GOV-008 | Concluída | PR #58 concluído |
| E1 | Concluído | Autorização registrada no Handoff histórico | Concluída | Production alinhada pelo PR #59; bloqueio restaurado no PR #60 |
| E1A | Concluído | Autorização registrada no Handoff histórico | Concluída | PR #61 concluído sem reexecução de SQL |
| E2 / segurança final | Adiado | GOV-011 | Não no momento | Executar após as implementações funcionais e antes da entrega |
| E3 | Concluído | GOV-010 e OP-D02 | Concluída | Histórico corrigido nos PRs #69–#71; demais semânticas concluídas no PR #73 |
| UX-RADAR-001 | Concluído | UX-RADAR-001 | Concluída | PR #88, publicação #89 e bloqueio #90 |
| UX-RADAR-002 | Concluído | UX-RADAR-002 | Concluída | PR #91, publicação #92 e bloqueio #93 |
| E4 | Concluído | OP-D17, E4-D01, E4-A01 e E4-C01 | Concluída | PR #96 integrado; migration `20260729133230` verificada em Production |
| A1-Core | Parcial conforme GOV-012 | GOV-012, OP-D15 e A1-CORE-A01 | Concluída para R1-0/R1-3 | R1-5 não foi entregue e permanece evolução condicionada |
| R1 residual fora do Core | Parcial | GOV-012 | Não no momento | R1-1 e R1-4 adiados; R1-2 incorporado ao R4-1 |
| R2 | Reclassificado | GOV-013 | Não no momento | Evolução condicionada a volume ou desempenho comprovado |
| R3 | Concluído | R3-D01 a R3-D10 | Concluída | Implementado e preservado |
| R4 | Concluído | R4-D01 a R4-D07, R4-A01 e R4-C01 | Concluída | Banco homologado; frontend no PR #103 |
| R5-1 | Concluído | R5-1-D01 e R5-1-A01 | Concluída | Publicado em Production |
| R5 Essencial | Concluído | GOV-013, R5-E-D01, OP-D07, OP-D08, R5-E-D02 e R5-E-A01 | Concluída no escopo essencial | Homologado e publicado em Production pelos PRs #112 e #113 |
| Conclusão funcional inicial | Concluído | AUTH-E-D01 e V1-E-A01 | Concluída | R5 Essencial e recuperação de senha publicados; encerramento pelo PR #114 |
| R5 avançado | Reclassificado | GOV-013 | Não | Evolução condicionada; sem continuidade automática |
| R6 | Parcialmente materializado | GOV-013 | Não para extensões | Radar, carteiras e alertas atuais preservados; motor adicional condicionado a evidência |
| R7 | Parcialmente materializado | GOV-013 | Não para extensões | Exportação Excel vigente; Central adicional condicionada a necessidade |
| R8 | Parcialmente materializado | GOV-013 | Não para extensões | leituras gerenciais atuais preservadas; painéis adicionais condicionados |
| R9 | Parcialmente materializado | GOV-013 | Não para extensões | filtros na URL e buscas recentes preservados; visões salvas condicionadas |
| R10 | Parcialmente materializado | GOV-013 e AUTH-E-D01 | Concluída somente para recuperação de senha | autenticação, controle de acesso e recuperação vigentes e publicados; demais extensões condicionadas |
| R11 | Parcialmente materializado | GOV-013 | Não para extensões | controles de release vigentes; observabilidade proporcional e correções continuam obrigatórias |
| R12 | Gate final | GOV-013 | Obrigatório na entrega | contrato, segurança e homologação final não são backlog opcional |


---

## Decisões de manutenção e endurecimento técnico — 26 de outubro de 2026

### TECH-HARDEN-001 — CodeQL e headers HTTP básicos

**Data:** 26 de outubro de 2026  
**Classificação:** necessidade técnica de segurança e manutenção  
**Decisão:** APROVADA E IMPLEMENTADA.

Após auditoria específica das capacidades técnicas do CTRH, o responsável pelo produto aprovou expressamente o início da implementação pelos itens de menor risco e maior benefício concreto.

O escopo aprovado compreende:

1. habilitar CodeQL no repositório para análise de JavaScript/TypeScript e GitHub Actions, em pull requests para `main`, push em `main`, execução semanal e execução manual;
2. adicionar headers HTTP básicos e independentes da decisão de backend: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` e `Permissions-Policy` restringindo câmera, microfone, geolocalização, pagamento e USB;
3. não introduzir dependência npm, alteração funcional, migration, RLS, grant, dado, autenticação, telemetria externa ou mudança de backend;
4. manter Content Security Policy fora desta etapa, pois sua definição depende das origens efetivamente utilizadas após a decisão Supabase versus Google/Firebase e de eventual observabilidade/Speed Insights;
5. preservar `git.deploymentEnabled: false` e não promover esta rodada automaticamente para Production.

A implementação foi integrada pelo PR #196 no SHA `0d9f2469e67e9a185e09ae08677c062f0924fb27`.

**Reconciliação documental:** a autorização expressa ocorreu antes da implementação na conversa de 26/10/2026, mas não foi registrada neste arquivo antes da criação da branch, em desacordo com a sequência documental definida por GOV-001/GOV-006 e `AGENTS.md`. O achado foi identificado na revisão automatizada do PR #196. Esta entrada corrige a omissão documental sem ampliar, reinterpretar ou criar autorização posterior ao fato.

### TECH-HARDEN-002 — Proteção da branch principal

**Data:** 26 de outubro de 2026  
**Classificação:** necessidade técnica de governança do repositório  
**Decisão:** APROVADA PARA IMPLEMENTAÇÃO.

Está autorizada a configuração da branch `main` para impedir integração sem os gates aplicáveis, com escopo mínimo de:

1. exigir pull request para alterações na `main`;
2. exigir o gate `Dependency health` antes da integração;
3. impedir force push;
4. impedir exclusão da `main`;
5. exigir resolução de discussões de revisão quando suportado pela configuração do repositório.

A configuração não altera código, banco, dados, regras de negócio ou Production. A ativação deve ser comprovada diretamente no estado do GitHub, pois não é representada por arquivo versionado.


### TECH-DESIGN-001 — Repertório de design profissional reutilizável e verificação visual

**Data:** 29 de outubro de 2026  
**Classificação:** necessidade técnica de qualidade visual e governança do processo de design.  
**Decisão:** APROVADA PARA IMPLEMENTAÇÃO E PUBLICAÇÃO, limitada ao escopo técnico do PR #208.

O responsável pelo produto aprovou a estruturação de ferramentas profissionais de design e sua aplicação **em todo o projeto** sempre que houver trabalho visual. A implementação inicial restringe-se à infraestrutura reutilizável e à instrumentação da **barra lateral** como primeiro componente de avaliação; não aprova nenhuma mudança artística específica no componente de produção.

**Escopo autorizado:**

1. Versionar as skills originais de Frontend Design, UI/UX Pro Max e Impeccable, com a auditoria Vercel Web Interface Guidelines como complemento e Apple HIG como referência de refinamento.
2. Criar a skill coordenadora `impeccable-frontend-design`, destinada a orientar seleção de ferramentas, consistência e crítica visual sem instruções conflitantes.
3. Inserir referência obrigatória à skill coordenadora em `AGENTS.md`, para trabalhos de interface, ícones, layout e comunicação visual em todo o CTRH.
4. Acrescentar consultas testadas à base UI/UX Pro Max e o launcher/roteiros do Impeccable, sem instalar bibliotecas concorrentes de ícones no runtime.
5. Acrescentar testes Playwright, capturas automatizadas e atlas de candidatos iconográficos em ambiente de estudo; manter os componentes operacionais intactos.
6. Manter documentação de uso, licenças, limitações, gates de aprovação e instruções portáteis para outros projetos.

**Limites:** não altera Supabase, rotas, navegação real, tela de login, logomarca, campos, regras de negócio nem componentes visuais aprovados. A imagem dos Arcos da Lapa e a identidade original continuam referências preservadas. Nenhuma reconfiguração da conta ChatGPT ou disponibilização automática a outros repositórios é presumida. A implantação visual da barra lateral exige preview e aprovação estética próprios.

**Validação e reversibilidade:** os workflows GitHub Actions exercitam os recursos de design e capturam telas reais; a implementação está em branch isolada com reversão por revert do merge. Publicação do PR #208 foi autorizada condicionalmente à revisão da skill proposta e aos gates de CI pelo responsável em 29/10/2026.

### TECH-DESIGN-002 — Storybook isolado para componentes reais

**Data:** 29 de outubro de 2026  
**Decisão:** APROVADO PARA INSTALAÇÃO TÉCNICA, sem alteração de aparência ou comportamento em Production.

O responsável pelo produto autorizou a utilização de ferramentas profissionais de criação e validação visual, entre elas o Storybook, para todos os componentes do projeto. A primeira aplicação é a barra lateral real. O escopo consiste em adicionar Storybook React/Vite e complementos de acessibilidade/documentação **somente em devDependencies**, com `package-lock.json` e scripts próprios; criar histórias isoladas de `SiteNavigation` e `BrandLogo`; e verificar build, lint, testes e CI antes da integração.

Não são autorizados nesta decisão novos ícones operacionais, alterações da logomarca, grafismos, rotas, permissões, Supabase ou publicação de redesenho sem aprovação visual. O PR de execução é #213, sobre a `main` corrente, substituindo o antigo PR demonstrativo #212.

### TECH-DESIGN-003 — Protocolo permanente de testes evolutivos e homologação visual

**Data:** 29 de outubro de 2026  
**Estado:** DECISÕES DE PROCESSO APROVADAS E REGISTRADAS; execução documental pelo PR #218.  
**Classificação:** governança transversal de qualidade e verificação, sem autorização implícita para redesenhar funcionalidades.

O responsável pelo produto determinou que os critérios não fiquem restritos à barra lateral nem ao PR #215, mas orientem permanentemente a evolução de UI, layout, iconografia, comunicação visual e testes do CTRH. Decisões expressas:

1. Testes protegem **comportamentos e requisitos aprovados**, não classes CSS, desenho anterior, posições rígidas ou estrutura DOM que a própria alteração legitimamente transforma. Atualizar testes obsoletos com justificativa e manter invariantes funcionais, sem mascarar falhas nem reduzir cobertura para obter CI verde.
2. Classificar cada reprovação como regressão real, teste desatualizado, diferença de ambiente/fixture ou instabilidade, usando evidência, reprodução e diagnóstico causal. Evitar duplicação de cenários inúteis.
3. A homologação artística final é **humana**. Os agentes entregam URL do preview, SHA, proveniência das imagens e comparação fiel de antes/depois em viewports e estados equivalentes, sem apresentar screenshot DEV, mockup ou screenshot contaminado por Devtools como tela real publicada.
4. Prioridade operacional: notebooks corporativos de **15 polegadas** e monitores de **21–24 polegadas**, com validação apropriada de monitores grandes/**32 polegadas 4K**; considerar largura em pixels CSS, zoom, escala e nitidez dos ativos separadamente.
5. Preservar a solução **mobile com botão retrátil** aprovada e testar funcionamento essencial, sem expandir desnecessariamente essa frente. A lateral não exige modificar a tabela operacional; verificar integridade, ações acessíveis, rolagem interna e ausência de overflow global antes de classificar falhas.
6. A hipótese de limitar visualmente a extensão do fundo azul vazio da navegação é **alternativa a estudar**, não decisão de layout homologada nem obrigação para outras telas.

**Fonte operacional:** `docs/design/PROTOCOLO_PERMANENTE_EVOLUCAO_VISUAL_CTRH.md`, referenciado pelo `AGENTS.md`; habilidades no plugin privado Visual Quality v0.1.1. **Limites:** esta decisão não aprova código artístico da Opção 2, não autoriza merge do PR #215 nem substitui homologação do preview.



## TECH-DESIGN-004 — Integração da Opção 2 original e autorização de publicação (30/10/2026)

**Decisão expressa do responsável pelo produto nesta conversa:** usar os códigos originais Gemini anexados para corrigir a barra lateral e publicar. O pedido mais recente solicitou checkpoint remoto de todo o trabalho para continuidade por outro agente, por término próximo da cota. Classificação: correção técnica e implementação visual anteriormente discutida, restrita à barra lateral.

A referência é a Opção 2 original: marinho, Georgia, símbolo oficial com tratamento bicolor, ícones lineares e assets originais de brasão/Arcos. Preservar destinos, acesso condicional à Administração, menu retrátil móvel e a tabela com todas as colunas/dados e rolagem interna. Não autoriza redesenho de outras telas, mudanças de regras, banco, RLS ou dependências.

A autorização específica de correção e publicação já foi dada; não é autorização geral de evolução futura nem declaração de homologação estética de qualquer renderização ainda não apresentada. Resultados técnicos e aprovação humana não devem ser confundidos.

**Atualização de homologação — 30/10/2026:** o responsável pelo produto examinou expressamente o [Preview Vercel da Opção 2](https://demandas-rhsme-expansao-q8t8gr65n-wilson-m-peixotos-projects.vercel.app), correspondente ao SHA `49e1aafa33c65935c181445d44a926b9e0832d6e` do PR #215, declarou a composição aprovada e autorizou sua promoção à produção. Os gates aplicáveis desse SHA estavam aprovados; o Preview, `READY`. **Decisão: APROVADA a homologação artística e a integração do PR #215 no escopo da barra lateral.** O checkpoint e a reprovação inicial de foco ficam preservados como histórico em [RETOMADA_PR215_CHECKPOINT_2026-10-30.md](../design/RETOMADA_PR215_CHECKPOINT_2026-10-30.md). Esta atualização documental registra o aceite, sem modificar a composição aprovada; a publicação efetiva deve ser confirmada posteriormente no SHA integrado e no endereço oficial.


### TECH-DESIGN-005 — Correção pós-publicação de densidade, visibilidade das ações e assinatura institucional (30/10/2026)

**Decisão e autorização expressa do responsável pelo produto:** após a inspeção autenticada de Production do PR #215, o responsável apontou excesso de áreas laterais vazias, compressão injustificada da carteira, perda de visibilidade direta de comandos operacionais, iconografia insuficientemente clara e falha da marca Prefeitura Rio / Educação no login. Determinou expressamente: **“agora faça as correções necessárias”**, reiterando o uso das ferramentas profissionais de design, iconografia, Storybook e Playwright já instaladas.

**Escopo autorizado:** (1) ajustar a largura máxima do shell desktop para aproveitar monitores grandes sem perder os limites responsivos; (2) preservar as oito colunas, rolagem interna e ações, expondo novamente os comandos seguros de rotina nas células em desktop, com rótulos acessíveis e controles legíveis; a exclusão continua com acesso deliberado e protegido; (3) substituir a assinatura do login defeituosa por ativo institucional autêntico e válido, sem recriar a marca; (4) calibrar o acabamento dos controles alterados. Manter a barra lateral Opção 2, a navegação móvel aprovada, login, rotas, papéis, dados e Supabase. Não incluir nova biblioteca de runtime nem alterações de banco.

**Condições de aceite:** evidências reais nos viewports desktop 1280, 1366, 1920 e 2560 px CSS, uso horizontal adequado e ações diretas visíveis; preservação do acesso via menu em espaços pequenos e rolagem interna, foco, títulos acessíveis, testes de rotas/permissões; verificação real de decodificação e pixels da marca, não apenas HTTP 200; CI completa no SHA do PR; Preview para homologação estética expressa **antes de integração em Production**.

**Estado:** implementação autorizada, ainda não homologada nem publicada. Documento registra a decisão antes do pacote de código.
