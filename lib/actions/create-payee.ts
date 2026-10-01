"use server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { guardPayees } from "@/lib/payments/guard";
import { addStoredPayee } from "@/lib/payments/payee-store";
import type { ActionResult, Payee, PayeeCreate } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { payeeCreateSchema } from "@/lib/validations/payees";

export const createPayee = async (
    input: PayeeCreate,
): Promise<ActionResult<Payee>> => {
    const session = await guardPayees("payee_add");
    if ("ok" in session) return session;

    const parsed = payeeCreateSchema.safeParse(input);
    return parsed.success
        ? addStoredPayee(parsed.data)
        : refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
};
