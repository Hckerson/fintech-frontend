"use client";
import clsx from "clsx";
import Link from "next/link";
import { useId } from "react";
import PayeeHistory from "@/components/payments/payee-history";
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

export default function PayeeRow({ payee, online, onRename, onRemove }: Props) {
    const reasonId = useId();
    const payable = payee.status === "active";
    const removable = online && !payee.paymentInProgress;
    const reasons = [
        payable ? null : PAYEE_COPY.reasons.pendingVerification,
        payee.paymentInProgress ? PAYEE_COPY.reasons.paymentInProgress : null,
    ].filter(Boolean);

    return (
        <tr className="border-border border-t align-top">
            <th scope="row" className="py-3 pr-3 text-left font-normal">
                <div className="flex flex-col items-start gap-1">
                    <span className="text-text font-medium wrap-anywhere">
                        {payee.name}
                    </span>
                    <span className="text-text-secondary text-xs">
                        {payee.bankName ?? PAYEE_COPY.bankUnknown} ·{" "}
                        <span aria-hidden className="font-mono">
                            {PAYEE_COPY.destination(payee.destinationLast4)}
                        </span>
                        <span className="sr-only">
                            {PAYEE_COPY.destinationSpoken(
                                payee.destinationLast4,
                            )}
                        </span>
                    </span>
                    <span
                        className={clsx(
                            "micro-label rounded-full border px-2 py-0.5",
                            payable
                                ? "border-success/40 text-success"
                                : "border-warning/40 text-warning",
                        )}
                    >
                        {PAYEE_COPY.status[payee.status]}
                    </span>
                    <span id={reasonId} className="text-text-muted text-xs">
                        {reasons.join(" ")}
                    </span>
                    <div className="sm:hidden">
                        <PayeeHistory payee={payee} />
                    </div>
                </div>
            </th>
            <td className="py-3 pr-3 max-sm:hidden">
                <PayeeHistory payee={payee} />
            </td>
            <td className="py-3">
                <div className="flex flex-col items-end gap-2 lg:flex-row lg:justify-end">
                    {payable ? (
                        <Link
                            href={transferRoute(payee.id)}
                            aria-label={PAYEE_COPY.payNamed(payee.name)}
                            className={buttonClass("quiet", "sm")}
                        >
                            {PAYEE_COPY.pay}
                        </Link>
                    ) : (
                        <Button
                            tone="quiet"
                            size="sm"
                            aria-disabled
                            aria-describedby={reasonId}
                            aria-label={PAYEE_COPY.payNamed(payee.name)}
                        >
                            {PAYEE_COPY.pay}
                        </Button>
                    )}
                    <Button
                        tone="ghost"
                        size="sm"
                        aria-disabled={!online}
                        aria-label={PAYEE_COPY.renameNamed(payee.name)}
                        onClick={() => online && onRename(payee)}
                    >
                        {PAYEE_COPY.rename}
                    </Button>
                    <Button
                        tone="ghost"
                        size="sm"
                        aria-disabled={!removable}
                        aria-describedby={reasonId}
                        aria-label={PAYEE_COPY.removeNamed(payee.name)}
                        onClick={() => removable && onRemove(payee)}
                    >
                        {PAYEE_COPY.remove}
                    </Button>
                </div>
            </td>
        </tr>
    );
}
