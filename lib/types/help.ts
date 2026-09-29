export type HelpCategoryId =
    "start" | "accounts" | "ledger" | "statements" | "team" | "security";

export type HelpCategoryIcon =
    "start" | "wallet" | "table" | "document" | "team" | "lock";

export type HelpNoteSeverity = "info" | "warning";

export type HelpBlock =
    | { kind: "p"; text: string }
    | { kind: "list"; items: readonly string[] }
    | { kind: "steps"; items: readonly string[] }
    | { kind: "note"; severity: HelpNoteSeverity; text: string };

export interface HelpCategory {
    id: HelpCategoryId;
    title: string;
    description: string;
    icon: HelpCategoryIcon;
}

export interface HelpArticle {
    slug: string;
    title: string;
    summary: string;
    category: HelpCategoryId;
    body: readonly HelpBlock[];
    updatedOn: string;
}

export interface HelpGroup {
    category: HelpCategory;
    articles: readonly HelpArticle[];
}
