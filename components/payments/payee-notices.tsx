import type { RefObject } from "react";
import { CheckmarkFilled, WarningAlt } from "@carbon/icons-react";
import { PAYEE_COPY } from "@/lib/data/payments/copy";

interface Props {
    online: boolean;
    outcome: string;
    outcomeRef: RefObject<HTMLParagraphElement | null>;
}

const BAR = "border-border flex items-start gap-2 border-b px-4 py-2.5 text-sm";

export default function PayeeNotices({ online, outcome, outcomeRef }: Props) {
    return (
        <>
            <p
                role="status"
                className={online ? "sr-only" : `${BAR} text-warning`}
            >
                {online ? null : (
                    <WarningAlt
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0"
                    />
                )}
                {online ? "" : PAYEE_COPY.offline}
            </p>
            <p
                ref={outcomeRef}
                tabIndex={-1}
                role="status"
                className={
                    outcome ? `${BAR} text-text focus:outline-none` : "sr-only"
                }
            >
                {outcome ? (
                    <CheckmarkFilled
                        aria-hidden
                        className="text-success mt-0.5 size-4 shrink-0"
                    />
                ) : null}
                {outcome}
            </p>
        </>
    );
}
