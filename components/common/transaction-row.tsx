import clsx from "clsx";
import Link from "next/link";
import { Attachment, FlagFilled } from "@carbon/icons-react";
import Amount from "@/components/common/amount";
import StatusLabel from "@/components/ui/status-label";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import {
    TRANSACTION_STATUS_LABELS,
    UNKNOWN_STATUS,
} from "@/lib/data/status-labels";
import type { Transaction } from "@/lib/types";
import { transactionRoute } from "@/lib/workspace/constants";

interface Props {
    transaction: Transaction;
}

const COPY = DASHBOARD_COPY.activity;

export default function TransactionRow({ transaction }: Props) {
    const { counterparty, description, amount } = transaction;
    const status =
        TRANSACTION_STATUS_LABELS[transaction.status] ?? UNKNOWN_STATUS;
    const credit = !amount.amountMinor.startsWith("-");
    const settled = transaction.status === "posted";

    return (
        <tr className="hover:bg-background-muted relative">
            <td className="data-cell pl-0">
                <span className="flex items-center gap-2">
                    <Link
                        href={transactionRoute(transaction.id)}
                        className="text-text font-medium after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-(--colors-accent)"
                    >
                        {counterparty?.name ?? description}
                    </Link>
                    {transaction.flagged ? (
                        <FlagFilled
                            aria-label={COPY.flagged}
                            className="text-warning size-3 shrink-0"
                        />
                    ) : null}
                    {transaction.hasAttachments ? (
                        <Attachment
                            aria-label={COPY.attachments}
                            className="text-text-muted size-3 shrink-0"
                        />
                    ) : null}
                </span>
                <p className="text-text-muted text-xs">
                    {counterparty ? description : transaction.reference}
                </p>
            </td>
            <td className="data-cell text-text-secondary hidden lg:table-cell">
                {transaction.category ?? COPY.uncategorised}
            </td>
            <td className="data-cell hidden w-px whitespace-nowrap sm:table-cell">
                {settled ? (
                    <span className="text-text-muted">{status.label}</span>
                ) : (
                    <StatusLabel {...status} />
                )}
            </td>
            <td className="data-cell pr-0 text-right whitespace-nowrap">
                <Amount
                    {...amount}
                    display="signed"
                    className={clsx(
                        "tabular-nums",
                        status.severity === "problem"
                            ? "text-text-muted"
                            : credit
                              ? "text-success"
                              : "text-text",
                    )}
                />
                {settled ? null : (
                    <p className="pt-1 sm:hidden">
                        <StatusLabel {...status} />
                    </p>
                )}
            </td>
        </tr>
    );
}
