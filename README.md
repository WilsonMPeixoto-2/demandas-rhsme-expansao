# Central de Demandas — Expansão

Sistema institucional para acompanhamento de demandas de Recursos Humanos da Secretaria Municipal de Educação do Rio de Janeiro.

- Produção: [demandas-rhsme-expansao.vercel.app](https://demandas-rhsme-expansao.vercel.app)
- Repositório: [WilsonMPeixoto-2/demandas-rhsme-expansao](https://github.com/WilsonMPeixoto-2/demandas-rhsme-expansao)

## Situação atual

A aplicação opera em produção no modo multiusuário integrado ao Supabase, com autenticação real, persistência compartilhada, RLS, RPCs transacionais e atualização em tempo real. O modo local existe somente para desenvolvimento e testes, usa dados inequivocamente sintéticos e é rejeitado em produção.

O estado funcional atual inclui:

- responsáveis oficiais vinculados por UUID;
- 378 demandas históricas vinculadas aos perfis oficiais;
- preservação de uma informação histórica sem UUID (`Vanessa Migrado`);
- novas demandas e reatribuições sem nome livre ou responsável externo;
- carteira da equipe em `/demandas`;
- carteira pessoal por UUID em `/minhas-demandas`;
- indicadores contextuais conforme a carteira aberta;
- filtros, paginação visual e rotas profundas preservando o contexto;
- prontuário operacional no drawer com prazos, próxima providência, status e histórico;
- andamento separado da mudança de status;
- reabertura como transição explícita e auditável;
- mutações auditáveis no Supabase.

A evolução está organizada em dois trilhos coordenados: o Trilho A continua a operação atual sem depender da data de chegada do legado, e o Trilho B preservará e incorporará as futuras cargas. A base atual representa menos de 10% do acervo legado esperado. GOV-013 adota completude operacional: capacidades já suficientes são preservadas, somente lacunas essenciais entram no lançamento e extensões dependem de evidência concreta. V1-E-A01 limita a conclusão funcional inicial ao R5 Essencial e à recuperação de senha; os ciclos históricos 6 a 13 não constituem fila. Nenhum outro pacote, ciclo ou decisão `OP-Dxx` está automaticamente autorizado.

## Governança e documentação

Antes de alterar código, banco ou comportamento, leia `AGENTS.md`.

As referências vigentes são:

- [Adendo de Governança v2.0.4](docs/execution/ADENDO_GOVERNANCA_POR_ETAPA_CTRH_v2.0.4.md);
- [Protocolo de Decisões v1.3](docs/product/PROTOCOLO_HOMOLOGACAO_DECISOES_PRODUTO_CTRH_v1.3.md);
- [Registro de Decisões](docs/product/REGISTRO_DECISOES_PRODUTO_CTRH.md);
- [Política de Sincronização Documental v1.1](docs/product/POLITICA_SINCRONIZACAO_DOCUMENTAL_CTRH_v1.1.md);
- [Contexto do Produto](docs/PRODUCT_CONTEXT.md);
- [Plano Integrado Reformulado v3.1](docs/execution/Plano_Integrado_Reformulado_CTRH_v3.1.md), como estratégia geral;
- [Plano Executivo da Operação Atual v1.2](docs/execution/Plano_Executivo_Operacao_Atual_CTRH_v1.2.md), como roteiro do Trilho A;
- [Atualização de Completude Operacional](docs/execution/ATUALIZACAO_COMPLETUDE_OPERACIONAL_2026-08-01.md), como controle de mudança vigente;
- [Handoff Operacional](docs/HANDOFF.md);
- [Protocolo Permanente de Evolução Visual e Testes](docs/design/PROTOCOLO_PERMANENTE_EVOLUCAO_VISUAL_CTRH.md), obrigatório para alterações de interface;
- [Sistema Profissional de Design](docs/design/SISTEMA_PROFISSIONAL_DESIGN_CTRH.md) e [Visual Quality no ChatGPT](docs/design/CHATGPT_VISUAL_QUALITY.md).

Toda alteração de regra de negócio, lógica, permissão, obrigatoriedade, cálculo, dado ou rota deve atualizar no mesmo PR todos os documentos vigentes afetados. Código correto com documentação divergente não constitui entrega concluída.

O Plano Remanescente v2.1, planos e especificações anteriores permanecem apenas como registros históricos no Git e não podem restaurar regras posteriormente alteradas.

## Executar localmente

Requisitos: Node.js 24.x e npm.

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Sem arquivo de ambiente, o servidor de desenvolvimento inicia em modo local com dados sintéticos. Um build de produção nunca aceita `VITE_APP_MODE=local`.

## Validação

```bash
npm test
npm run check:docs
npm run check:full
```

## Configuração do Supabase

Consulte [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md). Chaves secretas nunca devem ser configuradas no frontend nem rastreadas pelo Git.

## Relatório e estado operacional

O estado mais recente dos ambientes e a próxima atividade autorizada estão em [docs/HANDOFF.md](docs/HANDOFF.md). Relatórios antigos permanecem históricos e não substituem o Handoff atual.
