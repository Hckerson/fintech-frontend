import {
    PASSWORD_MAX_LENGTH,
    RESET_LINK_TTL_MINUTES,
} from "@/lib/auth/constants";
import {
    FORGOT_PASSWORD_ROUTE,
    HTTP_STATUS,
    LOGIN_ROUTE,
    PASSWORD_MIN_LENGTH,
} from "@/lib/constants";
import { tooManyMessage } from "@/lib/data/auth/shell";

const PASSWORD_RULE = `Use ${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters.`;

const SIGN_IN = {
    prompt: "Remembered it?",
    label: "Sign in",
    href: LOGIN_ROUTE,
};

export const RESET_FIELDS = {
    password: {
        name: "password",
        label: "New password",
        type: "password",
        autoComplete: "new-password",
        inputMode: "text",
        hint: PASSWORD_RULE,
    },
    confirm: {
        name: "confirm",
        label: "Confirm new password",
        type: "password",
        autoComplete: "new-password",
        inputMode: "text",
    },
} as const;

export const RESET_COPY = {
    metaTitle: "Choose a new password · Ledgerline",
    eyebrow: "Account recovery",
    title: "Choose a new password",
    lead: "You'll sign in with it straight after.",
    submit: "Change password",
    pending: "Changing password",
    fieldErrors: {
        password: PASSWORD_RULE,
        confirm: "Both passwords must match.",
    },
    statement: "Changing your password signs out every other session.",
    invalid: {
        eyebrow: "Link not usable",
        title: "This reset link can't be used",
        lead: "It has expired, been used already, or been replaced by a newer one.",
        notes: [
            `A link works once and for ${RESET_LINK_TTL_MINUTES} minutes.`,
            "Reloading this page also needs the link from your email again.",
        ],
        action: { label: "Request a new link", href: FORGOT_PASSWORD_ROUTE },
        footer: SIGN_IN,
    },
    unchecked: {
        eyebrow: "Try again shortly",
        title: "We couldn't check your link",
        lead: "Your password has not been changed. Open the link from your email again in a few minutes.",
        action: { label: "Back to sign in", href: LOGIN_ROUTE },
    },
    done: {
        eyebrow: "Password changed",
        title: "Sign in with your new password",
        lead: "Every other session on this account has been signed out.",
        action: { label: "Sign in", href: LOGIN_ROUTE },
    },
} as const;

export const RESET_INVALID_STATUSES: readonly number[] = [
    HTTP_STATUS.unauthorized,
    HTTP_STATUS.notFound,
    HTTP_STATUS.gone,
];

const RESET_ERRORS: Partial<Record<number, string>> = {
    [HTTP_STATUS.badRequest]: `That password can't be used. ${PASSWORD_RULE}`,
};

const RESET_UNAVAILABLE =
    "We couldn't change your password. Nothing was changed, so try again shortly.";

export const resetMessage = (
    status: number | undefined,
    retryAfter: number | undefined,
): string =>
    status === HTTP_STATUS.tooManyRequests
        ? tooManyMessage(retryAfter)
        : (status !== undefined && RESET_ERRORS[status]) || RESET_UNAVAILABLE;
