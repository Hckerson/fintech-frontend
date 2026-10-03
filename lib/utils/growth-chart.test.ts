import { describe, expect, it } from "vitest";
import { nearestIndex, niceCeiling, plotSpots } from "./growth-chart";

const BOX = { width: 1000, height: 300, pad: 20, padX: 50 };

describe("the axis ceiling", () => {
    it("rounds up to a readable step", () => {
        expect(niceCeiling(1098, 4)).toBe(1200);
        expect(niceCeiling(52, 4)).toBe(60);
        expect(niceCeiling(8452, 4)).toBe(10000);
    });

    it("never drops below one whole unit per step", () => {
        expect(niceCeiling(2, 4)).toBe(4);
        expect(niceCeiling(0, 4)).toBe(4);
    });
});

describe("placing points", () => {
    it("spans the padded width and puts zero on the floor", () => {
        const spots = plotSpots([0, 50, 100], BOX, 100);

        expect(spots[0].left).toBeCloseTo(0.05);
        expect(spots[2].left).toBeCloseTo(0.95);
        expect(spots[0].top).toBeCloseTo(280 / 300);
        expect(spots[2].top).toBeCloseTo(20 / 300);
    });
});

describe("finding the point under the pointer", () => {
    it("snaps to the nearest point and clamps at the edges", () => {
        expect(nearestIndex(0, 3, BOX)).toBe(0);
        expect(nearestIndex(0.5, 3, BOX)).toBe(1);
        expect(nearestIndex(1, 3, BOX)).toBe(2);
    });
});
