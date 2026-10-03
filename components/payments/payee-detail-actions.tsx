"use client";
import Link from "next/link";
import Button, { buttonClass } from "@/components/ui/button";
import { transferRoute } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

interface Props {
    payee: Payee;
    online: boolean;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

export default function PayeeDetailActions({
    payee,
    online,
    onRename,
    onRemove,
}: Props) {
    const removable = online && !payee.paymentInProgress;

    return (
        <>
            <Button
                tone="ghost"
                size="md"
                aria-disabled={!removable}
                onClick={() => removable && onRemove(payee)}
            >
                {PAYEE_COPY.remove}
            </Button>
            <Button
                tone="quiet"
                size="md"
                aria-disabled={!online}
                onClick={() => online && onRename(payee)}
            >
                {PAYEE_COPY.rename}
            </Button>
            {payee.status === "active" ? (
                <Link
                    href={transferRoute(payee.id)}
                    aria-label={PAYEE_COPY.payNamed(payee.name)}
                    className={buttonClass("accent", "md")}
                >
                    {PAYEE_COPY.pay}
                </Link>
            ) : null}
        </>
    );
}
