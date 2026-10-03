import type { Account } from "@/lib/types";

const OPENED_AT = "2025-03-03T09:00:00.000Z";

const money = (amountMinor: string, currency: string) => ({
    amountMinor,
    currency,
});

export const SEED_STEP_UP_PASSWORD = "password123";

export const SEED_TRANSFER_ACCOUNTS: readonly Account[] = [
    {
        id: "acc_operating",
        name: "Operating",
        kind: "OPERATING",
        last4: "3975",
        currency: "GBP",
        available: money("10480800", "GBP"),
        current: money("10612450", "GBP"),
        state: "OPEN",
        openedAt: OPENED_AT,
    },
    {
        id: "acc_reserve",
        name: "Tax reserve",
        kind: "RESERVE",
        last4: "1182",
        currency: "GBP",
        available: money("4250000", "GBP"),
        current: money("4250000", "GBP"),
        state: "OPEN",
        openedAt: OPENED_AT,
    },
    {
        id: "acc_euro",
        name: "Euro operating",
        kind: "OPERATING",
        last4: "6604",
        currency: "EUR",
        available: money("1875040", "EUR"),
        current: money("1875040", "EUR"),
        state: "OPEN",
        openedAt: OPENED_AT,
    },
    {
        id: "acc_savings",
        name: "Savings",
        kind: "SAVINGS",
        last4: "0457",
        currency: "GBP",
        available: money("9000000", "GBP"),
        current: money("9000000", "GBP"),
        state: "FROZEN",
        openedAt: OPENED_AT,
    },
];
