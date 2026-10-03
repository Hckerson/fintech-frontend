import { FLOW_DAILY_LIMIT, FLOW_WEEK_DAYS } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashFlowSeries, FlowPoint } from "@/lib/types";
import { formatMoney, fractionDigits } from "@/lib/utils/money";
import { zonedLabel } from "@/lib/utils/zoned-time";
import { DEFAULT_TIME_ZONE } from "@/lib/workspace/constants";

const COPY = DASHBOARD_COPY.cashFlow;

export const PERIOD_LABEL: Record<
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

const NONE = BigInt(0);

const weekly = (points: CashFlowSeries["points"]) =>
    Array.from(
        { length: Math.ceil(points.length / FLOW_WEEK_DAYS) },
        (_, week) => {
            const days = points.slice(
                week * FLOW_WEEK_DAYS,
                (week + 1) * FLOW_WEEK_DAYS,
            );
            const sum = (pick: "inflow" | "outflow" | "net") => ({
                currency: days[0][pick].currency,
                amountMinor: days
                    .reduce(
                        (total, day) => total + BigInt(day[pick].amountMinor),
                        NONE,
                    )
                    .toString(),
            });

            return {
                periodStart: days[0].periodStart,
                inflow: sum("inflow"),
                outflow: sum("outflow"),
                net: sum("net"),
            };
        },
    );

export const cashFlowView = (series: CashFlowSeries) => {
    const periods =
        series.granularity === "day" && series.points.length > FLOW_DAILY_LIMIT
            ? weekly(series.points)
            : series.points;
    const scale = 10 ** fractionDigits(series.currency);
    const money = (amountMinor: string, signed = false) =>
        formatMoney(amountMinor, series.currency, {
            signDisplay: signed ? "exceptZero" : "auto",
        }) ?? "";
    const last = periods.length - 1;
    const minor = periods.flatMap(({ inflow, outflow, net }) =>
        [inflow, outflow, net].map(({ amountMinor }) => Number(amountMinor)),
    );

    const points: FlowPoint[] = periods.map(
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
