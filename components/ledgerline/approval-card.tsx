"use client";
import { useState } from "react";
import { ArrowRight, Reset } from "@carbon/icons-react";
import ApprovalStepRow from "@/components/ledgerline/approval-step-row";
import { APPROVAL_STEPS, PAYMENTS_COPY } from "@/lib/data/ledgerline/features";
import { formatMoney } from "@/lib/ledgerline/money";

export default function ApprovalCard() {
    const [approved, setApproved] = useState(false);

    return (
        <div className="surface-card product-frame flex flex-col gap-8 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-lg font-medium text-text">{PAYMENTS_COPY.cardTitle}</span>
                    <span className="text-sm text-text-muted">{PAYMENTS_COPY.cardMeta}</span>
                </div>
                <span className="ledger-figure text-text">{formatMoney(PAYMENTS_COPY.amountMinor, PAYMENTS_COPY.currency)}</span>
            </div>
            <ol className="flex flex-col">
                {APPROVAL_STEPS.map((step, index) => (
                    <ApprovalStepRow key={step.id} step={step} done={index === 0 || approved} pendingLabel={PAYMENTS_COPY.pending} />
                ))}
            </ol>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p role="status" className="text-sm text-success">
                    {approved ? PAYMENTS_COPY.approved : ""}
                </p>
                <button
                    type="button"
                    onClick={() => setApproved((value) => !value)}
                    className={
                        approved
                            ? "inline-flex h-11 items-center gap-2 rounded-full border border-border-dark px-5 text-sm text-text-secondary transition-colors hover:text-text"
                            : "group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-text-inverse transition-colors hover:bg-text"
                    }
                >
                    {approved ? PAYMENTS_COPY.reset : PAYMENTS_COPY.approve}
                    {approved ? (
                        <Reset aria-hidden className="size-4" />
                    ) : (
                        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                    )}
                </button>
            </div>
            <p className="font-mono text-xs text-text-muted">{PAYMENTS_COPY.note}</p>
        </div>
    );
}
