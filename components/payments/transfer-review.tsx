"use client";
import { useEffect, useRef, useState } from "react";
import { WarningAlt } from "@carbon/icons-react";
import TransferConfirm from "@/components/payments/transfer-confirm";
import TransferDetails from "@/components/payments/transfer-details";
import Button from "@/components/ui/button";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import { useCreateTransfer } from "@/lib/hooks/use-create-transfer";
import { useOverdue } from "@/lib/hooks/use-overdue";
import { useProtectedWrite } from "@/lib/hooks/use-protected-write";
import {
    TRANSFER_REFUSALS,
    TRANSFER_REVIEW_TTL_MS,
} from "@/lib/payments/transfer-constants";
import type {
    Transfer,
    TransferRefusal,
    TransferReview as Review,
} from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

interface Props {
    review: Review;
    idempotencyKey: string;
    online: boolean;
    onEdit: () => void;
    onAgain: () => void;
    onDone: (transfer: Transfer) => void;
}

const COPY = TRANSFER_COPY.review;

export default function TransferReview({
    review,
    idempotencyKey,
    online,
    onEdit,
    onAgain,
    onDone,
}: Props) {
    const heading = useRef<HTMLHeadingElement>(null);
    const lapsed = useOverdue(true, TRANSFER_REVIEW_TTL_MS);
    const write = useProtectedWrite(useCreateTransfer());
    const [confirming, setConfirming] = useState(false);
    const refused = write.error?.kind === "conflict";
    const code = TRANSFER_REFUSALS.find((entry) => entry === write.error?.code);
    const notice = lapsed
        ? COPY.lapsed
        : refused
          ? TRANSFER_COPY.issues[code ?? ("cut_off_passed" as TransferRefusal)]
          : online
            ? null
            : COPY.offline;
    const { input, from, to } = review;

    useEffect(() => heading.current?.focus(), []);

    return (
        <section
            aria-labelledby="transfer-review"
            className="surface-card flex min-w-0 flex-col gap-4 p-4"
        >
            <div className="flex flex-col gap-1">
                <h2
                    ref={heading}
                    id="transfer-review"
                    tabIndex={-1}
                    className="text-text text-sm font-medium focus:outline-none"
                >
                    {COPY.title}
                </h2>
                <p className="text-text-secondary text-sm">{COPY.lead}</p>
            </div>
            {notice ? (
                <p
                    role="alert"
                    className="border-warning/30 text-warning flex items-start gap-2 rounded-lg border px-3 py-2 text-sm"
                >
                    <WarningAlt
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0"
                    />
                    {refused && !code ? COPY.changed : notice}
                </p>
            ) : null}
            <TransferDetails
                amountMinor={input.amountMinor}
                currency={input.currency}
                from={from}
                fromNote={COPY.fromBalance(
                    formatMoney(from.availableMinor, from.currency) ?? "",
                )}
                to={to}
                memo={input.memo}
                settlesOn={input.settlesOn}
            />
            <div className="border-border flex flex-wrap justify-end gap-2 border-t pt-4">
                <Button tone="ghost" size="lg" onClick={onEdit}>
                    {COPY.edit}
                </Button>
                {lapsed ? (
                    <Button size="lg" onClick={onAgain}>
                        {COPY.again}
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        aria-disabled={!online}
                        onClick={() => {
                            if (!online) return;
                            write.reset();
                            setConfirming(true);
                        }}
                    >
                        {COPY.confirm}
                    </Button>
                )}
            </div>
            {confirming && !refused && !lapsed ? (
                <TransferConfirm
                    review={review}
                    idempotencyKey={idempotencyKey}
                    write={write}
                    onClose={() => setConfirming(false)}
                    onDone={onDone}
                />
            ) : null}
        </section>
    );
}
