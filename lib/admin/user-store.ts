import "server-only";
import { nanoid } from "nanoid";
import { ADMIN_USERS_CLIENT_LIMIT } from "@/lib/admin/constants";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import type { CreateUserDto } from "@/lib/contract/schemas";
import { ADMIN_USER_SEED } from "@/lib/data/admin/user-directory";
import type { ActionResult, AdminUser, AdminUserList } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { newestFirst } from "@/lib/utils/admin-users";

const users: AdminUser[] = structuredClone([...ADMIN_USER_SEED]);

const created = new Map<string, AdminUser>();

export const listStoredUsers = (): AdminUserList => {
    const ordered = newestFirst(users);

    return {
        items: ordered.slice(0, ADMIN_USERS_CLIENT_LIMIT),
        total: ordered.length,
        asOf: new Date().toISOString(),
    };
};

export const addStoredUser = (
    input: CreateUserDto,
    idempotencyKey: string,
): ActionResult<AdminUser> => {
    const earlier = created.get(idempotencyKey);
    if (earlier) return { ok: true, data: earlier };

    const email = input.email.toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === email)) {
        return refusal(HTTP_STATUS.conflict, REQUEST_FAILED);
    }

    const at = new Date().toISOString();
    const user: AdminUser = {
        id: `usr_${nanoid()}`,
        fullName: input.fullName,
        email: input.email,
        phoneNumber: input.phoneNumber ?? null,
        avatar: null,
        bio: input.bio ?? null,
        role: input.role ?? "USER",
        status: "PENDING",
        createdAt: at,
        updatedAt: at,
        lastActive: null,
    };
    users.push(user);
    created.set(idempotencyKey, user);

    return { ok: true, data: user };
};
