import { describe, expect, it } from "vitest";
import type { Account, CashFlowSeries } from "@/lib/types";
import { cashPositions } from "./cash-position";
import { trendOf } from "./trend";

const account = (
    id: string,
    currency: string,
    available: string,
    current: string,
    state: Account["state"] = "OPEN",
): Account => ({
    id,
    name: id,
    kind: "OPERATING",
    last4: "0000",
    currency,
    available: { amountMinor: available, currency },
    current: { amountMinor: current, currency },
    state,
    openedAt: "2026-01-01T00:00:00.000Z",
});

const money = (amountMinor: string) => ({ amountMinor, currency: "GBP" });

const series: CashFlowSeries = {
    range: "30d",
    granularity: "day",
    currency: "GBP",
    points: [
        {
            periodStart: "2026-09-29T00:00:00.000Z",
            inflow: money("500"),
            outflow: money("0"),
            net: money("500"),
        },
        {
            periodStart: "2026-09-30T00:00:00.000Z",
            inflow: money("0"),
            outflow: money("200"),
            net: money("-200"),
        },
    ],
    totals: { inflow: money("500"), outflow: money("200"), net: money("300") },
};

const AS_OF = "2026-10-01T09:00:00.000Z";

describe("cashPositions", () => {
    const positions = cashPositions(
        [
            account("a", "GBP", "900", "1000"),
            account("b", "GBP", "90000000000000000001", "1"),
            account("c", "EUR", "50", "60", "FROZEN"),
            account("d", "GBP", "777", "777", "CLOSED"),
        ],
        [series, null],
        AS_OF,
    );

    it("totals each currency separately and exactly, without closed accounts", () => {
        expect(positions.map(({ currency }) => currency)).toEqual([
            "GBP",
            "EUR",
        ]);
        expect(positions[0].available.amountMinor).toBe("90000000000000000901");
        expect(positions[0].current.amountMinor).toBe("1001");
    });

    it("walks the closing balance back from the current balance", () => {
        expect(
            positions[0].trend.map(({ closing }) => closing.amountMinor),
        ).toEqual(["1201", "1001"]);
        expect(positions[0].netToday).toEqual(money("-200"));
    });

    it("withholds movement and trend when the series is missing, never zero", () => {
        expect(positions[1].netToday).toBeNull();
        expect(positions[1].trend).toEqual([]);
        expect(positions[1].includesFrozen).toBe(true);
    });

    it("carries the backend's time for every total", () => {
        expect(positions.every(({ asOf }) => asOf === AS_OF)).toBe(true);
    });

    it("reads the direction and size of the trend", () => {
        expect(trendOf(positions[0].trend)).toEqual({
            direction: "down",
            ratio: 0.1665,
        });
        expect(trendOf([])).toBeNull();
    });
});
