import { client } from './client';
import type { Module, Lesson, ApiResponse } from '@t/index';

export const listModules = (courseId: string): Promise<Module[]> =>
  client.get<ApiResponse<Module[]>>(`/courses/${courseId}/modules`).then((r) => r.data);

export const createModule = (courseId: string, input: { title: string; description?: string }): Promise<Module> =>
  client.post<ApiResponse<Module>>(`/courses/${courseId}/modules`, input).then((r) => r.data);

export const updateModule = (id: string, data: Partial<Module>): Promise<Module> =>
  client.put<ApiResponse<Module>>(`/modules/${id}`, data).then((r) => r.data);

export const deleteModule = (id: string): Promise<void> =>
  client.delete<void>(`/modules/${id}`);

export const reorderModules = (courseId: string, orderedIds: string[]): Promise<Module[]> =>
  client.post<ApiResponse<Module[]>>(`/courses/${courseId}/modules/reorder`, { orderedIds }).then((r) => r.data);

export const listLessonsByModule = (moduleId: string): Promise<Lesson[]> =>
  client.get<ApiResponse<Lesson[]>>(`/modules/${moduleId}/lessons`).then((r) => r.data);

export const addLessonToModule = (
  moduleId: string,
  input: { title: string; videoUrl?: string; duration?: number; content?: string },
): Promise<Lesson> =>
  client.post<ApiResponse<Lesson>>(`/modules/${moduleId}/lessons`, input).then((r) => r.data);

export const updateLesson = (courseId: string, id: string, data: Partial<Lesson>): Promise<Lesson> =>
  client.put<ApiResponse<Lesson>>(`/courses/${courseId}/lessons/${id}`, data).then((r) => r.data);

export const deleteLesson = (courseId: string, id: string): Promise<void> =>
  client.delete<void>(`/courses/${courseId}/lessons/${id}`);
