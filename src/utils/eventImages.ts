/**
 * Devuelve el asset local que mejor representa un evento del calendario según
 * su slug/título. Sirve para las tarjetas laterales de "próximo evento" en el
 * blog cuando el evento no trae `thumbnail` desde el backend.
 */
import type { CalendarEventSummary } from '@utils/eventCalendar';

import satDigital from '../../assets/ddweb/sat-cumplimiento-digital.jpg';
import sefCdmx from '../../assets/ddweb/SEF.jpg';
import reforma from '../../assets/ddweb/reforma-fiscal-2026.jpg';
import diegoAjedrez from '../../assets/ddweb/diego-ajedrez.jpg';
import ponente from '../../assets/ddweb/figma-ponente-diego.png';
import alianza from '../../assets/ddweb/alianza-empresarial.jpg';
import equipoUnido from '../../assets/ddweb/equipo-unido.jpg';
import diegoHero from '../../assets/ddweb/figma-diego-hero.png';
import comoCobrarCeo from '../../assets/eventos/fondo-como-cobrar-ceo.png';

export function getEventImage(
  event?: Pick<CalendarEventSummary, 'slug' | 'title'> | null,
): string {
  if (!event) return reforma;
  const key = `${event.slug ?? ''} ${event.title ?? ''}`.toLowerCase();

  if (key.includes('estrategia-fiscal') || key.includes('estrategia fiscal')) return sefCdmx;
  if (key.includes('como-cobrar') || key.includes('como cobrar') || key.includes('cobrar como ceo')) return comoCobrarCeo;
  if (key.includes('holding')) return reforma;
  if (key.includes('persona-fisica') || key.includes('persona física')) return satDigital;
  if (key.includes('mentalidad')) return diegoAjedrez;
  if (key.includes('prospecc')) return ponente;
  if (key.includes('mastermind') || key.includes('panama') || key.includes('panamá')) return alianza;
  if (key.includes('coaching') || key.includes('liderazgo')) return equipoUnido;
  if (key.includes('rockefeller') || key.includes('4e')) return diegoHero;
  if (key.includes('maestria') || key.includes('maestría') || key.includes('escenica') || key.includes('escénica')) return ponente;

  return reforma;
}
