import { client } from './client';
import type { User, Tag, Order, ApiResponse, PaginatedResponse } from '@t/index';

interface ListParams { page?: number; limit?: number; search?: string; tagId?: string; role?: string }

export const listUsers = (params?: ListParams): Promise<PaginatedResponse<User>> =>
  client.get<PaginatedResponse<User>>('/users', params as Record<string, unknown>);

export interface ContactDetail extends User {
  tags: Tag[];
  orders: Order[];
}

export const getUser = (id: string): Promise<ContactDetail> =>
  client.get<ApiResponse<ContactDetail>>(`/users/${id}`).then((r) => r.data);

export const updateUser = (id: string, data: Partial<User>): Promise<User> =>
  client.put<ApiResponse<User>>(`/users/${id}`, data).then((r) => r.data);

export const toggleUserActive = (id: string): Promise<User> =>
  client.patch<ApiResponse<User>>(`/users/${id}/toggle`).then((r) => r.data);

export const updateProfile = (data: Partial<User>): Promise<User> =>
  client.put<ApiResponse<User>>('/users/profile', data).then((r) => r.data);

export const getProfile = (): Promise<User> =>
  client.get<ApiResponse<User>>('/users/profile').then((r) => r.data);

export const assignTag = (userId: string, tagId: string): Promise<Tag[]> =>
  client.post<ApiResponse<Tag[]>>(`/users/${userId}/tags`, { tagId }).then((r) => r.data);

export const removeTag = (userId: string, tagId: string): Promise<Tag[]> =>
  client.delete<ApiResponse<Tag[]>>(`/users/${userId}/tags/${tagId}`).then((r) => r.data);

export const updateNotes = (userId: string, notes: string): Promise<User> =>
  client.put<ApiResponse<User>>(`/users/${userId}/notes`, { notes }).then((r) => r.data);

export const sendPasswordReset = (userId: string): Promise<{ tempPassword?: string }> =>
  client.post<ApiResponse<{ tempPassword?: string }>>(`/users/${userId}/send-password`).then((r) => r.data);

interface AdminCreateUserInput { name: string; email: string; role?: 'user' | 'admin' }
interface AdminCreateUserResult {
  user: Pick<User, 'name' | 'email' | 'role'> & { _id: string };
  tempPassword?: string;
}

export const adminCreateUser = (input: AdminCreateUserInput): Promise<AdminCreateUserResult> =>
  client.post<ApiResponse<AdminCreateUserResult>>('/auth/admin/users', input).then((r) => r.data);

