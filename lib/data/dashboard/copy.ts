import type {
    Account,
    CashFlowRange,
    DashboardSectionKey,
    Trend,
} from "@/lib/types";
import type { PendingSource } from "@/lib/types";
import { TREND_DAYS } from "@/lib/dashboard/constants";

const plural = (count: number, one: string, many: string) =>
    `${count.toLocaleString()} ${count === 1 ? one : many}`;

export const DASHBOARD_COPY = {
    sections: {
        verification: "Business verification",
        verificationNotice: "Business verification",
        cashPosition: "Cash position",
        accountSummary: "Accounts",
        recentActivity: "Recent activity",
        pendingItems: "Needs attention",
        cashFlow: "Cash flow",
    } satisfies Record<DashboardSectionKey, string>,
    export: "New export",
    dropped: (names: string) =>
        `The link had a setting we couldn't use (${names}), so the default is shown.`,
    cash: {
        currency: "Currency",
        available: "Available balance",
        current: "Current balance",
        netToday: (zone: string) => `Net today (${zone})`,
        frozen: "Includes frozen accounts",
        excluded: "Closed accounts are excluded.",
        accounts: "View accounts",
        trendLabel: `${TREND_DAYS}-day change`,
        trend: ({ direction }: Trend, percent: string | null) =>
            direction === "flat"
                ? "No change"
                : `${direction === "up" ? "Up" : "Down"}${percent ? ` ${percent}` : ""}`,
        ceiling: "more than 999%",
        loaded: (count: number) =>
            `Cash position loaded for ${plural(count, "currency", "currencies")}.`,
    },
    accounts: {
        all: "All accounts",
        columns: {
            account: "Account",
            status: "Status",
            available: "Available",
        },
        ending: (last4: string) => `ending ${last4}`,
        available: "Available balance",
        kinds: {
            OPERATING: "Operating",
            RESERVE: "Reserve",
            SAVINGS: "Savings",
        } satisfies Record<Account["kind"], string>,
        more: (count: number) =>
            `${plural(count, "more account is", "more accounts are")} not listed here.`,
        loaded: (count: number) => `${plural(count, "account", "accounts")}.`,
    },
    activity: {
        all: "All transactions",
        filterLabel: "Show",
        filters: { all: "All", pending: "Pending" },
        nonePending: "Nothing is pending.",
        columns: {
            date: "Date",
            description: "Description",
            category: "Category",
            status: "Status",
            amount: "Amount",
        },
        uncategorised: "Uncategorised",
        provisional: "Provisional: this amount may change before it posts.",
        flagged: "Flagged",
        moneyIn: "Money in",
        moneyOut: "Money out",
        attachments: "Has attachments",
        loaded: (count: number) =>
            `${plural(count, "recent transaction", "recent transactions")}.`,
    },
    pending: {
        transactions: (count: number, account: string) =>
            `${plural(count, "pending transaction", "pending transactions")} on ${account}`,
        provisional: "Provisional total",
        exportReady: "Export ready to download",
        exportFailed: "Export failed",
        verification: "Verification needs information",
        more: (count: number) =>
            `${plural(count, "more item", "more items")} not listed.`,
        loaded: (count: number) =>
            `${plural(count, "item needs", "items need")} attention.`,
        partial: "Some items couldn't load.",
        failed: {
            transactions: "Pending transactions couldn't load.",
            exports: "Exports couldn't load.",
            verification: "Verification status couldn't load.",
        } satisfies Record<PendingSource, string>,
    },
    cashFlow: {
        rangeLabel: "Range",
        currencyLabel: "Currency",
        ranges: {
            "30d": "30 days",
            "90d": "90 days",
            "12m": "12 months",
        } satisfies Record<CashFlowRange, string>,
        moneyIn: "Money in",
        moneyOut: "Money out",
        net: "Net",
        chartTitle: (currency: string) => `Cash flow in ${currency}`,
        summary: (range: string, currency: string, net: string) =>
            `Net ${net} over the last ${range} in ${currency}.`,
        basis: "Posted transactions only. The current period is still in progress.",
        partial: (label: string) => `${label} (so far)`,
        period: "Period",
        toggle: "Show the figures as a table",
        unplottable:
            "These amounts are too large to plot, so they are listed exactly instead.",
    },
} as const;
