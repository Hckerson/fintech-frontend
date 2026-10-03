"use client";
import Amount from "@/components/common/amount";
import StatusLabel from "@/components/ui/status-label";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import type { TransferAccount } from "@/lib/types";

interface Props {
    name: string;
    account: TransferAccount;
    checked: boolean;
    onChange: (accountId: string) => void;
}

const COPY = TRANSFER_COPY.option;

export default function TransferAccountOption({
    name,
    account,
    checked,
    onChange,
}: Props) {
    const open = account.state === "OPEN";

    return (
        <label className="border-border has-checked:border-accent has-checked:bg-background-muted has-focus-visible:ring-accent/40 hover:border-border-dark flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors has-focus-visible:ring-2 has-disabled:cursor-not-allowed has-disabled:opacity-60">
            <input
                type="radio"
                name={name}
                value={account.id}
                checked={checked}
                disabled={!open}
                onChange={() => onChange(account.id)}
                className="accent-accent size-4 shrink-0"
            />
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-text truncate text-sm font-medium">
                    {account.name}
                </span>
                <span className="text-text-muted text-xs">
                    <span aria-hidden className="font-mono">
                        ••{account.last4}
                    </span>
                    <span className="sr-only">
                        {COPY.ending(account.last4)}
                    </span>
                    {" · "}
                    {account.currency}
                </span>
            </span>
            {open ? (
                <Amount
                    amountMinor={account.availableMinor}
                    currency={account.currency}
                    label={TRANSFER_COPY.aside.available}
                    className="text-text shrink-0 text-sm tabular-nums"
                />
            ) : (
                <StatusLabel
                    label={COPY.states[account.state]}
                    severity="attention"
                />
            )}
        </label>
    );
}
