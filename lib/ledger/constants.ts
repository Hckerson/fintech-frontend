export const ACCOUNT_SORT_KEYS = [
    "name",
    "state",
    "current",
    "available",
] as const;

export const SORT_DIRECTIONS = ["asc", "desc"] as const;

export const DEFAULT_ACCOUNT_SORT = { sort: "available", dir: "desc" } as const;

export const ACCOUNT_STATE_FILTERS = {
    active: "OPEN",
    frozen: "FROZEN",
    closed: "CLOSED",
} as const;

export const ACCOUNTS_PARAMS = ["state", "currency", "sort", "dir"] as const;

export const COPIED_MS = 2_000;

export const REVEAL_PURPOSE = "account_reveal";

export const REVEAL_TIMEOUT_MS = 30_000;

export const REVEAL_WARNING_MS = 10_000;

export const ACCOUNT_NUMBER_GROUP = 4;
