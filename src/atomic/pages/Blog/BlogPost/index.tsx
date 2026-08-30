import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as blogApi from '@api/blog.api';
import Spinner from '@atoms/Spinner';
import { formatDate } from '@utils/formatters';
import { useNextCalendarEvent } from '@hooks/useNextCalendarEvent';
import { getCalendarEventPath } from '@utils/eventCalendar';
import { getEventImage } from '@utils/eventImages';
import { findStaticBlogPost, formatStaticBlogDate, STATIC_BLOG_POSTS } from '@/data/blogPosts';

const border = 'border-ink-900/10';
const mono = 'font-mono text-[11px] uppercase tracking-[0.18em] text-ink-900/45';

function useCountdown(targetMs: number | null) {
  const calc = () => {
    if (!targetMs) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diff = targetMs - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return time;
}

const monthShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const formatEventDate = (iso?: string) => {
  if (!iso) return '15 Jun 2026 · WTC CDMX';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')} ${monthShort[d.getMonth()]} ${d.getFullYear()}`;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const localPost = slug ? findStaticBlogPost(slug) : undefined;

  const { data: remotePost, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogApi.getPostBySlug(slug!),
    enabled: !!slug && !localPost,
    retry: false,
  });

  const nextEvent = useNextCalendarEvent();

  const eventTargetMs = useMemo<number | null>(() => {
    if (!nextEvent?.startDate) return null;
    const ms = new Date(nextEvent.startDate).getTime();
    return Number.isFinite(ms) ? ms : null;
  }, [nextEvent?.startDate]);

  const countdown = useCountdown(eventTargetMs);
  const eventHref = getCalendarEventPath(nextEvent);
  const eventTitle = nextEvent.title;
  const eventDateLabel = `${formatEventDate(nextEvent.startDate)}${nextEvent.location ? ` · ${nextEvent.location}` : ''}`;
  const eventImage = getEventImage(nextEvent);

  if (!localPost && isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!localPost && !remotePost) {
    return (
      <div className="container-app py-24 text-center">
        <p className={mono}>— 404</p>
        <h1 className="mt-4 font-serif text-[42px] leading-tight">Artículo no encontrado.</h1>
        <Link to="/blog" className="mt-8 inline-block border-b border-ink-900 pb-1 font-mono text-[11px] uppercase tracking-[0.16em]">
          ← Volver al blog
        </Link>
      </div>
    );
  }

  // Datos unificados (registry local o API)
  const title = localPost?.title ?? remotePost?.title ?? '';
  const image = localPost?.image ?? remotePost?.thumbnail;
  const publishedAt = localPost?.publishedAt ?? remotePost?.publishedAt ?? '';
  const displayDate = localPost ? formatStaticBlogDate(localPost.publishedAt) : (publishedAt ? formatDate(publishedAt) : '');
  const readTime = localPost?.readTimeMin ?? remotePost?.readTime;
  const tag = localPost?.tag ?? (remotePost as { tag?: string } | undefined)?.tag ?? 'Ensayo';
  const excerpt = localPost?.excerpt ?? (remotePost as { excerpt?: string } | undefined)?.excerpt;
  const authorName = localPost?.author.name
    ?? (typeof remotePost?.author === 'object' ? remotePost?.author?.name : undefined)
    ?? 'Diego Díaz';
  const authorRole = localPost?.author.role;
  const html = localPost?.html ?? remotePost?.content ?? '';
  const tags = localPost?.tags ?? [];

  // Sugerencias: otros 3 posts del registry (excluye el actual)
  const suggestions = STATIC_BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="bg-cream-50 text-ink-900">
      {/* ── Hero ─────────────────────────────────── */}
      <section className={`container-app border-b ${border} py-10`}>
        <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 border-b ${border} pb-4 ${mono}`}>
          <Link to="/blog" className="hover:text-ink-900">← El Estratega Diario</Link>
          <span>· {tag}</span>
          <span className="md:ml-auto">{displayDate}{readTime ? ` · ${readTime} min lectura` : ''}</span>
        </div>

        <h1 className="mt-10 max-w-[900px] font-serif text-[clamp(38px,5.4vw,74px)] font-normal leading-[0.95] tracking-[-0.045em]">
          {title}
        </h1>

        {excerpt && (
          <p className="mt-6 max-w-[720px] font-serif text-[19px] italic leading-[1.5] text-ink-900/62">
            {excerpt}
          </p>
        )}

        <div className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t ${border} pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-900/48`}>
          <span>— {authorName}</span>
          {authorRole && <span className="normal-case tracking-normal text-ink-900/45">{authorRole}</span>}
        </div>
      </section>

      {/* ── Portada ─────────────────────────────── */}
      {image && (
        <section className={`container-app border-b ${border} py-10`}>
          <img
            src={image}
            alt={title}
            className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
          />
        </section>
      )}

      {/* ── Contenido + sidebar ─────────────────── */}
      <section className={`container-app grid gap-14 border-b ${border} py-16 lg:grid-cols-[minmax(0,1fr)_310px]`}>
        <article
          className="prose prose-lg max-w-none font-serif text-[17px] leading-[1.72] text-ink-900/80
                     prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-[-0.02em] prose-headings:text-ink-900
                     prose-h2:mt-12 prose-h2:text-[30px]
                     prose-h3:mt-10 prose-h3:text-[22px]
                     prose-p:my-5
                     prose-blockquote:border-l-ink-900 prose-blockquote:not-italic prose-blockquote:text-ink-900/70
                     prose-strong:text-ink-900 prose-em:text-ink-900
                     prose-a:text-ink-900 prose-a:underline prose-a:decoration-ink-900/30 hover:prose-a:decoration-ink-900
                     prose-ul:my-5 prose-ol:my-5 prose-li:my-1
                     [&_.lead]:font-serif [&_.lead]:text-[22px] [&_.lead]:leading-[1.45] [&_.lead]:text-ink-900 [&_.lead]:mt-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <aside className="space-y-6 lg:pt-2">
          {tags.length > 0 && (
            <div className={`border ${border} p-6`}>
              <p className={mono}>— Temas</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className={`border ${border} px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-900/60`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-ink-900 p-6 text-white">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">— Próximo evento</p>
            <h3 className="mt-5 font-serif text-[26px] leading-[0.98]">{eventTitle}</h3>
            <img
              src={eventImage}
              alt={eventTitle}
              className="mt-5 aspect-square w-full object-cover"
            />
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
              {eventDateLabel}
            </p>
            <div className="mt-4 grid grid-cols-4 border border-white/15">
              {[
                { value: countdown.days, label: 'días' },
                { value: countdown.hours, label: 'hrs' },
                { value: countdown.minutes, label: 'min' },
                { value: countdown.seconds, label: 'seg' },
              ].map((item) => (
                <div key={item.label} className="border-r border-white/15 p-3 text-center last:border-r-0">
                  <span className="block font-serif text-[22px] leading-none">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to={eventHref}
              className="mt-5 block bg-white px-5 py-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ink-900 transition-colors hover:bg-cream-200"
            >
              Reservar lugar →
            </Link>
          </div>

          <div className={`border ${border} p-6`}>
            <p className={mono}>— Autor</p>
            <p className="mt-4 font-serif text-[20px] leading-[1.2]">{authorName}</p>
            {authorRole && <p className="mt-2 text-[12px] leading-[1.5] text-ink-900/58">{authorRole}</p>}
          </div>
        </aside>
      </section>

      {/* ── Sugerencias ─────────────────────────── */}
      {suggestions.length > 0 && (
        <section className="border-t border-ink-900/10 bg-cream-100 py-16 lg:py-20">
          <div className="container-app">
            <div className={`flex items-end justify-between border-b ${border} pb-6`}>
              <h2 className="font-serif text-[34px] font-normal leading-none">
                Continúa <em className="font-normal">leyendo.</em>
              </h2>
              <Link to="/blog" className={mono}>Ver todos →</Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {suggestions.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className={`group block border ${border} bg-cream-50 p-6 transition-colors hover:bg-ink-900 hover:text-white`}>
                  <img src={post.image} alt={post.title} className="h-[180px] w-full object-cover transition duration-300 group-hover:grayscale" />
                  <p className={`mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-900/45 group-hover:text-white/50`}>
                    — {post.tag} · {formatStaticBlogDate(post.publishedAt)}
                  </p>
                  <h3 className="mt-3 font-serif text-[22px] leading-[1.1] tracking-[-0.02em]">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.55] text-ink-900/58 group-hover:text-white/64">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
