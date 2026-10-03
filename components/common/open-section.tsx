import Link from "next/link";
import { useId, type ReactNode } from "react";
import { ArrowRight } from "@carbon/icons-react";
import CountBadge from "@/components/ui/count-badge";

interface Props {
    title: string;
    count?: number;
    aside?: ReactNode;
    action?: { label: string; href: string };
    children: ReactNode;
}

export default function OpenSection({
    title,
    count,
    aside,
    action,
    children,
}: Props) {
    const id = useId();

    return (
        <section aria-labelledby={id} className="flex min-w-0 flex-col gap-3">
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
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
            {children}
        </section>
    );
}
