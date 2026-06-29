import { useAuthStore } from '@store/authStore';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000/api/v1';

interface FetchOptions extends RequestInit {
  _retry?: boolean;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { _retry, headers: extraHeaders, ...fetchOptions } = options;

  const token = useAuthStore.getState().accessToken;

  const isFormData = fetchOptions.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(extraHeaders as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && !_retry) {
    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!refreshRes.ok) throw new Error('Refresh failed');

      const data: { data: { accessToken: string; refreshToken: string } } = await refreshRes.json();
      useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);

      return request<T>(path, { ...options, _retry: true });
    } catch {
      useAuthStore.getState().logout();
      throw new Error('Sesión expirada');
    }
  }

  if (!res.ok) {
    const errorData: { message?: string } = await res.json().catch(() => ({}));
    throw new Error(errorData.message ?? `Error HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function buildUrl(path: string, params?: Record<string, unknown>): string {
  if (!params) return path;
  const defined = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!defined.length) return path;
  return `${path}?${new URLSearchParams(defined.map(([k, v]) => [k, String(v)]))}`;
}

export const client = {
  get: <T>(path: string, params?: Record<string, unknown>) =>
    request<T>(buildUrl(path, params)),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
