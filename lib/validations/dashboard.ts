import { z } from "zod";
import {
    accountResponseDtoSchema,
    cashFlowSeriesResponseDtoSchema,
    moneyDtoSchema,
} from "@/lib/contract/schemas";
import {
    EXPORT_STATES,
    TRANSACTION_STATUSES,
    VERIFICATION_STATES,
} from "@/lib/enums/ledger";
import { DEFAULT_CASH_FLOW_RANGE } from "@/lib/dashboard/constants";

const id = z.string().min(1);

export const cashFlowRangeSchema = cashFlowSeriesResponseDtoSchema.shape.range;

export const cashFlowQuerySchema = z.object({
    range: cashFlowRangeSchema,
    currency: z.string().length(3).optional(),
});

export const dashboardSearchParamsSchema = z.object({
    range: cashFlowRangeSchema.catch(DEFAULT_CASH_FLOW_RANGE),
    currency: z
        .string()
        .regex(/^[A-Z]{3}$/)
        .optional()
        .catch(undefined),
});

export const accountListSchema = z.object({
    items: z.array(accountResponseDtoSchema),
    asOf: z.string(),
});

export const cashPositionSchema = z.object({
    currency: z.string(),
    available: moneyDtoSchema,
    current: moneyDtoSchema,
    netToday: moneyDtoSchema.nullable(),
    trend: z.array(z.object({ date: z.string(), closing: moneyDtoSchema })),
    asOf: z.string(),
    includesFrozen: z.boolean(),
});

export const transactionSchema = z.object({
    id,
    accountId: id,
    postedAt: z.iso.date().nullable(),
    createdAt: z.iso.datetime(),
    amount: moneyDtoSchema,
    status: z.enum(TRANSACTION_STATUSES),
    description: z.string(),
    counterparty: z.object({ id, name: z.string() }).nullable(),
    category: z.string().nullable(),
    flagged: z.boolean(),
    hasAttachments: z.boolean(),
    reference: z.string(),
});

export const pendingGroupSchema = z.object({
    accountId: id,
    accountName: z.string(),
    count: z.number().int().positive(),
    total: moneyDtoSchema,
    oldestAt: z.iso.datetime(),
});

export const transactionListSchema = z.object({
    items: z.array(transactionSchema),
    pending: z.array(pendingGroupSchema),
});

export const transactionQuerySchema = z.object({
    limit: z.number().int().positive(),
    status: z.enum(TRANSACTION_STATUSES).optional(),
});

export const exportJobSchema = z.object({
    id,
    label: z.string(),
    state: z.enum(EXPORT_STATES),
    updatedAt: z.iso.datetime(),
});

export const exportListSchema = z.array(exportJobSchema);

export const infoRequestSchema = z.object({
    id,
    message: z.string().max(1_000),
    fieldRef: z.string().nullable(),
    createdAt: z.iso.datetime(),
});

export const verificationCaseSchema = z.object({
    id,
    reference: z.string(),
    state: z.enum(VERIFICATION_STATES),
    requests: z.array(infoRequestSchema),
});
