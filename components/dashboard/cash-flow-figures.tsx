import Amount from "@/components/common/amount";
import Chart from "@/components/ui/chart";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashFlowSeries } from "@/lib/types";
import { cashFlowView } from "@/lib/utils/cash-flow-view";

interface Props {
    series: CashFlowSeries;
}

const COPY = DASHBOARD_COPY.cashFlow;

export default function CashFlowFigures({ series }: Props) {
    const { points, plottable, net } = cashFlowView(series);
    const { totals, currency } = series;
    const summary = COPY.summary(COPY.ranges[series.range], currency, net);
    const compact = new Intl.NumberFormat(DEFAULT_LOCALE, {
        style: "currency",
        currency,
        notation: "compact",
    });

    return (
        <div className="flex flex-col gap-4">
            <dl className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                    <dt className="text-text-muted text-xs">{COPY.net}</dt>
                    <dd>
                        <Amount
                            {...totals.net}
                            display="signed"
                            className="text-text text-h6 tabular-nums"
                        />
                    </dd>
                </div>
                <div className="flex flex-col gap-1">
                    <dt className="text-text-muted text-xs">{COPY.moneyIn}</dt>
                    <dd>
                        <Amount
                            {...totals.inflow}
                            className="text-text-secondary tabular-nums"
                        />
                    </dd>
                </div>
                <div className="flex flex-col gap-1">
                    <dt className="text-text-muted text-xs">{COPY.moneyOut}</dt>
                    <dd>
                        <Amount
                            {...totals.outflow}
                            className="text-text-secondary tabular-nums"
                        />
                    </dd>
                </div>
            </dl>
            {plottable ? (
                <Chart
                    title={COPY.chartTitle(currency)}
                    summary={summary}
                    points={points}
                    formatTick={(value) => compact.format(value)}
                    table={COPY.table}
                />
            ) : (
                <>
                    <p className="text-text-secondary text-sm">
                        {summary} {COPY.unplottable}
                    </p>
                    <ul className="flex flex-col gap-1 text-sm">
                        {points.map((point) => (
                            <li key={point.label}>
                                <span className="text-text-secondary">
                                    {point.label}:
                                </span>{" "}
                                <span className="text-text tabular-nums">
                                    {point.display}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <p role="status" className="sr-only">
                {summary}
            </p>
        </div>
    );
}
