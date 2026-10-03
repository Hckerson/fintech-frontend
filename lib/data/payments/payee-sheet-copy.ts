export const PAYEE_SHEET_COPY = {
    close: "Close details",
    pane: "Payee details",
    none: "Select a payee to see its details and payment history.",
    chart: (currency: string) => `Payments in ${currency}`,
    history: "Recent payments",
    noHistory: "No payments to this payee yet.",
    historyFailed: "Recent payments couldn't be loaded. Try again.",
    pending: "Pending",
} as const;
