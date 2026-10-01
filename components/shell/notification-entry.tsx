"use client";
import Link from "next/link";
import { Notification } from "@carbon/icons-react";
import { NOTIFICATIONS_ROUTE } from "@/lib/constants";
import { SHELL_COPY } from "@/lib/data/shell";
import { useNotificationCount } from "@/lib/hooks/use-notifications";
import { unreadBadge } from "@/lib/utils/unread";

const COPY = SHELL_COPY.notifications;

export default function NotificationEntry() {
    const unread = useNotificationCount().data?.unread;
    const badge = unreadBadge(unread);

    return (
        <Link
            href={NOTIFICATIONS_ROUTE}
            aria-label={badge && unread ? COPY.unread(unread) : COPY.label}
            className="text-text-secondary hover:text-text focus-visible:outline-accent relative inline-flex size-9 shrink-0 items-center justify-center rounded-md focus-visible:outline-2"
        >
            <Notification aria-hidden className="size-5" />
            {badge ? (
                <span
                    aria-hidden
                    className="bg-accent text-text-inverse text-caption absolute -top-0.5 -right-1 rounded-full px-1.5 font-semibold"
                >
                    {badge}
                </span>
            ) : null}
        </Link>
    );
}
