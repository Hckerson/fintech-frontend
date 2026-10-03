import { z } from "zod";
import { MINOR_UNITS_PATTERN } from "@/lib/payments/constants";
import {
    OPAQUE_ID_PATTERN,
    TRANSFER_ACCOUNT_STATES,
    TRANSFER_MEMO_MAX,
} from "@/lib/payments/transfer-constants";

const id = z.string().regex(OPAQUE_ID_PATTERN);

const minor = z.string().regex(MINOR_UNITS_PATTERN);

const currency = z.string().length(3);

const party = z.object({ name: z.string().min(1), last4: z.string().min(1) });

export const transferSearchParamsSchema = z.object({
    payeeId: id.optional().catch(undefined),
});

export const transferKeySchema = id;

export const transferInputSchema = z.object({
    fromAccountId: id,
    destination: z.discriminatedUnion("kind", [
        z.object({ kind: z.literal("payee"), payeeId: id }),
        z.object({ kind: z.literal("account"), accountId: id }),
    ]),
    amountMinor: minor.refine((value) => BigInt(value) > BigInt(0)),
    currency,
    memo: z.string().trim().max(TRANSFER_MEMO_MAX).nullable(),
    settlesOn: z.iso.date(),
    idempotencyKey: id,
});

export const transferAccountSchema = z.object({
    id,
    name: z.string().min(1),
    last4: z.string().min(1),
    currency,
    availableMinor: z.string().regex(/^-?\d+$/),
    state: z.enum(TRANSFER_ACCOUNT_STATES),
});

export const transferOptionsSchema = z.object({
    accounts: z.array(transferAccountSchema),
    limits: z.object({
        perTransferMinor: minor,
        dailyLimitMinor: minor,
        dailyRemainingMinor: minor,
    }),
    settlesOn: z.iso.date(),
    cutOffHour: z.number().int().min(0).max(23),
    timeZone: z.string().min(1),
    asOf: z.iso.datetime(),
});

export const transferSchema = z.object({
    id,
    reference: z.string().min(1),
    status: z.literal("pending"),
    amountMinor: minor,
    currency,
    fromAccountId: id,
    from: party,
    to: party,
    memo: z.string().nullable(),
    settlesOn: z.iso.date(),
    createdAt: z.iso.datetime(),
});
