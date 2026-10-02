import "server-only";
import { getAccounts } from "@/lib/actions/get-accounts";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import { settlementDay } from "@/lib/payments/settlement";
import {
    TRANSFER_CUT_OFF_HOUR,
    TRANSFER_PER_TRANSFER_LIMIT_MINOR,
} from "@/lib/payments/transfer-constants";
import { dailyRemaining, heldOn } from "@/lib/payments/transfer-store";
import type { ActionResult, TransferOptions } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { currentWorkspace } from "@/lib/utils/current-workspace";
import { transferOptionsSchema } from "@/lib/validations/transfers";

export const readTransferOptions = async (
    userId: string,
): Promise<ActionResult<TransferOptions>> => {
    const [accounts, workspace] = await Promise.all([
        getAccounts(),
        currentWorkspace(),
    ]);
    if (!accounts.ok) return accounts;
    if (!workspace) return refusal(HTTP_STATUS.forbidden, REQUEST_FAILED);

    const now = new Date();
    const today = settlementDay(now, workspace.timeZone);
    const options = transferOptionsSchema.safeParse({
        accounts: accounts.data.items.map((account) => ({
            id: account.id,
            name: account.name,
            last4: account.last4,
            currency: account.currency,
            availableMinor: (
                BigInt(account.available.amountMinor) - heldOn(account.id)
            ).toString(),
            state: account.state,
        })),
        limits: {
            perTransferMinor: TRANSFER_PER_TRANSFER_LIMIT_MINOR,
            dailyRemainingMinor: dailyRemaining(userId, today).toString(),
        },
        settlesOn: today,
        cutOffHour: TRANSFER_CUT_OFF_HOUR,
        timeZone: workspace.timeZone,
        asOf: now.toISOString(),
    });

    return options.success
        ? { ok: true, data: options.data }
        : refusal(HTTP_STATUS.badGateway, REQUEST_FAILED);
};
