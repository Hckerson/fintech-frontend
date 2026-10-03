"use client";
import PayeeActivity from "@/components/payments/payee-activity";
import PayeeLastPaid from "@/components/payments/payee-last-paid";
import PayeeSpendChart from "@/components/payments/payee-spend-chart";
import PayeeStatus from "@/components/payments/payee-status";
import PayeeTotal from "@/components/payments/payee-total";
import StatusLabel from "@/components/ui/status-label";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { usePayeeActivity } from "@/lib/hooks/use-payee-activity";
import type { Payee } from "@/lib/types";

export default function PayeeDetail({ payee }: { payee: Payee }) {
    const activity = usePayeeActivity(payee.id);
    const reasons = [
        payee.status === "active"
            ? null
            : PAYEE_COPY.reasons.pendingVerification,
        payee.paymentInProgress ? PAYEE_COPY.reasons.paymentInProgress : null,
    ].filter(Boolean);

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                <PayeeStatus status={payee.status} />
                {payee.paymentInProgress ? (
                    <StatusLabel
                        label={PAYEE_COPY.inProgress}
                        severity="information"
                    />
                ) : null}
            </div>
            {reasons.length > 0 ? (
                <p className="border-border text-text-secondary rounded-lg border px-3 py-2 text-sm">
                    {reasons.join(" ")}
                </p>
            ) : null}
            <dl className="border-border bg-border grid grid-cols-2 gap-px overflow-hidden rounded-lg border text-sm">
                <div className="bg-background-alt flex flex-col gap-1 p-3">
                    <dt className="micro-label text-text-muted">
                        {PAYEE_COPY.totalPaid}
                    </dt>
                    <dd className="flex flex-col">
                        {payee.totalPaid.length === 0 ? (
                            <span className="text-text-muted">
                                {PAYEE_COPY.nothingPaid}
                            </span>
                        ) : (
                            payee.totalPaid.map((total) => (
                                <PayeeTotal key={total.currency} {...total} />
                            ))
                        )}
                    </dd>
                </div>
                <div className="bg-background-alt flex flex-col gap-1 p-3">
                    <dt className="micro-label text-text-muted">
                        {PAYEE_COPY.lastPaid}
                    </dt>
                    <dd className="text-text">
                        <PayeeLastPaid lastPaidAt={payee.lastPaidAt} />
                    </dd>
                </div>
            </dl>
            <PayeeSpendChart payments={activity.data?.items ?? []} />
            <PayeeActivity payeeId={payee.id} />
        </>
    );
}
