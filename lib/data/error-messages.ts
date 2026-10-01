import type { ErrorKind } from "@/lib/types";

export const ERROR_MESSAGE: Record<ErrorKind, string> = {
    validation: "Some of what you entered wasn't accepted. Check it and try again.",
    unauthenticated:
        "Your session has ended, so nothing was sent. Sign in again, then repeat this.",
    step_up_required: "Confirm it's you to continue.",
    forbidden:
        "Your role no longer includes this. A workspace owner can change that.",
    not_found: "This record no longer exists. Nothing was changed.",
    conflict:
        "Someone else changed this while you had it open. Nothing was overwritten.",
    locked: "Too many attempts. Wait before trying again.",
    rate_limited: "Too many requests. Wait a moment, then try again.",
    unavailable:
        "Ledgerline couldn't complete this. No money has moved. Try again.",
    offline:
        "You're offline. Nothing is sent or queued while you're offline — reconnect, then try again.",
    unconfirmed:
        "We couldn't confirm whether this went through. It will not be sent again automatically — check the list before you repeat it.",
};

export const ERROR_COPY = {
    reference: "Reference",
    retry: "Try again",
    retrying: "Trying again",
    signIn: "Sign in again",
    loadFailed: "We couldn't load this. No money has moved. Try again.",
    cannotLoad:
        "This can't be loaded right now. Contact support and quote the reference.",
    offline:
        "You're offline. This will load by itself when you reconnect.",
    sectionFailed:
        "This section couldn't be shown. The rest of the page still works.",
} as const;

export const READ_ERROR_KIND: Partial<
    Record<ErrorKind, "retryable" | "non-retryable" | "offline">
> = {
    unavailable: "retryable",
    rate_limited: "retryable",
    offline: "offline",
};
