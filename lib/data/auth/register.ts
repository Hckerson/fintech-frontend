import { HTTP_STATUS, LOGIN_ROUTE, PASSWORD_MIN_LENGTH } from "@/lib/constants";

export const REGISTER_FIELDS = {
    fullName: {
        name: "fullName",
        label: "Full name",
        type: "text",
        autoComplete: "name",
        inputMode: "text",
    },
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
        autoComplete: "new-password",
        inputMode: "text",
        hint: `At least ${PASSWORD_MIN_LENGTH} characters.`,
    },
} as const;

export const REGISTER_COPY = {
    metaTitle: "Open an account · Ledgerline",
    eyebrow: "Get started",
    title: "Open an account",
    lead: "Takes about two minutes. Add your company and team once you're in.",
    submit: "Create account",
    pending: "Creating account",
    checkFields: "Check the highlighted fields and try again.",
    existing: {
        prompt: "Already have an account?",
        label: "Sign in",
        href: LOGIN_ROUTE,
    },
    statement: "Every pound lands on the line the moment it moves.",
    account: {
        name: "New operating account",
        currency: "GBP",
        value: "£0.00",
    },
} as const;

export const REGISTER_FIELD_ERRORS: Partial<
    Record<number, readonly (keyof typeof REGISTER_FIELDS)[]>
> = {
    [HTTP_STATUS.badRequest]: ["fullName", "email", "password"],
    [HTTP_STATUS.conflict]: ["email"],
};

const REGISTER_ERRORS: Partial<Record<number, string>> = {
    [HTTP_STATUS.badRequest]: `Enter your name, a valid email and a password of at least ${PASSWORD_MIN_LENGTH} characters.`,
    [HTTP_STATUS.conflict]:
        "We couldn't open an account with that email. If you already have one, sign in instead.",
    [HTTP_STATUS.tooManyRequests]:
        "Too many attempts. Wait a minute, then try again.",
    [HTTP_STATUS.badGateway]:
        "Your account was created, but we couldn't sign you in. Sign in to continue.",
};

const REGISTER_UNAVAILABLE =
    "Accounts can't be opened right now. Try again shortly.";

export const registerMessage = (status: number | undefined): string =>
    (status !== undefined && REGISTER_ERRORS[status]) || REGISTER_UNAVAILABLE;
