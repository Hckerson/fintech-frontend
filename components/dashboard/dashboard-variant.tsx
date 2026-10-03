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

const COLUMN =
    "flex flex-col px-4 py-4 lg:px-6 [&>section+section]:border-border [&>section+section]:mt-2 [&>section+section]:border-t [&>section+section]:pt-6 gap-4";

export default function DashboardVariant({
    range,
    currency,
    view,
    dropped,
    header,
}: DashboardParams & { header: ReactNode }) {
    const { workspace, can } = useWorkspace();

    if (!can("viewDashboard")) {
        return (
            <>
                {header}
                <NotPermitted
                    page={PAGE_TITLES.dashboard}
                    offerDashboard={false}
                />
            </>
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

    const rail = slot(DASHBOARD_LAYOUT.rail);

    return (
        <div className="-mx-4 -my-4 flex flex-1 flex-col lg:-mx-6 xl:flex-row">
            <div className={`${COLUMN} min-w-0 flex-1`}>
                {header}
                {dropped.length > 0 ? (
                    <p role="status" className="text-warning text-xs">
                        {DASHBOARD_COPY.dropped(dropped.join(", "))}
                    </p>
                ) : null}
                {slot(DASHBOARD_LAYOUT.notice)}
                {slot(DASHBOARD_LAYOUT.main)}
            </div>
            {rail.length > 0 ? (
                <div
                    className={`${COLUMN} shell-rail border-border bg-background-alt shrink-0 border-t xl:border-t-0 xl:border-l`}
                >
                    {rail}
                </div>
            ) : null}
        </div>
    );
}
