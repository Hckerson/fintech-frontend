"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, WarningAlt } from "@carbon/icons-react";
import TransferAmountField from "@/components/payments/transfer-amount-field";
import TransferDestinationField from "@/components/payments/transfer-destination-field";
import TransferSourceField from "@/components/payments/transfer-source-field";
import Button from "@/components/ui/button";
import Field from "@/components/ui/field";
import TextInput from "@/components/ui/text-input";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import { TRANSFER_MEMO_MAX } from "@/lib/payments/transfer-constants";
import type {
    Payee,
    TransferCheck,
    TransferDraft,
    TransferField,
    TransferOptions,
} from "@/lib/types";

interface Props {
    draft: TransferDraft;
    options: TransferOptions;
    payees: readonly Payee[];
    check: TransferCheck;
    changed: boolean;
    onChange: (patch: Partial<TransferDraft>) => void;
    onReview: () => void;
}

const COPY = TRANSFER_COPY.form;

export default function TransferForm({
    draft,
    options,
    payees,
    check,
    changed,
    onChange,
    onReview,
}: Props) {
    const form = useRef<HTMLFormElement>(null);
    const [attempted, setAttempted] = useState(false);
    const errorOf = (field: TransferField) => {
        const issue = (attempted || changed) && check.issues[field];
        return issue ? TRANSFER_COPY.issues[issue] : undefined;
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        setAttempted(true);
        if (check.review) return onReview();
        requestAnimationFrame(() =>
            form.current
                ?.querySelector<HTMLElement>("[aria-invalid='true']")
                ?.focus(),
        );
    };

    return (
        <form
            ref={form}
            onSubmit={submit}
            noValidate
            aria-label={COPY.title}
            className="surface-card flex min-w-0 flex-col gap-4 p-4"
        >
            <h2 className="text-text text-sm font-medium">{COPY.title}</h2>
            {changed ? (
                <p
                    role="alert"
                    className="border-warning/30 text-warning flex items-start gap-2 rounded-lg border px-3 py-2 text-sm"
                >
                    <WarningAlt
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0"
                    />
                    {TRANSFER_COPY.review.changed}
                </p>
            ) : null}
            <TransferSourceField
                accounts={options.accounts}
                value={draft.fromAccountId}
                error={errorOf("from")}
                onChange={(fromAccountId) => onChange({ fromAccountId })}
            />
            <TransferDestinationField
                draft={draft}
                accounts={options.accounts}
                payees={payees}
                error={errorOf("to")}
                onChange={onChange}
            />
            <TransferAmountField
                source={options.accounts.find(
                    ({ id }) => id === draft.fromAccountId,
                )}
                value={draft.amount}
                error={errorOf("amount")}
                onChange={(amount) => onChange({ amount })}
            />
            <Field
                label={COPY.memo}
                hint={errorOf("memo") ? undefined : COPY.memoHint}
                error={errorOf("memo")}
            >
                {(control) => (
                    <TextInput
                        {...control}
                        name="memo"
                        autoComplete="off"
                        maxLength={TRANSFER_MEMO_MAX}
                        value={draft.memo}
                        onChange={(event) =>
                            onChange({ memo: event.target.value })
                        }
                    />
                )}
            </Field>
            <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="text-text-muted text-xs">{COPY.nothingSent}</p>
                <Button type="submit" size="lg">
                    {COPY.continue}
                    <ArrowRight aria-hidden className="size-4 shrink-0" />
                </Button>
            </div>
        </form>
    );
}
