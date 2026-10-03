"use client";
import { useEffect, useRef, useState } from "react";
import { Checkmark, Copy } from "@carbon/icons-react";
import { COPIED_MS } from "@/lib/ledger/constants";

interface Props {
    value: string;
    label: string;
    copied: string;
    failed: string;
}

export default function CopyButton({ value, label, copied, failed }: Props) {
    const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const copy = async () => {
        clearTimeout(timer.current);
        try {
            await navigator.clipboard.writeText(value);
            setState("copied");
            timer.current = setTimeout(() => setState("idle"), COPIED_MS);
        } catch {
            setState("failed");
        }
    };

    return (
        <span className="relative z-(--z-indices-dropdown) inline-flex items-center gap-1">
            <button
                type="button"
                aria-label={label}
                onClick={copy}
                className="text-text-muted hover:text-text focus-visible:outline-accent inline-flex size-5 cursor-pointer items-center justify-center rounded focus-visible:outline-2"
            >
                {state === "copied" ? (
                    <Checkmark aria-hidden className="text-success size-3.5" />
                ) : (
                    <Copy aria-hidden className="size-3.5" />
                )}
            </button>
            <span
                role="status"
                className={
                    state === "failed" ? "text-warning text-xs" : "sr-only"
                }
            >
                {state === "copied" ? copied : state === "failed" ? failed : ""}
            </span>
        </span>
    );
}
