import {
    CHALLENGE_TTL_MINUTES,
    VERIFY_CODE_LENGTH,
} from "@/lib/auth/constants";
import { HELP_ROUTE, HTTP_STATUS, LOGIN_ROUTE } from "@/lib/constants";
import { retryWait, tooManyMessage } from "@/lib/data/auth/shell";

const plural = (count: number, noun: string) =>
    `${count} ${noun}${count === 1 ? "" : "s"}`;

const CANCEL = {
    prompt: "Not you?",
    label: "Back to sign in",
    href: LOGIN_ROUTE,
};

export const VERIFY_FIELDS = {
    code: {
        name: "code",
        label: `${VERIFY_CODE_LENGTH}-digit code`,
        hint: `A code stops working after ${CHALLENGE_TTL_MINUTES} minutes. You can always ask for a new one.`,
    },
    recovery: {
        name: "recovery-code",
        label: "Recovery code",
        type: "text",
        autoComplete: "off",
        inputMode: "text",
        hint: "Each recovery code works once.",
    },
} as const;

export const VERIFY_COPY = {
    metaTitle: "Two-step verification · Ledgerline",
    eyebrow: "Two-step verification",
    title: "Confirm it's you",
    lead: {
        code: "Enter the code from your authenticator app or the message we sent.",
        recovery:
            "Enter one of the recovery codes you saved when you turned on two-step verification.",
    },
    submit: "Verify",
    pending: "Verifying",
    invalid: {
        code: `Enter the ${VERIFY_CODE_LENGTH}-digit code.`,
        recovery: "Enter a recovery code.",
    },
    passkey: "Use a passkey",
    passkeyPending: "Waiting for your passkey",
    passkeyUnused:
        "The passkey wasn't used, and that didn't count as an attempt. You can enter a code instead.",
    resend: "Send a new code",
    resendIn: (seconds: number) => `Send a new code in ${seconds}s`,
    assurance:
        "Ledgerline never asks for this code by phone, email or chat. Only enter it here.",
    resent: "A new code is on its way.",
    switchTo: {
        code: "Use a code instead",
        recovery: "Use a recovery code",
    },
    cancel: CANCEL,
    statement:
        "A second step stands between a stolen password and your balances.",
    or: "or",
    expired: {
        tone: "warning",
        eyebrow: "Check expired",
        title: "Start again",
        lead: `This check is no longer active. One lasts ${CHALLENGE_TTL_MINUTES} minutes and only works in the browser that began it.`,
        action: { label: "Start again", href: LOGIN_ROUTE },
    },
} as const;

export const verifyLocked = (retryAfter: number | undefined) =>
    ({
        tone: "error",
        eyebrow: "Verification locked",
        title: "Too many incorrect codes",
        lead: `To protect the account, no more codes are accepted for now. Try again ${retryWait(retryAfter)}.`,
        action: { label: "Get help", href: HELP_ROUTE },
        footer: CANCEL,
    }) as const;

export const verifyRecovered = (remaining: number | undefined, next: string) =>
    ({
        tone: "success",
        eyebrow: "Recovery code accepted",
        title: "You're verified",
        lead:
            remaining === undefined
                ? "That recovery code can't be used again."
                : `That code can't be used again. You have ${plural(remaining, "recovery code")} left.`,
        action: { label: "Continue", href: next },
    }) as const;

export const VERIFY_EXPIRED_STATUSES: readonly number[] = [
    HTTP_STATUS.notFound,
    HTTP_STATUS.gone,
];

const VERIFY_WRONG_STATUSES: readonly number[] = [
    HTTP_STATUS.badRequest,
    HTTP_STATUS.unauthorized,
];

const VERIFY_UNAVAILABLE =
    "We couldn't check that right now. It didn't count as an attempt, so try again shortly.";

export const verifyMessage = (
    status: number | undefined,
    attemptsRemaining: number | undefined,
    retryAfter: number | undefined,
): string => {
    if (status === HTTP_STATUS.tooManyRequests)
        return tooManyMessage(retryAfter);
    if (status === undefined || !VERIFY_WRONG_STATUSES.includes(status)) {
        return VERIFY_UNAVAILABLE;
    }
    return attemptsRemaining === undefined
        ? "That code isn't right."
        : `That code isn't right. ${plural(attemptsRemaining, "attempt")} left.`;
};
