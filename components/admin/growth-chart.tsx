"use client";
import clsx from "clsx";
import { useState, type KeyboardEvent, type PointerEvent } from "react";
import GrowthChartPlot from "@/components/admin/growth-chart-plot";
import GrowthChartScale from "@/components/admin/growth-chart-scale";
import GrowthChartTicks from "@/components/admin/growth-chart-ticks";
import GrowthChartTooltip from "@/components/admin/growth-chart-tooltip";
import { GROWTH_CHART } from "@/lib/admin/constants";
import type { ChartPoint } from "@/lib/types";
import { periodDelta } from "@/lib/utils/delta";
import { nearestIndex, niceCeiling, plotSpots } from "@/lib/utils/growth-chart";

interface Props {
    title: string;
    summary: string;
    hint: string;
    points: ChartPoint[];
}

const { steps } = GROWTH_CHART;

const HOLLOW = "border-text-muted bg-background-alt border-2";

const DOT = "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full";

export default function GrowthChart({ title, summary, hint, points }: Props) {
    const [active, setActive] = useState<number | null>(null);
    const values = points.map((point) => point.value);
    const max = niceCeiling(Math.max(...values), steps);
    const spots = plotSpots(values, GROWTH_CHART, max);
    const last = points.length - 1;
    const open = Boolean(points[last]?.partial);
    const shown = active ?? (open ? last - 1 : last);
    const place = (spot: { left: number; top: number }) => ({
        left: `${spot.left * 100}%`,
        top: `${spot.top * 100}%`,
    });

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setActive(
            nearestIndex(
                (event.clientX - bounds.left) / bounds.width,
                points.length,
                GROWTH_CHART,
            ),
        );
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const moves: Partial<Record<string, number | null>> = {
            ArrowRight: Math.min(last, shown + 1),
            ArrowLeft: Math.max(0, shown - 1),
            Home: 0,
            End: last,
            Escape: null,
        };
        if (!(event.key in moves)) return;

        event.preventDefault();
        setActive(moves[event.key] ?? null);
    };

    return (
        <figure className="flex flex-col gap-2">
            <figcaption className="sr-only">
                {title}. {summary} {hint}
            </figcaption>
            <div className="flex gap-3">
                <GrowthChartScale max={max} />
                <div
                    role="group"
                    tabIndex={0}
                    aria-label={title}
                    onPointerMove={onPointerMove}
                    onPointerLeave={() => setActive(null)}
                    onBlur={() => setActive(null)}
                    onKeyDown={onKeyDown}
                    className="focus-visible:outline-accent relative h-64 min-w-0 flex-1 cursor-crosshair rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 sm:h-72"
                >
                    <GrowthChartPlot values={values} max={max} partial={open} />
                    {active === null ? null : (
                        <span
                            aria-hidden
                            className="bg-border-dark absolute inset-y-0 w-px"
                            style={{ left: `${spots[active].left * 100}%` }}
                        />
                    )}
                    <span
                        aria-hidden
                        style={place(spots[shown])}
                        className={clsx(
                            DOT,
                            points[shown].partial
                                ? HOLLOW
                                : "bg-(--colors-line) shadow-[0_0_0_5px_var(--ledger-glow)]",
                        )}
                    />
                    {open && shown !== last ? (
                        <span
                            aria-hidden
                            style={place(spots[last])}
                            className={clsx(DOT, HOLLOW)}
                        />
                    ) : null}
                    {active === null ? null : (
                        <GrowthChartTooltip
                            point={points[active]}
                            spot={spots[active]}
                            delta={
                                active > 0
                                    ? periodDelta(
                                          values[active],
                                          values[active - 1],
                                      )
                                    : null
                            }
                        />
                    )}
                </div>
            </div>
            <GrowthChartTicks points={points} spots={spots} shown={shown} />
            <p aria-live="polite" className="sr-only">
                {active === null
                    ? ""
                    : `${points[active].label}: ${points[active].display}`}
            </p>
        </figure>
    );
}
