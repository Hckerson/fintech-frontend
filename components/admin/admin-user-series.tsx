"use client";
import AdminKpiBandSkeleton from "@/components/admin/admin-kpi-band-skeleton";
import AsOf from "@/components/common/as-of";
import Chart from "@/components/ui/chart";
import EmptyState from "@/components/ui/empty-state";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { ADMIN_TIME_ZONE } from "@/lib/admin/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { useAdminUserSeries } from "@/lib/hooks/use-admin-user-series";
import { usePlatformOrigin } from "@/lib/hooks/use-platform-origin";
import type { SeriesView, StatsPeriod } from "@/lib/types";
import { formatCount, seriesView } from "@/lib/utils/admin-stats";

const COPY = ADMIN_OVERVIEW_COPY.series;

const summaryOf = ({ total, peak, partial, omitted }: SeriesView) =>
    [
        COPY.total(formatCount(total)),
        peak ? COPY.peak(peak.label, formatCount(peak.value)) : null,
        partial ? COPY.partial(partial) : null,
        omitted > 0 ? COPY.omitted(formatCount(omitted)) : null,
        COPY.zone,
    ]
        .filter(Boolean)
        .join(" ");

export default function AdminUserSeries({ period }: { period: StatsPeriod }) {
    const query = useAdminUserSeries(period);
    const { firstUserAt } = usePlatformOrigin();

    return (
        <QueryBoundary
            query={query}
            isEmpty={(series) => series.points.length === 0}
            empty={<EmptyState {...EMPTY_STATES.adminSeries} />}
            skeleton={<AdminKpiBandSkeleton part="series" />}
            denied={<EmptyState {...EMPTY_STATES.adminNotPermitted} />}
        >
            {(series) => {
                const view = seriesView(series, firstUserAt, COPY.partialValue);

                return view.points.length === 0 ? (
                    <EmptyState {...EMPTY_STATES.adminSeriesBeforeOrigin} />
                ) : (
                    <div className="flex flex-col gap-3">
                        <Chart
                            title={COPY.title[period]}
                            summary={summaryOf(view)}
                            points={view.points}
                            formatTick={formatCount}
                            wholeTicks
                            table={COPY.table}
                        />
                        <AsOf asOf={series.asOf} timeZone={ADMIN_TIME_ZONE} />
                        <p role="status" className="sr-only">
                            {COPY.announce(formatCount(view.total))}
                        </p>
                    </div>
                );
            }}
        </QueryBoundary>
    );
}
