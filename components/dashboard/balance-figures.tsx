import Amount from "@/components/common/amount";
import FigureCell from "@/components/common/figure-cell";
import LineChart from "@/components/ui/line-chart";
import { DEFAULT_LOCALE, NOT_AVAILABLE } from "@/lib/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashFlowSeries, CashPosition } from "@/lib/types";
import { balanceView } from "@/lib/utils/balance-view";
import { trendPercent } from "@/lib/utils/trend";

interface Props {
    trend: CashPosition["trend"];
    granularity: CashFlowSeries["granularity"];
    rangeLabel: string;
}

const CASH = DASHBOARD_COPY.cash;
const FLOW = DASHBOARD_COPY.cashFlow;
const COPY = DASHBOARD_COPY.overview;

export default function BalanceFigures({
    trend,
    granularity,
    rangeLabel,
}: Props) {
    const view = balanceView(trend, granularity);
    if (!view) return null;

    const change = view.trend
        ? CASH.trend(view.trend, trendPercent(view.trend, CASH.ceiling))
        : NOT_AVAILABLE;
    const compact = new Intl.NumberFormat(DEFAULT_LOCALE, {
        style: "currency",
        currency: view.currency,
        notation: "compact",
    });

    return (
        <>
            <div className="px-4 py-4">
                {view.plottable ? (
                    <LineChart
                        title={COPY.balanceTitle(view.currency)}
                        summary={COPY.balanceSummary(rangeLabel, change)}
                        hint={COPY.chartHint}
                        points={view.points}
                        formatTick={(value) => compact.format(value)}
                        table={{
                            x: FLOW.period,
                            y: COPY.closing,
                            toggle: FLOW.toggle,
                        }}
                    />
                ) : (
                    <p className="text-text-secondary text-sm">
                        {FLOW.unplottable}
                    </p>
                )}
            </div>
            <dl className="border-border divide-border grid divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <FigureCell label={`${COPY.change} · ${rangeLabel}`}>
                    {change}
                </FigureCell>
                <FigureCell label={COPY.low}>
                    <Amount {...view.low} />
                </FigureCell>
                <FigureCell label={COPY.high}>
                    <Amount {...view.high} />
                </FigureCell>
            </dl>
        </>
    );
}
