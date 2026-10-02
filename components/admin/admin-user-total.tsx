"use client";
import AdminKpiBandSkeleton from "@/components/admin/admin-kpi-band-skeleton";
import AsOf from "@/components/common/as-of";
import DeltaChip from "@/components/common/delta-chip";
import Metric from "@/components/common/metric";
import EmptyState from "@/components/ui/empty-state";
import NumberDisplay from "@/components/ui/number-display";
import StatusLabel from "@/components/ui/status-label";
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
            {(total) => {
                const open = inProgress(total.end, total.asOf);

                return (
                    <>
                        <div className="divide-border grid grid-cols-2 divide-x [&>*+*]:pl-4">
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
                                        delta={periodDelta(
                                            total.total,
                                            total.previousTotal,
                                        )}
                                    />
                                }
                            />
                            <Metric
                                label={COPY.previous[period]}
                                value={
                                    <NumberDisplay
                                        value={total.previousTotal}
                                        text={formatCount(total.previousTotal)}
                                    />
                                }
                                note={COPY.complete}
                            />
                        </div>
                        <p className="text-text-muted text-xs">
                            {COPY.basis[period]}
                        </p>
                        <div className="border-border text-text-muted flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs">
                            <p className="flex items-center gap-2">
                                {periodLabel(period, total.start)}
                                <StatusLabel
                                    label={open ? COPY.partial : COPY.complete}
                                    severity={open ? "information" : "neutral"}
                                />
                            </p>
                            <AsOf
                                asOf={total.asOf}
                                timeZone={ADMIN_TIME_ZONE}
                            />
                        </div>
                        <p role="status" className="sr-only">
                            {COPY.announce(
                                COPY.label[period],
                                formatCount(total.total),
                            )}
                        </p>
                    </>
                );
            }}
        </QueryBoundary>
    );
}
