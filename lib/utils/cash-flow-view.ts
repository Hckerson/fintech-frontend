import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashFlowSeries, ChartPoint } from "@/lib/types";
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

    const points: ChartPoint[] = series.points.map(
        ({ periodStart, inflow, outflow, net }, index) => {
            const label =
                zonedLabel(
                    periodStart,
                    DEFAULT_TIME_ZONE,
                    PERIOD_LABEL[series.granularity],
                ) ?? periodStart;

            return {
                label: index === last ? COPY.partial(label) : label,
                value: Number(net.amountMinor) / scale,
                display: COPY.point(
                    money(inflow.amountMinor),
                    money(outflow.amountMinor),
                    money(net.amountMinor, true),
                ),
            };
        },
    );

    return {
        points,
        plottable: series.points.every(({ net }) =>
            Number.isSafeInteger(Number(net.amountMinor)),
        ),
        net: money(series.totals.net.amountMinor, true),
    };
};
