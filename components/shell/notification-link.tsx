import Link from "next/link";
import { Notification } from "@carbon/icons-react";
import { NOTIFICATIONS_ROUTE } from "@/lib/constants";
import { SHELL_COPY } from "@/lib/data/shell";
import { unreadBadge } from "@/lib/utils/unread";

const COPY = SHELL_COPY.notifications;

export default function NotificationLink({ unread }: { unread?: number }) {
    const badge = unreadBadge(unread);

    return (
        <Link
            href={NOTIFICATIONS_ROUTE}
            aria-label={badge && unread ? COPY.unread(unread) : COPY.label}
            className="border-border text-text-secondary hover:border-border-dark hover:text-text focus-visible:outline-accent relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2"
        >
            <Notification aria-hidden className="size-4.5" />
            {badge ? (
                <span
                    aria-hidden
                    className="bg-accent text-text-inverse text-caption ring-background-alt absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 font-semibold tabular-nums ring-2"
                >
                    {badge}
                </span>
            ) : null}
        </Link>
    );
}
