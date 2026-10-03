"use client";
import { useId } from "react";
import TransferAccountPicker from "@/components/payments/transfer-account-picker";
import Avatar from "@/components/ui/avatar";
import Combobox from "@/components/ui/combobox";
import Field from "@/components/ui/field";
import Tabs from "@/components/ui/tabs";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import type { Payee, TransferAccount, TransferDraft } from "@/lib/types";

interface Props {
    draft: TransferDraft;
    accounts: readonly TransferAccount[];
    payees: readonly Payee[];
    error: string | undefined;
    onChange: (patch: Partial<TransferDraft>) => void;
}

const COPY = TRANSFER_COPY.form;

export default function TransferDestinationField({
    draft,
    accounts,
    payees,
    error,
    onChange,
}: Props) {
    const panelId = useId();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span aria-hidden className="text-text text-sm font-medium">
                    {COPY.to}
                </span>
                <Tabs
                    label={COPY.destinationLabel}
                    tabs={COPY.destinations}
                    value={draft.kind}
                    onChange={(kind) => onChange({ kind })}
                    panelId={panelId}
                />
            </div>
            <div id={panelId} role="tabpanel">
                {draft.kind === "payee" ? (
                    <Field label={COPY.payeeLabel} error={error}>
                        {(control) => (
                            <Combobox
                                {...control}
                                value={draft.payeeId}
                                placeholder={COPY.payeePlaceholder}
                                searchPlaceholder={COPY.searchPayees}
                                emptyText={COPY.noPayee}
                                onChange={(payeeId) => onChange({ payeeId })}
                                options={payees.map((payee) => ({
                                    id: payee.id,
                                    label: payee.name,
                                    detail: `${payee.bankName ?? PAYEE_COPY.bankUnknown} · ••${payee.destinationLast4}`,
                                    leading: (
                                        <Avatar
                                            name={payee.name}
                                            className="size-8"
                                        />
                                    ),
                                }))}
                            />
                        )}
                    </Field>
                ) : (
                    <TransferAccountPicker
                        legend={COPY.accountLabel}
                        name="to"
                        accounts={accounts.filter(
                            ({ id, state }) =>
                                id !== draft.fromAccountId &&
                                state !== "CLOSED",
                        )}
                        value={draft.accountId}
                        error={error}
                        emptyText={COPY.noOtherAccount}
                        onChange={(accountId) => onChange({ accountId })}
                    />
                )}
            </div>
        </div>
    );
}
