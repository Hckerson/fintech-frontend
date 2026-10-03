import { z } from "zod";
import {
    ADMIN_USER_NAME_MAX,
    ADMIN_USER_QUERY_MAX,
    ADMIN_USER_QUERY_MIN,
} from "@/lib/admin/constants";
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from "@/lib/auth/constants";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import {
    createUserDtoSchema,
    userResponseDtoSchema,
} from "@/lib/contract/schemas";

export const userRoleSchema = userResponseDtoSchema.shape.role;

export const userStatusSchema = userResponseDtoSchema.shape.status;

export const adminUsersSearchParamsSchema = z.object({
    q: z
        .string()
        .trim()
        .min(ADMIN_USER_QUERY_MIN)
        .max(ADMIN_USER_QUERY_MAX)
        .optional()
        .catch(undefined),
    role: userRoleSchema.optional().catch(undefined),
    status: userStatusSchema.optional().catch(undefined),
});

export const adminUserListSchema = z.array(userResponseDtoSchema);

export const createUserFormSchema = createUserDtoSchema
    .pick({ fullName: true, email: true, password: true })
    .extend({
        fullName: z.string().trim().min(1).max(ADMIN_USER_NAME_MAX),
        email: z.email().max(EMAIL_MAX_LENGTH),
        password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
        role: userRoleSchema,
    });
