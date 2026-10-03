import clsx from "clsx";
import DeltaChip from "@/components/common/delta-chip";
import { GROWTH_CHART } from "@/lib/admin/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import type { ChartPoint, Delta } from "@/lib/types";

interface Props {
    point: ChartPoint;
    delta: Delta | null;
    spot: { left: number; top: number };
}

const COPY = ADMIN_OVERVIEW_COPY.series.tooltip;

export default function GrowthChartTooltip({ point, delta, spot }: Props) {
    return (
        <div
            aria-hidden
            className={clsx(
                "border-border-dark bg-background-alt pointer-events-none absolute z-(--z-indices-dropdown) flex min-w-36 -translate-y-full flex-col gap-1 rounded-lg border px-3 py-2 shadow-(--shadows-xl)",
                spot.left < GROWTH_CHART.edge && "translate-x-0",
                spot.left > 1 - GROWTH_CHART.edge && "-translate-x-full",
                spot.left >= GROWTH_CHART.edge &&
                    spot.left <= 1 - GROWTH_CHART.edge &&
                    "-translate-x-1/2",
            )}
            style={{
                left: `${spot.left * 100}%`,
                top: `calc(${spot.top * 100}% - 0.875rem)`,
            }}
        >
            <span className="text-text-muted text-xs">{point.label}</span>
            <span className="text-text text-lg font-medium tabular-nums">
                {point.display}
            </span>
            <span className="text-xs">
                {point.partial ? (
                    <span className="text-text-muted">{COPY.partial}</span>
                ) : (
                    <DeltaChip
                        delta={delta}
                        comparison={COPY.comparison}
                        fallback={COPY.first}
                    />
                )}
            </span>
        </div>
    );
}
