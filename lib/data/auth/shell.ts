import { HELP_ROUTE, HOME_ROUTE } from "@/lib/constants";

export const AUTH_SHELL_COPY = {
    caption: "Design study · Placeholder business bank",
    footnoteLabel: "Support",
    footnote: [
        { id: "help", label: "Help", href: HELP_ROUTE },
        { id: "back", label: "Back to site", href: HOME_ROUTE },
    ],
    showPassword: "Show password",
    hidePassword: "Hide password",
} as const;
