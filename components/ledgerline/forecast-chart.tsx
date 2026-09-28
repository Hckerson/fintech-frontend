"use client";
import { motion } from "motion/react";
import { ACTUAL_SERIES, FORECAST_SERIES, FORECAST_SPREAD, TREASURY_COPY } from "@/lib/data/ledgerline/treasury";
import { bandPath, lastPoint, linePath } from "@/lib/ledgerline/chart";
import { FORECAST_CHART, FORECAST_DELAY, LINE_DRAW_SECONDS, REVEAL_EASE } from "@/lib/ledgerline/constants";
import type { SeriesFrame } from "@/lib/types";

const spreadAt = (index: number) => (FORECAST_SPREAD * index) / (FORECAST_SERIES.length - 1);
const UPPER = FORECAST_SERIES.map((value, index) => value + spreadAt(index));
const LOWER = FORECAST_SERIES.map((value, index) => value - spreadAt(index));
const ALL = [...ACTUAL_SERIES, ...UPPER, ...LOWER];
const FRAME: SeriesFrame = {
    min: Math.min(...ALL),
    max: Math.max(...ALL),
    start: 0,
    total: ACTUAL_SERIES.length + FORECAST_SERIES.length - 1,
};
const FORECAST_FRAME: SeriesFrame = { ...FRAME, start: ACTUAL_SERIES.length - 1 };
const ACTUAL = linePath(ACTUAL_SERIES, FORECAST_CHART, FRAME);
const FORECAST = linePath(FORECAST_SERIES, FORECAST_CHART, FORECAST_FRAME);
const BAND = bandPath(UPPER, LOWER, FORECAST_CHART, FORECAST_FRAME);
const [todayX, todayY] = lastPoint(ACTUAL_SERIES, FORECAST_CHART, FRAME);
const VIEW = { once: true, margin: "-15%" } as const;
const LEGEND = [
    { id: "actual", label: TREASURY_COPY.actualLabel, swatch: "h-0.5 w-5 bg-(--colors-line)" },
    { id: "forecast", label: TREASURY_COPY.forecastLabel, swatch: "h-0 w-5 border-t-2 border-dashed border-(--colors-line)" },
    { id: "band", label: TREASURY_COPY.bandLabel, swatch: "h-3 w-5 rounded-sm bg-accent-light" },
];

export default function ForecastChart() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm font-medium text-text">{TREASURY_COPY.chartTitle}</span>
                <ul className="flex flex-wrap gap-5 text-xs text-text-muted">
                    {LEGEND.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                            <span aria-hidden className={item.swatch} />
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>
            <svg viewBox={`0 0 ${FORECAST_CHART.width} ${FORECAST_CHART.height}`} className="h-auto w-full" aria-hidden>
                <line x1={todayX} x2={todayX} y1={0} y2={FORECAST_CHART.height} className="stroke-border-dark" strokeDasharray="2 4" />
                <motion.path
                    d={BAND}
                    className="fill-accent-light"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={VIEW}
                    transition={{ duration: LINE_DRAW_SECONDS, delay: FORECAST_DELAY }}
                />
                <motion.path
                    d={ACTUAL}
                    className="signature-line"
                    strokeWidth={2}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={VIEW}
                    transition={{ duration: LINE_DRAW_SECONDS, ease: REVEAL_EASE }}
                />
                <motion.path
                    d={FORECAST}
                    className="signature-line"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={VIEW}
                    transition={{ duration: LINE_DRAW_SECONDS, delay: FORECAST_DELAY }}
                />
                <circle cx={todayX} cy={todayY} r={5} className="fill-(--colors-line)" />
            </svg>
        </div>
    );
}
