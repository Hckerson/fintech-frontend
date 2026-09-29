"use client";
import { motion } from "motion/react";
import LedgerGlyph from "@/components/ledgerline/ledger-glyph";
import { CARDS_COPY } from "@/lib/data/ledgerline/features";
import { LEDGER_BRAND } from "@/lib/data/ledgerline/brand";
import { formatMoney } from "@/lib/ledgerline/money";
import { LINE_DRAW_SECONDS, REVEAL_EASE } from "@/lib/ledgerline/constants";

const SPENT_SHARE = CARDS_COPY.spentMinor / CARDS_COPY.limitMinor;

export default function MetalCard() {
    return (
        <div className="flex flex-col gap-6">
            <div className="metal-card sheen mx-auto w-full max-w-md rounded-2xl p-7 text-text">
                <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <span className="text-lg font-semibold tracking-tight">{LEDGER_BRAND.name}</span>
                        <span aria-hidden className="h-8 w-11 rounded-md bg-linear-to-br from-accent to-accent-dark opacity-90" />
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-text-secondary">{CARDS_COPY.holder}</span>
                            <span className="font-mono text-sm tracking-widest text-text-secondary">{CARDS_COPY.number}</span>
                        </div>
                        <LedgerGlyph className="size-7 text-accent" />
                    </div>
                </div>
            </div>
            <div className="surface-card mx-auto flex w-full max-w-md flex-col gap-3 p-5">
                <div className="flex items-baseline justify-between text-sm">
                    <span className="text-text-muted">{CARDS_COPY.spendLabel}</span>
                    <span className="tabular-nums text-text">
                        {formatMoney(CARDS_COPY.spentMinor, CARDS_COPY.currency)}
                        <span className="text-text-muted"> / {formatMoney(CARDS_COPY.limitMinor, CARDS_COPY.currency)}</span>
                    </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-background-muted">
                    <motion.div
                        className="h-full origin-left rounded-full bg-accent"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: SPENT_SHARE }}
                        viewport={{ once: true }}
                        transition={{ duration: LINE_DRAW_SECONDS, ease: REVEAL_EASE }}
                    />
                </div>
            </div>
        </div>
    );
}
