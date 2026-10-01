import { SEED_ACCOUNT_NAMES } from "@/lib/data/dashboard/transactions";
import type { PendingGroup, Transaction } from "@/lib/types";

export const pendingGroups = (
    transactions: readonly Transaction[],
): PendingGroup[] => {
    const groups = new Map<string, Transaction[]>();

    for (const transaction of transactions) {
        if (transaction.status !== "pending") continue;
        const key = `${transaction.accountId}:${transaction.amount.currency}`;
        groups.set(key, [...(groups.get(key) ?? []), transaction]);
    }

    return [...groups.values()].map((held) => ({
        accountId: held[0].accountId,
        accountName: SEED_ACCOUNT_NAMES[held[0].accountId] ?? held[0].accountId,
        count: held.length,
        total: {
            currency: held[0].amount.currency,
            amountMinor: held
                .reduce(
                    (sum, { amount }) => sum + BigInt(amount.amountMinor),
                    BigInt(0),
                )
                .toString(),
        },
        oldestAt: held.map(({ createdAt }) => createdAt).sort()[0],
    }));
};
