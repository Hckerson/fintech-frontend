"use client";
import { motion } from "motion/react";
import { ArrowRight } from "@carbon/icons-react";
import LedgerButton from "@/components/ledgerline/ledger-button";
import ProductStage from "@/components/ledgerline/product-stage";
import { LEDGER_HERO } from "@/lib/data/ledgerline/brand";
import { HERO_CUES, LINE_SECONDS, REVEAL, REVEAL_EASE } from "@/lib/ledgerline/constants";

const rise = (delay: number) => ({
    initial: { opacity: 0, y: REVEAL.offset },
    animate: { opacity: 1, y: 0 },
    transition: { duration: REVEAL.seconds, delay, ease: REVEAL_EASE },
});

export default function HeroSection() {
    return (
        <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-(--ledger-nav)">
            <div aria-hidden className="hero-glow" />
            <div className="ledger-shell relative flex flex-col items-center pt-20 text-center lg:pt-28">
                <motion.p
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background-alt px-3 py-1.5 text-xs text-text-secondary"
                    {...rise(HERO_CUES.badge)}
                >
                    <span aria-hidden className="live-dot size-1.5 rounded-full bg-accent" />
                    <span className="font-medium text-text">{LEDGER_HERO.badge}</span>
                    <span aria-hidden>·</span>
                    {LEDGER_HERO.badgeDetail}
                </motion.p>
                <h1 id="hero-title" className="ledger-display mt-7 max-w-4xl text-text">
                    {LEDGER_HERO.lines.map((line, index) => (
                        <span key={line} className="block overflow-hidden pb-[0.06em]">
                            <motion.span
                                className={index === 1 ? "block text-accent" : "block"}
                                initial={{ y: "105%" }}
                                animate={{ y: "0%" }}
                                transition={{
                                    duration: LINE_SECONDS,
                                    delay: HERO_CUES.lines + index * HERO_CUES.lineStagger,
                                    ease: REVEAL_EASE,
                                }}
                            >
                                {line}
                            </motion.span>
                        </span>
                    ))}
                </h1>
                <motion.p className="mt-7 max-w-xl text-lg text-text-secondary" {...rise(HERO_CUES.body)}>
                    {LEDGER_HERO.body}
                </motion.p>
                <motion.div className="mt-9 flex flex-wrap justify-center gap-3" {...rise(HERO_CUES.actions)}>
                    <LedgerButton href={LEDGER_HERO.primary.href}>
                        {LEDGER_HERO.primary.label}
                        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </LedgerButton>
                    <LedgerButton href={LEDGER_HERO.secondary.href} tone="ghost">
                        {LEDGER_HERO.secondary.label}
                    </LedgerButton>
                </motion.div>
                <div className="mt-16 w-full lg:mt-20">
                    <ProductStage />
                </div>
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />
        </section>
    );
}
