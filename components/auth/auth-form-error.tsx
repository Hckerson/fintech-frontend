import type { Ref } from "react";
import { WarningFilled } from "@carbon/icons-react";

interface Props {
    id: string;
    message: string | null;
    ref: Ref<HTMLParagraphElement>;
}

export default function AuthFormError({ id, message, ref }: Props) {
    return (
        <p
            ref={ref}
            id={id}
            tabIndex={-1}
            aria-live="polite"
            className={
                message
                    ? "border-error/30 bg-error-light text-error flex gap-3 rounded-xl border px-4 py-3 text-sm focus:outline-none"
                    : "sr-only"
            }
        >
            {message && (
                <WarningFilled aria-hidden className="mt-0.5 size-4 shrink-0" />
            )}
            {message ?? ""}
        </p>
    );
}
