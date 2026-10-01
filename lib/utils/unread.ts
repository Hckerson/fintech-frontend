import { NOTIFICATION_COUNT_CAP } from "@/lib/workspace/constants";

export const unreadBadge = (unread: number | undefined): string | undefined =>
    !unread
        ? undefined
        : unread > NOTIFICATION_COUNT_CAP
          ? `${NOTIFICATION_COUNT_CAP}+`
          : String(unread);
