"use client";
import AsOf from "@/components/common/as-of";
import SectionCard from "@/components/common/section-card";
import SectionSkeleton from "@/components/common/section-skeleton";
import CashPositionTotal from "@/components/dashboard/cash-position-total";
import EmptyState from "@/components/ui/empty-state";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { VERIFICATION_COPY } from "@/lib/data/verification";
import { useCashPosition } from "@/lib/hooks/use-cash-position";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { ACCOUNTS_ROUTE, ONBOARDING_ROUTE } from "@/lib/workspace/constants";

export default function CashPosition() {
    const { workspace, can } = useWorkspace();
    const query = useCashPosition();

    return (
        <SectionCard
            flush
            title={DASHBOARD_COPY.sections.cashPosition}
            action={{
                label: DASHBOARD_COPY.cash.accounts,
                href: ACCOUNTS_ROUTE,
            }}
        >
            <QueryBoundary
                flush
                query={query}
                isEmpty={(positions) => positions.length === 0}
                skeleton={<SectionSkeleton bare rows={1} rowClassName="h-20" />}
                empty={
                    <EmptyState
                        {...EMPTY_STATES.cashPosition}
                        action={
                            can("completeVerification")
                                ? {
                                      label: VERIFICATION_COPY.continue,
                                      href: ONBOARDING_ROUTE,
                                  }
                                : undefined
                        }
                    />
                }
            >
                {(positions) => (
                    <>
                        {positions.map((position) => (
                            <CashPositionTotal
                                key={position.currency}
                                position={position}
                                timeZone={workspace.timeZone}
                            />
                        ))}
                        <div className="border-border text-text-muted flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2 text-xs">
                            <p>{DASHBOARD_COPY.cash.excluded}</p>
                            <AsOf
                                asOf={positions[0].asOf}
                                timeZone={workspace.timeZone}
                            />
                        </div>
                        <p role="status" className="sr-only">
                            {DASHBOARD_COPY.cash.loaded(positions.length)}
                        </p>
                    </>
                )}
            </QueryBoundary>
        </SectionCard>
    );
}
