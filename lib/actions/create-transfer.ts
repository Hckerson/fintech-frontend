"use server";
import { HTTP_STATUS, INVALID_REQUEST, REQUEST_FAILED } from "@/lib/constants";
import { guardMoney } from "@/lib/payments/guard";
import { findStoredPayee, markPayeePaying } from "@/lib/payments/payee-store";
import { takeGrant } from "@/lib/payments/step-up-store";
import { readTransferOptions } from "@/lib/payments/transfer-options";
import { destinationOf, sourceRefusal } from "@/lib/payments/transfer-rules";
import { recordTransfer, replayTransfer } from "@/lib/payments/transfer-store";
import { STEP_UP_REQUIRED } from "@/lib/query/constants";
import type { ActionResult, Transfer, TransferInput } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { transferInputSchema } from "@/lib/validations/transfers";

export const createTransfer = async (
    input: TransferInput,
): Promise<ActionResult<Transfer>> => {
    const session = await guardMoney("transferMoney");
    if ("ok" in session) return session;

    const parsed = transferInputSchema.safeParse(input);
    if (!parsed.success) {
        return refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
    }

    const transfer = parsed.data;
    const replay = replayTransfer(transfer, session.sub);
    if (replay) return replay;

    const options = await readTransferOptions(session.sub);
    if (!options.ok) return options;

    const { accounts, settlesOn } = options.data;
    const from = accounts.find(({ id }) => id === transfer.fromAccountId);
    const { destination } = transfer;
    const to = destinationOf(
        transfer,
        accounts,
        destination.kind === "payee"
            ? findStoredPayee(destination.payeeId)
            : undefined,
    );
    const refused =
        sourceRefusal(from, transfer, options.data) ??
        (typeof to === "string" ? to : null);

    if (!from || typeof to === "string" || refused) {
        return refusal(
            HTTP_STATUS.conflict,
            REQUEST_FAILED,
            refused ?? undefined,
        );
    }
    if (!takeGrant(session.sub, "transfer")) {
        return refusal(
            HTTP_STATUS.unauthorized,
            REQUEST_FAILED,
            STEP_UP_REQUIRED,
        );
    }
    if (destination.kind === "payee") markPayeePaying(destination.payeeId);

    return {
        ok: true,
        data: recordTransfer(transfer, from, to, session.sub, settlesOn),
    };
};
