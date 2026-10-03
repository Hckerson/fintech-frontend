import {
    CASH_FLOW_MONTH_SCALE,
    CASH_FLOW_SEED,
    CASH_FLOW_VARIANCE as VARIANCE,
    CASH_FLOW_WINDOWS,
} from "@/lib/data/dashboard/cash-flow";
import type { CashFlowQuery, CashFlowSeries } from "@/lib/types";

const ZERO = BigInt(0);

const periodStart = (
    granularity: CashFlowSeries["granularity"],
    today: Date,
    back: number,
) =>
    new Date(
        granularity === "day"
            ? Date.UTC(
                  today.getUTCFullYear(),
                  today.getUTCMonth(),
                  today.getUTCDate() - back,
              )
            : Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - back, 1),
    ).toISOString();

export const seedCashFlow = (
    { range, currency }: Required<CashFlowQuery>,
    today: Date,
): CashFlowSeries => {
    const { granularity, length } = CASH_FLOW_WINDOWS[range];
    const pattern = CASH_FLOW_SEED[currency] ?? { inflow: [0], outflow: [0] };
    const scale = BigInt(granularity === "day" ? 1 : CASH_FLOW_MONTH_SCALE);
    const money = (minor: bigint) => ({
        amountMinor: minor.toString(),
        currency,
    });
    const at = (values: readonly number[], index: number) =>
        (BigInt(values[index % values.length]) *
            scale *
            BigInt(VARIANCE.base + ((index * VARIANCE.step) % VARIANCE.span))) /
        BigInt(VARIANCE.whole);

    const points = Array.from({ length }, (_, index) => {
        const inflow = at(pattern.inflow, index);
        const outflow = at(pattern.outflow, index);

        return {
            periodStart: periodStart(granularity, today, length - 1 - index),
            inflow: money(inflow),
            outflow: money(outflow),
            net: money(inflow - outflow),
        };
    });
    const total = (pick: "inflow" | "outflow") =>
        points.reduce(
            (sum, point) => sum + BigInt(point[pick].amountMinor),
            ZERO,
        );

    return {
        range,
        granularity,
        currency,
        points,
        totals: {
            inflow: money(total("inflow")),
            outflow: money(total("outflow")),
            net: money(total("inflow") - total("outflow")),
        },
    };
};
