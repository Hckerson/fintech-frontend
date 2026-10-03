import { SEED_TRANSFER_ACCOUNTS } from "@/lib/data/payments/accounts";
import type { Account } from "@/lib/types";

export const ACCOUNTS_SEED: readonly Account[] = [
    ...SEED_TRANSFER_ACCOUNTS,
    {
        id: "acc_legacy",
        name: "Legacy current",
        kind: "OPERATING",
        last4: "8841",
        currency: "GBP",
        available: { amountMinor: "0", currency: "GBP" },
        current: { amountMinor: "0", currency: "GBP" },
        state: "CLOSED",
        openedAt: "2023-06-12T09:00:00.000Z",
    },
];

export const ACCOUNT_NUMBERS_SEED: Record<string, string> = {
    acc_operating: "20483975",
    acc_reserve: "71561182",
    acc_euro: "55906604",
    acc_savings: "34120457",
    acc_legacy: "60278841",
};

export const MEMBER_SEED = {
    fullName: "Ada Kowalski",
    createdAt: "2025-03-03T09:00:00.000Z",
} as const;
