"use client";
import { useState } from "react";
import { nanoid } from "nanoid";
import SectionCard from "@/components/common/section-card";
import SectionSkeleton from "@/components/common/section-skeleton";
import PendingItemRow from "@/components/dashboard/pending-item-row";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";
import { DASHBOARD_PENDING_LIMIT } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { ERROR_COPY } from "@/lib/data/error-messages";
import { useExports } from "@/lib/hooks/use-exports";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { useVerificationCase } from "@/lib/hooks/use-verification-case";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { PendingSource } from "@/lib/types";
import { pendingItems } from "@/lib/utils/pending-items";
import { referenceOf } from "@/lib/utils/query-error";

const COPY = DASHBOARD_COPY.pending;

export default function PendingItems() {
    const { workspace, can } = useWorkspace();
    const [deviceReference] = useState(() => nanoid());
    const withExports = can("manageExports");
    const withVerification = can("manageAlertRules");
    const transactions = useTransactions({
        limit: DASHBOARD_PENDING_LIMIT,
        status: "pending",
    });
    const exports = useExports({ enabled: withExports });
    const verification = useVerificationCase({ enabled: withVerification });

    const sources = [
        {
            id: "transactions" as PendingSource,
            query: transactions,
            used: true,
        },
        { id: "exports" as PendingSource, query: exports, used: withExports },
        {
            id: "verification" as PendingSource,
            query: verification,
            used: withVerification,
        },
    ].filter(({ used }) => used);
    const failed = sources.filter(
        ({ query }) => query.isError && query.data === undefined,
    );
    const loading = sources.some(({ query }) => query.isPending);
    const retrying = failed.some(({ query }) => query.isFetching);
    const retry = () => failed.forEach(({ query }) => void query.refetch());
    const items = pendingItems({
        role: workspace.role,
        groups: transactions.data?.pending,
        exports: exports.data,
        verification: verification.data,
    });
    const listed = items.slice(0, DASHBOARD_PENDING_LIMIT);

    return (
        <SectionCard title={DASHBOARD_COPY.sections.pendingItems}>
            {loading ? (
                <div aria-busy>
                    <SectionSkeleton bare rows={3} />
                </div>
            ) : failed.length === sources.length ? (
                <ErrorState
                    kind="retryable"
                    message={ERROR_COPY.loadFailed}
                    reference={
                        referenceOf(failed[0]?.query.error) ?? deviceReference
                    }
                    onRetry={retry}
                    retrying={retrying}
                />
            ) : (
                <>
                    {failed.length > 0 ? (
                        <div role="status" className="flex flex-col gap-2">
                            <p className="text-warning text-xs">
                                {COPY.partial}{" "}
                                {failed
                                    .map(({ id }) => COPY.failed[id])
                                    .join(" ")}
                            </p>
                            <Button
                                size="sm"
                                tone="quiet"
                                onClick={retry}
                                isLoading={retrying}
                                className="w-fit"
                            >
                                {ERROR_COPY.retry}
                            </Button>
                        </div>
                    ) : null}
                    {listed.length > 0 ? (
                        <ul className="flex flex-col">
                            {listed.map((item) => (
                                <li
                                    key={item.id}
                                    className="border-border-light border-t first:border-t-0"
                                >
                                    <PendingItemRow item={item} />
                                </li>
                            ))}
                        </ul>
                    ) : failed.length === 0 ? (
                        <EmptyState {...EMPTY_STATES.pendingItems} />
                    ) : null}
                    {items.length > listed.length ? (
                        <p className="text-text-secondary text-xs">
                            {COPY.more(items.length - listed.length)}
                        </p>
                    ) : null}
                    <p role="status" className="sr-only">
                        {COPY.loaded(items.length)}
                    </p>
                </>
            )}
        </SectionCard>
    );
}
