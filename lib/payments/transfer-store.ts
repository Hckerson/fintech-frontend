import "server-only";
import { customAlphabet, nanoid } from "nanoid";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import { IDEMPOTENCY_WINDOW_MS } from "@/lib/payments/constants";
import {
    TRANSFER_DAILY_LIMIT_MINOR,
    TRANSFER_KEY_REUSED,
    TRANSFER_REFERENCE_ALPHABET,
    TRANSFER_REFERENCE_LENGTH,
    TRANSFER_REFERENCE_PREFIX,
} from "@/lib/payments/transfer-constants";
import type {
    ActionResult,
    Transfer,
    TransferAccount,
    TransferInput,
    TransferParty,
} from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { transferSchema } from "@/lib/validations/transfers";

const ZERO = BigInt(0);

const referenceCode = customAlphabet(
    TRANSFER_REFERENCE_ALPHABET,
    TRANSFER_REFERENCE_LENGTH,
);

const transfers = new Map<
    string,
    { fingerprint: string; userId: string; at: number; transfer: Transfer }
>();

const holds = new Map<string, bigint>();

const spent = new Map<string, bigint>();

const fingerprintOf = (input: TransferInput) =>
    JSON.stringify({ ...input, idempotencyKey: undefined });

const spendKey = (userId: string, day: string) => `${userId}:${day}`;

export const heldOn = (accountId: string) => holds.get(accountId) ?? ZERO;

export const dailyRemaining = (userId: string, day: string) => {
    const left =
        BigInt(TRANSFER_DAILY_LIMIT_MINOR) -
        (spent.get(spendKey(userId, day)) ?? ZERO);
    return left > ZERO ? left : ZERO;
};

export const findTransfer = (key: string, userId: string): Transfer | null => {
    const earlier = transfers.get(key);
    return earlier?.userId === userId &&
        new Date().getTime() - earlier.at < IDEMPOTENCY_WINDOW_MS
        ? earlier.transfer
        : null;
};

export const replayTransfer = (
    input: TransferInput,
    userId: string,
): ActionResult<Transfer> | null => {
    if (!findTransfer(input.idempotencyKey, userId)) return null;

    const earlier = transfers.get(input.idempotencyKey);
    return earlier?.fingerprint === fingerprintOf(input)
        ? { ok: true, data: earlier.transfer }
        : refusal(HTTP_STATUS.conflict, REQUEST_FAILED, TRANSFER_KEY_REUSED);
};

export const recordTransfer = (
    input: TransferInput,
    from: TransferAccount,
    to: TransferParty,
    userId: string,
    day: string,
): Transfer => {
    const amount = BigInt(input.amountMinor);
    const transfer = transferSchema.parse({
        id: `trf_${nanoid()}`,
        reference: `${TRANSFER_REFERENCE_PREFIX}${referenceCode()}`,
        status: "pending",
        amountMinor: input.amountMinor,
        currency: input.currency,
        fromAccountId: from.id,
        from: { name: from.name, last4: from.last4 },
        to,
        memo: input.memo,
        settlesOn: input.settlesOn,
        createdAt: new Date().toISOString(),
    });

    holds.set(from.id, heldOn(from.id) + amount);
    spent.set(
        spendKey(userId, day),
        (spent.get(spendKey(userId, day)) ?? ZERO) + amount,
    );
    transfers.set(input.idempotencyKey, {
        fingerprint: fingerprintOf(input),
        userId,
        at: new Date().getTime(),
        transfer,
    });
    return transfer;
};
