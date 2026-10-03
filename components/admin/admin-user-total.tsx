"use client";
import AdminKpiBandSkeleton from "@/components/admin/admin-kpi-band-skeleton";
import AsOf from "@/components/common/as-of";
import DeltaChip from "@/components/common/delta-chip";
import CountUp from "@/components/ui/count-up";
import EmptyState from "@/components/ui/empty-state";
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
                const facts = [
                    {
                        term: COPY.previous[period],
                        detail: formatCount(total.previousTotal),
                    },
                    {
                        term: COPY.period,
                        detail: periodLabel(period, total.start),
                    },
                ];

                return (
                    <>
                        <div className="flex flex-col gap-2">
                            <p className="text-text-secondary flex flex-wrap items-center gap-2 text-sm">
                                {COPY.label[period]}
                                <StatusLabel
                                    label={open ? COPY.partial : COPY.complete}
                                    severity={open ? "information" : "neutral"}
                                />
                            </p>
                            <p className="ledger-figure text-text">
                                <CountUp
                                    value={total.total}
                                    format={formatCount}
                                />
                            </p>
                            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                <DeltaChip
                                    neutral={open}
                                    delta={periodDelta(
                                        total.total,
                                        total.previousTotal,
                                    )}
                                    comparison={COPY.comparison[period]}
                                />
                            </p>
                            <AsOf
                                asOf={total.asOf}
                                timeZone={ADMIN_TIME_ZONE}
                            />
                        </div>
                        <dl className="border-border flex flex-col border-t text-sm">
                            {facts.map(({ term, detail }) => (
                                <div
                                    key={term}
                                    className="border-border flex items-baseline justify-between gap-3 border-b py-2"
                                >
                                    <dt className="text-text-muted">{term}</dt>
                                    <dd className="text-text font-medium tabular-nums">
                                        {detail}
                                    </dd>
                                </div>
                            ))}
                        </dl>
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
