import { useQuery } from '@tanstack/react-query';
import * as booksApi from '@api/books.api';

export const useBooks = () =>
  useQuery({
    queryKey: ['books'],
    queryFn: booksApi.getBooks,
    retry: false,
  });

export const useBook = (slug?: string) =>
  useQuery({
    queryKey: ['book', slug],
    queryFn: () => booksApi.getBookBySlug(slug as string),
    enabled: Boolean(slug),
    retry: false,
  });
