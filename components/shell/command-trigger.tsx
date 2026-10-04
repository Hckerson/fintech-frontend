"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Search } from "@carbon/icons-react";
import { SHELL_COPY } from "@/lib/data/shell";
import type { PaletteCommand } from "@/lib/types";
import { PALETTE_SHORTCUT } from "@/lib/workspace/constants";

const CommandPalette = dynamic(
    () => import("@/components/shell/command-palette"),
    { ssr: false },
);

interface Props {
    commands: readonly PaletteCommand[];
    searchAllHref?: string;
    onOpenChange?: (open: boolean) => void;
}

const COPY = SHELL_COPY.search;

const isTyping = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    (target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export default function CommandTrigger({
    commands,
    searchAllHref,
    onOpenChange,
}: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const change = (next: boolean) => {
            setOpen(next);
            onOpenChange?.(next);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            const chord =
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === PALETTE_SHORTCUT.key;
            const slash =
                event.key === PALETTE_SHORTCUT.focusKey &&
                !isTyping(event.target);
            if (!chord && !slash) return;
            if (!open && document.querySelector("dialog[open]")) return;

            event.preventDefault();
            change(chord ? !open : true);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onOpenChange]);

    return (
        <>
            <button
                type="button"
                aria-keyshortcuts="Control+K Meta+K"
                onClick={() => {
                    setOpen(true);
                    onOpenChange?.(true);
                }}
                className="group border-border bg-background text-text-muted hover:border-border-dark hover:text-text-secondary focus-visible:outline-accent text-compact flex h-9 max-w-md min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg border pr-1.5 pl-3 transition-colors focus-visible:outline-2"
            >
                <Search aria-hidden className="size-4 shrink-0" />
                <span className="flex-1 truncate text-left">
                    {COPY.trigger}
                </span>
                <kbd
                    aria-label={COPY.shortcutSpoken}
                    className="bg-background-muted text-text-secondary text-caption hidden rounded-md px-2 py-1 font-mono sm:inline"
                >
                    {COPY.shortcut}
                </kbd>
            </button>
            {open ? (
                <CommandPalette
                    commands={commands}
                    searchAllHref={searchAllHref}
                    onClose={() => {
                        setOpen(false);
                        onOpenChange?.(false);
                    }}
                />
            ) : null}
        </>
    );
}
