const DEFAULT_API_BASE_URL = 'https://payrolladminproductionserver.cenzios.com/api';

/** Base URL of the admin API: runtime config first, then build-time env, then the production default. */
export function getApiBaseUrl(): string {
  return (
    window.RUNTIME_CONFIG?.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    DEFAULT_API_BASE_URL
  );
}

export function getDebugMessage(): string | undefined {
  return window.RUNTIME_CONFIG?.VITE_DEBUG_MESSAGE || import.meta.env.VITE_DEBUG_MESSAGE;
}
