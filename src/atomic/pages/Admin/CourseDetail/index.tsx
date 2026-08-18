import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCourse, updateCourse } from "@api/courses.api";
import { useCourseAdmin } from "@hooks/useCourses";
import {
  useAddLesson,
  useCreateModule,
  useDeleteLesson,
  useDeleteModule,
  useModules,
  useModuleLessons,
  useUpdateLesson,
  useUpdateModule,
} from "@hooks/useModules";
import type { Course, Lesson, Module } from "@t/index";
import {
  getMediaFile,
  localMediaId,
  localMediaUrl,
  removeMediaFile,
  storeMediaFile,
} from "@utils/lessonMedia";

type CourseTab =
  | "outline"
  | "offers"
  | "students"
  | "certificates"
  | "settings";
type AutomationAction =
  | "add_tag"
  | "remove_tag"
  | "send_email"
  | "enroll_event"
  | "grant_offer"
  | "send_certificate";

interface AutomationRule {
  id: string;
  action: AutomationAction;
  value: string;
}

interface LessonPreferences {
  thumbnail: string;
  mediaType: "none" | "video" | "audio";
  videoUrl: string;
  resources: { name: string; url: string }[];
  isPublished: boolean;
  commentsVisibility: "visible" | "hidden" | "locked";
}

const ACTION_LABELS: Record<AutomationAction, string> = {
  add_tag: "Añadir una etiqueta",
  remove_tag: "Eliminar una etiqueta",
  send_email: "Enviar un correo",
  enroll_event: "Registrar en un evento",
  grant_offer: "Otorgar una oferta",
  send_certificate: "Enviar un certificado",
};

export default function CourseDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: course, isLoading } = useCourseAdmin(id);
  const { data: modules = [], isLoading: modulesLoading } = useModules(id);
  const createModule = useCreateModule(id);
  const [params, setParams] = useSearchParams();
  const initialTab = params.get("tab");
  const [tab, setTab] = useState<CourseTab>(
    isCourseTab(initialTab) ? initialTab : "outline",
  );
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [moduleDialog, setModuleDialog] = useState<Module | "new" | null>(null);
  const [lessonDialogModule, setLessonDialogModule] = useState<string | null>(
    null,
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const filteredModules = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    if (!query) return modules;
    return modules
      .map((module) => ({
        ...module,
        lessons: (module.lessons ?? []).filter((lesson) =>
          lesson.title.toLocaleLowerCase("es").includes(query),
        ),
      }))
      .filter(
        (module) =>
          module.title.toLocaleLowerCase("es").includes(query) ||
          (module.lessons?.length ?? 0) > 0,
      );
  }, [modules, search]);

  if (isLoading) return <p className="text-sm text-ink-500">Cargando curso…</p>;
  if (!course)
    return <p className="text-sm text-ink-500">Curso no encontrado.</p>;

  if (selectedLesson) {
    return (
      <LessonEditor
        courseId={id}
        lesson={selectedLesson}
        modules={modules}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  const allExpanded =
    modules.length > 0 && modules.every((module) => expanded.has(module._id));
  const toggleAll = () =>
    setExpanded(
      allExpanded ? new Set() : new Set(modules.map((module) => module._id)),
    );
  const addContent = () => setModuleDialog("new");
  const changeTab = (next: CourseTab) => {
    setTab(next);
    next === "outline" ? setParams({}) : setParams({ tab: next });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/admin/cursos"
        className="mb-5 inline-flex min-h-10 items-center text-xs text-ink-600 hover:text-ink-900"
      >
        ← Volver a cursos
      </Link>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-5">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex aspect-square h-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-900/15 bg-cream-100 text-ink-300">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon large />
            )}
          </div>
          <div className="min-w-0">
            <p className="mb-2 text-[10px] uppercase tracking-[0.38em] text-ink-500">
              Constructor del curso
            </p>
            <h1 className="truncate font-serif text-3xl text-ink-900 md:text-4xl">
              {course.title}
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              {modules.length} módulo{modules.length === 1 ? "" : "s"} ·{" "}
              {modules.reduce(
                (sum, module) =>
                  sum +
                  (module.lessons?.length ?? module.lessonIds?.length ?? 0),
                0,
              )}{" "}
              lecciones
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/cursos/${course.slug}`}
            target="_blank"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-ink-900/20 px-4 text-sm transition-colors hover:border-ink-900"
          >
            <EyeIcon /> Vista previa
          </Link>
          <button
            type="button"
            onClick={addContent}
            className="min-h-11 cursor-pointer rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream transition-colors hover:bg-ink-700"
          >
            ＋ Añadir contenido
          </button>
        </div>
      </header>

      <nav
        className="mb-6 flex gap-6 overflow-x-auto border-b border-ink-900/15"
        aria-label="Secciones del curso"
      >
        {(
          [
            ["outline", "Temario"],
            ["offers", "Ofertas"],
            ["students", "Clientes"],
            ["certificates", "Certificados"],
            ["settings", "Ajustes"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => changeTab(value)}
            className={`min-h-11 shrink-0 cursor-pointer border-b-2 px-1 text-sm transition-colors ${tab === value ? "border-ink-900 font-semibold text-ink-900" : "border-transparent text-ink-500 hover:text-ink-900"}`}
          >
            {label}
            {value === "students" ? ` (${course.enrolledCount ?? 0})` : ""}
          </button>
        ))}
      </nav>

      {tab === "outline" ? (
        <section className="overflow-hidden rounded-2xl border border-ink-900/12 bg-cream-50 shadow-sm">
          <div className="border-b border-ink-900/10 p-5 md:p-7">
            <label className="relative block">
              <span className="sr-only">Buscar módulo o lección</span>
              <SearchIcon />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar módulo o lección..."
                className="min-h-11 w-full rounded-lg border border-ink-900/20 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-ink-900"
              />
            </label>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-ink-900">
                {filteredModules.length} módulo
                {filteredModules.length === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={toggleAll}
                className="min-h-10 cursor-pointer rounded-full border border-ink-900/20 px-4 text-xs transition-colors hover:border-ink-900"
              >
                {allExpanded ? "Contraer todo" : "Expandir todo"}
              </button>
            </div>
          </div>

          <div className="space-y-3 p-5 md:p-7">
            {modulesLoading ? (
              <p className="py-8 text-center text-sm text-ink-500">
                Cargando temario…
              </p>
            ) : filteredModules.length === 0 ? (
              <EmptyOutline onAdd={addContent} searching={Boolean(search)} />
            ) : (
              filteredModules.map((module) => (
                <ModuleCard
                  key={module._id}
                  courseId={id}
                  module={module}
                  open={expanded.has(module._id) || Boolean(search)}
                  onToggle={() =>
                    setExpanded((current) => {
                      const next = new Set(current);
                      next.has(module._id)
                        ? next.delete(module._id)
                        : next.add(module._id);
                      return next;
                    })
                  }
                  onEdit={() => setModuleDialog(module)}
                  onAddLesson={() => setLessonDialogModule(module._id)}
                  onEditLesson={setSelectedLesson}
                />
              ))
            )}
          </div>
        </section>
      ) : tab === "offers" ? (
        <OffersSection course={course} />
      ) : tab === "students" ? (
        <StudentsSection course={course} />
      ) : tab === "certificates" ? (
        <CertificatesSection course={course} />
      ) : (
        <SettingsSection course={course} courseId={id} />
      )}

      {moduleDialog && (
        <ModuleDialog
          courseId={id}
          module={moduleDialog === "new" ? undefined : moduleDialog}
          onClose={() => setModuleDialog(null)}
          onCreate={(input) =>
            createModule.mutate(input, {
              onSuccess: () => setModuleDialog(null),
            })
          }
        />
      )}
      {lessonDialogModule && (
        <LessonDialog
          courseId={id}
          moduleId={lessonDialogModule}
          onClose={() => setLessonDialogModule(null)}
        />
      )}
    </div>
  );
}

function ModuleCard({
  courseId,
  module,
  open,
  onToggle,
  onEdit,
  onAddLesson,
  onEditLesson,
}: {
  courseId: string;
  module: Module;
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
}) {
  const update = useUpdateModule(courseId);
  const remove = useDeleteModule(courseId);
  const { data: loadedLessons = [], isLoading: lessonsLoading } =
    useModuleLessons(module._id, open);
  const lessons =
    (module.lessons?.length ?? 0) > 0 ? module.lessons! : loadedLessons;
  return (
    <article className="overflow-hidden rounded-xl border border-ink-900/15 bg-white">
      <div className="flex min-h-14 flex-wrap items-center gap-2 px-4 py-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40"
        >
          <DragIcon />
          <FolderIcon />
          <span className="truncate text-sm font-semibold text-ink-900">
            {module.title}
          </span>
          <span className="text-xs text-ink-400">
            {module.lessons?.length ?? module.lessonIds?.length ?? 0}
          </span>
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="icon-button"
          aria-label={`Editar módulo ${module.title}`}
        >
          <EditIcon />
        </button>
        <button
          type="button"
          onClick={onAddLesson}
          className="min-h-10 cursor-pointer rounded-full px-3 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-900/[0.05]"
        >
          ＋ Añadir lección
        </button>
        <button
          type="button"
          onClick={() =>
            update.mutate({
              id: module._id,
              data: { isPublished: !module.isPublished },
            })
          }
          className={`min-h-8 cursor-pointer rounded-full px-3 text-xs ${module.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-ink-900/[0.06] text-ink-600"}`}
        >
          {module.isPublished ? "Publicado" : "Borrador"}
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="icon-button"
          aria-label={open ? "Contraer módulo" : "Expandir módulo"}
        >
          <ChevronIcon open={open} />
        </button>
      </div>
      {open && (
        <div className="border-t border-ink-900/10">
          {lessonsLoading ? (
            <p className="px-5 py-5 text-sm text-ink-500">
              Cargando lecciones…
            </p>
          ) : lessons.length === 0 ? (
            <p className="px-5 py-5 text-sm text-ink-500">
              Este módulo todavía no tiene lecciones.
            </p>
          ) : (
            lessons.map((lesson) => (
              <button
                key={lesson._id || lesson.id}
                type="button"
                onClick={() => onEditLesson(lesson)}
                className="flex min-h-14 w-full cursor-pointer items-center gap-3 border-b border-ink-900/8 px-5 text-left transition-colors last:border-0 hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/40"
              >
                <DocumentIcon />
                <span className="min-w-0 flex-1 truncate text-sm text-ink-900">
                  {lesson.title}
                </span>
                {lesson.mediaType && lesson.mediaType !== "none" && (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400">
                    {lesson.mediaType === "video" ? "Video" : "Audio"}
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${lesson.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-ink-900/[0.06] text-ink-600"}`}
                >
                  {lesson.isPublished ? "Publicado" : "Borrador"}
                </span>
                <ChevronRightIcon />
              </button>
            ))
          )}
          <div className="flex justify-end border-t border-ink-900/8 px-4 py-2">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    `¿Eliminar el módulo “${module.title}” y sus lecciones?`,
                  )
                )
                  remove.mutate(module._id);
              }}
              className="min-h-10 cursor-pointer px-3 text-xs text-red-700 hover:underline"
            >
              Eliminar módulo
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function ModuleDialog({
  courseId,
  module,
  onClose,
  onCreate,
}: {
  courseId: string;
  module?: Module;
  onClose: () => void;
  onCreate: (input: { title: string; description?: string }) => void;
}) {
  const update = useUpdateModule(courseId);
  const [title, setTitle] = useState(module?.title ?? "");
  const [description, setDescription] = useState(module?.description ?? "");
  const save = () => {
    if (!title.trim()) {
      toast.error("Escribe el nombre del módulo");
      return;
    }
    if (module)
      update.mutate(
        {
          id: module._id,
          data: { title: title.trim(), description: description.trim() },
        },
        { onSuccess: onClose },
      );
    else onCreate({ title: title.trim(), description: description.trim() });
  };
  return (
    <Modal title={module ? "Editar módulo" : "Nuevo módulo"} onClose={onClose}>
      <div className="space-y-5">
        <div>
          <label htmlFor="module-title" className="ink-label">
            Título
          </label>
          <input
            id="module-title"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="ink-input bg-white"
          />
        </div>
        <div>
          <label htmlFor="module-description" className="ink-label">
            Descripción
          </label>
          <textarea
            id="module-description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Añade una descripción..."
            className="ink-input resize-none bg-white font-sans"
          />
        </div>
        <ModalActions
          onClose={onClose}
          onSave={save}
          saving={update.isPending}
          label="Guardar módulo"
        />
      </div>
    </Modal>
  );
}

function LessonDialog({
  courseId,
  moduleId,
  onClose,
}: {
  courseId: string;
  moduleId: string;
  onClose: () => void;
}) {
  const add = useAddLesson(courseId);
  const [title, setTitle] = useState("");
  const save = () => {
    if (!title.trim()) {
      toast.error("Escribe el nombre de la lección");
      return;
    }
    add.mutate(
      { moduleId, input: { title: title.trim(), content: "", duration: 0 } },
      { onSuccess: onClose },
    );
  };
  return (
    <Modal title="Nueva lección" onClose={onClose}>
      <div>
        <label htmlFor="lesson-new-title" className="ink-label">
          Título
        </label>
        <input
          id="lesson-new-title"
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="ink-input bg-white"
        />
      </div>
      <div className="mt-6">
        <ModalActions
          onClose={onClose}
          onSave={save}
          saving={add.isPending}
          label="Crear lección"
        />
      </div>
    </Modal>
  );
}

function LessonEditor({
  courseId,
  lesson,
  modules,
  onBack,
}: {
  courseId: string;
  lesson: Lesson;
  modules: Module[];
  onBack: () => void;
}) {
  const update = useUpdateLesson(courseId);
  const remove = useDeleteLesson(courseId);
  const lessonId = String(lesson._id || lesson.id);
  const preferences = loadLessonPreferences(lessonId, lesson);
  const [form, setForm] = useState({
    title: lesson.title,
    content: lesson.content ?? "",
    ...preferences,
  });
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaInfo, setMediaInfo] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const [mediaSource, setMediaSource] = useState<"upload" | "url">(() =>
    localMediaId(preferences.videoUrl)
      ? "upload"
      : preferences.videoUrl
        ? "url"
        : "upload",
  );
  const [uploading, setUploading] = useState(false);
  const [automations, setAutomations] = useState<AutomationRule[]>(() =>
    loadAutomations(lessonId),
  );
  const [showAutomation, setShowAutomation] = useState(false);

  useEffect(() => {
    const id = localMediaId(form.videoUrl);
    if (!id) {
      setMediaPreview(form.videoUrl);
      return;
    }
    let objectUrl = "";
    getMediaFile(id).then((stored) => {
      if (!stored) return;
      objectUrl = URL.createObjectURL(stored.blob);
      setMediaPreview(objectUrl);
      setMediaInfo({ name: stored.name, size: stored.size });
    });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [form.videoUrl]);

  const save = () => {
    const normalizedVideoUrl = normalizePersistedMediaUrl(form.videoUrl);
    saveLessonPreferences(lessonId, {
      thumbnail: form.thumbnail,
      mediaType: form.mediaType,
      videoUrl: normalizedVideoUrl,
      resources: form.resources,
      isPublished: form.isPublished,
      commentsVisibility: form.commentsVisibility,
    });
    update.mutate(
      {
        id: lessonId,
        data: {
          title: form.title,
          content: form.content,
          videoUrl: normalizedVideoUrl,
          mediaType: form.mediaType,
          resources: form.resources,
        },
      },
      { onSuccess: () => onBack() },
    );
  };
  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen debe pesar menos de 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm({ ...form, thumbnail: String(reader.result) });
    reader.readAsDataURL(file);
  };
  const selectMedia = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const expected = form.mediaType === "video" ? "video/" : "audio/";
    if (!file.type.startsWith(expected)) {
      toast.error(
        `Selecciona un archivo de ${form.mediaType === "video" ? "video" : "audio"} válido`,
      );
      event.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const previousId = localMediaId(form.videoUrl);
      const stored = await storeMediaFile(file);
      if (previousId) await removeMediaFile(previousId);
      setForm((current) => ({
        ...current,
        videoUrl: localMediaUrl(stored.id),
      }));
      setMediaInfo({ name: stored.name, size: stored.size });
      toast.success(
        `${form.mediaType === "video" ? "Video" : "Audio"} añadido`,
      );
    } catch {
      toast.error("No se pudo guardar el archivo en este dispositivo");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const clearMedia = async () => {
    const id = localMediaId(form.videoUrl);
    if (id) await removeMediaFile(id);
    setForm((current) => ({ ...current, videoUrl: "" }));
    setMediaInfo(null);
  };
  const addDownloads = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const stored = await Promise.all(files.map(storeMediaFile));
      setForm((current) => ({
        ...current,
        resources: [
          ...current.resources,
          ...stored.map((file) => ({
            name: file.name,
            url: localMediaUrl(file.id),
          })),
        ],
      }));
      toast.success(
        `${stored.length} archivo${stored.length === 1 ? "" : "s"} añadido${stored.length === 1 ? "" : "s"}`,
      );
    } catch {
      toast.error("No se pudieron guardar los descargables");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const removeDownload = async (url: string) => {
    const id = localMediaId(url);
    if (id) await removeMediaFile(id);
    setForm((current) => ({
      ...current,
      resources: current.resources.filter((resource) => resource.url !== url),
    }));
  };
  const downloadResource = async (resource: { name: string; url: string }) => {
    const id = localMediaId(resource.url);
    if (!id) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
      return;
    }
    const stored = await getMediaFile(id);
    if (!stored)
      return toast.error(
        "El archivo ya no está disponible en este dispositivo",
      );
    const url = URL.createObjectURL(stored.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = resource.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addAutomation = (action: AutomationAction, value: string) => {
    const next = [...automations, { id: crypto.randomUUID(), action, value }];
    setAutomations(next);
    saveAutomations(lessonId, next);
    setShowAutomation(false);
    toast.success("Automatización guardada");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 min-h-9 cursor-pointer text-xs text-ink-500 hover:text-ink-900"
          >
            ← Volver al temario
          </button>
          <h1 className="font-serif text-3xl text-ink-900">
            {form.title || "Lección sin título"}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="min-h-11 cursor-pointer rounded-full border border-ink-900/20 px-5 text-sm"
          >
            <EyeIcon /> <span className="ml-1">Vista previa</span>
          </button>
          <button
            type="button"
            onClick={save}
            disabled={update.isPending}
            className="min-h-11 cursor-pointer rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream disabled:opacity-50"
          >
            {update.isPending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-6">
          <section className="editor-card">
            <h2 className="editor-heading">Detalles de la lección</h2>
            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="lesson-title" className="ink-label">
                  Título
                </label>
                <input
                  id="lesson-title"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  className="ink-input bg-white"
                />
              </div>
              <div>
                <label htmlFor="lesson-module" className="ink-label">
                  Módulo
                </label>
                <select
                  id="lesson-module"
                  value=""
                  disabled
                  className="ink-input bg-cream-100 text-ink-500"
                >
                  <option value="">
                    {modules.find((module) =>
                      module.lessons?.some(
                        (item) =>
                          (item._id || item.id) === (lesson._id || lesson.id),
                      ),
                    )?.title ?? "Módulo actual"}
                  </option>
                </select>
                <p className="mt-1 text-xs text-ink-400">
                  Para mover la lección se necesita soporte del backend.
                </p>
              </div>
              <div>
                <p className="ink-label">Medio</p>
                <div className="grid grid-cols-3 gap-3">
                  {(["none", "video", "audio"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={form.mediaType === type}
                      onClick={() => {
                        if (type !== form.mediaType && form.videoUrl)
                          void clearMedia();
                        setForm((current) => ({
                          ...current,
                          mediaType: type,
                          videoUrl:
                            type === form.mediaType ? current.videoUrl : "",
                        }));
                      }}
                      className={`min-h-16 cursor-pointer rounded-xl border text-sm transition-colors ${form.mediaType === type ? "border-ink-900 ring-2 ring-ink-900" : "border-ink-900/15 hover:border-ink-900/50"}`}
                    >
                      {type === "none"
                        ? "Ninguno"
                        : type === "video"
                          ? "Video"
                          : "Audio"}
                    </button>
                  ))}
                </div>
                {form.mediaType !== "none" && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        aria-pressed={mediaSource === "upload"}
                        onClick={() => {
                          setMediaSource("upload");
                          if (!localMediaId(form.videoUrl))
                            setForm((current) => ({
                              ...current,
                              videoUrl: "",
                            }));
                        }}
                        className={`min-h-11 cursor-pointer rounded-xl border text-sm ${mediaSource === "upload" ? "border-ink-900 bg-ink-900 text-cream" : "border-ink-900/15 bg-white"}`}
                      >
                        Subir archivo
                      </button>
                      <button
                        type="button"
                        aria-pressed={mediaSource === "url"}
                        onClick={() => {
                          setMediaSource("url");
                          if (localMediaId(form.videoUrl)) void clearMedia();
                        }}
                        className={`min-h-11 cursor-pointer rounded-xl border text-sm ${mediaSource === "url" ? "border-ink-900 bg-ink-900 text-cream" : "border-ink-900/15 bg-white"}`}
                      >
                        Usar URL
                      </button>
                    </div>
                    <div className="rounded-2xl border border-dashed border-ink-900/20 bg-cream-100 p-5">
                      {mediaSource === "url" && (
                        <div className="mb-4">
                          <label
                            htmlFor="lesson-media-url"
                            className="ink-label"
                          >
                            URL del{" "}
                            {form.mediaType === "video" ? "video" : "audio"}
                          </label>
                          <input
                            id="lesson-media-url"
                            type="url"
                            value={
                              localMediaId(form.videoUrl) ? "" : form.videoUrl
                            }
                            onChange={(event) => {
                              setMediaInfo(null);
                              setForm((current) => ({
                                ...current,
                                videoUrl: normalizePersistedMediaUrl(
                                  event.target.value,
                                ),
                              }));
                            }}
                            placeholder="https://..."
                            className="ink-input bg-white"
                          />
                        </div>
                      )}
                      {mediaPreview ? (
                        <div className="space-y-4">
                          {form.mediaType === "video" ? (
                            isDrivePreviewUrl(mediaPreview) ? (
                              <iframe
                                src={mediaPreview}
                                title={form.title || "Vista previa del video"}
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                                className="aspect-video w-full rounded-xl border-0 bg-black"
                              />
                            ) : (
                              <video
                                src={mediaPreview}
                                controls
                                preload="metadata"
                                className="aspect-video w-full rounded-xl bg-black"
                              />
                            )
                          ) : (
                            <audio
                              src={mediaPreview}
                              controls
                              preload="metadata"
                              className="w-full"
                            />
                          )}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {mediaInfo?.name ?? "Archivo multimedia"}
                              </p>
                              {mediaInfo && (
                                <p className="mt-1 text-xs text-ink-500">
                                  {formatFileSize(mediaInfo.size)}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {mediaSource === "upload" && (
                                <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-ink-900/20 bg-white px-4 text-xs hover:border-ink-900">
                                  <input
                                    type="file"
                                    accept={
                                      form.mediaType === "video"
                                        ? "video/*"
                                        : "audio/*"
                                    }
                                    onChange={selectMedia}
                                    className="sr-only"
                                  />
                                  Reemplazar
                                </label>
                              )}
                              <button
                                type="button"
                                onClick={() => void clearMedia()}
                                className="min-h-11 rounded-full px-4 text-xs text-red-700 hover:bg-red-50"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : mediaSource === "upload" ? (
                        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl text-center focus-within:ring-2 focus-within:ring-ink-900/40">
                          <input
                            type="file"
                            accept={
                              form.mediaType === "video" ? "video/*" : "audio/*"
                            }
                            onChange={selectMedia}
                            disabled={uploading}
                            className="sr-only"
                          />
                          <UploadIcon />
                          <span className="mt-3 text-sm font-semibold">
                            {uploading
                              ? "Guardando archivo…"
                              : `Seleccionar ${form.mediaType === "video" ? "video" : "audio"} desde la computadora`}
                          </span>
                          <span className="mt-1 text-xs text-ink-500">
                            Sin límite artificial de tamaño
                          </span>
                        </label>
                      ) : (
                        <p className="py-8 text-center text-sm text-ink-500">
                          Pega una URL pública para mostrar la vista previa.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="lesson-content" className="ink-label">
                  Contenido
                </label>
                <textarea
                  id="lesson-content"
                  rows={14}
                  value={form.content}
                  onChange={(event) =>
                    setForm({ ...form, content: event.target.value })
                  }
                  placeholder="Escribe el contenido de la lección..."
                  className="ink-input resize-y bg-white font-sans leading-7"
                />
              </div>
              <div className="border-t border-ink-900/10 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl text-ink-900">
                      Descargables
                    </h3>
                    <p className="mt-1 text-xs text-ink-500">
                      PDF, documentos, hojas de cálculo, imágenes, ZIP y otros
                      archivos.
                    </p>
                  </div>
                  <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-ink-900/20 px-4 text-sm hover:border-ink-900">
                    <input
                      type="file"
                      multiple
                      onChange={addDownloads}
                      disabled={uploading}
                      className="sr-only"
                    />
                    ＋ Añadir archivos
                  </label>
                </div>
                {form.resources.length > 0 && (
                  <div className="mt-4 divide-y divide-ink-900/10 rounded-xl border border-ink-900/10">
                    {form.resources.map((resource) => (
                      <div
                        key={resource.url}
                        className="flex min-h-16 items-center gap-3 px-4"
                      >
                        <DownloadIcon />
                        <button
                          type="button"
                          onClick={() => void downloadResource(resource)}
                          className="min-w-0 flex-1 truncate text-left text-sm font-medium hover:underline"
                        >
                          {resource.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeDownload(resource.url)}
                          aria-label={`Eliminar ${resource.name}`}
                          className="icon-button text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
          <section className="editor-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="editor-heading">Automatizaciones</h2>
                <p className="mt-2 text-sm leading-6 text-ink-500">
                  Define qué debe ocurrir cuando un estudiante complete esta
                  lección.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAutomation(true)}
                className="min-h-11 shrink-0 cursor-pointer rounded-full border border-ink-900/20 px-4 text-sm hover:border-ink-900"
              >
                ＋ Añadir
              </button>
            </div>
            {automations.length > 0 && (
              <div className="mt-5 space-y-3">
                {automations.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center gap-3 rounded-xl bg-cream-100 p-4"
                  >
                    <BoltIcon />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-ink-500">
                        Cuando se completa la lección
                      </p>
                      <p className="truncate text-sm font-medium text-ink-900">
                        {ACTION_LABELS[rule.action]}
                        {rule.value ? `: ${rule.value}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = automations.filter(
                          (item) => item.id !== rule.id,
                        );
                        setAutomations(next);
                        saveAutomations(lessonId, next);
                      }}
                      aria-label="Eliminar automatización"
                      className="icon-button text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        <aside className="space-y-5">
          <section className="editor-card">
            <h2 className="editor-heading">Estado</h2>
            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                checked={!form.isPublished}
                onChange={() => setForm({ ...form, isPublished: false })}
                className="accent-ink-900"
              />{" "}
              Borrador
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                checked={form.isPublished}
                onChange={() => setForm({ ...form, isPublished: true })}
                className="accent-ink-900"
              />{" "}
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">
                Publicado
              </span>
            </label>
          </section>
          <section className="editor-card">
            <h2 className="editor-heading">Portada de la lección</h2>
            <div className="mt-5 flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-ink-900/15 bg-cream-100 text-ink-300">
              {form.thumbnail ? (
                <img
                  src={form.thumbnail}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon large />
              )}
            </div>
            <p className="mt-3 text-xs leading-5 text-ink-500">
              Recomendado: 1280 × 720 px.
            </p>
            <label className="mt-3 inline-flex min-h-10 cursor-pointer items-center rounded-full border border-ink-900/20 px-4 text-xs hover:border-ink-900">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={selectImage}
                className="sr-only"
              />
              Seleccionar imagen
            </label>
          </section>
          <section className="editor-card">
            <h2 className="editor-heading">Comentarios</h2>
            <div className="mt-5 space-y-3">
              {(
                [
                  ["visible", "Visibles"],
                  ["hidden", "Ocultos"],
                  ["locked", "Bloqueados"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="radio"
                    checked={form.commentsVisibility === value}
                    onChange={() =>
                      setForm({ ...form, commentsVisibility: value })
                    }
                    className="accent-ink-900"
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`¿Eliminar la lección “${lesson.title}”?`))
                remove.mutate(lessonId, { onSuccess: onBack });
            }}
            className="min-h-11 cursor-pointer px-3 text-sm text-red-700 hover:underline"
          >
            Eliminar lección
          </button>
        </aside>
      </div>
      {showAutomation && (
        <AutomationDialog
          lessonTitle={form.title}
          onClose={() => setShowAutomation(false)}
          onSave={addAutomation}
        />
      )}
    </div>
  );
}

function AutomationDialog({
  lessonTitle,
  onClose,
  onSave,
}: {
  lessonTitle: string;
  onClose: () => void;
  onSave: (action: AutomationAction, value: string) => void;
}) {
  const [action, setAction] = useState<AutomationAction>("add_tag");
  const [value, setValue] = useState("");
  return (
    <Modal title="Nueva automatización" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <p className="ink-label">Cuando</p>
          <div className="rounded-lg bg-cream-100 p-3 text-sm text-ink-700">
            Se completa la lección “{lessonTitle}”
          </div>
        </div>
        <div>
          <label htmlFor="automation-action" className="ink-label">
            Entonces
          </label>
          <select
            id="automation-action"
            value={action}
            onChange={(event) =>
              setAction(event.target.value as AutomationAction)
            }
            className="ink-input cursor-pointer bg-white"
          >
            <optgroup label="Oferta">
              <option value="grant_offer">Otorgar una oferta</option>
            </optgroup>
            <optgroup label="Etiquetas">
              <option value="add_tag">Añadir una etiqueta</option>
              <option value="remove_tag">Eliminar una etiqueta</option>
            </optgroup>
            <optgroup label="Comunicación">
              <option value="send_email">Enviar un correo</option>
            </optgroup>
            <optgroup label="Eventos">
              <option value="enroll_event">Registrar en un evento</option>
            </optgroup>
            <optgroup label="Certificados">
              <option value="send_certificate">Enviar un certificado</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label htmlFor="automation-value" className="ink-label">
            Detalle
          </label>
          <input
            id="automation-value"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Etiqueta, oferta, asunto o evento..."
            className="ink-input bg-white"
          />
        </div>
        <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          La regla se guardará en la interfaz. Su ejecución requiere que el
          backend procese el evento de lección completada.
        </p>
        <ModalActions
          onClose={onClose}
          onSave={() => onSave(action, value.trim())}
          label="Guardar automatización"
        />
      </div>
    </Modal>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink-900/45 p-5"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-lg rounded-2xl bg-cream-50 p-6 shadow-2xl md:p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="icon-button text-xl"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function ModalActions({
  onClose,
  onSave,
  saving = false,
  label,
}: {
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  label: string;
}) {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="min-h-11 cursor-pointer rounded-full border border-ink-900/20 px-5 text-sm"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="min-h-11 cursor-pointer rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream disabled:opacity-50"
      >
        {saving ? "Guardando…" : label}
      </button>
    </div>
  );
}
type OfferTab = "details" | "pricing" | "purchase" | "settings";
type CheckoutBuilderPanel =
  | "sections"
  | "settings"
  | "header"
  | "checkout"
  | "footer"
  | "popup"
  | "optin";
type CheckoutBlockType = "image" | "title" | "description" | "checkout";
type OfferConfig = {
  id: string;
  title: string;
  internalTitle: string;
  description: string;
  status: "draft" | "published";
  access: "full" | "limited";
  paymentType: "free" | "one_time";
  price: number;
  currency: string;
  provider: "stripe" | "none";
  customPriceText: string;
  thumbnail: string;
  startDateEnabled: boolean;
  startDate: string;
  restrictDaysEnabled: boolean;
  accessDays: number;
  quantityLimit: boolean;
  quantity: number;
  timeLimit: boolean;
  endDate: string;
  postPurchase: "library" | "course";
  skipAccountCreation: boolean;
  emailType: "default" | "custom" | "none";
  customEmailSubject: string;
  customEmailContent: string;
  upsell: string;
  orderBumpEnabled: boolean;
  orderBumpTitle: string;
  orderBumpPrice: number;
  serviceAgreement: "not_required" | "default" | "custom";
  serviceAgreementText: string;
  requirePasswordAtCheckout: boolean;
  giftEnabled: boolean;
  thirdPartyEmailEnabled: boolean;
  purchaseNotificationEnabled: boolean;
  abandonmentEmailEnabled: boolean;
  affiliateCommissionEnabled: boolean;
  affiliateCommissionType: "percentage" | "fixed";
  affiliateCommissionValue: number;
  buttonColor: string;
  customButtonText: boolean;
  buttonText: string;
  checkoutName: boolean;
  checkoutPhone: boolean;
  checkoutAddress: boolean;
  checkoutTaxId: boolean;
  checkoutBackground: string;
  checkoutPageWidth: "normal" | "wide";
  headerCartEnabled: boolean;
  headerDesktopFontSize: string;
  headerMobileFontSize: string;
  headerTextColor: string;
  headerBackgroundColor: string;
  headerPosition: "normal" | "overlay";
  headerSticky: boolean;
  headerHiddenDesktop: boolean;
  headerHiddenMobile: boolean;
  headerBlocks: string[];
  checkoutBlocks: CheckoutBlockType[];
  checkoutSubscribe: boolean;
  footerText: string;
  popupEnabled: boolean;
  optinEnabled: boolean;
};

function createOffer(course: Course, limited = false): OfferConfig {
  const paid = !limited && Number(course.price) > 0;
  return {
    id: crypto.randomUUID(),
    title: `${course.title}${limited ? " — acceso limitado" : ""}`,
    internalTitle: "",
    description: course.description ?? "",
    status: "published",
    access: limited ? "limited" : "full",
    paymentType: paid ? "one_time" : "free",
    price: limited ? 0 : Number(course.price) || 0,
    currency: course.currency || "MXN",
    provider: paid ? "stripe" : "none",
    customPriceText: "",
    thumbnail: course.thumbnail ?? "",
    startDateEnabled: false,
    startDate: "",
    restrictDaysEnabled: limited,
    accessDays: limited ? 7 : 30,
    quantityLimit: false,
    quantity: 100,
    timeLimit: false,
    endDate: "",
    postPurchase: "library",
    skipAccountCreation: false,
    emailType: "default",
    customEmailSubject: "",
    customEmailContent: "",
    upsell: "",
    orderBumpEnabled: false,
    orderBumpTitle: "",
    orderBumpPrice: 0,
    serviceAgreement: "not_required",
    serviceAgreementText: "",
    requirePasswordAtCheckout: false,
    giftEnabled: false,
    thirdPartyEmailEnabled: false,
    purchaseNotificationEnabled: false,
    abandonmentEmailEnabled: false,
    affiliateCommissionEnabled: false,
    affiliateCommissionType: "percentage",
    affiliateCommissionValue: 10,
    buttonColor: "#181714",
    customButtonText: false,
    buttonText: "Comprar ahora",
    checkoutName: false,
    checkoutPhone: false,
    checkoutAddress: false,
    checkoutTaxId: false,
    checkoutBackground: "#ffffff",
    checkoutPageWidth: "normal",
    headerCartEnabled: false,
    headerDesktopFontSize: "18",
    headerMobileFontSize: "16",
    headerTextColor: "#111827",
    headerBackgroundColor: "#ffffff",
    headerPosition: "normal",
    headerSticky: false,
    headerHiddenDesktop: false,
    headerHiddenMobile: false,
    headerBlocks: ["Logo", "Menú", "Menú", "Menú de usuario"],
    checkoutBlocks: ["image", "title", "checkout"],
    checkoutSubscribe: true,
    footerText: "© DD Academia. Todos los derechos reservados.",
    popupEnabled: false,
    optinEnabled: false,
  };
}

function normalizeOffer(course: Course, offer: OfferConfig): OfferConfig {
  return {
    ...createOffer(course, offer.access === "limited"),
    ...offer,
    skipAccountCreation: offer.skipAccountCreation ?? false,
    customEmailSubject: offer.customEmailSubject ?? "",
    customEmailContent: offer.customEmailContent ?? "",
    customPriceText: offer.customPriceText ?? "",
    orderBumpEnabled: offer.orderBumpEnabled ?? false,
    orderBumpTitle: offer.orderBumpTitle ?? "",
    orderBumpPrice: offer.orderBumpPrice ?? 0,
    serviceAgreement: offer.serviceAgreement ?? "not_required",
    serviceAgreementText: offer.serviceAgreementText ?? "",
    requirePasswordAtCheckout: offer.requirePasswordAtCheckout ?? false,
    giftEnabled: offer.giftEnabled ?? false,
    thirdPartyEmailEnabled: offer.thirdPartyEmailEnabled ?? false,
    purchaseNotificationEnabled: offer.purchaseNotificationEnabled ?? false,
    abandonmentEmailEnabled: offer.abandonmentEmailEnabled ?? false,
    affiliateCommissionEnabled: offer.affiliateCommissionEnabled ?? false,
    affiliateCommissionType: offer.affiliateCommissionType ?? "percentage",
    affiliateCommissionValue: offer.affiliateCommissionValue ?? 10,
    checkoutBackground: offer.checkoutBackground ?? "#ffffff",
    checkoutPageWidth: offer.checkoutPageWidth ?? "normal",
    headerCartEnabled: offer.headerCartEnabled ?? false,
    headerDesktopFontSize: offer.headerDesktopFontSize ?? "18",
    headerMobileFontSize: offer.headerMobileFontSize ?? "16",
    headerTextColor: offer.headerTextColor ?? "#111827",
    headerBackgroundColor: offer.headerBackgroundColor ?? "#ffffff",
    headerPosition: offer.headerPosition ?? "normal",
    headerSticky: offer.headerSticky ?? false,
    headerHiddenDesktop: offer.headerHiddenDesktop ?? false,
    headerHiddenMobile: offer.headerHiddenMobile ?? false,
    headerBlocks: offer.headerBlocks ?? [
      "Logo",
      "Menú",
      "Menú",
      "Menú de usuario",
    ],
    checkoutBlocks: offer.checkoutBlocks ?? ["image", "title", "checkout"],
    checkoutSubscribe: offer.checkoutSubscribe ?? true,
    footerText:
      offer.footerText ?? "© DD Academia. Todos los derechos reservados.",
    popupEnabled: offer.popupEnabled ?? false,
    optinEnabled: offer.optinEnabled ?? false,
  };
}

const SAMPLE_UPSELLS = [
  "MASTERCLASS: EL ARTE DE VENDER Upsell",
  "Sesión privada de estrategia",
  "Acceso completo al curso",
  "Paquete de plantillas fiscales",
];

function OffersSection({ course }: { course: Course }) {
  const storageKey = `dd-course-offers-${course._id || course.id}`;
  const [offers, setOffers] = useState<OfferConfig[]>(() => {
    const saved = loadJson<OfferConfig[]>(storageKey, []);
    if (saved.length)
      return saved.map((offer) => normalizeOffer(course, offer));
    const initial = [createOffer(course)];
    if (
      localStorage.getItem(
        `dd-course-limited-offer-${course._id || course.id}`,
      ) === "true"
    )
      initial.push(createOffer(course, true));
    return initial;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const selected = offers.find((offer) => offer.id === selectedId);
  const saveOffers = (next: OfferConfig[]) => {
    setOffers(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  if (selected)
    return (
      <OfferEditor
        course={course}
        offer={selected}
        onBack={() => setSelectedId(null)}
        onSave={(offer) => {
          saveOffers(
            offers.map((item) => (item.id === offer.id ? offer : item)),
          );
          toast.success("Oferta guardada");
        }}
      />
    );
  const addOffer = () => {
    const next = createOffer(course, true);
    saveOffers([...offers, next]);
    setSelectedId(next.id);
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-ink-900">Ofertas</h2>
          <p className="mt-2 text-sm text-ink-500">
            Edita el precio, acceso, compra y checkout de cada oferta.
          </p>
        </div>
        <button
          type="button"
          onClick={addOffer}
          className="min-h-11 rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream"
        >
          ＋ Agregar oferta
        </button>
      </div>
      <div className="overflow-visible rounded-2xl border border-ink-900/10 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.4fr_0.7fr_0.7fr_44px] gap-4 border-b border-ink-900/10 bg-cream-100 px-5 py-4 text-xs text-ink-500 sm:grid">
          <span>Oferta</span>
          <span>Precio</span>
          <span>Acceso</span>
          <span />
        </div>
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="relative grid gap-3 border-b border-ink-900/10 px-5 py-5 text-sm last:border-0 sm:grid-cols-[1.4fr_0.7fr_0.7fr_44px] sm:items-center"
          >
            <button
              type="button"
              onClick={() => setSelectedId(offer.id)}
              className="flex min-h-11 items-center gap-3 text-left font-semibold hover:underline"
            >
              <span className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream-200 text-ink-300">
                {offer.thumbnail ? (
                  <img
                    src={offer.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon />
                )}
              </span>
              {offer.title}
            </button>
            <span>
              {offer.paymentType === "free"
                ? "Gratis"
                : `$${offer.price.toLocaleString("es-MX")} ${offer.currency}`}
            </span>
            <span>
              {offer.access === "limited"
                ? "Acceso limitado"
                : "Acceso completo"}
            </span>
            <button
              type="button"
              aria-label={`Acciones de ${offer.title}`}
              aria-expanded={openMenu === offer.id}
              onClick={() =>
                setOpenMenu(openMenu === offer.id ? null : offer.id)
              }
              className="icon-button text-xl"
            >
              •••
            </button>
            {openMenu === offer.id && (
              <div className="absolute right-5 top-16 z-20 w-40 rounded-xl border border-ink-900/10 bg-white p-2 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(offer.id);
                    setOpenMenu(null);
                  }}
                  className="min-h-10 w-full rounded-lg px-3 text-left text-sm hover:bg-cream-100"
                >
                  Editar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-500">
        Mostrando {offers.length} oferta{offers.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function OfferEditor({
  course,
  offer,
  onBack,
  onSave,
}: {
  course: Course;
  offer: OfferConfig;
  onBack: () => void;
  onSave: (offer: OfferConfig) => void;
}) {
  const [form, setForm] = useState(offer);
  const [tab, setTab] = useState<OfferTab>("details");
  const [editingCheckout, setEditingCheckout] = useState(false);
  const patch = (values: Partial<OfferConfig>) =>
    setForm((current) => ({ ...current, ...values }));
  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024)
      return toast.error("La imagen debe pesar menos de 2 MB");
    const reader = new FileReader();
    reader.onload = () => patch({ thumbnail: String(reader.result) });
    reader.readAsDataURL(file);
  };
  const tabs: Array<[OfferTab, string]> = [
    ["details", "Detalles"],
    ["pricing", "Precios"],
    ["purchase", "Flujo de compra"],
    ["settings", "Ajustes"],
  ];
  if (editingCheckout) {
    return (
      <CheckoutBuilder
        offer={form}
        onBack={() => setEditingCheckout(false)}
        onChange={patch}
      />
    );
  }
  return (
    <div className="space-y-6">
      <header>
        <button
          type="button"
          onClick={onBack}
          className="mb-3 min-h-9 text-xs text-ink-500 hover:text-ink-900"
        >
          ← Volver a ofertas
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-3xl text-ink-900">{form.title}</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Más opciones de la oferta"
              className="icon-button text-lg"
            >
              •••
            </button>
            <button
              type="button"
              onClick={() => setEditingCheckout(true)}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-ink-900/20 px-4 text-sm transition-colors hover:border-ink-900"
            >
              <PaletteIcon /> Editar checkout
            </button>
            <button
              type="button"
              onClick={() => onSave(form)}
              className="min-h-11 rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream"
            >
              Guardar
            </button>
          </div>
        </div>
        <nav
          className="mt-5 flex gap-6 overflow-x-auto border-b border-ink-900/10"
          aria-label="Secciones de la oferta"
        >
          {tabs.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`min-h-11 shrink-0 border-b-2 text-sm ${tab === value ? "border-ink-900 font-semibold" : "border-transparent text-ink-500 hover:text-ink-900"}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      {tab === "details" && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="space-y-6">
            <OfferCard title="Detalles de la oferta">
              <OfferInput
                label="Título"
                value={form.title}
                onChange={(title) => patch({ title })}
              />
              <OfferInput
                label="Título interno (opcional)"
                value={form.internalTitle}
                onChange={(internalTitle) => patch({ internalTitle })}
              />
              <div>
                <label htmlFor="offer-description" className="ink-label">
                  Descripción
                </label>
                <textarea
                  id="offer-description"
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    patch({ description: event.target.value })
                  }
                  className="ink-input resize-y bg-white"
                />
              </div>
            </OfferCard>
            <OfferCard title="Producto incluido">
              <div className="flex items-center gap-4 rounded-xl border border-ink-900/15 p-4">
                <span className="flex h-14 w-20 items-center justify-center overflow-hidden rounded-lg bg-cream-200">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon />
                  )}
                </span>
                <strong>{course.title}</strong>
              </div>
              <div className="border-t border-ink-900/10 pt-5">
                <p className="mb-4 font-semibold">Acceso al producto</p>
                <CheckField
                  checked={form.startDateEnabled}
                  onChange={(startDateEnabled) => patch({ startDateEnabled })}
                  label="Comenzar el acceso en una fecha específica"
                />
                {form.startDateEnabled && (
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(event) =>
                      patch({ startDate: event.target.value })
                    }
                    className="ink-input mt-3 bg-white"
                  />
                )}
                <div className="mt-4">
                  <CheckField
                    checked={form.restrictDaysEnabled}
                    onChange={(restrictDaysEnabled) =>
                      patch({ restrictDaysEnabled })
                    }
                    label="Limitar el acceso a una cantidad de días"
                  />
                </div>
                {form.restrictDaysEnabled && (
                  <input
                    type="number"
                    min="1"
                    value={form.accessDays}
                    onChange={(event) =>
                      patch({ accessDays: Number(event.target.value) })
                    }
                    className="ink-input mt-3 bg-white"
                  />
                )}
              </div>
            </OfferCard>
          </div>
          <aside className="space-y-6">
            <OfferCard title="Estado de la oferta">
              <RadioField
                checked={form.status === "draft"}
                onChange={() => patch({ status: "draft" })}
                label="Borrador"
              />
              <RadioField
                checked={form.status === "published"}
                onChange={() => patch({ status: "published" })}
                label="Publicada"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `${window.location.origin}/oferta/${form.id}`,
                  );
                  toast.success("Enlace copiado");
                }}
                className="mt-3 text-sm underline"
              >
                Obtener enlace
              </button>
            </OfferCard>
            <OfferCard title="Precio de la oferta">
              <p className="font-serif text-2xl">
                {form.paymentType === "free"
                  ? "Gratis"
                  : `$${form.price.toLocaleString("es-MX")} ${form.currency}`}
              </p>
              <div className="mt-5 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-cream-200 text-ink-300">
                {form.thumbnail ? (
                  <img
                    src={form.thumbnail}
                    alt="Vista previa de la oferta"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon large />
                )}
              </div>
              <label className="mt-4 inline-flex min-h-10 cursor-pointer items-center rounded-full border border-ink-900/20 px-4 text-xs">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={selectImage}
                  className="sr-only"
                />
                Seleccionar imagen
              </label>
            </OfferCard>
          </aside>
        </div>
      )}
      {tab === "pricing" && (
        <div className="space-y-6">
          <SettingsRow
            title="Detalles del precio"
            description="Define el precio y la estructura de pago de esta oferta."
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="payment-type" className="ink-label">
                  Tipo de pago
                </label>
                <select
                  id="payment-type"
                  value={form.paymentType}
                  onChange={(event) =>
                    patch({
                      paymentType: event.target
                        .value as OfferConfig["paymentType"],
                    })
                  }
                  className="ink-input bg-white"
                >
                  <option value="free">Gratis</option>
                  <option value="one_time">Pago único</option>
                </select>
              </div>
              {form.paymentType === "one_time" && (
                <div className="grid grid-cols-[1fr_120px] gap-3">
                  <OfferInput
                    label="Precio"
                    type="number"
                    value={String(form.price)}
                    onChange={(price) => patch({ price: Number(price) })}
                  />
                  <OfferInput
                    label="Moneda"
                    value={form.currency}
                    onChange={(currency) =>
                      patch({ currency: currency.toUpperCase() })
                    }
                  />
                </div>
              )}
              <div className="border-t border-ink-900/10 pt-5">
                <p className="mb-3 font-semibold">Proveedor de pago</p>
                <RadioField
                  checked={form.provider === "stripe"}
                  onChange={() => patch({ provider: "stripe" })}
                  label="Stripe"
                />
                <RadioField
                  checked={form.provider === "none"}
                  onChange={() => patch({ provider: "none" })}
                  label="Ninguno"
                />
              </div>
            </div>
          </SettingsRow>
          <SettingsRow
            title="Disponibilidad"
            description="Limita la cantidad o el tiempo durante el cual puede comprarse."
          >
            <div className="space-y-5">
              <Toggle
                checked={form.quantityLimit}
                onChange={(quantityLimit) => patch({ quantityLimit })}
                label="Limitar la cantidad disponible"
              />
              {form.quantityLimit && (
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(event) =>
                    patch({ quantity: Number(event.target.value) })
                  }
                  className="ink-input bg-white"
                />
              )}
              <Toggle
                checked={form.timeLimit}
                onChange={(timeLimit) => patch({ timeLimit })}
                label="Establecer una fecha límite"
              />
              {form.timeLimit && (
                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(event) => patch({ endDate: event.target.value })}
                  className="ink-input bg-white"
                />
              )}
            </div>
          </SettingsRow>
        </div>
      )}
      {tab === "purchase" && (
        <div className="space-y-6">
          <SettingsRow
            title="Después de la compra"
            description="Elige la página y el correo que recibe el cliente."
          >
            <div className="rounded-2xl border border-ink-900/15 p-6">
              <h3 className="font-serif text-2xl text-ink-900">
                Después de la compra
              </h3>
              <p className="mt-1 text-sm text-ink-500">
                Decide a dónde enviar a tus miembros después de comprar esta
                oferta.
              </p>
              <div className="mt-5">
                <label htmlFor="post-purchase" className="ink-label">
                  Página posterior a la compra
                </label>
                <select
                  id="post-purchase"
                  value={form.postPurchase}
                  onChange={(event) =>
                    patch({
                      postPurchase: event.target
                        .value as OfferConfig["postPurchase"],
                    })
                  }
                  className="ink-input bg-white"
                >
                  <option value="library">
                    Biblioteca de productos del miembro
                  </option>
                  <option value="course">Página del curso</option>
                </select>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink-700">
                    Saltar creación de cuenta
                  </p>
                  <p className="text-xs text-ink-500">
                    Cuando esté activo, los clientes nuevos evitan la pantalla
                    de creación de cuenta.
                  </p>
                </div>
                <ToggleSwitch
                  checked={form.skipAccountCreation}
                  onChange={(skipAccountCreation) =>
                    patch({ skipAccountCreation })
                  }
                  label="Saltar creación de cuenta"
                />
              </div>
              <div className="my-7 border-t border-ink-900/10" />
              <div>
                <h4 className="font-serif text-xl text-ink-900">
                  Correo posterior a la compra
                </h4>
                <p className="text-sm text-ink-500">
                  Elige qué comunicación reciben quienes compran esta oferta.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      ["default", "Correo predeterminado", "mail"],
                      ["custom", "Correo personalizado", "palette"],
                      ["none", "Ninguno", "ban"],
                    ] as const
                  ).map(([value, label, icon]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => patch({ emailType: value })}
                      className={`flex min-h-16 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm transition-colors hover:border-ink-900 ${form.emailType === value ? "border-ink-900 ring-2 ring-ink-900" : "border-ink-900/15"}`}
                    >
                      <SmallOptionIcon type={icon} /> {label}
                    </button>
                  ))}
                </div>
                {form.emailType === "custom" && (
                  <div className="mt-6 space-y-4">
                    <OfferInput
                      label="Asunto del correo"
                      value={form.customEmailSubject}
                      onChange={(customEmailSubject) =>
                        patch({ customEmailSubject })
                      }
                    />
                    <div>
                      <label
                        htmlFor="custom-email-content"
                        className="ink-label"
                      >
                        Contenido del correo
                      </label>
                      <div className="overflow-hidden rounded-xl border border-ink-900/15 bg-white">
                        <div className="border-b border-ink-900/10 bg-cream-100 px-4 py-2 font-mono text-xs text-ink-500">
                          1
                        </div>
                        <textarea
                          id="custom-email-content"
                          value={form.customEmailContent}
                          onChange={(event) =>
                            patch({ customEmailContent: event.target.value })
                          }
                          rows={10}
                          className="w-full resize-y bg-white p-4 font-mono text-sm outline-none"
                          placeholder="Escribe aquí el correo que recibirá tu cliente..."
                        />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-ink-500">
                        Para insertar datos dinámicos usa{" "}
                        {"{{object.property}}"}. Ejemplos: {"{{member.name}}"},{" "}
                        {"{{offer}}"}, {"{{site}}"} y {"{{site_login_url}}"}.
                      </p>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() =>
                    toast(
                      "Las plantillas globales de correo se conectarán cuando exista backend de emails.",
                    )
                  }
                  className="mt-5 min-h-10 cursor-pointer text-sm underline"
                >
                  Administrar plantillas de correo predeterminadas
                </button>
              </div>
            </div>
          </SettingsRow>
          <SettingsRow
            title="Venta adicional"
            description="Presenta una oferta complementaria después del checkout."
          >
            <div>
              <UpsellPicker
                value={form.upsell}
                onChange={(upsell) => patch({ upsell })}
              />
              <p className="mt-2 text-xs text-ink-500">
                Presenta un complemento opcional inmediatamente después del
                checkout.
              </p>
              <button
                type="button"
                onClick={() => toast("Aquí se podrá crear un nuevo upsell.")}
                className="mt-4 min-h-10 cursor-pointer rounded-full border border-ink-900/20 px-4 text-sm transition-colors hover:border-ink-900"
              >
                + Crear nuevo upsell
              </button>
            </div>
          </SettingsRow>
          <SettingsRow
            title="Automatizaciones"
            description="Prepara acciones que se dispararán cuando se complete la compra."
          >
            <div className="rounded-2xl border border-ink-900/15 p-6">
              <h3 className="font-serif text-xl text-ink-900">
                Automatizaciones
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-500">
                Automatiza tareas repetitivas para esta oferta, como etiquetas,
                correos, certificados o acceso a eventos.
              </p>
              <button
                type="button"
                onClick={() =>
                  toast(
                    "Las automatizaciones de ofertas se conectarán con el backend de compras.",
                  )
                }
                className="mt-5 min-h-11 cursor-pointer rounded-full border border-ink-900/20 px-4 text-sm transition-colors hover:border-ink-900"
              >
                + Añadir automatización
              </button>
            </div>
          </SettingsRow>
        </div>
      )}
      {tab === "settings" && (
        <div className="space-y-6">
          <SettingsRow
            title="Personaliza tu checkout"
            description="Estos ajustes se comparten en el checkout, popup y facturación de esta oferta."
          >
            <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
              <div className="space-y-5">
                <div>
                  <label htmlFor="button-color" className="ink-label">
                    Fondo sólido del botón
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      id="button-color"
                      value={
                        isHexColor(form.buttonColor)
                          ? form.buttonColor
                          : "#181714"
                      }
                      onChange={(event) =>
                        patch({ buttonColor: event.target.value })
                      }
                      className="h-11 w-14 rounded-lg border"
                    />
                    <input
                      value={form.buttonColor}
                      onChange={(event) =>
                        patch({ buttonColor: event.target.value })
                      }
                      className="ink-input bg-white"
                    />
                  </div>
                </div>
                <Toggle
                  checked={form.customButtonText}
                  onChange={(customButtonText) => patch({ customButtonText })}
                  label="Texto personalizado del botón de checkout (opcional)"
                />
                {form.customButtonText && (
                  <OfferInput
                    label="Texto del botón"
                    value={form.buttonText}
                    onChange={(buttonText) => patch({ buttonText })}
                  />
                )}
                <OfferInput
                  label="Texto personalizado de precio (opcional)"
                  value={form.customPriceText}
                  onChange={(customPriceText) => patch({ customPriceText })}
                />
                <div className="border-t border-ink-900/10 pt-5">
                  <p className="mb-2 font-semibold">Campos del checkout</p>
                  <p className="mb-4 text-xs text-ink-500">
                    Recopila información adicional de tus clientes en el pago.
                  </p>
                  <div className="space-y-3">
                    <CheckField
                      checked={form.checkoutName}
                      onChange={(checkoutName) => patch({ checkoutName })}
                      label="Nombre"
                    />
                    <CheckField
                      checked={form.checkoutPhone}
                      onChange={(checkoutPhone) => patch({ checkoutPhone })}
                      label="Teléfono"
                    />
                    <CheckField
                      checked={form.checkoutAddress}
                      onChange={(checkoutAddress) => patch({ checkoutAddress })}
                      label="Dirección"
                    />
                    <CheckField
                      checked={form.checkoutTaxId}
                      onChange={(checkoutTaxId) => patch({ checkoutTaxId })}
                      label="RFC / identificación fiscal"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      toast("Aquí se podrán crear campos personalizados.")
                    }
                    className="mt-5 min-h-10 cursor-pointer rounded-full border border-ink-900/20 px-4 text-sm transition-colors hover:border-ink-900"
                  >
                    + Agregar campo personalizado
                  </button>
                </div>
              </div>
              <CheckoutMiniPreview offer={form} />
            </div>
          </SettingsRow>

          <SettingsRow
            title="Plantilla de checkout"
            description="Personaliza tu plantilla activa o instala nuevas plantillas más adelante."
          >
            <div className="rounded-2xl bg-cream-100 p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-ink-900">
                    Plantilla activa
                  </h3>
                  <p className="mt-1 text-sm text-ink-500">
                    Simple checkout{" "}
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      Activa
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCheckout(true)}
                  className="min-h-10 cursor-pointer rounded-full bg-ink-900 px-4 text-sm font-semibold text-cream"
                >
                  Personalizar
                </button>
              </div>
              <div className="grid gap-4 rounded-xl bg-white p-5 md:grid-cols-[160px_1fr_auto] md:items-center">
                <div className="rounded-lg border border-ink-900/15 bg-cream-50 p-3">
                  <CheckoutTinyPreview offer={form} />
                </div>
                <div>
                  <p className="font-semibold text-ink-900">Simple checkout</p>
                  <p className="text-xs text-ink-500">
                    Agregado hace poco · Encore 2.14.8
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Opciones de la plantilla"
                  className="icon-button text-lg"
                >
                  •••
                </button>
              </div>
              <div className="mt-5 border-t border-ink-900/10 pt-5">
                <p className="font-semibold text-ink-900">Biblioteca</p>
                <p className="mt-1 text-sm text-ink-500">
                  Estas plantillas solo son visibles para ti. Podrás activar
                  otra cuando agreguemos más diseños.
                </p>
                <div className="mt-5 rounded-xl bg-white/70 p-8 text-center text-sm text-ink-500">
                  Agrega una nueva plantilla para probar, personalizar o testear
                  cambios.
                </div>
              </div>
            </div>
          </SettingsRow>

          <SettingsRow
            title="Order bump"
            description="Presenta un producto o servicio extra para añadirlo en el checkout."
          >
            <div className="space-y-4">
              <button
                type="button"
                onClick={() =>
                  patch({
                    orderBumpEnabled: true,
                    orderBumpTitle: form.orderBumpTitle || "Oferta adicional",
                  })
                }
                className="min-h-10 cursor-pointer rounded-full border border-ink-900/20 px-4 text-sm transition-colors hover:border-ink-900"
              >
                + Agregar order bump
              </button>
              {form.orderBumpEnabled && (
                <div className="grid gap-3 md:grid-cols-[1fr_140px_auto] md:items-end">
                  <OfferInput
                    label="Título del order bump"
                    value={form.orderBumpTitle}
                    onChange={(orderBumpTitle) => patch({ orderBumpTitle })}
                  />
                  <OfferInput
                    label="Precio"
                    type="number"
                    value={String(form.orderBumpPrice)}
                    onChange={(orderBumpPrice) =>
                      patch({ orderBumpPrice: Number(orderBumpPrice) })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => patch({ orderBumpEnabled: false })}
                    className="min-h-11 cursor-pointer rounded-full border border-red-200 px-4 text-sm text-red-600"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>
          </SettingsRow>

          <SettingsRow
            title="Configuración de cuenta del cliente"
            description="Administra qué aceptan o completan tus clientes al comprar."
          >
            <div className="overflow-hidden rounded-2xl border border-ink-900/15">
              <div className="space-y-3 p-6">
                <h3 className="font-serif text-xl text-ink-900">
                  Acuerdo de servicio
                </h3>
                <p className="text-sm text-ink-500">
                  Permite que tus clientes acepten términos y condiciones de tu
                  negocio.
                </p>
                <RadioField
                  checked={form.serviceAgreement === "not_required"}
                  onChange={() => patch({ serviceAgreement: "not_required" })}
                  label="No requerido"
                />
                <RadioField
                  checked={form.serviceAgreement === "default"}
                  onChange={() => patch({ serviceAgreement: "default" })}
                  label="Acuerdo predeterminado"
                />
                <RadioField
                  checked={form.serviceAgreement === "custom"}
                  onChange={() => patch({ serviceAgreement: "custom" })}
                  label="Personalizado"
                />
                {form.serviceAgreement === "custom" && (
                  <textarea
                    value={form.serviceAgreementText}
                    onChange={(event) =>
                      patch({ serviceAgreementText: event.target.value })
                    }
                    rows={4}
                    className="ink-input resize-y bg-white"
                    placeholder="Escribe el texto del acuerdo..."
                  />
                )}
              </div>
              <div className="border-t border-ink-900/10 p-6">
                <CheckField
                  checked={form.requirePasswordAtCheckout}
                  onChange={(requirePasswordAtCheckout) =>
                    patch({ requirePasswordAtCheckout })
                  }
                  label="Requerir que clientes nuevos creen contraseña en checkout"
                />
                <p className="mt-2 text-xs leading-5 text-ink-500">
                  Si está desactivado, crearán su contraseña después de
                  completar la compra.
                </p>
              </div>
            </div>
          </SettingsRow>

          <SettingsRow
            title="Enviar como regalo"
            description="Habilita que tus clientes compren esta oferta para otra persona."
          >
            <div className="rounded-2xl border border-ink-900/15 p-6">
              <BuilderInlineToggle
                label='Habilitar "Enviar como regalo" en checkout'
                checked={form.giftEnabled}
                onChange={(giftEnabled) => patch({ giftEnabled })}
              />
              <p className="mt-2 text-sm leading-6 text-ink-500">
                Si se selecciona la opción de regalo, order bumps, upsells y
                downsells se desactivarán para esa compra.
              </p>
            </div>
          </SettingsRow>

          <SettingsRow
            title="Notificaciones"
            description="Administra comunicaciones para ti, tu equipo y compradores."
          >
            <div className="space-y-4">
              <OfferToggleCard
                title="Enviar clientes a proveedor de email externo"
                description="Envía información de contacto a Mailchimp, Aweber, Drip, etc. cuando un cliente compra."
                checked={form.thirdPartyEmailEnabled}
                onChange={(thirdPartyEmailEnabled) =>
                  patch({ thirdPartyEmailEnabled })
                }
              />
              <OfferToggleCard
                title="Notificar cuando se haga una compra"
                description="Configura emails para ti o tu equipo después de cada compra."
                checked={form.purchaseNotificationEnabled}
                onChange={(purchaseNotificationEnabled) =>
                  patch({ purchaseNotificationEnabled })
                }
              />
              <OfferToggleCard
                title="Enviar correos de abandono de checkout"
                description="Recupera checkouts abandonados escribiendo a quienes dejaron su email pero no completaron la compra."
                checked={form.abandonmentEmailEnabled}
                onChange={(abandonmentEmailEnabled) =>
                  patch({ abandonmentEmailEnabled })
                }
              />
            </div>
          </SettingsRow>

          <SettingsRow
            title="Comisión de afiliado"
            description="Define una comisión para acreditar ventas a usuarios afiliados."
          >
            <div className="space-y-4 rounded-2xl border border-ink-900/15 p-6">
              <BuilderInlineToggle
                label="Activar comisión de afiliado para esta oferta"
                checked={form.affiliateCommissionEnabled}
                onChange={(affiliateCommissionEnabled) =>
                  patch({ affiliateCommissionEnabled })
                }
              />
              {form.affiliateCommissionEnabled && (
                <div className="grid gap-3 md:grid-cols-[180px_1fr]">
                  <BuilderSelect
                    label="Tipo"
                    value={form.affiliateCommissionType}
                    onChange={(value) =>
                      patch({
                        affiliateCommissionType:
                          value as OfferConfig["affiliateCommissionType"],
                      })
                    }
                    options={[
                      ["percentage", "Porcentaje"],
                      ["fixed", "Monto fijo"],
                    ]}
                  />
                  <OfferInput
                    label="Valor"
                    type="number"
                    value={String(form.affiliateCommissionValue)}
                    onChange={(affiliateCommissionValue) =>
                      patch({
                        affiliateCommissionValue: Number(
                          affiliateCommissionValue,
                        ),
                      })
                    }
                  />
                </div>
              )}
            </div>
          </SettingsRow>
        </div>
      )}
    </div>
  );
}

function CheckoutBuilder({
  offer,
  onBack,
  onChange,
}: {
  offer: OfferConfig;
  onBack: () => void;
  onChange: (values: Partial<OfferConfig>) => void;
}) {
  const [panel, setPanel] = useState<CheckoutBuilderPanel>("sections");
  const cta =
    offer.customButtonText && offer.buttonText
      ? offer.buttonText
      : offer.paymentType === "free"
        ? "Regístrate gratis"
        : "Pagar ahora";
  const priceLabel =
    offer.paymentType === "free"
      ? "Gratis"
      : `$${offer.price.toLocaleString("es-MX")} ${offer.currency}`;
  const visibleBlocks = offer.checkoutBlocks.filter((block) =>
    block === "image" ? Boolean(offer.thumbnail) || true : true,
  );
  const moveBlock = (index: number, direction: -1 | 1) => {
    const next = [...offer.checkoutBlocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ checkoutBlocks: next });
  };
  const removeBlock = (index: number) => {
    onChange({
      checkoutBlocks: offer.checkoutBlocks.filter((_, item) => item !== index),
    });
  };
  const addBlock = (block: CheckoutBlockType) => {
    onChange({ checkoutBlocks: [...offer.checkoutBlocks, block] });
    toast.success("Bloque agregado al checkout");
  };
  const addHeaderBlock = () => {
    onChange({ headerBlocks: [...offer.headerBlocks, "Nuevo bloque"] });
  };
  const updateHeaderBlock = (index: number, value: string) => {
    onChange({
      headerBlocks: offer.headerBlocks.map((block, item) =>
        item === index ? value : block,
      ),
    });
  };
  const removeHeaderBlock = (index: number) => {
    onChange({
      headerBlocks: offer.headerBlocks.filter((_, item) => item !== index),
    });
  };
  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ thumbnail: String(reader.result) });
    reader.readAsDataURL(file);
  };
  return (
    <div className="-mx-4 -my-6 grid min-h-[calc(100vh-7rem)] bg-white md:-mx-8 lg:grid-cols-[340px_1fr]">
      <aside className="overflow-auto border-r border-ink-900/10 bg-white p-5">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 min-h-10 cursor-pointer text-sm text-ink-500 hover:text-ink-900"
        >
          ← Volver a la oferta
        </button>
        <h2 className="text-center font-serif text-xl text-ink-900">
          {offer.title}
        </h2>
        <div className="mt-6 grid grid-cols-2 rounded-lg border border-ink-900/15 bg-cream-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setPanel("sections")}
            className={`min-h-9 cursor-pointer rounded-md ${panel === "sections" || !["settings"].includes(panel) ? "bg-white font-semibold shadow-sm" : "text-ink-500 hover:text-ink-900"}`}
          >
            Secciones
          </button>
          <button
            type="button"
            onClick={() => setPanel("settings")}
            className={`min-h-9 cursor-pointer rounded-md ${panel === "settings" ? "bg-white font-semibold shadow-sm" : "text-ink-500 hover:text-ink-900"}`}
          >
            Ajustes
          </button>
        </div>
        <div className="mt-8">
          {panel === "settings" ? (
            <BuilderSettingsPanel offer={offer} onChange={onChange} />
          ) : panel === "header" ? (
            <BuilderHeaderPanel
              offer={offer}
              onChange={onChange}
              onBack={() => setPanel("sections")}
              onAddBlock={addHeaderBlock}
              onUpdateBlock={updateHeaderBlock}
              onRemoveBlock={removeHeaderBlock}
            />
          ) : panel === "checkout" ? (
            <BuilderCheckoutPanel
              offer={offer}
              onChange={onChange}
              onBack={() => setPanel("sections")}
              onAddBlock={addBlock}
              onMoveBlock={moveBlock}
              onRemoveBlock={removeBlock}
              onSelectImage={selectImage}
            />
          ) : panel === "footer" ? (
            <BuilderFooterPanel
              offer={offer}
              onChange={onChange}
              onBack={() => setPanel("sections")}
            />
          ) : panel === "popup" ? (
            <BuilderSimplePanel
              title="Popup de salida"
              enabled={offer.popupEnabled}
              onBack={() => setPanel("sections")}
              onChange={(popupEnabled) => onChange({ popupEnabled })}
            />
          ) : panel === "optin" ? (
            <BuilderSimplePanel
              title="Opt-in de dos pasos"
              enabled={offer.optinEnabled}
              onBack={() => setPanel("sections")}
              onChange={(optinEnabled) => onChange({ optinEnabled })}
            />
          ) : (
            <BuilderSectionsPanel onSelect={setPanel} />
          )}
        </div>
      </aside>
      <section
        className="overflow-auto p-6 md:p-10"
        style={{ backgroundColor: offer.checkoutBackground }}
      >
        <div
          className={`mx-auto border border-brand-300 bg-white p-5 ${offer.checkoutPageWidth === "wide" ? "max-w-7xl" : "max-w-6xl"}`}
        >
          <p className="mb-2 text-[10px] text-brand-300">Sección</p>
          <div className="grid gap-6 border border-brand-300 p-5 xl:grid-cols-[1fr_360px]">
            <div>
              {!offer.headerHiddenDesktop && (
                <div
                  className={`mb-4 border border-brand-300 p-3 ${offer.headerSticky ? "sticky top-0 z-10" : ""}`}
                  style={{
                    backgroundColor: offer.headerBackgroundColor,
                    color: offer.headerTextColor,
                  }}
                >
                  <p className="mb-2 text-[10px] text-brand-300">Header</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {offer.headerBlocks.map((block, index) => (
                      <button
                        key={`${block}-${index}`}
                        type="button"
                        onClick={() => setPanel("header")}
                        className="min-h-9 cursor-pointer rounded-md border border-ink-900/10 px-3 text-sm hover:border-ink-900"
                        style={{
                          fontSize: `${Number(offer.headerDesktopFontSize) || 18}px`,
                        }}
                      >
                        {block}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-0">
                {visibleBlocks.map((block, index) => (
                  <button
                    key={`${block}-${index}`}
                    type="button"
                    onClick={() => setPanel("checkout")}
                    className="block w-full cursor-pointer border border-brand-300 text-left transition-colors hover:bg-brand-50"
                  >
                    <p className="px-3 pt-2 text-[10px] text-brand-300">
                      Bloque
                    </p>
                    {block === "image" && (
                      <div className="m-3 flex aspect-[16/8] items-center justify-center bg-blue-50 text-brand-300">
                        {offer.thumbnail ? (
                          <img
                            src={offer.thumbnail}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon large />
                        )}
                      </div>
                    )}
                    {block === "title" && (
                      <div className="p-4">
                        <h3 className="font-serif text-3xl font-semibold text-ink-900">
                          {offer.title}
                        </h3>
                      </div>
                    )}
                    {block === "description" && (
                      <p className="p-4 text-sm leading-6 text-ink-600">
                        {offer.description || "Descripción de la oferta."}
                      </p>
                    )}
                    {block === "checkout" && (
                      <p className="p-4 text-sm font-semibold text-ink-700">
                        Formulario de checkout
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-[10px] text-brand-300">Bloque</p>
              <div className="bg-white p-6 shadow-xl">
                <h3 className="font-serif text-xl font-semibold text-ink-900">
                  {offer.title}
                </h3>
                <p className="mt-2 font-serif text-xl text-ink-700">
                  {priceLabel}
                </p>
                <div className="my-5 border-t border-ink-900/10" />
                <p className="font-semibold text-ink-900">Contacto</p>
                <label
                  htmlFor="checkout-preview-email"
                  className="mt-4 block text-sm font-medium text-ink-900"
                >
                  Correo electrónico
                </label>
                <input
                  id="checkout-preview-email"
                  disabled
                  placeholder="Correo electrónico"
                  className="ink-input mt-2 bg-white"
                />
                {offer.checkoutSubscribe && (
                  <label className="mt-3 flex items-center gap-2 text-xs text-ink-700">
                    <input type="checkbox" disabled className="h-4 w-4" />
                    Suscríbete a nuestra lista de correo electrónico
                  </label>
                )}
                {offer.checkoutName && (
                  <input
                    disabled
                    placeholder="Nombre"
                    className="ink-input mt-3 bg-white"
                  />
                )}
                {offer.checkoutPhone && (
                  <input
                    disabled
                    placeholder="Teléfono"
                    className="ink-input mt-3 bg-white"
                  />
                )}
                {offer.checkoutAddress && (
                  <input
                    disabled
                    placeholder="Dirección"
                    className="ink-input mt-3 bg-white"
                  />
                )}
                {offer.checkoutTaxId && (
                  <input
                    disabled
                    placeholder="RFC / ID fiscal"
                    className="ink-input mt-3 bg-white"
                  />
                )}
                <div className="my-5 border-t border-ink-900/10" />
                <p className="text-sm leading-5 text-ink-600">
                  El checkout está deshabilitado mientras estás dentro del panel
                  administrador.
                </p>
                <button
                  type="button"
                  style={{ backgroundColor: offer.buttonColor }}
                  className="mt-4 min-h-11 w-full rounded-full px-4 text-sm font-semibold text-white"
                >
                  {cta}
                </button>
              </div>
            </div>
          </div>
          <footer className="border-x border-b border-brand-300 p-4 text-center text-xs text-ink-500">
            {offer.footerText}
          </footer>
        </div>
      </section>
    </div>
  );
}

function BuilderSectionsPanel({
  onSelect,
}: {
  onSelect: (panel: CheckoutBuilderPanel) => void;
}) {
  return (
    <div>
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
        Secciones
      </p>
      {(
        [
          ["Encabezado", "header"],
          ["Checkout", "checkout"],
          ["Pie de página", "footer"],
          ["Popup de salida", "popup"],
          ["Opt-in de dos pasos", "optin"],
        ] as const
      ).map(([label, key]) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className="flex min-h-12 w-full cursor-pointer items-center justify-between border-b border-ink-900/10 text-left text-sm font-medium text-ink-800 transition-colors hover:text-ink-900"
        >
          <span className="flex items-center gap-2">
            <SectionMiniIcon /> {label}
          </span>
          <span aria-hidden="true">›</span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => toast("Agrega secciones desde los módulos disponibles.")}
        className="mt-3 min-h-10 cursor-pointer text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        + Agregar sección
      </button>
    </div>
  );
}

function BuilderHeaderPanel({
  offer,
  onChange,
  onBack,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
}: {
  offer: OfferConfig;
  onChange: (values: Partial<OfferConfig>) => void;
  onBack: () => void;
  onAddBlock: () => void;
  onUpdateBlock: (index: number, value: string) => void;
  onRemoveBlock: (index: number) => void;
}) {
  return (
    <div className="space-y-5">
      <BuilderPanelHeader title="Encabezado" onBack={onBack} />
      <BuilderFieldGroup title="Carrito de compra">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-ink-600">Habilitar carrito</span>
          <ToggleSwitch
            checked={offer.headerCartEnabled}
            onChange={(headerCartEnabled) => onChange({ headerCartEnabled })}
            label="Habilitar carrito"
          />
        </div>
        <p className="text-xs leading-5 text-ink-500">
          Las opciones de pago del carrito se conectarán con ajustes de compra
          cuando esté listo el backend.
        </p>
      </BuilderFieldGroup>
      <BuilderSelect
        label="Tamaño de fuente desktop"
        value={offer.headerDesktopFontSize}
        onChange={(headerDesktopFontSize) =>
          onChange({ headerDesktopFontSize })
        }
        options={[
          ["16", "16px"],
          ["18", "18px (default)"],
          ["20", "20px"],
          ["24", "24px"],
        ]}
      />
      <BuilderSelect
        label="Tamaño de fuente mobile"
        value={offer.headerMobileFontSize}
        onChange={(headerMobileFontSize) => onChange({ headerMobileFontSize })}
        options={[
          ["14", "14px"],
          ["16", "16px (default)"],
          ["18", "18px"],
        ]}
      />
      <BuilderColor
        label="Texto del encabezado"
        value={offer.headerTextColor}
        onChange={(headerTextColor) => onChange({ headerTextColor })}
      />
      <BuilderColor
        label="Fondo del encabezado"
        value={offer.headerBackgroundColor}
        onChange={(headerBackgroundColor) =>
          onChange({ headerBackgroundColor })
        }
      />
      <div>
        <p className="mb-2 text-sm text-ink-500">Posición</p>
        <div className="grid grid-cols-2 rounded-lg border border-ink-900/15 bg-cream-100 p-1">
          {(
            [
              ["normal", "Normal"],
              ["overlay", "Overlay"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ headerPosition: value })}
              className={`min-h-9 cursor-pointer rounded-md text-sm ${offer.headerPosition === value ? "bg-white font-semibold shadow-sm" : "text-ink-500"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <BuilderFieldGroup title="Comportamiento">
        <BuilderInlineToggle
          label="Encabezado fijo"
          checked={offer.headerSticky}
          onChange={(headerSticky) => onChange({ headerSticky })}
        />
        <BuilderInlineToggle
          label="Ocultar en desktop"
          checked={offer.headerHiddenDesktop}
          onChange={(headerHiddenDesktop) => onChange({ headerHiddenDesktop })}
        />
        <BuilderInlineToggle
          label="Ocultar en mobile"
          checked={offer.headerHiddenMobile}
          onChange={(headerHiddenMobile) => onChange({ headerHiddenMobile })}
        />
      </BuilderFieldGroup>
      <BuilderFieldGroup title="Bloques">
        {offer.headerBlocks.map((block, index) => (
          <div key={`${block}-${index}`} className="flex items-center gap-2">
            <input
              value={block}
              onChange={(event) => onUpdateBlock(index, event.target.value)}
              className="min-h-10 flex-1 rounded-lg border border-ink-900/15 bg-white px-3 text-sm outline-none focus:border-ink-900"
            />
            <button
              type="button"
              onClick={() => onRemoveBlock(index)}
              className="min-h-10 cursor-pointer rounded-lg border border-red-200 px-3 text-xs text-red-600 hover:border-red-500"
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddBlock}
          className="min-h-10 cursor-pointer text-sm font-semibold text-brand-600"
        >
          + Agregar bloque
        </button>
      </BuilderFieldGroup>
    </div>
  );
}

function BuilderCheckoutPanel({
  offer,
  onChange,
  onBack,
  onAddBlock,
  onMoveBlock,
  onRemoveBlock,
  onSelectImage,
}: {
  offer: OfferConfig;
  onChange: (values: Partial<OfferConfig>) => void;
  onBack: () => void;
  onAddBlock: (block: CheckoutBlockType) => void;
  onMoveBlock: (index: number, direction: -1 | 1) => void;
  onRemoveBlock: (index: number) => void;
  onSelectImage: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-5">
      <BuilderPanelHeader title="Checkout" onBack={onBack} />
      <BuilderFieldGroup title="Contenido principal">
        <OfferInput
          label="Título de la oferta"
          value={offer.title}
          onChange={(title) => onChange({ title })}
        />
        <div>
          <label htmlFor="checkout-description" className="ink-label">
            Descripción
          </label>
          <textarea
            id="checkout-description"
            value={offer.description}
            onChange={(event) => onChange({ description: event.target.value })}
            rows={4}
            className="ink-input resize-y bg-white"
          />
        </div>
        <label className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-ink-900/20 px-4 text-xs hover:border-ink-900">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onSelectImage}
            className="sr-only"
          />
          Cambiar imagen principal
        </label>
      </BuilderFieldGroup>
      <BuilderFieldGroup title="Campos del formulario">
        <BuilderInlineToggle
          label="Suscripción al boletín"
          checked={offer.checkoutSubscribe}
          onChange={(checkoutSubscribe) => onChange({ checkoutSubscribe })}
        />
        <BuilderInlineToggle
          label="Nombre"
          checked={offer.checkoutName}
          onChange={(checkoutName) => onChange({ checkoutName })}
        />
        <BuilderInlineToggle
          label="Teléfono"
          checked={offer.checkoutPhone}
          onChange={(checkoutPhone) => onChange({ checkoutPhone })}
        />
        <BuilderInlineToggle
          label="Dirección"
          checked={offer.checkoutAddress}
          onChange={(checkoutAddress) => onChange({ checkoutAddress })}
        />
        <BuilderInlineToggle
          label="RFC / ID fiscal"
          checked={offer.checkoutTaxId}
          onChange={(checkoutTaxId) => onChange({ checkoutTaxId })}
        />
      </BuilderFieldGroup>
      <BuilderFieldGroup title="Botón">
        <BuilderColor
          label="Color del botón"
          value={offer.buttonColor}
          onChange={(buttonColor) => onChange({ buttonColor })}
        />
        <BuilderInlineToggle
          label="Texto personalizado"
          checked={offer.customButtonText}
          onChange={(customButtonText) => onChange({ customButtonText })}
        />
        {offer.customButtonText && (
          <OfferInput
            label="Texto del botón"
            value={offer.buttonText}
            onChange={(buttonText) => onChange({ buttonText })}
          />
        )}
      </BuilderFieldGroup>
      <BuilderFieldGroup title="Bloques del checkout">
        {offer.checkoutBlocks.map((block, index) => (
          <div
            key={`${block}-${index}`}
            className="flex items-center gap-2 rounded-lg border border-ink-900/10 p-2"
          >
            <span className="flex-1 text-sm font-medium">
              {checkoutBlockLabel(block)}
            </span>
            <button
              type="button"
              onClick={() => onMoveBlock(index, -1)}
              className="min-h-8 cursor-pointer rounded-md border px-2 text-xs disabled:opacity-40"
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMoveBlock(index, 1)}
              className="min-h-8 cursor-pointer rounded-md border px-2 text-xs disabled:opacity-40"
              disabled={index === offer.checkoutBlocks.length - 1}
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => onRemoveBlock(index)}
              className="min-h-8 cursor-pointer rounded-md border border-red-200 px-2 text-xs text-red-600"
            >
              Quitar
            </button>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["image", "Imagen"],
              ["title", "Título"],
              ["description", "Descripción"],
              ["checkout", "Formulario"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onAddBlock(value)}
              className="min-h-10 cursor-pointer rounded-lg border border-ink-900/15 text-xs hover:border-ink-900"
            >
              + {label}
            </button>
          ))}
        </div>
      </BuilderFieldGroup>
    </div>
  );
}

function BuilderFooterPanel({
  offer,
  onChange,
  onBack,
}: {
  offer: OfferConfig;
  onChange: (values: Partial<OfferConfig>) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <BuilderPanelHeader title="Pie de página" onBack={onBack} />
      <div>
        <label htmlFor="footer-text" className="ink-label">
          Texto del footer
        </label>
        <textarea
          id="footer-text"
          value={offer.footerText}
          onChange={(event) => onChange({ footerText: event.target.value })}
          rows={4}
          className="ink-input resize-y bg-white"
        />
      </div>
    </div>
  );
}

function BuilderSimplePanel({
  title,
  enabled,
  onBack,
  onChange,
}: {
  title: string;
  enabled: boolean;
  onBack: () => void;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <BuilderPanelHeader title={title} onBack={onBack} />
      <BuilderFieldGroup title="Estado">
        <BuilderInlineToggle
          label={`Habilitar ${title.toLowerCase()}`}
          checked={enabled}
          onChange={onChange}
        />
        <p className="text-xs leading-5 text-ink-500">
          Esta sección queda guardada en la configuración de la oferta. Después
          podremos conectar sus acciones al backend.
        </p>
      </BuilderFieldGroup>
    </div>
  );
}

function BuilderSettingsPanel({
  offer,
  onChange,
}: {
  offer: OfferConfig;
  onChange: (values: Partial<OfferConfig>) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
        Ajustes globales
      </p>
      <BuilderColor
        label="Fondo de la página"
        value={offer.checkoutBackground}
        onChange={(checkoutBackground) => onChange({ checkoutBackground })}
      />
      <BuilderSelect
        label="Ancho del checkout"
        value={offer.checkoutPageWidth}
        onChange={(value) =>
          onChange({
            checkoutPageWidth: value as OfferConfig["checkoutPageWidth"],
          })
        }
        options={[
          ["normal", "Normal"],
          ["wide", "Amplio"],
        ]}
      />
      <BuilderFieldGroup title="Resumen">
        <p className="text-sm leading-6 text-ink-500">
          Los cambios se reflejan en la vista previa y se guardan con la oferta
          al presionar “Guardar”.
        </p>
      </BuilderFieldGroup>
    </div>
  );
}

function BuilderPanelHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 min-h-9 cursor-pointer text-sm text-ink-600 hover:text-ink-900"
      >
        ‹ Volver
      </button>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
        Sección
      </p>
      <h3 className="mt-1 font-serif text-2xl text-ink-900">{title}</h3>
    </div>
  );
}

function BuilderFieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4 border-b border-ink-900/10 pb-5">
      <h4 className="text-sm font-semibold text-ink-900">{title}</h4>
      {children}
    </div>
  );
}

function BuilderInlineToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-4">
      <span className="text-sm text-ink-600">{label}</span>
      <ToggleSwitch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

function BuilderColor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `builder-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="ink-label">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          aria-label={label}
          value={isHexColor(value) ? value : "#ffffff"}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 rounded-lg border border-ink-900/15"
        />
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-10 flex-1 rounded-lg border border-ink-900/15 bg-white px-3 text-sm outline-none focus:border-ink-900"
          placeholder="#ffffff"
        />
      </div>
    </div>
  );
}

function BuilderSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  const id = `builder-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="ink-label">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-10 w-full rounded-lg border border-ink-900/15 bg-white px-3 text-sm outline-none focus:border-ink-900"
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function checkoutBlockLabel(block: CheckoutBlockType) {
  const labels: Record<CheckoutBlockType, string> = {
    image: "Imagen principal",
    title: "Título",
    description: "Descripción",
    checkout: "Formulario de checkout",
  };
  return labels[block];
}

function isHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function OfferCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-xl text-ink-900">{title}</h3>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function UpsellPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = SAMPLE_UPSELLS.filter((item) =>
    item.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")),
  );
  return (
    <div className="relative">
      <label htmlFor="upsell-offer" className="ink-label">
        Elegir un upsell
      </label>
      <button
        type="button"
        id="upsell-offer"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="ink-input flex min-h-11 cursor-pointer items-center justify-between bg-white text-left"
      >
        <span className={value ? "text-ink-900" : "text-ink-400"}>
          {value || "Elegir una opción"}
        </span>
        <span aria-hidden="true">{open ? "⌃" : "⌄"}</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-ink-900/15 bg-white shadow-xl">
          <label className="flex min-h-11 items-center gap-2 border-b border-ink-900/10 px-3">
            <MiniSearchIcon />
            <span className="sr-only">Buscar upsell</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar..."
              className="w-full bg-transparent text-sm outline-none"
              autoFocus
            />
          </label>
          <p className="bg-cream-100 px-4 py-3 text-xs text-ink-400">
            Buscando...
          </p>
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-ink-500">
              No encontramos upsells.
            </p>
          ) : (
            filtered.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                  setQuery("");
                }}
                className="min-h-11 w-full cursor-pointer px-4 text-left text-sm transition-colors hover:bg-cream-100"
              >
                {item}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CheckoutMiniPreview({ offer }: { offer: OfferConfig }) {
  const amount =
    offer.paymentType === "free"
      ? "$0.00"
      : `$${offer.price.toLocaleString("es-MX")}`;
  const buttonText =
    offer.customButtonText && offer.buttonText
      ? offer.buttonText
      : offer.paymentType === "free"
        ? "Obtener acceso"
        : `Pagar ${amount}`;
  return (
    <div className="rounded-2xl bg-cream-100 p-5">
      <div className="rounded-xl bg-white p-5 shadow-lg">
        <p className="text-center font-serif text-2xl">
          {offer.customPriceText || amount}
        </p>
        <p className="mt-5 font-semibold text-ink-900">Contacto</p>
        <input
          disabled
          placeholder="Correo electrónico"
          className="ink-input mt-2 bg-white"
        />
        {offer.checkoutName && (
          <input
            disabled
            placeholder="Nombre"
            className="ink-input mt-3 bg-white"
          />
        )}
        {offer.checkoutPhone && (
          <input
            disabled
            placeholder="Teléfono"
            className="ink-input mt-3 bg-white"
          />
        )}
        {offer.checkoutAddress && (
          <input
            disabled
            placeholder="Dirección"
            className="ink-input mt-3 bg-white"
          />
        )}
        {offer.checkoutTaxId && (
          <input
            disabled
            placeholder="RFC / ID fiscal"
            className="ink-input mt-3 bg-white"
          />
        )}
        {offer.orderBumpEnabled && (
          <div className="mt-4 rounded-xl border border-ink-900/15 p-3 text-xs">
            <label className="flex items-start gap-2">
              <input type="checkbox" disabled className="mt-0.5 h-4 w-4" />
              <span>
                <strong>{offer.orderBumpTitle || "Oferta adicional"}</strong>
                <br />+ ${offer.orderBumpPrice.toLocaleString("es-MX")}{" "}
                {offer.currency}
              </span>
            </label>
          </div>
        )}
        {offer.serviceAgreement !== "not_required" && (
          <label className="mt-4 flex items-start gap-2 text-xs text-ink-600">
            <input type="checkbox" disabled className="mt-0.5 h-4 w-4" />
            Acepto los términos y condiciones.
          </label>
        )}
        {offer.giftEnabled && (
          <label className="mt-3 flex items-start gap-2 text-xs text-ink-600">
            <input type="checkbox" disabled className="mt-0.5 h-4 w-4" />
            Enviar esta compra como regalo.
          </label>
        )}
        <button
          type="button"
          style={{ backgroundColor: offer.buttonColor }}
          className="mt-5 min-h-11 w-full rounded-full px-4 text-sm font-semibold text-white"
        >
          {buttonText}
        </button>
        <p className="mt-4 text-center text-[11px] text-ink-400">
          Transacción segura y cifrada
        </p>
      </div>
    </div>
  );
}

function CheckoutTinyPreview({ offer }: { offer: OfferConfig }) {
  return (
    <div className="grid aspect-video grid-cols-[1fr_0.8fr] gap-2 text-[7px]">
      <div className="space-y-2">
        <div className="h-12 rounded bg-blue-50" />
        <div className="h-2 w-20 rounded bg-ink-900" />
        <div className="h-2 w-14 rounded bg-ink-200" />
      </div>
      <div className="rounded bg-white p-2 shadow-sm">
        <p className="font-semibold">{offer.title.slice(0, 18)}</p>
        <p>{offer.paymentType === "free" ? "Gratis" : `$${offer.price}`}</p>
        <div className="mt-2 h-3 rounded border" />
        <div
          className="mt-2 h-3 rounded"
          style={{ backgroundColor: offer.buttonColor }}
        />
      </div>
    </div>
  );
}

function OfferToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-ink-900/15 p-6">
      <div>
        <h3 className="font-serif text-xl text-ink-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-ink-500">{description}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function OfferInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = `offer-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="ink-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="ink-input bg-white"
      />
    </div>
  );
}
function CheckField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-ink-900"
      />
      {label}
    </label>
  );
}
function RadioField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-ink-900"
      />
      {label}
    </label>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center">
      <span className="sr-only">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 rounded-full bg-ink-200 transition-colors peer-checked:bg-brand-500 peer-focus-visible:ring-2 peer-focus-visible:ring-ink-900/40 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}

function SmallOptionIcon({ type }: { type: "mail" | "palette" | "ban" }) {
  if (type === "mail") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 7 5 7-5" />
      </svg>
    );
  }
  if (type === "palette") return <PaletteIcon small />;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" d="m7 7 10 10" />
    </svg>
  );
}

function PaletteIcon({ small = false }: { small?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={small ? "h-4 w-4" : "h-5 w-5"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 1.3-3.05 1.7 1.7 0 0 1 1.2-2.95H17a4 4 0 0 0 3.8-5.2A9 9 0 0 0 12 3Z"
      />
      <circle cx="7.8" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.2" cy="7.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.2" cy="7.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SectionMiniIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path strokeLinecap="round" d="M4 9h16" />
    </svg>
  );
}

function StudentsSection({ course }: { course: Course }) {
  return (
    <SectionWithIntro
      title="Clientes"
      description="Consulta quién tiene acceso al curso y su actividad de aprendizaje."
    >
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-ink-900/10 bg-white p-8 text-center shadow-sm">
        <UsersOutlineIcon />
        <p className="mt-4 font-serif text-xl text-ink-900">
          {course.enrolledCount ?? 0} cliente
          {course.enrolledCount === 1 ? "" : "s"}
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Los datos individuales de avance estarán disponibles cuando el backend
          registre el progreso por lección.
        </p>
      </div>
    </SectionWithIntro>
  );
}

function CertificatesSection({ course }: { course: Course }) {
  const storageKey = `dd-course-certificate-${course._id || course.id}`;
  const [config, setConfig] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(storageKey) ?? "null") ?? {
          enabled: false,
          title: "Certificado de finalización",
          recipient: "Este certificado se otorga a",
          showStudent: true,
          showCourse: true,
          completionDate: false,
          serial: false,
        }
      );
    } catch {
      return {
        enabled: false,
        title: "Certificado de finalización",
        recipient: "Este certificado se otorga a",
        showStudent: true,
        showCourse: true,
        completionDate: false,
        serial: false,
      };
    }
  });
  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(config));
    toast.success("Certificado guardado");
  };
  return (
    <SectionWithIntro
      title="Certificados"
      description="Reconoce a tus clientes con un certificado cuando finalicen todas las lecciones."
    >
      <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
        <Toggle
          checked={config.enabled}
          onChange={(enabled) => setConfig({ ...config, enabled })}
          label="Proporcionar certificados para este curso"
        />
        <div
          className={`mt-6 space-y-5 border-t border-ink-900/10 pt-6 ${config.enabled ? "" : "pointer-events-none opacity-45"}`}
        >
          <div>
            <label className="ink-label" htmlFor="certificate-title">
              Título del certificado
            </label>
            <input
              id="certificate-title"
              value={config.title}
              onChange={(event) =>
                setConfig({ ...config, title: event.target.value })
              }
              className="ink-input bg-white"
            />
          </div>
          <div>
            <label className="ink-label" htmlFor="certificate-recipient">
              Subtítulo del destinatario
            </label>
            <input
              id="certificate-recipient"
              value={config.recipient}
              onChange={(event) =>
                setConfig({ ...config, recipient: event.target.value })
              }
              className="ink-input bg-white"
            />
          </div>
          <label className="settings-check">
            <input
              type="checkbox"
              checked={config.showStudent}
              onChange={(event) =>
                setConfig({ ...config, showStudent: event.target.checked })
              }
            />{" "}
            Mostrar el nombre del estudiante
          </label>
          <label className="settings-check">
            <input
              type="checkbox"
              checked={config.showCourse}
              onChange={(event) =>
                setConfig({ ...config, showCourse: event.target.checked })
              }
            />{" "}
            Incluir el nombre del curso: {course.title}
          </label>
          <label className="settings-check">
            <input
              type="checkbox"
              checked={config.completionDate}
              onChange={(event) =>
                setConfig({ ...config, completionDate: event.target.checked })
              }
            />{" "}
            Incluir la fecha de finalización
          </label>
          <label className="settings-check">
            <input
              type="checkbox"
              checked={config.serial}
              onChange={(event) =>
                setConfig({ ...config, serial: event.target.checked })
              }
            />{" "}
            Incluir un número de serie único
          </label>
        </div>
        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={save}
            className="min-h-11 cursor-pointer rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream"
          >
            Guardar
          </button>
        </div>
      </div>
    </SectionWithIntro>
  );
}

function SettingsSection({
  course,
  courseId,
}: {
  course: Course;
  courseId: string;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const storageKey = `dd-course-settings-${courseId}`;
  const saved = loadJson<{
    paywall: boolean;
    liveRoom: boolean;
    community: boolean;
    comments: boolean;
    lockComments: boolean;
  }>(storageKey, {
    paywall: false,
    liveRoom: false,
    community: false,
    comments: true,
    lockComments: false,
  });
  const [form, setForm] = useState({
    title: course.title,
    description: course.description ?? "",
    thumbnail: course.thumbnail ?? "",
    ...saved,
  });
  const mutation = useMutation({
    mutationFn: () =>
      updateCourse(courseId, {
        title: form.title,
        description: form.description,
        shortDescription: form.description.slice(0, 180),
        thumbnail: form.thumbnail,
      }),
    onSuccess: () => {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          paywall: form.paywall,
          liveRoom: form.liveRoom,
          community: form.community,
          comments: form.comments,
          lockComments: form.lockComments,
        }),
      );
      queryClient.invalidateQueries({ queryKey: ["course-admin", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Ajustes guardados");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const remove = useMutation({
    mutationFn: () => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso eliminado");
      navigate("/admin/cursos");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen debe pesar menos de 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm({ ...form, thumbnail: String(reader.result) });
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-6">
      <SettingsRow
        title="Detalles"
        description="Edita el nombre, la descripción y la imagen que verán tus clientes."
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="settings-title" className="ink-label">
              Título
            </label>
            <input
              id="settings-title"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              className="ink-input bg-white"
            />
          </div>
          <div>
            <label htmlFor="settings-description" className="ink-label">
              Descripción
            </label>
            <textarea
              id="settings-description"
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              className="ink-input resize-none bg-white font-sans"
            />
          </div>
          <div>
            <p className="ink-label">Miniatura del producto</p>
            <div className="flex flex-wrap items-center gap-5 rounded-xl border border-ink-900/15 p-5">
              <div className="flex aspect-video w-44 items-center justify-center overflow-hidden rounded-lg bg-cream-200">
                {form.thumbnail ? (
                  <img
                    src={form.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon large />
                )}
              </div>
              <label className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-ink-900/20 px-4 text-xs hover:border-ink-900">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={selectImage}
                  className="sr-only"
                />
                Seleccionar imagen
              </label>
            </div>
          </div>
        </div>
      </SettingsRow>
      <SettingsRow
        title="Muro de pago"
        description="Restringe parte del contenido para impulsar la compra del acceso completo."
      >
        <Toggle
          checked={form.paywall}
          onChange={(paywall) => setForm({ ...form, paywall })}
          label="Agregar un muro de pago a este curso"
        />
      </SettingsRow>
      <SettingsRow
        title="Salas en vivo"
        description="Ofrece sesiones de video en directo a los participantes."
      >
        <Toggle
          checked={form.liveRoom}
          onChange={(liveRoom) => setForm({ ...form, liveRoom })}
          label="Habilitar una sala en vivo"
        />
      </SettingsRow>
      <SettingsRow
        title="Comunidad"
        description="Conecta este curso con una experiencia comunitaria."
      >
        <Toggle
          checked={form.community}
          onChange={(community) => setForm({ ...form, community })}
          label="Habilitar comunidad para este curso"
        />
      </SettingsRow>
      <SettingsRow
        title="Comentarios"
        description="Configura el comportamiento general de comentarios en las lecciones."
      >
        <div className="space-y-4">
          <Toggle
            checked={form.comments}
            onChange={(comments) => setForm({ ...form, comments })}
            label="Habilitar comentarios"
          />
          <label className="settings-check">
            <input
              type="checkbox"
              checked={form.lockComments}
              onChange={(event) =>
                setForm({ ...form, lockComments: event.target.checked })
              }
              disabled={!form.comments}
            />{" "}
            Bloquear todos los comentarios nuevos
          </label>
        </div>
      </SettingsRow>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`¿Eliminar definitivamente “${course.title}”?`))
              remove.mutate();
          }}
          className="min-h-11 cursor-pointer px-3 text-sm text-red-700 hover:underline"
        >
          Eliminar producto
        </button>
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="min-h-11 cursor-pointer rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream disabled:opacity-50"
        >
          {mutation.isPending ? "Guardando…" : "Guardar ajustes"}
        </button>
      </div>
    </div>
  );
}

function SectionWithIntro({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div>
        <h2 className="font-serif text-2xl text-ink-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-ink-500">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}
function SettingsRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-5 border-b border-ink-900/10 pb-6 lg:grid-cols-[280px_1fr]">
      <div>
        <h2 className="font-serif text-xl text-ink-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-500">{description}</p>
      </div>
      <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 rounded-full bg-ink-300 transition-colors peer-checked:bg-brand-500 peer-focus-visible:ring-2 peer-focus-visible:ring-ink-900/40 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
      {label}
    </label>
  );
}
function UsersOutlineIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-12 w-12 text-ink-300"
    >
      <circle cx="9" cy="8" r="3" />
      <path
        strokeLinecap="round"
        d="M3 19a6 6 0 0 1 12 0m1-13a3 3 0 0 1 0 6m2 2a5 5 0 0 1 3 5"
      />
    </svg>
  );
}
function loadJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function isCourseTab(value: string | null): value is CourseTab {
  return (
    value === "outline" ||
    value === "offers" ||
    value === "students" ||
    value === "certificates" ||
    value === "settings"
  );
}
function EmptyOutline({
  onAdd,
  searching,
}: {
  onAdd: () => void;
  searching: boolean;
}) {
  return (
    <div className="py-14 text-center">
      <h3 className="font-serif text-xl text-ink-900">
        {searching
          ? "No encontramos contenido"
          : "Construye el temario de tu curso"}
      </h3>
      <p className="mt-2 text-sm text-ink-500">
        {searching
          ? "Prueba con otra búsqueda."
          : "Comienza creando un módulo y después añade sus lecciones."}
      </p>
      {!searching && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 min-h-11 cursor-pointer rounded-full bg-ink-900 px-5 text-sm text-cream"
        >
          Crear primer módulo
        </button>
      )}
    </div>
  );
}

function loadAutomations(lessonId: string): AutomationRule[] {
  try {
    return JSON.parse(
      localStorage.getItem(`dd-lesson-automations-${lessonId}`) ?? "[]",
    ) as AutomationRule[];
  } catch {
    return [];
  }
}
function saveAutomations(lessonId: string, rules: AutomationRule[]) {
  localStorage.setItem(
    `dd-lesson-automations-${lessonId}`,
    JSON.stringify(rules),
  );
}
function loadLessonPreferences(
  lessonId: string,
  lesson: Lesson,
): LessonPreferences {
  try {
    const saved = JSON.parse(
      localStorage.getItem(`dd-lesson-preferences-${lessonId}`) ?? "{}",
    ) as Partial<LessonPreferences>;
    return {
      thumbnail: saved.thumbnail ?? lesson.thumbnail ?? "",
      mediaType:
        saved.mediaType ??
        lesson.mediaType ??
        (lesson.videoUrl ? "video" : "none"),
      videoUrl: normalizePersistedMediaUrl(saved.videoUrl ?? lesson.videoUrl),
      resources: (saved.resources ?? lesson.resources ?? []).filter(
        (resource) => !resource.url.startsWith("blob:"),
      ),
      isPublished: saved.isPublished ?? lesson.isPublished ?? false,
      commentsVisibility:
        saved.commentsVisibility ?? lesson.commentsVisibility ?? "visible",
    };
  } catch {
    return {
      thumbnail: "",
      mediaType: lesson.videoUrl ? "video" : "none",
      videoUrl: normalizePersistedMediaUrl(lesson.videoUrl),
      resources: (lesson.resources ?? []).filter(
        (resource) => !resource.url.startsWith("blob:"),
      ),
      isPublished: false,
      commentsVisibility: "visible",
    };
  }
}
function normalizePersistedMediaUrl(url?: string) {
  if (!url || url.startsWith("blob:")) return "";
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveFileMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }
  const driveOpenMatch = url.match(/[?&]id=([^&]+)/);
  if (url.includes("drive.google.com") && driveOpenMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`;
  }
  return url;
}
function isDrivePreviewUrl(url: string) {
  return /drive\.google\.com\/file\/d\/[^/]+\/preview/.test(url);
}
function saveLessonPreferences(
  lessonId: string,
  preferences: LessonPreferences,
) {
  localStorage.setItem(
    `dd-lesson-preferences-${lessonId}`,
    JSON.stringify(preferences),
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m16 16 4 4" />
    </svg>
  );
}
function MiniSearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4 text-ink-400"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m16 16 4 4" />
    </svg>
  );
}
function ImageIcon({ large = false }: { large?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={large ? "h-10 w-10" : "h-5 w-5"}
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4 18 5-5 3 3 2-2 6 5"
      />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="inline h-4 w-4"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path d="m4 20 4.5-1 10-10a2 2 0 0 0-3-3l-10 10L4 20Z" />
      <path d="m14 7 3 3" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4 shrink-0"
    >
      <path d="M3 7h7l2 2h9v10H3V7Z" strokeLinejoin="round" />
    </svg>
  );
}
function DocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4 shrink-0 text-ink-500"
    >
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v5h5M9 12h6M9 16h5" />
    </svg>
  );
}
function DragIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 20"
      fill="currentColor"
      className="h-5 w-3 shrink-0 text-ink-300"
    >
      <circle cx="3" cy="5" r="1.2" />
      <circle cx="9" cy="5" r="1.2" />
      <circle cx="3" cy="10" r="1.2" />
      <circle cx="9" cy="10" r="1.2" />
      <circle cx="3" cy="15" r="1.2" />
      <circle cx="9" cy="15" r="1.2" />
    </svg>
  );
}
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
    >
      <path strokeLinecap="round" d="m6 8 4 4 4-4" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 text-ink-300"
    >
      <path strokeLinecap="round" d="m8 6 4 4-4 4" />
    </svg>
  );
}
function BoltIcon() {
  return (
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
        d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"
      />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-8 w-8 text-ink-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0L7 9m5-5 5 5M5 15v4h14v-4"
      />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5 shrink-0 text-ink-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14"
      />
    </svg>
  );
}
function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
