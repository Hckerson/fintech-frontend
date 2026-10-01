import { WORKSPACE_NAV } from "@/lib/data/navigation";
import type { WorkspaceNavItem, WorkspaceRole } from "@/lib/types";
import { roleCan } from "@/lib/utils/permissions";

const covers = (pathname: string, prefix: string) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`);

export const navHref = (item: WorkspaceNavItem, role: WorkspaceRole) =>
    item.hrefByRole?.[role] ?? item.href;

export const navFor = (
    role: WorkspaceRole,
    moneyMovement: boolean,
): WorkspaceNavItem[] =>
    WORKSPACE_NAV.filter(
        (item) =>
            (!item.moneyMovement || moneyMovement) &&
            (item.capability === null || roleCan(role, item.capability)),
    );

export const currentNavItem = (
    pathname: string,
    items: readonly WorkspaceNavItem[],
): WorkspaceNavItem | undefined =>
    items
        .flatMap((item) =>
            [item.href, ...(item.also ?? [])]
                .filter((prefix) => covers(pathname, prefix))
                .map((prefix) => ({ item, length: prefix.length })),
        )
        .sort((a, b) => b.length - a.length)
        .at(0)?.item;

export const keepsRoute = (
    pathname: string,
    role: WorkspaceRole,
    moneyMovement: boolean,
): boolean =>
    navFor(role, moneyMovement).some(
        (item) => navHref(item, role) === pathname,
    );
