"use client";
import StepUpDialog from "@/components/common/step-up-dialog";
import AccountTable from "@/components/ledger/account-table";
import EmptyState from "@/components/ui/empty-state";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { ACCOUNTS_COPY as COPY } from "@/lib/data/ledger/copy";
import { useAccountReveal } from "@/lib/hooks/use-account-reveal";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { REVEAL_PURPOSE, REVEAL_TIMEOUT_MS } from "@/lib/ledger/constants";
import type { AccountGroup, AccountSortKey, AccountsQuery } from "@/lib/types";

interface Props {
    groups: AccountGroup[];
    query: AccountsQuery;
    clearHref: string;
    onSort: (key: AccountSortKey) => void;
}

export default function AccountResults({
    groups,
    query,
    clearHref,
    onSort,
}: Props) {
    const { can } = useWorkspace();
    const reveal = useAccountReveal();

    if (groups.length === 0) {
        return (
            <div className="p-4">
                <EmptyState
                    {...EMPTY_STATES.accountsNoMatch}
                    action={{ label: COPY.clear, href: clearHref }}
                />
            </div>
        );
    }

    return (
        <>
            <AccountTable
                groups={groups}
                query={query}
                onSort={onSort}
                reveal={can("revealAccountNumber") ? reveal : null}
            />
            <p className="text-text-muted px-4 py-2 text-xs">
                {COPY.closedNote}
            </p>
            <p role="status" className="sr-only">
                {reveal.shown ? COPY.revealed(REVEAL_TIMEOUT_MS / 1_000) : ""}
            </p>
            {reveal.challenge ? (
                <StepUpDialog
                    purpose={REVEAL_PURPOSE}
                    onSettle={reveal.settleChallenge}
                />
            ) : null}
        </>
    );
}
