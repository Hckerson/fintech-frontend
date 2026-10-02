"use client";
import Link from "next/link";
import { nanoid } from "nanoid";
import { useState } from "react";
import PayeeFooter from "@/components/payments/payee-footer";
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
import { useOverdue } from "@/lib/hooks/use-overdue";
import type { Payee } from "@/lib/types";
import { formatInstant } from "@/lib/utils/date-formatter";
import { queryString } from "@/lib/utils/query-string";

interface Props {
    payees: ReturnType<typeof usePayees>;
    term: string;
    filtered: boolean;
    online: boolean;
    onAdd: () => void;
    onClear: () => void;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

export default function PayeeResults({
    payees,
    term,
    filtered,
    online,
    onAdd,
    onClear,
    onRename,
    onRemove,
}: Props) {
    const [deviceReference] = useState(() => nanoid());
    const slow = useOverdue(payees.isFetching, SLOW_REQUEST_MS);
    const pages = payees.data?.pages;
    const items = pages?.flatMap((page) => page.items) ?? [];
    const failure = payees.error;
    const retry = () => void payees.refetch();
    const slowNotice = slow ? (
        <p role="status" className="text-text-secondary px-4 pt-3 text-sm">
            {PAYEE_COPY.slow}
        </p>
    ) : null;

    if (!pages && failure) {
        const kind = READ_ERROR_KIND[failure.kind] ?? "non-retryable";
        return (
            <div className="px-4 py-4">
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
            <div className="px-4 py-4">
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
                filtered={filtered}
                online={online}
                onAdd={onAdd}
                onClear={onClear}
            />
        );
    }

    return (
        <div className="flex flex-col">
            {failure ? (
                <div className="border-border border-b px-4 py-3">
                    <ErrorState
                        kind="retryable"
                        message={PAYEE_COPY.stale(
                            formatInstant(pages[pages.length - 1].asOf),
                        )}
                        reference={failure.reference}
                        onRetry={retry}
                        retrying={payees.isFetching}
                    />
                </div>
            ) : null}
            {slowNotice}
            <PayeeTable
                payees={items}
                busy={payees.isFetching}
                hasMore={payees.hasNextPage}
                online={online}
                onRename={onRename}
                onRemove={onRemove}
            />
            <PayeeFooter
                shown={items.length}
                matched={pages[pages.length - 1].matched}
                asOf={pages[pages.length - 1].asOf}
                hasMore={payees.hasNextPage}
                loadingMore={payees.isFetchingNextPage}
                onLoadMore={() => void payees.fetchNextPage()}
            />
        </div>
    );
}
