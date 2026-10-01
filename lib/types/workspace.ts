import type { ReactNode } from "react";
import type { z } from "zod";
import type { CAPABILITY_ROLES, WORKSPACE_ROLES } from "@/lib/data/permissions";
import type { SEVERITIES, VERIFICATION_STATES } from "@/lib/enums/ledger";
import type {
    notificationCountSchema,
    workspaceSchema,
} from "@/lib/validations/workspace";

export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export type Capability = keyof typeof CAPABILITY_ROLES;

export type VerificationState = (typeof VERIFICATION_STATES)[number];

export type Severity = (typeof SEVERITIES)[number];

export type Workspace = z.infer<typeof workspaceSchema>;

export type NotificationCount = z.infer<typeof notificationCountSchema>;

export interface WorkspaceMember {
    id: string;
    email: string;
}

export interface WorkspaceContextValue {
    workspace: Workspace;
    member: WorkspaceMember;
    moneyMovement: boolean;
    can: (capability: Capability) => boolean;
}

export type WorkspaceNavIcon =
    | "dashboard"
    | "accounts"
    | "transactions"
    | "payments"
    | "statements"
    | "exports"
    | "insights"
    | "notifications"
    | "messages"
    | "settings"
    | "help";

export type WorkspaceNavGroup =
    | "overview"
    | "money"
    | "documents"
    | "insights"
    | "inbox"
    | "settings"
    | "secondary";

export interface WorkspaceNavItem {
    id: WorkspaceNavIcon;
    label: string;
    href: string;
    hrefByRole?: Partial<Record<WorkspaceRole, string>>;
    also?: readonly string[];
    group: WorkspaceNavGroup;
    capability: Capability | null;
    counted?: boolean;
    moneyMovement?: boolean;
}

export interface StatusCopy {
    label: string;
    severity: Severity;
}

export interface Crumb {
    label: string;
    href?: string;
}

export type SessionEvent = "signed-out" | "workspace-switched";

export interface ShellNavEntry {
    id: string;
    label: string;
    href: string;
    icon: ReactNode;
    count?: string;
    countLabel?: string;
}

export interface ShellNavSection {
    id: string;
    label: string;
    showLabel: boolean;
    pinned?: boolean;
    items: ShellNavEntry[];
}
