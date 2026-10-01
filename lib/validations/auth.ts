import { z } from "zod";
import {
    EMAIL_MAX_LENGTH,
    PASSWORD_MAX_LENGTH,
    RECOVERY_CODE_MAX_LENGTH,
    VERIFY_CODE_LENGTH,
} from "@/lib/auth/constants";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { loginDtoSchema, registerDtoSchema } from "@/lib/contract/schemas";

const credentials = {
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
};

export const loginSchema = loginDtoSchema.extend(credentials);

export const registerSchema = registerDtoSchema.extend(credentials);

export const forgotSchema = z.object({
    email: z.string().trim().email().max(EMAIL_MAX_LENGTH),
});

export const resetSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

export const resetFormSchema = resetSchema
    .extend({ confirm: z.string() })
    .refine((values) => values.password === values.confirm, {
        path: ["confirm"],
    });

export const challengeSchema = z.object({ challenge: z.string().min(1) });

export const verifySchema = z.discriminatedUnion("method", [
    challengeSchema.extend({
        method: z.literal("code"),
        code: z.string().regex(new RegExp(`^\\d{${VERIFY_CODE_LENGTH}}$`)),
    }),
    challengeSchema.extend({
        method: z.literal("recovery"),
        code: z.string().trim().min(1).max(RECOVERY_CODE_MAX_LENGTH),
    }),
    challengeSchema.extend({
        method: z.literal("passkey"),
        assertion: z.record(z.string(), z.unknown()),
    }),
]);

export const challengeEnvelopeSchema = z.object({ data: challengeSchema });

export const verifyResultSchema = z.object({
    data: z.object({
        recoveryCodesRemaining: z.number().int().nonnegative().optional(),
    }),
});

export const verifyRefusalSchema = z.object({
    attemptsRemaining: z.number().int().nonnegative(),
});

export const passkeyOptionsSchema = z.object({
    data: z.record(z.string(), z.unknown()),
});

export type ForgotValues = z.infer<typeof forgotSchema>;
export type ResetValues = z.infer<typeof resetSchema>;
export type VerifyValues = z.infer<typeof verifySchema>;
