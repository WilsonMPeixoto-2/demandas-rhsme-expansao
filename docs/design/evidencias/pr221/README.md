# Evidências do refinamento pós-PR #215

Capturas reais do Chromium em GitHub Actions, **modo local com dados sintéticos**. Não representam sessão autenticada em produção nem aprovação artística humana.

- Código funcional: `5333e95b431ac6afbd79853a423d2f1c542a6db6`.
- `sidebar-1366.png`: recorte real da sidebar em viewport 1366×768 CSS.
- `carteira-2560.jpg`: viewport 2560×1440 CSS, mesma fixture sintética dos testes.
- A assinatura oficial é aplicada inteira a partir do PNG original de 1490×310 px; não há reconstrução, upscale nem redesenho da marca.
- A captura da carteira exclui os botões de Devtools por configuração no teste; o indicador de modo demonstração foi preservado.
- Os arquivos foram preservados diretamente das capturas de CI, sem montagem de layout nem edição posterior.
- Para comparação operacional com dados reais, abrir a Production do commit `62304923` e o Preview do PR #221 na mesma janela/zoom.
