import {
    DASHBOARD_ROUTE,
    HELP_ROUTE,
    NOTIFICATIONS_ROUTE,
    PAYMENTS_ROUTE,
    PROFILE_ROUTE,
} from "@/lib/constants";
import type { WorkspaceNavGroup, WorkspaceNavItem } from "@/lib/types";
import {
    ACCOUNTS_ROUTE,
    COUNTERPARTIES_ROUTE,
    EXPORTS_ROUTE,
    INSIGHTS_COMPARE_ROUTE,
    INSIGHTS_ROUTE,
    MESSAGES_ROUTE,
    SETTINGS_ROUTE,
    STATEMENTS_ROUTE,
    TRANSACTIONS_ROUTE,
} from "@/lib/workspace/constants";

export const WORKSPACE_NAV_GROUPS: Record<WorkspaceNavGroup, string> = {
    overview: "Overview",
    money: "Money",
    documents: "Documents",
    insights: "Insights",
    inbox: "Inbox",
    settings: "Settings",
    secondary: "Support",
};

export const WORKSPACE_NAV: readonly WorkspaceNavItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        href: DASHBOARD_ROUTE,
        group: "overview",
        capability: "viewDashboard",
    },
    {
        id: "accounts",
        label: "Accounts",
        href: ACCOUNTS_ROUTE,
        group: "money",
        capability: "viewAccounts",
    },
    {
        id: "transactions",
        label: "Transactions",
        href: TRANSACTIONS_ROUTE,
        also: [COUNTERPARTIES_ROUTE],
        group: "money",
        capability: "viewTransactions",
    },
    {
        id: "payments",
        label: "Payments",
        href: PAYMENTS_ROUTE,
        group: "money",
        capability: "managePayees",
        moneyMovement: true,
    },
    {
        id: "statements",
        label: "Statements",
        href: STATEMENTS_ROUTE,
        group: "documents",
        capability: "downloadStatements",
    },
    {
        id: "exports",
        label: "Exports",
        href: EXPORTS_ROUTE,
        group: "documents",
        capability: "manageExports",
    },
    {
        id: "insights",
        label: "Insights",
        href: INSIGHTS_COMPARE_ROUTE,
        also: [INSIGHTS_ROUTE],
        group: "insights",
        capability: "comparePeriods",
    },
    {
        id: "notifications",
        label: "Notifications",
        href: NOTIFICATIONS_ROUTE,
        group: "inbox",
        capability: "receiveNotifications",
        counted: true,
    },
    {
        id: "messages",
        label: "Messages",
        href: MESSAGES_ROUTE,
        group: "inbox",
        capability: "secureMessages",
    },
    {
        id: "settings",
        label: "Settings",
        href: SETTINGS_ROUTE,
        hrefByRole: { accountant: PROFILE_ROUTE, viewer: PROFILE_ROUTE },
        group: "settings",
        capability: "editOwnProfile",
    },
    {
        id: "help",
        label: "Help",
        href: HELP_ROUTE,
        group: "secondary",
        capability: null,
    },
];
