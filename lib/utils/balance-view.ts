import type {
    CashFlowSeries,
    CashPosition,
    ChartPoint,
    Money,
} from "@/lib/types";
import { PERIOD_LABEL } from "@/lib/utils/cash-flow-view";
import { formatMoney, fractionDigits } from "@/lib/utils/money";
import { trendOf } from "@/lib/utils/trend";
import { zonedLabel } from "@/lib/utils/zoned-time";
import { DEFAULT_TIME_ZONE } from "@/lib/workspace/constants";

const extreme = (
    balances: readonly Money[],
    beats: (next: bigint, kept: bigint) => boolean,
) =>
    balances.reduce((kept, next) =>
        beats(BigInt(next.amountMinor), BigInt(kept.amountMinor)) ? next : kept,
    );

export const balanceView = (
    trend: CashPosition["trend"],
    granularity: CashFlowSeries["granularity"],
) => {
    if (trend.length === 0) return null;

    const balances = trend.map(({ closing }) => closing);
    const { currency } = balances[0];
    const scale = 10 ** fractionDigits(currency);
    const points: ChartPoint[] = trend.map(({ date, closing }) => ({
        label:
            zonedLabel(date, DEFAULT_TIME_ZONE, PERIOD_LABEL[granularity]) ??
            date,
        value: Number(closing.amountMinor) / scale,
        display: formatMoney(closing.amountMinor, currency) ?? "",
    }));

    return {
        currency,
        points,
        plottable: balances.every(({ amountMinor }) =>
            Number.isSafeInteger(Number(amountMinor)),
        ),
        low: extreme(balances, (next, kept) => next < kept),
        high: extreme(balances, (next, kept) => next > kept),
        trend: trendOf(trend),
    };
};
