"use client";
import dynamic from "next/dynamic";
import { useId } from "react";
import type { FlowLabels, FlowPoint } from "@/lib/types";

const FlowChartPlot = dynamic(() => import("@/components/ui/flow-chart-plot"), {
    ssr: false,
    loading: () => (
        <div className="bg-background-muted size-full animate-pulse rounded-xl" />
    ),
});

interface Props {
    title: string;
    summary: string;
    points: FlowPoint[];
    labels: FlowLabels;
    formatTick: (value: number) => string;
}

const CELL = "py-2 text-right font-mono tabular-nums";

export default function FlowChart({
    title,
    summary,
    points,
    labels,
    formatTick,
}: Props) {
    const id = useId();
    const legend = [
        { label: labels.inflow, swatch: "bg-accent size-2.5 rounded-sm" },
        {
            label: labels.outflow,
            swatch: "bg-text-muted/45 size-2.5 rounded-sm",
        },
    ];

    return (
        <figure
            aria-labelledby={id}
            className="flex min-h-0 flex-1 flex-col gap-3"
        >
            <figcaption id={id} className="sr-only">
                {title}. {summary}
            </figcaption>
            <ul
                aria-hidden
                className="text-text-muted flex flex-wrap justify-end gap-4 text-xs"
            >
                {legend.map(({ label, swatch }) => (
                    <li key={label} className="flex items-center gap-2">
                        <span className={swatch} />
                        {label}
                    </li>
                ))}
            </ul>
            <div className="relative h-56 sm:h-64 xl:h-auto xl:min-h-40 xl:flex-1">
                <div className="absolute inset-0">
                    <FlowChartPlot
                        points={points}
                        labels={labels}
                        formatTick={formatTick}
                    />
                </div>
            </div>
            <div className="sr-only">
                <table className="w-full text-left text-xs">
                    <thead className="text-text-muted">
                        <tr>
                            <th scope="col" className="py-2 font-medium">
                                {labels.period}
                            </th>
                            {[labels.inflow, labels.outflow, labels.net].map(
                                (heading) => (
                                    <th
                                        key={heading}
                                        scope="col"
                                        className="py-2 text-right font-medium"
                                    >
                                        {heading}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {points.map(({ label, display }) => (
                            <tr key={label} className="border-border border-t">
                                <th
                                    scope="row"
                                    className="text-text-secondary py-2 font-normal"
                                >
                                    {label}
                                </th>
                                <td className={`text-text-secondary ${CELL}`}>
                                    {display.inflow}
                                </td>
                                <td className={`text-text-secondary ${CELL}`}>
                                    {display.outflow}
                                </td>
                                <td className={`text-text ${CELL}`}>
                                    {display.net}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </figure>
    );
}
