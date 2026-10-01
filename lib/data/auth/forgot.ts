import { RESET_LINK_TTL_MINUTES } from "@/lib/auth/constants";
import { HELP_ROUTE, HTTP_STATUS, LOGIN_ROUTE } from "@/lib/constants";
import { tooManyMessage } from "@/lib/data/auth/shell";

export const FORGOT_FIELDS = {
    email: {
        name: "email",
        label: "Work email",
        type: "email",
        autoComplete: "email",
        inputMode: "email",
    },
} as const;

export const FORGOT_COPY = {
    metaTitle: "Reset your password · Ledgerline",
    eyebrow: "Account recovery",
    title: "Reset your password",
    lead: "Enter your work email and we'll send a link to choose a new one.",
    submit: "Send reset link",
    pending: "Sending link",
    invalid: "Enter a valid email address.",
    back: {
        prompt: "Remembered it?",
        label: "Sign in",
        href: LOGIN_ROUTE,
    },
    statement: `A reset link works once, for ${RESET_LINK_TTL_MINUTES} minutes, and only from your inbox.`,
    sent: {
        eyebrow: "Check your email",
        title: "If that email has an account, a link is on its way",
        lead: "We say the same for every address, so nobody can use this page to find out who banks here.",
        notes: [
            `The link works once and for ${RESET_LINK_TTL_MINUTES} minutes.`,
            "Asking again cancels any earlier link.",
            "Nothing after a few minutes? Check your spam folder.",
        ],
        action: { label: "Back to sign in", href: LOGIN_ROUTE },
        footer: { prompt: "Still stuck?", label: "Get help", href: HELP_ROUTE },
    },
    again: "Send another link",
} as const;

const FORGOT_UNAVAILABLE =
    "We couldn't send the request. Nothing was changed, so try again shortly.";

export const forgotMessage = (
    status: number | undefined,
    retryAfter: number | undefined,
): string =>
    status === HTTP_STATUS.tooManyRequests
        ? tooManyMessage(retryAfter)
        : FORGOT_UNAVAILABLE;
