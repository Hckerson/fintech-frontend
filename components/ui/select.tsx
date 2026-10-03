import clsx from "clsx";
import type { ComponentProps } from "react";
import { ChevronDown } from "@carbon/icons-react";

export default function Select({
    className,
    children,
    ...rest
}: ComponentProps<"select">) {
    return (
        <span className="relative block">
            <select
                {...rest}
                className={clsx(
                    "border-border bg-background text-text h-10 w-full cursor-pointer appearance-none truncate rounded-lg border pr-9 pl-3 text-sm transition-colors",
                    "focus:border-accent focus-visible:ring-accent/40 focus:outline-none focus-visible:ring-2",
                    "aria-invalid:border-error disabled:cursor-not-allowed disabled:opacity-70",
                    className,
                )}
            >
                {children}
            </select>
            <ChevronDown
                aria-hidden
                className="text-text-muted pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
            />
        </span>
    );
}
