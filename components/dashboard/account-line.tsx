import Link from "next/link";
import Amount from "@/components/common/amount";
import StatusLabel from "@/components/ui/status-label";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { ACCOUNT_STATE_LABELS, UNKNOWN_STATUS } from "@/lib/data/status-labels";
import type { Account } from "@/lib/types";
import { accountRoute } from "@/lib/workspace/constants";

interface Props {
    account: Account;
}

const COPY = DASHBOARD_COPY.accounts;

export default function AccountLine({ account }: Props) {
    const state = ACCOUNT_STATE_LABELS[account.state] ?? UNKNOWN_STATUS;

    return (
        <Link
            href={accountRoute(account.id)}
            className="hover:bg-background-muted focus-visible:outline-accent flex items-center justify-between gap-3 px-4 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2"
        >
            <span className="flex min-w-0 flex-col">
                <span className="text-text text-compact truncate font-medium">
                    {account.name}
                </span>
                <span className="text-text-muted text-xs">
                    {COPY.kinds[account.kind] ?? account.kind}
                    {" · "}
                    <span aria-hidden className="font-mono">
                        ••{account.last4}
                    </span>
                    <span className="sr-only">
                        {COPY.ending(account.last4)}
                    </span>
                </span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1">
                <Amount
                    {...account.available}
                    className="text-text text-compact font-medium tabular-nums"
                />
                {state.severity === "positive" ? (
                    <span className="text-text-muted font-mono text-xs">
                        {account.currency}
                    </span>
                ) : (
                    <StatusLabel {...state} />
                )}
            </span>
        </Link>
    );
}
