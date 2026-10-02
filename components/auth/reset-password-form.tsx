"use client";
import {
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import AuthAssurance from "@/components/auth/auth-assurance";
import AuthFormError from "@/components/auth/auth-form-error";
import AuthFormHeader from "@/components/auth/auth-form-header";
import AuthSubmit from "@/components/auth/auth-submit";
import PasswordField from "@/components/auth/password-field";
import PasswordRules from "@/components/auth/password-rules";
import { useOnline } from "@/lib/hooks/use-online";
import { useResetPassword } from "@/lib/hooks/use-reset-password";
import { retryAfterOf, statusOf } from "@/lib/utils/http-status";
import { resetFormSchema, resetSchema } from "@/lib/validations/auth";
import {
    RESET_COPY,
    RESET_FIELDS,
    RESET_INVALID_STATUSES,
    resetMessage,
} from "@/lib/data/auth/reset";
import { AUTH_SHELL_COPY } from "@/lib/data/auth/shell";

interface Props {
    token: string;
    onDone: () => void;
    onInvalid: () => void;
}

type FieldName = keyof typeof RESET_FIELDS;

const EMPTY = { password: "", confirm: "" };

export default function ResetPasswordForm({ token, onDone, onInvalid }: Props) {
    const reset = useResetPassword();
    const online = useOnline();
    const baseId = useId();
    const errorRef = useRef<HTMLParagraphElement>(null);
    const [values, setValues] = useState(EMPTY);
    const [rejected, setRejected] = useState<FieldName | "offline" | null>(
        null,
    );
    const pending = reset.isPending;
    const message =
        rejected === "offline"
            ? AUTH_SHELL_COPY.offline
            : rejected
              ? RESET_COPY.fieldErrors[rejected]
              : reset.isError
                ? resetMessage(statusOf(reset.error), retryAfterOf(reset.error))
                : null;
    const errorId = `${baseId}-error`;
    const focusError = () =>
        requestAnimationFrame(() => errorRef.current?.focus());

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (pending) return;
        const input = resetFormSchema.safeParse({ token, ...values });
        if (!online || !input.success) {
            setRejected(
                online
                    ? (input.error?.issues[0].path[0] as FieldName)
                    : "offline",
            );
            focusError();
            return;
        }
        setRejected(null);
        reset.mutate(
            { token, password: input.data.password },
            {
                onSuccess: onDone,
                onError: (error) => {
                    setValues(EMPTY);
                    if (RESET_INVALID_STATUSES.includes(statusOf(error) ?? 0)) {
                        onInvalid();
                    } else focusError();
                },
            },
        );
    };

    const field = (name: FieldName) => ({
        id: `${baseId}-${name}`,
        ...RESET_FIELDS[name],
        value: values[name],
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
            setValues((current) => ({
                ...current,
                [name]: event.target.value,
            })),
        readOnly: pending,
        invalid: rejected === name,
    });

    return (
        <form
            onSubmit={submit}
            noValidate
            aria-describedby={message ? errorId : undefined}
            className="short:gap-6 flex flex-col gap-8"
        >
            <AuthFormHeader
                eyebrow={RESET_COPY.eyebrow}
                title={RESET_COPY.title}
                lead={RESET_COPY.lead}
            />
            <AuthFormError ref={errorRef} id={errorId} message={message} />
            <div className="short:gap-4 flex flex-col gap-5">
                <PasswordField {...field("password")} autoFocus />
                <PasswordField {...field("confirm")} />
                <PasswordRules
                    rules={[
                        {
                            id: "length",
                            label: RESET_COPY.rules.length,
                            met: resetSchema.shape.password.safeParse(
                                values.password,
                            ).success,
                        },
                        {
                            id: "match",
                            label: RESET_COPY.rules.match,
                            met:
                                values.password !== "" &&
                                values.password === values.confirm,
                        },
                    ]}
                />
            </div>
            <AuthSubmit
                pending={pending}
                label={RESET_COPY.submit}
                pendingLabel={RESET_COPY.pending}
            />
            <AuthAssurance text={RESET_COPY.assurance} />
        </form>
    );
}
