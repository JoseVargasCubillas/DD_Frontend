import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCourses } from "@hooks/useCourses";
import { createCourse, deleteCourse, importDriveCourses } from "@api/courses.api";
import type { Course, CourseType } from "@t/index";

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface ProductBundle {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  courseIds: string[];
  members: number;
  price: number;
  currency: string;
  createdAt: string;
  status: "draft" | "published";
}

type ProductRow =
  | {
      id: string;
      type: "course";
      title: string;
      thumbnail: string;
      members: number;
      createdAt: string;
      label: string;
      course: Course;
    }
  | {
      id: string;
      type: "bundle";
      title: string;
      thumbnail: string;
      members: number;
      createdAt: string;
      label: string;
      bundle: ProductBundle;
    };

interface CourseDraft {
  courseType: CourseType;
  title: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  thumbnail: string;
  isPaid: boolean;
  price: number;
  currency: string;
  paywall: boolean;
}

const INITIAL_DRAFT: CourseDraft = {
  courseType: "evergreen",
  title: "",
  description: "",
  primaryColor: "#171717",
  accentColor: "#0a0a0a",
  thumbnail: "",
  isPaid: false,
  price: 0,
  currency: "MXN",
  paywall: false,
};

export default function ManageCourses() {
  const location = useLocation();
  const isAllProducts = location.pathname === "/admin/productos";
  const { data, isLoading } = useCourses({ status: "", includeAll: true });
  const courses = data?.data ?? [];
  const [showWizard, setShowWizard] = useState(false);
  const [showDriveImport, setShowDriveImport] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState<
    ProductBundle | "new" | null
  >(null);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [bundles, setBundles] = useState<ProductBundle[]>(() =>
    loadProductBundles(),
  );
  const queryClient = useQueryClient();
  const duplicateMutation = useMutation({
    mutationFn: (course: Course) =>
      createCourse({
        title: `${course.title} (copia)`,
        description: course.description,
        shortDescription: course.shortDescription,
        thumbnail: course.thumbnail,
        price: course.price,
        currency: course.currency,
        category: course.category,
        status: "draft",
        courseType: course.courseType,
        primaryColor: course.primaryColor,
        accentColor: course.accentColor,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso duplicado");
      setOpenMenuId(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso eliminado");
      setOpenMenuId(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    return query
      ? courses.filter((course) =>
          course.title.toLocaleLowerCase("es").includes(query),
        )
      : courses;
  }, [courses, search]);

  const saveBundles = (next: ProductBundle[]) => {
    setBundles(next);
    localStorage.setItem(PRODUCT_BUNDLES_KEY, JSON.stringify(next));
  };

  if (isAllProducts) {
    return (
      <AllProductsView
        courses={courses}
        bundles={bundles}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        onNewProduct={() => setShowProductDialog("new")}
        onEditProduct={(bundle) => setShowProductDialog(bundle)}
        onDuplicateProduct={(bundle) => {
          const copy = {
            ...bundle,
            id: crypto.randomUUID(),
            title: `${bundle.title} (copia)`,
            createdAt: new Date().toISOString(),
            status: "draft" as const,
          };
          saveBundles([...bundles, copy]);
          toast.success("Producto duplicado");
          setOpenMenuId(null);
        }}
        onDeleteProduct={(id) => {
          saveBundles(bundles.filter((bundle) => bundle.id !== id));
          toast.success("Producto eliminado");
          setOpenMenuId(null);
        }}
      >
        {showProductDialog && (
          <ProductBundleDialog
            value={showProductDialog === "new" ? null : showProductDialog}
            courses={courses}
            onClose={() => setShowProductDialog(null)}
            onSave={(bundle) => {
              const exists = bundles.some((item) => item.id === bundle.id);
              saveBundles(
                exists
                  ? bundles.map((item) =>
                      item.id === bundle.id ? bundle : item,
                    )
                  : [...bundles, bundle],
              );
              toast.success(
                exists ? "Producto actualizado" : "Producto creado",
              );
              setShowProductDialog(null);
            }}
          />
        )}
      </AllProductsView>
    );
  }

  return (
    <div>
      <header className="mb-7 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.4em] text-ink-500">
            Productos
          </p>
          <h1 className="font-serif text-4xl leading-none text-ink-900 md:text-5xl">
            Cursos
          </h1>
          <p className="mt-3 text-sm text-ink-600">
            Crea, organiza y publica la formación de tu academia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowWizard(true)}
          className="btn-broadsheet min-h-11"
        >
          <span aria-hidden="true">＋</span> Nuevo curso
        </button>
      </header>

      <section className="mb-7 rounded-2xl border border-ink-900/15 bg-white/75 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-ink-500">
              Migracion Kajabi
            </p>
            <h2 className="mt-1 font-serif text-2xl text-ink-900">
              Importar cursos desde Drive
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowDriveImport(true)}
            className="min-h-11 cursor-pointer rounded-full border border-ink-900/20 px-5 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-900"
          >
            Importar desde Drive
          </button>
        </div>
      </section>

      <section
        className="rounded-2xl border border-ink-900/15 bg-cream-50 shadow-sm"
        aria-label="Listado de cursos"
      >
        <div className="border-b border-ink-900/10 p-4">
          <label className="relative block max-w-sm">
            <span className="sr-only">Buscar cursos</span>
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
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar..."
              className="min-h-11 w-full rounded-lg border border-ink-900/20 bg-white py-2 pl-10 pr-3 text-sm outline-none transition-colors focus:border-ink-900"
            />
          </label>
        </div>

        <div className="hidden grid-cols-[minmax(260px,2fr)_1fr_0.7fr_0.9fr_44px] gap-5 border-b border-ink-900/10 bg-ink-900/[0.025] px-5 py-4 text-xs font-medium text-ink-700 md:grid">
          <span>Título</span>
          <span>Tipo</span>
          <span>Miembros</span>
          <span>Creado</span>
          <span />
        </div>

        {isLoading ? (
          <p className="p-10 text-sm text-ink-500">Cargando cursos…</p>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-xl text-ink-900">
              {search
                ? "No encontramos coincidencias"
                : "Tu academia está lista para su primer curso"}
            </p>
            <p className="mt-2 text-sm text-ink-500">
              {search
                ? "Prueba con otro título."
                : "Usa “Nuevo curso” para comenzar."}
            </p>
          </div>
        ) : (
          filteredCourses.map((course: Course) => {
            const id = String(course._id || course.id);
            const createdAt = course.createdAt
              ? new Date(course.createdAt).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—";
            return (
              <article
                key={id}
                className="grid gap-3 border-b border-ink-900/10 px-5 py-4 last:border-0 md:grid-cols-[minmax(260px,2fr)_1fr_0.7fr_0.9fr_44px] md:items-center md:gap-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex aspect-video w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink-900/15 bg-cream-200">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon />
                    )}
                  </div>
                  <Link
                    to={`/admin/cursos/${id}`}
                    className="truncate text-sm font-medium text-ink-900 underline-offset-4 hover:underline"
                  >
                    {course.title}
                  </Link>
                </div>
                <div>
                  <span className="inline-flex rounded-full border border-ink-900/20 px-2.5 py-1 text-xs text-ink-700">
                    {course.courseType === "cohort"
                      ? "Curso por cohortes"
                      : "Curso siempre disponible"}
                  </span>
                </div>
                <p className="text-sm text-ink-700">
                  <span className="md:hidden">Miembros: </span>
                  {course.enrolledCount ?? 0}
                </p>
                <p className="text-sm text-ink-700">
                  <span className="md:hidden">Creado: </span>
                  {createdAt}
                </p>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId((current) => (current === id ? null : id))
                    }
                    aria-expanded={openMenuId === id}
                    aria-label={`Opciones de ${course.title}`}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-base text-ink-600 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40"
                  >
                    •••
                  </button>
                  {openMenuId === id && (
                    <div
                      className="absolute right-0 top-11 z-30 w-52 overflow-hidden rounded-xl border border-ink-900/10 bg-white py-2 shadow-xl"
                      role="menu"
                    >
                      <Link
                        to={`/admin/cursos/${id}/avance`}
                        className="course-menu-item"
                        role="menuitem"
                      >
                        Avance
                      </Link>
                      <Link
                        to={`/admin/cursos/${id}?tab=settings`}
                        className="course-menu-item"
                        role="menuitem"
                      >
                        Editar detalles
                      </Link>
                      <Link
                        to={`/admin/comentarios?course=${id}`}
                        className="course-menu-item"
                        role="menuitem"
                      >
                        Gestionar comentarios
                      </Link>
                      <button
                        type="button"
                        onClick={() => duplicateMutation.mutate(course)}
                        disabled={duplicateMutation.isPending}
                        className="course-menu-item w-full disabled:opacity-50"
                        role="menuitem"
                      >
                        Duplicar
                      </button>
                      <div className="my-1 border-t border-ink-900/10" />
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `¿Eliminar definitivamente “${course.title}”?`,
                            )
                          )
                            deleteMutation.mutate(id);
                        }}
                        disabled={deleteMutation.isPending}
                        className="course-menu-item w-full text-red-700 disabled:opacity-50"
                        role="menuitem"
                      >
                        Borrar
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>

      {showWizard && (
        <CourseCreationWizard onClose={() => setShowWizard(false)} />
      )}
      {showDriveImport && (
        <DriveImportDialog onClose={() => setShowDriveImport(false)} />
      )}
    </div>
  );
}

const PRODUCT_BUNDLES_KEY = "dd-admin-product-bundles";

function AllProductsView({
  courses,
  bundles,
  isLoading,
  search,
  setSearch,
  openMenuId,
  setOpenMenuId,
  onNewProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  children,
}: {
  courses: Course[];
  bundles: ProductBundle[];
  isLoading: boolean;
  search: string;
  setSearch: (value: string) => void;
  openMenuId: string | null;
  setOpenMenuId: (value: string | null) => void;
  onNewProduct: () => void;
  onEditProduct: (bundle: ProductBundle) => void;
  onDuplicateProduct: (bundle: ProductBundle) => void;
  onDeleteProduct: (id: string) => void;
  children?: ReactNode;
}) {
  const rows = useMemo(() => {
    const courseRows: ProductRow[] = courses.map((course) => ({
      id: String(course._id || course.id),
      type: "course",
      title: course.title,
      thumbnail: course.thumbnail,
      members: course.enrolledCount ?? 0,
      createdAt: course.createdAt,
      label:
        course.courseType === "cohort"
          ? "Curso por cohortes"
          : "Curso siempre disponible",
      course,
    }));
    const bundleRows: ProductRow[] = bundles.map((bundle) => ({
      id: bundle.id,
      type: "bundle",
      title: bundle.title,
      thumbnail: bundle.thumbnail,
      members: bundle.members,
      createdAt: bundle.createdAt,
      label: "Conjunto de productos",
      bundle,
    }));
    const query = search.trim().toLocaleLowerCase("es");
    return [...bundleRows, ...courseRows]
      .filter(
        (row) => !query || row.title.toLocaleLowerCase("es").includes(query),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
  }, [bundles, courses, search]);

  return (
    <div>
      <header className="mb-7 flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="font-serif text-4xl leading-none text-ink-900 md:text-5xl">
            Todos los productos
          </h1>
          <button
            type="button"
            onClick={() =>
              toast(
                "El orden de biblioteca se conectará a la vista de cliente.",
              )
            }
            className="mt-5 inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm text-ink-700 transition-colors hover:text-ink-900"
          >
            <ListIcon /> Ordenar biblioteca
          </button>
        </div>
        <button
          type="button"
          onClick={onNewProduct}
          className="btn-broadsheet min-h-11"
        >
          <span aria-hidden="true">＋</span> Nuevo producto
        </button>
      </header>

      <section
        className="rounded-2xl border border-ink-900/15 bg-cream-50 shadow-sm"
        aria-label="Listado de productos"
      >
        <div className="border-b border-ink-900/10 p-4">
          <label className="relative block max-w-sm">
            <span className="sr-only">Buscar productos</span>
            <SearchInlineIcon />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar..."
              className="min-h-11 w-full rounded-lg border border-ink-900/20 bg-white py-2 pl-10 pr-3 text-sm outline-none transition-colors focus:border-ink-900"
            />
          </label>
        </div>

        <div className="hidden grid-cols-[minmax(260px,2fr)_0.7fr_0.9fr_1fr_44px] gap-5 border-b border-ink-900/10 bg-ink-900/[0.025] px-5 py-4 text-xs font-medium text-ink-700 md:grid">
          <span>Título</span>
          <span>Miembros</span>
          <span>Creado</span>
          <span>Tipo</span>
          <span />
        </div>

        {isLoading ? (
          <p className="p-10 text-sm text-ink-500">Cargando productos…</p>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-xl text-ink-900">
              {search
                ? "No encontramos coincidencias"
                : "Crea tu primer producto vendible"}
            </p>
            <p className="mt-2 text-sm text-ink-500">
              {search
                ? "Prueba con otro título."
                : "Agrupa cursos para venderlos como un conjunto."}
            </p>
          </div>
        ) : (
          rows.map((row) => (
            <article
              key={`${row.type}-${row.id}`}
              className="grid gap-3 border-b border-ink-900/10 px-5 py-4 last:border-0 md:grid-cols-[minmax(260px,2fr)_0.7fr_0.9fr_1fr_44px] md:items-center md:gap-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex aspect-video w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink-900/15 bg-cream-200">
                  {row.thumbnail ? (
                    <img
                      src={row.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon />
                  )}
                </div>
                {row.type === "course" ? (
                  <Link
                    to={`/admin/cursos/${row.id}`}
                    className="truncate text-sm font-medium text-ink-900 underline-offset-4 hover:underline"
                  >
                    {row.title}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => onEditProduct(row.bundle)}
                    className="truncate text-left text-sm font-medium text-ink-900 underline-offset-4 hover:underline"
                  >
                    {row.title}
                  </button>
                )}
              </div>
              <p className="text-sm text-ink-700">
                <span className="md:hidden">Miembros: </span>
                {row.members}
              </p>
              <p className="text-sm text-ink-700">
                <span className="md:hidden">Creado: </span>
                {formatProductDate(row.createdAt)}
              </p>
              <div>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${row.type === "bundle" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-blue-300 bg-blue-50 text-blue-800"}`}
                >
                  {row.label}
                </span>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === `${row.type}-${row.id}`
                        ? null
                        : `${row.type}-${row.id}`,
                    )
                  }
                  aria-expanded={openMenuId === `${row.type}-${row.id}`}
                  aria-label={`Opciones de ${row.title}`}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-base text-ink-600 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40"
                >
                  •••
                </button>
                {openMenuId === `${row.type}-${row.id}` && (
                  <div
                    className="absolute right-0 top-11 z-30 w-52 overflow-hidden rounded-xl border border-ink-900/10 bg-white py-2 shadow-xl"
                    role="menu"
                  >
                    {row.type === "course" ? (
                      <>
                        <Link
                          to={`/admin/cursos/${row.id}`}
                          className="course-menu-item"
                          role="menuitem"
                        >
                          Editar producto
                        </Link>
                        <Link
                          to={`/admin/cursos/${row.id}/avance`}
                          className="course-menu-item"
                          role="menuitem"
                        >
                          Avance
                        </Link>
                        <Link
                          to={`/admin/cursos/${row.id}?tab=offers`}
                          className="course-menu-item"
                          role="menuitem"
                        >
                          Ofertas
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditProduct(row.bundle)}
                          className="course-menu-item w-full"
                          role="menuitem"
                        >
                          Editar producto
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicateProduct(row.bundle)}
                          className="course-menu-item w-full"
                          role="menuitem"
                        >
                          Duplicar
                        </button>
                        <div className="my-1 border-t border-ink-900/10" />
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`¿Eliminar “${row.title}”?`))
                              onDeleteProduct(row.id);
                          }}
                          className="course-menu-item w-full text-red-700"
                          role="menuitem"
                        >
                          Borrar
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </section>
      {children}
    </div>
  );
}

function ProductBundleDialog({
  value,
  courses,
  onClose,
  onSave,
}: {
  value: ProductBundle | null;
  courses: Course[];
  onClose: () => void;
  onSave: (bundle: ProductBundle) => void;
}) {
  const [form, setForm] = useState<ProductBundle>(
    () =>
      value ?? {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        thumbnail: "",
        courseIds: [],
        members: 0,
        price: 0,
        currency: "MXN",
        createdAt: new Date().toISOString(),
        status: "draft",
      },
  );
  const selectedCourses = courses.filter((course) =>
    form.courseIds.includes(String(course._id || course.id)),
  );
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
  const toggleCourse = (id: string) => {
    setForm({
      ...form,
      courseIds: form.courseIds.includes(id)
        ? form.courseIds.filter((item) => item !== id)
        : [...form.courseIds, id],
    });
  };
  const submit = () => {
    if (!form.title.trim())
      return toast.error("Escribe el nombre del producto");
    if (form.courseIds.length === 0)
      return toast.error("Selecciona al menos un curso");
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink-900/45 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-dialog-title"
    >
      <div className="mx-auto max-w-4xl rounded-2xl bg-cream-50 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-ink-900/10 p-6">
          <div>
            <h2
              id="product-dialog-title"
              className="font-serif text-3xl text-ink-900"
            >
              {value ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Agrupa varios cursos para venderlos como una sola oferta al
              cliente.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink-900/20 text-xl"
          >
            ×
          </button>
        </header>
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-5">
            <div>
              <label htmlFor="product-title" className="ink-label">
                Título del producto
              </label>
              <input
                id="product-title"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Ej. Biblioteca fiscal completa"
                className="ink-input bg-white"
              />
            </div>
            <div>
              <label htmlFor="product-description" className="ink-label">
                Descripción
              </label>
              <textarea
                id="product-description"
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Explica qué incluye este conjunto..."
                className="ink-input resize-y bg-white"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_130px]">
              <div>
                <label htmlFor="product-price" className="ink-label">
                  Precio
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: Number(event.target.value) })
                  }
                  className="ink-input bg-white"
                />
              </div>
              <div>
                <label htmlFor="product-currency" className="ink-label">
                  Moneda
                </label>
                <select
                  id="product-currency"
                  value={form.currency}
                  onChange={(event) =>
                    setForm({ ...form, currency: event.target.value })
                  }
                  className="ink-input bg-white"
                >
                  <option>MXN</option>
                  <option>USD</option>
                </select>
              </div>
            </div>
            <div>
              <p className="ink-label">Cursos incluidos</p>
              <div className="max-h-80 overflow-y-auto rounded-xl border border-ink-900/15 bg-white">
                {courses.map((course) => {
                  const id = String(course._id || course.id);
                  return (
                    <label
                      key={id}
                      className="flex cursor-pointer items-center gap-3 border-b border-ink-900/8 p-3 last:border-0 hover:bg-cream-100"
                    >
                      <input
                        type="checkbox"
                        checked={form.courseIds.includes(id)}
                        onChange={() => toggleCourse(id)}
                        className="h-4 w-4 accent-ink-900"
                      />
                      <span className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-cream-200">
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
                      <span className="min-w-0 text-sm font-medium text-ink-900">
                        {course.title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>
          <aside className="space-y-5">
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
              <p className="font-semibold text-ink-900">Miniatura</p>
              <div className="mt-4 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-cream-200">
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
              <label className="mt-4 inline-flex min-h-10 cursor-pointer items-center rounded-full border border-ink-900/20 px-4 text-xs">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={selectImage}
                  className="sr-only"
                />
                Seleccionar imagen
              </label>
            </div>
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
              <p className="font-semibold text-ink-900">Resumen</p>
              <p className="mt-3 text-sm text-ink-600">
                {selectedCourses.length} curso
                {selectedCourses.length === 1 ? "" : "s"} incluido
                {selectedCourses.length === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-sm text-ink-600">
                ${form.price.toLocaleString("es-MX")} {form.currency}
              </p>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as ProductBundle["status"],
                  })
                }
                className="ink-input mt-4 bg-white"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </aside>
        </div>
        <footer className="flex justify-end gap-3 border-t border-ink-900/10 p-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 cursor-pointer rounded-full border border-ink-900/20 px-5 text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            className="min-h-11 cursor-pointer rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream"
          >
            Guardar producto
          </button>
        </footer>
      </div>
    </div>
  );
}

function loadProductBundles(): ProductBundle[] {
  try {
    return JSON.parse(
      localStorage.getItem(PRODUCT_BUNDLES_KEY) ?? "[]",
    ) as ProductBundle[];
  } catch {
    return [];
  }
}

function formatProductDate(value?: string) {
  return value
    ? new Date(value).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
}

function SearchInlineIcon() {
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

function ListIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
      />
    </svg>
  );
}

const DRIVE_IMPORT_EXAMPLE = `{
  "status": "draft",
  "courses": [
    {
      "title": "Nombre del curso",
      "modules": [
        {
          "title": "Contenido",
          "lessons": [
            {
              "title": "Tema 1",
              "videoUrl": "https://drive.google.com/file/d/FILE_ID/preview"
            }
          ]
        }
      ]
    }
  ]
}`;

function DriveImportDialog({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [folderUrl, setFolderUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [value, setValue] = useState(DRIVE_IMPORT_EXAMPLE);
  const mutation = useMutation({
    mutationFn: importDriveCourses,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(
        `Importados ${result.createdCourses} cursos, ${result.createdModules} modulos y ${result.createdLessons} lecciones`,
      );
      onClose();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const submit = () => {
    const cleanUrl = folderUrl.trim();
    if (cleanUrl) {
      mutation.mutate({ folderUrl: cleanUrl, status });
      return;
    }

    if (!advancedOpen) {
      toast.error("Pega el link de una carpeta de Drive");
      return;
    }

    try {
      const payload = JSON.parse(value);
      mutation.mutate(payload);
    } catch {
      toast.error("El manifiesto no es JSON valido");
      return;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/45 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drive-import-title"
    >
      <div className="max-h-full w-full max-w-3xl overflow-y-auto rounded-2xl border border-ink-900/15 bg-cream-50 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-ink-900/10 p-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-ink-500">
              Google Drive
            </p>
            <h2 id="drive-import-title" className="mt-1 font-serif text-3xl text-ink-900">
              Importar cursos
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink-900/20 text-xl hover:border-ink-900"
            aria-label="Cerrar"
          >
            x
          </button>
        </div>
        <div className="p-6">
          <label htmlFor="drive-folder-url" className="ink-label">
            Link de carpeta de Drive
          </label>
          <input
            id="drive-folder-url"
            value={folderUrl}
            onChange={(event) => setFolderUrl(event.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            className="ink-input mt-2 min-h-12 bg-white"
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-ink-900/15 bg-white px-4">
              <input
                type="radio"
                checked={status === "draft"}
                onChange={() => setStatus("draft")}
                className="accent-ink-900"
              />
              <span className="text-sm text-ink-800">Importar como borrador</span>
            </label>
            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-ink-900/15 bg-white px-4">
              <input
                type="radio"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="accent-ink-900"
              />
              <span className="text-sm text-ink-800">Importar publicado</span>
            </label>
          </div>
          <p className="mt-3 text-xs leading-5 text-ink-500">
            La carpeta debe estar compartida y el backend debe tener GOOGLE_DRIVE_API_KEY. Cada subcarpeta se convierte en curso; sus subcarpetas se convierten en modulos y los videos en lecciones.
          </p>
          <button
            type="button"
            onClick={() => setAdvancedOpen((current) => !current)}
            className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 underline-offset-4 hover:underline"
          >
            {advancedOpen ? "Ocultar JSON avanzado" : "Usar JSON avanzado"}
          </button>
          {advancedOpen && (
            <div className="mt-4">
              <label htmlFor="drive-import-json" className="ink-label">
                Manifiesto JSON
              </label>
              <textarea
                id="drive-import-json"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                rows={14}
                spellCheck={false}
                className="ink-input mt-2 min-h-[280px] resize-y bg-white font-mono text-xs leading-5"
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-ink-900/10 p-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 cursor-pointer rounded-full border border-ink-900/20 px-5 text-sm hover:border-ink-900"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={mutation.isPending}
            className="min-h-11 cursor-pointer rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream disabled:opacity-60"
          >
            {mutation.isPending ? "Importando..." : "Importar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseCreationWizard({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<WizardStep>(1);
  const [draft, setDraft] = useState<CourseDraft>(INITIAL_DRAFT);

  const mutation = useMutation({
    mutationFn: async () => {
      const request = createCourse({
        title: draft.title.trim(),
        description: draft.description.trim(),
        shortDescription: draft.description.trim().slice(0, 180),
        thumbnail: draft.thumbnail,
        price: draft.isPaid ? draft.price : 0,
        currency: draft.currency,
        category: "General",
        status: "draft",
        courseType: draft.courseType,
        primaryColor: draft.primaryColor,
        accentColor: draft.accentColor,
      });
      const [course] = await Promise.all([
        request,
        new Promise((resolve) => window.setTimeout(resolve, 1200)),
      ]);
      return course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso creado correctamente");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setStep(4);
    },
  });

  const next = () => {
    if (step === 2 && (!draft.title.trim() || !draft.description.trim())) {
      toast.error("Completa el título y la descripción");
      return;
    }
    if (step === 4) {
      if (draft.isPaid && draft.price <= 0) {
        toast.error("Ingresa un precio mayor a cero");
        return;
      }
      setStep(5);
      mutation.mutate();
      return;
    }
    setStep((current) => Math.min(5, current + 1) as WizardStep);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-cream-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
    >
      <div className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-ink-900/10 bg-cream-50/95 px-5 backdrop-blur-sm md:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar asistente"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ink-900/20 transition-colors hover:border-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40"
          >
            ×
          </button>
          <div>
            <p className="text-xs font-semibold text-ink-900">Nuevo curso</p>
            <p className="text-[11px] text-ink-500">
              Paso {Math.min(step, 4)} de 4
            </p>
          </div>
        </div>
        <div className="hidden w-48 overflow-hidden rounded-full bg-ink-900/10 sm:block">
          <div
            className="h-1.5 bg-ink-900 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${Math.min(step, 4) * 25}%` }}
          />
        </div>
      </div>

      {step === 1 && <TypeStep draft={draft} setDraft={setDraft} />}
      {step === 2 && <DetailsStep draft={draft} setDraft={setDraft} />}
      {step === 3 && <AppearanceStep draft={draft} setDraft={setDraft} />}
      {step === 4 && <PriceStep draft={draft} setDraft={setDraft} />}
      {step === 5 && <CreatingStep title={draft.title} />}

      {step < 5 && (
        <footer className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-10 pt-2 md:px-8">
          <button
            type="button"
            onClick={() =>
              step === 1 ? onClose() : setStep((step - 1) as WizardStep)
            }
            className="min-h-11 cursor-pointer rounded-full border border-ink-900/20 px-5 text-sm transition-colors hover:border-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40"
          >
            {step === 1 ? "Cancelar" : "Atrás"}
          </button>
          <button
            type="button"
            onClick={next}
            className="min-h-11 cursor-pointer rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream transition-colors hover:bg-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 focus-visible:ring-offset-2"
          >
            {step === 4 ? "Crear curso" : "Siguiente"}
          </button>
        </footer>
      )}
    </div>
  );
}

type StepProps = { draft: CourseDraft; setDraft: (draft: CourseDraft) => void };

function TypeStep({ draft, setDraft }: StepProps) {
  const cohort = draft.courseType === "cohort";
  return (
    <WizardLayout preview={<CoursePreview draft={draft} />}>
      <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-ink-500">
        Tipo de producto
      </p>
      <h2
        id="wizard-title"
        className="font-serif text-3xl leading-tight text-ink-900 md:text-4xl"
      >
        ¿Qué tipo de curso quieres crear?
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink-600">
        Elige cómo avanzarán tus estudiantes. Podrás ajustar el contenido
        después.
      </p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <TypeButton
          selected={!cohort}
          title="Siempre disponible"
          subtitle="A su propio ritmo"
          icon={<LoopIcon />}
          onClick={() => setDraft({ ...draft, courseType: "evergreen" })}
        />
        <TypeButton
          selected={cohort}
          title="Por cohortes"
          subtitle="En grupo y con calendario"
          icon={<UsersIcon />}
          onClick={() => setDraft({ ...draft, courseType: "cohort" })}
        />
      </div>
      <div className="mt-8 rounded-2xl border border-ink-900/12 bg-white/70 p-5">
        <h3 className="font-serif text-xl text-ink-900">
          {cohort ? "Curso por cohortes" : "Curso siempre disponible"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          {cohort
            ? "Los alumnos avanzan juntos con fechas, sesiones y una experiencia compartida."
            : "Un programa accesible continuamente para que cada alumno aprenda cuando más le convenga."}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-ink-700">
          {(cohort
            ? [
                "Aprendizaje en grupo",
                "Sesiones programadas",
                "Calendario",
                "Comunidad",
                "Videos",
                "Certificados",
              ]
            : [
                "A su propio ritmo",
                "Videos",
                "Evaluaciones",
                "Comunidad",
                "Descargas",
                "Certificados",
              ]
          ).map((feature) => (
            <span key={feature} className="flex items-center gap-2">
              <CheckIcon />
              {feature}
            </span>
          ))}
        </div>
      </div>
    </WizardLayout>
  );
}

function DetailsStep({ draft, setDraft }: StepProps) {
  return (
    <WizardLayout preview={<CoursePreview draft={draft} />}>
      <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-ink-500">
        Información básica
      </p>
      <h2
        id="wizard-title"
        className="font-serif text-3xl leading-tight text-ink-900 md:text-4xl"
      >
        Detalles del curso
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink-600">
        Esta información será la primera presentación de tu curso.
      </p>
      <div className="mt-7 space-y-5">
        <div>
          <label htmlFor="course-title" className="ink-label">
            Título
          </label>
          <input
            id="course-title"
            autoFocus
            maxLength={100}
            value={draft.title}
            onChange={(event) =>
              setDraft({ ...draft, title: event.target.value })
            }
            placeholder="Ej. Estrategia fiscal para emprendedores"
            className="ink-input min-h-12 bg-white"
          />
        </div>
        <div>
          <label htmlFor="course-description" className="ink-label">
            Descripción breve
          </label>
          <textarea
            id="course-description"
            rows={6}
            maxLength={600}
            value={draft.description}
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
            placeholder="Cuenta qué aprenderán y para quién está diseñado..."
            className="ink-input resize-none bg-white font-sans"
          />
          <p className="mt-1 text-right text-xs text-ink-400">
            {draft.description.length}/600
          </p>
        </div>
      </div>
    </WizardLayout>
  );
}

function AppearanceStep({ draft, setDraft }: StepProps) {
  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen debe pesar menos de 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setDraft({ ...draft, thumbnail: String(reader.result) });
    reader.readAsDataURL(file);
  };
  return (
    <WizardLayout preview={<CoursePreview draft={draft} />}>
      <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-ink-500">
        Identidad visual
      </p>
      <h2
        id="wizard-title"
        className="font-serif text-3xl leading-tight text-ink-900 md:text-4xl"
      >
        Personaliza la apariencia
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink-600">
        Define los colores y la portada que verán tus estudiantes.
      </p>
      <div className="mt-7 space-y-4">
        <ColorField
          label="Color principal"
          description="Botones y enlaces"
          value={draft.primaryColor}
          onChange={(primaryColor) => setDraft({ ...draft, primaryColor })}
        />
        <ColorField
          label="Color de acento"
          description="Encabezados y detalles"
          value={draft.accentColor}
          onChange={(accentColor) => setDraft({ ...draft, accentColor })}
        />
        <div className="rounded-2xl border border-ink-900/15 bg-white p-5">
          <p className="font-medium text-ink-900">
            Imagen de portada{" "}
            <span className="font-normal text-ink-500">(opcional)</span>
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex aspect-video w-full max-w-[190px] items-center justify-center overflow-hidden rounded-xl bg-cream-200 text-ink-400">
              {draft.thumbnail ? (
                <img
                  src={draft.thumbnail}
                  alt="Vista previa de la portada"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon large />
              )}
            </div>
            <div>
              <p className="mb-3 text-xs leading-5 text-ink-500">
                Recomendado: 1280 × 720 px
                <br />
                JPG, PNG o WebP · máximo 2 MB
              </p>
              <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-ink-900/20 px-4 text-sm transition-colors hover:border-ink-900">
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
      </div>
    </WizardLayout>
  );
}

function PriceStep({ draft, setDraft }: StepProps) {
  return (
    <WizardLayout preview={<CoursePreview draft={draft} />}>
      <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-ink-500">
        Modelo de acceso
      </p>
      <h2
        id="wizard-title"
        className="font-serif text-3xl leading-tight text-ink-900 md:text-4xl"
      >
        Define el precio
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink-600">
        Puedes publicarlo gratis o cobrar un pago único mediante Stripe.
      </p>
      <div className="mt-7 grid grid-cols-2 gap-3">
        <TypeButton
          selected={!draft.isPaid}
          title="Gratis"
          subtitle="Sin pago"
          icon={<GiftIcon />}
          onClick={() => setDraft({ ...draft, isPaid: false, price: 0 })}
        />
        <TypeButton
          selected={draft.isPaid}
          title="De pago"
          subtitle="Pago único"
          icon={<MoneyIcon />}
          onClick={() => setDraft({ ...draft, isPaid: true })}
        />
      </div>
      {draft.isPaid && (
        <div className="mt-6 space-y-5 rounded-2xl border border-ink-900/12 bg-white p-5">
          <div>
            <label htmlFor="course-price" className="ink-label">
              Precio
            </label>
            <div className="flex">
              <span className="flex min-h-12 items-center rounded-l-lg border border-r-0 border-ink-900/20 bg-cream-100 px-4 text-sm">
                $
              </span>
              <input
                id="course-price"
                type="number"
                min="1"
                step="1"
                value={draft.price || ""}
                onChange={(event) =>
                  setDraft({ ...draft, price: Number(event.target.value) })
                }
                className="min-h-12 min-w-0 flex-1 border border-ink-900/20 bg-white px-3 outline-none focus:border-ink-900"
              />
              <select
                aria-label="Moneda"
                value={draft.currency}
                onChange={(event) =>
                  setDraft({ ...draft, currency: event.target.value })
                }
                className="rounded-r-lg border border-l-0 border-ink-900/20 bg-cream-100 px-3 text-sm outline-none"
              >
                <option>MXN</option>
                <option>USD</option>
              </select>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={draft.paywall}
              onChange={(event) =>
                setDraft({ ...draft, paywall: event.target.checked })
              }
              className="mt-1 h-4 w-4 accent-ink-900"
            />
            <span>
              <strong className="block text-sm text-ink-900">
                Habilitar contenido de muestra
              </strong>
              <span className="text-xs leading-5 text-ink-500">
                Permite probar algunas lecciones antes de comprar.
              </span>
            </span>
          </label>
          <div className="flex min-h-14 items-center gap-3 rounded-xl bg-cream-100 px-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <MoneyIcon />
            </span>
            <span>
              <strong className="block text-sm">Stripe</strong>
              <span className="text-xs text-ink-500">
                Tarjetas de débito y crédito
              </span>
            </span>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}

function CreatingStep({ title }: { title: string }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl flex-col items-center px-5 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-cream">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6 animate-spin motion-reduce:animate-none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeOpacity=".25"
            strokeWidth="3"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
      </div>
      <h2 id="wizard-title" className="mt-6 font-serif text-3xl text-ink-900">
        Creando “{title}”
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        Estamos preparando la estructura inicial de tu curso.
      </p>
      <div className="mt-10 w-full space-y-4 text-left">
        <ProgressCard label="Información del curso" />
        <ProgressCard label="Apariencia y portada" />
        <ProgressCard label="Configuración de acceso" />
      </div>
      <p className="mt-7 text-xs text-ink-500">Esto sólo tomará un momento.</p>
    </div>
  );
}

function WizardLayout({
  children,
  preview,
}: {
  children: ReactNode;
  preview: ReactNode;
}) {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 md:px-8 lg:grid-cols-[minmax(0,420px)_minmax(480px,1fr)] lg:gap-16 lg:py-14">
      <section>{children}</section>
      <aside className="hidden lg:block" aria-label="Vista previa del curso">
        {preview}
      </aside>
    </main>
  );
}

function CoursePreview({ draft }: { draft: CourseDraft }) {
  return (
    <div className="sticky top-28 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-[0_20px_55px_rgba(10,10,10,0.10)]">
      <div className="flex h-10 items-center gap-2 bg-ink-900/[0.07] px-4">
        <i className="h-2.5 w-2.5 rounded-full bg-ink-900/20" />
        <i className="h-2.5 w-2.5 rounded-full bg-ink-900/20" />
        <i className="h-2.5 w-2.5 rounded-full bg-ink-900/20" />
      </div>
      <div className="flex h-14 items-center justify-between border-b border-ink-900/8 px-8">
        <span className="h-2.5 w-20 rounded-full bg-ink-900/15" />
        <div className="flex gap-6">
          {[1, 2, 3, 4].map((item) => (
            <span key={item} className="h-2 w-12 rounded-full bg-ink-900/12" />
          ))}
        </div>
      </div>
      <div
        className="flex min-h-36 flex-col items-center justify-center px-8 text-center text-white"
        style={{ backgroundColor: draft.accentColor }}
      >
        <h3 className="font-serif text-2xl">
          {draft.title || "Título de tu curso"}
        </h3>
        <p className="mt-2 max-w-md text-xs opacity-75">
          {draft.description ||
            "Una descripción breve que explica lo que aprenderán tus estudiantes."}
        </p>
      </div>
      <div className="grid grid-cols-[1fr_180px] gap-8 p-8">
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-4">
              <span className="h-16 w-24 shrink-0 rounded-lg bg-ink-900/10" />
              <span className="flex-1 space-y-2 pt-1">
                <i className="block h-2.5 w-2/3 rounded-full bg-ink-900/15" />
                <i className="block h-2 w-full rounded-full bg-ink-900/10" />
                <i className="block h-2 w-3/4 rounded-full bg-ink-900/10" />
              </span>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl bg-ink-900/8">
          {draft.thumbnail ? (
            <img
              src={draft.thumbnail}
              alt=""
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div className="aspect-video w-full bg-ink-900/10" />
          )}
          <div className="space-y-3 p-4">
            <i className="block h-2.5 w-2/3 rounded-full bg-ink-900/20" />
            <button
              type="button"
              tabIndex={-1}
              className="h-9 w-full rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: draft.primaryColor }}
            >
              Comenzar curso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeButton({
  selected,
  title,
  subtitle,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-[88px] cursor-pointer rounded-2xl border bg-white p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 ${selected ? "border-ink-900 ring-2 ring-ink-900" : "border-ink-900/15 hover:border-ink-900/50"}`}
    >
      <span className="flex items-center gap-3">
        <span className="text-ink-700">{icon}</span>
        <span>
          <strong className="block text-sm text-ink-900">{title}</strong>
          <small className="mt-1 block text-xs text-ink-500">{subtitle}</small>
        </span>
      </span>
    </button>
  );
}

function ColorField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-h-20 cursor-pointer items-center justify-between rounded-2xl border border-ink-900/15 bg-white px-5">
      <span>
        <strong className="block text-sm text-ink-900">{label}</strong>
        <small className="mt-1 block text-xs text-ink-500">{description}</small>
      </span>
      <span
        className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(10,10,10,.2)]"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="absolute -inset-2 h-16 w-16 cursor-pointer opacity-0"
        />
      </span>
    </label>
  );
}

function ProgressCard({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-ink-900">
        <CheckIcon />
        {label}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-900/10">
        <div className="h-full w-5/6 animate-pulse rounded-full bg-ink-900 motion-reduce:animate-none" />
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4 shrink-0 text-emerald-700"
    >
      <circle cx="10" cy="10" r="8" fill="currentColor" />
      <path
        d="m6.5 10 2.2 2.2 4.8-5"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
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
function LoopIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        d="M19 8a7 7 0 0 0-12-2L5 8m0 0V4m0 4h4M5 16a7 7 0 0 0 12 2l2-2m0 0v4m0-4h-4"
      />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="9" cy="8" r="3" />
      <path
        strokeLinecap="round"
        d="M3 19a6 6 0 0 1 12 0m1-13a3 3 0 0 1 0 6m2 2a5 5 0 0 1 3 5"
      />
    </svg>
  );
}
function GiftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path
        d="M4 10h16v10H4zM3 6h18v4H3zM12 6v14M12 6H8.5a2 2 0 1 1 2-2c0 1.2 1.5 2 1.5 2Zm0 0h3.5a2 2 0 1 0-2-2c0 1.2-1.5 2-1.5 2Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MoneyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        d="M15 8.5c-.7-.7-1.7-1-3-1-1.7 0-3 .8-3 2s1.1 1.8 3 2.5 3 1.3 3 2.5-1.3 2-3 2c-1.3 0-2.4-.4-3-1M12 5.5v13"
      />
    </svg>
  );
}
