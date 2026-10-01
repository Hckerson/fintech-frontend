"use client";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { CheckmarkFilled, Time } from "@carbon/icons-react";
import { APPROVAL_SECONDS, REVEAL_EASE } from "@/lib/ledgerline/constants";
import type { ApprovalStep } from "@/lib/types";

interface Props {
    step: ApprovalStep;
    done: boolean;
    pendingLabel: string;
}

export default function ApprovalStepRow({ step, done, pendingLabel }: Props) {
    return (
        <li className="flex items-center gap-4 border-t border-border py-4 first:border-t-0">
            <span
                className={clsx(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-500",
                    done ? "bg-accent-light text-accent" : "border border-dashed border-border-dark text-text-muted",
                )}
            >
                {step.initials}
            </span>
            <span className="flex flex-1 flex-col">
                <span className={clsx("text-sm font-medium transition-colors", done ? "text-text" : "text-text-muted")}>
                    {step.label}
                </span>
                <span className="text-xs text-text-muted">{done ? step.actor : pendingLabel}</span>
            </span>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={String(done)}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: APPROVAL_SECONDS, ease: REVEAL_EASE }}
                >
                    {done ? (
                        <CheckmarkFilled aria-hidden className="size-5 text-success" />
                    ) : (
                        <Time aria-hidden className="size-5 text-text-muted" />
                    )}
                </motion.span>
            </AnimatePresence>
        </li>
    );
}
