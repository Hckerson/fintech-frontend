"use client";
import { useState } from "react";
import NotificationEntry from "@/components/shell/notification-entry";
import UtilityBar from "@/components/shell/utility-bar";
import { WORKSPACE_NAV_GROUPS } from "@/lib/data/navigation";
import { SHELL_COPY } from "@/lib/data/shell";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { PaletteCommand } from "@/lib/types";
import { navFor, navHref } from "@/lib/utils/workspace-nav";
import { accountRoute, TRANSACTIONS_ROUTE } from "@/lib/workspace/constants";

export default function WorkspaceUtilities() {
    const { workspace, member, moneyMovement, can } = useWorkspace();
    const [paletteOpen, setPaletteOpen] = useState(false);
    const accounts = useAccounts({ enabled: paletteOpen });

    const commands: PaletteCommand[] = [
        ...navFor(workspace.role, moneyMovement).map((item) => ({
            id: item.id,
            label: item.label,
            href: navHref(item, workspace.role),
            group: SHELL_COPY.search.navigate,
        })),
        ...(accounts.data?.items ?? []).map((account) => ({
            id: account.id,
            label: SHELL_COPY.search.account(account.name, account.last4),
            href: accountRoute(account.id),
            group: WORKSPACE_NAV_GROUPS.money,
        })),
    ];

    return (
        <UtilityBar
            commands={commands}
            email={member.email}
            searchAllHref={
                can("viewTransactions") ? TRANSACTIONS_ROUTE : undefined
            }
            onPaletteOpenChange={setPaletteOpen}
            notifications={<NotificationEntry />}
        />
    );
}
