"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import AuthField from "@/components/auth/auth-field";
import AuthFormError from "@/components/auth/auth-form-error";
import AuthFormFooter from "@/components/auth/auth-form-footer";
import AuthFormHeader from "@/components/auth/auth-form-header";
import AuthNotice from "@/components/auth/auth-notice";
import AuthSubmit from "@/components/auth/auth-submit";
import { ledgerButtonClass } from "@/components/ledgerline/ledger-button";
import { useOnline } from "@/lib/hooks/use-online";
import { useRequestPasswordReset } from "@/lib/hooks/use-request-password-reset";
import { retryAfterOf, statusOf } from "@/lib/utils/http-status";
import { forgotSchema } from "@/lib/validations/auth";
import {
    FORGOT_COPY,
    FORGOT_FIELDS,
    forgotMessage,
} from "@/lib/data/auth/forgot";
import { AUTH_SHELL_COPY } from "@/lib/data/auth/shell";

export default function ForgotPasswordForm() {
    const request = useRequestPasswordReset();
    const online = useOnline();
    const baseId = useId();
    const errorRef = useRef<HTMLParagraphElement>(null);
    const [email, setEmail] = useState("");
    const [rejected, setRejected] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const pending = request.isPending;
    const message =
        rejected ??
        (request.isError
            ? forgotMessage(
                  statusOf(request.error),
                  retryAfterOf(request.error),
              )
            : null);
    const errorId = `${baseId}-error`;
    const focusError = () =>
        requestAnimationFrame(() => errorRef.current?.focus());

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (pending) return;
        const input = forgotSchema.safeParse({ email });
        if (!online || !input.success) {
            setRejected(online ? FORGOT_COPY.invalid : AUTH_SHELL_COPY.offline);
            focusError();
            return;
        }
        setRejected(null);
        request.mutate(input.data, {
            onSuccess: () => {
                setEmail("");
                setSent(true);
            },
            onError: focusError,
        });
    };

    if (sent) {
        return (
            <AuthNotice {...FORGOT_COPY.sent}>
                <button
                    type="button"
                    onClick={() => setSent(false)}
                    className={ledgerButtonClass(
                        "ghost",
                        "lg",
                        "w-full cursor-pointer",
                    )}
                >
                    {FORGOT_COPY.again}
                </button>
            </AuthNotice>
        );
    }

    return (
        <form
            onSubmit={submit}
            noValidate
            aria-describedby={message ? errorId : undefined}
            className="short:gap-6 flex flex-col gap-8"
        >
            <AuthFormHeader
                eyebrow={FORGOT_COPY.eyebrow}
                title={FORGOT_COPY.title}
                lead={FORGOT_COPY.lead}
            />
            <AuthFormError ref={errorRef} id={errorId} message={message} />
            <AuthField
                id={`${baseId}-email`}
                {...FORGOT_FIELDS.email}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                readOnly={pending}
                invalid={rejected === FORGOT_COPY.invalid}
                autoFocus
            />
            <AuthSubmit
                pending={pending}
                label={FORGOT_COPY.submit}
                pendingLabel={FORGOT_COPY.pending}
            />
            <AuthFormFooter {...FORGOT_COPY.back} />
        </form>
    );
}
