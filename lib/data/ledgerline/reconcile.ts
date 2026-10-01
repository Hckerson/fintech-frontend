import type { MatchedEntry } from "@/lib/types";

export const RECONCILE_COPY = {
    eyebrow: "Reconciliation",
    title: "The month closes itself.",
    lead: "Every payment is matched to its ledger entry the moment it posts and synced to your accounting software, so month end is a review, not a hunt.",
    matched: "Matched",
    progress: "entries matched",
    note: "Sample entries.",
} as const;

export const MATCHED_ENTRIES: readonly MatchedEntry[] = [
    {
        id: "m1",
        description: "Customer receipt · INV-2291",
        account: "Receivables",
        amountMinor: 1842000,
    },
    {
        id: "m2",
        description: "Supplier invoice 1042",
        account: "Payables",
        amountMinor: -624075,
    },
    {
        id: "m3",
        description: "FX conversion to EUR",
        account: "EUR wallet",
        amountMinor: -1000000,
    },
    {
        id: "m4",
        description: "Card settlement",
        account: "Card clearing",
        amountMinor: -213990,
    },
    {
        id: "m5",
        description: "Payroll · September",
        account: "Payroll",
        amountMinor: -4825000,
    },
];
