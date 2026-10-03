"use client";
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { FlowLabels, FlowPoint } from "@/lib/types";

interface Props {
    points: FlowPoint[];
    labels: FlowLabels;
    formatTick: (value: number) => string;
}

const AXIS = {
    stroke: "var(--colors-text-muted)",
    fontSize: 11,
    tickLine: false,
    axisLine: false,
};

const BAR = { stackId: "flow", isAnimationActive: false, maxBarSize: 10 };

export default function FlowChartPlot({ points, labels, formatTick }: Props) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={points}
                stackOffset="sign"
                margin={{ top: 8, right: 24, bottom: 0, left: 0 }}
                accessibilityLayer
            >
                <CartesianGrid
                    vertical={false}
                    stroke="var(--colors-border-light)"
                />
                <XAxis dataKey="label" {...AXIS} minTickGap={24} />
                <YAxis
                    {...AXIS}
                    width={56}
                    tickCount={5}
                    tickFormatter={formatTick}
                />
                <ReferenceLine y={0} stroke="var(--colors-border-dark)" />
                <Tooltip
                    cursor={{ fill: "var(--colors-background-muted)" }}
                    content={({ active, payload }) => {
                        const point: FlowPoint | undefined =
                            payload?.[0]?.payload;
                        return active && point ? (
                            <dl className="border-border-dark bg-background-alt grid grid-cols-[auto_auto] gap-x-4 gap-y-1 rounded-lg border px-3 py-2 text-xs">
                                <dt className="text-text col-span-2 font-medium">
                                    {point.label}
                                </dt>
                                <dt className="text-text-muted">
                                    {labels.inflow}
                                </dt>
                                <dd className="text-text text-right tabular-nums">
                                    {point.display.inflow}
                                </dd>
                                <dt className="text-text-muted">
                                    {labels.outflow}
                                </dt>
                                <dd className="text-text text-right tabular-nums">
                                    {point.display.outflow}
                                </dd>
                                <dt className="text-text-muted">
                                    {labels.net}
                                </dt>
                                <dd className="text-text text-right tabular-nums">
                                    {point.display.net}
                                </dd>
                            </dl>
                        ) : null;
                    }}
                />
                <Bar
                    dataKey="inflow"
                    fill="var(--colors-accent)"
                    radius={[2, 2, 0, 0]}
                    {...BAR}
                />
                <Bar
                    dataKey="outflow"
                    fill="var(--colors-text-muted)"
                    fillOpacity={0.45}
                    radius={[2, 2, 0, 0]}
                    {...BAR}
                />
                <Line
                    type="linear"
                    dataKey="net"
                    stroke="var(--colors-text-secondary)"
                    strokeWidth={1.25}
                    dot={false}
                    isAnimationActive={false}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}
