import Link from "next/link";
import Amount from "@/components/common/amount";
import type { PendingItem } from "@/lib/types";

interface Props {
    item: PendingItem;
}

export default function PendingItemRow({ item }: Props) {
    const body = (
        <>
            <span className="text-text text-sm">{item.title}</span>
            <span className="text-text-secondary text-xs break-words">
                {item.detail}
                {item.amount ? (
                    <>
                        {" · "}
                        <Amount
                            {...item.amount}
                            display="signed"
                            className="text-text tabular-nums"
                        />
                    </>
                ) : null}
            </span>
        </>
    );

    return item.href ? (
        <Link
            href={item.href}
            className="hover:bg-background-muted focus-visible:outline-accent -mx-2 flex flex-col gap-1 rounded-md px-2 py-2.5 focus-visible:outline-2"
        >
            {body}
        </Link>
    ) : (
        <div className="flex flex-col gap-1 py-2.5">{body}</div>
    );
}
