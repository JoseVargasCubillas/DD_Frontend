import { useEffect, useState } from 'react';

/**
 * Devuelve un timestamp que refresca cada `intervalMs` (default: 30s).
 * Úsalo como dep en `useMemo` cuando quieras que una selección basada en
 * el reloj (p. ej. "próximo evento upcoming") se recompute con el paso
 * del tiempo, sin depender de props externas.
 */
export function useNowTick(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
