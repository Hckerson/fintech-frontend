"use client";
import NotificationLink from "@/components/shell/notification-link";
import { useNotificationCount } from "@/lib/hooks/use-notifications";

export default function NotificationEntry() {
    return <NotificationLink unread={useNotificationCount().data?.unread} />;
}
