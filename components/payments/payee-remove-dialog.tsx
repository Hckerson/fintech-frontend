"use client";
import ConfirmDialog from "@/components/common/confirm-dialog";
import StepUpDialog from "@/components/common/step-up-dialog";
import WriteStatus from "@/components/common/write-status";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { useOnline } from "@/lib/hooks/use-online";
import { useProtectedWrite } from "@/lib/hooks/use-protected-write";
import { useRemovePayee } from "@/lib/hooks/use-remove-payee";
import { PAYEE_REFUSAL } from "@/lib/payments/constants";
import type { Payee } from "@/lib/types";

interface Props {
    payee: Payee;
    onClose: () => void;
    onRemoved: (payee: Payee) => void;
}

export default function PayeeRemoveDialog({
    payee,
    onClose,
    onRemoved,
}: Props) {
    const online = useOnline();
    const write = useProtectedWrite(useRemovePayee());
    const kind = write.error?.kind;
    const settled = kind === "conflict" || kind === "not_found";
    const message =
        write.error?.code === PAYEE_REFUSAL.paymentInProgress
            ? PAYEE_COPY.reasons.paymentInProgress
            : kind === "conflict"
              ? PAYEE_COPY.removeConflict
              : kind === "not_found"
                ? PAYEE_COPY.gone
                : undefined;

    return (
        <ConfirmDialog
            title={PAYEE_COPY.removeDialog.title(payee.name)}
            consequence={PAYEE_COPY.removeDialog.consequence(
                payee.name,
                PAYEE_COPY.destinationSpoken(payee.destinationLast4),
            )}
            confirmLabel={PAYEE_COPY.removeDialog.confirm}
            cancelLabel={settled ? PAYEE_COPY.close : PAYEE_COPY.cancel}
            pending={write.pending}
            blocked={settled || !online}
            onCancel={onClose}
            onConfirm={() =>
                write.submit(
                    { id: payee.id, updatedAt: payee.updatedAt },
                    onRemoved,
                )
            }
        >
            <WriteStatus
                notice={write.notice}
                error={write.error}
                message={message}
            />
            {online ? null : (
                <p className="text-warning text-sm">{PAYEE_COPY.offline}</p>
            )}
            {write.asking ? (
                <StepUpDialog purpose="payee_remove" onSettle={write.settle} />
            ) : null}
        </ConfirmDialog>
    );
}
