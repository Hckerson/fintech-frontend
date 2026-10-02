import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

export default function PayeeDestination({ payee }: { payee: Payee }) {
    return (
        <span className="flex flex-wrap items-baseline gap-x-2">
            <span
                className={
                    payee.bankName ? "text-text-secondary" : "text-text-muted"
                }
            >
                {payee.bankName ?? PAYEE_COPY.bankUnknown}
            </span>
            <span aria-hidden className="text-text-muted font-mono text-xs">
                {PAYEE_COPY.destination(payee.destinationLast4)}
            </span>
            <span className="sr-only">
                {PAYEE_COPY.destinationSpoken(payee.destinationLast4)}
            </span>
        </span>
    );
}
