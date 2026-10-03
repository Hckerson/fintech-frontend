import clsx from "clsx";
import Link from "next/link";
import { ChevronRight } from "@carbon/icons-react";
import Amount from "@/components/common/amount";
import type { PendingItem, Severity } from "@/lib/types";

interface Props {
    item: PendingItem;
}

const DOT: Record<Severity, string> = {
    neutral: "bg-text-muted",
    positive: "bg-success",
    attention: "bg-warning",
    problem: "bg-error",
    information: "bg-accent",
};

const ROW = "flex items-start gap-3 py-3";

export default function PendingItemRow({ item }: Props) {
    const body = (
        <>
            <span
                aria-hidden
                className={clsx(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    DOT[item.severity],
                )}
            />
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-text text-compact font-medium">
                    {item.title}
                </span>
                <span className="text-text-muted text-xs break-words">
                    {item.detail}
                </span>
            </span>
            {item.amount ? (
                <Amount
                    {...item.amount}
                    display="signed"
                    className="text-text text-compact whitespace-nowrap tabular-nums"
                />
            ) : null}
        </>
    );

    return item.href ? (
        <Link
            href={item.href}
            className={clsx(
                ROW,
                "group hover:bg-background-muted focus-visible:outline-accent -mx-2 rounded-md px-2 focus-visible:outline-2",
            )}
        >
            {body}
            <ChevronRight
                aria-hidden
                className="text-text-muted group-hover:text-text mt-0.5 size-4 shrink-0"
            />
        </Link>
    ) : (
        <div className={ROW}>{body}</div>
    );
}
