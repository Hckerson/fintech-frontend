"use client";
import AdminKpiBandSkeleton from "@/components/admin/admin-kpi-band-skeleton";
import AdminPeriodTable from "@/components/admin/admin-period-table";
import AdminSeriesStats from "@/components/admin/admin-series-stats";
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

const notesOf = ({ partial, omitted }: SeriesView) =>
    [
        partial ? COPY.partial(partial) : null,
        omitted > 0 ? COPY.omitted(formatCount(omitted)) : null,
    ].filter((note) => note !== null);

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
                const first = view.points.at(0);
                const last = view.points.at(-1);

                if (!first || !last) {
                    return (
                        <EmptyState {...EMPTY_STATES.adminSeriesBeforeOrigin} />
                    );
                }

                return (
                    <>
                        <AdminSeriesStats view={view} period={period} />
                        {view.points.length > 1 ? (
                            <div className="border-border border-t pt-4">
                                <Chart
                                    title={COPY.chart}
                                    summary={COPY.summary(
                                        first.label,
                                        last.label,
                                        formatCount(view.total),
                                    )}
                                    points={view.points}
                                    formatTick={formatCount}
                                    wholeTicks
                                    variant="bar"
                                />
                            </div>
                        ) : (
                            <p className="border-border text-text-muted measure border-t pt-3 text-xs">
                                {COPY.single}
                            </p>
                        )}
                        <AdminPeriodTable view={view} />
                        <div className="border-border text-text-muted flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t pt-3 text-xs">
                            <p>{notesOf(view).join(" ")}</p>
                            <AsOf
                                asOf={series.asOf}
                                timeZone={ADMIN_TIME_ZONE}
                            />
                        </div>
                        <p role="status" className="sr-only">
                            {COPY.announce(formatCount(view.total))}
                        </p>
                    </>
                );
            }}
        </QueryBoundary>
    );
}
