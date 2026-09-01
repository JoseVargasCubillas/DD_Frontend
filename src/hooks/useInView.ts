import { useEffect, useRef, useState } from 'react';

export function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setInView(true); return; }

    const fallback = window.setTimeout(() => setInView(true), 900);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.clearTimeout(fallback);
          setInView(true);
        } else if (entry.intersectionRatio === 0) {
          // Only reset when completely off-screen (no mid-scroll flicker)
          setInView(false);
        }
      },
      { rootMargin: '0px 0px 16% 0px', threshold: [0, threshold] }
    );

    observer.observe(el);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, inView } as const;
}
