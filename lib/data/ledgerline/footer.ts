import type { FooterColumn } from "@/lib/types";
import { HELP_ROUTE, helpArticleRoute } from "@/lib/constants";

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
    {
        id: "product",
        title: "Product",
        links: [
            { id: "f1", label: "Accounts", href: "/#accounts" },
            { id: "f2", label: "Payments", href: "/#payments" },
            { id: "f3", label: "Cards", href: "/#cards" },
            { id: "f4", label: "Treasury", href: "/#treasury" },
        ],
    },
    {
        id: "company",
        title: "Company",
        links: [
            { id: "f5", label: "Security", href: "/#security" },
            { id: "f6", label: "Pricing", href: "/#pricing" },
            { id: "f7", label: "Questions", href: "/#faq" },
        ],
    },
    {
        id: "support",
        title: "Support",
        links: [
            {
                id: "f12",
                label: "Getting started",
                href: helpArticleRoute("create-a-workspace"),
            },
            {
                id: "f13",
                label: "Statements",
                href: helpArticleRoute("download-a-statement"),
            },
            {
                id: "f14",
                label: "Signing in",
                href: helpArticleRoute("signing-in-and-sessions"),
            },
            { id: "f15", label: "All help articles", href: HELP_ROUTE },
        ],
    },
    {
        id: "start",
        title: "Get started",
        links: [
            { id: "f8", label: "Open an account", href: "/#contact" },
            { id: "f9", label: "Book a demo", href: "/#contact" },
        ],
    },
];

export const FOOTER_COPY = {
    lead: "Business banking on a ledger",
    accent: "that balances in real time.",
    sub: "Accounts, payments, cards and treasury in one place, reconciled the moment money moves.",
    top: { label: "Back to top", href: "/#top" },
    updates: {
        title: "Product updates",
        lead: "One short email when something ships. No noise.",
        label: "Email for product updates",
        submit: "Subscribe",
        success: "Noted. Nothing is sent in this preview.",
    },
} as const;
