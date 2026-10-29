# Sistema de trabalho visual | Fluxo CTRH

**Revisão:** 29/10/2026  
**Abrangência das ferramentas:** todo o produto (login, Radar, carteiras, prontuário, formulários e administração).  
**Escopo da primeira intervenção visual:** apenas a barra lateral.  
**Governança:** `AGENTS.md`, Registro de Decisões e Adendo v2.0.4 continuam prevalecendo. Nenhuma skill aprova mudanças de produto.

## Skill coordenadora obrigatória

A metodologia reutilizável está em [`impeccable-frontend-design`](../../.agents/skills/impeccable-frontend-design/SKILL.md). É uma **skill de orquestração**: não duplica a lógica interna das quatro skills, mas decide o papel de cada recurso e exige prova visual. Para novas tarefas de aparência, ler primeiro essa skill e só então as fontes especializadas pertinentes. A ativação no CTRH ocorre por `AGENTS.md`.

A skill é portátil para outros repositórios via `.agents/skills/impeccable-frontend-design/SKILL.md`, mas precisa ser explicitamente disponibilizada na configuração do outro projeto ou do agente; o merge do CTRH não a instala automaticamente em todos os projetos e tampouco configura uma memória global do ChatGPT.


## Repertório complementar consolidado

- [Apple Inspired Web Design](../../.agents/skills/apple-inspired-web-design/SKILL.md): critérios de hierarquia, superfícies e interação; referência, não imposição estética.
- [CTRH Sidebar Visual Quality](../../.agents/skills/cthr-sidebar-visual-quality/SKILL.md): critérios do primeiro experimento, subordinados à marca real e às capturas aprovadas.
- Impeccable possui agora roteiros adicionais de critique, animate, distill, polish, harden, onboarding, auditoria responsiva e operação para seleção por necessidade. O runner `engine-probe` já era testado; a presença de guias não significa que todas as operações da CLI foram executadas.
- UI/UX Pro Max inclui consulta de padrões para React, Next.js, Vue, Svelte, Astro e HTML/Tailwind. A ampliação é apenas dados e instruções, sem dependências npm adicionais.
- Os PRs antigos #209, #210 e #211 nasceram antes da publicação #208; arquivos sobrepostos não devem ser mesclados integralmente para não desfazer a skill coordenadora ou reescrever as dependências validadas.

## Regras de precedência

1. A experiência real, a marca Fluxo CTRH e a assinatura SME-RJ constituem o estado preservado.
2. O usuário aprova cada direção artística. O agente não transforma referência em redesign global.
3. O Registro de Decisões do produto determina o que pode ser alterado.
4. Skills oferecem **método, repertório e verificações**, não decisões de produto nem permissão para mudar rotas, nomes, dados ou comportamentos.
5. Imagens conceituais e mockups nunca substituem captura real do componente.
6. Sem “ícones autorais” improvisados: pesquisar coleções profissionais e avaliar em 20, 24 e 28 px, com pesos ópticos e estados de navegação.

## Responsabilidades sem sobreposição

| Recurso | Responsabilidade | Não faz |
| --- | --- | --- |
| [Frontend Design (Anthropic)](../../.agents/skills/frontend-design/SKILL.md) | Direção artística, composição, critério contra templates e escolhas tipográficas | Alterar produto ou brand assets sem autorização |
| [UI/UX Pro Max](../../.agents/skills/ui-ux-pro-max/SKILL.md) | Consultar repertório de padrões, iconografia, UX, paletas e stacks via busca Python | Impor um estilo automático ou substituir as cores reais |
| [Impeccable](../../.agents/skills/impeccable/SKILL.md) | Crítica especializada, revisão de detalhes e acabamento final | Conduzir redesign independente do briefing |
| [Vercel Web Design Guidelines](../../.agents/skills/web-design-guidelines/SKILL.md) | Revisão de qualidade de interface: acessibilidade, comportamento, HTML e UX | Determinar originalidade artística |
| [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) | Referência de precisão, legibilidade, consistência, familiaridade e feedback | Impor aparência de app Apple a um sistema institucional web |
| Playwright + axe (já instalados) | Capturar telas verdadeiras e verificar estados, responsividade e acessibilidade | Atestar automaticamente beleza artística |
| Figma MCP (conectado no ChatGPT) | Refinamento de variantes e composições em estrutura editável | Substituir a marca do projeto |

### Como executar as ferramentas

Na raiz do repositório:

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "institutional administrative dashboard" --domain ux
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "navigation sidebar icon" --domain icons
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "react accessibility layout" --stack react

npm run test:sidebar-visual
npm run test:visual-inventory
```

A habilidade Impeccable foi versionada com os roteiros essenciais, e o launcher oficial está em `.agents/skills/impeccable/scripts/impeccable`. **O binário não é versionado no repositório.** O workflow de integridade de design executa `engine-probe` em ambiente isolado de CI, após download e conferência do SHA-256 oficial, e confirmou que o motor responde corretamente. O agente local pode precisar obter sua cópia verificada ao primeiro uso. O CI não habilita hooks nem altera a aplicação. Não confundir instruções disponíveis com binário já executado.

As capturas HTML do estudo iconográfico ficam em `/design/sidebar-icon-atlas.html` no ambiente Preview; ícones nessa pasta são **candidatos de repertório**, não a identidade aprovada.

## Teste de aceitação da barra lateral

- Preservar fielmente o **símbolo vetorial de três caminhos** de `BrandLogo.tsx`, nome Fluxo CTRH e identidade da SME-RJ.
- Preservar os destinos reais: Radar de Governança, Todas as demandas, Minhas demandas e Administração (permissão condicional).
- Usar a arte arquitetônica dos Arcos da Lapa **a partir do arquivo original aprovado**, nunca gerar uma nova aproximação de aqueduto.
- Não introduzir textos, marca ou ações inventados para preencher mockups.
- Comparar a tela atual com as variações a partir da **mesma captura e mesmos estados**, com foco em iconografia, relação entre fundo e menu, contraste e proporção.
- Conferir layout expandido, recolhido e menu móvel, além de foco/teclado e preferência por movimento reduzido.
- Conferir cortes a 100% de escala, ampliação dos quatro ícones e observação sem rótulo.
- Aprovação somente após apresentação da comparação visual e decisão expressa. Sem merge nem promoção automática.

## Próximos componentes

A infraestrutura é reutilizável nas seguintes etapas, sem implicar autorização para executá-las: indicadores do Radar, prazos, tabelas, prontuário, formulários e autenticação.

## Origem e licenças

- Anthropic: `anthropics/skills`, `skills/frontend-design` (licença Apache 2.0, arquivo local).
- nextlevelbuilder: `ui-ux-pro-max-skill` (licença MIT, arquivo local).
- Impeccable: `pbakaus/impeccable`, versão do skill 4.8.0 (licença Apache 2.0, arquivo local).
- Vercel: `vercel-labs/agent-skills`, skill `web-design-guidelines`; regras atualizadas em https://vercel.com/design/guidelines.
- Apple: https://developer.apple.com/design/human-interface-guidelines/foundations (referência externa; conteúdo não copiado).

Quando uma versão upstream mudar, revisar o diff, a licença, as dependências e a compatibilidade antes de atualizar, mantendo a integridade das decisões do CTRH.
