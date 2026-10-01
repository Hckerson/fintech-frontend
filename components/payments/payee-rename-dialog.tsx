"use client";
import { useState } from "react";
import PayeeFormDialog from "@/components/payments/payee-form-dialog";
import Field from "@/components/ui/field";
import TextInput from "@/components/ui/text-input";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { useProtectedWrite } from "@/lib/hooks/use-protected-write";
import { useRenamePayee } from "@/lib/hooks/use-rename-payee";
import type { Payee } from "@/lib/types";
import { payeeRenameSchema } from "@/lib/validations/payees";

interface Props {
    payee: Payee;
    current: Payee | undefined;
    onClose: () => void;
    onRenamed: (from: string, payee: Payee) => void;
}

export default function PayeeRenameDialog({
    payee,
    current,
    onClose,
    onRenamed,
}: Props) {
    const write = useProtectedWrite(useRenamePayee());
    const [name, setName] = useState(payee.name);
    const [invalid, setInvalid] = useState(false);
    const kind = write.error?.kind;
    const stale = kind === "conflict" && current !== undefined;
    const gone = kind === "not_found" || (kind === "conflict" && !current);

    const submit = () => {
        const input = payeeRenameSchema.safeParse({
            id: payee.id,
            name,
            updatedAt: (stale ? current : payee).updatedAt,
        });
        setInvalid(!input.success);
        if (input.success) {
            write.submit(input.data, (renamed) =>
                onRenamed(payee.name, renamed),
            );
        }
    };

    return (
        <PayeeFormDialog
            title={PAYEE_COPY.renameDialog.title}
            description={PAYEE_COPY.renameDialog.lead(
                PAYEE_COPY.destinationSpoken(payee.destinationLast4),
            )}
            submitLabel={PAYEE_COPY.renameDialog.submit}
            purpose="payee_rename"
            dirty={name !== payee.name}
            write={write}
            message={
                stale
                    ? PAYEE_COPY.renameConflict(current.name)
                    : gone
                      ? PAYEE_COPY.gone
                      : undefined
            }
            onSubmit={submit}
            onClose={onClose}
        >
            <Field
                {...PAYEE_COPY.fields.name}
                error={invalid ? PAYEE_COPY.fieldErrors.name : undefined}
            >
                {(control) => (
                    <TextInput
                        {...control}
                        name="name"
                        autoComplete="off"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        readOnly={write.pending}
                    />
                )}
            </Field>
        </PayeeFormDialog>
    );
}
