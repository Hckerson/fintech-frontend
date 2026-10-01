"use server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { guardPayees } from "@/lib/payments/guard";
import { renameStoredPayee } from "@/lib/payments/payee-store";
import type { ActionResult, Payee, PayeeRename } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { payeeRenameSchema } from "@/lib/validations/payees";

export const renamePayee = async (
    input: PayeeRename,
): Promise<ActionResult<Payee>> => {
    const session = await guardPayees("payee_rename");
    if ("ok" in session) return session;

    const parsed = payeeRenameSchema.safeParse(input);
    return parsed.success
        ? renameStoredPayee(parsed.data)
        : refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
};
