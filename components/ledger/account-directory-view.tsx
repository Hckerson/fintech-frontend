"use client";
import { useRouter } from "next/navigation";
import { useId, useTransition } from "react";
import NotPermitted from "@/components/common/not-permitted";
import SectionCard from "@/components/common/section-card";
import SectionSkeleton from "@/components/common/section-skeleton";
import AccountDirectoryEmpty from "@/components/ledger/account-directory-empty";
import AccountFilters from "@/components/ledger/account-filters";
import AccountResults from "@/components/ledger/account-results";
import EmptyState from "@/components/ui/empty-state";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { PAGE_TITLES } from "@/lib/constants";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { ACCOUNTS_COPY as COPY } from "@/lib/data/ledger/copy";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { DEFAULT_ACCOUNT_SORT } from "@/lib/ledger/constants";
import type {
    AccountSortKey,
    AccountsParams,
    AccountsQuery,
} from "@/lib/types";
import {
    accountCurrencies,
    accountGroups,
} from "@/lib/utils/account-directory";
import { queryString } from "@/lib/utils/query-string";
import { ACCOUNTS_ROUTE } from "@/lib/workspace/constants";

const hrefFor = ({ state, currency, sort, dir }: AccountsQuery) => {
    const custom =
        sort !== DEFAULT_ACCOUNT_SORT.sort || dir !== DEFAULT_ACCOUNT_SORT.dir;
    return `${ACCOUNTS_ROUTE}${queryString({
        state,
        currency,
        sort: custom ? sort : undefined,
        dir: custom ? dir : undefined,
    })}`;
};

export default function AccountDirectoryView({
    dropped,
    ...params
}: AccountsParams) {
    const router = useRouter();
    const panelId = useId();
    const [navigating, startTransition] = useTransition();
    const { can } = useWorkspace();
    const query = useAccounts();
    const all = query.data?.items ?? [];
    const show = (next: Partial<AccountsQuery>) =>
        startTransition(() =>
            router.replace(hrefFor({ ...params, ...next }), { scroll: false }),
        );
    const sortBy = (key: AccountSortKey) =>
        show({
            sort: key,
            dir: params.sort === key && params.dir === "asc" ? "desc" : "asc",
        });

    if (!can("viewAccounts")) {
        return <NotPermitted page={PAGE_TITLES.accounts} />;
    }

    return (
        <SectionCard
            flush
            title={COPY.panel}
            aside={
                <AccountFilters
                    state={params.state}
                    currency={params.currency}
                    currencies={accountCurrencies(all)}
                    panelId={panelId}
                    disabled={navigating}
                    onState={(state) => show({ state })}
                    onCurrency={(currency) => show({ currency })}
                />
            }
        >
            {dropped.length > 0 ? (
                <p
                    role="status"
                    className="border-border text-warning border-b px-4 py-2 text-xs"
                >
                    {COPY.dropped(dropped.join(", "))}
                </p>
            ) : null}
            <div id={panelId} role="tabpanel" aria-label={COPY.panel}>
                <QueryBoundary
                    flush
                    query={query}
                    isEmpty={({ items }) => items.length === 0}
                    skeleton={<SectionSkeleton bare rows={6} />}
                    empty={<AccountDirectoryEmpty />}
                    denied={<EmptyState {...EMPTY_STATES.accountsNotShared} />}
                >
                    {({ items }) => (
                        <AccountResults
                            groups={accountGroups(items, params)}
                            query={params}
                            onSort={sortBy}
                            clearHref={hrefFor({
                                ...params,
                                state: undefined,
                                currency: undefined,
                            })}
                        />
                    )}
                </QueryBoundary>
            </div>
        </SectionCard>
    );
}
