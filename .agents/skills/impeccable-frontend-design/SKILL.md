---
name: impeccable-frontend-design
description: Planejar, implementar ou auditar design visual e UX de interfaces web, componentes, iconografia e sistemas de design, com evidência renderizada e verificação técnica. Use em tarefas de layout, UI, CSS, acessibilidade visual e direção de arte; não use para backend sem interface.
---

# Impeccable Frontend Design

Skill coordenadora de design profissional. Não atribui aprovação de produto nem direitos adicionais sobre projetos, deploys ou serviços.

## Critério principal

Entregue melhorias visuais **observáveis, fiéis ao produto real e sustentadas por código verificável**. A referência aprovada, o escopo pedido, a identidade institucional e o `AGENTS.md` local prevalecem sobre preferências estéticas da skill. Nunca substituir uma arte aprovada por uma aproximação gerada sem autorização.

## Se a tarefa for uma auditoria

1. Identifique repositório, branch/commit, PR e URL do preview realmente analisados. Consulte diff, CSS efetivo, componente, testes e logs antes de propor causas.
2. Inspecione o preview real quando acessível; para capturas de teste, declare claramente o ambiente, os dados e o viewport. Não apresente mockups ou screenshots de outro ambiente como reprodução fiel.
3. Separe **falha comprovada**, **causa provável** e **preferência estética**. Aponte o seletor, arquivo, trecho ou teste que suporta cada achado, mais a correção mínima.
4. Informe o link do preview e o status de CI, sem gerar imagens novas desnecessárias. Não altere código enquanto outro agente estiver encarregado da correção, salvo autorização explícita.

Leia [references/auditoria-visual.md](references/auditoria-visual.md) para regras de evidência.

## Se a tarefa for criação ou refinamento

1. Examine as telas, marca, assets originais, componentes, tokens e permissões reais. Defina a área específica que pode mudar; preserve todo o restante.
2. Faça direção artística contextualizada: hierarquia, contraste, tipografia, densidade, espaços, uma expressão visual intencional. Evite templates de IA e ornamentos sem função.
3. Use repertório de qualidade e componentes reais. Quando disponíveis e pertinentes: Frontend Design para criação; UI/UX Pro Max para pesquisa; Impeccable para crítica/polimento; Vercel Web Interface Guidelines para auditoria; Apple HIG para legibilidade e refinamento. Figma/MagicPath podem ajudar na exploração, Storybook no isolamento e Playwright na evidência.
4. Para ícones, compare famílias profissionais em escala de uso e calibre peso óptico antes de selecionar uma única família. Não misture famílias ou invente desenhos complexos sem necessidade.
5. Renderize no navegador e examine desktop, mobile, estados ativos, teclado, foco, erros e movimento reduzido quando relevantes. Teste contraste e overflow; correção visual não pode quebrar rotas nem tabelas.
6. Apresente versão renderizada e comparação legível. Obtenha autorização de homologação antes de alterar a UI de produção; submeta código a lint, testes, build e CI.

Leia [references/direcao-de-arte-iconografia.md](references/direcao-de-arte-iconografia.md) quando o trabalho envolver escolhas artísticas e ícones.

## Disponibilidade e integração

Ferramentas citadas são **opcionais e dependem do ambiente**. Se não existirem, prossiga com código, navegador e testes disponíveis, declarando limitações. Esta skill pode ser instalada pelo instalador de skills do Codex a partir de um caminho GitHub; sua presença em um repositório não implica instalação global no computador, nos conectores do ChatGPT nem em outros repositórios.

Não instale bibliotecas em runtime sem benefício comprovado. Não force frameworks, cores, Apple Glass, opacidades ou escalas fixas. Preserve a distinção entre **captura técnica**, **preview publicado** e **produção**. Não confunda CI verde com homologação artística.
