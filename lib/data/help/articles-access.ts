import type { HelpArticle } from "@/lib/types";

export const ACCESS_ARTICLES: readonly HelpArticle[] = [
    {
        slug: "invite-a-team-member",
        title: "Invite a team member",
        summary: "Give a colleague or your accountant access to the workspace.",
        category: "team",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "Only the owner can invite people. Each invitation carries a role that decides what the person can see and do.",
            },
            {
                kind: "steps",
                items: [
                    "Open Settings, then Team",
                    "Select Invite and enter their work email",
                    "Choose a role and, for viewers, the accounts they can see",
                    "Send the invitation",
                ],
            },
            {
                kind: "note",
                severity: "warning",
                text: "Invitations expire if they are not accepted. You can send a new one at any time.",
            },
        ],
    },
    {
        slug: "roles-and-permissions",
        title: "Roles and permissions",
        summary: "What the owner, finance, accountant and viewer roles can do.",
        category: "team",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "Every member of a workspace has exactly one role.",
            },
            {
                kind: "list",
                items: [
                    "Owner: everything, including team and settings",
                    "Finance: accounts, ledger, statements and exports",
                    "Accountant: read, annotate and export, with no team or settings access",
                    "Viewer: the accounts they were given, with search",
                ],
            },
            {
                kind: "note",
                severity: "info",
                text: "Only the owner can change a member's role.",
            },
        ],
    },
    {
        slug: "signing-in-and-sessions",
        title: "Signing in and sessions",
        summary: "How long you stay signed in and how to sign out everywhere.",
        category: "security",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "You sign in with your work email and password. After a period without activity, Ledgerline signs you out to protect your balances.",
            },
            {
                kind: "list",
                items: [
                    "You are warned before a session ends",
                    "Signing out ends the session on this device",
                    "Changing your password signs you out everywhere",
                ],
            },
            {
                kind: "note",
                severity: "info",
                text: "Use a password you do not use anywhere else.",
            },
        ],
    },
    {
        slug: "report-suspicious-activity",
        title: "Report suspicious activity",
        summary: "What to do if something in your workspace looks wrong.",
        category: "security",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "steps",
                items: [
                    "Change your password straight away",
                    "Check Team for members you do not recognise",
                    "Message support with what you noticed and when",
                ],
            },
            {
                kind: "note",
                severity: "warning",
                text: "Ledgerline will never ask for your password by email, message or phone.",
            },
        ],
    },
];
