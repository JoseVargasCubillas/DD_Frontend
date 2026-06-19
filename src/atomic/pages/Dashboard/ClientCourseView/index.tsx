import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchOutline, MOCK_PRODUCTS } from '@utils/mock-data';

export default function ClientCourseView() {
  const { productId = 'p1' } = useParams();
  const [currentLesson, setCurrentLesson] = useState<{ moduleId: string; lessonId: string; title: string } | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) ?? MOCK_PRODUCTS[0];
  const { data: modules = [] } = useQuery({ queryKey: ['outline', productId], queryFn: () => fetchOutline(productId) });

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progress = totalLessons === 0 ? 0 : Math.round((completed.size / totalLessons) * 100);

  const current = currentLesson ?? (modules[0]?.lessons[0]
    ? { moduleId: modules[0].id, lessonId: modules[0].lessons[0].id, title: modules[0].lessons[0].title }
    : null);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-cream-50">
      <aside className="w-72 bg-ink-900 text-white shrink-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        <div className="px-5 py-4 border-b border-ink-700 sticky top-0 bg-ink-900 z-10">
          <Link to="/mi-cuenta" className="text-[10px] uppercase tracking-[0.2em] text-ink-300 hover:text-white inline-flex items-center gap-1">‹ Dashboard</Link>
          <h2 className="font-heading font-bold uppercase tracking-wider text-sm mt-2">{product.title}</h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-ink-700 flex items-center justify-center text-[10px] font-bold">JV</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Julián Vargas</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400">{progress}% completo</p>
            </div>
          </div>
          <div className="mt-3 h-1 bg-ink-700">
            <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <nav className="p-2">
          {modules.map((m) => (
            <div key={m.id} className="mb-3">
              <p className="px-3 py-2 text-[10px] uppercase tracking-[0.3em] font-bold text-ink-300">{m.title}</p>
              <div className="flex flex-col">
                {m.lessons.map((l) => {
                  const active = current?.lessonId === l.id;
                  const done = completed.has(l.id);
                  return (
                    <button key={l.id}
                      onClick={() => setCurrentLesson({ moduleId: m.id, lessonId: l.id, title: l.title })}
                      className={`flex items-center gap-2 px-3 py-2 text-left text-xs cursor-pointer transition-colors ${
                        active ? 'bg-white text-ink-900 font-semibold' : 'text-ink-200 hover:bg-ink-800 hover:text-white'
                      }`}>
                      <svg className={`w-3.5 h-3.5 shrink-0 ${done ? 'text-brand-500' : ''}`} viewBox="0 0 24 24" fill={done ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        {done
                          ? <path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
                          : <circle cx="12" cy="12" r="10" />}
                      </svg>
                      <span className="flex-1 truncate">{l.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="bg-ink-900">
          <div className="aspect-video max-w-5xl mx-auto bg-black flex items-center justify-center text-white relative">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto opacity-70" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20" /></svg>
              <p className="font-serif italic mt-4 text-ink-300">{current?.title ?? 'Selecciona una lección'}</p>
            </div>
            <div className="absolute top-4 right-4 w-32 aspect-video bg-ink-800 border border-ink-600" aria-label="Cámara expositor" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-10">
          <p className="section-label text-ink-500">Lección actual</p>
          <h1 className="font-heading text-3xl font-bold mt-2">{current?.title ?? '—'}</h1>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => current && setCompleted((prev) => { const next = new Set(prev); next.has(current.lessonId) ? next.delete(current.lessonId) : next.add(current.lessonId); return next; })}
              className="btn-primary">
              {current && completed.has(current.lessonId) ? 'Marcar como pendiente' : 'Completar lección'}
            </button>
            <p className="text-sm text-ink-500 ml-auto">61 minutos</p>
          </div>

          <div className="mt-10 border-t border-cream-300 pt-8">
            <h3 className="font-heading text-xl font-bold">Comentarios</h3>
            <textarea placeholder="Cuéntanos qué opinas…" className="input-cream mt-4 h-28" />
            <button className="btn-secondary mt-3">Publicar comentario</button>
          </div>
        </div>
      </div>
    </div>
  );
}
