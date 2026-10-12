import clsx from "clsx";
import Link from "next/link";
import { useId, type ReactNode } from "react";
import { ArrowRight } from "@carbon/icons-react";
import CountBadge from "@/components/ui/count-badge";

interface Props {
    title: string;
    action?: { label: string; href: string };
    aside?: ReactNode;
    count?: number;
    attention?: boolean;
    flush?: boolean;
    children: ReactNode;
}

export default function SectionCard({
    title,
    action,
    aside,
    count,
    attention = false,
    flush = false,
    children,
}: Props) {
    const id = useId();

    return (
        <section
            aria-labelledby={id}
            className={clsx(
                "panel flex min-w-0 flex-col overflow-hidden",
                attention && "border-l-warning border-l-2",
            )}
        >
            <div className="border-border flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b px-4 py-2">
                <div className="flex items-center gap-2">
                    <h2 id={id} className="text-text text-sm font-medium">
                        {title}
                    </h2>
                    {count ? <CountBadge count={count} /> : null}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {aside}
                    {action ? (
                        <Link
                            href={action.href}
                            className="text-text-secondary hover:text-text focus-visible:outline-accent inline-flex items-center gap-1 rounded text-xs focus-visible:outline-2"
                        >
                            {action.label}
                            <ArrowRight aria-hidden className="size-3" />
                        </Link>
                    ) : null}
                </div>
            </div>
            <div
                className={clsx("flex flex-1 flex-col", !flush && "gap-3 p-4")}
            >
                {children}
            </div>
        </section>
    );
}
