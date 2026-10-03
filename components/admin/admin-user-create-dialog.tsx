"use client";
import { nanoid } from "nanoid";
import { useRef, useState, type FormEvent } from "react";
import AdminUserCreateFields from "@/components/admin/admin-user-create-fields";
import WriteStatus from "@/components/common/write-status";
import Button from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";
import { ADMIN_USERS_COPY } from "@/lib/data/admin/users";
import { useCreateUser } from "@/lib/hooks/use-create-user";
import { useOnline } from "@/lib/hooks/use-online";
import type { AdminUser, CreateUserField, CreateUserForm } from "@/lib/types";
import { createUserFormSchema } from "@/lib/validations/admin-users";

interface Props {
    onClose: () => void;
    onCreated: (user: AdminUser) => void;
}

const COPY = ADMIN_USERS_COPY.dialog;

const EMPTY: CreateUserForm = {
    fullName: "",
    email: "",
    password: "",
    role: "USER",
};

export default function AdminUserCreateDialog({ onClose, onCreated }: Props) {
    const online = useOnline();
    const create = useCreateUser();
    const form = useRef<HTMLFormElement>(null);
    const [values, setValues] = useState(EMPTY);
    const [idempotencyKey, setIdempotencyKey] = useState(() => nanoid());
    const [rejected, setRejected] = useState<readonly CreateUserField[]>([]);
    const [discarding, setDiscarding] = useState(false);
    const dirty =
        values.fullName !== "" || values.email !== "" || values.password !== "";
    const conflict = create.error?.kind === "conflict";
    const refused = create.error?.kind === "validation";

    const focusInvalid = () =>
        requestAnimationFrame(() =>
            form.current
                ?.querySelector<HTMLElement>("[aria-invalid='true']")
                ?.focus(),
        );

    const change = (field: CreateUserField, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setIdempotencyKey(nanoid());
        create.reset();
    };

    const cancel = () => {
        if (create.isPending) return;
        if (dirty) setDiscarding(true);
        else onClose();
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const input = createUserFormSchema.safeParse(values);
        setRejected(
            input.success
                ? []
                : input.error.issues.map(
                      (issue) => issue.path[0] as CreateUserField,
                  ),
        );
        if (!input.success) return void focusInvalid();

        create.mutate(
            { input: input.data, idempotencyKey },
            { onSuccess: ({ data }) => onCreated(data), onError: focusInvalid },
        );
    };

    const errors: Partial<Record<CreateUserField, string>> = {
        ...Object.fromEntries(
            rejected.map((field) => [field, COPY.errors[field]]),
        ),
        ...(conflict ? { email: COPY.errors.duplicate } : {}),
    };

    return (
        <Dialog title={COPY.title} description={COPY.lead} onCancel={cancel}>
            <form
                ref={form}
                onSubmit={submit}
                noValidate
                aria-busy={create.isPending}
                className="flex flex-col gap-4"
            >
                <AdminUserCreateFields
                    values={values}
                    errors={errors}
                    readOnly={create.isPending}
                    onChange={change}
                />
                <WriteStatus
                    notice={null}
                    error={conflict ? null : create.error}
                    message={refused ? COPY.errors.refused : undefined}
                />
                {online ? null : (
                    <p className="text-warning text-sm">
                        {ADMIN_USERS_COPY.offline}
                    </p>
                )}
                {discarding ? (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <p className="text-text mr-auto text-sm">
                            {COPY.discard.prompt}
                        </p>
                        <Button
                            tone="quiet"
                            size="lg"
                            autoFocus
                            onClick={() => setDiscarding(false)}
                        >
                            {COPY.discard.keep}
                        </Button>
                        <Button tone="danger" size="lg" onClick={onClose}>
                            {COPY.discard.confirm}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button
                            tone="ghost"
                            size="lg"
                            disabled={create.isPending}
                            onClick={cancel}
                        >
                            {COPY.cancel}
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            isLoading={create.isPending}
                            disabled={create.isPending || !online}
                        >
                            {COPY.submit}
                        </Button>
                    </div>
                )}
            </form>
        </Dialog>
    );
}
