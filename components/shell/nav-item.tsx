import clsx from "clsx";
import Link from "next/link";
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
                "focus-visible:outline-accent flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors focus-visible:outline-2",
                current
                    ? "bg-background-muted text-text"
                    : "text-text-secondary hover:bg-background-muted hover:text-text",
            )}
        >
            <span aria-hidden className="shrink-0">
                {icon}
            </span>
            <span className="min-w-0 flex-1 truncate">
                {count ? <span className="sr-only">{countLabel}</span> : null}
                <span aria-hidden={Boolean(count)}>{label}</span>
            </span>
            {count ? (
                <span
                    aria-hidden
                    className="bg-accent-light text-accent text-caption rounded-full px-2 py-0.5"
                >
                    {count}
                </span>
            ) : null}
        </Link>
    );
}
