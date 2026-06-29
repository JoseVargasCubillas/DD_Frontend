import { client } from './client';
import type { Tag, ApiResponse } from '@t/index';

export const listTags = (): Promise<Tag[]> =>
  client.get<ApiResponse<Tag[]>>('/tags').then((r) => r.data);

export const createTag = (input: { name: string; color?: string; description?: string }): Promise<Tag> =>
  client.post<ApiResponse<Tag>>('/tags', input).then((r) => r.data);

export const updateTag = (id: string, input: Partial<Tag>): Promise<Tag> =>
  client.put<ApiResponse<Tag>>(`/tags/${id}`, input).then((r) => r.data);

export const deleteTag = (id: string): Promise<void> =>
  client.delete<void>(`/tags/${id}`);
