export default function ManageBlog() {
  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-2">Sección · Editorial</p>
          <h1 className="font-serif text-4xl text-ink-900">Blog</h1>
          <p className="font-serif italic text-ink-600 mt-1">Editoriales, análisis y notas de la columna.</p>
        </div>
        <button className="text-[11px] uppercase tracking-[0.32em] bg-ink-900 text-cream px-6 py-3 hover:tracking-[0.42em] transition-all cursor-pointer">
          + Nuevo artículo
        </button>
      </header>
      <div className="h-px bg-ink-900/30" />

      <div className="bg-cream-100 border border-ink-900/15 px-6 py-16 text-center">
        <p className="font-serif italic text-ink-600 max-w-md mx-auto">
          La gestión editorial estará disponible en la próxima edición. Mientras tanto,
          puedes esbozar tu artículo en otra herramienta.
        </p>
      </div>
    </div>
  );
}

