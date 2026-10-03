"use server";
import { ADMIN_USERS_CLIENT_LIMIT } from "@/lib/admin/constants";
import { guardPlatform } from "@/lib/admin/guard";
import { listStoredUsers } from "@/lib/admin/user-store";
import { readStamped } from "@/lib/api-server";
import { routes } from "@/lib/contract/routes";
import type { ActionResult, AdminUserList } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { newestFirst } from "@/lib/utils/admin-users";
import { serverEnv } from "@/lib/utils/server-env";
import { adminUserListSchema } from "@/lib/validations/admin-users";

export const listAdminUsers = async (): Promise<
    ActionResult<AdminUserList>
> => {
    if (!serverEnv.liveData) {
        const refused = await guardPlatform("admin");
        return refused ?? { ok: true, data: listStoredUsers() };
    }

    const result = await readStamped(
        routes.usersFindAll(),
        adminUserListSchema,
    );
    if (!result.ok) return refusal(result.status, result.message);

    const users = newestFirst(result.data.data);
    return {
        ok: true,
        data: {
            items: users.slice(0, ADMIN_USERS_CLIENT_LIMIT),
            total: users.length,
            asOf: result.data.asOf,
        },
    };
};
