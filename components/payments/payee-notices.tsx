import { WarningAlt } from "@carbon/icons-react";
import { PAYEE_COPY } from "@/lib/data/payments/copy";

export default function PayeeNotices({ online }: { online: boolean }) {
    return (
        <p
            role="status"
            className={
                online
                    ? "sr-only"
                    : "border-border text-warning flex items-start gap-2 border-b px-4 py-2.5 text-sm"
            }
        >
            {online ? null : (
                <WarningAlt aria-hidden className="mt-0.5 size-4 shrink-0" />
            )}
            {online ? "" : PAYEE_COPY.offline}
        </p>
    );
}
