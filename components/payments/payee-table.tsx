"use client";
import PayeeRow from "@/components/payments/payee-row";
import PayeeSortHeader from "@/components/payments/payee-sort-header";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee, PayeeSort } from "@/lib/types";

interface Props {
    payees: Payee[];
    busy: boolean;
    hasMore: boolean;
    online: boolean;
    sort: PayeeSort;
    selectedId: string | undefined;
    onSort: (sort: PayeeSort) => void;
    onOpen: (payee: Payee) => void;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

const HEAD = "px-4 py-2.5 font-medium";

export default function PayeeTable({
    payees,
    busy,
    hasMore,
    online,
    sort,
    selectedId,
    onSort,
    onOpen,
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
                    <PayeeSortHeader
                        label={PAYEE_COPY.columns.payee}
                        first="name_asc"
                        second="name_desc"
                        sort={sort}
                        onSort={onSort}
                        className={HEAD}
                    />
                    <th scope="col" className={`${HEAD} max-2xl:hidden`}>
                        {PAYEE_COPY.destinationColumn}
                    </th>
                    <th scope="col" className={`${HEAD} max-md:hidden`}>
                        {PAYEE_COPY.columns.status}
                    </th>
                    <PayeeSortHeader
                        label={PAYEE_COPY.lastPaid}
                        first="last_paid_desc"
                        second="last_paid_asc"
                        sort={sort}
                        onSort={onSort}
                        className={`${HEAD} max-md:hidden`}
                    />
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
                        selected={payee.id === selectedId}
                        onOpen={onOpen}
                        onRename={onRename}
                        onRemove={onRemove}
                    />
                ))}
            </tbody>
        </table>
    );
}
