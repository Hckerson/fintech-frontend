"use client";
import AdminKpiBandSkeleton from "@/components/admin/admin-kpi-band-skeleton";
import AsOf from "@/components/common/as-of";
import DeltaChip from "@/components/common/delta-chip";
import Metric from "@/components/common/metric";
import EmptyState from "@/components/ui/empty-state";
import NumberDisplay from "@/components/ui/number-display";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { ADMIN_TIME_ZONE } from "@/lib/admin/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { useAdminUserTotal } from "@/lib/hooks/use-admin-user-total";
import type { StatsPeriod } from "@/lib/types";
import { formatCount, inProgress, periodLabel } from "@/lib/utils/admin-stats";
import { periodDelta } from "@/lib/utils/delta";

const COPY = ADMIN_OVERVIEW_COPY.total;

export default function AdminUserTotal({ period }: { period: StatsPeriod }) {
    const query = useAdminUserTotal(period);

    return (
        <QueryBoundary
            query={query}
            isEmpty={() => false}
            empty={null}
            skeleton={<AdminKpiBandSkeleton part="total" />}
            denied={<EmptyState {...EMPTY_STATES.adminNotPermitted} />}
        >
            {(total) => (
                <Metric
                    label={COPY.label[period]}
                    value={
                        <NumberDisplay
                            value={total.total}
                            text={formatCount(total.total)}
                        />
                    }
                    delta={
                        <DeltaChip
                            delta={periodDelta(total.total, total.previousTotal)}
                            comparison={COPY.comparison[period]}
                        />
                    }
                >
                    <p className="text-text-muted text-xs">
                        {COPY.range(periodLabel(period, total.start))}
                        {inProgress(total.end, total.asOf)
                            ? ` · ${COPY.partial}`
                            : null}
                    </p>
                    <AsOf asOf={total.asOf} timeZone={ADMIN_TIME_ZONE} />
                    <p role="status" className="sr-only">
                        {COPY.announce(
                            COPY.label[period],
                            formatCount(total.total),
                        )}
                    </p>
                </Metric>
            )}
        </QueryBoundary>
    );
}
