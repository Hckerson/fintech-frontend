"use client";
import AccountRow from "@/components/common/account-row";
import SectionCard from "@/components/common/section-card";
import SectionSkeleton from "@/components/common/section-skeleton";
import EmptyState from "@/components/ui/empty-state";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { DASHBOARD_ACCOUNT_LIMIT } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { heldAccounts, listedAccounts } from "@/lib/utils/account-list";
import { seesPermittedOnly } from "@/lib/utils/permissions";
import { ACCOUNTS_ROUTE } from "@/lib/workspace/constants";

const COPY = DASHBOARD_COPY.accounts;

export default function AccountSummary() {
    const { workspace } = useWorkspace();
    const query = useAccounts();
    const empty = (
        <EmptyState
            {...(seesPermittedOnly(workspace.role)
                ? EMPTY_STATES.accountsNotShared
                : EMPTY_STATES.accounts)}
        />
    );

    return (
        <SectionCard
            flush
            title={DASHBOARD_COPY.sections.accountSummary}
            action={{ label: COPY.all, href: ACCOUNTS_ROUTE }}
            count={
                query.data ? heldAccounts(query.data.items).length : undefined
            }
        >
            <QueryBoundary
                flush
                query={query}
                isEmpty={({ items }) => heldAccounts(items).length === 0}
                skeleton={<SectionSkeleton bare rows={4} />}
                empty={empty}
                denied={<EmptyState {...EMPTY_STATES.accountsNotShared} />}
            >
                {({ items }) => {
                    const { listed, hidden } = listedAccounts(
                        items,
                        DASHBOARD_ACCOUNT_LIMIT,
                    );
                    return (
                        <>
                            <table className="w-full">
                                <caption className="sr-only">
                                    {DASHBOARD_COPY.sections.accountSummary}
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col" className="data-head">
                                            {COPY.columns.account}
                                        </th>
                                        <th scope="col" className="data-head">
                                            {COPY.columns.status}
                                        </th>
                                        <th
                                            scope="col"
                                            className="data-head text-right"
                                        >
                                            {COPY.columns.available}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listed.map((account) => (
                                        <AccountRow
                                            key={account.id}
                                            account={account}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            {hidden > 0 ? (
                                <p className="text-text-muted px-4 py-2 text-xs">
                                    {COPY.more(hidden)}
                                </p>
                            ) : null}
                            <p role="status" className="sr-only">
                                {COPY.loaded(listed.length + hidden)}
                            </p>
                        </>
                    );
                }}
            </QueryBoundary>
        </SectionCard>
    );
}
