import clsx from "clsx";
import Link from "next/link";
import CountBadge from "@/components/ui/count-badge";
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
                "focus-visible:outline-accent flex h-8 items-center gap-2.5 rounded-md px-2 text-sm transition-colors focus-visible:outline-2",
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
            {count ? <CountBadge count={count} /> : null}
        </Link>
    );
}
