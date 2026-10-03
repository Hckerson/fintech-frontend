"use server";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import { ACCOUNT_NUMBERS_SEED } from "@/lib/data/ledger/accounts";
import { guardReveal } from "@/lib/ledger/guard";
import type { AccountNumber, ActionResult } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { serverEnv } from "@/lib/utils/server-env";
import { accountNumberSchema } from "@/lib/validations/accounts";

export const revealAccountNumber = async (
    accountId: string,
): Promise<ActionResult<AccountNumber>> => {
    const session = await guardReveal(true);
    if ("ok" in session) return session;

    const found = accountNumberSchema.safeParse({
        accountId,
        number: serverEnv.liveData
            ? undefined
            : ACCOUNT_NUMBERS_SEED[accountId],
    });
    return found.success
        ? { ok: true, data: found.data }
        : refusal(HTTP_STATUS.notFound, REQUEST_FAILED);
};
