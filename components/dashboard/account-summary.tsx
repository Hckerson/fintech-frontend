"use client";
import OpenSection from "@/components/common/open-section";
import SectionSkeleton from "@/components/common/section-skeleton";
import AccountLine from "@/components/dashboard/account-line";
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
    const notShared = <EmptyState {...EMPTY_STATES.accountsNotShared} />;

    return (
        <OpenSection
            title={DASHBOARD_COPY.sections.accountSummary}
            action={{ label: COPY.all, href: ACCOUNTS_ROUTE }}
            count={
                query.data ? heldAccounts(query.data.items).length : undefined
            }
        >
            <QueryBoundary
                query={query}
                isEmpty={({ items }) => heldAccounts(items).length === 0}
                skeleton={<SectionSkeleton bare rows={4} rowClassName="h-12" />}
                empty={
                    seesPermittedOnly(workspace.role) ? (
                        notShared
                    ) : (
                        <EmptyState {...EMPTY_STATES.accounts} />
                    )
                }
                denied={notShared}
            >
                {({ items }) => {
                    const { listed, hidden } = listedAccounts(
                        items,
                        DASHBOARD_ACCOUNT_LIMIT,
                    );
                    return (
                        <>
                            <ul className="border-border flex flex-col border-t">
                                {listed.map((account) => (
                                    <li
                                        key={account.id}
                                        className="border-border-light border-b last:border-b-0"
                                    >
                                        <AccountLine account={account} />
                                    </li>
                                ))}
                            </ul>
                            {hidden > 0 ? (
                                <p className="text-text-muted text-xs">
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
        </OpenSection>
    );
}
