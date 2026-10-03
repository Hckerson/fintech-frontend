import type { CashFlowRange, CashFlowSeries } from "@/lib/types";

export const CASH_FLOW_WINDOWS: Record<
    CashFlowRange,
    { granularity: CashFlowSeries["granularity"]; length: number }
> = {
    "30d": { granularity: "day", length: 30 },
    "90d": { granularity: "day", length: 90 },
    "12m": { granularity: "month", length: 12 },
};

export const CASH_FLOW_SEED: Record<
    string,
    { inflow: readonly number[]; outflow: readonly number[] }
> = {
    GBP: {
        inflow: [
            1240000, 0, 365000, 0, 1824000, 280000, 0, 0, 907500, 413000, 0,
        ],
        outflow: [420000, 612000, 185000, 304000, 925000, 0, 0, 373000, 226000],
    },
    EUR: {
        inflow: [42000, 0, 118500, 26400, 0, 0, 73200],
        outflow: [31500, 64000, 12800, 0, 0, 48900, 20100],
    },
};

export const CASH_FLOW_MONTH_SCALE = 21;

export const CASH_FLOW_VARIANCE = {
    base: 60,
    step: 37,
    span: 80,
    whole: 100,
} as const;
