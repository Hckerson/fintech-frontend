import { ADMIN_TIME_ZONE } from "@/lib/admin/constants";
import { DEFAULT_LOCALE } from "@/lib/constants";
import type { AdminUserSeries, SeriesView, StatsPeriod } from "@/lib/types";
import { zonedLabel } from "@/lib/utils/zoned-time";

const BUCKET: Record<StatsPeriod, Intl.DateTimeFormatOptions> = {
    day: { day: "numeric", month: "short" },
    month: { month: "short", year: "numeric" },
    year: { year: "numeric" },
};

const PERIOD: Record<StatsPeriod, Intl.DateTimeFormatOptions> = {
    day: { day: "numeric", month: "long", year: "numeric" },
    month: { month: "long", year: "numeric" },
    year: { year: "numeric" },
};

const count = new Intl.NumberFormat(DEFAULT_LOCALE);

export const formatCount = (value: number) => count.format(value);

export const bucketLabel = (period: StatsPeriod, key: string) =>
    zonedLabel(key, ADMIN_TIME_ZONE, BUCKET[period]) ?? key;

export const periodLabel = (period: StatsPeriod, start: string) =>
    zonedLabel(start, ADMIN_TIME_ZONE, PERIOD[period]) ?? start;

export const inProgress = (end: string, asOf: string) =>
    Date.parse(end) > Date.parse(asOf);

export const seriesView = (
    series: AdminUserSeries,
    firstUserAt: string,
    partialDisplay: (value: string) => string,
): SeriesView => {
    const beforeOrigin = (key: string) => key < firstUserAt.slice(0, key.length);
    const firstKept = series.points.findIndex(
        ({ key, value }) => value > 0 || !beforeOrigin(key),
    );
    const omitted = firstKept < 0 ? series.points.length : firstKept;
    const kept = series.points.slice(omitted);
    const open = inProgress(series.end, series.asOf);

    const points = kept.map(({ key, value }, index) => {
        const partial = open && index === kept.length - 1;
        const display = formatCount(value);

        return {
            label: bucketLabel(series.period, key),
            value,
            display: partial ? partialDisplay(display) : display,
        };
    });

    return {
        points,
        omitted,
        total: kept.reduce((sum, { value }) => sum + value, 0),
        peak: points.reduce<SeriesView["peak"]>(
            (best, point) => (best && best.value >= point.value ? best : point),
            undefined,
        ),
        partial: open ? points.at(-1)?.label : undefined,
    };
};
