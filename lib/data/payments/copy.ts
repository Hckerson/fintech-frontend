import {
    ACCOUNT_NUMBER_LENGTH,
    PAYEE_NAME_MAX,
    SORT_CODE_LENGTH,
} from "@/lib/payments/constants";

export const PAYEE_COPY = {
    eyebrow: "Payments",
    lead: "The businesses and people this workspace trusts to be paid. Account details stay masked once saved.",
    section: "Payees",
    loading: "Loading payees",
    search: { label: "Search payees by name", placeholder: "Search payees" },
    add: "Add payee",
    offline:
        "You're offline. Adding, renaming and removing are unavailable until you reconnect, and nothing is queued.",
    slow: "Still working. This is taking longer than usual.",
    stale: (asOf: string) =>
        `Couldn't refresh. Showing payees as of ${asOf}; they may be out of date.`,
    caption: (count: number, more: boolean) =>
        `Payees sorted by name. ${count} shown${more ? ", more available" : ""}.`,
    columns: { payee: "Payee", status: "Status", actions: "Actions" },
    stats: [
        { id: "total", label: "Payees", hint: "Saved in this workspace" },
        { id: "active", label: "Ready to pay", hint: "Details verified" },
        {
            id: "pendingVerification",
            label: "Pending verification",
            hint: "Not payable yet",
        },
        {
            id: "inProgress",
            label: "Payments in progress",
            hint: "Locked from removal",
        },
    ],
    filterLabel: "Filter payees by status",
    filters: [
        { id: "all", label: "All" },
        { id: "active", label: "Ready to pay" },
        { id: "pending_verification", label: "Pending" },
    ],
    showing: (shown: number, matched: number) =>
        `Showing ${shown} of ${matched}`,
    destinationColumn: "Destination",
    summaryPending: " ",
    summary: (count: number, more: boolean, pending: number) =>
        [
            `${count}${more ? "+" : ""} ${count === 1 && !more ? "payee" : "payees"}`,
            !more && pending > 0 ? `${pending} pending verification` : null,
        ]
            .filter(Boolean)
            .join(" · "),
    inProgress: "Payment in progress",
    moreNamed: (name: string) => `More actions for ${name}`,
    destination: (last4: string) => `•• ${last4}`,
    destinationSpoken: (last4: string) => `account ending ${last4}`,
    bankUnknown: "Bank not given",
    status: {
        active: "Verified",
        pending_verification: "Pending verification",
    },
    lastPaid: "Last paid",
    neverPaid: "Never",
    totalPaid: "Total paid",
    nothingPaid: "Nothing yet",
    pay: "Pay",
    payNamed: (name: string) => `Pay ${name}`,
    rename: "Rename",
    renameNamed: (name: string) => `Rename ${name}`,
    remove: "Remove",
    removeNamed: (name: string) => `Remove ${name}`,
    reasons: {
        pendingVerification: "Can't be paid until its details are verified.",
        paymentInProgress:
            "Can't be removed while a payment to it is in progress.",
        offline: "Unavailable while you're offline.",
    },
    loadMore: "Load more payees",
    added: (name: string) =>
        `${name} added. It can be paid once its details are verified.`,
    renamed: (from: string, to: string) => `${from} renamed to ${to}.`,
    removed: (name: string) =>
        `${name} removed. Past transactions are unchanged.`,
    addDialog: {
        title: "Add a payee",
        lead: "All fields are required. Once saved, the account details are masked for good — to change them you add a new payee.",
        submit: "Add payee",
    },
    fields: {
        name: {
            label: "Payee name",
            hint: `Up to ${PAYEE_NAME_MAX} characters.`,
        },
        sortCode: {
            label: "Sort code",
            hint: `${SORT_CODE_LENGTH} digits.`,
            placeholder: "00-00-00",
        },
        accountNumber: {
            label: "Account number",
            hint: `${ACCOUNT_NUMBER_LENGTH} digits.`,
            placeholder: "00000000",
        },
    },
    fieldErrors: {
        name: `Enter a name of ${PAYEE_NAME_MAX} characters or fewer.`,
        sortCode: `Enter the ${SORT_CODE_LENGTH}-digit sort code.`,
        accountNumber: `Enter the ${ACCOUNT_NUMBER_LENGTH}-digit account number.`,
    },
    duplicate: (name: string) =>
        `These account details are already saved as ${name}. Use that payee instead of adding a second one.`,
    renameDialog: {
        title: "Rename payee",
        lead: (destination: string) =>
            `Only the name changes. The destination (${destination}) stays the same — to pay different account details, add a new payee.`,
        submit: "Save name",
    },
    renameConflict: (current: string) =>
        `Someone else changed this payee while you had it open; it is now called ${current}. Nothing was overwritten and what you typed is kept — save again to apply it, or cancel.`,
    gone: "This payee was removed by someone else. Nothing was changed.",
    removeDialog: {
        title: (name: string) => `Remove ${name}?`,
        consequence: (name: string, destination: string) =>
            `${name} (${destination}) will leave the payee list for everyone in this workspace. Past transactions are not affected. This can't be undone — to pay them again you would add them as a new payee.`,
        confirm: "Remove payee",
    },
    removeConflict:
        "This payee was changed by someone else after you opened this. Nothing was removed — close this and review the current details.",
    discard: {
        prompt: "Discard what you entered?",
        confirm: "Discard",
        keep: "Keep editing",
    },
    cancel: "Cancel",
    close: "Close",
} as const;
