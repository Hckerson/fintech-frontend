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
            title={DASHBOARD_COPY.sections.recentActivity}
            action={{ label: COPY.all, href: TRANSACTIONS_ROUTE }}
        >
            <QueryBoundary
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
                        <ul className="flex flex-col">
                            {items.map((transaction) => (
                                <li
                                    key={transaction.id}
                                    className="border-border-light border-t first:border-t-0"
                                >
                                    <TransactionRow
                                        transaction={transaction}
                                        timeZone={workspace.timeZone}
                                    />
                                </li>
                            ))}
                        </ul>
                        {items.some(({ status }) => status === "pending") ? (
                            <p className="text-text-muted text-xs">
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
