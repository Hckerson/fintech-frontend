"use server";
import { createUser } from "@/lib/actions/create-user";
import { guardPlatform } from "@/lib/admin/guard";
import { addStoredUser } from "@/lib/admin/user-store";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import type { CreateUserDto } from "@/lib/contract/schemas";
import type { ActionResult, AdminUser } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { serverEnv } from "@/lib/utils/server-env";
import { createUserFormSchema } from "@/lib/validations/admin-users";

export const createAdminUser = async (
    input: CreateUserDto,
    idempotencyKey: string,
): Promise<ActionResult<AdminUser>> => {
    if (serverEnv.liveData) return createUser(input, idempotencyKey);

    const refused = await guardPlatform("admin");
    if (refused) return refused;

    const parsed = createUserFormSchema.safeParse(input);
    return parsed.success
        ? addStoredUser(parsed.data, idempotencyKey)
        : refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
};
