import Amount from "@/components/common/amount";
import FigureCell from "@/components/common/figure-cell";
import FlowChart from "@/components/ui/flow-chart";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashFlowSeries } from "@/lib/types";
import { cashFlowView } from "@/lib/utils/cash-flow-view";

interface Props {
    series: CashFlowSeries;
}

const COPY = DASHBOARD_COPY.cashFlow;
const DIVIDED = "border-border border-l";

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
        <>
            <dl className="border-border grid grid-cols-3 border-b">
                <FigureCell label={COPY.net}>
                    <Amount {...totals.net} display="signed" />
                </FigureCell>
                <FigureCell label={COPY.moneyIn} className={DIVIDED}>
                    <Amount {...totals.inflow} />
                </FigureCell>
                <FigureCell label={COPY.moneyOut} className={DIVIDED}>
                    <Amount {...totals.outflow} />
                </FigureCell>
            </dl>
            <div className="flex flex-col gap-3 p-4">
                {plottable ? (
                    <FlowChart
                        title={COPY.chartTitle(currency)}
                        summary={summary}
                        points={points}
                        formatTick={(value) => compact.format(value)}
                        labels={{
                            period: COPY.period,
                            inflow: COPY.moneyIn,
                            outflow: COPY.moneyOut,
                            net: COPY.net,
                            toggle: COPY.toggle,
                        }}
                    />
                ) : (
                    <>
                        <p className="text-text-secondary text-sm">
                            {COPY.unplottable}
                        </p>
                        <ul className="flex flex-col gap-1 text-xs">
                            {points.map(({ label, display }) => (
                                <li key={label} className="text-text-secondary">
                                    {label}: {display.inflow} ·{" "}
                                    {display.outflow} ·{" "}
                                    <span className="text-text">
                                        {display.net}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <p className="text-text-muted text-xs">{COPY.basis}</p>
            </div>
            <p role="status" className="sr-only">
                {summary}
            </p>
        </>
    );
}
