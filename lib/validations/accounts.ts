import { z } from "zod";
import {
    ACCOUNT_SORT_KEYS,
    ACCOUNT_STATE_FILTERS,
    ACCOUNTS_PARAMS,
    DEFAULT_ACCOUNT_SORT,
    SORT_DIRECTIONS,
} from "@/lib/ledger/constants";
import type { AccountsParams } from "@/lib/types";

const STATES = Object.keys(ACCOUNT_STATE_FILTERS) as [
    keyof typeof ACCOUNT_STATE_FILTERS,
    ...(keyof typeof ACCOUNT_STATE_FILTERS)[],
];

export const accountsSearchParamsSchema = z.object({
    state: z.enum(STATES).optional().catch(undefined),
    currency: z
        .string()
        .regex(/^[A-Z]{3}$/)
        .optional()
        .catch(undefined),
    sort: z.enum(ACCOUNT_SORT_KEYS).catch(DEFAULT_ACCOUNT_SORT.sort),
    dir: z.enum(SORT_DIRECTIONS).catch(DEFAULT_ACCOUNT_SORT.dir),
});

export const accountNumberSchema = z.object({
    accountId: z.string().min(1),
    number: z.string().regex(/^\d+$/),
});

export const parseAccountsParams = (
    raw: Record<string, string | string[] | undefined>,
): AccountsParams => {
    const params = accountsSearchParamsSchema.parse(raw);

    return {
        ...params,
        dropped: ACCOUNTS_PARAMS.filter(
            (name) => raw[name] !== undefined && raw[name] !== params[name],
        ),
    };
};
