import type { HelpCategory } from "@/lib/types";

export const HELP_CATEGORIES: readonly HelpCategory[] = [
    {
        id: "start",
        title: "Getting started",
        description: "What Ledgerline is and how a workspace begins.",
        icon: "start",
    },
    {
        id: "accounts",
        title: "Accounts",
        description: "Balances, currencies and what each figure means.",
        icon: "wallet",
    },
    {
        id: "ledger",
        title: "Ledger",
        description: "Finding, reading and filtering entries.",
        icon: "table",
    },
    {
        id: "statements",
        title: "Statements & exports",
        description: "Getting your records out, by period and account.",
        icon: "document",
    },
    {
        id: "team",
        title: "Team",
        description: "Inviting people and deciding what they can see.",
        icon: "team",
    },
    {
        id: "security",
        title: "Security",
        description: "Signing in, sessions and reporting a problem.",
        icon: "lock",
    },
];
