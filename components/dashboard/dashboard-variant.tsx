"use client";
import type { ReactNode } from "react";
import NotPermitted from "@/components/common/not-permitted";
import SectionSkeleton from "@/components/common/section-skeleton";
import AccountSummary from "@/components/dashboard/account-summary";
import CashHero from "@/components/dashboard/cash-hero";
import PendingItems from "@/components/dashboard/pending-items";
import RecentActivity from "@/components/dashboard/recent-activity";
import VerificationNotice from "@/components/onboarding/verification-notice";
import SectionErrorBoundary from "@/components/wrappers/section-error-boundary";
import { PAGE_TITLES } from "@/lib/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import {
    DASHBOARD_LAYOUT,
    DASHBOARD_VARIANTS,
} from "@/lib/data/dashboard-variants";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { DashboardParams, DashboardSectionKey } from "@/lib/types";

const STACK = "flex min-w-0 flex-col gap-4";

export default function DashboardVariant({
    range,
    currency,
    view,
    dropped,
}: DashboardParams) {
    const { workspace, can } = useWorkspace();

    if (!can("viewDashboard")) {
        return (
            <NotPermitted page={PAGE_TITLES.dashboard} offerDashboard={false} />
        );
    }

    const granted = DASHBOARD_VARIANTS[workspace.role];
    const sections: Record<DashboardSectionKey, ReactNode> = {
        verification: <VerificationNotice />,
        verificationNotice: <VerificationNotice informational />,
        cashPosition: (
            <CashHero
                range={range}
                currency={currency}
                view={view}
                withFlow={granted.includes("cashFlow")}
            />
        ),
        cashFlow: null,
        recentActivity: <RecentActivity />,
        pendingItems: <PendingItems />,
        accountSummary: <AccountSummary />,
    };
    const slot = (keys: readonly DashboardSectionKey[]) =>
        keys
            .filter((key) => granted.includes(key))
            .map((key) => (
                <SectionErrorBoundary
                    key={key}
                    skeleton={
                        keys === DASHBOARD_LAYOUT.notice ? null : (
                            <SectionSkeleton />
                        )
                    }
                >
                    {sections[key]}
                </SectionErrorBoundary>
            ));

    const main = slot(DASHBOARD_LAYOUT.main);
    const side = slot(DASHBOARD_LAYOUT.side);

    return (
        <>
            {dropped.length > 0 ? (
                <p role="status" className="text-warning text-xs">
                    {DASHBOARD_COPY.dropped(dropped.join(", "))}
                </p>
            ) : null}
            {slot(DASHBOARD_LAYOUT.notice)}
            {main.length > 0 && side.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div className={STACK}>{main}</div>
                    <div className={`${STACK} [&>*:last-child]:flex-1`}>
                        {side}
                    </div>
                </div>
            ) : (
                <div
                    className={`grid items-start gap-4 ${main.length + side.length > 1 ? "lg:grid-cols-2" : ""}`}
                >
                    {[...main, ...side]}
                </div>
            )}
            {slot(DASHBOARD_LAYOUT.below)}
        </>
    );
}
