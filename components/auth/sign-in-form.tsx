"use client";
import Link from "next/link";
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
import { useLogin } from "@/lib/hooks/use-login";
import { statusOf } from "@/lib/utils/http-status";
import {
    CREDENTIAL_ERROR_STATUSES,
    SIGN_IN_COPY,
    SIGN_IN_FIELDS,
    signInMessage,
} from "@/lib/data/auth/sign-in";

interface Props {
    next: string;
}

type FieldName = keyof typeof SIGN_IN_FIELDS;

export default function SignInForm({ next }: Props) {
    const router = useRouter();
    const login = useLogin();
    const baseId = useId();
    const errorRef = useRef<HTMLParagraphElement>(null);
    const [values, setValues] = useState({ email: "", password: "" });
    const pending = login.isPending;
    const status = login.isError ? statusOf(login.error) : undefined;
    const message = login.isError ? signInMessage(status) : null;
    const invalid =
        status !== undefined && CREDENTIAL_ERROR_STATUSES.includes(status);
    const errorId = `${baseId}-error`;

    const update =
        (field: FieldName) => (event: ChangeEvent<HTMLInputElement>) =>
            setValues((current) => ({
                ...current,
                [field]: event.target.value,
            }));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        login.mutate(values, {
            onSuccess: () => {
                router.push(next);
                router.refresh();
            },
            onError: () =>
                requestAnimationFrame(() => errorRef.current?.focus()),
        });
    };

    return (
        <form
            onSubmit={submit}
            noValidate
            aria-describedby={message ? errorId : undefined}
            className="flex flex-col gap-8 short:gap-6"
        >
            <AuthFormHeader
                eyebrow={SIGN_IN_COPY.eyebrow}
                title={SIGN_IN_COPY.title}
                lead={SIGN_IN_COPY.lead}
            />
            <AuthFormError ref={errorRef} id={errorId} message={message} />
            <div className="flex flex-col gap-5 short:gap-4">
                <AuthField
                    id={`${baseId}-email`}
                    {...SIGN_IN_FIELDS.email}
                    value={values.email}
                    onChange={update("email")}
                    readOnly={pending}
                    invalid={invalid}
                    autoFocus
                />
                <PasswordField
                    id={`${baseId}-password`}
                    {...SIGN_IN_FIELDS.password}
                    value={values.password}
                    onChange={update("password")}
                    readOnly={pending}
                    invalid={invalid}
                    action={
                        <Link
                            href={SIGN_IN_COPY.forgot.href}
                            className="text-text-muted hover:text-text text-sm transition-colors"
                        >
                            {SIGN_IN_COPY.forgot.label}
                        </Link>
                    }
                />
            </div>
            <AuthSubmit
                pending={pending}
                label={SIGN_IN_COPY.submit}
                pendingLabel={SIGN_IN_COPY.pending}
            />
            <AuthFormFooter {...SIGN_IN_COPY.create} />
        </form>
    );
}
