---
name: setup
description: Configurar a utilização do plugin Visual Quality no ChatGPT, conferindo conexão GitHub, revisão de código, acesso a previews e skills de design.
---

# Configurar Visual Quality no ChatGPT

1. Confirmar que o plugin está instalado no ChatGPT e que as skills `impeccable-frontend-design` e `frontend-pr-review` são selecionáveis com `@`. A presença de arquivos no GitHub **não** confirma instalação na conta.
2. Verificar se o plugin GitHub está conectado para o repositório escolhido e se Code Review aparece no aplicativo desktop; não confundir o painel nativo de revisão com um executável a instalar.
3. Para tarefas de auditoria, preferir ChatGPT Work com GitHub e navegador Cloud quando disponíveis. Para codificação, usar o ambiente que realmente pode alterar e testar o repositório, respeitando autorização e isolamento do PR.
4. Verificar se Figma, MagicPath, Product Design e outros plugins de design estão disponíveis e conectados antes de presumir execução. Não instalar duplicatas nem exigir serviços pagos.
5. Testar com um PR real em modo somente leitura: deve entregar URL real do preview, SHA, problemas comprovados com arquivo/linha e resultado de testes; não deve gerar imagens não fiéis nem modificar código.
6. Opcionalmente, em **Settings > Code Review**, ajustar instruções de revisão para exigir evidências, considerar regressões introduzidas pelo diff e separar falhas técnicas de preferências visuais.
7. Registrar qualquer impedimento e ação manual necessária; não alegar instalação global ou uso automático que não tenha sido confirmado pela própria interface.

O plugin não inclui novas credenciais, conexões MCP próprias nem hooks. Utilize apenas ferramentas que o usuário já conectou e autorizou.
