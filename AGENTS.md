# Instruções de execução — Central de Demandas CTRH

Estas regras valem para todo trabalho neste repositório.

O `Plano_Integrado_Reformulado_CTRH_v3.1.md` é a estratégia geral dos Trilhos A e B. O `Plano_Executivo_Operacao_Atual_CTRH_v1.2.md` organiza o trabalho possível do Trilho A. Nenhum deles **autoriza automaticamente** a implementação de pacote, ciclo, item ou decisão `OP-Dxx`.

O Registro de Decisões é a fonte exclusiva das decisões aprovadas. Toda implementação depende de debate prévio, registro e autorização expressa do responsável pelo produto, conforme o `ADENDO_GOVERNANCA_POR_ETAPA_CTRH_v2.0.4.md`.

## Leitura obrigatória

Antes de interpretar ou alterar qualquer ciclo, leia integralmente, nesta ordem:

1. `docs/execution/ADENDO_GOVERNANCA_POR_ETAPA_CTRH_v2.0.4.md`;
2. `docs/product/PROTOCOLO_HOMOLOGACAO_DECISOES_PRODUTO_CTRH_v1.3.md`;
3. `docs/product/REGISTRO_DECISOES_PRODUTO_CTRH.md`;
4. `docs/product/PRINCIPIO_PRESERVACAO_INFORMACIONAL_CTRH_v1.0.md`;
5. `docs/product/POLITICA_SINCRONIZACAO_DOCUMENTAL_CTRH_v1.1.md`;
6. `docs/product/POLITICA_MANUTENCAO_DEPENDENCIAS_CTRH_v1.1.md`;
7. `docs/PRODUCT_CONTEXT.md`;
8. `docs/execution/Plano_Integrado_Reformulado_CTRH_v3.1.md`, como estratégia geral;
9. `docs/execution/Plano_Executivo_Operacao_Atual_CTRH_v1.2.md`, como roteiro do Trilho A;
10. `docs/execution/PLANO_CONSOLIDADO_MANUTENCAO_MODERNIZACAO_CTRH_v1.1.md`, quando a tarefa envolver dependências, runtime, ferramentas, arquitetura ou modernização;
11. os ADRs de `docs/adr/`, a documentação de `docs/architecture/` e a documentação técnica aplicáveis ao pacote;
12. `docs/HANDOFF.md` e a documentação específica dos arquivos afetados;
13. o Plano Remanescente v2.1, versões anteriores dos planos e `docs/execution/Plano_Mestre_Execucao_CTRH_v1.0.md` somente como registros históricos.

O `Plano_Remanescente_Execucao_CTRH_v2.1.md`, o `ADENDO_GOVERNANCA_POR_ETAPA_CTRH_v2.0.3.md`, o Protocolo v1.2, a Política v1.0, o `ADENDO_SUSPENSAO_PLANO_CTRH_v2.0.1.md`, o Plano Remanescente v2.0 e o Plano Mestre v1.0 são históricos e foram superados para execução atual. Não podem restaurar uma regra posteriormente alterada e registrada.

O conteúdo proposto no PR #115 também é histórico de preparação: permaneceu aberto sobre base antiga e foi substituído pelos documentos de manutenção v1.1. Não pode ser usado para descrever o estado atual das Rodadas 1, 2 e 3.

## Autoridade e sequência

- Não reexecute os Ciclos 0 a 4 do Plano Mestre v1.0: eles estão encerrados.
- Não use a antiga numeração dos Ciclos 5 a 13 para decidir a próxima etapa.
- Nenhum pacote ou Ciclo R1 a R12 possui autorização automática de implementação.
- O processo ocorre por pacote: debate, decisão, autorização, implementação, sincronização documental e homologação; somente depois começa a atividade seguinte autorizada.
- Decisões expressas mais recentes registradas prevalecem sobre planos, especificações ou relatórios anteriores.
- A próxima atividade autorizada deve ser confirmada em `docs/HANDOFF.md`.
- Adotar um plano não aprova nenhuma decisão `OP-Dxx` nele descrita.
- Após GOV-013, buscar completude operacional em vez de exaustão documental: confronte código, Supabase, interface e testes antes de propor trabalho e classifique cada item como materializado, essencial ou evolução condicionada.
- A presença de uma possibilidade em plano, checklist ou recomendação não basta para incluí-la no lançamento; a função deve resolver um trabalho central, risco ou limite comprovado.
- Uma nova descoberta interrompe somente o item materialmente afetado; o restante prossegue apenas quando independente, seguro e sem antecipar a decisão pendente.

## Produção visual com qualidade verificável

Em qualquer atividade que envolva UI, layout, cores, tipografia, ícones, ilustração integrada, responsividade ou revisão gráfica, consultar `.agents/skills/impeccable-frontend-design/SKILL.md` **antes de propor ou alterar a interface**. Esta skill coordena Frontend Design (direção artística), UI/UX Pro Max (repertório), Impeccable (crítica e polimento), Vercel Web Interface Guidelines (auditoria técnica) e Apple HIG (referência de acabamento), cada uma na sua função.

As decisões e imagens aprovadas, a marca oficial e os dados reais do produto prevalecem sobre sugestões de skills. Em trabalhos visuais, apresentar renderização real e comparação visual, não apenas descrições ou mockups inventados. O uso de ferramentas é permanente em todo o CTRH; **o escopo de alterações artísticas é aprovado por componente**, e a primeira experiência permanece restrita à barra lateral. Este procedimento não autoriza merge, mudança de produção, instalação adicional ou revisão funcional fora do escopo homologado.

Consulte `docs/design/SISTEMA_PROFISSIONAL_DESIGN_CTRH.md` e o registro `TECH-DESIGN-001`.

## Modernização proativa e limites tecnológicos

A avaliação de atualizações e novas dependências não ocorre apenas em rodadas específicas de manutenção.

Em toda correção, melhoria de layout, alteração funcional, investigação de erro ou proposta de nova capacidade, verifique se a tecnologia atual:

- causa ou agrava o problema;
- permite apenas correção paliativa;
- exige contorno frágil, duplicação excessiva ou complexidade desproporcional;
- limita acessibilidade, responsividade, desempenho, segurança, confiabilidade, testes, observabilidade ou manutenção;
- impede alcançar a qualidade esperada;
- deixou de oferecer suporte adequado enquanto existe alternativa madura e compatível.

Quando uma atualização, instalação ou ampliação tecnológica puder produzir solução materialmente melhor ou mais definitiva, apresente a proposta ao responsável pelo produto antes da implementação. A proposta deve explicar:

1. o problema e o limite concreto da abordagem atual;
2. a tecnologia sugerida e o benefício funcional e técnico;
3. a alternativa sem nova dependência;
4. compatibilidade com a pilha atual;
5. impacto em bundle, runtime, segurança, privacidade e dados;
6. esforço de configuração, testes e manutenção;
7. rollback;
8. escopo excluído;
9. recomendação técnica claramente identificada como recomendação.

Não instale ou atualize silenciosamente. A obrigação é **identificar e apresentar** a alternativa superior, não convertê-la em decisão automática.

Também não mantenha solução inferior apenas por apego à pilha atual quando existir caminho moderno, maduro e proporcional. Se uma correção imediata segura puder prosseguir independentemente da modernização, apresente as duas camadas — correção imediata e solução estrutural — e não bloqueie o item urgente sem necessidade.

Consulte `docs/product/POLITICA_MANUTENCAO_DEPENDENCIAS_CTRH_v1.1.md` e `docs/execution/PLANO_CONSOLIDADO_MANUTENCAO_MODERNIZACAO_CTRH_v1.1.md`.

## Regras vigentes consolidadas após o R3

- `responsavel_id` é a identidade oficial do responsável.
- A atribuição de responsável organiza a referência da demanda e não cria posse exclusiva, restrição de continuidade nem autorização baseada em propriedade.
- Administrador ou editor ativo pode praticar as ações permitidas em qualquer demanda ativa, independentemente de ser o responsável cadastrado; leitor permanece sem mutação.
- Responsável e ator são identidades independentes: toda ação registra quem efetivamente a praticou, e somente uma reatribuição explícita pode alterar `responsavel_id`.
- Novas demandas e futuras reatribuições selecionam usuário cadastrado por UUID ou permanecem sem responsável.
- Responsável externo e nome livre não são opções atuais de cadastro ou reatribuição.
- Informação textual legada sem UUID pode ser preservada, mas não pode ser reescrita livremente nem usada para formar carteira pessoal.
- `Vanessa Migrado` permanece como exceção histórica sem perfil oficial até nova decisão expressa.
- `/demandas` é a carteira completa da equipe.
- `/minhas-demandas` é a carteira pessoal por UUID.
- `escopo=meu` existe somente como compatibilidade legada e deve redirecionar para `/minhas-demandas` preservando os demais filtros.
- Indicadores e filtros atuam dentro da carteira delimitada pela rota atual.

## Preservação informacional obrigatória

- Regras atuais são rígidas para novos cadastros e novas operações.
- Dados oficiais legados ou históricos não podem ser apagados, omitidos, truncados, sobrescritos nem convertidos silenciosamente em vazio por incompatibilidade com regra atual ou futura.
- Toda transformação deve preservar o valor original, a proveniência e a razão da transformação.
- Correspondência automática somente é permitida quando comprovável; aproximações silenciosas são proibidas.
- O que não puder ser correlacionado deve permanecer como pendência, ambiguidade ou conflito, sem perda da informação original.
- A regra vale para responsáveis, setores, tipos, classificações, status, prazos, datas, assuntos, números, comentários, observações, documentos, links, autoria e eventos históricos.
- Auditoria técnica e apresentação operacional são camadas distintas: hashes, migrations, códigos de lote e nomes internos podem ser preservados para auditoria, mas não substituem informação útil ao usuário.
- Qualquer alteração capaz de apagar, reduzir, ocultar, reinterpretar ou sobrescrever informação oficial deve parar o item afetado e ser apresentada ao responsável pelo produto antes da implementação.

Consulte `docs/product/PRINCIPIO_PRESERVACAO_INFORMACIONAL_CTRH_v1.0.md`.

## Fase obrigatória de debate pré-implementação

Antes de qualquer código, migration, banco, Preview ou publicação, decomponha o ciclo em decisões independentes.

Para cada decisão, apresente:

1. como o sistema funciona hoje;
2. o que mudaria concretamente na tela e na rotina;
3. quais usuários seriam afetados;
4. um cenário real de uso;
5. alternativas possíveis, inclusive manter o comportamento atual;
6. recomendação, claramente identificada apenas como recomendação;
7. impactos positivos e negativos;
8. dependências com decisões de outros ciclos;
9. dificuldade e custo de reverter depois;
10. decisão expressa do responsável: aprovar, rejeitar, alterar ou adiar.

Classifique cada item como:

- capacidade materializada;
- lacuna essencial do produto inicial;
- evolução condicionada a evidência;
- necessidade técnica;
- preservação do que já existe;
- decisão anteriormente confirmada;
- nova decisão proposta;
- melhoria opcional;
- questão ainda aberta;
- reconciliação documental.

Reconciliação documental corrige documentos que divergem de decisão já aprovada; não reabre silenciosamente o mérito da regra.

Não basta obter aprovação do título ou do objetivo geral do ciclo. A aprovação deve alcançar os comportamentos concretos que serão implementados.

## Formação da autorização

Depois do debate:

1. consolide decisões aprovadas, alteradas, adiadas, rejeitadas e pendentes;
2. escreva a regra final de cada item aprovado;
3. apresente o escopo exato de implementação;
4. obtenha autorização expressa para implementar a consolidação;
5. registre as decisões em `docs/product/REGISTRO_DECISOES_PRODUTO_CTRH.md`;
6. identifique todos os documentos vigentes afetados;
7. somente então crie a branch funcional.

Silêncio, ausência de objeção, recomendação técnica, texto do plano ou autorização para continuar analisando não equivalem a autorização de implementação.

## Sincronização documental obrigatória

Documentação é parte do contrato do produto.

Toda mudança de lógica, regra de negócio, permissão, obrigatoriedade, dado, cálculo, rota ou comportamento visível deve atualizar no mesmo PR:

- o Registro de Decisões, quando aplicável;
- o `PRODUCT_CONTEXT`;
- o Plano Integrado e o Plano Executivo quando afetados;
- este `AGENTS.md`, quando houver regra permanente para agentes;
- a política de manutenção e o plano técnico complementar, quando houver atualização, dependência, runtime, ferramenta ou nova arquitetura;
- o princípio de preservação informacional, quando a mudança alcançar legado, histórico, transformação ou apresentação de dados;
- ADRs e documentação técnica afetados;
- `docs/HANDOFF.md`;
- documentos históricos que necessitem nota de superação.

Antes do PR, pesquise no repositório os termos relacionados à regra antiga. Ocorrências restantes devem ser atuais ou claramente identificadas como históricas. Execute também `npm run check:docs`.

A entrega não está pronta quando o código e os testes passam, mas a documentação vigente descreve regra diferente. Consulte `docs/product/POLITICA_SINCRONIZACAO_DOCUMENTAL_CTRH_v1.1.md`.

## Limite da autorização

Implemente somente o que foi discutido e registrado.

Não:

- complete lacunas por conta própria;
- escolha silenciosamente uma alternativa de produto;
- amplie o escopo por conveniência;
- antecipe decisões de outro ciclo;
- modifique permissões, obrigatoriedades, padrões, cálculos, telas ou tratamento de dados não debatidos;
- use documento histórico como justificativa para desfazer regra posterior;
- deixe atualização documental para outro ciclo;
- instale pacote ou atualização apenas por conveniência do executor.

Se surgir uma nova decisão durante a implementação, pare o item afetado, explique a questão e aguarde decisão expressa. O restante poderá prosseguir apenas se for independente, seguro e não antecipar a decisão pendente.

## Disciplina de entrega funcional

- Trabalhe sempre em branch própria; nunca desenvolva diretamente na `main`.
- Execute um único pacote publicável por branch e PR, salvo autorização expressa diferente.
- Confirme `main`, SHA remoto, migrations aplicadas e worktree limpo antes de criar a branch.
- Para mudanças de comportamento, escreva ou atualize testes primeiro e registre a falha RED esperada.
- Implemente a menor solução completa do escopo aprovado.
- Não misture ciclos, refatorações oportunistas ou mudanças não autorizadas.
- Publique Preview no mesmo SHA do PR e homologue o fluxo real.
- Ao concluir o pacote, atualize `docs/HANDOFF.md`, o registro de decisões e todos os documentos vigentes afetados.
- Preencha integralmente o checklist documental do template de pull request.

## Validação obrigatória

Na raiz do repositório, execute:

```bash
npm ci
npm run check:docs
npm audit --audit-level=high
npm audit signatures
npm run lint
npm run test:coverage
npm run build
npm run check:bundle
npm run check:public-bundle
npm run test:e2e
```

`npm run check:full` consolida o gate atual. Execute também gates específicos do pacote. Nenhum teste pode ser removido, omitido ou ignorado para obter aprovação.

Quando a tarefa envolver limpeza de código ou dependências, execute também `npm run analyze:unused`, trate o Knip apenas como diagnóstico, revise cada achado manualmente e não use autofix.

## Regras permanentes de produto e dados

- Supabase é a fonte de verdade em produção. O modo local existe apenas para desenvolvimento e testes com dados sintéticos.
- Nunca coloque dados reais, segredos, senhas, chaves administrativas ou conteúdo operacional em código cliente, fixtures públicas, logs, screenshots, PRs ou artefatos de teste.
- Preserve busca, Excel, acessibilidade, responsividade, perfis, RLS, Realtime, rotas e contexto de navegação, salvo mudança expressamente aprovada.
- Não trate `Tramitado` como `Encerrado`; ausência de prazo não é atraso.
- Não invente prazo, responsável, justificativa, autoria ou evento histórico.
- Não reintroduza responsável externo ou texto livre sem nova decisão expressa.
- Não reintroduza `UPDATE` ou `DELETE` direto nas tabelas operacionais.
- Não recrie estruturas já implantadas sem necessidade aprovada.
- Não apague dados, histórico, backups ou deployments sem inventário e autorização destrutiva específica.
- A base atual representa menos de 10% do acervo legado esperado; nenhuma regra para novas operações pode apagar, truncar, omitir ou transformar silenciosamente dados legados futuros.
- Em toda mudança relevante, distinguir impacto na operação atual, no legado já importado e em cargas futuras. O Trilho B não bloqueia genericamente o Trilho A, e o Trilho A não pode inviabilizar o legado.
- O pacote de retirada de dados reais dos repositórios e demais medidas de exposição foi adiado para o final das implementações funcionais, antes da entrega do produto, conforme GOV-011.

## Paradas e relato

Pare quando:

- uma lacuna afetar comportamento, regra, permissão, tela, cálculo, dado ou experiência do usuário sem decisão expressa;
- dois documentos vigentes apresentarem regras incompatíveis;
- código, banco e documentação não puderem ser reconciliados com segurança;
- a implementação exigir restaurar comportamento descrito apenas em documento histórico;
- uma transformação puder apagar, omitir, reduzir, ocultar ou sobrescrever informação oficial;
- auditoria técnica estiver sendo usada como substituta de conteúdo operacional compreensível;
- uma instalação proposta tiver impacto material não avaliado em segurança, privacidade, dados, bundle, compatibilidade ou manutenção.

Ao concluir cada pacote, registre: decisões aprovadas, escopo implementado e excluído, branch, commits, PR, Preview e SHA quando aplicável, testes, migrations, impacto nos Trilhos A e B, impacto em dados, acessibilidade, homologação, documentos sincronizados, documentos históricos preservados, rollback, riscos e próxima atividade autorizada.
