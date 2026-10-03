"use client";
import PayeeFooter from "@/components/payments/payee-footer";
import PayeeEmpty from "@/components/payments/payee-empty";
import PayeeLoadFailure from "@/components/payments/payee-load-failure";
import PayeeListSkeleton from "@/components/payments/payee-list-skeleton";
import PayeeTable from "@/components/payments/payee-table";
import ErrorState from "@/components/ui/error-state";
import { SLOW_REQUEST_MS } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { usePayees } from "@/lib/hooks/use-payees";
import { useOverdue } from "@/lib/hooks/use-overdue";
import type { Payee, PayeeSort } from "@/lib/types";
import { formatInstant } from "@/lib/utils/date-formatter";

interface Props {
    payees: ReturnType<typeof usePayees>;
    term: string;
    filtered: boolean;
    online: boolean;
    sort: PayeeSort;
    selectedId: string | undefined;
    onSort: (sort: PayeeSort) => void;
    onOpen: (payee: Payee) => void;
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
    sort,
    selectedId,
    onSort,
    onOpen,
    onAdd,
    onClear,
    onRename,
    onRemove,
}: Props) {
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

    if (!pages && (failure || !online)) {
        return (
            <PayeeLoadFailure
                failure={failure}
                retrying={payees.isFetching}
                onRetry={retry}
            />
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
                sort={sort}
                selectedId={selectedId}
                onSort={onSort}
                onOpen={onOpen}
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
