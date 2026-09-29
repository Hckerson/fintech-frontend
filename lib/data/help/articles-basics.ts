import type { HelpArticle } from "@/lib/types";

export const BASICS_ARTICLES: readonly HelpArticle[] = [
    {
        slug: "what-ledgerline-does",
        title: "What Ledgerline does",
        summary:
            "A read-only console for your business accounts, ledger and statements.",
        category: "start",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "Ledgerline brings your business accounts into one console. You see every balance, search every entry and take statements and exports whenever you need them.",
            },
            {
                kind: "list",
                items: [
                    "One cash position across all accounts",
                    "A searchable ledger for each account",
                    "Statements and exports by period",
                    "Roles that decide who sees what",
                ],
            },
            {
                kind: "note",
                severity: "info",
                text: "Ledgerline is a design study. It holds no money and every figure you see is sample data.",
            },
        ],
    },
    {
        slug: "create-a-workspace",
        title: "Create a workspace",
        summary:
            "Register as the owner, add your company and invite your team.",
        category: "start",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "A workspace belongs to one business. The person who creates it becomes its owner.",
            },
            {
                kind: "steps",
                items: [
                    "Choose Open an account",
                    "Enter your work email and a password of at least eight characters",
                    "Add your company details",
                    "Complete verification so your accounts can be connected",
                ],
            },
            {
                kind: "note",
                severity: "info",
                text: "Everyone else joins by invitation from the owner, never by registering on their own.",
            },
        ],
    },
    {
        slug: "understanding-balances",
        title: "Understanding your balances",
        summary: "Why the available balance and the ledger balance can differ.",
        category: "accounts",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "Each account shows two figures. The ledger balance counts every posted entry. The available balance also subtracts entries that are still pending.",
            },
            {
                kind: "list",
                items: [
                    "Ledger balance: posted entries only",
                    "Available balance: posted minus pending",
                    "Cash position: every account together, in your home currency",
                ],
            },
            {
                kind: "note",
                severity: "info",
                text: "The two figures meet again once pending entries post, usually within a working day.",
            },
        ],
    },
    {
        slug: "accounts-in-other-currencies",
        title: "Accounts in other currencies",
        summary: "How each currency is held and how totals are converted.",
        category: "accounts",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "Each currency is its own account on the same ledger. Balances are always shown in the account's own currency first.",
            },
            {
                kind: "p",
                text: "Your cash position converts every account into your home currency so you can read one total.",
            },
            {
                kind: "note",
                severity: "warning",
                text: "Converted totals are indicative. The amount you receive depends on the rate when money actually moves.",
            },
        ],
    },
];
