import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandLogo } from '../components/BrandLogo';

const meta = {
  title: 'Fluxo CTRH/Marca vetorial existente',
  component: BrandLogo,
  args: { variant: 'full', tone: 'default', showEndorsement: true },
  argTypes: {
    variant: { control: 'select', options: ['full', 'compact', 'symbol'] },
    tone: { control: 'select', options: ['default', 'inverse'] },
    showEndorsement: { control: 'boolean' },
  },
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Completa: Story = {};
export const Compacta: Story = { args: { variant: 'compact', showEndorsement: false } };
export const SimboloVetorial: Story = { args: { variant: 'symbol', showEndorsement: false } };
export const Inversa: Story = { args: { variant: 'compact', tone: 'inverse', showEndorsement: false } };
