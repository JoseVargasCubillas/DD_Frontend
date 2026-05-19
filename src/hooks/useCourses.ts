import { useQuery } from '@tanstack/react-query';
import * as coursesApi from '@api/courses.api';

interface UseCourseParams { page?: number; limit?: number; category?: string; search?: string }

export const useCourses = (params?: UseCourseParams) =>
  useQuery({
    queryKey: ['courses', params],
    queryFn: () => coursesApi.getCourses(params),
  });

export const useCourse = (slug: string) =>
  useQuery({
    queryKey: ['course', slug],
    queryFn: () => coursesApi.getCourseBySlug(slug),
    enabled: !!slug,
  });

export const useLessons = (courseId: string) =>
  useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => coursesApi.getLessons(courseId),
    enabled: !!courseId,
  });
