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
            <dt className="figure-label flex flex-wrap items-center gap-2">
                {label}
            </dt>
            <dd
                className={clsx(
                    "text-text whitespace-nowrap tabular-nums",
                    lead
                        ? "text-h5 font-semibold tracking-tight"
                        : "text-sm font-medium sm:text-base",
                )}
            >
                {children}
            </dd>
        </div>
    );
}
