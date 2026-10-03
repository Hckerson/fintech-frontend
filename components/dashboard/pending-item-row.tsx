import clsx from "clsx";
import Link from "next/link";
import {
    ChevronRight,
    Download,
    Identification,
    Time,
    WarningAlt,
    type CarbonIconType,
} from "@carbon/icons-react";
import Amount from "@/components/common/amount";
import IconTile from "@/components/ui/icon-tile";
import type { PendingItem, PendingItemKind } from "@/lib/types";

interface Props {
    item: PendingItem;
}

const ICONS: Record<PendingItemKind, CarbonIconType> = {
    pending_transactions: Time,
    export_ready: Download,
    export_failed: WarningAlt,
    verification_request: Identification,
};

const ROW = "flex items-center gap-3 px-4 py-3";

export default function PendingItemRow({ item }: Props) {
    const Icon = ICONS[item.kind];
    const body = (
        <>
            <IconTile icon={<Icon />} tone={item.severity} />
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-text text-compact font-medium">
                    {item.title}
                </span>
                <span className="text-text-muted text-xs break-words">
                    {item.detail}
                    {item.amount ? (
                        <>
                            {" · "}
                            <Amount
                                {...item.amount}
                                display="signed"
                                className="text-text-secondary whitespace-nowrap tabular-nums"
                            />
                        </>
                    ) : null}
                </span>
            </span>
        </>
    );

    return item.href ? (
        <Link
            href={item.href}
            className={clsx(
                ROW,
                "group hover:bg-background-muted focus-visible:outline-accent focus-visible:outline-2 focus-visible:-outline-offset-2",
            )}
        >
            {body}
            <ChevronRight
                aria-hidden
                className="text-text-muted group-hover:text-text size-4 shrink-0"
            />
        </Link>
    ) : (
        <div className={ROW}>{body}</div>
    );
}
