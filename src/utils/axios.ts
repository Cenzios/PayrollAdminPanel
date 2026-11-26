import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getApiBaseUrl } from '../config/runtimeConfig';
import { clearAccessToken, getAccessToken, setAccessToken } from '../auth/tokenStore';
import type { ApiEnvelope, AuthSessionData } from '../auth/authTypes';

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/** Auth endpoints never trigger the refresh-and-retry flow. */
const AUTH_ENDPOINTS: readonly string[] = ['/auth/login', '/auth/refresh', '/auth/logout'];

/**
 * The single shared HTTP client for the admin API. `withCredentials` lets the
 * browser send the HttpOnly `payroll_admin_rt` refresh cookie to /auth/*.
 */
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RefreshState {
  inFlight: Promise<AuthSessionData | null> | null;
  onAuthFailure: (() => void) | null;
}

const refreshState: RefreshState = { inFlight: null, onAuthFailure: null };

/** Registers what to do when the session cannot be refreshed (clear app state). */
export function registerAuthFailureHandler(handler: () => void): void {
  refreshState.onAuthFailure = handler;
}

/**
 * Single-flight POST /auth/refresh. Concurrent callers share one request so the
 * rotated refresh cookie is only consumed once. Resolves to null on failure.
 */
export function refreshSession(): Promise<AuthSessionData | null> {
  if (refreshState.inFlight) {
    return refreshState.inFlight;
  }
  refreshState.inFlight = api
    .post<ApiEnvelope<AuthSessionData>>('/auth/refresh')
    .then((response: AxiosResponse<ApiEnvelope<AuthSessionData>>): AuthSessionData | null => {
      const session = response.data?.data;
      if (!response.data?.success || !session?.token) {
        clearAccessToken();
        return null;
      }
      setAccessToken(session.token);
      return session;
    })
    .catch((): null => {
      clearAccessToken();
      return null;
    })
    .finally((): void => {
      refreshState.inFlight = null;
    });
  return refreshState.inFlight;
}

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function handleAuthFailure(): void {
  clearAccessToken();
  if (refreshState.onAuthFailure) {
    refreshState.onAuthFailure();
    return;
  }
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse> => {
    const original = error.config as RetriableRequestConfig | undefined;
    const isUnauthorized = error.response?.status === 401;

    if (!isUnauthorized || !original || isAuthEndpoint(original.url)) {
      return Promise.reject(error);
    }
    if (original._retry) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    original._retry = true;
    const session = await refreshSession();
    if (!session) {
      handleAuthFailure();
      return Promise.reject(error);
    }
    original.headers.Authorization = `Bearer ${session.token}`;
    return api(original);
  }
);

export default api;
