import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function animateCounter(el: HTMLElement) {
  const target = Number(el.dataset.motionCount ?? el.textContent?.replace(/[^\d]/g, '') ?? 0);
  const prefix = el.dataset.motionPrefix ?? '';
  const suffix = el.dataset.motionSuffix ?? '';
  const duration = Number(el.dataset.motionDuration ?? 1600);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!Number.isFinite(target)) return;

  if (prefersReduced) {
    el.textContent = `${prefix}${target}${suffix}`;
    return;
  }

  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    el.textContent = `${prefix}${Math.round(target * ease(progress))}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export default function GlobalMotion() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-motion-root]');
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cleanupObservers: (() => void) | undefined;
    const raf = window.requestAnimationFrame(() => {
      root.querySelectorAll<HTMLElement>('section').forEach((section) => {
        if (
          section.classList.contains('no-motion') ||
          section.classList.contains('fade-up') ||
          section.classList.contains('hero-reveal') ||
          section.classList.contains('motion-section')
        ) {
          return;
        }
        section.classList.add('motion-section');
      });

      root.querySelectorAll<HTMLElement>('.stagger-grid').forEach((grid) => {
        Array.from(grid.children).forEach((child, index) => {
          const item = child as HTMLElement;
          if (!item.dataset.s) item.dataset.s = String(Math.min(index, 7));
        });
      });

      if (prefersReduced) {
        root
          .querySelectorAll<HTMLElement>('.hero-reveal, .fade-up, .motion-section, .section-header, .stagger-grid')
          .forEach((el) => el.classList.add('in', 'play'));
        root.querySelectorAll<HTMLElement>('[data-motion-count]').forEach(animateCounter);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            if (!entry.isIntersecting) {
              if (el.classList.contains('hero-reveal')) el.classList.remove('play');
              return;
            }

            el.classList.add('in');
            if (el.classList.contains('hero-reveal')) {
              window.setTimeout(() => el.classList.add('play'), 120);
              return;
            }

            observer.unobserve(el);
          });
        },
        { threshold: 0.14 },
      );

      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target as HTMLElement);
            counterObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.4 },
      );

      root
        .querySelectorAll<HTMLElement>('.hero-reveal, .fade-up, .motion-section, .section-header, .stagger-grid')
        .forEach((el) => observer.observe(el));
      root.querySelectorAll<HTMLElement>('[data-motion-count]').forEach((el) => counterObserver.observe(el));

      cleanupObservers = () => {
        observer.disconnect();
        counterObserver.disconnect();
      };
    });

    return () => {
      window.cancelAnimationFrame(raf);
      cleanupObservers?.();
    };
  }, [pathname]);

  return null;
}
