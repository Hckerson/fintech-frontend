import { z } from "zod";
import {
    ACCOUNT_NUMBER_LENGTH,
    DESTINATION_VISIBLE_DIGITS,
    MINOR_UNITS_PATTERN,
    PAYEE_FILTERS,
    PAYEE_NAME_MAX,
    PAYEE_PAYMENT_STATUSES,
    PAYEE_SEARCH_MAX,
    PAYEE_SORTS,
    PAYEE_STATUSES,
    SORT_CODE_LENGTH,
    STEP_UP_PURPOSES,
} from "@/lib/payments/constants";
import { loginSchema } from "@/lib/validations/auth";

const digits = (length: number) =>
    z
        .string()
        .transform((value) => value.replace(/[\s-]/g, ""))
        .pipe(z.string().regex(new RegExp(`^\\d{${length}}$`)));

const id = z.string().min(1);

const count = z.number().int().nonnegative();

const name = z.string().trim().min(1).max(PAYEE_NAME_MAX);

export const payeeSchema = z.object({
    id,
    name,
    destinationLast4: digits(DESTINATION_VISIBLE_DIGITS),
    bankName: z.string().nullable(),
    lastPaidAt: z.iso.datetime().nullable(),
    totalPaid: z.array(
        z.object({
            currency: z.string().length(3),
            amountMinor: z.string().regex(MINOR_UNITS_PATTERN),
        }),
    ),
    status: z.enum(PAYEE_STATUSES),
    paymentInProgress: z.boolean(),
    updatedAt: z.iso.datetime(),
});

export const payeePageSchema = z.object({
    items: z.array(payeeSchema),
    nextCursor: z.string().nullable(),
    asOf: z.iso.datetime(),
    matched: count,
    summary: z.object({
        total: count,
        active: count,
        pendingVerification: count,
        inProgress: count,
    }),
});

export const payeeQuerySchema = z.object({
    search: z.string().trim().max(PAYEE_SEARCH_MAX),
    status: z.enum(PAYEE_FILTERS),
    sort: z.enum(PAYEE_SORTS),
    cursor: z.string().nullable(),
});

export const payeeIdSchema = id;

export const payeeActivitySchema = z.object({
    items: z.array(
        z.object({
            id,
            paidAt: z.iso.datetime(),
            amountMinor: z.string().regex(MINOR_UNITS_PATTERN),
            currency: z.string().length(3),
            reference: z.string(),
            status: z.enum(PAYEE_PAYMENT_STATUSES),
        }),
    ),
    asOf: z.iso.datetime(),
});

export const payeeInputSchema = z.object({
    name,
    sortCode: digits(SORT_CODE_LENGTH),
    accountNumber: digits(ACCOUNT_NUMBER_LENGTH),
});

export const payeeCreateSchema = z.object({
    input: payeeInputSchema,
    idempotencyKey: id,
});

export const payeeVersionSchema = payeeSchema.pick({
    id: true,
    updatedAt: true,
});

export const payeeRenameSchema = payeeVersionSchema.extend({ name });

export const stepUpSchema = z.object({
    purpose: z.enum(STEP_UP_PURPOSES),
    password: loginSchema.shape.password,
});
