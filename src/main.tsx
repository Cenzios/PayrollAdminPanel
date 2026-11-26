import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import { sessionCleared } from './store/authSlice';
import { registerAuthFailureHandler } from './utils/axios';
import App from './App.tsx';
import './index.css';

const LEGACY_TOKEN_KEY = 'token';

/** Older builds kept the access token in localStorage; remove it once on boot. */
function removeLegacyToken(): void {
  try {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  } catch {
    // Storage can be unavailable (private mode / blocked); nothing to clean up then.
  }
}

removeLegacyToken();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Refresh failed (expired/revoked session): drop cached admin data and clear auth state.
// App then renders only the /login routes, which redirects there.
registerAuthFailureHandler((): void => {
  queryClient.clear();
  store.dispatch(sessionCleared());
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
