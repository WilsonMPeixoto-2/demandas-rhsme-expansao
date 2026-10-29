# UI/UX Pro Max: instalação isolada no Fluxo CTRH

**Autorização:** solicitação expressa de instalação de recursos de design em 29/10/2026.  
**Situação:** preparação versionada nesta branch; status final somente após confirmação dos checks do GitHub Actions.

## Objetivo
Instalar a skill UI/UX Pro Max no padrão universal de Agent Skills em `.agents/skills/ui-ux-pro-max/` para uso por agentes compatíveis, sem criar uma dependência de execução da aplicação React.

## Procedimento
- Instalador do projeto original: `ui-ux-pro-max-cli@2.15.0`.
- Executar `uipro init --ai universal --offline` no job isolado GitHub Actions.
- CLI instalada apenas no runner; os **arquivos de skill** são versionados nesta branch.
- `--offline` usa assets bundled na CLI, evitando downloads adicionais durante o init.
- Instalação com `--ignore-scripts` impede scripts npm de ciclo de vida durante a instalação da CLI.
- Nenhuma alteração deliberada em `package.json`, `package-lock.json`, `src/`, assets municipais, banco ou deploy.

## Licença e proveniência
Fonte https://github.com/nextlevelbuilder/ui-ux-pro-max-skill. O arquivo LICENSE do repositório anuncia MIT. Antes de redistribuir os assets, verificar o conteúdo gerado, as licenças incluídas e a eventual divergência de metadados com o pacote npm. A ação gera apenas material de desenvolvimento e não modifica a aplicação publicada.

## Validação
1. Confirmar que o job instalador concluiu com sucesso e criou `.agents/skills/ui-ux-pro-max/SKILL.md`.
2. Revisar arquivos gerados e volume; rejeitar segredos, binários inesperados e mudanças fora da skill.
3. Executar a CI normal do projeto no SHA resultante e revisar Diff.
4. PR em rascunho até autorização de merge.

## Rollback
Reverter este PR remove a skill. Não requer alterações de runtime, dados ou serviços.
