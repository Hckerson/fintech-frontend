export type NavIcon = "overview" | "users" | "compliance" | "support";

export interface ShellNavItem {
    id: string;
    label: string;
    href: string;
    icon: NavIcon;
}

export interface PaletteCommand {
    id: string;
    label: string;
    href: string;
    group: string;
}

export interface TabItem<TId extends string = string> {
    id: TId;
    label: string;
}

export interface EmptyStateCopy {
    title: string;
    body?: string;
    action?: { label: string; href: string };
}

export interface NotificationPreview {
    id: string;
    title: string;
    href: string;
    createdAt: string;
}

export interface NotificationSummary {
    unread: number;
    items: NotificationPreview[];
}

export interface Delta {
    direction: "up" | "down" | "flat";
    tenths: number;
}
