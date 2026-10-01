"use client";
import clsx from "clsx";
import { motion } from "motion/react";
import { CheckmarkFilled } from "@carbon/icons-react";
import { RECONCILE_COPY } from "@/lib/data/ledgerline/reconcile";
import { formatSigned, signOf } from "@/lib/ledgerline/money";
import { MATCH_STAGGER, REVEAL, REVEAL_EASE } from "@/lib/ledgerline/constants";
import type { MatchedEntry } from "@/lib/types";

interface Props {
    entry: MatchedEntry;
    index: number;
}

export default function MatchedRow({ entry, index }: Props) {
    return (
        <li className="border-border flex items-center gap-4 border-t px-6 py-4 first:border-t-0">
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-text truncate text-sm">
                    {entry.description}
                </span>
                <span className="text-text-muted text-xs">{entry.account}</span>
            </span>
            <span
                className={clsx(
                    "text-sm tabular-nums",
                    signOf(entry.amountMinor) === "in"
                        ? "text-success"
                        : "text-text-secondary",
                )}
            >
                {formatSigned(entry.amountMinor)}
            </span>
            <motion.span
                className="text-success inline-flex w-24 items-center justify-end gap-1.5 text-xs"
                initial={{ opacity: 0, x: REVEAL.offset / 2 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                    duration: REVEAL.seconds,
                    delay: index * MATCH_STAGGER,
                    ease: REVEAL_EASE,
                }}
            >
                <CheckmarkFilled aria-hidden className="size-4" />
                {RECONCILE_COPY.matched}
            </motion.span>
        </li>
    );
}
