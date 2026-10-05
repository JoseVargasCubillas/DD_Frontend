import {
  currentMonthValue,
  formatDatePeriodLabel,
  toLocalDateInput,
  type DatePeriod,
} from '@utils/datePeriod';

interface DatePeriodFilterProps {
  value: DatePeriod;
  onChange: (value: DatePeriod) => void;
  idPrefix: string;
}

export default function DatePeriodFilter({
  value,
  onChange,
  idPrefix,
}: DatePeriodFilterProps) {
  const today = new Date();
  const fallbackFrom = toLocalDateInput(new Date(today.getFullYear(), today.getMonth(), 1));
  const fallbackTo = toLocalDateInput(today);

  return (
    <div className="flex flex-wrap items-end gap-3" aria-label="Periodo del reporte">
      <div className="flex min-h-11 overflow-hidden rounded-lg border border-ink-900/20 text-sm">
        <button
          type="button"
          onClick={() =>
            onChange({
              mode: 'month',
              month: value.mode === 'month' ? value.month : currentMonthValue(),
            })
          }
          aria-pressed={value.mode === 'month'}
          className={`cursor-pointer px-4 font-semibold transition-colors ${
            value.mode === 'month'
              ? 'bg-ink-900 text-cream'
              : 'bg-white text-ink-700 hover:bg-cream-100'
          }`}
        >
          Por mes
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({
              mode: 'range',
              from: value.mode === 'range' ? value.from : fallbackFrom,
              to: value.mode === 'range' ? value.to : fallbackTo,
            })
          }
          aria-pressed={value.mode === 'range'}
          className={`cursor-pointer border-l border-ink-900/20 px-4 font-semibold transition-colors ${
            value.mode === 'range'
              ? 'bg-ink-900 text-cream'
              : 'bg-white text-ink-700 hover:bg-cream-100'
          }`}
        >
          Rango
        </button>
      </div>

      {value.mode === 'month' ? (
        <label className="grid gap-1 text-xs font-semibold text-ink-600" htmlFor={`${idPrefix}-month`}>
          Mes del reporte
          <input
            id={`${idPrefix}-month`}
            type="month"
            value={value.month}
            onChange={(event) => onChange({ mode: 'month', month: event.target.value })}
            className="min-h-11 cursor-pointer rounded-lg border border-ink-900/20 bg-white px-3 text-sm font-normal text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10"
          />
        </label>
      ) : (
        <>
          <label className="grid gap-1 text-xs font-semibold text-ink-600" htmlFor={`${idPrefix}-from`}>
            Desde
            <input
              id={`${idPrefix}-from`}
              type="date"
              value={value.from}
              max={value.to || undefined}
              onChange={(event) => onChange({ ...value, from: event.target.value })}
              className="min-h-11 cursor-pointer rounded-lg border border-ink-900/20 bg-white px-3 text-sm font-normal text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-ink-600" htmlFor={`${idPrefix}-to`}>
            Hasta
            <input
              id={`${idPrefix}-to`}
              type="date"
              value={value.to}
              min={value.from || undefined}
              onChange={(event) => onChange({ ...value, to: event.target.value })}
              className="min-h-11 cursor-pointer rounded-lg border border-ink-900/20 bg-white px-3 text-sm font-normal text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10"
            />
          </label>
        </>
      )}

      <p className="min-h-11 self-end rounded-lg bg-ink-900/5 px-4 py-3 text-sm capitalize text-ink-600">
        {formatDatePeriodLabel(value)}
      </p>
    </div>
  );
}
