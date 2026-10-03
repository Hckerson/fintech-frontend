import Link from "next/link";
import Amount from "@/components/common/amount";
import AccountNumber from "@/components/ledger/account-number";
import StatusLabel from "@/components/ui/status-label";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { ACCOUNTS_COPY as COPY } from "@/lib/data/ledger/copy";
import { ACCOUNT_STATE_LABELS, UNKNOWN_STATUS } from "@/lib/data/status-labels";
import type { Account, AccountReveal } from "@/lib/types";
import { accountRoute } from "@/lib/workspace/constants";

interface Props {
    account: Account;
    reveal: AccountReveal | null;
}

const KINDS = DASHBOARD_COPY.accounts;

export default function AccountDirectoryRow({ account, reveal }: Props) {
    return (
        <tr className="hover:bg-background-muted relative">
            <td className="data-cell">
                <Link
                    href={accountRoute(account.id)}
                    className="text-text font-medium after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-(--colors-accent)"
                >
                    {account.name}
                </Link>
                <p className="text-text-muted flex flex-wrap items-center gap-1 text-xs">
                    {KINDS.kinds[account.kind] ?? account.kind}
                    {" · "}
                    <AccountNumber account={account} reveal={reveal} />
                </p>
            </td>
            <td className="data-cell w-px">
                <StatusLabel
                    {...(ACCOUNT_STATE_LABELS[account.state] ?? UNKNOWN_STATUS)}
                />
            </td>
            <td className="data-cell hidden text-right whitespace-nowrap sm:table-cell">
                <Amount
                    {...account.current}
                    className="text-text-secondary tabular-nums"
                />
            </td>
            <td className="data-cell text-right whitespace-nowrap">
                <Amount
                    {...account.available}
                    className="text-text font-medium tabular-nums"
                />
                <p className="text-text-muted text-xs sm:hidden">
                    {COPY.current}{" "}
                    <Amount {...account.current} className="tabular-nums" />
                </p>
            </td>
        </tr>
    );
}
