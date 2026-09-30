import { describe, expect, it } from "vitest";
import type {
    AccountResponseDto,
    CashFlowSeriesResponseDto,
} from "@/lib/contract/schemas";
import { runwayDefaults } from "./runway-defaults";

const NOW = new Date("2026-09-30T00:00:00.000Z");
const gbp = (amountMinor: string) => ({ amountMinor, currency: "GBP" });

const account = (
    overrides: Partial<AccountResponseDto>,
): AccountResponseDto => ({
    id: "acc_1",
    name: "Operating",
    kind: "OPERATING",
    last4: "4821",
    currency: "GBP",
    available: gbp("100000"),
    current: gbp("100000"),
    state: "OPEN",
    openedAt: "2025-06-01T00:00:00.000Z",
    ...overrides,
});

const month = (periodStart: string, inflow: string, outflow: string) => ({
    periodStart,
    inflow: gbp(inflow),
    outflow: gbp(outflow),
    net: gbp(String(BigInt(inflow) - BigInt(outflow))),
});

const cashFlow: CashFlowSeriesResponseDto = {
    range: "12m",
    granularity: "month",
    currency: "GBP",
    points: [
        month("2026-05-01T00:00:00.000Z", "999", "999"),
        month("2026-06-01T00:00:00.000Z", "300", "900"),
        month("2026-07-01T00:00:00.000Z", "300", "600"),
        month("2026-08-01T00:00:00.000Z", "300", "300"),
        month("2026-09-01T00:00:00.000Z", "5", "5"),
    ],
    totals: { inflow: gbp("0"), outflow: gbp("0"), net: gbp("0") },
};

describe("runwayDefaults", () => {
    it("averages the last three full months and leaves out the current one", () => {
        expect(runwayDefaults([account({})], cashFlow, NOW)).toMatchObject({
            burnMinor: BigInt(600),
            inflowMinor: BigInt(300),
        });
    });

    it("adds available cash across open accounts in the series currency only", () => {
        const accounts = [
            account({}),
            account({ id: "acc_2", available: gbp("50") }),
            account({ id: "acc_3", state: "FROZEN" }),
            account({
                id: "acc_4",
                currency: "EUR",
                available: { amountMinor: "7", currency: "EUR" },
            }),
        ];

        expect(runwayDefaults(accounts, cashFlow, NOW).cashMinor).toBe(
            BigInt(100_050),
        );
    });

    it("offers no averages with under three months of history", () => {
        const recent = account({ openedAt: "2026-08-10T00:00:00.000Z" });

        expect(runwayDefaults([recent], cashFlow, NOW)).toMatchObject({
            burnMinor: null,
            inflowMinor: null,
        });
    });
});
