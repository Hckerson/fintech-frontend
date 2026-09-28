import type { Figure, NavLink } from "@/lib/types";

export const LEDGER_BRAND = {
    name: "Ledgerline",
    home: "#top",
    open: { label: "Open an account", href: "#contact" },
    demo: { label: "Book a demo", href: "#contact" },
    signIn: { label: "Sign in", href: "#contact" },
    menu: { open: "Open menu", close: "Close menu", primary: "Primary", mobile: "Mobile" },
} as const;

export const LEDGER_NAV: readonly NavLink[] = [
    { id: "accounts", label: "Accounts", href: "#accounts" },
    { id: "payments", label: "Payments", href: "#payments" },
    { id: "cards", label: "Cards", href: "#cards" },
    { id: "treasury", label: "Treasury", href: "#treasury" },
    { id: "security", label: "Security", href: "#security" },
    { id: "pricing", label: "Pricing", href: "#pricing" },
];

export const LEDGER_HERO = {
    badge: "Design study",
    badgeDetail: "Placeholder business bank",
    lines: ["Your cash,", "in one line."],
    body: "Accounts, payments, cards and treasury on a single real-time ledger. Finance teams see every pound the moment it moves, and the books close themselves.",
    primary: { label: "Open an account", href: "#contact" },
    secondary: { label: "Book a demo", href: "#contact" },
} as const;

export const METRICS_NOTE = "Sample figures for a placeholder product.";

export const METRICS: readonly Figure[] = [
    { id: "speed", value: "< 1s", label: "Transfers between your accounts" },
    { id: "currencies", value: "34", label: "Currencies held in one place" },
    { id: "close", value: "0", label: "Entries left to reconcile at close" },
    { id: "controls", value: "2-step", label: "Approvals on every outgoing payment" },
];
