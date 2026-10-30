# Retomada do PR #215 — checkpoint remoto de 30/10/2026

## Ler primeiro

O usuário pediu expressamente: usar os códigos originais anexados do Gemini, corrigir a barra lateral e publicar. Depois interrompeu a execução por cota próxima do fim e pediu **salvar no remoto tudo para outro agente continuar**. Este commit é um checkpoint de trabalho em andamento, **não uma entrega validada nem publicação em produção**. Continue a implementação a partir desta branch, sem repetir as auditorias documentais anteriores e sem pedir novamente autorização para o escopo já autorizado.

- Repositório: WilsonMPeixoto-2/demandas-rhsme-expansao.
- PR: https://github.com/WilsonMPeixoto-2/demandas-rhsme-expansao/pull/215.
- Branch: `feat/sidebar-impeccable`.
- HEAD anterior: `c96fb16e7690620d257208eee2116e5c84873f3a`.
- Main incorporada no checkpoint: `cbcbebbbedd865a0a2775322d6c0f5b7e5d3162a` (PR #220).
- A manutenção documental paralela do outro agente já está preservada nessa main.
- Produção: https://demandas-rhsme-expansao.vercel.app/.
- Nunca trabalhar diretamente na main; não fazer merge enquanto houver regressão pendente.

## Contexto e decisões que não devem ser perdidos

Foram lidas as conversas históricas “Agora temos o código...” e “Retomada do projeto...”, além dos dois arquivos com o código original agora reenviados: `Texto colado (2)(1).txt` e `Texto colado(6).txt`. O código React e o CSS extraídos estão preservados em `docs/design/referencias/pr215-gemini-original.tsx.txt` e `pr215-gemini-original.css.txt`. São referências, não scripts para execução automática.

A direção é a **Opção 2**: sidebar marinho de 276 px, título Georgia “Fluxo CTRH”, símbolo bicolor bronze/branco com a geometria oficial existente, assinatura Prefeitura Rio / Educação com o brasão PNG original, quatro ícones lineares originais de 1,75 px, faixa ativa com filete bronze e imagem tonal original dos Arcos da Lapa. Não redesenhar ou substituir novamente os assets por aproximações. O componente original Gemini redesenhava o símbolo: a integração preserva os três paths oficiais de BrandLogo e aplica somente as cores/gradientes.

Desktop operacional é prioritário: 1280×800, 1366×768, 1920×1080 e alta densidade. Menu móvel deve continuar retrátil pelo botão do topo. A tabela deve preservar colunas, dados e ações, com rolagem horizontal interna quando necessária; não exigir que todas as colunas caibam simultaneamente em 1366 px. Não enfraquecer testes para obter CI verde.

O usuário autorizou explicitamente correção e publicação nesta conversa. Essa autorização é específica deste pacote; não é dispensa geral de governança nem afirmação de que capturas locais foram homologadas visualmente. Não instalar dependências novas, alterar banco, permissões, rotas, dados, regras ou ampliar o redesenho para outras telas.

## Implementado e salvo neste checkpoint

1. `SiteNavigation.tsx` integrado a partir do Gemini, com ícones lineares reais, textos, arte e brasão em assets estáticos. Classes e nomes acessíveis compatíveis com a aplicação; estado recolhido de 84 px; abertura/fechamento móvel e destinos preservados.
2. `BrandLogo.tsx`: variante de cor bicolor opcional com gradientes de IDs únicos via useId, mantendo os três paths canônicos. Demais usos continuam com as cores anteriores.
3. `sidebar-tokens.css`: CSS Gemini com integração de altura/scroll, recolhimento, foco, drawer móvel, movimento reduzido e correção do overflow de 2 px em 320 px.
4. Importação do CSS da sidebar por último em `main.tsx` e `.storybook/preview.tsx`; removido o @import antecipado de `design-shell.css`, que permitia a cascata antiga sobrescrever a proposta.
5. `DemandasTable.tsx` mede overflow real via ResizeObserver; barra horizontal superior aparece em desktop quando há conteúdo excedente. CSS não usa mais o limite artificial de 1279 px. Colunas e ações não foram retiradas.
6. Storybook passa a exibir o mesmo componente/ícones do runtime.
7. Teste de notebook exige acesso real por rolagem sincronizada quando necessário, mantendo validações das ações e da largura global. Novo teste de mobile cobre largura e teclado (foco inicial, ciclo Tab/Shift+Tab e Escape).
8. Assets originais extraídos do Base64: `public/design/sidebar-brasao-rio.png` e `sidebar-arcos-lapa.webp`.

## Validação realmente executada

- `npm ci`: concluído com sucesso, 681 pacotes instalados / 682 auditados, zero vulnerabilidades; lockfile não foi atualizado.
- `npx playwright install chromium`: sucesso.
- RED antes das correções: dois testes falharam pelas causas esperadas — barra superior indisponível em notebook com overflow e largura global de 322 px para viewport de 320 px.
- GREEN parcial após implementação: notebook de 1366 px **passou**; teste móvel avançou além da largura global e **falhou no foco inicial do botão “Fechar menu lateral”**.
- Tentativa posterior: requestAnimationFrame e preventScroll no foco inicial; o mesmo teste **continua falhando**. Esta tentativa foi preservada, não foi considerada solução.
- Logs completos dos dois estágios em `docs/design/evidencias/pr215-checkpoint-2026-10-30/`.
- Gate integral, lint, coverage, build, build-storybook e suíte E2E completa **ainda não executados sobre este checkpoint**.
- Nenhum merge ou deployment de produção realizado nesta sessão.

Comando focal utilizado:

```powershell
npx playwright test tests/e2e/responsive-table.spec.ts tests/e2e/sidebar-visual.spec.ts --project=chromium-desktop --grep "notebook de 1366|menu móvel"
```

## Ponto exato da interrupção — resolver primeiro

O botão do menu móvel abre o drawer visualmente, porém o foco permanece em `Abrir menu principal`. O teste falha em `tests/e2e/sidebar-visual.spec.ts` no `expect(closer).toBeFocused()`. A inspeção real no navegador confirmou `document.activeElement` no opener, enquanto o drawer já tinha visibility visible e transform matrix(1,0,0,1,0,0). Botão de fechar tinha geometria visível (~36×36), sem disabled. O controle “Recolher menu” no footer está display:none no mobile; o ciclo de foco já filtra botões sem getClientRects, mas o foco inicial ainda não funciona.

O efeito com `[mobileOpen]` está em `SiteNavigation.tsx`; a tentativa atual usa requestAnimationFrame e cancela na limpeza. Investigar por que focus é recusado ou revertido (transição de visibility, ancestral/foco concorrente, comportamento da aplicação). Não relaxar a assertiva, inserir sleeps arbitrários nem afirmar que está resolvido. Usar navegador e logs para confirmar a causa. A busca por outros focus/focusin na aplicação foi iniciada e ainda não foi analisada.

Também revisar:
- `sidebar-icon-atlas.html` e seus ícones antigos ainda são um ateliê independente; o teste do atlas **não prova** os novos ícones do runtime. Verificar o componente/Storybook real e sincronizar evidência/documentos.
- Teste móvel novo fixa viewport 320 em ambos os projetos; protocolo recomenda evitar execução duplicada desnecessária. Ajustar matriz com justificativa, sem suprimir cobertura.
- Conferir visualmente composição mobile 320/390 e desktop, marca, brasão, Arcos, collapsed, foco, acessibilidade Axe e carteira; não declarar aprovação humana pela passagem de testes.
- Sincronização final pendente: PRODUCT_CONTEXT descreve menu estreito em duas colunas, precisa refletir drawer aprovado; atualizar Handoff final, docs/design/SISTEMA_PROFISSIONAL_DESIGN_CTRH.md, sidebar-visual-workflow.md e referência Storybook se afetadas. Histórico datado deve ser preservado.
- Registro TECH-DESIGN-004 neste checkpoint documenta autorização e estado de trabalho; completar resultados somente após validação.

## Continuação após o checkpoint — 30/10/2026

A falha móvel foi reproduzida em Chromium isolado: a transição de `visibility` impedia focar o botão de fechar durante a abertura, mesmo com `getComputedStyle(...).visibility` igual a `visible`. A correção CSS torna a abertura imediatamente focalizável e adia a ocultação até terminar o fechamento animado. O teste isolado passou; **o E2E completo do CTRH e a homologação visual continuam pendentes nesta etapa**. A documentação também foi sincronizada quanto ao drawer móvel, ícones do runtime e Storybook.

## Continuação até a publicação autorizada

1. Fazer checkout da branch remota; ler AGENTS, registro TECH-DESIGN-004 e este checkpoint. Não sobrescrever trabalho concorrente.
2. Resolver o foco móvel e rodar os testes focais; depois `npm run check:full` e `npm run build-storybook`. Não remover nem ignorar testes para passar.
3. Capturar e INSPECIONAR renderizações reais equivalentes antes/depois, sem Devtools, com dados sintéticos identificados; distinguir DEV local de preview autenticado.
4. Concluir sincronização documental e descrição do PR com checklist verdadeiro, testes, preview e SHA exatos.
5. Aguardar CI aplicável verde no mesmo HEAD. Validar preview, integrar o PR #215 e verificar deployment de produção READY no SHA de merge e o site público/novos assets.
6. Encerrar com link do site, PR e evidência verdadeira. Nunca reportar publicação antes de confirmar.

## Ambiente útil (sem dependência obrigatória)

Cópia isolada nesta máquina: `C:/Users/Wilson/.codex/.chatgpt-projects/g-p-6a5a7ef1f0a481919b43e7dc2b742ee6/tmp/ctrh-sidebar-release`. Arquivos em sources/ são referência somente leitura. A cópia foi extraída de main e recebeu os arquivos da implementação; este checkpoint remoto é a fonte durável.

Neste ambiente Powershell/exec_command não resolveu hosts externos, mas o Node REPL do host conseguiu fetch HTTPS e child_process, permitindo baixar fonte oficial, instalar e rodar testes. Usar ferramentas GitHub para leitura/gravação remota quando disponíveis. Não procurar nem imprimir credenciais. Para processos longos no Node REPL, declarar status/processo no nível superior (bindings criados dentro de blocos não persistiram); iniciar assíncrono, consultar saída, salvar logs e manter atualizações ao usuário.

Vercel: projeto `prj_RGkSKGyIA1MOeKof4pbbuwk1J3uD`, time `team_EFJunPOtGozS99jZ6zkIQXHF`. `vercel.json` atual habilita deployment por Git. Supabase ref `kdhekkzwcokfrpcrsllr`, ACTIVE_HEALTHY no início desta sessão; nenhuma intervenção no banco foi feita.

Rollback após eventual release: reverter o commit do pacote via PR e verificar novo deployment, preservando o histórico e dados. Agora o checkpoint está apenas na branch, sem alteração de produção.
