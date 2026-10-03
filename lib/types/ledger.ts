import type { z } from "zod";
import type {
    ACCOUNT_SORT_KEYS,
    ACCOUNT_STATE_FILTERS,
    ACCOUNTS_PARAMS,
    SORT_DIRECTIONS,
} from "@/lib/ledger/constants";
import type {
    accountNumberSchema,
    accountsSearchParamsSchema,
} from "@/lib/validations/accounts";
import type { Account } from "./dashboard";

export type AccountSortKey = (typeof ACCOUNT_SORT_KEYS)[number];

export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export type AccountStateFilter = keyof typeof ACCOUNT_STATE_FILTERS;

export type AccountsQuery = z.infer<typeof accountsSearchParamsSchema>;

export type AccountsParams = AccountsQuery & {
    dropped: (typeof ACCOUNTS_PARAMS)[number][];
};

export interface AccountGroup {
    currency: string;
    accounts: Account[];
}

export type AccountNumber = z.infer<typeof accountNumberSchema>;

export interface AccountReveal {
    shown: AccountNumber | null;
    warning: boolean;
    pendingId: string | null;
    failedId: string | null;
    challenge: string | null;
    reveal: (accountId: string) => void;
    hide: () => void;
    extend: () => void;
    settleChallenge: (granted: boolean) => void;
}
