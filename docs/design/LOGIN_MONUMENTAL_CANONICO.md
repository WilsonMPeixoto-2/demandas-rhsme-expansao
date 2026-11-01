# Login monumental canônico — UX-LOGIN-001

Estado: implementação em branch, **sem merge ou publicação em Production**. Homologação artística do Preview pendente. Autorização: missão expressa do responsável em 01/11/2026 e registro UX-LOGIN-001.

## Proveniência e autoridade

- [Original imutável](../../public/design/wide_cinematic_split_screen_web_login_page_desig.png), 1586 × 992, baixado da [URL canônica](https://media.base44.com/images/public/6ae5abe30f59a8ee7dc28e9c/d2044b733_wide_cinematic_split_screen_web_login_page_desig.png).
- SHA-256: `e42150c4f07618a221441a9bc5fe83ac7e50beac8946c2b27d942d4e522dfb84`. Nenhum processamento aplicado ao original.
- [Manifesto de integridade](login-assets.json): dimensões, hashes, proveniência e distinção dos dois arquivos posteriores já presentes na branch. Eles são preservados e não utilizados no login. MAE RGB após redimensionamento diagnóstico para 1586 × 992: 32,5115 e 32,5235 em escala 0–255; este redimensionamento é apenas análise em memória, não altera os arquivos e não é medida de similaridade perceptual.
- Os arquivos oficiais de marca e `BrandLogo` existentes permanecem intactos. A assinatura no painel esquerdo faz parte da primeira arte expressamente aprovada e é preservada com ela, sem uma segunda marca sobreposta.

## Implementação

`AuthPanel.tsx` e `AuthPanel.css` contêm a alteração de interface. O stylesheet é limitado à raiz `.monumental-login`; inclusive o ajuste dos toasts de erro/sucesso só atua enquanto essa tela existe. `PasswordResetPanel`, sidebar, carteiras e demais telas mantêm seus estilos e contratos. Não há dependência nova, alteração de lockfile, banco, RLS, RPC, usuário, dado ou configuração de deploy.

O painel esquerdo é um **recorte inteiro de pixels** `[0, 0, 1086, 992]`, obtido por Pillow `Image.crop`, salvo em PNG sem perdas. Não há geração, interpolação no asset, limpeza de texto, filtro, blur ou alteração cromática. O original conserva também o painel direito como referência permanente. O navegador recebe para exibição somente o recorte esquerdo: nenhum controle rasterizado está por trás dos controles reais. A legenda acessível fornece a transcrição editorial dos textos incorporados à arte.

O painel direito é HTML/React: título e descrição editoriais, assinatura superior, cartão, abas nativas, labels, inputs, visibilidade da senha, ações e ajuda. Cores, dimensões e posições foram medidas na arte; ornamentos discretos são traçados em SVG, com caráter decorativo. Formulários usam os schemas, callbacks, mensagens e serviços existentes. Foram preservados erros inline, estado ocupado/desabilitado, política de senha e confirmação neutra da recuperação. O foco acompanha a troca de fluxo e volta ao e-mail no retorno ao login. A ajuda usa `details/summary` navegável por teclado e orientações dos fluxos existentes.

### Limites funcionais explícitos

1. **Manter-me conectado:** não há contrato por usuário para essa opção. O cliente Supabase permanece com sua persistência padrão. O checkbox da arte não foi simulado. A decisão pendente deve definir se haverá preferência de sessão, seu padrão e consequência ao fechar o navegador; este pacote não a antecipa. O ritmo do espaço correspondente foi preservado no desktop canônico.
2. **E-mail:** a imagem exemplifica `@edu.rio.rj.gov.br`, mas os contratos existentes aceitam somente `@rioeduca.net`. O placeholder mantém o domínio vigente. O placeholder de senha passa a “Sua senha”, conforme a arte; testes que localizavam o login por bullets foram convertidos para seu label acessível, sem perda de cenários/assertivas.
3. **Suporte:** não foi encontrado destino oficial no código/documentação. A área de ajuda revela instruções locais sobre primeiro acesso e recuperação; não envia mensagem nem abre destino inventado.
4. **Supabase real:** as capturas anônimas não requerem credenciais. Respostas de login/recuperação/cadastro nas provas de estados são interceptadas no navegador e explicitamente sintéticas, sem envio de e-mail ou criação de conta. Os testes existentes de integração protegem os contratos. Não se afirma homologação de entrega real de e-mail nem de login com conta operacional.

## Evidência visual e responsividade

A configuração `playwright.login.config.ts` usa o **build de produção servido localmente**, sem Devtools, em Chromium, DPR 1, zoom padrão, movimento reduzido, fontes e imagens decodificadas. Isso é captura técnica da aplicação real, distinta do Preview publicado e da Production. As capturas de antes usam a versão-base `2b4c4dd`, com o mesmo build e viewports. Nenhuma screenshot foi editada. Overlay e diferença são derivados diagnósticos identificados, sem alterar a referência.

A matriz exercita 1586 × 992; 1280 × 800; 1366 × 768; 1920 × 1080; 2560 × 1440; 3840 × 2160; 390 × 844; 320 × 800; 768 × 1024; 960 × 720; 640 × 400; 1536 × 864; e 390 × 844 com DPR 2. Os dois últimos tamanhos CSS desktop/reflow representam efeitos de escala; não se afirma que foi alterada a configuração física do sistema ou o zoom nativo do navegador.

A arte mantém a razão 1086/992, sem `cover` ou corte em qualquer tamanho. Em 16:9 a divisão dos painéis se adapta pela altura para preservar a composição inteira, em vez de cortar arcos e textos. Notebooks baixos compactam espaços e preservam controles legíveis; primeiro acesso/erros podem rolar verticalmente. Em mobile a arte vem acima do formulário, sem tentar reduzir os controles à escala desktop.

### Capturas para revisão

- Antes: [desktop 1586 × 992](evidence/login-monumental/before/login-1586.png), [mobile 390 × 844](evidence/login-monumental/before/login-390.png).
- Implementação: [canônica 1586 × 992](evidence/login-monumental/local/login-1586x992.png), [1280 × 800](evidence/login-monumental/local/login-1280x800.png), [1366 × 768](evidence/login-monumental/local/login-1366x768.png), [1920 × 1080](evidence/login-monumental/local/login-1920x1080.png), [2560 × 1440](evidence/login-monumental/local/login-2560x1440.png), [4K](evidence/login-monumental/local/login-3840x2160.png), [390 × 844](evidence/login-monumental/local/login-390x844.png), [DPR 2](evidence/login-monumental/local/login-390x844-dpr2.png).
- Comparação: [overlay 50%](evidence/login-monumental/local/overlay.png), [mapa de diferenças amplificado 4×](evidence/login-monumental/local/difference-x4.png), [métricas](evidence/login-monumental/local/comparison.json), [manifesto das capturas](evidence/login-monumental/manifest.json).
- Estados: [primeiro acesso](evidence/login-monumental/local/first-access.png), [recuperação](evidence/login-monumental/local/recovery.png), [validação](evidence/login-monumental/local/validation.png), [foco](evidence/login-monumental/local/focus-keyboard.png), [carregamento sintético](evidence/login-monumental/local/loading-synthetic-response.png), [erro sintético](evidence/login-monumental/local/authentication-error-synthetic.png).

### Comparação e diferenças remanescentes

- Painel esquerdo renderizado em 1586 × 992: **MAE 0, máximo delta 0 e 0% dos pixels alterados**. A comparação dos pixels do recorte contra o original também retorna zero.
- Posições medidas na primeira captura: cartão (1137; 367,83), abas (1160; 390,83), e-mail (1160; 500,83), senha (1160; 596,83), botão (1160; 710,83). Os elementos equivalentes da referência ficam aproximadamente a 1–3 px dessas coordenadas. Medida diagnóstica, não promessa de identidade raster de controles.
- O painel direito tem diferenças reais: reconstrução das fontes (Georgia/Times/serif e Arial/Helvetica), antialiasing, sombras/transparência, traçados dourados, ícone de olho, placeholder e ausência do checkbox. O painel direito apresenta MAE 9,13/255 e aproximadamente 7,5% dos pixels com algum canal divergindo mais que 24 (consultar JSON para valores exatos). O mapa destaca essas diferenças; elas não são todas classificadas como rasterização de fontes.
- A métrica RGB usa erro absoluto médio por canal e limiar diagnóstico `delta > 24`; não é nota estética, nem percentual de “fidelidade”. Relatório numérico final e imagens ficam junto das evidências.
- O original tem 1586 × 992. Em 4K o painel aprovado é ampliado pelo navegador e pode perder nitidez de texto/fotografia. As versões posteriores não são idênticas e não foram usadas para disfarçar esse limite.

## Validação e classificação de falhas

- `npm ci`: Node 24.19.0, instalação reproduzível.
- `npm audit --audit-level=high`: aprovado, **22 alertas moderados preexistentes**, zero alto/crítico; nenhuma dependência/lockfile alterados.
- `npm audit signatures`: 689 assinaturas e 213 attestations verificadas.
- `npm run test:dependency-compat`: 3/3.
- `npm run check:docs`: 9/9 e cadeia coerente.
- Lint e build TypeScript/Vite: aprovados. Bundle inicial: 248.706 bytes, dentro do orçamento; bundle público e ausência de Devtools aprovados.
- `npm run test:coverage`: 84 arquivos / 379 testes; linhas 82,33%, statements 79,59%, branches 73,92%, funções 82,30%. Após a mudança do placeholder, 26 testes focais de autenticação foram reexecutados e aprovados. CI verifica novamente o conjunto no SHA do PR.
- `npm run test:login-visual`: 3 testes, matriz de viewports, integridade/pixels, teclado, validação, senha, loading, erro, primeiro acesso, recuperação e axe WCAG A/AA.
- Suíte E2E geral, CI remota e captura do Preview: em execução; resultados finais serão registrados neste documento e no PR.

Falhas diagnosticadas: (a) o RED confirmou a ausência do título/arte e do gerenciamento de foco; a primeira versão do novo teste precisou de cleanup entre casos, sem reduzir assertivas; (b) nome acessível do título no JSDOM exigiu espaço semântico na quebra de linha; (c) contraste dos toasts existentes, 4,34:1 no erro e 4,25:1 no sucesso, foi detectado pela nova cobertura e corrigido apenas no login; (d) o smoke geral ainda buscava a classe `brand-endorsement-image` do login anterior: atualizado para localizar a imagem aprovada pelo nome acessível e conferir também seu `src`, mantendo contagem e decodificação; (e) uma chamada duplicada de cobertura foi rejeitada pelo lock do Vitest, classificada como falha de orquestração local, e a execução independente concluiu integralmente. Nenhum snapshot foi atualizado, teste removido, regra axe desativada ou limiar de cobertura reduzido.

## Reprodução e entrega

```bash
npm ci
npm run check:full
npm run test:login-visual
```

`test:login-visual` requer `dist` produzido por `npm run build` (incluído no `check:full`). O workflow `login-visual.yml` constrói esse bundle e publica capturas/overlay/mapa/métricas como artefato por 14 dias. Não há baseline visual automaticamente homologado.

Para testar o Preview já autorizado, definir `LOGIN_PREVIEW_URL` com sua URL acessível; a configuração deixa de iniciar servidor local. Isso não muda proteção da Vercel. O acesso protegido pode exigir a sessão do proprietário.

Base examinada: `origin/main` `e76d9d1999d5adbbb085b3de5460b874a41dc5cc`; branch inicial `2b4c4ddf8cd7d6bd2224558d31e03d80fe6cf733`, três commits de assets, worktree limpa. Production confirmada antes da entrega: `dpl_EJo1cMKvCQhg4BnQZ8rm3DYmGMBf`, READY no SHA da main acima. A configuração efetiva já tinha `deploymentEnabled: true`; nenhuma mudança de configuração foi feita. O workflow temporário de importação dos assets tinha falha histórica e foi removido antes desta tarefa; os arquivos existentes foram verificados por hash.

**Rollback:** antes de integração, encerrar ou reverter os commits deste pacote na branch. Após eventual autorização futura de integração, reverter o pacote de frontend/documentação e usar o deployment anterior compatível. Não há reversão de banco, dados ou sessão. Preservar a referência original e as evidências para auditoria.

**Trilhos A/B:** apresentação da entrada no Trilho A; sem impacto em dados já importados, preservação informacional ou futuras cargas do Trilho B. As decisões de segurança final e demais pacotes continuam independentes. A próxima operação após a entrega é a inspeção do Preview pelo responsável e a decisão expressa sobre homologação; não há autorização automática de merge.
