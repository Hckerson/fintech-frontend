import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { runway } from "./runway";

const FROM = new Date("2026-09-30T00:00:00.000Z");
const HORIZON = 36;
const money = fc.bigInt({ min: BigInt(0), max: BigInt(10) ** BigInt(12) });

describe("runway", () => {
    it("counts whole months the cash covers, rounded down", () => {
        fc.assert(
            fc.property(money, money, money, (cash, burn, inflow) => {
                const net = burn - inflow;
                const { months } = runway(
                    {
                        cashMinor: cash,
                        monthlyBurnMinor: burn,
                        monthlyInflowMinor: inflow,
                    },
                    FROM,
                    HORIZON,
                );
                if (net <= BigInt(0)) return months === null;
                const whole = BigInt(months ?? -1);
                return whole * net <= cash && cash < (whole + BigInt(1)) * net;
            }),
        );
    });

    it("never projects a negative balance and only falls while burning", () => {
        fc.assert(
            fc.property(money, money, money, (cash, burn, inflow) => {
                const { series } = runway(
                    {
                        cashMinor: cash,
                        monthlyBurnMinor: burn,
                        monthlyInflowMinor: inflow,
                    },
                    FROM,
                    HORIZON,
                );
                return series.every(
                    (point, index) =>
                        point.balanceMinor >= BigInt(0) &&
                        (burn <= inflow ||
                            index === 0 ||
                            point.balanceMinor <=
                                series[index - 1].balanceMinor),
                );
            }),
        );
    });

    it("runs out inside the month after the last full one", () => {
        const result = runway(
            {
                cashMinor: BigInt(100_000),
                monthlyBurnMinor: BigInt(40_000),
                monthlyInflowMinor: BigInt(0),
            },
            FROM,
            HORIZON,
        );

        expect(result.months).toBe(2);
        expect(result.runsOutOn?.toISOString().slice(0, 10)).toBe("2026-12-15");
        expect(result.series.at(-1)?.balanceMinor).toBe(BigInt(0));
    });

    it("reports no run-out date when inflow covers spending", () => {
        const result = runway(
            {
                cashMinor: BigInt(5_000),
                monthlyBurnMinor: BigInt(1_000),
                monthlyInflowMinor: BigInt(1_000),
            },
            FROM,
            HORIZON,
        );

        expect(result).toMatchObject({ months: null, runsOutOn: null });
        expect(result.series).toHaveLength(HORIZON + 1);
    });

    it("treats an overdrawn balance as nothing left", () => {
        expect(
            runway(
                {
                    cashMinor: BigInt(-500),
                    monthlyBurnMinor: BigInt(100),
                    monthlyInflowMinor: BigInt(0),
                },
                FROM,
                HORIZON,
            ).months,
        ).toBe(0);
    });
});

describe("runway beyond any calendar date", () => {
    it("keeps the month count and drops the date", () => {
        const result = runway(
            {
                cashMinor: BigInt(10) ** BigInt(15),
                monthlyBurnMinor: BigInt(1),
                monthlyInflowMinor: BigInt(0),
            },
            FROM,
            HORIZON,
        );

        expect(result.months).toBe(10 ** 15);
        expect(result.runsOutOn).toBeNull();
    });
});

describe("runway months at the end of a month", () => {
    it("steps through every calendar month without skipping February", () => {
        const { series } = runway(
            {
                cashMinor: BigInt(1_000),
                monthlyBurnMinor: BigInt(1),
                monthlyInflowMinor: BigInt(0),
            },
            new Date("2026-01-31T00:00:00.000Z"),
            3,
        );

        expect(
            series.map((point) => point.month.toISOString().slice(0, 10)),
        ).toEqual(["2026-01-31", "2026-02-28", "2026-03-31", "2026-04-30"]);
    });
});
