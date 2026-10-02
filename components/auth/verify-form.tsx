"use client";
import { useId, useRef } from "react";
import AuthField from "@/components/auth/auth-field";
import AuthFormError from "@/components/auth/auth-form-error";
import AuthFormFooter from "@/components/auth/auth-form-footer";
import AuthFormHeader from "@/components/auth/auth-form-header";
import AuthSubmit from "@/components/auth/auth-submit";
import CodeField from "@/components/auth/code-field";
import VerifyOptions from "@/components/auth/verify-options";
import { VERIFY_CODE_LENGTH } from "@/lib/auth/constants";
import { usePasskeySupport } from "@/lib/hooks/use-passkey";
import {
    useVerifyFlow,
    type VerifyFlowOptions,
} from "@/lib/hooks/use-verify-flow";
import { VERIFY_COPY, VERIFY_FIELDS } from "@/lib/data/auth/verify";

export default function VerifyForm(props: VerifyFlowOptions) {
    const errorRef = useRef<HTMLParagraphElement>(null);
    const flow = useVerifyFlow(props, errorRef);
    const passkeySupported = usePasskeySupport();
    const baseId = useId();
    const errorId = `${baseId}-error`;
    const { method, message, note, busy } = flow;

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                flow.submit();
            }}
            noValidate
            aria-describedby={message ? errorId : undefined}
            className="short:gap-6 flex flex-col gap-8"
        >
            <AuthFormHeader
                eyebrow={VERIFY_COPY.eyebrow}
                title={VERIFY_COPY.title}
                lead={VERIFY_COPY.lead[method]}
            />
            <AuthFormError ref={errorRef} id={errorId} message={message} />
            <p
                role="status"
                className={note ? "text-text-secondary text-sm" : "sr-only"}
            >
                {note ?? ""}
            </p>
            {method === "code" ? (
                <CodeField
                    id={`${baseId}-code`}
                    {...VERIFY_FIELDS.code}
                    length={VERIFY_CODE_LENGTH}
                    value={flow.code}
                    onChange={(event) =>
                        flow.setCode(event.target.value.replace(/\D/g, ""))
                    }
                    readOnly={busy}
                    invalid={message !== null}
                />
            ) : (
                <AuthField
                    id={`${baseId}-recovery`}
                    {...VERIFY_FIELDS.recovery}
                    value={flow.code}
                    onChange={(event) => flow.setCode(event.target.value)}
                    readOnly={busy}
                    invalid={message !== null}
                    autoFocus
                />
            )}
            <AuthSubmit
                pending={flow.verifying}
                label={VERIFY_COPY.submit}
                pendingLabel={VERIFY_COPY.pending}
            />
            <VerifyOptions
                method={method}
                busy={busy}
                passkey={{
                    supported: passkeySupported,
                    pending: flow.passkeyPending,
                    onUse: flow.startPasskey,
                }}
                resend={{ ready: flow.resendReady, onSend: flow.sendCode }}
                onSwitch={flow.switchMethod}
            />
            <AuthFormFooter {...VERIFY_COPY.cancel} />
        </form>
    );
}
