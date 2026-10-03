"use client";
import AdminSeriesStats from "@/components/admin/admin-series-stats";
import Skeleton from "@/components/ui/skeleton";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import { useAdminUserSeries } from "@/lib/hooks/use-admin-user-series";
import { usePlatformOrigin } from "@/lib/hooks/use-platform-origin";
import type { StatsPeriod } from "@/lib/types";
import { seriesView } from "@/lib/utils/admin-stats";

interface Props {
    period: StatsPeriod;
}

export default function AdminSeriesFigures({ period }: Props) {
    const query = useAdminUserSeries(period);
    const { firstUserAt } = usePlatformOrigin();

    return (
        <QueryBoundary
            query={query}
            isEmpty={(series) => series.points.length === 0}
            empty={null}
            denied={null}
            skeleton={<Skeleton className="h-28" />}
        >
            {(series) => (
                <AdminSeriesStats
                    period={period}
                    view={seriesView(
                        series,
                        firstUserAt,
                        ADMIN_OVERVIEW_COPY.series.partialValue,
                    )}
                />
            )}
        </QueryBoundary>
    );
}
