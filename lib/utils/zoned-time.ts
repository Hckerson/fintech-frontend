import { DEFAULT_LOCALE } from "@/lib/constants";

const INSTANT: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
};

export const CALENDAR_DAY: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
};

export const zonedLabel = (
    iso: string,
    timeZone: string,
    options: Intl.DateTimeFormatOptions = INSTANT,
): string | null => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime())
        ? null
        : new Intl.DateTimeFormat(DEFAULT_LOCALE, {
              ...options,
              timeZone,
          }).format(date);
};
