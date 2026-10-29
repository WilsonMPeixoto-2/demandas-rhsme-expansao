import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteNavigation, type SiteArea } from '../components/SiteNavigation';

/** A própria navegação do Fluxo CTRH, com os destinos e ícones reais. */
function NavigationWorkBench(props: { activeArea: SiteArea; canAccessAdmin: boolean }) {
  const [area, setArea] = useState<SiteArea>(props.activeArea);
  return (
    <div className="ct-shell app-container" style={{ minHeight: '100dvh', maxWidth: 'none', margin: 0 }}>
      <SiteNavigation activeArea={area} canAccessAdmin={props.canAccessAdmin} onNavigate={setArea} />
      <main className="ct-main" aria-label="Contexto da navegação">
        <div style={{ padding: '24px', maxWidth: '520px' }}>
          <h1 style={{ marginTop: 0, fontFamily: 'Georgia, serif' }}>Ateliê da navegação</h1>
          <p>Este é o componente operacional do Fluxo CTRH. Nenhum ícone, imagem de fundo ou rota foi substituído.</p>
          <p><strong>Destino escolhido:</strong> {area}</p>
          <p>Use os controles para testar permissões. O botão de recolher e o menu móvel funcionam normalmente.</p>
        </div>
      </main>
    </div>
  );
}

const meta = {
  title: 'Fluxo CTRH/Navegação lateral original',
  component: NavigationWorkBench,
  parameters: { layout: 'fullscreen' },
  args: { activeArea: 'visao-geral', canAccessAdmin: true },
  argTypes: {
    activeArea: { control: 'select', options: ['visao-geral', 'demandas', 'minhas-demandas', 'admin'] },
    canAccessAdmin: { control: 'boolean' },
  },
} satisfies Meta<typeof NavigationWorkBench>;

export default meta;
type Story = StoryObj<typeof meta>;
export const QuatroDestinos: Story = {};
export const SemPermissaoAdministrativa: Story = { args: { canAccessAdmin: false } };
export const CarteiraDeDemandas: Story = { args: { activeArea: 'demandas' } };
