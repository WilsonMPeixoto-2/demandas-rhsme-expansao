# Storybook do Fluxo CTRH — integração sobre a main atual

**Escopo:** infraestrutura transversal de visualização de componentes reais (React/Vite/TS). Nenhum elemento operacional redesenhado.

## Comandos

- `npm ci`
- `npm run storybook`: bancada local em http://localhost:6006
- `npm run build-storybook`: validação da bancada em CI
- `npm run test:sidebar-visual`: captura do componente real em modo local
- `npm run test:visual-inventory`: inventário visual das telas existentes

## Histórias do produto

- `Fluxo CTRH/Navegação lateral original`: importa **SiteNavigation.tsx real** e expõe os estados de seleção, permissão administrativa e colapso.
- `Fluxo CTRH/Marca vetorial existente`: importa **BrandLogo.tsx real**, com variações full, compact e symbol.

As imagens da arquitetura carioca são referências da arte a ser integrada posteriormente, **não foram recriadas no Storybook**. O Storybook usa os estilos do produto e pode ser expandido para outras telas, mas não substitui a aprovação do usuário.

## Regras

Não copiar histórias de templates de demonstração; manter apenas componentes reais. Não instalar ícones alternativos em produção para fins comparativos. Nenhum Storybook está referenciado pelo bundle da aplicação de produção. A skill de coordenação está em `.agents/skills/impeccable-frontend-design/SKILL.md`.

**Decisão técnica:** Storybook 10.6.5 somente em devDependencies; depende do lockfile gerado e conferido por GitHub Actions. Não alterar regras de negócio, Supabase, autenticação ou design sem aprovação visual.
