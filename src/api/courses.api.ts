import { client } from './client';
import type { Course, Lesson, PaginatedResponse, ApiResponse } from '@t/index';

interface CourseParams { page?: number; limit?: number; category?: string; status?: string; search?: string }

export const getCourses = (params?: CourseParams): Promise<PaginatedResponse<Course>> =>
  client.get<PaginatedResponse<Course>>('/courses', params as Record<string, unknown>);

export const getCourseBySlug = (slug: string): Promise<Course> =>
  client.get<ApiResponse<Course>>(`/courses/${slug}`).then((r) => r.data);

export const getLessons = (courseId: string): Promise<Lesson[]> =>
  client.get<ApiResponse<Lesson[]>>(`/courses/${courseId}/lessons`).then((r) => r.data);

export const getLessonById = (courseId: string, lessonId: string): Promise<Lesson> =>
  client.get<ApiResponse<Lesson>>(`/courses/${courseId}/lessons/${lessonId}`).then((r) => r.data);

export const createCourse = (data: Partial<Course>): Promise<Course> =>
  client.post<ApiResponse<Course>>('/courses', data).then((r) => r.data);

export const updateCourse = (id: string, data: Partial<Course>): Promise<Course> =>
  client.put<ApiResponse<Course>>(`/courses/${id}`, data).then((r) => r.data);

export const deleteCourse = (id: string): Promise<ApiResponse<{ message: string }>> =>
  client.delete<ApiResponse<{ message: string }>>(`/courses/${id}`);
