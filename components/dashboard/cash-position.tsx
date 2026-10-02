"use client";
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

const COPY = DASHBOARD_COPY.cash;

export default function CashPosition() {
    const { workspace, can } = useWorkspace();
    const query = useCashPosition();

    return (
        <SectionCard
            flush
            title={DASHBOARD_COPY.sections.cashPosition}
            action={{
                label: COPY.accounts,
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
                        <table className="w-full max-md:block">
                            <caption className="sr-only">
                                {DASHBOARD_COPY.sections.cashPosition}
                            </caption>
                            <thead className="max-md:hidden">
                                <tr>
                                    <th scope="col" className="data-head">
                                        {COPY.currency}
                                    </th>
                                    <th scope="col" className="data-head">
                                        {COPY.available}
                                    </th>
                                    <th
                                        scope="col"
                                        className="data-head text-right"
                                    >
                                        {COPY.current}
                                    </th>
                                    <th
                                        scope="col"
                                        className="data-head text-right"
                                    >
                                        {COPY.netToday(workspace.timeZone)}
                                    </th>
                                    <th
                                        scope="col"
                                        className="data-head text-right"
                                    >
                                        {COPY.trendLabel}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="max-md:block">
                                {positions.map((position) => (
                                    <CashPositionTotal
                                        key={position.currency}
                                        position={position}
                                        timeZone={workspace.timeZone}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <p className="text-text-muted px-4 py-2 text-xs">
                            {COPY.excluded}
                        </p>
                        <p role="status" className="sr-only">
                            {COPY.loaded(positions.length)}
                        </p>
                    </>
                )}
            </QueryBoundary>
        </SectionCard>
    );
}
