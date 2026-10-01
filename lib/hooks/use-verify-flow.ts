import { useRouter } from "next/navigation";
import { useState, type RefObject } from "react";
import { HTTP_STATUS } from "@/lib/constants";
import { AUTH_SHELL_COPY } from "@/lib/data/auth/shell";
import {
    VERIFY_COPY,
    VERIFY_EXPIRED_STATUSES,
    verifyMessage,
} from "@/lib/data/auth/verify";
import { useOnline } from "@/lib/hooks/use-online";
import { usePasskeyAssertion } from "@/lib/hooks/use-passkey";
import {
    useResendCode,
    useResendDelay,
    useVerifyChallenge,
} from "@/lib/hooks/use-verify-challenge";
import type { VerifyMethod, VerifyResult } from "@/lib/types";
import { bodyOf, retryAfterOf, statusOf } from "@/lib/utils/http-status";
import { verifyRefusalSchema, verifySchema } from "@/lib/validations/auth";

export interface VerifyFlowOptions {
    challenge: string;
    next: string;
    onExpired: () => void;
    onLocked: (retryAfter: number | undefined) => void;
    onRecovered: (remaining: number | undefined) => void;
}

export const useVerifyFlow = (
    { challenge, next, onExpired, onLocked, onRecovered }: VerifyFlowOptions,
    errorRef: RefObject<HTMLParagraphElement | null>,
) => {
    const router = useRouter();
    const verify = useVerifyChallenge();
    const resend = useResendCode();
    const passkey = usePasskeyAssertion();
    const online = useOnline();
    const [method, setMethod] = useState<VerifyMethod>("code");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [note, setNote] = useState<string | null>(null);
    const [resendReady, restartResendDelay] = useResendDelay();
    const busy = verify.isPending || resend.isPending || passkey.isPending;

    const report = (text: string) => {
        setNote(null);
        setMessage(text);
        requestAnimationFrame(() => errorRef.current?.focus());
    };

    const fail = (error: unknown) => {
        const status = statusOf(error);
        if (VERIFY_EXPIRED_STATUSES.includes(status ?? 0)) return onExpired();
        if (status === HTTP_STATUS.locked) return onLocked(retryAfterOf(error));
        setCode("");
        report(
            verifyMessage(
                status,
                verifyRefusalSchema.safeParse(bodyOf(error)).data
                    ?.attemptsRemaining,
                retryAfterOf(error),
            ),
        );
    };

    const succeed = (result: VerifyResult, used: VerifyMethod | "passkey") => {
        if (used === "recovery") {
            return onRecovered(result.recoveryCodesRemaining);
        }
        router.push(next);
        router.refresh();
    };

    const begin = () => {
        if (busy) return false;
        if (online) setMessage(null);
        else report(AUTH_SHELL_COPY.offline);
        return online;
    };

    const submit = () => {
        if (!begin()) return;
        const input = verifySchema.safeParse({ method, challenge, code });
        if (!input.success) return report(VERIFY_COPY.invalid[method]);
        verify.mutate(input.data, {
            onSuccess: (result) => succeed(result, method),
            onError: fail,
        });
    };

    const startPasskey = () => {
        if (!begin()) return;
        passkey.mutate(challenge, {
            onSuccess: (assertion) =>
                verify.mutate(
                    { method: "passkey", challenge, assertion },
                    {
                        onSuccess: (result) => succeed(result, "passkey"),
                        onError: fail,
                    },
                ),
            onError: (error) =>
                error instanceof DOMException
                    ? setNote(VERIFY_COPY.passkeyUnused)
                    : fail(error),
        });
    };

    const sendCode = () => {
        if (!begin()) return;
        resend.mutate(challenge, {
            onSuccess: () => {
                restartResendDelay();
                setNote(VERIFY_COPY.resent);
            },
            onError: fail,
        });
    };

    const switchMethod = (to: VerifyMethod) => {
        setMethod(to);
        setCode("");
        setMessage(null);
        setNote(null);
    };

    return {
        method,
        code,
        message,
        note,
        busy,
        verifying: verify.isPending,
        passkeyPending: passkey.isPending,
        resendReady,
        setCode,
        submit,
        startPasskey,
        sendCode,
        switchMethod,
    };
};
