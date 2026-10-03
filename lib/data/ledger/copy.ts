import type {
    AccountSortKey,
    AccountStateFilter,
    SortDirection,
} from "@/lib/types";

const plural = (count: number) =>
    `${count.toLocaleString()} ${count === 1 ? "account" : "accounts"}`;

export const ACCOUNTS_COPY = {
    panel: "All accounts",
    count: plural,
    stateLabel: "State",
    currencyLabel: "Currency",
    all: "All",
    states: {
        active: "Active",
        frozen: "Frozen",
        closed: "Closed",
    } satisfies Record<AccountStateFilter, string>,
    columns: {
        name: "Account",
        state: "Status",
        current: "Current balance",
        available: "Available balance",
    } satisfies Record<AccountSortKey, string>,
    directions: {
        asc: "ascending",
        desc: "descending",
    } satisfies Record<SortDirection, string>,
    sortBy: (column: string) => `Sort by ${column}`,
    sorted: (column: string, direction: string, count: number) =>
        `Sorted by ${column}, ${direction}. ${plural(count)}.`,
    group: (currency: string, count: number) =>
        `${currency} · ${plural(count)}`,
    current: "Current",
    copyNumber: (name: string) => `Copy the masked number for ${name}`,
    masked: (name: string, last4: string) => `${name} ••${last4}`,
    copied: "Copied",
    copyFailed: "Copy failed. Select and copy it manually.",
    reveal: (name: string) => `Show the full account number for ${name}`,
    hide: (name: string) => `Hide the account number for ${name}`,
    copyFull: (name: string) => `Copy the full account number for ${name}`,
    revealed: (seconds: number) =>
        `Account number shown. It will be hidden in ${seconds} seconds.`,
    hiding: (seconds: number) => `Hides in ${seconds} seconds.`,
    keep: "Keep showing",
    hidden: "Account number hidden.",
    revealFailed: "The number couldn't be shown. Nothing was revealed.",
    clear: "Clear filters",
    continue: "Continue verification",
    dropped: (names: string) =>
        `The link had a setting we couldn't use (${names}), so the default is shown.`,
    closedNote: "Closed accounts stay listed with their history.",
} as const;
