import {
    HTTP_STATUS,
    INVALID_CREDENTIALS,
    REGISTER_ROUTE,
    helpArticleRoute,
} from "@/lib/constants";

export const SIGN_IN_FIELDS = {
    email: {
        name: "email",
        label: "Work email",
        type: "email",
        autoComplete: "email",
        inputMode: "email",
    },
    password: {
        name: "password",
        label: "Password",
        type: "password",
        autoComplete: "current-password",
        inputMode: "text",
    },
} as const;

export const SIGN_IN_COPY = {
    metaTitle: "Sign in · Ledgerline",
    eyebrow: "Welcome back",
    title: "Sign in to Ledgerline",
    lead: "Your balances, statements and team, exactly where you left them.",
    submit: "Sign in",
    pending: "Signing in",
    forgot: {
        label: "Forgot password?",
        href: helpArticleRoute("signing-in-and-sessions"),
    },
    create: {
        prompt: "New to Ledgerline?",
        label: "Get started",
        href: REGISTER_ROUTE,
    },
    statement: "Account numbers stay masked until you ask to see them.",
    account: {
        name: "Operating account",
        currency: "GBP",
        value: "•••• •••• 4417",
    },
} as const;

export const CREDENTIAL_ERROR_STATUSES: readonly number[] = [
    HTTP_STATUS.badRequest,
    HTTP_STATUS.unauthorized,
];

const SIGN_IN_ERRORS: Partial<Record<number, string>> = {
    [HTTP_STATUS.badRequest]: "Enter a valid email address and password.",
    [HTTP_STATUS.unauthorized]: INVALID_CREDENTIALS,
    [HTTP_STATUS.tooManyRequests]:
        "Too many attempts. Wait a minute, then try again.",
};

const SIGN_IN_UNAVAILABLE =
    "Sign-in is unavailable right now. Your password was not checked, so try again shortly.";

export const signInMessage = (status: number | undefined): string =>
    (status !== undefined && SIGN_IN_ERRORS[status]) || SIGN_IN_UNAVAILABLE;
