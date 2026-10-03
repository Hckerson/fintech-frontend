"use client";
import { useId } from "react";
import { motion } from "motion/react";
import { GROWTH_CHART } from "@/lib/admin/constants";
import { areaPath, linePath } from "@/lib/ledgerline/chart";
import { LINE_SECONDS, REVEAL_EASE } from "@/lib/ledgerline/constants";

interface Props {
    values: readonly number[];
    max: number;
    partial: boolean;
}

const { width, height, steps, pad } = GROWTH_CHART;

export default function GrowthChartPlot({ values, max, partial }: Props) {
    const fadeId = `growth-fade-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
    const frame = { min: 0, max, start: 0, total: values.length };
    const settled = partial ? values.slice(0, -1) : values;
    const reveal = {
        initial: { clipPath: "inset(0 100% 0 0)" },
        animate: { clipPath: "inset(0 0% 0 0)" },
        transition: { duration: LINE_SECONDS, ease: REVEAL_EASE },
    };

    return (
        <svg
            aria-hidden
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
        >
            <defs>
                <linearGradient id={fadeId} x1="0" x2="0" y1="0" y2="1">
                    <stop
                        offset="0%"
                        stopColor="var(--colors-line)"
                        stopOpacity={0.22}
                    />
                    <stop
                        offset="100%"
                        stopColor="var(--colors-line)"
                        stopOpacity={0}
                    />
                </linearGradient>
            </defs>
            {Array.from({ length: steps + 1 }, (_, step) => {
                const y = pad + (step / steps) * (height - pad * 2);
                return (
                    <line
                        key={step}
                        x1={0}
                        x2={width}
                        y1={y}
                        y2={y}
                        className="stroke-border"
                        strokeDasharray={step === steps ? undefined : "2 6"}
                        vectorEffect="non-scaling-stroke"
                    />
                );
            })}
            {settled.length > 1 ? (
                <>
                    <motion.path
                        d={areaPath(settled, GROWTH_CHART, frame)}
                        fill={`url(#${fadeId})`}
                        {...reveal}
                    />
                    <motion.path
                        d={linePath(settled, GROWTH_CHART, frame)}
                        className="signature-line"
                        strokeWidth={2}
                        vectorEffect="non-scaling-stroke"
                        {...reveal}
                    />
                </>
            ) : null}
        </svg>
    );
}
