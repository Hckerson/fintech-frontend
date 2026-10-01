import clsx from "clsx";
import type { ComponentProps } from "react";

export default function TextInput({
    className,
    ...rest
}: ComponentProps<"input">) {
    return (
        <input
            {...rest}
            className={clsx(
                "border-border bg-background text-text placeholder:text-text-muted h-10 w-full rounded-lg border px-3 text-sm transition-colors",
                "focus:border-accent focus-visible:ring-accent/40 focus:outline-none focus-visible:ring-2",
                "aria-invalid:border-error read-only:opacity-70",
                className,
            )}
        />
    );
}
