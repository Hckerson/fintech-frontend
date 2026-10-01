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
    const date = postedAt
        ? zonedLabel(postedAt, DEFAULT_TIME_ZONE, CALENDAR_DAY)
        : zonedLabel(createdAt, timeZone, CALENDAR_DAY);

    return (
        <Link
            href={transactionRoute(transaction.id)}
            className="hover:bg-background-muted focus-visible:outline-accent -mx-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-md px-2 py-2.5 text-sm focus-visible:outline-2"
        >
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-text break-words">
                    {counterparty?.name ?? description}
                </span>
                <span className="text-text-muted flex flex-wrap items-center gap-x-2 text-xs">
                    <time dateTime={postedAt ?? createdAt}>
                        {date ?? NOT_AVAILABLE}
                    </time>
                    {counterparty ? <span>{description}</span> : null}
                    {transaction.flagged ? (
                        <span className="text-warning inline-flex items-center gap-1">
                            <FlagFilled aria-hidden className="size-3" />
                            {COPY.flagged}
                        </span>
                    ) : null}
                    {transaction.hasAttachments ? (
                        <span className="inline-flex items-center gap-1">
                            <Attachment aria-hidden className="size-3" />
                            <span className="sr-only">{COPY.attachments}</span>
                        </span>
                    ) : null}
                </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
                {transaction.status === "posted" ? (
                    <span className="sr-only">{status.label}</span>
                ) : (
                    <StatusLabel {...status} />
                )}
                <Amount
                    {...amount}
                    display="signed"
                    className={clsx(
                        "tabular-nums",
                        amount.amountMinor.startsWith("-")
                            ? "text-text"
                            : "text-success",
                    )}
                />
            </span>
        </Link>
    );
}
