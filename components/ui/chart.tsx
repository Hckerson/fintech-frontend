"use client";
import dynamic from "next/dynamic";
import { useId } from "react";
import type { ChartMarker, ChartPoint } from "@/lib/types";

const ChartPlot = dynamic(() => import("@/components/ui/chart-plot"), {
    ssr: false,
    loading: () => (
        <div className="bg-background-muted size-full animate-pulse rounded-xl" />
    ),
});

interface Props {
    title: string;
    summary: string;
    points: ChartPoint[];
    marker?: ChartMarker;
    formatTick: (value: number) => string;
    wholeTicks?: boolean;
    variant?: "area" | "bar";
    fitted?: boolean;
    captionHidden?: boolean;
    table?: { x: string; y: string; toggle: string };
}

export default function Chart({
    title,
    summary,
    points,
    marker,
    formatTick,
    wholeTicks,
    variant,
    fitted,
    captionHidden = false,
    table,
}: Props) {
    const id = useId();

    return (
        <figure aria-labelledby={id} className="flex flex-col gap-4">
            <figcaption
                className={captionHidden ? "sr-only" : "flex flex-col gap-1"}
            >
                <span id={id} className="text-text text-sm font-medium">
                    {title}
                </span>
                <span className="text-text-muted text-xs">{summary}</span>
            </figcaption>
            <div className="h-64 sm:h-72">
                <ChartPlot
                    points={points}
                    marker={marker}
                    formatTick={formatTick}
                    wholeTicks={wholeTicks}
                    variant={variant}
                    fitted={fitted}
                />
            </div>
            {table ? (
                <div className="sr-only">
                    <table className="w-full text-left">
                        <thead className="text-text-muted text-xs">
                            <tr>
                                <th scope="col" className="py-2 font-medium">
                                    {table.x}
                                </th>
                                <th
                                    scope="col"
                                    className="py-2 text-right font-medium"
                                >
                                    {table.y}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {points.map((point) => (
                                <tr
                                    key={point.label}
                                    className="border-border border-t"
                                >
                                    <th
                                        scope="row"
                                        className="text-text-secondary py-2 font-normal"
                                    >
                                        {point.label}
                                    </th>
                                    <td className="text-text py-2 text-right font-mono tabular-nums">
                                        {point.display}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </figure>
    );
}
