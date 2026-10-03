"use client";
import { useId } from "react";
import TransferAccountOption from "@/components/payments/transfer-account-option";
import type { TransferAccount } from "@/lib/types";

interface Props {
    legend: string;
    name: string;
    accounts: readonly TransferAccount[];
    value: string;
    error: string | undefined;
    emptyText?: string;
    onChange: (accountId: string) => void;
}

export default function TransferAccountPicker({
    legend,
    name,
    accounts,
    value,
    error,
    emptyText,
    onChange,
}: Props) {
    const errorId = useId();

    return (
        <fieldset
            aria-describedby={error ? errorId : undefined}
            className="flex min-w-0 flex-col gap-2"
        >
            <legend className="text-text mb-2 text-sm font-medium">
                {legend}
            </legend>
            {accounts.length === 0 && emptyText ? (
                <p className="text-text-muted text-sm">{emptyText}</p>
            ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                    {accounts.map((account) => (
                        <TransferAccountOption
                            key={account.id}
                            name={name}
                            account={account}
                            checked={account.id === value}
                            onChange={onChange}
                        />
                    ))}
                </div>
            )}
            {error ? (
                <p id={errorId} className="text-error text-xs">
                    {error}
                </p>
            ) : null}
        </fieldset>
    );
}
