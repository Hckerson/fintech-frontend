"use client";
import SectionCard from "@/components/common/section-card";
import SectionSkeleton from "@/components/common/section-skeleton";
import TransactionRow from "@/components/common/transaction-row";
import EmptyState from "@/components/ui/empty-state";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { DASHBOARD_ACTIVITY_LIMIT } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { seesPermittedOnly } from "@/lib/utils/permissions";
import { TRANSACTIONS_ROUTE } from "@/lib/workspace/constants";

const COPY = DASHBOARD_COPY.activity;

export default function RecentActivity() {
    const { workspace } = useWorkspace();
    const query = useTransactions({ limit: DASHBOARD_ACTIVITY_LIMIT });
    const notShared = <EmptyState {...EMPTY_STATES.accountsNotShared} />;

    return (
        <SectionCard
            flush
            title={DASHBOARD_COPY.sections.recentActivity}
            action={{ label: COPY.all, href: TRANSACTIONS_ROUTE }}
        >
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
                                    <th scope="col" className="data-head">
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
                                {items.map((transaction) => (
                                    <TransactionRow
                                        key={transaction.id}
                                        transaction={transaction}
                                        timeZone={workspace.timeZone}
                                    />
                                ))}
                            </tbody>
                        </table>
                        {items.some(({ status }) => status === "pending") ? (
                            <p className="text-text-muted px-4 py-2 text-xs">
                                {COPY.provisional}
                            </p>
                        ) : null}
                        <p role="status" className="sr-only">
                            {COPY.loaded(items.length)}
                        </p>
                    </>
                )}
            </QueryBoundary>
        </SectionCard>
    );
}
