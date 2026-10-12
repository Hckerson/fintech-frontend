"use client";
import SectionSkeleton from "@/components/common/section-skeleton";
import BalanceFigures from "@/components/dashboard/balance-figures";
import CashFlowFigures from "@/components/dashboard/cash-flow-figures";
import EmptyState from "@/components/ui/empty-state";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { useCashFlow } from "@/lib/hooks/use-cash-flow";
import type { CashFlowRange, CashPosition, DashboardView } from "@/lib/types";
import { hasActivity } from "@/lib/utils/cash-flow-view";
import { closingBalances } from "@/lib/utils/cash-position";
import { cashFlowRangeSchema } from "@/lib/validations/dashboard";

interface Props {
    position: CashPosition;
    range: CashFlowRange;
    view: DashboardView;
}

const RANGES = cashFlowRangeSchema.options;
const LONGEST_RANGE = RANGES[RANGES.length - 1];

export default function CashChart({ position, range, view }: Props) {
    const query = useCashFlow({ range, currency: position.currency });
    const rangeLabel = DASHBOARD_COPY.cashFlow.ranges[range];

    return (
        <QueryBoundary
            flush
            grow
            query={query}
            isEmpty={(series) => view === "flow" && !hasActivity(series)}
            skeleton={<SectionSkeleton bare rows={1} rowClassName="h-80" />}
            empty={
                <EmptyState
                    {...(range === LONGEST_RANGE
                        ? EMPTY_STATES.cashFlow
                        : EMPTY_STATES.cashFlowRange)}
                />
            }
        >
            {(series) =>
                view === "flow" ? (
                    <CashFlowFigures series={series} />
                ) : (
                    <BalanceFigures
                        trend={closingBalances(
                            series,
                            BigInt(position.current.amountMinor),
                        )}
                        granularity={series.granularity}
                        rangeLabel={rangeLabel}
                    />
                )
            }
        </QueryBoundary>
    );
}
