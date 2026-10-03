"use client";
import Link from "next/link";
import { Copy, Launch, OverflowMenuVertical } from "@carbon/icons-react";
import { buttonClass } from "@/components/ui/button";
import Menu from "@/components/ui/menu";
import { adminUserRoute } from "@/lib/admin/constants";
import { ADMIN_USERS_COPY } from "@/lib/data/admin/users";
import type { AdminUser } from "@/lib/types";

interface Props {
    user: AdminUser;
    onCopied: (message: string) => void;
}

const COPY = ADMIN_USERS_COPY.actions;

export default function AdminUserActions({ user, onCopied }: Props) {
    const copyId = async () => {
        try {
            await navigator.clipboard.writeText(user.id);
            onCopied(COPY.copied(user.fullName));
        } catch {
            onCopied(COPY.copyFailed);
        }
    };

    return (
        <Menu
            label={COPY.menu(user.fullName)}
            align="end"
            triggerClassName={buttonClass("ghost", "sm", "w-8 px-0")}
            trigger={
                <OverflowMenuVertical aria-hidden className="size-4 shrink-0" />
            }
        >
            {(close) => (
                <>
                    <Link
                        href={adminUserRoute(user.id)}
                        role="menuitem"
                        onClick={close}
                    >
                        <Launch aria-hidden className="size-4 shrink-0" />
                        {COPY.open}
                    </Link>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            close();
                            void copyId();
                        }}
                    >
                        <Copy aria-hidden className="size-4 shrink-0" />
                        {COPY.copyId}
                    </button>
                </>
            )}
        </Menu>
    );
}
