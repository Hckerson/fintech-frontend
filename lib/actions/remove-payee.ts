"use server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { guardPayees } from "@/lib/payments/guard";
import { removeStoredPayee } from "@/lib/payments/payee-store";
import type { ActionResult, Payee, PayeeVersion } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { payeeVersionSchema } from "@/lib/validations/payees";

export const removePayee = async (
    input: PayeeVersion,
): Promise<ActionResult<Payee>> => {
    const session = await guardPayees("payee_remove");
    if ("ok" in session) return session;

    const parsed = payeeVersionSchema.safeParse(input);
    return parsed.success
        ? removeStoredPayee(parsed.data)
        : refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
};
