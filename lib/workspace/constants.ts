export const APP_NAME = "Ledgerline";

export const WORKSPACE_COOKIE = "workspace";

export const SESSION_CHANNEL = "ledgerline-session";

export const DEFAULT_TIME_ZONE = "UTC";

export const ONBOARDING_ROUTE = "/onboarding";

export const ACCOUNTS_ROUTE = "/accounts";

export const TRANSACTIONS_ROUTE = "/transactions";

export const COUNTERPARTIES_ROUTE = "/counterparties";

export const INSIGHTS_ROUTE = "/insights";

export const INSIGHTS_COMPARE_ROUTE = `${INSIGHTS_ROUTE}/compare`;

export const STATEMENTS_ROUTE = "/statements";

export const EXPORTS_ROUTE = "/exports";

export const MESSAGES_ROUTE = "/messages";

export const SETTINGS_ROUTE = "/settings";

export const WORKSPACE_ROUTE_PREFIXES = [
    ONBOARDING_ROUTE,
    ACCOUNTS_ROUTE,
    TRANSACTIONS_ROUTE,
    COUNTERPARTIES_ROUTE,
    INSIGHTS_ROUTE,
    STATEMENTS_ROUTE,
    EXPORTS_ROUTE,
    MESSAGES_ROUTE,
    SETTINGS_ROUTE,
] as const;

export const accountRoute = (accountId: string) =>
    `${ACCOUNTS_ROUTE}/${accountId}`;

export const transactionRoute = (transactionId: string) =>
    `${TRANSACTIONS_ROUTE}/${transactionId}`;

export const pendingTransactionsRoute = (accountId: string) =>
    `${TRANSACTIONS_ROUTE}?${new URLSearchParams({ status: "pending", account: accountId })}`;

export const onboardingStepRoute = (step: string | null) =>
    step
        ? `${ONBOARDING_ROUTE}?${new URLSearchParams({ step })}`
        : ONBOARDING_ROUTE;

export const BALANCE_STALE_AFTER_MS = 15 * 60 * 1_000;

export const NOTIFICATION_POLL_INTERVAL_MS = 60_000;

export const NOTIFICATION_COUNT_CAP = 99;

export const WORKSPACE_SEARCH_THRESHOLD = 10;

export const MINUTE_MS = 60_000;

export const PALETTE_SHORTCUT = { key: "k", focusKey: "/" } as const;
