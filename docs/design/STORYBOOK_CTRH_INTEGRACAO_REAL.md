# Storybook do Fluxo CTRH — integração sobre a main atual

**Escopo:** infraestrutura transversal de visualização de componentes reais (React/Vite/TS). Nenhum elemento operacional redesenhado.

## Comandos

- `npm ci`
- `npm run storybook`: bancada local em http://localhost:6006
- `npm run build-storybook`: validação da bancada em CI
- `npm run test:sidebar-visual`: captura do componente real em modo local
- `npm run test:visual-inventory`: inventário visual das telas existentes

## Histórias do produto

- `Fluxo CTRH/Navegação lateral`: importa **SiteNavigation.tsx real** e expõe os estados de seleção, permissão administrativa e colapso.
- `Fluxo CTRH/Marca vetorial existente`: importa **BrandLogo.tsx real**, com variações full, compact e symbol.

No PR #215, o Storybook importa o mesmo `SiteNavigation.tsx`, com os quatro ícones lineares e os assets estáticos de brasão e Arcos da Lapa do runtime. A bancada usa os estilos do produto, mas não substitui a inspeção do Preview autenticado nem a aprovação do usuário.

## Regras

Não copiar histórias de templates de demonstração; manter apenas componentes reais. Não instalar ícones alternativos em produção para fins comparativos. Nenhum Storybook está referenciado pelo bundle da aplicação de produção. A skill de coordenação está em `.agents/skills/impeccable-frontend-design/SKILL.md`.

**Decisão técnica:** Storybook 10.6.5 somente em devDependencies; depende do lockfile gerado e conferido por GitHub Actions. Não alterar regras de negócio, Supabase, autenticação ou design sem aprovação visual.
