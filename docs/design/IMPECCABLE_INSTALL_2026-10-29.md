# Impeccable: instalação do pacote de design no Fluxo CTRH

**Data:** 29/10/2026  
**Escopo:** instruções de agente Codex versionadas no projeto; não altera interface, runtime ou dados.

## Instalação
- Usar o instalador oficial `npx --yes impeccable@4.8.0 install --providers=codex --scope=project` em runner Node 24 isolado.
- Inspecionar arquivos criados; versionar exclusivamente `.agents/skills/impeccable/`.
- Documentar a licença Apache-2.0 e a fonte https://github.com/pbakaus/impeccable.
- Não executar `impeccable init` sobre o código em produção sem definir a referência visual e sem homologação.
- Desativar telemetria no job via `DO_NOT_TRACK=1`.

## Hooks
O instalador pode sugerir `PostToolUse` / `Stop` hooks e gerar configuração em `.codex`, mas o workflow **não comita nem ativa esses hooks automaticamente**. Eles precisam ser examinados antes de confiança no Codex, via `/hooks` ou Settings → Hooks; este requisito não é uma confirmação de ativação local.

## Critérios de sucesso
- Arquivo `.agents/skills/impeccable/SKILL.md` persistido na branch;
- análise de conteúdo, tamanho e proveniência;
- testes automáticos do projeto;
- revisão da compatibilidade com `AGENTS.md` e preservação da imagem original dos Arcos da Lapa e da marca institucional;
- PR isolado com homologação antes de merge.

## Rollback
Reversão do PR remove a skill e os arquivos versionados; sem rollback de produção nem alteração em banco.

## Resultado da instalação e revisão automática

A instalação oficial Codex (4.8.0) foi executada com sucesso no GitHub Actions e produziu arquivos em `.agents/skills/impeccable/`. A licença original foi incluída. O ESLint agora ignora exclusivamente `.agents/skills/**`, scripts de fornecedores que não integram o runtime React, preservando o rigor sobre `src/`.

Adicionalmente, `.github/workflows/impeccable-design-review.yml` faz verificação consultiva automática de arquivos `src/` alterados em PRs, com relatório JSON. Achados visuais não bloqueiam a aplicação e não dispensam análise de screenshots; erro de execução do scanner é reportado separadamente. A configuração de hooks locais do Codex permanece dependente de revisão e autorização no cliente.
