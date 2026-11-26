/// <reference types="vite/client" />

/** Values injected at runtime by `/config.js` (served by server.mjs in production). */
interface RuntimeConfig {
  VITE_API_BASE_URL?: string;
  VITE_DEBUG_MESSAGE?: string;
}

interface Window {
  RUNTIME_CONFIG?: RuntimeConfig;
}
