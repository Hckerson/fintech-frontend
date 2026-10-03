import {
    ADMIN_USERS_CLIENT_LIMIT,
    ADMIN_USER_QUERY_MIN,
} from "@/lib/admin/constants";
import { PAGE_TITLES, PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { ADMIN_AREA } from "@/lib/data/admin-nav";
import type { AdminUser, StatusCopy } from "@/lib/types";

export const USER_ROLE_LABELS: Record<AdminUser["role"], StatusCopy> = {
    ADMIN: { label: "Admin", severity: "information" },
    USER: { label: "User", severity: "neutral" },
};

export const USER_STATUS_LABELS: Record<AdminUser["status"], StatusCopy> = {
    ACTIVE: { label: "Active", severity: "positive" },
    PENDING: { label: "Pending", severity: "attention" },
    SUSPENDED: { label: "Suspended", severity: "problem" },
};

export const ADMIN_USERS_COPY = {
    metaTitle: `${PAGE_TITLES.adminUsers} · ${ADMIN_AREA.name}`,
    section: "Platform user directory",
    create: "Create user",
    loading: "Loading users",
    offline:
        "You're offline. Creating a user is unavailable until you reconnect.",
    search: {
        label: "Search users by name or email",
        placeholder: "Search name or email",
        hint: `Type at least ${ADMIN_USER_QUERY_MIN} characters.`,
    },
    filters: {
        role: "Role",
        status: "Status",
        anyRole: "All roles",
        anyStatus: "All statuses",
        clear: "Clear",
    },
    columns: {
        user: "User",
        role: "Role",
        status: "Status",
        created: "Created (UTC)",
        actions: "Actions",
    },
    caption: (shown: number, matched: number) =>
        `Platform users, newest first. Showing ${shown} of ${matched}.`,
    showing: (shown: string, matched: string) =>
        `Showing ${shown} of ${matched}`,
    matched: (matched: string, total: string) =>
        `Users matching: ${matched} of ${total}.`,
    loadMore: "Load more",
    capped: (limit: string, total: string) =>
        `Showing the newest ${limit} of ${total} users. Older users need server search, which the backend does not offer yet.`,
    actions: {
        menu: (name: string) => `Actions for ${name}`,
        open: "Open user",
        copyId: "Copy user ID",
        copied: (name: string) => `User ID for ${name} copied.`,
        copyFailed: "The user ID could not be copied on this device.",
    },
    created: (name: string) => `User created: ${name}.`,
    dialog: {
        title: "Create a user",
        lead: "The person signs in with this email and password. The password is not shown again after you create the user.",
        submit: "Create user",
        cancel: "Cancel",
        fields: {
            fullName: { label: "Full name" },
            email: { label: "Email" },
            password: {
                label: "Password",
                hint: `At least ${PASSWORD_MIN_LENGTH} characters.`,
            },
            role: { label: "Role" },
        },
        errors: {
            fullName: "Enter the person's full name.",
            email: "Enter a valid email address.",
            password: `Use at least ${PASSWORD_MIN_LENGTH} characters.`,
            role: "Choose a role.",
            duplicate: "This email is already in use. Nothing was created.",
            refused:
                "The backend did not accept these details. Check them and try again.",
        },
        discard: {
            prompt: "Discard what you entered?",
            keep: "Keep editing",
            confirm: "Discard",
        },
    },
    limit: ADMIN_USERS_CLIENT_LIMIT,
} as const;
