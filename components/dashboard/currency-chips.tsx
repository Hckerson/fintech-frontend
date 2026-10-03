"use client";
import clsx from "clsx";
import Amount from "@/components/common/amount";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashPosition } from "@/lib/types";

interface Props {
    positions: readonly CashPosition[];
    shown: string;
    disabled: boolean;
    onSelect: (currency: string) => void;
}

const COPY = DASHBOARD_COPY.overview;

export default function CurrencyChips({
    positions,
    shown,
    disabled,
    onSelect,
}: Props) {
    return (
        <div
            role="group"
            aria-label={COPY.currencies}
            className="flex flex-wrap gap-2"
        >
            {positions.map(({ currency, available }) => {
                const selected = currency === shown;

                return (
                    <button
                        key={currency}
                        type="button"
                        aria-pressed={selected}
                        aria-label={COPY.select(currency)}
                        disabled={disabled || positions.length === 1}
                        onClick={() => onSelect(currency)}
                        className={clsx(
                            "focus-visible:outline-accent text-compact flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors focus-visible:outline-2",
                            selected
                                ? "border-accent/50 bg-accent-light text-text"
                                : "border-border text-text-secondary hover:border-border-dark hover:text-text cursor-pointer",
                        )}
                    >
                        <span
                            className={clsx(
                                "font-mono text-xs",
                                selected ? "text-accent" : "text-text-muted",
                            )}
                        >
                            {currency}
                        </span>
                        <Amount {...available} className="tabular-nums" />
                    </button>
                );
            })}
        </div>
    );
}
