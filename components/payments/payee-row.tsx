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
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

const CELL = "px-4 py-3";

export default function PayeeRow({ payee, online, onRename, onRemove }: Props) {
    return (
        <tr className="border-border hover:bg-background-muted/40 border-t align-middle transition-colors">
            <th
                scope="row"
                className={`${CELL} max-w-0 text-left font-normal md:w-2/5`}
            >
                <PayeeIdentity payee={payee} />
            </th>
            <td className={`${CELL} whitespace-nowrap max-lg:hidden`}>
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
                    onRename={onRename}
                    onRemove={onRemove}
                />
            </td>
        </tr>
    );
}
