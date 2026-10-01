import { format } from "date-fns";
import { DEFAULT_LOCALE } from "@/lib/constants";

const DAY = { day: "numeric", month: "short", year: "numeric" } as const;

export const formatDay = (instant: string, locale = DEFAULT_LOCALE) =>
    new Intl.DateTimeFormat(locale, DAY).format(new Date(instant));

export const formatInstant = (instant: string, locale = DEFAULT_LOCALE) =>
    new Intl.DateTimeFormat(locale, {
        ...DAY,
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
    }).format(new Date(instant));

export const dateFormatter = (date: string, formatString: string) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return isNaN(dateObj.getTime()) ? date : format(dateObj, formatString);
};
