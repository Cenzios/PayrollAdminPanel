/**
 * In-memory access token store. The access token must never be written to
 * localStorage, sessionStorage, Redux or the URL; it lives only in this module
 * and is re-obtained from the HttpOnly refresh cookie via POST /auth/refresh.
 */
interface TokenHolder {
  accessToken: string | null;
}

const holder: TokenHolder = { accessToken: null };

export function getAccessToken(): string | null {
  return holder.accessToken;
}

export function setAccessToken(token: string): void {
  holder.accessToken = token;
}

export function clearAccessToken(): void {
  holder.accessToken = null;
}
