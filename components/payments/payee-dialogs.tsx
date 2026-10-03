"use client";
import PayeeAddDialog from "@/components/payments/payee-add-dialog";
import PayeeRemoveDialog from "@/components/payments/payee-remove-dialog";
import PayeeRenameDialog from "@/components/payments/payee-rename-dialog";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee, PayeeTarget } from "@/lib/types";

interface Props {
    target: PayeeTarget | null;
    current: Payee | undefined;
    onClose: () => void;
    onDone: (message: string) => void;
}

export default function PayeeDialogs({
    target,
    current,
    onClose,
    onDone,
}: Props) {
    if (target?.kind === "add") {
        return (
            <PayeeAddDialog
                onClose={onClose}
                onAdded={(payee) => onDone(PAYEE_COPY.added(payee.name))}
            />
        );
    }
    if (target?.kind === "rename") {
        return (
            <PayeeRenameDialog
                payee={target.payee}
                current={current}
                onClose={onClose}
                onRenamed={(from, payee) =>
                    onDone(PAYEE_COPY.renamed(from, payee.name))
                }
            />
        );
    }
    if (target?.kind === "remove") {
        return (
            <PayeeRemoveDialog
                payee={target.payee}
                onClose={onClose}
                onRemoved={(payee) => onDone(PAYEE_COPY.removed(payee.name))}
            />
        );
    }
    return null;
}
