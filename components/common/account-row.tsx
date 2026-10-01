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

export default function AccountRow({ account }: Props) {
    const state = ACCOUNT_STATE_LABELS[account.state] ?? UNKNOWN_STATUS;

    return (
        <Link
            href={accountRoute(account.id)}
            className="hover:bg-background-muted focus-visible:outline-accent -mx-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-md px-2 py-2.5 text-sm focus-visible:outline-2"
        >
            <span className="flex min-w-0 flex-col">
                <span className="text-text break-words">{account.name}</span>
                <span className="text-text-muted text-xs">
                    <span aria-hidden>••{account.last4}</span>
                    <span className="sr-only">
                        {COPY.ending(account.last4)}
                    </span>
                    {" · "}
                    {account.currency}
                </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
                {state.severity === "positive" ? null : (
                    <StatusLabel {...state} />
                )}
                <Amount
                    {...account.available}
                    label={COPY.available}
                    className="text-text tabular-nums"
                />
            </span>
        </Link>
    );
}
