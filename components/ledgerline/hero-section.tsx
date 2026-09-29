"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "@carbon/icons-react";
import LedgerButton from "@/components/ledgerline/ledger-button";
import ProductStage from "@/components/ledgerline/product-stage";
import { LEDGER_HERO } from "@/lib/data/ledgerline/brand";
import {
    FRAME_MOTION,
    HERO_CUES,
    HERO_RECEDE,
    LINE_SECONDS,
    REVEAL,
    REVEAL_EASE,
    SCROLL_SPRING,
} from "@/lib/ledgerline/constants";

const rise = (delay: number) => ({
    initial: { opacity: 0, y: REVEAL.offset },
    animate: { opacity: 1, y: 0 },
    transition: { duration: REVEAL.seconds, delay, ease: REVEAL_EASE },
});

export default function HeroSection() {
    const stageRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: stageRef,
        offset: [...FRAME_MOTION.offset],
    });
    const progress = useSpring(scrollYProgress, SCROLL_SPRING);
    const copyY = useTransform(
        progress,
        [...HERO_RECEDE.range],
        [0, HERO_RECEDE.lift],
    );
    const copyOpacity = useTransform(
        progress,
        [...HERO_RECEDE.range],
        [1, HERO_RECEDE.fade],
    );
    const glowOpacity = useTransform(progress, [0, 1], [...HERO_RECEDE.glow]);

    return (
        <section
            id="top"
            aria-labelledby="hero-title"
            className="relative overflow-hidden pt-(--ledger-header)"
        >
            <motion.div
                aria-hidden
                className="hero-glow"
                style={{ opacity: glowOpacity }}
            />
            <div className="ledger-shell relative pt-16 lg:pt-24">
                <motion.div
                    className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-12"
                    style={{ y: copyY, opacity: copyOpacity }}
                >
                    <div className="flex flex-col gap-7 lg:col-span-7">
                        <motion.p
                            className="text-text-muted flex items-center gap-2.5 font-mono text-xs"
                            {...rise(HERO_CUES.badge)}
                        >
                            <span
                                aria-hidden
                                className="live-dot bg-accent size-1.5 rounded-full"
                            />
                            {LEDGER_HERO.badge} · {LEDGER_HERO.badgeDetail}
                        </motion.p>
                        <h1
                            id="hero-title"
                            className="ledger-display text-text"
                        >
                            {LEDGER_HERO.lines.map((line, index) => (
                                <span
                                    key={line}
                                    className="block overflow-hidden pb-[0.06em]"
                                >
                                    <motion.span
                                        className={
                                            index === 1
                                                ? "text-accent block"
                                                : "block"
                                        }
                                        initial={{ y: "105%" }}
                                        animate={{ y: "0%" }}
                                        transition={{
                                            duration: LINE_SECONDS,
                                            delay:
                                                HERO_CUES.lines +
                                                index * HERO_CUES.lineStagger,
                                            ease: REVEAL_EASE,
                                        }}
                                    >
                                        {line}
                                    </motion.span>
                                </span>
                            ))}
                        </h1>
                    </div>
                    <div className="flex flex-col gap-8 lg:col-span-5 lg:pb-3">
                        <motion.p
                            className="text-text-secondary max-w-md text-lg"
                            {...rise(HERO_CUES.body)}
                        >
                            {LEDGER_HERO.body}
                        </motion.p>
                        <motion.div
                            className="flex flex-wrap gap-3"
                            {...rise(HERO_CUES.actions)}
                        >
                            <LedgerButton
                                href={LEDGER_HERO.primary.href}
                                tone="accent"
                            >
                                {LEDGER_HERO.primary.label}
                                <ArrowRight
                                    aria-hidden
                                    className="size-4 transition-transform group-hover:translate-x-0.5"
                                />
                            </LedgerButton>
                            <LedgerButton
                                href={LEDGER_HERO.secondary.href}
                                tone="ghost"
                            >
                                {LEDGER_HERO.secondary.label}
                            </LedgerButton>
                        </motion.div>
                    </div>
                </motion.div>
                <div className="mt-16 w-full lg:mt-20">
                    <ProductStage ref={stageRef} progress={progress} />
                </div>
            </div>
            <div
                aria-hidden
                className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t to-transparent"
            />
        </section>
    );
}
