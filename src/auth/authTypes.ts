export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

/** `data` payload of POST /auth/login and POST /auth/refresh. */
export interface AuthSessionData {
  token: string;
  user: AdminUser;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}
