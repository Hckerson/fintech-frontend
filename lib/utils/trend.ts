import { DEFAULT_LOCALE } from "@/lib/constants";
import { TREND_PERCENT_CEILING } from "@/lib/dashboard/constants";
import type { CashPosition, Trend } from "@/lib/types";

const BASIS_POINTS = 10_000;
const ZERO = BigInt(0);

const percent = new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "percent",
    maximumFractionDigits: 1,
});

export const trendOf = (points: CashPosition["trend"]): Trend | null => {
    if (points.length < 2) return null;

    const first = BigInt(points[0].closing.amountMinor);
    const change =
        BigInt(points[points.length - 1].closing.amountMinor) - first;
    const size = change < ZERO ? -change : change;

    return {
        direction: change === ZERO ? "flat" : change > ZERO ? "up" : "down",
        ratio:
            first > ZERO
                ? Number((size * BigInt(BASIS_POINTS)) / first) / BASIS_POINTS
                : null,
    };
};

export const trendPercent = (
    { ratio }: Trend,
    ceilingLabel: string,
): string | null =>
    ratio === null
        ? null
        : ratio > TREND_PERCENT_CEILING
          ? ceilingLabel
          : percent.format(ratio);

export const plottable = (points: CashPosition["trend"]): number[] | null => {
    const values = points.map(({ closing }) => Number(closing.amountMinor));
    return values.length > 1 && values.every(Number.isSafeInteger)
        ? values
        : null;
};
