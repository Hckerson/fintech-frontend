import { DASHBOARD_ROUTE } from "@/lib/constants";
import type { WorkspaceRole } from "@/lib/types";
import { NOTIFICATION_COUNT_CAP } from "@/lib/workspace/constants";

export const ROLE_LABELS: Record<WorkspaceRole, string> = {
    owner: "Owner",
    finance: "Finance",
    accountant: "Accountant",
    viewer: "Viewer",
};

export const DASHBOARD_LINK = {
    label: "Go to Dashboard",
    href: DASHBOARD_ROUTE,
} as const;

export const SHELL_COPY = {
    skip: "Skip to content",
    primaryNav: "Primary",
    openNav: "Open navigation",
    closeNav: "Close navigation",
    breadcrumb: "Breadcrumb",
    offline:
        "You're offline. What you see is the last data loaded; changes are unavailable until you reconnect.",
    stale: "Couldn't refresh. This may be out of date.",
    offlineStale: "You're offline. Showing the last figures loaded.",
    asOf: "As of",
    delayed: "delayed, may be out of date",
    offlineAsOf: "offline, may be out of date",
    search: {
        trigger: "Search",
        title: "Search",
        placeholder: "Go to a page or account",
        navigate: "Go to",
        account: (name: string, last4: string) => `${name} ••${last4}`,
        shortcut: "Ctrl K",
        shortcutSpoken: "Control K, or Command K on a Mac",
        results: (count: number) =>
            `${count} ${count === 1 ? "result" : "results"}.`,
        none: "No matches.",
        searchAll: "Search all transactions",
        close: "Close search",
    },
    notifications: {
        label: "Notifications",
        unread: (unread: number) =>
            unread > NOTIFICATION_COUNT_CAP
                ? `Notifications, more than ${NOTIFICATION_COUNT_CAP} unread`
                : `Notifications, ${unread} unread`,
    },
    account: {
        menu: (name: string) => `Account menu for ${name}`,
        profile: "Profile & security",
        help: "Help",
        signOut: "Sign out",
        signingOut: "Signing out",
        signOutFailed:
            "Couldn't sign out, so you're still signed in. Try again, or close the browser on a shared device.",
    },
    workspace: {
        label: "Workspace",
        trigger: (name: string) => `Workspace: ${name}. Switch workspace`,
        current: "Current workspace",
        filter: "Find a workspace",
        loadFailed: "Couldn't load workspaces",
        retry: "Retry",
        switching: "Switching workspace",
        switched: (name: string, role: string) =>
            `Switched to ${name}. Your role there is ${role}.`,
        switchFailed: (name: string) =>
            `Couldn't switch workspace. You're still in ${name}.`,
    },
    notPermitted: (page: string) => ({
        title: `Your role doesn't include ${page}.`,
        body: "A workspace owner can change your role.",
    }),
} as const;
