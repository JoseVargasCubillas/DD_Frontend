import { client } from './client';
import type { User, Tag, Order, ApiResponse, PaginatedResponse } from '@t/index';

interface ListParams { page?: number; limit?: number; search?: string; tagId?: string; role?: string; sort?: string; segment?: string }

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

interface AdminCreateUserInput {
  name: string;
  email: string;
  role?: 'user' | 'admin';
  tagIds?: string[];
  courseIds?: string[];
  marketingStatus?: 'never_subscribed' | 'subscribed' | 'unsubscribed';
}
interface AdminCreateUserResult {
  user: Pick<User, 'name' | 'email' | 'role'> & { _id: string };
  tempPassword?: string;
}

export const adminCreateUser = (input: AdminCreateUserInput): Promise<AdminCreateUserResult> =>
  client.post<ApiResponse<AdminCreateUserResult>>('/auth/admin/users', input).then((r) => r.data);

export interface ImportContactInput {
  name: string;
  email: string;
  phone?: string;
  products: string[];
  tags?: string[];
  createdAt?: string;
  signInCount?: number;
  lastLogin?: string;
  sourceId?: string;
}

export interface ImportContactsInput {
  contacts: ImportContactInput[];
  productMappings: Record<string, string[]>;
}

export interface ImportContactsResult {
  summary: {
    total: number;
    created: number;
    updated: number;
    skipped: number;
    products: number;
    unmatchedProducts: string[];
  };
  results: Array<{
    email: string;
    name: string;
    status: 'created' | 'updated' | 'skipped';
    userId?: string;
    tempPassword?: string;
    products: string[];
    courseIds: string[];
    unmatchedProducts: string[];
    reason?: string;
  }>;
}

export const importContacts = (input: ImportContactsInput): Promise<ImportContactsResult> =>
  client.post<ApiResponse<ImportContactsResult>>('/users/import', input).then((r) => r.data);

