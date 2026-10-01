import { describe, expect, it } from "vitest";
import type { AdminUserSeries } from "@/lib/types";
import { bucketLabel, inProgress, seriesView } from "./admin-stats";

const series = (points: AdminUserSeries["points"]): AdminUserSeries => ({
    period: "month",
    start: "2025-11-01T00:00:00.000Z",
    end: "2026-11-01T00:00:00.000Z",
    asOf: "2026-10-01T09:00:00.000Z",
    points,
});

const soFar = (value: string) => `${value} so far`;

describe("labelling a bucket", () => {
    it("reads the backend key as a UTC period", () => {
        expect(bucketLabel("day", "2026-09-25")).toBe("25 Sept");
        expect(bucketLabel("month", "2026-09")).toBe("Sept 2026");
        expect(bucketLabel("year", "2026")).toBe("2026");
    });

    it("falls back to the key it cannot read", () => {
        expect(bucketLabel("day", "not-a-date")).toBe("not-a-date");
    });
});

describe("preparing the series", () => {
    it("leaves out empty periods before the first user instead of drawing zero", () => {
        const view = seriesView(
            series([
                { key: "2025-11", value: 0 },
                { key: "2025-12", value: 0 },
                { key: "2026-01", value: 4 },
                { key: "2026-02", value: 0 },
            ]),
            "2026-01-15T00:00:00.000Z",
            soFar,
        );

        expect(view.omitted).toBe(2);
        expect(view.points.map((point) => point.value)).toEqual([4, 0]);
        expect(view.total).toBe(4);
    });

    it("never hides a period that has sign-ups", () => {
        const view = seriesView(
            series([
                { key: "2025-11", value: 3 },
                { key: "2025-12", value: 0 },
            ]),
            "2026-06-01T00:00:00.000Z",
            soFar,
        );

        expect(view.omitted).toBe(0);
        expect(view.points).toHaveLength(2);
    });

    it("marks the period still in progress as partial", () => {
        const view = seriesView(
            series([
                { key: "2026-09", value: 5 },
                { key: "2026-10", value: 2 },
            ]),
            "2025-01-01T00:00:00.000Z",
            soFar,
        );

        expect(view.partial).toBe("Oct 2026");
        expect(view.points.at(-1)?.display).toBe("2 so far");
        expect(view.peak?.value).toBe(5);
    });

    it("reports a range wholly before the first user as having no points", () => {
        const view = seriesView(
            series([{ key: "2025-11", value: 0 }]),
            "2026-06-01T00:00:00.000Z",
            soFar,
        );

        expect(view.points).toHaveLength(0);
        expect(view.omitted).toBe(1);
    });
});

describe("a period in progress", () => {
    it("is one whose end is after the time the figure was true", () => {
        expect(
            inProgress("2026-11-01T00:00:00.000Z", "2026-10-01T09:00:00.000Z"),
        ).toBe(true);
        expect(
            inProgress("2026-10-01T00:00:00.000Z", "2026-10-01T09:00:00.000Z"),
        ).toBe(false);
    });
});
