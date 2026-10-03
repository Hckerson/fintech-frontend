"use client";
import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import ChartTable from "@/components/ui/chart-table";
import LineChartPlot from "@/components/ui/line-chart-plot";
import { HERO_CHART as BOX } from "@/lib/dashboard/constants";
import { frameOf } from "@/lib/ledgerline/chart";
import type { ChartPoint } from "@/lib/types";

interface Props {
    title: string;
    summary: string;
    hint: string;
    points: readonly ChartPoint[];
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
    table,
}: Props) {
    const id = useId();
    const [active, setActive] = useState<number | null>(null);
    const values = points.map(({ value }) => value);
    const frame = frameOf(values);
    const last = points.length - 1;
    const shown = active ?? last;
    const point = points[shown];
    const x = last > 0 ? (shown / last) * 100 : 100;
    const share = (point.value - frame.min) / (frame.max - frame.min || 1);
    const y =
        ((BOX.pad + (1 - share) * (BOX.height - BOX.pad * 2)) / BOX.height) *
        100;

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
        <figure aria-labelledby={id} className="flex flex-col gap-2">
            <figcaption id={id} className="sr-only">
                {title}. {summary} {hint}
            </figcaption>
            <div
                role="group"
                tabIndex={0}
                aria-labelledby={id}
                onPointerMove={onPointerMove}
                onPointerLeave={() => setActive(null)}
                onKeyDown={onKeyDown}
                className="focus-visible:outline-accent relative h-56 touch-pan-y rounded-lg focus-visible:outline-2 sm:h-64"
            >
                <LineChartPlot values={values} frame={frame} />
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
                                ? { right: `calc(${100 - x}% + 0.75rem)` }
                                : { left: `calc(${x}% + 0.75rem)` }
                        }
                    >
                        <span className="text-text-muted">{point.label}</span>
                        <span className="text-text text-compact font-medium tabular-nums">
                            {point.display}
                        </span>
                    </div>
                )}
            </div>
            <div
                aria-hidden
                className="text-text-muted text-caption flex justify-between tabular-nums"
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
