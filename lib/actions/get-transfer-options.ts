"use server";
import { guardMoney } from "@/lib/payments/guard";
import { readTransferOptions } from "@/lib/payments/transfer-options";
import type { ActionResult, TransferOptions } from "@/lib/types";

export const getTransferOptions = async (): Promise<
    ActionResult<TransferOptions>
> => {
    const session = await guardMoney("transferMoney");
    return "ok" in session ? session : readTransferOptions(session.sub);
};
