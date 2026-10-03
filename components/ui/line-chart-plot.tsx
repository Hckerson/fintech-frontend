import { useId } from "react";
import { HERO_CHART as BOX } from "@/lib/dashboard/constants";
import { areaPath, linePath } from "@/lib/ledgerline/chart";
import type { SeriesFrame } from "@/lib/types";

interface Props {
    values: readonly number[];
    frame: SeriesFrame;
    lines: readonly number[];
}

export default function LineChartPlot({ values, frame, lines }: Props) {
    const fillId = `fill-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

    return (
        <svg
            aria-hidden
            viewBox={`0 0 ${BOX.width} ${BOX.height}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
        >
            <defs>
                <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
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
            {lines.map((line) => (
                <line
                    key={line}
                    x1={0}
                    x2={BOX.width}
                    y1={(BOX.height * line) / 100}
                    y2={(BOX.height * line) / 100}
                    className="stroke-border"
                    strokeDasharray="2 6"
                    vectorEffect="non-scaling-stroke"
                />
            ))}
            <path d={areaPath(values, BOX, frame)} fill={`url(#${fillId})`} />
            <path
                d={linePath(values, BOX, frame)}
                className="signature-line"
                strokeWidth={1.75}
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
