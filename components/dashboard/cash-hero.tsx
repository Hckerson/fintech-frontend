"use client";
import { usePathname, useRouter } from "next/navigation";
import { useId, useTransition } from "react";
import SectionSkeleton from "@/components/common/section-skeleton";
import BalanceFigures from "@/components/dashboard/balance-figures";
import CashChart from "@/components/dashboard/cash-chart";
import CashControls from "@/components/dashboard/cash-controls";
import CashHeadline from "@/components/dashboard/cash-headline";
import CurrencyChips from "@/components/dashboard/currency-chips";
import EmptyState from "@/components/ui/empty-state";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { TREND_RANGE } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { VERIFICATION_COPY } from "@/lib/data/verification";
import { useCashPosition } from "@/lib/hooks/use-cash-position";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { CashFlowRange, DashboardView } from "@/lib/types";
import { queryString } from "@/lib/utils/query-string";
import { ONBOARDING_ROUTE } from "@/lib/workspace/constants";

interface Props {
    range: CashFlowRange;
    currency: string | undefined;
    view: DashboardView;
    withFlow: boolean;
}

const COPY = DASHBOARD_COPY.cash;
const RANGES = DASHBOARD_COPY.cashFlow.ranges;

export default function CashHero({ range, currency, view, withFlow }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const titleId = useId();
    const panelId = useId();
    const [navigating, startTransition] = useTransition();
    const { workspace, can } = useWorkspace();
    const query = useCashPosition();
    const show = (next: {
        range?: CashFlowRange;
        currency?: string;
        view?: DashboardView;
    }) =>
        startTransition(() =>
            router.replace(
                `${pathname}${queryString({ range, currency, view, ...next })}`,
                { scroll: false },
            ),
        );

    return (
        <section
            aria-labelledby={titleId}
            className="panel flex min-w-0 flex-col overflow-hidden"
        >
            <h2 id={titleId} className="sr-only">
                {DASHBOARD_COPY.sections.cashPosition}
            </h2>
            <QueryBoundary
                flush
                grow
                query={query}
                isEmpty={(positions) => positions.length === 0}
                skeleton={<SectionSkeleton bare rows={1} rowClassName="h-96" />}
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
                {(positions) => {
                    const position =
                        positions.find((held) => held.currency === currency) ??
                        positions[0];

                    return (
                        <>
                            <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
                                <CurrencyChips
                                    positions={positions}
                                    shown={position.currency}
                                    disabled={navigating}
                                    onSelect={(code) =>
                                        show({ currency: code })
                                    }
                                />
                                {withFlow ? (
                                    <CashControls
                                        range={range}
                                        view={view}
                                        panelId={panelId}
                                        disabled={navigating}
                                        onRange={(next) =>
                                            show({ range: next })
                                        }
                                        onView={(next) => show({ view: next })}
                                    />
                                ) : null}
                            </div>
                            <div className="px-4 pt-5 pb-1">
                                <CashHeadline
                                    position={position}
                                    timeZone={workspace.timeZone}
                                />
                            </div>
                            <div
                                id={panelId}
                                role="tabpanel"
                                className="flex min-h-0 flex-1 flex-col"
                                aria-label={DASHBOARD_COPY.overview.views[view]}
                            >
                                {withFlow ? (
                                    <CashChart
                                        position={position}
                                        range={range}
                                        view={view}
                                    />
                                ) : (
                                    <BalanceFigures
                                        trend={position.trend}
                                        granularity="day"
                                        rangeLabel={RANGES[TREND_RANGE]}
                                    />
                                )}
                            </div>
                            <p className="border-border text-text-muted border-t px-4 py-3 text-xs">
                                {position.includesFrozen
                                    ? `${COPY.frozen}. `
                                    : ""}
                                {COPY.excluded}
                            </p>
                            <p role="status" className="sr-only">
                                {COPY.loaded(positions.length)}
                            </p>
                        </>
                    );
                }}
            </QueryBoundary>
        </section>
    );
}
