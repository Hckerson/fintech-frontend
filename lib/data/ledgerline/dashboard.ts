import type { ActivityEntry, Approval, CurrencyAccount, DashboardNavItem } from "@/lib/types";

export const DASHBOARD = {
    company: "Northwind Ltd",
    companyTag: "Sample company",
    userInitials: "AK",
    previewLabel: "Ledgerline dashboard preview for a sample company: cash position chart, account balances, payments awaiting approval and recent activity.",
    search: "Search payments, people, invoices",
    cashTitle: "Cash position",
    cashTotalMinor: 421856042,
    cashCurrency: "GBP",
    delta: "+3.8%",
    deltaLabel: "vs last month",
    ranges: ["1M", "3M", "1Y"],
    activeRange: "3M",
    accountsTitle: "Accounts",
    approvalsTitle: "Needs approval",
    approve: "Approve",
    activityTitle: "Recent activity",
} as const;

export const DASHBOARD_NAV: readonly DashboardNavItem[] = [
    { id: "home", label: "Home" },
    { id: "accounts", label: "Accounts" },
    { id: "payments", label: "Payments" },
    { id: "cards", label: "Cards" },
    { id: "treasury", label: "Treasury" },
    { id: "reports", label: "Reports" },
];

export const CASH_SERIES: readonly number[] = [
    3.61, 3.64, 3.58, 3.66, 3.71, 3.69, 3.74, 3.72, 3.8, 3.77, 3.83, 3.79, 3.86, 3.9, 3.87, 3.93, 3.89, 3.97, 4.02,
    3.98, 4.05, 4.01, 4.08, 4.12, 4.07, 4.14, 4.11, 4.17, 4.15, 4.22,
];

export const DASHBOARD_ACCOUNTS: readonly CurrencyAccount[] = [
    { id: "operating", code: "GBP", name: "Operating", balanceMinor: 285420318 },
    { id: "payroll", code: "GBP", name: "Payroll", balanceMinor: 61248000 },
    { id: "eur", code: "EUR", name: "EUR wallet", balanceMinor: 41203690 },
];

export const DASHBOARD_APPROVALS: readonly Approval[] = [
    { id: "a1", payee: "Supplier invoice 1042", reference: "Due Friday", amountMinor: 624075, currency: "GBP", requester: "AK" },
    { id: "a2", payee: "Contractor · September", reference: "Due Monday", amountMinor: 380000, currency: "EUR", requester: "MR" },
];

export const DASHBOARD_ACTIVITY: readonly ActivityEntry[] = [
    { id: "t1", name: "Customer receipt · INV-2307", category: "Receivable", date: "Today", amountMinor: 2156075 },
    { id: "t2", name: "Cloud hosting", category: "Software", date: "Today", amountMinor: -41288 },
    { id: "t3", name: "Payroll · September", category: "Payroll", date: "Yesterday", amountMinor: -4825000 },
    { id: "t4", name: "Tax reserve sweep", category: "Transfer", date: "Yesterday", amountMinor: -368400 },
];
