import type { Delta } from "@/lib/types";

const TENTHS_PER_WHOLE = 1_000;

export const periodDelta = (current: number, previous: number): Delta | null => {
    if (previous <= 0) return null;

    const change = current - previous;
    const tenths = Math.floor(
        (Math.abs(change) * 2 * TENTHS_PER_WHOLE + previous) / (2 * previous),
    );

    return {
        direction: change === 0 ? "flat" : change > 0 ? "up" : "down",
        tenths,
    };
};

export const deltaRatio = (tenths: number) => tenths / TENTHS_PER_WHOLE;
