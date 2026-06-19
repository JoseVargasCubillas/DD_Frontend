import { useEffect, useRef } from 'react';

// Adds/removes 'in' and 'play' classes via classList on IntersectionObserver.
// Replays every time the element re-enters the viewport.
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.18) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in', 'play');
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in', 'play');
        } else {
          el.classList.remove('in', 'play');
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}

// Hero animations: fires on page load (timeout) and replays when scrolled back into view.
export function useHeroReveal<T extends HTMLElement = HTMLDivElement>(delay = 120) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('play');
      return;
    }

    let tid: ReturnType<typeof setTimeout> | null = null;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tid = setTimeout(() => el.classList.add('play'), delay);
        } else {
          if (tid !== null) { clearTimeout(tid); tid = null; }
          el.classList.remove('play');
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (tid !== null) clearTimeout(tid);
    };
  }, [delay]);

  return ref;
}
