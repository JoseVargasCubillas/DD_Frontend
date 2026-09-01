import { useEffect, useRef, useState, type RefObject } from 'react';

const GESTURE_EVENTS: (keyof WindowEventMap)[] = [
  'pointerdown',
  'touchstart',
  'wheel',
  'scroll',
  'keydown',
  'click',
];

/**
 * Autoplay-friendly video controller shared por Academia, Home y EstrategiaFiscal.
 *
 * - Arranca el video en `muted=true, autoplay, loop, playsInline` (los navegadores
 *   solo permiten autoplay sin sonido antes del primer gesto del usuario).
 * - Escucha `pointerdown`, `touchstart`, `wheel`, `scroll`, `keydown` y `click`
 *   en `window`. En cuanto ocurre CUALQUIERA de esos gestos, el hook quita el
 *   mute, sube el volumen y llama `.play()` de nuevo.
 * - Devuelve `[muted, toggleMute]` para poder pintar un botón de bocina opcional.
 *
 * Uso:
 *   const ref = useRef<HTMLVideoElement>(null);
 *   const [muted, toggleMute] = useAutoUnmuteOnGesture(ref);
 */
export function useAutoUnmuteOnGesture(
  ref: RefObject<HTMLVideoElement>,
): [boolean, () => void, { isPlaying: boolean; needsUserPlay: boolean }] {
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);
  const unlockedRef = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const markPlaying = () => {
      setIsPlaying(true);
      setNeedsUserPlay(false);
    };
    const markPaused = () => setIsPlaying(false);

    // Asegura el estado inicial que hace legal el autoplay.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    video.addEventListener('playing', markPlaying);
    video.addEventListener('pause', markPaused);
    video.addEventListener('ended', markPaused);

    // Intento inicial de play (algunos navegadores ignoran `autoplay` si el
    // elemento se rehidrata tarde).
    void video.play().catch(() => setNeedsUserPlay(true));

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const v = ref.current;
        if (!v || !v.paused) return;
        v.muted = true;
        setMuted(true);
        void v.play().catch(() => setNeedsUserPlay(true));
      },
      { threshold: 0.25 },
    );
    visibilityObserver.observe(video);

    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;

      const v = ref.current;
      if (v) {
        v.muted = false;
        v.defaultMuted = false;
        v.volume = 1;
        setMuted(false);
        void v.play().catch(() => {
          // Si el navegador aún así rechaza el play con audio, deja el video
          // corriendo muted para no romper la experiencia.
          v.muted = true;
          setMuted(true);
          void v.play().catch(() => setNeedsUserPlay(true));
        });
      }

      GESTURE_EVENTS.forEach((evt) => window.removeEventListener(evt, unlock));
    };

    GESTURE_EVENTS.forEach((evt) =>
      window.addEventListener(evt, unlock, { passive: true }),
    );

    return () => {
      visibilityObserver.disconnect();
      video.removeEventListener('playing', markPlaying);
      video.removeEventListener('pause', markPaused);
      video.removeEventListener('ended', markPaused);
      GESTURE_EVENTS.forEach((evt) => window.removeEventListener(evt, unlock));
    };
  }, [ref]);

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    if (!next) v.volume = 1;
    setMuted(next);
    void v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      setNeedsUserPlay(true);
    });
  };

  return [muted, toggleMute, { isPlaying, needsUserPlay }];
}
