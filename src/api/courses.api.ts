import { client } from './client';
import type { Course, Lesson, PaginatedResponse, ApiResponse } from '@t/index';

interface CourseParams { page?: number; limit?: number; category?: string; status?: string; search?: string; includeAll?: boolean }
export interface DriveImportPayload {
  folderUrl?: string;
  courses?: Array<{
    title: string;
    description?: string;
    modules: Array<{
      title: string;
      lessons: Array<{
        title: string;
        videoUrl?: string;
        resources?: Array<{ name: string; url: string }>;
      }>;
      resources?: Array<{ name: string; url: string }>;
    }>;
  }>;
  status?: 'draft' | 'published';
  resetExisting?: boolean;
}

export interface DriveImportResult {
  createdCourses: number;
  updatedCourses: number;
  resetCourses?: number;
  createdModules: number;
  createdLessons: number;
  skippedLessons: number;
}

export interface DrivePreviewResult {
  rootFolders: number;
  rootVideos: number;
  courses: Array<{
    title: string;
    modules: number;
    lessons: number;
  }>;
}

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

export const getCourseAdmin = (id: string): Promise<Course & { modules: any[] }> =>
  client.get<ApiResponse<Course & { modules: any[] }>>(`/courses/admin/${id}`).then((r) => r.data);

export const importDriveCourses = (payload: DriveImportPayload): Promise<DriveImportResult> =>
  client.post<ApiResponse<DriveImportResult>>('/courses/import/drive', payload).then((r) => r.data);

export const previewDriveCourses = (folderUrl: string): Promise<DrivePreviewResult> =>
  client.post<ApiResponse<DrivePreviewResult>>('/courses/import/drive/preview', { folderUrl }).then((r) => r.data);
