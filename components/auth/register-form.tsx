"use client";
import { useRouter } from "next/navigation";
import {
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import AuthField from "@/components/auth/auth-field";
import AuthFormError from "@/components/auth/auth-form-error";
import AuthFormFooter from "@/components/auth/auth-form-footer";
import AuthFormHeader from "@/components/auth/auth-form-header";
import AuthSubmit from "@/components/auth/auth-submit";
import PasswordField from "@/components/auth/password-field";
import { useRegister } from "@/lib/hooks/use-register";
import { statusOf } from "@/lib/utils/http-status";
import { registerSchema } from "@/lib/validations/auth";
import {
    REGISTER_COPY,
    REGISTER_FIELD_ERRORS,
    REGISTER_FIELDS,
    registerMessage,
} from "@/lib/data/auth/register";

interface Props {
    next: string;
}

type FieldName = keyof typeof REGISTER_FIELDS;

const { hint, ...PASSWORD } = REGISTER_FIELDS.password;

export default function RegisterForm({ next }: Props) {
    const router = useRouter();
    const register = useRegister();
    const baseId = useId();
    const errorRef = useRef<HTMLParagraphElement>(null);
    const [values, setValues] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [rejected, setRejected] = useState<readonly FieldName[]>([]);
    const pending = register.isPending;
    const status = register.isError ? statusOf(register.error) : undefined;
    const local = rejected.length > 0;
    const message = local
        ? REGISTER_COPY.checkFields
        : register.isError
          ? registerMessage(status)
          : null;
    const invalid = new Set(
        local
            ? rejected
            : (status !== undefined && REGISTER_FIELD_ERRORS[status]) || [],
    );
    const errorId = `${baseId}-error`;
    const focusError = () =>
        requestAnimationFrame(() => errorRef.current?.focus());

    const update =
        (field: FieldName) => (event: ChangeEvent<HTMLInputElement>) =>
            setValues((current) => ({
                ...current,
                [field]: event.target.value,
            }));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const input = registerSchema.safeParse(values);
        if (!input.success) {
            setRejected(
                input.error.issues.map((issue) => issue.path[0] as FieldName),
            );
            focusError();
            return;
        }
        setRejected([]);
        register.mutate(input.data, {
            onSuccess: () => {
                router.push(next);
                router.refresh();
            },
            onError: focusError,
        });
    };

    const field = (name: FieldName) => ({
        id: `${baseId}-${name}`,
        value: values[name],
        onChange: update(name),
        readOnly: pending,
        invalid: invalid.has(name),
    });

    return (
        <form
            onSubmit={submit}
            noValidate
            aria-describedby={message ? errorId : undefined}
            className="short:gap-6 flex flex-col gap-8"
        >
            <AuthFormHeader
                eyebrow={REGISTER_COPY.eyebrow}
                title={REGISTER_COPY.title}
                lead={REGISTER_COPY.lead}
            />
            <AuthFormError ref={errorRef} id={errorId} message={message} />
            <div className="short:gap-4 flex flex-col gap-5">
                <AuthField
                    {...REGISTER_FIELDS.fullName}
                    {...field("fullName")}
                    autoFocus
                />
                <AuthField {...REGISTER_FIELDS.email} {...field("email")} />
                <PasswordField
                    {...PASSWORD}
                    {...field("password")}
                    hint={hint}
                />
            </div>
            <AuthSubmit
                pending={pending}
                label={REGISTER_COPY.submit}
                pendingLabel={REGISTER_COPY.pending}
            />
            <AuthFormFooter {...REGISTER_COPY.existing} />
        </form>
    );
}
