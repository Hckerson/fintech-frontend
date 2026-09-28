import type { FaqItem, FooterColumn, Plan, SecurityControl } from "@/lib/types";

export const SECURITY_COPY = {
    eyebrow: "Security and control",
    title: "Built like a bank. Audited like one.",
    lead: "Every permission, approval and login is recorded. Your team gets the controls an auditor would ask for, switched on by default.",
    note: "Placeholder controls for a design study. Ledgerline holds no certifications.",
} as const;

export const SECURITY_CONTROLS: readonly SecurityControl[] = [
    { id: "approvals", icon: "approvals", title: "Two-person approvals", detail: "Payments above your limit need a second approver before they leave." },
    { id: "roles", icon: "roles", title: "Granular roles", detail: "Decide who can view, draft, approve and release, down to the account." },
    { id: "audit", icon: "audit", title: "Complete audit trail", detail: "Every action is timestamped and attributed, exportable in one click." },
    { id: "keys", icon: "keys", title: "Hardware keys", detail: "Require security keys for sign-in and high-value approvals." },
    { id: "funds", icon: "funds", title: "Protected funds", detail: "Client money held apart from the company's own, in the concept." },
    { id: "monitoring", icon: "monitoring", title: "Always-on monitoring", detail: "Unusual payments are paused and flagged before they settle." },
];

export const PRICING_COPY = {
    eyebrow: "Pricing",
    title: "Simple plans. No fee on your own money standing still.",
    featured: "Most chosen",
    cta: "Choose",
    note: "Placeholder pricing for a design study.",
} as const;

export const PLANS: readonly Plan[] = [
    { id: "essential", name: "Essential", price: "£0", cadence: "per month", summary: "A first business account, done properly.", features: ["GBP account and cards", "Free local transfers", "Monthly statements"], featured: false },
    { id: "scale", name: "Scale", price: "£49", cadence: "per month", summary: "For teams paying across borders.", features: ["Accounts in 34 currencies", "Two-person approvals", "Live reconciliation", "Accounting sync"], featured: true },
    { id: "enterprise", name: "Enterprise", price: "Custom", cadence: "annual", summary: "For finance teams with many entities.", features: ["Multi-entity ledger", "Dedicated account manager", "Custom roles and limits", "API access"], featured: false },
];

export const FAQ_COPY = {
    eyebrow: "Questions",
    title: "Asked by finance teams.",
} as const;

export const FAQS: readonly FaqItem[] = [
    { id: "real", question: "Is Ledgerline a real bank?", answer: "No. Ledgerline is a placeholder product made for a design study. It holds no money, has no licence, and every figure on this page is sample data." },
    { id: "switch", question: "How long does it take to switch?", answer: "In the concept, an application takes about ten minutes and accounts open the same day once verification completes." },
    { id: "currencies", question: "Can we hold and pay in several currencies?", answer: "Yes. Each currency is its own account on the same ledger, and conversions are recorded as paired entries." },
    { id: "approvals", question: "Who can move money?", answer: "Roles decide who drafts, approves and releases. Anything above a limit you set needs a second person." },
    { id: "accounting", question: "Does it work with our accounting software?", answer: "The concept syncs matched entries to common accounting tools, so the ledger and your books never disagree." },
];

export const CTA_COPY = {
    title: "Put every pound on one line.",
    lead: "Open an account in minutes, or talk to us about moving a whole finance team.",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    submit: "Get started",
    success: "Thank you. Ledgerline is a design study, so nothing was sent.",
    invalid: "Enter a valid work email",
    note: "Design study. Nothing entered here is stored or sent.",
} as const;

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
    { id: "product", title: "Product", links: [{ id: "f1", label: "Accounts", href: "#accounts" }, { id: "f2", label: "Payments", href: "#payments" }, { id: "f3", label: "Cards", href: "#cards" }, { id: "f4", label: "Treasury", href: "#treasury" }] },
    { id: "company", title: "Company", links: [{ id: "f5", label: "Security", href: "#security" }, { id: "f6", label: "Pricing", href: "#pricing" }, { id: "f7", label: "Questions", href: "#faq" }] },
    { id: "start", title: "Get started", links: [{ id: "f8", label: "Open an account", href: "#contact" }, { id: "f9", label: "Book a demo", href: "#contact" }, { id: "f10", label: "Back to top", href: "#top" }] },
];

export const FOOTER_COPY = {
    tagline: "Business banking on a ledger that balances in real time.",
    disclosure: "Ledgerline is a fictional product created for a design study. It is not a bank, is not authorised or regulated by any financial authority, holds no deposits and offers no services. Company names, balances, rates, prices and figures are placeholders.",
    rights: "Ledgerline design study",
} as const;
