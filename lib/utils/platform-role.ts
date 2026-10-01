import { ADMIN_ROLE, AUTH_GATE_DISABLED, HELP_ROUTE } from "@/lib/constants";
import { ADMIN_AREA, ADMIN_NAV } from "@/lib/data/admin-nav";
import type { AdminNavItem, PaletteCommand, PlatformRole } from "@/lib/types";

export const platformRoleOf = (
    session: { role: string } | null,
): PlatformRole | null =>
    AUTH_GATE_DISABLED || session?.role === ADMIN_ROLE ? "admin" : null;

export const adminNavFor = (role: PlatformRole): AdminNavItem[] =>
    ADMIN_NAV.filter((item) => item.roles.includes(role));

export const adminCommands = (role: PlatformRole): PaletteCommand[] => [
    ...adminNavFor(role).map(({ id, label, href }) => ({
        id,
        label,
        href,
        group: ADMIN_AREA.commandGroups.navigate,
    })),
    {
        id: "help",
        label: ADMIN_AREA.commandGroups.help,
        href: HELP_ROUTE,
        group: ADMIN_AREA.commandGroups.help,
    },
];
