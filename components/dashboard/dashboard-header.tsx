"use client";
import AsOf from "@/components/common/as-of";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useWorkspace } from "@/lib/hooks/use-workspace";

export default function DashboardHeader() {
    const { workspace } = useWorkspace();
    const asOf = useAccounts().data?.asOf;

    return (
        <PageHeader
            eyebrow={workspace.name}
            title={PAGE_TITLES.dashboard}
            lead={DASHBOARD_COPY.today(workspace.timeZone)}
            actions={
                asOf ? <AsOf asOf={asOf} timeZone={workspace.timeZone} /> : null
            }
        />
    );
}
