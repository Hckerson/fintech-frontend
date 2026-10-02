"use client";
import PayeeRow from "@/components/payments/payee-row";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

interface Props {
    payees: Payee[];
    busy: boolean;
    hasMore: boolean;
    online: boolean;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

const HEAD = "px-4 py-2.5 font-medium";

export default function PayeeTable({
    payees,
    busy,
    hasMore,
    online,
    onRename,
    onRemove,
}: Props) {
    return (
        <table aria-busy={busy} className="w-full text-sm">
            <caption className="sr-only">
                {PAYEE_COPY.caption(payees.length, hasMore)}
            </caption>
            <thead>
                <tr className="micro-label bg-background-muted/50 text-text-muted text-left">
                    <th scope="col" className={HEAD}>
                        {PAYEE_COPY.columns.payee}
                    </th>
                    <th scope="col" className={`${HEAD} max-lg:hidden`}>
                        {PAYEE_COPY.destinationColumn}
                    </th>
                    <th scope="col" className={`${HEAD} max-md:hidden`}>
                        {PAYEE_COPY.columns.status}
                    </th>
                    <th scope="col" className={`${HEAD} max-md:hidden`}>
                        {PAYEE_COPY.lastPaid}
                    </th>
                    <th
                        scope="col"
                        className={`${HEAD} text-right max-md:hidden`}
                    >
                        {PAYEE_COPY.totalPaid}
                    </th>
                    <th scope="col" className={HEAD}>
                        <span className="sr-only">
                            {PAYEE_COPY.columns.actions}
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {payees.map((payee) => (
                    <PayeeRow
                        key={payee.id}
                        payee={payee}
                        online={online}
                        onRename={onRename}
                        onRemove={onRemove}
                    />
                ))}
            </tbody>
        </table>
    );
}
