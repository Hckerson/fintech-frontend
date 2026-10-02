"use client";
import { usePathname, useRouter } from "next/navigation";
import { useId, useTransition } from "react";
import SectionCard from "@/components/common/section-card";
import SectionSkeleton from "@/components/common/section-skeleton";
import CashFlowFigures from "@/components/dashboard/cash-flow-figures";
import EmptyState from "@/components/ui/empty-state";
import Tabs from "@/components/ui/tabs";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useCashFlow } from "@/lib/hooks/use-cash-flow";
import type { CashFlowRange } from "@/lib/types";
import { heldCurrencies } from "@/lib/utils/account-list";
import { hasActivity } from "@/lib/utils/cash-flow-view";
import { queryString } from "@/lib/utils/query-string";
import { cashFlowRangeSchema } from "@/lib/validations/dashboard";

interface Props {
    range: CashFlowRange;
    currency: string | undefined;
}

const COPY = DASHBOARD_COPY.cashFlow;
const RANGES = cashFlowRangeSchema.options;
const LONGEST_RANGE = RANGES[RANGES.length - 1];

export default function CashFlow({ range, currency }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const panelId = useId();
    const [navigating, startTransition] = useTransition();
    const accounts = useAccounts();
    const query = useCashFlow({ range, currency });
    const currencies = heldCurrencies(accounts.data?.items ?? []);
    const shown = currency ?? query.data?.currency ?? currencies[0];

    const show = (next: { range?: CashFlowRange; currency?: string }) =>
        startTransition(() =>
            router.replace(
                `${pathname}${queryString({ range, currency, ...next })}`,
                { scroll: false },
            ),
        );

    return (
        <SectionCard
            flush
            title={DASHBOARD_COPY.sections.cashFlow}
            aside={
                <div className="flex flex-wrap items-center gap-2">
                    {currencies.length > 1 && shown ? (
                        <Tabs
                            label={COPY.currencyLabel}
                            tabs={currencies.map((code) => ({
                                id: code,
                                label: code,
                            }))}
                            value={shown}
                            onChange={(code) => show({ currency: code })}
                            panelId={panelId}
                            disabled={navigating}
                        />
                    ) : null}
                    <Tabs
                        label={COPY.rangeLabel}
                        tabs={RANGES.map((id) => ({
                            id,
                            label: COPY.ranges[id],
                        }))}
                        value={range}
                        onChange={(id) => show({ range: id })}
                        panelId={panelId}
                        disabled={navigating}
                    />
                </div>
            }
        >
            <div id={panelId} role="tabpanel" aria-label={COPY.ranges[range]}>
                <QueryBoundary
                    flush
                    query={query}
                    isEmpty={(series) => !hasActivity(series)}
                    skeleton={
                        <SectionSkeleton bare rows={1} rowClassName="h-80" />
                    }
                    empty={
                        <EmptyState
                            {...(range === LONGEST_RANGE
                                ? EMPTY_STATES.cashFlow
                                : EMPTY_STATES.cashFlowRange)}
                        />
                    }
                >
                    {(series) => <CashFlowFigures series={series} />}
                </QueryBoundary>
            </div>
        </SectionCard>
    );
}
