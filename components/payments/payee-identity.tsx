import PayeeDestination from "@/components/payments/payee-destination";
import PayeeHistory from "@/components/payments/payee-history";
import PayeeStatus from "@/components/payments/payee-status";
import Avatar from "@/components/ui/avatar";
import StatusLabel from "@/components/ui/status-label";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

export default function PayeeIdentity({ payee }: { payee: Payee }) {
    return (
        <div className="flex items-start gap-3 md:items-center">
            <Avatar name={payee.name} className="size-8" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex min-h-8 items-center gap-2">
                    <span
                        title={payee.name}
                        className="text-text font-medium max-md:wrap-anywhere md:truncate"
                    >
                        {payee.name}
                    </span>
                    {payee.paymentInProgress ? (
                        <StatusLabel
                            label={PAYEE_COPY.inProgress}
                            severity="information"
                        />
                    ) : null}
                </span>
                <span className="text-xs lg:hidden">
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
