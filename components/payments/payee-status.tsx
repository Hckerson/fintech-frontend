import clsx from "clsx";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

const DOT: Record<Payee["status"], string> = {
    active: "bg-success",
    pending_verification: "bg-warning",
};

export default function PayeeStatus({ status }: { status: Payee["status"] }) {
    return (
        <span
            className={clsx(
                "inline-flex items-center gap-2 text-xs whitespace-nowrap",
                status === "active" ? "text-text-secondary" : "text-warning",
            )}
        >
            <span
                aria-hidden
                className={clsx("size-1.5 rounded-full", DOT[status])}
            />
            {PAYEE_COPY.status[status]}
        </span>
    );
}
