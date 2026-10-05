interface EstrategiaFiscalCard {
  to: string;
  rawDate?: string;
}

const ESTRATEGIA_FISCAL_PATH = "/eventos/estrategia-fiscal";

export const isEstrategiaFiscalCard = (event: EstrategiaFiscalCard) =>
  event.to.split("?")[0] === ESTRATEGIA_FISCAL_PATH;

const getMexicoCityDay = (rawDate: string | undefined) => {
  if (!rawDate) return null;
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
  }).format(date);
};

export const dedupeEstrategiaFiscalCards = <T extends EstrategiaFiscalCard>(
  events: readonly T[],
) =>
  events.reduce<T[]>((deduped, event) => {
    if (!isEstrategiaFiscalCard(event)) {
      deduped.push(event);
      return deduped;
    }

    const day = getMexicoCityDay(event.rawDate);
    if (!day) {
      deduped.push(event);
      return deduped;
    }

    const existingIndex = deduped.findIndex(
      (candidate) =>
        isEstrategiaFiscalCard(candidate) &&
        getMexicoCityDay(candidate.rawDate) === day,
    );

    if (existingIndex === -1) {
      deduped.push(event);
    } else {
      // Sources are ordered by priority, so the later dynamic/API card wins.
      deduped[existingIndex] = event;
    }

    return deduped;
  }, []);
