"use client";
import clsx from "clsx";
import { useState } from "react";
import { CARD_CONTROLS } from "@/lib/data/ledgerline/features";

export default function CardControls() {
    const [enabled, setEnabled] = useState(() => CARD_CONTROLS.map((control) => control.enabled));

    const toggle = (index: number) =>
        setEnabled((current) => current.map((value, position) => (position === index ? !value : value)));

    return (
        <ul className="flex flex-col">
            {CARD_CONTROLS.map((control, index) => (
                <li key={control.id} className="flex items-center justify-between gap-6 border-t border-border py-4">
                    <span className="flex flex-col">
                        <span id={`control-${control.id}`} className="text-sm font-medium text-text">
                            {control.label}
                        </span>
                        <span className="text-xs text-text-muted">{control.detail}</span>
                    </span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={enabled[index]}
                        aria-labelledby={`control-${control.id}`}
                        onClick={() => toggle(index)}
                        className={clsx(
                            "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-300",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                            enabled[index] ? "bg-accent" : "bg-background-muted",
                        )}
                    >
                        <span
                            className={clsx(
                                "absolute top-1 left-1 size-4 rounded-full bg-text transition-transform duration-300",
                                enabled[index] && "translate-x-5",
                            )}
                        />
                    </button>
                </li>
            ))}
        </ul>
    );
}
