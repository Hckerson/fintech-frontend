"use client";
import { useId } from "react";
import Field from "@/components/ui/field";
import Select from "@/components/ui/select";
import Tabs from "@/components/ui/tabs";
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
    const toPayee = draft.kind === "payee";
    const choices = toPayee
        ? payees.map(({ id, name, destinationLast4 }) => ({
              id,
              label: TRANSFER_COPY.option.payee(name, destinationLast4),
          }))
        : accounts
              .filter(
                  ({ id, state }) =>
                      id !== draft.fromAccountId && state !== "CLOSED",
              )
              .map(({ id, name, last4, currency }) => ({
                  id,
                  label: `${TRANSFER_COPY.option.payee(name, last4)} · ${currency}`,
              }));

    return (
        <div id={panelId} className="flex flex-col gap-2">
            <Field label={COPY.to} error={error}>
                {(control) => (
                    <div className="flex flex-col gap-2">
                        <div className="flex">
                            <Tabs
                                label={COPY.destinationLabel}
                                tabs={COPY.destinations}
                                value={draft.kind}
                                onChange={(kind) => onChange({ kind })}
                                panelId={panelId}
                            />
                        </div>
                        <Select
                            {...control}
                            name="to"
                            value={toPayee ? draft.payeeId : draft.accountId}
                            onChange={(event) =>
                                onChange(
                                    toPayee
                                        ? { payeeId: event.target.value }
                                        : { accountId: event.target.value },
                                )
                            }
                        >
                            <option value="">
                                {toPayee
                                    ? COPY.payeePlaceholder
                                    : COPY.accountPlaceholder}
                            </option>
                            {choices.map(({ id, label }) => (
                                <option key={id} value={id}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </div>
                )}
            </Field>
        </div>
    );
}
