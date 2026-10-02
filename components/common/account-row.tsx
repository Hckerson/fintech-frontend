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
    return (
        <tr className="hover:bg-background-muted relative">
            <td className="data-cell">
                <Link
                    href={accountRoute(account.id)}
                    className="text-text font-medium after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-(--colors-accent)"
                >
                    {account.name}
                </Link>
                <p className="text-text-muted text-xs">
                    {COPY.kinds[account.kind] ?? account.kind}
                    {" · "}
                    <span aria-hidden>••{account.last4}</span>
                    <span className="sr-only">
                        {COPY.ending(account.last4)}
                    </span>
                </p>
            </td>
            <td className="data-cell w-px">
                <StatusLabel
                    {...(ACCOUNT_STATE_LABELS[account.state] ?? UNKNOWN_STATUS)}
                />
            </td>
            <td className="data-cell text-right whitespace-nowrap">
                <Amount
                    {...account.available}
                    className="text-text tabular-nums"
                />
                <p className="text-text-muted text-xs">{account.currency}</p>
            </td>
        </tr>
    );
}
