"use client";
import PayeeTotal from "@/components/payments/payee-total";
import Popover from "@/components/ui/popover";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

export default function PayeeTotals({ payee }: { payee: Payee }) {
    const [first, ...rest] = payee.totalPaid;

    if (!first) {
        return (
            <span className="text-text-muted">{PAYEE_COPY.nothingPaid}</span>
        );
    }

    return (
        <span className="inline-flex items-center gap-2">
            {rest.length > 0 ? (
                <Popover
                    label={PAYEE_COPY.moreCurrencies(rest.length, payee.name)}
                    align="end"
                    triggerClassName="border-border text-text-secondary hover:border-border-dark hover:text-text text-caption rounded-full border px-1.5 py-0.5 tabular-nums"
                    trigger={`+${rest.length}`}
                >
                    <span className="micro-label text-text-muted">
                        {PAYEE_COPY.totalPaid}
                    </span>
                    {payee.totalPaid.map((total) => (
                        <PayeeTotal key={total.currency} {...total} />
                    ))}
                </Popover>
            ) : null}
            <PayeeTotal {...first} />
        </span>
    );
}
