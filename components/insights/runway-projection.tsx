import Chart from "@/components/ui/chart";
import { RUNWAY_COPY } from "@/lib/data/insights/runway";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { formatMoney, fractionDigits } from "@/lib/utils/money";
import type { RunwayPoint } from "@/lib/utils/runway";

interface Props {
    series: RunwayPoint[];
    currency: string;
    target: number;
}

const monthLabel = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
});

export default function RunwayProjection({ series, currency, target }: Props) {
    const scale = 10 ** fractionDigits(currency);
    const points = series
        .filter(
            (point) => point.balanceMinor <= BigInt(Number.MAX_SAFE_INTEGER),
        )
        .map((point) => ({
            label: monthLabel.format(point.month),
            value: Number(point.balanceMinor) / scale,
            display: formatMoney(point.balanceMinor.toString(), currency) ?? "",
        }));
    const compact = new Intl.NumberFormat(DEFAULT_LOCALE, {
        style: "currency",
        currency,
        notation: "compact",
    });
    const first = points[0];
    const last = points.at(-1);

    return (
        <div className="surface-card p-4">
            <Chart
                title={RUNWAY_COPY.chartTitle}
                summary={
                    first && last
                        ? RUNWAY_COPY.chartSummary(
                              first.display,
                              last.display,
                              points.length - 1,
                          )
                        : ""
                }
                points={points}
                marker={
                    points[target]
                        ? {
                              label: RUNWAY_COPY.targetMarker,
                              at: points[target].label,
                          }
                        : undefined
                }
                formatTick={(value) => compact.format(value)}
                table={{
                    x: RUNWAY_COPY.table.month,
                    y: RUNWAY_COPY.table.balance,
                    toggle: RUNWAY_COPY.showTable,
                }}
            />
        </div>
    );
}
