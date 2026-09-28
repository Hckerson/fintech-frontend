import type { ChartBox, SeriesFrame } from "@/lib/types";

type Point = readonly [number, number];

const SMOOTHING = 6;

export const frameOf = (series: readonly number[]): SeriesFrame => ({
    min: Math.min(...series),
    max: Math.max(...series),
    start: 0,
    total: series.length,
});

const project = (series: readonly number[], box: ChartBox, frame: SeriesFrame): Point[] => {
    const spanX = box.width - box.pad * 2;
    const spanY = box.height - box.pad * 2;
    const range = frame.max - frame.min || 1;
    return series.map((value, index) => [
        box.pad + ((frame.start + index) / Math.max(frame.total - 1, 1)) * spanX,
        box.pad + (1 - (value - frame.min) / range) * spanY,
    ]);
};

const format = (point: Point): string => `${point[0].toFixed(2)} ${point[1].toFixed(2)}`;

export const linePath = (series: readonly number[], box: ChartBox, frame: SeriesFrame = frameOf(series)): string => {
    const points = project(series, box, frame);
    const segments = points.slice(1).map((current, offset) => {
        const index = offset + 1;
        const before = points[index - 2] ?? points[index - 1];
        const previous = points[index - 1];
        const after = points[index + 1] ?? current;
        const first: Point = [
            previous[0] + (current[0] - before[0]) / SMOOTHING,
            previous[1] + (current[1] - before[1]) / SMOOTHING,
        ];
        const second: Point = [
            current[0] - (after[0] - previous[0]) / SMOOTHING,
            current[1] - (after[1] - previous[1]) / SMOOTHING,
        ];
        return `C ${format(first)} ${format(second)} ${format(current)}`;
    });
    return `M ${format(points[0])} ${segments.join(" ")}`;
};

export const areaPath = (series: readonly number[], box: ChartBox, frame: SeriesFrame = frameOf(series)): string => {
    const points = project(series, box, frame);
    const floor = box.height - box.pad;
    return `${linePath(series, box, frame)} L ${format([points[points.length - 1][0], floor])} L ${format([points[0][0], floor])} Z`;
};

export const bandPath = (
    upper: readonly number[],
    lower: readonly number[],
    box: ChartBox,
    frame: SeriesFrame,
): string => {
    const edge = [...project(upper, box, frame), ...project(lower, box, frame).reverse()];
    return `M ${edge.map(format).join(" L ")} Z`;
};

export const lastPoint = (series: readonly number[], box: ChartBox, frame: SeriesFrame = frameOf(series)): Point => {
    const points = project(series, box, frame);
    return points[points.length - 1];
};
