"use client";
import Field from "@/components/ui/field";
import Select from "@/components/ui/select";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import type { TransferAccount } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

interface Props {
    accounts: readonly TransferAccount[];
    value: string;
    error: string | undefined;
    onChange: (accountId: string) => void;
}

const COPY = TRANSFER_COPY.option;

export default function TransferSourceField({
    accounts,
    value,
    error,
    onChange,
}: Props) {
    return (
        <Field label={TRANSFER_COPY.form.from} error={error}>
            {(control) => (
                <Select
                    {...control}
                    name="from"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                >
                    {accounts.map((account) =>
                        account.state === "OPEN" ? (
                            <option key={account.id} value={account.id}>
                                {COPY.account(
                                    account.name,
                                    account.last4,
                                    formatMoney(
                                        account.availableMinor,
                                        account.currency,
                                    ) ?? "",
                                )}
                            </option>
                        ) : (
                            <option
                                key={account.id}
                                value={account.id}
                                disabled
                            >
                                {COPY.unavailable(
                                    account.name,
                                    account.last4,
                                    COPY.states[account.state],
                                )}
                            </option>
                        ),
                    )}
                </Select>
            )}
        </Field>
    );
}
