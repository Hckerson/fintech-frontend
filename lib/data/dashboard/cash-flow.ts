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
            1840000, 965000, 0, 3124000, 580000, 0, 0, 2407500, 1213000, 760000,
        ],
        outflow: [
            920000, 1412000, 385000, 604000, 2825000, 0, 0, 873000, 526000,
        ],
    },
    EUR: {
        inflow: [42000, 0, 118500, 26400, 0, 0, 73200],
        outflow: [31500, 64000, 12800, 0, 0, 48900, 20100],
    },
};

export const CASH_FLOW_MONTH_SCALE = 21;
