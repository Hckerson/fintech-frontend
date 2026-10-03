"use client";
import clsx from "clsx";
import { ArrowDown, ArrowUp, ArrowsVertical } from "@carbon/icons-react";
import type { SortDirection } from "@/lib/types";

interface Props {
    label: string;
    actionLabel: string;
    direction: SortDirection | null;
    onSort: () => void;
    align?: "left" | "right";
    className?: string;
}

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;

export default function SortHeader({
    label,
    actionLabel,
    direction,
    onSort,
    align = "left",
    className,
}: Props) {
    const Icon =
        direction === "asc"
            ? ArrowUp
            : direction === "desc"
              ? ArrowDown
              : ArrowsVertical;

    return (
        <th
            scope="col"
            aria-sort={direction ? ARIA_SORT[direction] : undefined}
            className={clsx(
                "data-head",
                align === "right" && "text-right",
                className,
            )}
        >
            <button
                type="button"
                aria-label={actionLabel}
                onClick={onSort}
                className={clsx(
                    "hover:text-text focus-visible:outline-accent inline-flex cursor-pointer items-center gap-1 rounded uppercase focus-visible:outline-2",
                    direction && "text-text",
                )}
            >
                {label}
                <Icon aria-hidden className="size-3" />
            </button>
        </th>
    );
}
