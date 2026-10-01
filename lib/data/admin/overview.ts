import { PAGE_TITLES } from "@/lib/constants";
import { ADMIN_AREA } from "@/lib/data/admin-nav";
import type { StatsPeriod, TabItem } from "@/lib/types";

const PERIODS: readonly TabItem<StatsPeriod>[] = [
    { id: "day", label: "Day" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
];

export const ADMIN_OVERVIEW_COPY = {
    metaTitle: `${PAGE_TITLES.adminOverview} · ${ADMIN_AREA.name}`,
    eyebrow: ADMIN_AREA.name,
    lead: "New-user totals and the sign-up trend across the platform.",
    queues: "Work queues",
    growth: {
        title: "Platform growth",
        zone: "Periods are calendar days, months and years in UTC.",
        periodLabel: "Period",
        periods: PERIODS,
    },
    total: {
        label: {
            day: "New users today",
            month: "New users this month",
            year: "New users this year",
        },
        comparison: {
            day: "versus all of yesterday",
            month: "versus all of last month",
            year: "versus all of last year",
        },
        range: (period: string) => `${period}, UTC`,
        partial: "Still in progress",
        announce: (label: string, value: string) => `${label}: ${value}`,
    },
    series: {
        title: {
            day: "Sign-ups per day",
            month: "Sign-ups per month",
            year: "Sign-ups per year",
        },
        partialValue: (value: string) => `${value} so far`,
        total: (value: string) => `Sign-ups in total: ${value}.`,
        peak: (label: string, value: string) =>
            `Highest: ${label} with ${value}.`,
        partial: (label: string) => `${label} is still in progress.`,
        omitted: (value: string) =>
            `Periods before the first user, left out: ${value}.`,
        zone: "Periods are cut in UTC.",
        table: {
            x: "Period (UTC)",
            y: "Sign-ups",
            toggle: "Show the figures as a table",
        },
        announce: (value: string) => `Sign-up series loaded. Total: ${value}.`,
    },
} as const;

export const DELTA_COPY = {
    up: (amount: string, comparison: string) => `Up ${amount} ${comparison}`,
    down: (amount: string, comparison: string) =>
        `Down ${amount} ${comparison}`,
    flat: (comparison: string) => `No change ${comparison}`,
    under: (amount: string) => `less than ${amount}`,
    over: (amount: string) => `more than ${amount}`,
    none: "No comparison",
} as const;
