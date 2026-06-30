import { Link, useParams } from 'react-router-dom';
import Spinner from '@atoms/Spinner';
import Badge from '@atoms/Badge';
import { useCourse } from '@hooks/useCourses';

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useCourse(slug!);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!course) return <div className="container-app py-20 text-center text-neutral-500">Curso no encontrado.</div>;

  const instructor = typeof course.instructor === 'object' ? course.instructor : null;
  const lessons = [...(course.lessons ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const firstLesson = lessons[0];
  const firstLessonId = firstLesson?._id ?? firstLesson?.id;

  return (
    <div className="container-app py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <section className="flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <Badge label={course.category || 'Academia'} />
            <h1 className="font-heading text-4xl font-bold text-neutral-950">{course.title}</h1>
            <p className="max-w-3xl text-base leading-7 text-neutral-700">
              {course.description || course.shortDescription || 'Contenido importado desde Google Drive.'}
            </p>
            {firstLesson && firstLessonId && (
              <Link
                to={`/cursos/${course.slug}/leccion/${firstLessonId}`}
                className="inline-flex min-h-12 w-fit items-center justify-center bg-neutral-950 px-7 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-neutral-800"
              >
                Continuar curso
              </Link>
            )}
          </div>

          {(course.whatYouLearn?.length ?? 0) > 0 && (
            <div className="border-t border-neutral-200 pt-6">
              <h2 className="mb-4 font-heading text-2xl font-semibold text-neutral-950">Lo que aprenderas</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {course.whatYouLearn.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-neutral-700">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neutral-950" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-neutral-200 pt-6">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-neutral-950">Lecciones</h2>
            {lessons.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
                {lessons.map((lesson, index) => {
                  const lessonId = lesson._id ?? lesson.id;
                  return (
                    <Link
                      key={lessonId ?? lesson.title}
                      to={lessonId ? `/cursos/${course.slug}/leccion/${lessonId}` : '#'}
                      className="flex min-h-16 items-center justify-between gap-4 border-b border-neutral-100 px-5 py-4 text-neutral-950 transition-colors last:border-b-0 hover:bg-neutral-50"
                    >
                      <span className="flex items-center gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-xs font-semibold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-medium">{lesson.title}</span>
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Ver</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-neutral-200 bg-white p-6 text-neutral-600">
                Este curso ya esta dado de alta. Sus lecciones se agregaran cuando termine la importacion del contenido.
              </div>
            )}
          </div>
        </section>

        <aside>
          <div className="sticky top-20 rounded-lg border border-neutral-200 bg-neutral-950 p-6 text-white">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="mb-5 aspect-video w-full rounded-md object-cover" />
            ) : (
              <div className="mb-5 flex aspect-video w-full items-center justify-center rounded-md bg-neutral-900 text-xs uppercase tracking-[0.3em] text-neutral-500">
                Academia
              </div>
            )}
            <div className="space-y-2 text-sm text-neutral-300">
              <p>{lessons.length || course.totalLessons || 0} lecciones</p>
              <p>{course.totalDuration || 0} min</p>
              {instructor && <p>Instructor: {instructor.name}</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
