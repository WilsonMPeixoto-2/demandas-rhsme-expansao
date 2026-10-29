import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandLogo } from '../components/BrandLogo';

const meta: Meta<typeof BrandLogo> = {
  title: 'Fluxo CTRH/Identidade atual',
  component: BrandLogo,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['full', 'compact', 'symbol'] },
    tone: { control: 'select', options: ['default', 'inverse'] },
  },
};
export default meta;
type Story = StoryObj<typeof BrandLogo>;
export const Completa: Story = { args: { variant: 'full', showEndorsement: true } };
export const Compacta: Story = { args: { variant: 'compact' } };
export const Simbolo: Story = { args: { variant: 'symbol' } };
