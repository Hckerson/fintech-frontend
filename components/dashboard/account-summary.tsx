"use client";
import AccountRow from "@/components/common/account-row";
import AsOf from "@/components/common/as-of";
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
            title={DASHBOARD_COPY.sections.accountSummary}
            action={{ label: COPY.all, href: ACCOUNTS_ROUTE }}
        >
            <QueryBoundary
                query={query}
                isEmpty={({ items }) => heldAccounts(items).length === 0}
                skeleton={<SectionSkeleton bare rows={4} />}
                empty={empty}
                denied={<EmptyState {...EMPTY_STATES.accountsNotShared} />}
            >
                {({ items, asOf }) => {
                    const { listed, hidden } = listedAccounts(
                        items,
                        DASHBOARD_ACCOUNT_LIMIT,
                    );
                    return (
                        <>
                            <ul className="flex flex-col">
                                {listed.map((account) => (
                                    <li
                                        key={account.id}
                                        className="border-border-light border-t first:border-t-0"
                                    >
                                        <AccountRow account={account} />
                                    </li>
                                ))}
                            </ul>
                            {hidden > 0 ? (
                                <p className="text-text-secondary text-xs">
                                    {COPY.more(hidden)}
                                </p>
                            ) : null}
                            <AsOf asOf={asOf} timeZone={workspace.timeZone} />
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
