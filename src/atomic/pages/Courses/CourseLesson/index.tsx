import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "@atoms/Spinner";
import { useCourse, useCourseComments, useCreateCourseComment, useDeleteCourseComment } from "@hooks/useCourses";
import { useAuthStore } from "@store/authStore";
import { getMediaFile, localMediaId } from "@utils/lessonMedia";

const isDrivePreviewUrl = (url: string): boolean =>
  /drive\.google\.com\/file\/d\/[^/]+\/preview/.test(url);

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

const getLessonId = (item?: { id?: string; _id?: string }) => item?._id ?? item?.id;

const toMinutes = (minutes?: number) => {
  if (!minutes) return "00 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${String(rest).padStart(2, "0")}min` : `${hours}h`;
};

const getResourceExtension = (name: string) => {
  const cleanName = name.split("?")[0];
  const parts = cleanName.split(".");
  return parts.length > 1 ? parts.pop()?.toUpperCase() || "DOC" : "DOC";
};

const getCommentCountLabel = (count: number) => {
  if (count === 0) return "cero hasta ahora.";
  if (count === 1) return "uno hasta ahora.";
  return `${count} hasta ahora.`;
};

const formatCommentTime = (value?: string) => {
  if (!value) return "Ahora";
  return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short" }).format(new Date(value));
};

const getTitleLengthClass = (title: string) => {
  if (title.length > 78) return "is-ultra-long";
  if (title.length > 48) return "is-extra-long";
  if (title.length > 26) return "is-long";
  return "";
};

export default function CourseLesson() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const { data: course, isLoading } = useCourse(slug!);
  const lessons = [...(course?.lessons ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const lesson = lessons.find((item) => item.id === lessonId || item._id === lessonId);
  const user = useAuthStore((state) => state.user);
  const [mediaUrl, setMediaUrl] = useState("");
  const [shieldActive, setShieldActive] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const courseId = course?._id ?? course?.id ?? slug;
  const activeLessonId = lesson?._id ?? lesson?.id ?? lessonId;
  const { data: comments = [], isLoading: isCommentsLoading } = useCourseComments(courseId, activeLessonId);
  const createComment = useCreateCourseComment();
  const deleteComment = useDeleteCourseComment();

  useEffect(() => {
    if (!lesson?.videoUrl) {
      setMediaUrl("");
      return;
    }
    if (lesson.videoUrl.startsWith("blob:")) {
      setMediaUrl("");
      return;
    }
    const id = localMediaId(lesson.videoUrl);
    if (!id) {
      setMediaUrl(lesson.videoUrl);
      return;
    }
    let objectUrl = "";
    getMediaFile(id).then((stored) => {
      if (!stored) return;
      objectUrl = URL.createObjectURL(stored.blob);
      setMediaUrl(objectUrl);
    });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [lesson?.videoUrl]);

  useEffect(() => {
    if (!mediaUrl) return;

    let timer: number | undefined;
    const showShield = () => {
      window.clearTimeout(timer);
      setShieldActive(true);
      timer = window.setTimeout(() => setShieldActive(false), 1400);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const blocked =
        event.key === "PrintScreen" ||
        ((event.ctrlKey || event.metaKey) && ["p", "s", "u"].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c", "s"].includes(key)) ||
        key === "f12";
      if (blocked) {
        event.preventDefault();
        showShield();
      }
    };
    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      showShield();
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("contextmenu", onContextMenu);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, [mediaUrl]);

  const downloadResource = async (name: string, url: string) => {
    const id = localMediaId(url);
    if (!id) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    const stored = await getMediaFile(id);
    if (!stored) return;
    const objectUrl = URL.createObjectURL(stored.blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = name;
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!lesson || !course) {
    return <div className="py-20 text-center text-ink-500">Leccion no encontrada.</div>;
  }

  const resolvedCourseId = courseId!;
  const resolvedLessonId = activeLessonId!;
  const lessonIndex = lessons.findIndex((item) => getLessonId(item) === getLessonId(lesson));
  const nextLesson = lessons[lessonIndex + 1];
  const nextLessonId = getLessonId(nextLesson);
  const instructorName = getInstructorName(course.instructor);
  const instructorAvatar = getInstructorAvatar(course.instructor);
  const instructorBio =
    typeof course.instructor === "object" && course.instructor && "bio" in course.instructor && course.instructor.bio
      ? String(course.instructor.bio)
      : "Estratega fiscal. CEO de Díaz Lara | Firma de Estrategia Empresarial. Acompaña a empresarios a tomar mejores decisiones con claridad patrimonial y fiscal.";
  const resources = lesson.resources ?? [];
  const commentsEnabled = lesson.commentsVisibility !== "hidden";
  const commentsLocked = lesson.commentsVisibility === "locked";
  const commentCount = comments.length;
  const lessonTitleLengthClass = getTitleLengthClass(lesson.title);

  return (
    <div className="bg-cream-50 text-ink-900">
      <style>{`
        .adaptive-title {
          overflow-wrap: break-word;
          word-break: normal;
          hyphens: none;
          text-wrap: balance;
        }

        .adaptive-title.is-long {
          font-size: clamp(34px, 7vw, 54px);
          line-height: 1;
        }

        .adaptive-title.is-extra-long {
          font-size: clamp(29px, 5.4vw, 42px);
          line-height: 1.05;
        }

        .adaptive-title.is-ultra-long {
          font-size: clamp(25px, 4.4vw, 34px);
          line-height: 1.1;
        }

        .compact-adaptive-title {
          overflow-wrap: break-word;
          word-break: normal;
          hyphens: none;
          text-wrap: balance;
        }

        .compact-adaptive-title.is-long,
        .compact-adaptive-title.is-extra-long,
        .compact-adaptive-title.is-ultra-long {
          font-size: 20px;
          line-height: 1.12;
        }

        @media print {
          .protected-media-surface {
            background: #000 !important;
          }
          .protected-media-surface * {
            visibility: hidden !important;
          }
        }
      `}</style>

      <main className="mx-auto max-w-[1184px] px-5 py-12 sm:px-8 lg:px-0 lg:py-20">
        <div className="mb-8 border-b border-cream-400 pb-5 text-[10px] uppercase tracking-[0.24em] text-ink-300">
          {course.title} - Leccion
        </div>

        <h1 className={`adaptive-title mb-8 max-w-[900px] font-serif text-[42px] leading-[1] text-ink-900 md:text-[68px] ${lessonTitleLengthClass}`}>
          {lesson.title}
        </h1>

        {mediaUrl && (
          <div className="protected-media-surface relative aspect-video overflow-hidden bg-black text-white">
            {isDrivePreviewUrl(mediaUrl) ? (
              <iframe
                src={mediaUrl}
                title={lesson.title}
                allow="autoplay; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                className="h-full w-full border-0"
              />
            ) : lesson.mediaType === "audio" ? (
              <div className="flex h-full items-center p-8">
                <audio src={mediaUrl} controls className="w-full" />
              </div>
            ) : (
              <video
                src={mediaUrl}
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                className="h-full w-full object-cover"
              />
            )}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] grid grid-cols-2 gap-8 p-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/15 md:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <span key={index} className="-rotate-12 self-center justify-self-center whitespace-nowrap">
                  {user?.email || "Academia DD"}
                </span>
              ))}
            </div>
            {shieldActive && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black text-xs uppercase tracking-[0.35em] text-white">
                Contenido protegido
              </div>
            )}
          </div>
        )}

        {lesson.content && (
          <section className="mx-auto mt-12 max-w-[760px] text-[17px] leading-[1.75] text-ink-600 [&_h1]:font-serif [&_h1]:text-4xl [&_h2]:font-serif [&_h2]:text-3xl [&_p]:mb-5">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </section>
        )}

        <section className="mt-16 grid gap-10 border-t border-cream-400 pt-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {commentsEnabled && (
              <section aria-labelledby="lesson-comments-title">
                <div className="flex items-start justify-between gap-5 border-b border-cream-400 pb-6">
                  <div className="flex gap-7">
                    <span className="mt-2 text-[11px] uppercase tracking-[0.24em] text-ink-500">
                      - {String(lessonIndex + 1).padStart(2, "0")}
                    </span>
                    <h2 id="lesson-comments-title" className="font-serif text-[36px] leading-[0.92] text-ink-900 md:text-[48px]">
                      Comentarios, <em className="italic">{getCommentCountLabel(commentCount)}</em>
                    </h2>
                  </div>
                  <span className="font-serif text-[32px] italic text-[#7a5a2a]">{commentCount}</span>
                </div>

                <form
                  className="mt-5 border border-cream-400 bg-[#eee8dd] p-5 md:p-6"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const body = commentDraft.trim();
                    if (!body || commentsLocked) return;
                    createComment.mutate(
                      { courseId: resolvedCourseId, lessonId: resolvedLessonId, body },
                      { onSuccess: () => setCommentDraft("") },
                    );
                  }}
                >
                  <label htmlFor="lesson-comment" className="text-[9px] uppercase tracking-[0.28em] text-ink-400">
                    - Deja una pregunta o aporte
                  </label>
                  <textarea
                    id="lesson-comment"
                    value={commentDraft}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    disabled={commentsLocked}
                    placeholder={
                      commentsLocked
                        ? "Los comentarios de esta leccion estan cerrados."
                        : "Que te quedo claro de esta leccion? Que se te aclaro? Que quedo pendiente?"
                    }
                    className="mt-5 min-h-[96px] w-full resize-none border-0 border-b border-ink-900 bg-transparent font-serif text-[16px] italic leading-relaxed text-ink-800 outline-none placeholder:text-ink-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="font-serif text-[12px] italic text-ink-600">
                      Comentas como {user?.name || "usuario verificado"} - cuenta verificada
                    </p>
                    <button
                      type="submit"
                      disabled={commentsLocked || createComment.isPending || !commentDraft.trim()}
                      className="min-h-11 cursor-pointer bg-ink-900 px-5 text-[9px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-ink-700 disabled:cursor-not-allowed disabled:bg-ink-300"
                    >
                      {createComment.isPending ? "Publicando..." : "Publicar comentario -"}
                    </button>
                  </div>
                  {createComment.isError && (
                    <p className="mt-4 text-[12px] text-red-700">
                      {createComment.error instanceof Error ? createComment.error.message : "No se pudo publicar el comentario."}
                    </p>
                  )}
                </form>

                {isCommentsLoading ? (
                  <div className="mt-8 border border-dashed border-cream-400 px-6 py-8 text-center font-serif text-[17px] italic leading-relaxed text-ink-500">
                    Cargando comentarios...
                  </div>
                ) : comments.length > 0 ? (
                  <div className="mt-8 divide-y divide-cream-400 border-y border-cream-400">
                    {comments.map((comment) => {
                      const canDelete =
                        user?.role === "admin" ||
                        Boolean(user?.id && user.id === comment.userId);
                      return (
                      <article key={comment._id} className="py-5">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-500">
                            {comment.author?.name || "Usuario verificado"}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] uppercase tracking-[0.22em] text-ink-300">
                              {formatCommentTime(comment.createdAt)}
                            </span>
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => deleteComment.mutate({ courseId: resolvedCourseId, commentId: comment._id })}
                                className="cursor-pointer text-[9px] uppercase tracking-[0.18em] text-ink-400 transition-colors hover:text-ink-900"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="mt-3 font-serif text-[16px] italic leading-relaxed text-ink-700">{comment.body}</p>
                      </article>
                    );
                    })}
                  </div>
                ) : (
                  <div className="mt-8 border border-dashed border-cream-400 px-6 py-8 text-center font-serif text-[17px] italic leading-relaxed text-ink-500">
                    Se la primera persona en comentar - los comentarios son visibles para toda la cohorte activa de la masterclass.
                  </div>
                )}
              </section>
            )}

            {nextLesson && nextLessonId && (
              <aside className="mt-8 bg-ink-900 p-6 text-white lg:hidden">
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/45">- Continuar con</p>
                <h3 className={`compact-adaptive-title mt-4 font-serif text-[24px] leading-tight ${getTitleLengthClass(nextLesson.title)}`}>
                  L{lessonIndex + 2} - {nextLesson.title}
                </h3>
                <p className="mt-4 max-w-[440px] font-serif text-[14px] italic leading-relaxed text-white/70">
                  {nextLesson.description || "Continua con la siguiente leccion de esta masterclass."}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-[9px] uppercase tracking-[0.2em] text-white/55">
                  <span>Leccion {String(lessonIndex + 2).padStart(2, "0")} - {toMinutes(nextLesson.duration)}</span>
                  <span>{instructorName}</span>
                </div>
                <Link
                  to={`/cursos/${course.slug}/leccion/${nextLessonId}`}
                  className="mt-5 inline-flex min-h-11 cursor-pointer items-center bg-white px-5 text-[9px] uppercase tracking-[0.2em] text-ink-900 transition-colors hover:bg-cream-200"
                >
                  Ir a leccion {String(lessonIndex + 2).padStart(2, "0")} -
                </Link>
              </aside>
            )}
          </div>

          <aside className="space-y-5">
            <section className="border border-cream-400 bg-[#e8e1d6]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_55%_35%,#5b4938_0,#2d211a_34%,#090807_80%)]">
                {instructorAvatar ? (
                  <img src={instructorAvatar} alt={instructorName} className="h-full w-full object-cover opacity-90" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-[64px] leading-none tracking-tight text-white/25">DD</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
                  <p className="text-[8px] uppercase tracking-[0.24em] text-white/70">
                    - {instructorName} - Sesion en vivo
                  </p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[9px] uppercase tracking-[0.25em] text-ink-400">- Expositor - Masterclass completa</p>
                <h2 className="mt-3 font-serif text-[28px] leading-none">{instructorName}.</h2>
                <p className="mt-3 font-serif text-[13px] italic leading-relaxed text-ink-700">{instructorBio}</p>
                <div className="mt-5 border-t border-ink-900/10 pt-4 text-[8px] uppercase tracking-[0.22em] text-ink-500">
                  - Fiscal - Empresarial - Sucesion
                </div>
              </div>
            </section>

            <section className="border border-cream-400 bg-[#e8e1d6] p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[9px] uppercase tracking-[0.25em] text-ink-400">- Material descargable</p>
                <span className="font-serif text-[11px] italic text-ink-700">{resources.length} archivos</span>
              </div>
              <h2 className="mt-5 font-serif text-[21px] leading-tight">
                Para llevar a tu <em className="italic">practica.</em>
              </h2>
              <div className="mt-5">
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <button
                      key={resource.url}
                      type="button"
                      onClick={() => void downloadResource(resource.name, resource.url)}
                      className="grid min-h-10 w-full cursor-pointer grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 border-t border-dashed border-ink-900/10 text-left text-[10px] text-ink-600 transition-colors hover:bg-cream-100"
                    >
                      <span className="uppercase tracking-[0.18em]">- {getResourceExtension(resource.name)}</span>
                      <span className="truncate font-serif text-[13px] text-ink-800">{resource.name}</span>
                      <span className="uppercase tracking-[0.16em]">Descargar</span>
                    </button>
                  ))
                ) : (
                  <p className="border-t border-dashed border-ink-900/10 pt-4 font-serif text-[13px] italic text-ink-500">
                    Esta leccion no tiene materiales descargables.
                  </p>
                )}
              </div>
              {resources.length > 0 && (
                <button
                  type="button"
                  onClick={() => resources.forEach((resource) => void downloadResource(resource.name, resource.url))}
                  className="mt-6 min-h-11 cursor-pointer bg-ink-900 px-5 text-[9px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-ink-700"
                >
                  Descargar todo
                </button>
              )}
            </section>

            {nextLesson && nextLessonId && (
              <section className="hidden bg-ink-900 p-6 text-white lg:block">
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/45">- Continuar con</p>
                <h3 className={`compact-adaptive-title mt-4 font-serif text-[24px] leading-tight ${getTitleLengthClass(nextLesson.title)}`}>
                  L{lessonIndex + 2} - {nextLesson.title}
                </h3>
                <p className="mt-4 font-serif text-[13px] italic leading-relaxed text-white/70">
                  {nextLesson.description || "Continua con la siguiente leccion de esta masterclass."}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-[8px] uppercase tracking-[0.18em] text-white/55">
                  <span>Leccion {String(lessonIndex + 2).padStart(2, "0")} - {toMinutes(nextLesson.duration)}</span>
                  <span>{instructorName}</span>
                </div>
                <Link
                  to={`/cursos/${course.slug}/leccion/${nextLessonId}`}
                  className="mt-5 inline-flex min-h-11 cursor-pointer items-center bg-white px-5 text-[9px] uppercase tracking-[0.2em] text-ink-900 transition-colors hover:bg-cream-200"
                >
                  Ir a leccion {String(lessonIndex + 2).padStart(2, "0")} -
                </Link>
              </section>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}
