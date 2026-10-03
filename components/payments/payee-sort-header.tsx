"use client";
import clsx from "clsx";
import { ArrowDown, ArrowUp, ArrowsVertical } from "@carbon/icons-react";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { PayeeSort } from "@/lib/types";

interface Props {
    label: string;
    first: PayeeSort;
    second: PayeeSort;
    sort: PayeeSort;
    className?: string;
    onSort: (sort: PayeeSort) => void;
}

export default function PayeeSortHeader({
    label,
    first,
    second,
    sort,
    className,
    onSort,
}: Props) {
    const active = sort === first || sort === second;
    const ascending = sort.endsWith("asc");
    const Icon = active ? (ascending ? ArrowUp : ArrowDown) : ArrowsVertical;

    return (
        <th
            scope="col"
            aria-sort={
                active ? (ascending ? "ascending" : "descending") : "none"
            }
            className={className}
        >
            <button
                type="button"
                title={PAYEE_COPY.sortBy(label)}
                onClick={() => onSort(sort === first ? second : first)}
                className={clsx(
                    "hover:text-text focus-visible:outline-accent -mx-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 uppercase focus-visible:outline-2",
                    active && "text-text",
                )}
            >
                {label}
                <Icon
                    aria-hidden
                    className={clsx("size-3", active || "opacity-50")}
                />
            </button>
        </th>
    );
}
