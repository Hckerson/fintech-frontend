import type {
    Payee,
    TransferAccount,
    TransferInput,
    TransferOptions,
    TransferParty,
    TransferRefusal,
} from "@/lib/types";

type Rules = Pick<TransferInput, "amountMinor" | "currency" | "settlesOn">;

export const sourceRefusal = (
    source: TransferAccount | undefined,
    { amountMinor, currency, settlesOn }: Rules,
    { limits, settlesOn: nextSettlement }: TransferOptions,
): TransferRefusal | null => {
    const amount = BigInt(amountMinor);

    if (!source || source.state !== "OPEN") return "source_unavailable";
    if (source.currency !== currency) return "currency_mismatch";
    if (amount > BigInt(source.availableMinor)) return "insufficient_funds";
    if (amount > BigInt(limits.perTransferMinor)) return "over_transfer_limit";
    if (amount > BigInt(limits.dailyRemainingMinor)) return "over_daily_limit";
    return settlesOn === nextSettlement ? null : "cut_off_passed";
};

export const destinationOf = (
    {
        destination,
        fromAccountId,
        currency,
    }: TransferInput | Omit<TransferInput, "idempotencyKey">,
    accounts: readonly TransferAccount[],
    payee: Pick<Payee, "name" | "destinationLast4" | "status"> | undefined,
): TransferParty | TransferRefusal => {
    if (destination.kind === "payee") {
        return payee?.status === "active"
            ? { name: payee.name, last4: payee.destinationLast4 }
            : "destination_unavailable";
    }

    const account = accounts.find(({ id }) => id === destination.accountId);
    if (
        !account ||
        account.id === fromAccountId ||
        account.state === "CLOSED"
    ) {
        return "destination_unavailable";
    }
    return account.currency === currency
        ? { name: account.name, last4: account.last4 }
        : "currency_mismatch";
};
