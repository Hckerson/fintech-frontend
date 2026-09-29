import type {
    ApprovalStep,
    CardControl,
    CurrencyAccount,
    FeaturePoint,
} from "@/lib/types";

export const ACCOUNTS_COPY = {
    eyebrow: "Accounts",
    title: "Every currency. One balance sheet.",
    lead: "Open accounts in the currencies you trade in and see them as one position, converted live at sample rates.",
    featuredTitle: "Multi-currency accounts",
    featuredDetail:
        "Local account details for payments in and out, each a page of the same ledger.",
    transferTitle: "Instant internal transfers",
    transferDetail:
        "Move money between your own accounts in under a second, any hour.",
    yieldTitle: "Interest on idle cash",
    yieldValue: "4.1%",
    yieldDetail: "Sample annual rate on balances you set aside.",
    subTitle: "Sub-accounts for every purpose",
    subDetail:
        "Ring-fence tax, payroll and reserves without opening another bank.",
    subAccounts: ["Tax reserve", "Payroll", "Runway", "Capex", "Dividends"],
    note: "Sample balances and rates.",
} as const;

export const CURRENCY_ACCOUNTS: readonly CurrencyAccount[] = [
    { id: "gbp", code: "GBP", name: "British pound", balanceMinor: 285420318 },
    { id: "eur", code: "EUR", name: "Euro", balanceMinor: 41203690 },
    { id: "usd", code: "USD", name: "US dollar", balanceMinor: 18840212 },
    { id: "chf", code: "CHF", name: "Swiss franc", balanceMinor: 4210350 },
];

export const PAYMENTS_COPY = {
    eyebrow: "Payments",
    title: "Nothing leaves without two sets of eyes.",
    lead: "Draft a payment, route it to an approver and schedule it in one flow. Limits and roles decide who signs off, and every step is written to the audit trail.",
    cardTitle: "Supplier invoice 1042",
    cardMeta: "Northwind Ltd to Harbour Supply Co",
    amountMinor: 624075,
    currency: "GBP",
    approve: "Approve payment",
    approved: "Approved and scheduled",
    reset: "Reset demo",
    pending: "Waiting",
    note: "Interactive sample. No payment is made.",
} as const;

export const APPROVAL_STEPS: readonly ApprovalStep[] = [
    { id: "draft", label: "Drafted", actor: "Amara K.", initials: "AK" },
    { id: "review", label: "Approved", actor: "Marcus R.", initials: "MR" },
    {
        id: "scheduled",
        label: "Scheduled",
        actor: "Friday, 09:00",
        initials: "LL",
    },
];

export const PAYMENT_POINTS: readonly FeaturePoint[] = [
    {
        id: "limits",
        title: "Limits by role",
        detail: "Set who can draft, approve and release, per amount.",
    },
    {
        id: "batch",
        title: "Batch payouts",
        detail: "Pay hundreds of invoices from one upload.",
    },
    {
        id: "rails",
        title: "Local rails",
        detail: "Faster Payments, SEPA and wires from one screen.",
    },
];

export const CARDS_COPY = {
    eyebrow: "Cards",
    title: "Cards with the controls built in.",
    lead: "Issue a card to anyone in seconds. Limits, merchant rules and receipts are part of the card, not a policy document nobody reads.",
    holder: "Amara Khan",
    number: "•••• 4417",
    spendLabel: "Monthly limit",
    spentMinor: 184250,
    limitMinor: 500000,
    currency: "GBP",
    note: "Illustrative card for a placeholder product.",
} as const;

export const CARD_CONTROLS: readonly CardControl[] = [
    {
        id: "online",
        label: "Online payments",
        detail: "Allow card-not-present spend",
        enabled: true,
    },
    {
        id: "travel",
        label: "Travel and hotels",
        detail: "Merchant category rule",
        enabled: true,
    },
    {
        id: "cash",
        label: "Cash withdrawals",
        detail: "Blocked for this team",
        enabled: false,
    },
    {
        id: "receipts",
        label: "Receipt required",
        detail: "Above £25 per purchase",
        enabled: true,
    },
];
