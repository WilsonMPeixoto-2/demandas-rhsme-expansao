import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import '@fontsource-variable/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AppBootstrap } from './AppBootstrap';
import { createAppQueryClient, DemandasQueryClientContext } from './query/queryClient';
import './responsive-modernization.css';
import './index.css';
import './brand.css';
import './minhas-demandas.css';
import './r3-refinements.css';
import './radar-governanca.css';
import './radar-governanca-accessibility.css';
import './r4-prazos-providencias.css';
import './form-field-polish.css';
import './error-boundary.css';
import './demandas-table-responsive.css';
import './visual-evolution.css';
import './design-shell.css';
import './styles/sidebar-tokens.css';

const queryClient = createAppQueryClient();
const QueryDevtools = import.meta.env.DEV
  ? lazy(() => import('./dev/QueryDevtools'))
  : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemandasQueryClientContext.Provider value={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppBootstrap />
        {QueryDevtools ? (
          <Suspense fallback={null}>
            <QueryDevtools />
          </Suspense>
        ) : null}
      </QueryClientProvider>
    </DemandasQueryClientContext.Provider>
  </StrictMode>,
);
