import clsx from "clsx";
import Link from "next/link";
import { Attachment, FlagFilled } from "@carbon/icons-react";
import Amount from "@/components/common/amount";
import StatusLabel from "@/components/ui/status-label";
import { NOT_AVAILABLE } from "@/lib/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import {
    TRANSACTION_STATUS_LABELS,
    UNKNOWN_STATUS,
} from "@/lib/data/status-labels";
import type { Transaction } from "@/lib/types";
import { CALENDAR_DAY, zonedLabel } from "@/lib/utils/zoned-time";
import { DEFAULT_TIME_ZONE, transactionRoute } from "@/lib/workspace/constants";

interface Props {
    transaction: Transaction;
    timeZone: string;
}

const COPY = DASHBOARD_COPY.activity;

export default function TransactionRow({ transaction, timeZone }: Props) {
    const { postedAt, createdAt, counterparty, description, amount } =
        transaction;
    const status =
        TRANSACTION_STATUS_LABELS[transaction.status] ?? UNKNOWN_STATUS;
    const date =
        (postedAt
            ? zonedLabel(postedAt, DEFAULT_TIME_ZONE, CALENDAR_DAY)
            : zonedLabel(createdAt, timeZone, CALENDAR_DAY)) ?? NOT_AVAILABLE;
    const credit = !amount.amountMinor.startsWith("-");

    return (
        <tr className="hover:bg-background-muted relative">
            <td className="data-cell text-text-muted hidden w-px whitespace-nowrap md:table-cell">
                <time dateTime={postedAt ?? createdAt}>{date}</time>
            </td>
            <td className="data-cell">
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
                    <span className="md:hidden"> · {date}</span>
                </p>
            </td>
            <td className="data-cell text-text-secondary hidden lg:table-cell">
                {transaction.category ?? COPY.uncategorised}
            </td>
            <td className="data-cell hidden w-px sm:table-cell">
                <StatusLabel {...status} />
            </td>
            <td className="data-cell text-right whitespace-nowrap">
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
                <p className="pt-1 sm:hidden">
                    <StatusLabel {...status} />
                </p>
            </td>
        </tr>
    );
}
