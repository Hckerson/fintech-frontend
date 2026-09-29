"use client";
import clsx from "clsx";
import { motion } from "motion/react";
import { ArrowUpRight } from "@carbon/icons-react";
import { CASH_AXIS, CASH_SERIES, DASHBOARD } from "@/lib/data/ledgerline/dashboard";
import { areaPath, lastPoint, linePath } from "@/lib/ledgerline/chart";
import { formatMoney } from "@/lib/ledgerline/money";
import { CHART, CHART_GRIDLINES, HERO_CUES, LINE_DRAW_SECONDS, REVEAL_EASE } from "@/lib/ledgerline/constants";

const LINE = linePath(CASH_SERIES, CHART);
const AREA = areaPath(CASH_SERIES, CHART);
const [endX, endY] = lastPoint(CASH_SERIES, CHART);

export default function FrameCash() {
    return (
        <div className="frame-panel flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-text-muted">{DASHBOARD.cashTitle}</span>
                    <span className="text-3xl font-medium tracking-tight tabular-nums text-text">
                        {formatMoney(DASHBOARD.cashTotalMinor, DASHBOARD.cashCurrency)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-success">
                        <ArrowUpRight className="size-3.5" />
                        {DASHBOARD.delta}
                        <span className="text-text-muted">{DASHBOARD.deltaLabel}</span>
                    </span>
                </div>
                <div className="flex gap-1 rounded-md bg-background-muted p-1 text-xs">
                    {DASHBOARD.ranges.map((range) => (
                        <span
                            key={range}
                            className={clsx(
                                "rounded px-2 py-1",
                                range === DASHBOARD.activeRange ? "bg-background text-text" : "text-text-muted",
                            )}
                        >
                            {range}
                        </span>
                    ))}
                </div>
            </div>
            <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} className="h-auto w-full" aria-hidden>
                {CHART_GRIDLINES.map((share) => (
                    <line
                        key={share}
                        x1={0}
                        x2={CHART.width}
                        y1={CHART.height * share}
                        y2={CHART.height * share}
                        className="stroke-border"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
                <motion.path
                    d={AREA}
                    className="signature-area"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: LINE_DRAW_SECONDS, delay: HERO_CUES.chart, ease: REVEAL_EASE }}
                />
                <motion.path
                    d={LINE}
                    className="signature-line"
                    strokeWidth={2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: LINE_DRAW_SECONDS, delay: HERO_CUES.chart, ease: REVEAL_EASE }}
                />
                <motion.circle
                    cx={endX}
                    cy={endY}
                    r={4}
                    className="fill-(--colors-line)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: HERO_CUES.chart + LINE_DRAW_SECONDS, ease: REVEAL_EASE }}
                />
            </svg>
            <div aria-hidden className="flex justify-between font-mono text-caption text-text-muted">
                {CASH_AXIS.map((label) => (
                    <span key={label}>{label}</span>
                ))}
            </div>
        </div>
    );
}
