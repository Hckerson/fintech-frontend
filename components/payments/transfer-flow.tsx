"use client";
import { nanoid } from "nanoid";
import { useState } from "react";
import NotPermitted from "@/components/common/not-permitted";
import TransferBody from "@/components/payments/transfer-body";
import TransferResult from "@/components/payments/transfer-result";
import TransferSteps from "@/components/payments/transfer-steps";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES, PAYMENTS_ROUTE } from "@/lib/constants";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import { usePayees } from "@/lib/hooks/use-payees";
import { useTransferOptions } from "@/lib/hooks/use-transfer-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { Transfer, TransferDraft, TransferStep } from "@/lib/types";

const CRUMBS = [
    { label: TRANSFER_COPY.crumb, href: PAYMENTS_ROUTE },
    { label: PAGE_TITLES.transfer },
];

const blank = (payeeId = ""): TransferDraft => ({
    fromAccountId: "",
    kind: "payee",
    payeeId,
    accountId: "",
    amount: "",
    memo: "",
});

export default function TransferFlow({ payeeId }: { payeeId?: string }) {
    const { can } = useWorkspace();
    const allowed = can("transferMoney");
    const options = useTransferOptions(allowed);
    const payees = usePayees("", "active", allowed);
    const [draft, setDraft] = useState(() => blank(payeeId));
    const [step, setStep] = useState<TransferStep>("edit");
    const [idempotencyKey, setIdempotencyKey] = useState(() => nanoid());
    const [reviewId, setReviewId] = useState(0);
    const [result, setResult] = useState<Transfer | null>(null);
    const denied = !allowed || options.error?.kind === "forbidden";

    const review = () => {
        setStep("review");
        setReviewId((current) => current + 1);
        void options.refetch();
    };

    return (
        <>
            <PageHeader title={PAGE_TITLES.transfer} crumbs={CRUMBS} />
            {denied ? (
                <NotPermitted page={PAGE_TITLES.transfer} />
            ) : (
                <>
                    <TransferSteps step={result ? "done" : step} />
                    {result ? (
                        <TransferResult
                            transfer={result}
                            onAnother={() => {
                                setResult(null);
                                setDraft(blank());
                                setStep("edit");
                                setIdempotencyKey(nanoid());
                            }}
                        />
                    ) : (
                        <TransferBody
                            options={options}
                            payees={
                                payees.data?.pages.flatMap(
                                    (page) => page.items,
                                ) ?? []
                            }
                            draft={draft}
                            step={step}
                            reviewId={reviewId}
                            idempotencyKey={idempotencyKey}
                            onChange={(patch) => {
                                setDraft((current) => ({
                                    ...current,
                                    ...patch,
                                }));
                                setIdempotencyKey(nanoid());
                            }}
                            onReview={review}
                            onEdit={() => setStep("edit")}
                            onDone={setResult}
                        />
                    )}
                </>
            )}
        </>
    );
}
