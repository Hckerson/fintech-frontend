"use client";
import { useId } from "react";
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
    const reasonId = useId();

    return (
        <tr className="border-border hover:bg-background-muted/40 border-t align-top transition-colors">
            <th scope="row" className={`${CELL} text-left font-normal`}>
                <PayeeIdentity payee={payee} reasonId={reasonId} />
            </th>
            <td className={`${CELL} leading-8 max-lg:hidden`}>
                <PayeeDestination payee={payee} />
            </td>
            <td className={`${CELL} leading-8 max-md:hidden`}>
                <PayeeStatus status={payee.status} />
            </td>
            <td
                className={`${CELL} text-text-secondary leading-8 whitespace-nowrap max-md:hidden`}
            >
                <PayeeLastPaid lastPaidAt={payee.lastPaidAt} />
            </td>
            <td className={`${CELL} text-right leading-8 max-md:hidden`}>
                <PayeeTotals totals={payee.totalPaid} />
            </td>
            <td className={CELL}>
                <PayeeActions
                    payee={payee}
                    online={online}
                    reasonId={reasonId}
                    onRename={onRename}
                    onRemove={onRemove}
                />
            </td>
        </tr>
    );
}
