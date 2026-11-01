# PLANO INTEGRADO REFORMULADO — CENTRAL DE DEMANDAS CTRH

## Dois trilhos coordenados: evolução da operação atual e preparação/incorporação do legado

**Versão da minuta:** 3.1  
**Data de corte:** 26 de julho de 2026  
**Status:** MINUTA ESTRATÉGICA PARA DELIBERAÇÃO DO RESPONSÁVEL PELO PRODUTO  
**Efeito:** não autoriza código, migrations, cargas, branches, pull requests, Preview ou publicação  
**Produto:** Central de Demandas — CTRH / SME-RJ  
**Repositório:** `WilsonMPeixoto-2/demandas-rhsme-expansao`  
**Produção:** `https://demandas-rhsme-expansao.vercel.app/`  
**Supabase verificado:** `CTRH PROCESSOS`, ref `kdhekkzwcokfrpcrsllr`, região `sa-east-1`

> Esta minuta consolida a cobertura factual e estrutural do Plano Integrado Reformulado v3.0 com as contribuições analíticas úteis do Plano Mestre de Reconciliação, Escala e Evolução Pré-R5. Ela corrige o desequilíbrio que subordinava excessivamente o programa de correções da operação atual à futura importação do legado.
>
> O Plano Remanescente v2.1 continua sendo o documento normativo vigente até que esta v3.1 seja debatida, corrigida, aprovada e versionada no repositório. Nenhuma recomendação apresentada neste documento equivale a decisão do responsável pelo produto.

> **Controle de mudança vigente — GOV-012 (29/07/2026):** a execução atual não depende da chegada do legado futuro. O caminho crítico passa por A1-Core residual, R4 e R5; R2 e otimizações de escala vêm depois das funções prioritárias. R1-1 e R1-4 autônomo ficam adiados, e a ordem dos prazos integra o R4-1. Esta decisão registrada prevalece sobre a sequência recomendada originalmente nesta minuta.

> **Controle de mudança vigente — GOV-013 (01/08/2026):** o produto inicial busca completude operacional, não a implementação exaustiva de todas as possibilidades deste plano. Código, Supabase, interface e testes atuais devem ser confrontados antes de classificar qualquer lacuna. R5 limita-se ao pacote Essencial autorizado; R1 residual, R2, R5 avançado e extensões de R6 a R11 tornam-se evoluções condicionadas a evidência de uso, risco ou escala. Capacidades já materializadas são preservadas; segurança, release proporcional, E2 e a homologação final do R12 continuam obrigatórios. O Trilho B permanece preservado para decisão com a fonte real do legado. A classificação completa está em `ATUALIZACAO_COMPLETUDE_OPERACIONAL_2026-08-01.md` e prevalece sobre sequências ou gates mais amplos descritos originalmente nesta minuta.

> **Decisão visual posterior — UX-LOGIN-001 (01/11/2026):** autorização específica para implementar e validar em PR/Preview somente o login fiel à primeira arte canônica 1586 × 992. Não amplia os pacotes deste plano, não altera contratos de autenticação ou dados e não autoriza merge/Production. Ver Registro e `docs/design/LOGIN_MONUMENTAL_CANONICO.md`.

---

# 1. FINALIDADE E CORREÇÃO DE EIXO

A base atual contém menos de 10% das demandas reais do sistema legado. Essa premissa precisa orientar toda a evolução do SITE CTRH, porque mais de 90% do acervo ainda será recebido e poderá conter formatos, domínios, responsáveis, setores, classificações, datas e inconsistências ainda não observados.

Entretanto, a compatibilidade com o legado não pode se tornar o único eixo do projeto nem paralisar o programa de correções da operação atual. O sistema já possui usuários, rotas, regras aprovadas, dados em produção e deficiências estruturais que precisam ser corrigidas independentemente do momento exato da próxima extração.

A v3.1 organiza o trabalho em dois trilhos coordenados:

1. **Trilho A — Evolução da operação atual:** corrige integridade, concorrência, consulta, escala, prazos, próxima ação, andamento, prontuário e experiência cotidiana do SITE CTRH.
2. **Trilho B — Preparação e incorporação do legado:** preserva fontes, recebe lotes, registra pendências, reconcilia responsáveis e domínios, compara versões e promove dados com rastreabilidade.

Os dois trilhos compartilham princípios, dados e infraestrutura, mas possuem entregas próprias. Uma pendência do legado somente bloqueia a parte do Trilho A que dependa materialmente dela. Da mesma forma, uma correção da operação atual não pode apagar, truncar ou tornar impossível a futura recepção dos dados anteriores.

## 1.1 Regra de coordenação

> Nenhum trilho pode paralisar genericamente o outro, e nenhum trilho pode apagar, contradizer ou inviabilizar o outro.

Quando surgir uma dependência:

- interromper apenas o item afetado;
- registrar a dependência e a decisão necessária;
- permitir que pacotes independentes prossigam;
- impedir implementação que antecipe silenciosamente a decisão pendente;
- manter documentação, código e banco coerentes com o estado efetivamente aprovado.

## 1.2 Resultado esperado desta reformulação

Ao final do escopo coberto por esta minuta, o projeto deverá possuir:

- uma linha funcional e documental única entre GitHub, Supabase e Vercel;
- operação corrente protegida por integridade, concorrência e consulta escalável;
- contrato seguro para receber e preservar integralmente dados legados;
- mecanismo explícito para repetição, comparação e atualização de processos já existentes;
- filas de saneamento sem destruição ou coerção silenciosa;
- prazos e próxima ação compreensíveis na rotina atual;
- andamento separado de mudança de status;
- prontuário escalável e inteligível, inclusive diante de eventos técnicos e de importação;
- decisões de produto claramente separadas de recomendações técnicas.

---

# 2. AUTORIDADE, GOVERNANÇA E CLASSIFICAÇÃO DAS AFIRMAÇÕES

## 2.1 Autoridade documental

Enquanto esta minuta não for aprovada e versionada, permanece vigente a ordem documental definida em `AGENTS.md`, no Adendo de Governança, no Protocolo de Homologação, no Registro de Decisões, na Política de Sincronização Documental, no `PRODUCT_CONTEXT`, no Plano Remanescente v2.1 e no Handoff.

A aprovação desta minuta não deve criar uma segunda autoridade concorrente. Quando aprovada, ela deverá:

1. substituir expressamente o Plano Remanescente v2.1 como roteiro vigente;
2. atualizar as referências em `AGENTS.md`, `PRODUCT_CONTEXT`, Handoff e documentação técnica;
3. marcar v2.1, v3.0 e o plano anexo analisado como históricos ou minutas superadas;
4. preservar a íntegra no histórico Git;
5. impedir que duas versões com a mesma autoridade permaneçam vigentes.

## 2.2 Regra de decisão

O plano organiza questões, alternativas, recomendações e dependências. Ele não autoriza automaticamente nenhuma solução interna.

Para cada escolha de produto ou regra de negócio deverão ser apresentados:

1. funcionamento atual;
2. mudança concreta na tela, rotina, código e dados;
3. usuários afetados;
4. cenário real de uso;
5. alternativas, incluindo manter o comportamento atual;
6. recomendação claramente identificada como não vinculante;
7. benefícios, custos e riscos;
8. dependências;
9. reversibilidade;
10. decisão expressa: aprovar, alterar, adiar ou rejeitar.

## 2.3 Classificação obrigatória

| Classe | Significado |
|---|---|
| **Fato verificado** | Demonstrado por código, banco, dados, ambiente ou documento vigente. |
| **Decisão aprovada** | Expressamente deliberada e registrada pelo responsável pelo produto. |
| **Diretriz expressamente determinada nesta revisão** | Orientação dada pelo responsável para elaboração da v3.1; deverá ser formalizada no Registro de Decisões se o plano for aprovado. |
| **Correção necessária** | Inconsistência objetiva cuja correção não exige escolher uma nova regra de produto. |
| **Inferência** | Consequência lógica apoiada em fatos, ainda não comprovada por execução. |
| **Recomendação** | Solução tecnicamente preferida, ainda não aprovada. |
| **Decisão pendente** | Escolha com efeito em produto, negócio, dados, permissão, cálculo ou experiência. |
| **Informação externa necessária** | Fato que precisa ser obtido da fonte do legado, de fornecedor, da equipe ou de outro ambiente antes de decidir. |
| **Reconciliação documental** | Correção de texto divergente de decisão já aprovada, sem reabrir o mérito. |

Nenhuma recomendação poderá aparecer como “regra estabelecida” antes da aprovação correspondente.

---

# 3. DIRETRIZES TRANSVERSAIS

## 3.1 Diretriz de dois trilhos

**Situação:** determinada expressamente pelo responsável nesta revisão; ainda precisa ser formalizada documentalmente após aprovação da v3.1.

Toda tarefa de planejamento, análise, implementação, teste ou homologação deverá distinguir:

- impacto na operação atual;
- impacto nos dados legados já importados;
- impacto nas cargas legadas futuras;
- dependências reais entre os dois trilhos;
- itens que podem avançar de modo independente.

## 3.2 Preservação integral do legado

**Situação:** diretriz expressamente determinada pelo responsável.

1. A base atual representa menos de 10% do universo legado.
2. Regras rigorosas para novas operações não justificam destruir, omitir ou apagar dados antigos.
3. Nenhuma linha recebida pode desaparecer por contrariar uma regra atual.
4. A falha de um campo não autoriza o descarte silencioso da demanda inteira.
5. Nenhum valor será truncado sem registro e aprovação.
6. Informação desconhecida não será convertida automaticamente em vazio, “Sem responsável”, “Não informado”, “Outros”, “Ajustar” ou categoria semelhante.
7. Toda transformação deve conservar o valor original e a razão da transformação.
8. Pendências precisam gerar listas, avisos, relatórios e possibilidade de saneamento posterior.
9. A exceção administrativa do legado não reintroduz texto livre ou domínios abertos na operação cotidiana.
10. Nenhuma correção poderá apagar histórico, demanda completa, fonte original ou evidência necessária à auditoria.

## 3.3 Estados que não podem ser confundidos

| Estado | UUID | Texto operacional | Significado |
|---|---:|---|---|
| Responsável oficial | presente | nome derivado do perfil | vínculo operacional válido |
| Sem responsável | nulo | vazio | ausência explícita de atribuição |
| Legado pendente | nulo | nome original preservado | identidade histórica ainda não conciliada |
| Linha recebida não promovida | não se aplica | fonte bruta preservada fora da tabela operacional | registro recebido, mas sem identidade ou consistência mínima para materialização segura |

`Legado pendente` não pode ser convertido silenciosamente em `Sem responsável`.

## 3.4 Preservar não significa necessariamente publicar na carteira

A obrigação aprovada é não perder a informação. A arquitetura específica ainda depende de decisão.

**Recomendação:** distinguir os estados administrativos:

1. `recebida` — fonte e linha preservadas;
2. `normalizada` — interpretação produzida sem substituir a fonte;
3. `apta` — possui identidade e consistência mínimas;
4. `pendente` — depende de correção ou decisão;
5. `promovida` — materializada em `sme_demandas` com rastreabilidade;
6. `conflitante` — colide com registro atual e não pode ser aplicada silenciosamente;
7. `isolada` — retirada da operação por medida compensatória, sem exclusão física da evidência.

A recomendação de uma camada intermediária ainda precisa de aprovação no Trilho B.

## 3.5 Nenhuma correlação aproximada silenciosa

- nomes semelhantes não serão vinculados automaticamente;
- alias somente aponta para um UUID após aprovação;
- correspondência ambígua exige decisão;
- nome desconhecido permanece preservado;
- ausência de correspondência não equivale a ausência de responsável;
- perfil inativo continua sendo perfil oficial conforme R3-D02; avisos ou necessidade de reatribuição são questões de experiência separadas.

## 3.6 Dry-run obrigatório para cargas

Nenhuma aplicação definitiva de lote ocorrerá sem dry-run que apresente, no mínimo:

- total recebido e total contabilizado;
- arquivos, hashes, linhas e período de extração;
- registros inéditos, repetidos, idênticos, complementares e conflitantes;
- responsáveis vinculados, pendentes e ambíguos;
- setores, classificações, tipos e status desconhecidos;
- prazos inválidos, incoerentes ou ausentes;
- registros sem identidade mínima;
- mudanças propostas sobre demandas existentes;
- impacto estimado sobre carteiras, indicadores, histórico e volume;
- lote canônico que será exatamente o aplicado após aprovação.

## 3.7 Sincronização documental

Toda alteração concreta de lógica, regra, obrigatoriedade, modelo de dados, cálculo, rota, permissão ou comportamento visível atualiza no mesmo trabalho os documentos vigentes afetados. Código e testes corretos não bastam quando a documentação continua descrevendo outra regra.

---

# 4. MÉTODO ANALÍTICO OBRIGATÓRIO

## 4.1 Fluxo de ponta a ponta

Para toda mudança relevante, acompanhar o comportamento completo:

```text
entrada humana ou arquivo
→ validação cliente
→ serviço e contrato
→ RPC ou consulta
→ defaults
→ gatilhos
→ constraints
→ gravação/transação
→ histórico e auditoria
→ Realtime/cache
→ consulta, busca e filtros
→ indicadores e Excel
→ correção, reprocessamento e rollback
```

## 4.2 Busca por caminhos paralelos

Verificar sistematicamente:

- fluxo atual e fluxo legado;
- interface e script administrativo;
- RPC atual e RPC antiga;
- importador governado e bootstrap;
- banco versionado e função remota efetiva;
- Preview e Production;
- dado novo, legado já importado e legado futuro;
- operação individual, lote, reexecução e concorrência.

## 4.3 Busca por armadilhas adjacentes

Depois da causa principal, procurar:

- defaults ou triggers que apagam ou alteram valores;
- validações que só falham depois do dry-run;
- colisões com registros já existentes;
- inconsistências entre linha bruta e dado operacional;
- aumento artificial de eventos;
- impacto em prontuário, métricas, busca e Excel;
- dependência de coleção integral;
- dados reais, segredos ou informações pessoais no Git;
- documentação que prometa capacidade não existente;
- regras baseadas numa amostra não representativa.

## 4.4 Gate de impacto cruzado

Toda alteração deverá responder:

1. Como funciona na operação atual?
2. Como afeta o legado já importado?
3. Como afeta cargas futuras?
4. Algum trigger, constraint ou RPC altera, limpa ou rejeita o valor antigo?
5. O valor original permanece recuperável?
6. A irregularidade será rejeitada, preservada, isolada ou saneada?
7. Onde o administrador verá a pendência?
8. Busca, filtros, carteiras, indicadores ou Excel mudam?
9. Histórico, autoria ou volume de eventos mudam?
10. A operação é idempotente?
11. Existe rollback sem apagar dados válidos?
12. Quais documentos precisam mudar?

Quando uma resposta necessária estiver indefinida, interromper apenas o item afetado. Pacotes independentes podem continuar quando forem seguros e não anteciparem a decisão.

---

# 5. ESTADO ATUAL VERIFICADO

## 5.1 Ambientes

| Elemento | Estado verificado em 25–26/07/2026 |
|---|---|
| `main` do GitHub | `ee61dab5917f84b034305ba2119e4bbad673f176` |
| Última alteração funcional na `main` | PR #53, SHA `967a727d25fcbae848a7556da510e9387581f7b7` |
| Production Vercel | PR #52, SHA `98ce45df2e05d223c89227dea244dc53a7d4e363` |
| Supabase | `CTRH PROCESSOS`, ref correta `kdhekkzwcokfrpcrsllr` |
| Última migration remota | `20260724011303_r3_responsaveis_oficiais` |

### Correções objetivas de base

1. Production ainda não contém o refinamento funcional do PR #53.
2. `docs/HANDOFF.md` e `docs/SUPABASE_SETUP.md` registram a ref incorreta `kdhekkzwcokfrsllr`; a ref verificada é `kdhekkzwcokfrpcrsllr`.
3. A documentação vigente ainda não registra adequadamente a premissa de que mais de 90% do legado será recebido.
4. Existem duas minutas chamadas v3.0; a aprovação da v3.1 deve eliminar essa duplicidade de autoridade.

## 5.2 Fotografia do banco

| Indicador | Resultado |
|---|---:|
| Demandas | 379 |
| Demandas com UUID oficial | 378 |
| Legado textual pendente | 1 |
| Demandas genuinamente sem responsável | 0 |
| Eventos históricos | 764 |
| Perfis | 13 |
| Administradores ativos | 2 |
| Editores ativos | 11 |
| Demandas com origem `legado` | 379 |
| Demandas com origem `sistema` | 0 |
| Links de origem ausentes | 379 |
| Demandas abertas sem próxima ação | 376 |
| Demandas abertas sem data de acompanhamento | 376 |
| Prazo interno sem data | 369 |
| Prazo final sem data | 354 |
| Demandas excluídas logicamente | 0 |

A base de produção ainda não contém população representativa de demandas nativas criadas pelo uso cotidiano do SITE CTRH. As regras novas existem tecnicamente, mas não foram exercidas em escala real.

## 5.3 Distribuições relevantes

### Status

| Status | Quantidade |
|---|---:|
| Tramitado | 262 |
| Aguardando Andamento | 108 |
| Sobrestado | 4 |
| Encerrado | 3 |
| Para Assinatura | 2 |

### Eventos

| Tipo | Quantidade |
|---|---:|
| criação | 379 |
| reatribuição | 378 |
| mudança de status | 7 |
| andamento | 0 |
| edição | 0 |
| alteração de prazo | 0 |
| exclusão | 0 |
| restauração | 0 |

### Setores

A amostra contém pelo menos quinze grafias ou estruturas distintas, incluindo `E/CTRH`, `E/CTRH/CARH`, `CARH`, `SME`, `APM`, `GAMCF`, `IHA`, `E/SUBG` e outras. A distribuição atual não é suficiente para definir o significado definitivo do campo.

### Classificações

A amostra atual usa quatorze classificações, mas isso não comprova que o catálogo represente o universo futuro.

## 5.4 Integridade atual

As cinco constraints `NOT VALID` não apresentam violações na fotografia atual:

- consistência do prazo interno;
- consistência do prazo final;
- domínio de origem;
- consistência de exclusão lógica;
- domínio de tipo de evento.

Isso permite discutir sua validação sobre a tabela operacional atual, mas não autoriza concluir que futuras linhas brutas do legado já chegarão compatíveis.

## 5.5 Proveniência incompleta

- existe um lote formal concluído;
- 318 demandas possuem vínculo com `private.sme_importacao_itens`;
- 61 demandas não possuem proveniência formal item a item;
- a trilha atual guarda hashes e vínculos, mas não preserva no banco a linha bruta, o nome efetivo do arquivo e todas as decisões de transformação.

A v3.1 precisa tratar tanto a proveniência futura quanto a impossibilidade de reconstruir fatos não comprováveis das 61 demandas atuais.

## 5.6 Dados reais versionados

`scripts/bootstrap/initial-demandas.json` contém dados operacionais reais, como número, assunto e responsável. Isso contradiz a política de não manter dados reais no repositório.

A correção exige inventário, cópia administrativa segura, substituição por dados sintéticos e decisão separada sobre eventual reescrita do histórico Git. A remoção destrutiva do histórico não está automaticamente autorizada.

## 5.7 Problemas técnicos atuais independentes do legado

- carregamento integral de demandas e histórico;
- paginação apenas visual no cliente;
- recargas integrais após mutações e Realtime;
- rota profunda dependente da coleção carregada;
- concorrência otimista ausente;
- experiência completa de próxima ação ainda não entregue;
- semântica do campo `setor` ainda aberta;
- RPCs e contratos legados ainda presentes;
- Production anterior ao PR #53.

Esses problemas justificam um Trilho A próprio e não devem aguardar toda a migração para serem corrigidos.

---

# 6. ARQUITETURA DO PROGRAMA EM DOIS TRILHOS

## 6.1 Núcleo comum

O núcleo comum contém tarefas que protegem ambos os trilhos:

- linha de base de ambientes;
- autoridade documental;
- segurança de dados no Git;
- política de preservação;
- testes e CI;
- migrations versionadas;
- contratos de auditoria;
- documentação e Handoff;
- rollback e homologação.

## 6.2 Trilho A — Evolução da operação atual

| Ordem | Pacote | Resultado independente |
|---:|---|---|
| A0 | Rebaseline operacional | Production, documentação e ambiente claramente alinhados |
| A1-Core | núcleo residual | gate de migrations, contratos obsoletos e concorrência |
| A4 | R4 | prazos, próxima ação e saneamento operacional |
| A5 | R5A | andamento e transições operacionais |
| A6 | R5B | prontuário canônico |
| A7 | R5D | links, origem, lixeira e restauração |
| A2 | R2 pós-funções prioritárias | consulta escalável, histórico sob demanda e E2E remoto |
| A3 | checkpoint R3 | nenhuma regressão de UUID ou carteiras; setor tratado sem inferência |

## 6.3 Trilho B — Preparação e incorporação do legado

| Ordem | Pacote | Resultado independente |
|---:|---|---|
| B0 | Inventário e contrato factual | natureza das extrações e fontes conhecida |
| B1 | L0 — arquitetura de recepção | decisões sobre preservação, identidade e conflitos aprovadas |
| B2 | L1 — fundação de ingestão | fontes e linhas preservadas; dry-run v2; nenhuma promoção massiva |
| B3 | L2 — incorporação controlada | registros aptos promovidos; pendências preservadas |
| B4 | Reconciliação semântica | aliases, setores, classificações e outros domínios reavaliados |
| B5 | R5C | proveniência legada e eventos técnicos inteligíveis |

## 6.4 Marcos de dependência

| Item | Pode avançar sem o outro trilho? | Dependência real |
|---|---|---|
| A1 — constraints atuais e concorrência | sim | deve evitar regra que destrua legado; não precisa esperar toda a importação |
| A2 — paginação e consulta | sim e deve avançar cedo | prepara o sistema para o volume final |
| B1 — decisões de recepção | sim | exige informação sobre futuras extrações, não depende de A1 completo |
| B2 — preservação bruta e dry-run | após B1 | pode ser implementada antes de A2, desde que não faça promoção massiva |
| B3 — promoção ampliada | não integralmente | depende de A2 e dos contratos de integridade aplicáveis de A1 |
| A4 — regras para demandas nativas | sim | decisões de domínios definitivos podem aguardar amostra maior |
| A5 — andamento | sim, após A1/A4 | o fluxo de andamento não exige concluir A2; usa concorrência do A1 e regras operacionais do A4 |
| A6 — prontuário | sim, após os recortes de consulta individual e histórico do A2 | R2-1/R2-3 entram como fundação direta do prontuário, sem exigir concluir todo o pacote de escala |
| B5 — proveniência no prontuário | não | depende do modelo efetivo de ingestão e de A6 |
| A7 — lixeira | sim | link de origem depende de contrato próprio; lixeira não deve ficar bloqueada por ele |

---

# 7. P0 — NÚCLEO COMUM DE REBASELINE E SEGURANÇA

## 7.1 P0-A — Autoridade e versionamento

**Correção necessária:** após aprovação, criar um único plano v3.1 vigente e marcar como históricos:

- Plano Remanescente v2.1;
- Plano Integrado v3.0;
- Plano Mestre anexo analisado;
- demais documentos incompatíveis.

Nenhum arquivo histórico deve ser apagado; sua condição não normativa deve ficar explícita.

## 7.2 P0-B — Correções documentais objetivas

- corrigir a ref do Supabase;
- registrar a posição real de Production;
- registrar os 318 vínculos formais e as 61 demandas sem proveniência item a item;
- registrar a premissa de menos de 10% do legado;
- corrigir referências ao próximo ciclo autorizado após aprovação da v3.1.

## 7.3 P0-C — Alinhamento de Production

**Recomendação:** publicar em atividade isolada o estado funcional do PR #53 antes do primeiro novo pacote funcional.

A publicação exige:

- confirmação do SHA;
- gate integral;
- Preview ou validação equivalente;
- homologação das rotas `/demandas` e `/minhas-demandas`;
- verificação dos indicadores contextuais;
- registro no Handoff.

Essa recomendação não autoriza o deploy sem decisão expressa.

## 7.4 P0-D — Dados reais no Git

### Correções necessárias

1. inventariar arquivos e conteúdo real versionado;
2. preservar uma cópia administrativa fora do Git, com hash e controle de acesso;
3. substituir fixtures operacionais por dados sintéticos;
4. impedir reintrodução por gate automatizado;
5. avaliar exposição e necessidade de rotação de dados ou segredos, se encontrados.

### Decisão pendente P0-D01 — Histórico Git

Alternativas:

- remover somente da árvore corrente e preservar histórico;
- reescrever o histórico Git;
- adotar mitigação intermediária, conforme avaliação de exposição.

**Recomendação:** não reescrever o histórico antes de inventário, avaliação de risco, impacto em branches/PRs/clones e plano de recuperação.

## 7.5 P0-E — Proveniência retroativa das 61 demandas

### Recomendação

- correlacionar somente quando houver evidência objetiva;
- registrar “origem não reconstruída” quando arquivo e linha não puderem ser comprovados;
- nunca inventar arquivo, lote ou linha;
- produzir relatório das 61 ocorrências;
- distinguir importação formal, bootstrap e origem indeterminada.

## 7.6 P0-F — Inventário da próxima extração

Esta é uma **informação externa necessária**, não uma decisão de produto.

Apurar:

- formato dos arquivos;
- se serão incrementais, integrais ou mistos;
- se repetirão processos já importados;
- se conterão atualizações dos mesmos processos;
- campos disponíveis;
- presença de histórico, usuários, datas e identificadores;
- quantidade total estimada;
- paginação e limites de exportação;
- possibilidade de congelamento ou corte final;
- existência de identificador estável além do número exibido.

## 7.7 Gate de saída do P0

- uma única autoridade documental preparada para aprovação;
- ambientes identificados sem ambiguidade;
- risco de dados reais no Git inventariado;
- plano de correção sem destruição improvisada;
- 61 demandas classificadas quanto à reconstruibilidade da proveniência;
- informação da próxima extração solicitada e registrada;
- nenhum pacote funcional implementado por inferência.

---

# 8. TRILHO A — EVOLUÇÃO DA OPERAÇÃO ATUAL

# 8.1 A1 / R1 — INTEGRIDADE, CONCORRÊNCIA E CONTRATOS OPERACIONAIS

## Objetivo

Fortalecer a operação atual sem exigir que o legado futuro já esteja totalmente saneado e sem criar barreiras destrutivas à sua recepção.

## A1.1 Constraints atuais

**Correção técnica elegível:** consultar novamente as cinco constraints e validar aquelas com zero violações na tabela operacional.

A validação atua sobre `sme_demandas` e `sme_historico`; linhas brutas incompatíveis podem permanecer na camada de ingestão do Trilho B.

## A1.2 Concorrência otimista

### Decisão A1-D01 — Experiência de conflito

**Situação atual:** uma edição aberta anteriormente pode sobrescrever alteração mais recente.

**Alternativas:**

1. última gravação vence;
2. combinação automática de campos;
3. rejeição consciente com preservação do formulário;
4. bloqueio pessimista durante a edição.

**Recomendação:** rejeitar a gravação quando `updated_at` ou versão esperada divergir; preservar o conteúdo digitado; mostrar os campos alterados; permitir recarregar e reaplicar conscientemente; não combinar automaticamente.

## A1.3 Limites de texto

### Decisão A1-D02 — Limites operacionais

Os máximos atuais da amostra não representam o universo completo.

**Recomendação:**

- estabelecer limites de experiência para novas entradas após analisar tela, banco e usos reais;
- não truncar fontes legadas;
- representar excedentes como pendência ou resumo operacional separado;
- manter o valor original recuperável;
- rejeitar somente a nova entrada operacional que exceda o contrato aprovado.

## A1.4 Classificações e domínios

O Trilho A não precisa aguardar todo o legado para corrigir integridade técnica, mas não deve declarar o catálogo atual como universal.

### Decisão A1-D03 — Extensibilidade da classificação

Alternativas:

- catálogo rígido atual;
- catálogo administrável;
- catálogo rígido para operação com campo de origem legado separado;
- classificação normalizada opcional enquanto houver saneamento.

**Recomendação:** preservar classificação original no Trilho B e manter um catálogo operacional controlado, extensível somente por procedimento administrativo aprovado. A arquitetura final depende da amostra ampliada.

## A1.5 Link de origem

### Decisão A1-D04 — Contrato do link

Definir antes de expor:

- sistemas e domínios aceitos;
- quem pode cadastrar;
- validação e normalização;
- obrigatoriedade por tipo;
- tratamento de registros legados sem link;
- comportamento quando o link deixa de existir.

Até essa decisão, a ação “Abrir origem” não entra no escopo funcional.

## A1.6 RPCs antigas

O plano vigente previa manter contratos legados até R12. A antecipação de sua neutralização é uma nova proposta, não uma correção automaticamente autorizada.

### Decisão A1-D05 — Neutralização antecipada

**Recomendação:** inventariar consumidores; bloquear ou redirecionar apenas RPCs que consigam violar invariantes atuais; preservar compatibilidade necessária e rollback; documentar cada contrato removido.

O bootstrap de usuários deve ser separado da importação de demandas. Neutralizar a importação antiga não implica eliminar a preparação administrativa de perfis quando ainda necessária.

## A1.7 Índices, tipos e replay

- confirmar índices de FKs e consultas reais;
- atualizar tipos gerados do Supabase;
- executar replay integral das migrations;
- testar RLS e grants;
- preservar busca, rotas, Excel e R3.

## Gate de saída A1

- constraints elegíveis validadas;
- conflitos concorrentes não sobrescrevem silenciosamente;
- limites operacionais não destroem fonte legada;
- domínios não aparentam completude falsa;
- RPCs antigas inventariadas e tratadas somente conforme decisão;
- migrations e tipos reproduzíveis;
- documentação sincronizada.

---

# 8.2 A2 / R2 — CONSULTA ESCALÁVEL, HISTÓRICO SOB DEMANDA E E2E

## Objetivo

Eliminar a dependência do carregamento integral e preparar a operação para o volume final, independentemente da data exata da grande importação.

## Situação atual

- todas as demandas são carregadas no login;
- todo o histórico é carregado junto;
- paginação é visual;
- mutações e Realtime recarregam coleções completas;
- rota profunda depende da lista carregada.

## Contratos-alvo

```ts
listDemandas(query): Promise<{
  items: Demanda[];
  total: number;
  page: number;
  pageSize: number;
}>;

getDemanda(id): Promise<Demanda | null>;
listHistorico(demandaId, query): Promise<{ items: ComentarioHistorico[]; total: number }>;
listRecentHistory(limit): Promise<ComentarioHistorico[]>;
listTrash(query): Promise<{ items: Demanda[]; total: number }>;
```

As assinaturas são referência técnica e poderão ser ajustadas durante o debate, sem alterar os resultados de produto.

## Pacotes

### A2-A — Repositório paginado

- filtros e ordenação no servidor;
- contagem total confiável;
- paginação determinística;
- consulta por ID;
- carteira pessoal por UUID no servidor.

### A2-B — Busca com paridade

Preservar:

- número com ou sem pontuação;
- assunto;
- responsável oficial e texto legado pesquisável;
- setor;
- classificação;
- status;
- comentário histórico;
- busca multitemo;
- normalização de caixa e acentos;
- ranking aproximado apenas após ausência de resultado exato.

### Decisão A2-D01 — Busca em valores brutos legados

**Recomendação:** a busca operacional deve encontrar a demanda pelo valor normalizado e por aliases relevantes; a busca administrativa da ingestão deve alcançar também a fonte bruta. Não misturar silenciosamente linhas não promovidas com demandas operacionais na mesma lista.

### A2-C — Histórico sob demanda

- carregar somente ao abrir a demanda;
- paginar timelines longas;
- consulta separada de últimas movimentações;
- descartar respostas obsoletas;
- preservar autoria e tipos.

### A2-D — Realtime proporcional

### Decisão A2-D02 — Estratégia de atualização

**Recomendação:** invalidar o item e as consultas afetadas, aplicar coalescência e evitar reload integral; mostrar estado de sincronização quando necessário.

### A2-E — Indicadores e Excel

- calcular sobre todo o recorte;
- nunca limitar à página;
- usar mesma semântica da tela;
- manter exportação integral e rastreável;
- informar limitações de cobertura.

### A2-F — Capacidade e E2E

### Decisão A2-D03 — Meta inicial de capacidade

**Recomendação inicial:** testar pelo menos 5.000 demandas, 50.000 eventos, timelines extensas e exportações sobre milhares de resultados. Recalibrar quando o volume real for conhecido.

Testar Supabase real por papel, estado de usuário, RLS, RPC, Realtime, rede, retomada e rota profunda.

## Gate de saída A2

- nenhuma tela depende da base inteira;
- busca preservada;
- paginação sem omissão ou duplicidade;
- rota profunda independente da página;
- histórico sob demanda;
- Realtime sem recarga integral redundante;
- indicadores e Excel sobre recorte total;
- E2E remoto e capacidade aprovados.

---

# 8.3 A3 — R3 PRESERVADO E SEMÂNTICA RESIDUAL

## Decisões que não serão reabertas

- `responsavel_id` como identidade oficial;
- nome derivado pelo servidor;
- usuário cadastrado ou ausência explícita em novas demandas e reatribuições;
- preservação de legado textual sem UUID;
- `/demandas` como carteira da equipe;
- `/minhas-demandas` como carteira pessoal;
- `escopo=meu` somente como redirecionamento;
- indicadores contextuais por rota;
- perfis selecionáveis independentemente de papel e status, conforme R3-D02.

## A3.1 Semântica de setor

A operação atual pode continuar exibindo o valor existente, mas não deve atribuir significado gerencial não comprovado.

### Decisão A3-D01 — Significado oficial

Possibilidades:

- unidade responsável;
- localização atual;
- destino da tramitação;
- setor do responsável;
- origem institucional;
- mais de uma dimensão misturada no legado.

**Recomendação:** preservar o texto, não derivar automaticamente do responsável, não usar “setores mais ativos” e aguardar amostra ampliada para decidir se o campo deve ser dividido.

Essa decisão semântica não bloqueia A1 e A2. Bloqueia apenas métricas, filtros ou formulários que dependam de um significado oficial novo.

---

# 8.4 A4 / R4 — PRAZOS, PRÓXIMA AÇÃO E SANEAMENTO OPERACIONAL

## Objetivo

Orientar o trabalho atual e transformar lacunas em qualidade de dados sem inventar informações.

## Decisões já aprovadas

- ausência de prazo não é atraso;
- prazo `definido`, `nao_informado` ou `nao_se_aplica`;
- prazo não aplicável exige justificativa;
- prazo interno não pode ultrapassar o final quando ambos existem;
- demanda encerrada não mantém próxima ação;
- andamento não altera status;
- demanda legada incompleta continua consultável e entra em saneamento.

## Separação de intenções

### Decisão A4-D01 — Operações distintas

**Recomendação:** separar claramente:

1. editar dados cadastrais;
2. corrigir qualidade do legado;
3. registrar andamento;
4. alterar status;
5. reatribuir responsável;
6. corrigir prazo.

Isso evita registrar trabalho operacional fictício quando o usuário apenas corrige um dado histórico.

## Obrigatoriedade da próxima ação

### Decisão A4-D02 — Momento da exigência

**Recomendação:**

- criação operacional não encerrada: obrigatória;
- andamento: obrigatória;
- transição para status não encerrado: obrigatória;
- encerramento: removida;
- correção cadastral do legado: não obrigatória, mas mantém pendência visível;
- reatribuição isolada: exigir decisão específica sobre revisão da próxima ação.

## Apresentação

### Decisão A4-D03 — Próxima providência na carteira

**Recomendação:** coluna consolidada com descrição e data no desktop; cartão estruturado equivalente no mobile; próxima providência antes dos prazos no detalhe.

## Fila de qualidade

Separar, no mínimo:

- sem responsável oficial;
- texto legado de responsável;
- sem próxima ação;
- sem data de acompanhamento;
- prazo não informado;
- prazo incoerente;
- setor não normalizado;
- classificação não reconhecida;
- conflito de importação;
- fonte ou proveniência incompleta.

### Decisão A4-D04 — Superfície da fila

Alternativas:

- painel administrativo próprio;
- filtros de qualidade na carteira;
- modelo híbrido.

**Recomendação:** modelo híbrido: visão consolidada administrativa e possibilidade de abrir o recorte correspondente na carteira.

## Gate de saída A4

- prazos coerentes;
- próxima ação exigida somente nas operações aprovadas;
- legado incompleto visível sem coerção;
- saneamento não se confunde com andamento;
- desktop e mobile homologados;
- Excel distingue cobertura e lacuna;
- nenhum dado inventado.

---

# 8.5 A5 / R5A — ANDAMENTO E TRANSIÇÕES OPERACIONAIS

## Objetivo

Entregar as mutações cotidianas de forma auditável, concorrente e semanticamente clara.

## Decisões já aprovadas

- andamento não muda status;
- mudança de status registra transição real;
- mutações passam por RPC nomeada;
- autoria vem de `auth.uid()`;
- responsabilidade e autoria são independentes: o responsável oficial não possui exclusividade sobre a demanda;
- administrador ou editor ativo pode atuar em demanda atribuída a colega, conforme as permissões do papel;
- uma ação registra quem a executou e não muda `responsavel_id`, salvo reatribuição explícita;
- evento e mutação são atômicos;
- exclusão física não é operação cotidiana.

## Decisões pendentes

### A5-D01 — Formulário de andamento

Definir campos, ordem, mensagens e comportamento em demanda encerrada ou excluída.

**Recomendação:** comentário do trabalho realizado, próxima ação e data; impedir andamento em encerrada ou excluída e encaminhar para operação apropriada.

### A5-D02 — Conflito durante andamento ou status

**Recomendação:** aplicar o mesmo contrato de concorrência do A1, preservar formulário e mostrar alterações recentes.

### A5-D03 — Reabertura

Decidir se a transição de `Encerrado` para outro status exige motivo específico e se restaura ou exige nova próxima ação.

## Gate de saída A5

- andamento e status inequivocamente diferentes;
- nenhuma mutação sobrescreve silenciosamente;
- evento correto em uma única transação;
- próxima ação coerente;
- contexto de rota e filtros preservado;
- permissões por papel verificadas.

---

# 8.6 A6 / R5B — PRONTUÁRIO CANÔNICO

## Objetivo

Oferecer uma superfície única que responda situação, responsabilidade, próxima providência, trajetória e qualidade dos dados.

## Decisão A6-D01 — Superfície canônica

Alternativas:

- drawer ampliado;
- página completa;
- modelo híbrido.

**Recomendação:** modelo híbrido: drawer para consulta rápida e página profunda para prontuário extenso, timeline longa, antes/depois e proveniência. A recomendação ainda não está aprovada.

## Conteúdo recomendado

- identificação e estado atual;
- responsável oficial ou condição legada;
- próxima providência e data;
- prazos e situações;
- setor e classificação;
- alertas de qualidade;
- ações permitidas por papel;
- timeline paginada;
- autoria atual ou não identificada;
- antes/depois estruturado;
- distinção entre eventos humanos, administrativos e técnicos;
- preservação da carteira, filtros, busca e retorno.

## Decisão A6-D02 — Drawer e modal redundantes

**Recomendação:** uma única fonte de dados e um prontuário canônico; atalhos podem abrir a mesma experiência, mas não manter dois históricos divergentes.

## Decisão A6-D03 — Autoria e snapshot

**Recomendação:** combinar UUID do autor com fotografia legível no evento; preservar leitura após inativação ou mudança de nome; usar “Autor não identificado” quando não houver evidência; nunca inventar autoria legada.

## Decisão A6-D04 — Eventos técnicos

**Recomendação:** todos permanecem auditáveis, mas eventos repetitivos podem ser agrupados ou recolhidos na camada visual. Nenhum evento deve ser apagado ou ocultado permanentemente.

## Gate de saída A6

- uma superfície canônica;
- timeline sob demanda e escalável;
- autoria inteligível;
- eventos técnicos não dominam a leitura;
- legado incompleto não parece fato moderno;
- navegação preservada;
- desktop, mobile e leitor homologados.

---

# 8.7 A7 / R5D — LINKS, ORIGEM, LIXEIRA E RESTAURAÇÃO

Este pacote separa capacidades administrativas que não devem bloquear o andamento ou o prontuário.

## Lixeira e restauração

- somente administrador;
- exclusão lógica com motivo;
- restauração com motivo;
- histórico preservado;
- consultas paginadas;
- conflito concorrente tratado.

## Link de origem

Somente entra após A1-D04. A ausência de contrato do link não bloqueia a lixeira.

## Decisões pendentes

- apresentação de itens excluídos;
- efeito da restauração sobre próxima ação;
- visibilidade de link inválido ou indisponível;
- domínios aceitos;
- cópia do link interno da demanda.

## Gate de saída A7

- nenhuma exclusão física;
- restauração íntegra;
- permissões corretas;
- link somente conforme contrato aprovado;
- documentação e rollback atualizados.

---

# 9. TRILHO B — PREPARAÇÃO E INCORPORAÇÃO DO LEGADO

# 9.1 B0 — INFORMAÇÕES DA FONTE

Antes das decisões de arquitetura, obter os fatos descritos em P0-F. A equipe do produto não deve “escolher” se a extração é incremental ou integral quando isso depende do sistema fornecedor.

A ausência dessas informações bloqueia somente decisões que dependam do formato real. Não bloqueia A1, A2 ou correções comuns independentes.

---

# 9.2 B1 / L0 — CONTRATO DE RECEPÇÃO

## B1-D01 — Arquitetura de entrada

### Alternativa A — Inserção direta condicionada

Cada linha entra em `sme_demandas` com regras diferentes para `origem = legado`.

**Vantagem:** menor implementação inicial.  
**Riscos:** contaminação operacional, identidade ambígua, conflitos e saneamento difícil.

### Alternativa B — Estágio intermediário

Fontes e linhas são preservadas em área administrativa; somente registros aptos são promovidos.

**Vantagens:** preservação, dry-run real, revisão progressiva, idempotência e isolamento de inconsistências.  
**Custos:** novo modelo, armazenamento e fluxo administrativo.

### Alternativa C — Espelho completo paralelo

Todo o sistema antigo permanece numa base paralela.

**Vantagem:** isolamento máximo.  
**Riscos:** duas bases operacionais, busca e manutenção duplicadas.

**Recomendação:** alternativa B. Ainda requer decisão expressa.

## B1-D02 — Identidade mínima para promoção

**Recomendação:** toda linha é preservada; somente registro com número identificável e não ambiguamente duplicado vira demanda operacional. Linha sem identidade mínima permanece na ingestão.

## B1-D03 — Representação de domínios desconhecidos

A tabela operacional atual exige status, tipo e classificação. O plano não pode simultaneamente proibir valores inventados e promover registros sem representação válida.

Alternativas:

1. manter na ingestão até mapear;
2. adicionar campo original e tornar normalizado opcional;
3. criar estado explícito pendente;
4. usar valor transitório controlado.

**Recomendação:** preservar campo original e manter na ingestão quando o domínio for material para a semântica operacional; promover com estado pendente somente se o modelo aprovado representar explicitamente a incerteza, sem usar “Outros” como certeza artificial.

## B1-D04 — Catálogo de aliases

Alternativas:

- mapa em migration a cada lote;
- mapa manual por lote;
- catálogo persistente e auditável.

**Recomendação:** catálogo persistente contendo texto original, chave normalizada, UUID, aprovador, data, vigência, substituição e lotes de uso.

Perfil inativo continua sendo perfil oficial conforme decisão aprovada; permanece aberta apenas a necessidade de aviso ou futura reatribuição.

## B1-D05 — Granularidade do apply

Alternativas:

- lote integral atômico;
- aplicar somente registros aptos;
- sublotes aprovados;
- promoção individual.

**Recomendação:** fonte integral sempre preservada; promoção em sublotes canônicos aprovados, com contabilidade completa das linhas não promovidas. Essa escolha equilibra atomicidade e não bloqueio por poucas pendências.

## B1-D06 — Processos já existentes

Para cada repetição, classificar:

- idêntica;
- complementar;
- conflitante;
- atualização legítima;
- duplicidade ambígua.

**Recomendação:** nunca “último arquivo vence”; ignorar somente cópia comprovadamente idêntica; qualquer alteração exige comparação, aprovação e preservação do antes/depois; histórico criado no SITE CTRH não pode ser substituído pelo snapshot legado.

## B1-D07 — Visibilidade das linhas não promovidas

Alternativas:

- apenas relatório externo;
- área administrativa interna;
- ambos.

**Recomendação:** ambos, com fonte fora do Git, relatório exportável e área administrativa protegida.

## B1-D08 — Histórico existente no legado

Informação externa necessária: saber se a fonte fornecerá eventos, comentários, datas e autores.

**Recomendação:** importar somente o que for comprovável; distinguir evento histórico de snapshot; não reconstruir trajetória a partir do estado atual; não inventar autoria.

## B1-D09 — Reversão

**Recomendação:** antes do commit, transação e cancelamento; depois do commit, operações compensatórias e isolamento lógico, nunca exclusão física em massa sem autorização destrutiva específica.

## Gate de saída B1

- arquitetura aprovada;
- identidade mínima aprovada;
- representação de domínios desconhecidos decidida;
- catálogo de aliases definido;
- política de repetição e atualização aprovada;
- visibilidade das pendências definida;
- histórico legado classificado;
- nenhuma carga massiva aplicada.

---

# 9.3 B2 / L1 — FUNDAÇÃO TÉCNICA DE INGESTÃO

Somente após aprovação das decisões B1 aplicáveis.

## Pacote B2-A — Fonte imutável

**Recomendação técnica:** criar estruturas privadas para registrar:

- lote e hash agregado;
- arquivo, hash, tamanho, ordem e metadados;
- linha bruta ou representação canônica fiel;
- número original da linha;
- data e responsável administrativo;
- versão do normalizador;
- estado da linha.

Dados reais permanecem protegidos, fora do bundle e sem grants para usuários comuns.

## Pacote B2-B — Normalização e ocorrências

- manter valor bruto e normalizado;
- registrar código, severidade e orientação;
- não excluir linha com erro;
- versionar transformações;
- permitir reprocessamento idempotente;
- comparar resultado entre versões.

## Pacote B2-C — Reconciliação de responsáveis

- alias aprovado → UUID e nome oficial;
- desconhecido → pendente;
- ambíguo → bloqueio da promoção;
- vazio → lacuna, sem invenção;
- vínculo posterior → evento apropriado conforme decisão de histórico.

## Pacote B2-D — Dry-run v2

O dry-run precisa validar o mesmo contrato efetivamente aplicado, incluindo triggers, defaults e representação final. Não pode aprovar lote impossível de aplicar.

## Pacote B2-E — Auditoria e relatórios

Produzir:

- resumo de fontes e hashes;
- linhas recebidas, aptas, pendentes, conflitantes e promovidas;
- responsáveis vinculados e pendentes;
- domínios desconhecidos;
- colisões;
- impacto previsto;
- recibo canônico.

## Pacote B2-F — Caminhos antigos

- separar bootstrap de perfis da carga de demandas;
- impedir reutilização do bootstrap de demandas;
- decidir neutralização da RPC antiga de lote somente com rollback;
- preservar evidência das cargas anteriores.

## Gate de saída B2

- 100% das linhas de teste contabilizadas;
- fonte e transformação rastreáveis;
- dry-run e apply compartilham contrato;
- reprocessamento idempotente;
- nenhum dado promovido sem aprovação;
- testes com entradas sintéticas adversas;
- documentação técnica concluída.

---

# 9.4 B3 / L2 — INCORPORAÇÃO CONTROLADA

## Dependências

- B1 e B2 aprovados e homologados;
- A2 preparado para o volume da promoção;
- contratos de integridade aplicáveis de A1;
- backup e rollback definidos;
- corte ou estratégia de delta conhecida.

## Fluxo recomendado

1. receber e preservar fontes;
2. normalizar;
3. gerar ocorrências;
4. revisar aliases e domínios;
5. executar dry-run;
6. comparar com a base atual;
7. aprovar sublote canônico;
8. promover em transação controlada;
9. reconciliar contagens e hashes;
10. manter pendências visíveis;
11. produzir relatório pós-carga;
12. executar carga delta quando aplicável.

## Decisão B3-D01 — Pendências permitidas em `sme_demandas`

**Recomendação:** admitir demanda legada sem responsável oficial, prazo ou próxima ação quando sua identidade e semântica mínima forem seguras; preservar valores originais; marcar qualidade; não classificar como atraso; exigir saneamento somente na operação pertinente.

Status, tipo ou classificação sem representação segura precisam seguir B1-D03.

## Decisão B3-D02 — Eventos de importação

**Recomendação:**

- vínculo conhecido antes da promoção: evento de criação com metadados resumidos da importação;
- vínculo resolvido depois: reatribuição;
- detalhes completos no registro administrativo do lote;
- evitar criação + reatribuição artificial para cada registro já reconciliado.

## Decisão B3-D03 — Corte e delta

Alternativas:

- congelar o legado durante extração final;
- data de corte com carga complementar;
- snapshots periódicos comparados;
- operação paralela temporária com reconciliação.

A escolha depende da capacidade do sistema anterior e da rotina real.

## Gate de saída B3

- todas as linhas contabilizadas;
- nenhuma informação descartada ou truncada;
- totais reconciliados;
- conflitos não resolvidos sem alteração operacional;
- pendências preservadas;
- sistema responsivo e escalável após promoção;
- relatório aprovado;
- rollback comprovado.

---

# 9.5 B4 — RECONCILIAÇÃO SEMÂNTICA APÓS AMOSTRA AMPLIADA

Usar os dados ampliados para revisar, sem inferência:

- catálogo de classificações;
- significado e possível divisão de setor;
- aliases;
- formatos de número;
- status e tipos antigos;
- limites de texto;
- campos não representados;
- cobertura de prazos e responsáveis.

A reavaliação não deve desfazer decisões aprovadas do R3. Ela atualiza apenas domínios e modelos ainda abertos.

---

# 9.6 B5 / R5C — PROVENIÊNCIA E EVENTOS TÉCNICOS

## Objetivo

Integrar ao prontuário a informação necessária para explicar de onde veio o dado e como foi transformado, sem poluir a leitura operacional.

## Modelo recomendado

Camadas visuais:

1. atividade operacional humana;
2. eventos administrativos;
3. importação, saneamento e eventos técnicos agrupáveis;
4. proveniência detalhada sob demanda.

## Decisões pendentes

- quais metadados aparecem para cada papel;
- como proteger dados brutos sensíveis;
- agrupamento de eventos por lote;
- visualização de antes/depois da normalização;
- tratamento das 61 demandas com origem não reconstruída;
- exportação administrativa da proveniência.

## Gate de saída B5

- demanda promovida rastreável à fonte quando comprovável;
- origem não reconstruída identificada honestamente;
- eventos técnicos acessíveis sem dominar a timeline;
- nenhum dado bruto exposto a papel indevido;
- documentação e permissões homologadas.

---

# 10. MATRIZ CONSOLIDADA DE DECISÕES E INFORMAÇÕES PENDENTES

| ID | Trilho | Classe | Tema | Recomendação resumida | Bloqueia |
|---|---|---|---|---|---|
| P0-D01 | comum | decisão pendente | histórico Git com dados reais | não reescrever antes de inventário e plano de recuperação | remediação destrutiva do histórico |
| P0-F01 | comum/B | informação externa | natureza das extrações | obter da fonte; não tratar como escolha livre | B1-D06, B3-D03 |
| A1-D01 | A | decisão pendente | conflito concorrente | rejeitar, preservar formulário e reaplicar conscientemente | edição auditável completa |
| A1-D02 | A | decisão pendente | limites operacionais | limitar novas entradas sem truncar legado | constraints de tamanho |
| A1-D03 | A/B | decisão pendente | classificação extensível | catálogo controlado + preservação original | domínio final |
| A1-D04 | A | decisão pendente | link de origem | definir sistemas, domínios e permissões | link no R5D |
| A1-D05 | A | decisão pendente | RPCs antigas | neutralizar somente as que burlam invariantes | revogação antecipada |
| A2-D01 | A/B | decisão pendente | busca em valores brutos | separar busca operacional e administrativa | escopo de busca legado |
| A2-D02 | A | decisão pendente | Realtime | invalidação proporcional e coalescência | implementação de sincronização |
| A2-D03 | A | decisão pendente | meta de capacidade | 5.000/50.000 inicialmente | homologação de escala |
| A3-D01 | A/B | decisão pendente | significado de setor | preservar e evitar inferência até amostra ampliada | métricas e formulário final de setor |
| A4-D01 | A | decisão pendente | operações de saneamento | separar edição, saneamento, andamento e status | UX e RPCs do R4 |
| A4-D02 | A | decisão pendente | obrigatoriedade da próxima ação | exigir nas operações operacionais, não na correção cadastral pura | formulários R4/R5A |
| A4-D03 | A | decisão pendente | apresentação | coluna consolidada + cartão mobile | layout R4 |
| A4-D04 | A/B | decisão pendente | fila de qualidade | modelo híbrido | painel de saneamento |
| A5-D01 | A | decisão pendente | andamento em estados especiais | impedir em encerrada/excluída | formulário de andamento |
| A5-D02 | A | decisão pendente | conflito em andamento/status | aplicar concorrência do A1 | R5A |
| A5-D03 | A | decisão pendente | reabertura | motivo e nova próxima ação | transição de encerrado |
| A6-D01 | A | decisão pendente | superfície canônica | modelo híbrido | R5B |
| A6-D02 | A | decisão pendente | redundância de históricos | uma fonte canônica | remoção do modal redundante |
| A6-D03 | A | decisão pendente | autoria | UUID + snapshot | modelo de eventos |
| A6-D04 | A/B | decisão pendente | eventos técnicos | agrupar sem ocultar | timeline final |
| B1-D01 | B | decisão pendente | arquitetura de entrada | estágio intermediário | B2 inteiro |
| B1-D02 | B | decisão pendente | identidade mínima | preservar tudo; promover só identidade segura | promoção |
| B1-D03 | B | decisão pendente | domínios desconhecidos | não inventar; representar pendência explicitamente | schema de ingestão/promoção |
| B1-D04 | B | decisão pendente | aliases | catálogo persistente auditável | reconciliação de responsáveis |
| B1-D05 | B | decisão pendente | granularidade do apply | sublotes canônicos aprovados | RPC de apply |
| B1-D06 | B | decisão pendente | processos existentes | comparar; nunca último vence | carga integral/mista |
| B1-D07 | B | decisão pendente | visibilidade de pendências | área interna + relatório | UX administrativa |
| B1-D08 | B | informação externa/decisão | histórico legado | importar somente fatos comprováveis | modelo de eventos importados |
| B1-D09 | B | decisão pendente | reversão | compensação e isolamento, não deleção física | rollback pós-carga |
| B3-D01 | B | decisão pendente | pendências operacionais permitidas | admitir lacunas seguras e sinalizadas | promoção de incompletos |
| B3-D02 | B | decisão pendente | eventos de importação | criação enriquecida; reatribuição só posterior | histórico de carga |
| B3-D03 | B | decisão pendente | corte e delta | escolher conforme fonte e operação paralela | carga final |

Decisões R3-D01 a R3-D10 já registradas não são renumeradas nem reabertas. Nenhum novo item desta matriz usa identificador já ocupado no Registro de Decisões.

---

# 11. MAPA PRELIMINAR DE ARQUIVOS E RESPONSABILIDADES

Este mapa orienta o futuro detalhamento técnico. Não autoriza alterações.

## Núcleo comum e documentação

- `AGENTS.md`
- `README.md`
- `docs/PRODUCT_CONTEXT.md`
- `docs/HANDOFF.md`
- `docs/SUPABASE_SETUP.md`
- `docs/product/REGISTRO_DECISOES_PRODUTO_CTRH.md`
- `docs/product/POLITICA_SINCRONIZACAO_DOCUMENTAL_CTRH_v1.0.md`
- `docs/execution/Plano_Integrado_Reformulado_CTRH_v3.1.md`
- `docs/execution/HISTORICO_DOCUMENTAL_CTRH.md`
- `.github/pull_request_template.md`

## Trilho A

- `src/services/contracts.ts`
- `src/services/supabaseDemandasRepository.ts`
- `src/services/dataMappers.ts`
- `src/hooks/useDemandasData.ts`
- `src/App.tsx`
- componentes de tabela, filtros, drawer, modais e prontuário
- `src/search/`
- `src/filters/`
- `src/validation/`
- `src/lib/database.types.ts`
- migrations de concorrência, consulta e RPCs
- testes unitários, integração e Playwright

## Trilho B

- `scripts/migration/legacy-data.mjs`
- `scripts/migration/prepare-legacy-csv.mjs`
- `scripts/migration/dry-run-import.mjs`
- novos módulos focados em fonte, normalização, aliases, comparação e apply
- `docs/MIGRACAO_LEGADO.md`
- migrations de tabelas privadas, funções administrativas e auditoria
- testes sintéticos de arquivos, idempotência, conflito e rollback

## Segurança de dados

- `scripts/bootstrap/initial-demandas.json` — substituir por fixture sintética conforme decisão e plano de preservação;
- scripts de detecção de conteúdo real no bundle e no repositório;
- documentação de armazenamento administrativo fora do Git.

Arquivos grandes devem ser divididos por responsabilidade apenas quando o pacote aprovado justificar a alteração. Não realizar refatoração oportunista.

---

# 12. TESTES TRANSVERSAIS

## 12.1 Integridade da fonte

- cada arquivo possui hash;
- cada linha é contabilizada;
- fonte bruta não é substituída;
- erro não remove linha;
- truncamento é proibido;
- reprocessamento mantém identidade;
- versão do normalizador registrada.

## 12.2 Integridade operacional

- UUID e nome coerentes;
- sem responsável diferente de legado pendente;
- ausência de prazo não gera atraso;
- andamento não muda status;
- encerramento limpa próxima ação conforme regra;
- conflito não sobrescreve;
- exclusão é lógica;
- carteira pessoal usa UUID;
- leitor não executa mutação.

## 12.3 Importação

- dry-run e apply usam o mesmo contrato;
- lote já aplicado retorna idempotentemente;
- cópia idêntica não altera demanda;
- conflito não escolhe vencedor;
- alias ambíguo não vincula;
- nome desconhecido é preservado;
- trigger não apaga texto sem detecção;
- sublote aplicado mantém contabilidade do restante;
- rollback não apaga dado anterior.

## 12.4 Capacidade

- milhares de demandas sem carga integral;
- dezenas de milhares de eventos sob demanda;
- paginação estável;
- rota profunda direta;
- busca histórica global;
- exportação integral;
- Realtime sem tempestade de reload;
- timeline longa acessível.

## 12.5 Experiência e acessibilidade

- desktop e mobile;
- navegação por teclado;
- foco e retorno após modal/drawer/página;
- leitores de tela;
- contraste;
- estados de carregamento, vazio, erro, conflito e sincronização;
- controles ocultos ou desabilitados conforme papel;
- filtros e carteira preservados.

## 12.6 Gate de engenharia

```text
npm ci
npm audit --audit-level=high
npm audit signatures
npm run lint
npm run test:coverage
npm run build
npm run check:bundle
npm run check:public-bundle
npm run test:e2e
```

Adicionar gates específicos de migration, replay, RLS, importação e capacidade conforme o pacote.

---

# 13. DOCUMENTAÇÃO OBRIGATÓRIA POR PACOTE

Cada PR deve identificar e atualizar:

- decisão aprovada correspondente;
- regra final;
- código e banco;
- testes;
- `PRODUCT_CONTEXT`;
- plano vigente;
- `AGENTS.md`, quando houver regra permanente;
- ADRs;
- documentação de migração ou operação;
- Handoff;
- documentos históricos conflitantes;
- termos antigos encontrados por busca no repositório.

O PR deve declarar separadamente:

- efeito no Trilho A;
- efeito no Trilho B;
- dados existentes afetados;
- cargas futuras afetadas;
- rollback;
- impacto em Production;
- itens explicitamente excluídos.

---

# 14. DEFINIÇÃO GLOBAL DE PRONTO

Um pacote somente está pronto quando:

1. fatos, decisões e recomendações estão separados;
2. a decisão necessária foi expressamente aprovada;
3. o escopo implementado corresponde ao aprovado;
4. o item afetado no outro trilho foi analisado;
5. nenhuma informação original foi apagada ou truncada;
6. testes RED e gates passaram;
7. migrations são reproduzíveis;
8. RLS, Auth, Realtime e papéis foram verificados;
9. Preview corresponde ao SHA do PR;
10. fluxo real foi homologado;
11. rollback está documentado e testado quando aplicável;
12. GitHub, Supabase e Vercel estão identificados;
13. documentação vigente concorda com o comportamento;
14. documentos históricos conflitantes estão marcados;
15. Handoff registra o estado efetivo;
16. o próximo item autorizado está explícito.

Correção técnica, correção de produto, segurança de dados, compatibilidade com o legado e coerência documental são gates independentes.

---

# 15. CONDIÇÕES DE PARADA

Interromper o item afetado quando:

- uma regra puder apagar ou substituir fonte original;
- uma carga exigir truncamento;
- houver correspondência ambígua;
- duas fontes divergirem sobre o mesmo processo;
- for necessário escolher silenciosamente um vencedor;
- trigger ou default alterar valor não previsto;
- constraint bloquear informação que deveria ser preservada;
- métrica passar a contar somente a página;
- histórico crescer sem estratégia de leitura;
- autoria, prazo, setor, classificação ou responsável precisarem ser inventados;
- documento vigente divergir da implementação;
- Preview não corresponder ao SHA;
- RLS permitir operação indevida;
- rollback depender de exclusão destrutiva não autorizada;
- duas soluções plausíveis tiverem efeitos de produto diferentes.

O restante do pacote ou do outro trilho pode prosseguir somente se for independente, seguro e não antecipar a decisão pendente.

---

# 16. ORDEM DE DELIBERAÇÃO E EXECUÇÃO ATUALIZADA

A ordem abaixo foi atualizada por GOV-012 para concluir primeiro as funções da operação atual, sem subordinação ao formato do legado futuro.

## Sequência vigente

1. concluir A1-Core residual em releases reversíveis;
2. debater o R4 item a item e implementar somente as decisões expressamente autorizadas;
3. priorizar R5 e fechar os fluxos funcionais, antecipando apenas os recortes de R2 que forem dependência técnica direta de lixeira, prontuário, busca ou retorno;
4. executar o R2 remanescente e otimizações de escala quando necessárias à qualidade do produto atual e antes da entrega final;
5. manter o Trilho B independente até a chegada de fontes concretas.

Esta sequência é prioridade de planejamento, não pré-autorização de R4, R5 ou R2. As etapas originais abaixo são preservadas somente como rastreabilidade histórica; não substituem a sequência vigente nem recolocam o legado no caminho crítico.

## Fase comum histórica

1. Aprovar ou corrigir a arquitetura desta v3.1.
2. Executar P0 documental e de segurança, em pacotes separados.
3. Decidir a publicação isolada do PR #53 em Production.
4. Obter as informações factuais da próxima extração.

## Avanço paralelo inicial

5. Debater A1-D01 e demais decisões do R1 operacional.
6. Debater B1-D01, B1-D02 e B1-D03 do contrato de recepção.
7. Implementar A1 por pacotes aprovados que não dependam do legado ampliado.
8. Implementar B2 somente após aprovação do B1 correspondente, sem promoção massiva.

## Preparação de escala

9. Debater e executar A2.
10. Homologar capacidade com base sintética e Supabase.
11. Concluir catálogo, comparação e dry-run do Trilho B.

## Encontro dos trilhos

12. Executar B3 — promoção controlada — somente após A2 e gates aplicáveis de A1.
13. Reavaliar setor, classificações, limites e domínios com amostra ampliada.

## Evolução operacional pós-escala

14. Debater e executar A4/R4.
15. Debater e executar A5/R5A.
16. Debater e executar A6/R5B.
17. Integrar B5/R5C após o modelo de proveniência estar homologado.
18. Executar A7/R5D em pacotes separados, sem deixar o link de origem bloquear a lixeira.

Essa sequência é recomendação de planejamento. Cada decisão e implementação continua dependente de autorização expressa.

---

# 17. INDICADORES DE SUCESSO

## Operação atual

- nenhuma sobrescrita concorrente silenciosa;
- nenhuma tela depende de carregar toda a base;
- busca, filtros, rotas e Excel preservados;
- prazos e próxima ação compreensíveis;
- andamento separado de status;
- prontuário canônico e escalável;
- R3 preservado;
- Production e documentação coerentes.

## Legado

- 100% das linhas recebidas contabilizadas;
- nenhuma linha descartada silenciosamente;
- nenhuma informação truncada;
- nenhuma demanda operacional nova com nome livre;
- legado pendente diferente de ausência intencional;
- demanda promovida rastreável à fonte quando comprovável;
- origem não reconstruída explicitamente identificada;
- conflitos apresentados antes da aplicação;
- reprocessamento idempotente;
- pendências visíveis e saneáveis;
- nenhuma regra permissiva do importador retorna à interface cotidiana.

## Coordenação

- nenhum trilho paralisa genericamente o outro;
- nenhuma correção atual inviabiliza o legado;
- nenhuma necessidade do legado posterga correção independente da operação;
- dependências pontuais registradas;
- decisões do responsável não são inferidas;
- documentação possui uma única autoridade vigente.

---

# 18. PRÓXIMA ATIVIDADE APÓS ESTA MINUTA

A aprovação da v3.1 deve ocorrer antes de sua inclusão como plano normativo. Após a aprovação estrutural, a primeira atividade recomendada é decompor o P0 em decisões e correções independentes:

1. reconciliação documental e correção da ref do Supabase;
2. decisão sobre publicação do PR #53;
3. inventário e remediação dos dados reais no Git;
4. relatório das 61 demandas sem proveniência formal;
5. obtenção das informações factuais sobre a próxima extração;
6. abertura paralela dos debates A1-D01 e B1-D01, sem implementação até consolidação e autorização.

Nenhum código, migration, carga, branch, PR ou deployment é autorizado por esta minuta.
