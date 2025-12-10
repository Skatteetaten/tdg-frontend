import { createRoot } from 'react-dom/client';
import { App } from 'web/App';
import './_reset-default.css';
import './index.css';
import '@skatteetaten/ds-core-designtokens/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';

const mountId = 'root';
const container = document.getElementById(mountId);
const queryClient = new QueryClient();

if (!container) {
  throw new Error(`Kan ikke finne element med id=${mountId}`);
}

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
