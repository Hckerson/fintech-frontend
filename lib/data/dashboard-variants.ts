import type {
    DashboardLayout,
    DashboardSectionKey,
    WorkspaceRole,
} from "@/lib/types";

export const DASHBOARD_VARIANTS: Record<
    WorkspaceRole,
    readonly DashboardSectionKey[]
> = {
    owner: [
        "verification",
        "cashPosition",
        "accountSummary",
        "pendingItems",
        "cashFlow",
        "recentActivity",
    ],
    finance: [
        "cashPosition",
        "cashFlow",
        "pendingItems",
        "accountSummary",
        "recentActivity",
        "verificationNotice",
    ],
    accountant: [
        "pendingItems",
        "recentActivity",
        "accountSummary",
        "cashPosition",
    ],
    viewer: ["accountSummary", "recentActivity"],
};

export const DASHBOARD_LAYOUT = {
    notice: ["verification", "verificationNotice"],
    band: ["cashPosition"],
    rows: [
        { main: ["cashFlow"], side: ["pendingItems"] },
        { main: ["recentActivity"], side: ["accountSummary"] },
    ],
} as const satisfies DashboardLayout;
