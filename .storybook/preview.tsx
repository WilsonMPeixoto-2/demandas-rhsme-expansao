import type { Preview } from '@storybook/react-vite';
import '@fontsource-variable/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/responsive-modernization.css';
import '../src/index.css';
import '../src/brand.css';
import '../src/visual-evolution.css';
import '../src/design-shell.css';
import '../src/styles/sidebar-tokens.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};
export default preview;
