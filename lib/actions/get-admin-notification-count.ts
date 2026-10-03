"use server";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import { ADMIN_NOTIFICATION_COUNT_SEED } from "@/lib/data/admin/notifications";
import type { ActionResult, NotificationCount } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { platformRoleOf } from "@/lib/utils/platform-role";
import { getSession } from "@/lib/utils/session";
import { notificationCountSchema } from "@/lib/validations/workspace";

export const getAdminNotificationCount = async (): Promise<
    ActionResult<NotificationCount>
> => {
    if (!platformRoleOf(await getSession())) {
        return refusal(HTTP_STATUS.forbidden, REQUEST_FAILED);
    }

    const parsed = notificationCountSchema.safeParse(
        ADMIN_NOTIFICATION_COUNT_SEED,
    );
    return parsed.success
        ? { ok: true, data: parsed.data }
        : refusal(HTTP_STATUS.badGateway, REQUEST_FAILED);
};
