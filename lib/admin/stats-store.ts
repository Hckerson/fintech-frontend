import { SIGN_UP_SEED } from "@/lib/data/admin/stats";
import type { AdminUserSeries, AdminUserTotal, StatsPeriod } from "@/lib/types";

const KEY_LENGTH: Record<StatsPeriod, number> = { day: 10, month: 7, year: 4 };

const startOf = (period: StatsPeriod, steps: number, now: Date) =>
    new Date(
        Date.UTC(
            now.getUTCFullYear() + (period === "year" ? steps : 0),
            period === "year"
                ? 0
                : now.getUTCMonth() + (period === "month" ? steps : 0),
            period === "day" ? now.getUTCDate() + steps : 1,
        ),
    );

export const seedSeries = (
    period: StatsPeriod,
    now = new Date(),
): AdminUserSeries => {
    const counts = SIGN_UP_SEED[period];

    return {
        period,
        start: startOf(period, 1 - counts.length, now).toISOString(),
        end: startOf(period, 1, now).toISOString(),
        asOf: now.toISOString(),
        points: counts.map((value, index) => ({
            key: startOf(period, index + 1 - counts.length, now)
                .toISOString()
                .slice(0, KEY_LENGTH[period]),
            value,
        })),
    };
};

export const seedTotal = (
    period: StatsPeriod,
    now = new Date(),
): AdminUserTotal => {
    const counts = SIGN_UP_SEED[period];

    return {
        period,
        start: startOf(period, 0, now).toISOString(),
        end: startOf(period, 1, now).toISOString(),
        asOf: now.toISOString(),
        total: counts.at(-1) ?? 0,
        previousTotal: counts.at(-2) ?? 0,
    };
};
