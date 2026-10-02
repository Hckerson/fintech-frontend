"use client";
import clsx from "clsx";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

interface Props {
    label: string;
    trigger: ReactNode;
    align?: "start" | "end";
    triggerClassName?: string;
    children: ReactNode;
}

export default function Popover({
    label,
    trigger,
    align = "start",
    triggerClassName,
    children,
}: Props) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLSpanElement>(null);
    const id = useId();

    useEffect(() => {
        if (!open) return;
        const dismiss = (event: PointerEvent) => {
            if (
                event.target instanceof Node &&
                !root.current?.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("pointerdown", dismiss);
        return () => document.removeEventListener("pointerdown", dismiss);
    }, [open]);

    return (
        <span
            ref={root}
            className="relative inline-flex"
            onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
            onBlur={(event) =>
                root.current?.contains(event.relatedTarget) || setOpen(false)
            }
        >
            <button
                type="button"
                aria-label={label}
                aria-expanded={open}
                aria-controls={open ? id : undefined}
                onClick={() => setOpen((value) => !value)}
                className={clsx(
                    "focus-visible:outline-accent cursor-pointer focus-visible:outline-2",
                    triggerClassName,
                )}
            >
                {trigger}
            </button>
            {open ? (
                <span
                    id={id}
                    role="group"
                    aria-label={label}
                    className={clsx(
                        "border-border-dark bg-background-alt absolute top-full z-(--z-indices-dropdown) mt-2 flex flex-col gap-1 rounded-lg border px-3 py-2 text-left shadow-(--shadows-xl)",
                        align === "end" ? "right-0" : "left-0",
                    )}
                >
                    {children}
                </span>
            ) : null}
        </span>
    );
}
