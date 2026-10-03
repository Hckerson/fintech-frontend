"use client";
import PayeeActions from "@/components/payments/payee-actions";
import PayeeDestination from "@/components/payments/payee-destination";
import PayeeIdentity from "@/components/payments/payee-identity";
import PayeeLastPaid from "@/components/payments/payee-last-paid";
import PayeeStatus from "@/components/payments/payee-status";
import PayeeTotals from "@/components/payments/payee-totals";
import type { Payee } from "@/lib/types";

interface Props {
    payee: Payee;
    online: boolean;
    selected: boolean;
    onOpen: (payee: Payee) => void;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

const CELL = "px-4 py-3";

const INTERACTIVE = "a, button, [role='menu'], [role='dialog']";

export default function PayeeRow({
    payee,
    online,
    selected,
    onOpen,
    onRename,
    onRemove,
}: Props) {
    return (
        <tr
            onClick={(event) => {
                if (
                    event.target instanceof Element &&
                    !event.target.closest(INTERACTIVE)
                ) {
                    onOpen(payee);
                }
            }}
            aria-selected={selected}
            className="border-border hover:bg-background-muted/40 xl:aria-selected:bg-background-muted cursor-pointer border-t align-middle transition-colors xl:aria-selected:shadow-[inset_2px_0_0_var(--colors-accent)]"
        >
            <th
                scope="row"
                className={`${CELL} max-w-0 text-left font-normal md:w-2/5`}
            >
                <PayeeIdentity payee={payee} onOpen={onOpen} />
            </th>
            <td className={`${CELL} whitespace-nowrap max-2xl:hidden`}>
                <PayeeDestination payee={payee} />
            </td>
            <td className={`${CELL} max-md:hidden`}>
                <PayeeStatus status={payee.status} />
            </td>
            <td
                className={`${CELL} text-text-secondary whitespace-nowrap max-md:hidden`}
            >
                <PayeeLastPaid lastPaidAt={payee.lastPaidAt} />
            </td>
            <td className={`${CELL} text-right max-md:hidden`}>
                <PayeeTotals payee={payee} />
            </td>
            <td className={`${CELL} w-px max-md:align-top`}>
                <PayeeActions
                    payee={payee}
                    online={online}
                    onOpen={onOpen}
                    onRename={onRename}
                    onRemove={onRemove}
                />
            </td>
        </tr>
    );
}
