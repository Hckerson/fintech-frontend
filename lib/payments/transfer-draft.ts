import { parseAmount } from "@/lib/payments/amount";
import { TRANSFER_MEMO_MAX } from "@/lib/payments/transfer-constants";
import { destinationOf, sourceRefusal } from "@/lib/payments/transfer-rules";
import type {
    Payee,
    TransferCheck,
    TransferDraft,
    TransferOptions,
} from "@/lib/types";
import { fractionDigits } from "@/lib/utils/money";

export const checkDraft = (
    draft: TransferDraft,
    options: TransferOptions,
    payees: readonly Payee[],
): TransferCheck => {
    const issues: TransferCheck["issues"] = {};
    const from = options.accounts.find(({ id }) => id === draft.fromAccountId);
    const targetId = draft.kind === "payee" ? draft.payeeId : draft.accountId;
    const memo = draft.memo.trim();
    const amount = from
        ? parseAmount(draft.amount, fractionDigits(from.currency))
        : null;

    if (!from) issues.from = "required";
    if (!targetId) issues.to = "required";
    if (!amount) issues.amount = "amount";
    if (memo.length > TRANSFER_MEMO_MAX) issues.memo = "memo";
    if (!from || !targetId || !amount || issues.memo) {
        return { issues, review: null };
    }

    const input = {
        fromAccountId: from.id,
        destination:
            draft.kind === "payee"
                ? ({ kind: "payee", payeeId: targetId } as const)
                : ({ kind: "account", accountId: targetId } as const),
        amountMinor: amount.toString(),
        currency: from.currency,
        memo: memo || null,
        settlesOn: options.settlesOn,
    };
    const to = destinationOf(
        input,
        options.accounts,
        payees.find(({ id }) => id === targetId),
    );
    const refused = sourceRefusal(from, input, options);

    if (typeof to === "string") issues.to = to;
    if (refused === "source_unavailable") issues.from = refused;
    else if (refused) issues.amount = refused;

    return typeof to === "string" || refused
        ? { issues, review: null }
        : { issues, review: { input, from, to } };
};
