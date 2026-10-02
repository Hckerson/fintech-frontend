import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
    label: ReactNode;
    lead?: boolean;
    className?: string;
    children: ReactNode;
}

export default function FigureCell({
    label,
    lead = false,
    className,
    children,
}: Props) {
    return (
        <div
            className={clsx("flex min-w-0 flex-col gap-1 px-4 py-3", className)}
        >
            <dt className="text-text-muted flex flex-wrap items-center gap-2 text-xs">
                {label}
            </dt>
            <dd
                className={clsx(
                    "text-text whitespace-nowrap tabular-nums",
                    lead
                        ? "text-h4 font-medium tracking-tight"
                        : "text-sm sm:text-base",
                )}
            >
                {children}
            </dd>
        </div>
    );
}
