"use client";
import NotificationLink from "@/components/shell/notification-link";
import { useAdminNotificationCount } from "@/lib/hooks/use-admin-notifications";

export default function AdminNotificationEntry() {
    return (
        <NotificationLink unread={useAdminNotificationCount().data?.unread} />
    );
}
