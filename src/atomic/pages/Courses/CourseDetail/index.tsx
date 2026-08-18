import { Link, useParams } from "react-router-dom";
import Spinner from "@atoms/Spinner";
import { useCourse, useCourseComments } from "@hooks/useCourses";
import type { Lesson } from "@t/index";

const getLessonId = (lesson?: Lesson) => lesson?._id ?? lesson?.id;
const MAX_VISIBLE_LESSONS = 6;

const getInstructorName = (instructor: unknown) => {
  if (typeof instructor === "object" && instructor && "name" in instructor) {
    return String(instructor.name || "Diego Diaz");
  }
  if (typeof instructor === "string" && instructor.trim()) return instructor;
  return "Diego Diaz";
};

const getInstructorAvatar = (instructor: unknown) => {
  if (typeof instructor === "object" && instructor && "avatar" in instructor) {
    return String(instructor.avatar || "");
  }
  return "";
};

const getInstructorBio = (instructor: unknown) => {
  if (typeof instructor === "object" && instructor && "bio" in instructor && instructor.bio) {
    return String(instructor.bio);
  }
  return "Estratega fiscal. CEO de Díaz Lara | Firma de Estrategia Empresarial. Acompaña a empresarios a tomar mejores decisiones con claridad patrimonial y fiscal.";
};

const getTitleLengthClass = (title: string) => {
  if (title.length > 78) return "is-ultra-long";
  if (title.length > 48) return "is-extra-long";
  if (title.length > 26) return "is-long";
  return "";
};

const toMinutes = (minutes?: number) => {
  if (!minutes) return "00 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${String(rest).padStart(2, "0")}min` : `${hours}h`;
};

const stripHtml = (value?: string) =>
  (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useCourse(slug!);
  const courseId = course?._id ?? course?.id ?? slug;
  const { data: comments = [], isLoading: isCommentsLoading } = useCourseComments(courseId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return <div className="container-app py-20 text-center text-ink-500">Curso no encontrado.</div>;
  }

  const lessons = [...(course.lessons ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const firstLesson = lessons[0];
  const firstLessonId = getLessonId(firstLesson);
  const totalMinutes = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || course.totalDuration || 0;
  const instructorName = getInstructorName(course.instructor);
  const instructorAvatar = getInstructorAvatar(course.instructor);
  const instructorBio = getInstructorBio(course.instructor);
  const lessonCount = lessons.length || course.totalLessons || 0;
  const courseTitleLengthClass = getTitleLengthClass(course.title);
  const firstLessonTitleLengthClass = getTitleLengthClass(firstLesson?.title || course.title);
  const commentEnabledLessons = lessons.filter((lesson) => lesson.commentsVisibility !== "hidden").length || lessonCount;
  const featuredComments = comments.slice(-3).reverse();
  const nextLesson = lessons[1];
  const nextLessonId = getLessonId(nextLesson);
  const lessonCopy =
    firstLesson?.description ||
    stripHtml(firstLesson?.content) ||
    course.shortDescription ||
    "Antes de aprender a cerrar una venta, hay que saber que es exactamente lo que se esta haciendo. Esta primera leccion redefine el gesto de vender como un acto de claridad.";

  return (
    <main className="bg-[#f4f0e8] text-ink-900">
      <style>{`
        .course-preview-shell {
          display: grid;
          gap: 28px;
          width: min(1180px, calc(100vw - 40px));
          margin: 0 auto;
          padding: 44px 0 72px;
        }

        .course-preview-card {
          display: grid;
          min-height: 430px;
          overflow: hidden;
          box-shadow: 0 22px 60px rgba(10, 10, 10, 0.06);
        }

        .course-context-shell {
          display: grid;
          gap: 32px;
          width: min(1180px, calc(100vw - 40px));
          margin: 0 auto;
          padding: 0 0 96px;
        }

        .course-title-lock,
        .lesson-title-lock,
        .course-summary-title,
        .lesson-list-title,
        .course-next-title {
          overflow-wrap: break-word;
          word-break: normal;
          hyphens: none;
          text-wrap: balance;
        }

        .course-title-lock {
          font-size: clamp(40px, 12.5vw, 62px);
          line-height: 0.88;
        }

        .course-title-lock.is-long {
          font-size: clamp(34px, 9vw, 46px);
          line-height: 0.96;
        }

        .course-title-lock.is-extra-long {
          font-size: clamp(29px, 7.5vw, 38px);
          line-height: 1;
        }

        .course-title-lock.is-ultra-long {
          font-size: clamp(26px, 6vw, 33px);
          line-height: 1.04;
        }

        .course-summary-title.is-long {
          font-size: clamp(24px, 2.2vw, 26px);
          line-height: 1;
        }

        .course-summary-title.is-extra-long {
          font-size: clamp(21px, 2vw, 24px);
          line-height: 1.04;
        }

        .course-summary-title.is-ultra-long {
          font-size: clamp(19px, 1.8vw, 22px);
          line-height: 1.08;
        }

        .lesson-title-lock {
          font-size: clamp(54px, 14vw, 86px);
          line-height: 0.86;
        }

        .lesson-title-lock.is-long {
          font-size: clamp(42px, 11vw, 64px);
          line-height: 0.94;
        }

        .lesson-title-lock.is-extra-long {
          font-size: clamp(34px, 9vw, 48px);
          line-height: 1;
        }

        .lesson-title-lock.is-ultra-long {
          font-size: clamp(29px, 7vw, 38px);
          line-height: 1.06;
        }

        .lesson-list-title.is-long,
        .lesson-list-title.is-extra-long,
        .lesson-list-title.is-ultra-long {
          font-size: 13px;
          line-height: 1.12;
        }

        .course-next-title.is-long,
        .course-next-title.is-extra-long,
        .course-next-title.is-ultra-long {
          font-size: 20px;
          line-height: 1.12;
        }

        @media (min-width: 768px) {
          .course-preview-shell {
            grid-template-columns: minmax(0, 760px) 304px;
            align-items: start;
            gap: 32px;
            padding: 76px 0 104px;
          }

          .course-preview-card {
            grid-template-columns: minmax(238px, 0.9fr) minmax(0, 1.1fr);
          }

          .course-context-shell {
            grid-template-columns: minmax(0, 760px) 304px;
            align-items: start;
            gap: 32px;
          }

          .course-title-lock {
            font-size: clamp(36px, 3.3vw, 60px);
          }

          .course-title-lock.is-long {
            font-size: clamp(34px, 2.6vw, 46px);
          }

          .course-title-lock.is-extra-long {
            font-size: clamp(30px, 2.15vw, 38px);
          }

          .course-title-lock.is-ultra-long {
            font-size: clamp(27px, 1.8vw, 32px);
          }

          .lesson-title-lock {
            font-size: clamp(58px, 5.3vw, 88px);
          }

          .lesson-title-lock.is-long {
            font-size: clamp(48px, 4vw, 64px);
          }

          .lesson-title-lock.is-extra-long {
            font-size: clamp(38px, 3.2vw, 48px);
          }

          .lesson-title-lock.is-ultra-long {
            font-size: clamp(31px, 2.55vw, 38px);
          }
        }

        @media (min-width: 1280px) {
          .course-preview-shell {
            grid-template-columns: minmax(0, 820px) 320px;
            gap: 44px;
          }

          .course-preview-card {
            grid-template-columns: 330px minmax(0, 1fr);
            min-height: 452px;
          }

          .course-context-shell {
            grid-template-columns: minmax(0, 820px) 320px;
            gap: 44px;
          }
        }
      `}</style>

      <section className="course-preview-shell">
        <article className="course-preview-card border border-ink-900/10 bg-cream-50">
          <div className="flex min-h-[320px] flex-col border-b border-ink-900/10 bg-[#e5ded2] p-7 md:min-h-0 md:border-b-0 md:border-r md:p-9">
            <p className="text-[9px] uppercase tracking-[0.24em] text-ink-400">
              - Masterclass - Leccion 01
            </p>
            <p className="mt-5 font-serif text-[20px] italic leading-none text-ink-800">{instructorName}.</p>
            <h1 className={`course-title-lock mt-2 max-w-full font-serif ${courseTitleLengthClass}`}>
              {course.title}
            </h1>
            <div className="mt-auto hidden pt-8 text-[10px] uppercase tracking-[0.22em] text-ink-400 md:block">
              {lessonCount} lecciones
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-between p-7 md:p-9">
            <div>
              <p className="text-[9px] uppercase tracking-[0.24em] text-ink-400">
                - Leccion 01 de {String(lessonCount || 1).padStart(2, "0")}
              </p>
              <h2 className={`lesson-title-lock mt-5 max-w-[410px] font-serif ${firstLessonTitleLengthClass}`}>
                {firstLesson?.title || course.title}
              </h2>
              <p className="mt-7 max-w-[370px] font-serif text-[15px] italic leading-[1.45] text-ink-700 md:text-[16px]">
                {lessonCopy}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-ink-900/10 pt-5 text-[8px] uppercase tracking-[0.2em] text-ink-500">
              <Link
                to={firstLessonId ? `/cursos/${course.slug}/leccion/${firstLessonId}` : "#"}
                aria-label="Reproducir primera leccion"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-ink-900 text-[9px] text-ink-900 transition-colors hover:bg-ink-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-ink-900/30"
              >
                &#9654;
              </Link>
              <span>00:00 / {toMinutes(firstLesson?.duration || totalMinutes)}</span>
              <span>HD - 1080P</span>
              <span>CC - Espanol</span>
            </div>
          </div>
        </article>

        <aside className="border border-ink-900/10 bg-[#e8e1d6] shadow-[0_18px_45px_rgba(10,10,10,0.05)]">
          <div className="border-b border-ink-900/10 p-6">
            <p className="text-[9px] uppercase tracking-[0.25em] text-ink-400">- Resumen del curso</p>
            <h2 className={`course-summary-title mt-3 font-serif text-[28px] leading-[0.95] ${courseTitleLengthClass}`}>
              {course.title}
            </h2>
            <p className="mt-1 font-serif text-[12px] italic text-ink-600">
              {lessonCount} lecciones - {toMinutes(totalMinutes)} de contenido
            </p>
          </div>

          <div>
            {lessons.slice(0, MAX_VISIBLE_LESSONS).map((lesson, index) => {
              const id = getLessonId(lesson);
              const active = index === 0;
              return (
                <Link
                  key={id ?? lesson.title}
                  to={id ? `/cursos/${course.slug}/leccion/${id}` : "#"}
                  className="grid min-h-[56px] cursor-pointer grid-cols-[34px_minmax(0,1fr)_48px] items-center gap-3 border-b border-ink-900/10 px-6 transition-colors hover:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ink-900/20"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-[9px] ${
                      active ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/25 text-ink-500"
                    }`}
                  >
                    L{index + 1}
                  </span>
                  <span className={`lesson-list-title font-serif text-[15px] leading-tight ${getTitleLengthClass(lesson.title)}`}>
                    {lesson.title}
                  </span>
                  <span className="text-right text-[8px] uppercase tracking-[0.16em] text-ink-500">
                    {active ? "Aqui" : toMinutes(lesson.duration || 17 + index * 2)}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-ink-500">
              <span>Progreso del curso</span>
              <span>17%</span>
            </div>
            <div className="mt-3 h-px bg-ink-900/15">
              <div className="h-px bg-ink-900" style={{ width: "17%" }} />
            </div>
            <Link
              to={firstLessonId ? `/cursos/${course.slug}/leccion/${firstLessonId}` : "#"}
              className="mt-6 flex min-h-[48px] w-[168px] cursor-pointer items-center justify-center bg-[#080808] px-4 text-[8px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-ink-700 focus:outline-none focus:ring-2 focus:ring-ink-900/30"
            >
              Siguiente leccion -
            </Link>
          </div>
        </aside>
      </section>

      <section className="course-context-shell">
        <div className="min-w-0 border-t border-ink-900/10 pt-8">
          <div className="flex items-start justify-between gap-5 border-b border-ink-900/10 pb-6">
            <div className="flex gap-7">
              <span className="mt-2 text-[11px] uppercase tracking-[0.24em] text-ink-500">- 04</span>
              <h2 className="font-serif text-[36px] leading-[0.92] text-ink-900 md:text-[48px]">
                Comentarios, <em className="italic">{comments.length === 0 ? "cero hasta ahora." : `${comments.length} en total.`}</em>
              </h2>
            </div>
            <span className="font-serif text-[32px] italic text-[#7a5a2a]">{comments.length}</span>
          </div>

          <div className="mt-5 border border-ink-900/10 bg-[#eee8dd] p-5 md:p-6">
            <p className="text-[9px] uppercase tracking-[0.28em] text-ink-400">- Recopilacion de la masterclass</p>
            {isCommentsLoading ? (
              <p className="mt-5 border-b border-ink-900 pb-12 font-serif text-[16px] italic leading-relaxed text-ink-500">
                Cargando comentarios de la cohorte...
              </p>
            ) : featuredComments.length > 0 ? (
              <div className="mt-5 divide-y divide-ink-900/10 border-b border-ink-900">
                {featuredComments.map((comment) => (
                  <article key={comment._id} className="py-4 first:pt-0">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[9px] uppercase tracking-[0.22em] text-ink-500">
                        {comment.author?.name || "Usuario verificado"}
                      </p>
                      <span className="text-[9px] uppercase tracking-[0.18em] text-ink-400">
                        {comment.lesson ? `L${comment.lesson.order}` : "Curso"}
                      </span>
                    </div>
                    <p className="mt-3 font-serif text-[16px] italic leading-relaxed text-ink-700">{comment.body}</p>
                    {comment.lesson && (
                      <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-ink-400">{comment.lesson.title}</p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 border-b border-ink-900 pb-12 font-serif text-[16px] italic leading-relaxed text-ink-500">
                Las preguntas, aportes y aprendizajes de esta masterclass apareceran aqui conforme avance la cohorte.
              </p>
            )}
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="font-serif text-[12px] italic text-ink-600">
                {commentEnabledLessons} lecciones aceptan comentarios de alumnos.
              </p>
              <Link
                to={firstLessonId ? `/cursos/${course.slug}/leccion/${firstLessonId}` : "#"}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center bg-ink-900 px-5 text-[9px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-ink-700"
              >
                Entrar a comentar -
              </Link>
            </div>
          </div>

          {comments.length === 0 && (
            <div className="mt-8 border border-dashed border-ink-900/10 px-6 py-8 text-center font-serif text-[17px] italic leading-relaxed text-ink-500">
              Se la primera persona en comentar - los comentarios seran visibles para toda la cohorte activa de la masterclass.
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <section className="border border-ink-900/10 bg-[#e8e1d6]">
            <div className="relative aspect-[1/1.12] overflow-hidden bg-[radial-gradient(circle_at_55%_35%,#5b4938_0,#2d211a_34%,#090807_80%)]">
              {instructorAvatar && (
                <img src={instructorAvatar} alt={instructorName} className="h-full w-full object-cover opacity-90" />
              )}
              <p className="absolute bottom-4 left-4 text-[8px] uppercase tracking-[0.24em] text-white/55">
                - {instructorName} - Masterclass
              </p>
            </div>
            <div className="p-5">
              <p className="text-[9px] uppercase tracking-[0.25em] text-ink-400">- Expositor - Curso completo</p>
              <h2 className="mt-3 font-serif text-[28px] leading-none">{instructorName}.</h2>
              <p className="mt-3 font-serif text-[13px] italic leading-relaxed text-ink-700">{instructorBio}</p>
              <div className="mt-5 border-t border-ink-900/10 pt-4 text-[8px] uppercase tracking-[0.22em] text-ink-500">
                - Fiscal - Empresarial - Estrategia
              </div>
            </div>
          </section>

          {nextLesson && nextLessonId && (
            <section className="bg-ink-900 p-6 text-white">
              <p className="text-[9px] uppercase tracking-[0.28em] text-white/45">- Continuar con</p>
              <h3 className={`course-next-title mt-4 font-serif text-[24px] leading-tight ${getTitleLengthClass(nextLesson.title)}`}>
                L2 - {nextLesson.title}
              </h3>
              <p className="mt-4 font-serif text-[13px] italic leading-relaxed text-white/70">
                {nextLesson.description || "Continua con la segunda leccion de esta masterclass."}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-[8px] uppercase tracking-[0.18em] text-white/55">
                <span>Leccion 02 - {toMinutes(nextLesson.duration)}</span>
                <span>{instructorName}</span>
              </div>
              <Link
                to={`/cursos/${course.slug}/leccion/${nextLessonId}`}
                className="mt-5 inline-flex min-h-11 cursor-pointer items-center bg-white px-5 text-[9px] uppercase tracking-[0.2em] text-ink-900 transition-colors hover:bg-cream-200"
              >
                Ir a leccion 02 -
              </Link>
            </section>
          )}
        </aside>
      </section>
    </main>
  );
}
