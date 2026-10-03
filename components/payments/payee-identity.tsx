"use client";
import PayeeDestination from "@/components/payments/payee-destination";
import PayeeHistory from "@/components/payments/payee-history";
import PayeeStatus from "@/components/payments/payee-status";
import Avatar from "@/components/ui/avatar";
import StatusLabel from "@/components/ui/status-label";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

interface Props {
    payee: Payee;
    onOpen: (payee: Payee) => void;
}

export default function PayeeIdentity({ payee, onOpen }: Props) {
    return (
        <div className="flex items-start gap-3 md:items-center">
            <Avatar name={payee.name} className="size-8" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex min-h-8 items-center gap-2">
                    <button
                        type="button"
                        aria-label={PAYEE_COPY.detailsNamed(payee.name)}
                        onClick={() => onOpen(payee)}
                        className="text-text focus-visible:outline-accent cursor-pointer rounded text-left font-medium underline-offset-4 hover:underline focus-visible:outline-2 max-md:wrap-anywhere md:truncate"
                    >
                        {payee.name}
                    </button>
                    {payee.paymentInProgress ? (
                        <StatusLabel
                            label={PAYEE_COPY.inProgress}
                            severity="information"
                        />
                    ) : null}
                </span>
                <span className="text-xs 2xl:hidden">
                    <PayeeDestination payee={payee} />
                </span>
                <span className="md:hidden">
                    <PayeeStatus status={payee.status} />
                </span>
                <div className="md:hidden">
                    <PayeeHistory payee={payee} />
                </div>
            </div>
        </div>
    );
}
