"use client";
import Link from "next/link";
import { Export } from "@carbon/icons-react";
import AsOf from "@/components/common/as-of";
import PageHeader from "@/components/shell/page-header";
import { buttonClass } from "@/components/ui/button";
import { PAGE_TITLES } from "@/lib/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { EXPORTS_ROUTE } from "@/lib/workspace/constants";

export default function DashboardHeader() {
    const { workspace, can } = useWorkspace();
    const asOf = useAccounts().data?.asOf;

    return (
        <PageHeader
            eyebrow={workspace.name}
            title={PAGE_TITLES.dashboard}
            actions={
                <div className="flex flex-wrap items-center gap-3">
                    {asOf ? (
                        <AsOf asOf={asOf} timeZone={workspace.timeZone} />
                    ) : null}
                    {can("manageExports") ? (
                        <Link
                            href={EXPORTS_ROUTE}
                            className={buttonClass("quiet", "sm")}
                        >
                            <Export aria-hidden className="size-3.5" />
                            {DASHBOARD_COPY.export}
                        </Link>
                    ) : null}
                </div>
            }
        />
    );
}
