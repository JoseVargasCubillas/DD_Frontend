import { client } from './client';
import type { Book, ApiResponse } from '@t/index';

export const getBooks = (): Promise<Book[]> =>
  client.get<ApiResponse<Book[]>>('/books').then((r) => r.data);

export const getBookBySlug = (slug: string): Promise<Book> =>
  client.get<ApiResponse<Book>>(`/books/${slug}`).then((r) => r.data);
