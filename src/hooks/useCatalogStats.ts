import { useMemo } from 'react';
import { useCourses } from '@hooks/useCourses';

// Último conteo conocido del catálogo; se usa solo mientras la API responde
// para evitar que los contadores parpadeen en "0".
const FALLBACK_COURSE_COUNT = 34;

export interface CatalogStats {
  courseCount: number;
  lessonCount: number;
  isLoading: boolean;
}

/** Contadores reales del catálogo público de la Academia (cursos publicados). */
export const useCatalogStats = (): CatalogStats => {
  const { data, isLoading } = useCourses({ limit: 200, status: 'published' });

  return useMemo(() => {
    const courses = data?.data ?? [];
    const courseCount = data?.pagination?.total ?? (courses.length || FALLBACK_COURSE_COUNT);
    const lessonCount = courses.reduce((sum, c) => sum + (c.totalLessons || 0), 0);
    return { courseCount, lessonCount, isLoading };
  }, [data, isLoading]);
};

export const formatCourseCount = (n: number) => `${n} curso${n === 1 ? '' : 's'}`;
