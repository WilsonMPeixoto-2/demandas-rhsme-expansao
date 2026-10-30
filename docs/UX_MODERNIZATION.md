# Modernização de experiência da Central de Demandas

> **Registro histórico do ciclo de modernização de UX.** A tabela de rotas abaixo descreve o escopo daquele ciclo e **não constitui o mapa vigente completo** do produto: hoje também existe `/minhas-demandas`, conforme `docs/PRODUCT_CONTEXT.md`. Para evolução visual atual, seguir `docs/design/PROTOCOLO_PERMANENTE_EVOLUCAO_VISUAL_CTRH.md` e o estado técnico em `docs/HANDOFF.md`. Não usar esta especificação histórica para reintroduzir layout, regras ou endpoints antigos.


## Escopo entregue

Este ciclo moderniza a experiência de uso sem alterar banco de dados, RLS, autenticação, perfis, contratos dos repositórios ou regras de negócio.

- diálogos, menus e confirmações baseados em primitivas acessíveis do Radix UI;
- notificações não bloqueantes com Sonner;
- formulários de autenticação, solicitação de acesso, demandas, status e gestão de perfis com React Hook Form e Zod;
- validação contextual, bloqueio de envio duplicado e preservação de dados após erro;
- confirmação antes de descartar alterações não salvas;
- tabela operacional com TanStack Table, ordenação, paginação e contador de resultados;
- rotas persistentes para visão geral, demandas, detalhe e administração;
- filtros de demandas representados na URL;
- painel lateral acessível com transições funcionais e suporte a movimento reduzido;
- skeletons de carregamento para acesso, dashboard, tabela, administração e detalhes;
- testes automatizados de acessibilidade com Axe em desktop e mobile;
- orçamento automatizado para impedir crescimento superior a 15% do bundle inicial.

## Rotas

| Rota | Finalidade |
|---|---|
| `/` | Visão geral |
| `/demandas` | Lista, filtros, ordenação e paginação |
| `/demandas/:id` | Detalhe compartilhável de uma demanda |
| `/admin` | Administração de perfis e parâmetros |

Os filtros ativos são serializados na URL. Atualizar a página ou utilizar os botões Voltar e Avançar do navegador preserva o contexto de trabalho.

## Garantias de compatibilidade

- nenhuma migration foi adicionada;
- nenhuma política RLS foi alterada;
- nenhuma assinatura de serviço ou repositório foi modificada;
- o modo Supabase e o modo local continuam utilizando os mesmos contratos;
- `vercel.json` mantém `deploymentEnabled: false` e acrescenta somente rewrites das rotas SPA;
- todas as versões novas estão fixadas no lockfile.

## Verificação obrigatória

```bash
npm ci
npm audit --audit-level=high
npm test
npm run build
npm run check:bundle
npx playwright install --with-deps chromium
npm run test:e2e
```

A promoção para produção somente pode ocorrer quando todas as verificações estiverem aprovadas no commit exato do PR.
