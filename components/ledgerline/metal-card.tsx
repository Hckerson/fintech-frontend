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
            <div className="sheen text-text relative mx-auto aspect-[1.586] w-full max-w-md overflow-hidden rounded-2xl bg-linear-145 from-(--ledger-card-top) to-(--ledger-card-bottom) p-7 shadow-(--ledger-frame-shadow)">
                <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <span className="text-lg font-semibold tracking-tight">
                            {LEDGER_BRAND.name}
                        </span>
                        <span
                            aria-hidden
                            className="from-accent to-accent-dark h-8 w-11 rounded-md bg-linear-to-br opacity-90"
                        />
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-text-secondary text-sm">
                                {CARDS_COPY.holder}
                            </span>
                            <span className="text-text-secondary font-mono text-sm tracking-widest">
                                {CARDS_COPY.number}
                            </span>
                        </div>
                        <LedgerGlyph className="text-accent size-7" />
                    </div>
                </div>
            </div>
            <div className="surface-card mx-auto flex w-full max-w-md flex-col gap-3 p-5">
                <div className="flex items-baseline justify-between text-sm">
                    <span className="text-text-muted">
                        {CARDS_COPY.spendLabel}
                    </span>
                    <span className="text-text tabular-nums">
                        {formatMoney(
                            CARDS_COPY.spentMinor,
                            CARDS_COPY.currency,
                        )}
                        <span className="text-text-muted">
                            {" "}
                            /{" "}
                            {formatMoney(
                                CARDS_COPY.limitMinor,
                                CARDS_COPY.currency,
                            )}
                        </span>
                    </span>
                </div>
                <div className="bg-background-muted h-1.5 overflow-hidden rounded-full">
                    <motion.div
                        className="bg-accent h-full origin-left rounded-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: SPENT_SHARE }}
                        viewport={{ once: true }}
                        transition={{
                            duration: LINE_DRAW_SECONDS,
                            ease: REVEAL_EASE,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
