import {
    TRANSFER_MEMO_MAX,
    TRANSFER_REVIEW_TTL_MS,
} from "@/lib/payments/transfer-constants";
import type { TransferIssue } from "@/lib/types";

const MS_PER_MINUTE = 60_000;

const ISSUES: Record<TransferIssue, string> = {
    required: "Choose one to continue.",
    amount: "Enter an amount above zero, with no more decimal places than the currency has.",
    memo: `Use ${TRANSFER_MEMO_MAX} characters or fewer.`,
    source_unavailable:
        "This account can't send money right now. Choose another account.",
    destination_unavailable:
        "This destination can't be paid right now. Choose another.",
    currency_mismatch:
        "Source and destination must be in the same currency. Conversion isn't available.",
    insufficient_funds: "This is more than the available balance.",
    over_transfer_limit: "This is more than the limit for one transfer.",
    over_daily_limit: "This is more than what's left of today's limit.",
    cut_off_passed:
        "The cut-off passed, so the settlement date has moved. Check the new date.",
};

export const TRANSFER_COPY = {
    crumb: "Payments",
    steps: { edit: "Details", review: "Review", done: "Sent" },
    stepsLabel: "Transfer progress",
    loading: "Loading transfer details",
    form: {
        title: "Transfer details",
        from: "From",
        fromPlaceholder: "Choose an account",
        to: "To",
        destinations: [
            { id: "payee", label: "A payee" },
            { id: "account", label: "Own account" },
        ],
        destinationLabel: "Destination type",
        payeePlaceholder: "Choose a payee",
        searchPayees: "Search payees",
        noPayee: "No payee matches.",
        accountPlaceholder: "Choose an account",
        payeeLabel: "Payee",
        accountLabel: "Account",
        noOtherAccount: "There is no other open account to move money to.",
        amount: "Amount",
        available: (amount: string) => `${amount} available`,
        leaves: (amount: string) => `Leaves ${amount} available`,
        memo: "Reference",
        memoHint: `Optional. Up to ${TRANSFER_MEMO_MAX} characters, shown to the recipient.`,
        continue: "Review transfer",
        nothingSent: "Nothing is sent until you confirm on the next step.",
    },
    option: {
        account: (name: string, last4: string, available: string) =>
            `${name} ••${last4} — ${available}`,
        unavailable: (name: string, last4: string, state: string) =>
            `${name} ••${last4} — ${state}`,
        payee: (name: string, last4: string) => `${name} ••${last4}`,
        ending: (last4: string) => `ending ${last4}`,
        states: { OPEN: "Open", FROZEN: "Frozen", CLOSED: "Closed" },
    },
    issues: ISSUES,
    aside: {
        title: "Limits and timing",
        usedToday: "Used today",
        sending: "You're sending",
        noAmount: "—",
        notChosen: "Not chosen yet",
        used: (used: string, limit: string) => `${used} of ${limit}`,
        available: "Available balance",
        chooseAccount: "Choose an account",
        perTransfer: "Limit per transfer",
        daily: "Left of today's limit",
        cutOff: "Cut-off",
        cutOffValue: (hour: number, timeZone: string) =>
            `${String(hour).padStart(2, "0")}:00 ${timeZone}`,
        settles: "Settles on",
        note: "Limits apply in each account's own currency. Transfers confirmed after the cut-off settle on the next working day.",
    },
    review: {
        title: "Review transfer",
        lead: "Check every detail. Confirming is final — a transfer can't be undone or recalled from here.",
        amount: "Amount",
        from: "From",
        fromBalance: (available: string) => `${available} available`,
        to: "To",
        memo: "Reference",
        noMemo: "None",
        settles: "Settles on",
        edit: "Edit details",
        confirm: "Confirm transfer",
        lapsed: `This review is more than ${TRANSFER_REVIEW_TTL_MS / MS_PER_MINUTE} minutes old and balances may have moved. Review it again before confirming.`,
        again: "Review again",
        changed: "Something changed since you reviewed this. Nothing was sent.",
        offline:
            "You're offline. Confirming is unavailable until you reconnect.",
    },
    confirm: {
        title: (amount: string, name: string) => `Send ${amount} to ${name}?`,
        consequence:
            "This is final. Once confirmed the transfer can't be undone or recalled from here.",
        confirm: "Send transfer",
        cancel: "Back to review",
    },
    unconfirmed:
        "We couldn't confirm this transfer. It will not be sent again automatically — check its status before trying again.",
    check: "Check status",
    notRecorded:
        "No transfer was recorded for this attempt, and no money has moved. You can confirm again.",
    result: {
        title: "Transfer accepted",
        lead: (day: string) =>
            `It is pending and expected to settle on ${day}. It appears under pending transactions until then.`,
        reference: "Reference",
        status: "Pending",
        view: "View pending transactions",
        another: "Make another transfer",
        payees: "Back to payees",
    },
    destination: (name: string, last4: string) => `${name} ••${last4}`,
} as const;
