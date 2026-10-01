"use client";
import clsx from "clsx";
import { useRef, type KeyboardEvent } from "react";
import type { TabItem } from "@/lib/types";

interface Props<TId extends string> {
    label: string;
    tabs: readonly TabItem<TId>[];
    value: TId;
    onChange: (id: TId) => void;
    panelId: string;
    disabled?: boolean;
}

const STEP: Partial<Record<string, (index: number, count: number) => number>> =
    {
        ArrowRight: (index, count) => (index + 1) % count,
        ArrowLeft: (index, count) => (index - 1 + count) % count,
        Home: () => 0,
        End: (_, count) => count - 1,
    };

export default function Tabs<TId extends string>({
    label,
    tabs,
    value,
    onChange,
    panelId,
    disabled = false,
}: Props<TId>) {
    const list = useRef<HTMLDivElement>(null);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const step = STEP[event.key];
        if (!step) return;

        event.preventDefault();
        const next = step(
            tabs.findIndex((tab) => tab.id === value),
            tabs.length,
        );
        onChange(tabs[next].id);
        list.current
            ?.querySelectorAll<HTMLElement>('[role="tab"]')
            [next]?.focus();
    };

    return (
        <div
            ref={list}
            role="tablist"
            aria-label={label}
            onKeyDown={onKeyDown}
            className="bg-background-muted flex max-w-full gap-1 overflow-x-auto rounded-md p-1 text-xs"
        >
            {tabs.map((tab) => {
                const selected = tab.id === value;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls={panelId}
                        aria-disabled={disabled}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => !disabled && onChange(tab.id)}
                        className={clsx(
                            "focus-visible:outline-accent cursor-pointer rounded px-2.5 py-1 whitespace-nowrap focus-visible:outline-2",
                            selected
                                ? "bg-background text-text"
                                : "text-text-muted hover:text-text",
                        )}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
