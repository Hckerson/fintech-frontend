"use client";
import PayeeRow from "@/components/payments/payee-row";
import Button from "@/components/ui/button";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

interface Props {
    payees: Payee[];
    busy: boolean;
    hasMore: boolean;
    loadingMore: boolean;
    online: boolean;
    onLoadMore: () => void;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

export default function PayeeTable({
    payees,
    busy,
    hasMore,
    loadingMore,
    online,
    onLoadMore,
    onRename,
    onRemove,
}: Props) {
    return (
        <>
            <table aria-busy={busy} className="w-full text-sm">
                <caption className="sr-only">
                    {PAYEE_COPY.caption(payees.length, hasMore)}
                </caption>
                <thead>
                    <tr className="micro-label text-text-muted text-left">
                        <th scope="col" className="pb-2 font-medium">
                            {PAYEE_COPY.columns.payee}
                        </th>
                        <th
                            scope="col"
                            className="pb-2 font-medium max-sm:hidden"
                        >
                            {PAYEE_COPY.columns.history}
                        </th>
                        <th scope="col" className="pb-2 text-right font-medium">
                            {PAYEE_COPY.columns.actions}
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
            {hasMore ? (
                <Button
                    tone="quiet"
                    size="lg"
                    isLoading={loadingMore}
                    onClick={onLoadMore}
                    className="self-center"
                >
                    {PAYEE_COPY.loadMore}
                </Button>
            ) : null}
        </>
    );
}
