"use client";
import clsx from "clsx";
import {
    useEffect,
    useId,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from "react";

interface Props {
    label: string;
    trigger: ReactNode;
    align?: "start" | "end";
    triggerClassName?: string;
    fill?: boolean;
    children: (close: () => void) => ReactNode;
}

const ITEMS = '[role^="menuitem"]:not([aria-disabled="true"])';

const STEP: Partial<Record<string, (index: number, count: number) => number>> =
    {
        ArrowDown: (index, count) => (index + 1) % count,
        ArrowUp: (index, count) => (index - 1 + count) % count,
        Home: () => 0,
        End: (_, count) => count - 1,
    };

export default function Menu({
    label,
    trigger,
    align = "start",
    triggerClassName,
    fill = false,
    children,
}: Props) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const button = useRef<HTMLButtonElement>(null);
    const id = useId();
    const items = () => [
        ...(root.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []),
    ];
    const close = () => setOpen(false);

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
        const all = items();
        (
            all.find((item) => item.getAttribute("aria-checked") === "true") ??
            all[0]
        )?.focus();
        document.addEventListener("pointerdown", dismiss);
        return () => document.removeEventListener("pointerdown", dismiss);
    }, [open]);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            setOpen(false);
            return button.current?.focus();
        }
        if (event.key === "Tab") return setOpen(false);

        const typing = event.target instanceof HTMLInputElement;
        const step = STEP[event.key];
        if (!step || (typing && !event.key.startsWith("Arrow"))) return;

        event.preventDefault();
        const all = items();
        const index = all.findIndex((item) => item === document.activeElement);
        all[step(index, all.length)]?.focus();
    };

    return (
        <div ref={root} className="relative" onKeyDown={onKeyDown}>
            <button
                ref={button}
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? id : undefined}
                aria-label={label}
                onClick={() => setOpen((value) => !value)}
                className={clsx(
                    "focus-visible:outline-accent cursor-pointer focus-visible:outline-2",
                    triggerClassName,
                )}
            >
                {trigger}
            </button>
            {open ? (
                <div
                    id={id}
                    role="menu"
                    aria-label={label}
                    className={clsx(
                        "border-border-dark bg-background-alt absolute top-full z-(--z-indices-dropdown) mt-2 flex max-h-80 flex-col gap-1 overflow-y-auto rounded-lg border p-1 shadow-(--shadows-xl)",
                        "[&_[role^=menuitem]]:text-text-secondary [&_[role^=menuitem]]:hover:bg-background-muted [&_[role^=menuitem]]:hover:text-text [&_[role^=menuitem]]:focus-visible:bg-background-muted [&_[role^=menuitem]]:focus-visible:text-text [&_[role^=menuitem]]:flex [&_[role^=menuitem]]:w-full [&_[role^=menuitem]]:cursor-pointer [&_[role^=menuitem]]:items-center [&_[role^=menuitem]]:gap-2 [&_[role^=menuitem]]:rounded-md [&_[role^=menuitem]]:px-2.5 [&_[role^=menuitem]]:py-2 [&_[role^=menuitem]]:text-left [&_[role^=menuitem]]:text-sm [&_[role^=menuitem]]:focus-visible:outline-none",
                        align === "end" ? "right-0" : "left-0",
                        fill ? "w-full" : "w-64",
                    )}
                >
                    {children(close)}
                </div>
            ) : null}
        </div>
    );
}
