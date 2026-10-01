import type { ShellNavItem } from "@/lib/types";

export const currentNavId = (
    pathname: string,
    items: readonly ShellNavItem[],
): string | undefined =>
    items
        .filter(
            ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
        )
        .sort((a, b) => b.href.length - a.href.length)
        .at(0)?.id;

export const initialsOf = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");
