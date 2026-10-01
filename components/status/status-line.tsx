"use client";
import clsx from "clsx";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { CASH_SERIES } from "@/lib/data/ledgerline/dashboard";
import { frameOf, lastPoint, linePath } from "@/lib/ledgerline/chart";
import {
    CHART_GRIDLINES,
    LINE_DRAW_SECONDS,
    REVEAL_EASE,
    STATUS_BREAK_AT,
    STATUS_CHART,
} from "@/lib/ledgerline/constants";

interface Props {
    variant: "missing" | "failed";
    children: ReactNode;
}

const FRAME = frameOf(CASH_SERIES);
const DRAWN = CASH_SERIES.slice(0, STATUS_BREAK_AT);
const [breakX, breakY] = lastPoint(DRAWN, STATUS_CHART, FRAME);
const FLOOR = STATUS_CHART.height - STATUS_CHART.pad;
const TAIL = {
    missing: linePath(CASH_SERIES.slice(STATUS_BREAK_AT - 1), STATUS_CHART, {
        ...FRAME,
        start: STATUS_BREAK_AT - 1,
    }),
    failed: `M ${breakX} ${breakY} L ${breakX} ${FLOOR} L ${STATUS_CHART.width} ${FLOOR}`,
};
const BREAK = {
    left: `${(breakX / STATUS_CHART.width) * 100}%`,
    top: `${(breakY / STATUS_CHART.height) * 100}%`,
};

export default function StatusLine({ variant, children }: Props) {
    const failed = variant === "failed";

    return (
        <div className="relative h-56 w-full sm:h-72">
            <svg
                aria-hidden
                viewBox={`0 0 ${STATUS_CHART.width} ${STATUS_CHART.height}`}
                preserveAspectRatio="none"
                className="absolute inset-0 size-full"
            >
                {CHART_GRIDLINES.map((share) => (
                    <line
                        key={share}
                        x1={0}
                        x2={STATUS_CHART.width}
                        y1={STATUS_CHART.height * share}
                        y2={STATUS_CHART.height * share}
                        className="stroke-border"
                        strokeDasharray="2 6"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
                <motion.path
                    d={linePath(DRAWN, STATUS_CHART, FRAME)}
                    className="signature-line"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: LINE_DRAW_SECONDS,
                        ease: REVEAL_EASE,
                    }}
                />
                <motion.path
                    d={TAIL[variant]}
                    fill="none"
                    className={failed ? "stroke-error" : "stroke-text-muted"}
                    strokeWidth={1.5}
                    strokeDasharray="4 8"
                    vectorEffect="non-scaling-stroke"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: failed ? 0.8 : 0.5 }}
                    transition={{
                        delay: LINE_DRAW_SECONDS,
                        duration: 0.8,
                        ease: REVEAL_EASE,
                    }}
                />
            </svg>
            <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={BREAK}
            >
                <motion.span
                    aria-hidden
                    className={clsx(
                        "block size-3 rounded-full",
                        failed
                            ? "bg-error shadow-[0_0_0_6px_var(--colors-error-light)]"
                            : "bg-(--colors-line) shadow-[0_0_0_6px_var(--ledger-glow)]",
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: LINE_DRAW_SECONDS * 0.9,
                        ease: REVEAL_EASE,
                    }}
                />
                <div className="absolute bottom-full left-1/2 mb-12 -translate-x-1/2">
                    <motion.div
                        className="surface-card flex flex-col gap-1 px-4 py-3 font-mono text-xs whitespace-nowrap"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: LINE_DRAW_SECONDS,
                            duration: 0.6,
                            ease: REVEAL_EASE,
                        }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
