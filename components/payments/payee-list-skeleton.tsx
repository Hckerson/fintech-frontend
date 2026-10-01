import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { PAYEE_SKELETON_ROWS } from "@/lib/payments/constants";

export default function PayeeListSkeleton() {
    return (
        <div
            role="status"
            aria-busy
            className="surface-card flex flex-col gap-3 p-3"
        >
            <span className="sr-only">{PAYEE_COPY.loading}</span>
            {Array.from({ length: PAYEE_SKELETON_ROWS }, (_, row) => (
                <div
                    key={row}
                    aria-hidden
                    className="bg-background-muted animate-ledger-pulse h-16 rounded-lg"
                />
            ))}
        </div>
    );
}
