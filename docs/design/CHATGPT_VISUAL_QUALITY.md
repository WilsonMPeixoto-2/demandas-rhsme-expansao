# Visual Quality no ChatGPT — integração prática

## O que este pacote entrega

O pacote `plugins/visual-quality/` foi estruturado conforme o manifesto portátil de Agent Plugins recomendado pela OpenAI. Integra duas skills de trabalho: `impeccable-frontend-design` para criação/refinamento e `frontend-pr-review` para auditoria de PR. Inclui uma skill opcional de onboarding.

**Prioridade de uso: ChatGPT, ChatGPT Work e o aplicativo desktop.** O Codex é compatível, mas não é o ambiente principal deste fluxo.

O plugin usa GitHub, Code Review, Product Design, Figma e navegador quando eles estiverem efetivamente disponíveis e autorizados na sessão. **Não adiciona conectores MCP nem executáveis próprios.** As skills podem ser escolhidas explicitamente via `@` quando o plugin estiver instalado.

## Instalação pela interface desktop

O repositório contém `.agents/plugins/marketplace.json` apontando para `plugins/visual-quality`. Segundo a documentação atual de OpenAI Developers, o ChatGPT desktop consegue ler o marketplace de um repositório local de confiança, mas **é necessário que a cópia local contenha os arquivos** e que o plugin seja instalado no diretório de Plugins. Não presumir que merge no GitHub resulta em instalação no desktop.

Para uso como plugin de conta/workspace no ChatGPT, usar **Plugin Creator** (quando habilitado), importar os arquivos desta pasta como referência e seguir as etapas de publicação/instalação disponíveis à conta. Publicação pública ou em workspace requer permissões próprias e não ocorre automaticamente.

## Instruções sugeridas para Settings > Code Review

```text
Revise o diff real do PR inteiro, usando as instruções AGENTS.md e a base/merge-base corretos. Identifique apenas regressões novas, concretas e acionáveis. Para cada falha, dê prioridade, arquivo/linha, cenário que reproduz, efeito, evidência e correção mínima. Consulte testes e logs. Em mudanças visuais, verifique responsividade, acessibilidade e consistência com assets homologados. Nunca confunda prints de modo DEV ou mockups com a versão real do preview; forneça o link do preview quando disponível. Separe falhas de código de avaliações estéticas subjetivas. Não edite, comente, faça merge ou deploy por conta própria durante a revisão.
```

Isso configura **critérios para revisões que o usuário iniciar ou que estejam habilitadas na ferramenta**. Não ativa automaticamente revisão em todos os PRs; auto-review depende da conexão GitHub/Codex e da configuração própria de revisão automática.

## Teste de aceite

Aplicar `@frontend-pr-review` em um PR de interface real. Esperado: identificação do SHA, URL, diff e status do CI; dois ou mais problemas somente se confirmados; uso de captura real identificada (ou declaração de que não houve acesso); nenhuma mudança sem autorização.

Aplicar `@impeccable-frontend-design` em componente selecionado. Esperado: preservação dos assets e estados existentes, preview comparável e correções vinculadas a evidências.

Referências oficiais:
- https://learn.chatgpt.com/docs/code-review
- https://learn.chatgpt.com/docs/build-skills
- https://developers.openai.com/plugins/build/plugins

## Escopo da instalação no repositório

Nenhuma alteração operacional em React, CSS, auth, banco, infraestrutura ou PR de redesign. As skills podem residir simultaneamente na pasta de agentes do repositório e como cópia empacotada para distribuição. Para evitar divergência, comparar as duas cópias quando atualizar.

## Protocolo permanente: testes evolutivos e evidência visual

Todas as futuras tarefas de design devem executar o protocolo obrigatório em `docs/design/PROTOCOLO_PERMANENTE_EVOLUCAO_VISUAL_CTRH.md`, também representado na referência transversal `plugins/visual-quality/skills/impeccable-frontend-design/references/protocolo-evidencias-visuais.md`.

O agente deve classificar falhas reais versus testes desatualizados, preservar requisitos funcionais, atualizar no mesmo PR apenas expectativas legitimamente superadas e apresentar preview autêntico com imagens reais antes/depois. A aprovação estética é do responsável pelo produto; logs, screenshots de CI em DEV e automações não substituem essa homologação. O comportamento móvel já aprovado é preservado, com foco de validação nos notebooks e monitores usados no trabalho.

O plugin pessoal do ChatGPT deve receber uma nova release com este mesmo protocolo. **Publicar arquivos no repositório não atualiza automaticamente o plugin instalado na conta.**
