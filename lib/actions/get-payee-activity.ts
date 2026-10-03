"use server";
import { HTTP_STATUS, INVALID_REQUEST, REQUEST_FAILED } from "@/lib/constants";
import { SEED_PAYEE_PAYMENTS } from "@/lib/data/payments/payee-payments";
import { guardPayees } from "@/lib/payments/guard";
import { findStoredPayee } from "@/lib/payments/payee-store";
import type { ActionResult, PayeeActivity } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { payeeActivitySchema, payeeIdSchema } from "@/lib/validations/payees";

export const getPayeeActivity = async (
    payeeId: string,
): Promise<ActionResult<PayeeActivity>> => {
    const session = await guardPayees();
    if ("ok" in session) return session;

    const id = payeeIdSchema.safeParse(payeeId);
    if (!id.success) return refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
    if (!findStoredPayee(id.data)) {
        return refusal(HTTP_STATUS.notFound, REQUEST_FAILED);
    }

    return {
        ok: true,
        data: payeeActivitySchema.parse({
            items: SEED_PAYEE_PAYMENTS[id.data] ?? [],
            asOf: new Date().toISOString(),
        }),
    };
};
