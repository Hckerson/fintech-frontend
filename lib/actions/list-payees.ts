"use server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { guardPayees } from "@/lib/payments/guard";
import { listStoredPayees } from "@/lib/payments/payee-store";
import type { ActionResult, PayeePage, PayeeQuery } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { payeeQuerySchema } from "@/lib/validations/payees";

export const listPayees = async (
    query: PayeeQuery,
): Promise<ActionResult<PayeePage>> => {
    const session = await guardPayees();
    if ("ok" in session) return session;

    const parsed = payeeQuerySchema.safeParse(query);
    return parsed.success
        ? { ok: true, data: listStoredPayees(parsed.data) }
        : refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
};
