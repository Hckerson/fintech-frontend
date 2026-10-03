import {
    CLOSED_ACCOUNT_STATE,
    FROZEN_ACCOUNT_STATE,
} from "@/lib/dashboard/constants";
import type { Account, CashFlowSeries, CashPosition, Money } from "@/lib/types";

const ZERO = BigInt(0);

export const closingBalances = (
    { points, currency }: CashFlowSeries,
    current: bigint,
): CashPosition["trend"] => {
    let closing = current;

    return [...points]
        .reverse()
        .map(({ periodStart, net }) => {
            const point = {
                date: periodStart,
                closing: { currency, amountMinor: closing.toString() },
            };
            closing -= BigInt(net.amountMinor);
            return point;
        })
        .reverse();
};

export const cashPositions = (
    accounts: readonly Account[],
    series: readonly (CashFlowSeries | null)[],
    asOf: string,
): CashPosition[] => {
    const held = accounts.filter(({ state }) => state !== CLOSED_ACCOUNT_STATE);

    return [...new Set(held.map(({ currency }) => currency))].map(
        (currency) => {
            const inCurrency = held.filter(
                (account) => account.currency === currency,
            );
            const total = (pick: (account: Account) => Money) =>
                inCurrency.reduce(
                    (sum, account) => sum + BigInt(pick(account).amountMinor),
                    ZERO,
                );
            const current = total((account) => account.current);
            const flow = series.find((entry) => entry?.currency === currency);

            return {
                currency,
                available: {
                    currency,
                    amountMinor: total(
                        (account) => account.available,
                    ).toString(),
                },
                current: { currency, amountMinor: current.toString() },
                netToday: flow?.points.at(-1)?.net ?? null,
                trend: flow ? closingBalances(flow, current) : [],
                asOf,
                includesFrozen: inCurrency.some(
                    ({ state }) => state === FROZEN_ACCOUNT_STATE,
                ),
            };
        },
    );
};
