# Protocolo de auditoria visual com evidências

## Identificação

Registre: URL exata do preview, branch, SHA, viewport, autenticação/dados reais ou modo de demonstração, data da captura e versão dos testes. Se o preview exigir autenticação e o agente não puder acessá-lo, diga isso explicitamente e analise o código ou as capturas da CI **como tais**, não como prova de equivalência pixel a pixel.

## Ordem de diagnóstico

1. Examine o diff e leia os arquivos afetados antes de atribuir uma regressão à mudança.
2. Leia o log completo da falha. Localize assertiva, valor medido, viewport e seletor; compare com a `main` para diferenciar regressão, falha anterior e teste inválido.
3. Inspecione CSS computado, caixa do elemento e `scrollWidth/clientWidth` se houver overflow; não esconda falhas com `overflow-x: hidden` sem investigar a origem.
4. Verifique fonte e resolução do asset, crop, `background-size`, contraste final, legibilidade e escala. Guarde separadamente referências históricas e screenshots atuais.
5. Confirme efeito de ferramentas de desenvolvimento: Devtools, overlays de teste, dados fictícios e banners não devem entrar em comparação artística como se fossem parte da UI de produção.
6. Ao comparar imagens, use o mesmo viewport, escala, estado de navegação e dados sempre que possível. Não edite uma captura para corrigir elementos e ainda chamá-la de captura original.

## Forma de relatório

Comece pelo **link para o preview** quando disponível. Depois informe: (a) o que foi testado, (b) o que realmente falhou com arquivo/causa, (c) proposta pontual e critério verificável, (d) o que não foi verificado. Evite gerar novas imagens se o usuário pediu apenas análise de código. Não promover PR sem autorização.
