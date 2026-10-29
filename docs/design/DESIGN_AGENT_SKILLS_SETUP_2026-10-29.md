# Integração de Agent Skills de design · Fluxo CTRH

**Data:** 29/10/2026  
**Escopo:** somente ferramentas e instruções de agentes para qualidade visual. Não altera UI, funcionalidades, regras, dados, assets, dependências nem o bloqueio de deploy.

## Skills efetivamente adicionadas a esta branch

| Diretório | Origem | Utilização |
| --- | --- | --- |
| `.agents/skills/frontend-design/` | Anthropic, Apache-2.0 | Direção de arte e identidade específica do produto |
| `.agents/skills/web-design-guidelines/` | Vercel, licença MIT informada pelo projeto | Auditoria de acessibilidade e práticas web |
| `.agents/skills/cthr-sidebar-visual-quality/` | Instruções do projeto | Barra lateral, estudo original dos Arcos, quatro destinos e iconografia |
| `.agents/skills/apple-inspired-web-design/` | Adaptação própria das Apple HIG | Hierarquia, materiais, legibilidade e iconografia para a web (não SwiftUI) |

Estas skills são arquivos versionados no repositório, legíveis por agentes compatíveis com a convenção `.agents/skills`. Não são plugins do ChatGPT nem garantem ativação global de um Codex instalado em outra máquina. A instalação só estará disponível aos leitores dessa branch até eventual merge aprovado.

## Ferramentas já existentes (verificadas em package.json)

- `@playwright/test` 1.64.1 e `@axe-core/playwright` 4.14.0;
- `motion` 14.6.0;
- primitivas `@radix-ui/react-*`;
- React 19.3.1, Vite 8.3.5 e Node 24.x.

## Integrações do ChatGPT verificadas nesta sessão

- Figma, Canva, MagicPath e Product Design: instalados e habilitados no catálogo da conta.
- GitHub: conector funcional com permissão de escrita neste repositório.
- Mobbin: consulta real devolveu exigência de plano pago; não há integração Mobbin operacional para pesquisas.
- MagicPath: listagem de equipes retornou vazia; nenhuma área de trabalho foi configurada.

## Recursos deliberadamente não instalados nesta fase

- **Impeccable:** o instalador `npx impeccable install` configura skills e pode configurar hooks e binários. Exige execução local em ambiente confiável, inspeção das mudanças e do resultado; não foi executado nem declarado instalado.
- **UI/UX Pro Max:** pacote com scripts e banco de referências externo. Não copiar apenas seu `SKILL.md`, pois isso geraria instalação parcial. Instalar pelo método oficial após verificação de dependências e artefatos.
- **Storybook:** útil para isolar o componente, porém depende de integração com a versão atual de Vite/React e de atualizar `package-lock.json`; criar pacote próprio para isso.
- **Phosphor / Tabler / Iconoir:** alternativas a comparar; não adicionar três bibliotecas de ícones sem decisão sobre a família.
- **Style Dictionary e Chromatic:** adiar enquanto não houver casos de uso e histórias validadas; Playwright já existe.

## Processo de validação

Executar `node --test scripts/design/agent-skills.test.mjs`. A workflow `agent-design-skills.yml` executa o mesmo gate de estrutura. A validação estrutural **não** demonstra qualidade artística, fidelidade de interface ou compatibilidade de runtime.

Para o trabalho visual real:
1. Revisar o PR #208 de infraestrutura visual sem ampliar seu escopo;
2. Avaliar os quatro ícones em uma composição isolada, usando o estudo aprovado;
3. Capturar estados reais com Playwright, comparar com referência e preservar permissões;
4. Homologar antes de integrar à barra lateral operacional.

## Fontes e atribuições

- Anthropic Frontend Design: https://github.com/anthropics/skills/tree/main/skills/frontend-design (arquivo copiado sem alterações; licença Apache 2.0 incluída).
- Vercel Web Design Guidelines: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines (arquivo copiado sem alterações; projeto anuncia MIT; licença e fonte documentadas).
- Apple HIG (referência, não instalada como skill nativa): https://developer.apple.com/design/human-interface-guidelines/
- Impeccable (candidato futuro): https://github.com/pbakaus/impeccable
- UI/UX Pro Max (candidato futuro): https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

**Rollback:** reverter este PR remove integralmente as skills e o gate sem tocar no runtime.
