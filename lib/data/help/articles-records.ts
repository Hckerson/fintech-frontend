import type { HelpArticle } from "@/lib/types";

export const RECORDS_ARTICLES: readonly HelpArticle[] = [
    {
        slug: "search-the-ledger",
        title: "Search the ledger",
        summary: "Find any entry by description, amount, date or direction.",
        category: "ledger",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "Every account has a ledger with its full history. Search and filters work across all of it, not only the entries on screen.",
            },
            {
                kind: "steps",
                items: [
                    "Open the account from Accounts",
                    "Type part of a description or an amount in the search box",
                    "Narrow by date range, amount or money in and out",
                    "Open an entry to see its full detail",
                ],
            },
            {
                kind: "note",
                severity: "info",
                text: "Your search and filters stay in the address, so you can share the exact view with a colleague.",
            },
        ],
    },
    {
        slug: "pending-entries",
        title: "Why an entry is pending",
        summary: "What pending means and when an entry posts.",
        category: "ledger",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "A pending entry has been authorised but not yet settled. It already reduces your available balance.",
            },
            {
                kind: "list",
                items: [
                    "Card payments usually post within one to three days",
                    "Incoming transfers post when the sending bank settles",
                    "A pending amount can change slightly when it posts",
                ],
            },
            {
                kind: "note",
                severity: "info",
                text: "Pending entries are marked in the ledger and cannot be annotated until they post.",
            },
        ],
    },
    {
        slug: "download-a-statement",
        title: "Download a statement",
        summary: "Get an official statement for any account and month.",
        category: "statements",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "Statements are produced for every account at the end of each month and kept for as long as the workspace exists.",
            },
            {
                kind: "steps",
                items: [
                    "Open Statements",
                    "Choose the account and the month",
                    "Select Download to save the PDF",
                ],
            },
            {
                kind: "note",
                severity: "info",
                text: "Accountants with access to the workspace can download statements without asking the owner.",
            },
        ],
    },
    {
        slug: "export-transactions",
        title: "Export transactions",
        summary: "Take entries out as a file for your accounting software.",
        category: "statements",
        updatedOn: "2026-09-28",
        body: [
            {
                kind: "p",
                text: "An export collects entries for the accounts and period you choose into a single file.",
            },
            {
                kind: "steps",
                items: [
                    "Open Exports",
                    "Choose accounts, a date range and a file format",
                    "Start the export",
                    "Download the file from Exports when it is ready",
                ],
            },
            {
                kind: "note",
                severity: "info",
                text: "Large exports are prepared in the background. You can leave the page and come back to them.",
            },
        ],
    },
];
