"use client";
import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import ChartTable from "@/components/ui/chart-table";
import LineChartPlot from "@/components/ui/line-chart-plot";
import LineChartScale from "@/components/ui/line-chart-scale";
import { HERO_CHART as BOX, CHART_TICK_STEPS } from "@/lib/dashboard/constants";
import type { ChartPoint } from "@/lib/types";
import { niceScale } from "@/lib/utils/nice-scale";

interface Props {
    title: string;
    summary: string;
    hint: string;
    points: readonly ChartPoint[];
    formatTick: (value: number) => string;
    table: { x: string; y: string; toggle: string };
}

const STEP: Partial<Record<string, (index: number, last: number) => number>> = {
    ArrowRight: (index, last) => Math.min(index + 1, last),
    ArrowLeft: (index) => Math.max(index - 1, 0),
    Home: () => 0,
    End: (_, last) => last,
};

export default function LineChart({
    title,
    summary,
    hint,
    points,
    formatTick,
    table,
}: Props) {
    const id = useId();
    const [active, setActive] = useState<number | null>(null);
    const values = points.map(({ value }) => value);
    const last = points.length - 1;
    const ticks = niceScale(
        Math.min(...values),
        Math.max(...values),
        CHART_TICK_STEPS,
    );
    const frame = {
        min: ticks[0],
        max: ticks[ticks.length - 1],
        start: 0,
        total: points.length,
    };
    const top = (value: number) =>
        ((BOX.pad +
            (1 - (value - frame.min) / (frame.max - frame.min || 1)) *
                (BOX.height - BOX.pad * 2)) /
            BOX.height) *
        100;
    const shown = active ?? last;
    const point = points[shown];
    const x = last > 0 ? (shown / last) * 100 : 100;
    const y = top(point.value);

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const { left, width } = event.currentTarget.getBoundingClientRect();
        const ratio = Math.min(Math.max((event.clientX - left) / width, 0), 1);
        setActive(Math.round(ratio * last));
    };
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") return setActive(null);
        const step = STEP[event.key];
        if (!step) return;
        event.preventDefault();
        setActive(step(shown, last));
    };

    return (
        <figure
            aria-labelledby={id}
            className="flex min-h-0 flex-1 flex-col gap-2"
        >
            <figcaption id={id} className="sr-only">
                {title}. {summary} {hint}
            </figcaption>
            <div className="flex h-56 gap-3 sm:h-64 xl:h-auto xl:min-h-40 xl:flex-1">
                <LineChartScale
                    ticks={ticks.map((tick) => ({
                        label: formatTick(tick),
                        top: top(tick),
                    }))}
                />
                <div
                    role="group"
                    tabIndex={0}
                    aria-labelledby={id}
                    onPointerMove={onPointerMove}
                    onPointerLeave={() => setActive(null)}
                    onKeyDown={onKeyDown}
                    className="focus-visible:outline-accent relative min-w-0 flex-1 touch-pan-y rounded-lg focus-visible:outline-2"
                >
                    <LineChartPlot
                        values={values}
                        frame={frame}
                        lines={ticks.map(top)}
                    />
                    {active === null ? null : (
                        <span
                            aria-hidden
                            className="bg-border-dark pointer-events-none absolute inset-y-0 w-px"
                            style={{ left: `${x}%` }}
                        />
                    )}
                    <span
                        aria-hidden
                        className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--colors-line) shadow-[0_0_0_5px_var(--ledger-glow)]"
                        style={{ left: `${x}%`, top: `${y}%` }}
                    />
                    {active === null ? null : (
                        <div
                            aria-hidden
                            className="surface-card pointer-events-none absolute top-0 flex flex-col px-3 py-2 text-xs whitespace-nowrap"
                            style={
                                x > 55
                                    ? {
                                          right: `calc(${100 - x}% + 0.75rem)`,
                                      }
                                    : { left: `calc(${x}% + 0.75rem)` }
                            }
                        >
                            <span className="text-text-muted">
                                {point.label}
                            </span>
                            <span className="text-text text-compact font-medium tabular-nums">
                                {point.display}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div
                aria-hidden
                className="text-text-muted text-caption flex justify-between pl-13 tabular-nums"
            >
                <span>{points[0].label}</span>
                <span>{points[Math.round(last / 2)].label}</span>
                <span>{points[last].label}</span>
            </div>
            <p role="status" className="sr-only">
                {active === null ? "" : `${point.label}: ${point.display}`}
            </p>
            <ChartTable points={points} labels={table} />
        </figure>
    );
}
