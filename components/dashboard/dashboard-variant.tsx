"use client";
import type { ReactNode } from "react";
import NotPermitted from "@/components/common/not-permitted";
import SectionSkeleton from "@/components/common/section-skeleton";
import AccountSummary from "@/components/dashboard/account-summary";
import CashFlow from "@/components/dashboard/cash-flow";
import CashPosition from "@/components/dashboard/cash-position";
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

export default function DashboardVariant({
    range,
    currency,
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
        cashPosition: <CashPosition />,
        cashFlow: <CashFlow range={range} currency={currency} />,
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

    return (
        <>
            {dropped.length > 0 ? (
                <p role="status" className="text-warning text-xs">
                    {DASHBOARD_COPY.dropped(dropped.join(", "))}
                </p>
            ) : null}
            {slot(DASHBOARD_LAYOUT.notice)}
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="flex min-w-0 flex-col gap-4">
                    {slot(DASHBOARD_LAYOUT.main)}
                </div>
                <div className="flex min-w-0 flex-col gap-4">
                    {slot(DASHBOARD_LAYOUT.side)}
                </div>
            </div>
        </>
    );
}
