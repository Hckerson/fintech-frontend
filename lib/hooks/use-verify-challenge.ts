import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { local } from "@/lib/api-client";
import { apiRoutes } from "@/lib/api-routes";
import { CODE_RESEND_DELAY_SECONDS } from "@/lib/auth/constants";
import type { VerifyResult } from "@/lib/types";
import type { VerifyValues } from "@/lib/validations/auth";

export const useVerifyChallenge = () =>
    useMutation({
        mutationFn: (input: VerifyValues) =>
            local.post<VerifyResult>(apiRoutes.challenge(), input),
    });

export const useResendCode = () =>
    useMutation({
        mutationFn: (challenge: string) =>
            local.post<unknown>(apiRoutes.challengeResend(), { challenge }),
    });

const TICK_MS = 1_000;

export const useResendDelay = () => {
    const [wait, setWait] = useState(CODE_RESEND_DELAY_SECONDS);

    useEffect(() => {
        if (wait === 0) return;
        const timer = setTimeout(() => setWait((left) => left - 1), TICK_MS);
        return () => clearTimeout(timer);
    }, [wait]);

    return [wait, () => setWait(CODE_RESEND_DELAY_SECONDS)] as const;
};
