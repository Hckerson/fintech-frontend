"use client";
import { nanoid } from "nanoid";
import { useState } from "react";
import PayeeDigitsField from "@/components/payments/payee-digits-field";
import PayeeFormDialog from "@/components/payments/payee-form-dialog";
import Field from "@/components/ui/field";
import TextInput from "@/components/ui/text-input";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { useCreatePayee } from "@/lib/hooks/use-create-payee";
import { useProtectedWrite } from "@/lib/hooks/use-protected-write";
import { PAYEE_FIELDS, PAYEE_REFUSAL } from "@/lib/payments/constants";
import type { Payee, PayeeField, PayeeInput } from "@/lib/types";
import { payeeInputSchema } from "@/lib/validations/payees";

interface Props {
    onClose: () => void;
    onAdded: (payee: Payee) => void;
}

const DIGIT_FIELDS = ["sortCode", "accountNumber"] as const;

const EMPTY: PayeeInput = { name: "", sortCode: "", accountNumber: "" };

export default function PayeeAddDialog({ onClose, onAdded }: Props) {
    const write = useProtectedWrite(useCreatePayee());
    const [values, setValues] = useState(EMPTY);
    const [idempotencyKey, setIdempotencyKey] = useState(() => nanoid());
    const [rejected, setRejected] = useState<readonly PayeeField[]>([]);
    const duplicate =
        write.error?.code === PAYEE_REFUSAL.duplicate
            ? write.error.message
            : undefined;

    const change = (field: PayeeField, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setIdempotencyKey(nanoid());
        write.reset();
    };

    const submit = () => {
        const input = payeeInputSchema.safeParse(values);
        setRejected(
            input.success
                ? []
                : input.error.issues.map(
                      (issue) => issue.path[0] as PayeeField,
                  ),
        );
        if (input.success) {
            write.submit({ input: input.data, idempotencyKey }, onAdded);
        }
    };

    const errorOf = (field: PayeeField) =>
        rejected.includes(field)
            ? PAYEE_COPY.fieldErrors[field]
            : field === "accountNumber"
              ? duplicate
              : undefined;

    return (
        <PayeeFormDialog
            title={PAYEE_COPY.addDialog.title}
            description={PAYEE_COPY.addDialog.lead}
            submitLabel={PAYEE_COPY.addDialog.submit}
            purpose="payee_add"
            dirty={PAYEE_FIELDS.some((field) => values[field] !== "")}
            write={write}
            fieldError={Boolean(duplicate)}
            onSubmit={submit}
            onClose={onClose}
        >
            <Field
                label={PAYEE_COPY.fields.name.label}
                hint={errorOf("name") ? undefined : PAYEE_COPY.fields.name.hint}
                error={errorOf("name")}
            >
                {(control) => (
                    <TextInput
                        {...control}
                        name="name"
                        autoComplete="off"
                        value={values.name}
                        onChange={(event) => change("name", event.target.value)}
                        readOnly={write.pending}
                    />
                )}
            </Field>
            <div className="grid grid-cols-[2fr_3fr] items-start gap-3">
                {DIGIT_FIELDS.map((field) => (
                    <PayeeDigitsField
                        key={field}
                        {...PAYEE_COPY.fields[field]}
                        name={field}
                        error={errorOf(field)}
                        value={values[field]}
                        readOnly={write.pending}
                        onChange={(value) => change(field, value)}
                    />
                ))}
            </div>
        </PayeeFormDialog>
    );
}
