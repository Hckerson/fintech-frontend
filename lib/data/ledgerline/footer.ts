import type { FooterColumn } from "@/lib/types";
import { HELP_ROUTE } from "@/lib/constants";

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
            { id: "f11", label: "Help center", href: HELP_ROUTE },
        ],
    },
    {
        id: "start",
        title: "Get started",
        links: [
            { id: "f8", label: "Open an account", href: "/#contact" },
            { id: "f9", label: "Book a demo", href: "/#contact" },
            { id: "f10", label: "Back to top", href: "/#top" },
        ],
    },
];

export const FOOTER_COPY = {
    tagline: "Business banking on a ledger that balances in real time.",
    disclosure:
        "Ledgerline is a fictional product created for a design study. It is not a bank, is not authorised or regulated by any financial authority, holds no deposits and offers no services. Company names, balances, rates, prices and figures are placeholders.",
    rights: "Ledgerline design study",
} as const;
