import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '@api/modules.api';

export const useModules = (courseId: string | undefined) =>
  useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => api.listModules(courseId!),
    enabled: !!courseId,
  });

export const useModuleLessons = (moduleId: string | undefined, enabled = true) =>
  useQuery({
    queryKey: ['module-lessons', moduleId],
    queryFn: () => api.listLessonsByModule(moduleId!),
    enabled: !!moduleId && enabled,
  });

export const useCreateModule = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; description?: string }) => api.createModule(courseId, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modules', courseId] }); toast.success('Módulo creado'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdateModule = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Parameters<typeof api.updateModule>[1]> }) => api.updateModule(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modules', courseId] }); toast.success('Módulo actualizado'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDeleteModule = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteModule,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modules', courseId] }); toast.success('Módulo eliminado'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useAddLesson = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, input }: { moduleId: string; input: Parameters<typeof api.addLessonToModule>[1] }) =>
      api.addLessonToModule(moduleId, input),
    onSuccess: (_lesson, variables) => { qc.invalidateQueries({ queryKey: ['modules', courseId] }); qc.invalidateQueries({ queryKey: ['module-lessons', variables.moduleId] }); toast.success('Lección añadida'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdateLesson = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.updateLesson>[2] }) => api.updateLesson(courseId, id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modules', courseId] }); qc.invalidateQueries({ queryKey: ['module-lessons'] }); toast.success('Lección guardada'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDeleteLesson = (courseId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteLesson(courseId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modules', courseId] }); qc.invalidateQueries({ queryKey: ['module-lessons'] }); toast.success('Lección eliminada'); },
    onError: (e: Error) => toast.error(e.message),
  });
};
