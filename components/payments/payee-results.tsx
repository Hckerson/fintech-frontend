"use client";
import Link from "next/link";
import { nanoid } from "nanoid";
import { useState } from "react";
import PayeeEmpty from "@/components/payments/payee-empty";
import PayeeListSkeleton from "@/components/payments/payee-list-skeleton";
import PayeeTable from "@/components/payments/payee-table";
import ErrorState from "@/components/ui/error-state";
import { LOGIN_ROUTE, PAYMENTS_ROUTE, SLOW_REQUEST_MS } from "@/lib/constants";
import {
    ERROR_COPY,
    ERROR_MESSAGE,
    READ_ERROR_KIND,
} from "@/lib/data/error-messages";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { usePayees } from "@/lib/hooks/use-payees";
import { useSettled } from "@/lib/hooks/use-settled";
import type { Payee } from "@/lib/types";
import { formatInstant } from "@/lib/utils/date-formatter";
import { queryString } from "@/lib/utils/query-string";

interface Props {
    payees: ReturnType<typeof usePayees>;
    term: string;
    online: boolean;
    onAdd: () => void;
    onClear: () => void;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

export default function PayeeResults({
    payees,
    term,
    online,
    onAdd,
    onClear,
    onRename,
    onRemove,
}: Props) {
    const [deviceReference] = useState(() => nanoid());
    const slow =
        useSettled(payees.isFetching, SLOW_REQUEST_MS) && payees.isFetching;
    const pages = payees.data?.pages;
    const items = pages?.flatMap((page) => page.items) ?? [];
    const failure = payees.error;
    const retry = () => void payees.refetch();
    const slowNotice = slow ? (
        <p role="status" className="text-text-secondary text-sm">
            {PAYEE_COPY.slow}
        </p>
    ) : null;

    if (!pages && failure) {
        const kind = READ_ERROR_KIND[failure.kind] ?? "non-retryable";
        return (
            <div className="surface-card p-4">
                <ErrorState
                    kind={kind}
                    message={
                        kind === "retryable"
                            ? ERROR_COPY.loadFailed
                            : failure.kind === "unauthenticated"
                              ? ERROR_MESSAGE.unauthenticated
                              : ERROR_COPY.cannotLoad
                    }
                    reference={failure.reference}
                    onRetry={retry}
                    retrying={payees.isFetching}
                >
                    {failure.kind === "unauthenticated" ? (
                        <Link
                            href={`${LOGIN_ROUTE}${queryString({ next: PAYMENTS_ROUTE })}`}
                            className="text-accent text-sm underline underline-offset-4"
                        >
                            {ERROR_COPY.signIn}
                        </Link>
                    ) : null}
                </ErrorState>
            </div>
        );
    }
    if (!pages && !online) {
        return (
            <div className="surface-card p-4">
                <ErrorState
                    kind="offline"
                    message={ERROR_COPY.offline}
                    reference={deviceReference}
                />
            </div>
        );
    }
    if (!pages || (items.length === 0 && payees.isPlaceholderData)) {
        return (
            <>
                {slowNotice}
                <PayeeListSkeleton />
            </>
        );
    }
    if (items.length === 0) {
        return (
            <PayeeEmpty
                term={term}
                online={online}
                onAdd={onAdd}
                onClear={onClear}
            />
        );
    }

    return (
        <div className="surface-card flex flex-col gap-3 p-3">
            {failure ? (
                <ErrorState
                    kind="retryable"
                    message={PAYEE_COPY.stale(
                        formatInstant(pages[pages.length - 1].asOf),
                    )}
                    reference={failure.reference}
                    onRetry={retry}
                    retrying={payees.isFetching}
                />
            ) : null}
            {slowNotice}
            <PayeeTable
                payees={items}
                busy={payees.isFetching}
                hasMore={payees.hasNextPage}
                loadingMore={payees.isFetchingNextPage}
                online={online}
                onLoadMore={() => void payees.fetchNextPage()}
                onRename={onRename}
                onRemove={onRemove}
            />
        </div>
    );
}
