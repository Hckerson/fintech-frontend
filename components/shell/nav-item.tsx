"use client";
import clsx from "clsx";
import { motion } from "motion/react";
import Link from "next/link";
import CountBadge from "@/components/ui/count-badge";
import { MOTION_SPRING_SNAPPY } from "@/lib/constants";
import type { ShellNavEntry } from "@/lib/types";

interface Props extends ShellNavEntry {
    current: boolean;
}

export default function NavItem({
    href,
    label,
    icon,
    count,
    countLabel,
    current,
}: Props) {
    return (
        <Link
            href={href}
            aria-current={current ? "page" : undefined}
            className={clsx(
                "group focus-visible:outline-accent text-compact relative flex h-9 items-center gap-3 rounded-lg px-2.5 transition-colors focus-visible:outline-2",
                current
                    ? "text-text font-medium"
                    : "text-text-secondary hover:bg-sidebar-hover hover:text-text",
            )}
        >
            {current ? (
                <motion.span
                    aria-hidden
                    layoutId="current"
                    transition={MOTION_SPRING_SNAPPY}
                    className="border-border bg-background-muted absolute inset-0 rounded-lg border shadow-[inset_0_1px_0_var(--ledger-sheen)]"
                />
            ) : null}
            <span
                aria-hidden
                className={clsx(
                    "relative shrink-0 transition-colors",
                    current
                        ? "text-accent"
                        : "text-text-muted group-hover:text-text-secondary",
                )}
            >
                {icon}
            </span>
            <span className="relative min-w-0 flex-1 truncate">
                {count ? <span className="sr-only">{countLabel}</span> : null}
                <span aria-hidden={Boolean(count)}>{label}</span>
            </span>
            {count ? (
                <span className="relative flex">
                    <CountBadge count={count} />
                </span>
            ) : null}
        </Link>
    );
}
