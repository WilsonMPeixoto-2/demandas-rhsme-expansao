---
name: frontend-pr-review
description: Revisar tecnicamente PRs, previews e mudanças em interfaces web, distinguindo regressões reais, problemas de UX e limites das capturas de teste. Use ao avaliar um PR visual, uma sidebar, dashboard ou responsividade sem alterar código.
---

# Revisão de código e preview de frontend

## Escopo e fonte

Revisão **somente leitura** por padrão. Solicitar ou descobrir o PR, repositório, SHA e URL de preview; inspecionar `AGENTS.md`, diff completo, código circundante, chamadas, assets, CSS e testes. Quando o ambiente oferecer **Code Review** ou **GitHub**, preferir essas fontes para o PR real; usar **code-verification** instalado, quando disponível, para evidência de engenharia. A análise visual complementa a revisão técnica, não a substitui.

## Auditoria

1. Comparar o PR contra o merge-base e o estado que realmente entraria na base. Não atribuir ao PR defeitos pré-existentes sem evidência.
2. Analisar cada alteração até o fim do diff, não parar na primeira falha; conferir regressões em layout, responsividade, acessibilidade, navegação, permissões, performance, assets e dependências.
3. Obter os logs dos jobs reprovados e verificar causa, assertiva, viewport, seletor, valores observados, e se o teste é válido.
4. Abrir o **preview real** quando acessível. Se não for acessível, usar capturas da CI **identificadas como modo de teste**, nunca representar screenshots reconstruídas, com Devtools ou com dados fictícios como reprodução fiel.
5. Para cada achado, informar severidade, caminho/linha ou seletor, cenário, consequência, causa confirmada/provável, correção mínima e verificação de aceite.
6. Separar opinião estética de defeito demonstrado; entregar também o **link direto do preview**. Ser conciso, priorizando os problemas que exigem correção.
7. Caso outro agente esteja corrigindo o PR, não alterar arquivos, branch ou deploy e evite bloquear ou duplicar seu trabalho.

Leia, quando útil, `../impeccable-frontend-design/references/auditoria-visual.md`.

## Limites

Não criar commits, PRs, comentários, mudanças de teste, atualizações, instalações ou deploys sem autorização expressa. Não declarar que uma captura de DEV é a versão publicada. Se o preview exigir autenticação, relate essa limitação e não invente resultados.

## Revisão da validade dos testes

Antes de tratar uma reprovação como defeito da alteração, identifique a **necessidade de produto** protegida. Classifique cada expectativa: invariante funcional, composição já homologada, detalhe interno anterior, ambiente/fixture ou evidência diagnóstica. Distinguir **regressão real**, **teste obsoleto**, **falha de ambiente** e **instabilidade**; conferir log, seletor, viewport, CSS efetivo e se a mudança era expressamente aprovada. Propor ajuste do teste quando o contrato mudou, sem mascarar defeitos, diminuir tolerância arbitrariamente, excluir cobertura ou gerar novo snapshot sem aceite.

## Experiência e evidências reais

Avalie prioritariamente os viewports e dispositivos utilizados pelas pessoas do produto. Diferenças entre pixels CSS, escala de monitor e nitidez de imagens não são necessariamente bugs de responsividade. Se uma barra lateral reduzir a largura da tabela, confirme se todas as colunas/ações permanecem **acessíveis**, inclusive por rolagem interna, antes de reprovar porque não cabem simultaneamente.

Quando o usuário pedir auditoria visual, entregue URL do preview, SHA e capturas **reais de antes/depois** em estados/viewport equivalentes, sem Devtools ou conteúdo inventado. Testes automatizados avaliam comportamento e regressões objetivas; a aprovação artística pertence ao usuário.

Consultar também a skill coordenadora [../impeccable-frontend-design/SKILL.md](../impeccable-frontend-design/SKILL.md) e seu `references/protocolo-evidencias-visuais.md` quando disponíveis.

