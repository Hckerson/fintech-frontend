"use client";
import PayeeDetail from "@/components/payments/payee-detail";
import PayeeDetailActions from "@/components/payments/payee-detail-actions";
import Sheet from "@/components/ui/sheet";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { PAYEE_SHEET_COPY } from "@/lib/data/payments/payee-sheet-copy";
import type { Payee } from "@/lib/types";

interface Props {
    payee: Payee;
    online: boolean;
    onClose: () => void;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

export default function PayeeSheet({
    payee,
    online,
    onClose,
    onRename,
    onRemove,
}: Props) {
    return (
        <Sheet
            open
            title={payee.name}
            description={`${payee.bankName ?? PAYEE_COPY.bankUnknown} · ${PAYEE_COPY.destinationSpoken(payee.destinationLast4)}`}
            closeLabel={PAYEE_SHEET_COPY.close}
            onClose={onClose}
            footer={
                <PayeeDetailActions
                    payee={payee}
                    online={online}
                    onRename={onRename}
                    onRemove={onRemove}
                />
            }
        >
            <PayeeDetail payee={payee} />
        </Sheet>
    );
}
