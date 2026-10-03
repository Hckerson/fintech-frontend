import { HELP_ROUTE, HOME_ROUTE } from "@/lib/constants";

export const AUTH_SHELL_COPY = {
    caption: "Design study · Placeholder business bank",
    footnoteLabel: "Support",
    footnote: [
        { id: "help", label: "Help", href: HELP_ROUTE },
        { id: "back", label: "Back to site", href: HOME_ROUTE },
    ],
    points: [
        "Roles decide who can see and who can move money",
        "A second check before any sensitive action",
        "Every sign-in recorded for you to review",
    ],
    showPassword: "Show password",
    hidePassword: "Hide password",
    offline: "You're offline, so nothing was sent. Reconnect, then try again.",
} as const;

const SECONDS_PER_MINUTE = 60;

export const retryWait = (seconds: number | undefined): string => {
    if (seconds === undefined) return "later";
    const minutes = Math.ceil(seconds / SECONDS_PER_MINUTE);
    return `in ${minutes} minute${minutes === 1 ? "" : "s"}`;
};

export const tooManyMessage = (seconds: number | undefined): string =>
    `Too many attempts. Try again ${retryWait(seconds)}.`;
