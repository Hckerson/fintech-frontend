"use client";
import { usePathname } from "next/navigation";
import {
    ArrowsHorizontal,
    ChartLineSmooth,
    Chat,
    Dashboard,
    Document,
    Export,
    Help,
    Notification,
    Send,
    Settings,
    Wallet,
    type CarbonIconType,
} from "@carbon/icons-react";
import ShellBrand from "@/components/shell/shell-brand";
import SidebarNav from "@/components/shell/sidebar-nav";
import WorkspaceSwitcher from "@/components/shell/workspace-switcher";
import { DASHBOARD_ROUTE } from "@/lib/constants";
import { WORKSPACE_NAV_GROUPS } from "@/lib/data/navigation";
import { SHELL_COPY } from "@/lib/data/shell";
import { useNotificationCount } from "@/lib/hooks/use-notifications";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type {
    ShellNavSection,
    WorkspaceNavGroup,
    WorkspaceNavIcon,
} from "@/lib/types";
import { unreadBadge } from "@/lib/utils/unread";
import { currentNavItem, navFor, navHref } from "@/lib/utils/workspace-nav";
import { APP_NAME } from "@/lib/workspace/constants";

const ICONS: Record<WorkspaceNavIcon, CarbonIconType> = {
    dashboard: Dashboard,
    accounts: Wallet,
    transactions: ArrowsHorizontal,
    payments: Send,
    statements: Document,
    exports: Export,
    insights: ChartLineSmooth,
    notifications: Notification,
    messages: Chat,
    settings: Settings,
    help: Help,
};

const GROUPS = Object.keys(WORKSPACE_NAV_GROUPS) as WorkspaceNavGroup[];

const PINNED: readonly WorkspaceNavGroup[] = ["settings", "secondary"];

export default function WorkspaceSidebar() {
    const pathname = usePathname();
    const { workspace, moneyMovement } = useWorkspace();
    const unread = useNotificationCount().data?.unread;
    const items = navFor(workspace.role, moneyMovement);

    const sections: ShellNavSection[] = GROUPS.map((group) => {
        const members = items.filter((item) => item.group === group);
        const label = WORKSPACE_NAV_GROUPS[group];

        return {
            id: group,
            label,
            showLabel: members.length > 1,
            pinned: PINNED.includes(group),
            items: members.map((item) => {
                const Icon = ICONS[item.id];
                const count = item.counted ? unreadBadge(unread) : undefined;

                return {
                    id: item.id,
                    label: item.label,
                    href: navHref(item, workspace.role),
                    icon: <Icon className="size-4" />,
                    count,
                    countLabel:
                        count && unread
                            ? SHELL_COPY.notifications.unread(unread)
                            : undefined,
                };
            }),
        };
    }).filter((section) => section.items.length > 0);

    return (
        <SidebarNav
            label={SHELL_COPY.primaryNav}
            currentId={currentNavItem(pathname, items)?.id}
            sections={sections}
            header={<WorkspaceSwitcher />}
            footer={<ShellBrand quiet name={APP_NAME} href={DASHBOARD_ROUTE} />}
        />
    );
}
