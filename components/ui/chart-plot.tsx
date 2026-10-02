"use client";
import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { ChartMarker, ChartPoint } from "@/lib/types";

interface Props {
    points: ChartPoint[];
    marker?: ChartMarker;
    formatTick: (value: number) => string;
    wholeTicks?: boolean;
    variant?: "area" | "bar";
}

const AXIS = {
    stroke: "var(--colors-text-muted)",
    fontSize: 12,
    tickLine: false,
    axisLine: false,
};

export default function ChartPlot({
    points,
    marker,
    formatTick,
    wholeTicks = false,
    variant = "area",
}: Props) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={points}
                margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                accessibilityLayer
            >
                <defs>
                    <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--colors-accent)"
                            stopOpacity={0.35}
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--colors-accent)"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--colors-border)" />
                <XAxis dataKey="label" {...AXIS} minTickGap={24} />
                <YAxis
                    {...AXIS}
                    width={64}
                    tickFormatter={formatTick}
                    allowDecimals={!wholeTicks}
                />
                <Tooltip
                    cursor={
                        variant === "bar"
                            ? { fill: "var(--colors-background-muted)" }
                            : { stroke: "var(--colors-border-dark)" }
                    }
                    content={({ active, payload }) =>
                        active && payload?.[0] ? (
                            <div className="border-border bg-background-alt rounded-lg border px-3 py-2 text-xs">
                                <p className="text-text-muted">
                                    {payload[0].payload.label}
                                </p>
                                <p className="text-text font-mono tabular-nums">
                                    {payload[0].payload.display}
                                </p>
                            </div>
                        ) : null
                    }
                />
                {marker ? (
                    <ReferenceLine
                        x={marker.at}
                        stroke="var(--colors-highlight)"
                        strokeDasharray="4 4"
                        label={{
                            value: marker.label,
                            fill: "var(--colors-text-secondary)",
                            fontSize: 12,
                            position: "insideTopRight",
                        }}
                    />
                ) : null}
                {variant === "bar" ? (
                    <Bar
                        dataKey="value"
                        fill="var(--colors-accent)"
                        fillOpacity={0.85}
                        radius={[3, 3, 0, 0]}
                        maxBarSize={36}
                        isAnimationActive={false}
                    />
                ) : (
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--colors-accent)"
                        strokeWidth={2}
                        fill="url(#chart-fill)"
                        isAnimationActive={false}
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
