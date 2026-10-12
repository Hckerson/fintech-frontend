import type { ReactNode } from "react";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { DASHBOARD_ACTIVITY_LIMIT } from "@/lib/dashboard/constants";
import { DASHBOARD_VARIANTS } from "@/lib/data/dashboard-variants";
import { reads } from "@/lib/hooks/reads";
import { currentWorkspace } from "@/lib/utils/current-workspace";
import { roleCan } from "@/lib/utils/permissions";

export default async function DashboardData({
    children,
}: {
    children: ReactNode;
}) {
    const workspace = await currentWorkspace();
    const client = new QueryClient();

    if (workspace && roleCan(workspace.role, "viewDashboard")) {
        const { id, role } = workspace;
        const granted = DASHBOARD_VARIANTS[role];
        const pending = granted.includes("pendingItems");

        await Promise.all([
            client.prefetchQuery(reads.accounts(id)),
            client.prefetchQuery(
                reads.transactions(id, { limit: DASHBOARD_ACTIVITY_LIMIT }),
            ),
            granted.includes("cashPosition") &&
                client.prefetchQuery(reads.cashPosition(id)),
            pending &&
                roleCan(role, "manageExports") &&
                client.prefetchQuery(reads.exports(id)),
            pending &&
                roleCan(role, "manageAlertRules") &&
                client.prefetchQuery(reads.verificationCase(id)),
        ]);
    }

    return (
        <HydrationBoundary state={dehydrate(client)}>
            {children}
        </HydrationBoundary>
    );
}
