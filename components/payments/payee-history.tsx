import PayeeLastPaid from "@/components/payments/payee-last-paid";
import PayeeTotals from "@/components/payments/payee-totals";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

export default function PayeeHistory({ payee }: { payee: Payee }) {
    return (
        <dl className="grid grid-cols-2 gap-x-3 pt-2 text-sm">
            <div className="flex flex-col gap-0.5">
                <dt className="micro-label text-text-muted">
                    {PAYEE_COPY.lastPaid}
                </dt>
                <dd className="text-text-secondary">
                    <PayeeLastPaid lastPaidAt={payee.lastPaidAt} />
                </dd>
            </div>
            <div className="flex flex-col gap-0.5">
                <dt className="micro-label text-text-muted">
                    {PAYEE_COPY.totalPaid}
                </dt>
                <dd>
                    <PayeeTotals payee={payee} />
                </dd>
            </div>
        </dl>
    );
}
