import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "@atoms/Spinner";
import { useCourse } from "@hooks/useCourses";
import { getMediaFile, localMediaId } from "@utils/lessonMedia";

const isDrivePreviewUrl = (url: string): boolean =>
  /drive\.google\.com\/file\/d\/[^/]+\/preview/.test(url);

export default function CourseLesson() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const { data: course, isLoading } = useCourse(slug!);
  const lessons = course?.lessons ?? [];
  const lesson = lessons?.find((l) => l.id === lessonId || l._id === lessonId);
  const [mediaUrl, setMediaUrl] = useState("");
  const [shieldActive, setShieldActive] = useState(false);

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
      timer = window.setTimeout(() => setShieldActive(false), 1800);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const blocked =
        event.key === "PrintScreen" ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && key === "s") ||
        ((event.ctrlKey || event.metaKey) && ["s", "p", "u"].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key));
      if (blocked) {
        event.preventDefault();
        showShield();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyDown);
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

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  if (!lesson)
    return (
      <div className="text-center py-20 text-gray-400">
        Lección no encontrada.
      </div>
    );

  return (
    <div className="container-app py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-6">{lesson.title}</h1>
      {mediaUrl && (
        <div
          className={`${lesson.mediaType === "audio" ? "p-6" : "aspect-video overflow-hidden"} relative mb-6 rounded-xl bg-black`}
        >
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
            <audio src={mediaUrl} controls className="w-full" />
          ) : (
            <video
              src={mediaUrl}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              className="h-full w-full"
            />
          )}
          {shieldActive && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black text-xs uppercase tracking-[0.35em] text-white">
              Contenido protegido
            </div>
          )}
        </div>
      )}
      {lesson.content && (
        <div
          className="prose prose-invert max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}
      {(lesson.resources?.length ?? 0) > 0 && (
        <section className="mt-8 border-t border-white/10 pt-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Descargables
          </h2>
          <div className="space-y-3">
            {lesson.resources.map((resource) => (
              <button
                key={resource.url}
                type="button"
                onClick={() =>
                  void downloadResource(resource.name, resource.url)
                }
                className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-white/10 px-4 text-left text-sm text-gray-200 transition-colors hover:border-white/30 hover:bg-white/5"
              >
                <span className="truncate">{resource.name}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14"
                  />
                </svg>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
