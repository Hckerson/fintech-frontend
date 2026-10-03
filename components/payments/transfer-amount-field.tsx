"use client";
import Field from "@/components/ui/field";
import TextInput from "@/components/ui/text-input";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import { parseAmount } from "@/lib/payments/amount";
import type { TransferAccount } from "@/lib/types";
import { formatMoney, fractionDigits } from "@/lib/utils/money";

interface Props {
    source: TransferAccount | undefined;
    value: string;
    error: string | undefined;
    onChange: (amount: string) => void;
}

const COPY = TRANSFER_COPY.form;

const hintFor = (source: TransferAccount, value: string) => {
    const available = BigInt(source.availableMinor);
    const amount = parseAmount(value, fractionDigits(source.currency));
    const money = (minor: bigint) =>
        formatMoney(minor.toString(), source.currency) ?? "";

    return amount && amount <= available
        ? COPY.leaves(money(available - amount))
        : COPY.available(money(available));
};

export default function TransferAmountField({
    source,
    value,
    error,
    onChange,
}: Props) {
    return (
        <Field
            label={COPY.amount}
            hint={error || !source ? undefined : hintFor(source, value)}
            error={error}
        >
            {(control) => (
                <span className="relative block">
                    <TextInput
                        {...control}
                        name="amount"
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="0.00"
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        className="h-12 pr-14 text-lg tabular-nums"
                    />
                    <span className="text-text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs">
                        {source?.currency}
                    </span>
                </span>
            )}
        </Field>
    );
}
