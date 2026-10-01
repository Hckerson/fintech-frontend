import { describe, expect, it } from "vitest";
import { periodDelta } from "./delta";

describe("change against the previous period", () => {
    it("gives no comparison when the previous period was zero", () => {
        expect(periodDelta(12, 0)).toBeNull();
    });

    it("reports an unchanged total as flat", () => {
        expect(periodDelta(8, 8)).toEqual({ direction: "flat", tenths: 0 });
    });

    it("rounds half away from zero to one decimal", () => {
        expect(periodDelta(25, 24)).toEqual({ direction: "up", tenths: 42 });
        expect(periodDelta(1001, 2000)).toEqual({
            direction: "down",
            tenths: 500,
        });
    });

    it("keeps the direction of a change that rounds to nothing", () => {
        expect(periodDelta(10_001, 10_000)).toEqual({
            direction: "up",
            tenths: 0,
        });
    });
});
