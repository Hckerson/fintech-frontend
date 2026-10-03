import Amount from "@/components/common/amount";
import LineChart from "@/components/ui/line-chart";
import { NOT_AVAILABLE } from "@/lib/constants";
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
    return (
        <div className="flex flex-col gap-3">
            {view.plottable ? (
                <LineChart
                    title={COPY.balanceTitle(view.currency)}
                    summary={COPY.balanceSummary(rangeLabel, change)}
                    hint={COPY.chartHint}
                    points={view.points}
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
            <dl className="text-text-muted flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <div className="flex gap-2">
                    <dt>
                        {COPY.change} · {rangeLabel}
                    </dt>
                    <dd className="text-text tabular-nums">{change}</dd>
                </div>
                <div className="flex gap-2">
                    <dt>{COPY.low}</dt>
                    <dd className="text-text tabular-nums">
                        <Amount {...view.low} />
                    </dd>
                </div>
                <div className="flex gap-2">
                    <dt>{COPY.high}</dt>
                    <dd className="text-text tabular-nums">
                        <Amount {...view.high} />
                    </dd>
                </div>
            </dl>
        </div>
    );
}
