import {
    STEP_UP_GRANT_SECONDS,
    STEP_UP_LOCK_SECONDS,
} from "@/lib/payments/constants";
import type { StepUpPurpose } from "@/lib/types";

const SECONDS_PER_MINUTE = 60;

const minutes = (seconds: number) => seconds / SECONDS_PER_MINUTE;

export const STEP_UP_ACTIONS: Record<StepUpPurpose, string> = {
    payee_add: "add a payee",
    payee_rename: "rename a payee",
    payee_remove: "remove a payee",
    transfer: "send this transfer",
    account_reveal: "show this account number",
};

export const STEP_UP_COPY = {
    title: "Confirm it's you",
    lead: (action: string) =>
        `Enter your password to ${action}. This covers that one kind of change for ${minutes(STEP_UP_GRANT_SECONDS)} minutes and never authorises a payment.`,
    transferLead:
        "Enter your password to send this transfer. It authorises this one transfer only.",
    password: "Password",
    submit: "Confirm",
    pending: "Checking",
    cancel: "Cancel",
    granted:
        "Identity confirmed. Nothing has been sent yet — submit again to finish.",
    cancelled: "Not confirmed, so nothing was saved. What you entered is kept.",
    wrong: (left: number) =>
        `That password is incorrect. ${left} ${left === 1 ? "attempt" : "attempts"} left.`,
    locked: `Too many incorrect attempts. Confirmation is locked for ${minutes(STEP_UP_LOCK_SECONDS)} minutes and nothing was changed.`,
    missing: "Enter your password.",
} as const;
