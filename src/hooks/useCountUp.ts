import { useEffect, useRef } from 'react';

// Animates a <span> from 0 to `target` each time it enters the viewport.
// Cancels and resets to 0 when element leaves, so it replays on re-entry.
export function useCountUp(target: number, suffix = '', duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId: number | null = null;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
          el.textContent = '0' + suffix;
          return;
        }

        if (prm) {
          el.textContent = String(target) + suffix;
          return;
        }

        const t0 = performance.now();
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);

        function tick(now: number) {
          const p = Math.min(1, (now - t0) / duration);
          el!.textContent = String(Math.round(target * ease(p))) + suffix;
          if (p < 1) rafId = requestAnimationFrame(tick);
          else rafId = null;
        }

        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [target, suffix, duration]);

  return ref;
}
