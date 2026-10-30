# Contexto do Produto — Central de Demandas CTRH

**Estado documental:** vigente após GOV-013 e a publicação da conclusão funcional inicial autorizada por V1-E-A01.
**Atualizado em:** 1º de agosto de 2026.

Este documento é a referência operacional para a semântica atual do produto. Decisões expressamente aprovadas estão exclusivamente em `docs/product/REGISTRO_DECISOES_PRODUTO_CTRH.md`; a estratégia geral está em `docs/execution/Plano_Integrado_Reformulado_CTRH_v3.1.md`; o roteiro do Trilho A está em `docs/execution/Plano_Executivo_Operacao_Atual_CTRH_v1.2.md`; a governança está no Adendo e no Protocolo vigentes indicados por `AGENTS.md`.

O Plano Remanescente v2.1 e versões anteriores dos planos e especificações são históricos e foram superados para execução atual. Não restauram regras posteriormente alteradas.

## Propósito

A Central de Demandas é a camada operacional do CTRH para organizar processos, expedientes e outras demandas administrativas de Recursos Humanos. Ela deve permitir que uma equipe pequena saiba, ao longo do dia, o que está sob sua responsabilidade, o que exige providência, o que aguarda terceiros, o que pode se tornar um problema, quais dados estão incompletos e que informação gerencial pode ser produzida sem reconstruir planilhas paralelas.

O produto não é um sistema genérico de tickets, CRM, Kanban ou uma simples planilha na web. Também não substitui o sistema oficial em que os processos tramitam nem cria validade administrativa própria. Sua função é sustentar acompanhamento interno, agenda, memória institucional, busca e relatórios.

O uso principal ocorre em desktop, com consultas rápidas e verificação de prazos também utilizáveis em celular. Não existe público externo, autoatendimento cidadão ou demanda de escala para milhares de acessos simultâneos.

## Resultado esperado do produto inicial

O produto inicial é considerado operacionalmente completo quando oferece:

- autenticação por login e capacidades coerentes com o papel;
- carteira da equipe em `/demandas`;
- carteira “Minhas demandas” em `/minhas-demandas`, baseada exclusivamente no UUID do perfil;
- separação entre acompanhamento, providência CTRH, espera externa, sobrestamento e encerramento;
- próxima ação e data de acompanhamento para toda demanda nova ou movimentada que não esteja encerrada;
- alertas e sinais temporais suficientes para ordenar o trabalho;
- prazos classificados como definido, não informado ou não aplicável;
- andamento separado de mudança de status;
- histórico com momento, conteúdo, justificativa, antes/depois e autoria somente quando comprovável;
- reatribuição rastreada e exclusão lógica auditável;
- consulta administrativa somente leitura das demandas excluídas, sem restauração no produto;
- busca em dados atuais e históricos, carteira pessoal e link profundo;
- exportação Excel com o mesmo recorte da interface;
- login, documentação e rollback comprovado.

Painéis adicionais, preferências salvas, página completa separada para a demanda, paginação remota, snapshots históricos e demais possibilidades dos planos são evoluções condicionadas. Só entram no caminho de implementação quando resolverem necessidade operacional, risco ou limite de escala comprovado.

Ficam fora do escopo: ranking competitivo, avaliação de desempenho, workflow de múltiplas aprovações, centro complexo de notificações, mecanismo externo de busca, data warehouse, BI separado, microserviços, infraestrutura de mensagens e e-mail recorrente antes de trinta dias de uso dos alertas internos.

## Ecossistema e fonte de verdade

- O número do processo ou documento é a chave reconhecida na rotina.
- O link de origem, quando cadastrado, abre o sistema oficial.
- O histórico da Central registra acompanhamento interno e não substitui os autos.
- Excel é um produto de saída, não uma base que retorna como fonte operacional.
- Supabase é a fonte de verdade em produção.
- O modo local serve apenas a desenvolvimento e testes com dados sintéticos.
- A interface usa vocabulário administrativo conhecido pela equipe, sem jargão de software imposto.
- O Registro de Decisões é a fonte das regras expressamente aprovadas.
- Código, banco e documentos vigentes devem descrever a mesma regra.

## Dois trilhos e dimensão do legado

A base atual representa menos de 10% do acervo esperado do sistema legado. A data de recebimento dos demais dados não é conhecida e não constitui bloqueio geral para a evolução do produto existente.

- **Trilho A — evolução da operação atual:** corrige e evolui o SITE CTRH que já está em uso.
- **Trilho B — preservação e incorporação do legado:** receberá fontes e lotes futuros com rastreabilidade, sem apagar ou inventar dados.

Uma dependência do legado interrompe somente o item materialmente afetado. Os demais itens do Trilho A podem avançar quando forem independentes e seguros. Reciprocamente, nenhuma regra criada para novas operações pode impedir o recebimento integral de uma linha legada, apagar a demanda, truncar campos ou converter silenciosamente informação incompatível em vazio ou em valor atual aparentemente válido.

Preservar uma linha legada não significa necessariamente publicá-la de imediato na carteira operacional. A arquitetura e as decisões internas do Trilho B continuam pendentes e não foram aprovadas automaticamente pela adoção dos planos.

## Pessoas e necessidades

### Administrador ou gestor

Precisa enxergar a equipe sem abrir centenas de registros: estoque em acompanhamento, providências do CTRH, riscos, itens sem responsável ou próxima ação, espera externa e qualidade dos dados. Também aprova acessos, corrige cadastros, consulta e audita exclusões lógicas e produz relatórios. O objetivo é distribuir atenção e reduzir risco operacional, não vigiar desempenho individual.

### Editor ou analista

Trata demandas no cotidiano. Ao entrar, precisa reconhecer sua carteira e a primeira providência. Durante o trabalho, localiza o processo, registra andamento, altera status, ajusta prazo, reatribui e consulta a trajetória. Se o fluxo exigir muitos cliques ou campos sem valor, a equipe voltará a planilhas, anotações ou memória pessoal.

### Leitor ou consulente

Precisa encontrar um processo e compreender situação, responsabilidade, prazo e histórico sem risco de alteração. Pode usar filtros, gerar relatórios permitidos e compartilhar o link interno da demanda.

### Responsável pelo produto

Precisa confiar que a evolução responde ao trabalho real, preserva decisões anteriores, evita complexidade sem retorno e não transforma lacunas em conclusões falsas. Qualidade de produto, correção técnica e coerência documental são gates independentes.

## Dores concretas

1. Informação dispersa entre planilhas, memória, e-mails e sistemas oficiais.
2. Dificuldade de localizar demanda com apenas número, trecho de assunto, pessoa, setor ou comentário anterior.
3. Falta de resposta imediata para “o que está comigo?” e “o que faço hoje?”.
4. Prazos percebidos apenas quando já são críticos.
5. Status sem indicação da próxima providência.
6. Responsáveis historicamente registrados em texto livre, com grafias e abreviações diferentes.
7. Edições e reatribuições invisíveis no histórico.
8. Relatórios que exigem filtragem, cópia e formatação manual.
9. Indicadores aparentemente precisos baseados em baixa cobertura.
10. Risco de a Central virar mais um lugar para alimentar, sem substituir controles paralelos.
11. Risco de documentação antiga induzir ferramentas ou pessoas a desfazer decisões posteriores.

## Trabalhos que o produto deve realizar

- **Orientar:** indicar onde começar e o que exige atenção.
- **Encontrar:** localizar processo em segundos com a informação disponível.
- **Compreender:** mostrar situação, responsabilidade, prazo, próxima ação e trajetória sem reconstrução mental.
- **Agir:** registrar andamento ou transição com pouco atrito e contexto preservado.
- **Prevenir:** sinalizar risco antes do vencimento.
- **Coordenar:** explicitar responsáveis, esperas, transferências e retornos.
- **Lembrar:** conservar memória institucional além de conversas privadas.
- **Informar:** produzir relatórios confiáveis sem refazer planilhas.
- **Decidir:** apoiar a distribuição de atenção e o saneamento da base.
- **Confiar:** distinguir fato registrado, dado incompleto e inferência analítica.

Uma funcionalidade que não melhora ao menos um desses trabalhos deve ter sua necessidade reavaliada.

## Modelo mental

O produto reúne quatro objetos complementares:

1. **Carteira:** demandas da equipe e de cada usuário.
2. **Agenda:** prazos, próximas ações e datas de revisão.
3. **Prontuário:** estado atual e linha do tempo de cada demanda.
4. **Central de informação:** busca, indicadores e relatórios.

A tabela é uma forma de consulta, não a razão completa do produto.

## Cenários reais de referência

### Começo do dia

Uma editora entra e, em menos de dez segundos, encontra sua carteira, atrasos, próximas ações e itens parados sem montar filtros manualmente.

### Alguém pergunta por um processo

O usuário recebe um número sem pontuação, parte de um assunto ou referência a comentário anterior. Usa `Ctrl/Command+K`, encontra a correspondência explicada, abre o prontuário, compreende a situação e copia o link. Novas funções não podem degradar esse fluxo.

### Houve trabalho, mas o status não mudou

O analista consultou outro setor, complementou informação ou cobrou retorno. Registra **Andamento**, atualiza próxima ação e data sem escolher artificialmente um novo status.

### A demanda saiu do CTRH

O processo foi tramitado para outro setor. Ele continua em acompanhamento, conserva um responsável interno e recebe uma data para verificar o retorno; não é tratado como encerrado.

### Um relatório foi solicitado

O gestor escolhe modelo e recorte e recebe Excel com resumo, base e rastreabilidade. O relatório informa o que os dados permitem concluir e evita formatação manual.

### O legado está incompleto

Uma demanda antiga sem prazo ou vínculo oficial de responsável continua consultável. O sistema não inventa dados nem chama o item de vencido; identifica a lacuna e leva o administrador à fila de saneamento.

### Uma exclusão precisa ser auditada

Um administrador consulta a área `Demandas excluídas`, localiza o registro pelo número ou motivo e verifica os dados preservados, a data, a autoria comprovável e o histórico. O registro permanece somente leitura e não pode ser restaurado pelo produto.

### Um usuário esqueceu a senha

Na tela de acesso, informa o e-mail institucional e recebe uma confirmação neutra. Se a conta existir, o link autorizado abre `/redefinir-senha`; somente a sessão marcada pelo evento `PASSWORD_RECOVERY` permite definir e confirmar uma nova senha forte. Link ausente, inválido ou expirado não abre o formulário e orienta uma nova solicitação.

### Uma regra foi alterada

A decisão é registrada, implementada e sincronizada nos documentos vigentes no mesmo trabalho. Um plano ou relatório histórico permanece preservado, mas não volta a ser usado como regra atual.

## Princípios de produto

- **Ação antes de contemplação:** trabalho e risco aparecem antes de gráficos.
- **Próxima ação antes de status isolado:** status sem providência é insuficiente.
- **Menor atrito compatível com qualidade:** campos e confirmações existem quando evitam erro material ou geram informação útil.
- **Contexto preservado:** abrir, editar, registrar andamento e voltar mantém filtros, busca, rota e carteira.
- **Uma fonte de verdade:** dados operacionais ficam no Supabase; Excel e preferências não viram bases paralelas.
- **Transparência sobre qualidade:** vazio não vira zero, inferência não vira fato e volume não vira desempenho.
- **Segurança proporcional:** autenticação não é contornada e dados reais não são entregues antes do login.
- **Continuidade institucional:** autoria e histórico permitem que outra pessoa compreenda a demanda.
- **Familiaridade:** usar Processo, Responsável, Prazo interno, Prazo final, Próxima ação, Andamento, Tramitado e Encerrado.
- **Coerência documental:** mudança de regra só está concluída quando código, banco e documentos vigentes concordam.
- **Completude antes de exaustão:** preservar o que já atende, completar apenas lacunas dos trabalhos centrais e manter possibilidades adicionais como evolução condicionada.

## Decisões funcionais fixadas

### Status e categorias operacionais

Os seis status existentes permanecem. A categoria é derivada por uma regra única:

| Status | Categoria | Ação CTRH agora | Em acompanhamento | Comportamento |
|---|---|---:|---:|---|
| Aguardando Andamento | Providência CTRH | sim | sim | próxima ação e data obrigatórias |
| Ajustar | Providência CTRH | sim | sim | correção descrita, próxima ação e data |
| Para Assinatura | Providência CTRH | sim | sim | próxima ação; alerta após três dias |
| Tramitado | Aguardando retorno externo | não | sim | não é encerrado; data de acompanhamento |
| Sobrestado | Monitoramento | não | sim | motivo e data de revisão |
| Encerrado | Encerrada | não | não | próxima ação removida; histórico mantido |

Termos oficiais:

- **Em acompanhamento:** todos, exceto Encerrado;
- **Com providência CTRH:** Aguardando Andamento, Ajustar e Para Assinatura;
- **Aguardando retorno:** Tramitado;
- **Sobrestadas:** Sobrestado;
- **Encerradas:** Encerrado.

“Demandas Ativas” deve ser substituído por “Em acompanhamento”. Consulte `docs/adr/ADR-001-semantica-status-carteira.md`.

### Prazos

As colunas físicas permanecem, com estes nomes na experiência:

- `limite1`: **Prazo interno**;
- `limite2`: **Prazo final**.

Cada prazo pode ser `definido` com data, `nao_informado` sem data e com pendência de qualidade, ou `nao_se_aplica` sem data quando essa opção for permitida. Em nova demanda, o prazo interno exige data; o prazo final exige data ou `Não se aplica`, sem justificativa inicial. Ausência de prazo legado nunca é atraso.

### Próxima ação

Toda demanda não encerrada criada ou movimentada após a ativação exige descrição objetiva com cinco caracteres úteis, data de acompanhamento e responsável oficial ou ausência explícita de responsável. Em `Tramitado`, descreve a verificação de retorno; em `Sobrestado`, a condição ou revisão. Encerramento limpa os campos por RPC. O legado incompleto entra na fila de saneamento e precisa ser completado na próxima movimentação pertinente.

Consulte `docs/adr/ADR-002-prazos-proxima-acao.md`.

### Andamento e transições

`Registrar andamento` descreve trabalho realizado, atualiza a próxima providência e sua data e preserva o status. A ação aparece para administrador ou editor ativo somente em demanda não encerrada. Alteração de status sempre escolhe um destino diferente do atual.

Uma demanda encerrada é reaberta pela mesma transição auditável de status, com comentário, próxima providência e data. Data passada também exige justificativa temporal. Não existe estado, tabela ou evento separado de reabertura.

### Recuperação de senha

O login oferece `Esqueci minha senha` sem consultar previamente se existe conta. Para e-mail institucional válido, a aplicação solicita ao Supabase um link com retorno para `/redefinir-senha` e mostra sempre a mesma confirmação neutra. A nova senha exige no mínimo oito caracteres, maiúscula, minúscula e número, além de confirmação idêntica.

Somente o evento `PASSWORD_RECOVERY` habilita a troca. A rota acessada manualmente ou por link inválido/expirado permanece bloqueada. Após a alteração, a sessão temporária é encerrada e o usuário retorna ao login. Senha, token e existência da conta nunca são gravados em log, armazenamento local, tabela ou histórico operacional.

### Responsabilidade

`responsavel_id` é a identidade operacional oficial. O texto `responsavel` é snapshot legível e compatibilidade legada.

- **Responsável oficial:** UUID de usuário cadastrado e nome derivado no servidor.
- **Atribuição sem exclusividade:** o responsável é a pessoa de referência da demanda; a atribuição não impede que outro administrador ou editor ativo dê continuidade ao trabalho.
- **Autorização por papel:** a possibilidade de agir decorre do papel e do estado do perfil, nunca da igualdade entre `auth.uid()` e `responsavel_id`.
- **Autoria independente:** comentário, andamento, edição ou transição registra o usuário que efetivamente praticou a ação e não altera o responsável.
- **Reatribuição explícita:** somente a operação consciente de reatribuição modifica `responsavel_id`, registrando também o ator que a realizou.
- **Não atribuído:** UUID nulo e texto vazio; continua permitido, mas integra a qualidade de dados.
- **Informação legada sem UUID:** pode ser preservada sem virar opção de novo cadastro ou reatribuição.
- **Responsável externo ou nome livre:** não é opção vigente para novas demandas ou futuras reatribuições.
- **“Minhas demandas”:** comparação exclusiva do UUID com o usuário autenticado.
- **Carteira da equipe:** `/demandas`.
- **Carteira pessoal:** `/minhas-demandas`.
- **Compatibilidade:** `escopo=meu` redireciona para `/minhas-demandas`, preservando os demais filtros.
- **Exceção conhecida:** `Vanessa Migrado` permanece como informação histórica sem UUID até nova decisão expressa.

As decisões R3-D01 a R3-D09 prevalecem sobre descrições anteriores de responsável externo ou carteira pessoal por parâmetro.

### Eventos e exclusão

Os tipos históricos reconhecidos são `criacao`, `andamento`, `mudanca_status`, `edicao`, `reatribuicao`, `alteracao_prazo`, `exclusao` e `restauracao`. O tipo `restauracao` permanece reconhecido apenas para leitura de eventual histórico anterior; o produto vigente não oferece restauração.

O prontuário atual mostra data e hora, setor, tipo, status resultante, descrição e alterações antes/depois. Em operação autenticada, o ator é o `auth.uid()` que executou a ação, ainda que outra pessoa seja a responsável pela demanda. A demanda registra esse último ator em `updated_by`, o evento registra em `created_by` e `responsavel_id` permanece inalterado, salvo reatribuição explícita. A apresentação nominal completa da autoria não é requisito do lançamento: lacunas permanecem como `Autor não identificado`, sem snapshot ou backfill inventado.

Exclusão é lógica: preserva demanda e histórico, exige motivo e registra autoria e momento. Somente administrador ativo pode excluir ou consultar registros excluídos. Editor e leitor não veem a ação e não recebem os dados pela API. A área administrativa apresenta a lixeira somente para consulta e auditoria. Não existe exclusão física nem restauração disponível aos usuários. `Recuperável` significa apenas que o proprietário do banco pode realizar recuperação técnica excepcional fora do produto. Consulte `docs/adr/ADR-003-historico-e-exclusao-logica.md`.

### Alertas e priorização

Os limiares iniciais ficam em código e não terão tela administrativa nesta versão:

```ts
export const WORK_RULES = {
  urgentWindowDays: 3,
  attentionWindowDays: 15,
  actionableIdleDays: 7,
  externalWaitingReviewDays: 15,
  signatureIdleDays: 3,
} as const;
```

Prioridade:

1. crítico: prazo final ou próxima ação vencidos;
2. urgente: vence hoje ou em até três dias;
3. atenção: vence entre quatro e quinze dias;
4. assinatura: Para Assinatura sem evento há três dias ou mais;
5. parada: Providência CTRH sem evento há sete dias ou mais;
6. aguardando retorno: Tramitado sem evento há quinze dias ou mais;
7. cadastro incompleto: sem responsável oficial, prazo não informado ou próxima ação.

Uma demanda com vários sinais aparece uma vez, pela severidade mais alta, e preserva sinais adicionais como chips textuais. Ordenação: severidade, data mais antiga, maior tempo parado e número.

### Métricas

- Estoque em acompanhamento: status diferente de Encerrado.
- Providência CTRH: categoria operacional de ação.
- Aguardando retorno: Tramitado.
- Entradas: `created_at` no período.
- Encerramentos: primeiro evento de mudança para Encerrado no período.
- Reaberturas: evento de Encerrado para outro status.
- Estoque inicial e final: itens abertos nos respectivos limites do período.
- Tempo no status: desde o último evento de mudança de status.
- Tempo médio: apenas origem sistema, com criação e encerramento após o novo histórico.
- Cobertura de prazo: definido ou marcado não aplicável.
- Cobertura de responsabilidade: UUID oficial vinculado.
- Lacuna de responsabilidade: UUID nulo, inclusive informação textual legada preservada.
- Cobertura de histórico: evento além da criação.

“Ranking de responsáveis” é proibido; usar **distribuição da carteira por responsável**. Métricas com baixa cobertura exibem a limitação.

## Identidade da rota inicial

A identidade `Radar de Governança` aparece uma única vez no cabeçalho principal, com ícone de bússola e o subtítulo institucional vigente. O botão correspondente na navegação usa o mesmo nome. A página não repete um hero próprio.

A navegação da carteira coletiva usa `Todas as demandas`, em contraste explícito com `Minhas demandas`. No Radar, os cartões de composição são apresentados diretamente após o bloco de atenção, sem os rótulos visuais redundantes `Composição atual` e `Leitura da carteira`; a região permanece nomeada para tecnologias assistivas.

Em telas estreitas, o acesso aos quatro destinos principais ocorre pelo menu retrátil superior: o botão abre o drawer lateral, preservando alvos de toque, navegação por teclado, retorno do foco ao fechar e ausência de overflow da página. No desktop, os destinos permanecem na barra lateral, com opção de recolhimento. Esta decisão visual não altera permissões nem carteiras.

Estados de infraestrutura são traduzidos para linguagem operacional — sistema online, sincronização, conexão indisponível ou modo de demonstração — sem expor fornecedor ou mecanismo de armazenamento ao usuário.

A área operacional utiliza a largura disponível da janela, com margens de leitura e navegação lateral proporcionais. Em monitores amplos, a carteira deve aproveitar esse espaço para tornar dados e nomes mais legíveis, preservando rolagem interna quando necessária em telas menores. A assinatura institucional completa da SME é apresentada em faixa própria, com proporção original e resolução suficiente para alta densidade de pixels; não é recomposta com um brasão pequeno e palavras independentes.

## Experiência por papel

### Administrador

Início padrão com visão da equipe e alternância Equipe/Minha carteira. Mostra estoque, providências, riscos, ausência de responsável ou próxima ação e fila de saneamento. Administração reúne perfis, parâmetros atuais e a consulta auditável das demandas excluídas. Somente administradores recebem a ação `Excluir`; a lixeira é somente leitura e não possui restauração.

### Editor

Início padrão “Meu trabalho” com carteira própria, próximas ações, atrasos, assinaturas e itens parados. Permite visão da equipe sem ações administrativas. Pode atuar conforme as permissões editoriais, mas não vê `Excluir`, não acessa a Administração e não consulta a lixeira.

### Leitor

Início padrão de consulta. Pode pesquisar, abrir detalhes, copiar link, usar filtros e exportar modelos permitidos. Não recebe controles de mutação, não vê `Excluir` e não consulta dados logicamente excluídos.

### Rotas vigentes e rotas-alvo

| Rota | Finalidade | Acesso | Estado |
|---|---|---|---|
| `/` | Radar de Governança e leituras atuais da carteira; futuramente início personalizado | autenticados | vigente |
| `/demandas` | carteira completa da equipe, busca e filtros | autenticados | vigente |
| `/minhas-demandas` | carteira pessoal por UUID, busca e filtros | autenticados | vigente |
| `/demandas/:id` | prontuário operacional preservando a carteira da equipe | autenticados | vigente e suficiente para o produto inicial |
| `/minhas-demandas/:id` | prontuário operacional preservando a carteira pessoal | autenticados | vigente e suficiente para o produto inicial |
| `/relatorios` | Central de Relatórios | autenticados, por papel | futura |
| `/admin` | perfis, parâmetros e auditoria somente leitura das demandas excluídas | administrador | vigente |
| `/admin/qualidade-dados` | saneamento | administrador | futura |
| `/redefinir-senha` | nova senha | sessão de recuperação | vigente e publicada por V1-E-A01 |

A lixeira integra a área `/admin`; não existe rota operacional de restauração.

### Hierarquia de “Meu trabalho”

1. Saudação curta e escopo.
2. Cartões: Comigo em acompanhamento, Com providência, Atrasadas e Próximos sete dias.
3. Fila prioritária completa com até dez itens e “Ver todas”.
4. Próximas ações cronológicas.
5. Visões rápidas: Minhas, Vencidas, Próximas, Para assinatura e Paradas.
6. Últimas movimentações relevantes.

“Minhas demandas” é a carteira pessoal completa. “Meu trabalho” será a agenda priorizada; não são superfícies equivalentes.

Gráficos nunca antecedem a fila de ação.

## Comportamentos protegidos

- Busca por número, tipo, assunto, responsável, setor, classificação, status e histórico.
- Normalização de caixa, acento e pontuação do número.
- Busca multi-termo com todos os termos exigidos, mesmo entre campos.
- Sugestão aproximada explicada e destaque sem injeção de HTML.
- Buscas recentes e atalho funcional `Ctrl/Command+K`; sua indicação visual não integra o layout.
- Filtros e demanda preservados na URL.
- Carteira de origem preservada ao abrir e fechar uma demanda.
- `/demandas` e `/minhas-demandas` permanecem áreas distintas.
- Excel sem macros e com neutralização de formula injection.
- RLS, RPCs, Realtime e três papéis.
- Modais acessíveis, confirmação de descarte e drawer navegável.
- Responsividade desktop e mobile.
- Responsabilidade oficial por UUID sem reintrodução de nome livre.
- Exclusão lógica somente por administrador, com motivo e histórico.
- Lixeira invisível para editor e leitor, inclusive por acesso direto.
- Dados excluídos preservados e auditáveis sem restauração no produto.

## Antipadrões

Uma implementação está errada se:

- aumenta cliques sem melhorar a informação;
- força troca de status apenas para registrar trabalho;
- mostra somente um item por categoria de alerta;
- considera Tramitado concluído ou ausência de prazo atrasada;
- personaliza ou forma carteira por nome textual;
- reintroduz responsável externo ou nome livre sem nova decisão expressa;
- trata `scope=meu` como arquitetura principal em vez da rota `/minhas-demandas`;
- coloca gráficos antes da ação;
- sugere produtividade individual por volume;
- usa recorte diferente entre tela e relatório;
- perde filtros, rota ou carteira ao abrir e fechar demanda;
- aplica saneamento repetitivo sem dry-run;
- expõe exclusão a editor/leitor ou permite restauração pela interface/API;
- cria notificações ou arquitetura mais complexas que o trabalho exige;
- usa documento histórico para desfazer decisão posterior;
- passa tecnicamente, mas incentiva planilha paralela.

## Indicadores de sucesso

- Primeira providência identificada em até dez segundos após entrar.
- Processo conhecido encontrado em até quinze segundos.
- Andamento simples registrado em até trinta segundos sem trocar status.
- Link compartilhado em até dois cliques após abrir a demanda.
- Relatório predefinido gerado em até dois minutos sem formatação manual.
- Cartão e lista filtrada sempre com a mesma quantidade.
- Nenhuma demanda nova ou movimentada não encerrada sem próxima ação e data.
- Nenhum dado real entregue a usuário não autenticado.
- Nenhum editor ou leitor acessa demanda ou histórico excluído.
- Toda exclusão realizada pelo produto possui motivo e registro auditável.
- Redução progressiva de “não informado” e “não atribuído”.
- Abandono de planilhas operacionais paralelas para a rotina coberta.
- Nenhuma regra implantada permanece contradita por documento vigente.

Esses indicadores avaliam o produto, nunca pessoas.

## Sequência funcional vigente

GOV-013 substitui a obrigação de percorrer sequencialmente todo o roteiro por uma avaliação de completude operacional. R4 e R5-1 estão concluídos. V1-E-A01 autorizou e a branch funcional implementou somente a **conclusão funcional inicial**:

1. expor o andamento simples já suportado pelo banco;
2. corrigir as opções de transição e apresentar a reabertura de forma contextual;
3. consolidar o drawer e as rotas profundas atuais como prontuário do produto inicial;
4. preservar a busca histórica, os links profundos e o retorno com filtros já existentes.
5. completar a recuperação segura de senha sem criar estrutura de banco ou revelar a existência da conta.

Os ciclos 6 a 13 do Plano Mestre histórico também não formam uma fila: prazos, carteira pessoal, Excel, Radar e preservação de filtros estão materializados em graus suficientes; alertas avançados, novos relatórios, painéis e preferências ficam condicionados. R5 avançado, R1 residual, R2 e extensões dos pacotes vigentes tampouco abrem sequência automática. Segurança, release proporcional, E2 e a homologação final permanecem gates obrigatórios. O Trilho B continua preservado e será decidido com a fonte real do legado.

Nenhuma conclusão autoriza a próxima evolução por inferência. Nenhum ajuste autoriza inventar, corrigir ou reclassificar dados atuais ou futuros. A classificação completa está em `docs/execution/ATUALIZACAO_COMPLETUDE_OPERACIONAL_2026-08-01.md`.

## Gate de consciência do produto

Antes de cada ciclo, registrar:

1. pessoa que usa a entrega;
2. dificuldade concreta atual;
3. redução esperada de tempo, ambiguidade, risco ou retrabalho;
4. comportamento existente protegido;
5. evidência do ganho além de “testes passaram”.

Depois da implementação, confirmar na tela, papel e cenário afetados:

1. se o fluxo ficou mais curto ou claro;
2. se o usuário entende a próxima ação;
3. se o contexto de navegação foi preservado;
4. se dados e limitações são confiáveis e explícitos;
5. se existe risco de estimular controle paralelo;
6. se os documentos vigentes descrevem exatamente a regra entregue.

Toda mudança deve cumprir a `POLITICA_SINCRONIZACAO_DOCUMENTAL_CTRH_v1.1.md`. Quando o plano não define um detalhe, derive apenas a menor decisão reversível que não altere comportamento substancial. Duas opções plausíveis com efeitos diferentes exigem parada e decisão do responsável pelo produto.
