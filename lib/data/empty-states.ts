export const EMPTY_STATES = {
    cashPosition: {
        title: "No accounts to show yet.",
        body: "Accounts appear here once verification is approved.",
    },
    accounts: { title: "No accounts yet." },
    accountsAwaiting: {
        title: "No accounts yet.",
        body: "Accounts appear here once verification is approved.",
    },
    accountsAskOwner: {
        title: "No accounts yet.",
        body: "Accounts appear once the business is verified. Ask a workspace owner about its progress.",
    },
    accountsNoMatch: {
        title: "No account matches that state or currency.",
        body: "Your accounts are still there; the filter is hiding them.",
    },
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
    transfer: {
        title: "Nothing to transfer between yet.",
        body: "Add a payee or open a second account to transfer money.",
        action: "Go to payees",
    },
    payeesNoMatch: {
        title: (term: string) => `No payee matches “${term}”.`,
        filtered: "No payees with this status.",
        body: "Your payees are still there — the search or filter is hiding them.",
        action: "Clear filters",
    },
    adminUsersFiltered: {
        title: "No users match.",
        body: "The search or filters are hiding everyone. The directory itself is not empty.",
        action: "Clear search and filters",
    },
    adminUsersNotPermitted: {
        title: "Your role doesn't include Admin users.",
        body: "Only platform admins manage users. A platform admin can change your role.",
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
