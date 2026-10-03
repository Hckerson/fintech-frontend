import { DEFAULT_LOCALE } from "@/lib/constants";
import { ACCOUNT_STATE_FILTERS } from "@/lib/ledger/constants";
import type {
    Account,
    AccountGroup,
    AccountSortKey,
    AccountsQuery,
} from "@/lib/types";

const text = new Intl.Collator(DEFAULT_LOCALE);
const ZERO = BigInt(0);

const byMinor = (a: string, b: string) => {
    const gap = BigInt(a) - BigInt(b);
    return gap > ZERO ? 1 : gap < ZERO ? -1 : 0;
};

const COMPARE: Record<AccountSortKey, (a: Account, b: Account) => number> = {
    name: (a, b) => text.compare(a.name, b.name),
    state: (a, b) => text.compare(a.state, b.state),
    current: (a, b) => byMinor(a.current.amountMinor, b.current.amountMinor),
    available: (a, b) =>
        byMinor(a.available.amountMinor, b.available.amountMinor),
};

export const accountGroups = (
    accounts: readonly Account[],
    { state, currency, sort, dir }: AccountsQuery,
): AccountGroup[] => {
    const turn = dir === "asc" ? 1 : -1;
    const shown = accounts.filter(
        (account) =>
            (!state || account.state === ACCOUNT_STATE_FILTERS[state]) &&
            (!currency || account.currency === currency),
    );

    return [...new Set(shown.map((account) => account.currency))]
        .sort(text.compare)
        .map((code) => ({
            currency: code,
            accounts: shown
                .filter((account) => account.currency === code)
                .sort(
                    (a, b) =>
                        turn * COMPARE[sort](a, b) || text.compare(a.id, b.id),
                ),
        }));
};

export const accountCurrencies = (accounts: readonly Account[]) =>
    [...new Set(accounts.map(({ currency }) => currency))].sort(text.compare);
