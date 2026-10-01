import { CLOSED_ACCOUNT_STATE } from "@/lib/dashboard/constants";
import type { Account } from "@/lib/types";

export const heldAccounts = (accounts: readonly Account[]) =>
    accounts.filter(({ state }) => state !== CLOSED_ACCOUNT_STATE);

export const heldCurrencies = (accounts: readonly Account[]) => [
    ...new Set(heldAccounts(accounts).map(({ currency }) => currency)),
];

export const listedAccounts = (accounts: readonly Account[], limit: number) => {
    const currencies = heldCurrencies(accounts);
    const sorted = heldAccounts(accounts).sort((a, b) => {
        if (a.currency !== b.currency) {
            return (
                currencies.indexOf(a.currency) - currencies.indexOf(b.currency)
            );
        }
        const gap =
            BigInt(b.available.amountMinor) - BigInt(a.available.amountMinor);
        return gap > BigInt(0) ? 1 : gap < BigInt(0) ? -1 : 0;
    });

    return {
        listed: sorted.slice(0, limit),
        hidden: Math.max(sorted.length - limit, 0),
    };
};
