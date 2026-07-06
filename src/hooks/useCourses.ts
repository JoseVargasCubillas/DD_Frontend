import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as coursesApi from '@api/courses.api';

interface UseCourseParams { page?: number; limit?: number; category?: string; status?: string; search?: string; includeAll?: boolean }

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

export const useCourseAdmin = (id: string | undefined) =>
  useQuery({
    queryKey: ['course-admin', id],
    queryFn: () => coursesApi.getCourseAdmin(id!),
    enabled: !!id,
  });

export const useLessons = (courseId: string) =>
  useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => coursesApi.getLessons(courseId),
    enabled: !!courseId,
  });

export const useCourseComments = (courseId: string | undefined, lessonId?: string) =>
  useQuery({
    queryKey: ['course-comments', courseId, lessonId || 'all'],
    queryFn: () => coursesApi.getCourseComments(courseId!, lessonId),
    enabled: !!courseId,
  });

export const useCreateCourseComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, body, lessonId }: { courseId: string; body: string; lessonId?: string }) =>
      coursesApi.createCourseComment(courseId, { body, lessonId }),
    onSuccess: (_comment, variables) => {
      qc.invalidateQueries({ queryKey: ['course-comments', variables.courseId] });
    },
  });
};

export const useDeleteCourseComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, commentId }: { courseId: string; commentId: string }) =>
      coursesApi.deleteCourseComment(courseId, commentId),
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: ['course-comments', variables.courseId] });
    },
  });
};
