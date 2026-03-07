/**
 * Vite entry point.
 */
import 'antd/dist/reset.css';
import '@/index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';

async function enableMocking(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mock/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

function renderApp(): void {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
}

void enableMocking()
  .catch((error: unknown) => {
    console.error('[MSW] failed to start, continue without mocking.', error);
  })
  .finally(() => {
    renderApp();
  });
