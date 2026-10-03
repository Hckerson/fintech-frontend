import type { CashFlowQuery, StatsPeriod, TransactionQuery } from "@/lib/types";

export const queryKeys = {
    me: () => ["me"],
    workspaces: () => ["workspaces"],
    accounts: {
        all: (workspaceId: string) => ["accounts", workspaceId],
        cashPosition: (workspaceId: string) => [
            "accounts",
            workspaceId,
            "cash-position",
        ],
    },
    cashFlow: (workspaceId: string, query: CashFlowQuery) => [
        "cash-flow",
        workspaceId,
        query,
    ],
    transactions: {
        all: (workspaceId: string) => ["transactions", workspaceId],
        list: (workspaceId: string, query: TransactionQuery) => [
            "transactions",
            workspaceId,
            "list",
            query,
        ],
    },
    exports: { all: (workspaceId: string) => ["exports", workspaceId] },
    verificationCase: (workspaceId: string) => [
        "verification-case",
        workspaceId,
    ],
    notifications: {
        count: (workspaceId: string) => ["notifications", workspaceId, "count"],
    },
    payees: {
        all: (workspaceId: string) => ["payees", workspaceId],
        list: (workspaceId: string, search: string, status = "all") => [
            "payees",
            workspaceId,
            "list",
            search,
            status,
        ],
    },
    transfers: {
        options: (workspaceId: string) => ["transfers", workspaceId, "options"],
    },
    admin: {
        users: () => ["admin", "users"],
        stats: () => ["admin", "stats"],
        notificationCount: () => ["admin", "notifications", "count"],
        userTotal: (period: StatsPeriod) => [
            "admin",
            "stats",
            "users",
            "total",
            period,
        ],
        userSeries: (period: StatsPeriod) => [
            "admin",
            "stats",
            "users",
            "series",
            period,
        ],
    },
};
