export const EMPTY_STATES = {
    cashPosition: {
        title: "No accounts to show yet.",
        body: "Accounts appear here once verification is approved.",
    },
    accounts: { title: "No accounts yet." },
    accountsNotShared: {
        title: "No accounts have been shared with you.",
        body: "Ask a workspace owner or finance lead to share one.",
    },
    recentActivity: {
        title: "No transactions yet.",
        body: "New activity shows up here as soon as it posts.",
    },
    pendingItems: { title: "Nothing waiting on you." },
    cashFlow: { title: "Not enough activity to chart yet." },
    cashFlowRange: {
        title: "No activity in this range.",
        body: "Try a longer one.",
    },
    payees: {
        title: "No payees yet.",
        body: "A payee is a business or person you trust to be paid. Once one is added and verified you can pay it from here.",
        action: "Add your first payee",
    },
    payeesNoMatch: {
        title: (term: string) => `No payee matches “${term}”.`,
        filtered: "No payees with this status.",
        body: "Your payees are still there — the search or filter is hiding them.",
        action: "Clear filters",
    },
    adminSeries: { title: "No sign-ups in this period." },
    adminSeriesBeforeOrigin: {
        title: "This period is before Ledgerline's first user.",
        body: "There is nothing to count yet, which is different from a period with no sign-ups.",
    },
    adminNotPermitted: {
        title: "Your role no longer includes Admin overview.",
        body: "A platform admin can restore access. Nothing was loaded.",
    },
} as const;
