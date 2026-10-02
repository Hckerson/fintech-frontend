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
import type { Transaction } from "@/lib/types";
import { seesPermittedOnly } from "@/lib/utils/permissions";
import { TRANSACTIONS_ROUTE } from "@/lib/workspace/constants";

const COPY = DASHBOARD_COPY.activity;

const FILTERS = [
    { id: "all", label: COPY.filters.all },
    { id: "pending", label: COPY.filters.pending },
] as const;

type Filter = (typeof FILTERS)[number]["id"];

export default function RecentActivity() {
    const { workspace } = useWorkspace();
    const panelId = useId();
    const [filter, setFilter] = useState<Filter>("all");
    const query = useTransactions({ limit: DASHBOARD_ACTIVITY_LIMIT });
    const shown = (items: Transaction[]) =>
        filter === "all"
            ? items
            : items.filter(({ status }) => status === filter);
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
                    {({ items }) => (
                        <>
                            <table className="w-full">
                                <caption className="sr-only">
                                    {DASHBOARD_COPY.sections.recentActivity}
                                </caption>
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="data-head hidden md:table-cell"
                                        >
                                            {COPY.columns.date}
                                        </th>
                                        <th scope="col" className="data-head">
                                            {COPY.columns.description}
                                        </th>
                                        <th
                                            scope="col"
                                            className="data-head hidden lg:table-cell"
                                        >
                                            {COPY.columns.category}
                                        </th>
                                        <th
                                            scope="col"
                                            className="data-head hidden sm:table-cell"
                                        >
                                            {COPY.columns.status}
                                        </th>
                                        <th
                                            scope="col"
                                            className="data-head text-right"
                                        >
                                            {COPY.columns.amount}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shown(items).map((transaction) => (
                                        <TransactionRow
                                            key={transaction.id}
                                            transaction={transaction}
                                            timeZone={workspace.timeZone}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            {shown(items).length === 0 ? (
                                <p className="text-text-secondary p-4 text-sm">
                                    {COPY.nonePending}
                                </p>
                            ) : null}
                            {shown(items).some(
                                ({ status }) => status === "pending",
                            ) ? (
                                <p className="text-text-muted px-4 py-2 text-xs">
                                    {COPY.provisional}
                                </p>
                            ) : null}
                            <p role="status" className="sr-only">
                                {COPY.loaded(shown(items).length)}
                            </p>
                        </>
                    )}
                </QueryBoundary>
            </div>
        </SectionCard>
    );
}
