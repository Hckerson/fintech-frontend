"use server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { guardMoney } from "@/lib/payments/guard";
import { findTransfer } from "@/lib/payments/transfer-store";
import type { ActionResult, Transfer } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { transferKeySchema } from "@/lib/validations/transfers";

export const getTransferStatus = async (
    idempotencyKey: string,
): Promise<ActionResult<Transfer | null>> => {
    const session = await guardMoney("transferMoney");
    if ("ok" in session) return session;

    const key = transferKeySchema.safeParse(idempotencyKey);
    return key.success
        ? { ok: true, data: findTransfer(key.data, session.sub) }
        : refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
};
