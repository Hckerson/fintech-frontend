"use client";
import { useId } from "react";
import { motion } from "motion/react";
import { CASH_SERIES } from "@/lib/data/ledgerline/dashboard";
import { areaPath, lastPoint, linePath } from "@/lib/ledgerline/chart";
import {
    AUTH_CHART,
    CHART_GRIDLINES,
    LINE_DRAW_SECONDS,
    REVEAL_EASE,
} from "@/lib/ledgerline/constants";

const LINE = linePath(CASH_SERIES, AUTH_CHART);
const AREA = areaPath(CASH_SERIES, AUTH_CHART);
const [endX, endY] = lastPoint(CASH_SERIES, AUTH_CHART);
const END = {
    left: `${(endX / AUTH_CHART.width) * 100}%`,
    top: `${(endY / AUTH_CHART.height) * 100}%`,
};

export default function AuthPanelChart() {
    const fadeId = `auth-fade-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

    return (
        <div aria-hidden className="relative h-full w-full">
            <svg
                viewBox={`0 0 ${AUTH_CHART.width} ${AUTH_CHART.height}`}
                preserveAspectRatio="none"
                className="absolute inset-0 size-full"
            >
                <defs>
                    <linearGradient id={fadeId} x1="0" x2="0" y1="0" y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--colors-line)"
                            stopOpacity={0.18}
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--colors-line)"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>
                {CHART_GRIDLINES.map((share) => (
                    <line
                        key={share}
                        x1={0}
                        x2={AUTH_CHART.width}
                        y1={AUTH_CHART.height * share}
                        y2={AUTH_CHART.height * share}
                        className="stroke-border"
                        strokeDasharray="2 6"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
                <motion.path
                    d={AREA}
                    fill={`url(#${fadeId})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: LINE_DRAW_SECONDS,
                        ease: REVEAL_EASE,
                    }}
                />
                <motion.path
                    d={LINE}
                    className="signature-line"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{
                        duration: LINE_DRAW_SECONDS,
                        ease: REVEAL_EASE,
                    }}
                />
            </svg>
            <span
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={END}
            >
                <motion.span
                    className="block size-3 rounded-full bg-(--colors-line) shadow-[0_0_0_6px_var(--ledger-glow)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: LINE_DRAW_SECONDS, ease: REVEAL_EASE }}
                />
            </span>
        </div>
    );
}
