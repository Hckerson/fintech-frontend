import "server-only";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import type { ActionFailure, PlatformRole } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { platformRoleOf } from "@/lib/utils/platform-role";
import { getSession } from "@/lib/utils/session";

export const guardPlatform = async (
    allow?: PlatformRole,
): Promise<ActionFailure | null> => {
    const role = platformRoleOf(await getSession());

    return role && (!allow || role === allow)
        ? null
        : refusal(HTTP_STATUS.forbidden, REQUEST_FAILED);
};
