import { client } from './client';
import type { BlogPost, PaginatedResponse, ApiResponse } from '@types/index';

export const getPosts = (params?: Record<string, unknown>): Promise<PaginatedResponse<BlogPost>> =>
  client.get<PaginatedResponse<BlogPost>>('/blog', params);

export const getPostBySlug = (slug: string): Promise<BlogPost> =>
  client.get<ApiResponse<BlogPost>>(`/blog/${slug}`).then((r) => r.data);

export const createPost = (data: Partial<BlogPost>): Promise<BlogPost> =>
  client.post<ApiResponse<BlogPost>>('/blog', data).then((r) => r.data);

export const updatePost = (id: string, data: Partial<BlogPost>): Promise<BlogPost> =>
  client.put<ApiResponse<BlogPost>>(`/blog/${id}`, data).then((r) => r.data);

export const deletePost = (id: string): Promise<ApiResponse<{ message: string }>> =>
  client.delete<ApiResponse<{ message: string }>>(`/blog/${id}`);
