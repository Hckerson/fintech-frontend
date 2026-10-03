import { describe, expect, it } from "vitest";
import { SIGN_UP_SEED } from "@/lib/data/admin/stats";
import { seedSeries, seedTotal } from "./stats-store";

const NOW = new Date("2026-10-03T09:30:00.000Z");

describe("the seeded sign-up series", () => {
    it("ends on the current UTC period, oldest first", () => {
        expect(seedSeries("month", NOW).points.at(-1)?.key).toBe("2026-10");
        expect(seedSeries("month", NOW).points.at(0)?.key).toBe("2025-11");
        expect(seedSeries("day", NOW).points.at(-1)?.key).toBe("2026-10-03");
        expect(seedSeries("year", NOW).points.at(-1)?.key).toBe("2026");
    });

    it("leaves the current period open", () => {
        expect(seedSeries("month", NOW).end).toBe("2026-11-01T00:00:00.000Z");
    });
});

describe("the seeded total", () => {
    it("is the current bucket with the one before it as the comparison", () => {
        const total = seedTotal("month", NOW);

        expect(total.total).toBe(SIGN_UP_SEED.month.at(-1));
        expect(total.previousTotal).toBe(SIGN_UP_SEED.month.at(-2));
        expect(total.start).toBe("2026-10-01T00:00:00.000Z");
    });
});
