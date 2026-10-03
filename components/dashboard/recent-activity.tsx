"use client";
import { useId, useState } from "react";
import SectionCard from "@/components/common/section-card";
import SectionSkeleton from "@/components/common/section-skeleton";
import TransactionRow from "@/components/common/transaction-row";
import EmptyState from "@/components/ui/empty-state";
import Tabs from "@/components/ui/tabs";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { DASHBOARD_ACTIVITY_LIMIT } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { activityDays } from "@/lib/utils/activity-days";
import { seesPermittedOnly } from "@/lib/utils/permissions";
import { TRANSACTIONS_ROUTE } from "@/lib/workspace/constants";

const COPY = DASHBOARD_COPY.activity;

const FILTERS = [
    { id: "all", label: COPY.filters.all },
    { id: "pending", label: COPY.filters.pending },
] as const;

const HEADS = [
    { id: "description", className: "" },
    { id: "category", className: "hidden lg:table-cell" },
    { id: "status", className: "hidden sm:table-cell" },
    { id: "amount", className: "text-right" },
] as const;

type Filter = (typeof FILTERS)[number]["id"];

export default function RecentActivity() {
    const { workspace } = useWorkspace();
    const panelId = useId();
    const [filter, setFilter] = useState<Filter>("all");
    const query = useTransactions({ limit: DASHBOARD_ACTIVITY_LIMIT });
    const notShared = <EmptyState {...EMPTY_STATES.accountsNotShared} />;

    return (
        <SectionCard
            flush
            title={DASHBOARD_COPY.sections.recentActivity}
            action={{ label: COPY.all, href: TRANSACTIONS_ROUTE }}
            aside={
                <Tabs
                    label={COPY.filterLabel}
                    tabs={FILTERS}
                    value={filter}
                    onChange={setFilter}
                    panelId={panelId}
                />
            }
        >
            <div id={panelId} role="tabpanel" aria-label={COPY.filters[filter]}>
                <QueryBoundary
                    flush
                    query={query}
                    isEmpty={({ items }) => items.length === 0}
                    skeleton={<SectionSkeleton bare rows={6} />}
                    empty={
                        seesPermittedOnly(workspace.role) ? (
                            notShared
                        ) : (
                            <EmptyState {...EMPTY_STATES.recentActivity} />
                        )
                    }
                    denied={notShared}
                >
                    {({ items }) => {
                        const shown = items.filter(
                            ({ status }) =>
                                filter === "all" || status === filter,
                        );

                        return shown.length === 0 ? (
                            <p className="text-text-secondary px-4 py-4 text-sm">
                                {COPY.nonePending}
                            </p>
                        ) : (
                            <>
                                <table className="w-full">
                                    <caption className="sr-only">
                                        {DASHBOARD_COPY.sections.recentActivity}
                                    </caption>
                                    <thead>
                                        <tr>
                                            {HEADS.map(({ id, className }) => (
                                                <th
                                                    key={id}
                                                    scope="col"
                                                    className={`data-head ${className}`}
                                                >
                                                    {COPY.columns[id]}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    {activityDays(
                                        shown,
                                        workspace.timeZone,
                                    ).map((day) => (
                                        <tbody key={day.label}>
                                            <tr>
                                                <th
                                                    scope="rowgroup"
                                                    colSpan={4}
                                                    className="figure-label bg-background-muted border-border-light border-b px-4 py-1.5 text-left"
                                                >
                                                    <time dateTime={day.date}>
                                                        {day.label}
                                                    </time>
                                                </th>
                                            </tr>
                                            {day.items.map((transaction) => (
                                                <TransactionRow
                                                    key={transaction.id}
                                                    transaction={transaction}
                                                />
                                            ))}
                                        </tbody>
                                    ))}
                                </table>
                                {shown.some(
                                    ({ status }) => status === "pending",
                                ) ? (
                                    <p className="text-text-muted px-4 py-3 text-xs">
                                        {COPY.provisional}
                                    </p>
                                ) : null}
                                <p role="status" className="sr-only">
                                    {COPY.loaded(shown.length)}
                                </p>
                            </>
                        );
                    }}
                </QueryBoundary>
            </div>
        </SectionCard>
    );
}
