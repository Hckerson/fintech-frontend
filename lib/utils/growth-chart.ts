import type { ChartBox } from "@/lib/types";

const NICE_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];

export const niceCeiling = (max: number, steps: number): number => {
    if (max <= 0) return steps;

    const rough = max / steps;
    const magnitude = 10 ** Math.floor(Math.log10(rough));
    const step =
        NICE_STEPS.map((factor) => factor * magnitude).find(
            (candidate) => candidate >= rough,
        ) ?? 10 * magnitude;

    return Math.max(1, Math.ceil(step)) * steps;
};

export const plotSpots = (
    values: readonly number[],
    box: ChartBox,
    max: number,
) => {
    const padX = box.padX ?? box.pad;
    const last = Math.max(values.length - 1, 1);

    return values.map((value, index) => ({
        left: (padX + (index / last) * (box.width - padX * 2)) / box.width,
        top:
            (box.pad + (1 - value / max) * (box.height - box.pad * 2)) /
            box.height,
    }));
};

export const nearestIndex = (ratio: number, count: number, box: ChartBox) => {
    const padX = (box.padX ?? box.pad) / box.width;
    const along = (ratio - padX) / (1 - padX * 2);

    return Math.min(count - 1, Math.max(0, Math.round(along * (count - 1))));
};
