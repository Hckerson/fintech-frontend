"use client";
import Link from "next/link";
import { nanoid } from "nanoid";
import { useState } from "react";
import TransferAside from "@/components/payments/transfer-aside";
import TransferForm from "@/components/payments/transfer-form";
import TransferReview from "@/components/payments/transfer-review";
import TransferSkeleton from "@/components/payments/transfer-skeleton";
import { buttonClass } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";
import { PAYMENTS_ROUTE } from "@/lib/constants";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { ERROR_COPY, READ_ERROR_KIND } from "@/lib/data/error-messages";
import { useOnline } from "@/lib/hooks/use-online";
import type { useTransferOptions } from "@/lib/hooks/use-transfer-options";
import { checkDraft } from "@/lib/payments/transfer-draft";
import type { Payee, Transfer, TransferDraft, TransferStep } from "@/lib/types";

interface Props {
    options: ReturnType<typeof useTransferOptions>;
    payees: readonly Payee[];
    draft: TransferDraft;
    step: TransferStep;
    reviewId: number;
    idempotencyKey: string;
    onChange: (patch: Partial<TransferDraft>) => void;
    onReview: () => void;
    onEdit: () => void;
    onDone: (transfer: Transfer) => void;
}

export default function TransferBody({
    options,
    payees,
    draft,
    step,
    reviewId,
    idempotencyKey,
    onChange,
    onReview,
    onEdit,
    onDone,
}: Props) {
    const online = useOnline();
    const [deviceReference] = useState(() => nanoid());
    const { data, error } = options;

    if (!data) {
        if (!error && online) return <TransferSkeleton />;
        const kind = error
            ? (READ_ERROR_KIND[error.kind] ?? "non-retryable")
            : "offline";
        return (
            <div className="surface-card p-4">
                <ErrorState
                    kind={kind}
                    message={
                        kind === "retryable"
                            ? ERROR_COPY.loadFailed
                            : kind === "offline"
                              ? ERROR_COPY.offline
                              : ERROR_COPY.cannotLoad
                    }
                    reference={error?.reference ?? deviceReference}
                    onRetry={() => void options.refetch()}
                    retrying={options.isFetching}
                />
            </div>
        );
    }

    const open = data.accounts.filter(({ state }) => state === "OPEN");
    if (open.length === 0 || (open.length < 2 && payees.length === 0)) {
        return (
            <div className="surface-card p-4">
                <EmptyState
                    title={EMPTY_STATES.transfer.title}
                    body={EMPTY_STATES.transfer.body}
                >
                    <Link
                        href={PAYMENTS_ROUTE}
                        className={buttonClass("quiet", "md")}
                    >
                        {EMPTY_STATES.transfer.action}
                    </Link>
                </EmptyState>
            </div>
        );
    }

    const filled = {
        ...draft,
        fromAccountId: draft.fromAccountId || open[0].id,
    };
    const check = checkDraft(filled, data, payees);
    const reviewing = step === "review" && check.review;

    return (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,40rem)_20rem]">
            {reviewing ? (
                <TransferReview
                    key={reviewId}
                    review={reviewing}
                    idempotencyKey={idempotencyKey}
                    online={online}
                    onEdit={onEdit}
                    onAgain={onReview}
                    onDone={onDone}
                />
            ) : (
                <TransferForm
                    draft={filled}
                    options={data}
                    payees={payees}
                    check={check}
                    changed={step === "review"}
                    onChange={onChange}
                    onReview={onReview}
                />
            )}
            <TransferAside
                options={data}
                source={data.accounts.find(
                    ({ id }) => id === filled.fromAccountId,
                )}
            />
        </div>
    );
}
