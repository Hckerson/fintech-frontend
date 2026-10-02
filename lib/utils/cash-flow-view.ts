import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashFlowSeries, FlowPoint } from "@/lib/types";
import { formatMoney, fractionDigits } from "@/lib/utils/money";
import { zonedLabel } from "@/lib/utils/zoned-time";
import { DEFAULT_TIME_ZONE } from "@/lib/workspace/constants";

const COPY = DASHBOARD_COPY.cashFlow;

const PERIOD_LABEL: Record<
    CashFlowSeries["granularity"],
    Intl.DateTimeFormatOptions
> = {
    day: { day: "numeric", month: "short" },
    month: { month: "short", year: "numeric" },
    year: { year: "numeric" },
};

const ZERO = "0";

export const hasActivity = ({ totals }: CashFlowSeries) =>
    totals.inflow.amountMinor !== ZERO || totals.outflow.amountMinor !== ZERO;

export const cashFlowView = (series: CashFlowSeries) => {
    const scale = 10 ** fractionDigits(series.currency);
    const money = (amountMinor: string, signed = false) =>
        formatMoney(amountMinor, series.currency, {
            signDisplay: signed ? "exceptZero" : "auto",
        }) ?? "";
    const last = series.points.length - 1;
    const minor = series.points.flatMap(({ inflow, outflow, net }) =>
        [inflow, outflow, net].map(({ amountMinor }) => Number(amountMinor)),
    );

    const points: FlowPoint[] = series.points.map(
        ({ periodStart, inflow, outflow, net }, index) => {
            const label =
                zonedLabel(
                    periodStart,
                    DEFAULT_TIME_ZONE,
                    PERIOD_LABEL[series.granularity],
                ) ?? periodStart;

            return {
                label: index === last ? COPY.partial(label) : label,
                inflow: Number(inflow.amountMinor) / scale,
                outflow: -Number(outflow.amountMinor) / scale,
                net: Number(net.amountMinor) / scale,
                display: {
                    inflow: money(inflow.amountMinor),
                    outflow: money(outflow.amountMinor),
                    net: money(net.amountMinor, true),
                },
            };
        },
    );

    return {
        points,
        plottable: minor.every(Number.isSafeInteger),
        net: money(series.totals.net.amountMinor, true),
    };
};
