import {
    ADMIN_COMPLIANCE_ROUTE,
    ADMIN_SUPPORT_ROUTE,
    ADMIN_USERS_ROUTE,
} from "@/lib/admin/constants";
import { ADMIN_ROUTE } from "@/lib/constants";
import type { AdminNavItem } from "@/lib/types";

export const ADMIN_AREA = {
    name: "Ledgerline Admin",
    navLabel: "Admin",
    commandGroups: { navigate: "Go to", help: "Help" },
} as const;

export const ADMIN_NAV: readonly AdminNavItem[] = [
    {
        id: "overview",
        label: "Overview",
        href: ADMIN_ROUTE,
        icon: "overview",
        roles: ["support", "compliance", "admin"],
    },
    {
        id: "users",
        label: "Users",
        href: ADMIN_USERS_ROUTE,
        icon: "users",
        roles: ["admin"],
    },
    {
        id: "compliance",
        label: "Compliance",
        href: ADMIN_COMPLIANCE_ROUTE,
        icon: "compliance",
        roles: ["compliance", "admin"],
    },
    {
        id: "support",
        label: "Support",
        href: ADMIN_SUPPORT_ROUTE,
        icon: "support",
        roles: ["support", "admin"],
    },
];
