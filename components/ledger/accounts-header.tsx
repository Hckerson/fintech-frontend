"use client";
import AsOf from "@/components/common/as-of";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";
import { ACCOUNTS_COPY } from "@/lib/data/ledger/copy";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useWorkspace } from "@/lib/hooks/use-workspace";

export default function AccountsHeader() {
    const { workspace } = useWorkspace();
    const { data } = useAccounts();

    return (
        <PageHeader
            title={PAGE_TITLES.accounts}
            lead={data ? ACCOUNTS_COPY.count(data.items.length) : undefined}
            actions={
                data ? (
                    <AsOf asOf={data.asOf} timeZone={workspace.timeZone} />
                ) : null
            }
        />
    );
}
