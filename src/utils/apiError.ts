import { isAxiosError } from 'axios';

/** Error body of the admin API envelope (only the fields the panel reads). */
interface ApiErrorBody {
  message?: string;
}

/** The server's `message` for a failed API call, or `fallback` when there is none. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
}
