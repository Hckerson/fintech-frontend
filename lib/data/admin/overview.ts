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
    lead: "Platform health for internal staff.",
    queues: {
        title: "Work queues",

        detail: {
            users: "Create accounts, change roles, suspend or remove a user.",
            compliance: "Review verification cases, oldest submitted first.",
            support: "Look up a customer and see what they see.",
        },
    },
    growth: {
        title: "Platform growth",
        zone: "New users by calendar period, in UTC.",
        periodLabel: "Period",
        periods: PERIODS,
    },
    total: {
        title: "New users",
        figures: "New-user figures",
        basis: {
            day: "Change is against all of yesterday.",
            month: "Change is against all of last month.",
            year: "Change is against all of last year.",
        },
        label: {
            day: "Today",
            month: "This month",
            year: "This year",
        },
        comparison: {
            day: "vs all of yesterday",
            month: "vs all of last month",
            year: "vs all of last year",
        },
        previous: { day: "Yesterday", month: "Last month", year: "Last year" },
        period: "Period",
        status: "Status",
        partial: "In progress",
        complete: "Complete",
        announce: (label: string, value: string) => `${label}: ${value}`,
    },
    series: {
        title: {
            day: "Sign-ups per day",
            month: "Sign-ups per month",
            year: "Sign-ups per year",
        },
        chart: "Trend",
        hint: "Use the left and right arrow keys to read each period.",
        tooltip: {
            comparison: "on the period before",
            partial: "In progress",
            first: "First period shown",
        },
        partialValue: (value: string) => `${value} so far`,
        summary: (first: string, last: string, total: string) =>
            `${first} to ${last}. Sign-ups in total: ${total}.`,
        partial: (label: string) => `${label} is still in progress.`,
        omitted: (value: string) =>
            `Periods before the first user, left out: ${value}.`,
        single: "A trend needs at least two periods. The chart appears once there is a second one.",
        breakdown: {
            caption: "Sign-ups by period, newest first",
            period: "Period (UTC)",
            signUps: "Sign-ups",
            change: "Change",
            partial: "In progress",
            shareLabel: (share: string) => `${share} of the range`,
        },
        stats: {
            label: "Series figures",
            total: "In this range",
            peak: "Highest",
            average: {
                day: "Average per day",
                month: "Average per month",
                year: "Average per year",
            },
        },
        announce: (value: string) => `Sign-up series loaded. Total: ${value}.`,
    },
} as const;

export const DELTA_COPY = {
    up: (amount: string, comparison: string) =>
        `Up ${amount} ${comparison}`.trim(),
    down: (amount: string, comparison: string) =>
        `Down ${amount} ${comparison}`.trim(),
    flat: (comparison: string) => `No change ${comparison}`.trim(),
    under: (amount: string) => `less than ${amount}`,
    over: (amount: string) => `more than ${amount}`,
    none: "No comparison",
    dash: "—",
} as const;
