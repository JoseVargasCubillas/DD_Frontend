import { client } from './client';
import type { AuthResult, ApiResponse } from '@types/index';

export const login = (credentials: { email: string; password: string }): Promise<AuthResult> =>
  client.post<ApiResponse<AuthResult>>('/auth/login', credentials).then((r) => r.data);

export const register = (data: { name: string; email: string; password: string }): Promise<AuthResult> =>
  client.post<ApiResponse<AuthResult>>('/auth/register', data).then((r) => r.data);

export const getMe = () =>
  client.get<ApiResponse<unknown>>('/auth/me').then((r) => r.data);

export const refreshTokens = (refreshToken: string) =>
  client.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken }).then((r) => r.data);
