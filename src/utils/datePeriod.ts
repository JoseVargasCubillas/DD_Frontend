export type DatePeriod =
  | { mode: 'month'; month: string }
  | { mode: 'range'; from: string; to: string };

export const toLocalDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const currentMonthValue = (): string => toLocalDateInput(new Date()).slice(0, 7);

export const defaultDatePeriod = (): DatePeriod => ({
  mode: 'month',
  month: currentMonthValue(),
});

export const getDatePeriodBounds = (
  period: DatePeriod,
): { start: Date; end: Date } | null => {
  if (period.mode === 'month') {
    const [year, month] = period.month.split('-').map(Number);
    if (!year || !month) return null;
    return {
      start: new Date(year, month - 1, 1, 0, 0, 0, 0),
      end: new Date(year, month, 0, 23, 59, 59, 999),
    };
  }

  if (!period.from || !period.to) return null;
  const start = new Date(`${period.from}T00:00:00`);
  const end = new Date(`${period.to}T23:59:59.999`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return null;
  }
  return { start, end };
};

export const isDateInPeriod = (value: string, period: DatePeriod): boolean => {
  const bounds = getDatePeriodBounds(period);
  if (!bounds) return false;
  const date = new Date(value);
  const timestamp = date.getTime();
  return (
    !Number.isNaN(timestamp) &&
    timestamp >= bounds.start.getTime() &&
    timestamp <= bounds.end.getTime()
  );
};

export const formatDatePeriodLabel = (period: DatePeriod): string => {
  const bounds = getDatePeriodBounds(period);
  if (!bounds) return 'Selecciona un periodo válido';

  if (period.mode === 'month') {
    return new Intl.DateTimeFormat('es-MX', {
      month: 'long',
      year: 'numeric',
    }).format(bounds.start);
  }

  const formatter = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${formatter.format(bounds.start)} – ${formatter.format(bounds.end)}`;
};

export const enumeratePeriodDays = (period: DatePeriod): Date[] => {
  const bounds = getDatePeriodBounds(period);
  if (!bounds) return [];

  const result: Date[] = [];
  const cursor = new Date(bounds.start);
  while (cursor <= bounds.end && result.length < 370) {
    result.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
};
