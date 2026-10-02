"use client";
import { useState } from "react";
import ConfirmDialog from "@/components/common/confirm-dialog";
import StepUpDialog from "@/components/common/step-up-dialog";
import WriteStatus from "@/components/common/write-status";
import Button from "@/components/ui/button";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import { useTransferStatus } from "@/lib/hooks/use-transfer-status";
import type {
    ProtectedWrite,
    Transfer,
    TransferInput,
    TransferReview,
} from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

interface Props {
    review: TransferReview;
    idempotencyKey: string;
    write: ProtectedWrite & {
        submit: (
            input: TransferInput,
            onSuccess: (transfer: Transfer) => void,
        ) => void;
    };
    onClose: () => void;
    onDone: (transfer: Transfer) => void;
}

const COPY = TRANSFER_COPY.confirm;

export default function TransferConfirm({
    review,
    idempotencyKey,
    write,
    onClose,
    onDone,
}: Props) {
    const status = useTransferStatus();
    const [cleared, setCleared] = useState(false);
    const unconfirmed = write.error?.kind === "unconfirmed";
    const { input, to } = review;

    const check = () =>
        status.mutate(idempotencyKey, {
            onSuccess: (transfer) => {
                if (transfer) return onDone(transfer);
                setCleared(true);
                write.reset();
            },
        });

    return (
        <ConfirmDialog
            title={COPY.title(
                formatMoney(input.amountMinor, input.currency) ?? "",
                to.name,
            )}
            consequence={COPY.consequence}
            confirmLabel={COPY.confirm}
            cancelLabel={COPY.cancel}
            confirmTone="accent"
            pending={write.pending || status.isPending}
            blocked={unconfirmed}
            onCancel={onClose}
            onConfirm={() => {
                setCleared(false);
                write.submit({ ...input, idempotencyKey }, onDone);
            }}
        >
            <WriteStatus
                notice={cleared ? TRANSFER_COPY.notRecorded : write.notice}
                error={write.error ?? status.error}
                message={unconfirmed ? TRANSFER_COPY.unconfirmed : undefined}
            />
            {unconfirmed ? (
                <Button
                    tone="quiet"
                    size="md"
                    isLoading={status.isPending}
                    onClick={check}
                    className="self-start"
                >
                    {TRANSFER_COPY.check}
                </Button>
            ) : null}
            {write.asking ? (
                <StepUpDialog purpose="transfer" onSettle={write.settle} />
            ) : null}
        </ConfirmDialog>
    );
}
